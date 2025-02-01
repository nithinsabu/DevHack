import { useLocation, useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import axios from "axios";

export default function QRScannerPage() {
  const location = useLocation();
  const { entranceCode, type } = location.state;
  const navigate = useNavigate();

  const handleScan = async (data) => {
    if (data) {
      await axios.post("http://localhost:5000/api/scan", {
        entranceCode,
        qrData: data.text,
        type,
      });
      alert("Scan Successful!");
      navigate("/");
    }
  };

  return (
    <div>
      <h2>Scan QR Code</h2>
      <QrReader onResult={handleScan} style={{ width: "100%" }} />
    </div>
  );
}
