import {
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const theme = createTheme();
export default function ForgetPassword() {
  const Toast = (msg, type) => toast(msg, { type: type ? "success" : "error",pauseOnFocusLoss:false,pauseOnHover:false });
  const [Data, setData] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    otp: "",
  });
  const handleChange = (e) => {
    setData({ ...Data, [e.target.name]: e.target.value });
  };
  function Before() {
    return (
      <>
        <Typography component="h3" sx={{ textAlign: "center", color: "gray" }}>
          Enter your email and we 'll send you an otp
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          type="email"
          value={Data.email}
          onChange={handleChange}
          autoComplete="email"
          autoFocus
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={Data.email.length === 0}
        >
          Send Otp
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="/login" variant="body2">
              Login
            </Link>
          </Grid>
          <Grid item>
            <Link href="/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </>
    );
  }
  const [Success, setSuccess] = useState(false);
  let navigate = useNavigate();
  const host = process.env.REACT_APP_HOST;
  const handleSubmitBefore = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${host}/api/otp/forgotPassword/${Data.email}`,
      {
        method: "GET",
      }
    );
    const ParsedResponse = await response.json();
    if (ParsedResponse.success) {
      setSuccess(true);
    }
    Toast(ParsedResponse.message, ParsedResponse.success);
  };
  const handleSubmitAfter = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${host}/api/otp/forgotPassword/${Data.email}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          code: Data.otp,
          password: Data.password,
        }),
      }
    );
    const ParsedResponse = await response.json();
    if (ParsedResponse.success === true) {
      Toast(ParsedResponse.message, ParsedResponse.success);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
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
            Forget Password
          </Typography>
          <Box
            component="form"
            onSubmit={Success ? handleSubmitAfter : handleSubmitBefore}
            noValidate
            sx={{ mt: 1 }}
          >
            {!Success ? (
              <Before />
            ) : (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  value={Data.otp}
                  onChange={handleChange}
                  name="otp"
                  label="Otp"
                  id="otp"
                  autoComplete="otp"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  value={Data.password}
                  onChange={handleChange}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  value={Data.confirmpassword}
                  onChange={handleChange}
                  name="confirmpassword"
                  label="Confirm Password"
                  type="password"
                  id="confimrpassword"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={
                    Data.otp.length === 0 ||
                    Data.password.length === 0 ||
                    Data.confirmpassword.length === 0
                  }
                >
                  Proceed
                </Button>
              </>
            )}
            <ToastContainer
              position="bottom-left"
              style={{ width: "fit-content" }}
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
