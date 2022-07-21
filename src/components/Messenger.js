import React, { useEffect, useState, useRef } from "react";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { FixedSizeList } from "react-window";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { format } from "timeago.js";
import UserImg from "./user_img.png";
import { io } from "socket.io-client";
import MessageBar from "./MessageBar";
function Messenger(props) {
  const { Chat, Userid } = props;
  const [Messages, setMessages] = useState([]);
  const [ArrivalMessage, setArrivalMessage] = useState(null);
  const [User, setUser] = useState(null);
  const [currentChat, setcurrentChat] = useState(null);
  const Socket = useRef();
  const scrollRef = useRef();
  const host = "https://deploy-sociohub.herokuapp.com";
  const handleClick = async (NewMessage) => {
    Socket.current.emit("sendMessage", {
      senderId: localStorage.getItem("UserId"),
      receiverId: Userid,
      message: NewMessage,
    });
    let msg={conversationId: Chat,
      sender: localStorage.getItem("UserId"),
      message: NewMessage}
    const response = await fetch(`${host}/api/chat/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(msg),
    });
    const newMessages = Messages.concat(msg);
    setMessages(newMessages);
  };

  const fetchMessages = async (id) => {
    const response = await fetch(`${host}/api/chat/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const ParsedResponse = await response.json();
    console.log(ParsedResponse)
    setMessages(ParsedResponse);
  };
  const fetchUser = async (id) => {
    const response = await fetch(`${host}/api/auth/getUser/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const ParsedResponse = await response.json();
    setUser(ParsedResponse);
  };
  const getCurrentChat = async (id) => {
    const response = await fetch(
      `${host}/api/conversation/getConversation/${id}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const ParsedResponse = await response.json();
    //console.log(ParsedResponse);
    setcurrentChat(ParsedResponse);
  };
  useEffect(() => {
    getCurrentChat(Chat);
    Socket.current = io("https://deploy-sociohub.herokuapp.com");
    Socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        message: data.message,
        createdAt: Date.now(),
      });
    });
  }, [Chat]);

  useEffect(() => {
    ArrivalMessage &&
      currentChat?.members.includes(ArrivalMessage.sender) &&
      setMessages((prev) => [...prev, ArrivalMessage]);
  }, [ArrivalMessage, currentChat]);
  useEffect(() => {
    Socket.current.emit("addUser", localStorage.getItem("UserId"));
    Socket.current.on("getUsers", (users) => console.log(users));
    fetchMessages(Chat);
    fetchUser(Userid);
  }, []);
  useEffect(() => {
    setTimeout(()=>{
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    },300)
  }, [Messages]);
  function renderRow(props) {
    const { index, style } = props;

    return (
      <ListItem
        style={style}
        key={index}
        ref={scrollRef}
        component="div"
        disablePadding
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems:
            Messages[index].sender !== localStorage.getItem("UserId")
              ? "flex-start"
              : "flex-end",
          paddingRight: "20px",
          paddingLeft: "20px",
        }}
      >
        <ListItemText
          primary={Messages[index].message}
          sx={{
            marginBottom: "0px",
            border: "1px solid",
            borderRadius: "20px",
            padding: "10px 20px",
            wordBreak: "break-all",
            maxWidth: "350px",
            backgroundColor:
              Messages[index].sender !== localStorage.getItem("UserId")
                ? "#80808017"
                : "white",
          }}
        />
        <ListItemText
          secondary={format(Messages[index].createdAt)}
          sx={{ marginTop: "0px" }}
        />
      </ListItem>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {User && (
        <div
          style={{ display: "flex", alignItems: "center", marginBlock: "12px" }}
        >
          <Avatar
            src={
              !User.ProfilePic
                ? UserImg
                : User.pic
            }
            sx={{ margin: "0px 20px" }}
          />
          <div>{User.name}</div>
        </div>
      )}
      <Divider />
      {Messages && (
        <Box sx={{ width: "100%", height: 400, bgcolor: "background.paper" }}>
          <FixedSizeList
            height={400}
            width="100%"
            itemSize={70}
            itemCount={Messages.length}
            overscanCount={5}
          >
            {renderRow}
          </FixedSizeList>
        </Box>
      )}

      <div
        style={{
          marginTop: "auto 15px 15px 15px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <MessageBar handleClick={handleClick} prompt={'Send'}  style={{width: "400px", height: "30px", marginRight: "15px"}}/>
      </div>
    </div>
  );
}

export default Messenger;
