import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  message: 'You have exceeded the 5 requests in 10 min limit!', 
  standardHeaders: true,
  legacyHeaders: false,
});