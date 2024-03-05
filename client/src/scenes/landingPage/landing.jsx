import React from "react";
import { Typography, Grid, Paper,Box } from "@mui/material";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import Typed from "typed.js";

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
  const el = React.useRef(".changingText");

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["SDS","CSAT","RSC","ARSC","DSAI","COFSUG","CSAC","ZEST","MINDSPARK","PSF","IMPRESSIONS"],
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 1500,
      loop: true,
      loopCount: Infinity,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);
  // const navigate = useNavigate();
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const dark = theme.palette.primary.dark;
  const alt = theme.palette.background.alt;
  const navigate = useNavigate();
  return (
    <HelmetProvider>
      <Helmet>
        <title> Portal </title>
      </Helmet>
      <Box backgroundColor={alt}>
      <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween>
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          COEP TECH
        </Typography>
        </FlexBetween>
        <FlexBetween>
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          // onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          STUDENT INDUCTION PORTAL
        </Typography>
       
      </FlexBetween>
      </FlexBetween>
      <div className="landing-container">
      <div className="slideshow">
        {/* <img src={image1} alt="" /> */}
        {/* <img src={image1} alt="" /> */}
        {/* <img src={image1} alt="" /> */}
        {/* <img src={image1} alt="" /> */}
      </div>
      <div style={{width:"50%" ,fontSize:"2em",zIndex: "1",
          color: dark,fontFamily:"Courier New"}}>
        Student Induction Portal is an integrated platform exclusively for Students of COEP 
        to explore and participate in various clubs and fests of this prestigious college.
        We have 52 clubs in total.
        {"  " }
        <br/>
        Be the part of ONE -
        &nbsp;
        
        <span ref={el} className="changingText" />
      </div>
    </div>
      <Grid container flexDirection="row">
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
                    console.log(value);
                  }}
                >
                  <Link to={`${value}login`}>
                    <Typography
                      variant="h3"
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
      </Box>

    </HelmetProvider>
  );
}
