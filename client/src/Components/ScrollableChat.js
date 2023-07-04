import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import { useRef,useEffect } from "react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages are updated
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
    ref={chatContainerRef}
      style={{
        maxHeight: "500px", // Set the maximum height of the chat container
        overflowY: "auto", // Enable vertical scrolling
      }}
    >
      {/* Render the chat messages */}
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user.data._id) ||
              isLastMessage(messages, i, user.data._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user.data._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user.data._id),
                marginTop: isSameUser(messages, m, i, user.data._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
              
            </span>
          </div>
        ))}
    </div>
  );
};

export default ScrollableChat;
