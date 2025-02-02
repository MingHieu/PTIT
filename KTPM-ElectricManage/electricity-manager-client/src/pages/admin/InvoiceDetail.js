import { useLocation } from 'react-router-dom';

const InvoiceDetail = () => {
  const { state } = useLocation();
  const { invoice } = state;
  const {
    customer: { name, email, phoneNumber },
    apartment: { address },
    contract,
    electricityService: { name: serviceName },
    invoice: { oldElectricityUsage: oldUsageNumber, newElectricityUsage: newUsageNumber, fromDate, toDate, total },
    prices: invoicePrices,
    taxes,
  } = invoice;
    const prices = invoicePrices.sort((a, b) => a.fromValue - b.fromValue);

  const results = (() => {
    let usageNumber = newUsageNumber - oldUsageNumber;
    return prices.map((price) => {
      if (usageNumber <= 0) {
        return {
          usage: 0,
          cost: 0,
        };
      }
      let range = usageNumber;
      if (price.toValue != null) {
        range = Math.min(usageNumber, price.toValue - price.fromValue);
      }
      const cost = range * price.price;
      usageNumber -= range;
      return {
        usage: range,
        cost,
      };
    });
  })();

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-md">
      <div className="flex justify-between border-b pb-2">
        <h2 className="text-lg font-medium">Hóa đơn tiền điện</h2>
      </div>
      <div className="my-4">
        <h3 className="text-base font-medium mb-1">Thông tin khách hàng</h3>
        <ul className="list-disc ml-4">
          <li>Tên: {name}</li>
          <li>Email: {email}</li>
          <li>Số điện thoại: {phoneNumber}</li>
          <li>Địa chỉ: {address}</li>
          <li>Mã hợp đồng: #{contract.id}</li>
        </ul>
      </div>
      <div className="my-4">
        <h3 className="text-base font-medium mb-1">Thông tin dịch vụ</h3>
        <ul className="list-disc ml-4">
          <li>Dịch vụ: {serviceName}</li>
          <li>Chỉ số cũ: {oldUsageNumber}</li>
          <li>Chỉ số mới: {newUsageNumber}</li>
          <li>Từ ngày: {new Date(fromDate).toLocaleDateString('vi')}</li>
          <li>Đến ngày: {new Date(toDate).toLocaleDateString('vi')}</li>
        </ul>
      </div>
      <div className="my-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left border-b border-gray-200 p-2">Bậc</th>
              <th className="text-left border-b border-gray-200 p-2">Từ</th>
              <th className="text-left border-b border-gray-200 p-2">Đến</th>
              <th className="text-left border-b border-gray-200 p-2">
                Đơn giá
              </th>
              <th className="text-left border-b border-gray-200 p-2">
                Điện năng tiêu thụ
              </th>
              <th className="text-right border-b border-gray-200 p-2">
                Số tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price, index) => (
              <tr key={index}>
                <td className="text-left border-b border-gray-200 p-2">
                  {index + 1}
                </td>
                <td className="text-left border-b border-gray-200 p-2">
                  {price.fromValue}
                </td>
                <td className="text-left border-b border-gray-200 p-2">
                  {price.toValue || '∞'}
                </td>
                <td className="text-left border-b border-gray-200 p-2">
                  {price.price}
                </td>
                <td className="text-left border-b border-gray-200 p-2">
                  {results[index].usage}
                </td>
                <td className="text-right border-b border-gray-200 p-2">
                  {results[index].cost.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </td>
              </tr>
            ))}
            {taxes.map((tax) => (
              <tr className="font-bold">
                <td colSpan={5} className="border-b border-gray-200 p-2">
                  Thuế {tax.name} {tax.value}%
                </td>
                <td className="text-right border-b border-gray-200 p-2">
                  {(
                    (results.reduce((prev, curr) => prev + curr.cost, 0) *
                      tax.value) /
                    100
                  ).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </td>
              </tr>
            ))}
            <tr className="font-bold">
              <td colSpan={5} className="border-b border-gray-200 p-2">
                Tổng
              </td>
              <td className="text-right border-b border-gray-200 p-2">
                {total.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceDetail;
