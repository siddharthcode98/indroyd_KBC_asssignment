import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Qrcode from "./Qrcode/Qrcode";
import UserDetails from "./UserDetails/UserDetails";

function App() {
  return (
    <Routes>
      <Route index element={<Qrcode />} />
      <Route path="/" element={<UserDetails />} />
    </Routes>
  );
}

export default App;
