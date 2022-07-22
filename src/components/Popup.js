import React, { useEffect, useState } from "react";
import {
  DialogTitle,
  Dialog,
  Box,
  ListItem,
  ListItemText,
  Divider,
  ListItemAvatar,
  Avatar,
  Button,
} from "@mui/material";
import { FixedSizeList } from "react-window";
import CloseIcon from "@mui/icons-material/Close";
import UserImg from "./user_img.png";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../Apis/UserApi";
function Popup(props) {
  const { onClose, open, Data, title } = props;
  function RenderRow(props) {
    let navigate = useNavigate();
    const { index, style } = props;
    const [User, setUser] = useState(null);
    useEffect(() => {
      const handleUser = async () => {
        let user = await getUserInfo(Data[index]);
        setUser(user);
      };
      handleUser();
      //eslint-disable-next-line
    }, []);
    return (
      User && (
        <>
          <ListItem
            style={style}
            key={index}
            component="div"
            sx={{ margin: "10px 0px" }}
          >
            <ListItemAvatar
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate(`/profile/${User._id}`);
              }}
            >
              <Avatar src={!User.ProfilePic ? UserImg : User.pic} />
            </ListItemAvatar>
            <ListItemText primary={User.name} sx={{ paddingLeft: "10px" }} />
            <Button
              variant="contained"
              sx={{
                padding: "8px",
                textTransform: "lowercase",
                fontSize: "medium",
              }}
            >
              {!User.Following.includes(localStorage.getItem("UserId"))
                ? "Follow"
                : "Following"}
            </Button>
          </ListItem>
        </>
      )
    );
  }

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", padding: "8px 16px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "-webkit-fill-available",
          }}
        >
          <div>{title}</div>
        </div>
        <button
          style={{ background: "none", border: "0" }}
          onClick={handleClose}
        >
          <CloseIcon />
        </button>
      </DialogTitle>
      <Divider />
      <Box
        sx={{
          width: "100%",
          height: 300,
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
      >
        <FixedSizeList
          height={300}
          width={360}
          itemSize={60}
          itemCount={Data.length}
          overscanCount={10}
        >
          {RenderRow}
        </FixedSizeList>
      </Box>
    </Dialog>
  );
}

export default Popup;
