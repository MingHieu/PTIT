import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { FileBlock } from '@/shared/components';
import { TbUpload } from 'solid-icons/tb';
import { VsClose } from 'solid-icons/vs';
import { createSignal, Show } from 'solid-js';

function EssayTask({ exam, onClose }) {
  const { classroom, refetchExams } = useClassroom();
  const [examFile, setExamFile] = createSignal(null);
  const [loading, setLoading] = createSignal(false);

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      setExamFile(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', examFile());
      formData.append('classroomId', classroom().id);
      formData.append('examId', exam().id);
      await api.post('submission/essay', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      refetchExams();
    } catch (error) {}
    setLoading(false);
    onClose();
  };

  return (
    <div class="w-screen max-w-screen-sm p-6">
      <div class="relative bg-white p-6 rounded-lg space-y-4">
        <p class="font-semibold">{exam().title}</p>
        <button onClick={onClose} class="absolute top-0 right-5">
          <VsClose class="w-7 h-7" />
        </button>

        <div>
          <input
            type="file"
            onChange={handleFileChange}
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

        <Show when={examFile()}>
          <div class="w-fit">
            <FileBlock
              file={{
                name: examFile().name,
                type: examFile().type,
                url: examFile().url
                  ? examFile().url
                  : URL.createObjectURL(examFile()),
              }}
            />
          </div>
        </Show>

        <div class="flex justify-end mt-4 space-x-2">
          <button
            onClick={handleSubmit}
            disabled={!examFile() || loading()}
            class={`px-4 py-2 rounded font-semibold ${
              loading()
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : examFile()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-400 cursor-not-allowed'
            }`}>
            {loading() ? 'Đang nộp...' : 'Nộp bài'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EssayTask;
