import { nanoid } from "nanoid";
import Url from "../models/Url.js";
import UAParser from "ua-parser-js";

export const createShortUrl = async (req, res) => {
  try {
    const { longUrl, customAlias, topic } = req.body;
    const userId = req.user.id;

    let shortUrl = customAlias || nanoid(8);

    const existingUrl = await Url.findOne({ shortUrl });
    if (existingUrl) {
      return res.status(400).json({ error: "Custom alias already in use" });
    }

    const newUrl = new Url({
      longUrl,
      shortUrl,
      userId,
      topic,
    });

    await newUrl.save();

    res.json({
      shortUrl: `${process.env.BASE_URL}/${shortUrl}`,
      createdAt: newUrl.createdAt,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const redirectToLongUrl = async (req, res) => {
  try {
    const { alias } = req.params;
    const url = await Url.findOne({ shortUrl: alias });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    url.clicks.push({
      timestamp: new Date(),
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      geolocation: "Not implemented", 
    });

    await url.save();

    res.redirect(url.longUrl);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
