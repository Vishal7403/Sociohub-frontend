import { getImages } from "./PostApi";
const host="https://deploy-sociohub.herokuapp.com"
const LoginUser = async (emailId, password) => {
  const response = await fetch(`${host}/api/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: emailId,
      password: password,
    }),
  });
  const ParsedResponse = await response.json();
  return ParsedResponse;
};
const SignUpUser = async (Username, email, password) => {
  const response = await fetch(`${host}/api/auth/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: Username,
      email: email,
      password: password,
    }),
  });
  const ParsedResponse = await response.json();
  return ParsedResponse;
};
const getUserInfo = async (id) => {
  const response = await fetch(`${host}/api/auth/getUser/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  const ParsedResponse = await response.json();
  if (ParsedResponse.ProfilePic) {
    const stream = await getImages(ParsedResponse.ProfilePic);
    ParsedResponse.pic = stream;
  }
  return ParsedResponse;
};
const handleFollow = async (id) => {
  //eslint-disable-next-line
  const response = await fetch(`${host}/api/auth/updateProfile/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  return true;
};
const SearchUser = async (id) => {
  const response = await fetch(`${host}/api/auth/search/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  const ParsedResponse = await response.json();
  let users = await Promise.all(
    ParsedResponse.map(async (user) => {
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
  const response = await fetch(`${host}/api/auth/google-login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  });
  let ParsedResponse = await response.json();
  return ParsedResponse;
};
const SavePost = async (id) => {
  const response = await fetch(`${host}/api/auth/savePost/${id}`, {
    method: "PUT",
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
