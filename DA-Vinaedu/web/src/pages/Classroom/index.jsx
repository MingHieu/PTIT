import api from '@/core/api';
import { useAuth } from '@/shared/hooks';
import { FiSearch } from 'solid-icons/fi';
import { createResource, createSignal, For, Suspense } from 'solid-js';
import ClassBlock from './ClassBlock';
import CreateClassPopup from './CreateClassPopup';

const getClasses = async () => {
  try {
    const data = await api.get('classroom');
    return data;
  } catch (error) {
    return [];
  }
};

function Classroom() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = createSignal('');
  const [isFocused, setIsFocused] = createSignal(false);
  const [classes, { refetch: refetchClasses }] = createResource(getClasses, {
    initialValue: [],
  });
  const [isPopupVisible, setIsPopupVisible] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const filterClasses = () =>
    classes().filter(cls =>
      cls.name.toLowerCase().includes(searchTerm().toLowerCase()),
    );

  const addNewClass = async newClass => {
    await api.post('classroom', newClass);
    await refetchClasses();
  };

  return (
    <div>
      <div class="flex flex-wrap justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div
          class={`flex items-center p-2 w-full sm:w-1/2 md:w-1/3 border rounded ${
            isFocused() ? 'border-blue-600' : 'border-gray-300'
          }`}>
          <FiSearch class="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Tìm kiếm lớp học..."
            value={searchTerm()}
            onInput={e => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            class="w-full bg-transparent outline-none"
          />
        </div>

        <button
          class={`px-4 py-2 rounded-lg transition-shadow shadow-lg ${
            !user().isVerify
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:bg-blue-600'
          }`}
          onClick={() => setIsPopupVisible(true)}
          disabled={!user().isVerify}>
          Tạo mới
        </button>
      </div>

      <div class="mb-6 border-b-2 border-gray-300"></div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        <Suspense
          fallback={
            <For each={[...Array(20)]}>
              {() => (
                <div
                  class="h-44 rounded-lg animate-skeleton"
                  style={{ aspectRatio: '288/162' }}
                />
              )}
            </For>
          }>
          <For each={filterClasses()}>
            {cls => <ClassBlock classInfo={cls} />}
          </For>
        </Suspense>
      </div>

      <CreateClassPopup
        onClose={() => setIsPopupVisible(false)}
        onCreate={addNewClass}
        visible={isPopupVisible}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
}

export default Classroom;
