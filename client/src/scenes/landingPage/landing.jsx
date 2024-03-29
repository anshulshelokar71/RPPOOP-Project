import React from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Stack,
  Button,
  Card,
} from "@mui/material";
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

const DemoPaper = styled(Paper)(({ theme }) => ({
  width: 520,
  height: 220,
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: "center",
}));

const Bbox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
});

const Mstack2 = styled(Stack)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
});
const Istack = styled(Stack)({
  display: "flex",
  width: "100vw",
  top: "5px",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

const Mbox = styled(Button)({
  height: "5vw",
  width: "20vw",
  display: "flex",
  borderRadius: "3vw",
  justifyContent: "center",
  alignItems: "center",
  margin: "3vw",
  border: "2px solid red",
  fontSize: "2rem",
  backgroundColor: "#4c2302",
});

export default function Landing() {
  const el = React.useRef(null);

  const handleClick = (props)=>{
    navigate(`${props}login`);
  }

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "Software Development Section",
        "COEP Satellite Club",
        "Robot Study Circle",
        "Aerial Robot Study Circle",
        "Data Science & AI",
        "COFSUG",
        "Civil Services Aspirent Club",
        "ZEST",
        "MINDSPARK",
        "PSF",
        "IMPRESSIONS",
        "REGATTA",
      ],
      startDelay: 100,
      typeSpeed: 100,
      backSpeed: 10,
      smartBackspace: true,
      showCursor: true,
      cursorChar: "_",
      loop: true,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const dark = theme.palette.primary.dark;
  const alt = theme.palette.background.alt;
  const navigate = useNavigate();
  return (
    <Bbox backgroundColor={alt}>
      <HelmetProvider>
        <Helmet>
          <title> Portal </title>
        </Helmet>
        <Box backgroundColor={alt}>
         
          <Istack>
            <Stack
              sx={{
                "&:hover": {
                  color: primaryLight,
                  cursor: "pointer",
                },
              }}
            >
              <img src="assets/coep.png" alt="" width={100} />
            </Stack>
            <Stack>
              <Typography
                fontWeight="bold"
                fontSize="clamp(1rem, 3.8rem, 5.25rem)"
                color="primary"
                sx={{
                  "&:hover": {
                    color: primaryLight,
                    cursor: "pointer",
                  },
                }}
              >
                COEP INDUCTION PORTAL
              </Typography>
            </Stack>
            <Stack
              sx={{
                marginRight: "14px",
                marginTop: "10px",
                "&:hover": {
                  color: primaryLight,
                  cursor: "pointer",
                },
              }}
            >
              <img src="assets/coep.png" alt="" width={100} />
            </Stack>
          </Istack>
          
          <Stack
            className="landing-container"
            sx={{
              fontSize: "15px",
              marginTop: "10vh",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h2 style={{color:theme.palette.neutral.dark}}>Be the part of:</h2>
            <b>____________________</b>
            <Box sx={{ fontSize: "3rem",color: dark }}>
              <span ref={el} />
            </Box>
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            marginTop={8}
            spacing={18}
          >
            <DemoPaper variant="outlined"><p style={{fontSize:"1rem",fontWeight:"bold",color:theme.palette.neutral.main}}>WELCOME!!!</p><hr/><div style={{fontSize:"0.9rem",lineHeight:"1.8rem"}}>This is unified student induction portal for the students,to the students,by the students.This is a platform where Clubs/Fests can conduct their induction process smoothly.Also,students can check out various opportunities by just logging in this portal.</div></DemoPaper>
            <DemoPaper variant="outlined"><p style={{fontSize:"1rem",fontWeight:"bold",color:theme.palette.neutral.main}}>Click on the button below to SignIn</p> <hr/><Grid container flexDirection="row">
            <Grid item>
              <Grid container spacing={5} pt={5} pl={15}>
                {["Host", "Student"].map((value) => (
                  <Grid item key={value}>
                    <Button size="large" variant="contained"onClick={()=>handleClick(value)}>{value}</Button>
                   
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid> </DemoPaper>
          </Stack>
          
        </Box>
      </HelmetProvider>
    </Bbox>
  );
}
{/* <div className="landing-container">
      <div className="slideshow">
        
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
    </div> */}

{/*           

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
                          sx={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          {value}
                        </Typography>
                      </Link>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid> */}
           {/* <FlexBetween padding="1rem 6%" backgroundColor={alt}>
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
        </FlexBetween> */}
          {/* <FlexBetween>
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
      </FlexBetween> */}