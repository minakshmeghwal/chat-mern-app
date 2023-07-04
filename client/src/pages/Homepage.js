import React from 'react'
//container basically handles when we change the size of a screen
//in chakra we can give the css in the <> itself we dont need to write code of css in different file
import {Container,Box,Text,Tabs,TabList,TabPanels,TabPanel,Tab} from '@chakra-ui/react'
import Login from '../Components/Authentication/Login'
import Signup from '../Components/Authentication/Signup'

import { useEffect } from 'react'

export default function Homepage({history}) {
  

  useEffect(()=>{
    //as the user info we stores in a localstorage we can get like this
    //as it is in stringify format we convert it in parse
    const userInfo=JSON.parse(localStorage.getItem("userInfo"))
    

    //if user is not logged in
    if(userInfo)
    {
      //push into the chat page
      history.push('/chats')
    }
    
    //whenever history changes it run
  },[history])


  return (
    <Container maxW='lg' centerContent>
      <Box
      d="flex"
      bg="white"
      justifyContent="Center"
      p={3}
      w="100%"
      m="40px 0 15px 0"
      borderRadius="5px"
      borderWidth="1px"
      >
        <Text fontSize="3xl" fontFamily="work sans" color="black" textAlign="center">
          Login 
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="5px" borderWidth="1px">
        <Tabs variant='soft-rounded' >
        <TabList mb="1em">
        <Tab width="50%">Login</Tab>
        <Tab width="50%">Sign Up</Tab>
        </TabList>
        <TabPanels>
        <TabPanel>
          <Login history={history}/>
        </TabPanel>
        <TabPanel>
         <Signup/>
        </TabPanel>
        </TabPanels>
         </Tabs>
      </Box>

    </Container>
  )
}
