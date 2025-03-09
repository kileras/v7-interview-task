import { describe, expect, test, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMatchMedia } from "./useMatchMedia";
import { act } from "react";

const addListenerSpy = vi.fn();
const removeListenerSpy = vi.fn();
const mediaSpy = vi.spyOn(global, "matchMedia");

describe("Testing", () => {
  test("Should return false if the query doesn't match", () => {
    mediaSpy.mockImplementation(() => {
      return {
        addEventListener: addListenerSpy,
        removeEventListener: removeListenerSpy,
        matches: false,
      } as unknown as MediaQueryList;
    });

    const { result } = renderHook(() =>
      useMatchMedia({ query: "foo", defaultValue: true })
    );

    expect(addListenerSpy).toHaveBeenCalled();
    expect(result.current).toBe(false);
  });

  test("Should return true if the query matches", () => {
    mediaSpy.mockImplementation(() => {
      return {
        addEventListener: addListenerSpy,
        removeEventListener: removeListenerSpy,
        matches: true,
      } as unknown as MediaQueryList;
    });

    const { result } = renderHook(() =>
      useMatchMedia({ query: "foo", defaultValue: true })
    );

    expect(addListenerSpy).toHaveBeenCalled();
    expect(result.current).toBe(true);
  });

  test("Should update the value if the result of the query changes", () => {
    let callback: CallableFunction;

    vi.spyOn(global, "matchMedia").mockImplementation(() => {
      return {
        addEventListener: addListenerSpy.mockImplementation((_, cb) => {
          console.log("Add", cb);
          callback = cb;
        }),
        removeEventListener: removeListenerSpy,
        matches: false,
      } as unknown as MediaQueryList;
    });

    const { result } = renderHook(() =>
      useMatchMedia({ query: "foo", defaultValue: true })
    );

    expect(addListenerSpy).toHaveBeenCalled();
    expect(result.current).toBe(false);

    // @ts-expect-error This will be defined, otherwiuse the test shoudl fail
    expect(callback).toBeDefined();

    act(() => {
      callback({ matches: true });
    });

    expect(result.current).toBe(true);
  });
});
