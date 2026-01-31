const db = require('../models');
console.log('Loaded models:', Object.keys(db));
console.log('db.Analytics:', db.Analytics);
const Analytics = db.Analytics;
const { Op } = require('sequelize');

// Helper to get YYYY-MM-DD
function getToday() {
  return new Date().toISOString().slice(0, 10);
}
function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// Middleware to track each visit (daily)
exports.trackVisit = async (req, res, next) => {
  try {
    const today = getToday();
    let analytics = await Analytics.findByPk(today);
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (!analytics) {
      analytics = await Analytics.create({
        date: today,
        hits: 1,
        uniqueVisitors: 1,
        uniqueIps: JSON.stringify([ip]),
      });
    } else {
      analytics.hits += 1;
      let ips = [];
      try { ips = JSON.parse(analytics.uniqueIps || '[]'); } catch { ips = []; }
      if (!ips.includes(ip)) {
        ips.push(ip);
        analytics.uniqueVisitors += 1;
      }
      analytics.uniqueIps = JSON.stringify(ips);
      await analytics.save();
    }
    if (!analytics._options.isNewRecord) await analytics.save();
    next();
  } catch (err) {
    console.error('Analytics trackVisit error:', err);
    next();
  }
};

// Controller to get analytics summary (today, yesterday, increase)
exports.getSummary = async (req, res) => {
  try {
    const today = getToday();
    const yesterday = getYesterday();
    const [todayStats, yesterdayStats] = await Promise.all([
      Analytics.findByPk(today),
      Analytics.findByPk(yesterday),
    ]);
    const hitsToday = todayStats ? todayStats.hits : 0;
    const visitorsToday = todayStats ? todayStats.uniqueVisitors : 0;
    const hitsYesterday = yesterdayStats ? yesterdayStats.hits : 0;
    const visitorsYesterday = yesterdayStats ? yesterdayStats.uniqueVisitors : 0;
    // Calculate increase (absolute and percent)
    const hitsIncrease = hitsYesterday ? hitsToday - hitsYesterday : hitsToday;
    const hitsPercent = hitsYesterday ? ((hitsToday - hitsYesterday) / hitsYesterday) * 100 : 100;
    const visitorsIncrease = visitorsYesterday ? visitorsToday - visitorsYesterday : visitorsToday;
    const visitorsPercent = visitorsYesterday ? ((visitorsToday - visitorsYesterday) / visitorsYesterday) * 100 : 100;
    res.json({
      hits: hitsToday,
      visitors: visitorsToday,
      hitsIncrease,
      hitsPercent: Math.round(hitsPercent),
      visitorsIncrease,
      visitorsPercent: Math.round(visitorsPercent),
      lastUpdated: todayStats ? todayStats.updatedAt : null,
    });
  } catch (err) {
    console.error('Analytics getSummary error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

exports.getTrends = async (req, res) => {
  try {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 29);
    const startStr = startDate.toISOString().slice(0, 10);
    const analytics = await Analytics.findAll({
      where: { date: { [Op.gte]: startStr } },
      order: [['date', 'ASC']],
    });
    const trends = analytics.map(a => ({
      date: a.date,
      hits: a.hits,
      visitors: a.uniqueVisitors,
    }));
    res.json({ trends });
  } catch (err) {
    console.error('Analytics getTrends error:', err);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
}; 