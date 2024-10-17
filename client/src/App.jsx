//React Router stuff
import React from 'react';
import {createBrowserRouter, RouterProvider, Route, Routes, createRoutesFromElements, } from "react-router-dom";

//components
import Root from './components/Root';
import OtherPage from './components/OtherPage';
import Subpage1 from './components/Subpage1';
import Subpage2 from './components/Subpage2';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path='/*'
        element={(
          <>
            <Routes>
              <Route path="otherPage" element={<OtherPage />}>
                <Route index element={<Subpage1/>} />
                <Route path="2" element={<Subpage2/>} />
              </Route>
              <Route index element={<Root />} />
            </Routes>
          </>
        )}
      />
    )
  )

  return(
    <RouterProvider router={router} />
  )
}

export default App;
