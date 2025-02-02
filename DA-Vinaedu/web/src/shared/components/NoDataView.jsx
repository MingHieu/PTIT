export function NoDataView({ text = 'Không có dữ liệu' }) {
  return (
    <div class="flex flex-col items-center justify-center text-center">
      <img src="/images/bg-no-data.svg" alt="No Data" class="mb-4 w-56 h-56" />
      <h2 class="text-xl font-semibold text-gray-700 mb-2">{text}</h2>
    </div>
  );
}
