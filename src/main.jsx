import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login/Login.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import AuthLayout from './components/AuthLayout.jsx'
import Home from './pages/Home/Home.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import CategoryDetailsComponent from './components/Admin/CategoryDetailsComponent/CategoryDetailsComponent.jsx'
import CategoryComponent from './components/Admin/CategoryComponent/CategoryComponent.jsx'
import UsersComponent from './components/Admin/UsersComponent/UsersComponent.jsx'
import DashboardHome from './components/Admin/DashboardHomeComponent/DashboardHome.jsx'
import DepartmentComponent from './components/Admin/DepartmentComponent/DepartmentComponent.jsx'
import UserDetails from './components/Admin/UserDetailsComponent/UserDetails.jsx'
import NewUserComponent from './components/Admin/NewUserComponent/NewUserComponent.jsx'
import UserLogin from './pages/UserLogin/UserLogin.jsx'
import DepartmentDashboard from './pages/DepartmentDashboard/DepartmentDashboard.jsx'
import NewDepartmentComponent from './components/Admin/NewDepartmentComponent/NewDepartmentComponent.jsx'
import DepartmentDetailsComponent from './components/Admin/DepartmentDetailsComponent/DepartmentDetailsComponent.jsx'
import NewCategoryComponent from './components/Admin/NewCategoryComponent/NewCategoryComponent.jsx'
import DeptAuthLayout from './components/DepthAuthLayout.jsx'
import DeptComplaintsComponent from './components/Department/DeptComplaints/DeptComplaintsComponent.jsx'
import ComplaintDetailsComponent from './components/Department/ComplaintDetails/ComplaintDetailsComponent.jsx'
import DeptCategoriesComponent from './components/Department/DeptCategories/DeptCategoriesComponent.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "admin",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: 'admin/dashboard',
        element: (
          <AuthLayout authentication={true}>
            <Dashboard />
          </AuthLayout>
        ),
        children: [
          {
            path: '',
            element: <DashboardHome />
          },
          {
            path: 'category',
            element: <CategoryComponent />,
          },
          {
            path: 'users',
            element: <UsersComponent />,
          },
          {
            path: 'department',
            element: <DepartmentComponent />
          },
          {
            path: 'users/:userId',
            element: <UserDetails />,
          },
          {
            path: 'users/new',
            element: <NewUserComponent />
          },
          {
            path: 'department/new',
            element: <NewDepartmentComponent />
          },
          {
            path: 'department/:departmentToken',
            element: <DepartmentDetailsComponent />
          },
          {
            path: 'category/new',
            element: <NewCategoryComponent />
          },
          {
            path: 'category/:categoryToken',
            element: <CategoryDetailsComponent />
          },

        ]
      },
      {
        path: "login",
        element: <DeptAuthLayout authentication={false}>
          <UserLogin />
        </DeptAuthLayout>
      },
      {
        path: "dashboard",
        element: <DeptAuthLayout authentication={true}>
          <DepartmentDashboard />
        </DeptAuthLayout>,
        children: [
          {
            path: '',
            element: <DeptCategoriesComponent />
          },
          {
            path: "category/:categoryToken",
            element: <DeptComplaintsComponent />

          },
          {
            path: 'complaint/:complaintToken',
            element: <ComplaintDetailsComponent />
          },
        ]
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
