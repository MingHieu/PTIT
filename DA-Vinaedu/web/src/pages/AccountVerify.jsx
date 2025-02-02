import api from '@/core/api';
import { useAuth } from '@/shared/hooks';
import { useLocation } from '@solidjs/router';
import { onMount } from 'solid-js';

function AccountVerify() {
  const { isLoggedIn, fetchNewToken } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const verify = async () => {
    try {
      await api.post(`user/verify?token=${token}`);
      if (isLoggedIn()) {
        await fetchNewToken();
      }
    } catch (error) {}
    setTimeout(() => {
      window.location.href = '/settings';
    }, 1500);
  };

  onMount(() => {
    verify();
  });
}

export default AccountVerify;
