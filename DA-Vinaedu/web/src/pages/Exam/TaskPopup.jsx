import { ASSIGNMENT_TYPE } from '@/constants';
import { Popup } from '@/shared/components';
import { Show } from 'solid-js';
import EssayTask from './EssayTask';
import QuizTask from './QuizTask';

function TaskPopup({ onClose, visible, exam }) {
  return (
    <Popup onClose={onClose} visible={visible}>
      <Show when={exam()?.type == ASSIGNMENT_TYPE.ESSAY}>
        <EssayTask exam={exam} onClose={onClose} />
      </Show>
      <Show when={exam()?.type == ASSIGNMENT_TYPE.QUIZ}>
        <QuizTask exam={exam} onClose={onClose} />
      </Show>
    </Popup>
  );
}

export default TaskPopup;
