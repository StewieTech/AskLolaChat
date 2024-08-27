import React from 'react';
import { Badge, Button, Modal } from 'react-bootstrap';

const QuestionCount = ({ questionCount, maxQuestionLimit, onUpgradeClick }) => {
  const remainingFreeQuestions = maxQuestionLimit - questionCount;
  let showProPopup = questionCount > maxQuestionLimit;
  
return (
    <div className="text-center">
        <Badge variant={remainingFreeQuestions > 0 ? "secondary" : "danger"}>
            {remainingFreeQuestions > 0 ? `Remaining Free Questions: ${remainingFreeQuestions}` : "Upgrade to Pro for Unlimited Questions"}
        </Badge>

        <Modal show={showProPopup} onHide={() => {}}>
            <Modal.Header closeButton>
                <Modal.Title>Upgrade to Pro to talk more</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Pro Accounts get unlimited questions and more features!</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {}}>  {/* Update button colour */}
                    Close
                </Button>
                <Button variant="primary" onClick={onUpgradeClick}>  {/* Update button colour */}
                    Upgrade to Pro
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
);
};

export default QuestionCount;




/*
old code






var remainingFreeQuestions = MAX_QUESTION_LIMIT_FREE - questionCount ;


//   Pro Badge  
//  <div className="text-center">
//  {remainingFreeQuestions > 0 ? (
    //    <Badge variant="secondary">Remaining Free Questions: {remainingFreeQuestions}</Badge>
    //  ) : (
        //    <Badge variant="danger">Upgrade to Pro for Unlimited Questions</Badge>
        //  )}
        // </div>

 <Modal show = {showProPopup} onHide={handleCloseProPopup}>
        <Modal.Header closeButton>
          <Modal.Title>Upgrade to Pro to talk more to Lola</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p> Upgrade now to get unlimited questions and more features!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProPopup}>
            Close
          </Button>
          <Button variant = "primary" onClick={handleSignUpForPro}>
            Upgrade to Pro
          </Button>
           Login to Google   in this line !!! 
          </Modal.Footer>
          </Modal>
        
*/
