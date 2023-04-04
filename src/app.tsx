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

// Define types
type Image = {
  file: string;
  ai: boolean;
  description: string;
};

type SeenState = {
  seen: Set<number>;
  setSeen: (seen: Set<number>) => void;
};

type ImageState = {
  image: Image | undefined;
  setImage: (image: Image | undefined) => void;
};

type AnswersState = {
  answers: boolean[];
  setAnswers: (answers: boolean[]) => void;
};

// Helper function to get a random index
function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

// Function to get a random image and update the "seen" state
function getRandomImage(
  images: Image[],
  { seen, setSeen }: SeenState
): Image | undefined {
  // Filter images to only include unseen images
  const unseenImages = images.filter((image, index) => !seen.has(index));

  // If there are no unseen images left, return undefined
  if (unseenImages.length === 0) {
    return undefined;
  }

  // Get a random index from the unseen images
  const randomIndex = getRandomIndex(unseenImages.length);

  // Get the random image
  const randomImage = unseenImages[randomIndex];

  return randomImage;
}

function handleButtonClick(
  event: PointerEvent,
  imageState: ImageState,
  seenState: SeenState,
  answersState: AnswersState
) {
  event.preventDefault();
  const target = event.target as HTMLButtonElement;
  if (target.id === "ai-button" && imageState.image?.ai) {
    answersState.setAnswers([...answersState.answers, true]);
  } else if (target.id === "photographer-button" && !imageState.image?.ai) {
    answersState.setAnswers([...answersState.answers, true]);
  } else {
    answersState.setAnswers([...answersState.answers, false]);
  }
  imageState.setImage(getRandomImage(data, seenState));
}

const formatter = new Intl.NumberFormat("cs-CZ", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export function App() {
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const seenState: SeenState = { seen, setSeen };
  const [image, setImage] = useState(getRandomImage(data, seenState));
  const imageState: ImageState = { image, setImage };
  const [answers, setAnswers] = useState<boolean[]>([]);
  const answersState: AnswersState = { answers, setAnswers };

  useEffect(() => {
    if (image) {
      setSeen(seen.add(data.indexOf(image)));
    }
  }, [image]);

  const { height, width } = useWindowsDimensions();

  return (
    <Container maxW={"620px"} centerContent p={0}>
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
                  handleButtonClick(event, imageState, seenState, answersState)
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
                  handleButtonClick(event, imageState, seenState, answersState)
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
