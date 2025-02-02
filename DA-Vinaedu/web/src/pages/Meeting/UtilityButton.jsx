import {
  createDraggable,
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
} from '@thisbeyond/solid-dnd';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useMeeting } from '.';

const Draggable = ({ id, isShowMenu, setIsShowMenu }) => {
  const draggable = createDraggable(id);

  return (
    <div
      use:draggable
      class="fixed z-50 top-3 left-3"
      classList={{ hidden: draggable.isActiveDraggable }}>
      <Content isShowMenu={isShowMenu} setIsShowMenu={setIsShowMenu} />
    </div>
  );
};

const Utility = ({ text, onClick, imgSrc }) => {
  return (
    <button
      onClick={onClick}
      class="w-16 flex flex-col items-center space-y-1 hover:bg-gray-100 !outline-none">
      <img src={imgSrc} class="w-7 h-7" />
      <p class="text-xs font-semibold">{text}</p>
    </button>
  );
};

const Content = ({ isShowMenu, setIsShowMenu = () => {} }) => {
  const { setIsInteractPopupVisible } = useMeeting();

  return (
    <div class="bg-white flex items-center rounded-full shadow-md">
      <button
        onClick={() => setIsShowMenu(prev => !prev)}
        class="p-2 !outline-none"
        classList={{ 'neon-border': !isShowMenu() }}>
        <img
          src="/favicon.png"
          class="max-w-none w-10 h-10 pointer-events-none"
        />
      </button>

      <div
        class={`space-x-4 transition-all overflow-hidden ${
          isShowMenu() ? 'px-4' : 'w-0'
        }`}>
        <Utility
          text="Tương tác"
          onClick={() => setIsInteractPopupVisible(true)}
          imgSrc="/images/ic-interact.png"
        />
      </div>
    </div>
  );
};

const UtilityButton = () => {
  const [isShowMenu, setIsShowMenu] = createSignal(false);
  let transform = { x: 0, y: 0 };

  const onDragMove = ({ overlay }) => {
    if (overlay) {
      transform = { ...overlay.transform };
    }
  };

  const onDragEnd = ({ draggable }) => {
    const node = draggable.node;
    const newPos = {
      top: node.offsetTop + transform.y,
      left: node.offsetLeft + transform.x,
    };
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    if (newPos.top > screenHeight - 70) {
      newPos.top = screenHeight - 70;
    }
    if (newPos.top <= 10) {
      newPos.top = 10;
    }
    if (newPos.left > screenWidth - 100) {
      newPos.left = screenWidth - 100;
    }
    if (newPos.left <= 10) {
      newPos.left = 10;
    }
    node.style.setProperty('top', newPos.top + 'px');
    node.style.setProperty('left', newPos.left + 'px');
  };

  return (
    <Portal>
      <DragDropProvider onDragMove={onDragMove} onDragEnd={onDragEnd}>
        <DragDropSensors />
        <Draggable
          id={new Date().getTime()}
          isShowMenu={isShowMenu}
          setIsShowMenu={setIsShowMenu}
        />
        <DragOverlay>{() => <Content isShowMenu={isShowMenu} />}</DragOverlay>
      </DragDropProvider>
    </Portal>
  );
};

export default UtilityButton;
