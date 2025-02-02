const getOutputFileName = (muscle) => {
  switch (muscle.toLowerCase()) {
    case 'traps':
      return 'shoulder.json';
    case 'chest':
      return 'chest.json';
    case 'biceps':
    case 'forearms':
    case 'triceps':
      return 'arm.json';
    case 'lats':
    case 'lower_back':
    case 'middle_back':
      return 'back.json';
    case 'abdominals':
      return 'stomach.json';
    case 'abductors':
    case 'adductors':
    case 'calves':
    case 'glutes':
    case 'hamstrings':
    case 'quadriceps':
      return 'leg.json';
    default:
      return null; // If the muscle is not found in the mapping
  }
};

module.exports = getOutputFileName;
