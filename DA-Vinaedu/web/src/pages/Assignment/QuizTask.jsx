import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { useDialog } from '@/shared/components';
import { FiClipboard } from 'solid-icons/fi';
import { createSignal, For } from 'solid-js';

function QuizTask({ assignment, onClose }) {
  const { classroom, refetchAssignments } = useClassroom();
  const [loading, setLoading] = createSignal(false);
  const [questions, setQuestions] = createSignal(
    assignment().questions.map(q => ({
      id: q.id,
      answers: [],
    })),
  );
  const { showDialog } = useDialog();

  const hasAnswer = i => questions()[i].answers.length > 0;

  const scrollToQuestion = i => {
    document
      .getElementById(`question-${i}`)
      .scrollIntoView({ behavior: 'smooth' });
  };

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
        const body = {
          classroomId: classroom().id,
          assignmentId: assignment().id,
          answers: questions().map(q => ({
            questionId: q.id,
            answerIds: q.answers,
          })),
        };
        try {
          await api.post('submission/quiz', body);
          refetchAssignments();
          onClose();
        } catch (error) {}
        setLoading(false);
      },
    });
  };

  return (
    <div class="w-screen h-screen overflow-auto flex flex-col">
      <div class="flex-grow flex flex-col bg-gray-100">
        <div class="bg-white flex items-center justify-between p-4 border-b">
          <div class="flex items-center space-x-2">
            <div class="bg-blue-100 p-2 rounded-full">
              <FiClipboard class="text-blue-600 text-xl" />
            </div>
            <h2 class="text-2xl font-bold">{assignment().title}</h2>
          </div>
        </div>

        <div class="flex flex-wrap flex-grow">
          <div class="w-full md:w-1/4 md:h-screen bg-white p-6 border border-t-0 md:sticky top-0 space-y-4 overflow-auto">
            <h3 class="text-lg font-semibold">Danh sách câu hỏi</h3>
            <div class="flex flex-wrap gap-2">
              <For each={assignment().questions}>
                {(question, index) => (
                  <button
                    onClick={() => scrollToQuestion(index())}
                    class={`w-10 h-10 flex items-center justify-center rounded ${
                      hasAnswer(index())
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}>
                    {index() + 1}
                  </button>
                )}
              </For>
            </div>
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
          </div>

          <div class="w-full md:w-3/4 space-y-6 p-6">
            <For each={assignment().questions}>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizTask;
