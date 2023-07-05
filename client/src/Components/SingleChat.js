import React from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box,Text,IconButton } from '@chakra-ui/react';
import { getSender,getSenderFull } from '../config/ChatLogics';
import { ArrowBackIcon } from '@chakra-ui/icons';
import ProfileModel from './Missenalious/ProfileModel';
import UpdateGroupChatModal from './Missenalious/UpdateGroupChatModal';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { Spinner } from '@chakra-ui/react';
import ScrollableChat from './ScrollableChat';
import { FormControl } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import io from 'socket.io-client'

// import fetchChats from './Missenalious/MyChats.js'
// import Lottie from 'react-lottie'
// import animationData from '../animations/typing.json'

//here our endpoint is this
const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;


//this is in lottie typin animation
// const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: animationData,
//     rendererSettings: {
//       preserveAspectRatio: "xMidYMid slice",
//     },
//   };


const SingleChat = ({fetchAgain,setFetchAgain}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

    const { selectedChat, setSelectedChat, user, notification, setNotification}=ChatState();

    const sendMessage = async (event) => {

      //check if its an enter key of keyboard and there is a message present in newMessage
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);

      try {
        const config = {
          headers: {
            // we are sending a json data
            "Content-type": "application/json",
            Authorization: `Bearer ${user.data.token}`,
          },
        };

        //the api call or this message is asynchronus so it wont effect the api call
        //through this the input got empty and we got the message
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:5000/message",
          {
            //content or the id of that chat which is been selected
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        //send msg on that socket named new message
        socket.emit("new message", data);

        //whatever we are getting we gonna append it to the array of all of the messages
        setMessages([...messages, data]);
        //console.log("chats is",data)
        

      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }

    //this is basically a fxn whenever fetchAgain changes the useEffect present in MyChats get called and render all chats
     setFetchAgain(!fetchAgain);

     //fetchChats();
  };
   const fetchMessages = async () => {

    //if no chat is selected don't do anything 
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/message?chatId=${selectedChat._id}`,
        config
      );


      //after fetching all messages we would set the messages
      setMessages(data);
      setLoading(false);

      //whenever we click on chat it create a room with id of that chat id
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  
   //start our socket here
   useEffect(() => {

    //our socket would connect to the server in ENDPOINT
    socket = io(ENDPOINT);

    //emit is basically sending a data
    //here we are sending user details
    socket.emit("setup", user.data);

    //on is basically getting something now we get connected so it turns in true
    socket.on("connected", () => setSocketConnected(true));

    //when its give typin signal
    socket.on("typing", () => setIsTyping(true));

    //when it gives stop typing signal
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);


  //whenever render happens it would fetch all the chats
   useEffect(() => {
    fetchMessages();

    //it basciaclly having the backup of selected chat
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line

    //whenever selectedChat changes than call this useEffect again
  }, [selectedChat]);

 
  useEffect(() => {

    //we recieved a message put that msg on fxn
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        //if selected chat or message recieved chat not same than show the notification
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) 
      { //if notification array dont contain the new message than add it to array
        // if (!notification.includes(newMessageRecieved)) {
        //   //add this msg to front of our notiication
        //   setNotification([newMessageRecieved, ...notification]);  
        // }
        setFetchAgain(!fetchAgain);
      
    }
       else {
 

        setSelectedChat(selectedChat)
        //otherwise set that msg on setMessages
        setMessages([...messages, newMessageRecieved]);
        
        
        //setFetchAgain(!fetchAgain);
      }
    });
    
  });


  //this fxn would call whenever this key press

     const typingHandler = (e) => {

      //set the message in setMessages variables
    setNewMessage(e.target.value);

    //typing indicator here
    //check if socket connected
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    //to finish the typing after some second
    // let lastTypingTime = new Date().getTime();

    // //after 3sec the typing should stop
    // var timerLength = 3000;


    // setTimeout(() => {
    //   var timeNow = new Date().getTime();
    //   var timeDiff = timeNow - lastTypingTime;
    //   if (timeDiff >= timerLength && typing) {
    //     socket.emit("stop typing", selectedChat._id);
    //     setTyping(false);
    //   }
    // }, timerLength);
  };

  return (
    <>
    {selectedChat?(
        <>
        <Text
            //in a smaller screen the size would be 28px
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            //in a smaller screen there would be space-between
            justifyContent={{ base: "space-between" }}
            alignItems="center"

          > 
          {/* there would be an icon button */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              //if we click on that back button than it will empty the setSelectedChat
              onClick={() => setSelectedChat("")}
            />
            
            {
              (!selectedChat.isGroupChat ? (
                <>
                  {
                 //it would send the sender name which sending the message
                 //it will send the selectedUsers details whatever users is present on that chats
                
                    getSender(user, selectedChat.users)}
                 
                  <ProfileModel
                  //it will send the all users details
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                {/* if its a groupchat than show the name of group chat */}
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))} 
          </Text>
           <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden">

            {/* all messages here */}
             {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

             <FormControl
            //  when we press enter key the the message should send
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
             {/* {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )} */}

              {/* for an input we can type a message */}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                //on writing a message this fxn would call
                onChange={typingHandler}
              />
            </FormControl>
        </Box>
          </>
    ):(
       <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
    )
}

    </>
  )
}

export default SingleChat
