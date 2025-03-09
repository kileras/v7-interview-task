import { useLayoutEffect, useState } from "react";

export const useMatchMedia = ({
  query,
  defaultValue,
}: {
  query: string;
  defaultValue: boolean;
}) => {
  let matches = defaultValue;
  let mediaQuery: MediaQueryList | null = null;

  if (typeof window !== "undefined") {
    mediaQuery = window.matchMedia(query);
    matches = mediaQuery.matches;
  }

  // State and setter for matched value
  const [value, setValue] = useState(matches);

  useLayoutEffect(() => {
    if (!mediaQuery) return;

    const matchesChangeHandler = (e: MediaQueryListEvent) => {
      setValue(e.matches);
    };

    mediaQuery.addEventListener("change", matchesChangeHandler);

    // Remove listeners on cleanup
    return () => {
      mediaQuery.removeEventListener("change", matchesChangeHandler);
    };
  }, [mediaQuery]);

  return value;
};
