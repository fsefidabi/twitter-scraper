const puppeteer = require("puppeteer");
const logger = require("./logger");

module.exports = {
  async startChromium() {
    try {
      logger.debug("Opening the browser");
      return await puppeteer.launch({
        headless: true,
        args: [
          "--disable-setuid-sandbox"
        ],
        "ignoreHTTPSErrors": true,
        "ignoreDefaultArgs": ["--enable-automation"]
      });
    } catch (err) {
      logger.error(`Could not create a browser instance => : ${err}`);
    }
  },

  async validateAccountHandler(page) {
    await page.waitForNetworkIdle("networkidle0");
    return await page.evaluate(() => {
      const invalidAccountHandler = document.querySelector("div[data-testid=emptyState]")?.innerText;
      if (invalidAccountHandler) {
        return {
          error: true,
          message: "This account doesn’t exist",
          status: 404
        };
      } else {
        return {
          error: false,
          status: 200
        };
      }
    });
  }
};
