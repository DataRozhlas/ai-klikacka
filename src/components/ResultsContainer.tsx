import { FunctionComponent } from "preact";
import ResultItem from "./ResultItem";
import { Box, Stack } from "@chakra-ui/react";

type Image = {
  file: string;
  ai: boolean;
  description: string;
};

type MyComponentProps = {
  answers: boolean[];
  data: Image[];
  seen: Set<number>;
};

const ResultsContainer: FunctionComponent<MyComponentProps> = ({
  answers,
  seen,
  data,
}) => {
  const AnswersImages = answers.map((answer, index) => {
    let seenArray = Array.from(seen);
    if (seenArray.length > answers.length) {
      seenArray.pop();
      console.log("usráno");
    }
    return { answer: answer, image: data[seenArray[index]] };
  });
  const reversedAnswersImages = AnswersImages.reverse();

  return (
    <Box>
      <Stack spacing={5}>
        {reversedAnswersImages.map((answer) => (
          <ResultItem answer={answer.answer} image={answer.image} />
        ))}
      </Stack>
    </Box>
  );
};
export default ResultsContainer;
