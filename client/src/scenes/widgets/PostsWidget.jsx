import React from "react";
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
import TestComp from "scenes/student/Quiz";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
// import { Navigate } from "react-router-dom";
// import PostWidget from "./PostWidget";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PostsWidget = ({ userId, userName,mis,isProfile = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {email} = useSelector((state)=> state.user);
  // console.log(email);
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [open, setOpen] = React.useState(false);
  const [key, setKey] = React.useState(0);


  const handleClickOpen = (props) => {
    setOpen(true);
    setKey(props);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if(data[0])
    dispatch(setPosts({ posts: data }));
  else
    dispatch(setPosts({posts:[]}));
  };

  

  const enrolStudent = async (props) => {
    const response = await fetch(`http://localhost:3001/posts/update`, {
      method: "PATCH",
      headers: {   Authorization: `Bearer ${token}`
        ,"Content-Type": "application/json", },
      body: JSON.stringify({
        _id:props._id,
        studentsReg:{
          userId,
          userName,
          mis,
          email
        }
      })
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    if(updatedPost){
      alert("Enrolled successfully");
    }
  };

 

  useEffect(() => {
    getPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {Array.isArray(posts) && posts.length!==0?(posts.map(({ _id,infoId, name, about, date, contact }) => (
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
            <Button size="small" key={_id} onClick={()=>enrolStudent({_id})}>{posts &&
    posts.find(post => post._id === _id)?.registrations &&
    posts.find(post => post._id === _id).registrations.find(registration => registration.userId === userId) ?
    "UNENROLL" :
    "ENROLL"}</Button>
            <Button variant="outlined" key={userId} onClick={()=>handleClickOpen(infoId)}>
        Attempt Quiz
      </Button>
      {key&&<Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {userId}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              {key}
            </Button>
            
          </Toolbar>
        </AppBar>
        <TestComp quizId={key}/>
        
      </Dialog> }         
          </CardActions>
        </Card>
      ))):(<div><h2>It seems your Feeds are Empty!!!</h2><h4>Nothing to show...</h4></div>)}
    </>
  );
};

export default PostsWidget;
