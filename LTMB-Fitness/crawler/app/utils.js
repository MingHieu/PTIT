const fs = require('fs');

const delay = (time) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};

const getRandomInt = (min, max) => {
  // Generate a random floating-point number between 0 (inclusive) and 1 (exclusive)
  const randomFloat = Math.random();

  // Scale the random floating-point number to the desired range
  const scaledRandomFloat = randomFloat * (max - min + 1);

  // Floor the scaled random number to get an integer within the range [min, max]
  const randomInt = Math.floor(scaledRandomFloat) + min;

  return randomInt;
};

const readFile = async (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
};

const writeFile = async (filePath, data) => {
  return new Promise((resolve, reject) => {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
      if (err) {
        if (err) reject(err);
        else resolve();
      }
    });
  });
};

const appendDataToFile = async (filePath, newData) => {
  try {
    const data = await readFile(filePath);
    if (!Array.isArray(data)) {
      console.error('Error: File does not contain an array.');
      return;
    }
    const updatedData = data.concat(newData);
    writeFile(filePath, updatedData);
  } catch (error) {
    console.log('File does not exist, creating a new one...');
    writeFile(filePath, newData);
  }
};

module.exports = {
  delay,
  getRandomInt,
  readFile,
  writeFile,
  appendDataToFile,
};
