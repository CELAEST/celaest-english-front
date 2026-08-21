# RFC-004: Bring Your Own Key (BYOK) & Multi-Provider AI Architecture

> **Status**: Approved  
> **Author**: Staff Software Engineer & AI Product Designer  
> **Date**: 2026-07-29  

---

## 1. Context & Problem Statement

Users have different preferences for AI model providers (OpenAI GPT-4o / Realtime, Anthropic Claude 3.5 Sonnet, DeepSeek R1, or local offline models via Ollama). Furthermore, privacy-conscious professionals want the option to use their own API keys directly without routing data through third-party servers.

---

## 2. Decision

We implement a **BYOK (Bring Your Own Key) Multi-Provider AI Architecture**:
- The application includes an abstraction layer `IAiProviderAdapter`.
- API keys are encrypted client-side using `ISecureVault` (AES-GCM 256-bit).
- Support for OpenAI, Anthropic, DeepSeek, and Local Ollama out of the box.

---

## 3. Justification & Rationale

1. **User Privacy & Ownership**: Users maintain complete control over their AI credentials and API usage limits.
2. **Offline Local Capability**: Allows privacy-first execution via local Ollama instances (`http://localhost:11434`).
3. **Provider Flexibility**: Seamlessly fallback or switch models based on task type (e.g. OpenAI Realtime for live voice, Claude 3.5 Sonnet for deep writing analysis).
