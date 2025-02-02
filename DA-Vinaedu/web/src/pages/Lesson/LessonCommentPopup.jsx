import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { Popup } from '@/shared/components';
import { createEffect, createSignal } from 'solid-js';

function LessonCommentPopup({ onClose, visible, lesson }) {
  const { classroom, refetchLessons } = useClassroom();
  const [comment, setComment] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  createEffect(() => {
    if (!visible()) {
      if (lesson()) {
        let attendance = lesson().attendances[0];
        setComment(attendance ? attendance.comment : '');
      }
    }
  });

  const handleCommentChange = e => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const body = {
      lessonId: lesson().id,
      comment: comment(),
    };
    try {
      await api.post(`attendance/comment`, body);
      refetchLessons();
      onClose();
    } catch (error) {}
    setLoading(false);
  };

  return (
    <Popup onClose={onClose} visible={visible}>
      <div class="p-6 w-screen max-w-lg">
        <div class="bg-white rounded-xl p-6 space-y-4 max-h-[90vh] overflow-auto">
          <h2 class="text-xl font-semibold">Gửi lời nhắn cho giáo viên</h2>
          <div class="space-y-2">
            <label>Lời nhắn</label>
            <textarea
              value={comment()}
              onInput={handleCommentChange}
              class="w-full p-2 border border-gray-300 rounded"
              placeholder="Nhập lời nhắn của bạn"
              rows="4"
            />
          </div>
          <div class="flex justify-end">
            <button
              onClick={handleSubmit}
              class={`px-4 py-2 rounded transition ${
                comment() && !loading()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              disabled={!comment() || loading()}>
              Gửi
            </button>
            <button class="ml-2 text-gray-700" onClick={onClose}>
              Huỷ bỏ
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default LessonCommentPopup;
