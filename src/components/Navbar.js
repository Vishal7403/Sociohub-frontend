import { styled, alpha } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  MenuItem,
  Menu,
  Popper,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { useRef } from "react";
import { SearchUser, getUserInfo } from "../Apis/UserApi";
import UserImg from "./user_img.png";
import LoadingBar from "react-top-loading-bar";
import InfoContext from "../Contexts/InfoContext";
import AddPost from "./AddPost";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
function SearchList(props) {
  const { anchor, Query, changeQuery } = props;
  const [Users, setUsers] = useState([]);
  const [Loader, setLoader] = useState(false);
  let navigate = useNavigate();
  useEffect(() => {
    const getUsers = async () => {
      setLoader(true);
      let data = await SearchUser(Query);
      setUsers(data);
      setLoader(false);
    };
    getUsers();
    //eslint-disable-next-line
  }, [Query]);
  return (
    <Popper
      anchorEl={anchor}
      open={true}
      style={{ width: "40%", overflowY: "scroll" }}
    >
      <Card style={{ height: "400px" }}>
        {Loader ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "180px",
            }}
          >
            <CircularProgress />
          </div>
        ) : Users.length > 0 ? (
          Users.map((user) => {
            return (
              <List
                key={user._id}
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  cursor: "pointer",
                }}
                onClick={() => {
                  changeQuery();
                  navigate(`/profile/${user._id}`);
                }}
              >
                <ListItem alignItems="center">
                  <ListItemAvatar>
                    <Avatar src={user.ProfilePic ? user.pic : UserImg} />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                </ListItem>
              </List>
            );
          })
        ) : (
          <div
            style={{
              display: "flex",
              marginTop: "180px",
              justifyContent: "center",
            }}
          >
            <strong>No results found</strong>
          </div>
        )}
      </Card>
    </Popper>
  );
}
function SearchBar(props) {
  let ref = useRef(null);
  const [Query, setQuery] = useState("");
  const onChange = (e) => {
    setQuery(e.target.value);
  };
  const changeQuery = () => {
    setQuery("");
  };
  return (
    <div style={{ width: "50%", marginLeft: "97px" }} ref={ref}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          value={Query}
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          onChange={onChange}
        />
      </Search>
      {Query.length > 0 && (
        <SearchList
          anchor={ref.current}
          Query={Query}
          changeQuery={changeQuery}
        />
      )}
    </div>
  );
}
function Icons() {
  let location = useLocation();
  let navigate = useNavigate();
  const [addPost, setaddPost] = useState(false);
  const handleClick = () => {
    setaddPost(false);
  };
  return (
    <>
      <IconButton
        size="large"
        color="inherit"
        onClick={() => {
          navigate("/");
        }}
      >
        <Badge>
          {location.pathname === "/" ? (
            <HomeIcon sx={{ color: "#FFFFFF" }} />
          ) : (
            <HomeOutlinedIcon sx={{ color: "#FFFFFF" }} />
          )}
        </Badge>
      </IconButton>
      <IconButton
        size="large"
        color="inherit"
        onClick={() => {
          navigate("/inbox");
        }}
      >
        <Badge>
          {location.pathname === "/inbox" ? (
            <ChatIcon sx={{ color: "#FFFFFF" }} />
          ) : (
            <ChatOutlinedIcon sx={{ color: "#FFFFFF" }} />
          )}
        </Badge>
      </IconButton>
      <IconButton
        size="large"
        color="inherit"
        onClick={() => {
          setaddPost(true);
        }}
      >
        <Badge>
          {addPost ? (
            <AddBoxIcon sx={{ color: "#FFFFFF" }} />
          ) : (
            <AddBoxOutlinedIcon sx={{ color: "#FFFFFF" }} />
          )}
        </Badge>
      </IconButton>
      <IconButton size="large" color="inherit">
        <Badge>
          <NotificationsIcon sx={{ color: "#FFFFFF" }} />
        </Badge>
      </IconButton>
      <AddPost open={addPost} onClose={handleClick} />
    </>
  );
}

export default function PrimarySearchAppBar() {
  let navigate = useNavigate();
  const [Pic, setPic] = useState(null);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    const func = async () => {
      const res = await getUserInfo(localStorage.getItem("UserId"));
      if (res.ProfilePic) {
        setPic(res.pic);
      }
    };
    func();
    //eslint-disable-next-line
  }, []);
  const context = useContext(InfoContext);
  const { Progress, Loading } = context;
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate(`/profile/${localStorage.getItem("UserId")}`);
        }}
      >
        Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("UserId");
          navigate("/login");
        }}
      >
        Log out
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" }, paddingLeft: "11%" }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "#FFFFFF" }}>
                <strong>Sociohub</strong>
              </Link>
            </Typography>
            <SearchBar />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Icons />
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {Pic ? (
                  <Avatar style={{ height: "30px", width: "30px" }} src={Pic} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
      {
        <LoadingBar
          color="#f11946"
          progress={Progress}
          onLoaderFinished={() => Loading(0)}
        />
      }
    </>
  );
}
