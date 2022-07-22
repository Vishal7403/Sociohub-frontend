import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { createPosts } from "../Apis/PostApi";
import {
  Dialog,
  Divider,
  Card,
  Button,
  CardContent,
  Box,
  Paper,
  MenuList,
  MenuItem,
  ListItemText,
  Avatar,
  CircularProgress,
} from "@mui/material";
import EmojiBar from "./EmojiBar";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { getUserInfo } from "../Apis/UserApi";
function DropZone(props) {
  const { handleFile } = props;
  const onDrop = useCallback((f) => {
    if (f.length === 0) {
      return;
    }
    handleFile(f[0]);
    //eslint-disable-next-line
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png"],
      "video/*": [".mp4"],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button variant="contained">Select from computer</Button>
    </div>
  );
}
function OuterDropzone(props) {
  const { handleFile } = props;
  const onDrop = useCallback((f) => {
    if (f.length === 0) {
      return;
    }
    handleFile(f[0]);
    //eslint-disable-next-line
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    noClick: true,
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png"],
      "video/*": [".mp4"],
    },
  });

  return (
    <div
      {...getRootProps()}
      style={{
        height: "363px",
        width: "-webkit-fill-available",
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <OndemandVideoIcon style={{ fontSize: "100px" }} />
      <h5>Drag photos and videos here</h5>
      <input {...getInputProps()} />
      <div style={{ width: "max-content" }}>
        <DropZone handleFile={handleFile} />
      </div>
    </div>
  );
}
function ContentArea(props) {
  const { file } = props;
  const [Caption, setCaption] = useState("");
  const [Loader, setLoader] = useState(false);
  const onChange = (e) => {
    setCaption(e.target.value);
  };
  const SetMessage = (data) => {
    setCaption(data + Caption);
  };
  const HandleCompression = async (f) => {
    const imageFile = f;
    const options = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      return compressedFile;
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = async () => {
    setLoader(true);
    let File;
    let data = new FormData();
    if (file.type !== "video/mp4") {
      File = await HandleCompression(file);
    } else {
      File = file;
    }
    data.append("file", File);
    data.append("caption", Caption);
    let res = await createPosts(data);
    if (res) {
      window.location.reload();
    }
  };
  return (
    <>
      <div>
        <textarea
          style={{
            width: "-webkit-fill-available",
            minHeight: "225px",
            border: "none",
            outline: "none",
          }}
          value={Caption}
          onChange={onChange}
          placeholder={"Enter your caption here"}
        ></textarea>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <EmojiBar SetMessage={SetMessage} />
        </div>
        <Button onClick={handleClick}>
          {!Loader ? "Share" : <CircularProgress size={20} />}
        </Button>
      </div>
    </>
  );
}
function Func(props) {
  const { file, type } = props;
  const [UserData, setUserData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      const res = await getUserInfo(localStorage.getItem("UserId"));
      setUserData(res);
    };
    getData();
  }, []);
  return (
    UserData && (
      <Card>
        <div style={{ textAlign: "center", margin: "5px 0px" }}>
          <strong style={{ fontSize: "large" }}>Create new post</strong>
        </div>
        <div style={{ display: "flex" }}>
          <div>
            {type === "video/mp4" ? (
              <video
                controls
                autoPlay
                style={{ maxHeight: "330px", maxWidth: "550px" }}
              >
                <source src={URL.createObjectURL(file)}></source>
              </video>
            ) : (
              <img
                src={URL.createObjectURL(file)}
                style={{ maxHeight: "330px", maxWidth: "550px" }}
                alt=""
              />
            )}
          </div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "30vw",
            }}
          >
            <CardContent sx={{ flex: "1 0 auto", paddingTop: "0px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: "10px",
                }}
              >
                <Avatar src={UserData.pic} />
                <div>
                  <strong style={{ fontSize: "large" }}>{UserData.name}</strong>
                </div>
              </div>
              <ContentArea file={file} />
            </CardContent>
          </Box>
        </div>
      </Card>
    )
  );
}
function HandleClose(props) {
  const { open, onClose, CloseAll } = props;
  const handleClick = () => {
    onClose();
    CloseAll();
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <Paper sx={{ width: 320, maxWidth: "100%" }}>
        <MenuList>
          <MenuItem>
            <ListItemText
              style={{ textAlign: "center" }}
              primary={"Discard Post"}
              secondary={"If you leave, your edits won't be saved."}
            ></ListItemText>
          </MenuItem>
          <Divider style={{ marginBottom: "0px" }} />
          <MenuItem>
            <ListItemText
              style={{ textAlign: "center", color: "red" }}
              onClick={handleClick}
            >
              Discard
            </ListItemText>
          </MenuItem>
          <Divider style={{ margin: "0px" }} />
          <MenuItem>
            <ListItemText
              style={{ textAlign: "center" }}
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>
    </Dialog>
  );
}
export default function AddPost(props) {
  const { onClose, open } = props;
  const [File, setFile] = useState(null);
  const handleClick = () => {
    onClose();
    setFile(null);
  };
  const handleFile = (file) => {
    setFile(file);
  };
  const CloseMenu = () => {
    setOpen(false);
  };
  const [Open, setOpen] = useState(false);
  return (
    <Dialog
      disableEnforceFocus
      PaperProps={{
        sx: {
          maxWidth: "80vw",
          maxHeight: "80vh",
        },
      }}
      open={open}
      onClose={
        File
          ? () => {
              setOpen(true);
            }
          : handleClick
      }
    >
      {File ? (
        <Func file={File} type={File.type} />
      ) : (
        <Card style={{ height: "400px", width: "400px" }}>
          <div style={{ textAlign: "center", margin: "5px 0px" }}>
            <strong style={{ fontSize: "large" }}>Create new post</strong>
          </div>
          <Divider />

          <OuterDropzone handleFile={handleFile} />
        </Card>
      )}
      <HandleClose open={Open} onClose={CloseMenu} CloseAll={handleClick} />
    </Dialog>
  );
}
