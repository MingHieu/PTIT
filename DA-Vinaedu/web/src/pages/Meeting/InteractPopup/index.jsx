import { MEETING_INTERACT_TYPE } from '@/constants/meeting';
import { WS } from '@/core/ws';
import { Popup } from '@/shared/components';
import {
  createContext,
  createEffect,
  createSignal,
  Show,
  useContext,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import GradePopup from './GradePopup';
import QuizOption from './QuizOption';

const InteractContext = createContext();

function InteractPopup() {
  const [visible, setVisible] = createSignal(false);
  const [interactData, setInteractData] = createSignal(null);
  const [grade, setGrade] = createSignal();
  const [isGradeVisible, setIsGradeVisible] = createSignal(false);

  createEffect(() => {
    WS.socket()?.on('meeting.interact', event => {
      setInteractData(event);
      setVisible(true);
    });
  });

  const options = {
    [MEETING_INTERACT_TYPE.QUIZ]: QuizOption,
  };

  const onClose = () => {
    setInteractData(null);
    setVisible(false);
  };

  const showGrade = g => {
    setGrade(g);
    setIsGradeVisible(true);
  };

  const onCloseGrade = () => {
    setGrade(null);
    setIsGradeVisible(false);
  };

  return (
    <InteractContext.Provider
      value={{ showGrade, onCloseGrade, grade, isGradeVisible }}>
      <Popup visible={visible} onClose={onClose} cancelable={false}>
        <Show when={interactData()}>
          <Dynamic
            component={options[interactData().type]}
            interactData={interactData()}
            onClose={onClose}
          />
        </Show>
      </Popup>
      <GradePopup />
    </InteractContext.Provider>
  );
}

export const useInteract = () => useContext(InteractContext);

export default InteractPopup;
