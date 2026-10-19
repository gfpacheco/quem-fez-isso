import { useEffect } from "react";

type KeyboardHandlers = {
  /** Keys (case-insensitive) that pick an option, in option order */
  selectKeys?: string[];
  /** Called with the 0-based index of the pressed key in `selectKeys` */
  onSelect?: (index: number) => void;
  /** Called on Enter/Space, unless a button or link already handles the key natively */
  onAdvance?: () => void;
};

const advanceKeys = new Set(["Enter", " "]);

export function useKeyboardShortcuts({ selectKeys = [], onSelect, onAdvance }: KeyboardHandlers) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const selectedIndex = selectKeys.findIndex((key) => key.toLowerCase() === event.key.toLowerCase());

      if (selectedIndex !== -1 && onSelect) {
        onSelect(selectedIndex);

        return;
      }

      if (advanceKeys.has(event.key) && onAdvance && !isNativelyActivatable(event.target)) {
        event.preventDefault();
        onAdvance();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectKeys, onSelect, onAdvance]);
}

function isNativelyActivatable(target: EventTarget | null) {
  return target instanceof HTMLButtonElement || target instanceof HTMLAnchorElement;
}
