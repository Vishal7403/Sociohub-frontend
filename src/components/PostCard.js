import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Typography,
} from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import UserImg from "./user_img.png";
import MessageBar from "./MessageBar";
import ShareIcon from "@mui/icons-material/Share";
import { Link, useHistory } from "react-router-dom";
import { useState, useMemo } from "react";
import { createComment } from "../Apis/CommentApi";
import { format } from "timeago.js";
import Popup from "./Popup";
import ReactPlayer from "react-player";
import { handleLike } from "../Apis/PostApi";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import {SavePost} from "../Apis/UserApi"
function LikeBar(props) {
  const history = useHistory();
  const { post, CommentCount, SavedPosts } = props;
  const [Likes, setLikes] = useState(post.likes.length);
  const [open, setOpen] = useState(false);
  const [Liked, setLiked] = useState(
    post.likes.includes(localStorage.getItem("UserId"))
  );
  const [Bookmark, setBookmark] = useState(SavedPosts.includes(post._id));
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const HandleLike = () => {
    setLikes(Liked ? Likes - 1 : Likes + 1);
    setLiked(!Liked);
    handleLike(post._id);
  };
  const changeBookmark=()=>{
    setBookmark(!Bookmark)
    SavePost(post._id)
  }
  return (
    <>
      {open && (
        <Popup
          open={open}
          onClose={handleClose}
          Data={post.likes}
          title="Likes"
        />
      )}
      <CardActions disableSpacing>
        <button
          aria-label="add to favorites"
          onClick={HandleLike}
          style={{ border: "0", background: "white" }}
        >
          {!Liked ? (
            <FavoriteBorderIcon />
          ) : (
            <FavoriteRoundedIcon style={{ color: "red" }} />
          )}
        </button>
        <button
          aria-label="add comment"
          style={{ border: "0", background: "white" }}
          onClick={() => {
            history.push(`/comment/${post._id}`);
          }}
        >
          <AddCommentIcon />
        </button>
        <button aria-label="share" style={{ border: "0", background: "white" }}>
          <ShareIcon />
        </button>
        <button
          style={{ border: "0", background: "white", marginLeft: "auto" }}
          onClick={changeBookmark}
        >
          {Bookmark ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </button>
      </CardActions>
      <CardContent sx={{ paddingTop: "0px" }}>
        {Likes > 0 && (
          <Typography
            variant="button"
            color="text.primary"
            sx={{ cursor: "pointer" }}
            onClick={handleClickOpen}
          >
            Liked by {Likes} users
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          <Link
            to={`profile/${post.user._id}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <strong style={{ marginRight: "10px" }}>{post.user.name}</strong>
          </Link>
          {post.caption}
        </Typography>
        {CommentCount > 0 && (
          <Typography variant="body2" color="text.secondary">
            <Link
              to={`/comment/${post._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              View all {CommentCount} comments
            </Link>
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {format(post.createdAt)}
        </Typography>
      </CardContent>
    </>
  );
}
function PostItem(props) {
  const [CommentCount, setCommentCount] = useState(props.post.comment);
  const handleClick = async (comment) => {
    //eslint-disable-next-line
    let res = await createComment(props.post._id, comment);
    setCommentCount(CommentCount + 1);
    return true;
  };
  return (
    <div className="m-3">
      <Card>
        <CardHeader
          avatar={
            <Avatar
              src={!props.post.user.ProfilePic ? UserImg : props.post.user.pic}
            />
          }
          title={
            <Link
              to={`profile/${props.post.user._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <strong style={{ fontSize: "15px" }}>
                {props.post.user.name}
              </strong>
            </Link>
          }
        />
        <div style={{ background: "black" }}>
          {props.post.File.metadata === "video/mp4" ? (
            <ReactPlayer
              style={{ maxWidth: "fit-content" }}
              url={`http://localhost:7878/api/post/getVideos/${props.post.File.Id}`}
              playing={true}
              loop={true}
              controls
            />
          ) : (
            <CardMedia
              component="img"
              style={{ maxHeight: "500px", width: "100%" }}
              image={props.post.img}
            />
          )}
        </div>
        <LikeBar {...props} CommentCount={CommentCount} />
        <MessageBar
          handleClick={handleClick}
          prompt={"Comment"}
          style={{ width: "100%" }}
        />
      </Card>
    </div>
  );
}
function PostCard(props) {
  const { post } = props;
  const MemoValue = useMemo(() => {
    return <PostItem {...props} />;
    //eslint-disable-next-line
  }, [post._id, post]);
  return <>{MemoValue}</>;
}
export default PostCard;
