import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { useDialog } from '@/shared/components';
import { formatDate, formatTime } from '@/shared/utils';
import { A, useNavigate } from '@solidjs/router';
import moment from 'moment';
import { BiRegularCopy } from 'solid-icons/bi';
import { CgLogOut } from 'solid-icons/cg';
import {
  FiClipboard,
  FiFileText,
  FiFolder,
  FiSettings,
  FiUsers,
} from 'solid-icons/fi';
import { createSignal, For, Show, Suspense } from 'solid-js';
import toast from 'solid-toast';

function StudentView() {
  const navigate = useNavigate();
  const { classroom, lessons, assignments, exams, materials } = useClassroom();
  const inviteLink = () =>
    `${window.location.origin}/classroom/invite?id=${classroom().id}`;
  const { showDialog } = useDialog();
  const [loading, setLoading] = createSignal(false);

  const lessonsThisWeek = () => {
    const startOfWeek = moment().startOf('isoWeek');
    const endOfWeek = moment().endOf('isoWeek');

    return lessons().filter(lesson => {
      const lessonStart = moment(lesson.start);
      return lessonStart.isBetween(startOfWeek, endOfWeek, null, '[]');
    });
  };

  const renderBanner = () => {
    return (
      <Show
        when={classroom().banner}
        fallback={
          <div class="bg-blue-500 text-white p-6 rounded-xl mb-6 text-center">
            <h1 class="text-2xl font-bold">Chào mừng quay trở lại lớp học</h1>
            <p class="mt-2">
              Hãy cập nhật thông tin về lớp học, bài tập, kiểm tra và tài liệu ở
              đây!
            </p>
          </div>
        }>
        <img
          src={classroom().banner}
          class="w-full h-60 mb-6 object-cover rounded"
        />
      </Show>
    );
  };

  const renderItems = (title, href, items, Icon, iconColor) => {
    const Item = ({ item }) => {
      const submission = item.submissions?.[0];
      const isSubmitted = !!submission;

      return (
        <li>
          <A
            href={href}
            class="flex justify-between items-center py-2 rounded hover:bg-blue-50">
            <div class="flex items-center overflow-hidden">
              <Icon class={`mr-2 ${iconColor}`} />
              <span class="font-semibold break-words overflow-wrap break-word max-w-xs">
                {item.title}
              </span>
            </div>
            <Show when={item.dueDate && !isSubmitted}>
              <span class="text-red-600 text-sm">
                Hạn cuối:{' '}
                {formatDate(item.dueDate) == 'Hôm nay'
                  ? formatDate(item.dueDate, 'HH:mm', true)
                  : formatDate(item.dueDate, 'DD-MM-YYYY', true)}
              </span>
            </Show>
            <Show when={isSubmitted}>
              <span class="text-green-600 text-sm">
                {submission.grade
                  ? `Điểm: ${submission.grade.formatFloat()}`
                  : 'Đã nộp'}
              </span>
            </Show>
          </A>
        </li>
      );
    };

    return (
      <Suspense fallback={<div class="h-40 rounded-xl animate-skeleton" />}>
        <div class="bg-white border p-6 rounded-xl">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-xl font-bold">{title}</h2>
            <A
              href={href}
              class="text-blue-600 hover:underline flex items-center">
              Xem thêm
            </A>
          </div>

          <Show
            when={items().length}
            fallback={
              <p class="text-gray-500 text-xl text-center py-6">
                Không có {title.toLowerCase()} nào
              </p>
            }>
            <ul>
              <For each={items().slice(0, 3)}>
                {item => <Item item={item} />}
              </For>
            </ul>
          </Show>
        </div>
      </Suspense>
    );
  };

  const renderLessons = () => {
    return (
      <Suspense fallback={<div class="h-40 rounded-xl animate-skeleton" />}>
        <div class="bg-white border p-6 rounded-xl">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Buổi học</h2>
            <A
              href="lesson"
              class="text-blue-600 hover:underline flex items-center">
              Xem thêm
            </A>
          </div>

          <Show
            when={lessonsThisWeek().length}
            fallback={
              <p class="text-gray-500 text-xl text-center py-6">
                Không có buổi học nào trong tuần này
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
                    <th class="py-2 px-4 text-center">Tham gia</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={lessonsThisWeek()}>
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
                          onClick={() => navigate('lesson')}
                          class={`cursor-pointer hover:bg-blue-50 ${
                            lessonsThisWeek().length == index() + 1
                              ? ''
                              : 'border-b'
                          }`}>
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
                          <td class="py-2 px-4 text-center">
                            0/{classroom().students}
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
      </Suspense>
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink());
    toast.success('Đã sao chép liên kết mời vào bộ nhớ tạm!', {
      position: 'top-center',
    });
  };

  const leaveClassroom = () => {
    showDialog({
      type: 'confirm',
      text: 'Bạn có muốn rời khỏi lớp học không?',
      async onConfirm() {
        setLoading(true);
        try {
          await api.post(
            `student/delete`,
            {},
            { params: { classroomId: classroom().id } },
          );
          window.location.href = '/classroom';
        } catch (error) {}
        setLoading(false);
      },
    });
  };

  const renderInfo = () => {
    return (
      <Suspense fallback={<div class="h-60 rounded-xl animate-skeleton" />}>
        <div class="bg-white border p-6 rounded-xl">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-xl font-bold">Thông tin lớp học</h2>
            <A
              href="student-info"
              class="text-gray-500 hover:text-gray-700 focus:outline-none">
              <FiSettings class="w-5 h-5" />
            </A>
          </div>
          <div class="space-y-4">
            <p class="font-semibold">Tên: {classroom().name}</p>
            <p class="font-semibold">
              Mô tả: {classroom().description || '--'}
            </p>
            <div class="flex">
              <p class="font-semibold">Học viên: {classroom().students}</p>
              <FiUsers class="w-4 h-4 ml-2 mt-[2px]" />
            </div>
            <p class="font-semibold">
              Truy cập: {classroom().isPrivate ? 'Riêng tư' : 'Công khai'}
            </p>
            <div class="flex items-center space-x-2">
              <p class="font-semibold">Trạng thái:</p>
              <div
                class={`text-xs font-bold py-1 px-2 rounded ${
                  classroom().status == 'ACTIVE'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                {classroom().status == 'ACTIVE'
                  ? 'Đang hoạt động'
                  : 'Hoàn thành'}
              </div>
            </div>
            <div class="flex space-x-2">
              <p class="font-semibold">Tham gia lớp:</p>
              <p class="flex-1 text-gray-700 break-all">{inviteLink()}</p>
              <button
                onClick={handleCopyLink}
                class="text-blue-600 hover:text-blue-700 focus:outline-none">
                <BiRegularCopy class="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={leaveClassroom}
              class={`flex items-center ${
                loading()
                  ? 'cursor-not-allowed text-gray-600'
                  : 'text-red-600 hover:text-red-700'
              }`}
              disabled={loading()}>
              <CgLogOut class="text-2xl mr-2" />
              Rời khỏi lớp học
            </button>
          </div>
        </div>
      </Suspense>
    );
  };

  return (
    <div class="flex-grow bg-gray-100 p-6">
      <div class="max-w-screen-xl mx-auto">
        {renderBanner()}
        <div class="flex flex-row flex-wrap">
          <div class="w-full lg:w-2/3 lg:pr-3 space-y-6">
            {renderLessons()}
            {renderInfo()}
          </div>

          <div class="w-full mt-6 lg:mt-0 lg:w-1/3 lg:pl-3 space-y-6">
            {renderItems(
              'Bài tập',
              'assignment',
              assignments,
              FiClipboard,
              'text-blue-600',
            )}
            {renderItems('Kiểm tra', 'exam', exams, FiFileText, 'text-red-600')}
            {renderItems(
              'Tài liệu',
              'material',
              materials,
              FiFolder,
              'text-yellow-500',
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentView;
