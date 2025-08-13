import { describe, it, expect, beforeEach } from "vitest";
import { getItem, setItem, removeItem, mergeItem } from "../src/core/storage";

describe("storage wrapper (hf/ namespace)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("set/get roundtrip", () => {
    setItem("foo", { a: 1 });
    expect(getItem<{ a: number }>("foo")?.a).toBe(1);
  });

  it("merge shallow", () => {
    setItem("bar", { a: 1, b: 2 });
    const merged = mergeItem<{ a: number; b: number; c?: number }>("bar", { b: 3, c: 4 });
    expect(merged).toEqual({ a: 1, b: 3, c: 4 });
  });

  it("remove clears", () => {
    setItem("baz", 123);
    removeItem("baz");
    expect(getItem<number>("baz")).toBeNull();
  });
});


