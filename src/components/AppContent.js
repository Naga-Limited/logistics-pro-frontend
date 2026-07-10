import React, { Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config

import routesLists from '../RouteChild'

const AppContent = () => {
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routesLists.map((route, idx) => {
            // console.log(route.path + '||' + route.component)
            return (
              route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.component />}
                />
              )
            )
          })}
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
