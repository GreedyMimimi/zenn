#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Bearer Token
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAAGOSvgEAAAAApIrfSNXv0ldE%2FfuDgWsHJmHe2Gw%3DxONnJFO5wqQYCgdArNsNP6PxjWX8DoBPYv3ZZ5vAb8K7Q3ikeA';

// X API エンドポイント
const TWITTER_API_URL = 'https://api.twitter.com/2/tweets';

/**
 * 昨日生成された記事ファイルを取得
 */
function getYesterdayArticleFile() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  
  const filename = `xrpl-${year}-${month}-${day}.md`;
  const filepath = path.join(__dirname, 'articles', filename);
  
  return { filepath, filename, date: `${year}-${month}-${day}` };
}

/**
 * マークダウンから1-2文のコメントを抽出
 */
function extractComment(content) {
  // "## はじめに" セクションを探す
  const hashjmatch = content.match(/## はじめに\n\n([\s\S]*?)(?:\n##|$)/);
  
  if (!hashjmatch) return null;
  
  const section = hashjmatch[1].trim();
  
  // 最初の段落を取得
  const paragraphs = section.split('\n\n');
  if (paragraphs.length === 0) return null;
  
  const firstPara = paragraphs[0];
  
  // 最初の1-2文を取得（。で分割）
  const sentences = firstPara.match(/[^。！？]+[。！？]/g) || [firstPara];
  
  let comment = sentences.slice(0, 2).join('').trim();
  
  // 150文字以内に調整
  if (comment.length > 150) {
    comment = comment.substring(0, 147) + '…';
  }
  
  return comment;
}

/**
 * X API に投稿
 */
async function postToTwitter(text) {
  try {
    const response = await fetch(TWITTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`X API Error (${response.status}):`, error);
      process.exit(1);
    }

    const result = await response.json();
    console.log('✅ Tweet posted successfully!');
    console.log('Tweet ID:', result.data.id);
    return true;
  } catch (err) {
    console.error('❌ Failed to post tweet:', err.message);
    process.exit(1);
  }
}

/**
 * メイン処理
 */
async function main() {
  const { filepath, date } = getYesterdayArticleFile();
  
  // ファイルが存在するか確認
  if (!fs.existsSync(filepath)) {
    console.log(`⏭️  記事ファイルが見つかりません: ${filepath}`);
    process.exit(0);
  }
  
  // ファイル読み込み
  const content = fs.readFileSync(filepath, 'utf-8');
  
  // コメント抽出
  const comment = extractComment(content);
  if (!comment) {
    console.error('❌ コメントを抽出できませんでした');
    process.exit(1);
  }
  
  // 投稿テキストを構築
  const url = `https://zenn.dev/greedy_mimimi/articles/xrpl-${date}`;
  const text = `🌕 この記事はオーナーに代わり、私、Mimimiが作成しました！

${comment}

${url}

#XRPL #blockchain #web3`;
  
  // 文字数確認（X API は 300文字制限）
  if (text.length > 280) {
    console.warn(`⚠️  テキストが長い (${text.length}文字) - 切り詰めます`);
  }
  
  console.log('📝 投稿内容:');
  console.log(text);
  console.log('');
  
  // X に投稿
  await postToTwitter(text);
}

main();
