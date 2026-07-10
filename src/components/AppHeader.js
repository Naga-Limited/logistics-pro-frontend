import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'
import Title from './Title'
import nav from '../_nav'
import routesLists from '../RouteChild'
const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.changeState.sidebarShow)
  const location = useLocation()
  const curent_route = routesLists.find((route) => {
    return route.path == location.pathname
  })
  // console.log(location.pathname);
  return (
    <CHeader position="sticky" className="mb-1 p-0">
      <CContainer fluid>
        <CHeaderToggler
          className=""
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="md" />
        </CHeaderToggler>
        {/* <Title tittle={curent_route ? curent_route.name : 'Logistics Pro - Naga'} /> */}
        <Title />
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}
export default AppHeader
