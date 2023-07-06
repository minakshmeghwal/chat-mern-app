import { Box } from "@chakra-ui/react";
import SingleChat from "../SingleChat";
import { ChatState } from "../../context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain ,change,setChange}) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      //if the chat is selected than this box will see
      // base is here for smaller screen
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} change={change} setChange={setChange} />
    </Box>
  );
};

export default Chatbox;