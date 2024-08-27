import React from 'react';
import {Row, Col} from 'react-bootstrap';
import logo from '../logo.svg';


const NonsenseFooter = () => {
    return (
      <>
        {/* <Row className="justify-content-center mt-3">
          <Col xs={12} sm={8} md={6} lg={4}>
            <img src={logo} className="App-logo" alt="logo" />
          </Col>
        </Row>
   */}
        <Row className="justify-content-center mt-3">
          <Col xs={12} sm={8} md={6} lg={4} className="text-center">
            <p>
              <code>Hi I'm Lola 💜 Your Relationship Expert
              <br></br>
               Ask me how to text your crush, first date ideas, 
               <br></br>
               advice on your long term relationship 
               <br></br>
               or even couples therapy questions :)
              
              </code>
            </p>
            <p className="text-center">
              <a
                className="App-link"
                href="https://apps.apple.com/app/apple-store/id1663430725"
                target="_blank"
                rel="noopener noreferrer"
              >
                This App Copied Me
              </a>
            </p>
          </Col>
        </Row>
      </>
    );
  };
  
  export default NonsenseFooter;
 
  
  
  
  

/* 
old Code
<Row className="justify-content-center mt-3">
<Col xs={12} sm={8} md={6} lg={4}>
<img src={logo} className="App-logo" alt="logo" />
</Col>
</Row>


<Row className="justify-content-center mt-3">
<Col xs={12} sm={8} md={6} lg={4}  className="text-center">
<p>
<code>Hi I'm Lola 💜 Your Personal AI Wingwoman</code>
</p>
<p className="text-center">
<a
className="App-link"
href="https://apps.apple.com/app/apple-store/id1663430725"
target="_blank"
rel="noopener noreferrer"
>
I am copying this app
</a>
</p>
</Col>
</Row>
*/