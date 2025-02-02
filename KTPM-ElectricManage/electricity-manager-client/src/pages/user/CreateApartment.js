import { Link, useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api.service';
import { WORKFLOW_SERVICE } from '../../config/api';
import { useContext } from 'react';
import { AppContext } from '../../App';

const CreateApartment = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  const submit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const body = {
      name: formData.get('name'),
      address: formData.get('address'),
      area: Number(formData.get('area')),
      ownerId: user.id,
    };
    console.log(body);
    ApiService({
      url: `${WORKFLOW_SERVICE}/apartment/create`,
      method: 'POST',
      body,
    })
      .then(() => {
        navigate('/apartment');
      })
      .catch(console.error);
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="max-w-md mx-auto bg-white rounded-md p-8 shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Thêm căn hộ</h1>
        <form onSubmit={submit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="area"
              className="block text-sm font-medium text-gray-700"
            >
              Diện tích
            </label>
            <input
              type="text"
              id="area"
              name="area"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="flex justify-between">
            <Link to={`/apartment`}>
              <button
                type="button"
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Quay lại
              </button>
            </Link>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateApartment;
