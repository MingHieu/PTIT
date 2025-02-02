import { MEETING_INTERACT_TYPE } from '@/constants/meeting';
import api from '@/core/api';
import { formatTime } from '@/shared/utils';
import { AiOutlineEye, AiOutlineReload } from 'solid-icons/ai';
import { FaRegularClock } from 'solid-icons/fa';
import { VsClose } from 'solid-icons/vs';
import { createResource, createSignal, For, Show } from 'solid-js';
import { useMeeting } from '..';

const getInteracts = async lessonId => {
  try {
    const data = await api.get('meeting/interact', {
      params: { lessonId },
    });
    return data;
  } catch (error) {
    return [];
  }
};

const getInteractSubmissions = async ({ interactId, lessonId }) => {
  if (!interactId) return [];
  try {
    const data = await api.get(`meeting/interact/${interactId}/submission`, {
      params: { lessonId },
    });
    return data;
  } catch (error) {
    return [];
  }
};

function History() {
  const { lesson, students } = useMeeting();
  const [interacts] = createResource(() => lesson().id, getInteracts, {
    initialValue: [],
  });
  const [interactViewing, setInteractViewing] = createSignal(false);
  const [submissions, { refetch: refetchSubmissions }] = createResource(
    () => ({ lessonId: lesson().id, interactId: interactViewing()?.id }),
    getInteractSubmissions,
    { initialValue: [] },
  );
  const [submissionViewing, setSubmissionViewing] = createSignal();

  const getInteractTitle = type => {
    if (type == MEETING_INTERACT_TYPE.QUIZ) return 'Câu hỏi';
    return '';
  };

  const InteractItem = ({ interact }) => (
    <div
      onClick={() => setInteractViewing(interact)}
      class="space-y-2 border-b p-4 cursor-pointer">
      <p class="text-lg font-semibold">{getInteractTitle(interact.type)}</p>
      <div class="flex items-center">
        <FaRegularClock class="mr-1" />
        <span class="text-gray-500">{formatTime(interact.createdAt)}</span>
      </div>
    </div>
  );

  const SubmissionItem = ({ submission, index }) => {
    const student = students().find(s => s.userId == submission.userId);

    return (
      <tr class={`${submissions().length == index() + 1 ? '' : 'border-b'}`}>
        <td class="px-4 py-2 text-center">{index() + 1}</td>
        <td class="px-4 py-2 text-left">{student.name || '--'}</td>
        <td class="px-4 py-2 text-left">{student.email || '--'}</td>
        <td class="px-4 py-2 text-center">
          {formatTime(submission.createdAt)}
        </td>
        <td class="px-4 py-2 text-center">
          <div class="flex justify-center items-center">
            <button onClick={() => setSubmissionViewing(submission)}>
              <AiOutlineEye class="text-xl text-blue-600" />
            </button>
          </div>
        </td>
        <td class="px-4 py-2 text-center">
          <p>{submission.data.grade.formatFloat() ?? '--'}</p>
        </td>
      </tr>
    );
  };

  return (
    <Show
      when={interacts().length}
      fallback={
        <p class="text-gray-500 text-xl text-center py-4">
          Chưa có tương tác nào
        </p>
      }>
      <Show when={!interactViewing()}>
        <For each={interacts()}>
          {interact => <InteractItem interact={interact} />}
        </For>
      </Show>
      <Show when={interactViewing()}>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <button onClick={() => setInteractViewing(null)}>
              <VsClose class="text-xl" />
            </button>
            <button onClick={refetchSubmissions} disabled={submissions.loading}>
              <AiOutlineReload />
            </button>
          </div>
          <div class="overflow-x-auto">
            <Show
              when={submissions().length}
              fallback={
                <p class="text-gray-500 text-xl text-center py-4">
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
                  </tr>
                </thead>
                <tbody>
                  <For each={submissions()}>
                    {(submission, index) => (
                      <SubmissionItem submission={submission} index={index} />
                    )}
                  </For>
                </tbody>
              </table>
            </Show>
          </div>
        </div>
      </Show>
    </Show>
  );
}

export default History;
