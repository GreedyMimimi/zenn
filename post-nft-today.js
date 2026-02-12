#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { TwitterApi } = require('twitter-api-v2');

// OAuth 1.0a 認証情報
const client = new TwitterApi({
  appKey: 'bLaAuSYNpW1ZA7ashu9wJv1Iw',
  appSecret: 'lBkCfKJ8BUL1LCmnTD2QQHjBTiiAH4VSdjlVnfR1SyW9VSFTgB',
  accessToken: '117692262-3lj8jwliZw5SjOcsgfc1P2GLP0rmHm0MAsL7Is0Y',
  accessSecret: '2D92Fs5DWY2xYnP7eLGQxzunBctGWK2ub0RR6YhKNiAud',
});

const rwClient = client.readWrite;

function stripMarkdown(text) {
  return text
    .replace(/XRP Ledger（XRPL）/g, 'XRPL')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/__/g, '')
    .replace(/_/g, '')
    .replace(/`/g, '')
    .replace(/#+\s/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
    .replace(/>/g, '')
    .replace(/^-\s/gm, '• ')
    .replace(/^\d+\.\s/gm, '')
    .replace(/XRP Ledger/g, 'XRPL');
}

function extractComment(content) {
  const match = content.match(/## はじめに\n\n([\s\S]*?)(?:\n##|$)/);
  
  if (!match) return null;
  
  const section = match[1].trim();
  const paragraphs = section.split('\n\n');
  if (paragraphs.length === 0) return null;
  
  const firstPara = paragraphs[0];
  const sentences = firstPara.match(/[^。！？]+[。！？]/g) || [firstPara];
  
  let comment = sentences.slice(0, 2).join('').trim();
  comment = stripMarkdown(comment);
  
  if (comment.length > 150) {
    comment = comment.substring(0, 147) + '…';
  }
  
  return comment;
}

async function postToTwitter(text) {
  try {
    const result = await rwClient.v2.tweet(text);
    
    console.log('✅ Tweet posted successfully!');
    console.log('Tweet ID:', result.data.id);
    console.log('URL: https://x.com/i/web/status/' + result.data.id);
    return true;
  } catch (err) {
    console.error('❌ Failed to post tweet:', err.message);
    if (err.data) {
      console.error('Error details:', JSON.stringify(err.data, null, 2));
    }
    process.exit(1);
  }
}

async function main() {
  // 今日の記事ファイルを取得
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const date = `${year}-${month}-${day}`;
  const filepath = path.join(__dirname, 'articles', `xrpl-${date}.md`);
  
  if (!fs.existsSync(filepath)) {
    console.log(`⏭️  記事ファイルが見つかりません: ${filepath}`);
    process.exit(0);
  }
  
  const content = fs.readFileSync(filepath, 'utf-8');
  const comment = extractComment(content);
  
  if (!comment) {
    console.error('❌ コメントを抽出できませんでした');
    process.exit(1);
  }
  
  const url = `https://zenn.dev/greedy_mimimi/articles/xrpl-${date}`;
  const text = `🎨 新しい記事を公開しました

${comment}

${url}

#XRPL #NFT #blockchain #web3`;
  
  if (text.length > 280) {
    console.warn(`⚠️  テキストが長い (${text.length}文字)`);
  }
  
  console.log('📝 投稿内容:');
  console.log(text);
  console.log('');
  
  await postToTwitter(text);
}

main();
