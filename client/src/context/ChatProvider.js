import {createContext,useContext,useState,useEffect} from 'react'
import { useHistory } from 'react-router-dom';
import { createHashHistory } from 'history'

const chatContext=createContext();


export default function ChatProvider({children}) {

  const [user,setUser]=useState();
  const [selectedChat,setSelectedChat]=useState();
  const [chats,setChats]=useState([]);
  const [notification, setNotification] = useState([]);

  const history=createHashHistory();

  useEffect(()=>{
    //as the user info we stores in a localstorage we can get like this
    //as it is in stringify format we convert it in parse
    const userInfo=JSON.parse(localStorage.getItem("userInfo"))

    //userInfo stored in setUser state
    setUser(userInfo)
   

    //if user is not logged in
    if(!userInfo)
    {
      //push into the back longin page
      history.push('/')
    }
    
    
    
    //whenever history changes it run
  },[history])
  return (
    //here i wrap it with provider now here which values we would use will use in the chidren
    //here through value we providede now this state can be accsesible in other components to
    <chatContext.Provider value={{selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        }}>
        {children}
    </chatContext.Provider>
    
  )

}

//all of our state would be in our this variable
export const ChatState=()=>{
  //to access the state in whole app
//inside it whole of our state
    return useContext(chatContext)

}

