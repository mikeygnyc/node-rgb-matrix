# Architecture

## Overview
This project is an Express server that drives an RGB LED matrix via `rpi-led-matrix`. Rendering uses Konva and Node Canvas to draw into offscreen canvases, then converts canvas RGBA pixels to RGB buffers pushed to the matrix. Several demo controllers exercise different rendering approaches, including GSAP animation and Matter.js physics.

## Runtime Components
- HTTP server: `src/bin/www.ts` creates and starts the HTTP server.
- Express app: `src/app.ts` wires middleware, routes, and error handling.
- Matrix device: `src/app.ts` constructs a `LedMatrix` with board configuration and runtime flags, then stores it on the Express app via `app.set("matrix", ...)`.
- Konva stage: `src/app.ts` creates a Konva `Stage` sized to the matrix and stores it on the app via `app.set("stage", ...)`.
- Routes: `src/routes/index.ts` and `src/routes/demo.ts` dispatch requests to controllers.
- Controllers: `src/controllers/demo.ts` implements demo behaviors and drives rendering.
- Render utilities: `src/utils/utils.ts` converts canvas RGBA pixels into RGB buffers for the matrix.
- Custom Matter renderer: `src/utils/render.ts` adapts Matter.js rendering for headless Node canvas.

## Module Map
- `src/bin/www.ts`
  Creates HTTP server, resolves port, binds `0.0.0.0` for numeric ports, and attaches error handlers.
- `src/app.ts`
  Express middleware, routes, matrix configuration, and Konva stage initialization.
- `src/routes/index.ts`
  Basic endpoints for health and device settings.
- `src/routes/demo.ts`
  Demo endpoint that switches on `demoId` to call `demoController.dX`.
- `src/controllers/demo.ts`
  Demonstrations of direct matrix drawing, Konva text, GSAP animation, Konva tweening, and Matter.js physics.
- `src/utils/utils.ts`
  Canvas-to-matrix publishing functions, layer helpers, and PNG export.
- `src/utils/render.ts`
  Matter.js renderer variant for Node, including a custom `requestAnimationFrame` loop.

## Rendering Model
- Konva stages and layers provide a familiar canvas-like API for building scenes.
- Layers are drawn into a Node canvas, then converted to RGB buffers.
- RGB buffers are pushed to the matrix with `rgbmatrix.drawBuffer(...).sync()`.
- Some demos render directly with `rpi-led-matrix` drawing primitives.

## Configuration Points
- Matrix options: `src/app.ts` in `matrixOptions` and `runtimeOptions`.
- Brightness: `POST /settings` adjusts brightness via `rgbmatrix.brightness(x).sync()`.
- Port: `PORT` environment variable with a default of `3000`.

## Extension Points
- Add endpoints in `src/routes/index.ts` or new routers under `src/routes/`.
- Add new demos in `src/controllers/demo.ts` and extend `src/routes/demo.ts` switch.
- Add new rendering utilities in `src/utils/utils.ts` for custom publish behavior.

## Known Limitations
- No authentication or authorization on endpoints.
- `POST /mode` is a placeholder and does not change internal state.
- `publishLayers` draws layers sequentially and does not blend them into a single composite buffer.
- Error handler does not return a JSON error body by default.
