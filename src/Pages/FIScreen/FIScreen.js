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
  import DieseVendorSelectComponent from 'src/components/commoncomponent/DieselVendorSelectComponent'
  import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
  import FIEntrySAP from 'src/Service/SAP/FIEntrySAP'
  import FIEntryValidation from 'src/Utils/FIEntry/FIEntryValidation'
  import TripSheetSearchComponent from './TripsheetSearchComponent/TripSheetSearchComponent'
  import FISearchSelectComponent from './FISearchSelectComponent/FISearchSelectComponent'
  import GLListMasterService from 'src/Service/Master/GLListMasterService'
  import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
  import DriverListSearchSelectComponent from './DriverListSearchSelectComponent/DriverListSearchSelectComponent'
  import useForm from 'src/Hooks/useForm'
  import {MultiSelect} from "react-multi-select-component";
  import CustomerCreationService from 'src/Service/CustomerCreation/CustomerCreationService'
  import ExpenseIncomePostingDate from './FiEntryExpenseIncomePostingDate'

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
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'

  const FIScreen = () => {
    /*================== User Id & Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    console.log(user_info,'user_info')
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
  let page_no = LogisticsProScreenNumberConstants.FIEntryModule.FI_Entry_Screen
  let page_no_rake = LogisticsProScreenNumberConstants.RakeClosureModule.Rake_FIEntry

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no_rake,user_info.page_permissions)){
      console.log('rakeFI-screen-access-allowed')
      setScreenAccessRake(true)
    } else{
      console.log('rakeFI-screen-access-not-allowed')
      setScreenAccessRake(false)
    }

  },[])
  /* ==================== Access Part End ========================*/

  // const admin_user_id_array = [10007,30086,60104] 60104 - Grazy, 30086 - Samuvel
  const admin_user_id_array = []  
  var user_access_for_back_date = 0
  if(JavascriptInArrayComponent(user_info.empid,admin_user_id_array)){
    user_access_for_back_date = 1
  }

 /* ==================== Cash payment Access Part Start ========================*/
 const [AdvanceAccess, setAdvanceAccess] = useState('')
 useEffect(()=>{
  if(user_id){
  FIEntryService.CashPaymentUserAccess(user_id).then((res) => {
    setFetch(true)
    setAdvanceAccess(res.data)
  })
 }
 },[user_id])
 /* ==================== Cash payment Access Part End ========================*/

 const [TripsheetNo, setTripsheetNo] = useState([])

  useEffect(() => {

/* section for getting Tripsheet no Data from database For FI Entry */
    FIEntryService.getFIEntryVehiclesList().then((rest) => {
      setFetch(true)
      let tableData = rest.data
      const filterData = tableData.filter((data) => (AdvanceAccess == 1 || data.status == '2' || data.tripsheet_is_settled >= 3))
      setTripsheetNo(filterData)
    })
  }, [AdvanceAccess])

    const formValues = {
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
    const [sapBookDivision, setSapBookDivision] = useState(1)
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


  /* fetching diesel vendor */
    useEffect(() => {
      // setFetch(true)
      if (values.diesel_vendor_name) {
        DieselIntentCreationService.getDieselInfoById(values.diesel_vendor_name).then((res) => {
              values.diesel_vendor_code = res.data.data.vendor_code
              values.diesel_vendor_id = res.data.data.diesel_vendor_id
              setDiesel_Vendor_code(res.data.data.vendor_code)
              setDiesel_Vendor_id(res.data.data.diesel_vendor_id)
        })
      }else{
        values.diesel_vendor_code = ''
      }
    }, [values.diesel_vendor_name])

  // const expense_type = (type) => {
  //   let expense_array = ['0','BATA','MUNICIPAL_CHARG']
  //   return expense_array[type]
  // }

  /* fetching RJ Sales order single data */
  useEffect(() => {
    if(values.rj_so_no){
      FIEntryService.getSalesOrderSingle(values.rj_so_no).then((res) => {
              // values.rj_customer_code = res.data.data.customer_code
              setRJ_vendor_Code(res.data.data[0].customer_code)
              setRJ_vendor_Name(res.data.data[0].pay_customer_name)
              setRJ_Sales_id(res.data.data[0].id)
            })
    }else{
      values.rj_so_no = ''
    }
},[values.rj_so_no])

  /* fetching FJ sales singe data */
useEffect(() => {
  if(values.customer_code){
    FIEntryService.getFJSalesOrderSingle(values.customer_code).then((res) => {
    setFJ_Sales_Customer_Code(res.data.data[0].customer_info.CustomerCode)
    setFJ_Sales_Customer_Name(res.data.data[0].customer_info.CustomerName)
    setFJ_Sales_Shipment_ID(res.data.data[0].shipment_info.shipment_id)
  })
  }else{
    values.customer_code = ''
  }
},[values.customer_code])

  /* submit button enable/disable */
useEffect(() => {
  if( isTouched.amounttype && isTouched.sap_fi_posting_date && isTouched.entry_to && !error.freight_amount && !error.mode_of_payment && !errors.amounttype && !errors.sap_fi_posting_date && !errors.entry_to){
    setAcceptBtn(false);
  } else {
    setAcceptBtn(true);
  }
}, [errors])

  /* Tripsheet related data fetching*/

const onChange = (event) => {

  let tripsheetNumber = event.value

  if (tripsheetNumber) {
    values.tripsheetNumber = tripsheetNumber
    FIEntryService.getFIEntrySingleVehicle(tripsheetNumber).then((res) => {
      let res_data = res.data.data
      console.log(res_data,'getFIEntrySingleVehicle')
      setVehNo(res.data.data.parking_info !=null ? res.data.data.parking_info.vehicle_number:'')
      setVehID(res.data.data.parking_info !=null ? res.data.data.parking_info.vehicle_id:'')
      setTSID(res.data.data !=null ? res.data.data.trip_sheet_id:'')
      setVtype(res.data.data.parking_info.vehicle_type_id !=null ? res.data.data.parking_info.vehicle_type_id.type:'')
      setVtypeID(res.data.data.parking_info !=null ? res.data.data.parking_info.vehicle_type_id.id:'')
      setParking_id(res.data.data !=null ? res.data.data.parking_id:'')
      setDriverName(res.data.data.parking_info.driver_info != null? res.data.data.parking_info.driver_info.driver_name :'')
      setDID(res.data.data.parking_info.driver_info != null? res.data.data.parking_info.driver_info.driver_id :'')
      setDriverCode(res.data.data.parking_info.driver_info != null? res.data.data.parking_info.driver_info.driver_code:'')
      setVendorCode(res.data.data.parking_info.vendor_info != null ? res.data.data.parking_info.vendor_info.vendor_code:'')
      setVendorName(res.data.data.parking_info.vendor_info != null ? res.data.data.parking_info.vendor_info.owner_name:'')
      // setRJCustomerCode(res.data.data.parking_info.rj_so_info[0] != null? res.data.data.parking_info.rj_so_info[0].customer_code:'')
      setRJTripSheetNo(res.data.data.parking_info.rj_so_info[0] != null? res.data.data.parking_info.rj_so_info[0].rj_so_no:'')
      values.vehicle_assignment_id=res.data.data.parking_info.shipment_info[0] != null? res.data.data.parking_info.shipment_info[0].shipment_id:''
      values.amounttype = "0"
      values.amount = "0"
      values.trip_settlement_id = res.data.data.parking_info.trip_settlement_info != null ? res.data.data.parking_info.trip_settlement_info.id:''
      values.tripsheet_is_settled = res.data.data.parking_info.trip_settlement_info != null ? res.data.data.parking_info.trip_settlement_info.tripsheet_is_settled:''
      setShipment_no(res.data.data.parking_info.shipment_info[0] != null ? res.data.data.parking_info.shipment_info[0].shipment_no:'')
      console.log(Shipment_no);
      if(res.data.data.parking_info.trip_settlement_info != null && res.data.data.parking_info.trip_settlement_info.sap_book_division == 2){
        console.log(res.data.data.parking_info.trip_settlement_info.sap_book_division,'getFIEntrySingleVehicle-sap_book_division')
        setSapBookDivision(2)
      }else {
        setSapBookDivision(1)
      }
      setSingleVehicleInfo(res.data.data)
  })
  let tableData
  FIEntryService.getFIEntryRJSOVehicles(tripsheetNumber).then((res) => {
    tableData = res.data
    const filterData = tableData.filter((data) =>  data.tripsheet_id == values.tripsheetNumber)
    setRJSONo(filterData)
  })

}
else {
  values.tripsheetNumber = ''
  setVehID('')
  setVehNo('')
  setTSID('')
  setVtype('')
  setVtypeID('')
  setDriverName('')
  setDriverCode('')
  setVendorCode('')
  setVendorName('')
  values.amounttype = "0"
  setGltype('')
  setCost_center('')
  setGLCode('')
  values.gl_list_id = ''
  setFJCustomer('')
  values.mode_of_payment = '0'
  setSelected([])
  setSelectedHire([])
  values.entry_to = ''
  values.customer_code = ''
  values.freight_amount = ''
  values.attachment = ''
  values.remarks = ''
  values.diesel_vendor_name = ''
  values.diesel_vendor_code = ''
  values.rj_so_no = ''
  values.rj_so_income = '0'
  values.customer_code = ''
  values.mode_of_payment = ''
  values.sap_fi_posting_date = ''
  values.tds_type = ''
  values.gst_tax_type = ''
  values.supplier_ref_no = ''
  values.supplier_posting_date = ''
}
}

//Shipment details get
useEffect(() => {
  if(Shipment_no){
    let tableData1
    FIEntryService.getFJSalesOrder(Shipment_no).then((res) => {
      tableData1 = res.data.data
      // console.log(tableData1)
      const filterData = tableData1.filter((data) =>  data.shipment_info[0]?.trip_sheet_info?.trip_sheet_no == values.tripsheetNumber)
      let sp_vehicle_array = []
      const option = [{ value: '0', label: 'Select'}]
      filterData.map(({  customer_info,shipment_delivery_id }) => {
        if (sp_vehicle_array.indexOf(customer_info?.CustomerName) === -1) {
          sp_vehicle_array.push(customer_info?.CustomerName)
          option.push({ value: shipment_delivery_id, label: customer_info?.CustomerName })
        }
      })
      setFJCustomer(option)
  })
  }
}, [Shipment_no])
  /* Remarks uppercase set */

const handleChangenew = event => {
const result = event.target.value.toUpperCase();

setRemarks(result);

};

/* fetching GL List single data */

const onChange1 = (event) => {
let gl_list_id = event.value
if (gl_list_id) {
  values.gl_list_id = gl_list_id
  GLListMasterService.getGLlistId(gl_list_id).then((res) => {
    console.log(res.data.data)
    setGltype(res.data.data.gltype)
    setCost_center(res.data.data.cost_center)
    setGLCode(res.data.data.gl_code)
})
} else {
  setFetch(true)
  values.gl_list_id = ''
// setAmount_type('')
  setGltype('')
  // setCost_center('')
  // setGLCode('')
  values.entry_to = ''
  values.freight_amount = ''
  values.attachment = ''
  values.remarks = ''
  values.diesel_vendor_name = ''
  values.diesel_vendor_code = ''
  values.rj_so_no = ''
  values.rj_so_income = '0'
  values.customer_code = ''
  values.sap_fi_posting_date = ''
  values.tds_type = ''
  values.hsn_type = ''
  values.gst_tax_type = ''
  values.supplier_ref_no = ''
  values.supplier_posting_date = ''
  values.amount = ''
  EXPENSE_AMT = ''
  sum_own = '0'
  sum_hire = '0'
  setSelected([])
  setSelectedHire([])
  setRjCustomer('')
  loadTripFIReport('')
}
}

/* fetching driver details single data */
const onChange2 = (event) => {
let driverId = event.value
if (driverId) {
  values.driverId = driverId
  ParkingYardGateService.getDriverInfoById(driverId).then((res) => {
    setDriverPhoneNumberById(res.data.data.driver_name)
    setDriverCodeById(res.data.data.driver_code)
  })
} else {
  values.driverId = ''
  setDriverPhoneNumberById('')
  setDriverCodeById('')
}
}

/* fetching GL List For Driver and Contract vendor*/
useEffect(() => {
GLListMasterService.getGLlist().then((res) => {
  let gltype_list = res.data.data
  let formattedgltype_list = []
  let filteredData = gltype_list.filter((gltype) => (gltype.amount_type == 2 && gltype.gl_status == 1 && (gltype.gltype == "5" || gltype.gltype == "5,6" || gltype.gltype == "5,6,7" || gltype.gltype == "5,7")))
  filteredData.map((gltype,index) =>
    formattedgltype_list.push({
        LINE_ITEM : index+1,
        value: gltype.gl_list_id,
        label: gltype.gl_description + ' - ' + gltype.gl_code,
        GL_CODE: '' + gltype.gl_code,
        COST_CENTER : gltype.cost_center,
        EXPENSE_AMT : '0',
      })
    )
    setOwnGltypes(formattedgltype_list)
})
}, []);

const [fiEntryMode, setFiEntryMode] = useState(0)
const [dvData, setDvData] = useState([])

/* fetching GL List For Freight vendor*/
useEffect(() => {
  GLListMasterService.getGLlist().then((res) => {
    let gltype_list = res.data.data
    console.log(gltype_list,'gltype_list_master-getGLlist')
    let formattedgltype_list = []
    let filteredData = gltype_list.filter((gltype) => (
        gltype.amount_type == 2 && 
        gltype.gl_status == 1 && 
        (gltype.gltype == "5" || gltype.gltype == "6" ||gltype.gltype == "5,6" || gltype.gltype == "5,6,7" || gltype.gltype == "6,7")
      )
    )
    console.log(filteredData,'gltype_list_master-filteredData')
    filteredData.map((gltype,index) =>
      formattedgltype_list.push({
          LINE_ITEM : index+1,
          value: gltype.gl_list_id,
          label: gltype.gl_description + ' - ' + gltype.gl_code,
          GL_CODE: gltype.gl_code,
          COST_CENTER : gltype.cost_center,
          EXPENSE_AMT : '0',
        })
      )
      console.log(formattedgltype_list,'gltype_list_master-formattedgltype_list')
      setHireGltypes(formattedgltype_list)
  })
  }, [fiEntryMode]);

  /* section for getting RJ Customer Details from database */
  useEffect(() => {
    CustomerCreationService.getCustomerCreationData().then((res) => {
      const filterData_shed = res.data.data.filter(
        (datan) => datan.customer_status == 3 && datan.customer_code != 0
      )
      setShedName(filterData_shed)
    })
    DieselVendorMasterService.getDieselVendors().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'getDieselVendors')
      setDvData(viewData)
    })
  }, [])


/* section for getting RJ Customer Filter */
const onChangeFilter = (event, event_type) => {
var selected_value = event.value
if (event_type == 'customer_no') {
  if (selected_value) {
    setRjCustomer(selected_value)
  } else {
    setRjCustomer(0)
  }
}
}

/* ====================FI Form Web Cam Start ========================*/
const webcamRef = React.useRef(null);
const [fileuploaded, setFileuploaded] = useState(false)
const [camEnable, setCamEnable] = useState(false)
const [imgSrc, setImgSrc] = React.useState(null);

const capture = React.useCallback(() => {
  const imageSrc = webcamRef.current.getScreenshot();
  setImgSrc(imageSrc);
}, [webcamRef, setImgSrc]);

/* ====================FI Form Web Cam End ========================*/

/* ==================== FI Form Image ReSize Start ========================*/
const resizeFile = (file) => new Promise(resolve => {
  FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
  uri => {
    resolve(uri);
  }, 'base64' );
})

const imageCompress = async (event) => {
  const file = event.target.files[0];
  console.log(file)

  if(file.type == 'application/pdf') {

  if(file.size > 5000000){
    alert('File to Big, please select a file less than 5mb')
    setFileuploaded(false)
  } else {
    values.attachment = file
    setFileuploaded(true)
  }
}else{

  const image = await resizeFile(file);
  if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
    valueAppendToImage(image)
    setFileuploaded(true)
  } else {
    values.attachment = file
    setFileuploaded(true)
  }
}
}

const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {type: mime});
};

const valueAppendToImage = (image) => {

  let file_name = 'dummy'+getRndInteger(100001,999999)+'.png'
  let file = dataURLtoFile(
    image,
    file_name,
  );

  console.log(file )

  values.attachment = file
}

// will hold a reference for our real input file
let inputFile = '';

// function to trigger our input file click
const uploadClick = e => {
  e.preventDefault();
  inputFile.click();
  return false;
};

const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

useEffect(() => {

  if(values.attachment) {
    setFileuploaded(true)
  } else {
    setFileuploaded(false)
  }

}, [values.attachment])
  /* ==================== FI Form Image ReSize End ========================*/

  /* ==================== FI Posting Vendor ========================*/

  const FIVendorCode = () => {
      if(vTypeId == 3 && values.amounttype == '2'&& values.entry_to == '6'){
        return vendorCode
      }else if(values.amounttype == '1' && values.entry_to == '3'){
        return '1012'
      }else if(values.amounttype == '1' && values.entry_to == '4'){
        return '1060'
      }else if(values.amounttype == '1' && values.entry_to == '2'){
        return FJ_Sales_Customer_Code
      }else if(values.amounttype == '1' && values.entry_to == '1' && values.rj_so_income == '2'){
        return RjCustomer
      }else if(values.amounttype == '1' && values.entry_to == '1' && values.rj_so_income == '1'){
        return RJ_vendor_Code
      }else if(values.amounttype == '3' && values.driverId){
        return driverCodeById
      }else if(values.amounttype == '2' && values.entry_to == '5'){
        return driverCodeById
      }else if(values.amounttype == '2' && values.entry_to == '7' && vType != 'Hire'){
        return values.diesel_vendor_code
      }else if(values.amounttype == '2' && values.entry_to == '7' && vType == 'Hire'){
        return vendorCode
      }else if(values.amounttype == '2' && values.entry_to == '9'){
        return '213267'
      }else if(values.amounttype == '2' && values.entry_to == '8'){
        return '229304'
      } else {
        return entryToFinder(values.entry_to,3)
      }
    }

    const getDieselVendorNameById = (vendor_id) => {

      console.log(dvData,'dieselVendorFinder-dvData')
      console.log(vendor_id,'dieselVendorFinder-vendor_id')
      let vendorName = '-'
      for (let i = 0; i < dvData.length; i++) {
        if (dvData[i].diesel_vendor_id == vendor_id) {
          vendorName = dvData[i].diesel_vendor_name
        }
      }
      console.log(vendorName,'dieselVendorFinder-vendorName')
      return vendorName

      // let driverName = code == '1' ? 'RNS Fuel Station' : 'RS Petroleum'
      // return driverName
    }

    const FIVendorName = () => {

      // let diesel_name = values.diesel_vendor_name == '1' ? 'RNS Fuel Station' :'RS Petroleum'
      let diesel_name = getDieselVendorNameById(values.diesel_vendor_name)

      if(vTypeId == 3 && values.amounttype == '2'&& values.entry_to == '6'){
        return vendorCode + '-' + vendorName
      }else if(values.amounttype == '1' && values.entry_to == '3'){
        return '1012 - Foods'
      }else if(values.amounttype == '1' && values.entry_to == '4'){
        return '1060 - Consumer'
      }else if(values.amounttype == '1' && values.entry_to == '2'){
        return FJ_Sales_Customer_Code + ' - ' + FJ_Sales_Customer_Name
      }else if(values.amounttype == '1' && values.entry_to == '1' && values.rj_so_income == '2'){
        return RjCustomer
      }else if(values.amounttype == '1' && values.entry_to == '1' && values.rj_so_income == '1'){
        return RJ_vendor_Code + ' - ' + RJ_vendor_Name
      }else if(values.amounttype == '3' && values.driverId){
        return driverCodeById + ' - ' + driverPhoneNumberById
      }else if(values.amounttype == '2' && values.entry_to == '5'){
        return driverCodeById + ' - ' + driverPhoneNumberById
      }else if(values.amounttype == '2' && values.entry_to == '7' && vType != 'Hire'){
        return values.diesel_vendor_code + ' - ' + diesel_name
      }else if(values.amounttype == '2' && values.entry_to == '7' && vType == 'Hire'){
        return vendorCode + ' - ' + vendorName
      }else if(values.amounttype == '2' && values.entry_to == '9'){
        return '213267 - Fastag'
      }else if(values.amounttype == '2' && values.entry_to == '8'){
        return '229304 - OST LOGISTICS'
      } else {
        return entryToFinder(values.entry_to,2)
      }
    }


    /* ==================== FI Single TripSheet FI Details Report Start ========================*/

    const FIType = (id) => {
      if (id == 1) {
        return 'Income'
      } else if (id == 2) {
        return 'Expense'
      } else if (id == 3) {
        return 'Advance'
      } else {
        return ''
      }
    }

    const EntryType = (id) => {
      if (id == 1) {
        return 'RJ Customer'
      } else if (id == 2) {
        return 'To Pay Customer'
      } else if (id == 3) {
        return 'Foods'
      } else if (id == 4) {
        return 'Consumer'
      } else if (id == 5) {
        return 'Driver Vendor'
      } else if (id == 6) {
        return 'Freight Vendor'
      } else if (id == 7) {
        return 'Diesel Vendor'
      } else if (id == 8) {
        return 'Contract Vendor'
      } else if (id == 9) {
        return 'Fast Tag'
      } else {
        return entryToFinder(id,1)
      }
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

    let tableReportData = []
    const loadTripFIReport = () => {
        if(values.tripsheetNumber){
        FIEntryService.singleTripFIDetailsList(tsId).then((res) => {
          tableReportData = res.data.data
          console.log(res.data.data)
          let rowDataList = []
          let filterData = tableReportData
          console.log(filterData)
          let indexNo = 0
          filterData.map((data, index) => {
            data.gl_type_expense.map((data1, index2) => {
              indexNo += 1
              rowDataList.push({
              sno: indexNo,
              Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
              Tripsheet_Date: data.trip_sheet_info.created_date,
              fi_entry_type: FIType(data.fi_entry_type),
              sap_fi_document_no: data.sap_fi_document_no,
              sap_fi_posting_date: formatDate(data.sap_fi_posting_date),
              Vehicle_Type: data.parking_yard_info.vehicle_type_id.type,
              Vehicle_No: data.parking_yard_info.vehicle_number,
              Driver_Name: data.driver_info?.driver_name||data.parking_yard_info.driver_name,
              Driver_Mobile_Number: data.driver_info?.driver_phone_1 || data.parking_yard_info.driver_contact_number,
              Trip_Driver_Name: data.parking_yard_info.driver_name,
              Trip_Driver_Mobile_Number: data.parking_yard_info.driver_contact_number,
              vendor_code: data.vendor_code,
              fi_mode: data.fi_mode == '1' ? 'Credit' : data.fi_mode == '2' ? 'Debit' : '-',
              tds_type: data.tds_type == '1' ? 'Yes' : data.tds_type == '2' ? 'No' : '-',
              tds_value: data.tds_type == '1' ? (data.vendor_tds ? data.vendor_tds : '-') : '-',
              hsn_type: data.vendor_hsn ? data.vendor_hsn : '-',
              gst_tax_type: data.gst_tax_type || '-',
              supplier_posting_dates: formatDate(data.supplier_posting_date) == '01-01-1970'  ?  '-' : formatDate(data.supplier_posting_date),
              supplier_ref_no: data.supplier_ref_no || '-',
              entry_to: EntryType(data.entry_to),
              freight_amount: data1.EXPENSE_AMT || data.amount,
              gl_type:data1.label || data.gl_list_info?.gl_description || '-',
              gl_code:data1.GL_CODE || data.gl_list_info?.gl_code || '-',
              diesel_vendor_name: data.diesel_vendor_info != null?data.diesel_vendor_info.diesel_vendor_name : '-',
              Remarks: data.remarks,
              created_by: data.user_info?.emp_name,
              Creation_Time: data.created_at,
            })
          })
        })
          setRowData(rowDataList)
          setFetch(true)
      })
    }
  }
    useEffect(() => {
      loadTripFIReport()
    }, [tsId])

    const columns = [
      {
        name: 'S.No',
        selector: (row) => row.sno,
        sortable: true,
        center: true,
      },
      {
        name: 'TripSheet No',
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
        name: 'Driver Mobile Number',
        selector: (row) => row.Driver_Mobile_Number,
        sortable: true,
        center: true,
      },
      {
        name: 'FI Entry Type',
        selector: (row) => row.fi_entry_type,
        sortable: true,
        center: true,
      },
      {
        name: 'FI Mode',
        selector: (row) => row.fi_mode || '-',
        sortable: true,
        center: true,
      },
      {
        name: 'Vendor/Customer Code',
        selector: (row) => row.vendor_code || '-',
        sortable: true,
        center: true,
      },
      {
        name: 'FI Document No',
        selector: (row) => row.sap_fi_document_no,
        sortable: true,
        center: true,
      },
      {
        name: 'SAP Posting Date',
        selector: (row) => row.sap_fi_posting_date,
        sortable: true,
        center: true,
      },
      {
        name: 'Entry',
        selector: (row) => row.entry_to,
        sortable: true,
        center: true,
      },
      {
        name: 'GL Type',
        selector: (row) => row.gl_type,
        sortable: true,
        center: true,
      },
      {
        name: 'GL Code',
        selector: (row) => row.gl_code,
        sortable: true,
        center: true,
      },
      {
        name: 'Amount',
        selector: (row) => row.freight_amount,
        sortable: true,
        center: true,
      },
      {
        name: 'Diesel Vendor Name',
        selector: (row) => row.diesel_vendor_name,
        sortable: true,
        center: true,
      },
      {
        name: 'GST TAX Type',
        selector: (row) => row.gst_tax_type,
        sortable: true,
        center: true,
      },
      {
        name: 'TDS',
        selector: (row) => row.tds_type,
        sortable: true,
        center: true,
      },
      {
        name: 'TDS Value',
        selector: (row) => row.tds_value,
        sortable: true,
        center: true,
      },
      {
        name: 'HSN Type',
        selector: (row) => row.hsn_type,
        sortable: true,
        center: true,
      },
      {
        name: 'Supplier Ref.No',
        selector: (row) => row.supplier_ref_no,
        sortable: true,
        center: true,
      },
      {
        name: 'Supplier Posting Date',
        selector: (row) => row.supplier_posting_dates,
        sortable: true,
        center: true,
      },

      {
        name: 'Remarks',
        selector: (row) => row.Remarks,
        sortable: true,
        center: true,
      },

      {
        name: 'Created By',
        selector: (row) => row.created_by,
        sortable: true,
        center: true,
      },

      {
        name: 'Creation Date',
        selector: (row) => row.Creation_Time,
        sortable: true,
        center: true,
      },
    ]
    /* ==================== FI Single TripSheet FI Details Report End ========================*/
function createFIEntry() {

      setState({ ...state, page_loading: true })

/* GL List For Driver and Contract vendor Array convertor*/
  var OwnExpense = {}
  var OwnExpense_Seq = []
  for (var i = 0; i < selected.length; i++) {
    OwnExpense.GL_CODE = selected[i].GL_CODE
    OwnExpense.COST_CENTER = selected[i].COST_CENTER
    OwnExpense.EXPENSE_AMT = selected[i].EXPENSE_AMT
    OwnExpense.LINE_ITEM = selected[i].LINE_ITEM
    OwnExpense.LABEL = selected[i].label.slice(0, -9);

    OwnExpense_Seq[i] = OwnExpense

    OwnExpense = {}
  }

  /* GL List For Freight vendor Array convertor*/
  var HireExpense = {}
  var HireExpense_Seq = []

  for (var i = 0; i < selectedHire.length; i++) {
    HireExpense.GL_CODE = selectedHire[i].GL_CODE
    HireExpense.COST_CENTER = selectedHire[i].COST_CENTER
    HireExpense.EXPENSE_AMT = selectedHire[i].EXPENSE_AMT
    HireExpense.LINE_ITEM = selectedHire[i].LINE_ITEM
    HireExpense.LABEL = selectedHire[i].label.slice(0, -9)

    HireExpense_Seq[i] = HireExpense

    HireExpense = {}
  }

  /* SAP Send Data Array convertor*/
      var SAPApendData_Seq = []
      var SAPApendData = {}

      SAPApendData.TRIPSHEET_NO = values.tripsheetNumber
      SAPApendData.VEHICLE_NO = vehNo
      SAPApendData.VEH_TYPE = vType
      SAPApendData.DIVISION = values.entry_to == '1' ? 'RJ CUSTOMER':values.entry_to == '2' ? 'FJ CUSTOMER':values.entry_to == '3' ? 'FOODS' : values.entry_to == '4' ? 'CONSUMER' : entryToFinder(values.entry_to,1)
      SAPApendData.LIFNR = FIVendorCode ()
      SAPApendData.FI_ENTRY_TYPE = values.amounttype == '1' ? 'INCOME' : values.amounttype == '2' ? 'EXPENSE':values.amounttype == '3' ? 'ADVANCE':''
      SAPApendData.FI_VENDOR_TYPE = values.entry_to == '5' ? 'Driver Vendor' : values.entry_to == '6' ? 'Freight Vendor':values.entry_to == '7' ? 'Diesel Vendor':values.entry_to == '8'? 'Contract Vendor':values.entry_to == '9'? 'FASTAG':''
      SAPApendData.FI_MODE = values.mode_of_payment == '1' ? 'CREDIT' : values.mode_of_payment == '2' ? 'DEBIT' : ''
      SAPApendData.GL_CODE = values.entry_to == '9' ? '418013' : gl_code
      SAPApendData.COST_CENTER = values.entry_to == '9' ? 'LD-FASTTAG' : cost_center
      SAPApendData.TAX_TYPE = values.gst_tax_type
      SAPApendData.TDS = values.tds_type == '1' ? 'YES' : values.tds_type == '2' ? 'NO' : ''
      // SAPApendData.TDS_VALUE = values.tds_type == '1' ? (values.entry_to == '7' ? 'T9' : singleVehicleInfo.parking_info?.vendor_info?.gst_tax_code) : ''
      SAPApendData.TDS_VALUE = values.tds_type == '1' ? (values.entry_to == '7' ? 'Q1' : tdsConversion(singleVehicleInfo.parking_info?.vendor_info?.gst_tax_code)) : ''
      SAPApendData.HSN = values.hsn_type ? values.hsn_type : ''
      if(values.amounttype == '1'){
      SAPApendData.INCOME_AMT = values.freight_amount
      }else{
      SAPApendData.EXPENSE_AMT = values.freight_amount
      }
      SAPApendData.POST_DATE = values.sap_fi_posting_date
      SAPApendData.REF_NO = values.supplier_ref_no
      SAPApendData.REF_DATE = values.supplier_posting_date
      SAPApendData.REMARKS = remarks
      SAPApendData.PAYMENT_TYPE = values.payment_mode == '1' ? 'CASH':values.payment_mode == '2' ? 'BANK' : ''


      if(values.entry_to == '6'){
        SAPApendData.LINE = HireExpense_Seq
      }else if(values.entry_to == '5' || values.entry_to == '8'){
        SAPApendData.LINE = OwnExpense_Seq
      }

      // let sap_data = new FormData()
      // sap_data.append('TRIPSHEET_NO',values.tripsheetNumber)
      // sap_data.append('VEHICLE_NO', vehNo)
      // sap_data.append('VEH_TYPE',vType)
      // sap_data.append('DIVISION',values.entry_to == '1' ? 'RJ CUSTOMER':values.entry_to == '2' ? 'FJ CUSTOMER':values.entry_to == '3' ? 'FOODS' : values.entry_to == '4' ? 'CONSUMER' : '')
      // if(vTypeId == 3 && values.amounttype == '2'&& values.entry_to == '6'){
      //     sap_data.append('LIFNR', vendorCode)
      //   }else if(values.amounttype == '1' && values.entry_to == '3'){
      //     sap_data.append('LIFNR', '1012')
      //   }else if(values.amounttype == '1' && values.entry_to == '4'){
      //     sap_data.append('LIFNR', '1060')
      //   }else if(values.amounttype == '1' && values.entry_to == '2'){
      //     sap_data.append('LIFNR', FJ_Sales_Customer_Code)
      //   }else if(values.amounttype == '1' && values.entry_to == '1'){
      //     sap_data.append('LIFNR', RJ_vendor_Code)
      //   }else if(values.amounttype == '3' && values.driverId){
      //     sap_data.append('LIFNR', driverCodeById)
      //   }else if(values.amounttype == '2' && values.entry_to == '5'){
      //     sap_data.append('LIFNR', driverCodeById)
      //   }else if(values.amounttype == '2' && values.entry_to == '7'){
      //     sap_data.append('LIFNR', values.diesel_vendor_code)
      //   }else if(values.amounttype == '2' && values.entry_to == '9'){
      //     sap_data.append('LIFNR', '213267')
      //   }else if(values.amounttype == '2' && values.entry_to == '8'){
      //     sap_data.append('LIFNR', '229304')
      //   }
      // sap_data.append('FI_ENTRY_TYPE', values.amounttype == '1' ? 'INCOME' : values.amounttype == '2' ? 'EXPENSE':values.amounttype == '3' ? 'ADVANCE':'')
      // sap_data.append('FI_VENDOR_TYPE', values.entry_to == '5' ? 'Driver Vendor' : values.entry_to == '6' ? 'Freight Vendor':values.entry_to == '7' ? 'Diesel Vendor':values.entry_to == '8'? 'Contract Vendor':values.entry_to == '9'?'FASTTAG':'')
      // sap_data.append('FI_MODE', values.mode_of_payment == '1' ? 'CREDIT' : values.mode_of_payment == '2' ? 'DEBIT' : '')
      // sap_data.append('GL_CODE', gl_code)
      // sap_data.append('COST_CENTER', cost_center)
      // if(values.amounttype == '1'){
      // sap_data.append('INCOME_AMT', values.freight_amount)
      // }else{
      // sap_data.append('EXPENSE_AMT', values.freight_amount)
      // }
      // sap_data.append('TAX_TYPE', values.gst_tax_type)
      // sap_data.append('TDS', values.tds_type == '1' ? 'YES' :values.tds_type == '2' ? 'NO' : '')
      // sap_data.append('POST_DATE', values.sap_fi_posting_date)
      // sap_data.append('REF_NO', values.supplier_ref_no)
      // sap_data.append('REMARKS', remarks)
      // if(vTypeId == 3){
      //   sap_data.append('LINE',  selectedHire.length == "0" ? '' : JSON.stringify(selectedHire))
      //   }else{
      //   sap_data.append('LINE',  selected.length == "0" ? '' : JSON.stringify(OwnExpense_Seq))
      //   }

      // console.log(OwnExpense_Seq)
      // return false

      // values.expense
      // values.freight_amount
      // if(values.expense){
      // sap_data.append(values.expense,values.freight_amount)
      // }
      // // data.append(expense_type(values.expense), values.freight_amount)
      // // data.append('HALTING_CHARG', values.freight_amount)
      // // data.append('SUBDELIVERY_CHARG', values.freight_amount)
      // // data.append('UNLOADING_CHARG', values.freight_amount)
      // // data.append('WEIGHMENT_CHARG', values.freight_amount)
      // // data.append('LOW_TONAGE_CHARG', values.freight_amount)
      // // data.append('BATA', values.freight_amount)
      // // data.append('MUNICIPAL_CHARG', values.freight_amount)
      // // data.append('PORT_ENTRY_FEE', values.freight_amount)
      // // data.append('MISC_CHARG', values.freight_amount)
      // // data.append('FINE_AMOUNT', values.freight_amount)
      // // data.append('MAINT_COST', values.freight_amount)
      // // data.append('LOADING_CHARG', values.freight_amount)
      // // data.append('TARPAULIN_CHARG', values.freight_amount)
      // // data.append('STOCK_DIVERSION_RETURN', values.freight_amount)
      // // data.append('FREIGHT_CHARG', values.freight_amount)
      // // data.append('ENROUTE_DIESEL', values.freight_amount)
      // // data.append('Payment_amt', values.freight_amount)
      // // data.append('Receipt_amt', values.freight_amount)
      // else if(Diesel_vendor_code){
      // sap_data.append('FI_DIESEL_AMT', values.freight_amount)
      // }
      // else if(values.rj_so_no){
      // sap_data.append('FI_RJ_CUSTOMER_AMT', values.freight_amount)
      // }
      // else if(values.amounttype == '3'){
      //   sap_data.append('Payment_amt', values.freight_amount)
      // }
      // else if(values.amounttype == '4'){
      //   sap_data.append('Receipt_amt', values.freight_amount)
      // }


      //Validations For FI Entry

      if(values.amounttype == '0'){
          setFetch(true)
          toast.warning('Please Choose FI Entry Type ...')
          return false
      }else if((values.amounttype == '3' || (values.amounttype == '2' && values.entry_to == '5' && vType != 'Hire')) && values.driverId == ''){
        setFetch(true)
        toast.warning('Please Choose Drivers ...')
        return false
      }else if((values.amounttype == '3' || values.amounttype == '1') && (isTouched.freight_amount && !/^[\d]{2,6}$/.test(values.freight_amount))){
        setFetch(true)
        toast.warning('Please Enter The Amount ...')
        return false
      }else if(values.amounttype == '3'&& (values.payment_mode == '' || values.payment_mode == undefined)){
        setFetch(true)
        toast.warning('Select Payment Mode ...')
        return false
      }else if((values.amounttype == '1' || values.amounttype == '2') && values.mode_of_payment == ''){
        setFetch(true)
        toast.warning('Please Choose Mode Of Payment ...')
        return false
      }else if(values.amounttype == '1'&& values.gl_list_id == ''){
        setFetch(true)
        toast.warning('Please Choose GL Type ...')
        return false
      }else if(values.amounttype == '1'&& values.entry_to == '1' && values.rj_so_income == '0'){
        setFetch(true)
        toast.warning('Please Choose RJ Income ...')
        return false
      }else if(values.amounttype == '1'&& values.entry_to == '1' && values.rj_so_income == '1' && values.rj_so_no == '0'){
        setFetch(true)
        toast.warning('Please Choose RJ Sales Order ...')
        return false
      }else if(values.amounttype == '1'&& values.entry_to == '1' && values.rj_so_income == '2' && RjCustomer == '0'){
        setFetch(true)
        toast.warning('Please Choose RJ Customer ...')
        return false
      }else if(values.amounttype == '1'&& values.entry_to == '2' && values.customer_code == '0'){
        setFetch(true)
        toast.warning('Please Choose FJ Customer ...')
        return false
      }else if(values.amounttype == '1' && values.entry_to == '5' && selected == ''){
        setFetch(true)
        toast.warning('Please Select the Expense GL Type ...')
        return false
      }else if(values.entry_to == '6' && selectedHire == ''){
        setFetch(true)
        toast.warning('Please Select the Expense GL Type ...')
        return false
      }else if((values.mode_of_payment == '1' || values.mode_of_payment == '2') && (values.entry_to == '6' || values.entry_to == '7' || values.entry_to == '8') && values.gst_tax_type == ''){
        setFetch(true)
        toast.warning('Please Select the GST Tax Type ...')
        return false
      }else if((values.mode_of_payment == '1' || values.mode_of_payment == '2') && (values.entry_to == '6' || values.entry_to == '8') && values.supplier_ref_no == ''){
        setFetch(true)
        toast.warning('Please Enter Supplier Reference Number ...')
        return false
      }
      else if((values.mode_of_payment == '1' || values.mode_of_payment == '2') && ((values.entry_to == '6' || values.entry_to == '7' || values.entry_to == '8') && values.tds_type == '')){
        setFetch(true)
        toast.warning('Please Select the TDS Type ...')
        return false
      } 
      else if((values.mode_of_payment == '1' || values.mode_of_payment == '2') && (values.entry_to == '6' || values.entry_to == '7' || values.entry_to == '8') && values.hsn_type == ''){
        setFetch(true)
        toast.warning('Please Select the HSN Type ...')
        return false
      } else if(values.entry_to == '7' && values.diesel_vendor_code == ''){
        setFetch(true)
        toast.warning('Please Choose Diesel Vendor ...')
        return false
      }else if(values.entry_to == '7' && (isTouched.freight_amount && !/^[\d]{2,6}$/.test(values.freight_amount))){
        setFetch(true)
        toast.warning('Please Enter Diesel Amount ...')
        return falsex
      }else if(values.entry_to == '8' && selected == ''){
        setFetch(true)
        toast.warning('Please Expense GL Type ...')
        return false
      }else if(values.entry_to == '9' && (isTouched.freight_amount && !/^[\d]{2,6}$/.test(values.freight_amount))){
        setFetch(true)
        toast.warning('Please Enter the Amount ...')
        return false
      }else if(remarks == ''){
        setFetch(true)
        toast.warning('Please Enter the Remarks...')
        return false
      }else if(values.sap_fi_posting_date == undefined || values.sap_fi_posting_date == ''){
        setFetch(true)
        toast.warning('Enter Posting Date')
        return false
      }else if(values.entry_to == '6' && (!/^[\d]{2,6}$/.test(sum_hire))){
        setFetch(true)
        toast.warning('Total Amount Should Not Allow 0 ...')
        return false
      }else if(values.amounttype == '1' && values.entry_to == '5' && (!/^[\d]{2,6}$/.test(sum_own))){
        setFetch(true)
        toast.warning('Total Amount Allow only numeric ...')
        return false
      }else if(values.entry_to == '8' && (!/^[\d]{2,6}$/.test(sum_own))){
        setFetch(true)
        toast.warning('Total Amount Allow only numeric ...')
        return false
      }else if((values.gst_tax_type == 'R5' || values.gst_tax_type == 'F6') && values.supplier_ref_no == ''){
        setFetch(true)
        toast.warning('Supplier Reference Number Mandatory ...')
        return false
      }else if((values.gst_tax_type == 'R5' || values.gst_tax_type == 'F6') && values.supplier_posting_date == ''){
        setFetch(true)
        toast.warning('Supplier Reference Date Mandatory ...')
        return false
      }

      console.log(SAPApendData,'SAPApendData')
      
      SAPApendData_Seq.push(SAPApendData)

       FIEntrySAP.FIEntrySAPData(SAPApendData_Seq).then((res) => {
        console.log(res.data.DOCUMENT_NO)
        values.sap_fi_document_no = res.data.DOCUMENT_NO
        values.sap_status = res.data.STATUS

        const formData = new FormData()
        formData.append('vehicle_id', vehId)
        formData.append('driver_id', values.driverId)
        formData.append('parking_id', Parking_id)
        formData.append('tripsheet_id', tsId)
        formData.append('rj_sales_id', RJ_Sales_id)
        formData.append('diesel_vendor_id', Diesel_vendor_id)
        formData.append('vendor_code', FIVendorCode ())
        formData.append('fi_entry_type', values.amounttype)
        formData.append('entry_to', values.entry_to)
        formData.append('fi_mode', values.mode_of_payment)
        if(vTypeId == 3 && values.entry_to == '6'){
          formData.append('gl_type_expense',  selectedHire.length == "0" ? '[{}]' : JSON.stringify(selectedHire))
        }else if(values.entry_to == '8' || values.entry_to == '5'){
          formData.append('gl_type_expense',  selected.length == "0" ? '[{}]' : JSON.stringify(selected))
        }else{
          formData.append('gl_type_expense','[{}]')
        }
        formData.append('amount', values.freight_amount || sum_own || sum_hire)
        formData.append('tds_type', values.tds_type)
        if(values.tds_type == '1'){
          // formData.append('tds_value', values.tds_type  == '1' ? (values.entry_to == '7' ? 'T9' : singleVehicleInfo.parking_info?.vendor_info?.gst_tax_code) : '')
          formData.append('tds_value', values.tds_type  == '1' ? (values.entry_to == '7' ? 'Q1' : tdsConversion(singleVehicleInfo.parking_info?.vendor_info?.gst_tax_code)) : '')
          
          formData.append('hsn_type', values.hsn_type)
        }        
        formData.append('supplier_ref_no', values.supplier_ref_no)
        formData.append('supplier_posting_date', values.supplier_posting_date)
        formData.append('gst_tax_type', values.gst_tax_type)
        formData.append('vehicle_assignment_id', FJ_Sales_Shipment_ID || '')
        formData.append('trip_settlement_id', values.trip_settlement_id || '')
        formData.append('gl_type_id', values.entry_to == '9' ? '79' : values.gl_list_id)
        formData.append('sap_fi_document_no', values.sap_fi_document_no)
        formData.append('sap_fi_posting_date', values.sap_fi_posting_date)
        formData.append('fi_status', 1)
        formData.append('remarks', remarks)
        formData.append('attachment', values.attachment)
        formData.append('created_by', user_id)
        formData.append('payment_mode', values.payment_mode || 0)
        if(values.sap_status == undefined || values.sap_status == '' || values.sap_status == '2'){
          setFetch(true)
          toast.warning('FI Entry Cannot be Posted From SAP.. Kindly Contact Admin!')
          return false
        }
        if(values.sap_status == '2'){
          setFetch(true)
          toast.warning('Advance Amount Exceed .. Kindly Contact Admin!')
          return false
        }

        FIEntryService.addFiEntryData(formData).then((res) => {
          if (res.status === 200) {
            setFetch(true)
            setAcceptBtn(true)
            // showAlert()
            Swal.fire({
              title: "FI Submitted Successfully",
              text:  'SAP Document No - ' + values.sap_fi_document_no,
              icon: "success",
              confirmButtonText: "OK",
            }).then(function () {
              // Redirect the user
              window.location.reload(false)
            });
            // toast.success('FI Entry Created Successfully! - ' +values.sap_fi_document_no)
            // navigation('/FIEntryReport')
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

        .catch((error) => {
          setFetch(true)
          // setState({ ...state })
          alert(error.message)
        })
      })
    }
        /* TripSheet Change empty*/

    const changevehicleType = () => {
      values.entry_to = ''
      values.expense = ''
      values.freight_amount = ''
      values.payment_mode = ''
      values.mode_of_payment = ''
      values.attachment = ''
      values.remarks = ''
      values.diesel_vendor_name = ''
      values.diesel_vendor_code = ''
      values.rj_so_no = ''
      values.gl_list_id =''
      values.customer_code = ''
    }
        /* FI Entry Type change empty*/

    const changevehicleType1 = () => {
      values.gl_list_id = ''
      values.entry_to = ''
      values.freight_amount = ''
      values.attachment = ''
      values.remarks = ''
      values.diesel_vendor_name = ''
      values.diesel_vendor_code = ''
      values.rj_so_no = ''
      values.rj_so_income = '0'
      values.customer_code = ''
      values.mode_of_payment = ''
      values.sap_fi_posting_date = ''
      values.tds_type = ''
      values.gst_tax_type = ''
      values.supplier_ref_no = ''
      values.supplier_posting_date = ''
      sum_hire = '0'
      sum_own = '0'
      values.driverId = ''
      setSelected([])
      setSelectedHire([])
      setRjCustomer('')
      setCost_center('')
      setGLCode('')
    }
        /* FI Entry to change empty*/

    const changevehicleType2 = () => {
      values.entry_to = ''
      values.freight_amount = ''
      values.attachment = ''
      values.remarks = ''
      values.diesel_vendor_name = ''
      values.diesel_vendor_code = ''
      values.rj_so_no = ''
      values.rj_so_income = '0'
      values.customer_code = ''
      values.mode_of_payment = ''
      values.sap_fi_posting_date = ''
      values.tds_type = ''
      values.gst_tax_type = ''
      values.driverId = ''
      values.supplier_ref_no = ''
      values.supplier_posting_date = ''
      setSelected([])
      setSelectedHire([])
      setRjCustomer('')
      // setCost_center('')
      // setGLCode('')
    }
    const changevehicleType3 = () => {
      values.freight_amount = ''
      values.attachment = ''
      values.remarks = ''
      values.diesel_vendor_name = ''
      values.diesel_vendor_code = ''
      values.rj_so_no = ''
      values.rj_so_income = '0'
      values.customer_code = ''
      values.sap_fi_posting_date = ''
      values.tds_type = ''
      values.gst_tax_type = ''
      values.supplier_ref_no = ''
      values.supplier_posting_date = ''
      values.driverId = ''
      setSelected([])
      setSelectedHire([])
      setRjCustomer('')
      // setCost_center('')
      // setGLCode('')
    }

    /* Diesel Vendor change empty*/

    const changevehicleType4 = () => {
      values.gl_list_id = '0'
      values.freight_amount = ''
      values.attachment = ''
      values.remarks = ''
      values.rj_so_no = ''
      values.rj_so_income = '0'
      values.customer_code = ''
      values.sap_fi_posting_date = ''
      values.tds_type = ''
      values.gst_tax_type = ''
      values.driverId = ''
      values.supplier_ref_no = ''
      values.supplier_posting_date = ''
      setSelected([])
      setSelectedHire([])
      setRjCustomer('')
    }

    /* Driver and Contract Multiselect QTY OnChange */

  const handleChangesOwn = (e, i) => {
    const { value, name } = e.target;

    const newState = [...selected];
    newState[i] = {
      ...newState[i],
      [name]: value
    };

    console.log(newState);
    setSelected(newState);
  };

        /* Freight Vendor Multiselect QTY OnChange */

  const handleChangesHire = (e, i) => {
    const { value, name } = e.target;

    const newState = [...selectedHire];
    newState[i] = {
      ...newState[i],
      [name]: value
    };

    console.log(newState);
    setSelectedHire(newState);
  };

  /* Multi select looping value total calculation */

  var sum_own = 0;
  var sum_hire = 0;

  (selected).forEach(subData => sum_own += Number(subData.EXPENSE_AMT));
  (selectedHire).forEach(subData => sum_hire += Number(subData.EXPENSE_AMT));


  /* SAP Posting Date */

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate(user_access_for_back_date);

  // var FreightAmount = 0;

  // selected.forEach((value) => {
  //   FreightAmount = value.FRE_EXP_AMT
  // });

  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      let tableData = response.data.data
      const filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setTaxType(filterData)
      setSmallFetch(true)
    })
    }, [])

  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(11).then((response) => {
      let tableData = response.data.data
      const filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setPaymentMode(filterData)
    })
    }, [])
 useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(20).then((response) => {
      let tableData = response.data.data
      const filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setGstTaxType(filterData)
    })
    }, [])

    // ========================================== ASK OTHERS PART START ========================================== //
    const othersDivisionArray = [
      {div:'FOODS',val:3,div_code:'1012'},
      {div:'CONSUMER',val:4,div_code:'1060'},
      {div:'DETERGENTS',val:10,div_code:'1001'},
      {div:'MINERALS',val:11,div_code:'1002'},
      {div:'LOGISTICS',val:12,div_code:''},
      {div:'IFOODS',val:13,div_code:'1111'},
      {div:'SERVICE',val:14,div_code:'1016'},
    ]
    const entryToFinder = (code,type) => {
      let entryTo = ''
      
      othersDivisionArray.map((vv,kk)=>{
        if(vv.val == code){
          if(type == 1){
            entryTo = vv.div
          } else if(type == 2){
            entryTo = `${vv.div_code} - ${vv.div}`
          } else if(type == 3){
            entryTo = vv.div_code
          }
          
        }
      })
      return entryTo
    }
    // ========================================== ASK OTHERS PART END ========================================== //
    /* ============================= ASK Part Start ================================= */

      const [sapHsnData, setSapHsnData] = useState([])
      const [tdsMasterData, setTdsMasterData] = useState([])

      useEffect(() => {
        /* section for getting Sap Hsn Data from database */
        DefinitionsListApi.visibleDefinitionsListByDefinition(27).then((response) => {
          console.log(response.data.data,'DefinitionsListApi-setSapHsnData')
          setSapHsnData(response.data.data)
        })

        /* section for getting TDS Master Data from database */
        DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
          console.log(response.data.data,'DefinitionsListApi-setTdsMasterData')
          setTdsMasterData(response.data.data)
        })
      }, [])

    /* ============================= ASK Part End ================================= */
    // ========================================== ASK PART START ========================================== //

    const [currentProcessId, setCurrentProcessId] = useState(0)
    // const [fiEntryMode, setFiEntryMode] = useState(0)
    const [visible, setVisible] = useState(false)
    const [fiImgSrc, setFiImgSrc] = React.useState(null);
    const [tripRPSHaving, setTripRPSHaving] = useState(false)
    const [tripRPSNumberNew, setTripRPSNumberNew] = useState('')
    const [tripRPSData, setTripRPSData] = useState([]);
    const [rakeRowData, setRakeRowData] = useState([])
    const [smallfetch, setSmallFetch] = useState(false)
    const [headEnable, setHeadEnable] = useState(true)
    const [rakeModalEnable, setRakeModalEnable] = useState(false)

    const [tripFPSHaving, setTripFPSHaving] = useState(false)
    const [tripFPSNumberNew, setTripFPSNumberNew] = useState('')
    const [tripFPSData, setTripFPSData] = useState([]);
    const [fciRowData, setFciRowData] = useState([])
    const [fciModalEnable, setFciModalEnable] = useState(false)

    const assignValues = (id) => {
      console.log(id,'assignValues-id')
      if(id !=0){
        setHeadEnable(false)
      }
      setCurrentProcessId(id)
    }

    const border = {
      borderColor: '#b1b7c1',
      cursor: 'pointer'
    }

    const RakeFI_Array = ['','Expense Credit','Expense Debit','Income Credit','Income Debit']
    const RakePlant_Array = []
    RakePlant_Array['R1'] = 'Dindigul'
    RakePlant_Array['R2'] = 'Aruppukottai'

    useEffect(() => {
      loadRakeTripFIReport()
    }, [tripRPSData])

    const rake_column = [
      {
        name: 'S.No',
        selector: (row) => row.SNO,
        sortable: true,
        center: true,
      },
      {
        name: 'RPS No',
        selector: (row) => row.RPS_NO,
        sortable: true,
        center: true,
      },
      {
        name: 'FNR No',
        selector: (row) => row.FNR_NO,
        sortable: true,
        center: true,
      },
      {
        name: 'Plant',
        selector: (row) => row.RAKE_LOC,
        sortable: true,
        center: true,
      },
      {
        name: 'Vendor Name',
        selector: (row) => row.VENDOR_NAME,
        sortable: true,
        center: true,
      },
      {
        name: 'Vendor Code',
        selector: (row) => row.VENDOR_CODE,
        sortable: true,
        center: true,
      },
      {
        name: 'FI Entry Type',
        selector: (row) => row.FI_TYPE,
        sortable: true,
        center: true,
      },
      {
        name: 'Income Division',
        selector: (row) => row.INCOME_DIV,
        sortable: true,
        center: true,
      },
      {
        name: 'GST Tax Type',
        selector: (row) => row.GST_TAX,
        sortable: true,
        center: true,
      },
      {
        name: 'TDS Available',
        selector: (row) => row.TDS_AVAIL,
        sortable: true,
        center: true,
      },
      {
        name: 'TDS Tax Type',
        selector: (row) => row.TDS_TAX,
        sortable: true,
        center: true,
      },
      {
        name: 'GL Count',
        selector: (row) => row.GL_COUNT,
        sortable: true,
        center: true,
      },
      {
        name: 'Supp. Ref. No',
        selector: (row) => row.SUP_REF_NO,
        sortable: true,
        center: true,
      },
      {
        name: 'Supp. Doc. Date',
        selector: (row) => row.SUP_DOC_DATE,
        sortable: true,
        center: true,
      },
      {
        name: 'FI Doc. No',
        selector: (row) => row.INCOME_FI_DOC,
        sortable: true,
        center: true,
      },
      {
        name: 'FI TDS Doc. No',
        selector: (row) => row.INCOME_FI_TDS_DOC,
        sortable: true,
        center: true,
      },
      {
        name: 'Attachment',
        selector: (row) => row.ATTACHMENT,
        // sortable: true,
        center: true,
      },
      {
        name: 'SAP Posting Date',
        selector: (row) => row.POSTING_DATE,
        sortable: true,
        center: true,
      },
      {
        name: 'GL Code',
        selector: (row) => row.INCOME_GL,
        sortable: true,
        center: true,
      },
      {
        name: 'GL Code',
        selector: (row) => row.GL_TYPE,
        sortable: true,
        center: true,
      },
      {
        name: 'GL Amount',
        selector: (row) => row.GL_AMOUNT,
        sortable: true,
        center: true,
      },
      {
        name: 'Amount',
        selector: (row) => row.INCOME_EXPENSE_AMOUNT,
        sortable: true,
        center: true,
      },
      {
        name: 'Remarks',
        selector: (row) => row.FI_REMARKS,
        sortable: true,
        center: true,
      },
      {
        name: 'TDS Remarks',
        selector: (row) => row.FI_TDS_REMARKS,
        sortable: true,
        center: true,
      },
      {
        name: 'Created By',
        selector: (row) => row.USER_NAME,
        sortable: true,
        center: true,
      },
      {
        name: 'Creation Time',
        selector: (row) => row.CREATION_TIME,
        sortable: true,
        center: true,
      },
    ]

    const loadRakeTripFIReport = () => {
      if(tripRPSNumberNew){
        RakeClosureSubmissionService.getFIInfoByRPS(tripRPSNumberNew).then((res) => {
          tableReportData = res.data.data
          console.log(res.data.data,'getFIInfoByRPS')
          let rowDataList = []
          let filterData = tableReportData
          console.log(filterData)
          let indexNo = 0
          filterData.map((data, index) => {
            console.log(data,'getFIInfoByRPSChild',index)
            if(data.fi_entry_mode == 3 || data.fi_entry_mode == 4){
              indexNo += 1
              rowDataList.push({
                SNO: indexNo,
                RPS_NO: data.rps_no,
                FNR_NO: data.fnr_no,
                RAKE_LOC: RakePlant_Array[data.rake_plant_code],
                RPS_DATE: data.created_at_date,
                VENDOR_NAME: data.vendor_info.v_name,
                VENDOR_CODE:data.vendor_code,
                INCOME_DIV:data.income_division,
                FI_TYPE: RakeFI_Array[data.fi_entry_mode],
                FI_REMARKS:data.fi_remarks,
                FI_TDS_REMARKS:data.fi_tds_remarks,
                INCOME_GL:data.income_gl_code,
                GL_AMOUNT:data.amount,
                INCOME_EXPENSE_AMOUNT:data.amount,
                INCOME_FI_DOC:data.sap_fi_doc_no,
                ATTACHMENT:(
                  <span
                    onClick={() => {
                      setVisible(!visible)
                      setFiImgSrc(data.attachment_copy)
                    }}
                    className="w-100 m-0"
                    color="info"
                    size="sm"
                    id="odoImg"
                    style={border}
                  >
                    <span className="float-start">
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </span>
                  </span>
                ),
                INCOME_FI_TDS_DOC:data.sap_fi_tds_doc_no,
                POSTING_DATE:formatDateAsDDMMYYY(data.sap_posting_date),
                USER_NAME:data.fi_user_info.emp_name,
                CREATION_TIME: data.fi_date_time_string,
                GST_TAX:'--',
                TDS_AVAIL:'--',
                TDS_TAX:'--',
                GL_COUNT:'1',
                SUP_REF_NO:'--',
                SUP_DOC_DATE:'--',
                GL_TYPE:'FREIGHT INCOME - INTER COMPANY',
              })

            } else {
              data.freight_gl_info.map((data1, index2) => {
                indexNo += 1
                rowDataList.push({
                  SNO: indexNo,
                  RPS_NO: data.rps_no,
                  FNR_NO: data.fnr_no,
                  RAKE_LOC: RakePlant_Array[data.rake_plant_code],
                  RPS_DATE: data.created_at_date,
                  VENDOR_NAME: data.vendor_info.v_name,
                  VENDOR_CODE:data.vendor_code,
                  INCOME_DIV:data.income_division,
                  FI_TYPE: RakeFI_Array[data.fi_entry_mode],
                  FI_REMARKS:data.fi_remarks,
                  FI_TDS_REMARKS:'--',
                  INCOME_GL:data1.GL_CODE,
                  GL_AMOUNT:data1.EXPENSE_AMT,
                  INCOME_EXPENSE_AMOUNT:data.amount,
                  INCOME_FI_DOC:data.sap_fi_doc_no,
                  ATTACHMENT:(
                    <span
                      onClick={() => {
                        setVisible(!visible)
                        setFiImgSrc(data.attachment_copy)
                      }}
                      className="w-100 m-0"
                      color="info"
                      size="sm"
                      id="odoImg"
                      style={border}
                    >
                      <span className="float-start">
                        <i className="fa fa-eye" aria-hidden="true"></i>
                      </span>
                    </span>
                  ),
                  INCOME_FI_TDS_DOC:'--',
                  POSTING_DATE:formatDateAsDDMMYYY(data.sap_posting_date),
                  USER_NAME:data.fi_user_info.emp_name,
                  CREATION_TIME: data.fi_date_time_string,
                  GST_TAX:data.gst_tax_type,
                  TDS_AVAIL:data.tds_available == '1' ? 'YES' : 'NO',
                  TDS_TAX:data.tds_tax_type,
                  GL_COUNT:data.freight_gl_info.length,
                  SUP_REF_NO:data.supplier_ref_no,
                  SUP_DOC_DATE:data.supplier_doc_date,
                  GL_TYPE:data1.label
                })
              })
            }

          })
          setRakeRowData(rowDataList)
          setFetch(true)
        })
      }
    }

    const getInt = (val) => {
      let int_value = 0
      if(val){
        int_value = Number(parseFloat(val).toFixed(2))
      }
      console.log(int_value,'int_value')
      return int_value
    }

    const handleChangenewtrip = event => {
      let tripResult = event.target.value.toUpperCase();
      setTripRPSNumberNew(tripResult.trim());
    };

    const handleChangenewtripFci = event => {
      let tripResult = event.target.value.toUpperCase();
      setTripFPSNumberNew(tripResult.trim());
    };

    const [sapPostingDate, setSapPostingDate] = useState('')

    const handleChangeSapPostingDate = (event) => {
      let vall = event.target.value
      console.log('handleChangeInvoicePostingDate', vall)
      setSapPostingDate(vall)
    }

    const customerFinder = (code) =>{
      let customer_name = ''
      if(code == 20068){
        // customer_name = `MMD (${code})`
        customer_name = `MMD`
      } else if(code == 1012){
        // customer_name = `FOODS (${code})`
        customer_name = `FOODS`
      }

      return customer_name
    }

    const GLCodeFinder = (code) =>{
      let gl_code = ''
      if(code == 20068){
        gl_code = 313010
      } else if(code == 1012){
        gl_code = 313004
      }

      return gl_code
    }

    const clearValues = () => {
      setCurrentProcessId(0)
      setFiEntryMode(0)
      values.tripsheetNumber = ''
      setTripRPSNumberNew('')
      setTripFPSNumberNew('')
      setTripRPSData([])
      setTripFPSData([])
      setSelectedHire([])
      setTripRPSHaving(false)
      setTripFPSHaving(false)
      setHeadEnable(true)
      setSapPostingDate('')
      setRakeFreightAMount2('')
      setFciFreightAMount2('')
      setInvoiceCopy('')
    }

    const [invoiceCopy, setInvoiceCopy] = useState('')
    const [rakeFreightAMount1, setRakeFreightAMount1] = useState('') // Expense
    const [rakeFreightAMount2, setRakeFreightAMount2] = useState('') // Income
    const [fciFreightAMount2, setFciFreightAMount2] = useState('') // Income

    const handleChangeInvoiceCopy = (event) => {
      let valll = event.target.files[0]
      setInvoiceCopy(valll)
    }

    const [gstTaxTermsData, setGstTaxTermsData] = useState([])

    useEffect(() => {

      /* section for getting GST Tax Terms Master List For GST Tax Code Display from database */
      DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
        console.log(response.data.data,'setGstTaxTermsData')
        setGstTaxTermsData(response.data.data)
      })

    }, [])

    const updated_tds_show_array = [
    {
      code:"T2",
      name:" Old Code : T2/194 C Contract 2%, New Code : C2/Contract 393(1)6(i) 2%",
      newCode:"C2"
    },
    {
      code:"T7",
      name:" Old : T7/194 C Contract 1%, New : C1/Contract 393(1)6(i) 1%",
      newCode:"C1"
    },    
    {
      code:"T9",
      name:" Old : T9/194 Q TDS on Purchase of Goods 0.1%/Exp, New : Q1/Pur.of Goods 393(1)8(ii) 0.1%",
      newCode:"Q1"
    }
  ]

    const tdsTaxCodeName = (code) => {
      let tds_tax_code_name = '-'
      
      gstTaxTermsData.map((val, key) => {
        if (val.definition_list_code == code) {
          let temp = 0
          updated_tds_show_array.map((dd,ll)=>{
            if(dd.code == code){
              temp = 1
              tds_tax_code_name = dd.name
            }
          })
          if(temp == 0)
            tds_tax_code_name = val.definition_list_name
        }
      })

      console.log(tds_tax_code_name,'tds_tax_code_name')

      return tds_tax_code_name
    }

    // const tdsTaxCodeName = (code) => {
    //   let tds_tax_code_name = '-'

    //   gstTaxTermsData.map((val, key) => {
    //     if (val.definition_list_code == code) {
    //       tds_tax_code_name = val.definition_list_name
    //     }
    //   })

    //   console.log(tds_tax_code_name,'tds_tax_code_name')

    //   return tds_tax_code_name
    // }

    const tdsConversion = (code) => {
      console.log(code,'tdsConversion-code')  
      let conversion_code = code
      updated_tds_show_array.map((dd,ll)=>{
        console.log(dd,'tdsConversion-updated_tds_show_array-dd') 
        if(dd.code == code){ 
          conversion_code = dd.newCode
        }
      })
      console.log(conversion_code,'tdsConversion-conversion_code')
      return conversion_code
    }

    const freightAmountUpdate = (e,type) => {
      let getData = e.target.value
      console.log(getData, 'getData')

      var floatValues =  /[+-]?([0-9]*[.])?[0-9]+/;

      if (getData.match(floatValues) && !isNaN(getData)) {
        //
        console.log('getData2')
      } else {
        console.log('getData3')
        getData = e.target.value.replace(/\D/g, '')
      }

      if(type == 2) {
        setRakeFreightAMount2(getData)
        setRakeFreightAMount1('')
      } else {
        setRakeFreightAMount1(getData)
        setRakeFreightAMount2('')
      }

    }

    const freightAmountUpdateFci = (e,type) => {
      let getData = e.target.value
      console.log(getData, 'getData')

      var floatValues =  /[+-]?([0-9]*[.])?[0-9]+/;

      if (getData.match(floatValues) && !isNaN(getData)) {
        //
        console.log('getData2')
      } else {
        console.log('getData3')
        getData = e.target.value.replace(/\D/g, '')
      }

      if(type == 2) {
        setFciFreightAMount2(getData)
        // setRakeFreightAMount1('')
      } else {
        // setRakeFreightAMount1(getData)
        setFciFreightAMount2('')
      }

    }

    // GET Trip RPS DETAILS FROM LP
    const gettripRPSData = (e) => {
      e.preventDefault()

      console.log(tripRPSNumberNew,'tripRPSNumberNew')
      if(/^[a-zA-Z0-9]+$/i.test(tripRPSNumberNew) && /[a-zA-Z]/.test(tripRPSNumberNew) && /[0-9]/.test(tripRPSNumberNew)){
        RakeClosureSubmissionService.getExpenseApprovalInfoByRPSForFiPayment(tripRPSNumberNew).then((res) => {
          // DepoExpenseClosureService.getPaymentInfoById(id).then((res) => {
          let closure_info_id_data = res.data.data
          console.log(closure_info_id_data,'closure_info_id_data')
          setTripRPSHaving(true)

          if (res.status == 200 && res.data != '') {

            let needed_data = res.data.data

            // if(getInt(needed_data.vehicle_current_position) > 26){
            //   setShipmentPossibility(false)
            //   setShipmentError('Expense Closure already completed. So, Shipment Cannot be inserted..')
            // } else if(getInt(needed_data.tripsheet_open_status) == 2){
            //   setShipmentPossibility(false)
            //   setShipmentError('Tripsheet already closed. So, Shipment Cannot be inserted..')
            // } else {
            //   setShipmentPossibility(true)
            //   setShipmentError('')
            // }
            setSmallFetch(true)
            setTripRPSData(needed_data)
            toast.success('Trip RPS Details Detected!')

          } else {

            setTripRPSData([])
            setTripRPSHaving(false)

            setSmallFetch(true)
            toast.warning('Trip RPS Details cannot be detected from LP!')

          }
        })
      } else {

        setTripRPSData([])
        setTripRPSHaving(false)
        setSmallFetch(true)
        // setShipmentHaving(false)
        toast.warning('RPS Number Must Like "RPS0823001"')
        return false
      }

    }

    // GET Trip FPS DETAILS FROM LP
    const gettripFPSData = (e) => {
      e.preventDefault()

      console.log(tripFPSNumberNew,'tripRPSNumberNew')
      if(/^[a-zA-Z0-9]+$/i.test(tripFPSNumberNew) && /[a-zA-Z]/.test(tripFPSNumberNew) && /[0-9]/.test(tripFPSNumberNew)){
        FCIClosureSubmissionService.getExpenseApprovalInfoByFPSForFiPayment(tripFPSNumberNew).then((res) => {
          let closure_info_id_data = res.data.data
          console.log(closure_info_id_data,'closure_info_id_data')
          setTripFPSHaving(true)

          if (res.status == 200 && res.data != '') {

            let needed_data = res.data.data
            setSmallFetch(true)
            setTripFPSData(needed_data)
            toast.success('Trip FPS Details Detected!')

          } else {

            setTripFPSData([])
            setTripFPSHaving(false)

            setSmallFetch(true)
            toast.warning('Trip FPS Details cannot be detected from LP!')

          }
        })
      } else {

        setTripFPSData([])
        setTripFPSHaving(false)
        setSmallFetch(true)
        toast.warning('FCI Sequence Number Must Like "FCF1234567"')
        return false
      }

    }

    const fi_entry_array = ['','EXPENSE','EXPENSE','INCOME','INCOME']
    const fi_mode_array = ['','CREDIT','DEBIT','CREDIT','DEBIT']
    const fi_tds_array = ['','YES','NO']

    /* Validation Process */
    const rakeFIUpdateValidation = () => {

      /* ===================== Validations Part Start ===================== */
      console.log(fiEntryMode,'fiEntryMode')
      console.log(getInt(rakeFreightAMount2),'rakeFreightAMount2')
      if(fiEntryMode == 0){
        toast.error(`Please select FI Entry Mode..`)
        return false
      }

      /* Expense FI-Entry Validation */
      if(fiEntryMode == 1 || fiEntryMode == 2){
        console.log(selectedHire,'fiEntryMode')
        if(selectedHire.length == 0){
          toast.error(`Freight Vendor GL Required..`)
          return false
        }

        let each_expense = 1
        selectedHire.map((va1,in1)=>{
          let exp_vmount = getInt(va1.EXPENSE_AMT)
          if(exp_vmount == 0 || isNaN(exp_vmount)){
            each_expense = 0
          }
        })

        console.log(values)

        if(values.rake_supplier_ref_no.trim() == ''){
          toast.error(`Supplier Ref. No. should be Required..`)
          values.rake_supplier_ref_no = ''
          return false
        } else {
          values.rake_supplier_ref_no = values.rake_supplier_ref_no.trimStart()
        }

        if (values.rake_supplier_posting_date) {
          //
        } else {
          toast.error(`Supplier Document Date should be Required..`)
          return false
        }

        if(values.rake_gst_tax_type == ''){
          toast.error(`GST Tax Type should be Required..`)
          return false
        }

        if(values.rake_tds_type == ''){
          toast.error(`TDS should be Required..`)
          return false
        }

        if(values.rake_hsn_type == ''){
          toast.error(`HSN should be Required..`)
          return false
        }

        /* === Attachment Copy Mandatory Start == */
        // if(invoiceCopy){
        //   //
        // } else {
        //   toast.error(`Attachment Copy Required..`)
        //   return false
        // }

        // console.log(invoiceCopy.size,'invoiceCopy')
        // if(invoiceCopy && invoiceCopy.size <= 5000000){
        //   //
        // } else {
        //   toast.error(`Attachment copy should not having size more than 5Mb..`)
        //   return false
        // }
        /* === Attachment Copy Mandatory End == */

        if(invoiceCopy && invoiceCopy.size > 5000000){
          console.log(invoiceCopy.size,'invoiceCopy')
          toast.error(`Attachment copy should not having size more than 5Mb..`)
          return false
        }

        if (sapPostingDate) {
          //
        } else {
          toast.error(`SAP Posting Date Required..`)
          return false
        }

        // ============= Posting date Validation Part =================== //

        let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate(user_access_for_back_date);
        let from_date = Expense_Income_Posting_Date_Taken.min_date
        let to_date = Expense_Income_Posting_Date_Taken.max_date

        if(JavascriptDateCheckComponent(from_date,sapPostingDate,to_date)){
          //
        } else {
          // setFetch(true)
          toast.warning('Invalid Posting date')
          return false
        }
        // ============= Posting date Validation Part =================== //

        if(values.firemarks.trim() == ''){
          toast.error(`FI Remarks should be Required..`)
          values.firemarks = ''
          return false
        } else {
          values.firemarks = values.firemarks.trimStart()
        }

        if(each_expense == 0){
          toast.error(`Each Freight GL amount should be greater than 0..`)
          return false
        }

      }

      /* Income FI-Entry Validation */
      if(fiEntryMode == 3 || fiEntryMode == 4){

        if(getInt(rakeFreightAMount2) === 0){
          toast.error(`Income amount should be greater than 0..`)
          return false
        }

        if(invoiceCopy){
          //
        } else {
          toast.error(`Attachment Copy Required..`)
          return false
        }

        console.log(invoiceCopy.size,'invoiceCopy')
        if(invoiceCopy.size <= 5000000){
          //
        } else {
          toast.error(`Attachment copy should not having size more than 5Mb..`)
          return false
        }

        if (sapPostingDate) {
          //
        } else {
          toast.error(`SAP Posting Date Required..`)
          return false
        }

        // ============= Posting date Validation Part =================== //

        let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate(user_access_for_back_date);
        let from_date = Expense_Income_Posting_Date_Taken.min_date
        let to_date = Expense_Income_Posting_Date_Taken.max_date

        if(JavascriptDateCheckComponent(from_date,sapPostingDate,to_date)){
          //
        } else {
          // setFetch(true)
          toast.warning('Invalid Posting date')
          return false
        }
        // ============= Posting date Validation Part =================== //

        if(values.firemarks.trim() == ''){
          toast.error(`FI Remarks should be Required..`)
          values.firemarks = ''
          return false
        } else {
          values.firemarks = values.firemarks.trimStart()
        }
      }

      // toast.success(fiEntryMode+'Done')

      /* ===================== Validations Part End ===================== */

      setRakeModalEnable(true)
    }

     /* Validation Process */
     const fciFIUpdateValidation = () => {

      /* ===================== Validations Part Start ===================== */
      console.log(fiEntryMode,'fiEntryMode')
      console.log(getInt(fciFreightAMount2),'fciFreightAMount2')
      if(fiEntryMode == 0){
        toast.error(`Please select FI Entry Mode..`)
        return false
      }

      /* Expense FI-Entry Validation */
      if(fiEntryMode == 1 || fiEntryMode == 2){
        console.log(selectedHire,'fiEntryMode')
        if(selectedHire.length == 0){
          toast.error(`Freight Vendor GL Required..`)
          return false
        }

        let each_expense = 1
        selectedHire.map((va1,in1)=>{
          let exp_vmount = getInt(va1.EXPENSE_AMT)
          if(exp_vmount == 0 || isNaN(exp_vmount)){
            each_expense = 0
          }
        })

        console.log(values)

        if(values.rake_supplier_ref_no.trim() == ''){
          toast.error(`Supplier Ref. No. should be Required..`)
          values.rake_supplier_ref_no = ''
          return false
        } else {
          values.rake_supplier_ref_no = values.rake_supplier_ref_no.trimStart()
        }

        if (values.rake_supplier_posting_date) {
          //
        } else {
          toast.error(`Supplier Document Date should be Required..`)
          return false
        }

        if(values.rake_gst_tax_type == ''){
          toast.error(`GST Tax Type should be Required..`)
          return false
        }

        if(tripFPSData.expense_tds == 1 && values.rake_tds_type == ''){
          toast.error(`TDS should be Required..`)
          return false
        }

        if(values.rake_hsn_type == ''){
          toast.error(`HSN should be Required..`)
          return false
        }

        /* === Attachment Copy Mandatory Start == */
        // if(invoiceCopy){
        //   //
        // } else {
        //   toast.error(`Attachment Copy Required..`)
        //   return false
        // }

        // console.log(invoiceCopy.size,'invoiceCopy')
        // if(invoiceCopy && invoiceCopy.size <= 5000000){
        //   //
        // } else {
        //   toast.error(`Attachment copy should not having size more than 5Mb..`)
        //   return false
        // }
        /* === Attachment Copy Mandatory End == */

        if(invoiceCopy && invoiceCopy.size > 5000000){
          console.log(invoiceCopy.size,'invoiceCopy')
          toast.error(`Attachment copy should not having size more than 5Mb..`)
          return false
        }

        if (sapPostingDate) {
          //
        } else {
          toast.error(`SAP Posting Date Required..`)
          return false
        }

        // ============= Posting date Validation Part =================== //

        let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate(user_access_for_back_date);
        let from_date = Expense_Income_Posting_Date_Taken.min_date
        let to_date = Expense_Income_Posting_Date_Taken.max_date

        if(JavascriptDateCheckComponent(from_date,sapPostingDate,to_date)){
          //
        } else {
          // setFetch(true)
          toast.warning('Invalid Posting date')
          return false
        }
        // ============= Posting date Validation Part =================== //

        if(values.firemarks.trim() == ''){
          toast.error(`FI Remarks should be Required..`)
          values.firemarks = ''
          return false
        } else {
          values.firemarks = values.firemarks.trimStart()
        }

        if(each_expense == 0){
          toast.error(`Each Freight GL amount should be greater than 0..`)
          return false
        }

      }

      /* Income FI-Entry Validation */
      if(fiEntryMode == 3 || fiEntryMode == 4){

        if(getInt(fciFreightAMount2) === 0){
          toast.error(`FCI Income amount should be greater than 0..`)
          return false
        }

        if(invoiceCopy){
          //
        } else {
          toast.error(`Attachment Copy Required..`)
          return false
        }

        console.log(invoiceCopy.size,'invoiceCopy')
        if(invoiceCopy.size <= 5000000){
          //
        } else {
          toast.error(`Attachment copy should not having size more than 5Mb..`)
          return false
        }

        if (sapPostingDate) {
          //
        } else {
          toast.error(`SAP Posting Date Required..`)
          return false
        }

        // ============= Posting date Validation Part =================== //

        let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate(user_access_for_back_date);
        let from_date = Expense_Income_Posting_Date_Taken.min_date
        let to_date = Expense_Income_Posting_Date_Taken.max_date

        if(JavascriptDateCheckComponent(from_date,sapPostingDate,to_date)){
          //
        } else {
          // setFetch(true)
          toast.warning('Invalid Posting date')
          return false
        }
        // ============= Posting date Validation Part =================== //

        if(values.firemarks.trim() == ''){
          toast.error(`FI Remarks should be Required..`)
          values.firemarks = ''
          return false
        } else {
          values.firemarks = values.firemarks.trimStart()
        }
      }

      // toast.success(fiEntryMode+'Done')

      /* ===================== Validations Part End ===================== */

      setFciModalEnable(true)
    } 

    /* Submit Process */
    const rakeFIUpdateSubmission = () => {

      console.log(values,'form-values')
      console.log(selectedHire,'selectedHire-values')

      /* GL List For Freight vendor Array convertor*/
      var HireExpense = {}
      var HireExpense_Seq = []

      for (var i = 0; i < selectedHire.length; i++) {
        HireExpense.GL_CODE = selectedHire[i].GL_CODE
        HireExpense.COST_CENTER = selectedHire[i].COST_CENTER
        HireExpense.EXPENSE_AMT = selectedHire[i].EXPENSE_AMT
        HireExpense.LINE_ITEM = selectedHire[i].LINE_ITEM
        HireExpense.LABEL = selectedHire[i].label.slice(0, -9)

        HireExpense_Seq[i] = HireExpense

        HireExpense = {}
      }

      console.log(HireExpense_Seq,'HireExpense_Seq-values')
      console.log(rakeFreightAMount2,'rakeFreightAMount2-values')
      console.log(sum_hire,'sum_hire-values')

      var SAP_Apend_Data_Seq = []
      var SAP_Apend_Data = {}

      SAP_Apend_Data.VEHICLE_NO = ''
      SAP_Apend_Data.COST_CENTER = ''
      SAP_Apend_Data.PAYMENT_MODE = ''
      SAP_Apend_Data.PAYMENT_TYPE = ''
      SAP_Apend_Data.VEH_TYPE = 'RAKE'

      if(fiEntryMode == 1 || fiEntryMode == 2){
        SAP_Apend_Data.GL_CODE = ''
        SAP_Apend_Data.DIVISION = ''
        SAP_Apend_Data.FI_VENDOR_TYPE = 'FREIGHT_VENDOR'
        SAP_Apend_Data.TDS_REC_REMARK = ''
        SAP_Apend_Data.LINE = HireExpense_Seq
        SAP_Apend_Data.LIFNR = tripRPSData.vendor_code
        SAP_Apend_Data.FI_ENTRY_TYPE = 'EXPENSE'
        SAP_Apend_Data.INCOME_AMT = ''
        SAP_Apend_Data.EXPENSE_AMT = getInt(sum_hire)
        SAP_Apend_Data.TAX_TYPE = values.rake_gst_tax_type
        SAP_Apend_Data.TDS = fi_tds_array[values.rake_tds_type]
         
        SAP_Apend_Data.TDS_VALUE = values.rake_tds_type == '1' ? (tripRPSData.rake_vendor_info && tripRPSData.rake_vendor_info.v_tds_tax_type ? tdsTaxCodeName(tripRPSData.rake_vendor_info.v_tds_tax_type) : '') : ''
        SAP_Apend_Data.HSN = values.rake_hsn_type
        SAP_Apend_Data.REF_NO = values.rake_supplier_ref_no
        SAP_Apend_Data.REF_DATE = values.rake_supplier_posting_date
      } else {
        SAP_Apend_Data.GL_CODE = GLCodeFinder(tripRPSData.customer_code)
        SAP_Apend_Data.DIVISION = customerFinder(tripRPSData.customer_code)
        SAP_Apend_Data.FI_VENDOR_TYPE = ''
        SAP_Apend_Data.TDS_REC_REMARK = tripRPSData.customer_code == '20068' ? values.fitdsremarks : ''
        SAP_Apend_Data.LINE = ''
        SAP_Apend_Data.LIFNR = tripRPSData.customer_code
        SAP_Apend_Data.FI_ENTRY_TYPE = 'INCOME'
        SAP_Apend_Data.INCOME_AMT = getInt(rakeFreightAMount2)
        SAP_Apend_Data.EXPENSE_AMT = ''
        SAP_Apend_Data.TAX_TYPE = ''
        SAP_Apend_Data.TDS = ''
        SAP_Apend_Data.REF_NO = ''
        SAP_Apend_Data.REF_DATE = ''
      }

      SAP_Apend_Data.TRIPSHEET_NO = tripRPSData.expense_sequence_no
      SAP_Apend_Data.FNR_NO = tripRPSData.fnr_no
      SAP_Apend_Data.FI_MODE = fi_mode_array[fiEntryMode]
      SAP_Apend_Data.REMARKS = values.firemarks
      SAP_Apend_Data.POST_DATE = sapPostingDate
      SAP_Apend_Data_Seq.push(SAP_Apend_Data)
      console.log(SAP_Apend_Data_Seq,'SAP_Apend_Data_Seq-values')

      setFetch(false)
      FIEntrySAP.FIEntrySAPData(SAP_Apend_Data_Seq).then((res) => {
        console.log(res,'SAP-Response')

        let sap_fi_doc_no = res.data.DOCUMENT_NO
        let sap_fi_division = res.data.DIVISION
        let sap_fi_status = res.data.STATUS
        let sap_fi_message = res.data.MESSAGE
        let sap_fi_rps_no = res.data.TRIPSHEET_NO
        let sap_fi_fnr_no = res.data.FNR_NO
        let sap_fi_tds_doc_no = res.data.TDS_DOCUMENT_NO
        let sap_fi_tds_status = res.data.TDS_STATUS
        let sap_fi_tds_message = res.data.TDS_MESSAGE

        console.log(sap_fi_doc_no + '/' + sap_fi_division + '/' + sap_fi_status + '/' + sap_fi_message + '/' + sap_fi_rps_no + '/' + sap_fi_fnr_no + '/' + sap_fi_tds_doc_no + '/' + sap_fi_tds_status + '/' + sap_fi_tds_message)

        if(res.status == 200 && sap_fi_status == '1' && sap_fi_doc_no && sap_fi_message && sap_fi_rps_no == tripRPSData.expense_sequence_no && ((fiEntryMode == 1 || fiEntryMode == 2) || tripRPSData.customer_code != '20068' || (sap_fi_tds_status == '1' && sap_fi_tds_doc_no && sap_fi_tds_message) ) ){

          /* ====== Request Sent To LP DB For Payment Details Updation Start ========== */

          let form_data = new FormData()

          form_data.append('created_by', user_id)
          form_data.append('lp_process_type', 1)
          form_data.append('fi_status', 1)
          form_data.append('sap_fi_doc_no', sap_fi_doc_no)

          form_data.append('fi_remarks', values.firemarks)
          form_data.append('sap_posting_date', sapPostingDate)
          form_data.append('fi_attachment', invoiceCopy)

          if(fiEntryMode == 1 || fiEntryMode == 2){
            form_data.append('amount',getInt(sum_hire))
            form_data.append('supplier_doc_date', values.rake_supplier_posting_date)
            form_data.append('supplier_ref_no', values.rake_supplier_ref_no)
            form_data.append('freight_gl_count', selectedHire.length)
            form_data.append('freight_gl_info', JSON.stringify(selectedHire))
            form_data.append('tds_tax_type', (tripRPSData.rake_vendor_info && tripRPSData.rake_vendor_info.v_tds_tax_type ? tripRPSData.rake_vendor_info.v_tds_tax_type : ''))
            form_data.append('tds_available', values.rake_tds_type)
            form_data.append('gst_tax_type', values.rake_gst_tax_type)
            form_data.append('hsn_type', values.rake_hsn_type)
          } else {
            form_data.append('amount', getInt(rakeFreightAMount2))
            form_data.append('freight_gl_count', 1)
            form_data.append('income_gl_code',GLCodeFinder(tripRPSData.customer_code))
            if(tripRPSData.customer_code == '20068'){
              form_data.append('sap_fi_tds_doc_no', sap_fi_tds_doc_no)
              form_data.append('fi_tds_remarks', values.fitdsremarks)
            }
          }

          form_data.append('fi_entry_mode', fiEntryMode)
          form_data.append('income_division', customerFinder(tripRPSData.customer_code))
          form_data.append('vendor_code', tripRPSData.vendor_info.v_code)
          form_data.append('vendor_id', tripRPSData.vendor_info.v_id)
          form_data.append('rake_plant_code', tripRPSData.rake_plant_code)
          form_data.append('fnr_no', tripRPSData.fnr_no)
          form_data.append('rps_no', tripRPSData.expense_sequence_no)
          form_data.append('rake_closure_id', tripRPSData.closure_id)

          RakeClosureSubmissionService.fiSubmission(form_data).then((res)=>{

            console.log(res,'fiSubmission')
            setFetch(true)
            if (res.status == 200) {
              Swal.fire({
                title: 'Rake FI Entry Submission Completed Successfully!',
                icon: "success",
                text:  'FI Doc No : ' + sap_fi_doc_no,
                html: (fiEntryMode == 3 || fiEntryMode == 4) && (tripRPSData.customer_code == '20068') ?  'FI Doc. No. : ' + sap_fi_doc_no + '<br />' + ' FI TDS Doc. No. : ' + sap_fi_tds_doc_no : 'FI Doc. No : ' + sap_fi_doc_no,
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
                window.location.reload(false)
              })
            } else {
              toast.warning('Rake FI Entry Submission Failed. Kindly contact Admin..!')
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
        }  else {
          setFetch(true)
          toast.warning('FI Entry Submission Failed in SAP.. Kindly Contact Admin!')
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

    /* Submit Process */
    const fciFIUpdateSubmission = () => {

      console.log(values,'form-values')
      console.log(selectedHire,'selectedHire-values')

      /* GL List For Freight vendor Array convertor*/
      var HireExpense = {}
      var HireExpense_Seq = []

      for (var i = 0; i < selectedHire.length; i++) {
        HireExpense.GL_CODE = selectedHire[i].GL_CODE
        HireExpense.COST_CENTER = selectedHire[i].COST_CENTER
        HireExpense.EXPENSE_AMT = selectedHire[i].EXPENSE_AMT
        HireExpense.LINE_ITEM = selectedHire[i].LINE_ITEM
        HireExpense.LABEL = selectedHire[i].label.slice(0, -9)

        HireExpense_Seq[i] = HireExpense

        HireExpense = {}
      }

      console.log(HireExpense_Seq,'HireExpense_Seq-values')
      console.log(fciFreightAMount2,'fciFreightAMount2-values')
      console.log(sum_hire,'sum_hire-values')

      var SAP_Apend_Data_Seq = []
      var SAP_Apend_Data = {}

      SAP_Apend_Data.VEHICLE_NO = ''
      SAP_Apend_Data.COST_CENTER = ''
      SAP_Apend_Data.PAYMENT_MODE = ''
      SAP_Apend_Data.PAYMENT_TYPE = ''
      SAP_Apend_Data.VEH_TYPE = 'FCI'

      if(fiEntryMode == 1 || fiEntryMode == 2){
        SAP_Apend_Data.GL_CODE = ''
        SAP_Apend_Data.DIVISION = ''
        SAP_Apend_Data.FI_VENDOR_TYPE = 'FREIGHT_VENDOR'
        SAP_Apend_Data.TDS_REC_REMARK = ''
        SAP_Apend_Data.LINE = HireExpense_Seq
        SAP_Apend_Data.LIFNR = tripFPSData.expense_vendor_code
        SAP_Apend_Data.FI_ENTRY_TYPE = 'EXPENSE'
        SAP_Apend_Data.INCOME_AMT = ''
        SAP_Apend_Data.EXPENSE_AMT = getInt(sum_hire)
        SAP_Apend_Data.TAX_TYPE = values.rake_gst_tax_type
        SAP_Apend_Data.TDS = tripFPSData.expense_tds
         
        SAP_Apend_Data.TDS_VALUE = tripFPSData.expense_tds == 1 && values.rake_tds_type == '1' ? (tripRPSData.rake_vendor_info && tripRPSData.rake_vendor_info.v_tds_tax_type ? tdsTaxCodeName(tripRPSData.rake_vendor_info.v_tds_tax_type) : '') : ''
        SAP_Apend_Data.HSN = values.rake_hsn_type
        SAP_Apend_Data.REF_NO = values.rake_supplier_ref_no
        SAP_Apend_Data.REF_DATE = values.rake_supplier_posting_date
      } else {
        SAP_Apend_Data.GL_CODE = GLCodeFinder(tripFPSData.income_customer_code)
        SAP_Apend_Data.DIVISION = customerFinder(tripFPSData.income_customer_code)
        SAP_Apend_Data.FI_VENDOR_TYPE = ''
        SAP_Apend_Data.TDS_REC_REMARK = tripRPSData.customer_code == '20068' ? values.fitdsremarks : ''
        SAP_Apend_Data.LINE = ''
        SAP_Apend_Data.LIFNR = tripFPSData.income_customer_code
        SAP_Apend_Data.FI_ENTRY_TYPE = 'INCOME'
        SAP_Apend_Data.INCOME_AMT = getInt(fciFreightAMount2)
        SAP_Apend_Data.EXPENSE_AMT = ''
        SAP_Apend_Data.TAX_TYPE = ''
        SAP_Apend_Data.TDS = ''
        SAP_Apend_Data.REF_NO = ''
        SAP_Apend_Data.REF_DATE = ''
      }

      SAP_Apend_Data.TRIPSHEET_NO = tripFPSData.expense_sequence_no
      SAP_Apend_Data.FNR_NO = tripFPSData.po_no
      SAP_Apend_Data.FI_MODE = fi_mode_array[fiEntryMode]
      SAP_Apend_Data.REMARKS = values.firemarks
      SAP_Apend_Data.POST_DATE = sapPostingDate
      SAP_Apend_Data_Seq.push(SAP_Apend_Data)
      console.log(SAP_Apend_Data_Seq,'SAP_Apend_Data_Seq-values')

      setFetch(false)
      FIEntrySAP.FIEntrySAPData(SAP_Apend_Data_Seq).then((res) => {
        console.log(res,'SAP-Response')

        let sap_fi_doc_no = res.data.DOCUMENT_NO
        let sap_fi_division = res.data.DIVISION
        let sap_fi_status = res.data.STATUS
        let sap_fi_message = res.data.MESSAGE
        let sap_fi_rps_no = res.data.TRIPSHEET_NO
        let sap_fi_fnr_no = res.data.FNR_NO
        let sap_fi_tds_doc_no = res.data.TDS_DOCUMENT_NO
        let sap_fi_tds_status = res.data.TDS_STATUS
        let sap_fi_tds_message = res.data.TDS_MESSAGE

        console.log(sap_fi_doc_no + '/' + sap_fi_division + '/' + sap_fi_status + '/' + sap_fi_message + '/' + sap_fi_rps_no + '/' + sap_fi_fnr_no + '/' + sap_fi_tds_doc_no + '/' + sap_fi_tds_status + '/' + sap_fi_tds_message)

        if(res.status == 200 && sap_fi_status == '1' && sap_fi_doc_no && sap_fi_message && sap_fi_rps_no == tripFPSData.expense_sequence_no && ((fiEntryMode == 1 || fiEntryMode == 2) || tripFPSData.income_customer_code != '20068' || (sap_fi_tds_status == '1' && sap_fi_tds_doc_no && sap_fi_tds_message) ) ){

          /* ====== Request Sent To LP DB For Payment Details Updation Start ========== */

          let form_data = new FormData()

          form_data.append('created_by', user_id)
          form_data.append('lp_process_type', 2) //2 - FCI
          form_data.append('fi_status', 1)
          form_data.append('sap_fi_doc_no', sap_fi_doc_no)

          form_data.append('fi_remarks', values.firemarks)
          form_data.append('sap_posting_date', sapPostingDate)
          form_data.append('fi_attachment', invoiceCopy)

          if(fiEntryMode == 1 || fiEntryMode == 2){
            form_data.append('amount',getInt(sum_hire))
            form_data.append('supplier_doc_date', values.rake_supplier_posting_date)
            form_data.append('supplier_ref_no', values.rake_supplier_ref_no)
            form_data.append('freight_gl_count', selectedHire.length)
            form_data.append('freight_gl_info', JSON.stringify(selectedHire))
            form_data.append('tds_tax_type', (tripFPSData.expense_tds_type ? tripFPSData.expense_tds_type : ''))
            form_data.append('tds_available', tripFPSData.expense_tds)
            form_data.append('gst_tax_type', values.rake_gst_tax_type)
            form_data.append('hsn_type', values.rake_hsn_type)
          } else {
            form_data.append('amount', getInt(fciFreightAMount2))
            form_data.append('freight_gl_count', 1)
            form_data.append('income_gl_code',GLCodeFinder(tripFPSData.income_customer_code))
            if(tripFPSData.income_customer_code == '20068'){
              form_data.append('sap_fi_tds_doc_no', sap_fi_tds_doc_no)
              form_data.append('fi_tds_remarks', values.fitdsremarks)
            }
          }

          form_data.append('fi_entry_mode', fiEntryMode)
          form_data.append('income_division', customerFinder(tripFPSData.income_customer_code))
          form_data.append('vendor_code', tripFPSData.expense_vendor_code)
          form_data.append('vendor_id', 0)
          form_data.append('rake_plant_code', tripFPSData.fci_plant_code)
          form_data.append('fnr_no', tripFPSData.po_no)
          form_data.append('rps_no', tripFPSData.expense_sequence_no)
          form_data.append('rake_closure_id', tripFPSData.closure_id)

          FCIClosureSubmissionService.fiSubmission(form_data).then((res)=>{

            console.log(res,'fiSubmission')
            setFetch(true)
            if (res.status == 200) {
              Swal.fire({
                title: 'FCI FI Entry Submission Completed Successfully!',
                icon: "success",
                text:  'FI Doc No : ' + sap_fi_doc_no,
                html: (fiEntryMode == 3 || fiEntryMode == 4) && (tripRPSData.customer_code == '20068') ?  'FI Doc. No. : ' + sap_fi_doc_no + '<br />' + ' FI TDS Doc. No. : ' + sap_fi_tds_doc_no : 'FI Doc. No : ' + sap_fi_doc_no,
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
                window.location.reload(false)
              })
            } else {
              toast.warning('FCI FI Entry Submission Failed. Kindly contact Admin..!')
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
        }  else {
          setFetch(true)
          toast.warning('FI Entry Submission Failed in SAP.. Kindly Contact Admin!')
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

                            {screenAccess && (<option value={1}> LOGISTICS</option>)}
                            {screenAccessRake && (<option value={2}> RAKE</option>)}
                            {screenAccessRake && (<option value={3}> FCI</option>)}

                          </CFormSelect>
                        </CInputGroup>
                      </div>
                    </CCol>
                  </CRow>
                )}
                {/* LP FI Process */}
                {/* <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}> */}
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={currentProcessId == 1}>
                  <CForm className="container p-3" onSubmit={handleSubmit}>
                    <CRow>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="tripsheetNumber">
                          Tripsheet Number <REQ />{' '}
                        </CFormLabel>
                      <TripSheetSearchComponent
                            size="sm"
                            className="mb-1"
                            onChange={(e) => {
                              onChange(e)
                            }}
                            label="tripsheetNumber"
                            id="tripsheetNumber"
                            name="tripsheetNumber"
                            value={values.tripsheetNumber}
                            search_type="tripsheetNumber"
                            search_data={TripsheetNo}
                            onClick={(e) => {
                              changevehicleType(e.target.value)
                            }}
                          />
                      </CCol>
                      {values.tripsheetNumber &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vehicleNumber">
                          Vehicle Number <REQ />{' '}
                          {errors.vehicleNumber && (
                            <span className="small text-danger">{errors.vehicleNumber}</span>
                          )}
                        </CFormLabel>
                        <CFormInput
                          size="sm"
                          id="vehicleNumber"
                          name="vehicleNumber"
                          value={vehNo}
                          type="text"
                          maxLength="6"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          readOnly
                        />
                      </CCol>}
                      { values.tripsheetNumber &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vehicleType">
                          Vehicle Type <REQ />{' '}
                          {errors.vehicleType && (
                            <span className="small text-danger">{errors.vehicleType}</span>
                          )}
                        </CFormLabel>
                        <CFormInput
                          size="sm"
                          id="vehicleType"
                          name="vehicleType"
                          value={vType}
                          type="text"
                          maxLength="6"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          readOnly
                        />
                      </CCol>}

                      {values.tripsheetNumber && vType != 'Hire'  &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="driver_code">Driver Code</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="driver_code"
                          name="driver_code"
                          value={driverCode}
                          type="text"
                          maxLength="6"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          readOnly
                        />
                      </CCol>}
                      {values.tripsheetNumber  && vType != 'Hire'  &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="driver_name">Driver Name</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="driver_name"
                          name="driver_name"
                          value={driverName}
                          type="text"
                          maxLength="6"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          readOnly
                        />
                      </CCol>}
                      {values.tripsheetNumber  && vType == 'Hire'  &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vendor_code">Vendor Code</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="vendor_code"
                          name="vendor_code"
                          value={vendorCode}
                          type="text"
                          maxLength="6"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          readOnly
                        />
                      </CCol>}
                      {values.tripsheetNumber && vType == 'Hire'  &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vendor_name">Vendor Name</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="vendor_name"
                          name="vendor_name"
                          value={vendorName}
                          type="text"
                          maxLength="6"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          readOnly
                        />
                      </CCol>}
                      {values.tripsheetNumber &&
                      <CCol className="mb-3" md={3}>
                      <CFormLabel htmlFor="amounttype">
                          FI Entry Type <REQ />{' '}
                        {errors.amounttype && (
                          <span className="small text-danger">{errors.amounttype}</span>
                        )}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        id="amounttype"
                        className={`${errors.amounttype && 'is-invalid'}`}
                        name="amounttype"
                        value={values.amounttype}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        onClick={(e) => {
                          changevehicleType1(e.target.value)
                        }}
                      >
                        <option value="0">Select...</option>
                        <option value="1" hidden = {singleVehicleInfo.status != 2 || vType != 'Hire'}>Income</option>
                        <option value="1" hidden = {values.tripsheet_is_settled != '6' || vType == 'Hire'}>Income</option>
                        <option value="2" >Expense</option>
                        <option value="3" hidden = {vType == 'Hire' || AdvanceAccess == '0'}>Advance</option>
                      </CFormSelect>
                      </CCol>
                    }
                    {values.tripsheetNumber && values.amounttype == '2' &&
                      <CCol className="mb-3" md={3}>
                      <CFormLabel htmlFor="mode_of_payment">
                          Mode <REQ />{' '}
                        {errors.mode_of_payment && (
                          <span className="small text-danger">{errors.mode_of_payment}</span>
                        )}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        id="mode_of_payment"
                        className={`${errors.mode_of_payment && 'is-invalid'}`}
                        name="mode_of_payment"
                        value={values.mode_of_payment}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        // onClick={(e) => {
                        //   changevehicleType1(e.target.value)
                        // }}
                      >
                        <option value="" selected>
                          Select...
                        </option>
                        <option value="1">
                          Credit Note( FB60 )
                        </option>
                        <option value="2">
                          Debit Note( FB65 )
                        </option>
                      </CFormSelect>
                    </CCol>}
                    {values.tripsheetNumber && values.amounttype == '1' &&
                      <CCol className="mb-3" md={3}>
                      <CFormLabel htmlFor="mode_of_payment">
                          Mode <REQ />{' '}
                        {errors.mode_of_payment && (
                          <span className="small text-danger">{errors.mode_of_payment}</span>
                        )}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        id="mode_of_payment"
                        className={`${errors.mode_of_payment && 'is-invalid'}`}
                        name="mode_of_payment"
                        value={values.mode_of_payment}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        // onClick={(e) => {
                        //   changevehicleType1(e.target.value)
                        // }}
                      >
                        <option value="" selected>
                          Select...
                        </option>
                        <option value="1">
                          Credit Note( FB75 )
                        </option>
                        <option value="2">
                          Debit Note( FB70 )
                        </option>
                      </CFormSelect>
                    </CCol>}
                    {values.tripsheetNumber && values.amounttype == '1' &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="gl_lists">
                          Income GL Name & Code<REQ />{' '}
                        </CFormLabel>
                      <FISearchSelectComponent
                            size="sm"
                            className="mb-1"
                            onChange={(e) => {
                              onChange1(e)
                            }}
                            label="gl_lists"
                            id="gl_lists"
                            name="gl_lists"
                            value={values.gl_list_id}
                            search_type="gl_lists"
                            onClick={(e) => {
                              changevehicleType2(e.target.value)
                            }}
                          />
                      </CCol>}

                    {values.tripsheetNumber  && (values.amounttype == '2' || values.amounttype == '3') &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="entry_to">Expense To <REQ />{' '}
                        {errors.entry_to && (
                          <span className="small text-danger">{errors.entry_to}</span>
                        )}
                        </CFormLabel>
                        <CFormSelect
                          size="sm"
                          id="entry_to"
                          name="entry_to"
                          value={values.entry_to}
                          className={`${errors.entry_to && 'is-invalid'}`}
                          type="text"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          onClick={(e) => {
                            changevehicleType3(e.target.value)
                          }}
                        >
                            <option value="">Select...</option>
                            <option value="5" hidden = {vType == 'Hire' || values.amounttype == '3' || values.tripsheet_is_settled < '3'}>Driver</option>
                            <option value="5" hidden = {vType == 'Hire' || values.amounttype != '3'}>Driver</option>
                            <option value="6" hidden = {vType != 'Hire' || values.amounttype == '3'}>Freight Vendor</option>
                            <option value="7" hidden={values.amounttype == '3' || values.tripsheet_is_settled != '6' || vType == 'Hire'}>Diesel Vendor</option>
                            <option value="8" hidden={vType == 'Hire' || vType == 'Own' || values.amounttype == '3' || values.tripsheet_is_settled < '3'}>Contract Vendor</option>
                            <option value="9" hidden={vType == 'Hire' || vType == 'Contract' || values.amounttype == '3' || values.tripsheet_is_settled != '6'}>Fastag Wallet</option>
                        </CFormSelect>
                      </CCol>}

                      {values.tripsheetNumber  && values.amounttype == "1" && values.gl_list_id &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="entry_to">Income From <REQ />{' '}
                        {errors.entry_to && (
                          <span className="small text-danger">{errors.entry_to}</span>
                        )}
                        </CFormLabel>
                        <CFormSelect
                          size="sm"
                          id="entry_to"
                          name="entry_to"
                          value={values.entry_to}
                          type="text"
                          maxLength="6"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          onClick={(e) => {
                            changevehicleType3(e.target.value)
                          }}
                        >
                          <option value="">Select...</option>
                          <option hidden={ vType == 'Hire' || values.amounttype == '2' || gltype == "2,3,4" || gltype == "2,3" || gltype == "3,4" || gltype == "2,4" || gltype == "2" || gltype == "3" || gltype == "4"} value="1" >RJ Customer</option>
                          <option hidden={ values.amounttype == '2' || fjcustomer.length <= 1 || gltype == "1,3,4" || gltype == "1,3" || gltype == "1,4" || gltype == "3,4" || gltype == "1" || gltype == "3" || gltype == "4"} value="2">To Pay Customer</option>
                          {/* <option hidden={ values.amounttype == '2' || gltype == "1,2,4" || gltype == "1,2" || gltype == "2,4" || gltype == "1,4" || gltype == "2" || gltype == "1" || gltype == "4"} value="3">Foods</option>
                          <option hidden={ values.amounttype == '2' || gltype == "1,2,3" || gltype == "1,2" || gltype == "2,3" || gltype == "1,3" || gltype == "2" || gltype == "1" || gltype == "3"} value="4">Consumer</option> */}

                          {othersDivisionArray.map((vv,kk) => {
                            return (
                              <>
                                <option key={kk} value={vv.val}>{vv.div}</option>
                              </>)
                            })
                          }
                        </CFormSelect>
                      </CCol>}
                      {values.tripsheetNumber && values.amounttype == '2' && values.entry_to == '8' &&
                      <CCol xs={12} md={3}>
                         <CFormLabel htmlFor="contract">Contract Vendor <REQ />{' '}

                        </CFormLabel>
                        <CFormInput
                              size="sm"
                              className="mb-1"
                              id="contract"
                              name="contract"
                              value={'OST LOGISTICS - 229304'}
                              readOnly
                        />
                      </CCol>}
                      {values.tripsheetNumber && values.amounttype && values.entry_to == '5' &&
                      <CCol xs={12} md={3}>
                         <CFormLabel htmlFor="driverId">Driver Details <REQ />{' '}
                        {errors.driverId && (
                          <span className="small text-danger">{errors.driverId}</span>
                        )}
                        </CFormLabel>
                      <DriverListSearchSelectComponent
                              size="sm"
                              className="mb-1"
                              onChange={(e) => {
                                onChange2(e)
                              }}
                              label="driverId"
                              id="driverId"
                              name="driverId"
                              value={values.driverId}
                              search_type="driver_name"
                            />
                      </CCol>}
                      {values.tripsheetNumber && values.amounttype && values.entry_to == '7' &&
                       <CCol xs={12} md={3}>
                       <CFormLabel htmlFor="diesel_vendor_name">
                         Diesel Vendor Name <REQ />{' '}
                         {errors.diesel_vendor_name && <span className="small text-danger">{errors.diesel_vendor_name}</span>}
                       </CFormLabel>
                         <CFormSelect
                           size="sm"
                           name="diesel_vendor_name"
                           onFocus={onFocus}
                           onBlur={onBlur}
                           value={values.diesel_vendor_name}
                           onChange={handleChange}
                           id="vendor_id"
                           className={`${errors.diesel_vendor_name && 'is-invalid'}`}
                           aria-label="Small select example"
                           onClick={(e) => {
                            changevehicleType4(e.target.value)
                          }}
                         >
                           <DieseVendorSelectComponent/>
                         </CFormSelect>
                     </CCol>}
                     {values.tripsheetNumber && values.amounttype && values.entry_to == '7' && values.diesel_vendor_name &&
                       <CCol xs={12} md={3}>
                       <CFormLabel htmlFor="diesel_vendor_code">
                         Diesel Vendor Code
                         {errors.diesel_vendor_code && <span className="small text-danger">{errors.diesel_vendor_code}</span>}
                       </CFormLabel>
                       <CFormInput size="sm" name='diesel_vendor_code'
                         onFocus={onFocus}
                         onBlur={onBlur}
                         onChange={Diesel_vendor_code}
                         id="diesel_vendor_code"
                         value={values.diesel_vendor_code}
                         readOnly />
                     </CCol>}
                     {values.tripsheetNumber && values.amounttype == '2' && values.entry_to == "7" && values.diesel_vendor_name &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="gl_lists">
                          Expense GL Name & Code<REQ />{' '}
                        </CFormLabel>
                      <FISearchSelectComponent
                            size="sm"
                            className="mb-1"
                            onChange={(e) => {
                              onChange1(e)
                            }}
                            label="gl_lists"
                            id="gl_lists"
                            name="gl_lists"
                            value={values.gl_list_id}
                            search_type="gl_lists_expense"
                          />
                      </CCol>}
                      {values.tripsheetNumber && values.amounttype == '1' && values.entry_to == '1' &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="rj_so_income">RJ Income {' '}</CFormLabel>
                        <CFormSelect
                          size="sm"
                          id="rj_so_income"
                          name="rj_so_income"
                          value={values.rj_so_income}
                          type="text"
                          maxLength="6"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                        >
                           <option value="0">Select...</option>
                           <option value="1" hidden={RJTripSheetNo == ''}>RJ Sales Order</option>
                           <option value="2">Direct Invoice</option>
                        </CFormSelect>
                      </CCol>}
                      {values.tripsheetNumber && values.amounttype == '1' && values.entry_to == '1' && values.rj_so_income =='1' &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="rj_so_no">RJ Customer Name</CFormLabel>
                        <CFormSelect
                          size="sm"
                          id="rj_so_no"
                          name="rj_so_no"
                          value={values.rj_so_no}
                          type="text"
                          maxLength="6"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          readOnly
                        >
                           <option value="0">Select...</option>
                        {RJSONo.map(({ rj_so_no, customer_name,customer_code }) => {
                            return (
                            <>
                                <option key={rj_so_no} value={rj_so_no}>
                                {customer_name +' - '+ customer_code}
                                    </option>
                                </>
                                )
                             })}

                        </CFormSelect>
                      </CCol>}
                      {values.tripsheetNumber && values.amounttype && values.entry_to == '1' && values.rj_so_no !=0 && values.rj_so_income =='1' &&
                      <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="rj_so_no">RJ Sales Order No</CFormLabel>
                      <CFormInput
                        size="sm"
                        id="rj_so_no"
                        name="rj_so_no"
                        value={values.rj_so_no}
                        type="text"
                        readOnly
                      />
                      </CCol>}
                    {values.tripsheetNumber && values.amounttype == '1' && values.entry_to == "1" && values.rj_so_income == '2' &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="gl_lists">
                          RJ Customer Name<REQ />{' '}
                        </CFormLabel>
                      <FISearchSelectComponent
                            size="sm"
                            className="mb-1"
                            onChange={(e) => {
                              onChangeFilter(e, 'customer_no')
                            }}
                            label="rj_customer_code"
                            id="rj_customer_code"
                            name="rj_customer_code"
                            // value={values.rj_customer_code}
                            search_type="rj_customer_details"
                            search_data={shedName}
                          />
                      </CCol>}
                      {values.tripsheetNumber && values.amounttype == '1' && values.entry_to == '1' && RjCustomer !=0 && values.rj_so_income =='2' &&
                      <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="rj_so_no">RJ Customer Code</CFormLabel>
                      <CFormInput
                        size="sm"
                        id="rj_so_no"
                        name="rj_so_no"
                        value={RjCustomer}
                        type="text"
                        readOnly
                      />
                    </CCol>}
                    {values.tripsheetNumber && values.amounttype == '1' && values.entry_to == '2' &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="customer_code">FJ Customer Name </CFormLabel>
                        <CFormSelect
                          size="sm"
                          id="customer_code"
                          name="customer_code"
                          value={values.customer_code}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          // options = {fjcustomer}
                        >
                        {fjcustomer.map(({value,label}) => {
                            return (
                            <>
                                <option key={value} value={value}>
                                  {label}
                                    </option>
                                </>
                                )
                             })}
                        </CFormSelect>
                      </CCol>}
                      {values.tripsheetNumber && values.amounttype == '1' && values.entry_to == '2' && values.customer_code !=0 &&
                      <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="customer_code">FJ Customer Code</CFormLabel>
                      <CFormInput
                        size="sm"
                        id="customer_code"
                        name="customer_code"
                        value={FJ_Sales_Customer_Code}
                        type="text"
                        readOnly
                      />
                    </CCol>}
                      {values.tripsheetNumber && values.amounttype == '1' &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="freight_amount">Income Amount <REQ />{' '}
                        {errors.freight_amount && (
                          <span className="small text-danger">{errors.freight_amount}</span>
                           )}
                        </CFormLabel>
                        <CFormInput
                          size="sm"
                          id="freight_amount"
                          name="freight_amount"
                          value={values.freight_amount}
                          className={`${errors.freight_amount && 'is-invalid'}`}
                          type="text"
                          maxLength="6"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                        />
                      </CCol>}
                      {values.tripsheetNumber && (values.amounttype == '2' && (values.entry_to == '7' || values.entry_to == '9')) &&
                      <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="freight_amount">Expense Amount <REQ />{' '}
                      {errors.freight_amount && (
                          <span className="small text-danger">{errors.freight_amount}</span>
                           )}
                      </CFormLabel>
                        <CFormInput
                          size="sm"
                          id="freight_amount"
                          name="freight_amount"
                          value={values.freight_amount}
                          className={`${errors.freight_amount && 'is-invalid'}`}
                          type="text"
                          maxLength="6"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                        />
                      </CCol>}
                      {values.tripsheetNumber && (values.amounttype == '3' && values.entry_to == '5') &&
                      <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="freight_amount">Advance Amount <REQ />{' '}
                      {errors.freight_amount && (
                          <span className="small text-danger">{errors.freight_amount}</span>
                           )}
                      </CFormLabel>
                        <CFormInput
                          size="sm"
                          id="freight_amount"
                          name="freight_amount"
                          value={values.freight_amount}
                          className={`${errors.freight_amount && 'is-invalid'}`}
                          type="text"
                          maxLength="6"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                        />
                      </CCol>}
                      {values.tripsheetNumber && (values.amounttype == '3' && values.entry_to == '5') &&
                      <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="payment_mode">Payment Mode <REQ />{' '}
                      </CFormLabel>
                        <CFormSelect
                          size="sm"
                          id="payment_mode"
                          name="payment_mode"
                          value={values.payment_mode}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          type="text"
                        >
                          <option value="">  Select  </option>
                          {PaymentMode.map(({ definition_list_code, definition_list_name }) => {
                                      return (
                                      <>
                                          <option key={definition_list_code} value={definition_list_code}>
                                          {definition_list_name}
                                              </option>
                                          </>
                                          )
                          })}
                        </CFormSelect>

                      </CCol>}
                      {values.tripsheetNumber && values.amounttype == '2' && ((values.entry_to == '5' && values.driverId) || values.entry_to == '8') &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="gltype">
                         Driver GL Name And Code<REQ />{' '}
                          {errors.gltype && (
                            <span className="small text-danger">{errors.gltype}</span>
                          )}
                        </CFormLabel>
                        <MultiSelect
                          size="sm"
                          options={owngltypes}
                          onBlur={onBlur}
                          onChange={setSelected}
                          value={selected}
                          label="Select"
                          isMultiple={true}
                          // className={`mb-1 ${errors.gltype && 'is-invalid'}`}
                          // label="Select gltype Type"
                          // noOptionsMessage="gl Type not found"
                          />
                        {/* </CFormSelect> */}
                      </CCol>}
                      {values.tripsheetNumber && values.amounttype == '2' && values.entry_to == '6' &&
                        <>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dName">SAP Division Book</CFormLabel>

                            <CFormInput size="sm" id="dName" value={sapBookDivision == 2 ? 'NLCD': 'NLLD'} readOnly />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="gltype">
                            Freight Vendor GL Name And Code<REQ />{' '}
                              {errors.gltype && (
                                <span className="small text-danger">{errors.gltype}</span>
                              )}
                            </CFormLabel>
                            <MultiSelect
                              size="sm"
                              options={hiregltypes}
                              onBlur={onBlur}
                              onChange={setSelectedHire}
                              value={selectedHire}
                              label="Select"
                              isMultiple={true}
                              // className={`mb-1 ${errors.gltype && 'is-invalid'}`}
                              // label="Select gltype Type"
                              // noOptionsMessage="gl Type not found"
                              />
                            {/* </CFormSelect> */}
                          </CCol>
                        </>
                      }
                      {values.tripsheetNumber && (values.amounttype == '1' || values.amounttype == '2' || values.amounttype == '3') &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="sap_fi_posting_date">
                          SAP Posting Date<REQ />{' '}
                          {errors.sap_invoice_posting_date && (
                            <span className="small text-danger">{errors.sap_invoice_posting_date}</span>
                          )}
                        </CFormLabel>
                        <CFormInput
                          size="sm"
                          type="date"
                          name="sap_fi_posting_date"
                          id="sap_fi_posting_date"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          value={values.sap_fi_posting_date}
                          // max={new Date().toISOString().split("T")[0]}
                          // min={datevalidation()}
                          min={Expense_Income_Posting_Date.min_date}
                          max={Expense_Income_Posting_Date.max_date}
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                        />
                      </CCol>}
                      {values.tripsheetNumber && (values.amounttype == '1' || values.amounttype == '2' || values.amounttype == '3') &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="attachment">
                          Attachment
                        </CFormLabel>
                        <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                        {!fileuploaded ? (
                          <>
                            <span className="float-start" onClick={uploadClick}>
                              <CIcon
                                style={{color:'red'}}
                                icon={icon.cilFolderOpen}
                                size="lg"
                              />
                              &nbsp;Upload
                            </span>
                            <span
                              style={{marginRight:'10%'}}
                              className="mr-10 float-end"
                              onClick={() => {
                                setCamEnable(true)
                              }}
                            >
                              <CIcon
                                  style={{color:'red'}}
                                  icon={icon.cilCamera}
                                  size="lg"
                                />
                              &nbsp;Camera
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="float-start">
                              &nbsp;{values.attachment.name}
                            </span>
                            <span className="float-end">
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                onClick={() => {
                                  setFileuploaded(false)
                                  values.attachment == ''
                                }}
                              ></i>
                            </span>
                          </>
                        )}
              </CButton>
                  <CFormInput
                    name="attachment"
                    type="file"
                    size="sm"
                    id="attachment"
                    onChange={(e)=>{imageCompress(e)}}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{display:'none'}}
                        ref={input => {
                          // assigns a reference so we can trigger it later
                          inputFile = input;
                  }}
                  />
                      </CCol>}
                      {values.tripsheetNumber  && (values.entry_to == '6' || values.entry_to == '8')  && (selectedHire.length > 0 || selected.length > 0) &&
                      <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="supplier_ref_no">Supplier Reference No <REQ />{' '}
                      {errors.supplier_ref_no && (
                          <span className="small text-danger">{errors.supplier_ref_no}</span>
                           )}
                      </CFormLabel>
                        <CFormInput
                          size="sm"
                          id="supplier_ref_no"
                          name="supplier_ref_no"
                          value={values.supplier_ref_no}
                          type="text"
                          maxLength="16"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                        />
                      </CCol>}
                      {values.tripsheetNumber  && (values.entry_to == '6' || values.entry_to == '8')  && (selectedHire.length > 0 || selected.length > 0) &&
                      <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="supplier_posting_date">Supplier Document Date<REQ />{' '}
                      {errors.supplier_posting_date && (
                          <span className="small text-danger">{errors.supplier_posting_date}</span>
                           )}
                      </CFormLabel>
                        <CFormInput
                          size="sm"
                          id="supplier_posting_date"
                          name="supplier_posting_date"
                          value={values.supplier_posting_date}
                          type="date"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                        />
                      </CCol>} 
                      {values.tripsheetNumber  && ((values.entry_to == '6'  && selectedHire.length > 0 && (values.mode_of_payment == '1' || values.mode_of_payment == '2')) || (values.entry_to == '7' &&  (values.mode_of_payment == '1' || values.mode_of_payment == '2'))||(values.entry_to == '8' && selected.length > 0 &&  (values.mode_of_payment == '1' || values.mode_of_payment == '2')))  &&
                        <>
                          <CCol className="mb-3" md={3}>
                            <CFormLabel htmlFor="gst_tax_type">GST Tax Type <REQ />{' '}
                              {errors.gst_tax_type && (
                                <span className="small text-danger">{errors.gst_tax_type}</span>
                              )}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              id="gst_tax_type"
                              name="gst_tax_type"
                              value={values.gst_tax_type}
                              className={`${errors.gst_tax_type && 'is-invalid'}`}
                              type="text"
                              maxLength="6"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                            >
                              <option value="">Select...</option>
                              {/* <option value="Empty">No Tax</option>
                              <option value="R5">Input Tax RCM (SGST,CGST @ 2.5% & 2.5%)</option>
                              <option value="F6">Input Tax (SGST,CGST @ 6% & 6%)</option> */}
                              {GstTaxType.map(({ definition_list_code, definition_list_name }) => {
                                return (
                                  <>
                                      <option key={definition_list_code} value={definition_list_code}>
                                      {definition_list_name}
                                      </option>
                                  </>
                                )
                              })}
                            </CFormSelect>
                          </CCol>
                          {values.entry_to != '7' ? (
                            <CCol className="mb-3" md={3}>
                              <CFormLabel htmlFor="gst_tax_code">
                                  TDS Maintained Details
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                id="gst_tax_code"
                                name="gst_tax_code"
                                value={tdsConversion(singleVehicleInfo.parking_info?.vendor_info?.gst_tax_code)}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                disabled
                              >
                                <option value="">  -  </option>
                                {TaxType.map(({ definition_list_code, definition_list_name }) => {
                                  return (
                                    <>
                                      <option key={definition_list_code} value={definition_list_code}>
                                        {definition_list_name}
                                      </option>
                                    </>
                                  )})
                                }
                              </CFormSelect>
                            </CCol> 
                          ) : (
                            <CCol className="mb-3" md={3}>
                              <CFormLabel htmlFor="gst_tax_code">
                                  TDS Maintained Details
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                id="gst_tax_code"
                                name="gst_tax_code"
                                // value={"T9"}
                                value={"Q1"}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                disabled
                              >
                                <option value="">  -  </option>
                                {TaxType.map(({ definition_list_code, definition_list_name }) => {
                                  return (
                                    <>
                                      <option key={definition_list_code} value={definition_list_code}>
                                        {definition_list_name}
                                      </option>
                                    </>
                                  )})
                                }
                              </CFormSelect>
                            </CCol> 
                          )}
                          <CCol className="mb-3" md={3}>
                            <CFormLabel htmlFor="tds_type"> TDS <REQ />{' '}                                  
                              {errors.tds_type && (
                                <span className="small text-danger">{errors.tds_type}</span>
                              )}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              id="tds_type"
                              className={`${errors.tds_type && 'is-invalid'}`}
                              name="tds_type"
                              value={values.tds_type}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                            >
                              <option value="" selected>
                                Select...
                              </option>
                              <option value="1">Yes</option>
                              <option value="2">No</option>
                            </CFormSelect>
                          </CCol>
                          <CCol className="mb-3" md={3}>
                            <CFormLabel htmlFor="hsn_type"> HSN <REQ />{' '}                                  
                              {errors.hsn_type && (
                                <span className="small text-danger">{errors.hsn_type}</span>
                              )}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              id="hsn_type"
                              className={`${errors.hsn_type && 'is-invalid'}`}
                              name="hsn_type"
                              value={values.hsn_type}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                            >
                              <option value="" selected>
                                Select...
                              </option>
                              {sapHsnData.map(({ definition_list_code, definition_list_name }) => {
                                if (definition_list_code) {
                                  return (
                                    <>
                                      <option
                                        key={definition_list_code}
                                        value={definition_list_code}
                                      >
                                        {definition_list_name}
                                      </option>
                                    </>
                                  )
                                }
                              })}
                            </CFormSelect>
                          </CCol>
                        </>
                      }

                      {values.tripsheetNumber && (values.amounttype == '1' || values.amounttype == '2' || values.amounttype == '3') &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="remarks">Remarks <REQ />{' '}</CFormLabel>
                        <CFormTextarea
                          name="remarks"
                          id="remarks"
                          onChange={handleChangenew}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          value={remarks}
                          maxLength="50"
                          rows="1"
                        >
                        </CFormTextarea>
                      </CCol>}
                    </CRow>
                      {values.tripsheetNumber  && ((values.entry_to == '5' && values.driverId) || values.entry_to == '8')  && selected.length > 0 &&
                        <CRow>
                        {selected.map(({ value, label,EXPENSE_AMT },index) => {
                        return (
                        <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="EXPENSE_AMT">
                                  {label} AMOUNT
                                </CFormLabel>
                                  <div key={index}>
                                  <CFormInput
                                  size="sm"
                                  id="EXPENSE_AMT"
                                  name="EXPENSE_AMT"
                                  value={EXPENSE_AMT}
                                  // key={index}
                                  // className={`${errors.freight_amount && 'is-invalid'}`}
                                  type="text"
                                  maxLength="6"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  onChange={(e) => handleChangesOwn(e, index)}
                                  />
                                  </div>
                              </CCol>

                            </>
                            );
                          })}
                      </CRow>}
                      {values.tripsheetNumber  && values.entry_to == '6'  && selectedHire.length > 0 &&
                        <CRow>
                        {selectedHire.map(({ value, label,EXPENSE_AMT },index) => {
                        return (
                        <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="EXPENSE_AMT">
                                  {label} AMOUNT
                                </CFormLabel>
                                <div key={index}>
                                  <CFormInput
                                  size="sm"
                                  id="EXPENSE_AMT"
                                  name="EXPENSE_AMT"
                                  value={EXPENSE_AMT}
                                  // key={index}
                                  // className={`${errors.freight_amount && 'is-invalid'}`}
                                  type="text"
                                  maxLength="6"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  // onChange={handleChange}
                                  onChange={(e) => handleChangesHire(e, index)}
                                  />
                                </div>
                              </CCol>

                            </>
                            );
                          })}
                      </CRow>}
                      <CRow>
                      {values.tripsheetNumber  && ((values.entry_to == '5' && values.driverId) || values.entry_to == '8')  && selected.length > 0 &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="sum">
                          Total Driver Expense Amount
                        </CFormLabel>
                          <CFormInput
                          size="sm"
                          id="sum"
                          name="sum"
                          value={sum_own}
                          type="text"
                          readOnly
                          />
                      </CCol>}
                      {values.tripsheetNumber  &&  values.entry_to == '6'  && selectedHire.length > 0 &&
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="sum">
                          Total Freight Vendor Expense Amount
                        </CFormLabel>
                          <CFormInput
                          size="sm"
                          id="sum"
                          name="sum"
                          value={sum_hire}
                          type="text"
                          readOnly
                          />
                      </CCol>}
                    </CRow>
                    <CRow className="mt-3">
                      {/* <CCol className="" xs={12} sm={9} md={3}>
                        <CButton
                          size="sm"
                          color="primary"
                          // disabled={enableSubmit}
                          className="text-white"
                          // type="submit"
                        >
                          Previous
                        </CButton>
                      </CCol> */}

                      <CCol className="m-2" xs={12} sm={12} md={3}>
                        <CButton size="sm" color="primary" className="text-white" onClick={clearValues} type="button">
                            Previous
                        </CButton>
                      </CCol>
                      <CCol
                        className="offset-md-9"
                        xs={12}
                        sm={9}
                        md={3}
                        style={{ display: 'flex', justifyContent: 'end' }}
                      >
                        <CButton
                          size="sm"
                          color="warning"
                          disabled={acceptBtn}
                          className="mx-3 px-3 text-white"
                          // type="submit"
                          onClick={() => {
                            setConfirmBtn(true)
                          }}
                        >
                          Submit
                        </CButton>
                      </CCol>
                    </CRow>
                    {values.tripsheetNumber && rowData.length > 0 &&
                    <CustomTable
                      columns={columns}
                      data={rowData}
                      fieldName={'Driver_Name'}
                      showSearchFilter={true}
                    />}
                  </CForm>
                </CTabPane>
                {/* Rake FI Process */}
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={currentProcessId == 2}>
                {!tripRPSHaving && (
                  <>
                    <CRow>
                      <CCol xs={12} md={4}>
                        <div className="w-100 p-3">
                          <CFormLabel htmlFor="tripsheetNumberNew">
                            Enter RPS Number
                            <REQ />{' '}

                          </CFormLabel>
                          <CInputGroup>
                            <CFormInput
                              size="sm"
                              name="tripsheetNumberNew"
                              id="tripsheetNumberNew"
                              maxLength={15}
                              autoComplete='off'
                              value={tripRPSNumberNew}
                              onChange={handleChangenewtrip}
                            />
                            <CInputGroupText className="p-0">
                              <CButton
                                size="sm"
                                color="primary"
                                onClick={(e) => {
                                  // setFetch(false)
                                  setSmallFetch(false)
                                  gettripRPSData(e)
                                }}
                              >
                                <i className="fa fa-search px-1"></i>
                              </CButton>
                              <CButton
                                size="sm"
                                style={{ marginLeft:"3px" }}
                                color="primary"
                                onClick={() => {
                                  window.location.reload(false)
                                }}
                              >
                                <i className="fa fa-refresh px-1"></i>
                              </CButton>
                            </CInputGroupText>
                          </CInputGroup>
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CButton size="sm" color="primary" className="text-white m-4" onClick={clearValues} type="button">
                          Previous
                        </CButton>
                      </CCol>
                    </CRow>
                  </>
                )}

                {!smallfetch && <SmallLoader />}
                {smallfetch && Object.keys(tripRPSData).length != 0  && (
                  <>
                    <CCard style={{display: tripRPSHaving ? 'block' : 'none'}}  className="p-3">

                      <CRow>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dName">RPS Number</CFormLabel>

                          <CFormInput size="sm" id="dName" value={tripRPSData.expense_sequence_no} readOnly />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dName">FNR Number</CFormLabel>

                          <CFormInput size="sm" id="dName" value={tripRPSData.fnr_no} readOnly />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dName">Vendor Name</CFormLabel>

                          <CFormInput size="sm" id="dName" value={tripRPSData.rake_vendor_info.v_name} readOnly />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dName">Vendor Code</CFormLabel>

                          <CFormInput size="sm" id="dName" value={tripRPSData.vendor_code} readOnly />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dName">Vendor PAN No.</CFormLabel>

                          <CFormInput size="sm" id="dName" value={tripRPSData.rake_vendor_info.v_pan_no} readOnly />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dName">Total Trip Count</CFormLabel>

                          <CFormInput size="sm" id="dName" value={tripRPSData.trip_migo_count} readOnly />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="shipment_division">
                            FI Entry Mode <REQ />{' '}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="shipment_division"
                            onChange={(e) => {
                              setFiEntryMode(e.target.value)
                              setSapPostingDate('')
                              values.rake_supplier_ref_no = ''
                              values.rake_supplier_posting_date = ''
                              values.firemarks = ''
                              !(e.target.value == 1 || e.target.value == 2) ? setSelectedHire([]) : ''
                              !(e.target.value == 3 || e.target.value == 4) ? setRakeFreightAMount2('') : ''
                            }}
                            value={fiEntryMode}
                            id="fi_entry_mode"
                          >
                            <option value="0">Select ...</option>
                            <option value="1">Expense Credit Note (FB60)</option>
                            <option value="2">Expense Debit Note (FB65)</option>
                            <option value="3">Income Credit Note (FB75)</option>
                            <option value="4">Income Debit Note (FB70)</option>
                          </CFormSelect>
                        </CCol>

                        {(fiEntryMode == 1 || fiEntryMode == 2) && (
                          <>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="dName">SAP Division Book</CFormLabel>

                              <CFormInput size="sm" id="dName" value={sapBookDivision == 2 ? 'NLCD': 'NLLD'} readOnly />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="gltype">
                              Freight Vendor GL Name And Code<REQ />{' '}
                                {errors.gltype && (
                                  <span className="small text-danger">{errors.gltype}</span>
                                )}
                              </CFormLabel>
                              <MultiSelect
                                size="sm"
                                options={hiregltypes}
                                onBlur={onBlur}
                                onChange={setSelectedHire}
                                value={selectedHire}
                                label="Select"
                                isMultiple={true}
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="rake_supplier_ref_no">Supplier Reference No <REQ />{' '}
                              {errors.rake_supplier_ref_no && (
                                  <span className="small text-danger">{errors.rake_supplier_ref_no}</span>
                                  )}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="rake_supplier_ref_no"
                                name="rake_supplier_ref_no"
                                value={values.rake_supplier_ref_no}
                                type="text"
                                maxLength="16"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="rake_supplier_posting_date">Supplier Document Date<REQ />{' '}
                              {errors.rake_supplier_posting_date && (
                                  <span className="small text-danger">{errors.rake_supplier_posting_date}</span>
                                  )}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="rake_supplier_posting_date"
                                name="rake_supplier_posting_date"
                                value={values.rake_supplier_posting_date}
                                type="date"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="rake_gst_tax_type">GST Tax Type <REQ />{' '}
                                {errors.rake_gst_tax_type && (
                                <span className="small text-danger">{errors.rake_gst_tax_type}</span>
                                )}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                id="rake_gst_tax_type"
                                name="rake_gst_tax_type"
                                value={values.rake_gst_tax_type}
                                className={`${errors.rake_gst_tax_type && 'is-invalid'}`}
                                type="text"
                                maxLength="6"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                              >
                                <option value="">Select...</option>
                                {/* <option value="Empty">No Tax</option>
                                <option value="R5">Input Tax RCM (SGST,CGST @ 2.5% & 2.5%)</option>
                                <option value="F6">Input Tax (SGST,CGST @ 6% & 6%)</option> */}
                                {GstTaxType.map(({ definition_list_code, definition_list_name }) => {
                                  return (
                                  <>
                                      <option key={definition_list_code} value={definition_list_code}>
                                      {definition_list_name}
                                      </option>
                                  </>
                                )})}
                              </CFormSelect>
                            </CCol>
                            <CCol className="mb-3" md={3}>
                              <CFormLabel htmlFor="gst_tax_code">
                                  TDS Maintained Details
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                value={(tripRPSData.rake_vendor_info && tripRPSData.rake_vendor_info.v_tds_tax_type ? tdsTaxCodeName(tripRPSData.rake_vendor_info.v_tds_tax_type) : '--')}
                                readOnly
                              />
                            </CCol>

                            <CCol className="mb-3" md={3}>
                              <CFormLabel htmlFor="rake_tds_type">
                                  TDS <REQ />{' '}
                                {errors.rake_tds_type && (
                                  <span className="small text-danger">{errors.rake_tds_type}</span>
                                )}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                id="rake_tds_type"
                                className={`${errors.rake_tds_type && 'is-invalid'}`}
                                name="rake_tds_type"
                                value={values.rake_tds_type}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                              >
                                <option value="" selected>
                                  Select...
                                </option>
                                <option value="1">Yes</option>
                                <option value="2">No</option>
                              </CFormSelect>
                            </CCol>
                            <CCol className="mb-3" md={3}>
                              <CFormLabel htmlFor="rake_hsn_type">
                                  HSN <REQ />{' '}
                                {errors.rake_hsn_type && (
                                  <span className="small text-danger">{errors.rake_hsn_type}</span>
                                )}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                id="rake_hsn_type"
                                className={`${errors.rake_hsn_type && 'is-invalid'}`}
                                name="rake_hsn_type"
                                value={values.rake_hsn_type}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                              >
                                <option value="" selected>
                                  Select...
                                </option>
                                {sapHsnData.map(({ definition_list_code, definition_list_name }) => {
                                  if (definition_list_code) {
                                    return (
                                      <>
                                        <option
                                          key={definition_list_code}
                                          value={definition_list_code}
                                        >
                                          {definition_list_name}
                                        </option>
                                      </>
                                    )
                                  }
                                })}
                              </CFormSelect>
                            </CCol>
                          </>
                        )}

                        {(fiEntryMode == 3 || fiEntryMode == 4) && (
                          <>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="dName">Division</CFormLabel>

                              <CFormInput size="sm" id="dName" value={customerFinder(tripRPSData.customer_code)} readOnly />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="dName">GL Code</CFormLabel>

                              <CFormInput size="sm" id="dName" value={GLCodeFinder(tripRPSData.customer_code)} readOnly />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="rake_freight_amount2">Income Amount <REQ />{' '}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="rake_freight_amount2"
                                name="rake_freight_amount2"
                                value={rakeFreightAMount2}
                                type="text"
                                maxLength={6}
                                onChange={(e) => {
                                  freightAmountUpdate(e,2)
                                }}
                              />
                            </CCol>
                          </>
                        )}

                        {fiEntryMode != 0 && (
                          <>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="invoiceCopy">
                                Attachment
                              </CFormLabel>
                              <CFormInput
                                onChange={handleChangeInvoiceCopy}
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                name="invoiceCopy"
                                size="sm"
                                id="invoiceCopy"
                                // value={invoiceCopy}
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="sapPostingDate">
                                SAP Posting Date <REQ />{' '}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="date"
                                id="sapPostingDate"
                                name="sapPostingDate"
                                onChange={handleChangeSapPostingDate}
                                min={Expense_Income_Posting_Date.min_date}
                                max={Expense_Income_Posting_Date.max_date}
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                }}
                                value={sapPostingDate}
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="firemarks">Remarks <REQ />{' '}</CFormLabel>
                              <CFormTextarea
                                name="firemarks"
                                id="firemarks"
                                rows="1"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={values.firemarks}
                              ></CFormTextarea>
                            </CCol>
                            {( tripRPSData.customer_code == '20068' && (fiEntryMode == 3 || fiEntryMode == 4) ) && (
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="fitdsremarks">TDS Remarks <REQ />{' '}</CFormLabel>
                                <CFormTextarea
                                  name="fitdsremarks"
                                  id="fitdsremarks"
                                  rows="1"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  onChange={handleChange}
                                  value={values.fitdsremarks}
                                ></CFormTextarea>
                              </CCol>
                            )}
                          </>
                        )}


                      </CRow>
                      <CRow>
                        {selectedHire.map(({ value, label,EXPENSE_AMT },index) => {
                          return (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="EXPENSE_AMT">
                                  {label} AMOUNT
                                </CFormLabel>
                                <div key={index}>
                                  <CFormInput
                                    size="sm"
                                    id="EXPENSE_AMT"
                                    name="EXPENSE_AMT"
                                    value={EXPENSE_AMT}
                                    // key={index}
                                    // className={`${errors.freight_amount && 'is-invalid'}`}
                                    type="text"
                                    maxLength="6"
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    // onChange={handleChange}
                                    onChange={(e) => handleChangesHire(e, index)}
                                  />
                                </div>
                              </CCol>
                            </>
                          );
                        })}
                        {(fiEntryMode == 1 || fiEntryMode == 2) && (selectedHire.length > 0) && (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="sum">
                              Total Expense Amount
                            </CFormLabel>
                              <CFormInput
                              size="sm"
                              id="sum"
                              name="sum"
                              value={sum_hire}
                              type="text"
                              readOnly
                              />
                          </CCol>
                        )}
                      </CRow>
                      {/* <CRow>
                        <CCol>
                          <CButton size="sm" color="primary" className="text-white m-2" onClick={clearValues} type="button">
                            Previous
                          </CButton>
                        </CCol>
                      </CRow> */}
                      <CRow className="mt-3">
                        <CCol className="" xs={12} sm={9} md={3}>
                          <CButton
                            size="sm"
                            style={{ marginLeft:"3px" }}
                            color="primary"
                            // onClick={() => {
                            //   window.location.reload(false)
                            // }}
                            onClick={clearValues}
                          >
                            Previous
                          </CButton>
                        </CCol>

                        <CCol
                          className="offset-md-6"
                          xs={12}
                          sm={9}
                          md={3}
                          style={{ display: 'flex', justifyContent: 'end' }}
                        >
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-3 px-3 text-white"
                            onClick={() => {
                              rakeFIUpdateValidation()
                            }}
                          >
                            Submit
                          </CButton>
                        </CCol>
                      </CRow>
                      {tripRPSNumberNew && rakeRowData.length > 0 &&
                        <CustomTable
                          columns={rake_column}
                          data={rakeRowData}
                          fieldName={'RPS_NO'}
                          showSearchFilter={true}
                        />
                      }

                    </CCard>
                    {/* ============== FI-Entry Attachment Copy Modal Area Start ================= */}
                      <CModal
                        visible={visible}
                        onClose={() => {
                          setVisible(false)
                          setFiImgSrc("")
                        }}
                      >
                        <CModalHeader>
                          <CModalTitle>FI Attachment Copy</CModalTitle>
                        </CModalHeader>

                        <CModalBody>
                          {fiImgSrc &&
                          !fiImgSrc.includes('.pdf') ? (
                            <CCardImage orientation="top" src={fiImgSrc} />
                          ) : (
                            <iframe
                              orientation="top"
                              height={500}
                              width={475}
                              src={fiImgSrc}
                            ></iframe>
                          )}
                        </CModalBody>

                        <CModalFooter>
                          <CButton
                            color="secondary"
                            onClick={() => {
                              setVisible(false)
                              setFiImgSrc("")
                            }}
                          >
                            Close
                          </CButton>
                        </CModalFooter>
                      </CModal>
                    {/* ============== FI-Entry Attachment Copy Modal Area Start ================= */}
                    {/* ============== FI-Entry Submit Confirm Button Modal Area Start ================= */}
                      <CModal
                        visible={rakeModalEnable}
                        backdrop="static"
                        // scrollable
                        onClose={() => {
                          setRakeModalEnable(false)
                        }}
                      >
                        <CModalBody>
                          <p className="lead">Are you sure to Submit the FI Entry to SAP ?</p>
                        </CModalBody>
                        <CModalFooter>
                          <CButton
                            className="m-2"
                            color="warning"
                            onClick={() => {
                              setRakeModalEnable(false)
                              rakeFIUpdateSubmission()
                            }}
                          >
                            Yes
                          </CButton>
                          <CButton
                            color="secondary"
                            onClick={() => {
                              setRakeModalEnable(false)
                            }}
                          >
                            No
                          </CButton>
                        </CModalFooter>
                      </CModal>
                    {/* ============== FI-Entry Submit Confirm Button Modal Area End ================= */}

                  </>
                )}
                </CTabPane>
                {/* FCI FI Process */}
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={currentProcessId == 3}>
                {!tripFPSHaving && (
                  <>
                    <CRow>
                      <CCol xs={12} md={4}>
                        <div className="w-100 p-3">
                          <CFormLabel htmlFor="tripsheetNumberNew">
                            Enter FPS Number
                            <REQ />{' '}

                          </CFormLabel>
                          <CInputGroup>
                            <CFormInput
                              size="sm"
                              name="tripsheetNumberNew"
                              id="tripsheetNumberNew"
                              maxLength={15}
                              autoComplete='off'
                              value={tripFPSNumberNew}
                              onChange={handleChangenewtripFci}
                            />
                            <CInputGroupText className="p-0">
                              <CButton
                                size="sm"
                                color="primary"
                                onClick={(e) => {
                                  // setFetch(false)
                                  setSmallFetch(false)
                                  gettripFPSData(e)
                                }}
                              >
                                <i className="fa fa-search px-1"></i>
                              </CButton>
                              <CButton
                                size="sm"
                                style={{ marginLeft:"3px" }}
                                color="primary"
                                onClick={() => {
                                  window.location.reload(false)
                                }}
                              >
                                <i className="fa fa-refresh px-1"></i>
                              </CButton>
                            </CInputGroupText>
                          </CInputGroup>
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CButton size="sm" color="primary" className="text-white m-4" onClick={clearValues} type="button">
                          Previous
                        </CButton>
                      </CCol>
                    </CRow>
                  </>
                )}

                {!smallfetch && <SmallLoader />}
                {smallfetch && Object.keys(tripFPSData).length != 0  && (
                  <>
                    <CCard style={{display: tripFPSHaving ? 'block' : 'none'}}  className="p-3">

                      <CRow>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dName">FPS Number</CFormLabel>

                          <CFormInput size="sm" id="dName" value={tripFPSData.expense_sequence_no} readOnly />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dName">PO Number</CFormLabel>

                          <CFormInput size="sm" id="dName" value={tripFPSData.po_no} readOnly />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dName">Vendor Name</CFormLabel>

                          <CFormInput size="sm" id="dName" value={tripFPSData.expense_vendor_name} readOnly />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dName">Vendor Code</CFormLabel>

                          <CFormInput size="sm" id="dName" value={tripFPSData.expense_vendor_code} readOnly />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dName">Vendor Type</CFormLabel>

                          <CFormInput size="sm" id="dName" value={tripFPSData.expense_vendor_type == 2 ? 'Loading Vendor' : 'Freight Vendor'} readOnly />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="dName">Total Trip Count</CFormLabel>

                          <CFormInput size="sm" id="dName" value={tripFPSData.trip_migo_count} readOnly />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="shipment_division">
                            FI Entry Mode <REQ />{' '}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="shipment_division"
                            onChange={(e) => {
                              setFiEntryMode(e.target.value)
                              console.log(hiregltypes,'hiregltypes')
                              setSapPostingDate('')
                              values.rake_supplier_ref_no = ''
                              values.rake_supplier_posting_date = ''
                              values.firemarks = ''
                              !(e.target.value == 1 || e.target.value == 2) ? setSelectedHire([]) : ''
                              !(e.target.value == 3 || e.target.value == 4) ? setFciFreightAMount2('') : ''
                            }}
                            value={fiEntryMode}
                            id="fi_entry_mode"
                          >
                            <option value="0">Select ...</option>
                            <option value="1">Expense Credit Note (FB60)</option>
                            <option value="2">Expense Debit Note (FB65)</option>
                            <option value="3">Income Credit Note (FB75)</option>
                            <option value="4">Income Debit Note (FB70)</option>
                          </CFormSelect>
                        </CCol>

                        {(fiEntryMode == 1 || fiEntryMode == 2) && (
                          <>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="gltype">
                              Freight Vendor GL Name And Code<REQ />{' '}
                                {errors.gltype && (
                                  <span className="small text-danger">{errors.gltype}</span>
                                )}
                              </CFormLabel>
                              <MultiSelect
                                size="sm"
                                options={hiregltypes}
                                onBlur={onBlur}
                                onChange={setSelectedHire}
                                value={selectedHire}
                                label="Select"
                                isMultiple={true}
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="rake_supplier_ref_no">Supplier Reference No <REQ />{' '}
                              {errors.rake_supplier_ref_no && (
                                  <span className="small text-danger">{errors.rake_supplier_ref_no}</span>
                                  )}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="rake_supplier_ref_no"
                                name="rake_supplier_ref_no"
                                value={values.rake_supplier_ref_no}
                                type="text"
                                maxLength="16"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="rake_supplier_posting_date">Supplier Document Date<REQ />{' '}
                              {errors.rake_supplier_posting_date && (
                                  <span className="small text-danger">{errors.rake_supplier_posting_date}</span>
                                  )}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="rake_supplier_posting_date"
                                name="rake_supplier_posting_date"
                                value={values.rake_supplier_posting_date}
                                type="date"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="rake_gst_tax_type">GST Tax Type <REQ />{' '}
                                {errors.rake_gst_tax_type && (
                                <span className="small text-danger">{errors.rake_gst_tax_type}</span>
                                )}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                id="rake_gst_tax_type"
                                name="rake_gst_tax_type"
                                value={values.rake_gst_tax_type}
                                className={`${errors.rake_gst_tax_type && 'is-invalid'}`}
                                type="text"
                                maxLength="6"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                              >
                                <option value="">Select...</option>
                                {/* <option value="Empty">No Tax</option>
                                <option value="R5">Input Tax RCM (SGST,CGST @ 2.5% & 2.5%)</option>
                                <option value="F6">Input Tax (SGST,CGST @ 6% & 6%)</option> */}
                                {GstTaxType.map(({ definition_list_code, definition_list_name }) => {
                                  return (
                                  <>
                                      <option key={definition_list_code} value={definition_list_code}>
                                      {definition_list_name}
                                      </option>
                                  </>
                                )})}
                              </CFormSelect>
                            </CCol>
                            <CCol className="mb-3" md={3}>
                              <CFormLabel htmlFor="gst_tax_code">
                                  TDS Maintained Details
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                value={(tripFPSData.expense_tds == 1 ? tdsTaxCodeName(tripFPSData.expense_tds_type) : '--')}
                                readOnly
                              />
                            </CCol>
                            
                            {tripFPSData.expense_tds == 1 && (
                              <CCol className="mb-3" md={3}>
                                <CFormLabel htmlFor="rake_tds_type">
                                    TDS <REQ />{' '}
                                  {errors.rake_tds_type && (
                                    <span className="small text-danger">{errors.rake_tds_type}</span>
                                  )}
                                </CFormLabel>
                                <CFormSelect
                                  size="sm"
                                  id="rake_tds_type"
                                  className={`${errors.rake_tds_type && 'is-invalid'}`}
                                  name="rake_tds_type"
                                  value={values.rake_tds_type}
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  onChange={handleChange}
                                >
                                  <option value="" selected>
                                    Select...
                                  </option>
                                  <option value="1">Yes</option>
                                  <option value="2">No</option>
                                </CFormSelect>
                              </CCol>
                            )}
                            <CCol className="mb-3" md={3}>
                              <CFormLabel htmlFor="rake_hsn_type">
                                  HSN <REQ />{' '}
                                {errors.rake_hsn_type && (
                                  <span className="small text-danger">{errors.rake_hsn_type}</span>
                                )}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                id="rake_hsn_type"
                                className={`${errors.rake_hsn_type && 'is-invalid'}`}
                                name="rake_hsn_type"
                                value={values.rake_hsn_type}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                              >
                                <option value="" selected>
                                  Select...
                                </option>
                                {sapHsnData.map(({ definition_list_code, definition_list_name }) => {
                                  if (definition_list_code) {
                                    return (
                                      <>
                                        <option
                                          key={definition_list_code}
                                          value={definition_list_code}
                                        >
                                          {definition_list_name}
                                        </option>
                                      </>
                                    )
                                  }
                                })}
                              </CFormSelect>
                            </CCol>
                          </>
                        )}

                        {(fiEntryMode == 3 || fiEntryMode == 4) && (
                          <>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="dName">Division</CFormLabel>

                              <CFormInput size="sm" id="dName" value={customerFinder(tripFPSData.income_customer_code)} readOnly />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="dName">GL Code</CFormLabel>

                              <CFormInput size="sm" id="dName" value={GLCodeFinder(tripFPSData.income_customer_code)} readOnly />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="fci_freight_amount2">Income Amount <REQ />{' '}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="fci_freight_amount2"
                                name="fci_freight_amount2"
                                value={fciFreightAMount2}
                                type="text"
                                maxLength={6}
                                onChange={(e) => {
                                  freightAmountUpdateFci(e,2)
                                }}
                              />
                            </CCol>
                          </>
                        )}

                        {fiEntryMode != 0 && (
                          <>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="invoiceCopy">
                                Attachment
                              </CFormLabel>
                              <CFormInput
                                onChange={handleChangeInvoiceCopy}
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                name="invoiceCopy"
                                size="sm"
                                id="invoiceCopy"
                                // value={invoiceCopy}
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="sapPostingDate">
                                SAP Posting Date <REQ />{' '}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="date"
                                id="sapPostingDate"
                                name="sapPostingDate"
                                onChange={handleChangeSapPostingDate}
                                min={Expense_Income_Posting_Date.min_date}
                                max={Expense_Income_Posting_Date.max_date}
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                }}
                                value={sapPostingDate}
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="firemarks">Remarks <REQ />{' '}</CFormLabel>
                              <CFormTextarea
                                name="firemarks"
                                id="firemarks"
                                rows="1"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={values.firemarks}
                              ></CFormTextarea>
                            </CCol>
                            {( tripFPSData.income_customer_code == '20068' && (fiEntryMode == 3 || fiEntryMode == 4) ) && (
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="fitdsremarks">TDS Remarks <REQ />{' '}</CFormLabel>
                                <CFormTextarea
                                  name="fitdsremarks"
                                  id="fitdsremarks"
                                  rows="1"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  onChange={handleChange}
                                  value={values.fitdsremarks}
                                ></CFormTextarea>
                              </CCol>
                            )}
                          </>
                        )}


                      </CRow>
                      <CRow>
                        {selectedHire.map(({ value, label,EXPENSE_AMT },index) => {
                          return (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="EXPENSE_AMT">
                                  {label} AMOUNT
                                </CFormLabel>
                                <div key={index}>
                                  <CFormInput
                                    size="sm"
                                    id="EXPENSE_AMT"
                                    name="EXPENSE_AMT"
                                    value={EXPENSE_AMT}
                                    // key={index}
                                    // className={`${errors.freight_amount && 'is-invalid'}`}
                                    type="text"
                                    maxLength="6"
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    // onChange={handleChange}
                                    onChange={(e) => handleChangesHire(e, index)}
                                  />
                                </div>
                              </CCol>
                            </>
                          );
                        })}
                        {(fiEntryMode == 1 || fiEntryMode == 2) && (selectedHire.length > 0) && (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="sum">
                              Total Expense Amount
                            </CFormLabel>
                              <CFormInput
                              size="sm"
                              id="sum"
                              name="sum"
                              value={sum_hire}
                              type="text"
                              readOnly
                              />
                          </CCol>
                        )}
                      </CRow>
                      {/* <CRow>
                        <CCol>
                          <CButton size="sm" color="primary" className="text-white m-2" onClick={clearValues} type="button">
                            Previous
                          </CButton>
                        </CCol>
                      </CRow> */}
                      <CRow className="mt-3">
                        <CCol className="" xs={12} sm={9} md={3}>
                          <CButton
                            size="sm"
                            style={{ marginLeft:"3px" }}
                            color="primary"
                            // onClick={() => {
                            //   window.location.reload(false)
                            // }}
                            onClick={clearValues}
                          >
                            Previous
                          </CButton>
                        </CCol>

                        <CCol
                          className="offset-md-6"
                          xs={12}
                          sm={9}
                          md={3}
                          style={{ display: 'flex', justifyContent: 'end' }}
                        >
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-3 px-3 text-white"
                            onClick={() => {
                              fciFIUpdateValidation()
                            }}
                          >
                            Submit
                          </CButton>
                        </CCol>
                      </CRow>
                      {tripRPSNumberNew && rakeRowData.length > 0 &&
                        <CustomTable
                          columns={rake_column}
                          data={rakeRowData}
                          fieldName={'RPS_NO'}
                          showSearchFilter={true}
                        />
                      }

                    </CCard>
                    {/* ============== FI-Entry Attachment Copy Modal Area Start ================= */}
                      <CModal
                        visible={visible}
                        onClose={() => {
                          setVisible(false)
                          setFiImgSrc("")
                        }}
                      >
                        <CModalHeader>
                          <CModalTitle>FI Attachment Copy</CModalTitle>
                        </CModalHeader>

                        <CModalBody>
                          {fiImgSrc &&
                          !fiImgSrc.includes('.pdf') ? (
                            <CCardImage orientation="top" src={fiImgSrc} />
                          ) : (
                            <iframe
                              orientation="top"
                              height={500}
                              width={475}
                              src={fiImgSrc}
                            ></iframe>
                          )}
                        </CModalBody>

                        <CModalFooter>
                          <CButton
                            color="secondary"
                            onClick={() => {
                              setVisible(false)
                              setFiImgSrc("")
                            }}
                          >
                            Close
                          </CButton>
                        </CModalFooter>
                      </CModal>
                    {/* ============== FI-Entry Attachment Copy Modal Area Start ================= */}
                    {/* ============== FI-Entry Submit Confirm Button Modal Area Start ================= */}
                      <CModal
                        visible={rakeModalEnable}
                        backdrop="static"
                        // scrollable
                        onClose={() => {
                          setRakeModalEnable(false)
                        }}
                      >
                        <CModalBody>
                          <p className="lead">Are you sure to Submit the FI Entry to SAP ?</p>
                        </CModalBody>
                        <CModalFooter>
                          <CButton
                            className="m-2"
                            color="warning"
                            onClick={() => {
                              setRakeModalEnable(false)
                              rakeFIUpdateSubmission()
                            }}
                          >
                            Yes
                          </CButton>
                          <CButton
                            color="secondary"
                            onClick={() => {
                              setRakeModalEnable(false)
                            }}
                          >
                            No
                          </CButton>
                        </CModalFooter>
                      </CModal>
                    {/* ============== FI-Entry Submit Confirm Button Modal Area End ================= */}
                    {/* ============== FI-Entry Submit Confirm Button Modal Area Start ================= */}
                        <CModal
                          visible={fciModalEnable}
                          backdrop="static"
                          // scrollable
                          onClose={() => {
                            setFciModalEnable(false)
                          }}
                        >
                        <CModalBody>
                          <p className="lead">Are you sure to Submit the FI Entry to SAP ?</p>
                        </CModalBody>
                        <CModalFooter>
                          <CButton
                            className="m-2"
                            color="warning"
                            onClick={() => {
                              setFciModalEnable(false)
                              fciFIUpdateSubmission()
                            }}
                          >
                            Yes
                          </CButton>
                          <CButton
                            color="secondary"
                            onClick={() => {
                              setFciModalEnable(false)
                            }}
                          >
                            No
                          </CButton>
                        </CModalFooter>
                      </CModal>
                    {/* ============== FI-Entry Submit Confirm Button Modal Area End ================= */}

                  </>
                )}
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

            {/* Web Cam Modal  */}
            <CModal
              visible={camEnable}
              backdrop="static"
              onClose={() => {
                setCamEnable(false)
                setImgSrc("")
              }}
            >
              <CModalHeader>
                <CModalTitle>FI Attachment Form</CModalTitle>
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
                      valueAppendToImage(imgSrc)
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
                  }}
                >
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>

            <CModal visible={confirmBtn} onClose={() => setConfirmBtn(false)}>
            <CModalHeader>
                <CModalTitle>Are You sure To Post {values.amounttype == '1' ? 'Income' : values.amounttype == '2' ? 'Expense' : 'Advance' } ?</CModalTitle>
            </CModalHeader>
           <CModalBody>
          <CRow className="mb-0">
            <CCol>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '50%',
                  }}
                >
                  FI Entry To
                </CInputGroupText>
                <CFormInput readOnly value={values.entry_to == '1' ? 'RJ CUSTOMER':values.entry_to == '2' ? 'FJ CUSTOMER':values.entry_to == '3' ? 'FOODS' : values.entry_to == '4' ? 'CONSUMER' : values.entry_to == '5' ? 'Driver Vendor' : values.entry_to == '6' ? 'Freight Vendor': values.entry_to == '7' ? 'Diesel Vendor':values.entry_to == '8'? 'Contract Vendor':values.entry_to == '9'? 'FASTAG': entryToFinder(values.entry_to,1)} />
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow className="mb-0">
            <CCol>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '50%',
                  }}
                >
                  FI Entry Mode
                </CInputGroupText>
                <CFormInput readOnly value={values.amounttype == '1' && values.mode_of_payment == '1' ? 'Credit(FB75)': values.amounttype == '2' && values.mode_of_payment == '1' ? 'Credit(FB60)': values.amounttype == '1' && values.mode_of_payment == '2' ? 'Debit(FB70)' : values.amounttype == '2' && values.mode_of_payment == '2'? 'Debit(FB65)' : 'Advance(FBCJ)'} />
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow className="mb-0">
            <CCol>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '50%',
                  }}
                >
                  {values.amounttype == '1'?'Customer Code':'Vendor Code'}
                </CInputGroupText>
                <CFormInput readOnly value={FIVendorName()} />
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow className="mb-0">
            <CCol>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '50%',
                  }}
                >
                  Posting Amount
                </CInputGroupText>
                <CFormInput readOnly value={values.freight_amount || sum_hire || sum_own} />
              </CInputGroup>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton className="m-2" color="secondary" onClick={() =>setConfirmBtn(false)}>
            No
          </CButton>
          <CButton color="warning" onClick={() => {
            setConfirmBtn(false)
            setFetch(false)
            createFIEntry(1)}}>
            Yes
          </CButton>
          {/* <CButton color="primary">Save changes</CButton> */}
        </CModalFooter>
      </CModal>
           </>
          ) : (<AccessDeniedComponent />)}
          </>
        )}
      </>
    )
  }
  export default FIScreen

