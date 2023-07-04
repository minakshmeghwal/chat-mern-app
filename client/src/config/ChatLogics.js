export const getSender=(loggedUser, users)=>{
    //it is not a group chat so it will be having two users
    //if loggeduser id equal user id toh dusre ka bhejo
      return users[0]._id === loggedUser.data._id ? users[1].name : users[0].name;
}

export const getSenderFull=(loggedUser, users)=>{

    //it will send the user details
     return users[0]._id === loggedUser.data._id ? users[1] : users[0];

}


export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
  //if its the same sender who logged in than do 33 margin
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
  //if this is not same sender than do 0 margin
    return 0;
  else return "auto";
};

//the all messages the current message and the index of that message and the logged in user
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    //and the next message not sent by the same user
    (messages[i + 1].sender._id !== m.sender._id ||
      //and next is not undefined
      messages[i + 1].sender._id === undefined) &&
      //and the current message is not a loggeduser
    messages[i].sender._id !== userId
  );
};


export const isLastMessage = (messages, i, userId) => {
  return (

    //check if it the last message send by sender
    i === messages.length - 1 &&

    //if last message id is not equal to the logged in id
    messages[messages.length - 1].sender._id !== userId &&

    //and the message exist
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  //if previous msg id or current message id is same than
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
