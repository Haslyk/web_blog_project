import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './ResetPass.css';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token');
            const email = searchParams.get('email');
            if (!token || !email) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.post('/verify-reset-token', { email, token });
                if (!response.data.valid) {
                    navigate('/login');
                }
            } catch (err) {
                navigate('/login');
            }
        };

        verifyToken();
    }, [searchParams, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        console.log("token:", token)
        console.log("email:", email)
        try {
            const response = await axios.post('/update-password', { email, token, newPassword });
            setSuccess('Password successfully updated');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError('Failed to reset password');
        }
    };

    return (
        <div className="reset-password-container">
            <form className="reset-password-form" onSubmit={handleSubmit}>
                <h2>Reset Password</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <div className="input-field">
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-field">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
