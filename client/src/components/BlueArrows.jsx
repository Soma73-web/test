// src/components/BlueArrows.jsx
import React from 'react';

export const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{
      right: '10px',
      zIndex: 2,
      width: 30,
      height: 30,
      background: '#2563eb',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: 20,
      cursor: 'pointer',
      position: 'absolute',
      top: '40%',
    }}
  >
    ❯
  </div>
);

export const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{
      left: '10px',
      zIndex: 2,
      width: 30,
      height: 30,
      background: '#2563eb',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: 20,
      cursor: 'pointer',
      position: 'absolute',
      top: '40%',
    }}
  >
    ❮
  </div>
);
