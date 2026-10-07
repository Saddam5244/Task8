import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

const AlertBanner = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert-banner alert-${type}`}>
      <div className="alert-content">
        {type === 'error' ? (
          <AlertTriangle className="alert-icon" size={18} />
        ) : (
          <CheckCircle className="alert-icon" size={18} />
        )}
        <span className="alert-message">{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          className="alert-dismiss-btn"
          onClick={onClose}
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
