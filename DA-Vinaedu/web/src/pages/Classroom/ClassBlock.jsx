import { CLASSROOM_STATUS } from '@/constants';
import { formatDate, getRandomGradient } from '@/shared/utils';
import { A } from '@solidjs/router';
import { FaRegularClock } from 'solid-icons/fa';
import { FiUsers } from 'solid-icons/fi';

function ClassBlock({ classInfo }) {
  return (
    <A
      href={classInfo.id}
      class="bg-white rounded-lg border border-gray-300 flex flex-col transition-shadow hover:shadow-lg"
      style={{ aspectRatio: '288/162' }}>
      <div class="relative">
        {classInfo.banner ? (
          <img
            src={classInfo.banner}
            alt={classInfo.name}
            class="h-32 w-full rounded-t-lg object-cover"
          />
        ) : (
          <div
            class="h-32 w-full rounded-t-lg object-cover"
            style={{ background: getRandomGradient() }}
          />
        )}
        <div
          class={`absolute top-2 right-2 text-xs font-bold py-1 px-2 rounded ${
            classInfo.status === CLASSROOM_STATUS.ACTIVE
              ? 'bg-green-50 text-green-700 shadow-md'
              : 'bg-red-50 text-red-700 shadow-md'
          }`}>
          {classInfo.status === CLASSROOM_STATUS.ACTIVE
            ? 'Đang hoạt động'
            : 'Hoàn thành'}
        </div>
      </div>
      <div class="flex flex-col justify-between flex-grow p-4">
        <h3 class="flex-1 text-lg font-semibold overflow-hidden text-ellipsis max-h-[3rem]">
          {classInfo.name}
        </h3>
        <div class="flex justify-between items-center text-gray-600 mt-2 text-sm">
          <div class="flex items-center">
            <FaRegularClock class="mr-1" />
            <span class="text-gray-500">{formatDate(classInfo.createdAt)}</span>
          </div>
          <div class="flex items-center">
            <FiUsers class="mr-1" />
            <span class="text-gray-500">{classInfo.students}</span>
          </div>
        </div>
      </div>
    </A>
  );
}

export default ClassBlock;
