import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import backArrow from "./../assets/BackArrow.png";
import { Scanner } from "@yudiel/react-qr-scanner";
import React from "react";
export default function EntrancePage() {
    const [entranceCode, setEntranceCode] = useState("");
    const [mode, setMode] = useState(null);
    const [entries, setEntries] = useState({});
    const [QR, setQR] = useState("");
    const [duration, setDuration] = useState("Today");
    const [manualEntry, setManualEntry] = useState("")
    useEffect(() => {
        // console.log(QR);
        if (QR === "" || !mode) return;
        const time = new Date();
        axios
            .post(`${import.meta.env.VITE_API_URL}/api/scan?eid=${entranceCode}`, { mode, student: QR, time })
            .then(response => {
                const temp = { ...entries };
                let date = new Date();
                date.setHours(0, 0, 0, 0);
                date = date.toString();
                if (mode === "OUT") {
                    if (!Object.keys(temp).includes(date)) temp[date] = [];
                    temp[date].push({
                        student: QR,
                        checkInTime: null,
                        checkOutTime: time,
                    });
                } else if (mode === "IN") {
                    temp[date][temp[date].findIndex(e => e.student === QR && e.checkInTime === null)].checkInTime = time;
                }
                setEntries(temp);
            })
            .catch(err => {
                const errorMessage = err.response ? err.response.data : "An error occurred";
                alert(`Error: ${errorMessage}`);
            })
            .finally(() => {
                setQR("");
            });
    }, [QR]);
    const handleScan = async detectedCodes => {
        // let qr = null;
        if (detectedCodes.length > 0) {
            setQR(detectedCodes[0].rawValue); // Store the first detected QR value
        }
        // console.log(qr)
    };
    // useEffect(() => {
    //     console.log(entries)
    // }, [entries])
    const handleError = err => {
        console.error(err); // Handle scan errors
    };

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const param = searchParams.get("eid");
        setEntranceCode(param);
        if (param === "") {
            alert("Entrance does not exist!!");
            navigate("/");
        }
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/getentrance?eid=${param}&duration=${duration}`)
            .then(response => {
                setEntranceCode(param);
                setEntries(response.data.entries);
            })
            .catch(() => {
                alert("Entrance does not exist!!");
                navigate("/");
            });
    }, [duration]);
    const deleteEntry = (date, entry) => {
        console.log(date, entry);
        axios
            .delete(`${import.meta.env.VITE_API_URL}/api/deleteEntry`, { params: { date, entry, eid: entranceCode } })
            .then(() => {
                const temp = {...entries};
                // console.log(temp[date], entry)
                temp[date] = temp[date].filter(e => !(e.student === entry.student && new Date(e.checkOutTime).getTime() === new Date(entry.checkOutTime).getTime()));
                if (temp[date].length === 0) {
                    delete temp[date];
                }
                setEntries(temp);
            })
            .catch((e) => {console.log(e)});
    };
    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <div
        className="flex items-center space-x-2 cursor-pointer text-blue-500 hover:text-blue-700"
        onClick={() => navigate(-1)}
      >
        <img src={backArrow} alt="Back" className="h-5 w-5" />
        <span>Go Back</span>
      </div>

      <h2 className="text-2xl font-bold">Welcome</h2>
      <h2 className="text-lg">Entrance Code: {entranceCode}</h2>

      <div className="flex space-x-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          onClick={() => setMode("IN")}
        >
          Check In
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          onClick={() => setMode("OUT")}
        >
          Check Out
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          onClick={() => setMode(null)}
        >
          Cancel
        </button>
      </div>

      {mode && (
        <div className="p-4 border rounded-md shadow-md flex flex-col items-center">
  <p className="font-semibold mb-2">Current Mode: {mode}</p>
  <div className="w-40 h-40"> {/* Adjust the size as needed */}
    <Scanner
      onScan={handleScan}
      onError={handleError}
      formats={["qr_code", "ean_13"]}
      scanDelay={500}
      allowMultiple={true}
      paused={false}
    />
  </div>
</div>
      )}

      <div className="space-y-4">
        <select
          className="px-3 py-2 border rounded-lg"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        >
          <option>Today</option>
          <option>Last 5 days</option>
          <option>All time</option>
        </select>

        <div className="flex space-x-2 items-center">
          <input
            type="text"
            className="px-3 py-2 border rounded-lg w-full"
            value={manualEntry}
            onChange={(e) => setManualEntry(e.target.value)}
            placeholder="Enter manually"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => {
              if (!mode) {
                alert("Select Mode");
                return;
              }
              setQR(manualEntry);
              setManualEntry("");
            }}
          >
            Submit
          </button>
        </div>
      </div>

      <table className="w-full border-collapse border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Student</th>
            <th className="border p-2">Check-Out Time</th>
            <th className="border p-2">Check-In Time</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(entries)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]))
            .map(([date, records]) => (
              <React.Fragment key={date}>
                <tr>
                  <td colSpan="4" className="border p-2 font-bold text-center bg-gray-200">
                    {new Date(date).toLocaleDateString("en-GB")}
                  </td>
                </tr>
                {records.map((entry, index) => (
                  <tr key={index}>
                    <td className="border p-2">{entry.student}</td>
                    <td className="border p-2">
                      {entry.checkOutTime
                        ? new Date(entry.checkOutTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </td>
                    <td className="border p-2">
                      {entry.checkInTime
                        ? new Date(entry.checkInTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </td>
                    <td className="border p-2">
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        onClick={() => deleteEntry(date, entry)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
    );
}
