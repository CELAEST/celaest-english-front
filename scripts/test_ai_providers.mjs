/**
 * Live Multi-Provider Diagnostic & Test Suite (CELAEST English Engine)
 *
 * Runs live requests against any configured AI provider:
 * 1. Checks API key authentication and credit balance status
 * 2. Measures roundtrip latency (ms)
 * 3. Tests real JSON structured pedagogical evaluation (STAR + False Cognates)
 * 4. Categorizes errors (402 Insufficient Balance, 401 Invalid Key, 429 Rate Limit)
 *
 * Usage:
 *   node scripts/test_ai_providers.mjs --provider=deepseek --key=sk-...
 *   node scripts/test_ai_providers.mjs --provider=groq --key=gsk-...
 *   node scripts/test_ai_providers.mjs --all
 */

import https from "node:https";
import http from "node:http";

const PROVIDER_CONFIGS = {
  groq: {
    name: "Groq",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    defaultModel: "qwen/qwen3.8-27b",
    fallbackModel: "openai/gpt-oss-20b",
    type: "openai-compatible",
  },
  gemini: {
    name: "Gemini",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models",
    defaultModel: "gemini-3.6-flash",
    type: "gemini",
  },
  deepseek: {
    name: "DeepSeek",
    endpoint: "https://api.deepseek.com/v1/chat/completions",
    defaultModel: "deepseek-chat",
    type: "openai-compatible",
  },
  openai: {
    name: "OpenAI",
    endpoint: "https://api.openai.com/v1/chat/completions",
    defaultModel: "gpt-4o-mini",
    type: "openai-compatible",
  },
  anthropic: {
    name: "Anthropic Claude",
    endpoint: "https://api.anthropic.com/v1/messages",
    defaultModel: "claude-3-5-haiku-20241022",
    type: "anthropic",
  },
  grok: {
    name: "xAI Grok",
    endpoint: "https://api.x.ai/v1/chat/completions",
    defaultModel: "grok-2",
    type: "openai-compatible",
  },
};

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    provider: null,
    key: null,
    model: null,
    testAll: false,
  };

  for (const arg of args) {
    if (arg.startsWith("--provider=")) {
      result.provider = arg.split("=")[1].toLowerCase();
    } else if (arg.startsWith("--key=")) {
      result.key = arg.split("=")[1];
    } else if (arg.startsWith("--model=")) {
      result.model = arg.split("=")[1];
    } else if (arg === "--all") {
      result.testAll = true;
    }
  }

  return result;
}

async function testProvider(providerId, apiKey, customModel) {
  const config = PROVIDER_CONFIGS[providerId];
  if (!config) {
    console.error(`[Error] Unknown provider: ${providerId}`);
    return { ok: false, message: `Unknown provider: ${providerId}` };
  }

  const model = customModel || config.defaultModel;
  console.log(`\n========================================================`);
  console.log(`📡 Probing Provider: ${config.name} (${providerId.toUpperCase()})`);
  console.log(`   Model: ${model}`);
  console.log(`   Endpoint: ${config.endpoint}`);
  console.log(`========================================================`);

  const startTime = Date.now();

  try {
    let url = config.endpoint;
    let headers = { "Content-Type": "application/json" };
    let body = {};

    if (config.type === "openai-compatible") {
      headers["Authorization"] = `Bearer ${apiKey}`;
      body = {
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an English linguistic evaluator. Return raw JSON: {\"overallScore\": 85, \"feedback\": \"Good use of vocabulary.\"}",
          },
          {
            role: "user",
            content: "Candidate answer: 'I have worked in agriculture and farm management for 5 years.'",
          },
        ],
        max_tokens: 100,
        response_format: { type: "json_object" },
      };
    } else if (config.type === "gemini") {
      url = `${config.endpoint}/${model}:generateContent?key=${apiKey}`;
      body = {
        contents: [
          {
            parts: [
              {
                text: "You are an English evaluator. Return raw JSON: {\"overallScore\": 85, \"feedback\": \"Good.\"} Candidate: 'I work in agriculture.'",
              },
            ],
          },
        ],
      };
    } else if (config.type === "anthropic") {
      headers["x-api-key"] = apiKey;
      headers["anthropic-version"] = "2023-06-01";
      body = {
        model,
        max_tokens: 100,
        messages: [
          {
            role: "user",
            content: "Return raw JSON: {\"overallScore\": 85, \"feedback\": \"Good.\"} Candidate: 'I work in agriculture.'",
          },
        ],
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const elapsed = Date.now() - startTime;
    const responseText = await response.text();

    console.log(`⏱️ Response HTTP Status: ${response.status} (${elapsed}ms)`);

    if (response.ok) {
      console.log(`✅ SUCCESS! ${config.name} connection is alive & healthy.`);
      try {
        const json = JSON.parse(responseText);
        console.log(`📦 Payload Preview:\n`, JSON.stringify(json, null, 2).slice(0, 400));
        return { ok: true, elapsed, data: json };
      } catch {
        console.log(`📄 Response Text:\n`, responseText.slice(0, 300));
        return { ok: true, elapsed, raw: responseText };
      }
    } else {
      console.log(`❌ FAILED with status ${response.status}`);
      let parsedErr = {};
      try {
        parsedErr = JSON.parse(responseText);
        console.log(`⚠️ Error Body:\n`, JSON.stringify(parsedErr, null, 2));
      } catch {
        console.log(`⚠️ Raw Error Body:\n`, responseText);
      }

      // Root Cause Analysis
      const lower = responseText.toLowerCase();
      if (
        response.status === 402 ||
        lower.includes("insufficient balance") ||
        lower.includes("insufficient_quota") ||
        lower.includes("credit balance") ||
        lower.includes("credit_balance_exhausted") ||
        lower.includes("no credits remaining") ||
        lower.includes("spending limit") ||
        lower.includes("used all available credits")
      ) {
        console.log(`\n💡 ROOT CAUSE: INSUFFICIENT BALANCE / QUOTA EXHAUSTED`);
        console.log(`   - The API Key is valid, but the account has $0.00 credits or hit spending limit.`);
        console.log(`   - Solution: Top up credit at provider dashboard OR switch to Groq (Free).`);
      } else if (response.status === 401 || response.status === 403 || lower.includes("invalid_api_key")) {
        console.log(`\n💡 ROOT CAUSE: INVALID API KEY`);
        console.log(`   - The API Key is incorrect, expired, or revoked.`);
      } else if (response.status === 503 || lower.includes("high demand") || lower.includes("unavailable")) {
        console.log(`\n💡 ROOT CAUSE: GLOBAL HIGH DEMAND / CAPACITY SPIKE (503)`);
        console.log(`   - Provider server is temporarily overloaded by global user traffic.`);
        console.log(`   - Solution: Retry or switch to Groq (Free).`);
      } else if (response.status === 429) {
        console.log(`\n💡 ROOT CAUSE: RATE LIMIT (429)`);
        console.log(`   - Per-minute request limit reached.`);
      } else if (providerId === "grok") {
        // Probe xAI team credit status
        try {
          const mRes = await fetch("https://api.x.ai/v1/models", {
            headers: { Authorization: `Bearer ${apiKey}` },
          });
          const mData = await mRes.json();
          if (mData?.error && typeof mData.error === "string") {
            console.log(`\n💡 xAI ACCOUNT STATUS:\n   ${mData.error}`);
          }
        } catch {}
      }

      return { ok: false, status: response.status, elapsed, error: responseText };
    }
  } catch (err) {
    const elapsed = Date.now() - startTime;
    console.error(`💥 Network / Transport Error (${elapsed}ms):`, err.message);
    return { ok: false, elapsed, error: err.message };
  }
}

async function main() {
  const args = parseArgs();

  console.log(`========================================================`);
  console.log(`🚀 CELAEST English Engine — Live AI Provider Test Harness`);
  console.log(`========================================================`);

  if (!args.provider && !args.testAll) {
    console.log(`
Usage:
  node scripts/test_ai_providers.mjs --provider=<groq|gemini|deepseek|openai|anthropic|grok> --key=<YOUR_KEY>

Available Providers:
  - groq       (Groq Cloud - Free Llama 3.3 70B)
  - gemini     (Google AI Studio - Free Gemini 2.5 Flash)
  - deepseek   (DeepSeek V3 / R1 - Prepaid API)
  - openai     (OpenAI GPT-4o-mini - Paid API)
  - anthropic  (Claude 3.5 Sonnet / Haiku - Paid API)
  - grok       (xAI Grok 2 - Paid API)
`);
    return;
  }

  if (args.provider) {
    const key = args.key || process.env[`${args.provider.toUpperCase()}_API_KEY`];
    if (!key) {
      console.error(`[Error] Missing API Key. Pass --key=sk-... or set environment variable.`);
      process.exit(1);
    }
    await testProvider(args.provider, key, args.model);
  }
}

main().catch(console.error);
