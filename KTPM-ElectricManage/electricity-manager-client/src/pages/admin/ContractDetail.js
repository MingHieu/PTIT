import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'flowbite-react';
import { ApiService } from '../../services/api.service';
import { WORKFLOW_SERVICE } from '../../config/api';

const ContractDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const { customerId } = useParams();

  useEffect(() => {
    ApiService({ url: `${WORKFLOW_SERVICE}/contract/${id}` })
      .then(setData)
      .catch(console.error);
  }, []);

  const submit = (approved) => {
    ApiService({
      url: `${WORKFLOW_SERVICE}/contract/${id}/approve`,
      method: 'POST',
      body: {
        approved,
      },
    })
      .then(() => navigate('/admin/customer-management/' + customerId))
      .catch(console.error);
  };

  return (
    <Card className="max-w-sm mx-auto">
      <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Chi tiết hợp đồng
      </h5>
      <div className="mb-4">
        <span className="text-gray-700">Tên hợp đồng: </span>
        <span className="font-semibold">Hợp đồng dịch vụ điện</span>
      </div>
      <div className="mb-4">
        <span className="text-gray-700">Mã Căn Hộ: </span>
        <span className="font-semibold">{data.apartmentId}</span>
      </div>
      <div className="mb-4">
        <span className="text-gray-700">Dịch Vụ Đăng Ký: </span>
        <span className="font-semibold">{data.electricityService?.name}</span>
      </div>
      <div className="mb-4">
        <span className="text-gray-700">Ngày Tạo: </span>
        <span className="font-semibold">
          {new Date(data.createdAt).toLocaleDateString('vi')}
        </span>
      </div>
      {data.status !== 'PENDING' && (
        <div className="mb-4">
          <span className="text-gray-700">Số điện bắt đầu: </span>
          <span className="font-semibold">{data.electricityUsageNumber}</span>
        </div>
      )}
      <div className="mb-4 items-center">
        <span className="text-gray-700">Trạng Thái: </span>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            data.status === 'PENDING'
              ? 'text-yellow-700 bg-yellow-200'
              : data.status === 'IN_PROGRESS'
              ? 'text-green-700 bg-green-200'
              : data.status === 'REJECTED' || data.status === 'ENDED'
              ? 'text-red-700 bg-red-200'
              : ''
          }`}
        >
          {data.status === 'PENDING'
            ? 'Đang chờ duyệt'
            : data.status === 'IN_PROGRESS'
            ? 'Đang hiệu lực'
            : data.status === 'REJECTED'
            ? 'Từ chối'
            : data.status === 'ENDED'
            ? 'Hết hiệu lực'
            : ''}
        </span>
      </div>
      {data.status === 'PENDING' && (
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => submit(false)}
            class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Từ chối
          </button>
          <button
            onClick={() => submit(true)}
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Phê duyệt
          </button>
        </div>
      )}
    </Card>
  );
};

export default ContractDetail;
