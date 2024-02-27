import React from "react";
// import * as React from 'react';
import { Formik } from "formik";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography, TextField ,useTheme,useMediaQuery} from "@mui/material";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HostsWidget from "scenes/widgets/HostsWidget";

// import { setPosts } from "state";

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
  name: yup.string().required("required"),
  about: yup.string().required("required"),
  date: yup.string().required("required"),
  contact: yup.string().required("required"),
});

const initialValuesInfo = {
  name: "",
  about: "",
  date: "",
  contact: "",
};

export const Dashboard = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const { _id} = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const infographics = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    // console.log(values);
    // formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: {
        
        "Content-Type": "application/json",
      },
     
      body: JSON.stringify(values),
    });
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
    console.log("Hi")
  };

  return (
    <>
      <h4>DASHBOARD</h4>
      <hr />
      <Button variant="contained" size="medium" onClick={handleOpen}>
        Add Info
      </Button>
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
                 label="FEST/CLUB Name"
                 onBlur={handleBlur}
                 onChange={handleChange}
                 value={values.name}
                 name="name"
                 error={
                   Boolean(touched.name) && Boolean(errors.name)
                 }
                 helperText={touched.name && errors.name}
                />
                <TextField
                  label="About"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.about}
                  name="about"
                  error={
                    Boolean(touched.about) && Boolean(errors.about)
                  }
                  helperText={touched.about && errors.about}
                />
                <TextField
                  label="Date of induction"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.date}
                  name="date"
                  error={
                    Boolean(touched.date) && Boolean(errors.date)
                  }
                  helperText={touched.date && errors.date}
                />
                <TextField
                  label="Contact"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Name}
                  name="contact"
                  error={
                    Boolean(touched.contact) && Boolean(errors.contact)
                  }
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

      <HostsWidget />
    </>
  );
};
