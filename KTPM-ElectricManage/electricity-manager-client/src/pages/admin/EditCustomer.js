import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api.service';
import { AUTH_SERVICE } from '../../config/api';

const EditCustomer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [customerData] = useState(location.state.customer);
  const [editedData, setEditedData] = useState({ ...customerData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Edited data:', editedData);
    ApiService({
      url: `${AUTH_SERVICE}/customer/edit`,
      method: 'POST',
      body: editedData,
    })
      .then(() => {
        alert('Thành công');
        navigate('/admin/customer-management');
      })
      .catch(()=>{
        alert("Thất bại. Vui lòng kiểm tra lại thông tin đã nhập!")
      });
  };

  const handleReset = () => {
    setEditedData({ ...customerData });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-6">Sửa thông tin khách hàng</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="id" className="font-semibold">
              Id:
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={editedData.id}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:ring-blue-200 w-full"
              disabled
              style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
            />
          </div>
          <div>
            <label htmlFor="name" className="font-semibold">
              Tên khách hàng:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedData.name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:ring-blue-200 w-full"
            />
          </div>
          <div>
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedData.email}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:ring-blue-200 w-full"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="font-semibold">
              Số điện thoại:
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={editedData.phoneNumber}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:ring-blue-200 w-full"
            />
          </div>
          <div className="flex justify-between space-x-5">
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 focus:outline-none focus:bg-gray-400 w-1/2"
            >
              Đặt lại
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600 w-1/2"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;
