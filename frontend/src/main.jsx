import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './route/index.jsx'
import { Provider } from 'react-redux'
import { sotre } from '../store/sotre.js'

createRoot(document.getElementById('root')).render(
  <Provider store={sotre}>
    <RouterProvider router={router} />
  </Provider>
)
