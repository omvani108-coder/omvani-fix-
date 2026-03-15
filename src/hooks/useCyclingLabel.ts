import { useState, useEffect } from "react";

/**
 * Cycles through an array of labels at a fixed interval.
 * Returns the current label index for animation keying.
 */
export function useCyclingLabel(labels: string[], intervalMs = 2000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (labels.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % labels.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [labels.length, intervalMs]);

  return { label: labels[index], index };
}
