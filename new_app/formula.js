export const categoryPAL = {
  endurance: 2.65,    // 2.4–2.9
  strength: 2.3,      // 2.0–2.6
  team: 2.4,          // 2.2–2.6
  skill: 1.95         // 1.7–2.2
};

export function calculateBMR(weight, height, age, sex) {
  if (sex === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateTDEE(bmr, sportCategory) {
  const pal = categoryPAL[sportCategory];
  return bmr * pal;
}

export function adjustCaloriesForGoal(tdee, goal) {
  if (goal === "weight_loss") return tdee - 500;
  if (goal === "muscle_gain") return tdee + 300;
  return tdee;
}

export function calculateMacros(weight, calories) {
  const carbs = weight * 5;  
  const protein = weight * 1.8;  
  const fat = (calories * 0.25) / 9;  
  return { carbs, protein, fat };
}
