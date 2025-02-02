import { ASSIGNMENT_TYPE } from '@/constants';
import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { FileBlock, useDialog } from '@/shared/components';
import { useScrollToAnchor } from '@/shared/hooks';
import { formatDate } from '@/shared/utils';
import { AiOutlineEdit, AiOutlineEye } from 'solid-icons/ai';
import { FaSolidAngleDown, FaSolidAngleUp } from 'solid-icons/fa';
import { FiClipboard, FiMenu } from 'solid-icons/fi';
import { RiSystemDeleteBinLine } from 'solid-icons/ri';
import { VsAdd } from 'solid-icons/vs';
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
  Suspense,
} from 'solid-js';
import CategoryPopup from './CategoryPopup';
import FormPopup from './FormPopup';
import QuizSubmissionViewingPopup from './QuizSubmissionViewingPopup';
import SubmissionPopup from './SubmissionPopup';
import TaskPopup from './TaskPopup';

const getCategories = async classroomId => {
  if (!classroomId) return [];
  try {
    const data = await api.get('assignment/category', {
      params: { classroomId },
    });
    return data;
  } catch (error) {
    return [];
  }
};

function Assignment() {
  const {
    classroom,
    assignments,
    setAssignments,
    refetchAssignments,
    isOwner,
  } = useClassroom();
  const { scrollToAnchor } = useScrollToAnchor();
  const { showDialog } = useDialog();
  const [categories, { mutate: setCategories, refetch: refetchCategories }] =
    createResource(() => classroom().id, getCategories, {
      initialValue: [],
    });
  const [assignmentViewing, setAssignmentViewing] = createSignal(null);
  const [isPopupOpen, setIsPopupOpen] = createSignal(false);
  const [isTaskOpen, setIsTaskOpen] = createSignal(false);
  const [isSubmissionPopupOpen, setIsSubmissionPopupOpen] = createSignal(false);
  const [isSubmissionViewing, setIsSubmissionViewing] = createSignal(false);
  const [categoryViewing, setCategoryViewing] = createSignal(null);
  const [isCategoryViewing, setIsCategoryViewing] = createSignal(false);
  const [collapsedCategories, setCollapsedCategories] = createSignal([]);
  const [isTableOfContentsOpened, setIsTableOfContentsOpened] =
    createSignal(false);

  createEffect(() => {
    if (assignments()) {
      scrollToAnchor();
    }
  });

  createEffect(() => {
    if (categories()) {
      scrollToAnchor();
    }
  });

  createEffect(() => {
    setCollapsedCategories(
      categories().map(c => ({ id: c.id, collapsed: false })),
    );
  });

  const handleCreateAssignment = () => {
    setAssignmentViewing(null);
    setIsPopupOpen(true);
  };

  const handleEditAssignment = assignment => {
    setAssignmentViewing(assignment);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setAssignmentViewing(null);
    setIsPopupOpen(false);
  };

  const openSubmissionPopup = assignment => {
    setAssignmentViewing(assignment);
    setIsSubmissionPopupOpen(true);
  };

  const closeSubmissionPopup = () => {
    setAssignmentViewing(null);
    setIsSubmissionPopupOpen(false);
  };

  const handleDeleteAssignment = assignmentId => {
    showDialog({
      type: 'confirm',
      text: 'Bạn có muốn xoá bài tập này không?',
      async onConfirm() {
        try {
          await api.post(`assignment/${assignmentId}/delete`);
          setAssignments(prev => prev.filter(a => a.id !== assignmentId));
        } catch (error) {}
      },
    });
  };

  const handleDoAssignment = assignment => {
    setAssignmentViewing(assignment);
    setIsTaskOpen(true);
  };

  const closeTaskPopup = () => {
    setAssignmentViewing(null);
    setIsTaskOpen(false);
  };

  const openSubmissionDetail = assignment => {
    setAssignmentViewing(assignment);
    setIsSubmissionViewing(true);
  };

  const closeSubmissionDetail = () => {
    setAssignmentViewing(null);
    setIsSubmissionViewing(null);
  };

  const handleCreateCategory = () => {
    setCategoryViewing(null);
    setIsCategoryViewing(true);
  };

  const handleEditCategory = category => {
    setCategoryViewing(category);
    setIsCategoryViewing(true);
  };

  const closeCategoryPopup = () => {
    setCategoryViewing(null);
    setIsCategoryViewing(false);
  };

  const handleDeleteCategory = categoryId => {
    showDialog({
      type: 'confirm',
      text: 'Bạn có muốn xoá đầu mục này không?',
      async onConfirm() {
        try {
          await api.post(`assignment/category/${categoryId}/delete`);
          refetchCategories();
          refetchAssignments();
        } catch (error) {}
      },
    });
  };

  const CategoryItem = ({ category }) => {
    const toggleCategory = () => {
      setCollapsedCategories(prev =>
        prev.map(c =>
          c.id == category.id ? { ...c, collapsed: !c.collapsed } : c,
        ),
      );
    };

    const isCollapsed = () =>
      collapsedCategories().find(c => c.id == category.id)?.collapsed;

    return (
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <p class="flex-1 font-semibold text-xl break-words">
            {category.title}
          </p>
          <button onClick={toggleCategory}>
            {isCollapsed() ? <FaSolidAngleDown /> : <FaSolidAngleUp />}
          </button>
          <Show when={isOwner()}>
            <div class="flex items-center space-x-2 ml-4">
              <button
                onClick={() => handleEditCategory(category)}
                class="flex items-center text-blue-600">
                <AiOutlineEdit class="text-xl mr-2" />
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                class="flex items-center text-red-600">
                <RiSystemDeleteBinLine class="text-lg mr-2" />
              </button>
            </div>
          </Show>
        </div>
        <div
          class={`ml-6 space-y-4 collapsible ${
            isCollapsed() ? 'collapsed' : 'expanded'
          }`}>
          <For each={assignments()}>
            {assignment => (
              <Show when={assignment.categoryId == category.id}>
                <AssignmentItem assignment={assignment} />
              </Show>
            )}
          </For>
        </div>
      </div>
    );
  };

  const AssignmentItem = ({ assignment }) => {
    const submission = assignment.submissions[0];
    const isSubmitted = !!submission;

    return (
      <div id={assignment.id} class="bg-white p-4 rounded-lg space-y-4">
        <div class="flex space-x-2">
          <div class="flex flex-1">
            <FiClipboard class="mr-2 mt-1 text-blue-600" />
            <p class="font-semibold break-words">{assignment.title}</p>
          </div>
          <Show when={assignment.dueDate && (isOwner() || !isSubmitted)}>
            <span class="text-red-600 text-sm">
              Hạn cuối:{' '}
              {formatDate(assignment.dueDate) == 'Hôm nay'
                ? formatDate(assignment.dueDate, 'HH:mm', true)
                : formatDate(assignment.dueDate, 'DD-MM-YYYY', true)}
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
          {assignment.type === ASSIGNMENT_TYPE.QUIZ ? 'Trắc nghiệm' : 'Tự luận'}
        </p>

        <Show when={assignment.description}>
          <p>{assignment.description}</p>
        </Show>

        <Show when={assignment.files.length}>
          <div>
            <p class="font-semibold mb-2">Đính kèm:</p>
            <div class="flex flex-wrap gap-4">
              <For each={assignment.files}>
                {file => <FileBlock file={file} />}
              </For>
            </div>
          </div>
        </Show>

        <Show when={isOwner()}>
          <div class="flex justify-between space-x-4">
            <div class="flex space-x-4">
              <button
                onClick={() => handleEditAssignment(assignment)}
                class="flex items-center text-blue-600">
                <AiOutlineEdit class="text-xl mr-2" />
                Sửa
              </button>
              <button
                onClick={() => handleDeleteAssignment(assignment.id)}
                class="flex items-center text-red-600">
                <RiSystemDeleteBinLine class="text-lg mr-2" />
                Xóa
              </button>
            </div>
            <button
              onClick={() => openSubmissionPopup(assignment)}
              class="flex items-center text-blue-600">
              <AiOutlineEye class="text-xl mr-2" />
              Danh sách nộp
            </button>
          </div>
        </Show>

        <Show when={!isOwner()}>
          <Show when={!isSubmitted}>
            <button
              onClick={() => handleDoAssignment(assignment)}
              class="text-blue-600 hover:underline">
              {assignment.type === ASSIGNMENT_TYPE.QUIZ ? 'Làm bài' : 'Nộp bài'}
            </button>
          </Show>
          <Show when={isSubmitted}>
            <Show when={assignment.type == ASSIGNMENT_TYPE.QUIZ}>
              <button
                onClick={() => openSubmissionDetail(assignment)}
                class="text-blue-600 hover:underline">
                Bài làm
              </button>
            </Show>
            <Show when={assignment.type == ASSIGNMENT_TYPE.ESSAY}>
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

  const TableOfContents = () => {
    return (
      <Show when={assignments().length || categories().length}>
        <div
          class={`hidden lg:block sticky top-6 h-fit rounded-lg max-w-xs space-y-2 transition-all duration-300 ${
            isTableOfContentsOpened() ? 'flex-1 p-4 bg-white shadow' : ''
          } ${isOwner() ? 'mt-14' : ''}`}>
          <div class="flex justify-end items-center">
            <Show when={isTableOfContentsOpened()}>
              <p class="font-bold text-xl flex-1">Mục lục</p>
            </Show>
            <button
              class={`p-2 bg-white rounded-full ${
                isTableOfContentsOpened()
                  ? ''
                  : 'border border-gray-200 shadow-md'
              }`}
              onClick={() => setIsTableOfContentsOpened(prev => !prev)}>
              <FiMenu class="text-xl" />
            </button>
          </div>
          <Show when={isTableOfContentsOpened()}>
            <div class="ml-2 space-y-2 max-h-[90vh] overflow-auto">
              <div class="space-y-2">
                <For each={categories()}>
                  {category => (
                    <div>
                      <a class="text-lg font-semibold">{category.title}</a>
                      <div class="space-y-2">
                        <For each={assignments()}>
                          {assignment => (
                            <Show when={assignment.categoryId == category.id}>
                              <div>
                                <a
                                  href={`#${assignment.id}`}
                                  class="ml-2 break-words hover:underline">
                                  {assignment.title}
                                </a>
                              </div>
                            </Show>
                          )}
                        </For>
                      </div>
                    </div>
                  )}
                </For>
              </div>
              <div class="space-y-2">
                <For each={assignments()}>
                  {assignment => (
                    <Show when={!assignment.category}>
                      <div>
                        <a
                          href={`#${assignment.id}`}
                          class="break-words hover:underline">
                          {assignment.title}
                        </a>
                      </div>
                    </Show>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </div>
      </Show>
    );
  };

  return (
    <div class="flex-grow bg-gray-100 p-6">
      <Suspense
        fallback={
          <div class="max-w-screen-md mx-auto h-[70vh] rounded-xl animate-skeleton" />
        }>
        <div class="flex justify-center space-x-4">
          <TableOfContents />
          <div class="flex-1">
            <div class="max-w-screen-md mx-auto">
              <div class="flex items-center space-x-4">
                <Show when={isOwner()}>
                  <button
                    onClick={handleCreateAssignment}
                    class="flex items-center bg-blue-500 text-white px-4 py-2 mb-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out">
                    <VsAdd class="mr-2" />
                    Tạo mới
                  </button>
                </Show>
                <Show when={isOwner()}>
                  <button
                    onClick={handleCreateCategory}
                    class="flex items-center bg-white text-blue-500 px-4 py-2 mb-4 rounded-lg shadow-md border hover:border-blue-500 transition duration-300 ease-in-out">
                    <VsAdd class="mr-2" />
                    Thêm đầu mục
                  </button>
                </Show>
              </div>
              <Show
                when={assignments().length || categories().length}
                fallback={
                  <p class="bg-white border p-6 rounded-xl text-gray-500 text-xl text-center py-6">
                    Không có bài tập nào
                  </p>
                }>
                <div class="space-y-4">
                  <div class="space-y-4">
                    <For each={categories()}>
                      {category => <CategoryItem category={category} />}
                    </For>
                  </div>
                  <div class="space-y-4">
                    <For each={assignments()}>
                      {assignment => (
                        <Show when={!assignment.category}>
                          <AssignmentItem assignment={assignment} />
                        </Show>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
            </div>
          </div>
        </div>

        <Show when={isOwner()}>
          <FormPopup
            onClose={closePopup}
            visible={isPopupOpen}
            assignment={assignmentViewing}
            categories={categories}
          />
          <SubmissionPopup
            onClose={closeSubmissionPopup}
            visible={isSubmissionPopupOpen}
            assignment={assignmentViewing}
            setAssignment={setAssignmentViewing}
          />
          <CategoryPopup
            onClose={closeCategoryPopup}
            visible={isCategoryViewing}
            category={categoryViewing}
            setCategories={setCategories}
          />
        </Show>

        <Show when={!isOwner()}>
          <TaskPopup
            onClose={closeTaskPopup}
            visible={isTaskOpen}
            assignment={assignmentViewing}
          />

          <QuizSubmissionViewingPopup
            onClose={closeSubmissionDetail}
            visible={isSubmissionViewing}
            assignment={assignmentViewing}
            submission={() => assignmentViewing()?.submissions[0]}
          />
        </Show>
      </Suspense>
    </div>
  );
}

export default Assignment;
