import api from '@/core/api';
import { Popup, useDialog } from '@/shared/components';
import { useAuth } from '@/shared/hooks';
import { IoCheckmarkDoneSharp } from 'solid-icons/io';
import { RiSystemDeleteBinLine } from 'solid-icons/ri';
import { TbUpload } from 'solid-icons/tb';
import { VsClose } from 'solid-icons/vs';
import { createEffect, createSignal, Show } from 'solid-js';
import toast from 'solid-toast';

function GeneralSettings() {
  const { user, setUserInfo } = useAuth();
  const [showImagePopup, setShowImagePopup] = createSignal(false);
  const [showNameEdit, setShowNameEdit] = createSignal(false);
  const [name, setName] = createSignal(user().name);
  const [loading, setLoading] = createSignal(false);
  const { showDialog } = useDialog();

  const handleNameConfirm = async () => {
    setLoading(true);
    try {
      const data = await api.post('user/update', {
        name: name(),
      });
      setUserInfo(data);
      setShowNameEdit(false);
    } catch (error) {}
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setName(user().name);
    setShowNameEdit(false);
  };

  const removeAvatar = () => {
    showDialog({
      type: 'confirm',
      text: 'Bạn có muốn xoá ảnh đại diện không?',
      async onConfirm() {
        setLoading(true);
        try {
          await api.post('user/update-avatar');
          setUserInfo({ ...user(), avatar: null });
        } catch (error) {}
        setLoading(false);
      },
    });
  };

  const verifyAccount = async () => {
    setLoading(true);
    const toastId = toast.loading('Đang gửi yêu cầu xác minh tài khoản...');
    try {
      await api.get('user/verify');
      toast.success(
        'Email xác nhận đã được gửi. Vui lòng kiểm tra hộp thư để hoàn tất xác minh.',
        { id: toastId },
      );
    } catch (error) {
      toast.error(
        'Không thể gửi email xác minh. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.',
        { id: toastId },
      );
    }
    setLoading(false);
  };

  return (
    <div>
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center">
          <Show
            when={user().avatar}
            fallback={<div class="w-20 h-20 rounded-full bg-gray-300 mr-4" />}>
            <img
              src={user().avatar}
              alt="Avatar"
              class="w-20 h-20 rounded-full mr-4 object-cover text-xs"
            />
          </Show>
        </div>
        <div class="flex space-x-4">
          <button
            onClick={removeAvatar}
            class="border border-gray-300 p-1 rounded-lg"
            classList={{ 'cursor-not-allowed': loading() }}
            disabled={loading()}>
            <RiSystemDeleteBinLine class="text-xl text-red-600" />
          </button>
          <button
            onClick={() => setShowImagePopup(true)}
            class="text-sm flex items-center border border-gray-300 px-2 py-1 rounded-lg"
            classList={{ 'cursor-not-allowed': loading() }}
            disabled={loading()}>
            <TbUpload class="text-lg mr-2" />
            Tải lên
          </button>
        </div>
      </div>

      <ImageUploadPopup
        visible={showImagePopup}
        onClose={() => setShowImagePopup(false)}
      />

      <div class="space-y-6">
        <div class="space-y-1">
          <h3 class="font-bold">Họ và tên</h3>
          <div class="flex justify-between items-center">
            <Show when={showNameEdit()} fallback={<p>{name() || '--'}</p>}>
              <input
                type="text"
                value={name()}
                onInput={e => setName(e.target.value)}
                class="border p-1 rounded"
              />
            </Show>
            <Show
              when={showNameEdit()}
              fallback={
                <button
                  class="text-blue-600"
                  onClick={() => setShowNameEdit(true)}>
                  Chỉnh sửa
                </button>
              }>
              <div class="flex space-x-4">
                <button
                  class={`${
                    loading()
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600'
                  }`}
                  onClick={handleNameConfirm}
                  disabled={loading()}>
                  Xác nhận
                </button>
                <button class="text-red-600" onClick={handleCancelEdit}>
                  Hủy
                </button>
              </div>
            </Show>
          </div>
        </div>

        <div class="space-y-1">
          <h3 class="font-bold">Thông tin liên hệ</h3>
          <p>Email: {user().email}</p>
        </div>

        <div class="space-y-2">
          <h3 class="font-bold">Trạng thái tài khoản</h3>
          <Show
            when={user().isVerify}
            fallback={
              <div class="space-y-2">
                <div class="flex items-center space-x-1 text-red-600">
                  <span class="font-semibold">Chưa xác minh</span>
                  <VsClose class="text-xl" />
                </div>
                <button
                  onClick={verifyAccount}
                  class={`px-4 py-1 ${
                    loading()
                      ? 'text-gray-600 bg-gray-300 cursor-not-allowed'
                      : 'text-white bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={loading()}>
                  {loading() ? 'Đang xử lý...' : 'Xác minh'}
                </button>
              </div>
            }>
            <div class="flex items-center space-x-1 text-green-600">
              <span class="font-semibold">Đã xác minh</span>
              <IoCheckmarkDoneSharp class="text-xl" />
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}

export default GeneralSettings;

function ImageUploadPopup({ visible, onClose }) {
  const { user, setUserInfo } = useAuth();
  const [imagePreview, setImagePreview] = createSignal();
  const [imageFile, setImageFile] = createSignal();
  const [loading, setLoading] = createSignal(false);
  let fileInputRef;

  createEffect(() => {
    if (visible()) {
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef) {
        fileInputRef.value = '';
      }
    }
  });

  const handleImageChange = e => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = e => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmUpload = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile());
      const data = await api.post('user/update-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUserInfo({ ...user(), avatar: data.avatar });
      onClose();
    } catch (error) {}
    setLoading(false);
  };

  return (
    <Popup visible={visible} onClose={onClose}>
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-lg font-bold mb-4">Tải ảnh lên</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <Show when={imagePreview()}>
          <div class="mt-4">
            <img
              src={imagePreview()}
              alt="Preview"
              class="w-full aspect-square object-cover rounded-lg"
            />
          </div>
        </Show>
        <div class="flex justify-end space-x-4 mt-4">
          <button
            class={`${
              imageFile() && !loading()
                ? 'text-blue-600'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleConfirmUpload}
            disabled={!imageFile() || loading()}>
            Xác nhận
          </button>
          <button class="text-red-600" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </Popup>
  );
}
