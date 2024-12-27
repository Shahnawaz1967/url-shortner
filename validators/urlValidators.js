import Joi from "joi";

const createShortUrlSchema = Joi.object({
  longUrl: Joi.string().uri().required(),
  customAlias: Joi.string().alphanum().min(3).max(30),
  topic: Joi.string(),
});

export const validateCreateShortUrl = (req, res, next) => {
  const { error } = createShortUrlSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
