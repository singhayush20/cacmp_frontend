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
import CategoryComponent from './components/CategoryComponent/CategoryComponent.jsx'
import UsersComponent from './components/UsersComponent/UsersComponent.jsx'
import DashboardHome from './components/DashboardHomeComponent/DashboardHome.jsx'
import DepartmentComponent from './components/DepartmentComponent/DepartmentComponent.jsx'
import UserDetails from './components/UserDetailsComponent/UserDetails.jsx'
import NewUserComponent from './components/NewUserComponent/NewUserComponent.jsx'
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
        path: "login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        )
      },
      {
        path: 'dashboard',
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
            element: <CategoryComponent />
          },
          {
            path: 'users',
            element: <UsersComponent />,
            children: [
              {
                path: ':userId',
                element: <UserDetails />,
              },
              {
                path: 'new',
                element: <NewUserComponent />
              }
            ]
          },
          {
            path: 'department',
            element: <DepartmentComponent />
          },
        ]
      }
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
