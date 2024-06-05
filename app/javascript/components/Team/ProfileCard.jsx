import React from 'react';
import styled from '@emotion/styled';

const ProfileCard = ({ profile }) => {
  const { full_name, department_name, job_title, email, profilePictureUrl } = profile;

  return (
    <StyledCard className="card employee-profile-card">
      <div className="card-body employee-profile-header">
        <div className="profile profile-80">
          <div className="profile-picture-container">
            {profilePictureUrl ? (
              <img className="profile-picture" src={profilePictureUrl} alt={full_name} />
            ) : (
              <div className="profile-picture">
                <div className="img-initials" style={{ backgroundColor: getRandomColor() }}>
                  {full_name.split(' ').map(name => name[0]).join('')}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="employee-details">
          <div className="d-flex align-items-center">
            <h4 className="text-truncate" title={full_name}>{full_name}</h4>
          </div>
          <span>{job_title}</span>
          <span><span className="text-secondary">Department : </span>{department_name}</span>
          <span><span className="text-secondary">Email : </span>{email}</span>
        </div>
      </div>
    </StyledCard>
  );
};

const StyledCard = styled.div`
  .employee-profile-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
    width: calc(33.33% - 20px); /* Adjust width to fit three cards in a row */
    margin-right: 20px; /* Add margin between cards */
  }

  .employee-profile-header {
    display: flex;
    align-items: center;
  }

  .profile-picture-container {
    margin-right: 20px;
  }

  .profile-picture {
    border-radius: 50%;
    overflow: hidden;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .img-initials {
    font-size: 24px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .employee-details h4 {
    margin: 0;
  }

  .employee-details span {
    display: block;
  }

  .text-secondary {
    color: #6c757d;
  }

  .text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const getRandomColor = () => {
  const colors = ['#3d9eed', '#ff9800', '#64c3d1'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default ProfileCard;
