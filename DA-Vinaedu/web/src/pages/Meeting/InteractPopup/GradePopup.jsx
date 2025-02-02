import { Popup } from '@/shared/components';
import { useInteract } from '.';

function GradePopup() {
  const { grade, isGradeVisible, onCloseGrade } = useInteract();
  return (
    <Popup visible={isGradeVisible} onClose={onCloseGrade}>
      <div class="flex items-center justify-center p-6">
        <div class="relative text-center">
          <div class="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-full w-36 h-36 flex items-center justify-center shadow-lg">
            <span class="text-6xl font-extrabold drop-shadow-md">{grade}</span>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default GradePopup;
