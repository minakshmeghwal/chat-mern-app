import { IconButton } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { ViewIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { useToast,Box } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import { FormControl } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import UserListItem from '../UserAvatar/UserListItem'


import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react'
import axios from 'axios'

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
   const { isOpen, onOpen, onClose } = useDisclosure()
   const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  //during renaming there would be loading to show that loading
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  
   const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:5000/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  const handleAddUser = async (user1) => {

    //if user already exist than don't need to add
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    //if groupadmin id dont match the current user id it means that not a group admin
    //only group admin can add people
    if (selectedChat.groupAdmin._id !== user.data._id ) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/chat/groupadd`,
        {
          chatId: selectedChat._id,
          //user which we want to add in our grp
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      // fetch all data again so all chats would be fetched with changes details
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  

  const handleLeave=async(user1)=>{

    if(selectedChat.groupAdmin._id!== user1._id)
    {
       try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user1.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      // //if current logged in user and the user which is remove is same toh usko chats show na ho
      // //becoz it left the group
      // user1._id === user.data._id  ? setSelectedChat() : setSelectedChat(data);
      setSelectedChat();
      //fetc all the chats again
      setFetchAgain(!fetchAgain);

      //after removing someone the all messages get refresh
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    
    }
    else{
      //it will delete that group from all users
      try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user1.token}`,
        },
      };

      const promises = selectedChat.users.map(async (user) => {
    const { data } = await axios.put(
      "http://localhost:5000/chat/groupremove",
      {
        chatId: selectedChat._id,
        userId: user._id,
      },
      config
    );
    return data;
  });

  try {
    const results = await Promise.all(promises);
    console.log(results); // Array of response data from each PUT request
  } catch (error) {
    console.error(error);
  }
      
       //if current logged in user and the user which is remove is same toh usko chats show na ho
      //becoz it left the group
      // user1._id === user.data._id  ? setSelectedChat() : setSelectedChat(data);
      setSelectedChat();
      //fetc all the chats again
      setFetchAgain(!fetchAgain);

      //after removing someone the all messages get refresh
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);

    }
    
  }
}

   const handleRemove = async (user1) => {

    if (selectedChat.groupAdmin._id !== user.data._id && user1._id !== user.data._id ) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      //if current logged in user and the user which is remove is same toh usko chats show na ho
      //becoz it left the group
      user1._id === user.data._id  ? setSelectedChat() : setSelectedChat(data);
      //fetc all the chats again
      setFetchAgain(!fetchAgain);

      //after removing someone the all messages get refresh
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };



  return (
    <>
     <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center">{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
             <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
              <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={()=> {handleRename()}}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

             {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
           
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
