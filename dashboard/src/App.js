import "./App.css";
import Content from "./components/Content/Content";
import DataSs from "./components/DataSensor/DataSs";
import History from "./components/History/History";
import Profile from "./components/Profile/Profile";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Nav from "./components/Navbar/Nav";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="App">
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/data-sensor" element={<DataSs />} />
          <Route path="/action-history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
