const rateLimit = new Map();

export const rateLimiter = (req, res, next) => {
  const userId = req.user.id;
  const now = Date.now();
  const windowStart = now - 60 * 1000; 

  const userRequests = rateLimit.get(userId) || [];
  const windowRequests = userRequests.filter(
    (timestamp) => timestamp > windowStart
  );

  if (windowRequests.length >= 10) {
    return res
      .status(429)
      .json({ error: "Too many requests, please try again later." });
  }

  windowRequests.push(now);
  rateLimit.set(userId, windowRequests);

  next();
};
