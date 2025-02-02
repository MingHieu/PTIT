import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiService } from '../../services/api.service';
import { WORKFLOW_SERVICE } from '../../config/api';
import { AppContext } from '../../App';

const Apartment = ({ data }) => {
  const { name, address, area } = data;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src="https://via.placeholder.com/300"
        alt="Apartment"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="font-bold text-xl mb-2">{name}</h2>
        <p className="text-gray-600 mb-2">Địa chỉ: {address}</p>
        <p className="text-gray-600 mb-2">Diện tích: {area}m²</p>
      </div>
    </div>
  );
};

const ApartmentList = () => {
  const { user } = useContext(AppContext);
  const [apartmentList, setApartmentList] = useState([]);

  useEffect(() => {
    ApiService({
      url: `${WORKFLOW_SERVICE}/apartment/all`,
      queryParams: { ownerId: user.id },
    })
      .then(setApartmentList)
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold ">Danh sách căn hộ</h1>
        <Link to={'create'}>
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            Thêm
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {apartmentList.map((item) => (
          <Link to={`${item.id}`}>
            <Apartment data={item} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ApartmentList;
