import React, { useEffect } from "react";

export const useClickAway = (
  ref: React.MutableRefObject<any>,
  onClickAway: () => void
) => {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClickAway();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, onClickAway]);
};
