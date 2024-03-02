import { useEffect } from "react";
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
const HostsWidget = ({userId,name}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  // console.log(name);
  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
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
    <p>
    {userId}
    {name}
    </p>
   
    {/* {posts.map((element)=>{
      if(element.name===name){
        let i=0;
        element.map(({registrations})=>{
          <p>{registrations[i++].mis}</p> 
        })
      }
    })} */}
    </>
  )

  
   
  ;
};

export default HostsWidget;
