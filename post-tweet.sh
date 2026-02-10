#!/bin/bash
set -e

# Twitter Bearer Token
export TWITTER_BEARER_TOKEN="AAAAAAAAAAAAAAAAAAAAAGOSvgEAAAAApIrfSNXv0ldE%2FfuDgWsHJmHe2Gw%3DxONnJFO5wqQYCgdArNsNP6PxjWX8DoBPYv3ZZ5vAb8K7Q3ikeA"

# スクリプト実行
cd /Users/user/Projects/Mimimi/zenn
node post-to-twitter.js
