import React, { useEffect, useState } from "react";
import { getPosts, findCount } from "../Apis/PostApi";
import PostCard from "./PostCard";
import { useHistory } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import { getUserInfo } from "../Apis/UserApi";
import "./CommentStyles.css";
function Posts() {
  const [Page, setPage] = useState(0);
  const [Count, setCount] = useState(0);
  const [Posts, setPosts] = useState([]);
  const [SavedPosts, setSavedPosts] = useState([]);
  const history=useHistory()
  useEffect(() => {
    if(!localStorage.getItem("token"))
    {
      history.push("/")
    }
    const getData = async () => {
      
        let res = await getUserInfo(localStorage.getItem("UserId"));
        if (res.SavedPosts) {
          setSavedPosts(res.SavedPosts);
        }
        let response = await getPosts(Page, setPage);
        setPosts(response);
        let resp = await findCount();
        setCount(resp);
    };
    if (Posts.length === 0) {
      getData();
    }
    //eslint-disable-next-line
  }, []);
  async function fetchData() {
    let res = await getPosts(Page, setPage);
    let newPosts = Posts.concat(res);
    setPosts(newPosts);
  }
  return (
    Posts && (
      <div className="container" style={{ paddingTop: "60px", width: "600px" }}>
        <InfiniteScroll
          className="no-scrollbars"
          dataLength={Posts.length}
          next={fetchData}
          hasMore={Page <= Math.ceil(Count / 10)}
          scrollThreshold={"200px"}
          loader={
            <CircularProgress sx={{ marginLeft: "50%", marginTop: "10px" }} />
          }
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {Posts.map((post) => {
            return (
              <PostCard key={post._id} post={post} SavedPosts={SavedPosts} />
            );
          })}
        </InfiniteScroll>
      </div>
    )
  );
}
export default Posts;
