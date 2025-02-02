import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { Select } from '@/shared/components';
import { formatDate, formatTime } from '@/shared/utils';
import { createPagination } from '@solid-primitives/pagination';
import { A, useNavigate } from '@solidjs/router';
import moment from 'moment';
import { BiRegularCopy } from 'solid-icons/bi';
import {
  FiClipboard,
  FiFileText,
  FiFolder,
  FiSettings,
  FiUsers,
} from 'solid-icons/fi';
import { createSignal, For, Show, Suspense } from 'solid-js';
import toast from 'solid-toast';

function TeacherView() {
  const navigate = useNavigate();
  const {
    classroom,
    students,
    joinRequests,
    lessons,
    assignments,
    exams,
    materials,
    refetchJoinRequests,
    refetchStudents,
  } = useClassroom();
  const [itemsPerPage, setItemsPerPage] = createSignal(10);
  const pages = () => Math.ceil(students().length / itemsPerPage());
  const [paginationProps, page, setPage] = createPagination(() => ({
    pages: pages(),
    maxPages: 4,
  }));
  const [loading, setLoading] = createSignal(false);
  const inviteLink = () =>
    `${window.location.origin}/classroom/invite?id=${classroom().id}`;

  const paginatedStudents = () => {
    const start = (page() - 1) * itemsPerPage();
    return students().slice(start, start + itemsPerPage());
  };

  const handleItemsPerPageChange = event => {
    setItemsPerPage(Number(event.target.value));
    setPage(1);
  };

  const examGrades = () => {
    const uniqueGrades = new Set();
    students().forEach(student => {
      student.grades.forEach(grade => {
        uniqueGrades.add(grade.name);
      });
    });
    return Array.from(uniqueGrades);
  };

  const overallAssignmentProgress = () =>
    students().reduce((prev, curr) => prev + curr.assignmentProgress, 0) /
    students().length;

  const overallAverageGrade = () =>
    students().reduce((prev, curr) => prev + curr.averageGrade, 0) /
    students().length;

  const getOverallEachAverageGrade = name => {
    let grades = students()
      .map(student => student.grades.find(g => g.name == name))
      .filter(Boolean);
    return (
      grades.reduce((prev, curr) => prev + (curr.value ?? 0), 0) / grades.length
    );
  };

  const lessonsThisWeek = () => {
    const startOfWeek = moment().startOf('isoWeek');
    const endOfWeek = moment().endOf('isoWeek');

    return lessons().filter(lesson => {
      const lessonStart = moment(lesson.start);
      return lessonStart.isBetween(startOfWeek, endOfWeek, null, '[]');
    });
  };

  const renderItems = (title, href, items, Icon, iconColor) => {
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
                {item => (
                  <A href={href} key={item.id}>
                    <li class="flex justify-between items-center py-2 rounded hover:bg-blue-50">
                      <div class="flex items-center overflow-hidden">
                        <Icon class={`mr-2 ${iconColor}`} />
                        <span class="font-semibold break-words overflow-wrap break-word max-w-xs">
                          {item.title}
                        </span>
                      </div>
                      {item.dueDate && (
                        <span class="text-red-600 text-sm ml-2">
                          Hạn cuối:{' '}
                          {formatDate(item.dueDate) == 'Hôm nay'
                            ? formatDate(item.dueDate, 'HH:mm', true)
                            : formatDate(item.dueDate, 'DD-MM-YYYY', true)}
                        </span>
                      )}
                    </li>
                  </A>
                )}
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
                            {lesson.attendances.filter(a => a.checkInAt).length}
                            /{classroom().students}
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

  const renderStudents = () => {
    return (
      <Suspense fallback={<div class="h-96 rounded-xl animate-skeleton" />}>
        <div class="bg-white border p-6 rounded-xl">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-2">
              <h2 class="text-xl font-bold ">Danh sách học viên</h2>
              <Select
                value={itemsPerPage()}
                onChange={handleItemsPerPageChange}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </Select>
            </div>
            <A
              href="student"
              class="text-blue-600 hover:underline flex items-center">
              Xem thêm
            </A>
          </div>

          <div class="overflow-x-auto">
            <Show
              when={students().length}
              fallback={
                <p class="text-gray-500 text-xl text-center py-6">
                  Chưa có học viên nào tham gia lớp học
                </p>
              }>
              <table class="min-w-full">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="py-2 px-4 text-center">STT</th>
                    <th class="py-2 px-4 text-left">Họ và tên</th>
                    <th class="py-2 px-4 text-left">Email</th>
                    <th class="py-2 px-4 text-center">
                      Bài tập hoàn thành (%)
                    </th>
                    <For each={examGrades()}>
                      {name => <th class="py-2 px-4 text-center">{name}</th>}
                    </For>
                    <th class="py-2 px-4 text-center">Trung bình điểm</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={paginatedStudents()}>
                    {(student, index) => (
                      <tr
                        class={`${
                          paginatedStudents().length == index() + 1
                            ? ''
                            : 'border-b'
                        }`}>
                        <td class="py-2 px-4 text-center">
                          {index() + 1 + (page() - 1) * itemsPerPage()}
                        </td>
                        <td class="py-2 px-4">{student.name || '--'}</td>
                        <td class="py-2 px-4">{student.email}</td>
                        <td class="py-2 px-4 text-center">
                          {student.assignmentProgress.formatFloat() * 100}%
                        </td>
                        <For each={examGrades()}>
                          {name => (
                            <td class="py-2 px-4 text-center">
                              {student.grades
                                .find(g => g.name == name)
                                ?.value?.formatFloat() ?? '--'}
                            </td>
                          )}
                        </For>
                        <td class="py-2 px-4 text-center">
                          {student.averageGrade.formatFloat()}
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
                <tfoot>
                  <tr>
                    <th class="py-2 px-4 text-center"></th>
                    <th class="py-2 px-4 text-left"></th>
                    <th class="py-2 px-4 text-right">Trung bình</th>
                    <th class="py-2 px-4 text-center">
                      {overallAssignmentProgress().formatFloat() * 100}%
                    </th>
                    <For each={examGrades()}>
                      {name => (
                        <th class="py-2 px-4 text-center">
                          {getOverallEachAverageGrade(name).formatFloat()}
                        </th>
                      )}
                    </For>
                    <th class="py-2 px-4 text-center">
                      {overallAverageGrade().formatFloat()}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </Show>
          </div>

          <Show when={pages() > 1}>
            <div class="overflow-x-auto space-y-4 mt-4">
              <p class="text-center">
                Trang: {page()} / {pages()}
              </p>
              <nav class="min-w-[500px] flex justify-center items-center space-x-4">
                <For each={paginationProps()}>
                  {props => (
                    <button
                      class={`py-2 px-4 rounded-lg ${
                        props.disabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : props['aria-current']
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      {...props}
                    />
                  )}
                </For>
              </nav>
            </div>
          </Show>
        </div>
      </Suspense>
    );
  };

  const handleJoinRequest = async (requestId, isAccept) => {
    setLoading(true);
    try {
      await api.post(`classroom/${classroom().id}/accept-join`, {
        requestId,
        isAccept,
      });
      refetchJoinRequests();
      refetchStudents();
    } catch (error) {}
    setLoading(false);
  };

  const renderRequests = () => {
    return (
      <Suspense fallback={<div class="h-60 rounded-xl animate-skeleton" />}>
        <div class="bg-white border p-6 rounded-xl">
          <h2 class="text-xl font-bold">Yêu cầu tham gia lớp học</h2>
          <Show
            when={joinRequests().length}
            fallback={
              <p class="text-gray-500 text-xl text-center py-6">
                Chưa có yêu cầu nào.
              </p>
            }>
            <ul class="space-y-4 mt-4">
              <For each={joinRequests()}>
                {(request, index) => (
                  <li class="flex items-center border-b-gray-300">
                    <div class="flex-1 flex items-center space-x-2">
                      <p>{index() + 1}.</p>
                      <p class="break-all">
                        {`${request.user.name || '--'} | ${
                          request.user.email
                        } | ${formatDate(request.createdAt)}`}
                      </p>
                    </div>
                    <div class="flex space-x-4">
                      <button
                        onClick={() => handleJoinRequest(request.id, true)}
                        disabled={loading()}
                        class={`font-medium hover:underline ${
                          loading() ? 'text-gray-400' : 'text-blue-600'
                        }`}>
                        Chấp nhận
                      </button>
                      <button
                        onClick={() => handleJoinRequest(request.id, false)}
                        disabled={loading()}
                        class={`font-medium hover:underline ${
                          loading() ? 'text-gray-400' : 'text-red-600'
                        }`}>
                        Từ chối
                      </button>
                    </div>
                  </li>
                )}
              </For>
            </ul>
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

  const renderInfo = () => {
    return (
      <Suspense fallback={<div class="h-60 rounded-xl animate-skeleton" />}>
        <div class="bg-white border p-6 rounded-xl">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-xl font-bold">Thông tin lớp học</h2>
            <A
              href="settings"
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
          </div>
        </div>
      </Suspense>
    );
  };

  return (
    <div class="flex-grow bg-gray-100 p-6">
      <div class="flex flex-row flex-wrap max-w-screen-2xl mx-auto">
        <div class="w-full lg:w-2/3 lg:pr-3 space-y-6">
          {renderLessons()}
          {renderStudents()}
          {renderRequests()}
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
          {renderInfo()}
        </div>
      </div>
    </div>
  );
}

export default TeacherView;
