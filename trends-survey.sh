#!/bin/bash

cd /Users/user/Projects/Mimimi/zenn || exit

MONTH=$(date +%Y-%m)
TRENDS_FILE="trends/$MONTH.md"
mkdir -p trends

echo "🔍 Surveying blockchain market trends..."

agent --force "
This script runs daily. Output file is monthly: /Users/user/Projects/Mimimi/zenn/$TRENDS_FILE. If the file does not exist, create it. If it already exists, update it (overwrite with the latest ranking).

Search the web for what is popular in the blockchain market. Build a ranking of popular categories (e.g. DeFi, L2, NFT, RWA, regulation, institutional adoption, XRPL, etc.) by current interest/popularity. Write to the file above. Format: title '人気カテゴリランキング', month ($MONTH), last updated (today's date), then a numbered ranking (1. カテゴリ名 — 短い説明).
"
