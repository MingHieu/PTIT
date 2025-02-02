import { Link, Outlet } from 'react-router-dom';
import { FaFileContract, FaHome, FaUser } from 'react-icons/fa';
import { HiMenuAlt2 } from 'react-icons/hi';
import { TbFileAnalytics } from 'react-icons/tb';
import { LuLogOut } from 'react-icons/lu';

const SideBar = () => {
  return (
    <nav>
      <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <HiMenuAlt2 size={24} />
      </button>
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to={'/admin'}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaHome size={20} />
                <span className="ms-3">Trang chủ</span>
              </Link>
            </li>
            <li>
              <Link
                to={'/admin/customer-management'}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaUser size={20} />
                <span className="ms-3">Quản lí khách hàng</span>
              </Link>
            </li>
            <li>
              <Link
                to={'/admin/contract-management'}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaFileContract size={20} />
                <span className="ms-3">Quản lí hợp đồng</span>
              </Link>
            </li>
            <li>
              <Link
                to={'/admin/revenue-report'}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <TbFileAnalytics size={20} />
                <span className="ms-3">Thống kê doanh thu</span>
              </Link>
            </li>
            <li>
              <Link
                to={'/logout'}
                className="flex items-center p-2 text-red-500 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <LuLogOut size={24} />
                <span className="ms-3">Đăng xuất</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </nav>
  );
};

const AdminLayout = () => {
  return (
    <>
      <SideBar />
      <div className="sm:ml-64 p-4">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
