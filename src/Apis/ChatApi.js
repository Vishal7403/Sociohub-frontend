import axios from "axios";
const sendMessage = async (msg) => {
  //eslint-disable-next-line
  const response = axios({
    method: "POST",
    url: `${process.env.REACT_APP_HOST}/api/chat/`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
    data: msg,
  });
};
const fetchMessages = async (id) => {
  const response = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_HOST}/api/chat/${id}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  return response.data;
};
const getCurrentChat = async (id) => {
  const response = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_HOST}/api/conversation/getConversation/${id}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  return response.data;
};
const fetchConvo = async () => {
  const response = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_HOST}/api/conversation/${localStorage.getItem(
      "UserId"
    )}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  return response.data;
};
const getConvoId = async (id) => {
  const response = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_HOST}/api/conversation/getConversationByreceiver/${id}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  return response.data;
};
export { sendMessage, fetchMessages, getCurrentChat, fetchConvo, getConvoId };
