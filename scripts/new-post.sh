#!/bin/bash

# Umai Tech Blog Post Generator - Simple Shell Version
# Usage: ./scripts/new-post.sh "Blog Post Title" "Description" "tag1,tag2,tag3"

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Functions
create_slug() {
    echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | sed 's/ /-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g'
}

format_tags() {
    IFS=',' read -ra ADDR <<< "$1"
    tags=""
    for tag in "${ADDR[@]}"; do
        trimmed_tag=$(echo "$tag" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        if [ -n "$tags" ]; then
            tags="$tags, \"$trimmed_tag\""
        else
            tags="\"$trimmed_tag\""
        fi
    done
    echo "$tags"
}

# Check if we have the required arguments
if [ $# -lt 3 ]; then
    echo -e "${RED}Usage: $0 \"Blog Post Title\" \"Description\" \"tag1,tag2,tag3\"${NC}"
    echo -e "${YELLOW}Example: $0 \"My Amazing Post\" \"A post about amazing things\" \"AI,Machine Learning,Python\"${NC}"
    exit 1
fi

TITLE="$1"
DESCRIPTION="$2"
TAGS_INPUT="$3"
SLUG=$(create_slug "$TITLE")
FORMATTED_TAGS=$(format_tags "$TAGS_INPUT")
CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Paths
BLOG_DIR="src/content/blog"
FILE_PATH="$BLOG_DIR/$SLUG.mdx"
IMAGE_DIR="public/images/blog/$SLUG"

# Check if blog post already exists
if [ -f "$FILE_PATH" ]; then
    echo -e "${RED}Error: Blog post with slug '$SLUG' already exists${NC}"
    exit 1
fi

# Create directories if they don't exist
mkdir -p "$BLOG_DIR"
mkdir -p "$IMAGE_DIR"

# Create the blog post content
cat > "$FILE_PATH" << EOF
---
title: "$TITLE"
description: "$DESCRIPTION"
pubDate: $CURRENT_DATE
updatedDate: $CURRENT_DATE
author: "Marcus Elwin"
tags: [$FORMATTED_TAGS]
---

import Callout from '@components/Callout.astro';

## Introduction

Write your blog post content here...

<Callout type="info" title="Pro Tip">
Use callout components to highlight important information!
</Callout>

## Section 1

Add your sections here...

## Conclusion

Wrap up your thoughts...
EOF

# Success message
echo -e "\n${GREEN}${BOLD}✅ Blog post created successfully!${NC}"
echo -e "${GREEN}📝 File:${NC} ${BLUE}$FILE_PATH${NC}"
echo -e "${GREEN}🖼️  Images:${NC} ${BLUE}$IMAGE_DIR/${NC}"
echo -e "${GREEN}🌐 URL:${NC} ${BLUE}http://localhost:4321/blog/$SLUG${NC}"

echo -e "\n${YELLOW}${BOLD}Quick Reference:${NC}"
echo -e "${YELLOW}• Add images to:${NC} $IMAGE_DIR/"
echo -e "${YELLOW}• Reference images:${NC} ![Alt text](/images/blog/$SLUG/image.png)"
echo -e "${YELLOW}• Use callouts:${NC} <Callout type=\"info\" title=\"Title\">Content</Callout>"
echo -e "${YELLOW}• Callout types:${NC} info, warning, error, success"
echo -e "${YELLOW}• Start dev server:${NC} npm run dev"