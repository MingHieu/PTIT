import { useContext, useEffect, useState } from 'react';
import { ApiService } from '../../services/api.service';
import { WORKFLOW_SERVICE } from '../../config/api';
import { AppContext } from '../../App';

const Contract = ({ data }) => {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="px-6 py-4">#{data.id}</td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white "
      >
        Hợp đồng dịch vụ điện
      </th>
      <td className="px-6 py-4">{data.apartmentId}</td>
      <td className="px-6 py-4">
        {new Date(data.createdAt).toLocaleDateString('vi')}
      </td>
      <td className="px-6 py-4">
        {data.status === 'PENDING' ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Đang chờ duyệt
          </span>
        ) : data.status === 'IN_PROGRESS' ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Đang hiệu lực
          </span>
        ) : data.status === 'REJECTED' ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Từ chối
          </span>
        ) : data.status === 'ENDED' ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Hết hiệu lực
          </span>
        ) : (
          ''
        )}
      </td>
    </tr>
  );
};

const ContractList = () => {
  const { user } = useContext(AppContext);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    ApiService({
      url: `${WORKFLOW_SERVICE}/apartment/all`,
      queryParams: { ownerId: user.id },
    })
      .then((apartments) => {
        return apartments.map((apartment) =>
          ApiService({
            url: `${WORKFLOW_SERVICE}/contract/all`,
            queryParams: { apartmentId: apartment.id },
          })
        );
      })
      .then((promises) => Promise.all(promises))
      .then((contractsList) => contractsList.flat())
      .then((c) => setContracts(c.reverse()))
      .catch(console.error);
  }, [user]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Danh sách hợp đồng</h1>

      <div className="bg-white shadow-md rounded-lg overflow-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Mã hợp đồng
              </th>
              <th scope="col" className="px-6 py-3">
                Tên hợp đồng
              </th>
              <th scope="col" className="px-6 py-3">
                Căn hộ
              </th>
              <th scope="col" className="px-6 py-3">
                Ngày tạo
              </th>
              <th scope="col" className="px-6 py-3">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((item, index) => (
              <Contract data={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractList;
