import { useEffect } from "react";

let lockCount = 0;

const lock = () => {
  lockCount++;
  if (lockCount === 1) {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
};

const unlock = () => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }
};

const useScrollLock = (isActive) => {
  useEffect(() => {
    if (isActive) {
      lock();
      return () => unlock();
    }
  }, [isActive]);
};

export default useScrollLock;
