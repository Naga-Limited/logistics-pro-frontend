import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'
import lp_logo from 'src/assets/naga/naga_3.png'

import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'

const appSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.changeState.sidebarShow)

  // Example user permissions (normally comes from Redux or Context)
  // const userPermissions = ['view_users', 'admin_access']

  const page_permission_json = localStorage.getItem('page_permission')
  const page_permission = JSON.parse(page_permission_json) || []
  console.log(page_permission,'page_permission')

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  // console.log(page_permission)
  const user_admin = user_info && user_info.is_admin == '1' ? true : false

  

  const filterNavByPermissions = (navItems, userPermissions) => {
    return navItems
      .map(item => {
        if (item.items) {
          const filteredChildren = filterNavByPermissions(item.items, userPermissions)
          if (filteredChildren.length > 0) {
            return { ...item, items: filteredChildren }
          }
          return null
        }

        console.log(item.permission_ca,'item.permission_ca')
        console.log(userPermissions,'item.permission_ca -userPermissions')
 
        if(user_admin || !item.is_restricted || (item.permission_ca && item.permission_ca.some(item => userPermissions.includes(item)))){
          return item
        }

        return null
      })
      .filter(Boolean)
  }

  const filteredNav = filterNavByPermissions(navigation, page_permission) 

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        {/* <h3 className="">LOGISTICS PRO</h3> */}
        <img style={{ width: '95%', minHeight: '3.5rem', marginTop: '5px' }} src={lp_logo} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav
          //  items={navigation} 
           items={filteredNav} 
          />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  )
}

export default React.memo(appSidebar)
