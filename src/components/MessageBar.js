import { useState } from "react";
import { TextareaAutosize, Button, CircularProgress } from "@mui/material";
import EmojiBar from "./EmojiBar";
function MessageBar(props) {
  const { handleClick, prompt, style } = props;
  const [Message, setMessage] = useState("");
  const [Loading, setLoading] = useState(false);
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  const SetMessage = (val) => {
    setMessage(Message + val);
  };
  const handleSubmit = async () => {
    setLoading(true);
    let res = await handleClick(Message);
    if (props.HandleCount) {
      props.HandleCount();
    }
    setMessage("");
    setLoading(false);
  };
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <EmojiBar SetMessage={SetMessage} />
      <TextareaAutosize style={style} value={Message} onChange={onChange} />
      <Button
        sx={{
          paddingLeft: "18px",
          paddingRight: "18px",
          textTransform: "none",
        }}
        disabled={Message.length === 0}
        onClick={handleSubmit}
      >
        {Loading ? <CircularProgress size={20} /> : prompt}
      </Button>
    </div>
  );
}

export default MessageBar;
