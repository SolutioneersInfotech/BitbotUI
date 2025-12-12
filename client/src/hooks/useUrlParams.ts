import { useMemo } from "react";

export function useCommodityFromURL() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("commodity") || null;
  }, []);
}
