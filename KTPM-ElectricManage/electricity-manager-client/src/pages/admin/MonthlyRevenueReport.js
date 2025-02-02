import { useRef, useState } from 'react';
import { Bar, getElementsAtEvent } from 'react-chartjs-2';
import { ApiService } from '../../services/api.service';
import { WORKFLOW_SERVICE } from '../../config/api';
import { currencyFormatter } from '../../utils/format';
import { useNavigate } from 'react-router-dom';

const MonthlyRevenueReport = () => {
  const chartRef = useRef();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [invoicesByMonth, setInvoicesByMonth] = useState([]);
  const [invoicesShown, setInvoicesShown] = useState(null);

  const data = {
    labels: Array.from({ length: 12 }, (_, index) => `Tháng ${index + 1}`),
    datasets: [
      {
        label: 'Doanh thu theo tháng',
        data:
          invoicesByMonth.map((invoices) =>
            invoices.reduce((prev, curr) => prev + curr.invoice.total, 0)
          ) || Array(12).fill(0),
        backgroundColor: 'rgb(255, 99, 132,.2)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
    ],
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleViewClick = async () => {
    console.log('View data for year:', selectedYear);
    setInvoicesShown(null);
    const data = await ApiService({
      url: `${WORKFLOW_SERVICE}/report/revenue/monthly`,
      queryParams: {
        year: selectedYear,
      },
    });
    setInvoicesByMonth(data);
  };

  const handleChartClick = (event) => {
    setInvoicesShown(getElementsAtEvent(chartRef.current, event)[0]?.index);
  };

  const Invoice = ({ data, index }) => {
    const navigate = useNavigate();

    const showDetail = () => {
      navigate('/admin/invoice', { state: { invoice: data } });
    };

    return (
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className="px-6 py-4" onClick={showDetail}>
          {index + 1}
        </td>
        <td className="px-6 py-4">{data.customer.name}</td>
        <td className="px-6 py-4">#{data.apartment.id}</td>
        <td className="px-6 py-4">
          {new Date(data.invoice.fromDate).toLocaleDateString('vi')}
        </td>
        <td className="px-6 py-4">
          {new Date(data.invoice.toDate).toLocaleDateString('vi')}
        </td>
        <td className="px-6 py-4">{currencyFormatter.format(data.invoice.total)}</td>
      </tr>
    );
  };

  const renderInvoices = () => {
    if (typeof invoicesShown !== 'number') return;

    return (
      <div className="mt-5">
        <h2 className="text-2xl font-bold mb-4">Doanh sách hoá đơn</h2>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                STT
              </th>
              <th scope="col" className="px-6 py-3">
                Tên khách hàng
              </th>
              <th scope="col" className="px-6 py-3">
                Căn hộ
              </th>
              <th scope="col" className="px-6 py-3">
                Từ ngày
              </th>
              <th scope="col" className="px-6 py-3">
                Đến ngày
              </th>
              <th scope="col" className="px-6 py-3">
                Tổng Tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {invoicesByMonth[invoicesShown]?.map((item, index) => (
              <Invoice data={item} key={index} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Doanh thu theo tháng</h2>
      <div className="flex mb-5">
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="mr-5 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>

        <button
          onClick={handleViewClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Xem
        </button>
      </div>
      <Bar ref={chartRef} data={data} onClick={handleChartClick} />
      {renderInvoices()}
    </>
  );
};

export default MonthlyRevenueReport;
