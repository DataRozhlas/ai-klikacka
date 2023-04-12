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

console.log("Fotek:", photos.length);
console.log("Kliků:", items.length);
console.log("Uživatelů (jednotlivých her):", uniqueIDs.size);
console.log(
  "Kliknutí na uživatele:",
  Math.round((items.length / uniqueIDs.size) * 100) / 100
);
console.log("Průměrná úspěšnost:", calculateTruePercentage(answers), "%");
console.log("Fotky podle úspěšnosti:");
sortedPhotoSuccess.forEach((photo) => {
  console.log(photo.photo, photo.percentage, "%");
});
