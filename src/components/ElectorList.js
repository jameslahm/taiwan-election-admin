import React, { useContext } from "react";
import { Box, Text, Flex, Avatar, IconButton } from "@chakra-ui/core";
import { AuthContext, deleteElector, getElectors } from "../utils";
import { Link as ReachLink } from "@reach/router";
import { queryCache, useMutation, useQuery } from "react-query";

function Elector() {
  const { authState } = useContext(AuthContext);

  const { data: electors = []} = useQuery(
    ["electors", authState.token],
    (key, token) => getElectors({ token })
  );

  const [mutate] = useMutation(deleteElector, {
    onSuccess: (data) => {
      queryCache.invalidateQueries(["electors", authState.token]);
    },
  });

  const handleDelete = (id) => {
    mutate({ id, token: authState.token });
  };

  return (
    <Box pt={4} mt={2}>
      <Text fontSize="2xl" mb={2}>
        Electors
      </Text>
      <Flex justifyContent="flex-end" mb={2}>
        <IconButton icon="add" as={ReachLink} to={`/electors/create`} variant="ghost"></IconButton>
      </Flex>
      {electors.map((e,i) => {
        return (
          <Box mt={3} key={i} borderWidth="1px" rounded="lg" p={3}>
            <Flex alignItems="center">
              <Avatar mr={3} src={e.avatar}></Avatar>
              <Text mr={3}>{e.name}</Text>
              <Text color="gray.500">{e.enName}</Text>
              <Flex flexGrow={1} justifyContent="flex-end">
                <IconButton
                  as={ReachLink}
                  to={`/electors/${i}`}
                  icon="edit"
                  variant="ghost"
                  mr={1}
                />
                <IconButton
                  onClick={(_) => handleDelete(i)}
                  icon="delete"
                  variant="ghost"
                />
              </Flex>
            </Flex>
          </Box>
        );
      })}
    </Box>
  );
}

export default Elector;
