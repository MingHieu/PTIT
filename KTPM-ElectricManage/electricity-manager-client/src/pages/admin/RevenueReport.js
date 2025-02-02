import { Card } from 'flowbite-react';

const RevenueReport = () => {
  return (
    <>
      <div className="max-w-sm mx-auto mb-5">
        <Card href="revenue-report/monthly">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Thống kê doanh thu theo tháng
          </h5>
        </Card>
      </div>
      <div className="max-w-sm mx-auto mb-5">
        <Card href="revenue-report/quarterly">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Thống kê doanh thu theo quý
          </h5>
        </Card>
      </div>
      <div className="max-w-sm mx-auto mb-5">
        <Card href="revenue-report/annual">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Thống kê doanh thu theo năm
          </h5>
        </Card>
      </div>
    </>
  );
};

export default RevenueReport;
