import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
// import DialogButton from "../DialogButton/DialogButton";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Checkbox,
  TextField,
  Grid,
} from "@mui/material";
// import Rating from "@material-ui/lab/Rating";
import { withStyles } from "@material-ui/core/styles";

import { useTheme } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
// import axios from "axios";
// import { backendURL } from "../../configKeys";
import { FormGroup } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
// import Certificate from "../Certificate/certificate";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import { BACKEND_URL } from "config";
// import UserTokenContext from "../../context/UserTokenContext";
// import { fDate } from "../../utils/formatTime";
// import LoadingPage from "../../pages/LoadingPage";
const styles = {
  next: {
    marginLeft: "10px",
  },
  text1: {
    color: "white",
    marginLeft: "540px",
  },
  text2: {
    color: "white",
    marginLeft: "550px",
  },
};

const CssTextField = withStyles({
  root: {
    "& label": {
      color: "#aeaeae",
    },
    "& label.Mui-focused": {
      color: "#aeaeae",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#aeaeae",
      },
      "&:hover fieldset": {
        borderColor: "#8E1E12",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#8E1E12",
      },
      color: "white",
    },
  },
})(TextField);

// const StyledRating = withStyles({

//   iconEmpty: {
//     color: 'white',
//   },

// })(Rating);

const TestComp = ({ quizId }) => {
  //Defining Consts
  // const location = useLocation();
  // const userContext = useContext(UserTokenContext);
  // const { dict, checkToken } = userContext;
  const { _id, firstName, lastName, mis } = useSelector((state) => state.user);
  console.log(quizId);
  const theme = useTheme();

  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState([[]]);
  const [completionStatus, setCompletionStatus] = useState(false);

  const [completionDate, setCompletionDate] = useState("");

  const [pass, setPass] = useState(false);
  // const [ratingStar, setratingStar] = useState("");

  // 3 ratings
  const [feedbackVal1, setFeedbackVal1] = useState(3);
  const [feedbackVal2, setFeedbackVal2] = useState(3);
  const [feedbackVal3, setFeedbackVal3] = useState(3);

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [err, setErr] = useState(false);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const { width, height } = useWindowSize();
  const token = useSelector((state) => state.token);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnChangeData = ({ target }) => {
    setFeedbackMessage(target.value);
  };

  const handleFeedback = async () => {
    await Swal.fire({
      title: "SUCCESS",
      icon: "success",
      showConfirmButton: true,
      // text: res.data.message,
    });
    window.reload();
    //   // TODO Check the Empty fields and Rating Should not be empty

    //   let l = [feedbackVal1, feedbackVal2, feedbackVal3];

    //   const body = {
    //     video_id: location.state.video_id,
    //     training_id: location.state.training_id,
    //     rating: l.join("#"),
    //     feedback_message: feedbackMessage,
    //   };
    //   axios
    //     .post(backendURL + "/user/feedback", body, {
    //       headers: {
    //         "lms-sybernow": localStorage.getItem("lms-sybernow"),
    //       },
    //     })
    //     .then((res) => {
    //       if ("message" in res.data) {
    //         Swal.fire({
    //           title: "SUCCESS",
    //           icon: "success",
    //           showConfirmButton: true,
    //           text: res.data.message,
    //         });
    //         navigate("/dashboard/app");
    //       }
    //     })
    //     .catch((error) => {
    //       console.log("Error Code: ", error.response.status);
    //       navigate("/lms/404");
    //     });
  };

  const navigate = useNavigate();

  //Button Functions
  const nextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      submitResponses();
      // console.log("Responses Submitted");
    } else {
      setQuestionIndex((index) => index + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setQuestionIndex((index) => index - 1);
    }
  };

  const optionSelect = (index) => {
    let updatedResponses = [...userResponses];
    updatedResponses[currentQuestionIndex][index] = !updatedResponses[
      currentQuestionIndex
    ][index];
    // alert(selectedAnswer + " Option Selected");
    // console.log(updatedResponses);
    setUserResponses(updatedResponses);
  };

  const submitResponses = async () => {
    let userScore = 0;

    console.log(questions, userResponses);

    userResponses.forEach(async (response, index) => {
      if (
        JSON.stringify(response) == JSON.stringify(questions[index].answers)
      ) {
        userScore++;
      }
      // else{
      //   let body = {
      //     question_id : questions[index]["question_id"],
      //   }
      //   console.log(body)
      //   await axios.post(backendURL + "/user/incrementMostFailedQuestions", body, {
      //     headers: {
      //       "lms-sybernow": dict.token,
      //     },
      //   })
      // }
    });

    setScore(userScore);
    await storeMarks(userScore);
    await storeMarksinInfo(userScore);

    setCompletionStatus(true);
    //alert("Test Over");

    if (userScore == questions.length) {
      setPass(true);
      handleClickOpen();
      let d = new Date();
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleQuestionNumberClick = (index) => {
    if (index >= 0 && index < questions.length) {
      setQuestionIndex(index);
    }
  };

  const storeMarks = async (score) => {
    try {
      const savedUserResponse = await fetch(
        `${BACKEND_URL}/posts/quizMarks/${_id}?param1=${quizId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ marks: score }),
        }
      );

      // Check if the request was successful
      if (savedUserResponse.ok) {
        console.log("Quiz marks updated successfully");
      } else {
        // Handle the case where the request failed
        console.error("Failed to update quiz marks");
      }
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error("Error updating quiz marks:", error);
    }
  };
  const storeMarksinInfo = async (score) => {
    try {
      const savedUserResponse = await fetch(
        `${BACKEND_URL}/posts/quizMarksInfo/${_id}?param1=${quizId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ marks: score }),
        }
      );

      // Check if the request was successful
      if (savedUserResponse.ok) {
        console.log("Quiz marks updated successfully");
      } else {
        // Handle the case where the request failed
        console.error("Failed to update quiz marks");
      }
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error("Error updating quiz marks:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/posts/getQuiz/${_id}?param1=${quizId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        //   const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data = await response.json();
        console.log(data);
        let temp = data.questions;
        let responseArray = [];

        for (let index = 0; index < temp.length; index++) {
          data.questions[index].options = temp[index].options.split("#");
          data.questions[index].answers = temp[index].answers.split("#");
          for (let j = 0; j < data.questions[index].answers.length; j++) {
            data.questions[index].answers[j] =
              data.questions[index].answers[j] === "true";
          }
          responseArray.push(
            new Array(data.questions[index].answers.length).fill(false)
          );
        }

        setQuestions(data.questions);
        console.log(questions);
        setUserResponses(responseArray);
      } catch (error) {
        console.error("Error fetching questions:", error);
        // Handle error (e.g., show error message)
      }
      //   }
    };

    fetchData();
  }, []);

  //Add stepper here
  const navigationGrid = () => {
    return (
      <div>
        {questions.map((_, index) => (
          <Button
            variant="containedInherit"
            style={styles.next}
            key={index}
            className={`nav-button ${
              currentQuestionIndex === index ? "active" : ""
            }`}
            onClick={() => handleQuestionNumberClick(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    );
  };

  let d = new Date();

  return (
    <div style={styles.bg}>
      {completionStatus ? (
        <>
          {pass ? (
            <>
              {open ? (
                <>
                  <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={250}
                    initialVelocityX={0.2}
                    initialVelocityY={1}
                  />

                  <Dialog
                    fullWidth
                    height="20px"
                    open={open}
                    onClose={handleClose}
                    scroll="paper"
                    PaperProps={{
                      style: {
                        backgroundColor: "#151718",
                        border: "0.2px solid white",
                      },
                    }}
                  >
                    <DialogContent>
                      <Typography
                        variant="h1"
                        align="center"
                        style={{ color: "white" }}
                      >
                        <b> Congratulations </b>
                      </Typography>
                      <br />
                      <Typography
                        variant="h5"
                        align="center"
                        style={{ color: "white" }}
                      >
                        You have successfully cleared this Quiz !
                      </Typography>
                    </DialogContent>
                    {/* <DialogActions
                        style={{
                          justifyContent: "center",
                          paddingBottom: "14px",
                        }}
                      >
                        <Box maxWidth="fit-content" onClick={handleClose}>
                          {completionDate ? (
                            <Certificate
                              onClick={handleClose}
                              holderName={
                                dict.userDetails["user_first_name"] +
                                " " +
                                dict.userDetails["user_last_name"]
                              }
                              videoName={location.state.video_name}
                              completion_date={completionDate}
                            />
                          ) : (
                            <Certificate
                              onClick={handleClose}
                              holderName={
                                dict.userDetails["user_first_name"] +
                                " " +
                                dict.userDetails["user_last_name"]
                              }
                              videoName={location.state.video_name}
                              completion_date={d}
                            />
                          )}
                        </Box>
                      </DialogActions> */}
                  </Dialog>
                </>
              ) : (
                <>
                  <Typography
                    variant="h1"
                    align="center"
                    style={{ color: "white" }}
                  >
                    Thanks For Attempting the Quiz!!!
                  </Typography>
                  <br />
                  {/* <Typography
                    variant="h4"
                    align="center"
                    style={{ color: "white" }}
                  >
                    Please share your thoughts and experiences to help us
                    improve.
                  </Typography>
                  <br />
                  <Box></Box>
                  <Grid container alignItems="center" justifyContent="center">
                    <Grid
                      container
                      spacing={2}
                      mt={3}
                      alignItems="center"
                      px={3}
                    >
                      <Typography
                        variant="h3"
                        style={{ color: "white" }}
                        mr={12}
                      >
                        Entertainment
                      </Typography>
                      <Typography variant="h6" style={{ color: "white" }}>
                        (Boring)
                      </Typography>
                      <Box
                        component="fieldset"
                        borderColor="transparent"
                        mt={1}
                      > */}
                        {/* <StyledRating
                            name="feedback1"
                            value={feedbackVal1}
                            precision={0.5}
                            size="large"
                            onChange={(event, newValue) => {
                              setFeedbackVal1(newValue);
                            }}
                            // onChangeActive={(event, newHover) => {
                            //   setratingStar(newHover);
                            // }}
                          /> */}
                      {/* </Box>
                      <Typography variant="h6" style={{ color: "white" }}>
                        (Waiting for next one!)
                      </Typography> */}
                    {/* </Grid>

                    <Grid container spacing={2} mt={1} alignItems="center">
                      <Typography
                        variant="h3"
                        style={{ color: "white" }}
                        mx={3}
                        mr={16}
                      >
                        Learning
                      </Typography>
                      <Typography variant="h6" style={{ color: "white" }}>
                        (Didn't get it)
                      </Typography>
                      <Box
                        component="fieldset"
                        borderColor="transparent"
                        mt={1}
                      > */}
                        {/* <StyledRating
                            name="feedback2"
                            value={feedbackVal2}
                            precision={0.5}
                            size="large"
                            onChange={(event, newValue) => {
                              setFeedbackVal2(newValue);
                            }}
                            // onChangeActive={(event, newHover) => {
                            //   setratingStar(newHover);
                            // }}
                          /> */}
                      {/* </Box>
                      <Typography variant="h6" style={{ color: "white" }}>
                        (Enlightened)
                      </Typography>
                    </Grid>
                    <Grid container spacing={2} my={1} alignItems="center">
                      <Typography
                        variant="h3"
                        style={{ color: "white" }}
                        mx={3}
                        mr={6}
                      >
                        Overall Value
                      </Typography>
                      <Typography variant="h6" style={{ color: "white" }}>
                        (Not Quite there)
                      </Typography>
                      <Box
                        component="fieldset"
                        borderColor="transparent"
                        mt={1}
                      > */}
                        {/* <StyledRating
                            name="feedback3"
                            value={feedbackVal3}
                            precision={0.5}
                            size="large"
                            onChange={(event, newValue) => {
                              setFeedbackVal3(newValue);
                            }}
                            // onChangeActive={(event, newHover) => {
                            //   setratingStar(newHover);
                            // }}
                          /> */}
                      {/* </Box>
                      <Typography variant="h6" style={{ color: "white" }}>
                        (Wow!)
                      </Typography>
                    </Grid>
                  </Grid>

                  <CssTextField
                    name="feedback_message"
                    required
                    fullWidth
                    multiline
                    rows={5}
                    id="feedback_message"
                    label="Feedback"
                    value={feedbackMessage}
                    placeholder="Your feedback on this topic will help us improve"
                    helperText={
                      err && !feedbackMessage
                        ? "Feedback Message is required"
                        : ""
                    }
                    error={!feedbackMessage}
                    onChange={handleOnChangeData}
                    mb={2}
                  />

                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2}
                  >
                    <Grid
                      item
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        variant="containedInherit"
                        sx={{ marginRight: 2 }}
                        component="span"
                        onClick={handleFeedback}
                      >
                        Submit Feedback
                      </Button>
                    </Grid>
                  </Grid> */}
                </>
              )}

              {/* <Typography
                  variant="h1"
                  align="center"
                  style={{ color: "white" }}
                >
                  <b> Congratulations </b>
                </Typography>
                <br />
                <Typography
                  variant="h5"
                  align="center"
                  style={{ color: "white" }}
                >
                  You have successfully cleared this Quiz !
                </Typography> */}

              {/* <Grid
                    item
                    sx={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    {completionDate ? (
                      <Certificate
                        holderName={
                          dict.userDetails["user_first_name"] +
                          " " +
                          dict.userDetails["user_last_name"]
                        }
                        videoName={location.state.video_name}
                        completion_date={completionDate}
                      />
                    ) : (
                      <Certificate
                        holderName={
                          dict.userDetails["user_first_name"] +
                          " " +
                          dict.userDetails["user_last_name"]
                        }
                        videoName={location.state.video_name}
                        completion_date={d}
                      />
                    )}
                  </Grid> */}
            </>
          ) : (
            <>
              <Typography
                variant="h2"
                align="center"
                style={{ color: "white" }}
              >
                <b> Test Over ! Your Score : {score} </b>
              </Typography>
              <Typography
                variant="h3"
                align="center"
                style={{ color: "white" }}
              >
                <b> Sorry , Better Luck Next Time 😔 </b>
              </Typography>
              <br />
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button
                    variant="containedInherit"
                    sx={{ margin: "auto" }}
                    align="center"
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    <Typography
                      variant="h4"
                      align="center"
                      style={{ color: "white" }}
                    >
                      ⬅️ Re-Attempt Test
                    </Typography>
                  </Button>
                </Grid>
                {/* <Grid item>
                    <Button
                      variant="containedInherit"
                      sx={{ margin: "auto" }}
                      align="center"
                      onClick={() => {
                        navigate("/dashboard/viewTraining", {
                          state: {
                            video_id: location.state.video_id,
                            video_url: location.state.video_url,
                            thumbnail_image: location.state.thumbnail_image,
                            video_name: location.state.video_name,
                            video_description: location.state.video_description,
                          },
                        });
                      }}
                    >
                      <Typography
                        variant="h4"
                        align="center"
                        style={{ color: "white" }}
                      >
                        Watch Video again ➡️
                      </Typography>
                    </Button>
                  </Grid> */}
              </Grid>
            </>
          )}

          {/* <Typography variant="h4">Test Over !</Typography>
            <br />
            <Typography variant="h4">Score: {score}</Typography>
            {pass ? (
              <>
                <Typography>Congratulations You have Passed</Typography>
                <Button
                  onClick={() => {
                    navigate("/dashboard/badges");
                  }}
                >
                  View Your Certificate
                </Button>
              </>
            ) : (
              <>
                <Typography
                  variant="h2"
                  align="center"
                  style={{ color: "white" }}
                >
                  <b> Test Over ! Your Score : {score} </b>
                </Typography>
                <Typography
                  variant="h3"
                  align="center"
                  style={{ color: "white" }}
                >
                  <b> Sorry , Better Luck Next Time 😔 </b>
                </Typography>
                <br />
                <Grid container spacing={2} justifyContent="center">
                  <Grid item>
                    <Button
                      variant="containedInherit"
                      sx={{ margin: "auto" }}
                      align="center"
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      <Typography
                        variant="h4"
                        align="center"
                        style={{ color: "white" }}
                      >
                        ⬅️ Re-Attempt Test
                      </Typography>
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="containedInherit"
                      sx={{ margin: "auto" }}
                      align="center"
                      onClick={() => {
                        navigate("/dashboard/viewTraining", {
                          state: {
                            video_id: location.state.video_id,
                            video_url: location.state.video_url,
                            thumbnail_image: location.state.thumbnail_image,
                            video_name: location.state.video_name,
                            video_description: location.state.video_description,
                          },
                        });
                      }}
                    >
                      <Typography
                        variant="h4"
                        align="center"
                        style={{ color: "white" }}
                      >
                        Watch Video again ➡️
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
  
            {/* <Certificate holderName = {holderName} videoName = {videoName}/> */}
        </>
      ) : (
        <>
          <Typography variant="h1" align="center" style={{ color: "white" }}>
            <b> Quiz Time </b>
          </Typography>
          <br />
          <Typography variant="h5" align="center" style={{ color: "white" }}>
            Enough of theory, lets test it out !
          </Typography>
          {currentQuestion ? (
            <div>
              <h2 style={{ color: "white" }}>
                {" "}
                Question {currentQuestionIndex + 1}{" "}
              </h2>
              <Typography style={{ color: "white" }}>
                {currentQuestion.question_text}
              </Typography>
              <br />
              <ul style={{ listStyleType: "none" }} key={currentQuestionIndex}>
                <FormGroup>
                  {currentQuestion.options.map((option, index) => (
                    <FormControlLabel
                      variant="outlined"
                      style={{ color: "white" }}
                      control={
                        <Checkbox
                          checked={userResponses[currentQuestionIndex][index]}
                          onChange={() => optionSelect(index)}
                        />
                      }
                      label={option}
                      alternate
                    />
                  ))}
                </FormGroup>
              </ul>
              <div>
                <br />
                <Button
                  variant="containedInherit"
                  startIcon={<KeyboardBackspaceOutlinedIcon />}
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button
                    variant="containedInherit"
                    style={styles.next}
                    onClick={submitResponses}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    variant="containedInherit"
                    style={styles.next}
                    endIcon={<EastOutlinedIcon />}
                    onClick={nextQuestion}
                  >
                    Next
                  </Button>
                )}
                <br />
                <br />
                {navigationGrid()}
              </div>
              <br />
            </div>
          ) : (
            <p>Loading....</p>
          )}
        </>
      )}
    </div>
  );
};

export default TestComp;
