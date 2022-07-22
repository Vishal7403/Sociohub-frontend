import { getImages } from "./PostApi";
import axios from "axios";

//used to fetch comments of a post
const getPostComments = async (id) => {
  const response = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_HOST}/api/comment/getPostComment/${id}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  const comments = await Promise.all(
    response.data.map(async (comment) => {
      if (comment.user.ProfilePic) {
        const stream = await getImages(comment.user.ProfilePic);
        comment.user.pic = stream;
      }
      return comment;
    })
  );
  return comments;
};
//used for creating comment
const createComment = async (id, description) => {
  const response = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_HOST}/api/comment/createComment/${id}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
    data: {
      description: description,
    },
  });
  return response.data;
};
//used to delete comment
const deleteComment = async (commentId) => {
  //eslint-disable-next-line
  const response = await axios({
    method: "PUT",
    url: `${process.env.REACT_APP_HOST}/api/comment/deleteComment/${commentId}`,
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
};
export { getPostComments, createComment, deleteComment };
