const { extractAccountTweets } = require("../services/tweets.services");
const logger = require("../../../utils/logger");

module.exports = {
  async getAccountTweets(req, res) {
    try {
      const tweets = await extractAccountTweets(req.params.accountHandler, req.query.startDate, req.query.endDate);
      res.status(200).json(tweets);
    } catch (err) {
      logger.error(`Error happened in getAccountTweets controller. ${err}`);
      res.status(500).json({
        error: err
      });
    }
  }
};
