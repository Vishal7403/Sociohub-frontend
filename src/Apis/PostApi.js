import { Buffer } from "buffer";
import axios from "axios";
var base64Flag = "data:image/jpeg;base64,";
const findCount = async () => {
  const response = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_HOST}/api/post/getCount`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  return parseInt(response.data);
};

//Get posts
const getImages = async (id) => {
  const response = await fetch(
    `${process.env.REACT_APP_HOST}/api/post/getImages/${id}`,
    {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    }
  );
  const stream = response.body.getReader();
  let ans = [];
  while (true) {
    const { done, value } = await stream.read();
    if (done) {
      break;
    }
    for (let i of value) {
      ans.push(i);
    }
  }
  return base64Flag + Buffer.from(ans).toString("base64");
};
const getPosts = async (Page, setPage) => {
  const response = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_HOST}/api/post/getAllPost?page=${Page}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  const ParsedPosts = await Promise.all(
    response.data.map(async (p) => {
      if (p.user.ProfilePic) {
        const stream = await getImages(p.user.ProfilePic);
        p.user.pic = stream;
      }
      if (p.File.metadata !== "video/mp4") {
        const stream = await getImages(p.File.Id);
        p.img = stream;
      }
      return p;
    })
  );
  setPage(Page + 1);
  return ParsedPosts;
};
//create posts
const createPosts = async (data) => {
  //eslint-disable-next-line
  const response = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_HOST}/api/post/createPost`,
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
    data: data,
  });
  return true;
};
//delete posts
const deletePost = async (id) => {
  //eslint-disable-next-line
  const response = await axios({
    method: "PUT",
    url: `${process.env.REACT_APP_HOST}/api/post/deletePost/${id}`,
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  });
};

//edit posts
const editPost = async (id, caption) => {
  //eslint-disable-next-line
  const response = await fetch(
    `${process.env.REACT_APP_HOST}/api/post/updatePost/${id}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ caption }),
    }
  );
};
const handleLike = async (id) => {
  //eslint-disable-next-line
  const response = await axios({
    method: "PUT",
    url: `${process.env.REACT_APP_HOST}/api/post/updateLike/${id}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
};
const PostById = async (id) => {
  const response = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_HOST}/api/post/PostById/${id}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  const stream = await getImages(response.data.File.Id);
  response.data.img = stream;
  if (response.data.user.ProfilePic) {
    const stream = await getImages(response.data.user.ProfilePic);
    response.data.user.pic = stream;
  }
  return response.data;
};
const getUserPosts = async (id) => {
  const response = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_HOST}/api/post/getUserPost/${id}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  const ParsedPosts = await Promise.all(
    response.data.map(async (p) => {
      const stream = await getImages(p.File.Id);
      p.img = stream;
      return p;
    })
  );
  return ParsedPosts;
};

export {
  getPosts,
  createPosts,
  getUserPosts,
  deletePost,
  editPost,
  PostById,
  handleLike,
  findCount,
  getImages,
};
