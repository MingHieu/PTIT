import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { useDialog } from '@/shared/components';
import { formatDate, formatTime } from '@/shared/utils';
import moment from 'moment';
import { AiOutlineEdit, AiOutlineEye } from 'solid-icons/ai';
import { RiSystemDeleteBinLine } from 'solid-icons/ri';
import { VsAdd } from 'solid-icons/vs';
import { createSignal, For, Show, Suspense } from 'solid-js';
import LessonCommentPopup from './LessonCommentPopup';
import LessonDetailPopup from './LessonDetailPopup';
import LessonFormPopup from './LessonFormPopup';

function Lesson() {
  const { lessons, setLessons, isOwner, classroom } = useClassroom();
  const [isFormOpen, setIsFormOpen] = createSignal(false);
  const [editingLesson, setEditingLesson] = createSignal(null);
  const [isDetailOpen, setIsDetailOpen] = createSignal(false);
  const [selectedLesson, setSelectedLesson] = createSignal(null);
  const [isCommentOpen, setIsCommentOpen] = createSignal(false);
  const [selectedLessonForComment, setSelectedLessonForComment] =
    createSignal(null);
  const { showDialog } = useDialog();

  const handleCreateLesson = () => {
    setEditingLesson(null);
    setIsFormOpen(true);
  };

  const handleEditLesson = lesson => {
    setEditingLesson(lesson);
    setIsFormOpen(true);
  };

  const handleDeleteLesson = lessonId => {
    showDialog({
      type: 'confirm',
      text: 'Bạn có muốn xoá tất cả thông tin về buổi học này không?',
      async onConfirm() {
        try {
          await api.post(`lesson/${lessonId}/delete`);
          setLessons(prev => prev.filter(l => l.id !== lessonId));
        } catch (error) {}
      },
    });
  };

  const closeFormPopup = () => {
    setIsFormOpen(false);
    setEditingLesson(null);
  };

  const handleOpenDetails = lesson => {
    setSelectedLesson(lesson);
    setIsDetailOpen(true);
  };

  const closeDetailPopup = () => {
    setIsDetailOpen(false);
    setSelectedLesson(null);
  };

  const handleSendComment = lesson => {
    setSelectedLessonForComment(lesson);
    setIsCommentOpen(true);
  };

  const closeCommentPopup = () => {
    setIsCommentOpen(false);
    setSelectedLessonForComment(null);
  };

  return (
    <div class="flex-grow bg-gray-100 p-6">
      <Suspense
        fallback={
          <div class="max-w-screen-md mx-auto h-[70vh] rounded-xl animate-skeleton" />
        }>
        <div class="max-w-screen-lg mx-auto">
          <Show when={isOwner()}>
            <button
              onClick={handleCreateLesson}
              class="flex items-center bg-blue-500 text-white px-4 py-2 mb-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out">
              <VsAdd class="mr-2" />
              Tạo mới
            </button>
          </Show>

          <div class="bg-white p-6 rounded-xl">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">Buổi học</h2>
            </div>
            <Show
              when={lessons().length}
              fallback={
                <p class="bg-white p-6 rounded-xl text-gray-500 text-xl text-center py-6">
                  Không có buổi học nào
                </p>
              }>
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="py-2 px-4 text-center">STT</th>
                      <th class="py-2 px-4 text-center">Thời gian</th>
                      <th class="py-2 px-4 text-center">Bắt đầu</th>
                      <th class="py-2 px-4 text-center">Kết thúc</th>
                      <th class="py-2 px-4 text-center">Trạng thái</th>
                      <Show when={isOwner()}>
                        <th class="py-2 px-4 text-center">Tham gia</th>
                      </Show>
                      <th class="py-2 px-4 text-left">
                        <Show when={!isOwner()}>Lời nhắn</Show>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={lessons()}>
                      {(lesson, index) => {
                        const now = moment();
                        const start = moment(lesson.start);
                        const end = moment(lesson.end);

                        let status;
                        let statusClasses = '';

                        if (now.isBefore(start)) {
                          status = 'Sắp diễn ra';
                          statusClasses = 'text-gray-500 bg-gray-100';
                        } else if (now.isBetween(start, end, null, '[]')) {
                          status = 'Đang diễn ra';
                          statusClasses = 'text-blue-600 bg-blue-50';
                        } else {
                          status = 'Kết thúc';
                          statusClasses = 'text-red-600 bg-red-50';
                        }

                        return (
                          <tr
                            classList={{
                              'border-b': lessons().length != index() + 1,
                            }}>
                            <td class="py-2 px-4 text-center">{index() + 1}</td>
                            <td class="py-2 px-4 text-center">
                              {formatDate(lesson.start)}
                            </td>
                            <td class="py-2 px-4 text-center">
                              {formatTime(lesson.start)}
                            </td>
                            <td class="py-2 px-4 text-center">
                              {formatTime(lesson.end)}
                            </td>
                            <td class="py-2 px-4 text-center">
                              <span
                                class={`inline-block px-2 py-1 rounded-md text-sm font-semibold w-28 ${statusClasses}`}>
                                {status}
                              </span>
                            </td>
                            <Show when={isOwner()}>
                              <td class="py-2 px-4 text-center">
                                {
                                  lesson.attendances.filter(a => a.checkInAt)
                                    .length
                                }
                                /{classroom().students}
                              </td>
                            </Show>
                            <td
                              class={`py-2 px-4 ${
                                isOwner() ? 'text-center' : 'text-left'
                              }`}>
                              <Show when={isOwner()}>
                                <div class="flex items-center space-x-4">
                                  <button
                                    onClick={() => handleOpenDetails(lesson)}
                                    class="text-blue-600">
                                    <AiOutlineEye class="text-xl mr-2" />
                                  </button>

                                  <button
                                    onClick={() => handleEditLesson(lesson)}
                                    class="text-blue-600 ml-2">
                                    <AiOutlineEdit class="text-xl mr-2" />
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDeleteLesson(lesson.id)
                                    }
                                    class="text-red-600 ml-2">
                                    <RiSystemDeleteBinLine class="text-xl mr-2" />
                                  </button>
                                </div>
                              </Show>
                              <Show when={!isOwner()}>
                                <div class="flex items-center space-x-2">
                                  <Show when={lesson.attendances.length > 0}>
                                    <span>{lesson.attendances[0].comment}</span>
                                  </Show>
                                  <button
                                    onClick={() => handleSendComment(lesson)}
                                    class="text-blue-600 hover:underline">
                                    <AiOutlineEdit class="text-xl" />
                                  </button>
                                </div>
                              </Show>
                            </td>
                          </tr>
                        );
                      }}
                    </For>
                  </tbody>
                </table>
              </div>
            </Show>
          </div>
        </div>

        <LessonFormPopup
          onClose={closeFormPopup}
          visible={isFormOpen}
          lesson={editingLesson}
        />

        <LessonDetailPopup
          visible={isDetailOpen}
          onClose={closeDetailPopup}
          lesson={selectedLesson}
        />

        <LessonCommentPopup
          visible={isCommentOpen}
          onClose={closeCommentPopup}
          lesson={selectedLessonForComment}
        />
      </Suspense>
    </div>
  );
}

export default Lesson;
