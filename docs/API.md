# API

## Base URL
- Local default: `http://<host>:3000`
- Port can be overridden with `PORT`.

## Content Types
- Requests with bodies should use `Content-Type: application/json`.
- Responses are JSON objects.

## Endpoints
### `GET /`
Returns an empty JSON object as a basic health check.

Response
```json
{}
```

### `POST /mode`
Placeholder endpoint for mode switching. Currently returns a status message but does not apply any mode changes.

Request Body
```json
{}
```

Response
```json
{"status":"mode set"}
```

### `POST /settings`
Adjusts device settings, currently only brightness.

Request Body
```json
{"brightness":50}
```

Response
```json
{"status":"mode set"}
```

Notes
- `brightness` is forwarded to `rgbmatrix.brightness(brightness).sync()`.

### `GET /demo/:demoId`
Starts a demo rendering routine.

Path Parameters
- `demoId` numeric string from `0` to `6`.

Response
```json
{"status":"Demo running"}
```

Demo Map
- `0` clears the matrix display.
- `1` draws a circle and rectangle directly on the matrix.
- `2` renders Konva text to the matrix.
- `3` animates a square with GSAP and publishes each frame.
- `4` renders multiple Konva shapes on a layer.
- `5` animates Konva shapes with Konva Tween.
- `6` runs a Matter.js physics scene and publishes on each render.

## Error Handling
- Unmatched routes return HTTP `404`.
- Server errors return HTTP `500`.
