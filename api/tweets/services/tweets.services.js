const userAgent = require("user-agents");
const { startChromium, validateAccountHandler } = require("../../../utils/scraper");
const logger = require("../../../utils/logger");
const { TWITTER_BASE_URL } = require("../../../constants");

module.exports = {
  async extractAccountTweets(accountHandler, startDate, endDate) {
    try {
      const accountUrl = `${TWITTER_BASE_URL}/${accountHandler}`;
      const browserInstance = await startChromium();
      const page = await browserInstance.newPage();
      await page.setUserAgent(userAgent.toString());
      logger.info(`Navigating to ${accountUrl}...`);
      await page.goto(accountUrl);
      const userValidationResult = await validateAccountHandler(page);

      if (userValidationResult.status === 200) {
        const tweets = await module.exports.scrapeAccountTweets(page, accountHandler, startDate, endDate);
        await browserInstance.close();
        logger.debug("Browser closed");
        return tweets;
      } else {
        await browserInstance.close();
        logger.debug("Browser closed");
        return userValidationResult;
      }
    } catch (err) {
      throw new Error(`Error happened in extractAccountTweets service. ${err}`);
    }
  },

  async scrapeAccountTweets(page, accountHandler, startDate, endDate) {
    try {
      await page.setViewport({ width: 1280, height: 926 });
      await page.waitForSelector("[data-testid=cellInnerDiv]");
      await page.waitForSelector("[data-testid=ScrollSnap-List]");
      await page.click("[data-testid=ScrollSnap-List] div:nth-child(1)");
      const tweets = await autoScroll(page, startDate, endDate);

      return {
        startDate: startDate || null,
        endDate: endDate || null,
        tweets: tweets
      };
    } catch (err) {
      return err;
    }

    async function autoScroll(page, startDate, endDate) {
      logger.info("Autoscroll started");
      logger.debug(`startDate is: ${startDate}`);
      logger.debug(`endDate is: ${endDate}`);

      const tweets = await page.evaluate((data) => {
        const threads = [];

        return new Promise((resolve, reject) => {
          try {
            let totalHeight = 0;
            const distance = 200;
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);

            const timer = setInterval(async () => {
              const tweetsElement = Array.from(document.querySelectorAll("article[data-testid=tweet]"));
              let reachedDateLimit = false;
              let twittedOutOfCorrectRangeDate = false;

              tweetsElement.forEach(tweetElement => {
                const postContent = tweetElement.querySelector("div[data-testid=tweetText]")?.innerText;
                const postContentCpy = postContent;
                const tweetText = postContentCpy?.replace(/#([^#]+)[\s,;]*/g, "").replace(/\n$/gm, "");
                const publishedDateText = tweetElement.querySelector("[data-testid=User-Names] > div:nth-child(2) div > div:nth-child(3)")?.innerText;
                const publishedDate = new Date(`${publishedDateText} 2023`);

                if (startDate) {
                  reachedDateLimit = publishedDate <= startDate;
                }
                if (endDate) {
                  twittedOutOfCorrectRangeDate = publishedDate > endDate;
                }

                if (!reachedDateLimit && !twittedOutOfCorrectRangeDate) {
                  for (let i = 0; i < threads.length; i++) {
                    if (threads[i].tweetText === tweetText) return;
                  }

                  const hashtags = postContent?.replace(/(\r\n|\n|\r|\s)/gm, "").match(/#([^#]+)[\s,;]*/g) || [];
                  const tweetHasImage = !!tweetElement.querySelector("[data-testid=tweetPhoto] img");
                  const tweetImageUrl = tweetElement.querySelector("[data-testid=tweetPhoto] img")?.src || null;
                  const replyCount = tweetElement.querySelector("div[data-testid=reply]")?.innerText;
                  const retweetCount = tweetElement.querySelector("div[data-testid=retweet]")?.innerText;
                  const likeCount = tweetElement.querySelector("div[data-testid=like]")?.innerText;
                  const viewCountElement = Array.from(tweetElement.querySelectorAll("span[data-testid=app-text-transition-container]"));
                  const viewCount = viewCountElement[viewCountElement.length - 1]?.innerText;
                  const retweeted = tweetElement.querySelector("[data-testid=socialContext]")?.innerText?.includes("Retweeted") || false;
                  const tweetedBy = tweetElement.querySelector("[data-testid=User-Names] > div:nth-child(2) div > div:nth-child(1)")?.innerText?.replace("@", "");

                  threads.push({
                    tweetText,
                    hashtags,
                    tweetHasImage,
                    tweetImageUrl,
                    replyCount,
                    retweetCount,
                    likeCount,
                    viewCount,
                    retweeted,
                    tweetedBy,
                    publishedDateText
                  });
                }
              });

              let scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if (totalHeight >= scrollHeight || reachedDateLimit) {
                clearInterval(timer);
                resolve(threads);
              }
            }, 100);
          } catch (err) {
            reject(err);
          }
        });
      }, { startDate, endDate });

      logger.info("Autoscroll ended");
      return tweets;
    }
  }
};
