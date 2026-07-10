/* eslint-disable prettier/prettier */
import CIcon from '@coreui/icons-react'
import {
    CButton,
    CCard,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CNav,
    CNavItem,
    CNavLink,
    CRow,
    CTabContent,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTabPane,
    CFormFloating,
    CFormCheck,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormTextarea,
    CCardBody,
    CCardFooter,
    CProgress,

} from '@coreui/react'
import { cilInput, cilDescription, cilCheckCircle, cilCog } from '@coreui/icons'
import {
  CChart,
  CChartBar,
  CChartHorizontalBar,
  CChartLine,
  CChartDoughnut,
  CChartRadar,
  CChartPie,
  CChartPolarArea,
} from "@coreui/react-chartjs";
import React, { useState, useEffect } from 'react'
import WidgetsDropdown from 'src/components/widgets/WidgetsDropdown';
import DashboardService from 'src/Service/Dashboard/DashboardService';

import { useNavigate } from 'react-router-dom'
import { DateRangePicker } from 'rsuite'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import LocalStorageService from 'src/Service/LocalStoage'
import Swal from 'sweetalert2'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
// https://nagamills.com/img/BannerLogistics.jpg

const Dashboard = () => {
  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)

  useEffect(() => {
    DashboardService.getDashboardDetails().then((res) => {
      //  console.log(res.data)
      setSingleVehicleInfo(res.data)
      })
  },[])

  // Ifoods Start
  const [isLoading, setIsLoading] = useState(true)
  const [singleInfo, setSingleInfo] = useState(null)
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const navigation = useNavigate()
  const user_name = user_info.username
  const user_id = user_info.user_id
  const logout_time = user_info.logout_time
  let ifoodsUser = null
  ///////////////////////////////////////Password Reset Start////////////////////////////////////////////////////////////////////////
  const [datecontrollData, setDatecontrollData] = useState([])
  useEffect(() => {
    DefinitionsListApi.activevisibleDefinitionsListByDefinition(32).then((response) => {
      let viewData = response.data.data
      setDatecontrollData(viewData)
    })
  }, [])
  const New_pass_date =
    datecontrollData.length > 0 ? datecontrollData[0].definition_list_code : undefined
  console.log(New_pass_date + 'New_pass_date')
  const New_pass_one_day =
    datecontrollData.length > 0 ? datecontrollData[0].definition_list_code - 1 : undefined
  console.log(New_pass_one_day + 'New_pass_one_day')
  const New_pass_two_day =
    datecontrollData.length > 0 ? datecontrollData[0].definition_list_code - 2 : undefined
  console.log(New_pass_two_day + 'New_pass_two_day')
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
    const currentDate = new Date()
    const currentDateWithoutTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    )
    console.log(`passResetDate:` + passResetDate)
    console.log(`CurrentDate:` + currentDateWithoutTime)
    const differenceInMs = currentDateWithoutTime.getTime() - passResetDateWithoutTime.getTime()
    const differenceInDays = differenceInMs / (1000 * 3600 * 24)
    console.log(`Is differenceInDays:` + differenceInDays)
    let differenceInDaycl = New_pass_date - differenceInDays
    console.log(`Is differenceInDaycl:` + differenceInDaycl)

    if (differenceInDays == New_pass_two_day || differenceInDays == New_pass_one_day) {
      //Date Remainder - Password Rest Start

      Swal.fire({
        title: '<h1 style="color: blue;"><b>Info</b><h1>',
        text: 'Your password will expire in ' + differenceInDaycl + ' days..!',
        icon: 'info',
      })
    }
  }
  // ///////////////////////////////////////Password Reset End////////////////////////////////////////////////////////////////////////
  if (user_info.is_admin == 1 || user_info.division_info.id == 7) {
    ifoodsUser = user_info.is_admin == 1 || user_info.division_info.id
  }

  const [value, setValue] = React.useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])
  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
    }`
  }

  const [dateRangePickerStartDate, setDateRangePickerStartDate] = useState('')
  const [dateRangePickerEndDate, setDateRangePickerEndDate] = useState('')
  const convert = (str) => {
    let date = new Date(str)
    let mnth = ('0' + (date.getMonth() + 1)).slice(-2)
    let day = ('0' + date.getDate()).slice(-2)
    return [date.getFullYear(), mnth, day].join('-')
  }

  useEffect(() => {
    if (value) {
      console.log(value)
      let fromDate = value[0]
      let toDate = value[1]
      setDateRangePickerStartDate(convert(fromDate))
      setDateRangePickerEndDate(convert(toDate))
    } else {
      setDateRangePickerStartDate('')
      setDateRangePickerEndDate('')
    }
  }, [value])
  useEffect(() => {
    DashboardService.getDashboardDetailsIfoods().then((res) => {
      console.log(res.data)
      setSingleInfo(res.data)
      setIsLoading(false)
    })
  }, [])
  const handleFilterButtonClick = () => {
    DashboardService.getDashboardDetailsIfoodsByDateRange(
      dateRangePickerStartDate,
      dateRangePickerEndDate
    )
      .then((res) => {
        console.log(res.data)
        setSingleInfo(res.data)
        setIsLoading(false)
      })
      .catch((error) => {})
  }
// I Foods End

    return (
      // <>
        <CCard className="mb-4">
          <CCardBody>
 {/* I Foods Users and Admin Dashboard */}
 {ifoodsUser ? (
          isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <CRow>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="VNum">Date Range</CFormLabel>
                  <DateRangePicker
                    style={{ width: '100%', height: '100%', borderColor: 'black' }}
                    className="mb-2"
                    id="start_date"
                    name="end_date"
                    format="dd-MM-yyyy"
                    value={value}
                    onChange={setValue}
                  />
                </CCol>
                <CCol xs={10} md={2} className="mt-20 mt-md-4">
                  <CButton  size="sm" color="info" onClick={handleFilterButtonClick}>Filter</CButton>
                </CCol>
              </CRow>
              <CChartLine
                id="bar"
                style={{ height: '350px' }}
                className="w-150 p-1"
                data={{
                  labels: [
                    'Loading Point Gate in',
                    'Loading Point Gate out',
                    'Trip Closure',
                    'Trip Closure Approval',
                    'Pay. Submission',
                    'Pay. Validation - SCM',
                    'Pay. Approval - OH',
                    'Pay. Validation - AM',
                    'Pay. Approval - AH',
                    'Pay. Completed',
                  ],

                  datasets: [
                    {
                      label: 'I Foods',
                      backgroundColor: '#e28743',
                      stack: 3,
                      borderWidth: 3,
                      data: [
                        singleInfo.gatein,
                        singleInfo.gateout,
                        singleInfo.trip_closure,
                        singleInfo.trip_closure_app,
                        singleInfo.payment_submission,
                        singleInfo.payment_validation,
                        singleInfo.payment_validation_oh,
                        singleInfo.payment_validation_am,
                        singleInfo.payment_validation_ah,
                        singleInfo.payment_completed,
                      ],
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    x: {
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                    y: {
                      suggestedMin: 10,
                      ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 10,
                        stepSize: Math.ceil(1 / 10),
                        max: 10,
                      },
                    },
                  },
                  elements: {
                    line: {
                      tension: 0.4,
                    },
                    point: {
                      radius: 1,
                      hitRadius: 3,
                      hoverRadius: 10,
                      hoverBorderWidth: 10,
                    },
                  },
                }}
              />
              <CChartPie
                id="pie-chart"
                style={{ height: '300px' }}
                className="w-100 p-3"
                data={{
                  labels: [
                    'Loading Point Gate in',
                    'Loading Point Gate out',
                    'Trip Closure',
                    'Trip Closure Approval',
                    'Payment Submission',
                    'Payment Validation - SCM',
                    'Payment Validation - AM',
                    'Payment Approve - AH',
                    'Payment Completed',
                  ],
                  datasets: [
                    {
                      label: 'I Foods',
                      backgroundColor: [
                        '#10002b',
                        '#FF6340',
                        '#0077b6',
                        '#ff0054',
                        '#ffbd00',
                        '#590d22',
                        '#e0e1dd',
                        '#5526FF',
                        '#2b9348',
                      ],
                      data: [
                        singleInfo.gatein,
                        singleInfo.gateout,
                        singleInfo.trip_closure,
                        singleInfo.trip_closure_app,
                        singleInfo.payment_submission,
                        singleInfo.payment_validation,
                        singleInfo.payment_validation_am,
                        singleInfo.payment_validation_ah,
                        singleInfo.payment_completed,
                      ],
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </>
          )
        ) : (
          // Non-ifoodsUser 
          <div className="card mt-3">
            <img style={{ height: '70vh' }} alt='Naga Logistics Division' src="https://nagamills.com/img/BannerLogistics.jpg" />
          </div>
           )}
           </CCardBody>
         </CCard>
         )
}

            {/* <WidgetsDropdown />
            <h4 className="text-center mb-2" >Vechicle Status</h4>
            <CChartBar
              id='bar'
              style={{height:'300px'}}
              className= "w-100 p-3"
              data={{labels: ["Parking Yard Gate in","Vehicle_Inspection","RM_STO","Maintenance Inside","Maintenance OutSide","Document Verification","FG Sales NLFD","FG Sales NLCD","FG STO NLFD","FG STO NLCD","RM STO_Assigned"],
                datasets: [
                  {

                    label: ['Own & Contract'],
                    backgroundColor: '#00ffcc',
                    stack: 1,
                    borderWidth: 1,
                    data: [singleVehicleInfo.Parking_Yard_Own,singleVehicleInfo.Vehicle_Inspection_Own,singleVehicleInfo.RM_STO_Own,singleVehicleInfo.Maintenance_Inside,singleVehicleInfo.Maintenance_Outside,0,singleVehicleInfo.FG_Sales_NLFD_Own,singleVehicleInfo.FG_Sales_NLCD_Own,singleVehicleInfo.FG_STO_NLFD_Own,singleVehicleInfo.FG_STO_NLCD_Own,singleVehicleInfo.RM_STO_OWN_GET],
                  },
                  {
                    label: ['Hire'],
                    backgroundColor: '#00997a',
                    stack: 1,
                    borderWidth: 1,
                    data: [singleVehicleInfo.Parking_Yard_Hire,singleVehicleInfo.Vehicle_Inspection_Hire,singleVehicleInfo.RM_STO_Hire,0,0,singleVehicleInfo.Document_Verification,singleVehicleInfo.FG_Sales_NLFD_Hire,singleVehicleInfo.FG_STO_NLCD_Hire,singleVehicleInfo.FG_STO_NLFD_Hire,singleVehicleInfo.FG_STO_NLCD_Hire,singleVehicleInfo.RM_STO_HIRE_GET],
                  },
                ]
              }}

              // labels="months"

              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  x: {
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                  y: {
                    ticks: {
                      beginAtZero: true,
                      maxTicksLimit: 5,
                      stepSize: Math.ceil(250 / 5),
                      max: 250,
                    },
                  },
                },
                elements: {
                  line: {
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                    hoverBorderWidth: 3,
                  },
                },
              }}
            /> */}
            
          {/* </CCardBody>
         </CCard> */}
      {/* </> */}
    {/* )
} */}

export default Dashboard

