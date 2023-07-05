import React, { useEffect ,useState} from 'react'
import axios from 'axios'
import {ChatState} from '../context/ChatProvider.js'
import SideDrawer from '../Components/Missenalious/SideDrawer.js'
import ChatBox from '../Components/Missenalious/ChatBox.js'
import MyChats from '../Components/Missenalious/MyChats.js'
import { Box } from '@chakra-ui/react'


export default function ChatPage({history}) {

    //as we added ChatState we can access that state directly
      const {user}=ChatState()
      const [fetchAgain,setFetchAgain]=useState(false)
   
  return (
    <>
    <div style={{width:"100%"}}>
        
         {user && <SideDrawer history={history}/>}
      
      <Box
        display={"flex"}
        justifyContent="space-between"
        w="100%"
        p="10px"
        h="91.5vh"
      >
        {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>

    </div>
    </>
    
  )
}
