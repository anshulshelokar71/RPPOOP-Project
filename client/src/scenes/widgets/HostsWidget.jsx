import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
// import * as React from 'react';
import { useState } from "react";
import { setPost } from "state";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@emotion/react";
import { DataGrid } from '@mui/x-data-grid';

// import PostWidget from "./PostWidget";
const HostsWidget = ({userId,name}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [rows, setRows] = useState([]);

  function filterByID(item) {
    console.log(userId);
    console.log(item.infoId);
    if (item.infoId&&Object.values(item.infoId)[0]===userId && item.infoId !== 0) {
      return true;
    }
    return false;
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'userName',
      headerName: 'Student name',
      width: 150,
      editable: true,
    },
    {
      field: 'mis',
      headerName: 'MIS',
      width: 150,
      editable: true,
    },
  ];
  function getRowId(row) {
    return row.internalId;
  }

  // const rows = [
  //   { id: 1, userName: 'Snow', mis: 14 },
  //   { id: 2, userName: 'Lannister', mis: 31 },
  //   { id: 3, userName: 'Lannister', mis: 31 },
  //   { id: 4, userName: 'Stark', mis: 11 },
  //   { id: 5, userName: 'Targaryen', mis: null },
  //   { id: 6, userName: 'Melisandre', mis: 150 },
  //   { id: 7, userName: 'Clifford', mis: 44 },
  //   { id: 8, userName: 'Frances', mis: 36 },
  //   { id: 9, userName: 'Roxie', mis: 65 },
  // ];
  // console.log(name);
  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    const arrByID = data.filter(filterByID);
    dispatch(setPosts({ posts: arrByID }));
    // console.log(posts);
    if(posts[0])
    setRows(posts[0].registrations);
    console.log(rows);
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
    <Box sx={{ height: 400, width: '70%' }}>
      <DataGrid
      getRowId={(row) => row.userId}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
   
      {/* {console.log(posts[0].registrations)} */}
   {/* {posts[0].registrations&&posts[0].registrations.map((ele)=>(<><p>{ele.mis}</p><p>{ele.userName}</p></>))} */}
  
   
    
    </>
  )

  
   
  ;
};

export default HostsWidget;
