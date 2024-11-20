declare global {
  interface EyeDropper {
    open: () => Promise<{ sRGBHex: string }>;
  }

  var EyeDropper: {
    new (): EyeDropper;
  };
}

export {};
