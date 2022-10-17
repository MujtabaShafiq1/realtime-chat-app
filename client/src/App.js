import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Email from "./pages/EmailSent";
import Confirmation from "./pages/Confirmation";
import ProtectedRoute from "./components/HOC/ProtectedRoute";
import { checkUser } from "./store/userActions";
import NotFound from "./pages/NotFound";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUser())
  }, [dispatch])

  return (
    <Routes>
      <Route element={<ProtectedRoute />}> <Route path="/" exact element={<Home />} /> </Route>
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route path="/email" element={<Email />} />
      <Route path="/confirmation/:token" element={<Confirmation />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
