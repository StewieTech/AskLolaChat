import React from 'react';
import PropTypes from 'prop-types';
import './Badge.css';

const Badge = ({ type, message }) => {
  return (
    <div className={`badge badge-${type} text-white`}>
      {message}
    </div>
  );
};

Badge.propTypes = {
  type: PropTypes.oneOf(['success', 'error']).isRequired,
  message: PropTypes.string.isRequired,
};

export default Badge;
