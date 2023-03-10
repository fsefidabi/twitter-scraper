const { extractAccountInfo } = require("../services/account.services");
const logger = require("../../../utils/logger");

module.exports = {
  async getAccountInfo(req, res) {
    try {
      const accountDetail = await extractAccountInfo(req.params.accountHandler, req.query.startDate, req.query.endDate);
      res.status(accountDetail.status || 200).json(accountDetail);
    } catch (err) {
      logger.error(`Error happened in getAccountsInfo controller. ${err}`);
      res.status(500).json({
        error: err
      });
    }
  }
};
