import { Tooltip, MenuButton,Menu,MenuItem,MenuList, MenuDivider ,useToast,Spinner} from '@chakra-ui/react';
import {Button} from '@chakra-ui/button'
import {Box,Text} from '@chakra-ui/layout'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from 'react';
import React from 'react'
import { Avatar } from '@chakra-ui/avatar';
import '@fortawesome/fontawesome-free/css/all.css';
import { ChatState } from '../../context/ChatProvider.js';
import ProfileModel from './ProfileModel';
import { useDisclosure } from '@chakra-ui/react';
import ChatLoading from '../ChatLoading.js';
import axios from 'axios';
import { Input } from '@chakra-ui/react';
import UserListItem from '../UserAvatar/UserListItem.js';
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge.js';
import Effect from 'react-notification-badge/lib/components/Effect.js';
import { getSender } from '../../config/ChatLogics.js';


import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { useRef } from 'react';


const SideDrawer = ({history}) => {
    const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast=useToast();

  const badgeRef = useRef(null);
 
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();


  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const accessChat=async (userId)=>{
     console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          //we are sending json data so we would use this also
          //there in user.data is data present
          "Content-type": "application/json",
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.post(`http://localhost:5000/chat`, { userId }, config);

      console.log("data",data)

      //if chats.find c and c.id !=data.id toh is chats mai us new chat ko append krdo
      //like mne ek ke sath chat start ki jiske sath phle chat nhi huyi meri toh append krdo ushe
      if (!chats.find((c) => c._id === data._id)) 
      {
        setChats([data, ...chats]);
      }


      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });

  }
  
  }
  const handleSearch=async ()=>{

    //if there is no in a search box
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {


      setLoading(true);

      //we are gonna send a jwt token to our account protected
      //to make this route protected
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      //token or the search variable is send
      const { data } = await axios.get(`http://localhost:5000/user?search=${search}`, config);

      //after completion of fetching plaese set loading as a false
       setLoading(false);


       //set search data as the fetched data so that it can show in a box
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

  return (
    <>
    <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
      <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>

          {/* this is for the search icon we imported from the font awesome */}
         <i className="fa-solid fa-magnifying-glass"></i>
         <Text display={{base:"none" ,md:"flex"}} px="4">
          Search User
         </Text>
        </Button> 
        </Tooltip>
         <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          

          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.data.name}
                
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user.data}>
                <MenuItem>My Profile</MenuItem>
                </ProfileModel>
                <MenuDivider/>
              <MenuItem onClick={()=>{logoutHandler()}}>Logout</MenuItem>
            </MenuList>
            </Menu>
        </div>

      </Box>

      {/* Drawerr is used for whenever we click on a button it would open that drawer 
      at which the all searched result would show 
      and is showor isopen get true when onopen is called
      
      onOpen is a fxn which get called when we click on a icon and it set true on isopen and onclose value 
      which show when we get open it get opened and when we get close it get close*/}

       <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                
                //whenever the value is entering it would set on setSearch variable
                onChange={(e) => setSearch(e.target.value)}
              />
              {/* on click on this button it would call handlesearch fxn */}
              <Button onClick={()=>{handleSearch()}}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer
