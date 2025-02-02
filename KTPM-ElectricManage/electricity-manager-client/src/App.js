import 'flowbite';
import 'flowbite-react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import UserDetail from './pages/user/UserDetail';
import ApartmentList from './pages/user/ApartmentList';
import ContractList from './pages/user/ContractList';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';
import ApartmentDetail from './pages/user/ApartmentDetail';
import CreateContract from './pages/user/CreateContract';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { createContext, useState } from 'react';
import Logout from './pages/auth/Logout';
import CreateApartment from './pages/user/CreateApartment';
import CustomerDetail from './pages/admin/CustomerDetail';
import ContractDetail from './pages/admin/ContractDetail';
import AdminApartmentDetail from './pages/admin/ApartmentDetail';
import SearchCustomer from './pages/admin/SearchCustomer';
import RevenueReport from './pages/admin/RevenueReport';
import MonthlyRevenueReport from './pages/admin/MonthlyRevenueReport';
import EditCustomer from './pages/admin/EditCustomer';
import Home from './pages/user/Home';
import InvoiceDetail from './pages/admin/InvoiceDetail';

export const AppContext = createContext();

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth">
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          {localStorage.getItem('token') ? (
            <>
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="user-detail" element={<UserDetail />} />
                <Route path="apartment" element={<ApartmentList />} />
                <Route path="apartment/create" element={<CreateApartment />} />
                <Route path="apartment/:id" element={<ApartmentDetail />} />
                <Route path="contract" element={<ContractList />} />
                <Route path="contract/create" element={<CreateContract />} />
                <Route path="logout" element={<Logout />} />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Home />} />
                <Route
                  path="customer-management"
                  element={<SearchCustomer />}
                />
                <Route
                  path="customer-management/edit/:id"
                  element={<EditCustomer />}
                />
                <Route
                  path="customer-management/:id"
                  element={<CustomerDetail />}
                />
                <Route
                  path="customer-management/:customerId/contract/:id"
                  element={<ContractDetail />}
                />
                <Route
                  path="customer-management/:customerId/apartment/:id"
                  element={<AdminApartmentDetail />}
                />
                <Route path="revenue-report" element={<RevenueReport />} />
                <Route
                  path="revenue-report/monthly"
                  element={<MonthlyRevenueReport />}
                />
                <Route path="invoice" element={<InvoiceDetail />} />
              </Route>
            </>
          ) : (
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          )}
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
