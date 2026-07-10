import {
  CButton,
  CCard,
  CCol, 
  CForm,
  CFormInput,
  CFormLabel, 
  CRow,
  CTabContent, 
  CTabPane, 
  CModal, 
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CModalHeader,
  CModalTitle,
  CAlert, 
} from '@coreui/react'
import React, { useState,useEffect } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import VehicleInspectionValidation from 'src/Utils/TransactionPages/VehicleInspection/VehicleInspectionValidation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader' 
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService' 
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes' 
import Swal from 'sweetalert2'; 
import NlmtTSCreationService from 'src/Service/Nlmt/TSCreation/NlmtTSCreationService'
import CustomTable from 'src/components/customComponent/CustomTable'
import { getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import NlmtTSFreightUpdationService from 'src/Service/Nlmt/FreightUpdation/NlmtTSFreightUpdationService'

const NlmtFreightUpdationApproval = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)

  let page_no = NlmtScreenAccessCodes.NlmtTransactionScreens.Nlmt_Freight_Updation_Approval

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
 
  const [rowData, setRowData] = useState([])
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState('')

  const formValues = {
    vehicle_id: '',
    truck_clean: '',
    bad_smell: '',
    insect_vevils_presence: '',
    tarpaulin_srf: '',
    tarpaulin_non_srf: '',
    insect_vevils_presence_in_tar: '',
    truck_platform: '',
    previous_load_details: '',
    remarks: '',
  }

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(FreightUpdationRejection, VehicleInspectionValidation, formValues)

  const navigation = useNavigate()

  const getOldLogInfo = () => {
    let data = [] 
    let temp = currentVehicleInfo.tripsheet_info.freight_log_info ? JSON.parse(currentVehicleInfo.tripsheet_info.freight_log_info) : []
    console.log(temp,'getOldLogInfo') 
    temp.map((vk,kk)=>{
      data[kk] = vk 
    }) 
    console.log(data,'getOldLogInfo-data')
    return data
  }

  function FreightUpdationRejection() {
    const formDataUpdate = new FormData()
    formDataUpdate.append('id', currentVehicleInfo.tripsheet_id)
    formDataUpdate.append('updated_by', user_id)
    formDataUpdate.append('remarks', remarks)

    let current_time = getCurrentDateTime()
    let current_info = getOldLogInfo()
    current_info.push({
      route_id: currentVehicleInfo.tripsheet_info.route_id ?? '',
      freight_rate: currentVehicleInfo.tripsheet_info.trip_freight_rate ?? '', 
      freight_change: 1, 
      updated_freight_rate: currentVehicleInfo.tripsheet_info.trip_updated_freight_rate ?? '', 
      type: 3, /* Rejection */
      user: user_id,
      time: current_time,
      remarks: remarks,
    })
    formDataUpdate.append('freight_log_info', JSON.stringify(current_info))

    NlmtTSFreightUpdationService.rejectFreightUpdationApprovalData(formDataUpdate).then((res) => {
      console.log(res)
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: "Freight Updation Rejected Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/NlmtFreightApproval')
        });
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        });
      } else {
        toast.warning(
          'NLMT Freight Approval Cannot Be Rejected From LP.. Kindly Contact Admin!'
        )
      }
    })
    .catch((error) => {
      setFetch(true) 
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

  function FreightUpdationSubmission() {
    const formDataUpdate = new FormData()
    formDataUpdate.append('id', currentVehicleInfo.tripsheet_id)
    formDataUpdate.append('updated_by', user_id)
    formDataUpdate.append('remarks', remarks)

    let current_time = getCurrentDateTime()
    let current_info = getOldLogInfo()
    current_info.push({
      route_id: currentVehicleInfo.tripsheet_info.route_id ?? '',
      freight_rate: currentVehicleInfo.tripsheet_info.trip_freight_rate ?? '', 
      freight_change: 1, 
      updated_freight_rate: currentVehicleInfo.tripsheet_info.trip_updated_freight_rate ?? '', 
      type: 2, /* Approved */
      user: user_id,
      time: current_time,
      remarks: remarks,
    })
    formDataUpdate.append('freight_log_info', JSON.stringify(current_info))

    NlmtTSFreightUpdationService.approveFreightUpdationApprovalData(formDataUpdate).then((res) => {
      console.log(res)
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: "Freight Updation Approved Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/NlmtFreightApproval')
        });
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        });
      } else {
        toast.warning(
          'NLMT Freight Approval Cannot Be Rejected From LP.. Kindly Contact Admin!'
        )
      }
    })
    .catch((error) => {
      setFetch(true) 
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

  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [fetch, setFetch] = useState(false)
  const [confirmBtn, setConfirmBtn] = useState(false)
  const [confirmBtn1, setConfirmBtn1] = useState(false)

  const { id } = useParams()

  const LogType = ['No Need','Creation','Approval','Rejection','Re-Request','Advance Completed']
  const [userMasterData, setUserMasterdata] = useState([])

  const userNameFinder = (id) => {
    console.log(id,'userNameFinder-id')
    console.log(userMasterData,'userNameFinder-data')
    let uname = ''
    if(id == 1){
      uname = 'Admin'
    } else {
      userMasterData.map((vv,kk)=>{
        if(vv.user_id == id){
          uname = vv.emp_name
        }
      })
    }
    return uname
  }

  useEffect(() => {

    NlmtTSCreationService.getTripsheetInfoById(id).then((res) => {
      setFetch(true)
      console.log(res.data,'getTripsheetInfoById')
      values.driverId = res.data.data.driver_id
      values.Division = res.data.data.trip_sheet_info?.to_divison
      values.purpose = res.data.data.trip_sheet_info?.purpose 
      values.rmsto_type = res.data.data.trip_sheet_info?.rmsto_type
      values.freight_rate_per_tone = res.data.data.trip_sheet_info?.freight_rate_per_tone
      values.advance_amount = res.data.data.trip_sheet_info?.advance_amount
      values.advance_payment_diesel = res.data.data.trip_sheet_info?.advance_payment_diesel 

      let rowDataList = []
      const Log_Info = res.data.data.tripsheet_info.freight_log_info ?? '[{}]'

      // Convert JSON string to JavaScript array
      const log_info_array = JSON.parse(Log_Info)

      console.log(log_info_array,'freight_log_info-array')

      log_info_array.forEach((item, index) => {
        let log_info_object = {}
        log_info_object.S_NO = index + 1
        log_info_object.Type = LogType[item.type] || ''
        log_info_object.remarks = item.remarks
        log_info_object.FreightRate = item.freight_rate
        log_info_object.UpdatedFreightRate = item.updated_freight_rate
        log_info_object.User = userNameFinder(item.user)
        log_info_object.DateTime = item.time
        rowDataList.push(log_info_object)
      })

      setRowData(rowDataList)      
      setRemarks(res.data.data.trip_sheet_info?.remarks)
      values.vehicle_sourced_by = res.data.data.trip_sheet_info?.vehicle_sourced_by
      setCurrentVehicleInfo(res.data.data)
      console.log(res.data.data)
    })

    UserLoginMasterService.getUser().then((res) => {
      let viewData = res.data.data
      setUserMasterdata(viewData)
    },[])
  }, [id, userMasterData.length == 0])

  const [remarks, setRemarks] = useState('');
    const handleChangenew = event => {
    const result = event.target.value.toUpperCase();

    setRemarks(result);

  }

  const [vehicleCapacity, setVehicleCapacity] = useState([]) 

  useEffect(() => {
    // section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setFetch(true)
      setVehicleCapacity(res.data.data)
    })
  }, [])

   /* Ask Part Start */

   const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
  ) 

  const veh_capacity_finder = (capacity) => {
    let cap = ''
    if(vehicleCapacity.length > 0){
      vehicleCapacity.map((vv,kk)=>{
        if(capacity == vv.id){
          cap = vv.capacity
        }
      })
    }
    return cap
  }

  const RejectionProcess = () => {
    console.log(remarks,'apremarks')
    if (remarks && remarks.trim()) {
      setConfirmBtn1(true)
    } else {
      setFetch(true)
      Swal.fire({
        title: 'Remarks required for rejection..',
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
      })
      setRemarks('')
      return false
    }
  }

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.S_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'Type',
      selector: (row) => row.Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Rate',
      selector: (row) => row.FreightRate,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Modified Freight Rate',
      selector: (row) => row.UpdatedFreightRate,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Remarks',
      selector: (row) => row.remarks,
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
      name: 'Time',
      selector: (row) => row.DateTime,
      sortable: true,
      center: true,
    }
  ]

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
          <>
            <CCard>
              <CTabContent>
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                  <CForm className="container p-3" onSubmit={handleSubmit}>
                    <CRow className="">                       

                      <CCol md={3}>
                        <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                        <CFormInput
                          name="vNum"
                          size="sm"
                          id="vNum"
                          value={currentVehicleInfo.vehicle_info ? currentVehicleInfo.vehicle_info.vehicle_number : '-'}
                          placeholder=""
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="vNum">Tripsheet Number</CFormLabel>
                        <CFormInput
                          name="vNum"
                          size="sm"
                          id="vNum"
                          value={currentVehicleInfo?.tripsheet_info?.nlmt_tripsheet_no}
                          placeholder=""
                          readOnly
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel htmlFor="vNum">Vehicle Capacity In MTS</CFormLabel>
                        <CFormInput
                          name="vNum"
                          size="sm"
                          id="vNum"
                          value={currentVehicleInfo.vehicle_info ? veh_capacity_finder(currentVehicleInfo.vehicle_info.vehicle_capacity_id) : '-'}
                          placeholder=""
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="driverId">
                          Driver Name
                          {errors.driverId && (
                            <span className="small text-danger">{errors.driverId}</span>
                          )}
                        </CFormLabel>

                        <CFormInput
                          name="driverId"
                          size="sm"
                          id="driverId"
                          value={currentVehicleInfo?.driver_name}
                          placeholder="10"
                          readOnly
                        />
  
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dMob">Driver Contact Number</CFormLabel>
                        <CFormInput
                          name="dMob"
                          size="sm"
                          id="dMob"
                          value={currentVehicleInfo?.driver_phone_1}
                          readOnly
                        />
                      </CCol> 
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dMob">Vendor Name</CFormLabel>
                        <CFormInput
                          name="dMob"
                          size="sm"
                          id="dMob"
                          value={currentVehicleInfo?.vendor_info?.owner_name}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dMob">Vendor Code</CFormLabel>
                        <CFormInput
                          name="dMob"
                          size="sm"
                          id="dMob"
                          value={currentVehicleInfo?.vendor_info?.vendor_code}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dMob">Vendor PAN No.</CFormLabel>
                        <CFormInput
                          name="dMob"
                          size="sm"
                          id="dMob"
                          value={currentVehicleInfo?.vendor_info?.pan_card_number}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="rjShedCopy">
                         TDS Declaration Copy
                        </CFormLabel>
                        
                        <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                          <span className="float-start">
                            <a style={{color:'black'}} target='_blank' rel="noreferrer" href={currentVehicleInfo.vendor_info?.tds_dec_form_front}>
                              <i className="fa fa-eye" aria-hidden="true">&nbsp;View</i>
                            </a>
                          </span> 
                        </CButton> 
  
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dMob">Trip Route</CFormLabel>
                        <CFormInput
                          name="dMob"
                          size="sm"
                          id="dMob"
                          value={currentVehicleInfo?.tripsheet_info?.trip_vehicle_route?.route_name}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dMob">Trip Freight Rate</CFormLabel>
                        <CFormInput
                          name="dMob"
                          size="sm"
                          id="dMob"
                          value={currentVehicleInfo?.tripsheet_info?.trip_freight_rate}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dMob">Modified Freight Rate</CFormLabel>
                        <CFormInput
                          name="dMob"
                          size="sm"
                          id="dMob"
                          value={currentVehicleInfo?.tripsheet_info?.trip_updated_freight_rate}
                          readOnly
                        />
                      </CCol>
                    </CRow> 
                    <ColoredLine color="red" /> 
                    <CRow key={`HireshipmentDeliveryData`} className="mt-2" hidden>
                      <CCol xs={12} md={6}>
                        <CFormLabel
                          htmlFor="inputAddress"
                          style={{
                            backgroundColor: '#4d3227',
                            color: 'white',
                          }}
                        >
                          Freight Update Process History
                        </CFormLabel>
                      </CCol>
                    </CRow>         
                             
                    <CustomTable
                      columns={columns}
                      pagination={false}
                      data={rowData}
                      fieldName={'Driver_Name'}
                      showSearchFilter={true}
                    />
                    <ColoredLine color="red" />
                    <CRow className="mt-2">
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dMob">Trip Remarks</CFormLabel>
                        <CFormInput
                          name="dMob"
                          size="sm"
                          id="dMob"
                          value={currentVehicleInfo?.tripsheet_info?.remarks}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="remarks">Approval Remarks</CFormLabel>
                        <CFormTextarea
                          id="remarks"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChangenew}
                          value={remarks}
                          name="remarks"
                          rows="1"
                        >
                        </CFormTextarea>
                      </CCol>

                    </CRow>
                    <CRow className="mt-2">
                      <CCol>
                        <Link to={'/NlmtFreightApproval'}>
                          <CButton
                            md={9}
                            size="sm"
                            color="primary"
                            disabled=""
                            className="text-white"
                            type="button"
                          >
                            Previous
                          </CButton>
                        </Link>
                      </CCol>

                      <CCol
                        className="pull-right"
                        xs={12}
                        sm={12}
                        md={3}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      > 
                        <CButton
                          size="sm"
                          color="success"
                          className="mx-1 px-2 text-white"
                          type="button" 
                          onClick={() => {
                            setConfirmBtn(true)
                          }}
                        >
                          Approve
                        </CButton>
                        <CButton
                          size="sm"
                          color="danger"
                          className="mx-1 px-2 text-white"
                          type="button" 
                          onClick={() => { 
                            RejectionProcess()
                          }}
                        >
                          Reject
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CTabPane>
              </CTabContent>
            </CCard>
          </>
          ) : (<AccessDeniedComponent />)}
   	    </>
      )}
      <CModal visible={confirmBtn} onClose={() => setConfirmBtn(false)}>
        <CModalBody>
          <p className="lead">Are You sure To Approve this freight updation ? </p>
        </CModalBody>
        <CModalFooter>
          <CButton className="m-2" color="secondary" onClick={() =>setConfirmBtn(false)}>
            No
          </CButton>
          <CButton color="warning" onClick={() => {
            setConfirmBtn(false)
            setFetch(false)
            FreightUpdationSubmission()}}>
            Yes
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={confirmBtn1} onClose={() => setConfirmBtn1(false)}>
        <CModalBody>
          <p className="lead" style={{ color:'red' }}>Are You sure To Reject this freight updation ? </p>
        </CModalBody>
        <CModalFooter>
          <CButton className="m-2" color="secondary" onClick={() =>setConfirmBtn1(false)}>
            No
          </CButton>
          <CButton 
            color="warning" 
            onClick={() => {
              setConfirmBtn1(false)
              setFetch(false)
              FreightUpdationRejection()
            }}>
            Yes
          </CButton>
        </CModalFooter>
      </CModal>
      {/* ERROR MODAL */}
      <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
        <CModalHeader>
          <CModalTitle>Error</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color="danger">{error}</CAlert>
        </CModalBody>
      </CModal>
    </>
  )
}

export default NlmtFreightUpdationApproval
