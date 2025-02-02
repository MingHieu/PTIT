import { ASSIGNMENT_TYPE } from '@/constants';
import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { FileBlock, Popup } from '@/shared/components';
import { formatDate } from '@/shared/utils';
import { AiOutlineCheck, AiOutlineEdit, AiOutlineEye } from 'solid-icons/ai';
import { VsClose } from 'solid-icons/vs';
import { createSignal, For, Show } from 'solid-js';
import QuizSubmissionViewingPopup from './QuizSubmissionViewingPopup';

function SubmissionPopup({ onClose, visible, exam, setExam }) {
  const { students, setExams } = useClassroom();
  const [submissionViewing, setSubmissionViewing] = createSignal(null);
  const [loading, setLoading] = createSignal(false);
  const [isEditingGrade, setIsEditingGrade] = createSignal(false);
  const [isEditingFeedback, setIsEditingFeedback] = createSignal(false);
  const [isViewingSubmission, setIsViewingSubmission] = createSignal(false);

  const handleEditGrade = submission => {
    setSubmissionViewing(submission);
    setIsEditingGrade(true);
    setIsEditingFeedback(false);
  };

  const handleEditFeedback = submission => {
    setSubmissionViewing(submission);
    setIsEditingGrade(false);
    setIsEditingFeedback(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const body = {
        grade: +submissionViewing().grade,
        feedback: submissionViewing().feedback,
      };
      await api.post(`submission/${submissionViewing().id}/score`, body);
      setExam(prev => ({
        ...prev,
        submissions: prev.submissions.map(s =>
          s.id == submissionViewing().id ? { ...s, ...body } : s,
        ),
      }));
      setExams(prev => prev.map(a => (a.id == exam().id ? exam() : a)));
      setSubmissionViewing(null);
      setIsEditingGrade(false);
      setIsEditingFeedback(false);
    } catch (error) {}
    setLoading(false);
  };

  const handleCancel = () => {
    setSubmissionViewing(null);
    setIsEditingGrade(false);
    setIsEditingFeedback(false);
  };

  const openSubmissionDetail = submission => {
    setSubmissionViewing(submission);
    setIsViewingSubmission(true);
    setIsEditingGrade(false);
    setIsEditingFeedback(false);
  };

  const closeSubmissionDetail = () => {
    setSubmissionViewing(null);
    setIsViewingSubmission(false);
  };

  return (
    <>
      <Popup onClose={onClose} visible={visible}>
        <div
          class={`p-6 w-screen ${
            exam()?.submissions.length ? 'max-w-screen-xl' : 'max-w-screen-md'
          }`}>
          <div class="relative bg-white rounded-lg p-6 max-h-[90vh] overflow-auto">
            <h2 class="text-lg font-bold mb-4">Danh sách nộp bài</h2>
            <button onClick={onClose} class="absolute top-5 right-5">
              <VsClose class="w-7 h-7" />
            </button>
            <div class="overflow-x-auto">
              <Show
                when={exam()?.submissions.length}
                fallback={
                  <p class="text-gray-500 text-xl text-center py-6">
                    Chưa có bài nộp nào
                  </p>
                }>
                <table class="min-w-full">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="px-4 py-2 text-center w-12">STT</th>
                      <th class="px-4 py-2 text-left w-48">Họ và tên</th>
                      <th class="px-4 py-2 text-left w-64">Email</th>
                      <th class="px-4 py-2 text-center w-96">Thời gian nộp</th>
                      <th class="px-4 py-2 text-center w-24">Bài nộp</th>
                      <th class="px-4 py-2 text-center w-24">Điểm</th>
                      <th class="px-4 py-2 text-left w-[30%]">Phản hồi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={exam().submissions}>
                      {(submission, index) => {
                        const student = students().find(
                          s => s.id == submission.studentId,
                        );
                        const isEditGrade = () =>
                          isEditingGrade() &&
                          submissionViewing()?.id == submission.id;
                        const isEditFeedback = () =>
                          isEditingFeedback() &&
                          submissionViewing()?.id == submission.id;

                        return (
                          <tr
                            class={`${
                              exam().submissions.length == index() + 1
                                ? ''
                                : 'border-b'
                            }`}>
                            <td class="px-4 py-2 text-center">{index() + 1}</td>
                            <td class="px-4 py-2 text-left">
                              {student.name || '--'}
                            </td>
                            <td class="px-4 py-2 text-left">
                              {student.email || '--'}
                            </td>
                            <td class="px-4 py-2 text-center">
                              {formatDate(
                                submission.createdAt,
                                'DD-MM-YYYY, HH:mm',
                                true,
                              )}
                            </td>
                            <td class="px-4 py-2 text-center">
                              {exam().type == ASSIGNMENT_TYPE.ESSAY ? (
                                <FileBlock file={submission.file} />
                              ) : (
                                <div class="flex justify-center items-center">
                                  <button
                                    onClick={() =>
                                      openSubmissionDetail(submission)
                                    }>
                                    <AiOutlineEye class="text-xl text-blue-600" />
                                  </button>
                                </div>
                              )}
                            </td>
                            <td class="px-4 py-2 text-center">
                              <div
                                class={`flex justify-center items-center ${
                                  isEditGrade()
                                    ? 'flex-col space-y-2'
                                    : 'space-x-2'
                                }`}>
                                <Show when={!isEditGrade()}>
                                  <p>
                                    {submission.grade?.formatFloat() ?? '--'}
                                  </p>
                                  <button
                                    onClick={() => handleEditGrade(submission)}
                                    disabled={loading()}
                                    class={`${
                                      loading()
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-blue-600 hover:text-blue-700'
                                    }`}>
                                    <AiOutlineEdit class="text-xl" />
                                  </button>
                                </Show>
                                <Show when={isEditGrade()}>
                                  <input
                                    type="number"
                                    class="border rounded px-2 py-1 w-full"
                                    value={submission.grade ?? ''}
                                    onInput={e =>
                                      setSubmissionViewing(prev => ({
                                        ...prev,
                                        grade: e.target.value,
                                      }))
                                    }
                                    disabled={loading()}
                                  />
                                  <div class="flex space-x-4">
                                    <button
                                      onClick={handleSave}
                                      disabled={loading()}
                                      class={`${
                                        loading()
                                          ? 'text-gray-400 cursor-not-allowed'
                                          : 'text-green-600 hover:text-green-700'
                                      }`}>
                                      <AiOutlineCheck />
                                    </button>
                                    <button
                                      onClick={handleCancel}
                                      disabled={loading()}
                                      class={`${
                                        loading()
                                          ? 'text-gray-400 cursor-not-allowed'
                                          : 'text-red-600 hover:text-red-700'
                                      }`}>
                                      <VsClose class="text-xl" />
                                    </button>
                                  </div>
                                </Show>
                              </div>
                            </td>
                            <td class="px-4 py-2 text-left">
                              <div
                                class={`flex items-center ${
                                  isEditFeedback()
                                    ? 'flex-col space-y-2'
                                    : 'space-x-2'
                                }`}>
                                <Show when={!isEditFeedback()}>
                                  <p>{submission.feedback || '--'}</p>
                                  <button
                                    onClick={() =>
                                      handleEditFeedback(submission)
                                    }
                                    disabled={loading()}
                                    class={`${
                                      loading()
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-blue-600 hover:text-blue-700'
                                    }`}>
                                    <AiOutlineEdit class="text-xl" />
                                  </button>
                                </Show>
                                <Show when={isEditFeedback()}>
                                  <textarea
                                    class="border rounded px-2 py-1 w-full"
                                    rows="2"
                                    value={submission.feedback ?? ''}
                                    onInput={e =>
                                      setSubmissionViewing(prev => ({
                                        ...prev,
                                        feedback: e.target.value,
                                      }))
                                    }
                                    disabled={loading()}
                                  />
                                  <div class="flex space-x-4">
                                    <button
                                      onClick={handleSave}
                                      disabled={loading()}
                                      class={`${
                                        loading()
                                          ? 'text-gray-400 cursor-not-allowed'
                                          : 'text-green-600 hover:text-green-700'
                                      }`}>
                                      <AiOutlineCheck />
                                    </button>
                                    <button
                                      onClick={handleCancel}
                                      disabled={loading()}
                                      class={`${
                                        loading()
                                          ? 'text-gray-400 cursor-not-allowed'
                                          : 'text-red-600 hover:text-red-700'
                                      }`}>
                                      <VsClose class="text-xl" />
                                    </button>
                                  </div>
                                </Show>
                              </div>
                            </td>
                          </tr>
                        );
                      }}
                    </For>
                  </tbody>
                </table>
              </Show>
            </div>
          </div>
        </div>
      </Popup>

      <QuizSubmissionViewingPopup
        onClose={closeSubmissionDetail}
        visible={isViewingSubmission}
        exam={exam}
        submission={submissionViewing}
      />
    </>
  );
}

export default SubmissionPopup;
