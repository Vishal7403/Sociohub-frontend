import { useState } from "react";
import Picker from "emoji-picker-react";
import { Popper, Fade, Paper, Box, Button, Typography } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

export default function EmojiBar(props) {
  const { SetMessage } = props;
  const onEmojiClick = (event, emoji) => {
    SetMessage(emoji.emoji);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState();
  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };
  return (
    <>
      <Box>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement={placement}
          transition
          style={{ zIndex: "1400" }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <Typography sx={{ p: 2 }} component={"span"} variant={"body2"}>
                  {
                    <Picker
                      onEmojiClick={onEmojiClick}
                      disableSearchBar={true}
                    />
                  }
                </Typography>
              </Paper>
            </Fade>
          )}
        </Popper>
        <Button onClick={handleClick("top")}>
          <InsertEmoticonIcon />
        </Button>
      </Box>
    </>
  );
}
