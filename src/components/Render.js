import { useEffect, useState } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import UserImg from "./user_img.png";
import { getUserInfo } from "../Apis/UserApi";
import {useNavigate} from "react-router-dom"
function Render(props) {
  const { style, id,convoId} = props;
  const [User, setUser] = useState("");
  let navigate=useNavigate()
  useEffect(() => {
    const func = async () => {
      let res = await getUserInfo(id);
      setUser(res);
    };
    func();
  }, [id]);

  return (
    <ListItem
      style={style}
      component="div"
      disablePadding
      onClick={() => {
        navigate(`/inbox/${convoId}`)
      }}
    >
      <ListItemButton>
        <ListItemAvatar>
          <Avatar src={!User.ProfilePic ? UserImg : User.ProfilePic} />
        </ListItemAvatar>
        <ListItemText primary={User.name} sx={{ border: "0px" }} />
      </ListItemButton>
    </ListItem>
  );
}

export default Render;
