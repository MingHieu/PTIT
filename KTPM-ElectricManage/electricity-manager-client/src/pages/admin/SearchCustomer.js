import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiService } from '../../services/api.service';
import { AUTH_SERVICE } from '../../config/api';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

const Customer = ({ data, index }) => {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="px-6 py-4">
        <Link to={`${data.id}`}>{index + 1}</Link>
      </td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        <Link to={`${data.id}`}>{data.name}</Link>
      </th>
      <td className="px-6 py-4">
        <Link to={`${data.id}`}>{data.email}</Link>
      </td>
      <td className="px-6 py-4">
        <Link to={`edit/${data.id}`} state={{ customer: data }}>
          <FaEdit size={20} />
        </Link>
      </td>
      <td className="px-6 py-4">
        <Link to={`#`}>
          <MdOutlineDeleteOutline size={24} color="red" />
        </Link>
      </td>
    </tr>
  );
};

const SearchCustomer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    ApiService({
      url: `${AUTH_SERVICE}/customer/all`,
    })
      .then(setCustomers)
      .catch(console.error);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    console.log('Search for:', searchQuery);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Danh sách khách hàng</h1>

      <div className="flex mb-5">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Tên khách hàng"
          className="mr-5 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          onClick={handleSearchClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Tìm kiếm
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                Email
              </th>
              <th scope="col" className="w-10 px-6 py-3"></th>
              <th scope="col" className="w-10 px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((item, index) => (
              <Customer data={item} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchCustomer;
