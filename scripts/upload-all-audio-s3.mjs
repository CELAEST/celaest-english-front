import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "89c8387aa17733f14df1b3c898070d12";
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "62b5dd8dd7ec349ff6852ca39ff9e68d0939a0c7774a0a62554af9070655f0b6";
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "f86a523cdea231d412b60ef92dcce964";
const BUCKET = "celaest-audio";
const REGION = "auto";
const SERVICE = "s3";
const HOST = `${ACCOUNT_ID}.r2.cloudflarestorage.com`;

const AUDIO_DIR = path.resolve(__dirname, "../public/audio");
const CONCURRENCY = 30;

function hmac(key, string) {
  return crypto.createHmac("sha256", key).update(string).digest();
}

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = hmac("AWS4" + key, dateStamp);
  const kRegion = hmac(kDate, regionName);
  const kService = hmac(kRegion, serviceName);
  const kSigning = hmac(kService, "aws4_request");
  return kSigning;
}

function getAllFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (entry.isFile()) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function uploadFile(filePath, retryCount = 0) {
  const relativePath = path.relative(path.resolve(__dirname, "../public"), filePath).replace(/\\/g, "/");
  const encodedKey = relativePath.split("/").map(encodeURIComponent).join("/");
  const canonicalUri = `/${BUCKET}/${encodedKey}`;

  const ext = path.extname(filePath).toLowerCase();
  const contentType = ext === ".mp3" ? "audio/mpeg" : ext === ".wav" ? "audio/wav" : "application/octet-stream";
  const body = fs.readFileSync(filePath);

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.substring(0, 8);
  const payloadHash = sha256(body);

  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${HOST}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;

  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");

  const signingKey = getSignatureKey(SECRET_ACCESS_KEY, dateStamp, REGION, SERVICE);
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");
  const authHeader = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const url = `https://${HOST}${canonicalUri}`;

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Host: HOST,
        "Content-Type": contentType,
        "x-amz-date": amzDate,
        "x-amz-content-sha256": payloadHash,
        Authorization: authHeader,
      },
      body,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return { key: relativePath, size: body.length };
  } catch (err) {
    if (retryCount < 3) {
      await new Promise((r) => setTimeout(r, 400 * (retryCount + 1)));
      return uploadFile(filePath, retryCount + 1);
    }
    throw new Error(`Failed to upload ${relativePath}: ${err.message}`);
  }
}

async function run() {
  console.log(`🚀 Starting Cloudflare R2 S3 Mass Upload`);
  console.log(`📍 Endpoint: ${HOST}`);
  console.log(`📁 Scanning: ${AUDIO_DIR}`);
  const allFiles = getAllFiles(AUDIO_DIR);
  console.log(`📦 Total files to sync: ${allFiles.length}`);

  let completed = 0;
  let failed = 0;
  let totalBytes = 0;
  const total = allFiles.length;
  const startTime = Date.now();

  const queue = [...allFiles];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length > 0) {
      const file = queue.shift();
      if (!file) break;
      try {
        const res = await uploadFile(file);
        completed++;
        totalBytes += res.size;
        if (completed % 150 === 0 || completed === total) {
          const pct = ((completed / total) * 100).toFixed(1);
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
          const mb = (totalBytes / (1024 * 1024)).toFixed(1);
          const rate = (completed / (elapsed || 1)).toFixed(1);
          console.log(`[${completed}/${total}] (${pct}%) - ${mb} MB uploaded (${rate} files/sec, ${elapsed}s elapsed)`);
        }
      } catch (err) {
        failed++;
        console.error(`❌ ${err.message}`);
      }
    }
  });

  await Promise.all(workers);
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const finalMb = (totalBytes / (1024 * 1024)).toFixed(1);
  console.log(`\n🎉 Sync Complete!`);
  console.log(`✅ Uploaded: ${completed} files (${finalMb} MB)`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱ Total time: ${totalTime}s`);
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

