import { ASSIGNMENT_TYPE } from '@/constants';
import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { FileBlock, useDialog } from '@/shared/components';
import { useScrollToAnchor } from '@/shared/hooks';
import { formatDate } from '@/shared/utils';
import { AiOutlineEdit, AiOutlineEye } from 'solid-icons/ai';
import { FiClipboard } from 'solid-icons/fi';
import { RiSystemDeleteBinLine } from 'solid-icons/ri';
import { VsAdd } from 'solid-icons/vs';
import { createEffect, createSignal, For, Show, Suspense } from 'solid-js';
import FormPopup from './FormPopup';
import QuizSubmissionViewingPopup from './QuizSubmissionViewingPopup';
import SubmissionPopup from './SubmissionPopup';
import TaskPopup from './TaskPopup';

function Exam() {
  const { exams, setExams, isOwner } = useClassroom();
  const { scrollToAnchor } = useScrollToAnchor();
  const { showDialog } = useDialog();
  const [examViewing, setExamViewing] = createSignal(null);
  const [isPopupOpen, setIsPopupOpen] = createSignal(false);
  const [isTaskOpen, setIsTaskOpen] = createSignal(false);
  const [isSubmissionPopupOpen, setIsSubmissionPopupOpen] = createSignal(false);
  const [isSubmissionViewing, setIsSubmissionViewing] = createSignal(false);

  createEffect(() => {
    if (exams()) {
      scrollToAnchor();
    }
  });

  const handleCreateExam = () => {
    setExamViewing(null);
    setIsPopupOpen(true);
  };

  const handleEditExam = exam => {
    setExamViewing(exam);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setExamViewing(null);
    setIsPopupOpen(false);
  };

  const openSubmissionPopup = exam => {
    setExamViewing(exam);
    setIsSubmissionPopupOpen(true);
  };

  const closeSubmissionPopup = () => {
    setExamViewing(null);
    setIsSubmissionPopupOpen(false);
  };

  const handleDeleteExam = examId => {
    showDialog({
      type: 'confirm',
      text: 'Bạn có muốn xoá bài kiểm tra này không?',
      async onConfirm() {
        try {
          await api.post(`exam/${examId}/delete`);
          setExams(prev => prev.filter(a => a.id !== examId));
        } catch (error) {}
      },
    });
  };

  const handleDoExam = exam => {
    setExamViewing(exam);
    setIsTaskOpen(true);
  };

  const closeTaskPopup = () => {
    setExamViewing(null);
    setIsTaskOpen(false);
  };

  const openSubmissionDetail = exam => {
    setExamViewing(exam);
    setIsSubmissionViewing(true);
  };

  const closeSubmissionDetail = () => {
    setExamViewing(null);
    setIsSubmissionViewing(null);
  };

  const ExamItem = ({ exam }) => {
    const submission = exam.submissions[0];
    const isSubmitted = !!submission;

    return (
      <div id={exam.id} class="bg-white p-4 rounded-lg space-y-4">
        <div class="flex space-x-2">
          <div class="flex flex-1">
            <FiClipboard class="mr-2 mt-1 text-blue-600" />
            <p class="font-semibold break-words">{exam.title}</p>
          </div>
          <Show when={exam.dueDate && (isOwner() || !isSubmitted)}>
            <span class="text-red-600 text-sm">
              Hạn cuối:{' '}
              {formatDate(exam.dueDate) == 'Hôm nay'
                ? formatDate(exam.dueDate, 'HH:mm', true)
                : formatDate(exam.dueDate, 'DD-MM-YYYY', true)}
            </span>
          </Show>
          <Show when={!isOwner() && isSubmitted}>
            <span class="text-green-600 text-sm">
              {submission.grade
                ? `Điểm: ${submission.grade.formatFloat()}`
                : 'Đã nộp'}
            </span>
          </Show>
        </div>

        <p class="text-sm text-gray-600">
          Hình thức:{' '}
          {exam.type === ASSIGNMENT_TYPE.QUIZ ? 'Trắc nghiệm' : 'Tự luận'}
        </p>

        <Show when={exam.description}>
          <p>{exam.description}</p>
        </Show>

        <Show when={exam.files.length}>
          <div>
            <p class="font-semibold mb-2">Đính kèm:</p>
            <div class="flex flex-wrap gap-4">
              <For each={exam.files}>{file => <FileBlock file={file} />}</For>
            </div>
          </div>
        </Show>

        <Show when={isOwner()}>
          <div class="flex justify-between space-x-4">
            <div class="flex space-x-4">
              <button
                onClick={() => handleEditExam(exam)}
                class="flex items-center text-blue-600">
                <AiOutlineEdit class="text-xl mr-2" />
                Sửa
              </button>
              <button
                onClick={() => handleDeleteExam(exam.id)}
                class="flex items-center text-red-600">
                <RiSystemDeleteBinLine class="text-lg mr-2" />
                Xóa
              </button>
            </div>
            <button
              onClick={() => openSubmissionPopup(exam)}
              class="flex items-center text-blue-600">
              <AiOutlineEye class="text-xl mr-2" />
              Danh sách nộp
            </button>
          </div>
        </Show>

        <Show when={!isOwner()}>
          <Show when={!isSubmitted}>
            <button
              onClick={() => handleDoExam(exam)}
              class="text-blue-600 hover:underline">
              {exam.type === ASSIGNMENT_TYPE.QUIZ ? 'Làm bài' : 'Nộp bài'}
            </button>
          </Show>
          <Show when={isSubmitted}>
            <Show when={exam.type == ASSIGNMENT_TYPE.QUIZ}>
              <button
                onClick={() => openSubmissionDetail(exam)}
                class="text-blue-600 hover:underline">
                Bài làm
              </button>
            </Show>
            <Show when={exam.type == ASSIGNMENT_TYPE.ESSAY}>
              <div class="border-t pt-2">
                <p class="font-semibold mb-2 text-sm">Bài làm:</p>
                <div class="w-fit">
                  <FileBlock file={submission.file} />
                </div>
              </div>
            </Show>
          </Show>
          <Show when={submission?.feedback}>
            <div class="border-t pt-2">
              <p class="font-semibold mb-2 text-sm">Phản hồi:</p>
              <p class="text-sm">{submission.feedback}</p>
            </div>
          </Show>
        </Show>
      </div>
    );
  };

  return (
    <div class="flex-grow bg-gray-100 p-6">
      <Suspense
        fallback={
          <div class="max-w-screen-md mx-auto h-[70vh] rounded-xl animate-skeleton" />
        }>
        <div class="max-w-screen-md mx-auto">
          <Show when={isOwner()}>
            <button
              onClick={handleCreateExam}
              class="flex items-center bg-blue-500 text-white px-4 py-2 mb-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out">
              <VsAdd class="mr-2" />
              Tạo mới
            </button>
          </Show>

          <Show
            when={exams().length}
            fallback={
              <p class="bg-white border p-6 rounded-xl text-gray-500 text-xl text-center py-6">
                Không có bài kiểm tra nào
              </p>
            }>
            <div class="space-y-4">
              <For each={exams()}>{exam => <ExamItem exam={exam} />}</For>
            </div>
          </Show>
        </div>

        <Show when={isOwner()}>
          <FormPopup
            onClose={closePopup}
            visible={isPopupOpen}
            exam={examViewing}
          />
          <SubmissionPopup
            onClose={closeSubmissionPopup}
            visible={isSubmissionPopupOpen}
            exam={examViewing}
            setExam={setExamViewing}
          />
        </Show>

        <Show when={!isOwner()}>
          <TaskPopup
            onClose={closeTaskPopup}
            visible={isTaskOpen}
            exam={examViewing}
          />

          <QuizSubmissionViewingPopup
            onClose={closeSubmissionDetail}
            visible={isSubmissionViewing}
            exam={examViewing}
            submission={() => examViewing()?.submissions[0]}
          />
        </Show>
      </Suspense>
    </div>
  );
}

export default Exam;
