import { describe, it, expect } from "vitest";
import { useStore } from "../src/core/useStore";

describe("adaptation logic", () => {
  it("recommends next set when accuracy >= 80", () => {
    const s = useStore.getState();
    // seed results: 8 correct out of 10
    useStore.setState({ recentResults: Array(10).fill(true) });
    s.actions.applyAdaptationAfterSet({ wrongItemIds: [], fallbackTo: "/x", activityName: "테스트" });
    const rec = useStore.getState().selectors.recommendation();
    expect(rec?.label.includes("다음 세트")).toBe(true);
  });

  it("recommends review when accuracy < 60", () => {
    const s = useStore.getState();
    useStore.setState({ recentResults: [true, false, false, false, false, false, false, false, false, false] });
    s.actions.applyAdaptationAfterSet({ wrongItemIds: ["a","b","c","d"], fallbackTo: "/x", activityName: "테스트" });
    const rec = useStore.getState().selectors.recommendation();
    expect(rec?.label.includes("복습")).toBe(true);
    expect(rec?.reviewIds?.length).toBeLessThanOrEqual(3);
  });
});


