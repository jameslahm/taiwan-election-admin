import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/core";
import { navigate } from "@reach/router";
import React, { useContext, useState } from "react";
import { AuthContext, login } from "../utils";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthStateAndSave } = useContext(AuthContext);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ username, password }).then((data) => {
      setAuthStateAndSave(data);

      toast({
        description: "Login Success",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      navigate("/electors");
    });
  };

  return (
    <Box maxWidth="xl" width="100%" mx="auto" mt={32}>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></Input>
        </FormControl>
        <FormControl mt={3}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Input>
        </FormControl>
        <Button type="submit" variantColor="teal" mt={3}>
          Submit
        </Button>
      </form>
    </Box>
  );
}

export default Login;
