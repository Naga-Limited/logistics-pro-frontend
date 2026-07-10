// import { React } from 'react'
// import maintenance_logo from 'src/assets/naga/page-not-found.jpg'

// const SystemAdminSettingsHome = () => {
//   return (
//     <>
//       <div className="card mt-3">
//         <img style={{ margin: '5% 25%', borderRadius: '30%' }} src={maintenance_logo} />
//       </div>
//     </>
//   )
// }

// export default SystemAdminSettingsHome

/* eslint-disable  */
import {
  CButton,
  CCard,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CContainer,
  CModalBody,
  CForm,
  CAlert,
  CModalFooter,
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
  CFormTextarea,
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CCardImage,
} from '@coreui/react'
import React,{ useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { json, Link, useNavigate, useParams } from 'react-router-dom'
import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import FIEntryService from 'src/Service/FIEntry/FIEntryService' 
import FIEntryValidation from 'src/Utils/FIEntry/FIEntryValidation'
//   import maintenance_logo from 'src/assets/naga/main1.jpg'
import maintenance_logo from 'src/assets/naga/main2.png'
import useForm from 'src/Hooks/useForm' 
import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
import FileResizer from 'react-image-file-resizer'

import Swal from "sweetalert2";
import CustomTable from 'src/components/customComponent/CustomTable'
import RakeClosureSubmissionService from 'src/Service/RakeMovement/RakeClosureSubmission/RakeClosureSubmissionService'
import RakeTripsheetSapService from 'src/Service/SAP/RakeTripsheetSapService'
import { formatDateAsDDMMYYY } from '../RakeMovement/CommonMethods/CommonMethods'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import FCIClosureSubmissionService from 'src/Service/FCIMovement/FCIClosureSubmission/FCIClosureSubmissionService'
import tr from 'date-fns/esm/locale/tr/index.js'
import TripSheetSearchComponent from '../FIScreen/TripsheetSearchComponent/TripSheetSearchComponent'
import FISearchSelectComponent from '../FIScreen/FISearchSelectComponent/FISearchSelectComponent'
import DriverListSearchSelectComponent from '../FIScreen/DriverListSearchSelectComponent/DriverListSearchSelectComponent'
import AdminSettingsService from 'src/Service/AdminSettings/AdminSettingsService' 
import AdminPartialTripsheetSerachSelectComponent from './CommonMethods/AdminPartialTripsheetSerachSelectComponent'
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import AdminInvoiceReversalShipmentSerachSelectComponent from './CommonMethods/AdminInvoiceReversalShipmentSerachSelectComponent'

const SystemAdminSettingsHome = () => {
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
const [screenAccessRake, setScreenAccessRake] = useState(false) 

useEffect(()=>{

  if(user_info.is_admin == 1){
    console.log('screen-access-allowed')
    setScreenAccess(true)
  } else{
    console.log('screen-access-not-allowed')
    setScreenAccess(false)
  }

  if(user_info.is_admin == 1){
    console.log('rakeFI-screen-access-allowed')
    setScreenAccessRake(true)
  } else{
    console.log('rakeFI-screen-access-not-allowed')
    setScreenAccessRake(false)
  }

},[])
/* ==================== Access Part End ========================*/

const [TripsheetNo, setTripsheetNo] = useState([])

  const formValues = {
    partial_tripsheets:'',
    vehicle_id:'',
    driver_id:'',
    parking_id:'',
    tripsheet_id:'',
    vehicle_type_id:'',
    rj_sales_id:'',
    diesel_vendor_id:'',
    hire_vendor_code:'',
    fi_entry_type:'',
    entry_to:'',
    to_division:'',
    own_income_expense:'',
    hire_income_expense:'',
    income_amount:'',
    expense_amount:'',
    payment_mode:'',
    sap_income_document_no:'',
    sap_expense_document_no:'',
    sap_diesel_document_no:'',
    sap_rj_document_no:'',
    fi_status:'',
    remarks:'',
    gltype:'',
    firemarks:'',
    fitdsremarks:'',
    rake_freight_amount:'',
    rake_supplier_ref_no:'',
    rake_supplier_posting_date:'',
    rake_gst_tax_type:'',
    rake_tds_type:'',
    rake_hsn_type:'',
  }

  const [fetch, setFetch] = useState(false)
  const [Parking_id, setParking_id] = useState('')
  const [vehId, setVehID] = useState('')
  const [vTypeId, setVtypeID] = useState('')
  const [vehNo, setVehNo] = useState('')
  const [vType, setVtype] = useState('')
  const [dId, setDID] = useState('')
  const [tsId, setTSID] = useState('')
  const [driverName, setDriverName] = useState('')
  const [driverCode, setDriverCode] = useState('')
  const [vendorCode, setVendorCode] = useState('')
  const [vendorName, setVendorName] = useState('')
  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
  const [RJTripSheetNo, setRJTripSheetNo] = useState('')
  const [gltype, setGltype] = useState('')
  const [cost_center, setCost_center] = useState('')
  const [gl_code, setGLCode] = useState('')
  const [fjcustomer, setFJCustomer] = useState([])
  const [Diesel_vendor_code, setDiesel_Vendor_code] = useState('')
  const [Diesel_vendor_id, setDiesel_Vendor_id] = useState('')
  const [RJSONo, setRJSONo] = useState([])
  const [RJ_vendor_Code, setRJ_vendor_Code] = useState('')
  const [RJ_vendor_Name, setRJ_vendor_Name] = useState('')
  const [RJ_Sales_id, setRJ_Sales_id] = useState('')
  const [FJ_Sales_Customer_Code, setFJ_Sales_Customer_Code] = useState('')
  const [FJ_Sales_Customer_Name, setFJ_Sales_Customer_Name] = useState('')
  const [FJ_Sales_Shipment_ID, setFJ_Sales_Shipment_ID] = useState('')
  const [acceptBtn, setAcceptBtn] = useState(true)
  const [owngltypes,setOwnGltypes] = useState([])
  const [selected, setSelected] = useState(owngltypes.slice(0,2));
  const [hiregltypes,setHireGltypes] = useState([])
  const [RjCustomer, setRjCustomer] = useState(0)
  const [selectedHire, setSelectedHire] = useState(hiregltypes.slice(0,2));
  const [shedName, setShedName] = useState([])
  const [remarks, setRemarks] = useState('');
  const [driverPhoneNumberById, setDriverPhoneNumberById] = useState('')
  const [driverCodeById, setDriverCodeById] = useState('')
  const [confirmBtn, setConfirmBtn] = useState(false)
  const [rowData, setRowData] = useState([])
  const [TaxType, setTaxType] = useState([])
  const [PaymentMode, setPaymentMode] = useState([])
  const [GstTaxType, setGstTaxType] = useState([])
  const [Shipment_no, setShipment_no] = useState('')


  const REQ = () => <span className="text-danger"> * </span>

  const navigation = useNavigate()
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const { id } = useParams()
  const [state, setState] = useState({
  page_loading: false,
  })
  const {
    values,
    errors,
    handleChange, 
    handleChangeMap,
    isTouched,
    setIsTouched,
    setErrors,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
    handleMultipleChange,
  } = useForm(login, FIEntryValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }

const handleChangenew = event => {
const result = event.target.value.toUpperCase();

setRemarks(result);

};

/* ==================== Cash payment Access Part End ========================*/

const getRndInteger = (min, max) => {
return Math.floor(Math.random() * (max - min)) + min;
}

/* ==================== FI Form Image ReSize End ========================*/

/* ==================== FI Posting Vendor ========================*/

  /* ==================== FI Single TripSheet FI Details Report Start ========================*/

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

  /* ==================== FI Single TripSheet FI Details Report End ========================*/

/* SAP Posting Date */

const Expense_Income_Posting_Date = ExpenseIncomePostingDate();

  // ========================================== ASK OTHERS PART START ========================================== //
   
  // ========================================== ASK PART START ========================================== //

  const [currentProcessId, setCurrentProcessId] = useState(0)
  
  const [smallfetch, setSmallFetch] = useState(false)
  const [headEnable, setHeadEnable] = useState(true)

  /* == ASKK Admin Settings Constants Part Start == */
  
  const [dbDownloadModalEnable, setDbDownloadModalEnable] = useState(false)

  /* == Admin Settings Constants Part End == */

  /* == Admin Settings Custom Functions Part Start == */ 

  const SSArray = ['','Shipment Created','Shipment Updated By User','Shipment Updated in SAP','Shipment Deleted','Shipment Completed']
  const DSArray = ['','Delivery Created','Delivery Deleted','Delivery PGI Completed']

  const SSFinder = (scode) => {
    let val = `${SSArray[scode]} - (${scode})`
    return val
  }

  const clearValuestripsheetNumber1  = () => { 
    setCurrentProcessId(0)
    setHeadEnable(true) 
  }

  /* == Admin Settings Custom Functions Part End == */

  /* == Admin Settings Custom Submit Functions Part Start == */

  const lpDBDownload = () => {
    setFetch(false)
    AdminSettingsService.dbDownload().then((res) => { 
      console.log(res,'AdminSettingsService')
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
        title: 'DB Downloaded Successfully!',
        icon: "success",
        confirmButtonText: "OK",
        }).then(function () {
            window.location.reload(false)
        });
      } else {
        toast.warning('DB Download Failed. Kindly contact Admin..!')
      }
    })
    .catch((error) => {
      setFetch(true)
      // for (let value of formDataForSAPShipmentDelete.values()) {
      //   console.log(value)
      // }
      console.log(error)
      toast.success('DB Downloaded Successfully!')
      // toast.warning(error.message+'..!')
      // var object = error.response.data.errors
      // var output = ''
      // for (var property in object) {
      //   output += '*' + object[property] + '\n'
      // }
      // setError(output)
      // setErrorModal(true)
    })
  }

  /* == Admin Settings Custom Submit Functions Part End == */

  const assignValues = (id) => {
    console.log(id,'assignValues-id')

    if(id == 1){
      setDbDownloadModalEnable(true)
    }
    if(id > 1){
      setHeadEnable(false)
    }
    setCurrentProcessId(id)
  }

  const RakePlant_Array = []
  RakePlant_Array['R1'] = 'Dindigul'
  RakePlant_Array['R2'] = 'Aruppukottai'

  const getInt = (val) => {
    let int_value = 0
    if(val){
      int_value = Number(parseFloat(val).toFixed(2))
    }
    console.log(int_value,'int_value')
    return int_value
  }

  const [gstTaxTermsData, setGstTaxTermsData] = useState([])
  const [incoTermsData, setIncoTermsData] = useState([])

  useEffect(() => {

    /* section for getting Inco Term List from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(16).then((response) => {
      setFetch(true)
      setSmallFetch(true)
      console.log(response.data.data,'setGstTaxTermsData')
      setIncoTermsData(response.data.data)
    })

  }, [])

  const processArray = [2,3]

  // ========================================== ASK PART END ========================================== //

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
        {(screenAccess || screenAccessRake) ? (
         <>
          <CCard>
            {/* <CContainer className="mt-2"> */}

            {/* </CContainer> */}
            <CTabContent>
              {headEnable && (
                <CRow className="mt-3">
                  <CCol xs={12} md={6}>
                    <div className="p-3">
                      <CInputGroup className="mb-3">
                        <CInputGroupText component="label" htmlFor="inputGroupSelect01">
                          FI Entry Type
                        </CInputGroupText>

                        <CFormSelect
                          id="inputGroupSelect01"
                          onchange
                          onChange={(e) => {
                            assignValues(e.target.value)
                          }}
                          value={currentProcessId}
                        >
                          <option value={0}>Select...</option>
                          {screenAccess && (<option value={1}> Database Backup</option>)} 
                          {screenAccess && (<option value={2}> App - Maintenence Mode</option>)}
                          {screenAccess && (<option value={3}> App - Logout All the Users</option>)} 
                        </CFormSelect>
                      </CInputGroup>
                    </div>
                  </CCol>
                </CRow>
              )}                
              <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={JavascriptInArrayComponent(currentProcessId,processArray)}>
                   
                  <div className="card mt-3" style={{backgroundColor:"dimgrey", margin:"5%"}} >
                      <img style={{ margin: '5% 25%', borderRadius: '10%', width:"40%" }} src={maintenance_logo} />
                  </div>                               
                   
                  <CRow>
                      <CCol>
                          <CButton 
                              size="sm" 
                              color="primary" 
                              className="text-white m-4" 
                              onClick={clearValuestripsheetNumber1} 
                              type="button"
                          >
                              Previous
                          </CButton>
                      </CCol>
                  </CRow>
              </CTabPane>

            </CTabContent>
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

          {/* ======================= DB Download Button Modal Area ========================== */}
          <CModal
            visible={dbDownloadModalEnable}
            backdrop="static"
            onClose={() => {
              setDbDownloadModalEnable(false) 
            }}
          >
            <CModalHeader
              style={{
                backgroundColor: '#ebc999',
              }}
            >
              <CModalTitle>Confirmation To Database Download</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <p className="lead"> 
                Are you sure to download Logistics Pro Database?
              </p> 
            </CModalBody>
            <CModalFooter>
              <CButton
                className="m-2"
                color="warning"
                onClick={() => {   
                  lpDBDownload()
                  setDbDownloadModalEnable(false)
                }}
              >
                Confirm
              </CButton>
              <CButton
                color="secondary"
                onClick={() => {
                  setDbDownloadModalEnable(false) 
                }}
              >
                Cancel
              </CButton> 
            </CModalFooter>
          </CModal>
          {/* *********************************************************** */}

         </>
        ) : (<AccessDeniedComponent />)}
        </>
      )}
    </>
  )
}
export default SystemAdminSettingsHome


