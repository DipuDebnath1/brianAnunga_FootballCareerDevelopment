declare module "sharp" {
  interface Sharp {
    resize(_options: { width?: number; height?: number }): Sharp;
    webp(_options?: { quality?: number }): Sharp;
    toFile(_fileOut: string): Promise<{
      format: string;
      width: number;
      height: number;
    }>;
  }

  function sharp(_input?: string | Buffer): Sharp;

  export = sharp;
}
