import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
// import * as React from 'react';
import { setPost } from "state";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@emotion/react";
// import PostWidget from "./PostWidget";
const PostsWidget = ({ userId, userName,mis,isProfile = false }) => {
  const theme = useTheme();
  const [isEnrolled,setIsEnrolled] = useState(false);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  // console.log(userId);
  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const enrolStudent = async (props) => {
    console.log(userId)
    const response = await fetch(`http://localhost:3001/posts/update`, {
      method: "PATCH",
      headers: {   Authorization: `Bearer ${token}`
        ,"Content-Type": "application/json", },
      body: JSON.stringify({
        _id:props._id,
        studentsReg:{
          userId,
          userName,
          mis
        }
      })
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    if(updatedPost){
      alert("Enrolled successfully");
    }
  };
  //   const getUserPosts = async () => {
  //     const response = await fetch(
  //       `http://localhost:3001/posts/${userId}/posts`,
  //       {
  //         method: "GET",
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     const data = await response.json();
  //     dispatch(setPosts({ posts: data }));
  //   };

  useEffect(() => {
    getPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.map(({ _id, name, about, date, contact }) => (
        <Card sx={{ minWidth: 275, mb: 6 }} key={_id}>
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="primary" gutterBottom>
              {name}
            </Typography>

            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {about}
            </Typography>
            <hr />
            <Typography variant="body2">
              Date of Induction: {date}
              <br />
              <br />
              Contact:{contact}
            </Typography>
          </CardContent>
          <CardActions>
            {posts.registrations&&posts.registrations.findOne((ele)=> {
              
              if(ele===userId)
              setIsEnrolled(true)
              })}
            {isEnrolled?<Button size="small" key={_id} onClick={()=>enrolStudent({_id})}>UNENROL HERE</Button>:<Button size="small" key={_id} onClick={()=>enrolStudent({_id})}>ENROL HERE</Button>}
          </CardActions>
        </Card>
      ))}
    </>
  );
};

export default PostsWidget;
