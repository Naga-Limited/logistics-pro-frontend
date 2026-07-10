

import { CAlert, CButton, CCard, CCol, CContainer, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'
import Swal from 'sweetalert2'
const TripInfoEditHome = () => {
  /*================== User Location Fetch ======================*/
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
  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)
  const [PRData, setPRData] = useState([])
  const [currentPRId, setCurrentPRId] = useState('')
  const [deleteModalEnable, setDeleteModalEnable] = useState(false)
  const [message, setMessage] = useState('')
  const handleChangeRemarks = (event) => {
    let val = event.target.value.trimStart()
    const result = val.toUpperCase()
    console.log('value.message', message)
    setMessage(result)
  }
  let tableData = []
  const REQ = () => <span className="text-danger"> * </span>
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const display_modal_values = (type) => {
    let needed_data = ''
    let current_pr_data = ''
    PRData.map((vh,kh)=>{
      if(currentPRId == vh.parking_yard_gate_id){
        current_pr_data = vh
      }
    })
    console.log(current_pr_data,'current_pr_data')
    console.log(PRData,'PRData')
    console.log(currentPRId,'currentPRId')
    if(current_pr_data != ''){
      if(type == 1){
        needed_data = current_pr_data.vehicle_type_id.type
      } else if(type == 2){
        needed_data = current_pr_data.vehicle_number
      } else if(type == 3){
        needed_data = current_pr_data.vehicle_capacity_id_new
      } else if(type == 4){
        needed_data = current_pr_data.driver_name
      } else if(type == 5){
        needed_data = current_pr_data.driver_contact_number
      } else if(type == 6){
        needed_data = current_pr_data.gate_in_date_time_string
      }  
    }
    return needed_data
  }

  const removePRData = () => {
    if(message.trim() == ''){
      toast.warning('Cancel Remarks Required for Trip Rejection..')
      return false
    }

    let formData = new FormData()
    formData.append('pyg_id', currentPRId)
    formData.append('veh_type', display_modal_values(1))
    formData.append('cancel_remarks', message)
    formData.append('cancel_by', user_id)
    setFetch(false)
    TripSheetCreationService.cancelTripRequest(formData).then((res) => {
      console.log(res,'cancelTripRequest')
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: 'Trip Request Cancelled Successfully!',
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        });
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // window.location.reload(false)
        });
      } else {
        Swal.fire({
          title: 'Trip Request Cannot Be Cancelled in LP.. Kindly Contact Admin!',
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // window.location.reload(false)
        })
      }
    })
    .catch((error) => {
      setFetch(true)
      // setState({ ...state })
      for (let value of formData.values()) {
        console.log(value)
      }
      console.log(error)
      var object = error.response.data.errors
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      }
      setError(output)
      setErrorModal(true)
    })

  }

  const loadVehicleReadyToTrip = () => {
    TripSheetCreationService.getVehicleReadyToTrip().then((res) => {
      setFetch(true)
      tableData = res.data.data

      console.log(tableData)
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      // console.log(filterData)

      const filterData = filterData1.filter((item) =>
        item.vehicle_type_id.id == 3
          ? item.document_verification_status == 1
          : item.trip_sto_status == 1
          ? item.vehicle_inspection_status == null
          : item.vehicle_inspection_status != null
      )

      console.log(filterData)
      setPRData(filterData)
      let rowDataList = []
      filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          // Tripsheet_No: '',
          Vehicle_Type: data.vehicle_type_id.type,
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              { data.vehicle_current_position == Vehicle_Current_Position.RMSTO_COMPLETED
                ? 'RMSTO Completed'
                : data.vehicle_current_position == Vehicle_Current_Position.OTHERS_PROCESS_COMPLETED
                ? 'Others Process Completed'
                : data.vehicle_current_position ==
                  Vehicle_Current_Position.DOCUMENT_VERIFICATION_COMPLETED
                ? 'Doc. Verification Completed'
                : data.vehicle_current_position ==
                  Vehicle_Current_Position.VEHICLE_INSPECTION_COMPLETED
                ? 'VI Completed'
                : data.vehicle_current_position == Vehicle_Current_Position.FCI_PROCESS_COMPLETED
                ? 'FCI Completed'
                : 'Gate Out'
              } 
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (
            // <CButton className="badge text-white" color="warning">
            //   <Link to={`${data.parking_yard_gate_id}`}>Create TripSheet</Link>
            // </CButton>
            <div className="d-flex justify-content-space-between">
              {/* <Link to={`/TripInfoEditRequest/${data.parking_yard_gate_id}`}>
                <CButton
                  size="sm"
                  color="secondary"
                  shape="rounded"
                  id={data.parking_yard_gate_id}
                  className="m-1"
                > 
                  <i className="fa fa-edit" aria-hidden="true"></i>
                </CButton>
              </Link> */}
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                id={data.parking_yard_gate_id}
                onClick={(e) =>
                  {
                    setCurrentPRId(data.parking_yard_gate_id)
                    setDeleteModalEnable(true)
                  }
                }
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
            </div>
          ),
        })
      })
      setRowData(rowDataList)
    })
  }

  const Vehicle_Current_Position = {
    GATE_IN: 1,
    VEHICLE_INSPECTION_COMPLETED: 2,
    RMSTO_COMPLETED: 6,
    OTHERS_PROCESS_COMPLETED: 7,
    DOCUMENT_VERIFICATION_COMPLETED: 8,
    FCI_PROCESS_COMPLETED: 10,
  }

  useEffect(() => {
    loadVehicleReadyToTrip()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
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
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      center: true,
    },
    {
      name: ' Overall Duration',
      selector: (row) => row.Overall_Duration,
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
        <CCard className="mt-4">
          <CContainer className="mt-2">
            <CustomTable columns={columns} data={rowData} showSearchFilter={true} />
          </CContainer>
          {/* Error Modal Section */}
            <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
              <CModalHeader>
                <CModalTitle className="h4">Error</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CRow>
                  <CCol>
                    {error && (
                      <CAlert color="danger" data-aos="fade-down">
                        {error}
                      </CAlert>
                    )}
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter>
                <CButton onClick={() => setErrorModal(false)} color="primary">
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
          {/* Error Modal Section */}
          {/* ======================= Trip Delete Modal Area ========================== */}
            <CModal
              visible={deleteModalEnable}
              backdrop="static"
              size="lg"
              // scrollable
              onClose={() => {
                setDeleteModalEnable(false)
                setCurrentPRId('')
                setMessage('')
              }}
            >
              <CModalHeader>
                <CModalTitle>Are you sure to cancel the Trip ?</CModalTitle>
              </CModalHeader>
              <CModalBody>

                <CRow className="mt-3">
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="fnr_no">Vehicle Type</CFormLabel>
                    <CFormInput
                      size="sm"
                      className="mb-2"
                      id="fnr_no"
                      value={display_modal_values(1)}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="fnr_no">Vehicle Number</CFormLabel>
                    <CFormInput
                      size="sm"
                      className="mb-2"
                      id="fnr_no"
                      value={display_modal_values(2)}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="fnr_no">Vehicle Capacity</CFormLabel>
                    <CFormInput
                      size="sm"
                      className="mb-2"
                      id="fnr_no"
                      value={display_modal_values(3)}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="fnr_no">Driver Name</CFormLabel>
                    <CFormInput
                      size="sm"
                      className="mb-2"
                      id="fnr_no"
                      value={display_modal_values(4)}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="fnr_no">Driver Mobile No.</CFormLabel>
                    <CFormInput
                      size="sm"
                      className="mb-2"
                      id="fnr_no"
                      value={display_modal_values(5)}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="fnr_no">Gate-In Date & Time</CFormLabel>
                    <CFormInput
                      size="sm"
                      className="mb-2"
                      id="fnr_no"
                      value={display_modal_values(6)}
                      readOnly
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="remarks">Cancel Remarks <REQ /></CFormLabel>
                    {/* ================ Remarks Textbox Enter CAPS Start ============*/}
                      <CFormTextarea
                        name="remarks"
                        id="remarks"
                        value={message}
                        rows="1"
                        onChange={handleChangeRemarks}
                      >

                      </CFormTextarea>
                    {/*=================== Remarks Textbox Enter CAPS End ==========*/}
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter>
                {message.trim() == '' && (<span className="text-danger"> Cancel Remarks Required </span>)}
                <CButton
                  className="m-2"
                  color="warning"
                  disabled={message.trim() == ''}
                  onClick={() => {
                    setDeleteModalEnable(false)
                    setCurrentPRId('')
                    setMessage('')
                    removePRData()
                  }}
                >
                  Yes
                </CButton>
                <CButton
                  className="m-2"
                  color="warning"
                  onClick={() => {
                    setDeleteModalEnable(false)
                    setCurrentPRId('')
                    setMessage('')
                    // removeBDCData()
                  }}
                >
                  No
                </CButton>

              </CModalFooter>
            </CModal>
          {/* *********************************************************** */}
        </CCard>
      )}
    </>
  )
}

export default TripInfoEditHome
