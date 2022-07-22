import { getImages } from "./PostApi";
import axios from "axios";
const LoginUser = async (emailId, password) => {
  const response = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_HOST}/api/auth/login`,
    headers: {
      "content-type": "application/json",
    },
    data: {
      email: emailId,
      password: password,
    },
  });
  return response.data;
};
const SignUpUser = async (Username, email, password) => {
  const response = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_HOST}/api/auth/signup`,
    headers: {
      "content-type": "application/json",
    },
    data: {
      name: Username,
      email: email,
      password: password,
    },
  });
  return response.data;
};
const getUserInfo = async (id) => {
  const response = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_HOST}/api/auth/getUser/${id}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  if (response.data.ProfilePic) {
    const stream = await getImages(response.data.ProfilePic);
    response.data.pic = stream;
  }
  return response.data;
};
const handleFollow = async (id) => {
  //eslint-disable-next-line
  const response = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_HOST}/api/auth/updateProfile/${id}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  return true;
};
const SearchUser = async (id) => {
  const response = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_HOST}/api/auth/search/${id}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  let users = await Promise.all(
    response.data.map(async (user) => {
      if (user.ProfilePic) {
        const stream = await getImages(user.ProfilePic);
        user.pic = stream;
      }
      return user;
    })
  );
  return users;
};
const LoginUsingGoogle = async (email) => {
  const response = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_HOST}/api/auth/google-login`,
    headers: {
      "content-type": "application/json",
    },
    data: {
      email: email,
    },
  });

  return response.data;
};
const SavePost = async (id) => {
  //eslint-disable-next-line
  const response = await axios({
    method: "PUT",
    url: `${process.env.REACT_APP_HOST}/api/auth/savePost/${id}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
};
export {
  LoginUser,
  SignUpUser,
  getUserInfo,
  SearchUser,
  handleFollow,
  LoginUsingGoogle,
  SavePost,
};
