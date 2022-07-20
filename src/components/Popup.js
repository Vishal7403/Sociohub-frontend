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
import { useHistory } from "react-router-dom";
function Popup(props) {
  const { onClose, open, Data, title } = props;
  function RenderRow(props) {
    let history = useHistory();
    const { index, style } = props;
    const [User, setUser] = useState(null);
    useEffect(() => {
      const handleUser = async () => {
        const host = "http://localhost:7878";
        const response = await fetch(
          `${host}/api/auth/getUser/${Data[index]}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          }
        );
        const ParsedResponse = await response.json();
        setUser(ParsedResponse);
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
                history.push(`/profile/${User._id}`);
              }}
            >
              <Avatar
                src={!User.ProfilePic ? UserImg : User.pic}
              />
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
