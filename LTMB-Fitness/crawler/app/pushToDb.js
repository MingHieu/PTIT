const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { readFile } = require('./utils');
const serviceAccount = require('./fitness-44de6-firebase-adminsdk-1j11s-07c7ec7433.json');

(async () => {
  initializeApp({
    credential: cert(serviceAccount),
  });
  const db = getFirestore();
  const batch = db.batch();

  const types = ['arm', 'back', 'chest', 'leg', 'shoulder', 'stomach'];
  for (const type of types) {
    const data = await readFile('./app/data_clean/' + type + '.json');
    const groupItemByEquipmentAndLevel = groupBy(data, (item) => [
      item.equipment,
      item.level,
    ]);
    for (const groupItem of groupItemByEquipmentAndLevel) {
      const workoutPlans = {
        name:
          type.charAt(0).toUpperCase() +
          type.slice(1) +
          ' with ' +
          groupItem[0].equipment,
        description: `This ${type} workout plan utilizes various machines to target and strengthen different muscle groups in your ${type}. ${groupItem[0].equipment} offer controlled movements and adjustable resistance, making them ideal for individuals of all ${groupItem[0].level} levels. Incorporating these exercises into your routine can help improve your body strength, stability, and overall muscular development.`,
        thumbnail: groupItem[0].thumbnail,
        level: groupItem[0].level,
        duration: groupItem.reduce((prev, curr) => prev + curr.duration, 0),
        kcal: groupItem.reduce((prev, curr) => prev + curr.kcal, 0),
        muscle: groupItem[0].muscle,
        workouts: [],
      };
      for (const item of groupItem) {
        const docRef = db.collection('workouts').doc();
        batch.set(docRef, item);
        workoutPlans.workouts.push(docRef);
      }
      batch.set(db.collection('workout_plans').doc(), workoutPlans);
    }
  }

  batch.commit();
})();

var groupBy = (array, f) => {
  let groups = {};
  array.forEach(function (o) {
    var group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(function (group) {
    return groups[group];
  });
};
