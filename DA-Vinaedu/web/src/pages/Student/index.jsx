import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { Select } from '@/shared/components';
import { createPagination } from '@solid-primitives/pagination';
import { FiSearch } from 'solid-icons/fi';
import { VsClose } from 'solid-icons/vs';
import { createSignal, For, Show, Suspense } from 'solid-js';
import * as XLSX from 'xlsx';
import GradeDistributionChart from './GradeDistributionChart';

function Student() {
  const { students, classroom } = useClassroom();
  const [itemsPerPage, setItemsPerPage] = createSignal(10);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [isFocused, setIsFocused] = createSignal(false);
  const [isChartDataViewing, setIsChartDataViewing] = createSignal(false);
  const [chartDataViewing, setChartDataViewing] = createSignal([]);

  const studentsData = () => {
    const data = isChartDataViewing() ? chartDataViewing() : students();
    const filteredData = data.filter(
      student =>
        student.name
          ?.toLowerCase()
          .includes(searchTerm().trim().toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm().trim().toLowerCase()),
    );
    return filteredData;
  };

  const pages = () => Math.ceil(studentsData().length / itemsPerPage());

  const [paginationProps, page, setPage] = createPagination(() => ({
    pages: pages(),
    maxPages: 4,
  }));

  const paginatedStudents = () => {
    const start = (page() - 1) * itemsPerPage();
    return studentsData().slice(start, start + itemsPerPage());
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

  const onSearch = value => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleExportGrade = () => {
    const table = document.querySelector('#table-export');
    if (!table) return;
    let oldValue = {
      itemsPerPage: itemsPerPage(),
      page: page(),
    };
    setItemsPerPage(students().length);
    setPage(1);
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Grades');
    XLSX.writeFile(wb, `Danh sách điểm ${classroom().name}.xlsx`);
    setItemsPerPage(oldValue.itemsPerPage);
    setPage(oldValue.page);
  };

  const ExportTable = () => {
    return (
      <table id="table-export" class="hidden">
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Bài tập hoàn thành (%)</th>
            <For each={examGrades()}>{name => <th>{name}</th>}</For>
          </tr>
        </thead>
        <tbody>
          <For each={students()}>
            {(student, index) => (
              <tr>
                <td>{index() + 1}</td>
                <td>{student.name || '--'}</td>
                <td>{student.email}</td>
                <td>{student.assignmentProgress.formatFloat() * 100}%</td>
                <For each={examGrades()}>
                  {name => (
                    <td>
                      {student.grades
                        .find(g => g.name == name)
                        ?.value?.formatFloat() ?? '--'}
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    );
  };

  const onViewChartData = data => {
    setChartDataViewing(data);
    setIsChartDataViewing(true);
    setPage(1);
  };

  const hideChartDataViewing = () => {
    setIsChartDataViewing(false);
    setChartDataViewing([]);
    setPage(1);
  };

  const StudentList = () => {
    return (
      <div class="space-y-4">
        <div class="flex flex-wrap justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div
            class={`bg-white flex items-center p-2 w-full sm:w-1/2 md:w-1/3 border rounded ${
              isFocused() ? 'border-blue-600' : 'border-gray-300'
            }`}>
            <FiSearch class="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Tìm kiếm học sinh..."
              value={searchTerm()}
              onInput={e => onSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              class="w-full bg-transparent outline-none"
            />
          </div>

          <button
            class="px-4 py-2 rounded-lg transition-shadow shadow-lg bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:bg-blue-600"
            onClick={handleExportGrade}>
            Xuất phiếu điểm
          </button>
        </div>

        <div class="bg-white border p-6 rounded-lg space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">Danh sách học viên</h2>
            <Select value={itemsPerPage()} onChange={handleItemsPerPageChange}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Select>
          </div>

          <Show when={isChartDataViewing()}>
            <div class="flex">
              <Show when={isChartDataViewing()}>
                <div class="flex items-center bg-blue-50 space-x-1 py-1 px-3 rounded-full ">
                  <span class="text-blue-600 text-xs font-semibold">
                    Phân phối điểm
                  </span>
                  <button onClick={hideChartDataViewing}>
                    <VsClose class="text-lg text-blue-600" />
                  </button>
                </div>
              </Show>
            </div>
          </Show>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gray-100">
                  <th class="py-2 px-4 text-center">STT</th>
                  <th class="py-2 px-4 text-left">Họ và tên</th>
                  <th class="py-2 px-4 text-left">Email</th>
                  <th class="py-2 px-4 text-center">Bài tập hoàn thành (%)</th>
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
                  <th class="py-2 px-4 text-right">
                    {isChartDataViewing() ? '' : 'Trung bình'}
                  </th>
                  <th class="py-2 px-4 text-center">
                    {isChartDataViewing()
                      ? ''
                      : overallAssignmentProgress().formatFloat() * 100 + '%'}
                  </th>
                  <For each={examGrades()}>
                    {name => (
                      <th class="py-2 px-4 text-center">
                        {isChartDataViewing()
                          ? ''
                          : getOverallEachAverageGrade(name).formatFloat()}
                      </th>
                    )}
                  </For>
                  <th class="py-2 px-4 text-center">
                    {isChartDataViewing()
                      ? ''
                      : overallAverageGrade().formatFloat()}
                  </th>
                </tr>
              </tfoot>
            </table>
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
      </div>
    );
  };

  return (
    <div class="flex-grow bg-gray-100 p-6">
      <Suspense
        fallback={
          <div class="max-w-screen-xl mx-auto h-[70vh] rounded-xl animate-skeleton" />
        }>
        <Show
          when={students().length}
          fallback={
            <p class="text-gray-500 text-xl text-center p-6 bg-white rounded-lg max-w-screen-md mx-auto mt-4">
              Chưa có học viên nào tham gia lớp học
            </p>
          }>
          <div class="max-w-screen-xl mx-auto space-y-8">
            <Show when={examGrades().length}>
              <GradeDistributionChart onViewChartData={onViewChartData} />
            </Show>
            <StudentList />
            <ExportTable />
          </div>
        </Show>
      </Suspense>
    </div>
  );
}

export default Student;
