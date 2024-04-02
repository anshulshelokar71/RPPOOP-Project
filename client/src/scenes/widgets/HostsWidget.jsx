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
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarContainer,
} from "@mui/x-data-grid";



function CustomToolbar() {
  const handleEmail = () =>{

  }

  
  return (
    <GridToolbarContainer
      sx={{ backgroundColor: "#00A0BC", borderRadius: "11px 11px 0 0" }}
    >
      <GridToolbarColumnsButton
        style={{ color: "#FFFFFF", fontSize: "1.2rem" }}
      />
      <GridToolbarFilterButton
        style={{ color: "#FFFFFF", fontSize: "1.2rem" }}
      />
      <GridToolbarDensitySelector
        style={{ color: "#FFFFFF", fontSize: "1.2rem" }}
      />
      <GridToolbarExport style={{ color: "#FFFFFF", fontSize: "1.2rem" }} />
      
    </GridToolbarContainer>
  );
}

function getRowId(row) {
  return row.internalId;
}
// import PostWidget from "./PostWidget";
const HostsWidget = ({userId,name}) => {
  console.log(userId);
  const theme = useTheme();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [rows, setRows] = useState([]);
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);

  const handleSendEmails = () => {
    const selectedEmails = selectedOrganizations.map((id) => {
      const selectedStudent = posts.find((post) => post.userId === id);
      return selectedStudent ? selectedStudent.email : null;
    });
    console.log("Selected Emails:", selectedEmails);
    
    const emailList = selectedEmails.join(",");
    window.open(`mailto:${emailList}`);
  };
  
  const columns = [
    // { field: 'userId', headerName: 'ID', width: 90 },
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
    {
      field: "email", // Assuming email field is present in row data
      headerName: "Email",
      width: 300,
      editable: true,
    },
    {
      field: 'marks',
      headerName: 'Marks',
      width: 90,
      editable: true,
    },
  ];
    const getUserPosts = async () => {
      const response = await fetch(
        `http://localhost:3001/posts/getStudents/${userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
      if(posts[0]){
        setRows(posts);
      }
      console.log(posts);
    };

  useEffect(() => {
    getUserPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  

  return (

    <>
    <Box sx={{ height: 400, width: '70%' }}>
      <DataGrid
      getRowId={(row) => row.userId}
        rows={rows}
        columns={columns}
        slots={{
          toolbar: CustomToolbar
        }}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setSelectedOrganizations(newRowSelectionModel);
        }}
        rowSelectionModel={selectedOrganizations}
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
    <Button
        variant="contained"
        color="primary"
        onClick={handleSendEmails}
        // disabled={selectedRows.length === 0}
      >
        Send Emails
      </Button>
    </>
  )

  
   
  ;
};

export default HostsWidget;
