import { Popup } from '@/shared/components';
import { createSignal } from 'solid-js';

function CreateClassPopup({ visible, onClose, onCreate, loading, setLoading }) {
  const [name, setName] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [isPrivate, setIsPrivate] = createSignal(false);

  const isFormValid = () => name().trim() !== '';

  const handleCreate = async () => {
    setLoading(true);
    try {
      await onCreate({
        name: name(),
        description: description(),
        isPrivate: isPrivate(),
      });
      setName('');
      setDescription('');
      setIsPrivate(false);
      onClose();
    } catch (error) {}
    setLoading(false);
  };

  return (
    <Popup visible={visible} onClose={onClose}>
      <div class="p-6 w-screen max-w-lg">
        <div class="bg-white rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Tạo lớp học mới</h2>
          <div class="mb-4">
            <label class="block mb-2">
              Tên <span class="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={name()}
              onInput={e => setName(e.target.value)}
              class="border rounded w-full px-3 py-2 border-gray-300"
            />
          </div>
          <div class="mb-4">
            <label class="block mb-2">Mô tả</label>
            <textarea
              value={description()}
              onInput={e => setDescription(e.target.value)}
              class="border rounded w-full px-3 py-2 border-gray-300"
              rows="4"></textarea>
          </div>
          <div class="mb-4">
            <label class="flex items-center">
              <input
                type="checkbox"
                checked={isPrivate()}
                onChange={e => setIsPrivate(e.target.checked)}
                class="mr-2"
              />
              <span class="text-gray-700">Lớp học riêng tư</span>
            </label>
          </div>
          <div class="flex justify-end">
            <button
              class={`px-4 py-2 rounded transition ${
                isFormValid() && !loading()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              onClick={handleCreate}
              disabled={!isFormValid() || loading()}>
              Tạo lớp
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

export default CreateClassPopup;
