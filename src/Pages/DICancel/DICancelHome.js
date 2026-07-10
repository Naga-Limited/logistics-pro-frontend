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
import NLFSDieselIntentService from 'src/Service/NLFS/Master/NLFSDieselIntentService';
import NLFSDivisionApi from 'src/Service/NLFS/Master/NLFSDivisionApi';
import DropdownListApi from 'src/Service/NLFS/Master/DropdownListApi';
import NLFSVehicleMasterApi from 'src/Service/NLFS/Master/NLFSVehicleMasterApi';

const DICancelHome = () => {
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
  const [row1Data, setRow1Data] = useState([])
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
  const [divisionData, setDivisionData] = useState([])
  const [plantData, setPlantData] = useState([])
  const [otherDivisionVehicleMasterData, setOtherDivisionVehicleMasterData] = useState([])

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

  const DieselFor = ['','Vehicle','Barel','Others','Car']
  const [cancelType,setCancelType] = useState(1)

  const loadNLFSDICreation = () => {
    NLFSDieselIntentService.getVehicleReadyToDIConfirm().then((res) => {
      let view_data = res.data.data
      let rowDataList = []
      console.log(view_data,'getVehicleReadyToDIConfirm')
      view_data.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          DI_No: data.di_no,
          DI_Date: data.created_at, 
          Fuel_For: DieselFor[data.diesel_to], 
          Vehicle_No: (data.diesel_to == 1 ||  data.diesel_to == 4) ? data.vehicle_no : data.carry_vehicle, 
          Division: vehicleDivisionFinder(data.division_id), 
          Plant: vehiclePlantFinder(data.plant_id), 
          User: data.vehicle_user_name, 
          Waiting_At: <span className="badge rounded-pill bg-info">
            {data.status == 1
                ? 'DI Confirmation'
                : data.status == 2
                ? 'DI Approval'                 
                :'DI Creation'
            }
          </span>, 
           
          Action: ( 
            <div className="d-flex justify-content-space-between">     
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                id={data.id}
                onClick={(e) =>
                  {
                    setCancelType(2)
                    setCurrentDICId(data.id)
                    setDeleteModalEnable(true)
                  }
                } 
              >               
                <i className="fa fa-trash" aria-hidden="true"></i> 
              </CButton>
            </div>
          ),
        })
      })
      setRow1Data(rowDataList)
    })

  }
  const loadVehicleReadyToTrip = () => {
    DieselIntentCreationService.getVehicleReadyToDieselConfirm().then((res) => {
      setFetch(true)
      console.log(res.data,'getVehicleReadyToDieselConfirm')
      tableData = res.data
      let rowDataList = []
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1 && data.parking_status != 19
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
                    setCancelType(1)
                    setCurrentDICId(data.id)
                    setDeleteModalEnable(true)
                  }
                } 
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
    
  },[])

  useEffect(() => {
     
    loadNLFSDICreation()

    //section for getting Divisions Data from database
    NLFSDivisionApi.getActiveDivisions().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'getActiveDivisions')
      setDivisionData(viewData)
    })

    /* Fetch Plant For data */
    DropdownListApi.visibleDropdownsListByDropdown(5).then((response) => {
      setFetch(true)
      let needed_data = response.data.data
      console.log(needed_data,'getPlantData')
      setPlantData(needed_data)
    })
  }, [divisionData.length == 0,plantData.length == 0]) 

  const vehicleDivisionFinder = (veh) => {
    console.log(divisionData,'divisionData') 
    let vehdiv = '-' 
    divisionData.map((vk,kk)=>{
      if(vk.division_id == veh)
      {
        vehdiv = vk.short_name
      }
    }) 
    return vehdiv 
  }

  const vehiclePlantFinder = (veh) => {
    console.log(plantData,'plantData')
    let plant_name = '-'
    plantData.map((vk,kk)=>{
      if(vk.dropdown_list_id == veh)
      {
        plant_name = vk.short_name
      }
    }) 
    return plant_name
  }


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
      name: 'Tripsheet No.',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'TS Date',
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
      name: 'Cur. Status',
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

  const columns1 = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'DI No.',
      selector: (row) => row.DI_No,
      sortable: true,
      center: true,
    },
    {
      name: 'DI Date',
      selector: (row) => row.DI_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Fuel For',
      selector: (row) => row.Fuel_For,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No.',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Division',
      selector: (row) => row.Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Plant',
      selector: (row) => row.Plant,
      sortable: true,
      center: true,
    },
    {
      name: 'User',
      selector: (row) => row.User,
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
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },    
  ]

  const removeNLFSDIData = () => {
    if(message.trim() == ''){
      toast.warning('Cancel Remarks Required for DI Rejection..')
      return false
    }

    let formData = new FormData()
    formData.append('dic_id', currentDICId) 
    formData.append('cancellation_remarks', message)
    formData.append('cancelled_by', user_id)

    NLFSDieselIntentService.cancelDieselIndentRequest(formData).then((res) => {
      console.log(res,'cancelDieselIndentRequest')
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
         <h1></h1>
          <CCard>
            <CContainer>
              <CustomTable
                columns={columns}
                data={rowData}
                fieldName={'Diesel_intent_Confirmation'}
                showSearchFilter={true}
              />
               
            </CContainer>
          </CCard>
          
          <CCard>
            <CContainer>
              <h3>Non Tripsheets</h3>
              <CustomTable
                columns={columns1}
                data={row1Data}
                fieldName={'Driver_Name'}
                showSearchFilter={true}
                // pending={pending}
              />
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

                  <CCol xs={12} md={6}>
                    <CFormLabel htmlFor="remarks">Cancel Remarks <REQ /></CFormLabel>
                    {/* ================ Remarks Textbox Enter CAPS Start ============*/}
                      <CFormTextarea
                        name="remarks"
                        id="remarks"
                        value={message}
                        rows="3"
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
                    cancelType == 1 ? removeDIData() : removeNLFSDIData()
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

export default DICancelHome
