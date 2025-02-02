import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import Login from './pages/login'
import DashBoard from './pages/dashboard'
import Deposit from './pages/deposit'
import Statistics from './pages/statistic'
import AdminLinks from './pages/adminLinks'
import AdminUsers from './pages/adminUsers'
import AdminRequests from './pages/adminRequests'
import Home from './pages/home'
import Register from './pages/register'
import MyUrls from './pages/myUrls'
import UrlDetail from './pages/urlDetail/UrlDetail'
import UserDetail from './pages/userDetail/UserDetail'
import Profile from './pages/profile'
import ShortLink from './pages/shortLink'
import Affiliate from './pages/affiliate'
import RequestDetail from './pages/requestDetail'
import AdminDashboard from './pages/adminDashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/dashboard',
    element: <DashBoard />
  },
  {
    path: '/my-urls',
    element: <MyUrls />
  },
  {
    path: '/deposit',
    element: <Deposit />
  },
  {
    path: '/link-affiliate',
    element: <Affiliate />
  },
  {
    path: '/statistics',
    element: <Statistics />
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />
  },
  {
    path: '/admin/users',
    element: <AdminUsers />
  },
  {
    path: '/admin/users/detail/:username',
    element: <UserDetail />
  },
  {
    path: '/admin/links',
    element: <AdminLinks />
  },
  {
    path: '/links/detail/:id',
    element: <UrlDetail />
  },
  {
    path: '/admin/requests',
    element: <AdminRequests />
  },
  {
    path: '/admin/requests/:id',
    element: <RequestDetail />
  },
  {
    path: '/s/:code',
    element: <ShortLink />
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
