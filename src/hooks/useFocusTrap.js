import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const useFocusTrap = (containerRef, { isActive = true, onClose, autoFocusRef } = {}) => {
  const previousFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isActive) return;

    previousFocusRef.current = document.activeElement;

    if (autoFocusRef?.current) {
      setTimeout(() => autoFocusRef.current?.focus(), 100);
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onCloseRef.current) {
        onCloseRef.current();
      }

      if (e.key === "Tab" && containerRef.current) {
        const focusableElements =
          containerRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isActive]);
};

export default useFocusTrap;
