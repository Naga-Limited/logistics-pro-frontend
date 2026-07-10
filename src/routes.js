/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React from 'react'
import { HashRouter, Route, Navigate } from 'react-router-dom'
import { shallowEqual, useSelector } from 'react-redux'

import RoutesLists from './RouteChild'

export function routes() {
  const { isAuthorized } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user != null,
    }),
    shallowEqual
  )

  console.log('isAuthorized')
  console.log(isAuthorized)

  return (
    <HashRouter>
      {!isAuthorized ? (
        /*Redirect to `/auth` when user is not authorized*/
        <Navigate to="/login" />
      ) : (
        <RoutesLists />
      )}
    </HashRouter>
  )
}
