import { CAlert, CButton, CCard, CCol, CContainer, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import Swal from "sweetalert2";
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService';
import TripSheetInfoService from 'src/Service/PurchasePro/TripSheetInfoService';

const NlmtDICancelHome = () => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

   /* ==================== Access Part Start ========================*/
const [screenAccess, setScreenAccess] = useState(false)
let page_no = LogisticsProScreenNumberConstants.DieselIntentModule.Diesel_Intent_Creation_Request

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

  /* Vehicle Current Position */
  const Vehicle_Current_Position = {
    TRIP_EXPENSE_CAPTURE: 26,
    TRIP_INCOME_CAPTURE: 27,
    TRIP_INCOME_REJECT: 261,
    TRIP_SETTLEMENT_REJECT: 29,
    DI_CREATION: 37,

  }

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/
  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)
  let tableData = []
  const [allDicData, setAllDicData] = useState([])
  const [currentDicData, setCurrentDicData] = useState({})
  const [currentDICId, setCurrentDICId] = useState('')
  const [deleteModalEnable, setDeleteModalEnable] = useState(false)
  const [message, setMessage] = useState('')
  const handleChangeRemarks = (event) => {
    let val = event.target.value.trimStart()
    const result = val.toUpperCase()
    console.log('value.message', message)
    setMessage(result)
  }
  const REQ = () => <span className="text-danger"> * </span>
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  useEffect(()=>{
    if(currentDICId == ''){
      setCurrentDicData({})
    } else if (currentDICId) {
      allDicData.map((vv,kk)=>{
        if(vv.id == currentDICId){
          setCurrentDicData(vv)
        }
      })
    } else {
      setCurrentDicData({})
    }
  },[currentDICId])

  const loadVehicleReadyToTrip = () => {
    DieselIntentCreationService.getVehicleReadyToDieselConfirm().then((res) => {
      setFetch(true)
      console.log(res.data,'getVehicleReadyToDieselConfirm')
      tableData = res.data
      let rowDataList = []

      // FIXED: Exclude Hire vehicles (vehicle_type_id == 3) from diesel cancellation
      // Hire vehicles don't have vendor_info and shouldn't be in diesel intent workflow
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
          && data.parking_status != 19
          && data.vehicle_type_id != 3 // Exclude Hire vehicles
      )
      setAllDicData(filterData1)
      filterData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.trip_sheet_no,
          Tripsheet_Date: formatDate(data.created_at),
          Vehicle_Type: data.vehicle_type,
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: <span className="badge rounded-pill bg-info">
            {data.vehicle_current_position == Vehicle_Current_Position.TRIP_EXPENSE_CAPTURE
                ? 'Expense Capture'
                : data.vehicle_current_position ==
                  Vehicle_Current_Position.TRIP_INCOME_CAPTURE
                ? 'Income Capture'
                : data.vehicle_current_position ==
                  Vehicle_Current_Position.TRIP_INCOME_REJECT
                ? 'Income Reject'
                :Vehicle_Current_Position.DI_CREATION
                ? 'DI Creation'
                :Vehicle_Current_Position.TRIP_SETTLEMENT_REJECT
                ? 'Settlement Reject'
                :'DI Creation'
            }
          </span>,
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,

          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                id={data.id}
                onClick={(e) =>
                  {
                    setCurrentDICId(data.id)
                    setDeleteModalEnable(true)
                  }
                }
                className="m-1"
              >
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
            </div>
          ),
        })
      })
      setRowData(rowDataList)
    })
  }

  useEffect(() => {
    loadVehicleReadyToTrip()
  }, [])


function secondsToDhms(date) {

  let t1 = new Date(date);
  let t2 = new Date();

  var unix_seconds = Math.abs(t1.getTime() - t2.getTime()) / 1000;


  var d = Math.floor(unix_seconds / (3600*24));
  var h = Math.floor(unix_seconds % (3600*24) / 3600);
  var m = Math.floor(unix_seconds % 3600 / 60);
  var s = Math.floor(unix_seconds % 60);

  var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hr and " : " hrs and ") : "0 hr and ";
  var mDisplay = m > 0 ? m + (m == 1 ? " min " : " mins ") : "0 mins ";

  return dDisplay + hDisplay + mDisplay;
  }
  function secondsToDhms1(date) {

    let t1 = new Date(date);
    let t2 = new Date();

    var unix_seconds = Math.abs(t1.getTime() - t2.getTime()) / 1000;
      var d = Math.floor(unix_seconds / (3600*24));
      var h = Math.floor(unix_seconds % (3600*24) / 3600);
      var m = Math.floor(unix_seconds % 3600 / 60);
      var s = Math.floor(unix_seconds % 60);

      var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
      var hDisplay = h > 0 ? h + (h == 1 ? " hr and " : " hrs and ") : "0 hr and ";
      var mDisplay = m > 0 ? m + (m == 1 ? " min " : " mins ") : "0 mins";
     // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
      return dDisplay + hDisplay + mDisplay;
      }

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Number',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet Date',
      selector: (row) => row.Tripsheet_Date,
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
      selector: (row) => secondsToDhms(row.Screen_Duration),
      center: true,
      sortable: true,
    },
    {
      name: ' Overall Duration',
      selector: (row) => secondsToDhms1(row.Overall_Duration),
      center: true,
      sortable: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  const removeDIData = () => {
    if(message.trim() == ''){
      toast.warning('Cancel Remarks Required for Trip Rejection..')
      return false
    }

    console.log(currentDicData,'currentDicData')

    let SAPData = new FormData()
    SAPData.append('TRIP_SHEET', currentDicData.trip_sheet_no)
    SAPData.append('VEHICLE_NO', currentDicData.vehicle_number)
    SAPData.append('Flag', 1)

    let LPData = new FormData()
    LPData.append('tripsheet_no', currentDicData.trip_sheet_no)
    LPData.append('update_by', user_id)
    LPData.append('pyg_id', currentDicData.pid)
    LPData.append('status', 1)

    let formData = new FormData()
    formData.append('dic_id', currentDICId)
    formData.append('cancel_remarks', message)
    formData.append('cancel_by', user_id)

    if(currentDicData.sap_flag == 0){
      setFetch(false)
      TripSheetInfoService.UpdateTSInfoToSAP(SAPData).then((response) => {
        console.log(response, 'UpdateTSInfoToSAP')
        if (response.data && (response.data[0].STATUS == 1)) {
          toast.success(`${response.data[0].MESSAGE} for the Tripsheet : ${currentDicData.trip_sheet_no}`)
          TripSheetCreationService.updateSAPTripFlagRequest(LPData).then((rest) => {

            if (rest.status == 200) {
              DieselIntentCreationService.cancelDieselIndentRequest(formData).then((res) => {
                console.log(res,'cancelTripRequest')
                setFetch(true)
                if (res.status == 200) {
                  Swal.fire({
                    title: res.data.message,
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
                    title: 'SAP Flag Upation Failed in LP.. Kindly Contact Admin!',
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
            } else {
              setFetch(true)
              Swal.fire({
                title: 'Diesel Indent Cannot Be Cancelled in LP.. Kindly Contact Admin!',
                icon: "warning",
                confirmButtonText: "OK",
              }).then(function () {
                // window.location.reload(false)
              })
            }
          })
          .catch((error) => {
            setFetch(true)
            toast.warning(error)
          })

        } else if (response.data.STATUS == 3) {
          setFetch(true)
          toast.success(`${response.data[0].MESSAGE}. Kindly verify the Tripsheet and Vehicle Number`)
          return false
        } else {
          setFetch(true)
          toast.warning('SAP Flag : Change Status Action Failed. Kindly Contact Admin..!')
          return false
        }
      })
    } else {
      setFetch(false)
      DieselIntentCreationService.cancelDieselIndentRequest(formData).then((res) => {
        console.log(res,'cancelTripRequest')
        setFetch(true)
        if (res.status == 200) {
          Swal.fire({
            title: res.data.message,
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
            title: 'Diesel Indent Cannot Be Cancelled in LP.. Kindly Contact Admin!',
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

  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>
        {screenAccess ? (
         <>
          <CCard className="mt-4">
            <CContainer className="mt-1">
              <CustomTable
                columns={columns}
                data={rowData}
                fieldName={'Diesel_intent_Confirmation'}
                showSearchFilter={true}
              />
              <hr></hr>
            </CContainer>
          </CCard>
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
                setCurrentDICId('')
                setMessage('')
              }}
            >
              <CModalHeader>
                <CModalTitle>Are you sure to cancel the Trip ?</CModalTitle>
              </CModalHeader>
              <CModalBody>

                <CRow className="mt-3">

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
                    setCurrentDICId('')
                    setMessage('')
                    removeDIData()
                  }}
                >
                  Yes
                </CButton>
                <CButton
                  className="m-2"
                  color="warning"
                  onClick={() => {
                    setDeleteModalEnable(false)
                    setCurrentDICId('')
                    setMessage('')
                    // removeBDCData()
                  }}
                >
                  No
                </CButton>

              </CModalFooter>
            </CModal>
          {/* *********************************************************** */}
         </>) : (<AccessDeniedComponent />)}
       </>
      )}
    </>
  )
}

export default NlmtDICancelHome
