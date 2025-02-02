const { appendDataToFile } = require('./app/utils.js');
const getOutputFileName = require('./app/getOutputFileName.js');
const filterDistinctAndRewrite = require('./app/filterDistinct.js');
const fetch = require('node-fetch');

const API_URL = 'https://api.api-ninjas.com/v1/exercises';
const API_KEY = 't2PSu7tZiqZDwdBdrePROg==ZGt65ICbaf6KBWQH';

const getWorkouts = async (muscle) => {
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch(API_URL + `?muscle=${muscle}&&offset=${i}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': API_KEY,
        },
      });
      const data = await res.json();
      appendDataToFile(getOutputFileName(muscle), data);
    } catch (error) {}
  }
  filterDistinctAndRewrite(getOutputFileName(muscle));
};

/**
 * traps
 * chest
 * biceps, forearms, triceps
 * lats, lower_back, middle_back
 * abdominals
 * abductors,adductors,calves,glutes,hamstrings,quadriceps
 */

// getWorkouts('middle_back');

filterDistinctAndRewrite(getOutputFileName('abductors'));
