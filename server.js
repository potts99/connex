const express = require("express");
const promMid = require('express-prometheus-middleware');

const app = express();

app.use(express.json());
app.use(promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    // authenticate: req => req.headers.authorization === 'Basic dXNlcjpwYXNzd29yZA==',
  }));

const PORT = process.env.PORT || 5000;

// In the interest of keeping this as simple as possibly I will just be using the one file usually i would split this up

app.get("/api/v1/time", (req, res) => {
  try {
    res.status(200).json({
      properties: {
        epoch: {
          description:
            "The current server time, in epoch seconds, at time of processing the request.",
          type: "number",
          time: Number(Math.floor(new Date().getTime() / 1000))
        },
      },
      required: ["epoch"],
      type: "object",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
