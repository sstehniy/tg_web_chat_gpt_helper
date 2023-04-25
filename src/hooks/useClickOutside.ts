import { MutableRefObject, useEffect } from "react";

export const useClickOutside = (
  ref: MutableRefObject<any>,
  handler: (e: MouseEvent) => any,
  filter?: (e: MouseEvent) => boolean
) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (filter && filter(e)) return;
      if (ref.current && !ref.current.contains(e.target)) {
        handler(e);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, handler, filter]);
};
