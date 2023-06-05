let supportsPassive = false;
try {
  const opts = Object.defineProperty({}, "passive", {
    get() {
      supportsPassive = true;
    },
  });
  window.addEventListener("test", null as any, opts);
} catch (e) {
  // empty
}

export function isSupportsPassive() {
  return supportsPassive;
}

export function disableEventPassiveOptions() {
  return supportsPassive ? { passive: false } : false;
}
