import React, { useState, useContext, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { AuthContext } from '../../components/authentication/AuthContext'; // Import AuthContext for global state
import './ProfileScreen.css';

const ProfileScreen = () => {
  const { authToken, user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    name: '',
    gender: '',
    birthday: '',
    interest: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      // Load user data into profileData
      console.log("logging user in useEffect: ", user);
      setProfileData({
        name: user.name,
        gender: user.gender,
        birthday: user.birthday,
        interest: user.interest,
        email: user.emailId, // Email should be readonly
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (data.success) {
        console.log('Profile updated successfully');
      } else {
        console.error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div className="profile-screen">
      <h2>Edit Profile</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Gender</Form.Label>
          <Form.Control
            as="select"
            name="gender"
            value={profileData.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Birthday</Form.Label>
          <Form.Control
            type="date"
            name="birthday"
            value={profileData.birthday}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Interest</Form.Label>
          <Form.Control
            type="text"
            name="interest"
            value={profileData.interest}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email (Read-only)</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={profileData.email}
            readOnly
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default ProfileScreen;
