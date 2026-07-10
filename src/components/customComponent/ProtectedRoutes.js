import React from 'react'
import { HashRouter, Redirect, Route } from 'react-router-dom'

const ProtectedRoutes = ({ auth, component: Component, ...rest }) => {
  return (
    <HashRouter>
      <Route
        {...rest}
        render={(props) => {
          if (auth) return <Component {...props} />
          if (!auth) return <Redirect from="/" to="/login" />
        }}
      />
    </HashRouter>
  )
}

export default ProtectedRoutes
