declare module 'rpi-led-matrix' {
  export const GpioMapping: {
    Regular: number | string;
  };

  export const RuntimeFlag: {
    Off: number | string;
    On?: number | string;
  };

  export const isSupported: boolean;

  export type ChainLength = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  export interface MatrixOptions {
    rows: number;
    cols: number;
    chainLength: ChainLength;
    hardwareMapping: number | string;
    parallel?: number;
    brightness?: number;
    [key: string]: any;
  }

  export interface RuntimeOptions {
    daemon?: number | string;
    doGpioInit?: boolean;
    dropPrivileges?: number | string;
    gpioSlowdown?: 0 | 1 | 2 | 3 | 4;
    [key: string]: any;
  }

  export interface LedMatrixInstance {
    width(): number;
    height(): number;
    brightness(value: number): this;
    sync(): this;
    clear(): this;
    fgColor(color: number): this;
    fill(): this;
    drawCircle(x: number, y: number, radius: number): this;
    drawRect(x: number, y: number, width: number, height: number): this;
    drawBuffer(buffer: Buffer, width: number, height: number): this;
  }

  export class LedMatrix {
    constructor(matrixOptions: MatrixOptions, runtimeOptions: RuntimeOptions);
    static defaultMatrixOptions(): MatrixOptions;
    static defaultRuntimeOptions(): RuntimeOptions;
    width(): number;
    height(): number;
    brightness(value: number): this;
    sync(): this;
    clear(): this;
    fgColor(color: number): this;
    fill(): this;
    drawCircle(x: number, y: number, radius: number): this;
    drawRect(x: number, y: number, width: number, height: number): this;
    drawBuffer(buffer: Buffer, width: number, height: number): this;
  }
}
