import fs from "fs";
import Konva from "konva";
import type { LedMatrixInstance } from "rpi-led-matrix";

type Stage = Konva.Stage;
type Layer = Konva.Layer;
type Context2D = any;

const utils = {

  /***
   *  WAIT FUNCTION TO ADD ARBITRARY DELAYS TO CODE
   */

  wait: function (t: number) {
    return new Promise<void>(ok => setTimeout(ok, t))
  },

  /***
   *  PUBLISH FUNCTION TO PUBLISH A CONTEXT ctx to THE RGB MATRIX
   *  THIS WILL DRAW WHATEVER IS THERE IN THE CANVAS ON TO THE 
   *  RGB MATRIX
   */
  publish: function (ctx: Context2D, rgbmatrix: LedMatrixInstance) {
    const w = rgbmatrix.width();
    const h = rgbmatrix.height();

    const rgba = ctx.getImageData(0, 0, w, h).data
    const newArray = new Uint8ClampedArray(w * h * 3);
    for (let i = 0, counter = 0; i < rgba.length; i++) {
      if (i % 4 < 3) {
        newArray[counter++] = rgba[i]
      }
    }
    const image = Buffer.from(newArray);
    rgbmatrix.drawBuffer(image, w, h).sync();
  },

  /**
   * Publish a single Konvba Layer object to the RGBMatrix
   * 
   * @param {*} layer 
   * @param {*} rgbmatrix 
   */
  publishLayer: function (layer: Layer, rgbmatrix: LedMatrixInstance) {
    const w = rgbmatrix.width();
    const h = rgbmatrix.height();
    const ctx = layer.getContext()
    const rgba = ctx.getImageData(0, 0, w, h).data
    const newArray = new Uint8ClampedArray(w * h * 3);
    for (let i = 0, counter = 0; i < rgba.length; i++) {
      if (i % 4 < 3) {
        newArray[counter++] = rgba[i]
      }
    }
    const image = Buffer.from(newArray);
    rgbmatrix.drawBuffer(image, w, h).sync();
  },
  /**
   * Publish a multiple Konva Layers to the RGBMatrix
   * 
   * @param {*} layer 
   * @param {*} rgbmatrix 
   */
  publishLayers: function (layers: Layer[], rgbmatrix: LedMatrixInstance) {
    const w = rgbmatrix.width();
    const h = rgbmatrix.height();
    const ctxs: Context2D[] = []
    for (const layer of layers) {
      ctxs.push(layer.getContext())
    }

    for (const ctx of ctxs) {
      const rgba = ctx.getImageData(0, 0, w, h).data
      const newArray = new Uint8ClampedArray(w * h * 3);
      for (let i = 0, counter = 0; i < rgba.length; i++) {
        if (i % 4 < 3) {
          newArray[counter++] = rgba[i]
        }
      }
      const image = Buffer.from(newArray);
      rgbmatrix.drawBuffer(image, w, h).sync();
    }

  },

  clearLayers: function (layers: Layer[], rgbmatrix: LedMatrixInstance) {
    const w = rgbmatrix.width();
    const h = rgbmatrix.height();

    for (const layer of layers) {
      const context = layer.getContext();
      context.clearRect(0, 0, w, rgbmatrix.height());
      const rgba = context.getImageData(0, 0, w, h).data
      const newArray = new Uint8ClampedArray(w * h * 3);
      for (let i = 0, counter = 0; i < rgba.length; i++) {
        if (i % 4 < 3) {
          newArray[counter++] = rgba[i]
        }
      }
      const image = Buffer.from(newArray);
      rgbmatrix.drawBuffer(image, w, h).sync();
    }
  },


  /**
   * Function to export the current frame to a PNG file
   * File saved with currentr epoch timestamp
   * @param {*} canvas 
   */

  exportCanvas: function (canvas: any) {
    if (!canvas || typeof canvas.toBuffer !== "function") {
      return;
    }
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./" + Date.now() + ".png", buffer);
  },

  /**
   * Fucntion to get the layers of a Konva Stage object
   * if no layers are found, a single layer is added and returned
   * @param {*} stage 
   * @returns 
   */
  getLayers: function (stage: Stage) {
    let layers = stage.getLayers();
    if (layers.length <= 0) {

      const layer = new Konva.Layer();
      stage.add(layer)
      layers = stage.getLayers();
    }
    return layers;
  }
}

export default utils;
