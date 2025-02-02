import { useAuth } from '@/shared/hooks';

function Logout() {
  const { logout } = useAuth();

  logout();
  window.location.href = '/login';
}

export default Logout;
