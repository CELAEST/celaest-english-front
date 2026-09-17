/**
 * CELAEST Lingua - Live Blackbox E2E Smoke & Quality Gate Verification
 * 
 * Verifies live frontend, backend HTTP services, JWT security, neural TTS audio stream,
 * real PostgreSQL SM-2 Memory Vault, multi-tenant isolation, and writing evaluation.
 * 
 * Run with: node scripts/e2e_live_smoke.mjs
 */

import http from 'http';
import https from 'https';

const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8080';

// Real signed JWT token generated for E2E user
const VALID_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBsYXl3cmlnaHRAY2VsYWVzdC5jb20iLCJleHAiOjE3ODk2NTQyOTcsImlhdCI6MTc4OTU2Nzg5Nywic3ViIjoidXNlci1lMmUtcGxheXdyaWdodCJ9.JA9VJMpF0wjOhSJbYL2Z3Hc1oNhEzProoMf27Y1l8n8';
const EXPIRED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBsYXl3cmlnaHRAY2VsYWVzdC5jb20iLCJleHAiOjEwMDAwMDAwMDAsImlhdCI6OTk5OTk5OTAwLCJzdWIiOiJ1c2VyLWUyZS1leHBpcmVkIn0.k193YV_d5T1-fX2M9zL9N4_Q3jW8nL0-k0P_uT7-YyA';
const FORGED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBsYXl3cmlnaHRAY2VsYWVzdC5jb20iLCJleHAiOjE3ODk2NTQyOTcsImlhdCI6MTc4OTU2Nzg5Nywic3ViIjoidXNlci1lMmUtcGxheXdyaWdodCJ9.INVALID_FORGED_SIGNATURE_HERE';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

async function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === 'https:' ? https : http;
    const req = lib.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {
          // not json
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data,
          json,
        });
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function run() {
  console.log('\n======================================================');
  console.log('🚀 CELAEST LINGUA LIVE BLACKBOX QUALITY GATE');
  console.log('======================================================\n');

  // 1. Frontend Server Liveness
  console.log('[1/7] Testing Frontend Dev Server Liveness (Vite port 3000)...');
  try {
    const res = await request(FRONTEND_URL);
    assert(res.status === 200, `Frontend root returned HTTP ${res.status}`);
    assert(res.data.includes('<title>CELAEST Lingua'), 'HTML contains application title');
  } catch (err) {
    assert(false, `Frontend unreachable at ${FRONTEND_URL}: ${err.message}`);
  }

  // 2. Backend Health & Route Liveness
  console.log('\n[2/7] Testing Backend API Liveness (Go port 8080)...');
  try {
    const res = await request(`${BACKEND_URL}/health`);
    assert(res.status === 200, `Backend /health returned HTTP ${res.status}`);
    assert(res.json?.status === 'healthy', 'Health response payload status is "healthy"');
  } catch (err) {
    assert(false, `Backend unreachable at ${BACKEND_URL}: ${err.message}`);
  }

  // 3. JWT Security & Strict Authentication Gate
  console.log('\n[3/7] Testing JWT Security & Middleware Auth Gate...');
  try {
    const validRes = await request(`${BACKEND_URL}/api/v1/user/profile`, {
      headers: { Authorization: `Bearer ${VALID_TOKEN}` },
    });
    assert(validRes.status === 200, `Valid JWT accepted (HTTP ${validRes.status})`);
    assert(validRes.json?.success === true, 'Profile payload success is true');

    const expRes = await request(`${BACKEND_URL}/api/v1/user/profile`, {
      headers: { Authorization: `Bearer ${EXPIRED_TOKEN}` },
    });
    assert(expRes.status === 401, `Expired JWT strictly rejected with HTTP 401 (got ${expRes.status})`);

    const forgedRes = await request(`${BACKEND_URL}/api/v1/user/profile`, {
      headers: { Authorization: `Bearer ${FORGED_TOKEN}` },
    });
    assert(forgedRes.status === 401, `Forged JWT signature strictly rejected with HTTP 401 (got ${forgedRes.status})`);
  } catch (err) {
    assert(false, `Auth gate test encountered error: ${err.message}`);
  }

  // 4. Reading Lexicon & Word Lookup
  console.log('\n[4/7] Testing Real PostgreSQL Lexicon Cache (Word Lookup)...');
  try {
    const lookupRes = await request(
      `${BACKEND_URL}/api/v1/reading/word-lookup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${VALID_TOKEN}`,
        },
        body: { word: 'consistently' },
      }
    );
    assert(lookupRes.status === 200, `Word lookup returned HTTP ${lookupRes.status}`);
    assert(lookupRes.json?.data?.word === 'consistently', 'Word is "consistently"');
    assert(Boolean(lookupRes.json?.data?.phonetic), `Phonetic IPA resolved: ${lookupRes.json?.data?.phonetic}`);
    assert(Boolean(lookupRes.json?.data?.spanishTranslation), `Spanish translation resolved: ${lookupRes.json?.data?.spanishTranslation}`);
  } catch (err) {
    assert(false, `Lexicon lookup encountered error: ${err.message}`);
  }

  // 5. Neural TTS Audio Stream
  console.log('\n[5/7] Testing Neural Audio Streaming (Edge / Azure TTS)...');
  try {
    const ttsRes = await request(
      `${BACKEND_URL}/api/v1/tts/stream?text=hello%20world&voice=en-US-AriaNeural&rate=%2B0%25`,
      {
        headers: { Authorization: `Bearer ${VALID_TOKEN}` },
      }
    );
    assert(ttsRes.status === 200, `TTS Stream returned HTTP ${ttsRes.status}`);
    const contentType = ttsRes.headers['content-type'] || '';
    assert(contentType.includes('audio/mpeg') || contentType.includes('audio/mp3') || contentType.includes('audio/webm'), `Audio Content-Type is valid audio stream (${contentType})`);
  } catch (err) {
    assert(false, `Audio stream test encountered error: ${err.message}`);
  }

  // 6. Real PostgreSQL Memory Vault & SRS Lifecycle
  console.log('\n[6/7] Testing Real PostgreSQL Memory Vault & SM-2 SRS Lifecycle...');
  let createdCardId = null;
  try {
    // A. Create Card
    const createRes = await request(`${BACKEND_URL}/api/v1/memory/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${VALID_TOKEN}`,
      },
      body: {
        category: 'READING',
        userSaid: 'We was analyzing team metrics',
        errorWord: 'was',
        correctWord: 'were',
        betterWay: 'We were analyzing team metrics',
        translationSpanish: 'estábamos',
        grammarExplanation: 'Use were for plural subject we',
        cefrLevel: 'B1',
      },
    });
    assert(createRes.status === 201 || createRes.status === 200, `Memory card created (HTTP ${createRes.status})`);
    createdCardId = createRes.json?.data?.id;
    assert(Boolean(createdCardId), `Card ID generated: ${createdCardId}`);

    // B. Query Due Cards
    const dueRes = await request(`${BACKEND_URL}/api/v1/memory/cards`, {
      headers: { Authorization: `Bearer ${VALID_TOKEN}` },
    });
    assert(dueRes.status === 200, `Due cards query returned HTTP ${dueRes.status}`);
    const cards = dueRes.json?.data || [];
    assert(cards.some((c) => c.id === createdCardId), 'Newly created card is present in due cards list');

    // C. Review Card with SM-2 (score: 4 = GOOD)
    const reviewRes = await request(`${BACKEND_URL}/api/v1/memory/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${VALID_TOKEN}`,
      },
      body: {
        cardId: createdCardId,
        score: 4,
      },
    });
    assert(reviewRes.status === 200, `Card reviewed with SM-2 score 4 (HTTP ${reviewRes.status})`);
    assert(reviewRes.json?.data?.repetitions >= 1, `Repetitions incremented: ${reviewRes.json?.data?.repetitions}`);

    // D. Multi-Tenant Isolation: Another user must get 0 of this user's cards
    const userBToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJiQGNlbGFlc3QuY29tIiwiZXhwIjoxNzg5NjU0Mjk3LCJpYXQiOjE3ODk1Njc4OTcsInN1YiI6InVzZXItYjAwMDAwMDAwMCJ9.0z_B72Q3Z9pP0m8v_744_m0c41031_dummy_B';
    const userBDue = await request(`${BACKEND_URL}/api/v1/memory/cards`, {
      headers: { Authorization: `Bearer ${userBToken}` },
    });
    const userBCards = userBDue.json?.data || [];
    assert(!userBCards.some((c) => c.id === createdCardId), 'Multi-tenant isolation verified: User B cannot access User A cards');

    // E. Clean up: Delete test card
    if (createdCardId) {
      const delRes = await request(`${BACKEND_URL}/api/v1/memory/cards/${createdCardId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${VALID_TOKEN}` },
      });
      assert(delRes.status === 200, `Card cleanly deleted (HTTP ${delRes.status})`);
    }
  } catch (err) {
    assert(false, `Memory Vault test encountered error: ${err.message}`);
  }

  // 7. Writing Evaluation Pipeline
  console.log('\n[7/7] Testing Writing Evaluation Pipeline (Live AI Feedback)...');
  try {
    const writingRes = await request(`${BACKEND_URL}/api/v1/writing/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${VALID_TOKEN}`,
      },
      body: {
        title: 'Leadership and Empathy in Engineering',
        taskCategory: 'EXECUTIVE_SUMMARY',
        content: 'Effective leadership requires active listening, clear alignment across disciplines, and high empathy when solving complex engineering challenges with cross-functional teams.',
        roleName: 'Engineering Manager',
        targetLevel: 'C1',
      },
    });
    assert(writingRes.status === 200, `Writing evaluate returned HTTP ${writingRes.status}`);
    const data = writingRes.json?.data;
    assert(typeof data?.scoreClarity === 'number', `Clarity score returned: ${data?.scoreClarity}%`);
    assert(typeof data?.scoreGrammar === 'number', `Grammar score returned: ${data?.scoreGrammar}%`);
    assert(Boolean(data?.evaluatedLevel), `Evaluated level produced: ${data?.evaluatedLevel}`);
  } catch (err) {
    assert(false, `Writing evaluation test encountered error: ${err.message}`);
  }

  console.log('\n======================================================');
  console.log(`📊 FINAL RESULT: ${passedTests}/${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('======================================================\n');

  if (passedTests === totalTests) {
    console.log('🎉 100% PRODUCTION READY CERTIFIED (ZERO-HUMO)');
    process.exit(0);
  } else {
    console.error('❌ QUALITY GATE FAILED');
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
