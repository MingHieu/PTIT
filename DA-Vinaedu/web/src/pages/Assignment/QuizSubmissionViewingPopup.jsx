import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { Popup } from '@/shared/components';
import { VsClose } from 'solid-icons/vs';
import { Show } from 'solid-js';

function QuizSubmissionViewingPopup({
  onClose,
  visible,
  assignment,
  submission,
}) {
  const { isOwner } = useClassroom();

  return (
    <Popup onClose={onClose} visible={visible}>
      <div class="w-screen max-w-screen-sm p-6">
        <div class="max-h-[90vh] overflow-auto bg-gray-100 rounded-lg p-4">
          <div class="flex justify-between items-center mb-2">
            <button onClick={onClose}>
              <VsClose class="w-7 h-7" />
            </button>
            <Show
              when={
                submission()?.grade != null && assignment()?.questions.length
              }>
              <p class="font-semibold text-green-600">
                {(submission().grade * assignment().questions.length) / 10} /{' '}
                {assignment().questions.length}
              </p>
            </Show>
          </div>
          <div class="space-y-4">
            <For each={assignment()?.questions}>
              {(question, qIndex) => (
                <div
                  id={`question-${qIndex()}`}
                  class="p-4 border-b bg-white rounded-lg">
                  <p class="text-lg font-semibold mb-2">
                    Câu {qIndex() + 1}: {question.title}
                  </p>

                  <For each={question.answers}>
                    {answer => {
                      const checked = () =>
                        submission()?.answerIds.includes(answer.id);

                      return (
                        <label
                          class={`flex items-center mb-2 space-x-2 ${
                            isOwner() && answer.correct && checked()
                              ? 'bg-green-200'
                              : ''
                          } ${
                            isOwner() && !answer.correct && checked()
                              ? 'bg-red-200'
                              : ''
                          }`}>
                          <input
                            type="checkbox"
                            checked={checked()}
                            onChange={e =>
                              updateAnswer(
                                qIndex(),
                                answer.id,
                                e.target.checked,
                              )
                            }
                            disabled
                          />
                          <span>{answer.title}</span>
                        </label>
                      );
                    }}
                  </For>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default QuizSubmissionViewingPopup;
