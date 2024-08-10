import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Grid,
  IconButton,
  Collapse,
  Container,
  Tooltip,
  Dialog,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import PreviewIcon from "@mui/icons-material/Preview";
import Swal from "sweetalert2";
import { styled } from "@mui/material/styles";
import { BACKEND_URL } from "config";

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 600,
  margin: "auto",
  position: "relative",
  minHeight: "60vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  padding: theme.spacing(8, 0),
}));

const detailStyles = {
  borderTop: "2px solid",
  borderTopColor: (theme) => theme.palette["error"].dark,
  pt: 2,
};

const AddQuestionsComp = ({ userId }) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question_identifier: "",
    question_text: "",
    options: [],
    answers: [],
  });
  const [error, setError] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/posts/quiz/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data) {
        setQuestions(data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      // Handle error fetching questions
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditMode(false);
    setNewQuestion({
      question_identifier: "",
      question_text: "",
      options: [],
      answers: [],
    });
    setError(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewQuestion((question) => ({
      ...question,
      [name]: value,
    }));
  };

  const handleAddOption = () => {
    setNewQuestion((question) => ({
      ...question,
      options: [...question.options, ""],
      answers: [...question.answers, false],
    }));
  };

  const handleOptionChange = (event, index) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = event.target.value;
    setNewQuestion((question) => ({
      ...question,
      options: updatedOptions,
    }));
  };

  const handleAnswerChange = (index) => {
    const updatedAnswers = [...newQuestion.answers];
    updatedAnswers[index] = !updatedAnswers[index];
    setNewQuestion((question) => ({
      ...question,
      answers: updatedAnswers,
    }));
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions.splice(index, 1);

    const updatedAnswers = [...newQuestion.answers];
    updatedAnswers.splice(index, 1);

    setNewQuestion((question) => ({
      ...question,
      options: updatedOptions,
      answers: updatedAnswers,
    }));
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question_text || !newQuestion.question_identifier) {
      setError(true);
      return;
    }

    if (!newQuestion.answers.some((answer) => answer)) {
      alert("Please select at least one correct answer.");
      return;
    }

    const formattedQuestion = {
      ...newQuestion,
      question_id: Math.random().toString(36).substring(2, 7),
      options: newQuestion.options.join("#"),
      answers: newQuestion.answers.join("#"),
    };
    const questionsWithIds = questions.map((question, index) => ({
  ...question,
  id: question.id || index + 1, // Use existing id or generate one based on the index
}));


    try {
      const response = await fetch(`${BACKEND_URL}/posts/quiz/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questions: [formattedQuestion] }),
      });

      if (response.ok) {
        alert("Question added successfully!");
        handleCloseModal();
        fetchQuestions(); // Refresh questions list
      } else {
        alert("Failed to add question.");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question.");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this question. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${BACKEND_URL}/posts/quiz/${userId}/deleteQuestion`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ questionId }),
        });

        if (response.ok) {
          await Swal.fire("Success!", "Question deleted successfully.", "success");
          fetchQuestions(); // Refresh questions list
        } else {
          await Swal.fire("Error!", "Failed to delete question.", "error");
        }
      } catch (error) {
        console.error("Error deleting question:", error);
        await Swal.fire("Error!", "Failed to delete question.", "error");
      }
    }
  };

  const handleEditQuestion = (question) => {
    setEditMode(true);
    setNewQuestion({
      ...question,
      options: question.options.split("#"),
      answers: question.answers.split("#").map((answer) => answer === "true"),
    });
    setOpenModal(true);
  };

  const columns = [
    { field: "question_identifier", headerName: "Identifier", width: 150 },
    { field: "question_text", headerName: "Question", width: 750 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit question">
            <IconButton onClick={() => handleEditQuestion(params.row)}>
              <PreviewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete question">
            <IconButton onClick={() => handleDeleteQuestion(params.row._id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Container>
      {/* Add Question Button */}
      <Grid container spacing={3} alignItems="center" justifyContent="space-between" mb={1}>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
          >
            Add Question
          </Button>
        </Grid>
      </Grid>

      {/* Modal for Add/Edit Question */}
      <Dialog fullScreen open={openModal} onClose={handleCloseModal}>
        <AppBar sx={{ position: "relative", backgroundColor: "#00D5FA" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleCloseModal} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h3" fontWeight="bold" color="inherit" component="div">
              {editMode ? "Edit Question" : "Add Question"}
            </Typography>
          </Toolbar>
        </AppBar>

        <Container
          component="main"
          width="100%"
          height="100%"
          sx={{
            backgroundColor: "#242627",
            mt: 2,
            mb: 2,
            border: "2px solid #aeaeae",
            borderRadius: 2,
          }}
        >
          <Box p={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Identifier"
                  variant="outlined"
                  name="question_identifier"
                  value={newQuestion.question_identifier}
                  onChange={handleInputChange}
                  error={error && !newQuestion.question_identifier}
                  helperText={error && !newQuestion.question_identifier && "Required"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Question"
                  variant="outlined"
                  name="question_text"
                  value={newQuestion.question_text}
                  onChange={handleInputChange}
                  error={error && !newQuestion.question_text}
                  helperText={error && !newQuestion.question_text && "Required"}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  {newQuestion.options.map((option, index) => (
                    <Grid item xs={12} key={index}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={10}>
                          <TextField
                            fullWidth
                            label={`Option ${index + 1}`}
                            variant="outlined"
                            value={option}
                            onChange={(event) => handleOptionChange(event, index)}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="Remove Option">
                            <IconButton onClick={() => handleRemoveOption(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          <label>
                            <input
                              type="checkbox"
                              onChange={() => handleAnswerChange(index)}
                              checked={newQuestion.answers[index]}
                            />
                            &nbsp;Correct Answer
                          </label>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button variant="outlined" onClick={handleAddOption}>
                      Add Option
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2} justifyContent="flex-end">
              <Grid item xs={4}>
                <Button fullWidth variant="contained" onClick={handleAddQuestion} color="primary">
                  {editMode ? "Save Changes" : "Add Question"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Dialog>

      {/* Questions List */}
      <Box sx={{ height: 400, width: "100%", mt: 3 }}>
        <DataGrid
          rows={questionsWithIds}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          components={{
            Toolbar: GridToolbarContainer,
          }}
          componentsProps={{
            toolbar: { title: "Questions", actions: <GridToolbar /> },
          }}
        />
      </Box>
    </Container>
  );
};

export default AddQuestionsComp;
