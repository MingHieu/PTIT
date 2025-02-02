import { Popover } from '@/shared/components';
import { AiOutlineInfoCircle } from 'solid-icons/ai';
import { TbUpload } from 'solid-icons/tb';
import { createEffect, createSignal, For } from 'solid-js';
import * as XLSX from 'xlsx';

function QuizSection({ formData, setFormData, visible }) {
  const [popoverVisible, setPopoverVisible] = createSignal(false);
  const [popoverPosition, setPopoverPosition] = createSignal({
    top: '0px',
    left: '0px',
  });
  let fileInputRef;

  createEffect(() => {
    if (visible()) {
      if (fileInputRef) {
        fileInputRef.value = '';
      }
    }
  });

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const questions = json.slice(1).map(row => {
          const questionText = row[0];
          const answers = row
            .slice(1, row.length - 1)
            .filter(Boolean)
            .map((answerText, index) => ({
              title: answerText,
              correct: row[row.length - 1]
                .toString()
                .split(',')
                .includes((index + 1).toString()),
            }));

          return {
            title: questionText,
            answers,
          };
        });

        setFormData(prev => ({ ...prev, questions, isQuestionChanged: true }));
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const showImportInstruction = event => {
    const button = event.currentTarget;
    const { top, left, height } = button.getBoundingClientRect();
    setPopoverPosition({
      top: `${top + height + window.scrollY}px`,
      left: `${left}px`,
    });
    setPopoverVisible(true);
  };

  const downloadSampleFile = () => {
    const link = document.createElement('a');
    link.href = '/raw/sample_quiz_questions.xlsx';
    link.download = 'sample_quiz_questions.xlsx';
    link.click();
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          title: '',
          answers: [{ title: '', correct: false }],
        },
      ],
      isQuestionChanged: true,
    }));
  };

  const updateQuestion = (index, key, value) => {
    setFormData(prev => {
      const updatedQuestions = prev.questions.map((q, i) =>
        i === index ? { ...q, [key]: value } : q,
      );
      return { ...prev, questions: updatedQuestions, isQuestionChanged: true };
    });
  };

  const deleteQuestion = index => {
    setFormData(prev => {
      const updatedQuestions = prev.questions.filter((_, i) => i !== index);
      return { ...prev, questions: updatedQuestions, isQuestionChanged: true };
    });
  };

  const addAnswer = questionIndex => {
    setFormData(prev => {
      const updatedQuestions = prev.questions.map((q, i) =>
        i === questionIndex
          ? { ...q, answers: [...q.answers, { title: '', correct: false }] }
          : q,
      );
      return { ...prev, questions: updatedQuestions, isQuestionChanged: true };
    });
  };

  const updateAnswer = (questionIndex, answerIndex, key, value) => {
    setFormData(prev => {
      const updatedQuestions = prev.questions.map((q, i) => {
        if (i === questionIndex) {
          const updatedAnswers = q.answers.map((a, j) =>
            j === answerIndex ? { ...a, [key]: value } : a,
          );
          return { ...q, answers: updatedAnswers };
        }
        return q;
      });
      return { ...prev, questions: updatedQuestions, isQuestionChanged: true };
    });
  };

  const deleteAnswer = (questionIndex, answerIndex) => {
    setFormData(prev => {
      const updatedQuestions = prev.questions.map((q, i) => {
        if (i === questionIndex) {
          const updatedAnswers = q.answers.filter((_, j) => j !== answerIndex);
          return { ...q, answers: updatedAnswers };
        }
        return q;
      });
      return { ...prev, questions: updatedQuestions, isQuestionChanged: true };
    });
  };

  return (
    <div class="bg-white border rounded-xl p-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold mb-4">Danh sách câu hỏi</h2>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            class="hidden"
            id="file-upload"
          />
          <div class="flex items-center space-x-4 mb-2">
            <label
              for="file-upload"
              class="flex items-center text-sm font-semibold cursor-pointer">
              <TbUpload class="text-xl mr-2" />
              Tải lên
            </label>
            <button onClick={showImportInstruction}>
              <AiOutlineInfoCircle class="text-blue-600 text-xl" />
            </button>
          </div>
        </div>
      </div>

      <Popover
        visible={popoverVisible}
        position={popoverPosition}
        onClose={() => setPopoverVisible(false)}>
        <p>Nhập danh sách câu hỏi từ excel</p>
        <button onClick={downloadSampleFile} class="text-blue-600 underline">
          Lấy file mẫu
        </button>
      </Popover>

      <For each={formData().questions}>
        {(question, qIndex) => (
          <div class="mb-6 border-b pb-4 relative">
            <input
              type="text"
              placeholder="Câu hỏi"
              value={question.title}
              onBlur={e => updateQuestion(qIndex(), 'title', e.target.value)}
              class="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <For each={question.answers}>
              {(answer, aIndex) => (
                <div class="flex items-center mb-2 space-x-2 relative">
                  <span>{aIndex() + 1}.</span>
                  <input
                    type="text"
                    placeholder="Đáp án"
                    value={answer.title}
                    onBlur={e =>
                      updateAnswer(qIndex(), aIndex(), 'title', e.target.value)
                    }
                    class="flex-1 p-2 border border-gray-300 rounded"
                  />
                  <label class="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={answer.correct}
                      onChange={e =>
                        updateAnswer(
                          qIndex(),
                          aIndex(),
                          'correct',
                          e.target.checked,
                        )
                      }
                    />
                    <span>Đúng</span>
                  </label>

                  <button
                    onClick={() => deleteAnswer(qIndex(), aIndex())}
                    class="text-red-600 hover:text-red-600 ml-2">
                    Xóa
                  </button>
                </div>
              )}
            </For>
            <div class="flex items-center gap-4 mt-4">
              <button
                onClick={() => addAnswer(qIndex())}
                class="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                Thêm đáp án
              </button>

              <button
                onClick={() => deleteQuestion(qIndex())}
                class="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Xóa câu hỏi
              </button>
            </div>
          </div>
        )}
      </For>

      <button
        onClick={addQuestion}
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Thêm câu hỏi
      </button>
    </div>
  );
}

export default QuizSection;
