// src/components/common/NavigationMenu.js
import React, { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './NavigationMenu.css';
import AuthContext from '../../authentication/AuthContext';

const NavigationMenu = ({ onClose }) => {
    const { handleLogout } = useContext(AuthContext);

  return (
    <Modal show onHide={onClose} dialogClassName="navigation-menu-modal">
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button variant="primary" className="mb-3 w-100">
          Get Lola PRO
        </Button>

        <div className="menu-section">
          <h5>General</h5>
          <ul className="menu-list">
            <li>My profile</li>
            <li>Account settings</li>
            <li>PIN and Face ID</li>
            <li>Version history (Beta)</li>
          </ul>
        </div>

        <div className="menu-section">
          <h5>Preferences</h5>
          <ul className="menu-list">
            <li>Avatar in chat</li>
            <li>Show leveling</li>
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={
            () => { 
                handleLogout();  onClose(); 
                }}>
        Logout
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NavigationMenu;
