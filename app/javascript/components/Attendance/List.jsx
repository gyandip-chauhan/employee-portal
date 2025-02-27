import React, { useEffect, useState } from "react";
import ApiService from "../common/apiService";
import { API_ATTENDANCES, API_REMOTE_CLOCK_IN, API_REMOTE_CLOCK_OUT } from "../common/apiEndpoints";
import { toast } from "react-toastify";
import { Info, AlarmOn, AlarmOff } from "@mui/icons-material";

const List = ({ userData }) => {
  const [attendances, setAttendances] = useState([]);
  const [clockedIn, setClockedIn] = useState(false);
  const [remoteAttendanceLog, setRemoteAttendanceLog] = useState([]);
  const [logsDropdowns, setLogsDropdowns] = useState({});

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    try {
      const response = await ApiService.get(API_ATTENDANCES);
      setAttendances(response.data.attendances.data);
      setRemoteAttendanceLog(response.data.remote_attendance_log);
      setClockedIn(!response.data.remote_attendance_log.clock_out_time);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast.error(error);
    }
  };

  const handleClockInOut = async () => {
    try {
      let response;
      if (clockedIn && remoteAttendanceLog) {
        response = await ApiService.put(API_REMOTE_CLOCK_OUT, { attendance_log_id: remoteAttendanceLog?.id });
      } else {
        response = await ApiService.post(API_REMOTE_CLOCK_IN);
      }
      fetchAttendances();
      setClockedIn(!clockedIn);
      toast.success(response.data.notice);
    } catch (error) {
      const errorMessage = error.response?.data?.error || `${error}`;
      toast.error(errorMessage);
    }
  };

  const toggleLogsDropdown = (attendanceId) => {
    setLogsDropdowns((prevDropdowns) => ({
      ...prevDropdowns,
      [attendanceId]: !prevDropdowns[attendanceId],
    }));
  };

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString();
  };

  const renderTimeSlots = (attendance) => {
    const slots = [];
    const validLogs = attendance.attributes.attendance_logs.data.filter(log => log.attributes.clock_out_time);

    for (let i = 0; i < validLogs.length; i++) {
      const log = validLogs[i];
      const clockInTime = new Date(log.attributes.clock_in_time);
      const clockOutTime = new Date(log.attributes.clock_out_time);

      slots.push({ startTime: clockInTime, endTime: clockOutTime, type: "inside" });

      if (i < validLogs.length - 1) {
        const nextLog = validLogs[i + 1];
        const nextClockInTime = new Date(nextLog.attributes.clock_in_time);
        slots.push({ startTime: clockOutTime, endTime: nextClockInTime, type: "outside" });
      }
    }

    return slots.map((slot, index) => (
      <div
        key={index}
        className={slot.type === "inside" ? "inside-slot" : "outside-slot"}
        style={{
          width: `${(slot.endTime - slot.startTime) / 1000 / 60 / 60 / (attendance.attributes.shift_duration / 3600) * 100}%`,
        }}
        aria-valuenow={slot.endTime - slot.startTime}
        aria-valuemin="0"
        aria-valuemax={(slot.endTime - slot.startTime) / 1000 / 60 / 60 / (attendance.attributes.shift_duration / 3600) * 100}
        title={
          slot.type === "inside"
            ? `Logged in ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`
            : `Break ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`
        }
      ></div>
    ));
  };

  return (
    <main className="d-flex flex-column flex-grow-1">
      <div className="container-fluid my-3">
        {/* Clock In/Out Button Section */}
        <div className="row mb-3 d-flex justify-content-center">
          <div className="col-md-6 d-flex justify-content-center">
            <div className="card shadow-lg p-4 text-center w-100" style={{ maxWidth: "400px" }}>
              <h2 className="mb-3">Clock In/Out</h2>
              <div className="d-flex justify-content-center">
                <button 
                  className={`btn ${clockedIn ? "btn-danger" : "btn-success"} w-50`} 
                  onClick={handleClockInOut}
                >
                  {clockedIn ? "Remote Clock Out" : "Remote Clock In"}
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Attendance List Section */}
        <div className="row">
          <div className="col-md-12 mx-auto">
            <div className="card shadow-lg p-4">
              <h2 className="text-center mb-4">Attendance List</h2>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead className="thead-dark">
                    <tr>
                    <th style={{ width: "10%" }}>Date</th>
                    <th style={{ width: "48%" }}>Attendance Visual</th>
                    <th style={{ width: "10%" }}>Effective Hours</th>
                    <th style={{ width: "10%" }}>Gross Hours</th>
                    <th style={{ width: "10%" }}>Arrival</th>
                    <th style={{ width: "12%" }}>Logs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances.map((attendance) => (
                      <tr key={attendance.attributes.id}>
                        <td>{attendance.attributes.date}</td>
                        <td>
                          <div className="progress">{renderTimeSlots(attendance)}</div>
                        </td>
                        <td>{attendance.attributes.effective_hours}</td>
                        <td>{attendance.attributes.gross_hours}</td>
                        <td>{attendance.attributes.arrival}</td>
                        <td>
                          <div onClick={() => toggleLogsDropdown(attendance.attributes.id)}>
                            <Info className="text-info cursor-pointer" />
                          </div>
                          {logsDropdowns[attendance.attributes.id] && (
                            <div className="dropdown">
                              <ul className="list-unstyled">
                                {attendance.attributes.attendance_logs.data.map((log) => (
                                  <li key={attendance.attributes.id + log.attributes.id}>
                                    <AlarmOn className="text-success" /> {formatTime(log.attributes.clock_in_time)} -{" "}
                                    <AlarmOff className="text-danger" />{" "}
                                    {log.attributes.clock_out_time && formatTime(log.attributes.clock_out_time)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default List;
