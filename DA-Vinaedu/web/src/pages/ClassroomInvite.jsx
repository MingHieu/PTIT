import api from '@/core/api';
import { useLocation } from '@solidjs/router';
import { onMount } from 'solid-js';
import toast from 'solid-toast';

function ClassroomInvite() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const classroomId = queryParams.get('id');
  let toastId = null;

  const checkRequestAccepted = async () => {
    try {
      await api.get(`classroom/${classroomId}`, { noToast: true });
      window.location.href = `/classroom/${classroomId}`;
    } catch (error) {
      setTimeout(() => {
        window.location.href = `/classroom`;
      }, 1500);
    }
  };

  const sendJoinRequest = async () => {
    toastId = toast.loading('Đang gửi yêu cầu tham gia lớp học', {
      position: 'top-center',
    });
    try {
      await api.post(`classroom/${classroomId}/join`, {}, { noToast: true });
      toast.success('Yêu cầu tham gia lớp học đã được gửi', {
        id: toastId,
        position: 'top-center',
      });
      checkRequestAccepted();
    } catch (error) {
      toast.success(
        'Yêu cầu tham gia lớp học đã được gửi. Hãy đợi giáo viên chấp nhận lời yêu cầu',
        {
          id: toastId,
          position: 'top-center',
        },
      );
      setTimeout(() => {
        window.location.href = `/classroom`;
      }, 1500);
    }
  };

  onMount(() => {
    sendJoinRequest();
  });
}

export default ClassroomInvite;
