const { readFile, writeFile } = require('./utils');

const filterDistinctAndRewrite = async (filePath) => {
  const data = await readFile(filePath);
  const distinctItems = [];
  for (let i = 0; i < data.length; i++) {
    const currentItem = data[i];
    let isDuplicate = false;
    for (let j = 0; j < i; j++) {
      if (data[j].name === currentItem.name) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      distinctItems.push(currentItem);
    }
  }
  writeFile(filePath, distinctItems);
};

module.exports = filterDistinctAndRewrite;
