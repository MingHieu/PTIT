import { ASSIGNMENT_TYPE } from '@/constants';
import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { Popup, Select } from '@/shared/components';
import { dateToTimestamp, formatDate } from '@/shared/utils';
import { AiOutlineClose } from 'solid-icons/ai';
import { FiFileText } from 'solid-icons/fi';
import { createEffect, createSignal, Match, Switch } from 'solid-js';
import EssaySection from './EssaySection';
import QuizSection from './QuizSection';

function FormPopup({ onClose, visible, exam }) {
  const { classroom, refetchExams } = useClassroom();
  const [formData, setFormData] = createSignal({
    title: '',
    description: '',
    dueDate: '',
    files: [],
    type: ASSIGNMENT_TYPE.ESSAY,
    questions: [],
    isQuestionChanged: false,
    duration: '',
    isGraded: false,
  });
  const [loading, setLoading] = createSignal(false);

  createEffect(() => {
    if (visible()) {
      if (exam()) {
        fillFormData();
      }
    } else {
      resetFormData();
    }
  });

  const fillFormData = () => {
    setFormData({
      title: exam().title,
      description: exam().description,
      dueDate: exam().dueDate
        ? formatDate(exam().dueDate, 'YYYY-MM-DDTHH:mm', true)
        : '',
      files: exam().files || [],
      type: exam().type || ASSIGNMENT_TYPE.ESSAY,
      questions: exam().questions || [],
      isQuestionChanged: false,
      duration: exam().duration || '',
      isGraded: exam().isGraded || false,
    });
  };

  const resetFormData = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      files: [],
      type: ASSIGNMENT_TYPE.ESSAY,
      questions: [],
      isQuestionChanged: false,
      duration: '',
      isGraded: false,
    });
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { dueDate, duration, files, questions, ...rest } = formData();
    const url = exam() ? `exam/${exam().id}/update` : 'exam';

    const formDataToSend = new FormData();

    Object.entries(rest).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    formDataToSend.append('classroomId', classroom().id);
    if (dueDate) {
      formDataToSend.append('dueDate', dateToTimestamp(dueDate));
    }
    formDataToSend.append('duration', +duration);

    if (files && files.length > 0) {
      files.forEach(file => {
        if (!file.id) {
          formDataToSend.append('files', file);
        }
      });
    }
    formDataToSend.append(
      'fileIds',
      JSON.stringify(files.map(f => f.id).filter(Boolean)),
    );

    if (questions) {
      formDataToSend.append('questions', JSON.stringify(questions));
    }

    try {
      await api.post(url, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      refetchExams();
      onClose();
    } catch (error) {}
    setLoading(false);
  };

  return (
    <Popup onClose={onClose} visible={visible}>
      <div class="w-screen h-screen overflow-auto flex flex-col">
        <div class="flex-grow flex flex-col bg-gray-100">
          <div class="bg-white flex items-center justify-between p-4 border-b sticky top-0 z-30">
            <div class="flex items-center space-x-2">
              <button onClick={onClose}>
                <AiOutlineClose class="text-xl mr-2" />
              </button>
              <div class="bg-red-100 p-2 rounded-full">
                <FiFileText class="text-red-600 text-xl" />
              </div>
              <h2 class="text-2xl font-bold">Kiểm tra</h2>
            </div>
            <button
              onClick={handleSubmit}
              class={`px-4 py-2 rounded ${
                loading()
                  ? 'text-gray-600 bg-gray-300 cursor-not-allowed'
                  : 'text-white bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={loading()}>
              {exam() ? 'Cập nhật' : 'Giao bài'}
            </button>
          </div>

          <div class="flex flex-wrap md:flex-grow">
            <div class="w-full md:w-2/3 space-y-6 p-6">
              <div class="bg-white border rounded-xl p-6">
                <input
                  type="text"
                  placeholder="Tiêu đề"
                  value={formData().title}
                  onInput={e => updateFormData('title', e.target.value)}
                  class="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <textarea
                  placeholder="Hướng dẫn (không bắt buộc)"
                  value={formData().description}
                  onInput={e => updateFormData('description', e.target.value)}
                  class="w-full p-2 border border-gray-300 rounded mb-4"></textarea>
              </div>

              <Switch>
                <Match when={formData().type === ASSIGNMENT_TYPE.ESSAY}>
                  <EssaySection
                    formData={formData}
                    setFormData={setFormData}
                    visible={visible}
                  />
                </Match>

                <Match when={formData().type === ASSIGNMENT_TYPE.QUIZ}>
                  <QuizSection
                    formData={formData}
                    setFormData={setFormData}
                    visible={visible}
                  />
                </Match>
              </Switch>
            </div>

            <div class="w-full md:w-1/3 bg-white border rounded-xl p-6 m-6 mt-0 md:m-0 md:border-t-0 md:rounded-none space-y-4">
              <div class="space-y-2">
                <label>Hạn làm</label>
                <input
                  type="datetime-local"
                  value={formData().dueDate}
                  onInput={e => updateFormData('dueDate', e.target.value)}
                  class="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div class="space-y-2">
                <label>Loại bài tập</label>
                <Select
                  value={formData().type}
                  onChange={e => updateFormData('type', e.target.value)}
                  class="py-1">
                  <option value={ASSIGNMENT_TYPE.ESSAY}>Tự luận</option>
                  <option value={ASSIGNMENT_TYPE.QUIZ}>Trắc nghiệm</option>
                </Select>
              </div>

              <div class="space-y-2">
                <label>Thời lượng (phút)</label>
                <input
                  type="number"
                  placeholder="Nhập thời lượng"
                  value={formData().duration}
                  onInput={e => updateFormData('duration', e.target.value)}
                  class="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div class="space-y-2">
                <input
                  type="checkbox"
                  checked={formData().isGraded}
                  onChange={e => updateFormData('isGraded', e.target.checked)}
                  class="mr-2"
                />
                <span>Chấm điểm bài tập này</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default FormPopup;
