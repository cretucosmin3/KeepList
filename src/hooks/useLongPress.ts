import { createSignal } from "solid-js";

export const useLongPress = (callback: () => void, ms = 2000) => {
  const [pressing, setPressing] = createSignal(false);
  let timeout: NodeJS.Timeout;

  const start = () => {
    setPressing(true);
    timeout = setTimeout(callback, ms);
  };

  const stop = () => {
    setPressing(false);
    clearTimeout(timeout);
  };

  return {
    pressing,
    onPointerDown: start,
    onPointerUp: stop,
    onPointerLeave: stop
  };
};