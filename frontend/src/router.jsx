import { Routes, Route, Navigate } from "react-router-dom";

//Pages
import Home from "./Pages/Home/Home";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import EditProfile from "./Pages/EditProfile/EditProfile";
import Profile from "./Pages/Profile/Profile";

//Hooks
import { useAuth } from "./hooks/useAuth";

export const Router = () => {
  const { auth } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={auth ? <Home /> : <Navigate to="/login" />} 
        />
        <Route path="/profile" element={auth ? <EditProfile /> : <Navigate to="/login" />} 
        />
        <Route path="/users/:id" element={auth ? <Profile /> : <Navigate to="/login" />} 
        />
        <Route
          path="/login"
          element={!auth ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!auth ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
};
