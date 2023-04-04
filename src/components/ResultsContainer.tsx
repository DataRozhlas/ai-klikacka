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
  const reversedAnswers = answers.slice().reverse();
  const reversedSeen = Array.from(seen).slice().reverse();
  console.log(reversedAnswers);
  return (
    <Box style="max-height: 12rem; overflow-x:hidden;">
      <Stack spacing={5}>
        {reversedAnswers.map((answer, index) => (
          <ResultItem answer={answer} image={data[reversedSeen[index]]} />
        ))}
      </Stack>
    </Box>
  );
};
export default ResultsContainer;
