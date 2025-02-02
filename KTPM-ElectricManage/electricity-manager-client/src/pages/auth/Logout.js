import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    navigate('/auth/login', {
      replace: true,
    });
  }, []);

  return <div>Logout</div>;
};

export default Logout;
