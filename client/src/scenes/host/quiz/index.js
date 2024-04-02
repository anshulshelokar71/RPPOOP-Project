import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  TextField,
  Grid,
  Checkbox,
  Typography,
  IconButton,
  Collapse,
  Stack,
  Container,
  Tooltip,
  Modal,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import { withStyles } from "@material-ui/core/styles";
import { Delete, Edit, Preview } from "@mui/icons-material";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { styled } from "@mui/material/styles";
// import { backendURL } from "../../configKeys";
import Swal from "sweetalert2";
import { useTheme } from "@emotion/react";
import { useEffect } from "react";

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
function CustomToolbar() {
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
const AddQuestionsComp = ({ userId }) => {
  const theme = useTheme();
  const [clickedIndex, setClickedIndex] = React.useState(-1);
  const [questions, setQuestions] = useState([]);
  const [editVariable, setEditVariable] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [openModal, setopenModal] = useState(false);
 
  const [questionId, setQuestionId] = useState("");
  const [loadingFlag, setLoadingFlag] = useState(true);
  const [error, setError] = useState(false);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const primaryLight = theme.palette.primary.light;

  const [newQuestion, setNewQuestion] = useState({
    question_identifier: "",
    question_text: "",
    question_id: "",
    options: [],
    answers: [],
  });
  const handleCloseModal = () => {
    setopenModal(false);
    setEditVariable(false);
    setNewQuestion({
      question_identifier: "",
      question_text: "",
      question_id: "",
      options: [],
      answers: [],
    });
  };

  const handleOpenModal = () => {
    setopenModal(true);
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

  const handleanswersChange = (index) => {
    const updatedanswerss = [...newQuestion.answers];
    updatedanswerss[index] = !updatedanswerss[index];
    setNewQuestion((question) => ({
      ...question,
      answers: updatedanswerss,
    }));
  };
  const handleRemoveOption = (index) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions.splice(index, 1);

    const updatedanswerss = [...newQuestion.answers];
    updatedanswerss.splice(index, 1);

    setNewQuestion((question) => ({
      ...question,
      options: updatedOptions,
      answers: updatedanswerss,
    }));
  };
  function getRowId(row) {
    return row.internalId;
  }

  const handleAddQuestion = async () => {
    if (!newQuestion.question_text || !newQuestion.question_identifier) {
      setError(true);
      // alert("Enter a Question.");
    } else if (newQuestion.answers.some((answer) => answer)) {
      // console.log(newQuestion);
      newQuestion.question_id = Math.random().toString(36).substring(2, 7);
      let data = newQuestion;
      let temp_ans = newQuestion.answers;
      let ans_string = "";
      for (let j = 0; j < temp_ans.length; j++) {
        ans_string = ans_string + temp_ans[j];
        if (j != temp_ans.length - 1) {
          ans_string = ans_string + "#";
        }
      }
      let temp_options = newQuestion.options;
      let options_string = "";
      for (let k = 0; k < temp_options.length; k++) {
        options_string = options_string + temp_options[k];
        if (k != temp_options.length - 1) {
          options_string = options_string + "#";
        }
      }
      data["answers"] = ans_string;
      data["options"] = options_string;
      // console.log(newQuestion);
      setNewQuestion(data);
      let quizData = { questions: [] };
      quizData.questions.push(newQuestion);
      // let updatedQuestions = [...questions, data];
      // console.log(quizData);
      const savedUserResponse = await fetch(
        `http://localhost:3001/posts/quiz/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(quizData)
        }
      );
      const savedUser = await savedUserResponse.json();
      // onSubmitProps.resetForm();
      console.log(savedUser);
      if (savedUser) {
        console.log("quiz stored succesfully");
        alert("Updated");
        window.location.reload();
        // handleCloseModal();
      }
    } else {
      alert("Please select at least one correct answer.");
    }
  };

  const handleDeleteQuestion = async (question_ids) => {
    console.log(question_ids);
    const result = await Swal.fire({
      title: "Are you sure?",
      text:
        "You are about to delete this question. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        container: 'my-swal'
    }
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3001/posts/quiz/${userId}/deleteQuestion`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json", // Specify the content type
            },
            body: JSON.stringify(question_ids),
          }
        );
        if (response.ok) {
          // If question deleted successfully, show success message
          await Swal.fire(
            "Success!",
            "Question deleted successfully.",
            "success"
          );
        } else {
          // If there was an error deleting the question, show error message
          Swal.fire("Error!", "Failed to delete question.", "error");
        }
        window.location.reload();
      } catch (error) {
        console.error("Error deleting question:", error);
        Swal.fire("Error!", "Failed to delete question.", "error");
      }
    }
  };

  const handleEditQuestion = (params) => {
    setEditVariable(true);
    setQuestionId(params.id);
    let data = newQuestion;
    data["question_identifier"] = params.row.question_identifier;
    data["question_text"] = params.row.question_text;
    data["options"] = params.row.options.split("#");
    let temp = params.row.answers.split("#");
    for (let index = 0; index < temp.length; index++) {
      temp[index] = temp[index] === "true";
    }

    data["answers"] = temp;
    setNewQuestion(data);
    setopenModal(true);
  };
  const columns = [
    {
      field: "question_identifier",
      headerName: "Identifier",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <Box>
            <div>{cellValues.value}</div>
          </Box>
        );
      },
    },
    {
      field: "question_text",
      headerName: "Question",
      width: 750,

      renderCell: (cellValues) => {
        return (
          <Box>
            <div>{cellValues.value}</div>
            <Collapse in={cellValues.id === clickedIndex}>
              <Box sx={detailStyles}>Expanded: {cellValues.value}</Box>
            </Collapse>
          </Box>
        );
      },
    },

    !selectedQuestions.length && {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      renderCell: (params) => {
        return (
          <Box>
            {/* <Tooltip title="View Question Details">
              <IconButton onClick={() => {}}>
                <Preview />
              </IconButton>
            </Tooltip> */}
            {/* <Tooltip title="Edit question">
              <IconButton
                onClick={() => {
                  handleEditQuestion(params);
                }}
              >
                <Preview />
              </IconButton>
            </Tooltip> */}
            <Tooltip title="Delete Question">
              <IconButton
                onClick={() => {
                  handleDeleteQuestion([params.id]);
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const getQuestion = async () => {
    const response = await fetch(`http://localhost:3001/posts/quiz/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    // console.log(data);
    if (data) {
      setRows(data);
    }
  };
  useEffect(() => {
    getQuestion();
  }, []);

  return (
    <div>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <div>
            <Typography
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
              Question
            </Typography>
          </div>
          <div>
            <LoadingButton
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              sx={{
                "&:hover": {
                  color: primaryLight,
                  cursor: "pointer",
                },
              }}
            >
              Add Timer
            </LoadingButton>
          </div>
          {/* <Modal open={open1} onClose={handleClose1}></Modal> */}
        </Stack>
        <Grid
          container
          spacing={3}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                "&:hover": {
                  color: primaryLight,
                  cursor: "pointer",
                },
              }}
              onClick={handleOpenModal}
            >
              Add Question
            </LoadingButton>
          </Grid>
        </Grid>
        <Dialog fullScreen open={openModal} onClose={handleCloseModal}>
          <Box>
            <AppBar sx={{ position: "relative", backgroundColor: "#00D5FA" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="black"
                  onClick={handleCloseModal}
                  aria-label="close"
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: "black",
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color="black"
                  component="div"
                >
                  {editVariable ? "Edit Question" : "Add Question"}
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
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  flexDirection: "column",
                  // alignItems: "center",
                }}
              >
                <Typography component="h1" variant="h5" color={"#aeaeae"}>
                  {editVariable ? "Edit Question" : "Add Question"}
                </Typography>
              </Box>
              <Box component="form" noValidate sx={{ mt: 3 }}>
                <TextField
                  name="question_identifier"
                  label="Identifier"
                  value={newQuestion.question_identifier.trimStart()}
                  helperText={
                    error && !newQuestion.question_identifier.trim()
                      ? "Question Identifier is mandatory"
                      : ""
                  }
                  error={!newQuestion.question_identifier}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{
                    marginBottom: 1,
                    "& label": {
                      color: "grey",
                    },
                    "& label.Mui-focused": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#aeaeae",
                      },
                      "&:hover fieldset": {
                        borderColor: "#aeaeae",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#aeaeae",
                      },
                      color: "#aeaeae",
                    },
                    "& .MuiFormLabel-root": {
                      color: "#aeaeae",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#00A0BC",
                    },
                  }}
                />
                <TextField
                  name="question_text"
                  label="Question"
                  value={newQuestion.question_text.trimStart()}
                  helperText={
                    error && !newQuestion.question_text.trim()
                      ? "Question is mandatory"
                      : ""
                  }
                  error={!newQuestion.question_text}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{
                    marginBottom: 1,
                    "& label": {
                      color: "grey",
                    },
                    "& label.Mui-focused": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#aeaeae",
                      },
                      "&:hover fieldset": {
                        borderColor: "#aeaeae",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#aeaeae",
                      },
                      color: "#aeaeae",
                    },
                    "& .MuiFormLabel-root": {
                      color: "#aeaeae",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#00A0BC",
                    },
                  }}
                />
                {typeof newQuestion.options !== "string" &&
                  newQuestion.options.map((option, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 0",
                      }}
                    >
                      <label>
                        <Checkbox
                          checked={newQuestion.answers[index]}
                          onChange={() => handleanswersChange(index)}
                          size="large"
                          sx={{
                            color: "grey",
                            "&.Mui-checked": {
                              color: "grey",
                            },
                          }}
                        />
                      </label>
                      <TextField
                        label={`Option ${index + 1}`}
                        id="outlined-basic"
                        value={option}
                        helperText={
                          error && !option.trim()
                            ? "Option cannot be blank"
                            : ""
                        }
                        error={!option}
                        onChange={(event) => handleOptionChange(event, index)}
                        fullWidth
                        sx={{
                          "& label": {
                            color: "grey",
                          },
                          "& label.Mui-focused": {
                            color: "white",
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#aeaeae",
                            },
                            "&:hover fieldset": {
                              borderColor: "#aeaeae",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#aeaeae",
                            },
                            color: "#aeaeae",
                          },
                          "& .MuiFormLabel-root": {
                            color: "#aeaeae",
                          },
                          "& .MuiFormHelperText-root": {
                            color: "#00A0BC",
                          },
                        }}
                      />
                      <IconButton
                        onClick={() => handleRemoveOption(index)}
                        sx={{ color: "red" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
              </Box>
              <Grid
                container
                spacing={2}
                direction="column"
                justifyContent="center"
                alignItems="center"
                rowSpacing={14}
              >
                <Grid item xs={6} sm={6} md={6} sx={{ width: "15rem" }}>
                  <LoadingButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    onClick={handleAddOption}
                    sx={{ mx: "auto", mt: "2rem", mb: "2rem" }}
                  >
                    Add Option
                  </LoadingButton>
                </Grid>
              </Grid>
            </Container>
            <StyledContent>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{ width: "70%", margin: "auto", mt: "0px" }}
              >
                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  height="3rem"
                  onClick={handleAddQuestion}
                >
                  Add Question
                </LoadingButton>
              </Grid>
            </StyledContent>
          </Box>
        </Dialog>

        <Grid item xs={12} md={12}>
          <div
            style={{
              width: "100%",
              backgroundColor: "inherit",
              color: "black",
            }}
          >
            <Box
              sx={{
                height: 700,
                width: "100%",
              }}
            >
              <DataGrid
                sx={{
                  color: (theme) => theme.palette.text.white,
                  fontSize: "large",
                }}
                slots={{ toolbar: CustomToolbar }}
                columns={columns}
                getRowId={(row) => row._id}
                rows={rows}
                rowHeight={100}
                pagination={true}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                  setSelectedQuestions(newRowSelectionModel);
                }}
                disableRowSelectionOnClick
                rowSelectionModel={selectedQuestions}
                rowsPerPageOptions={[5]}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
              />
            </Box>
          </div>
        </Grid>
      </Container>
    </div>
  );
};

export default AddQuestionsComp;
