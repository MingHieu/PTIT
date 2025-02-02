import api from '@/core/api';
import { useDialog } from '@/shared/components';
import { createSignal } from 'solid-js';
import { useInteract } from '.';

function QuizOption({ interactData, onClose }) {
  const { showGrade } = useInteract();
  const [loading, setLoading] = createSignal(false);
  const [questions, setQuestions] = createSignal(
    interactData.data.questions.map(q => ({
      id: q.id,
      answers: [],
    })),
  );
  const { showDialog } = useDialog();

  const updateAnswer = (qIndex, aId, checked) => {
    setQuestions(prev =>
      prev.map((q, i) =>
        i == qIndex
          ? {
              ...q,
              answers: checked
                ? [...q.answers, aId]
                : q.answers.filter(id => id != aId),
            }
          : q,
      ),
    );
  };

  const handleSubmit = () => {
    showDialog({
      type: 'confirm',
      text: 'Bạn có muốn nộp bài không?',
      async onConfirm() {
        setLoading(true);
        try {
          const data = await api.post(
            `meeting/interact/${interactData.id}/submit`,
            {
              answers: questions().map(q => ({
                questionId: q.id,
                answerIds: q.answers,
              })),
            },
          );
          showGrade(data.data.grade);
          onClose();
        } catch (error) {}
        setLoading(false);
      },
    });
  };

  return (
    <div class="p-6 w-screen max-w-screen-md">
      <div class="max-h-[80vh] bg-gray-100 rounded-lg p-4 overflow-y-auto space-y-6">
        <div class="space-y-6 ">
          <For each={interactData.data.questions}>
            {(question, qIndex) => (
              <div
                id={`question-${qIndex()}`}
                class="p-4 border-b bg-white rounded-lg">
                <p class="text-lg font-semibold mb-2">
                  Câu {qIndex() + 1}: {question.title}
                </p>

                <For each={question.answers}>
                  {answer => (
                    <label class="flex items-center mb-2 space-x-2">
                      <input
                        type="checkbox"
                        checked={questions()[qIndex()].answers.includes(
                          answer.id,
                        )}
                        onChange={e =>
                          updateAnswer(qIndex(), answer.id, e.target.checked)
                        }
                      />
                      <span>{answer.title}</span>
                    </label>
                  )}
                </For>
              </div>
            )}
          </For>
          <div class="flex justify-end space-x-2">
            <button
              onClick={handleSubmit}
              class={`px-4 py-2 rounded ${
                loading()
                  ? 'text-gray-600 bg-gray-300 cursor-not-allowed'
                  : 'text-white bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={loading()}>
              Nộp bài
            </button>
            <button class="ml-2 text-gray-700" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizOption;
