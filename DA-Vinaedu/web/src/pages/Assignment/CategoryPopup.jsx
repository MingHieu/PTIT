import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { Popup } from '@/shared/components';
import { createEffect, createSignal } from 'solid-js';

function CategoryPopup({ visible, onClose, category, setCategories }) {
  const { classroom } = useClassroom();
  const [title, setTitle] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  createEffect(() => {
    if (visible()) {
      if (category()) {
        setTitle(category().title);
      }
    } else {
      setTitle('');
    }
  });

  const isFormValid = () => title().trim() !== '';

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isFormValid()) return;
    setLoading(true);
    const url = category()
      ? `assignment/category/${category().id}/update`
      : 'assignment/category';
    try {
      const data = await api.post(url, {
        title: title(),
        classroomId: classroom().id,
      });
      setCategories(prev =>
        category()
          ? prev.map(c => (c.id == category().id ? data : c))
          : [...prev, data],
      );
      onClose();
    } catch (error) {}
    setLoading(false);
  };

  return (
    <Popup visible={visible} onClose={onClose}>
      <div class="p-6 w-screen max-w-lg">
        <form class="bg-white rounded-lg p-6" onSubmit={handleSubmit}>
          <h2 class="text-xl font-semibold mb-4">
            {category() ? 'Cập nhật đầu mục' : 'Tạo đầu mục mới'}
          </h2>
          <div class="mb-4">
            <label class="block mb-2">
              Tiêu đề <span class="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={title()}
              onInput={e => setTitle(e.target.value)}
              class="border rounded w-full px-3 py-2 border-gray-300"
            />
          </div>
          <div class="flex justify-end">
            <button
              class={`px-4 py-2 rounded transition ${
                isFormValid() && !loading()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              disabled={!isFormValid() || loading()}>
              {category() ? 'Cập nhật' : 'Tạo'}
            </button>
            <button type="button" class="ml-2 text-gray-700" onClick={onClose}>
              Huỷ bỏ
            </button>
          </div>
        </form>
      </div>
    </Popup>
  );
}

export default CategoryPopup;
