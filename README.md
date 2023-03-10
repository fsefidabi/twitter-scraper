# Twitter Scraper

## Project Overview
This project is a Twitter scraper that crawls user profile page and extract account's info and tweets. It supports auto scrolling and infinite scroll.

## Technologies used
- Node.js
- Express
- Puppeteer
- Pino

## Endpoints

### 1. /account
`/account/:accountHandler?startDate=2023-01-01&endDate=2023-02-30`

| params/queryString  | Type     | Required |
| :---:               | :---:    | :---:    |
| accountHandler      | params   | Yes      |
| startDate           | qs       | No       |
| endDate             | qs       | No       |




**Example**:

`/account/:alikarimi_ak8?startDate=2023-01-01&endDate=2023-02-30`
`

**Response:**

```json
{
  "accountHandler": "alikarimi_ak8",
  "fullName": "ali karimi",
  "hasVerifiedBlueCheck": true,
  "totalTweetsCount": 150,
  "jointDate": "December 2017",
  "birthDate": "November 8",
  "location": "تهران،ایران",
  "personalWebLink": "https://t.co/JOFTSquoBu",
  "followersCount": "31",
  "followingCount": "1.7M",
  "profileBannerUrl": "https://twitter.com/alikarimi_ak8/header_photo",
  "profileImageUrl": "https://twitter.com/alikarimi_ak8/photo",
  "tweets": {
    "startDate": "2023-01-01",
    "endDate": "2023-02-30",
    "tweets": [
      {
        "tweetText": "روز زن مبارک،خیلی زنی",
        "hashtags": [
          "#مهسا_امینی",
          "#زن_زندگی_آزادی",
          "#اتحاد_رمز_پیروزی"
        ],
        "tweetHasImage": true,
        "tweetImageUrl": "https://pbs.twimg.com/media/FqtFvAJWIAEFbMM?format=jpg&name=small",
        "replyCount": "765",
        "retweetCount": "6,582",
        "likeCount": "49.7K",
        "viewCount": "525.4K",
        "retweeted": false,
        "tweetedBy": "alikarimi_ak8",
        "publishedDateText": "Mar 8"
      },
      //...
    ]
  }
}
```

### 2. /tweets
`/tweets/:accountHandler?startDate=2023-01-01&endDate=2023-02-30`

| params/queryString  | Type     | Required |
| :---:               | :---:    | :---:    |
| accountHandler      | params   | Yes      |
| startDate           | qs       | No       |
| endDate             | qs       | No       |


**Example**:

`/tweets/:alikarimi_ak8?startDate=2023-01-01&endDate=2023-02-30`
`

**Response:**

```json
{
  "startDate": "2023-01-01",
  "endDate": "2023-02-30",
  "tweets": [
    {
      "tweetText": "روز زن مبارک،خیلی زنی",
      "hashtags": [
        "#مهسا_امینی",
        "#زن_زندگی_آزادی",
        "#اتحاد_رمز_پیروزی"
      ],
      "tweetHasImage": true,
      "tweetImageUrl": "https://pbs.twimg.com/media/FqtFvAJWIAEFbMM?format=jpg&name=small",
      "replyCount": "765",
      "retweetCount": "6,582",
      "likeCount": "49.7K",
      "viewCount": "525.4K",
      "retweeted": false,
      "tweetedBy": "alikarimi_ak8",
      "publishedDateText": "Mar 8"
    },
    //...
  ]
}
```


## Usage
```bash
# clone and install dependencies
$ git clone https://github.com/fsefidabi/twitter-scraper.git
$ cd twitter-scraper
$ npm install

# start project for production
$ npm run start

# run project for development
$ npm run dev
```
