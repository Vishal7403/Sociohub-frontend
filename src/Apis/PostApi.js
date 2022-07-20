import { Buffer } from "buffer";
var base64Flag = "data:image/jpeg;base64,";

const host = "http://localhost:7878";
const findCount = async () => {
  const response = await fetch(`${host}/api/post/getCount`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  const ParsedResponse = await response.json();
  return parseInt(ParsedResponse);
};

//Get posts
const getImages = async (id) => {
  const res = await fetch(`${host}/api/post/getImages/${id}`, {
    method: "GET",
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  });
  const stream = res.body.getReader();
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
  const response = await fetch(`${host}/api/post/getAllPost?page=${Page}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  const ParsedResponse = await response.json();
  const ParsedPosts = await Promise.all(
    ParsedResponse.map(async (p) => {
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
  const response = await fetch(`${host}/api/post/createPost`, {
    method: "POST",
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
    body: data,
  });
  return true;
};
//delete posts
const deletePost = async (id) => {
  //eslint-disable-next-line
  const response = await fetch(`${host}/api/post/deletePost/${id}`, {
    method: "PUT",
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  });
};

//edit posts
const editPost = async (id, caption) => {
  //eslint-disable-next-line
  const response = await fetch(`${host}/api/post/updatePost/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
    body: JSON.stringify({ caption }),
  });
};
const handleLike = async (id) => {
  //eslint-disable-next-line
  const response = await fetch(`${host}/api/post/updateLike/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
};
const PostById = async (id) => {
  const response = await fetch(`${host}/api/post/PostById/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  const ParsedResponse = await response.json();
  const stream = await getImages(ParsedResponse.File.Id);
  ParsedResponse.img = stream;
  if (ParsedResponse.user.ProfilePic) {
    const stream = await getImages(ParsedResponse.user.ProfilePic);
    ParsedResponse.user.pic = stream;
  }
  return ParsedResponse;
};
const getUserPosts = async (id) => {
  const response = await fetch(`${host}/api/post/getUserPost/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  const ParsedResponse = await response.json();
  const ParsedPosts = await Promise.all(
    ParsedResponse.map(async (p) => {
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
