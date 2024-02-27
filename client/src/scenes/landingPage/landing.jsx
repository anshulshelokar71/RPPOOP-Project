import React from "react";
import { Typography, Grid, Paper } from "@mui/material";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const StyledSection = styled("div")(({}) => ({
  padding: "30px",
  width: "100%",
  maxWidth: 420,
  maxHeight: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: "black",
  backgroundColor: "grey",
  borderRightStyle: "solid",
  borderColor: "red",
}));

export default function Landing() {
  // const navigate = useNavigate();
  return (
    <HelmetProvider>
      <Helmet>
        <title> Portal </title>
      </Helmet>
      <Grid container flexDirection="row">
        <Grid item>
          <StyledSection>
            <Typography variant="h3" sx={{ mb: 7 }}>
              Welcome to COEP Induction Portal
            </Typography>
            <img src="assets/coep.png" alt="login" />
          </StyledSection>
        </Grid>
        <Grid item>
          <Grid container spacing={8} p={10} pt={30}>
            {["Host", "Student"].map((value) => (
              <Grid item key={value}>
                <Paper
                  sx={{
                    height: 250,
                    width: 300,
                    backgroundColor: "#1A2027",
                  }}
                  onClick={() => {
                    console.log("hello");
                  }}
                >
                  <Link to={`${value}login`}>
                    <Typography
                      variant="h5"
                      color="white"
                      sx={{ display: "flex", justifyContent: "space-around" }}
                    >
                      {value}
                    </Typography>
                  </Link>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </HelmetProvider>
  );
}
