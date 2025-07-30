import React from 'react';

const Placeholder = ({ height = 200, width = '100%', text = 'Placeholder' }) => (
  <div
    style={{
      height,
      width,
      background: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#aaa',
      borderRadius: 8,
      margin: '20px 0',
      fontSize: 24,
      border: '1px dashed #ccc',
    }}
  >
    {text}
  </div>
);

export default Placeholder; 