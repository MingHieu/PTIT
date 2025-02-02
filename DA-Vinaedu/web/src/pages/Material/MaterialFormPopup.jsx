import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { FileBlock, Popup, Select } from '@/shared/components';
import { TbUpload } from 'solid-icons/tb';
import { createEffect, createSignal, Show } from 'solid-js';

const MATERIAL_TYPE = {
  url: 'url',
  file: 'file',
};

function MaterialFormPopup({ onClose, visible, material }) {
  const { classroom, refetchMaterials } = useClassroom();
  const [formData, setFormData] = createSignal({
    title: '',
    type: MATERIAL_TYPE.url,
    file: null,
    url: '',
  });
  const [loading, setLoading] = createSignal(false);
  let fileInputRef;

  createEffect(() => {
    if (visible()) {
      if (material()) {
        fillFormData();
      }
    } else {
      resetFormData();
    }
  });

  const fillFormData = () => {
    setFormData({
      title: material().title || '',
      type: material().url ? MATERIAL_TYPE.url : MATERIAL_TYPE.file,
      file: material().file || null,
      url: material().url || '',
    });
  };

  const resetFormData = () => {
    if (fileInputRef) {
      fileInputRef.value = '';
    }
    setFormData({
      title: '',
      type: MATERIAL_TYPE.file,
      file: null,
      url: '',
    });
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const isFormValid = () => {
    const { title, type, file, url } = formData();
    return (
      title &&
      ((type === MATERIAL_TYPE.url && url) ||
        (type === MATERIAL_TYPE.file && file))
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    const url = material() ? `/material/${material().id}/update` : '/material';
    const formDataToSend = new FormData();

    Object.entries(formData()).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    formDataToSend.append('classroomId', classroom().id);

    if (formData().type == MATERIAL_TYPE.file) {
      formDataToSend.set('url', '');
    }

    if (formData().type == MATERIAL_TYPE.url) {
      formDataToSend.set('file', null);
    }

    try {
      await api.post(url, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      refetchMaterials();
      onClose();
    } catch (error) {}
    setLoading(false);
  };

  return (
    <Popup visible={visible} onClose={onClose}>
      <div class="p-6 w-screen max-w-lg">
        <div class="bg-white rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">
            {material() ? 'Chỉnh sửa tài liệu' : 'Tạo tài liệu mới'}
          </h2>

          <div class="mb-4">
            <label class="block mb-2">
              Tiêu đề <span class="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData().title}
              onInput={e => updateFormData('title', e.target.value)}
              class="border rounded w-full px-3 py-2 border-gray-300"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-2">Loại tài liệu</label>
            <Select
              value={formData().type}
              onChange={e => updateFormData('type', e.target.value)}
              class="p-1">
              <option value={MATERIAL_TYPE.url}>Liên kết</option>
              <option value={MATERIAL_TYPE.file}>Tài liệu</option>
            </Select>
          </div>

          <Show when={formData().type === MATERIAL_TYPE.url}>
            <div class="mb-4">
              <label class="block mb-2">Liên kết</label>
              <input
                type="url"
                value={formData().url}
                onInput={e => updateFormData('url', e.target.value)}
                class="border rounded w-full px-3 py-2 border-gray-300"
                placeholder="Nhập URL"
              />
            </div>
          </Show>

          <Show when={formData().type === MATERIAL_TYPE.file}>
            <div class="mb-4 space-y-4">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onInput={e => updateFormData('file', e.target.files[0])}
                  class="hidden"
                  id="file-upload"
                />
                <label
                  for="file-upload"
                  class="flex items-center cursor-pointer text-blue-600 hover:underline">
                  <TbUpload class="text-xl mr-2" />
                  Tải lên
                </label>
              </div>

              <Show when={formData().file}>
                <div class="w-fit">
                  <FileBlock
                    file={{
                      name: formData().file.name,
                      type: formData().file.type,
                      url: formData().file.url
                        ? formData().file.url
                        : URL.createObjectURL(formData().file),
                    }}
                  />
                </div>
              </Show>
            </div>
          </Show>

          <div class="flex justify-end">
            <button
              onClick={handleSubmit}
              class={`px-4 py-2 rounded transition ${
                isFormValid() && !loading()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              disabled={!isFormValid() || loading()}>
              {material() ? 'Cập nhật' : 'Tạo tài liệu'}
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

export default MaterialFormPopup;
