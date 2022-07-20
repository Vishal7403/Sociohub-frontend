import Profile from "./components/Profile";
import SignUpSide from "./components/SignUpSide";
import SignInSide from "./components/SignInSide";
import Posts from "./components/Posts";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CommentSection from "./components/CommentSection";
import Inbox from "./components/Inbox";
import ForgetPassword from "./components/ForgetPassword";
import InfoState from "./Contexts/InfoState";
function App() {
  return (
    <>
      <InfoState>
        <Router>
          <ToastContainer
            position="bottom-left"
            style={{ width: "fit-content" }}
          />
          <div>
            <Switch>
              <Route exact path="/SignUp">
                <SignUpSide />
              </Route>
              <Route exact path="/login">
                <SignInSide />
              </Route>
              <Route exact path="/ForgetPassword">
                <ForgetPassword />
              </Route>
              <Route path="/profile/:id">
                <Navbar />
                <Profile />
              </Route>
              <Route exact path="/">
                <Navbar />
                <Posts />
              </Route>
              <Route path="/comment/:id">
                <Navbar />
                <CommentSection />
              </Route>
              <Route exact path="/inbox">
                <Navbar />
                <Inbox />
              </Route>
            </Switch>
          </div>
        </Router>
      </InfoState>
    </>
  );
}

export default App;
