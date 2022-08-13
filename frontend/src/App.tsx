import React, { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { getRefToken, saveToken, saveRefToken } from "./components/manage-tokens";
import IsAuthenticated from "./components/IsAuthenticated";
import Landing from "./pages/Landing";
import Signup from './pages/Signup';
import ResendActivation from './pages/ResendActivation';
import Activation from './pages/Activation';
import Login from "./pages/Login";
import Home from "./pages/Home";

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  let ref_token = getRefToken();
  
  const REFRESH_TOKEN_MUTATION = gql`
    mutation {
      refreshToken (refreshToken: "${ref_token}") {
        token
        refreshToken
      }
    }`
  
  const [refreshToken] = useMutation(REFRESH_TOKEN_MUTATION);

  useEffect(() => {
    let timer = setTimeout(async () => {
      if (getRefToken() !== null) {
        setLoading(true);
        const response = await refreshToken({ variables: { ref_token } });
        if (response.data.refreshToken.token !== null && response.data.refreshToken.refreshToken !== null) {
          saveToken(response.data.refreshToken.token);
          saveRefToken(response.data.refreshToken.refreshToken);
          setLoading(false);
        }
      }
    }, 870000);
    return () => clearTimeout(timer)
  });

  if (loading) {
    return <div className="p-3 text-center"><h2>Loading...</h2></div>
  }

  return (
    <Container className="p-3">
      <Container className="mt-4 p-5 bg-primary text-white rounded">
        <h1 className="header text-center">Medical Calendar</h1>
      </Container>
      {/* <br /> */}
      <div className="App">
        {
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="signup/" element={<Signup />} />
              <Route path="resend/" element={<ResendActivation />} />
              <Route path="activate/:token" element={<Activation />} />
              <Route path="login/" element={<Login />} />
              <Route path="/user" element={<IsAuthenticated />}>
                <Route path="" element={<Home />} />
              </Route>
          </Routes>
        </BrowserRouter>
        }
      </div>

      <Container className="p-2 mb-1 bg-light rounded text-center fixed-bottom">
        <h5 className="header text-center">Built with Django, JWT, GraphQL & React -- by J. Sauceda</h5>
      </Container>
    </Container>
  );
}

export default App;

