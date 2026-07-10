
/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CTableCaption,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CModal,
  CModalHeader,
  CModalTitle,
  CTabPane,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CFormFloating,
  CNavbar,
  CTableRow,
  CFormTextarea,
  CCardImage,
  CBadge,
  CInputGroup,
  CInputGroupText,
  CAlert,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import Loader from 'src/components/Loader'


import * as TripsheetClosureConstants from 'src/components/constants/TripsheetClosureConstants'

import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

import TripSheetClosureSapService from 'src/Service/SAP/TripSheetClosureSapService'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import FileResizer from 'react-image-file-resizer'
import ExpenseCalculations from 'src/Pages/TripsheetClosure/Calculations/ExpenseCalculations';
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService';
import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService';
import useFormDepoExpenseClosure from 'src/Hooks/useFormDepoExpenseClosure';
import LocationApi from 'src/Service/SubMaster/LocationApi';
import Swal from 'sweetalert2';
import IfoodsExpenseClosureService from 'src/Service/Ifoods/ExpenseClosure/IfoodsExpenseClosureService';

const IfoodsPaymentSubmission = () => {
  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()

  // console.log(user_info)

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  // const Expense_Income_Posting_Date = ExpenseIncomePostingDate();
  // console.log(Expense_Income_Posting_Date,'ExpenseIncomePostingDate')

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  const webcamRef = React.useRef(null);
  const [fileuploaded, setFileuploaded] = useState(false)
  const [camEnable, setCamEnable] = useState(false)
  const [camEnableType, setCamEnableType] = useState('')
  const [imgSrc, setImgSrc] = React.useState(null);
  const [locationData, setLocationData] = useState([])
  const [settlementAvailable, setSettlementAvailable] = useState(false)

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  /* Expense Constants Declaration */
  const [unloadingCharge, setUnloadingCharge] = useState('')
  const [subDeliveryCharge, setSubDeliveryCharge] = useState('')
  const [weighmentCharge, setWeighmentCharge] = useState('')
  const [freightCharge, setFreightCharge] = useState('')
  const [diversionCharge, setDiversionCharge] = useState('')
  const [haltingCharge, setHaltingCharge] = useState('')
  const [adjustedFreightCharge, setAdjustedFreightCharge] = useState('')

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  const [restrictScreenById, setRestrictScreenById] = useState(true)
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Payment_Submission
  const [visible, setVisible] = useState(false)
  const [visible1, setVisible1] = useState(false)

  const border = {
    borderColor: '#b1b7c1',
  }
  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      setLocationData(res.data.data,'LocationData')
    })

  },[])
  /* ==================== Access Part End ========================*/

  const formValues = {
    halt_days: '',
    remarks: '',
    apremarks: ''
  }

  const [plantMasterData, setPlantMasterData] = useState([])
  useEffect(() => {
    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
      console.log(response.data.data)
      setPlantMasterData(response.data.data)
    })
  }, [])


  /* Overall Journey Information Constants */
  const [pmData, setPMData] = useState([])

  const {
    values,
    errors,
    handleChange,
    isTouched,
    setIsTouched,
    setErrors,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
  } = useFormDepoExpenseClosure(login, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }

  const { id } = useParams()
  const [fetch, setFetch] = useState(false)

  const [approvalReject, setApprovalReject] = useState(false)
  const [expenseClosureApproval, setExpenseClosureApproval] = useState(false)
  const [fileImageKey, setFileImageKey] = useState('')

  const [shipmentInfo, setShipmentInfo] = useState([])
  const [rjsoInfo, setRjsoInfo] = useState([])
  const [stoTableData, setStoTableData] = useState([])
  const [stoTableDataRMSTO, setStoTableDataRMSTO] = useState([])
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
  );

  const [totalChargesDepo, setTotalChargesDepo] = useState('')

 const locationFinder = (data) =>{
  let location = ''
  let code = ''
  // console.log(data,'locationFinderData')
  locationData.map((val,ind)=>{
    if(val.id == data){
      location = val.location
      code = val.location_code
    }
  })

  let needed_data = (location != '' && code != '') ?  `${location} / ${code}` : ''

  return needed_data
 }

  /* ===================== The Constants Needed For First Render Part Start ===================== */

  const [mainKey, setMainKey] = useState(1)
  const [activeKey, setActiveKey] = useState(1)

  const [expenseClosureData, setExpenseClosureData] = useState([])
  const [flatShipment, setFlatShipment] = useState([])
  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */

  useEffect(() => {

    IfoodsExpenseClosureService.getClosureInfoById(id).then((res) => {
        setFetch(true)
        let closure_info_data = res.data.data
        console.log(closure_info_data,'closure_info_data')
        setExpenseClosureData(closure_info_data)
        let shipment_info_data = closure_info_data.shipment_parent_info
        setShipmentInfo(shipment_info_data)
        setUnloadingCharge(closure_info_data.unloading_charges)
        setSubDeliveryCharge(closure_info_data.sub_delivery_charges)
        setWeighmentCharge(closure_info_data.weighment_charges)
        setFreightCharge(closure_info_data.freight_charges)
        setAdjustedFreightCharge(closure_info_data.freight_adjustment)
        setDiversionCharge(closure_info_data.diversion_return_charges)
        setHaltingCharge(closure_info_data.halting_charges)
        setTotalChargesDepo(closure_info_data.total_expenses)
        values.halt_days = closure_info_data.halt_days
        values.remarks = closure_info_data.remarks
    })

      /* section for getting Shipment Routes For Shipment Creation from database */
      DefinitionsListApi.visibleDefinitionsListByDefinition(11).then((response) => {
        console.log(response.data.data)
        setPMData(response.data.data)
      })

   


  }, [id])

  useEffect(() => {
    IfoodsExpenseClosureService.getClosureInfoById(id).then((res) => {
      setFetch(true);
      const jsonString = res.data.data.trip_sheet_info.delivery_info;
     // const jsonWithoutPrefix = jsonString.substring(8);
    //  console.log(jsonWithoutPrefix);
  
      try {
        const data = JSON.parse(jsonString);
      //  console.log(jsonString);
  
        const flatShipments = data[0].flatMap((shipmentData) =>
          shipmentData.DELIVERY_COUNT.map((delivery) => ({
            SHIPMENT_OR_PO: shipmentData.SHIPMENT_OR_PO,
            DELIVERY_NO: delivery.DELIVERY_NO,
            CUSTOMER: delivery.CUSTOMER,
            OUTLET: delivery.OUTLET,
            ZZCRATE_NUMBER: delivery.ZZCRATE_NUMBER,
            QUANTITY: delivery.QUANTITY,
            NET_WEIGHT: delivery.NET_WEIGHT,
          }))
        );
  
        setFlatShipment(flatShipments)
        console.log(flatShipments)
      } catch (error) {
        // Handle JSON parsing error
        // console.error('Error parsing JSON:', error)
      }
    }, []);
  }, []);
  
 

  const DepoTripExpenseApprovalCancel = () => {
    console.log(values.apremarks,'apremarks')
    if (values.apremarks && values.apremarks.trim()) {
      console.log('iop')
      // setApprovalReject(true)
      expenseApproval(2)
    } else {
      setFetch(true)
      Swal.fire({
        title: 'You should give the proper reason for rejection via rejection remarks...',
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
      })
      values.apremarks = ''
      return false
    }
  }

  const expenseApproval = (type) => {
    /* Values Assigning To Save Details into DB Part Start*/

    const formData = new FormData()

    formData.append('approval_remarks', values.apremarks)
    formData.append('status', type == 1 ? 28 : 27)
    formData.append('approval_status', type == 1 ? 2 : 3)
    formData.append('closure_id', id)
    formData.append('updated_by', user_id)
    formData.append('parking_id', expenseClosureData.parking_yard_info.ifoods_parking_yard_gate_id)

    IfoodsExpenseClosureService.updateExpenseApproval(formData).then((res) => {
      setFetch(true)
      console.log(res,'updateExpenseApproval')
      if (res.status == 200) {
        setFetch(true)
        // toast.success('Depo Trip Expense Capture Process Done Successfully!')
        // navigation('/TSExpenseCapture')
        Swal.fire({
          icon: "success",
          title: type == 1 ? 'Trip Additional Expenses Approved Successfully..!' : 'Payment Submission Rejected Successfully..!',
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/IfoodsPaymentSubmissionHome')
        });
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        })
      } else {
        toast.warning('Additional Expenses Approval Cannot be Updated. Kindly contact Admin..!')
      }
    })
    .catch((errortemp) => {
      console.log(errortemp)
      setFetch(true)
      var object = errortemp.response.data.errors
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      }
      setError(output)
      setErrorModal(true)
    })

  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>

          {screenAccess ? (
            <>
              <CCard className="p-1">
                <CTabContent className="p-3">
                  <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={mainKey === 1}>
                    {/* Hire Vehicles Part Header Tab Start */}
                    <CNav variant="tabs" role="tablist">
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 1}
                          style={{ backgroundColor: 'green' }}
                          onClick={() => setActiveKey(1)}
                        >
                          General Information
                        </CNavLink>
                      </CNavItem>

                      <CNavItem>
                        <CNavLink
                          active={activeKey === 2}
                          style={{
                            backgroundColor: 'green'
                          }}
                          onClick={() => setActiveKey(2)}
                        >
                          Shipment Info
                        </CNavLink>
                      </CNavItem>

                      <CNavItem>
                        <CNavLink
                          active={activeKey === 3}
                          style={{ backgroundColor:  'green'  }}

                          onClick={() => setActiveKey(3)}
                        >
                          Expenses
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    {/* Hire Vehicles Part Header Tab End */}
                    {/* Hire Vehicles Part Start */}
                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                        {/* Hire Vehicle General Info Part Start */}
                        {expenseClosureData && (
                          <CRow className="">
                            {expenseClosureData.vendor_info && (
                              <>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="cname">Vendor Name</CFormLabel>
                                  <CFormInput
                                    name="cname"
                                    size="sm"
                                    id="cname"
                                    value={expenseClosureData.vendor_info.vendor_name}
                                    readOnly
                                  />
                                </CCol>

                                <CCol md={3}>
                                  <CFormLabel htmlFor="clo">Vendor Location / Code</CFormLabel>
                                  <CFormInput
                                    name="clo"
                                    size="sm"
                                    id="clo"
                                    value={locationFinder(expenseClosureData?.vendor_info?.location_id)}
                                    readOnly
                                  />
                                </CCol>

                                <CCol md={3}>
                                  <CFormLabel htmlFor="cmn">Vendor Mobile Number</CFormLabel>
                                  <CFormInput
                                    name="cmn"
                                    size="sm"
                                    id="cmn"
                                    value={expenseClosureData.vendor_info.vendor_contact_no}
                                    readOnly
                                  />
                                </CCol>

                                <CCol md={3}>
                                  <CFormLabel htmlFor="cfr">Vendor Freight Type</CFormLabel>
                                  <CFormInput
                                    name="cfr"
                                    size="sm"
                                    id="cfr"
                                    value={expenseClosureData.vendor_info.freight_type == '2' ? 'Actual Freight' :'Budget Freight'}
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}

                            {expenseClosureData.vehicle_info && (
                              <>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                                  <CFormInput
                                    name="vNum"
                                    size="sm"
                                    id="vNum"
                                    value={expenseClosureData.vehicle_info.vehicle_number}
                                    readOnly
                                  />
                                </CCol>

                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="vbt">Vehicle Capacity / Feet / Body Type </CFormLabel>
                                  <CFormInput
                                    name="vbt"
                                    size="sm"
                                    id="vbt"
                                    value={`${expenseClosureData.vehicle_info.vehicle_capacity_info.capacity} - Ton / ${expenseClosureData.vehicle_info.feet_info.capacity} ${expenseClosureData.vehicle_info.vehicle_body_type_info.body_type}`}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="vivt">Vehicle Insurance Valid To </CFormLabel>
                                  <CFormInput
                                    name="vivt"
                                    size="sm"
                                    id="vivt"
                                    value={expenseClosureData.vehicle_info.insurance_validity}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="vfvt">Vehicle FC Valid To </CFormLabel>
                                  <CFormInput
                                    name="vfvt"
                                    size="sm"
                                    id="vfvt"
                                    value={expenseClosureData.vehicle_info.fc_validity}
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}

                  {expenseClosureData.parking_yard_info && (
                            <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="dname">Driver name </CFormLabel>
                                  <CFormInput
                                    name="dname"
                                    size="sm"
                                    id="dname"
                                    value={expenseClosureData.driver_name}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="dmn">Driver Mobile Number </CFormLabel>
                                  <CFormInput
                                    name="dmn"
                                    size="sm"
                                    id="dmn"
                                    value={expenseClosureData.parking_yard_info.driver_number}
                                    readOnly
                                  />
                                </CCol>
                               
                            
                            
                          
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>
                                <CFormInput
                                  name="gateInDateTime"
                                  size="sm"
                                  id="gateInDateTime"
                                  value={expenseClosureData.parking_yard_info.gate_in_date_time_string}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="odometer_closing_km">
                                Odometer Openning KM
                              </CFormLabel>
                              <CFormInput
                                name="odometer_closing_km"
                                size="sm"
                                id="odometer_closing_km"
                                value={expenseClosureData.odometer_opening_km}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="odometer_photo">Odometer Openning Photo</CFormLabel>
                              <CButton
                                onClick={() => setVisible(!visible)}
                                className="w-100 m-0"
                                color="info"
                                size="sm"
                                id="odometer_photo"
                                style={border}
                              >
                                <span className="float-start">
                                  <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                                </span>
                              </CButton>
                              <CModal visible={visible} onClose={() => setVisible(false)}>
                                <CModalHeader>
                                  <CModalTitle>Odometer Openning Photo</CModalTitle>
                                </CModalHeader>

                           
                                <CModalBody>
                                  {expenseClosureData?.parking_yard_info?.odometer_photo &&
                                  !expenseClosureData?.parking_yard_info?.odometer_photo.includes('.pdf') ? (
                                    <CCardImage
                                      orientation="top"
                                      src={expenseClosureData?.parking_yard_info?.odometer_photo}
                                    />
                                  ) : (
                                    <iframe
                                      orientation="top"
                                      height={500}
                                      width={475}
                                      src={expenseClosureData?.parking_yard_info?.odometer_photo}
                                    ></iframe>
                                  )}
                                </CModalBody>

                                <CModalFooter>
                                  <CButton color="secondary" onClick={() => setVisible(false)}>
                                    Close
                                  </CButton>
                                </CModalFooter>
                              </CModal>
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="odometer_closing_km">
                                Odometer Closing KM
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="odometer_closing_km"
                                value={expenseClosureData.odometer_closing_km}
                                onChange={handleChange}
                                name="odometer_closing_km"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                className={`${errors.odometer_closing_km && 'is-invalid'}`}
                                maxLength={6}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="odometer_closing">Odometer Closing Photo</CFormLabel>
                              <CButton
                                onClick={() => setVisible1(!visible1)}
                                className="w-100 m-0"
                                color="info"
                                size="sm"
                                id="odometer_closing"
                                style={border}
                              >
                                <span className="float-start">
                                  <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                                </span>
                              </CButton>
                              <CModal visible={visible1} onClose={() => setVisible1(false)}>
                                <CModalHeader>
                                  <CModalTitle>Odometer Closing Photo</CModalTitle>
                                </CModalHeader>

                
                                <CModalBody>
                                  {expenseClosureData.odometer_closing &&
                                  !expenseClosureData.odometer_closing.includes('.pdf') ? (
                                    <CCardImage
                                      orientation="top"
                                      src={expenseClosureData.odometer_closing}
                                    />
                                  ) : (
                                    <iframe
                                      orientation="top"
                                      height={500}
                                      width={475}
                                      src={expenseClosureData.odometer_closing}
                                    ></iframe>
                                  )}
                                </CModalBody>

                                <CModalFooter>
                                  <CButton color="secondary" onClick={() => setVisible1(false)}>
                                    Close
                                  </CButton>
                                </CModalFooter>
                              </CModal>
                            </CCol>
                              </>
                            )}

                            {expenseClosureData.parking_yard_info && (
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="inspectionDateTime">Inspection Date</CFormLabel>
                                <CFormInput
                                  name="inspectionDateTime"
                                  size="sm"
                                  id="inspectionDateTime"
                                  value={expenseClosureData.parking_yard_info.created_date}
                                  readOnly
                                />
                              </CCol>
                            )}

                             <CCol md={3}>
                                  <CFormLabel htmlFor="TNum">Budgeted KM</CFormLabel>
                                  <CFormInput
                                    name="TNum"
                                    size="sm"
                                    id="TNum"
                                    value={expenseClosureData?.parking_yard_info?.unplanned_km?expenseClosureData?.parking_yard_info?.unplanned_km:expenseClosureData.parking_yard_info?.ifoods_SalesRoute_info?.budgeted_km}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="TNum">Running KM</CFormLabel>
                                  <CFormInput
                                    name="TNum"
                                    size="sm"
                                    id="TNum"
                                    value={expenseClosureData.runningkm}
                                    readOnly
                                  />
                                </CCol>
                            {expenseClosureData.trip_sheet_info && (
                              <>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="TNum">Tripsheet Number</CFormLabel>
                                  <CFormInput
                                    name="TNum"
                                    size="sm"
                                    id="TNum"
                                    value={expenseClosureData.trip_sheet_info.ifoods_tripsheet_no}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="TDate">Tripsheet Date & Time</CFormLabel>
                                  <CFormInput
                                    name="TDate"
                                    size="sm"
                                    id="TDate"
                                    value={expenseClosureData.trip_sheet_info.ts_creation_time_string}
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}
                          
                            {expenseClosureData.parking_yard_info && (
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="gateOutDateTime">Gate-Out Date & Time</CFormLabel>
                                <CFormInput
                                  name="gateOutDateTime"
                                  size="sm"
                                  id="gateOutDateTime"
                                  value={expenseClosureData.parking_yard_info.gate_out_date_time_string}
                                  readOnly
                                />
                              </CCol>
                            )}
                          </CRow>
                        )}
                      </CTabPane>
                      {/* Hire Vehicle General Info Part End */}

                      {/* Hire Vehicle FG-SALES Part Start */}
                      <CTabPane
                        role="tabpanel"
                        aria-labelledby="profile-tab"
                        visible={activeKey == 2}
                      >
                        <>
                          <CRow key={`HireshipmentDeliveryData`} className="mt-2" hidden>
                            <CCol xs={12} md={3}>
                              <CFormLabel
                                htmlFor="inputAddress"
                                style={{
                                  backgroundColor: '#4d3227',
                                  color: 'white',
                                }}
                              >
                                Shipment Details
                              </CFormLabel>
                            </CCol>
                          </CRow>
                          {flatShipment &&
                            flatShipment.map((val, val_index) => {
                              return (
                                <>
                                  <CRow key={`HireshipmentChildData_${val_index}`}>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="sNum">Shipment / PO Number</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        id="sNum"
                                        value={val.SHIPMENT_OR_PO}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="sNum">Delivery Number</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="sNum"
                                        value={val.DELIVERY_NO}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={1}>
                                      <CFormLabel htmlFor="sNum">Delivery Qty</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="sNum"
                                        value={val.QUANTITY+ ' Box'}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={1}>
                                      <CFormLabel htmlFor="sNum">Net Weight</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="sNum"
                                        value={val.NET_WEIGHT ? `${val.NET_WEIGHT} KG` : '-'}
                                        readOnly
                                      />
                                    </CCol>

                                    {expenseClosureData.purpose == 1 && (
                                      <>
                                        {/* <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="sInvoice">Outlet Code</CFormLabel>

                                          <CFormInput
                                            size="sm"
                                            id="sInvoice"
                                            value={val.CUSTOMER}
                                            readOnly
                                          />
                                        </CCol> */}
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="sNum">Outlet Name</CFormLabel>

                                          <CFormInput
                                            size="sm"
                                            id="sNum"
                                            value={val.OUTLET}
                                            readOnly
                                          />
                                        </CCol>
                                      </>
                                    )}
                                    <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="sNum">Delivery Date</CFormLabel>

                                          <CFormInput
                                            size="sm"
                                            id="sNum"
                                          //  value={val.OUTLET}
                                          onChange={handleChange}
                                          type="date"
                                           readOnly
                                          />
                                          </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="sNum">POD Copy</CFormLabel>
                                      <CFormInput
                                        type="file"
                                        name="podimg"
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                        //value={val.OUTLET}
                                        onChange={handleChange}
                                        size="sm"
                                        id="sNum"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        readOnly
                                      />
                                    </CCol>
                                  </CRow>
                                  <ColoredLine color="red" />
                                </>
                              )
                            })}
                        </>
                      </CTabPane>
                      {/* Hire Vehicle FG-SALES Part End */}

                      {/* Hire Vehicle Expenses Capture Start */}
                      <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 3}>
                        <CTable caption="top" hover style={{ height: '55vh' }}>
                          <CTableCaption style={{ color: 'maroon' }}>Expenses</CTableCaption>

                          {/* ================== Expense Table Header Part Start ====================== */}
                          <CTableHead
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                            }}
                          >
                            <CTableRow>
                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                S.No
                              </CTableHeaderCell>

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Type
                              </CTableHeaderCell>

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Expense Amount
                              </CTableHeaderCell>

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Total Expense Amount
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          {/* ================== Expense Table Header Part End ======================= */}
                          {/* ================== Expense Table Body Part Start ======================= */}
                          <CTableBody>
                            {/* ================== Unloading Charges Part Start ======================= */}

                            <CTableRow>
                              <CTableDataCell scope="row">
                                <b>1</b>
                              </CTableDataCell>
                              <CTableDataCell>Unloading Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  id="unloading_charges"
                                  name="unloading_charges"
                                  value={unloadingCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_unloading_charge"
                                  name="expense_row_total_unloading_charge"
                                  value={unloadingCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Unloading Charges Part End ======================= */}

                            {/* ================== Subdelivery Charges Part Start =================== */}

                            <CTableRow>
                              <CTableDataCell scope="row">
                                <b>2</b>
                              </CTableDataCell>
                              <CTableDataCell>Subdelivery Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  id="sub_delivery_charges"
                                  name="sub_delivery_charges"
                                  value={subDeliveryCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_subdelivery_charge"
                                  name="expense_row_total_subdelivery_charge"
                                  value={subDeliveryCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Subdelivery Charges Part End ======================= */}

                            {/* ================== Weighment Charges Part Start ======================= */}

                            <CTableRow>
                              <CTableDataCell scope="row">
                                <b>3</b>
                              </CTableDataCell>
                              <CTableDataCell>Weighment Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  id="weighment_charges"
                                  name="weighment_charges"
                                  value={weighmentCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_weighment_charge"
                                  name="expense_row_total_weighment_charge"
                                  value={weighmentCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Weighment Charges Part End ======================= */}
                            {/* ================== Freight Charges Part Start ======================= */}

                            <CTableRow>
                              <CTableDataCell scope="row">
                                <b>4</b>
                              </CTableDataCell>
                              <CTableDataCell>Freight Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  id="freight_charges"
                                  name="freight_charges"
                                  value={freightCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_freight_charge"
                                  name="expense_row_total_freight_charge"
                                  value={freightCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Freight Charges Part End ======================= */}
                            {/* ================== Freight Adjustment Part Start ========= */}

                            <CTableRow>
                              <CTableDataCell scope="row">
                                <b>-</b>
                              </CTableDataCell>
                              <CTableDataCell>Freight Adjustment</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  id="adjustedFreightCharge"
                                  name="adjustedFreightCharge"
                                  value={adjustedFreightCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_adjusted_freight_charge"
                                  name="expense_row_total_adjusted_freight_charge"
                                  value={adjustedFreightCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Freight Adjustment Part End ========== */}
                            {/* ================== Stock Diversion / Return Charges Part Start ========= */}

                            <CTableRow>
                              <CTableDataCell scope="row">
                                <b>5</b>
                              </CTableDataCell>
                              <CTableDataCell>Stock Diversion / Return Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  id="diversion_return_charges"
                                  name="diversion_return_charges"
                                  value={diversionCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_stock_return_charge"
                                  name="expense_row_total_stock_return_charge"
                                  value={diversionCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Stock Diversion / Return Charges Part End ========== */}
                            {/* ================== Halting Charges Part Start ======================= */}

                            <CTableRow>
                              <CTableDataCell scope="row">
                                <b>6</b>
                              </CTableDataCell>
                              <CTableDataCell>Halting Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  id="halting_charges"
                                  name="halting_charges"
                                  value={haltingCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_halting_charge"
                                  name="expense_row_total_halting_charge"
                                  value={haltingCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Halting Charges Part End ======================= */}

                            {/* ================== Total Charges Part Start ============ */}

                            <CTableRow>
                              <CTableDataCell scope="row">
                                <b>*</b>
                              </CTableDataCell>
                              <CTableDataCell>Total Trip Expense Charges</CTableDataCell>
                              <CTableDataCell> </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_total_charge"
                                  name="expense_row_total_total_charge"
                                  value={totalChargesDepo}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Total Charges Part End ========== */}
                          </CTableBody>
                        </CTable>
                        {/* ================== Expense Table Body Part Start ======================= */}

                        <CTable caption="top" hover style={{ height: '20vh' }}>
                          <CTableCaption style={{ color: 'maroon' }}>Others</CTableCaption>

                          {/* ================== Others Table Header Part Start ====================== */}
                          <CTableHead
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                            }}
                          >
                            <CTableRow>
                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                S.No
                              </CTableHeaderCell>

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Type
                              </CTableHeaderCell>

                              {/* <CTableHeaderCell></CTableHeaderCell> */}

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Total
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          {/* ================== Others Table Header Part End ======================= */}
                          {/* ================== Others Table Body Part Start ======================= */}
                          <CTableBody>
                            {/* ================== Others Halt Days Part Start ======================= */}
                            <CTableRow>
                              <CTableDataCell scope="row">
                                <b>1</b>
                              </CTableDataCell>
                              <CTableDataCell>Halt Days</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  id="halt_days"
                                  name="halt_days"
                                  value={values.halt_days}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>

                            {/* ================== Others Halt Days Part End ======================= */}

                          </CTableBody>
                          {/* ================== Expense Table Body Part End ======================= */}
                        </CTable>

                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="exremarks">Expense Remarks</CFormLabel>
                            <CFormInput
                              size="sm"
                              id="exremarks"
                              name="exremarks"
                              value={values.remarks || '-'}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="apremarks">Approval / Rejection Remarks</CFormLabel>
                            <CFormTextarea
                              name="apremarks"
                              id="apremarks"
                              rows="1"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              value={values.apremarks}
                            ></CFormTextarea>
                          </CCol>
                          <CCol
                            className="offset-md-9"
                            xs={12}
                            sm={12}
                            md={3}
                            // style={{ display: 'flex', justifyContent: 'space-between' }}
                            style={{ display: 'flex', flexDirection: 'row-reverse', cursor: 'pointer' }}
                          >

                            {/* <CButton
                              size="sm"
                              style={{ background: 'red'}}
                              className="mx-3 text-white"
                              onClick={() => {
                                setFetch(false)
                                DepoTripExpenseApprovalCancel()
                              }}
                              type="submit"
                            >
                              Reject
                            </CButton> */}
                            {/* <CButton
                              size="sm"
                              style={{ background: 'green'}}
                              className="mx-3 text-white"
                              onClick={() => {
                                setFetch(false)
                                expenseApproval(1)
                              }}
                              type="submit"
                            >
                              Approve
                            </CButton> */}
                          </CCol>
                        </CRow>
                      </CTabPane>
                      {/* Hire Vehicle Expenses Capture End */}
                    </CTabContent>
                    <CRow className="mt-2">
                      <CCol>
                        <Link to={'/IfoodsPaymentSubmissionHome'}>
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
                    </CRow>
                  </CTabPane>
                </CTabContent>

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


                {/*Camera Image Copy model*/}
                <CModal
                  visible={camEnable}
                  backdrop="static"
                  onClose={() => {
                    setCamEnable(false)
                    setImgSrc("")
                    setFileImageKey("")
                    setCamEnableType("")
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>POD Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>

                    {!imgSrc && (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/png"
                          height={200}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              capture()
                            }}
                          >
                            Accept
                          </CButton>
                        </p>
                      </>
                    )}
                    {imgSrc && (

                      <>
                        <img height={200}
                          src={imgSrc}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrc("")
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}

                  </CModalBody>
                  <CModalFooter>
                    {imgSrc && (
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnable(false)
                          valueAppendToImage1(imgSrc)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnable(false)
                        setImgSrc("")
                        setFileImageKey("")
                        setCamEnableType("")
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/*Camera Image Copy model*/}
                {/* ============== Income Reject Confirm Button Modal Area ================= */}
                <CModal
                  visible={approvalReject}
                  backdrop="static"
                  // scrollable
                  onClose={() => {
                    setApprovalReject(false)
                  }}
                >
                  <CModalBody>
                    <p className="lead">Are you sure to Reject an Additional Expense Approval ?</p>
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setFetch(false)
                        setApprovalReject(false)
                        expenseApproval(2)
                      }}
                    >
                      Confirm
                    </CButton>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setApprovalReject(false)
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>
              </CCard>
            </> ) : (<AccessDeniedComponent />)
          }

   	    </>
      )}
    </>
  )
}

export default IfoodsPaymentSubmission


