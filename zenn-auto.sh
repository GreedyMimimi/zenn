#!/bin/bash

cd /Users/user/Projects/Mimimi/zenn || exit

DATE=$(date +%Y-%m-%d)
FILE="articles/xrpl-$DATE.md"

echo "📝 Generating Zenn article..."

agent --force "
1) Check existing articles: List and read the contents (or at least filenames and titles from frontmatter) of files in /Users/user/Projects/Mimimi/zenn/articles/. Identify which topics are already covered.

2) Choose a new topic: Create an article about XRPL on a topic that is not yet covered (or not fully covered) in existing articles. Avoid duplicating existing content.

3) Save the article to:
/Users/user/Projects/Mimimi/zenn/$FILE

Requirements:
- Decide title and topics from the article content; write them in the frontmatter.
- Frontmatter format (fill title and topics appropriately):
---
title: （記事に合わせて日本語で自動生成）
emoji: 🐱
type: tech
topics: （記事のテーマに合わせて配列で自動生成、例: [xrpl, blockchain, web3]）
published: true
---

Write a detailed beginner friendly article.

git add .
git commit -m \"auto: add article $DATE\" || echo "No changes"
git push origin main
"
