type Item = {
  uid: string;
  photo: string;
  timestamp: string;
  result: boolean;
};

function calculateTruePercentage(boolArray: boolean[]): number {
  // Count the number of true values in the array
  const trueCount = boolArray.filter((value) => value).length;

  // Divide the count of true values by the total number of elements in the array
  const trueFraction = trueCount / boolArray.length;

  // Multiply the result by 100 to get the percentage
  const truePercentage = trueFraction * 100;

  return Math.round(truePercentage * 100) / 100;
}

const data = await Deno.readTextFile("data/unmarshalled.json");
const items = JSON.parse(data);

const uniqueIDs = new Set(items.map((item: Item) => item.uid));
const photos = Array.from(new Set(items.map((item: Item) => item.photo)));
const answers = items.map((item: Item) => item.result);

const photoSuccess = photos.map((photo) => {
  const photoItems = items.filter((item: Item) => item.photo === photo);
  const photoAnswers = photoItems.map((item: Item) => item.result);
  const photoPercentage = calculateTruePercentage(photoAnswers);
  return {
    photo: photo,
    percentage: photoPercentage,
  };
});

const sortedPhotoSuccess = photoSuccess.sort(
  (a, b) => a.percentage - b.percentage
);

const AIphotos = items
  .filter((item: Item) => item.photo.includes(".png"))
  .map((item: Item) => item.result);
const humanPhotos = items
  .filter((item: Item) => item.photo.includes(".jpg"))
  .map((item: Item) => item.result);

//kolik lidí dokončilo
const completeGames = Array.from(uniqueIDs).reduce(
  (acc: number, uid): number => {
    const gameLength = items.filter((item: Item) => item.uid === uid);
    if (gameLength.length === 21) {
      return acc + 1;
    }
    return acc;
  },
  0
);

//kolik lidí trefilo všechno

// const successPerUser = Array.from(uniqueIDs).map((uid, index) => {
//   const userResults = items
//     .filter((item: Item) => item.uid === uid)
//     .map((result: Item) => result.result);
//   console.log(index);
//   if (userResults.length === 21) {
//     const result = calculateTruePercentage(userResults);
//     return result;
//   }
//   return -1;
// });

// const users100 = successPerUser.filter(
//   (result: number): boolean => result === 100
// );

console.log("Fotek:", photos.length);
console.log("Klikanců:", items.length);
console.log("Uživatelů (jednotlivých her):", uniqueIDs.size);
console.log("Dokončených her:", completeGames);
console.log(
  "Kliknutí na uživatele:",
  Math.round((items.length / uniqueIDs.size) * 100) / 100
);
// console.log("Uživatelé s úspěšností 100 %:", users100.length);
console.log("Průměrná úspěšnost:", calculateTruePercentage(answers), "%");
console.log(
  "Úspěšnost u fotek generovaných AI:",
  calculateTruePercentage(AIphotos),
  "%"
);
console.log(
  "Úspěšnost u fotek od fotografů:",
  calculateTruePercentage(humanPhotos),
  "%"
);
console.log("Fotky podle úspěšnosti:");
sortedPhotoSuccess.forEach((photo) => {
  console.log(photo.photo, photo.percentage, "%");
});
