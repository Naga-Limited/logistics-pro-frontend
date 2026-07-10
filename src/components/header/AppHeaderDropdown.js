import {
  CAvatar,
  CBadge,
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import LocalStorageService from 'src/Service/LocalStoage'
import AuthService from 'src/Service/Auth/AuthService'
import lp_logo from 'src/assets/naga/adminImage.png'
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import Swal from 'sweetalert2'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
// import avatar8 from 'https://cdn.icon-icons.com/icons2/2643/PNG/512/male_boy_person_people_avatar_icon_159358.png'

const AppHeaderDropdown = () => {
  //section for handling Logout by removeing the auth_token

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const navigation = useNavigate()

  const user_image = user_info.is_admin == 1 ? lp_logo : user_info.user_image
  const user_name = user_info.username
  const user_id = user_info.user_id
  const logout_time = user_info.logout_time
  console.log(user_info)
  function formatDate(input_time) {
        let first_half = input_time.substring(0, 10)
        let second_half = input_time.substring(10)

        let year = first_half.substring(0, 4)
        let month = first_half.substring(5, 7)
        let date = first_half.substring(8, 10)

        let formated_date = date + '-' + month + '-' + year + ' ' + second_half

        return formated_date
  }
  function logout() {
    AuthService.logout(user_id).then((res) => {
      // console.log(res)
      if (res.status == 204) {
        LocalStorageService.clear()
        window.location.reload(false)
      }
    })
  }

  ///////////////////////////////////////Password Reset Start////////////////////////////////////////////////////////////////////////
  const [datecontrollData, setDatecontrollData] = useState([])
  useEffect(() => {
    DefinitionsListApi.activevisibleDefinitionsListByDefinition(32).then((response) => {
      let viewData = response.data.data
      setDatecontrollData(viewData)
    })
  }, [])
  console.log(datecontrollData)

  const New_pass_date =
    datecontrollData.length > 0 ? datecontrollData[0].definition_list_code : undefined
  console.log(New_pass_date + 'New_pass_date')
  const New_pass_one_day =
    datecontrollData.length > 0 ? datecontrollData[0].definition_list_code - 1 : undefined
  const New_pass_two_day =
    datecontrollData.length > 0 ? datecontrollData[0].definition_list_code - 2 : undefined

  const [user_Data, setUserdata] = useState([])
  useEffect(() => {
    UserLoginMasterService.getUserById(user_id).then((res) => {
      let viewData = res.data.data
      setUserdata(viewData)
    })
  }, [user_id])

  if (user_Data.is_admin != 1) {
    const passResetDate = new Date(user_Data.pass_reset_date)
    const passResetDateWithoutTime = new Date(
      passResetDate.getFullYear(),
      passResetDate.getMonth(),
      passResetDate.getDate()
    )
    console.log(`pass Reset Date:` + passResetDate)
    const currentDate = new Date()
    const currentDateWithoutTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    )
    console.log(`CurrentDate:` + currentDateWithoutTime)
    const differenceInMs = currentDateWithoutTime.getTime() - passResetDateWithoutTime.getTime()
    const differenceInDays = differenceInMs / (1000 * 3600 * 24)
    console.log(`Is differenceInDays:` + differenceInDays)
    let differenceInDaycl = New_pass_date - differenceInDays
    console.log(`Is New_pass_date:` + New_pass_date)
    console.log(`Is differenceInDaycl:` + differenceInDaycl)

    if (differenceInDays >= New_pass_date) {
      //Expired - Password Rest Start
      Swal.fire({
        title: '<h1 style="color: red;"><b>Expired <b></h1><br><h2>Your password has expired!</h2>',
        // text: 'Your password has expired!.',
        text: 'Please change your password ',
        icon: 'error',
        confirmButtonText: 'OK',
      }).then(function () {
        LocalStorageService.clear()
        window.location.reload(true)
      })
    }
  }
  // ///////////////////////////////////////Password Reset End////////////////////////////////////////////////////////////////////////

  // variant="nav-item" style={{ paddingLeft: 0 }}pointer-events: none;
  return (
    <CDropdown variant="nav-item" style={{ pointerEvents: 'none' }}>
      <CDropdownToggle
        style={{ borderColor: 'transparent' }}
        placement="bottom-end"
        className="py-0"
        caret={false}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ fontSize: '13px' }}>
            <span style={{ paddingLeft: '65px', marginBottom: '10px' }}>Welcome, {user_name}</span>
            <br />
            {logout_time && (
              <span style={{ paddingRight: '10px', marginBottom: '10px' }}>
                Last Login Time : {formatDate(logout_time)}
              </span>
            )}
          </div>
          <div style={{ pointerEvents: 'auto' }}>
            <CAvatar src={user_image} size="lg" />
          </div>
        </div>
      </CDropdownToggle>
      <CDropdownMenu style={{ pointerEvents: 'auto' }} className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          <CButton onClick={logout} type="button">
            <CIcon icon={cilLockLocked} className="me-2" />
            Logout
          </CButton>
        </CDropdownHeader>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
