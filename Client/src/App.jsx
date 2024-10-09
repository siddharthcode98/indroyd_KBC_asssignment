import { Route, Routes } from "react-router-dom";
import "./App.css";
import Qrcode from "./Qrcode/Qrcode";
import UserDetails from "./UserDetails/UserDetails";

function App() {
  return (
    <Routes>
      <Route index element={<Qrcode />} />
      <Route path="/game" element={<UserDetails />} />
    </Routes>
  );
}

export default App;
