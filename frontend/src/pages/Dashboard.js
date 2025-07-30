import React from 'react';
import Placeholder from '../components/Placeholder';

const Dashboard = () => {
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <h2>User Dashboard</h2>
      <Placeholder text="Profile Section" height={120} />
      <Placeholder text="Order History" height={180} />
      <Placeholder text="Wishlist" height={120} />
    </div>
  );
};

export default Dashboard; 