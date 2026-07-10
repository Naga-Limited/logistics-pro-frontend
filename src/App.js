import React, { Component, useEffect, useState } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Login from './Pages/Auth/Login'
import './scss/style.scss'
import store from './store'
import LocalStorageService from 'src/Service/LocalStoage'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AutoLogoutTimer from './AutoLogoutTimer'
import Maintenance from './Maintenance'
import axios from 'axios'
import DefinitionsListApi from './Service/Definitions/DefinitionsListApi'
import Login from './Pages/Auth/Login'
const user_info_json = localStorage.getItem('user_info')
const user_info = JSON.parse(user_info_json)

export const APIURL = process.env.REACT_APP_BASEURL

// export const APIURL = 'https://logiprouat.nagamills.com/LP_API/api/v1' /* UAT Server */
// export const APIURL = 'http://127.0.0.1:8000/api/v1/' /* DEV Server */
// export const APIURL = 'https://logisticspro.nagamills.com/LP_API/api/v1/' /* Production Server */
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)
// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

function App() {
  const token = LocalStorageService.getLocalstorage('auth_token')
  let isauth = token ? true : false  

  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    DefinitionsListApi.getDefinitionsListById(1).then((response) => {
      setMaintenance(false);
    })
    .catch((error) => { 
      if (error && error.response && error.response.status === 503) {
        // App is in maintenance mode
        setMaintenance(true)
      }
    });
  }, []);

  return (
    <React.Suspense fallback={loading}>
      <ToastContainer />
      {maintenance ? (
        <Maintenance />
      ) : ( 
        <>
          {(isauth || window.location.hash.includes('pod?pbh=')) ? <AutoLogoutTimer timeoutInMinutes={30}/>: <Login /> }
          {isauth || window.location.hash.includes('pod?pbh=') ? <DefaultLayout /> :loading }
        </>
      )} 

    </React.Suspense>
  )
}

export default App
