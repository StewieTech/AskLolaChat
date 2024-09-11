// components/features/messages/QuestionCount.js
import React from 'react';
import { Badge, Button, Modal } from 'react-bootstrap';

const QuestionCount = ({ questionCount, maxQuestionLimit, onUpgradeClick }) => {
  const remainingFreeQuestions = maxQuestionLimit - questionCount;
// const remainingFreeQuestions = questionCount ; 
//   let showProPopup = questionCount > maxQuestionLimit;
let showProPopup = remainingFreeQuestions <=0 ;
  
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





