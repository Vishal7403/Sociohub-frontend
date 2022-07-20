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

export default function Inbox() {
  const host = "http://localhost:7878";
  const [Conversations, setConversations] = useState([]);
  const [Chat, setChat] = useState(null);
  const [Userid, setUserid] = useState(null);
  const fetchConvo = async () => {
    const response = await fetch(
      `${host}/api/conversation/${localStorage.getItem("UserId")}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const ParsedResponse = await response.json();
    console.log(ParsedResponse);
    setConversations(ParsedResponse);
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchConvo();
    }
  }, []);
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
            setChat={setChat}
            setUserid={setUserid}
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
            Live From Space
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
        <Messenger Chat={Chat} Userid={Userid} />
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
