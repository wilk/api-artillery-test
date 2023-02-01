import pino from "pino";
import express from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { authMiddleware } from "./middlewares/auth.middleware";
import config from "./utils/config";
import { rateLimiterMiddleware } from "./middlewares/rate-limiter.middleware";
import { usersRouter } from "./users/router.users";

const logger = pino({ name: "main" });

/*
slowDown slows down requests after reaching the configured limit.
After 100 requests, it starts slowing down requests by 500 ms per request.
The max delay is set to 10 secs.
*/
const speedLimiter = slowDown({
  maxDelayMs: 10 * 1000,
  windowMs: 3 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
});

/*
For the same IP address, it is allowed a limit of 200 requests per a 15-minute window.
If the same IP makes more requests, it gets HTTP 429 Too Many Requests (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
Inside the response, there's the header `Retry-After` telling the time the client can restart making requests
*/
const rateLimiter = rateLimit({
  windowMs: 1.5 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// rateLimiter and speedLimiter sotre requests in-memory

const app = express();

// rate limiting is done by tier
// for instance

app.use("/api", authMiddleware(config.JWT_SECRET), rateLimiterMiddleware());
app.use("/api/users", usersRouter);

app.use((req, _, next) => {
  logger.info(`${req.method} ${req.hostname}${req.path} from ${req.ip}`);
  next();
});

app.use(speedLimiter);
app.use(rateLimiter);

app.get("/", (_, res) => res.end());

export { app };
