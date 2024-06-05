import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';

const EmployeeModal = ({ isOpen, onClose, employees, title }) => {
  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString();
  };

  return (
    <StyledModal open={isOpen} onClose={onClose}>
      <StyledBox>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Button onClick={onClose} color="secondary" variant="contained" sx={{ mb: 2 }}>
          Close
        </Button>
        <StyledTable>
          <thead>
            <tr>
              <StyledTh>Employee</StyledTh>
              <StyledTh>Department</StyledTh>
              <StyledTh>Job Title</StyledTh>
              <StyledTh>Clock-In Time</StyledTh>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <StyledTd>{employee.attributes.full_name}</StyledTd>
                <StyledTd>{employee.attributes.department_name}</StyledTd>
                <StyledTd>{employee.attributes.job_title}</StyledTd>
                <StyledTd>{formatTime(employee.attributes.today_clock_in_time)}</StyledTd>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </StyledBox>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledBox = styled(Box)`
  width: 90%;
  max-width: 600px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
`;

const StyledTable = styled('table')`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const StyledTh = styled('th')`
  border-bottom: 2px solid #dee2e6;
  padding: 8px;
  text-align: left;
`;

const StyledTd = styled('td')`
  border-bottom: 1px solid #dee2e6;
  padding: 8px;
`;

export default EmployeeModal;
