import { ZOOM_AUTH_URL, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } from '@/configs';
import api from '@/core/api';
import { NoDataView, useDialog } from '@/shared/components';
import { useAuth, useZoom } from '@/shared/hooks';
import { useParams } from '@solidjs/router';
import { ZoomMtg } from '@zoom/meetingsdk';
import moment from 'moment';
import {
  createContext,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  Match,
  onCleanup,
  Show,
  Switch,
  useContext,
} from 'solid-js';
import InteractManagerPopup from './InteractManagerPopup';
import InteractPopup from './InteractPopup';
import StudentVerification from './StudentVerification';
import UtilityButton from './UtilityButton';

const MeetingContext = createContext();

const getClassroom = async id => {
  const data = await api.get(`classroom/${id}`);
  return data;
};

const getStudents = async ({ isOwner, classroomId }) => {
  if (!isOwner) return [];
  try {
    const data = await api.get('student', {
      params: { classroomId },
    });
    return data;
  } catch (error) {
    return [];
  }
};

function Meeting() {
  const { id } = useParams();
  const { user } = useAuth();
  const [classroom, { mutate: setClassroom }] = createResource(
    id,
    getClassroom,
  );
  const [lesson, setLesson] = createSignal();
  const isOwner = createMemo(
    () =>
      classroom.state == 'ready' && classroom().owner?.email == user().email,
  );
  const [students] = createResource(
    () => ({ isOwner: isOwner(), classroomId: id }),
    getStudents,
    { initialValue: [] },
  );
  const { getZoomToken, removeZoomToken, observeZoomToken } = useZoom();
  const { showDialog, confirmDialog } = useDialog();
  const [isInteractPopupVisible, setIsInteractPopupVisible] =
    createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [isVerified, setIsVerified] = createSignal(false);

  createEffect(() => {
    if (classroom()?.id) {
      if (isOwner()) {
        openLesson();
      } else {
        getCurrentLesson();
      }
    }
  });

  createEffect(() => {
    if (lesson()) {
      if (isOwner()) {
        checkZoomAuth();
      } else if (isVerified()) {
        initZoom();
      }
    }
  });

  onCleanup(() => {
    if (lesson()) {
      if (isOwner()) {
        closeLesson();
      } else {
        checkInOut();
      }
    }
  });

  const checkZoomAuth = () => {
    const zoomToken = getZoomToken();
    if (zoomToken) {
      initZoom();
      return;
    }
    setTimeout(() => {
      showDialog({
        type: 'confirm',
        text: 'Bạn cần liên kết tài khoản Zoom trước khi mở lớp học. Nhấn "Liên kết" để bắt đầu.',
        confirmUrl: ZOOM_AUTH_URL,
        confirmText: 'Liên kết',
        onClose() {
          window.close();
        },
        icon: '/images/ic-infor.png',
      });
    }, 500);
    observeZoomToken(newValue => {
      if (newValue) {
        initZoom();
        confirmDialog();
      }
    });
  };

  const createZoomMeeting = async () => {
    const data = await api.post('meeting', {
      classroomId: classroom().id,
      token: getZoomToken(),
    });
    return data;
  };

  const initZoom = async () => {
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();

    try {
      let meeting = classroom().meeting;
      if (!meeting) {
        if (isOwner()) {
          meeting = await createZoomMeeting();
          setClassroom(prev => ({ ...prev, meeting }));
        } else {
          window.close();
        }
      }
      const { id: meetingNumber, password: passWord } = meeting;
      ZoomMtg.generateSDKSignature({
        meetingNumber,
        role: isOwner() ? 1 : 0,
        sdkKey: ZOOM_CLIENT_ID,
        sdkSecret: ZOOM_CLIENT_SECRET,
        success(signature) {
          ZoomMtg.init({
            leaveUrl: `/classroom/${classroom().id}`,
            success: () => {
              ZoomMtg.join({
                sdkKey: ZOOM_CLIENT_ID,
                signature,
                meetingNumber,
                passWord,
                userName: user().name || user().email,
              });
            },
          });
        },
      });
    } catch (error) {
      removeZoomToken();
      checkZoomAuth();
    }
  };

  const openLesson = async () => {
    setLoading(true);
    try {
      await getCurrentLesson();
      if (lesson()) return;
      const data = await api.post('lesson', {
        start: moment().valueOf(),
        end: moment().add(60, 'minutes').valueOf(),
        classroomId: classroom().id,
      });
      setLesson(data);
    } catch (error) {}
    setLoading(false);
  };

  const getCurrentLesson = async () => {
    setLoading(true);
    try {
      const data = await api.get('lesson', { params: { classroomId: id } });
      const now = moment();
      let currentLesson = data.find(lesson =>
        now.isBetween(moment(lesson.start), moment(lesson.end)),
      );
      if (!currentLesson) {
        const nearestLesson = data
          .map(lesson => ({
            ...lesson,
            startTime: moment(lesson.start),
            timeDifference: Math.abs(moment(lesson.start).diff(now, 'minutes')),
          }))
          .filter(
            lesson =>
              lesson.startTime.isAfter(now) && lesson.timeDifference <= 30,
          )
          .sort((a, b) => a.timeDifference - b.timeDifference)[0];
        currentLesson = nearestLesson || null;
      }
      if (!currentLesson && !isOwner()) window.close();
      setLesson(currentLesson);
    } catch (error) {}
    setLoading(false);
  };

  const closeLesson = async () => {
    try {
      await api.post(`lesson/${lesson().id}/update`, {
        end: moment().valueOf(),
      });
    } catch (error) {}
  };

  const checkInOut = async (image) => {
    await api.post('attendance', { lessonId: lesson().id, image });
  };

  return (
    <MeetingContext.Provider
      value={{
        classroom,
        isInteractPopupVisible,
        setIsInteractPopupVisible,
        lesson,
        students,
        setIsVerified,
        checkInOut,
      }}>
      <Switch>
        <Match when={classroom.loading || loading()}>
          <div class="w-full h-screen animate-skeleton" />
        </Match>
        <Match when={classroom.error}>
          <div class="w-full h-screen flex justify-center items-center">
            <NoDataView />
          </div>
        </Match>
        <Match when={classroom() && lesson()}>
          <Show when={isOwner()}>
            <UtilityButton />
            <InteractManagerPopup />
          </Show>
          <Show when={!isOwner()}>
            <InteractPopup />
            <Show when={!isVerified()}>
              <StudentVerification />
            </Show>
          </Show>
        </Match>
      </Switch>
    </MeetingContext.Provider>
  );
}

export const useMeeting = () => useContext(MeetingContext);

export default Meeting;
