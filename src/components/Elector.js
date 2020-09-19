import { useParams } from "@reach/router";
import React, { useContext, useRef, useState } from "react";
import { queryCache, useMutation, useQuery } from "react-query";
import {
  AuthContext,
  changeElector,
  createElector,
  getElector,
  uploadFile,
} from "../utils";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/core";
import ReactDOM from "react-dom";
import ResizeTextarea from "react-textarea-autosize";

const AutoResizeTextarea = React.forwardRef((props, ref) => {
  return (
    <Textarea
      transition={"height none"}
      minH="unset"
      resize="none"
      ref={ref}
      minRows={4}
      overflow="hidden"
      as={ResizeTextarea}
      {...props}
    ></Textarea>
  );
});

function Elector() {
  const params = useParams();
  const { authState } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [enName, setEnName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [policy, setPolicy] = useState("");
  const [experience, setExperience] = useState("");
  const [party, setParty] = useState("");
  const [video, setVideo] = useState("");
  const avatarRef = useRef(null);
  const videoRef = useRef(null);
  const toast = useToast();

  const { isLoading, isError } = useQuery(
    ["elector", params.id, authState.token],
    (key, id, token) => getElector({ id, token }),
    {
      refetchOnWindowFocus: false,
      enabled: params.id,
      onSuccess: (data) => {
        ReactDOM.unstable_batchedUpdates(() => {
          setName(data.name);
          setEnName(data.enName);
          setAvatar(data.avatar);
          setPolicy(data.policy);
          setExperience(data.experience);
          setParty(data.party);
          setVideo(data.video);
        });
      },
    }
  );

  const [mutateCreate] = useMutation(createElector);

  const [mutateChange] = useMutation(changeElector, {
    onSuccess: () =>
      queryCache.invalidateQueries(["elector", params.id, authState.token]),
  });

  const [mutateUpload] = useMutation(uploadFile);

  const handleUpload = async (file) => {
    const res = await mutateUpload({ file, token: authState.token });
    console.log(res);
    return res;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (params.id) {
      mutateChange({
        token: authState.token,
        id: params.id,
        name,
        enName,
        avatar,
        policy,
        experience,
        party,
        video,
      }).then((res) => {
        toast({
          description: "Save Success",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      });
    } else {
      mutateCreate({
        token: authState.token,
        id: params.id,
        name,
        enName,
        avatar,
        policy,
        experience,
        party,
        video,
      }).then((res) => {
        toast({
          description: "Save Success",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      });
    }
  };

  if (isLoading || isError) {
    return <Box></Box>;
  }

  return (
    <Box mt={12} maxWidth="3xl" mx="auto">
      <form onSubmit={handleSubmit} noValidate>
        <Flex alignItems="center" mb={8}>
          <Input
            ref={avatarRef}
            name="avatar"
            display="none"
            type="file"
            onChange={async (e) => {
              e.preventDefault();
              const file = e.target.files[0];
              e.target.value = "";
              const res = await handleUpload(file);
              setAvatar(res.url);
            }}
          ></Input>
          <Avatar
            outline="none"
            as={"button"}
            type="button"
            onClick={(e) => {
              avatarRef.current.click();
            }}
            src={avatar}
            size="xl"
          ></Avatar>
          <FormControl ml={12}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              id="name"
            ></Input>
          </FormControl>
          <FormControl ml={8}>
            <FormLabel htmlFor="enName">EnName</FormLabel>
            <Input
              id="enName"
              value={enName}
              onChange={(e) => {
                setEnName(e.target.value);
              }}
            ></Input>
          </FormControl>
        </Flex>
        <FormControl>
          <FormLabel htmlFor="party">Party</FormLabel>
          <Input
            id="party"
            value={party}
            onChange={(e) => {
              setParty(e.target.value);
            }}
          ></Input>
        </FormControl>
        <FormControl mt={4}>
          <FormLabel htmlFor="policy">Policy</FormLabel>
          <Input
            id="policy"
            value={policy}
            onChange={(e) => {
              setPolicy(e.target.value);
            }}
          ></Input>
        </FormControl>
        <FormControl mt={4}>
          <FormLabel htmlFor="experience">Experience</FormLabel>
          <AutoResizeTextarea
            id="experience"
            value={experience}
            onChange={(e) => {
              setExperience(e.target.value);
            }}
          ></AutoResizeTextarea>
        </FormControl>
        <Box mt={4}>
          <Input
            ref={videoRef}
            name="video"
            display="none"
            type="file"
            onChange={async (e) => {
              e.preventDefault();
              const file = e.target.files[0];
              e.target.value = "";
              const res = await handleUpload(file);
              setVideo(res.url);
            }}
          ></Input>
          <Button
            onClick={(e) => {
              videoRef.current.click();
            }}
            type="button"
            mb={2}
          >
            Upload Video
          </Button>
          <video
            controls
            preload="auto"
            src={
              video ||
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            }
            autoPlay
            style={{
              maxHeight: "200px",
              borderRadius: "3px",
              outline: "none",
            }}
          ></video>
        </Box>
        <Button variantColor="teal" mt={3} type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
}

export default Elector;
