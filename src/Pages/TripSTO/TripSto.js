import { React, useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol,
  CAlert,
  CContainer,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButtonGroup,
  CFormCheck,
} from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import TripStoService from 'src/Service/TripSTO/TripStoService'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'


import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import Swal from 'sweetalert2'

const TripSto = () => {

    /*================== User Id & Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    const user_locations = []

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    /* Get User Id From Local Storage */
    const user_id = user_info.user_id

    // console.log(user_locations)
    /*================== User Location Fetch ======================*/

    /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.RMSTOModule.RM_STO_Screen

  useEffect(()=>{
    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  },[])
  /* ==================== Access Part End ========================*/

  const navigation = useNavigate()
  const changeTrip = (data) => {
    setTripType(data)
  }
  const assignTripSTO = (parking_id) => {
    // console.log(tripType,'tripType')
    if(tripType == 0){
      setFetch(true)
      toast.warning('Trip Type Should be Chosen before submitting..')
      return false
    }
    TripStoService.doAssignTripSto(parking_id,tripType).then((res) => {
      if (res.status === 204) {
        // setFetch(true)
        // toast.success('TripSto Assigned Successfully!')
        // window.location.reload(false)
        Swal.fire({
          title: tripType == 1 ? 'Trip Assigned For RM Movement Successfully!' : ( tripType == 3 ? 'Trip Assigned For FCI Movement Successfully!': 'Trips Assigned For Others Process Successfully!'),
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        });
      } else {
        setFetch(true)
        toast.warning('Failed To Assign Trip STO..Kindly Contact Admin.!')
      }
    })
  }

  const ACTION = {
    GATE_IN: 1,
    GATE_OUT: 2,
    WAIT_OUTSIDE: 0,
    VEHICLE_MAINTENANCE_ENDED: 5,
  }

  const [rowData, setRowData] = useState([])

  const [errorModal, setErrorModal] = useState(false)
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)
  const [tripType, setTripType] = useState(0)

  const [vehicleSto, setVehicleSto] = useState('')

  let tableData = []

  const loadTripStoTable = () => {
    /*================== User Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    var user_locations = []

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    // console.log(user_locations)
    /*================== User Location Fetch ======================*/

    TripStoService.getVehicleReadyToTripSto().then((res) => {
      tableData = res.data.data
      console.log(tableData,'getVehicleReadyToTripSto')

      setFetch(true)
      let rowDataList = []
      let filterData = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      // console.log(filterData)
      filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: '',
          Vehicle_Type: data.vehicle_type_id.type,
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.vehicle_current_position == ACTION.GATE_IN
                ? 'Gate In'
                : data.vehicle_current_position == ACTION.VEHICLE_MAINTENANCE_ENDED
                ? 'VM Completed'
                : 'Gate Out'}
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            <span>
              {data.vehicle_type_id.type != 'Party Vehicle' &&
              data.vehicle_type_id.type != 'Hire' ? (
                <CButton
                  className="badge text-white"
                  color="warning"
                  onClick={function (event) {
                    setErrorModal(true)
                    setVehicleSto(data.parking_yard_gate_id)
                  }}
                >
                  RM / Others / FCI
                </CButton>
              ) : (
                ''
              )}
              {data.vehicle_type_id.type == 'Hire' ? (
                <CButton className="badge text-white" color="warning">
                  <Link to={`/RMSTOHire/${data.parking_yard_gate_id}`}>RM</Link>
                  {/* <Link className="text-white" to="/RMSTOHire">
                    RM STO
                  </Link> */}
                </CButton>
              ) : (
                ''
              )}
            </span>
          ),
        })
      })
      setRowData(rowDataList)
      setPending(false)
    })
  }

  useEffect(() => {
    loadTripStoTable()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet No',
      selector: (row) => row.VA_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Type',
      selector: (row) => row.Vehicle_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.Driver_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Current Status',
      selector: (row) => row.Waiting_At,
      // sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      sortable: true,
      center: true,
    },
    {
      name: ' Overall Duration',
      selector: (row) => row.Overall_Duration,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
      <>
      {screenAccess ? (
       <>
        <CCard className="mt-4">
          <CContainer className="m-2">
            <CustomTable
              columns={columns}
              data={rowData}
              fieldName={'Driver_Name'}
              showSearchFilter={true}
              // pending={pending}
            />
          </CContainer>
        </CCard>
       </>
      ) : (<AccessDeniedComponent />)}
      </>
      )}
      {/* Error Modal Section */}
      <CModal
        visible={errorModal}
        onClose={() => {
          setErrorModal(false)
          setTripType(0)
        }}
      >
        <CModalHeader>
          <CModalTitle className="h4">Trip Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CAlert color="danger" data-aos="fade-down">
                {'Please Confirm the Trip Plan'}<br/>
                  <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                    <span style={{padding:'2px'}}>
                      <CFormCheck
                        type="radio" 
                        name="trip_type"
                        id="btnradio1" 
                        onClick={() => changeTrip(1)} 
                        autoComplete="off"
                        value="1"
                        label="RM Movement"
                      />
                    </span>                   
                    <span style={{padding:'2px',marginLeft:'5px'}}>
                      <CFormCheck
                        type="radio" 
                        name="trip_type"
                        id="btnradio2"
                        autoComplete="off" 
                        onClick={() => changeTrip(3)} 
                        value="2"
                        label="FCI"
                      />
                    </span>
                    <span style={{padding:'2px',marginLeft:'5px'}}>
                      <CFormCheck
                        type="radio" 
                        name="trip_type"
                        id="btnradio2"
                        autoComplete="off" 
                        onClick={() => changeTrip(2)} 
                        value="0"
                        label="Others"
                      />
                    </span>
                  </CButtonGroup>
              </CAlert>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <span style={{padding:'2px',color:'red'}}>{tripType == 0 && ('* Select Trip Type')}</span>
          <CButton
            color="primary"
            onClick={() => {
              setFetch(false)
              setErrorModal(false)
              assignTripSTO(vehicleSto)
            }}
            disabled={tripType == 0}
          >
            Yes
          </CButton>
          <CButton
            onClick={() => {
              setErrorModal(false)
              setTripType(0)
            }}
            color="primary"
          >
            <Link to=""> No </Link>
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Error Modal Section */}
    </>
  )
}

export default TripSto
