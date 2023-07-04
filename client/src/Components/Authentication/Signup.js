import React from 'react'
import { FormControl, FormLabel, VStack ,Input, InputGroup, InputRightElement, Button, show} from '@chakra-ui/react'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { createHashHistory } from 'history'

const Signup = () => {
    const [show,setShow]=useState(false)
  const [Name,setName]=useState();
    const [Mail,setMail]=useState();
    const [Password,setPassword]=useState();
    const [confirmPassword,setconfirmPassword]=useState();
    const [Pic,setPic]=useState();

    //it is a history
    const history=createHashHistory();

    //for a pop up message
  const toast=useToast();
    //when we would upload a pic for that loading we would use this
    const [loading,setLoading]=useState(false);

    const handleClick = () => setShow(!show);

    //for upload a pic
    const postDetails=(pics)=>{
    //   setLoading(true)
    //   if(pics===undefined)
    //   { //it is a pop message
    //     toast({
    //       title: 'please select an image',
    //       status: 'warning',
    //       duration: 9000,
    //       isClosable: true,
    //       position:'bottom'
    //     })
    //     return
    //   }
    //   //check the type of image
    //   if(pics.type==="image/jpeg" || pics.type==="image/png")
    //   {const data = new FormData();
    //     //upload data on cloud
    //   data.append("file", pics);
    //   data.append("upload_preset", "chat-app");
    //   data.append("cloud_name", "dhqybey8s");
    //   //upload pic on cloudinary url
    //   fetch("https://api.cloudinary.com/v1_1/dhqybey8s", {
    //     method: "post",
    //     body: data,
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {

    //       // set pic in string in setpic
    //       setPic(data.url.toString());
    //       console.log(data.url.toString());

    //       //loading in cloudnary is completed
    //       setLoading(false);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       setLoading(false);
    //     });
    // } else {
    //   //if image is not jpeg or png format
    //   toast({
    //     title: "Please Select an Image!",
    //     status: "warning",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "bottom",
    //   });
    //   setLoading(false);
    //   return;

    // }
  }

    const submitHandler=async()=>{

      //click on submit button loading would start
      setLoading(true);
    if (!Name || !Mail || !Password || !confirmPassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (Password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(Name, Mail, Password, Pic);
    try {

      //set a headers for our request that our requset is application/json type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      //now we would do a api request
      //axios is used to send data to the backend
      // config is here telling that it is application/json data
      try {
        const data  = await axios.post(
        "http://localhost:5000/user/signup",
        {
          name: Name,
    mail: Mail,
    password: Password,
    pic: Pic,
        },
        config
      );
      
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      //set the data in local storage
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
        
      } catch (error) {

        console.log(error.message)
        
      }
      //here history is a hook
      //after successfully signed we would push it to chat page
      history.push("/chats");
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
  };

  return (
    <VStack spacing="5px" color="black">
        <FormControl id="name" isRequired>
            <FormLabel>
                Name
            </FormLabel>
            <Input
                placeholder="Enter your name"
                onChange={(e)=>{ setName(e.target.value)

                }}
            />
        </FormControl>
        <FormControl id="mail" isRequired>
            <FormLabel>
                Mail
            </FormLabel>
            <Input
                placeholder="Enter your mail"
                onChange={(e)=>{ setMail(e.target.value)

                }}
            />
        </FormControl>
        <FormControl id="Password" isRequired>
            <FormLabel>
                Password
            </FormLabel>
            <InputGroup>
            <Input
                type={show? "text" : "password"}
                placeholder="Enter password"
                onChange={(e)=>{ setPassword(e.target.value)

                }}
            />
            <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="confirmPassword" isRequired>
            <FormLabel>
                Password
            </FormLabel>
            <InputGroup>
            <Input
                type={show? "text" : "password"}
                placeholder="Confirm password"
                onChange={(e)=>{ setconfirmPassword(e.target.value)

                }}
            />
            <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
        
      >
        Sign Up
      </Button>
        
    </VStack>
  )
}

export default Signup
