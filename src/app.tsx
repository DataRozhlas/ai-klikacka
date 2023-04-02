import { useState } from "preact/hooks";
import {
  Container,
  Stack,
  Heading,
  Center,
  Image,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import "./app.css";

export function App() {
  return (
    <Container maxW={"620px"} centerContent>
      <Stack spacing={4}>
        <Heading as={"h1"} size={"xl"}>
          <Center>Kdo je autorem obrázku?</Center>
        </Heading>
        <Image src="https://placehold.co/600x400" borderRadius={8}></Image>
        <Center>
          <ButtonGroup size={"lg"} colorScheme={"red"} spacing={4}>
            <Button
              leftIcon={
                <Icon icon="icons8:old-time-camera" width={36} height={36} />
              }
            >
              Fotograf
            </Button>
            <Button
              leftIcon={
                <Icon icon="teenyicons:robot-solid" width={30} height={30} />
              }
            >
              Umělá inteligence
            </Button>
          </ButtonGroup>
        </Center>
      </Stack>
    </Container>
  );
}
