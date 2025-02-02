import { useEffect, useState } from 'react';
import { FaFileContract, FaMoneyBillWave, FaUserCircle } from 'react-icons/fa';
import { MdOutlineApartment } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { ApiService } from '../../services/api.service';
import { AUTH_SERVICE, WORKFLOW_SERVICE } from '../../config/api';

const Invoice = ({ data }) => {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="px-6 py-4">
        {new Date(data.createdAt).toLocaleString('vi')}
      </td>
      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {data.services.map((service, index) => (
          <div key={index}>
            {`${service.name} - ${service.usage} số`}
            <br />
            {'('}
            {service.prices.map((price, idx) => (
              <span key={idx}>
                {`${price.fromValue} - ${price.toValue || '...'} : ${
                  price.price
                } VNĐ`}
                {idx !== service.prices.length - 1 && <br />}
              </span>
            ))}
            {')'}
          </div>
        ))}
      </td>
      <td className="px-6 py-4">{data.total} VNĐ</td>
    </tr>
  );
};

const InvoiceList = ({ data }) => {
  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            Ngày Tạo
          </th>
          <th scope="col" className="px-6 py-3">
            Dịch Vụ Sử Dụng
          </th>
          <th scope="col" className="px-6 py-3">
            Tổng Tiền
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <Invoice data={item} key={index} />
        ))}
      </tbody>
    </table>
  );
};

const ApartmentList = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {data.map((apartment) => (
        <Link to={`apartment/${apartment.id}`}>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/300"
              alt="Apartment"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="font-bold text-xl mb-2">{apartment.name}</h2>
              <p className="text-gray-600 mb-2">Địa chỉ: {apartment.address}</p>
              <p className="text-gray-600 mb-2">
                Diện tích: {apartment.area}m²
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

const Contract = ({ data }) => {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="px-6 py-4">
        <Link to={`contract/${data.id}`}>#{data.id}</Link>
      </td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white "
      >
        <Link to={`contract/${data.id}`}>{data.name}</Link>
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

const ContractList = ({ data }) => {
  return (
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
        {data.map((item, index) => (
          <Contract data={item} />
        ))}
      </tbody>
    </table>
  );
};

const PersonalInfo = ({ data }) => {
  return (
    <div className="space-y-4">
      <p>
        <span className="font-semibold">Name:</span> {data.name}
      </p>
      <p>
        <span className="font-semibold">Email:</span> {data.email}
      </p>
      <p>
        <span className="font-semibold">Phone:</span> {data.phoneNumber}
      </p>
    </div>
  );
};

const CustomerDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('personal');
  const [customer, setCustomer] = useState({});
  const [apartments, setApartments] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    ApiService({
      url: `${AUTH_SERVICE}/customer/${id}`,
    })
      .then(setCustomer)
      .catch(console.error);

    ApiService({
      url: `${WORKFLOW_SERVICE}/apartment/all`,
      queryParams: { ownerId: id },
    })
      .then(setApartments)
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!apartments.length) {
      return;
    }

    Promise.all(
      apartments.map((apartment) =>
        ApiService({
          url: `${WORKFLOW_SERVICE}/contract/all`,
          queryParams: { apartmentId: apartment.id },
        })
      )
    )
      .then((contractsList) => contractsList.flat())
      .then((c) => setContracts(c.reverse()))
      .catch(console.error);
  }, [apartments]);

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-md">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            <li className="me-2">
              <button
                onClick={() => setActiveTab('personal')}
                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                  activeTab === 'personal'
                    ? 'text-blue-600 border-blue-600'
                    : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <FaUserCircle size={20} className="mr-2" />
                Thông tin cá nhân
              </button>
            </li>
            <li className="me-2">
              <button
                onClick={() => setActiveTab('apartment')}
                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                  activeTab === 'apartment'
                    ? 'text-blue-600 border-blue-600'
                    : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <MdOutlineApartment size={20} className="mr-2" />
                Căn hộ
              </button>
            </li>
            <li className="me-2">
              <button
                onClick={() => setActiveTab('contract')}
                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                  activeTab === 'contract'
                    ? 'text-blue-600 border-blue-600'
                    : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <FaFileContract size={18} className="mr-2" />
                Hợp đồng
              </button>
            </li>
            <li className="me-2">
              <button
                onClick={() => setActiveTab('invoice')}
                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                  activeTab === 'invoice'
                    ? 'text-blue-600 border-blue-600'
                    : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <FaMoneyBillWave size={18} className="mr-2" />
                Hoá đơn
              </button>
            </li>
          </ul>
        </div>

        <div className="p-4">
          {activeTab === 'personal' && <PersonalInfo data={customer} />}
          {activeTab === 'apartment' && <ApartmentList data={apartments} />}
          {activeTab === 'contract' && <ContractList data={contracts} />}
          {activeTab === 'invoice' && <InvoiceList data={invoices} />}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
