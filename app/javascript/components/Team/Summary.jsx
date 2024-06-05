import React, { useEffect, useState } from 'react';
import ApiService from '../common/apiService';
import { API_TEAM_SUMMARY } from '../common/apiEndpoints';
import { CircularProgress, Typography, Button, Modal, Backdrop, Fade } from '@mui/material';
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
    if (departmentId){
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

  const StyledLoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  `;

  const StyledErrorContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  `;

  const Card = ({ title, count, children }) => (
    <StyledCard>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <StyledBadge>{count}</StyledBadge>
      </div>
      {children}
    </StyledCard>
  );

  const StyledCard = styled.div`
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
    min-height: 150px;
  `;

  const StyledBadge = styled.span`
    background-color: #3f51b5;
    color: #fff;
    padding: 5px 10px;
    border-radius: 999px;
  `;

  const EmployeeButton = ({ employees, title }) => (
    <>
      {employees.length > 0 && <Button
        variant="contained"
        color="primary"
        onClick={() => handleViewEmployees(employees, title)}
      >
        View Employees
      </Button>}
    </>
  );

  const EmployeeList = ({ employees }) => (
    <div className="space-y-2">
      {employees.map((employee) => (
        <p key={employee.id}>{employee.attributes.full_name}</p>
      ))}
    </div>
  );

  if (loading) {
    return (
      <StyledLoaderContainer>
        <CircularProgress color="primary" size={60} />
      </StyledLoaderContainer>
    );
  }

  if (!department) {
    return (
      <StyledErrorContainer>
        <Typography variant="h6" color="error">No department data available</Typography>
      </StyledErrorContainer>
    );
  }

  const { attributes } = department;
  const { who_is_off_today, employees_on_time_today, late_arrivals_today, team_members } = attributes;

  return (
    <div className="container mx-auto pt-10 pb-20 overflow-x-auto">
      <div className="flex gap-6 overflow-x-auto">
        {who_is_off_today.length > 0 && (
          <Card title="Who is off today" count={who_is_off_today.length}>
            <EmployeeList employees={who_is_off_today} />
          </Card>
        )}
        <Card title="Employees On Time today" count={employees_on_time_today.length}>
          <EmployeeButton employees={employees_on_time_today} title="Employees On Time today" />
        </Card>
        <Card title="Late Arrivals today" count={late_arrivals_today.length}>
          <EmployeeButton employees={late_arrivals_today} title="Late Arrivals today" />
        </Card>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
        <StyledCard>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Peers ({team_members.length})</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {team_members.map((peer) => (
              <ProfileCard key={peer.id} profile={peer.attributes} />
            ))}
          </div>
        </StyledCard>
      </div>
      <EmployeeModal
        isOpen={showEmployeesModal}
        onClose={() => setShowEmployeesModal(false)}
        employees={employeesData}
        title={modalTitle}
      />
    </div>
  );
};

export default Summary;
