import Profile from "./components/Profile";
import SignUpSide from "./components/SignUpSide";
import SignInSide from "./components/SignInSide";
import Posts from "./components/Posts";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CommentSection from "./components/CommentSection";
import Inbox from "./components/Inbox";
import ForgetPassword from "./components/ForgetPassword";
import InfoState from "./Contexts/InfoState";
function App() {
  return (
    <>
      <InfoState>
        <ToastContainer
          position="bottom-left"
          style={{ width: "fit-content" }}
        />
        <BrowserRouter>
          <Routes>
            <Route exact path="/SignUp" element={<SignUpSide />} />
            <Route exact path="/login" element={<SignInSide />} />
            <Route exact path="/ForgetPassword" element={<ForgetPassword />} />
            <Route
              path="/profile/:id"
              element={
                <>
                  <Navbar />
                  <Profile />
                </>
              }
            />
            <Route
              exact
              path="/"
              element={
                <>
                  <Navbar />
                  <Posts />
                </>
              }
            />

            <Route
              path="/comment/:id"
              element={
                <>
                  <Navbar />
                  <CommentSection />
                </>
              }
            />
            <Route
              path={"/inbox"}
              element={
                <>
                  <Navbar />
                  <Inbox />
                </>
              }
            />
            <Route
              path={"/inbox/:id"}
              element={
                <>
                  <Navbar />
                  <Inbox />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </InfoState>
    </>
  );
}

export default App;
