import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import * as matrix from 'rpi-led-matrix';
import type { MatrixOptions, RuntimeOptions } from 'rpi-led-matrix';
//const { createCanvas, loadImage } = require('canvas')
//const canvas = createCanvas(128, 64)

import indexRouter from './routes/index';
import demoRouter from './routes/demo';


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/demo', demoRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

//*************************** */
// Create RGBMATRIX object and configure it
//
//**************************** */
const baseMatrixOptions =
  typeof matrix.LedMatrix.defaultMatrixOptions === 'function'
    ? matrix.LedMatrix.defaultMatrixOptions()
    : ({} as MatrixOptions);

const matrixOptions: MatrixOptions = {
  ... baseMatrixOptions,
  rows: 64,
  cols: 64,
  chainLength: 2,
  hardwareMapping: matrix.GpioMapping.Regular,
  parallel: 1,
}

console.log("matrix options: ", JSON.stringify(matrixOptions, null, 2))

const baseRuntimeOptions =
  typeof matrix.LedMatrix.defaultRuntimeOptions === 'function'
    ? matrix.LedMatrix.defaultRuntimeOptions()
    : ({} as RuntimeOptions);

const runtimeOptions: RuntimeOptions = {
  ... baseRuntimeOptions,
  gpioSlowdown: 4 as RuntimeOptions['gpioSlowdown'],
  dropPrivileges: matrix.RuntimeFlag.Off
}

const createStubMatrix = (opts: MatrixOptions): matrix.LedMatrixInstance => {
  const w = opts.cols * opts.chainLength;
  const h = opts.rows;
  const stub: any = {};
  const chainable = () => stub;
  stub.width = () => w;
  stub.height = () => h;
  stub.brightness = (value?: number) => (value === undefined ? 0 : stub);
  stub.sync = () => undefined;
  stub.clear = chainable;
  stub.fgColor = (color?: number) =>
    color === undefined ? { r: 0, g: 0, b: 0 } : stub;
  stub.fill = chainable;
  stub.drawCircle = chainable;
  stub.drawRect = chainable;
  stub.drawBuffer = chainable;
  return stub as matrix.LedMatrixInstance;
};

const createMatrix = (): matrix.LedMatrixInstance => {
  
  if (matrix.isSupported === false) {
    console.warn("RGB Matrix addon not supported on this hardware; using stub.");
    return createStubMatrix(matrixOptions);
  }
  try {
    return new matrix.LedMatrix(matrixOptions, runtimeOptions) as matrix.LedMatrixInstance;
  } catch (err) {
    console.warn("Failed to init RGB Matrix; using stub.", err);
    return createStubMatrix(matrixOptions);
  }
};

const rgbmatrix = createMatrix();
rgbmatrix.brightness(50).sync();
app.set("matrix", rgbmatrix);

/************************************
 *  Initiate Konva Objects
 * 
 ************************************/
import Konva from 'konva';

const stage = new Konva.Stage({
  width: rgbmatrix.width(),
  height: rgbmatrix.height(),
});

app.set("stage", stage);

export default app;
