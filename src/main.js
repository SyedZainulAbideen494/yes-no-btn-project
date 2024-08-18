import React, { useState, useEffect } from 'react';
import './App.css';
import { useParams } from 'react-router-dom';
import Confetti from 'react-confetti';

const positions = [
  { top: '0%', left: '0%' },       // Top-left
  { top: '100%', left: '100%' },   // Bottom-right
  { top: '100%', left: '0%' },     // Bottom-left
  { top: '50%', left: '50%' }      // Center
];

const getNewPositionIndex = (direction) => {
  switch (direction) {
    case 'up': return 0; // Top-left
    case 'down': return 1; // Bottom-right
    case 'left': return 2; // Bottom-left
    case 'right': return 3; // Center
    case 'shake': return (Math.floor(Math.random() * positions.length)); // Random position on shake
    default: return 3; // Default to Center
  }
};

const Main = () => {
  const [message, setMessage] = useState('');
  const [positionIndex, setPositionIndex] = useState(3);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const params = useParams();

  // Handle button relocation based on direction
  const relocateButton = (direction) => {
    setPositionIndex(getNewPositionIndex(direction));
  };

  // Handle Yes button click
  const handleYesClick = () => {
    setMessage(params.msg);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
  };

  // Prevent No button from being clicked
  const handleNoClick = () => {
    // Intentionally left empty to disable No button
  };

  // Handle PC cursor movement
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const direction = getMouseDirection(clientX, clientY);

    if (direction) {
      relocateButton(direction);
    }

    setLastMousePosition({ x: clientX, y: clientY });
  };

  // Determine mouse direction based on movement
  const getMouseDirection = (x, y) => {
    const deltaX = x - lastMousePosition.x;
    const deltaY = y - lastMousePosition.y;
    const threshold = 10;

    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left';
      } else {
        return deltaY > 0 ? 'down' : 'up';
      }
    }
    return null;
  };

  // Handle mobile touch movement
  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    const { clientX, clientY } = touch;
    const direction = getTouchDirection(clientX, clientY);

    if (direction) {
      relocateButton(direction);
    }
  };

  // Determine touch direction based on touch position
  const getTouchDirection = (x, y) => {
    const threshold = window.innerWidth / 2;
    const verticalThreshold = window.innerHeight / 2;

    if (x < threshold && y < verticalThreshold) {
      return 'up';
    } else if (x >= threshold && y >= verticalThreshold) {
      return 'down';
    } else if (x < threshold) {
      return 'left';
    } else {
      return 'right';
    }
  };

  // Handle mobile touch start (tap and hold)
  const handleTouchStart = (event) => {
    event.preventDefault();
    relocateButton('shake');
  };

  // Handle device shake event
  useEffect(() => {
    const handleDeviceMotion = (event) => {
      const { accelerationIncludingGravity } = event;
      if (Math.abs(accelerationIncludingGravity.x) > 15 ||
          Math.abs(accelerationIncludingGravity.y) > 15 ||
          Math.abs(accelerationIncludingGravity.z) > 15) {
        relocateButton('shake');
      }
    };

    window.addEventListener('devicemotion', handleDeviceMotion);

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, []);

  // Set up event listeners for touch and mouse interactions
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [lastMousePosition]);

  return (
    <div className="app-container">
      {message ? (
        <>
          <div className="message">{message}</div>
          {showConfetti && <Confetti />}
        </>
      ) : (
        <>
          <div className="message">Click Yes or No</div>
          <div className="button-box">
            <button className="yes-button" onClick={handleYesClick}>Yes</button>
            <button 
              className="no-button" 
              style={positions[positionIndex]}
              onClick={handleNoClick} // Disable No button functionality
            >
              No
            </button>
          </div>
        </>
      )}
      <div className="footer">Made by Syed Zainul Abideen</div>
    </div>
  );
};

export default Main;