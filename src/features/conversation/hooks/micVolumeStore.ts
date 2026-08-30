import { useSyncExternalStore } from "react";

// External store for the live microphone input level (0..1).
//
// Why: the level updates ~12 times per second while listening. Keeping it in the
// main interview hook's React state forced the entire InterviewPracticeView tree
// to re-render on every tick. This store lets only the components that actually
// display the level subscribe to it, so the rest of the tree stays stable.
let micVolume = 0;
const listeners = new Set<() => void>();

export function setMicVolume(level: number): void {
	micVolume = level;
	listeners.forEach((l) => l());
}

export function getMicVolume(): number {
	return micVolume;
}

function subscribe(cb: () => void): () => void {
	listeners.add(cb);
	return () => listeners.delete(cb);
}

// Subscribes a component to live mic level updates. Only components that call
// this re-render on level changes.
export function useMicVolume(): number {
	return useSyncExternalStore(subscribe, getMicVolume, getMicVolume);
}
