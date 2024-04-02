import React from "react";
// import * as React from 'react';
import { Formik, useField } from "formik";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography, TextField, useTheme, useMediaQuery,Stack,Slide } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HostsWidget from "scenes/widgets/HostsWidget";
import NavbarHost from "../NavbarHost";
import HostWidget from "scenes/widgets/HostWidget";
import { parse } from "date-fns";
import AddQuestionsComp from "../quiz";
import Dialog from '@mui/material/Dialog';
import Swal from "sweetalert2";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
// import { setPosts } from "state";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const infoSchema = yup.object().shape({
  infoId: yup.string(),
  about: yup.string().required("required"),
  date: yup.date().required("required"),
  contact: yup
    .string()
    .required()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits"),
});

const initialValuesInfo = {
  infoId: "",
  about: "",
  date: "",
  contact: "",
};

export const Dashboard = () => {
  const theme = useTheme();
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-widt+h:600px)");
  const [open, setOpen] = React.useState(false);
  const [openQuiz, setOpenQuiz] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenQuiz = () => setOpenQuiz(true);
  const handleClose = () => setOpen(false);
  const handleCloseQuiz = () => setOpenQuiz(false);
  const { _id, Name } = useSelector((state) => state.host);
  const token = useSelector((state) => state.token);
  const primaryLight = theme.palette.primary.light;

  const infographics = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    formData.append("infoId", _id);
    for (let value in values) {
      formData.append(value, values[value]);
    }

    console.log(values);

    const savedUserResponse = await fetch(
      `http://localhost:3001/posts/${_id}?param1=${Name}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(values)
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      console.log("Info stored succesfully");
      alert("Updated");
    }
  };
  const handleFormSubmit = async (values, onSubmitProps) => {
    // if (isLogin) await login(values, onSubmitProps);
    await infographics(values, onSubmitProps);
  };

  const handleDeleteInfo = async() =>{
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this Info. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      try {

        const response = await fetch(`http://localhost:3001/posts/quiz/${_id}/deleteInfo`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json' // Specify the content type
          },
        });
        if (response.ok) {
          // If question deleted successfully, show success message
          await Swal.fire('Success!', 'Info deleted successfully.', 'success');
        } else {
          // If there was an error deleting the question, show error message
          Swal.fire('Error!', 'Failed to delete Info.', 'error');
        }
        window.location.reload();
      } catch (error) {
        console.error('Error deleting Info:', error);
        Swal.fire('Error!', 'Failed to delete Info.', 'error');
      }
    }
    
  }


  const deleteQuiz = async() =>{
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this Quiz. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      try {

        const response = await fetch(`http://localhost:3001/posts/quiz/${_id}/deleteQuiz`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json' // Specify the content type
          },
        });
        if (response.ok) {
          // If question deleted successfully, show success message
          await Swal.fire('Success!', 'Quiz deleted successfully.', 'success');
        } else {
          // If there was an error deleting the question, show error message
          Swal.fire('Error!', 'Failed to delete Quiz.', 'error');
        }
        window.location.reload();
      } catch (error) {
        console.error('Error deleting Quiz:', error);
        Swal.fire('Error!', 'Failed to delete Quiz.', 'error');
      }
    }
    
  }

  return (
    <>
      <NavbarHost name={Name} />
      <div style={{display:"inline-flex", width:"100%",justifyContent:"space-between"}}>
        <div><h2 style={{marginLeft: "6rem", }}>DASHBOARD</h2></div>

       <div> <Button variant="contained" size="medium" sx={{mr:"2rem",height:"2.8rem",mt:"0.8rem"}} onClick={handleOpen}>
          Add Info
        </Button>
        <Button variant="contained" size="medium" sx={{mr:"2rem",height:"2.8rem",mt:"0.8rem"}} onClick={handleDeleteInfo}>
          Remove Info
        </Button></div>
      </div>
      <hr />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValuesInfo}
          validationSchema={infoSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box sx={style}>
                <TextField
                  disabled
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={_id}
                  name="infoId"
                  error={Boolean(touched.infoId) && Boolean(errors.infoId)}
                  helperText={touched.infoId && errors.infoId}
                />
                <TextField label={Name} name="name" disabled />
                <TextField
                  label="About"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.about}
                  name="about"
                  error={Boolean(touched.about) && Boolean(errors.about)}
                  helperText={touched.about && errors.about}
                />
                <TextField
                  label="Date of induction"
                  placeholder="dd/mm/yyyy"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.date}
                  name="date"
                  error={Boolean(touched.date) && Boolean(errors.date)}
                  helperText={touched.date && errors.date}
                />
                <TextField
                  label="Contact"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.contact}
                  name="contact"
                  error={Boolean(touched.contact) && Boolean(errors.contact)}
                  helperText={touched.contact && errors.contact}
                />
                <button type="submit" onClick={handleSubmit}>
                  Submit
                </button>
              </Box>
            </form>
          )}
        </Formik>
      </Modal>
      <div style={{width:"100%",marginTop:"2rem",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
      <Stack
          width="70%"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <div><Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="primary"
            sx={{
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
          >
            Registered Students
          </Typography></div>
          <div><Button variant="contained" size="medium" style={{marginRight:"1rem"}} onClick={handleOpenQuiz}>
          Add Quiz
        </Button>
        <Button variant="contained" size="medium" onClick={deleteQuiz}>
          Remove Quiz
        </Button></div>
        <Dialog
        fullScreen
        open={openQuiz}
        onClose={handleCloseQuiz}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseQuiz}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Quiz Section
            </Typography>
           
            
          </Toolbar>
        </AppBar>
        <AddQuestionsComp userId={_id} />
        
      </Dialog>
        </Stack>
        
      <HostsWidget userId={_id} name={Name}/>
      </div>

     
    </>
  );
};
