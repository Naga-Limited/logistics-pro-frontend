import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'

import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LocalStorageService from 'src/Service/LocalStoage'

/* ============ Set Footer Disble Condition Part Start ============ */
let sfd = location.href
let gh = sfd.lastIndexOf('/');
console.log(gh)
let vbn = sfd.substring(0,gh);
console.log(vbn);
let gh1 = vbn.lastIndexOf('/');
let vbn1 = vbn.substring(gh1+1);
let footer_disable = !(vbn1 == 'ShipmentCreationNLFDReport' || vbn1 == 'ShipmentCreationNLCDReport')
/* ============ Set Footer Disble Condition Part End ============ */

const DefaultLayout = () => {
  const isauth = LocalStorageService.getLocalstorage('auth_token') ? true : false
  return (
    <div>
      <ToastContainer />
      {isauth && <AppSidebar />}
      <div className={isauth ? "wrapper d-flex flex-column min-vh-100 bg-light" : "d-flex flex-column min-vh-100 bg-light"}>
        {isauth && <AppHeader />}
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>

        {isauth && footer_disable && <AppFooter /> }

      </div>
    </div>
  )
}

export default DefaultLayout
