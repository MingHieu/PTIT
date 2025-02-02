import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { Popup } from '@/shared/components';
import { useAuth } from '@/shared/hooks';
import { TbUpload } from 'solid-icons/tb';
import {
  createEffect,
  createResource,
  createSignal,
  Show,
  Suspense,
} from 'solid-js';

const getStudentInfo = async classroomId => {
  if (!classroomId) return;
  const data = await api.get('student/me', { params: { classroomId } });
  return data;
};

function StudentInfo() {
  const { user } = useAuth();
  const { classroom } = useClassroom();
  const [student, { mutate: setStudent }] = createResource(
    () => classroom()?.id,
    getStudentInfo,
    { initialValue: {} },
  );
  const [showImagePopup, setShowImagePopup] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [showNameEdit, setShowNameEdit] = createSignal(false);
  const [name, setName] = createSignal();

  createEffect(() => {
    if (student()) {
      setName(student().name);
    }
  });

  const handleNameConfirm = async () => {
    setLoading(true);
    try {
      const data = await api.post(`student/${student().id}/update`, {
        name: name(),
      });
      setStudent(data);
      setShowNameEdit(false);
    } catch (error) {}
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setName(student().name);
    setShowNameEdit(false);
  };

  return (
    <div class="flex-grow bg-gray-100 p-6">
      <Suspense
        fallback={
          <div class="max-w-screen-md mx-auto h-[70vh] rounded-xl animate-skeleton" />
        }>
        <div class="bg-white border p-6 rounded-xl max-w-screen-md mx-auto">
          <h2 class="text-xl font-bold mb-4">Thông tin sinh viên</h2>

          <div class="mb-6 relative">
            <Show
              when={student().image}
              fallback={
                <div class="h-48 aspect-square mx-auto rounded-lg bg-gray-300" />
              }>
              <img
                src={student().image}
                alt="Classroom Image"
                class="h-48 aspect-square mx-auto object-cover rounded-lg"
              />
            </Show>
            <button
              onClick={() => setShowImagePopup(true)}
              class="absolute bottom-2 left-2/3 bg-white p-2 rounded-full shadow-md"
              classList={{ 'cursor-not-allowed': loading() }}
              disabled={loading()}>
              <TbUpload class="text-xl text-blue-600" />
            </button>
          </div>

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
              <h3 class="font-bold">Email</h3>
              <p>{user().email}</p>
            </div>
          </div>
        </div>

        <ImageUploadPopup
          student={student}
          setStudent={setStudent}
          visible={showImagePopup}
          onClose={() => setShowImagePopup(false)}
        />
      </Suspense>
    </div>
  );
}

export default StudentInfo;

function ImageUploadPopup({ student, setStudent, visible, onClose }) {
  const [imagePreview, setImagePreview] = createSignal(null);
  const [imageFile, setImageFile] = createSignal(null);
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
      const data = await api.post(
        `student/${student().id}/update-image`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      setStudent(prev => ({ ...prev, image: data.image }));
      onClose();
    } catch (error) {}
    setLoading(false);
  };

  return (
    <Popup visible={visible} onClose={onClose}>
      <div class="p-6 w-screen max-w-screen-md">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-lg font-bold mb-4">Tải ảnh khuôn mặt lên</h3>
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
                alt="Image Preview"
                class="h-48 aspect-square mx-auto object-cover rounded-lg"
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
      </div>
    </Popup>
  );
}
