import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { Show } from 'solid-js';
import StudentView from './StudentView';
import TeacherView from './TeacherView';

function ClassroomDetail() {
  const { isOwner, classroom } = useClassroom();

  return (
    <Show when={classroom.state == 'ready'}>
      <Show when={isOwner()} fallback={<StudentView />}>
        <TeacherView />
      </Show>
    </Show>
  );
}

export default ClassroomDetail;
