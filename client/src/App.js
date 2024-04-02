import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "scenes/student/homePage";
import LoginPage from "scenes/student/loginPage";
import ProfilePage from "scenes/student/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Landing from "scenes/landingPage/landing";
import LoginPageHost from "scenes/host/loginPage";
import { Dashboard } from "scenes/host/Dashboard/index";
import AddQuestionsComp from "scenes/host/quiz";
import TestComp from "scenes/student/Quiz";
// import HomePageHost from "scenes/host/Dashboard/index";


function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
          <Route path="/" element={<Landing />} />
            <Route path="/Hostlogin" element={<LoginPageHost />} />
              <Route path="/homeHost" element={isAuth? <Dashboard/>:<Navigate to="/"/>} />
              {/* <Route path="/profile/:userId" element={isAuth?<HomePageHost />:<Navigate to="/"/>} /> */}
            <Route path="/Studentlogin" element={<LoginPage />} />
              <Route
                path="/home"
                element={isAuth ? <HomePage /> : <Navigate to="/" />}
              />
              <Route
                path="/profile/:userId"
                element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
              />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
