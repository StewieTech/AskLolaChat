import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaCog } from 'react-icons/fa';
import NavigationMenu from '../common/NavigationMenu/NavigationMenu';


const Header = () => {
  const [showMenu, setShowMenu]  = useState(false);

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  }
  
 
    return (

    //     <div className="glass-container">
    // <h1 className="text-center mt-3">Ask Lola 😉</h1>
    // </div>
// };

<header className="text-center mt-3">
<Container fluid>
  {/* <Row className="align-items-center"> */}
			<Row className="justify-content-center mt-3">
    {/* <Col xs={10}> */}
				<Col xs={6} sm={8} md={10} lg={12}>
      <h1 className="header-title">Ask Lola 😉
      <FaCog
        className="settings-icon"
        onClick={handleToggleMenu}
        style={{ fontSize: '1.5rem', cursor: 'pointer', color: '#8a2be2' }}
      />
      </h1>
    </Col>
  </Row>
</Container>

{/* Show Navigation Menu */}
{showMenu && <NavigationMenu onClose={handleToggleMenu} />}
</header>
);


}; 

export default Header;