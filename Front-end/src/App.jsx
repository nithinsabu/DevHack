import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import CheckPage from './Components/CheckPage';
import Entrance from './Components/Entrance';
import QRScannerPage from './Components/QRScanner';

// import About from './pages/About';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/" element={<Entrance />} />
      <Route path="/" element={<CheckPage />} />
      <Route path="/" element={<QRScannerPage />} />
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  );
}

export default App;
