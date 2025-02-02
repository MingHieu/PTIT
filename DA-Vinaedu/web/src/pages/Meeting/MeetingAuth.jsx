import { useZoom } from '@/shared/hooks';
import { useLocation } from '@solidjs/router';

function MeetingAuth() {
  const { setZoomToken } = useZoom();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const authData = JSON.parse(queryParams.get('auth_data'));
  setZoomToken(authData.access_token);
  window.close();
}

export default MeetingAuth;
