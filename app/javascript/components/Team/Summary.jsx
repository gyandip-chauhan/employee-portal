import React, { useEffect, useState } from 'react';
import ApiService from '../common/apiService';
import { API_TEAM_SUMMARY } from '../common/apiEndpoints';
import { CircularProgress, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';
import ProfileCard from './ProfileCard';
import EmployeeModal from './EmployeeModal';
import styled from '@emotion/styled';

const Summary = ({ departmentId }) => {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmployeesModal, setShowEmployeesModal] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    fetchTeam();
  }, [departmentId]);

  const fetchTeam = async () => {
    if (departmentId) {
      try {
        const response = await ApiService.get(API_TEAM_SUMMARY(departmentId));
        setDepartment(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team data:', error);
        toast.error('Error fetching team data');
        setLoading(false);
      }
    }
  };

  const handleViewEmployees = (employees, title) => {
    setEmployeesData(employees);
    setModalTitle(title);
    setShowEmployeesModal(true);
  };

  const StyledBadge = styled.p`
    display: inline-block;
    min-width: 30px;
    padding: 5px 10px;
    border-radius: 999px;
    font-weight: bold;
    text-align: center;
    background-color: ${(props) => props.color || '#ccc'};
    color: #fff;
  `;

  const StyledButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
  `;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <CircularProgress color="primary" size={60} />
      </div>
    );
  }

  if (!department) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Typography variant="h6" color="error">No department data available</Typography>
      </div>
    );
  }

  const { attributes } = department;
  const { who_is_off_today, employees_on_time_today, late_arrivals_today, team_members } = attributes;

  return (
    <main className="d-flex flex-column flex-grow-1">
      <div className="container-fluid my-3">
        {/* Attendance Overview Section */}
        <div className="row">
          {/* Who is Off Today */}
          {who_is_off_today.length > 0 && (
            <div className="col-md-4">
              <div className="card shadow-lg p-4">
                <h3 className="text-center">Who is Off Today</h3>
                <StyledBadge color="#007bff">{who_is_off_today.length}</StyledBadge>
                <ul className="list-unstyled mt-2">
                  {who_is_off_today.map((employee) => (
                    <li key={employee.id}>{employee.attributes.full_name}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Employees On Time Today */}
          <div className="col-md-4">
            <div className="card shadow-lg p-4 text-center">
              <h3>Employees On Time</h3>
              <StyledBadge color="#28a745">{employees_on_time_today.length}</StyledBadge>
              <StyledButtonContainer>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ minWidth: 'fit-content' }}
                  onClick={() => handleViewEmployees(employees_on_time_today, "Employees On Time")}
                >
                  View Employees
                </Button>
              </StyledButtonContainer>
            </div>
          </div>

          {/* Late Arrivals Today */}
          <div className="col-md-4">
            <div className="card shadow-lg p-4 text-center">
              <h3>Late Arrivals</h3>
              <StyledBadge color="#dc3545">{late_arrivals_today.length}</StyledBadge>
              <StyledButtonContainer>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ minWidth: 'fit-content' }}
                  onClick={() => handleViewEmployees(late_arrivals_today, "Late Arrivals")}
                >
                  View Employees
                </Button>
              </StyledButtonContainer>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="row mt-4">
          <div className="col-md-12">
            <div className="card shadow-lg p-4">
              <h2 className="text-center mb-4">Peers ({team_members.length})</h2>
              <div className="row">
                {team_members.map((peer) => (
                  <div className="col-md-4 col-lg-3 mb-3" key={peer.id}>
                    <ProfileCard profile={peer.attributes} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={showEmployeesModal}
        onClose={() => setShowEmployeesModal(false)}
        employees={employeesData}
        title={modalTitle}
      />
    </main>
  );
};

export default Summary;
