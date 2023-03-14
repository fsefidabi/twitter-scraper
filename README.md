# Twitter Scraper

## Project Overview
This project is a Twitter scraper that crawls user profile page and extract account's info and tweets. It supports auto scrolling and infinite scroll.

## Technologies used
- Node.js
- Express
- Puppeteer
- Pino

## Endpoints

-  /api/account/:accountHandler
-  /api/tweets/:accountHandler

Check out swagger documentation for more information at `/api-docs` route.

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
