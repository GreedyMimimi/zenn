#!/bin/bash

cd /Users/user/Projects/Mimimi/zenn || exit

DATE=$(date +%Y-%m-%d)
FILE="articles/xrpl-$DATE.md"

echo "📝 Generating Zenn article..."

agent "
Create a high-quality Zenn article in Japanese about XRPL.

Save to:
/Users/user/Projects/Mimimi/zenn/$FILE

Requirements:

---
title: XRPLの仕組みと特徴を初心者向けに解説
emoji: ⚡
type: tech
topics: [xrpl, blockchain, web3]
published: true
---

Write a detailed beginner friendly article.

git add .
git commit -m \"auto: add article $DATE\" || echo "No changes"
git push origin main
"
