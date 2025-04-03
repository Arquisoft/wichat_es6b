import React, { useState } from 'react';
import Login from './Login';
import AddUser from './AddUser';
import './FlipCard.css';

const FlipCard = () => {
    const [flipped, setFlipped] = useState(false);

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    return (
        <div className="container">
            <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
                <div className="side front">
                    <Login />
                    <button className="fancy-button" onClick={handleFlip}>Don't have an account? Register here.</button>
                </div>
                <div className="side back">
                    <AddUser />
                    <button className="fancy-button" onClick={handleFlip}>Already have an account? Login here.</button>
                </div>
            </div>
        </div>
    );
};

export default FlipCard;
