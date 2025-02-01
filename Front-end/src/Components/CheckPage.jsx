import { useLocation, useNavigate } from "react-router-dom";

export default function CheckPage() {
  const location = useLocation();
  const entranceCode = location.state?.code;
  const navigate = useNavigate();

  return (
    <div>
      <h2>Entrance Code: {entranceCode}</h2>
      <button onClick={() => navigate("/scan", { state: { entranceCode, type: "checkin" } })}>
        Check In
      </button>
      <button onClick={() => navigate("/scan", { state: { entranceCode, type: "checkout" } })}>
        Check Out
      </button>
    </div>
  );
}
