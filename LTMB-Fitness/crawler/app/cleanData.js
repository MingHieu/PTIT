const puppeteer = require('puppeteer');
const { getRandomInt, readFile, appendDataToFile } = require('./utils.js');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const types = ['arm', 'back', 'chest', 'leg', 'shoulder', 'stomach'];

  for (const type of types) {
    const data = await readFile('./app/data/' + type + '.json');
    const cleanedData = await cleanData(data, page, type);
    await appendDataToFile('./app/data_clean/' + type + '.json', cleanedData);
  }

  await browser.close();
})();

const KEY_SEARCH = 'Workout No Watermark Image Free Stock 4k';

async function cleanData(jsonArray, page, type) {
  for (const obj of jsonArray) {
    try {
      const searchQuery = obj.name + ' ' + KEY_SEARCH;
      await page.goto('https://www.google.com/imghp');
      await page.type('textarea.gLFyf', searchQuery);
      await page.keyboard.press('Enter');
      await page.waitForNavigation();
      await page.waitForSelector(`div[data-q="${searchQuery}"] img`);
      await page.click(`div[data-q="${searchQuery}"] img`);
      await page.waitForSelector(
        `div[data-query="${searchQuery}"] img:nth-child(2)`
      );
      const imageUrl = await page.$eval(
        `div[data-query="${searchQuery}"] img:nth-child(2)`,
        (img) => img.src
      );
      obj.thumbnail = imageUrl;
      obj.muscle = type;
      obj.kcal = getRandomInt(50, 150);
      obj.duration = getRandomInt(10, 30);
      obj.level = obj.difficulty;
      delete obj.difficulty;
    } catch (e) {
      console.log('Error: ' + e.message);
    }
  }
  return jsonArray;
}
