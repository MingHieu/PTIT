import { WS } from '@/core/ws';
import ClassroomNavbarLayout from '@/layouts/ClassroomNavbarLayout';
import HomeLayout from '@/layouts/HomeLayout';
import SidebarLayout from '@/layouts/SidebarLayout';
import AccountVerify from '@/pages/AccountVerify';
import Assignment from '@/pages/Assignment';
import Classroom from '@/pages/Classroom';
import ClassroomDetail from '@/pages/ClassroomDetail';
import ClassroomInvite from '@/pages/ClassroomInvite';
import ClassroomSettings from '@/pages/ClassroomSettings';
import Exam from '@/pages/Exam';
import Home from '@/pages/Home';
import Lesson from '@/pages/Lesson';
import Login from '@/pages/Login';
import Logout from '@/pages/Logout';
import Material from '@/pages/Material';
import Meeting from '@/pages/Meeting';
import MeetingAuth from '@/pages/Meeting/MeetingAuth';
import NotFound from '@/pages/NotFound';
import Notifications from '@/pages/Notifications';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Register from '@/pages/Register';
import Settings from '@/pages/Settings';
import { useSettings } from '@/pages/Settings/useSettings';
import Student from '@/pages/Student';
import StudentInfo from '@/pages/StudentInfo';
import Timetable from '@/pages/Timetable';
import { useAuth } from '@/shared/hooks';
import { Navigate, Route, Router } from '@solidjs/router';
import { createEffect } from 'solid-js';

const Routes = () => {
  const { isLoggedIn, refetchUser } = useAuth();
  const { getUserSettings } = useSettings();

  const AuthRoute = ({ component, isPublic = false }) => {
    if (isPublic) {
      return isLoggedIn() ? () => <Navigate href="/classroom" /> : component;
    }

    return isLoggedIn() ? component : () => <Navigate href="/login" />;
  };

  createEffect(() => {
    if (isLoggedIn()) {
      WS.connect();
      getUserSettings();
      refetchUser();
    } else {
      WS.disconnect();
    }
  });

  return (
    <Router>
      <Route component={HomeLayout}>
        <Route path="/" component={Home} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
      </Route>
      <Route
        path="/login"
        component={<AuthRoute component={Login} isPublic={true} />}
      />
      <Route
        path="/register"
        component={<AuthRoute component={Register} isPublic={true} />}
      />
      <Route path="/logout" component={Logout} />
      <Route component={<AuthRoute component={SidebarLayout} />}>
        <Route path="/classroom" component={Classroom} />
        <Route path="/timetable" component={Timetable} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/settings" component={Settings} />
      </Route>
      <Route
        path="/classroom/invite"
        component={<AuthRoute component={ClassroomInvite} />}
      />
      <Route
        path="/classroom/:id"
        component={<AuthRoute component={ClassroomNavbarLayout} />}>
        <Route path={'/'} component={ClassroomDetail} />
        <Route path="/lesson" component={Lesson} />
        <Route path="/student" component={Student} />
        <Route path="/assignment" component={Assignment} />
        <Route path="/exam" component={Exam} />
        <Route path="/material" component={Material} />
        <Route path="/settings" component={ClassroomSettings} />
        <Route path="/student-info" component={StudentInfo} />
      </Route>
      <Route
        path="/classroom/:id/meeting"
        component={<AuthRoute component={Meeting} />}
      />
      <Route
        path="/meeting-auth"
        component={<AuthRoute component={MeetingAuth} />}
      />
      <Route path="/verify-account" component={AccountVerify} />
      <Route path="*404" component={NotFound} />
    </Router>
  );
};

export default Routes;
