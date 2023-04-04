import { FunctionComponent } from "preact";
import { Box, Image, Text, Heading, Stack } from "@chakra-ui/react";

type Image = {
  file: string;
  ai: boolean;
  description: string;
};

type MyComponentProps = {
  answer: boolean;
  image: Image;
};

const ResultItem: FunctionComponent<MyComponentProps> = ({ answer, image }) => {
  return (
    <Box>
      <Image
        style={"float:left;"}
        maxW={"40%"}
        src={image.file}
        alt={image.description}
        mr={2}
      />
      <Heading as={"h3"} size={"sm"} color={answer ? "green" : "red"}>
        {answer ? "Správně!" : "Špatně!"}
      </Heading>
      <Text fontSize={"sm"}>{image.description}</Text>
    </Box>
  );
};
export default ResultItem;
