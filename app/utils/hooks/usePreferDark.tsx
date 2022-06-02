import { useEffect, useState } from "react";

export function usePreferDark() {
  const [preferDark, setPreferDark] = useState(false);
  useEffect(() => {
    const isPreferDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setPreferDark(isPreferDark);
  }, []);

  return preferDark;
}
