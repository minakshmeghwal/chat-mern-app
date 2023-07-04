import React from 'react';
import { ChatState } from '../../context/ChatProvider.js';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useToast, Box, Text, Stack } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from '../ChatLoading.js';
import { getSender } from '../../config/ChatLogics.js';
import GroupChatModel from './GroupChatModel.js';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      const { data } = await axios.get("http://localhost:5000/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const getCount = (chat) => {
    let count = 0;
    chat.messageCountUnseen.forEach((obj) => {
      count += obj.number;
    });
    return count;
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModel>
          <Button d="flex" fontSize={{ base: "17px", md: "10px", lg: "17px" }} rightIcon={<AddIcon />}>
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              if (chat.latestMessage) {
                return (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                    <Text>
                      {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                    </Text>
                    {chat.latestMessage && (
                      <>
                        <Text fontSize="xs">
                          <b>{chat.latestMessage.sender.name} : </b>
                          {chat.latestMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) + "..."
                            : chat.latestMessage.content}
                        </Text>
                        {/* <Text>{getCount(chat)}</Text> */}
                      </>
                    )}
                  </Box>
                );
              }
              return null;
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
