const puppeteer = require('puppeteer');
const { getRandomInt, readFile, appendDataToFile } = require('./utils.js');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const types = ['arm', 'back', 'chest', 'leg', 'shoulder', 'stomach'];

  for (const type of types) {
    const data = await readFile('./app/data_clean/' + type + '.json');
    const cleanedData = await cleanData(data, page);
    await appendDataToFile('./app/data_clean_2/' + type + '.json', cleanedData);
  }

  await browser.close();
})();

const KEY_SEARCH = 'Workout 4K Video';

async function cleanData(jsonArray, page) {
  for (const obj of jsonArray) {
    try {
      let searchQuery = obj.name + ' ' + KEY_SEARCH;
      searchQuery = searchQuery.replace(/ /g, '+');
      await page.goto(
        `https://www.youtube.com/results?search_query=${searchQuery}`
      );
      await page.waitForSelector('a#video-title');
      await page.waitForSelector('ytd-video-renderer a#thumbnail img');
      const videoUrl = await page.$eval(`a#video-title`, (a) => a.href);
      const imageUrl = await page.$eval(
        `ytd-video-renderer a#thumbnail img`,
        (a) => a.src
      );
      obj.video = videoUrl;
      obj.thumbnail = imageUrl;
      console.log(videoUrl);
    } catch (e) {
      console.log('Error: ' + e.message);
    }
  }
  return jsonArray;
}
