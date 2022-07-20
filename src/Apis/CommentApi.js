import { getImages } from "./PostApi";
const host="https://deploy-sociohub.herokuapp.com"
//used to fetch comments of a post
const getPostComments = async (id) => {
  const response = await fetch(`${host}/api/comment/getPostComment/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  const ParsedResponse = await response.json();
  const comments = await Promise.all(
    ParsedResponse.map(async (comment) => {
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
  const response = await fetch(`${host}/api/comment/createComment/${id}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
    body: JSON.stringify({
      description: description,
    }),
  });
  const ParsedResponse = await response.json();
  //setComments(Comments.concat(ParsedResponse));
  return ParsedResponse;
};
//used to delete comment
const deleteComment = async (commentId) => {
  const response = await fetch(
    `${host}/api/comment/deleteComment/${commentId}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    }
  );
};
export { getPostComments, createComment, deleteComment };
