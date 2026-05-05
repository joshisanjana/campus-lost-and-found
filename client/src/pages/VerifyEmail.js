import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
      } catch (err) {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [location]);

  const handleResendVerification = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        navigate('/login');
        return;
      }

      await api.post('/auth/resend-verification', { email });
      setStatus('resent');
    } catch (err) {
      setStatus('resend-error');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Email Verification</h2>
        
        {status === 'verifying' && (
          <div className="message">
            <p>Verifying your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="success-message">
            <p>Your email has been verified successfully!</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Proceed to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="error-message">
            <p>The verification link is invalid or has expired.</p>
            <button 
              className="btn btn-secondary"
              onClick={handleResendVerification}
            >
              Resend Verification Email
            </button>
          </div>
        )}

        {status === 'resent' && (
          <div className="success-message">
            <p>A new verification email has been sent. Please check your inbox.</p>
          </div>
        )}

        {status === 'resend-error' && (
          <div className="error-message">
            <p>Failed to resend verification email. Please try again later or contact support.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;