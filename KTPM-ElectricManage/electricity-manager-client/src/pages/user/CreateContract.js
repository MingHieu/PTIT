import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api.service';
import { WORKFLOW_SERVICE } from '../../config/api';
import { AppContext } from '../../App';

const CreateContract = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedService, setSelectedService] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    ApiService({
      url: `${WORKFLOW_SERVICE}/apartment/all`,
      queryParams: {
        ownerId: user.id,
      },
    })
      .then(setApartments)
      .catch(console.error);

    ApiService({
      url: `${WORKFLOW_SERVICE}/electricity-service/all`,
      queryParams: {
        name: '',
      },
    })
      .then(setServices)
      .catch(console.error);
  }, [user]);

  const handleSubmit = () => {
    ApiService({
      url: `${WORKFLOW_SERVICE}/contract/create`,
      method: 'POST',
      body: {
        apartmentId: selectedApartment.id,
        electricityServiceId: selectedService.id,
      },
    })
      .then(() => {
        alert('Thành công');
        navigate('/contract');
      })
      .catch(console.error);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Tạo hợp đồng mới</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <p className="mb-2 font-medium">Tên khách hàng: {user.name}</p>
        <p className="mb-2 font-medium">
          Ngày tạo: {new Date().toLocaleDateString('vi')}
        </p>
        <div className="mb-2">
          <label htmlFor="apartment" className="block font-medium mb-2">
            Căn hộ:
          </label>
          <select
            id="apartment"
            name="apartment"
            value={selectedApartment?.id || ''}
            onChange={(e) =>
              setSelectedApartment(
                apartments.find((apt) => apt.id === +e.target.value)
              )
            }
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="">Chọn căn hộ</option>
            {apartments.map((apartment) => (
              <option key={apartment.id} value={apartment.id}>
                {apartment.name} | {apartment.address}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="services" className="block font-medium mb-2">
            Dịch vụ điện:
          </label>
          <select
            id="services"
            name="services"
            value={selectedService?.id || ''}
            onChange={(e) =>
              setSelectedService(
                services.find((service) => service.id === +e.target.value)
              )
            }
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="">Chọn dịch vụ điện</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.id} - {service.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            disabled={!selectedApartment || !selectedService}
          >
            Tạo hợp đồng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateContract;
