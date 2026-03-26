# Flow

## Startup Flow
1. `src/bin/www.ts` imports the Express app and determines the port.
2. The HTTP server is created with `http.createServer(app)`.
3. The server listens on `0.0.0.0` for numeric ports.
4. `src/app.ts` initializes middleware and routes.
5. `src/app.ts` creates the `LedMatrix` and Konva `Stage` and stores them on the Express app.

## Request Flow
### Demo Requests
1. Client calls `GET /demo/:demoId`.
2. `src/routes/demo.ts` reads `demoId` and calls the matching `demoController.dX`.
3. The controller draws via `rpi-led-matrix` directly or via Konva/Canvas.
4. If using Canvas, `src/utils/utils.ts` publishes RGB buffers to the matrix.
5. The route responds with JSON once the demo is started.

### Settings Requests
1. Client calls `POST /settings` with JSON body.
2. `src/routes/index.ts` reads `brightness` and applies `rgbmatrix.brightness(x).sync()`.
3. The route responds with JSON immediately.

## Rendering Flow
### Direct Matrix Drawing
1. Controller uses `LedMatrix` drawing primitives.
2. `sync()` flushes the frame to the panel.

### Canvas to Matrix
1. Konva draws into one or more layers.
2. `utils.publishLayer` or `utils.publishLayers` reads `getImageData()`.
3. RGBA pixels are converted to RGB by dropping the alpha channel.
4. RGB buffer is pushed to the matrix with `drawBuffer(...).sync()`.

## Animation Flow
- GSAP animations update positions on every tick.
- Each tick clears and redraws the canvas, then publishes to the matrix.
- Matter.js uses a custom renderer and hooks `afterRender` to publish layers.
