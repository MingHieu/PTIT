import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { Popup } from '@/shared/components';
import { formatDate, formatTime } from '@/shared/utils';
import { VsClose } from 'solid-icons/vs';
import { createEffect, createSignal, For, Show } from 'solid-js';

function LessonDetailPopup({ visible, onClose, lesson }) {
  const { students } = useClassroom();
  const [sortedStudents, setSortedStudents] = createSignal([]);
  const [studentsJoinedNumber, setStudentJoinedNumber] = createSignal(0);

  createEffect(() => {
    if (lesson()) {
      const joined = students().filter(s =>
        lesson().attendances.some(a => a.studentId === s.id && a.checkInAt),
      );
      const notJoined = students().filter(
        s => !joined.some(j => j.id === s.id),
      );
      setStudentJoinedNumber(joined.length);
      setSortedStudents([...notJoined, ...joined]);
    }
  });

  const getCommentDisplay = attendance => {
    if (!attendance?.comment) return '--';

    const formattedTime =
      formatDate(attendance.commentTime) === 'Hôm nay'
        ? formatDate(attendance.commentTime, 'HH:mm', true)
        : formatDate(attendance.commentTime, 'DD-MM-YYYY, HH:mm', true);

    return `${attendance.comment} - ${formattedTime}`;
  };

  const StudentTable = () => (
    <div class="my-6 overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-2 px-4 text-center w-16">STT</th>
            <th class="py-2 px-4 text-left">Tên</th>
            <th class="py-2 px-4 text-left">Email</th>
            <th class="py-2 px-4 text-left">Giờ vào</th>
            <th class="py-2 px-4 text-left">Giờ ra</th>
            <th class="py-2 px-4 text-left w-1/3">Lời nhắn</th>
          </tr>
        </thead>
        <tbody>
          <For each={sortedStudents()}>
            {(student, index) => {
              const attendance = lesson().attendances.find(
                a => a.studentId === student.id,
              );
              return (
                <tr classList={{ 'border-b': students.length != index() + 1 }}>
                  <td class="py-2 px-4 text-center">{index() + 1}</td>
                  <td class="py-2 px-4">{student.name ?? '--'}</td>
                  <td class="py-2 px-4">{student.email}</td>
                  <td class="py-2 px-4">
                    {attendance?.checkInAt
                      ? formatTime(attendance.checkInAt)
                      : '--'}
                  </td>
                  <td class="py-2 px-4">
                    {attendance?.checkOutAt
                      ? formatTime(attendance.checkOutAt)
                      : '--'}
                  </td>
                  <td class="py-2 px-4">{getCommentDisplay(attendance)}</td>
                </tr>
              );
            }}
          </For>
        </tbody>
      </table>
    </div>
  );

  return (
    <Popup visible={visible} onClose={onClose}>
      <div class="p-6 w-screen max-w-screen-lg">
        <div class="relative bg-white rounded-lg p-6 max-h-[90vh] overflow-auto">
          <h2 class="text-xl font-semibold">
            Danh sách tham gia
            {sortedStudents().length
              ? `: ${studentsJoinedNumber()} / ${students().length}`
              : ''}
          </h2>
          <button onClick={onClose} class="absolute top-5 right-5">
            <VsClose class="w-7 h-7" />
          </button>
          <Show
            when={sortedStudents().length}
            fallback={
              <p class="text-gray-500 text-xl text-center py-6">
                Chưa có học sinh nào tham gia lớp học.
              </p>
            }>
            <StudentTable />
          </Show>
        </div>
      </div>
    </Popup>
  );
}

export default LessonDetailPopup;
