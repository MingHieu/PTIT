import { ASSIGNMENT_TYPE } from '@/constants';
import { Popup } from '@/shared/components';
import { Show } from 'solid-js';
import EssayTask from './EssayTask';
import QuizTask from './QuizTask';

function TaskPopup({ onClose, visible, assignment }) {
  return (
    <Popup onClose={onClose} visible={visible}>
      <Show when={assignment()?.type == ASSIGNMENT_TYPE.ESSAY}>
        <EssayTask assignment={assignment} onClose={onClose} />
      </Show>
      <Show when={assignment()?.type == ASSIGNMENT_TYPE.QUIZ}>
        <QuizTask assignment={assignment} onClose={onClose} />
      </Show>
    </Popup>
  );
}

export default TaskPopup;
