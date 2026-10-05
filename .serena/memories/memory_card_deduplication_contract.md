# Memory Deduplication Architecture & Multi-Error Cardinality Contract

## Problem Identified and Resolved
When saving error cards in Speaking (Interview) and Writing (e.g. clicking 'Guardar todas'):
Multiple errors extracted from the same sentence or turn share the identical corrected native sentence in `betterWay` (and often the same `userSaid`).
Previously, both the Go backend (`IsSemanticDuplicate` in `dedup.go`, `checkQuery` in `repository.go`, `deduplicateCards` in `service.go`) and the TypeScript frontend (`areCardsDuplicate` in `memoryDeduplication.ts`) considered two cards duplicates if their `betterWay` was identical, OR if `error_word` matched an existing card.
This caused legitimate distinct errors (such as 'go' -> 'went' and 'buyed' -> 'bought' in the same sentence) to be squashed:
- 5 speaking errors were reduced to 3.
- 4 writing errors were reduced to 1.
Additionally, background goroutines in the backend `GetDueCards` were deleting cards from the database.

## Architecture Contract
1. In `SPEAKING` and `WRITING`, cards are only duplicates if:
   - When discrete errorWord or correctWord exist: BOTH `errorWord` AND `correctWord` match AND they share sentence context (`betterWay` or `userSaid`). If `errorWord` or `correctWord` differ, they are NEVER duplicates.
   - When free-form without discrete error words: Both `userSaid` AND `betterWay` must match exactly.
2. In PostgreSQL (`repository.go`):
   - `checkQuery` must evaluate both `error_word` and `correct_word` simultaneously against `better_way_hash` / `user_said_hash`. It must NEVER use an open `OR (error_word = $3)` or `OR (better_way_hash = $4)`.
3. In Frontend UI ('Guardar todas'):
   - Use concurrent execution via `Promise.allSettled`.
   - Invalidate React Query cache (`QUERY_KEYS.memory.all`) ONCE after the entire batch finishes, rather than on every card.