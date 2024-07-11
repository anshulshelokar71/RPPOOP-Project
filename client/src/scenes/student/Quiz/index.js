import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  Grid,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "config";

const StyledButton = styled(Button)(({ theme }) => ({
  marginLeft: "10px",
}));

const Text1 = styled(Typography)(({ theme }) => ({
  color: "white",
  marginLeft: "540px",
}));

const Text2 = styled(Typography)(({ theme }) => ({
  color: "white",
  marginLeft: "550px",
}));

const CssTextField = styled(TextField)(({ theme }) => ({
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
}));

const TestComp = ({ quizId }) => {
  const { _id, firstName, lastName, mis } = useSelector((state) => state.user);
  const theme = useTheme();

  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState([[]]);
  const [completionStatus, setCompletionStatus] = useState(false);
  const [pass, setPass] = useState(false);
  const [feedbackVal1, setFeedbackVal1] = useState(3);
  const [feedbackVal2, setFeedbackVal2] = useState(3);
  const [feedbackVal3, setFeedbackVal3] = useState(3);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { width, height } = useWindowSize();
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOnChangeData = ({ target }) => setFeedbackMessage(target.value);

  const handleFeedback = async () => {
    await Swal.fire({
      title: "SUCCESS",
      icon: "success",
      showConfirmButton: true,
    });
    window.location.reload();
  };

  const nextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      submitResponses();
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
    updatedResponses[currentQuestionIndex][index] = !updatedResponses[currentQuestionIndex][index];
    setUserResponses(updatedResponses);
  };

  const submitResponses = async () => {
    let userScore = 0;

    userResponses.forEach(async (response, index) => {
      if (JSON.stringify(response) === JSON.stringify(questions[index].answers)) {
        userScore++;
      }
    });

    setScore(userScore);
    await storeMarks(userScore);
    await storeMarksinInfo(userScore);

    setCompletionStatus(true);

    if (userScore === questions.length) {
      setPass(true);
      handleClickOpen();
    }
  };

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

      if (savedUserResponse.ok) {
        console.log("Quiz marks updated successfully");
      } else {
        console.error("Failed to update quiz marks");
      }
    } catch (error) {
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

      if (savedUserResponse.ok) {
        console.log("Quiz marks updated successfully");
      } else {
        console.error("Failed to update quiz marks");
      }
    } catch (error) {
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

        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data = await response.json();
        let temp = data.questions;
        let responseArray = [];

        for (let index = 0; index < temp.length; index++) {
          data.questions[index].options = temp[index].options.split("#");
          data.questions[index].answers = temp[index].answers.split("#");
          for (let j = 0; j < data.questions[index].answers.length; j++) {
            data.questions[index].answers[j] = data.questions[index].answers[j] === "true";
          }
          responseArray.push(new Array(data.questions[index].answers.length).fill(false));
        }

        setQuestions(data.questions);
        setUserResponses(responseArray);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchData();
  }, []);

  const navigationGrid = () => (
    <div>
      {questions.map((_, index) => (
        <Button
          variant="containedInherit"
          style={styles.next}
          key={index}
          className={`nav-button ${currentQuestionIndex === index ? "active" : ""}`}
          onClick={() => handleQuestionNumberClick(index)}
        >
          {index + 1}
        </Button>
      ))}
    </div>
  );

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
                        You have successfully cleared this Quiz!
                      </Typography>
                    </DialogContent>
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
                </>
              )}
            </>
          ) : (
            <>
              <Typography
                variant="h3"
                align="center"
                style={{ color: "white" }}
              >
                Thank You For Attempting the Quiz!!!
              </Typography>
              <br />
              <Typography
                variant="h3"
                align="center"
                style={{ color: "white" }}
              >
                Marks : {score}/{questions.length}
              </Typography>
              <br />
            </>
          )}
          <div style={styles.feedbackBox}>
            <Typography
              variant="h6"
              style={{ color: "white" }}
            >
              We would love to hear your thoughts or feedback on how we can
              improve your experience!
            </Typography>
            <br />
            <FormGroup>
              <Typography variant="h6" style={{ color: "white" }}>
                1. How do you rate the overall difficulty of the Quiz?
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal1 === 1}
                    onChange={() => setFeedbackVal1(1)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Very Easy"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal1 === 2}
                    onChange={() => setFeedbackVal1(2)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Easy"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal1 === 3}
                    onChange={() => setFeedbackVal1(3)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Medium"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal1 === 4}
                    onChange={() => setFeedbackVal1(4)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Hard"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal1 === 5}
                    onChange={() => setFeedbackVal1(5)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Very Hard"
              />
            </FormGroup>

            <FormGroup>
              <Typography variant="h6" style={{ color: "white" }}>
                2. How satisfied are you with the Quiz content?
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal2 === 1}
                    onChange={() => setFeedbackVal2(1)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Very Dissatisfied"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal2 === 2}
                    onChange={() => setFeedbackVal2(2)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Dissatisfied"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal2 === 3}
                    onChange={() => setFeedbackVal2(3)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Neutral"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal2 === 4}
                    onChange={() => setFeedbackVal2(4)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Satisfied"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal2 === 5}
                    onChange={() => setFeedbackVal2(5)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Very Satisfied"
              />
            </FormGroup>

            <FormGroup>
              <Typography variant="h6" style={{ color: "white" }}>
                3. How do you rate the overall experience of the Quiz?
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal3 === 1}
                    onChange={() => setFeedbackVal3(1)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Very Poor"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal3 === 2}
                    onChange={() => setFeedbackVal3(2)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Poor"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal3 === 3}
                    onChange={() => setFeedbackVal3(3)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Average"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal3 === 4}
                    onChange={() => setFeedbackVal3(4)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Good"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={feedbackVal3 === 5}
                    onChange={() => setFeedbackVal3(5)}
                    style={{ color: "#8E1E12" }}
                  />
                }
                label="Excellent"
              />
            </FormGroup>

            <TextField
              fullWidth
              label="Any Additional Comments"
              multiline
              rows={4}
              variant="outlined"
              value={feedbackMessage}
              onChange={handleOnChangeData}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                },
              }}
            />

            <StyledButton variant="contained" onClick={handleFeedback}>
              Submit
            </StyledButton>
          </div>
        </>
      ) : (
        <>
          <Text1 variant="h6" component="div">
            Hello {firstName} {lastName}({mis})
          </Text1>
          <Text2 variant="h6" component="div">
            Question {currentQuestionIndex + 1}/{questions.length}
          </Text2>
          <Box display="flex" justifyContent="center">
            <Typography
              variant="h5"
              align="center"
              sx={{
                color: "white",
                fontFamily: theme.typography.fontFamily,
              }}
            >
              <b> {questions[currentQuestionIndex].question} </b>
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <Grid item xs={12} key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={userResponses[currentQuestionIndex][index]}
                      onChange={() => optionSelect(index)}
                      sx={{
                        color: "#8E1E12",
                        "&.Mui-checked": {
                          color: "#8E1E12",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: "white",
                        fontFamily: theme.typography.fontFamily,
                      }}
                    >
                      {option}
                    </Typography>
                  }
                />
              </Grid>
            ))}
          </Grid>
          <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={<KeyboardBackspaceOutlinedIcon />}
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </StyledButton>
            <StyledButton
              variant="contained"
              color="primary"
              endIcon={<EastOutlinedIcon />}
              onClick={nextQuestion}
            >
              {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
            </StyledButton>
          </Stack>
          <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
            {navigationGrid()}
          </Box>
        </>
      )}
    </div>
  );
};

const styles = {
  bg: {
    backgroundColor: "#151718",
    minHeight: "100vh",
    padding: "20px",
  },
  feedbackBox: {
    marginTop: "20px",
    backgroundColor: "#282c34",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "600px",
    margin: "auto",
  },
  next: {
    backgroundColor: "#8E1E12",
    color: "white",
    margin: "5px",
    minWidth: "40px",
  },
};

export default TestComp;
