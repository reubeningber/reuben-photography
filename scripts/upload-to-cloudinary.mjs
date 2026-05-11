#!/usr/bin/env node
// Usage: node scripts/upload-to-cloudinary.mjs <folder-path> <album-name>
// Example: node scripts/upload-to-cloudinary.mjs ~/Desktop/Portfolio/little-league little-league
//
// Requires: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env

import { readFileSync, readdirSync } from 'fs';
import { join, basename, extname } from 'path';
import { createHmac, createHash } from 'crypto';
import { FormData, Blob } from 'node:buffer';
import https from 'https';

const ENV_PATH = new URL('../.env', import.meta.url).pathname;

function loadEnv() {
  try {
    const lines = readFileSync(ENV_PATH, 'utf8').split('\n');
    for (const line of lines) {
      const [key, ...rest] = line.split('=');
      if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
    }
  } catch {
    // .env not found — rely on existing env vars
  }
}

loadEnv();

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('Missing Cloudinary credentials. Add to .env:\n  CLOUDINARY_CLOUD_NAME=...\n  CLOUDINARY_API_KEY=...\n  CLOUDINARY_API_SECRET=...');
  process.exit(1);
}

const [, , folderPath, albumName] = process.argv;
if (!folderPath || !albumName) {
  console.error('Usage: node scripts/upload-to-cloudinary.mjs <folder-path> <album-name>');
  process.exit(1);
}

const files = readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
console.log(`Uploading ${files.length} files from ${folderPath} → portfolio/${albumName}/`);

for (const file of files) {
  const publicId = `portfolio/${albumName}/${basename(file, extname(file))}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder: `portfolio/${albumName}`, public_id: basename(file, extname(file)), timestamp };
  const sortedParams = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
  const sigString = sortedParams.map(([k, v]) => `${k}=${v}`).join('&') + API_SECRET;
  const signature = createHash('sha256').update(sigString).digest('hex');

  const filePath = join(folderPath, file);
  const fileData = readFileSync(filePath);
  const base64 = fileData.toString('base64');
  const dataUri = `data:image/jpeg;base64,${base64}`;

  const body = new URLSearchParams({
    file: dataUri,
    api_key: API_KEY,
    timestamp: String(timestamp),
    signature,
    folder: `portfolio/${albumName}`,
    public_id: basename(file, extname(file)),
  });

  await new Promise((resolve, reject) => {
    const postData = body.toString();
    const options = {
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${CLOUD_NAME}/image/upload`,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData) },
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        if (json.error) { console.error(`  ✗ ${file}: ${json.error.message}`); }
        else { console.log(`  ✓ ${file} → ${json.secure_url}`); }
        resolve();
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

console.log('\nDone. Remember to add an .env file with your Cloudinary credentials if you haven\'t already.');
