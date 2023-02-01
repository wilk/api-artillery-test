import rateLimit from "express-rate-limit";

const defaultRateLimiter = rateLimit({
  windowMs: 1.5 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const platimumRateLimiter = rateLimit({
  windowMs: 1.5 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const goldRateLimiter = rateLimit({
  windowMs: 1.5 * 60 * 1000, // 15 minutes
  max: 400, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const silverRateLimiter = rateLimit({
  windowMs: 1.5 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const bronzeRateLimiter = rateLimit({
  windowMs: 1.5 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const rateLimiterMiddleware = () => {
  return (req: any, res: any, next: any) => {
    switch (req.user.tier) {
      case "platinum":
        return platimumRateLimiter(req, res, next);
      case "gold":
        return goldRateLimiter(req, res, next);
      case "silver":
        return silverRateLimiter(req, res, next);
      case "bronze":
        return bronzeRateLimiter(req, res, next);
      default:
        return defaultRateLimiter(req, res, next);
    }
  };
};
