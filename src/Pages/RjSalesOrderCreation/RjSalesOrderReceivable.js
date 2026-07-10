import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCardImage,
  CModalFooter,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CAlert,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import CustomTable from 'src/components/customComponent/CustomTable'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import RakeVendorMasterService from 'src/Service/RakeMovement/RakeMaster/RakeVendorMasterService'
import VehicleRequestMasterService from 'src/Service/VehicleRequest/VehicleRequestMasterService'
import DepartmentApi from 'src/Service/SubMaster/DepartmentApi'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import VehicleVarietyService from 'src/Service/SmallMaster/Vehicles/VehicleVarietyService'
import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
import Swal from 'sweetalert2'
import RJSaleOrderCreationService from 'src/Service/RJSaleOrderCreation/RJSaleOrderCreationService'

const RjSalesOrderReceivable = () => {

  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [documentSrc, setDocumentSrc] = useState('')
  const [locationData, setLocationData] = useState([])
  let viewData = []

  function changeVendorStatus(id) {
    RakeVendorMasterService.deleteRakeVendor(id).then((res)=>{
      toast.success('Vendor Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const user_divisions = []
  const navigation = useNavigate()

  console.log(user_info)

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Divisions From Local Storage */
  const user_division_id = user_info.is_admin == 1 ? 1 : user_info.division_info.id

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id
  const user_emp_id = user_info.empid

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/

  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.RJSOModule.RJSO_Account_Receivable

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

  const [VRData, setVRData] = useState([])
  const [divisionData, setDivisionData] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [purposeData, setPurposeData] = useState([])
  const [productData, setProductData] = useState([])
  const [currentVRId, setCurrentVRId] = useState('')
  const [currentRjsoId, setCurrentRjsoId] = useState('')
  const [vrModalEnable, setVrModalEnable] = useState(false)
  const [rjsoModalEnable, setRjsoModalEnable] = useState(false)
  const [vrDeleteModalEnable, setVrDeleteModalEnable] = useState(false)
  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [vehicleVariety, setVehicleVariety] = useState([])
  const [vehicleBody, setVehicleBody] = useState([])
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const REQ = () => <span className="text-danger"> * </span>
  const [message, setMessage] = useState('')
  const handleChangeRemarks = (event) => {
    let val = event.target.value.trimStart()
    const result = val.toUpperCase()
    console.log('value.message', message)
    setMessage(result)
  }

  useEffect(() => {

    /* section for getting Division Data from database */
    DivisionApi.getDivision().then((rest) => {

      let tableData = rest.data.data
      console.log(tableData)
      setDivisionData(tableData)
    })

    /* section for getting Department Data from database */
    DepartmentApi.getDepartment().then((rest) => {
      // setFetch(true)
      let tableData = rest.data.data
      console.log(tableData)
      setDepartmentData(tableData)
    })

    /* section for getting VR Purpose Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(29).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'VR Purpose Lists')
      setPurposeData(viewData)
    })

    /* section for getting VR Product Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(30).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'VR Product Lists')
      setProductData(viewData)
    })

    //section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setVehicleCapacity(res.data.data)
    })

    VehicleBodyTypeService.getVehicleBody().then((res) => {
      setVehicleBody(res.data.data)
    })

    //section for getting vehicle variety from database
    VehicleVarietyService.getVehicleVariety().then((res) => {
      setVehicleVariety(res.data.data)
    })

  }, [])

  useEffect(() => {

    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      console.log(res.data.data,'location data')
      setLocationData(res.data.data)
    })

  }, [])

  const veh_variety_finder = (variety) => {
    let vari = ''
    if(vehicleVariety.length > 0){
      vehicleVariety.map((vv,kk)=>{
        if(variety == vv.id){
          vari = vv.vehicle_variety
        }
      })
    }
    return vari
  }

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

  const veh_body_finder = (body) => {
    let bod = ''
    if(vehicleBody.length > 0){
      vehicleBody.map((vv,kk)=>{
        if(body == vv.id){
          bod = vv.body_type
        }
      })
    }
    return bod
  }

  const div_finder = (division) => {
    let div = ''
    if(divisionData.length > 0){
      divisionData.map((vv,kk)=>{
        if(division == vv.id){
          div = vv.division
        }
      })
    }
    return div
  }

  const purp_finder = (purpose) => {
    let purp = ''
    if(purposeData.length > 0){
      purposeData.map((vv1,kk1)=>{
        if(purpose == vv1.definition_list_code){
          purp = vv1.definition_list_name
        }
      })
    }
    return purp
  }

  const dep_finder = (department) => {
    let dep = ''
    if(departmentData.length > 0){
      departmentData.map((vv,kk)=>{
        if(department == vv.id){
          dep = vv.department
        }
      })
    }
    return dep
  }

  const prod_finder = (product) => {
    let dep = ''
    if(productData.length > 0){
      productData.map((vv,kk)=>{
        if(product == vv.definition_list_code){
          dep = vv.definition_list_name
        }
      })
    }
    return dep
  }

  const VR_Waiting_TS_Status_Array =
  [
    "",
    "PYG Done",
    "DOC. Verify Done",
    "TS Created",
    "Expense Closure",
    "Income Closure",
    "Settlement Closure"
  ]

  const VR_Waiting_Status_Array =
  [
    "",
    "NLLD Confirm.",
    "Vehicle Assigned",
    "Cancelled",
    "Closed"
  ]

  const display_modal_values = (type) => {
    let needed_data = ''
    let current_vr_data = ''

    VRData.map((vh,kh)=>{
      if(currentRjsoId == vh.id){
        current_vr_data = vh
      }
    })
    console.log(current_vr_data,'current_vr_data')
    if(current_vr_data != ''){
      if(type == 1){
        needed_data = current_vr_data.vehicle_info.vehicle_number
      } else if(type == 2){
        needed_data = current_vr_data.tripsheet_id
      } else if(type == 3){
        needed_data = current_vr_data.payment_terms == 1 ? 'Shed' : 'Topay'
      } else if(type == 4){
        needed_data = current_vr_data.customer_code
      } else if(type == 5){
        needed_data = current_vr_data.customer_info ? current_vr_data.customer_info.customer_name : '-'
      } else if(type == 6){
        needed_data = current_vr_data.customer_info ? current_vr_data.customer_info.customer_mobile_number : '-'
      } else if(type == 7){
        needed_data = current_vr_data.hsn_info ? current_vr_data.hsn_info.definition_list_name : '-'
      } else if(type == 8){
        needed_data = current_vr_data.material_descriptions
      } else if(type == 9){
        needed_data = `${current_vr_data.order_qty} - ${current_vr_data.uom_info ? current_vr_data.uom_info.uom : ''}`
      } else if(type == 10){
        needed_data = current_vr_data.freight_income
      } else if(type == 11){
        needed_data = current_vr_data.advance_amount
      } else if(type == 12){
        needed_data = current_vr_data.balance_amount
      } else if(type == 13){
        needed_data = current_vr_data.last_Delivery_point
      } else if(type == 14){
        needed_data = current_vr_data.empty_load_km
      } else if(type == 15){
        needed_data = current_vr_data.loading_point
      } else if(type == 16){
        needed_data = current_vr_data.unloading_point
      } else if(type == 17){
        needed_data = current_vr_data.empty_km_after_unloaded
      } else if(type == 18){
        needed_data = current_vr_data.expected_delivery_date_time
      } else if(type == 19){
        needed_data = current_vr_data.expected_return_date_time
      } else if(type == 20){
        needed_data = current_vr_data.remarks
      } else if(type == 21){
        needed_data = current_vr_data.hsn_code
      }
    }
    return needed_data
  }

  const removeVRData = () => {
    if(message.trim() == ''){
      toast.warning('Cancel Remarks Required for Vehicle Request Rejection..')
      return false
    }

    let formData = new FormData()
    formData.append('id', currentRjsoId)
    formData.append('cancel_remarks', message)
    formData.append('cancel_by', user_id)
    setFetch(false)
    RJSaleOrderCreationService.rjsoRequestFormCancellation(formData).then((res) => {
      console.log(res,'rjsoRequestFormCancellation')
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: 'RJSO Request Cancelled Successfully!',
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        });
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.messagge,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        });
      } else {
        Swal.fire({
          title: 'Vehicle Request Cannot Be Cancelled in LP.. Kindly Contact Admin!',
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
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

  const WaitingStatusFinder = (s1,s2) => {
    let status = ''
    if(s1 == 2){
      status = s2 ? VR_Waiting_TS_Status_Array[s2] : VR_Waiting_Status_Array[s1]
    } else {
      status = VR_Waiting_Status_Array[s1]
    }
    return status
  }

  useEffect(()=>{
    RJSaleOrderCreationService.getRjsoRequestForms().then((response)=>{
      setFetch(true)
      viewData = response.data.data
      setVRData(viewData)
      console.log(viewData,'getRjsoRequestForms')
      console.log(user_info.is_admin,'user_info.is_admin')
      console.log(user_division_id,'user_division_id')
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          tr_no: data.tripsheet_id,
          veh_no: data.vehicle_info.vehicle_number,
          dr_name: data.driver_info.driver_name,
          cus_code: data.customer_code,
          cus_name: data.customer_info.customer_name,
          freight: data.freight_income,
          rjshed_copy: (
            <a style={{color:'black'}} target='_blank' rel="noreferrer" href={data.rj_shed_copy}>
              <i className="fa fa-eye" aria-hidden="true"></i>
            </a>
          ),
          Creation_Date: data.created_at_formated,
          Action: (
            <div className="d-flex justify-content-space-between">
              <Link to={`RJSOEdit/${data.id}`}>
                <CButton
                  // disabled={data.vr_status === 1 ? false : true}
                  size="sm"
                  color={"secondary"}
                  shape="rounded"
                  id={data.id}
                  className="m-1"
                  type="button"
                >
                  <i className="fa fa-edit" aria-hidden="true"></i>
                </CButton>
              </Link>
              {/* <CButton
                size="sm"
                className="m-1"
                shape="rounded"
                color="info"
                onClick={(e) =>
                  {
                    setCurrentRjsoId(data.id)
                    // setVrModalEnable(true)
                    setRjsoModalEnable(true)
                  }
                }
              >
                <i className="fa fa-edit"  aria-hidden="true"></i>
              </CButton> */}
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                onClick={(e) =>
                  {
                    setCurrentRjsoId(data.id)
                    setVrDeleteModalEnable(true)
                  }
                }
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              {/* /RJSOEdit/ */}
              {/* {data.vr_status === 1 && (
                <>
                  <Link to={data.vr_status === 1 ? `VehicleRequest/${data.vr_id}` : ''}>
                    <CButton
                      disabled={data.vr_status === 1 ? false : true}
                      size="sm"
                      color={"secondary"}
                      shape="rounded"
                      id={data.vr_id}
                      className="m-1"
                      type="button"
                    >
                      <i className="fa fa-edit" aria-hidden="true"></i>
                    </CButton>
                  </Link>
                </>
              )} */}
            </div>
          ),
        })
      })
      setRowData(rowDataList)
    })
  },[mount,divisionData,purposeData])

  // ============ Column Header Data =======

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet No.',
      selector: (row) => row.tr_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.veh_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.dr_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Code',
      selector: (row) => row.cus_code,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Name',
      selector: (row) => row.cus_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight',
      selector: (row) => row.freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Copy',
      selector: (row) => row.rjshed_copy,
      sortable: true,
      center: true,
    },
    {
      name: 'Requested Date',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  //============ column header data=========

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CRow className="mt-1 mb-1">
                <CCol
                  className="offset-md-6"
                  xs={15}
                  sm={15}
                  md={6}
                  style={{ display: 'flex', justifyContent: 'end' }}
                >
                  <Link className="text-white" to="/RjSalesOrderCreation">
                    <CButton size="sm" color="warning" className="px-5 text-white" type="button">
                      NEW
                    </CButton>
                  </Link>
                </CCol>
              </CRow>
              <CCard>
                <CContainer>
                  <CustomTable
                    columns={columns}
                    data={rowData}
                    fieldName={'vehicle_Number'}
                    showSearchFilter={true}
                  />
                </CContainer>
              </CCard>
              {/* ======================= VR Modal Area ========================== */}
                <CModal
                  visible={rjsoModalEnable}
                  backdrop="static"
                  size="lg"
                  // scrollable
                  onClose={() => {
                    setRjsoModalEnable(false)
                    setCurrentRjsoId('')
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>RJSO Request Information</CModalTitle>
                  </CModalHeader>
                  <CModalBody>

                    {/* <CRow className="mt-3">

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Vehicle Number</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(1)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Tripsheet Number</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(2)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Payment Terms</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(3)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Material Type</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(7)}
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Customer Name</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          // value={`${display_modal_values(5)} / ${display_modal_values(6)}`}
                          value={display_modal_values(5)}
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Customer Code</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(4)}
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Contact No</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(6)}
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Material Desc.</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(8)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Order Qty</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(9)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Freight Income</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(10)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Advance Amount</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(11)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Balance Amount</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(12)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Last Delivery Point</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(13)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Empty Load KM</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(14)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Loading Point</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(15)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Unloading Point</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(16)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Empty Km After Unload</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(17)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Expected Delivery Time</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(18)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Expected Return Time</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(19)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Remarks</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(20)}
                          readOnly
                        />
                      </CCol>
                    </CRow> */}
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setRjsoModalEnable(false)
                        setCurrentRjsoId('')
                        // removeBDCData()
                      }}
                    >
                      Close
                    </CButton>

                  </CModalFooter>
                </CModal>
              {/* *********************************************************** */}
              {/* ======================= VR Delete Modal Area ========================== */}
                <CModal
                  visible={vrDeleteModalEnable}
                  backdrop="static"
                  size="lg"
                  // scrollable
                  onClose={() => {
                    setVrDeleteModalEnable(false)
                    setCurrentRjsoId('')
                    setMessage('')
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>Are you sure to cancel the RJSO request ?</CModalTitle>
                  </CModalHeader>
                  <CModalBody>

                    <CRow className="mt-3">

                    <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Vehicle Number</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(1)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Tripsheet Number</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(2)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Payment Terms</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(3)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Material Type</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(7)}
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Customer Name</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          // value={`${display_modal_values(5)} / ${display_modal_values(6)}`}
                          value={display_modal_values(5)}
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Customer Code</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(4)}
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Contact No</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(6)}
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Material Desc.</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(8)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">HSN Code</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(21)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Order Qty</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(9)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Freight Income</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(10)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Advance Amount</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(11)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Balance Amount</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(12)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Last Delivery Point</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(13)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Empty Load KM</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(14)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Loading Point</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(15)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Unloading Point</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(16)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Empty Km After Unload</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(17)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Expected Delivery Time</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(18)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Expected Return Time</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(19)}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="fnr_no">Remarks</CFormLabel>
                        <CFormInput
                          size="sm"
                          className="mb-2"
                          id="fnr_no"
                          value={display_modal_values(20)}
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
                        setVrDeleteModalEnable(false)
                        setCurrentRjsoId('')
                        removeVRData()
                      }}
                    >
                      Yes
                    </CButton>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setVrDeleteModalEnable(false)
                        setCurrentRjsoId('')
                        setMessage('')
                        // removeBDCData()
                      }}
                    >
                      No
                    </CButton>

                  </CModalFooter>
                </CModal>
              {/* *********************************************************** */}
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
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default RjSalesOrderReceivable
