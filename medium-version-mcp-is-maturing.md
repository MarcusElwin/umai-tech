# MCP Is Maturing — And Here's What You Need to Know

*MCP's 2026-07-28 spec goes stateless — killing the session handshake, sticky pods and long-lived SSE. What that unlocks for agentic e-commerce checkout.*

If you have ever deployed a Model Context Protocol server on Kubernetes, you know the dirty secret that never made it into the quickstart: the moment you scaled past one pod, everything quietly broke. A client would `initialize` against pod A, get load-balanced to pod B on the very next request — and pod B had never heard of it. So we did what tired platform engineers always do. We reached for sticky sessions and pinned every client to a pod like a butterfly to a corkboard.

The **2026-07-28 release candidate** finally makes that hack unnecessary. And I think that is a much bigger deal than "one more spec revision" makes it sound — especially if, like me, you care about **agentic commerce**, where the thing on the other end of that socket is trying to spend real money.

> **AAIF Ambassador Disclosure**
> 
> I'm a 2026 **Agentic AI Foundation (AAIF) Ambassador**. This post is an independent contribution — the opinions, mistakes, and hot takes are entirely my own, not the Foundation's.

I've written about the "Lego pieces" of agentic commerce before — MCP, ACP, UCP, AP2, and how they either snap together or fragment into incompatible silos. This post zooms into one brick, MCP, at the exact moment it grew up.

## The 2026 Spec Dropped, and It Threw Out the Handshake

Let's start with what actually changed. The headline of the 2026-07-28 spec is a **stateless core**, and almost everything good downstream flows from that single decision.

The old `initialize` / `initialized` handshake is gone. So is the `Mcp-Session-Id` header. Instead, protocol version, client info, and capabilities ride in `_meta` on **every** request, and a new `server/discover` method fetches capabilities on demand. Each request is now self-contained — no session to set up, no session to remember.

That is the load-bearing change. But it arrived with a cluster of friends that read less like a changelog and more like a requirements doc for commerce:

- **Auth hardening + step-up authentication** — six SEPs align MCP with OAuth 2.0 / OpenID Connect, including mandatory `iss` validation and clarified step-up flows.
- **Elicitation without persistent streams** — server-to-client questions now use a multi-round-trip pattern (`InputRequiredResult` + a `requestState` blob) instead of a long-lived SSE stream.
- **Tasks extension** — long-running work (think order fulfillment) returns a task handle the client polls, rather than blocking a connection.
- **Routing headers** — `Mcp-Method` and `Mcp-Name` travel as HTTP headers, so infrastructure can route without cracking open the body.
- **Full JSON Schema 2020-12** for tool schemas, and **MCP Apps** for sandboxed interactive UIs.

> **The Core Insight**
> 
> MCP just deleted its own session. Every operational win in this post — round-robin load balancing, painless autoscaling, header-based routing — is a second-order effect of that one deletion.

> *"The release candidate that removes the handshake, drops `Mcp-Session-Id`, and moves per-request context into `_meta`."*
> 
> — [MCP Specification — 2026-07-28 Release Candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

Why do I keep dragging commerce into a spec discussion? Because the two protocols an agentic checkout has to interoperate with — **ACP** (OpenAI + Stripe) and **UCP** (Google, Shopify, and ~20 partners) — are already stateless REST and JSON-RPC. Until now, MCP was the odd one out, the brick with a different stud pattern. Statelessness makes it snap into the same baseplate.

## The Old Way: Why One Header Held Your Whole Cluster Hostage

To appreciate the fix, you have to feel the old pain. Under the previous **Streamable HTTP** transport, two things pinned a client to a single pod:

1. **Per-session server state**, keyed by `Mcp-Session-Id`, living in one process's memory.
2. **A long-lived SSE stream** — the server-to-client channel — physically held open on that one pod.

Lose the pin, and the client's next request lands on a pod that has neither its session nor its stream. So affinity wasn't a nice-to-have you could tune away. It was mandatory. Here is what that actually looked like in front of the cluster:

![Diagram 1](https://umai-tech.com/images/blog/mcp-is-maturing-and-heres-what-you-need-to-know/medium/diagram-1.png)

On Kubernetes with Contour (the Envoy-based ingress), you bought that pin with request-header hashing — and then fought Envoy to stop it from reaping your long-lived SSE streams:

```yaml
apiVersion: projectcontour.io/v1
kind: HTTPProxy
metadata:
  name: mcp-server
spec:
  virtualhost:
    fqdn: mcp.example.com
  routes:
    - conditions:
        - prefix: /mcp
      services:
        - name: mcp-server
          port: 8080
      # Pin each client to one pod: its session state and open SSE
      # stream both live there. Hash on the session header so the same
      # client always lands on the same backend.
      loadBalancerPolicy:
        strategy: RequestHash
        requestHashPolicies:
          - headerHashOptions:
              headerName: Mcp-Session-Id
            terminal: true
      # SSE is long-lived — without this, Envoy times the stream out.
      timeoutPolicy:
        response: infinity
        idle: 1h
```

> **Why Affinity Was Mandatory**
> 
> This was never a preference. With per-session state **and** an open stream both living on one instance, any load balancer that didn't pin the client would hand it to a pod that had no idea who it was. Rolling deploys became risky, autoscaling was awkward, and a single hot client could hammer one pod while the others sat idle.

If you have ever tuned an idle timeout to `1h` and still watched streams die during a deploy, this section is for you. It was death by a thousand sticky cuts.

## The New Way: Round-Robin Like It's 2010 Again

Now the fun part. With a stateless core, there is no session to pin and no stream to keep alive. Any pod can answer any request. So the load balancer goes back to being boring — and boring, in infrastructure, is a compliment.

![Diagram 2](https://umai-tech.com/images/blog/mcp-is-maturing-and-heres-what-you-need-to-know/medium/diagram-2.png)

Better still, because `Mcp-Method` and `Mcp-Name` now ride as headers, the ingress can route by capability without inspecting the body — for example, sending long-running `tasks/*` calls to their own pool while everything else round-robins across the general fleet. No hashing, no cookies, no affinity:

```yaml
apiVersion: projectcontour.io/v1
kind: HTTPProxy
metadata:
  name: mcp-server
spec:
  virtualhost:
    fqdn: mcp.example.com
  routes:
    # Long-running Tasks calls -> dedicated pool, routed purely by header.
    - conditions:
        - prefix: /mcp
        - header:
            name: Mcp-Method
            contains: tasks/
      services:
        - name: mcp-tasks
          port: 8080
      loadBalancerPolicy:
        strategy: RoundRobin
    # Everything else -> any pod, round-robin. No stickiness.
    - conditions:
        - prefix: /mcp
      services:
        - name: mcp-server
          port: 8080
      loadBalancerPolicy:
        strategy: RoundRobin
```

The difference is not cosmetic. It changes how the whole system scales and deploys:

**Old MCP vs New MCP**

| Dimension | Old (Streamable HTTP + Session-Id) | New (Stateless, 2026-07-28) |
| --- | --- | --- |
| Session model | `initialize` handshake + `Mcp-Session-Id` | None — context in `_meta` per request |
| Server-to-client | Long-lived SSE stream | Multi-round-trip elicitation |
| Load balancer | **Sticky sessions required** | Plain round-robin |
| Discovery | Capabilities from handshake | On-demand `server/discover` |
| Auth / payments | Ad-hoc, app-level | OAuth/OIDC + step-up auth |
| Async work | Block the connection | Tasks extension (poll a handle) |
| Routing | Body inspection | Header-based (`Mcp-Method` / `Mcp-Name`) |
| Horizontal scaling | Awkward, affinity-bound | Trivial — scale like a web server |

> **What Stateless Buys You**
> 
> Round-robin across interchangeable pods. Rolling deploys that don't sever anyone's stream, because there is no stream to sever. Autoscaling that actually tracks load. You stopped operating a stateful protocol and started operating a plain HTTP service — the kind we already know how to run well.

## I Built the Bridge: `mcp-commerce-bridge`

Specs are abstract, so I built something concrete to pressure-test the claim. `mcp-commerce-bridge` is a small, stateless MCP server that fronts my demo shop, **hoodtopia.co**, and translates between the three protocols agents actually speak: **MCP**, **ACP** (OpenAI/Stripe), and **UCP** (Google/Shopify). It reads a real Google Shopping feed — 288 variants across six hoodie styles — maps it into one internal model, and renders it into whichever protocol the caller wants.

![Diagram 3](https://umai-tech.com/images/blog/mcp-is-maturing-and-heres-what-you-need-to-know/medium/diagram-3.png)

The interesting part is the checkout path — it exercises three of the new spec's features in one flow. Rather than hand-wave it, let's walk the actual output of the repo's `./scripts/smoke.sh`, which drives all three protocols against the live feed and pipes the JSON through `jq`. Follow along: `cargo run` in one shell, `./scripts/smoke.sh` in another.

### Discovery and search (MCP)

There's no handshake to perform anymore. A client simply asks what the server can do with `server/discover`, then searches. The catalog is hoodtopia's real Google Shopping feed — 288 variants — mapped into one internal model and enriched on the way out (note the generated `description`):

```bash
$ ./scripts/smoke.sh
== 1. server/discover ==
[
  {
    "description": "Search the hoodtopia catalog.",
    "inputSchema": {
      "properties": { "q": { "type": "string" } },
      "type": "object"
    },
    "name": "search_products"
  },
  {
    "description": "Confirm and place an order (requires step-up auth).",
    "inputSchema": {
      "properties": {
        "product_id": { "type": "string" },
        "size": { "enum": ["XS", "S", "M", "L", "XL", "XXL"] }
      },
      "required": ["product_id"],
      "type": "object"
    },
    "name": "checkout"
  }
]
== 2. search_products q=tech (48 variants — summary) ==
{
  "count": 48,
  "first": {
    "available": true,
    "color": "Black",
    "currency": "SEK",
    "description": "Tech Fleece Pro (performance) in Black — soft, considered colour, everyday fit.",
    "group_id": "prod_01KT6PTKEVFFBTDYES6W1KKRP7",
    "id": "TEC-BLA-XS",
    "image": "https://hoodtopia.co/images/products/tech-fleece-pro-black.jpg",
    "price_cents": 7199,
    "product_type": "performance",
    "size": "XS",
    "title": "Tech Fleece Pro",
    "url": "https://hoodtopia.co/products/tech-fleece-pro"
  }
}
```

### Checkout, part 1 — ask the human (elicitation)

When an agent calls `checkout`, the bridge doesn't just charge a card. It returns an `inputRequired` result — the spec's elicitation — asking a person to confirm the exact item and price. The whole cart rides in `requestState` (base64 here), so **any** stateless pod can resume the flow when the answer comes back; no session, no affinity:

```bash
== 3. checkout -> elicitation (confirm) ==
{
  "inputRequests": {
    "confirm": {
      "message": "Confirm 1x Tech Fleece Pro (Black / L) — 71.99 SEK (free shipping)?",
      "schema": { "type": "boolean" },
      "type": "elicitation"
    }
  },
  "requestState": "eyJjb2xvciI6IkJsYWNrIiwiY3VycmVuY3kiOiJTRUsi...",
  "resultType": "inputRequired"
}
```

### Checkout, part 2 — no scope, no charge (step-up auth)

The agent re-issues the call with the confirmation. But paying is privileged, so the bridge demands a fresh payment-scoped token via step-up auth. Without it, the order is refused with `-32001` — trust enforced by the protocol, not buried in application code:

```bash
== 4. confirm WITHOUT payment scope -> step-up required ==
{
  "error": {
    "code": -32001,
    "message": "step-up authentication required (payment scope)"
  }
}
```

### Checkout, part 3 — hand back a Task

With a payment-scoped token the charge goes through, and fulfillment becomes a **Task**: the bridge returns a handle (echoing the decoded order) that the agent polls with `tasks/get`. Long-running work, no blocked connection, resumable on any instance:

```bash
== 5. confirm WITH payment scope -> task handle ==
{
  "resultType": "task",
  "task": {
    "id": "task_order_8f21",
    "order": {
      "color": "Black",
      "currency": "SEK",
      "price_cents": 7199,
      "product_id": "TEC-BLA-L",
      "size": "L",
      "title": "Tech Fleece Pro"
    },
    "status": "working"
  }
}
```

### The same catalog, now over ACP

Same internal model, different façade. Over **ACP** (OpenAI/Stripe) the bridge exports the catalog as a product feed and runs the five-call checkout session — here a session is created and completed with a (demo) Shared Payment Token:

```bash
== 6. ACP product feed (first line) ==
{
  "availability": "in_stock",
  "id": "CLA-BLA-XS",
  "item_group_id": "prod_01KT6PTKET5MAFGWRP5E1ZM1F4",
  "title": "Classic Comfort Hoodie",
  "price": "47.99 SEK",
  "color": "Black",
  "size": "XS",
  "link": "https://hoodtopia.co/products/classic-comfort-hoodie"
}
== 7. ACP create + complete checkout session ==
{
  "id": "cs_000001",
  "payment": { "captured": true, "method": "shared_payment_token (demo)" },
  "status": "completed"
}
```

### …and over UCP

And over **UCP** (Google/Shopify) the same catalog answers JSON-RPC. One backend, three protocols — write the mapping once, and every agent reads from it whichever brick it's built on:

```bash
== 8. UCP catalog.search (JSON-RPC) ==
{
  "count": 48,
  "first": {
    "id": "PRE-BLA-XS",
    "title": "Premium Zip-Up",
    "product_type": "premium",
    "color": "Black",
    "price_cents": 7999,
    "currency": "SEK"
  }
}
```

> **Repo Status**
> 
> `mcp-commerce-bridge` is currently a **private** repo while I clean it up. The plan is a public release with three packages sharing one mapping contract — a Rust crate, a Python package (PyPI), and a TypeScript package (npm) — so the translation layer is usable wherever you already are. Ping me if you want early access.

The lesson I took from building it: **the interop layer is the product, not any single SDK**. One mapping contract, three languages, three protocols. Write the translation once; let every agent — whichever brick it's built from — read from it.

## What This Means When Real Money Moves

Here's why I don't think this is just plumbing. Agentic commerce has been waiting on exactly these primitives, and the spec just made them native instead of bolted-on.

**Implications by Domain**

| Concern | Old Pain | New Capability |
| --- | --- | --- |
| Payment authorization | Home-grown token juggling in app code | Step-up auth as a protocol primitive |
| Human-in-the-loop | Hold a socket open to ask a question | Elicitation with state in `requestState` |
| Multi-protocol interop | MCP was the stateful odd-one-out | Snaps into stateless ACP / UCP / AP2 |
| Scaling economics | Affinity-bound, hot pods, wasted capacity | Round-robin + autoscale to demand |
| Regulated-domain audit | Trust logic scattered across services | Explicit auth + consent in the request path |

> **Trust Is Now a Protocol Feature**
> 
> This matters most in domains where mistakes cost money or compliance — commerce, fintech, anything regulated. Step-up auth and human-in-the-loop confirmation move **trust out of ad-hoc application code and into the spec itself**. When an agent spends on your behalf, "who authorized this, and did a human confirm it?" becomes an answerable, auditable question by design.

> *"Product feed plus a five-call checkout session; the ACP side of the bridge."*
> 
> — [Agentic Commerce Protocol (ACP) — OpenAI + Stripe](https://www.agenticcommerce.dev/)

> *"REST + JSON-RPC with AP2, A2A, and MCP support built in; the UCP side of the bridge."*
> 
> — [Universal Commerce Protocol (UCP) — Google, Shopify, and partners](https://ucp.dev/)

The handshake dying isn't a footnote. It's the moment MCP stopped being a demo protocol and started being **infrastructure**. Stateless cores scale like web servers. Step-up auth makes payment authorization a first-class citizen. Elicitation puts a human in the loop without holding a socket hostage. The Lego pieces — MCP, ACP, UCP, AP2 — are finally snapping together into something you can actually run a shop on.

The next twelve months won't be about which protocol wins. They'll be about who builds the bridge between them first.

> **The Takeaway**
> 
> Stop pinning pods. Start shipping bridges. MCP grew up — the interesting work now is at the seams between protocols, not inside any one of them. I'm building mine in the open.

---

*A note on accuracy: this post tracks the **2026-07-28 release candidate**; verify exact field names against the final published specification before you rely on them. The Contour manifests are illustrative — request-header hashing, cookie affinity, and `timeoutPolicy` are real Contour `HTTPProxy` features, but check them against your own Contour and Envoy versions. hoodtopia.co is a demo shop: prices are from its live feed (SEK, free shipping), and no real orders or payments are taken.*

---

*Originally published at [umai-tech.com](https://umai-tech.com/blog/mcp-is-maturing-and-heres-what-you-need-to-know)*

Tags: Agentic Commerce, Model Context Protocol, Protocols, E-commerce, Payments