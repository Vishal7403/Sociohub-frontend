import { useContext, useEffect, useState } from "react";
import {
  Container,
  Avatar,
  Box,
  Button,
  Divider,
  ImageList,
  ImageListItem,
  CircularProgress,
} from "@mui/material";
import UserImg from "./user_img.png";
import { useParams, useHistory } from "react-router-dom";
import { getUserInfo, handleFollow } from "../Apis/UserApi";
import { getUserPosts } from "../Apis/PostApi";
import InfoContext from "../Contexts/InfoContext";
import Popup from "./Popup";
import GridOnIcon from "@mui/icons-material/GridOn";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import GroupIcon from "@mui/icons-material/Group";
//disableGutters to remove default padding
function FollowBar(props) {
  const { id, handleFollow, Followers, handleFollowerCount } = props;
  const [IsFollowing, setIsFollowing] = useState(null);
  useEffect(() => {
    setIsFollowing(Followers.includes(localStorage.getItem("UserId")));
  }, [Followers]);
  const [Loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    let res = handleFollow(id);
    if (res) {
      handleFollowerCount(IsFollowing);
      setIsFollowing(!IsFollowing);
      setLoading(false);
    }
  };
  return Loading ? (
    <Button variant="contained" size="small" onClick={handleClick} disabled>
      <CircularProgress size={20} />
    </Button>
  ) : IsFollowing ? (
    <>
      <Button variant="contained" size="small" sx={{ marginRight: "20px" }}>
        Message
      </Button>
      <Button variant="contained" size="small" onClick={handleClick}>
        Unfollow
      </Button>
    </>
  ) : (
    <Button variant="contained" size="small" onClick={handleClick}>
      Follow
    </Button>
  );
}
function InfoBar(props) {
  const { id, UserData, len, handleFollow } = props;
  const [Followers, SetFollowers] = useState(0);
  const [Open, setOpen] = useState(false);
  const [Data, setData] = useState({ data: null, title: "" });
  const handleClickOpen = (d, t) => {
    setData({ data: d, title: t });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setData({ data: null, title: "" });
  };
  const handleFollowerCount = (val) => {
    let UserId = localStorage.getItem("UserId");
    let newFollowers = val
      ? Followers.filter((f) => f !== UserId)
      : Followers.concat(UserId);
    SetFollowers(newFollowers);
  };
  useEffect(() => {
    SetFollowers(UserData.Followers);
  }, [UserData.Followers]);
  return (
    <>
      {Open && (
        <Popup
          open={Open}
          onClose={handleClose}
          Data={Data.data}
          title={Data.title}
        />
      )}
      <Box
        component={"div"}
        sx={{
          display: "flex",
          alignItems: "center",
          marginRight: "20px",
          marginBottom: "20px",
        }}
      >
        <strong style={{ fontSize: "1.5rem", marginRight: "30px" }}>
          {UserData.name}
        </strong>
        {id !== localStorage.getItem("UserId") ? (
          <FollowBar
            id={id}
            handleFollow={handleFollow}
            Followers={UserData.Followers}
            handleFollowerCount={handleFollowerCount}
          />
        ) : (
          <Button variant="contained" size="small">
            Edit Profile
          </Button>
        )}
      </Box>
      <Box
        component={"div"}
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "17px",
        }}
      >
        <div style={{ marginRight: "60px" }}>{len} posts</div>
        <div
          style={{ marginRight: "60px", cursor: "pointer" }}
          onClick={() => {
            if (Followers.length > 0) {
              handleClickOpen(UserData.Followers, "Followers");
            }
          }}
        >
          {Followers.length} Followers
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (UserData.Following.length > 0) {
              handleClickOpen(UserData.Following, "Following");
            }
          }}
        >
          {UserData.Following.length} Following
        </div>
      </Box>
    </>
  );
}
const Posts = (props) => {
  const { UserPosts } = props;
  const history = useHistory();
  return (
    <ImageList cols={3}>
      {UserPosts.map((post) => (
        <ImageListItem
          key={post._id}
          sx={{ marginBottom: "20px", cursor: "pointer" }}
          onClick={() => {
            history.push(`/comment/${post._id}`);
          }}
        >
          <img
            alt=""
            src={post.img}
            style={{
              height: "300px",
              width: "300px",
              borderRadius: "5px",
            }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};
export default function Profile() {
  const id = useParams();
  const infocontext = useContext(InfoContext);
  const { Loading } = infocontext;
  const [UserData, setUserData] = useState(null);
  const [UserPosts, setUserPosts] = useState(null);
  const [Bar, setBar] = useState(0);
  const history=useHistory()
  useEffect(() => {
    if(!localStorage.getItem("token"))
    {
      history.push("/login")
    }
    const getData = async () => {
      Loading(10);
      let Posts = await getUserPosts(id.id);
      Loading(40);
      setUserPosts(Posts);
      Loading(60);
      let UserInfo = await getUserInfo(id.id);
      setUserData(UserInfo);
      Loading(100);
    };
    getData();
    //eslint-disable-next-line
  }, [id]);
  const changeBar = (val) => {
    if (Bar !== val) {
      setBar(val);
    }
  };
  return (
    UserPosts &&
    UserData && (
      <Container
        disableGutters
        sx={{ marginTop: "90px", paddingRight: "105px", paddingLeft: "105px" }}
      >
        <Box component={"div"}>
          <Box component={"div"} sx={{ display: "flex", marginBottom: "40px" }}>
            <Avatar
              src={!UserData.ProfilePic ? UserImg : UserData.pic}
              sx={{ height: "140px", width: "140px", marginRight: "70px" }}
            />
            <Box
              component={"section"}
              sx={{ width: "100%", paddingTop: "20px" }}
            >
              <InfoBar
                UserData={UserData}
                len={UserPosts.length}
                id={id.id}
                handleFollow={handleFollow}
              />
              <Box component={"div"}>Bio</Box>
            </Box>
          </Box>
          <Divider />
          <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              marginBottom: "10px",
            }}
          >
            <Box
              component={"div"}
              style={{ cursor: "pointer" }}
              onClick={() => {
                changeBar(0);
              }}
            >
              {Bar === 0 && <Divider />}
              <GridOnIcon />
              POSTS
            </Box>
            <Box
              component={"div"}
              style={{ cursor: "pointer" }}
              onClick={() => {
                changeBar(1);
              }}
            >
              {Bar === 1 && <Divider />}
              <BookmarkBorderIcon />
              SAVED
            </Box>
            <Box
              component={"div"}
              style={{ cursor: "pointer" }}
              onClick={() => {
                changeBar(2);
              }}
            >
              {Bar === 2 && <Divider />}
              <GroupIcon />
              TAGGED
            </Box>
          </Box>
        </Box>
        <Posts UserPosts={UserPosts} />
      </Container>
    )
  );
}
