import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Entrance from "./Components/Entrance";

// import About from './pages/About';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/entrance" element={<Entrance />} />
        </Routes>
    );
}

export default App;
