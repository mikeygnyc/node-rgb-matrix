import express from 'express';

const router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({});
});

/* GET home page. */
router.post('/mode', function (req, res, next) {
  const rgbmatrix = req.app.get('matrix');
  res.json({ "status": "mode set" });
});

router.post('/settings', function (req, res, next) {
  const rgbmatrix = req.app.get('matrix');
  const reqBody = req.body as { brightness?: number };
  console.log(reqBody);
  if (reqBody.brightness !== undefined) {
    rgbmatrix.brightness(reqBody.brightness).sync();
  }
  res.json({ "status": "mode set" });
});

export default router;
