import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import { FixedSizeList } from "react-window";
import Render from "./Render";
import Messenger from "./Messenger";
import { useNavigate,useParams } from "react-router-dom";
import { fetchConvo } from "../Apis/ChatApi";
export default function Inbox() {
  const param=useParams()
  const [Conversations, setConversations] = useState([]);
  const [Chat, setChat] = useState(null);
  const navigate = useNavigate();
  const func = async () => {
    const convo = await fetchConvo();
    setConversations(convo);
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    if(param.id)
    {
      setChat(param.id)
    }
    func();
    //eslint-disable-next-line
  }, [param]);
  function renderRow(props) {
    const { index, style } = props;
    //eslint-disable-next-line
    return Conversations[index].members.map((m) => {
      if (localStorage.getItem("UserId") !== m) {
        return (
          <Render
            style={style}
            id={m}
            key={index}
            convoId={Conversations[index]._id}
          />
        );
      }
    });
  }
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        width: Chat ? "fit-content" : "75%",
        marginTop: "80px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid",
          borderRightWidth: "thin",
        }}
      >
        <CardContent sx={{ display: "flex" }}>
          <Typography component="div" variant="h5">
            Inbox
          </Typography>
        </CardContent>
        <Divider />
        <Box
          sx={{
            width: "100%",
            height: 400,
            maxWidth: 360,
            bgcolor: "background.paper",
          }}
        >
          {Conversations && (
            <FixedSizeList
              height={400}
              width={360}
              itemSize={46}
              itemCount={Conversations.length}
              overscanCount={5}
            >
              {renderRow}
            </FixedSizeList>
          )}
        </Box>
      </Box>
      {Chat ? (
        <Messenger Chat={Chat}  />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", margin: "auto" }}>
          <Typography
            component="div"
            sx={{ textAlign: "center", marginBottom: "20px" }}
          >
            <ForumIcon sx={{ transform: "scale(3)" }} />
          </Typography>
          <Typography component="div" sx={{ textAlign: "center" }}>
            <strong>your messages</strong>
          </Typography>
          <Typography component="div">
            <Button variant="contained">Send Message</Button>
          </Typography>
        </Box>
      )}
    </Card>
  );
}
