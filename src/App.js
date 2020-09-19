import React, { useState } from "react";
import "./App.css";
import {
  CSSReset,
  ColorModeProvider,
  ThemeProvider,
  Box,
} from "@chakra-ui/core";
import { Redirect, Router } from "@reach/router";
import Login from "./components/Login";
import Elector from "./components/Elector";
import ElectorList from "./components/ElectorList";
import { AuthContext, theme } from "./utils";
import PrivateRoute from "./components/PrivateRoute";
import { ReactQueryDevtools } from "react-query-devtools";

function App() {
  const [authState, setAuthState] = useState(
    JSON.parse(localStorage.getItem("auth"))
  );

  const setAuthStateAndSave = (auth) => {
    localStorage.setItem("auth", JSON.stringify(auth));
    setAuthState(auth);
    console.log(auth);
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthStateAndSave }}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset></CSSReset>
          <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
          <Box maxWidth="4xl" mx="auto" width="100%" px={2} py={2}>
            <Router>
              <Redirect to="/electors" from="/"></Redirect>
              <PrivateRoute
                path="/electors"
                component={ElectorList}
              ></PrivateRoute>
              <Login path="/login"></Login>
              <PrivateRoute
                path="/electors/:id"
                component={Elector}
              ></PrivateRoute>
              <PrivateRoute
                path="/electors/create"
                component={Elector}
              ></PrivateRoute>
            </Router>
          </Box>
        </ColorModeProvider>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
