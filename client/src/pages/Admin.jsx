import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from './AdminPanel';

const Admin = () => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    if (!isLoggedIn) {
      navigate('/admin-login');
    } else {
      setCheckingAuth(false);
    }
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-gray-600">Checking admin access...</div>
      </div>
    );
  }

  return <AdminPanel />;
};

export default Admin;
