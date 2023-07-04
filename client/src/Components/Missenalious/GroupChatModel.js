import React from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody,ModalFooter,Button} from '@chakra-ui/react'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider'
import axios from 'axios'
import { Input } from '@chakra-ui/react'
import { FormControl } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

import UserListItem from '../UserAvatar/UserListItem'

const GroupChatModel = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
     const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();


  const handleSearch=async(query)=>{
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

      //search in this basically a variable
      const { data } = await axios.get(`http://localhost:5000/user?search=${search}`, config);

     // console.log(data);

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
    }

  }
  
  const handleSubmit=async ()=>{
     if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/chat/group`,
        {
          name: groupChatName,
          //it will take the users array in stringify format of users ID
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      
      //we want to add chats into the top of the chats
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

  }

  const handleDelete=(delUser)=>{
     setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));

  }

  const handleGroup=(userToAdd)=>{

    //if selectedusers variable is having this user than show the toast that it already contains
     if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    //else add that user on selectedusers
    setSelectedUsers([...selectedUsers, userToAdd]);

  }
   return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center">Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody  display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
              
            </FormControl>
            {/* selected users would show here */}
            <Box  w="100%" d="flex" flexWrap="wrap">
            {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                //   this fxn is send to that UserBadgeItem so it will call this fxn
                //so whenever this handleFunction would call it would call the handleDelete fxn
                  handleFunction={() => handleDelete(u)}
                />
              ))}
              </Box>

            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
                // here we are using slice so it would display only 4 users at a tym
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    // when we click on that user that user would add on that
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
           
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={()=>{handleSubmit()}}>
             Create Chat
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModel
