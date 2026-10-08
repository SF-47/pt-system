import { useCallback, useEffect, useState } from "react";

const PAGINATION_HEIGHT = 84;
const BOTTOM_PADDING = 32;

// Returns how many rows fit between the list's top edge and the bottom of the
// viewport, so the list can paginate instead of scrolling. If every row fits,
// the page size is `total` (no pagination needed).
export function useFitPageSize(
  total: number,
  getRowHeight: (viewportWidth: number) => number,
) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [pageSize, setPageSize] = useState(total);
  const ref = useCallback((node: HTMLElement | null) => setElement(node), []);

  useEffect(() => {
    if (!element) return;

    function measure() {
      if (!element) return;
      const rowHeight = getRowHeight(window.innerWidth);
      const top = element.getBoundingClientRect().top + window.scrollY;
      const available = window.innerHeight - top - BOTTOM_PADDING;
      const fitAll = Math.floor(available / rowHeight);

      if (total <= fitAll) {
        setPageSize(Math.max(total, 1));
        return;
      }

      setPageSize(
        Math.max(3, Math.floor((available - PAGINATION_HEIGHT) / rowHeight)),
      );
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [element, total, getRowHeight]);

  return { ref, pageSize };
}
