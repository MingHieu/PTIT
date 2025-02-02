import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';

const Home = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.role === 'ADMIN') {
      navigate('/admin');
    }
  }, [user]);
};

export default Home;
