import { CLASSROOM_STATUS } from '@/constants';
import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { Popup, Select, useDialog } from '@/shared/components';
import { RiSystemDeleteBinLine } from 'solid-icons/ri';
import { TbUpload } from 'solid-icons/tb';
import { createEffect, createSignal, Show, Suspense } from 'solid-js';

function ClassroomSettings() {
  const { classroom, setClassroom } = useClassroom();
  const [showBannerPopup, setShowBannerPopup] = createSignal(false);
  const [formData, setFormData] = createSignal(classroom());
  const [loading, setLoading] = createSignal(false);
  const { showDialog } = useDialog();

  createEffect(() => {
    setFormData(classroom());
  });

  const editFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    const { name, description, isPrivate, status } = formData();
    try {
      const body = { name, description, isPrivate, status };
      const data = await api.post(`classroom/${classroom().id}/update`, body);
      setClassroom(data);
    } catch (error) {}
    setLoading(false);
  };

  const removeBanner = () => {
    showDialog({
      type: 'confirm',
      text: 'Bạn có muốn xoá ảnh bìa không?',
      async onConfirm() {
        setLoading(true);
        try {
          await api.post(`classroom/${classroom().id}/update-banner`);
          setClassroom(prev => ({ ...prev, banner: null }));
        } catch (error) {}
        setLoading(false);
      },
    });
  };

  const handleRemoveClass = e => {
    e.preventDefault();
    showDialog({
      type: 'confirm',
      text: 'Bạn có muốn xoá lớp học không?',
      async onConfirm() {
        setLoading(true);
        try {
          await api.post(`classroom/${classroom().id}/delete`);
          window.location.href = '/classroom';
        } catch (error) {}
        setLoading(false);
      },
    });
  };

  return (
    <div class="flex-grow bg-gray-100 p-6">
      <Suspense
        fallback={
          <div class="max-w-screen-md mx-auto h-[70vh] rounded-xl animate-skeleton" />
        }>
        <div class="bg-white border p-6 rounded-xl max-w-screen-md mx-auto">
          <h2 class="text-xl font-bold mb-4">Thông tin lớp học</h2>

          <div class="mb-6 relative">
            <Show
              when={classroom().banner}
              fallback={<div class="h-48 rounded-lg bg-gray-300" />}>
              <img
                src={classroom().banner}
                alt="Classroom Banner"
                class="w-full h-48 object-cover rounded-lg"
              />
            </Show>
            <button
              onClick={removeBanner}
              class="absolute bottom-2 right-16 bg-white p-2 rounded-full shadow-md"
              classList={{ 'cursor-not-allowed': loading() }}
              disabled={loading()}>
              <RiSystemDeleteBinLine class="text-xl text-red-600" />
            </button>
            <button
              onClick={() => setShowBannerPopup(true)}
              class="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md"
              classList={{ 'cursor-not-allowed': loading() }}
              disabled={loading()}>
              <TbUpload class="text-xl text-blue-600" />
            </button>
          </div>

          <form onSubmit={handleSave} class="space-y-4">
            <div>
              <label class="font-semibold">Tên:</label>
              <input
                type="text"
                value={formData().name}
                onInput={e => editFormData('name', e.target.value)}
                class="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label class="font-semibold">Mô tả:</label>
              <textarea
                value={formData().description}
                onInput={e => editFormData('description', e.target.value)}
                class="w-full border p-2 rounded"
              />
            </div>

            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData().isPrivate}
                onChange={e => editFormData('isPrivate', e.target.checked)}
              />
              <label class="font-semibold">Lớp học riêng tư</label>
            </div>

            <div class="space-y-2">
              <label class="font-semibold">Trạng thái:</label>
              <Select
                value={formData().status}
                onChange={e => editFormData('status', e.target.value)}
                class="p-1">
                <option value={CLASSROOM_STATUS.ACTIVE}>Đang hoạt động</option>
                <option value={CLASSROOM_STATUS.INACTIVE}>Hoàn thành</option>
              </Select>
            </div>

            <div class="flex justify-end">
              <div class="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleRemoveClass}
                  class={`px-4 py-2 rounded ${
                    loading()
                      ? 'text-gray-600 bg-gray-300 cursor-not-allowed'
                      : 'text-white bg-red-600 hover:bg-red-700'
                  }`}
                  disabled={loading()}>
                  Xoá lớp học
                </button>
                <button
                  type="submit"
                  class={`px-4 py-2 rounded ${
                    loading()
                      ? 'text-gray-600 bg-gray-300 cursor-not-allowed'
                      : 'text-white bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={loading()}>
                  Lưu
                </button>
              </div>
            </div>
          </form>
        </div>

        <BannerUploadPopup
          visible={showBannerPopup}
          onClose={() => setShowBannerPopup(false)}
        />
      </Suspense>
    </div>
  );
}

export default ClassroomSettings;

function BannerUploadPopup({ visible, onClose }) {
  const { classroom, setClassroom } = useClassroom();
  const [bannerPreview, setBannerPreview] = createSignal(null);
  const [bannerFile, setBannerFile] = createSignal(null);
  const [loading, setLoading] = createSignal(false);
  let fileInputRef;

  createEffect(() => {
    if (visible()) {
      setBannerFile(null);
      setBannerPreview(null);
      if (fileInputRef) {
        fileInputRef.value = '';
      }
    }
  });

  const handleBannerChange = e => {
    const file = e.target.files[0];
    setBannerFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = e => setBannerPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmUpload = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', bannerFile());
      const data = await api.post(
        `classroom/${classroom().id}/update-banner`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      setClassroom(prev => ({ ...prev, banner: data.banner }));
      onClose();
    } catch (error) {}
    setLoading(false);
  };

  return (
    <Popup visible={visible} onClose={onClose}>
      <div class="p-6 w-screen max-w-screen-md">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-lg font-bold mb-4">Tải ảnh bìa lên</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
          />
          <Show when={bannerPreview()}>
            <div class="mt-4">
              <img
                src={bannerPreview()}
                alt="Banner Preview"
                class="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </Show>
          <div class="flex justify-end space-x-4 mt-4">
            <button
              class={`${
                bannerFile() && !loading()
                  ? 'text-blue-600'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleConfirmUpload}
              disabled={!bannerFile() || loading()}>
              Xác nhận
            </button>
            <button class="text-red-600" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
}
