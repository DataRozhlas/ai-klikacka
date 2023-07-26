import { useState, useEffect } from "preact/hooks";
import {
  Container,
  Box,
  Stack,
  Heading,
  Center,
  Image,
  Button,
  ButtonGroup,
  Stat,
  StatLabel,
  StatNumber,
  CircularProgress,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import data from "./assets/data.json";
import "./app.css";
import ResultsContainer from "./components/ResultsContainer";
import useWindowsDimensions from "./hooks/useWindowsDimensions";
import { usePostMessageWithHeight } from "./hooks/usePostHeightMessage";

// Define types
type Image = {
  file: string;
  ai: boolean;
  description: string;
};

// Helper function to get a random index
function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

// Function to get a random image and update the "seen" state
function getRandomImage(images: Image[], seen: Set<number>): Image {
  // Filter images to only include unseen images
  const unseenImages = images.filter((image, index) => !seen.has(index));

  // Get a random index from the unseen images
  const randomIndex = 0;

  // Get the random image
  const randomImage = unseenImages[randomIndex];
  return randomImage;
}

function handleButtonClick(
  event: PointerEvent,
  image: Image,
  answers: boolean[],
  setAnswers: (answers: boolean[]) => void,
  uid: string
) {
  event.preventDefault();
  const target = event.currentTarget as HTMLButtonElement;
  let result;
  switch (target.id) {
    case "ai-button":
      result = image?.ai === true;
      setAnswers([...answers, result]);
      break;
    case "photographer-button":
      result = image?.ai === false;
      setAnswers([...answers, result]);
      break;
    default:
      result = false;
      setAnswers([...answers, result]);
      break;
  }
  const http = new XMLHttpRequest();
  const url =
    "https://6vie3qffydjfjp6hsyy553piqq0zeata.lambda-url.eu-central-1.on.aws/";
  http.open("POST", url);
  http.send(
    JSON.stringify({
      uid: uid,
      photo: image.file,
      result: result,
      url: document.URL,
      ref: document.referrer,
    })
  );
}

const formatter = new Intl.NumberFormat("cs-CZ", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export function App() {
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const [image, setImage] = useState(getRandomImage(data, seen));
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [uid, setUid] = useState<string>(crypto.randomUUID());

  useEffect(() => {
    if (answers.length > 0 && answers.length < data.length) {
      const newImage = getRandomImage(data, seen);
      setImage(newImage);
    }
    postHeightMessage();
  }, [answers]);

  useEffect(() => {
    const newIndex = data.indexOf(image);
    setSeen((prevSeen) => {
      return prevSeen.add(newIndex);
    });
  }, [image]);

  const { height, width } = useWindowsDimensions();
  const { containerRef, postHeightMessage } =
    usePostMessageWithHeight("ai-klikacka");

  return (
    <Container maxW={"620px"} centerContent p={0} ref={containerRef}>
      <Stack spacing={4} w={"100%"}>
        {answers.length < data.length && (
          <>
            <Heading as={"h1"} size={["lg", "xl"]}>
              <Center>Kdo vytvořil tento obrázek?</Center>
            </Heading>{" "}
            <ButtonGroup
              size={"lg"}
              colorScheme={"red"}
              variant={"outline"}
              spacing={4}
              w={"100%"}
            >
              <Button
                w={"50%"}
                leftIcon={
                  <Icon icon="icons8:old-time-camera" width={36} height={36} />
                }
                id="photographer-button"
                onPointerDown={(event: PointerEvent) =>
                  handleButtonClick(event, image, answers, setAnswers, uid)
                }
              >
                Fotograf
              </Button>
              <Button
                w={"50%"}
                leftIcon={
                  <Icon icon="teenyicons:robot-solid" width={30} height={30} />
                }
                id="ai-button"
                onPointerDown={(event: PointerEvent) =>
                  handleButtonClick(event, image, answers, setAnswers, uid)
                }
              >
                {width > 450 ? "Umělá inteligence" : "AI"}
              </Button>
            </ButtonGroup>
            <Image
              src={`https://data.irozhlas.cz/ai-klikacka/${image?.file}`}
              borderRadius={8}
              fit="contain"
              fallback={
                <Box w={"100%"} style={"aspect-ratio:3/2;"}>
                  <Center>
                    <CircularProgress isIndeterminate color="red.600" />
                  </Center>
                </Box>
              }
            ></Image>
          </>
        )}
        {answers.length > 0 && (
          <Stack
            direction={"row"}
            bg={"gray.100"}
            px={2}
            py={1}
            spacing={2}
            borderRadius={8}
            justify={"space-evenly"}
          >
            <Box align={"center"}>
              <Stat>
                <StatLabel>Úspěšnost</StatLabel>
                <StatNumber>
                  {formatter.format(
                    (answers.filter((answer) => answer).length /
                      answers.length) *
                      100
                  )}{" "}
                  %
                </StatNumber>
              </Stat>
            </Box>
            <Box align={"center"}>
              <Stat>
                <StatLabel>Správně jste určili</StatLabel>
                <StatNumber>
                  {`${answers.filter((answer) => answer).length} / ${
                    answers.length
                  }`}
                </StatNumber>
              </Stat>
            </Box>
            <Box align={"center"}>
              <Stat>
                <StatLabel>Zbývá</StatLabel>
                <StatNumber>{data.length - answers.length}</StatNumber>
              </Stat>
            </Box>
          </Stack>
        )}
        {answers.length > 0 && (
          <ResultsContainer answers={answers} seen={seen} data={data} />
        )}
      </Stack>
    </Container>
  );
}
