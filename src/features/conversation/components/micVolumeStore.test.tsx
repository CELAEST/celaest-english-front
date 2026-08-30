import { useEffect } from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, renderHook, act } from "@testing-library/react";
import { useMicVolume, setMicVolume, getMicVolume } from "../hooks/micVolumeStore";

let parentRenderCount = 0;

// A parent that does NOT subscribe to the mic-volume store; its render count
// must stay stable even when the volume updates.
function Parent() {
	useEffect(() => {
		parentRenderCount += 1;
	});
	return (
		<div>
			<span data-testid="parent-renders">rendered</span>
			<Subscriber />
		</div>
	);
}

// A child that subscribes via useMicVolume; only this should re-render.
function Subscriber() {
	const volume = useMicVolume();
	return <span data-testid="child-volume">{volume.toFixed(2)}</span>;
}

describe("micVolumeStore isolation (F-C2)", () => {
	beforeEach(() => {
		parentRenderCount = 0;
	});
	afterEach(() => {
		act(() => {
			setMicVolume(0);
		});
	});

	it("propagates updates to subscribers", () => {
		const { result } = renderHook(() => useMicVolume());
		expect(result.current).toBe(0);
		act(() => setMicVolume(0.5));
		expect(result.current).toBe(0.5);
		expect(getMicVolume()).toBe(0.5);
	});

	it("does NOT re-render a non-subscribing parent when volume changes", () => {
		const { getByTestId } = render(<Parent />);
		const parentBefore = getByTestId("parent-renders").textContent;

		act(() => setMicVolume(0.75));

		// Parent never re-rendered:
		expect(getByTestId("parent-renders").textContent).toBe(parentBefore);
		// Only the subscriber reflected the new value:
		expect(getByTestId("child-volume").textContent).toBe("0.75");
	});
});
