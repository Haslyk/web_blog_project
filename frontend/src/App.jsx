import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import axios from "axios";
import Spinner from "./user/component/spinner/Spinner";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext, lazy, Suspense, useState, useEffect } from "react";
import { AuthContext } from "./user/context/authContext/AuthContext";
import ResetPassword from "./user/scenes/login/ResetPass";

const Home = lazy(() => import("./user/scenes/home/Home"));
const Login = lazy(() => import("./user/scenes/login/Login"));
const Admin = lazy(() => import("./admin/admin"));
const NotFound = lazy(() => import("./user/component/404_Not Found/NotFound"));

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Suspense fallback={<Spinner width="40px" height="40px" />}>
        <Routes>
          <Route
            path="/admin/*"
            element={user ? <Admin /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Analytics />
    </>
  );
};

export default App;
