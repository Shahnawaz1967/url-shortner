import Url from "../models/Url.js";
import UAParser from "ua-parser-js";

export const getUrlAnalytics = async (req, res) => {
  try {
    const { alias } = req.params;
    const url = await Url.findOne({ shortUrl: alias, userId: req.user.id });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    const totalClicks = url.clicks.length;
    const uniqueClicks = new Set(url.clicks.map((click) => click.ipAddress))
      .size;

    const clicksByDate = url.clicks.reduce((acc, click) => {
      const date = click.timestamp.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const osType = url.clicks.reduce((acc, click) => {
      const parser = new UAParser(click.userAgent);
      const os = parser.getOS().name;
      if (!acc[os]) {
        acc[os] = { uniqueClicks: 0, uniqueUsers: new Set() };
      }
      acc[os].uniqueClicks++;
      acc[os].uniqueUsers.add(click.ipAddress);
      return acc;
    }, {});

    const deviceType = url.clicks.reduce((acc, click) => {
      const parser = new UAParser(click.userAgent);
      const device = parser.getDevice().type || "desktop";
      if (!acc[device]) {
        acc[device] = { uniqueClicks: 0, uniqueUsers: new Set() };
      }
      acc[device].uniqueClicks++;
      acc[device].uniqueUsers.add(click.ipAddress);
      return acc;
    }, {});

    res.json({
      totalClicks,
      uniqueClicks,
      clicksByDate: Object.entries(clicksByDate).map(([date, count]) => ({
        date,
        count,
      })),
      osType: Object.entries(osType).map(([osName, data]) => ({
        osName,
        uniqueClicks: data.uniqueClicks,
        uniqueUsers: data.uniqueUsers.size,
      })),
      deviceType: Object.entries(deviceType).map(([deviceName, data]) => ({
        deviceName,
        uniqueClicks: data.uniqueClicks,
        uniqueUsers: data.uniqueUsers.size,
      })),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getTopicAnalytics = async (req, res) => {
  try {
    const { topic } = req.params;
    const urls = await Url.find({ userId: req.user.id, topic });

    const totalClicks = urls.reduce((sum, url) => sum + url.clicks.length, 0);
    const uniqueClicks = new Set(
      urls.flatMap((url) => url.clicks.map((click) => click.ipAddress))
    ).size;

    const clicksByDate = urls
      .flatMap((url) => url.clicks)
      .reduce((acc, click) => {
        const date = click.timestamp.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

    res.json({
      totalClicks,
      uniqueClicks,
      clicksByDate: Object.entries(clicksByDate).map(([date, count]) => ({
        date,
        count,
      })),
      urls: urls.map((url) => ({
        shortUrl: `${process.env.BASE_URL}/${url.shortUrl}`,
        totalClicks: url.clicks.length,
        uniqueClicks: new Set(url.clicks.map((click) => click.ipAddress)).size,
      })),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getOverallAnalytics = async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id });

    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks.length, 0);
    const uniqueClicks = new Set(
      urls.flatMap((url) => url.clicks.map((click) => click.ipAddress))
    ).size;

    const clicksByDate = urls
      .flatMap((url) => url.clicks)
      .reduce((acc, click) => {
        const date = click.timestamp.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

    const osType = urls
      .flatMap((url) => url.clicks)
      .reduce((acc, click) => {
        const parser = new UAParser(click.userAgent);
        const os = parser.getOS().name;
        if (!acc[os]) {
          acc[os] = { uniqueClicks: 0, uniqueUsers: new Set() };
        }
        acc[os].uniqueClicks++;
        acc[os].uniqueUsers.add(click.ipAddress);
        return acc;
      }, {});

    const deviceType = urls
      .flatMap((url) => url.clicks)
      .reduce((acc, click) => {
        const parser = new UAParser(click.userAgent);
        const device = parser.getDevice().type || "desktop";
        if (!acc[device]) {
          acc[device] = { uniqueClicks: 0, uniqueUsers: new Set() };
        }
        acc[device].uniqueClicks++;
        acc[device].uniqueUsers.add(click.ipAddress);
        return acc;
      }, {});

    res.json({
      totalUrls,
      totalClicks,
      uniqueClicks,
      clicksByDate: Object.entries(clicksByDate).map(([date, count]) => ({
        date,
        count,
      })),
      osType: Object.entries(osType).map(([osName, data]) => ({
        osName,
        uniqueClicks: data.uniqueClicks,
        uniqueUsers: data.uniqueUsers.size,
      })),
      deviceType: Object.entries(deviceType).map(([deviceName, data]) => ({
        deviceName,
        uniqueClicks: data.uniqueClicks,
        uniqueUsers: data.uniqueUsers.size,
      })),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
