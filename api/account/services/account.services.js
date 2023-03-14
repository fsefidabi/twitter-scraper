const userAgent = require("user-agents");
const { startChromium, validateAccountHandler } = require("../../../utils/scraper");
const logger = require("../../../utils/logger");
const { TWITTER_BASE_URL } = require("../../../constants");
const { scrapeAccountTweets } = require("../../tweets/services/tweets.services");

module.exports = {
  async extractAccountInfo(accountHandler, startDate, endDate) {
    try {
      const browserInstance = await startChromium();
      const accountUrl = `${TWITTER_BASE_URL}/${accountHandler}`;
      const page = await browserInstance.newPage();
      await page.setUserAgent(userAgent.toString());
      logger.info(`Navigating to ${accountUrl}...`);
      await page.goto(accountUrl);
      const userValidationResult = await validateAccountHandler(page);

      if (userValidationResult.status === 200) {
        const accountsInfo = await scrapeAccountGeneralInfo(page, accountHandler, startDate, endDate);
        await browserInstance.close();
        logger.debug("Browser closed");
        return accountsInfo;
      } else {
        await browserInstance.close();
        logger.debug("Browser closed");
        return userValidationResult;
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
};

async function scrapeAccountGeneralInfo(page, accountHandler, startDate, endDate) {
  await page.waitForSelector("[data-testid=primaryColumn]");
  await page.waitForSelector("[data-testid=UserName]");

  const userData = await page.evaluate(() => {
    const fullNameElement = document.querySelector("div[data-testid=UserName] span span");
    const verifiedBlueCheckElement = document.querySelector("div[data-testid=UserName] svg[data-testid=icon-verified]");
    const totalTweetsCountElement = document.querySelector("div[data-testid=primaryColumn] h2 + div");
    const jointDateElement = document.querySelector("div[data-testid=UserProfileHeader_Items] span[data-testid=UserJoinDate] span");
    const birthDateElement = document.querySelector("div[data-testid=UserProfileHeader_Items] span[data-testid=UserBirthdate]");
    const locationElement = document.querySelector("div[data-testid=UserProfileHeader_Items] span[data-testid=UserLocation] span span");
    const personalWebLinkElement = document.querySelector("div[data-testid=UserProfileHeader_Items] a[data-testid=UserUrl]");
    const followersCountElement = document.querySelector("div[data-testid=primaryColumn] > div > div:nth-child(3) a ~ div > div:nth-child(5) div:nth-child(1) a span:nth-child(1) span");
    const followingCountElement = document.querySelector("div[data-testid=primaryColumn] > div > div:nth-child(3) a ~ div > div:nth-child(5) div:nth-child(2) a span:nth-child(1) span");
    const profileBannerUrlElement = document.querySelector("div[data-testid=primaryColumn] > div > div:nth-child(3) a");
    const profileImageUrlElement = document.querySelector("div[data-testid=primaryColumn] > div > div:nth-child(3) a ~ div div:nth-child(1) a");

    return {
      fullName: fullNameElement ? fullNameElement.innerText : null,
      hasVerifiedBlueCheck: !!verifiedBlueCheckElement,
      totalTweetsCount: totalTweetsCountElement ? parseInt(totalTweetsCountElement.innerHTML) : null,
      jointDate: jointDateElement ? jointDateElement.innerHTML.replace("Joined ", "") : null,
      birthDate: birthDateElement !== null ? birthDateElement.innerText.replace("Born ", "") : null,
      location: locationElement ? locationElement.innerHTML : null,
      personalWebLink: personalWebLinkElement ? personalWebLinkElement.href : null,
      followersCount: followersCountElement ? followersCountElement.innerHTML : null,
      followingCount: followingCountElement ? followingCountElement.innerHTML : null,
      profileBannerUrl: profileBannerUrlElement ? profileBannerUrlElement.href : null,
      profileImageUrl: profileImageUrlElement ? profileImageUrlElement.href : null
    };
  });

  const tweets = await scrapeAccountTweets(page, accountHandler, startDate, endDate);

  return {
    accountHandler: accountHandler,
    fullName: userData.fullName,
    hasVerifiedBlueCheck: userData.hasVerifiedBlueCheck,
    totalTweetsCount: userData.totalTweetsCount,
    jointDate: userData.jointDate,
    birthDate: userData.birthDate,
    location: userData.location,
    personalWebLink: userData.personalWebLink,
    followersCount: userData.followersCount,
    followingCount: userData.followingCount,
    profileBannerUrl: userData.profileBannerUrl,
    profileImageUrl: userData.profileImageUrl,
    tweets: tweets
  };
}
