import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiService } from '../../services/api.service';
import { WORKFLOW_SERVICE } from '../../config/api';

const ApartmentInfo = ({ apartment }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
      <img
        src="https://via.placeholder.com/800x400"
        alt="Căn hộ"
        className="w-full h-64 object-cover"
      />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Thông tin căn hộ</h1>
        <p className="text-gray-600 mb-2">
          <span className="font-bold">Tên căn hộ:</span> {apartment.name}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-bold">Địa chỉ:</span> {apartment.address}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-bold">Diện tích:</span> {apartment.area}m²
        </p>
      </div>
    </div>
  );
};

const ElectricityServiceItem = ({ data, index }) => {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="px-6 py-4">{index + 1}</td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {data.name}
      </th>
      <td className="px-6 py-4 text-right">
        {data.prices.map((item) => (
          <>
            {item.fromValue +
              ' - ' +
              (item.toValue || '...') +
              ' : ' +
              item.price +
              ' VNĐ'}
            <br />
          </>
        ))}
      </td>
    </tr>
  );
};

const ElectricityServiceUsing = ({ services }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Dịch vụ điện đang sử dụng</h2>

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                STT
              </th>
              <th scope="col" className="px-6 py-3">
                Tên dịch vụ
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Giá tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((item, index) => (
              <ElectricityServiceItem data={item} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ApartmentDetail = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState({});
  const [services, setServices] = useState([]);

  useEffect(() => {
    ApiService({ url: `${WORKFLOW_SERVICE}/apartment/${id}` })
      .then((data) => {
        setApartment(data.apartment);
        if(data.electricityService){
            setServices([data.electricityService] );
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto">
      <ApartmentInfo apartment={apartment} />
      <ElectricityServiceUsing services={services} />
    </div>
  );
};

export default ApartmentDetail;
