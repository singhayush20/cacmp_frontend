import './App.css'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>

      <div className="main">
      <ToastContainer />
        <main>
          <Outlet />
        </main>
      </div>

    </>
  )
}

export default App
