import {
  CircularProgress,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginUser, LoginUsingGoogle, getUserInfo } from "../Apis/UserApi";
import jwt_decode from "jwt-decode";
const theme = createTheme();
export default function SignIn() {
  const handleCallback = async (response) => {
    let user = jwt_decode(response.credential);
    let res = await LoginUsingGoogle(user.email);
    if (res.success) {
      localStorage.setItem("token", res.authToken);
      localStorage.setItem("UserId", res.UserId);
      history.push("/");
      Toast(res.message, "success");
    } else {
      Toast(res.message, "error");
    }
  };
  useEffect(() => {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://accounts.google.com/gsi/client";
    document.body.appendChild(script);
    script.onload = function () {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENT_ID,
        callback: handleCallback,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        {
          theme: "outline",
          size: "large",
          width: "500",
        }
      );
    };
  }, []);
  const Toast = (msg, type) =>
    toast(msg, { type: type, pauseOnFocusLoss: false, pauseOnHover: false });
  const [Loader, setLoader] = useState(false);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  let history = useHistory();
  const handleSubmit = async (event) => {
    setLoader(true);
    event.preventDefault();
    let response = await LoginUser(Email, Password);
    console.log(response.success)
    if (response.success) {
      localStorage.setItem("token", response.authToken);
      localStorage.setItem("UserId", response.UserId);
      history.push("/");
      Toast(response.message, "success");
    } else {
      Toast("please login with correct credentials", "error");
      setLoader(false);
    }
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              value={Email}
              onChange={handleEmail}
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              value={Password}
              onChange={handlePassword}
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={Email.length === 0 || Password.length === 0 || Loader}
              sx={{ mt: 3, mb: 2 }}
            >
              {!Loader ? "Sign In" : <CircularProgress />}
            </Button>
            <div id="googleButton" style={{ marginBottom: "10px" }}></div>
            <Grid container>
              <Grid item xs>
                <Link href="/ForgetPassword" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
