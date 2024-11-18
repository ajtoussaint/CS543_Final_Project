//React Router stuff
import React from 'react';
import {createBrowserRouter, RouterProvider, Route, Routes, createRoutesFromElements, } from "react-router-dom";

//components
import Root from './components/Root';
import Header from './components/Header';
import OtherPage from './components/OtherPage';
import Signup  from './components/Signup';
import Login from './components/Login';
import QuestionCreator from "./components/QuestionCreator";
import ProtectedRoute from './components/ProtectedRoute';

import './index.css';
import { UserProvider } from './components/UserContext';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path='/*'
        classname = "bg-gray-100"
        element={(
          <>
            <Routes>
              <Route path="/" element={<Header/>}>
                <Route index element={<Root />} />
                <Route path="otherPage" element={<OtherPage />}>
                </Route>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                  <Route path="/create/:qId?" element={
                    <ProtectedRoute>
                      <QuestionCreator />
                    </ProtectedRoute>
                    } />
                
              </Route>
            </Routes>
          </>
        )}
      />
    )
  )

  return(
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  )
}

export default App;
