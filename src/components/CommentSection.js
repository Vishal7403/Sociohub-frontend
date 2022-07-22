import {
  Divider,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CardActions,
  Menu,
  MenuItem,
} from "@mui/material";
import { FixedSizeList } from "react-window";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./CommentStyles.css";
import ShareIcon from "@mui/icons-material/Share";
import { useEffect, useState, Fragment,useContext } from "react";
import UserImg from "./user_img.png";
import Button from "@mui/material/Button";
import MessageBar from "./MessageBar";
import { styled } from "@mui/styles";
import { format } from "timeago.js";
import Popup from "./Popup";
import ReactPlayer from "react-player";
import { handleLike, PostById } from "../Apis/PostApi";
import {
  getPostComments,
  createComment,
  deleteComment,
} from "../Apis/CommentApi";
import InfoContext from "../Contexts/InfoContext";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
const CardContentNoPadding = styled(CardContent)(`
  &:last-child {
    padding-bottom: 0;
  }
`);
function LikeBar(props) {
  const { post } = props;
  const [Likes, setLikes] = useState(post.likes.length);
  const [Liked, setLiked] = useState(
    post.likes.includes(localStorage.getItem("UserId"))
  );
  const HandleLike = () => {
    setLikes(Liked ? Likes - 1 : Likes + 1);
    setLiked(!Liked);
    handleLike(post._id);
  };
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
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
        <button aria-label="share" style={{ border: "0", background: "white" }}>
          <ShareIcon />
        </button>
      </CardActions>
      <CardContent sx={{ paddingTop: "0px" }}>
        {Likes > 0 && (
          <Typography
            style={{ cursor: "pointer" }}
            variant="body2"
            color="text.primary"
            onClick={handleClickOpen}
          >
            Liked by {Likes} users
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {format(post.createdAt)}
        </Typography>
      </CardContent>
    </>
  );
}
function MenuButton(props) {
  const { deleteComment, id } = props;
  const [AnchorEl, SetAnchorEl] = useState(null);
  const Open = Boolean(AnchorEl);
  const handleMenu = (event) => {
    SetAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    SetAnchorEl(null);
  };
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={Open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={Open ? "true" : undefined}
        onClick={handleMenu}
      >
        ⋮
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={AnchorEl}
        open={Open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            deleteComment(id);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
export default function CommentSection() {
  const { id } = useParams();
  const [Comments, setComments] = useState([]);
  const [Post, setPost] = useState(null);
  const navigate = useNavigate();
  const infocontext = useContext(InfoContext);
  const { Loading } = infocontext;
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    const func = async () => {
      Loading(10);
      let p = await PostById(id);
      Loading(30);
      setPost(p);
      Loading(50);
      let comments = await getPostComments(id);
      Loading(70);
      setComments(comments);
      Loading(100);
    };
    func();
    //eslint-disable-next-line
  }, []);
  const handleClick = (comment) => {
    createComment(Post._id, comment);
  };
  function renderRow(props) {
    const { index, style } = props;

    return (
      <ListItem style={style} key={index} alignItems="center">
        <ListItemAvatar>
          <Avatar
            src={
              !Comments[index].user.ProfilePic
                ? UserImg
                : Comments[index].user.pic
            }
          />
        </ListItemAvatar>
        <ListItemText
          sx={{ wordBreak: "break-all" }}
          secondary={
            <Fragment>
              <Link
                to={`/profile/${Comments[index].user._id}`}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  sx={{ display: "inline", marginRight: "10px" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {Comments[index].user.name}
                </Typography>
              </Link>
              {Comments[index].description}
            </Fragment>
          }
        />
        {localStorage.getItem("UserId") === Comments[index].user._id && (
          <MenuButton id={Comments[index]._id} deleteComment={deleteComment} />
        )}
      </ListItem>
    );
  }

  return (
    Post &&
    Comments && (
      <div
        style={{ display: "flex", justifyContent: "center", margin: "84px" }}
      >
        <Card style={{ display: "flex" }}>
          <div style={{ marginTop: "auto", marginBottom: "auto" }}>
            <div style={{ background: "black" }}>
              {Post.File.metadata === "video/mp4" ? (
                <ReactPlayer
                  url={`${process.env.REACT_APP_HOST}/api/post/getVideos/${Post.File.Id}`}
                  playing={true}
                  loop={true}
                  controls
                  style={{ maxWidth: "530px", maxHeight: "470px" }}
                />
              ) : (
                <CardMedia
                  component="img"
                  style={{ maxHeight: "470px", maxWidth: "530px" }}
                  image={Post.img}
                />
              )}
            </div>
          </div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "fit-content",
            }}
          >
            <CardContentNoPadding
              sx={{ flex: "1 0 auto", paddingBottom: "0px" }}
            >
              <Typography
                component="div"
                variant="h5"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Avatar src={!Post.user.ProfilePic ? UserImg : Post.user.pic} />
                <div style={{ width: "100%", marginLeft: "10px" }}>
                  {Post.user.name}
                </div>
              </Typography>
              <Divider sx={{ marginTop: "10px" }} />
              {
                <FixedSizeList
                  className="no-scrollbars"
                  height={247}
                  width={540}
                  itemSize={46}
                  itemCount={Comments.length}
                  overscanCount={5}
                >
                  {renderRow}
                </FixedSizeList>
              }
              <Divider />
              <LikeBar post={Post} />
              <Divider />
              <MessageBar
                handleClick={handleClick}
                prompt={"Comment"}
                style={{ width: "100%" }}
              />
            </CardContentNoPadding>
          </Box>
        </Card>
      </div>
    )
  );
}
