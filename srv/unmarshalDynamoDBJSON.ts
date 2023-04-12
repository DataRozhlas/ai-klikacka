import { readLines } from "./deps.ts";

type DynamoDBAttributeValue =
  | { S: string }
  | { N: string }
  | { B: string }
  | { SS: string[] }
  | { NS: string[] }
  | { BS: string[] }
  | { M: DynamoDBItem }
  | { L: DynamoDBAttributeValue[] }
  | { NULL: boolean }
  | { BOOL: boolean };

type DynamoDBItem = {
  [key: string]: DynamoDBAttributeValue;
};

function unmarshallDynamoDBItem(item: DynamoDBItem): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  // Define an array with the desired property keys
  const desiredProperties = ["photo", "uid", "timestamp", "result"];

  for (const [key, value] of Object.entries(item)) {
    // Check if the current key is one of the desired properties
    if (desiredProperties.includes(key)) {
      const valueType = Object.keys(value)[0] as keyof DynamoDBAttributeValue;
      result[key] = value[valueType];
    }
  }

  return result;
}

async function unmarshalDynamoDBJSON(
  inputFilePath: string,
  outputFilePath: string
) {
  const inputFile = await Deno.open(inputFilePath, { read: true });
  const outputFile = await Deno.open(outputFilePath, {
    write: true,
    create: true,
    truncate: true,
  });

  let isFirst = true;

  outputFile.write(new TextEncoder().encode("["));

  for await (const line of readLines(inputFile)) {
    if (line.trim() === "") continue;

    let itemString = line.trim();
    if (itemString.endsWith(",")) {
      itemString = itemString.slice(0, -1);
    }

    const dynamoItem = JSON.parse(itemString).Item as DynamoDBItem;
    const unmarshalledItem = unmarshallDynamoDBItem(dynamoItem);

    if (!isFirst) {
      outputFile.write(new TextEncoder().encode(",\n"));
    }

    outputFile.write(
      new TextEncoder().encode(JSON.stringify(unmarshalledItem))
    );
    isFirst = false;
  }

  outputFile.write(new TextEncoder().encode("]"));

  outputFile.close();
  inputFile.close();
}

const inputFilePath = "./data/3tgarhfgtqyx3gjikhal4jeg4u.json";
const outputFilePath = "./data/unmarshalled.json";

await unmarshalDynamoDBJSON(inputFilePath, outputFilePath);
