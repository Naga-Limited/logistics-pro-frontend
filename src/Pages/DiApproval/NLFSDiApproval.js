/* eslint-disable  */
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
  CFormTextarea,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CAlert,
  CModalFooter,
  CCardImage,
  CFormSelect,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useForm from 'src/Hooks/useForm'
import { useNavigate, useParams } from 'react-router-dom' 
import { Link } from 'react-router-dom'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import DieselIntentValidation from 'src/Utils/DieselIntent/DieselIntentValidation'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader' 
import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
import Swal from 'sweetalert2'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

import FileResizer from 'react-image-file-resizer' 
import NLFSDieselIntentService from 'src/Service/NLFS/Master/NLFSDieselIntentService'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'
import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import NLFSSAPDieselIndentService from 'src/Service/SAP/NLFSSAPDieselIndentService'
import { getCurrentDateTime } from '../Depo/CommonMethods/CommonMethods'

export const nlfs_diesel_vendor_code = process.env.REACT_APP_NLFS_DIESEL_VENDOR
export const nlfs_diesel_material_code = process.env.REACT_APP_NLFS_DIESEL_MATERIAL_CODE

const NLFSDiApproval = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DieselIntentModule.Diesel_Intent_Approval_Request
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

  const formValues = {
    vehicle_id: '',
    vehicle_division: '',
    vendor_code: '',
    diesel_to: '',
    invoice_no: '',
    invoice_copy: '',
    no_of_ltrs: '',
    rate_of_ltrs: '',
    total_amount: '',
    bunk_reading: '',
    diesel_intent_no: '',
    diesel_status: '',
    sap_fuel_rate_on_filling: '',
    remarks: '',
    diesel_vendor_name: '',
    vehicle_no: '',
    carry_vehicle:'',
    dic_remarks:'',
    dico_remarks:'',
    invoice_copy:'', 
    sap_diesel_invoice_posting_date:'', 
    vendor_tds: '',
    vendor_hsn: '',
    nlfs_sap_status: '',
  }

  const { id } = useParams()
  const [state, setState] = useState({
    page_loading: false,
  })
  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
  const [singleDIInfo, setSingleDIInfo] = useState([])
  const [dirverAssign, setDirverAssign] = useState(true)
  const [fetch, setFetch] = useState(false)
  const [vendorData, setvendorData] = useState({})
  const [validateSubmit, setValidateSubmit] = useState(true)
  const [vendor, setVendor] = useState(false)
  const [acceptBtn, setAcceptBtn] = useState(true)
  const [acceptBtn1, setAcceptBtn1] = useState(true)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [vendor_no, setVendor_no] = useState('')
  const navigation = useNavigate()
  const vehicleType = {
    OWN: 1,
    CONTRACT: 2,
    HIRE: 3,
  }
  const REQ = () => <span className="text-danger"> * </span>
  const DieselFor = ['','Vehicle','Barel','Others','Car']
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
  const formatter1 = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  function dateFormat(a) {
    let short_year = a.substring(a.lastIndexOf('-') + 1)
    let month = a.substring(a.indexOf('-') + 1, a.lastIndexOf('-'))
    let day = a.substring(0, a.indexOf('-'))
    let d = a.lastIndexOf('-')
    let year = 20 + short_year
    let new_date = year + '-' + month + '-' + day
    return new_date
  }

  const [currentDateFp, setCurrentDateFp] = useState(''); /* Freight Posting Date */
  useEffect(() => {
    // Set the current date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD'
    setCurrentDateFp(formattedDate)
    values.sap_diesel_invoice_posting_date = formattedDate 
  }, [])

  useEffect(() => {
    NLFSDieselIntentService.getNLFSDIInfoById(id).then((res) => {
     
      let view_data = res.data.data
      console.log(view_data,'getNLFSDIInfoById')
      if (res.status === 200) {
        values.vendor_code = nlfs_diesel_vendor_code
        values.diesel_vendor_name = 'NAGA LIMITED FUEL STATION' 
        values.diesel_intent_no = view_data.di_no
        values.diesel_to = view_data.diesel_to
        values.vehicle_no = view_data.vehicle_no
        values.carry_vehicle = view_data.carry_vehicle
        values.diesel_invoice_date = view_data.diesel_invoice_date
        values.invoice_no = view_data.invoice_no 
        values.rate_of_ltrs = view_data.sap_fuel_rate
        values.no_of_ltrs = view_data.fuel_quantity
        values.total_amount = view_data.total_amount
        values.sap_fuel_rate_on_filling = view_data.sap_fuel_rate_on_filling
        values.vehicle_division = view_data.division_id
        values.dic_remarks = view_data.remarks
        values.dico_remarks = view_data.confirmation_remarks
        values.invoice_copy = view_data.invoice_copy
        values.bunk_reading = view_data.bunk_reading_copy
        values.nlfs_sap_status = view_data.nlfs_sap_status
        values.vendor_tds = res.data.data != null ? res.data.data.vendor_tds : ''
        values.vendor_hsn = res.data.data != null ? res.data.data.vendor_hsn : ''
        // values.sap_diesel_invoice_posting_date=res.data.data != null ? res.data.data.sap_diesel_invoice_posting_date : currentDateFp
        setSingleDIInfo(view_data)
        setFetch(true) 
        console.log(view_data,'singleDIInfo')
      }
    })
  }, [singleDIInfo.length == 0])

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(login, DieselIntentValidation, formValues)

    function login () {
      
    }

  /* ====================Bunk Reading Web Cam Start ========================*/
  const webcamRef = React.useRef(null);
  const [fileuploaded, setFileuploaded] = useState(false)
  const [camEnable, setCamEnable] = useState(false)
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  /* ====================Bunk Reading Web Cam End ========================*/

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate();

  /* ==================== Bunk Reading ReSize Start ========================*/
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
        values.bunk_reading = file
        setFileuploaded(true)
      }
    }else{

      const image = await resizeFile(file);
      if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
        valueAppendToImage(image)
        setFileuploaded(true)
      } else {
        values.bunk_reading = file
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

    values.bunk_reading = file
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

    if(values.bunk_reading) {
      setFileuploaded(true)
    } else {
      setFileuploaded(false)
    }

  }, [values.bunk_reading])
  /* ==================== Bunk Reading Image ReSize End ========================*/

  /* ====================Invoice Copy Web Cam Start ========================*/

  const webcamRef1 = React.useRef(null);
  const [fileuploaded1, setFileuploaded1] = useState(false)
  const [camEnable1, setCamEnable1] = useState(false)
  const [imgSrc1, setImgSrc1] = React.useState(null);

  const capture1 = React.useCallback(() => {
    const imageSrc1 = webcamRef1.current.getScreenshot();
    setImgSrc1(imageSrc1);
  }, [webcamRef1, setImgSrc1]);
  /* ====================Invoice Copy Reading Web Cam End ========================*/

  /* ==================== Invoice Copy Image ReSize Start ========================*/

  const resizeFile1 = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
    uri => {
      resolve(uri);
    }, 'base64' );
  })

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

  const [sapNlldFuelDiscountRate, setSapNlldFuelDiscountRate] = useState(0) 
  useEffect(() => {
    if(singleDIInfo.division_info && singleDIInfo.division_info.add_col_one)
    VendorOutstanding.getFuelDiscountByDivisionCode(singleDIInfo.division_info.add_col_one).then((res) => {
      let driver_outstanding_data = res.data[0];
      console.log(driver_outstanding_data,'getFuelDiscountByDivisionCode data')
      if(driver_outstanding_data.STATUS == '1' && driver_outstanding_data.CUSTOMER == singleDIInfo.division_info.add_col_one)
      {
        setSapNlldFuelDiscountRate(driver_outstanding_data.AMOUNT)
      } else {
        setSapNlldFuelDiscountRate(0)
      }
    })
  }, [singleDIInfo])

  const imageCompress1 = async (event) => {
    const file = event.target.files[0];
    console.log(file)

    if(file.type == 'application/pdf') {

      if(file.size > 5000000){
        alert('File too Big, please select a file less than 5mb')
        setFileuploaded1(false)
      } else {
        values.invoice_copy = file
        setFileuploaded1(true)
      }
    }else{

      const image = await resizeFile1(file);
      if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
        valueAppendToImage1(image)
        setFileuploaded1(true)
      } else {
        values.invoice_copy = file
        setFileuploaded1(true)
      }
    }
  }

  const dataURLtoFile1 = (dataurl, filename) => {
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

  const valueAppendToImage1 = (image) => {

    let file_name = 'dummy'+getRndInteger1(100001,999999)+'.png'
    let file = dataURLtoFile1(
      image,
      file_name,
    );

    console.log(file)

    values.invoice_copy = file
  }

  const timeFormatByOwn = (input) => {
    // Convert to ISO format for JS Date
    const date = new Date(input.replace(" ", "T"));

    const formatted = date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }) 
    .replace(",", "")
    .replace(/\b(am|pm)\b/g, match => match.toUpperCase());

    console.log(formatted); 

    const finalOutput = formatted.replace(/\//g, "-");
    console.log(finalOutput);

    return finalOutput
  }

  const customValueFinder = (val) => {
    console.log(val,'customValueFinder-val')
    console.log(singleDIInfo,'customValueFinder-singleDIInfo')
    let needed_string = ''
    let temp = JSON.parse(singleDIInfo.acc_appr_info)
    console.log(temp,'temp') 
    let nol = ''
    let rpl = ''
    let amount = ''
    if(temp[0]){
      nol = temp[0].nol
      rpl = temp[0].rpl
      amount = temp[0].amount
    }  

   if(val == 1){
      needed_string = `${nol}`
    }
    if(val == 2){
      needed_string = `${rpl}`
    }
    if(val == 3){
      needed_string = `${amount}`
    }
    console.log(needed_string,'needed_string')
    return needed_string
  }

  // will hold a reference for our real input file
  let inputFile1 = '';

  // function to trigger our input file click
  const uploadClick1 = e => {
    e.preventDefault();
    inputFile1.click();
    return false;
  };

   const nlfiDIInfoFinder = (doc_type, info_type) => {
  // doc_type = [ 1 - SO, 2 - DO, 3 - Invoice, 4 - EWay Bill ]
  // info_type = [ 1 - Doc. No, 2 - Time, 3 - Remarks ]
    let child_element = ''
    let temp = JSON.parse(singleDIInfo.nlfs_di_info)
    console.log(temp,'nlfiDIInfoFinder') 
    temp.map((vk,kk)=>{
      if(vk.type == doc_type){
        child_element = vk
      }
    })
    console.log(child_element,'nlfiDIInfoFinder-child_element') 

    if(info_type == 1){
      return child_element.doc_no
    } else if(info_type == 2){
      return child_element.time
    } else if(info_type == 3){
      return child_element.remarks
    } 

    return '-'

  }

  const nlfsSAPInfoFinder = (doc_type) => {
  // doc_type = [ 1 - SO, 2 - DO, 3 - Invoice, 4 - EWay Bill ] 
    let child_element = ''
    let temp = JSON.parse(singleDIInfo.nlfs_di_info)
    console.log(temp,'nlfiDIInfoFinder') 
    temp.map((vk,kk)=>{
      if(vk.type == doc_type){
        child_element = vk
      }
    })
    console.log(child_element,'nlfiDIInfoFinder-child_element') 
    return child_element?.doc_no
  } 

  const getSOInfo = () => {
    let data = []
    let so_info= ''
    let temp = JSON.parse(singleDIInfo.nlfs_di_info)
    console.log(temp,'getSOInfo') 
    temp.map((vk,kk)=>{
      if(vk.type == 1){
        so_info = vk
      }
    })
    console.log(so_info,'getSOInfo-so_info')
    data.push(so_info)
    console.log(data,'getSOInfo-data')
    return data
  }

  const getSODOInfo = () => {
    let data = []
    let so_info= ''
    let do_info= ''
    let temp = JSON.parse(singleDIInfo.nlfs_di_info)
    console.log(temp,'getSODOInfo') 
    temp.map((vk,kk)=>{
      if(vk.type == 1){
        so_info = vk
      }
      if(vk.type == 2){
        do_info = vk
      }
    })
    console.log(so_info,'getSODOInfo-so_info')
    data.push(so_info)
    console.log(do_info,'getSODOInfo-so_info')
    data.push(do_info)
    console.log(data,'getSODOInfo-data')
    return data
  }

  const getSODOInvInfo = () => {
    let data = []
    let so_info= ''
    let do_info= ''
    let inv_info= ''
    let temp = JSON.parse(singleDIInfo.nlfs_di_info)
    console.log(temp,'getSODOInvInfo') 
    temp.map((vk,kk)=>{
      if(vk.type == 1){
        so_info = vk
      }
      if(vk.type == 2){
        do_info = vk
      }
      if(vk.type == 3){
        inv_info = vk
      }
    })
    console.log(so_info,'getSODOInvInfo-so_info')
    data.push(so_info)
    console.log(do_info,'getSODOInvInfo-do_info')
    data.push(do_info)
    console.log(inv_info,'getSODOInvInfo-inv_info')
    data.push(inv_info)
    console.log(data,'getSODOInvInfo-data')
    return data
  }

  const getRndInteger1 = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.invoice_copy) {
      setFileuploaded1(true)
    } else {
      setFileuploaded1(false)
    }

  }, [values.invoice_copy])

  /* ==================== Invoice Copy Image ReSize End ========================*/


  const [sapDieselRate, setSapDieselRate] = useState(0)
  useEffect(()=>{
   
    if(values.vehicle_division && values.sap_diesel_invoice_posting_date && values.vehicle_division != 0)
    {
      console.log(values.vehicle_division,'ifelse-if part') 
      console.log(values.vehicle_division,'sapFuelRateFinder-div')
      let div_code = singleDIInfo.division_info.add_col_one
      console.log(div_code,'sapFuelRateFinder-divcode')
      let formData = new FormData()
      formData.append('CUSTOMER', div_code) 
      formData.append('POST_DATE', values.sap_diesel_invoice_posting_date) 
      setFetch(false)
      VendorOutstanding.getNLFSDieselInfo(formData).then((res) => { 
        // let driver_outstanding_data = res.data[0];
        setFetch(true)
        let op_array = res.data[0] 
        console.log(op_array,'getNLFSDieselRate');
        if(op_array.STATUS == 1){
          setSapDieselRate(op_array.AMOUNT)
        } else {
          setSapDieselRate(0)
        }
        
        // setHireVendorOutstanding(driver_outstanding_data.L_DMBTR)
      })
      
    } else {
      console.log(values.vehicle_division,'ifelse-else part')
      setSapDieselRate(0)
    }
  
    },[values.vehicle_division, values.sap_diesel_invoice_posting_date])

  useEffect(() => {
    if (
      isTouched.invoice_no &&
      !errors.invoice_no && 
      !errors.diesel_invoice_date &&
      isTouched.diesel_invoice_date &&
      !errors.invoice_copy && 
      !errors.bunk_reading
    ) {
      setAcceptBtn(false)
    } else {
      setAcceptBtn(true)
    }
  }, [errors])

  useEffect(() => {
    if (
      !errors.no_of_ltrs1&&
      isTouched.invoice_no &&
      !errors.invoice_no &&
      // isTouched.invoice_copy &&
      !errors.invoice_copy &&
      !errors.diesel_invoice_date &&
      isTouched.diesel_invoice_date &&
      // isTouched.bunk_reading &&
      isTouched.rate_of_ltrs1 &&
      !errors.rate_of_ltrs1 &&
      !errors.bunk_reading
    ) {
      setAcceptBtn1(false)
    } else {
      setAcceptBtn1(true)
    }
  }, [errors]) 

  const submitNameAssigner = () => {
    let name = '-' 
    let vstat =  values.nlfs_sap_status 
    console.log(vstat,'submitNameAssigner-vstat')
  
    if(vstat == 1){
      name = 'DO Creation'
    } else if(vstat == 2){
      name = 'Invoice Creation'
    } else if(vstat == 3 && singleDIInfo.diesel_to == 2){
      name = 'E-Way Bill Creation'
    } else {
      console.log(singleDIInfo,'singleDIInfo-data')
      console.log(singleDIInfo,'singleDIInfo-data')
      console.log(formatter.format(singleDIInfo.fuel_quantity),'singleDIInfo-fuel_quantity1')
      console.log(formatter.format(values.no_of_ltrs),'singleDIInfo-fuel_quantity2')
      console.log(formatter.format(singleDIInfo.sap_fuel_rate_on_filling),'singleDIInfo-sap_fuel_rate_on_filling1')
      console.log(formatter.format(values.sap_fuel_rate_on_filling),'singleDIInfo-sap_fuel_rate_on_filling2')
       
      if(formatter.format(singleDIInfo.sap_fuel_rate_on_filling) != formatter.format(values.sap_fuel_rate_on_filling) || formatter.format(singleDIInfo.fuel_quantity) != formatter.format(values.no_of_ltrs))
      {
        name = 'Accounts Approval'
      } else {
        name = 'SO Creation'
      }        
    }

    return name
  }

  function NLFSDiApprovalSubmission () {

    let vstat =  values.nlfs_sap_status

    if(formatter.format(singleDIInfo.sap_fuel_rate_on_filling) != formatter.format(values.sap_fuel_rate_on_filling) || formatter.format(singleDIInfo.fuel_quantity) != formatter.format(values.no_of_ltrs)){
      NLFSAccountsApproval()
    } else if(vstat == 1){ 
      NLFSDOCreation()
    } else if(vstat == 2){ 
      NLFSInvoiceCreation()
    } else if(vstat == 3 && singleDIInfo.diesel_to == 2){ 
      NLFSEWayBillCreation()
    } else { 
      NLFSSOCreation()
    }

  }

  const netAmountFinder = (tot,type) => {
    let amount = 0
    console.log(tot,'netAmountFinder-tot')
    let discount_amount = values.no_of_ltrs * sapNlldFuelDiscountRate
    console.log(discount_amount,'netAmountFinder-discount_amount')
    amount = parseFloat(discount_amount)+parseFloat(tot)
    console.log(amount,'netAmountFinder-amount')
    // let dis_amount = Math.round(amount)
    let dis_amount = parseFloat(amount).toFixed(2)
    console.log(dis_amount,'netAmountFinder-dis_amount')
    return type == 1 ? parseFloat(discount_amount).toFixed(2) : dis_amount
  }

  function BasicValidation () {

    let temp = 0

    if(values.diesel_invoice_date == '' ){
      toast.warning('Invoice Date Required..')
      return false
    } else if(values.invoice_no == '' ){
      toast.warning('Invoice No. Required..')
      return false
    } else if(values.no_of_ltrs == 0 || values.no_of_ltrs == '' ){
      toast.warning('Fuel Filling Quantity Required..')
      return false
    } else if(values.sap_diesel_invoice_posting_date == '' ){
      toast.warning('SAP Invoice Posting Date Required..')
      return false
    } else if (sapDieselRate == 0) { 
      toast.warning('Invalid SAP Diesel Rate. Kindly contact SAP Admin..')
      return false
    } 
    // else if(values.vendor_tds == '' || values.vendor_tds == null || values.vendor_tds == 'null'){
    //   setFetch(true)
    //   toast.warning('Vendor TDS Tax Type Should be required..')
    //   return false
    // } else if(values.vendor_hsn == '' || values.vendor_hsn == null || values.vendor_hsn == 'null'){
    //   setFetch(true)
    //   toast.warning('HSN Code Should be required..')
    //   return false
    // } 
    else if (values.invoice_copy == '' || values.invoice_copy.size > 5000000){ 
      toast.warning('Attach The Signed Diesel Indent / Manual Bill Copy Less Than 5MB')
      return false
    } else if (values.bunk_reading == '' || values.bunk_reading.size > 5000000){ 
      toast.warning('Attach The Dispensary Bill Copy Less Than 5MB')
      return false
    } else {
      temp = 1
    }
    
    return temp
  }

  function NLFSAccountsApproval(){

    let valid = BasicValidation()
    if(values.sap_fuel_rate_on_filling != sapDieselRate){
      toast.warning(`Fuel Rate on Filling (${values.sap_fuel_rate_on_filling}) should be as same as SAP Rate (${sapDieselRate})...`)
      return false
    }
    if(valid == 1)
    {

      let accounts_approval_info = []
      accounts_approval_info.push({
        nol: singleDIInfo.fuel_quantity,
        rpl: singleDIInfo.sap_fuel_rate_on_filling,
        amount: singleDIInfo.total_amount,
      })

      const data = new FormData()
      console.log(values)  
      data.append('di_id', id) 
       
      data.append('fuel_quantity', values.no_of_ltrs)
      data.append('invoice_no', values.invoice_no)
      data.append('invoice_copy', values.invoice_copy)
      let tot = parseFloat(values.no_of_ltrs * values.sap_fuel_rate_on_filling).toFixed(2)
      data.append('total_amount', tot)
      data.append('bunk_reading', values.bunk_reading) 
      data.append('sap_fuel_rate', sapDieselRate)
      data.append('sap_fuel_rate_on_filling', values.sap_fuel_rate_on_filling)
      data.append('acc_appr_request_remarks', values.remarks)
      data.append('acc_appr_request_by', user_id)
      data.append('diesel_invoice_date', values.diesel_invoice_date)
      data.append('sap_diesel_invoice_posting_date',values.sap_diesel_invoice_posting_date) 
      data.append('vendor_tds', values.vendor_tds)
      data.append('vendor_hsn', values.vendor_hsn)
      data.append('acc_appr_info', JSON.stringify(accounts_approval_info))      
      
      setFetch(false)
      NLFSDieselIntentService.accountsApprovalRequest(data).then((res) => {
        setFetch(true)
        if (res.status === 200) {
          toast.success(res.data.message)
          navigation('/DiApprovalHome')
        } else if (res.status === 201) {
          toast.warning(res.data.message)
        } else {
          toast.warning('Something went wrong!')
        } 
      })
      .catch((error) => {
        setFetch(true)
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

  function NLFSSOCreation () {
  
    let valid = BasicValidation()
    if(sapDieselRate != values.sap_fuel_rate_on_filling)
    {
      toast.warning(`Rate per liter (${values.sap_fuel_rate_on_filling}) should be as same as SAP Rate (${sapDieselRate})...`)
      return false
    }
    if(valid == 1)
    {
      toast.success('NLFS SO Creation Process')

      let vehicleNumber = (values.diesel_to == 1 || values.diesel_to == 4) ? values.vehicle_no : values.carry_vehicle
      let division_code = singleDIInfo.division_info.add_col_one
      
      console.log('TRIPSHEET_NO : ',values.diesel_intent_no)
      console.log('VEHICLE_NO : ', vehicleNumber)
      console.log('QTY : ',values.no_of_ltrs)
      console.log('DIE_AMT : ',values.rate_of_ltrs)
      console.log('TOT_AMT : ',values.total_amount)
      console.log('POST_DATE : ',values.sap_diesel_invoice_posting_date) 

      let discount_amount = 0
      if(sapNlldFuelDiscountRate != 0 ){
        discount_amount = netAmountFinder(values.total_amount,2)
      } else {
        discount_amount = parseFloat(values.total_amount).toFixed(2)
      }
      console.log('discount_amount : ',discount_amount) 

      let formData = new FormData()
      formData.append('TRIPSHEET_NO',values.diesel_intent_no) 
      formData.append('VEHICLE_NO', vehicleNumber)
      formData.append('KUNNR', division_code)  
      formData.append('MATNR', nlfs_diesel_material_code)   

      formData.append('QTY', values.no_of_ltrs) 
      let tot = parseFloat(values.no_of_ltrs * values.sap_fuel_rate_on_filling).toFixed(2)
      formData.append('DIE_AMT', tot)
      formData.append('DIE_RATE', values.sap_fuel_rate_on_filling)
      
      formData.append('UOM', 'L')      
      formData.append('POST_DATE', values.sap_diesel_invoice_posting_date)
      formData.append('DIS_CHA', 'B1')
      formData.append('DOC_TYPE', singleDIInfo.diesel_to == 2 ? 1 : 2) /* 1 - Barel, 2 - Vehicle */
      // formData.append('SALE_NO', "")
      // formData.append('DEL_NO', "") 
      setFetch(false)
      NLFSSAPDieselIndentService.NLFSSOCreation(formData).then((res) => {
        setFetch(true)
        console.log(res,'NLFSSOCreation')
        let sap_status = res.data.STATUS
        let sap_so = res.data.SALE_NO
        let sap_message = res.data.MESSAGE
        if(sap_status != '1'){
          toast.warning(sap_message)
        } else {
          // toast.success(`Sale Order (${sap_so}) Created`)  
          
          const data = new FormData()
          console.log(values)
          data.append('di_id', id)
          data.append('fuel_quantity', values.no_of_ltrs)
          data.append('invoice_no', values.invoice_no)
          data.append('invoice_copy', values.invoice_copy)
          let tot = parseFloat(values.no_of_ltrs * values.sap_fuel_rate_on_filling).toFixed(2)
          // data.append('total_amount', tot)
          data.append('old_amount', tot)
          data.append('total_amount', discount_amount) 
          data.append('discount_rate', sapNlldFuelDiscountRate)
          data.append('bunk_reading_copy', values.bunk_reading) 
          data.append('sap_fuel_rate', sapDieselRate) 
          data.append('diesel_invoice_date', values.diesel_invoice_date)
          data.append('sap_diesel_invoice_posting_date',values.sap_diesel_invoice_posting_date) 
          data.append('vendor_tds', values.vendor_tds)
          data.append('vendor_hsn', values.vendor_hsn) 
          let current_time = getCurrentDateTime()
          let di_so_info = []
          di_so_info.push({
            doc_no: sap_so,
            type: 1, /* Sale Order Creation */
            user: user_id,
            time: current_time,
            remarks: values.remarks,
          })
          data.append('nlfs_di_info', JSON.stringify(di_so_info))  
          
          setFetch(false)
          NLFSDieselIntentService.NLFSSOCreation(data).then((res) => { 
            setFetch(true)
            if (res.status === 200) {
              // toast.success(res.data.message)
              // navigation('/DiApprovalHome')
              Swal.fire({
                title: 'Sale Order Created',
                icon: "success",
                text:  'SAP SO No : ' + sap_so,
                confirmButtonText: "OK",
              }).then(function () {
                // navigation('/DiApprovalHome')
                window.location.reload(false)
              })
            } else if (res.status === 201) {
              toast.warning(res.data.message)
            } else {
              toast.warning('Something went wrong!')
            } 
          })
        }
      })
    }
  }
  
  function NLFSDOCreation () {
    let valid = BasicValidation()
    
    if(valid == 1)
    {
      toast.success('NLFS DO Creation Process')

      let vehicleNumber = (values.diesel_to == 1 || values.diesel_to == 4) ? values.vehicle_no : values.carry_vehicle
      let division_code = singleDIInfo.division_info.add_col_one
      
      console.log('TRIPSHEET_NO : ',values.diesel_intent_no)
      console.log('VEHICLE_NO : ', vehicleNumber)
      console.log('QTY : ',values.no_of_ltrs)
      console.log('DIE_AMT : ',values.rate_of_ltrs)
      console.log('TOT_AMT : ',values.total_amount)
      console.log('POST_DATE : ',values.sap_diesel_invoice_posting_date) 

      let formData = new FormData()
      formData.append('TRIPSHEET_NO',values.diesel_intent_no) 
      formData.append('VEHICLE_NO', vehicleNumber)
      formData.append('KUNNR', division_code)  
      formData.append('MATNR', nlfs_diesel_material_code)

      formData.append('QTY', values.no_of_ltrs) 
      // let tot = values.no_of_ltrs * values.sap_fuel_rate_on_filling
      formData.append('DIE_AMT', singleDIInfo.total_amount)
      formData.append('DIE_RATE', values.sap_fuel_rate_on_filling)
      
      formData.append('UOM', 'L')      
      formData.append('POST_DATE', values.sap_diesel_invoice_posting_date)
      formData.append('DIS_CHA', 'B1')
      formData.append('DOC_TYPE', singleDIInfo.diesel_to == 2 ? 1 : 2) /* 1 - Barel, 2 - Vehicle */
      formData.append('SALE_NO', nlfsSAPInfoFinder(1))
      // formData.append('DEL_NO', "") 
      setFetch(false)
      NLFSSAPDieselIndentService.NLFSDOCreation(formData).then((res) => {
        setFetch(true)
        console.log(res,'NLFSDOCreation')
        let sap_status = res.data.STATUS
        let sap_so = res.data.DEL_NO
        let sap_message = res.data.MESSAGE
        if(sap_status != '1'){
          toast.warning(sap_message)
        } else {
          // toast.success(`Sale Order (${sap_so}) Created`)  
          
          const data = new FormData()
          console.log(values)
          data.append('di_id', id) 

          let current_time = getCurrentDateTime()
          let di_so_info = getSOInfo()
          di_so_info.push({
            doc_no: sap_so,
            type: 2, /* Delivery Order Creation */
            user: user_id,
            time: current_time,
            remarks: values.remarks,
          })
          data.append('nlfs_di_info', JSON.stringify(di_so_info))  
          
          setFetch(false)
          NLFSDieselIntentService.NLFSDOCreation(data).then((res) => { 
            setFetch(true)
            if (res.status === 200) {
              // toast.success(res.data.message)
              // navigation('/DiApprovalHome')
              Swal.fire({
                title: 'Delivery Order Created',
                icon: "success",
                text:  'SAP Delivery No : ' + sap_so,
                confirmButtonText: "OK",
              }).then(function () {
                // navigation('/DiApprovalHome')
                window.location.reload(false)
              })
            } else if (res.status === 201) {
              toast.warning(res.data.message)
            } else {
              toast.warning('Something went wrong!')
            } 
          })
        }
      })
    }
  }

  function NLFSInvoiceCreation () {
    let valid = BasicValidation()
    
    if(valid == 1)
    {
      toast.success('NLFS Invoice Creation Process')

      let vehicleNumber = (values.diesel_to == 1 || values.diesel_to == 4) ? values.vehicle_no : values.carry_vehicle
      let division_code = singleDIInfo.division_info.add_col_one
      
      console.log('TRIPSHEET_NO : ',values.diesel_intent_no)
      console.log('VEHICLE_NO : ', vehicleNumber)
      console.log('QTY : ',values.no_of_ltrs)
      console.log('DIE_AMT : ',values.rate_of_ltrs)
      console.log('TOT_AMT : ',values.total_amount)
      console.log('POST_DATE : ',values.sap_diesel_invoice_posting_date) 

      let formData = new FormData()
      formData.append('TRIPSHEET_NO',values.diesel_intent_no) 
      formData.append('VEHICLE_NO', vehicleNumber)
      formData.append('KUNNR', division_code)  
      formData.append('MATNR', nlfs_diesel_material_code)

      formData.append('QTY', values.no_of_ltrs) 
      // let tot = values.no_of_ltrs * values.sap_fuel_rate_on_filling
      formData.append('DIE_AMT', singleDIInfo.total_amount)
      formData.append('DIE_RATE', values.sap_fuel_rate_on_filling)
      
      formData.append('UOM', 'L')      
      formData.append('POST_DATE', values.sap_diesel_invoice_posting_date)
      formData.append('DIS_CHA', 'B1')
      formData.append('DOC_TYPE', singleDIInfo.diesel_to == 2 ? 1 : 2) /* 1 - Barel, 2 - Vehicle */
      formData.append('SALE_NO', nlfsSAPInfoFinder(1))
      formData.append('DEL_NO', nlfsSAPInfoFinder(2)) 
      setFetch(false)
      NLFSSAPDieselIndentService.NLFSInvoiceCreation(formData).then((res) => {
        setFetch(true)
        console.log(res,'NLFSInvoiceCreation')
        let sap_status = res.data.STATUS
        let sap_so = res.data.INV_NO
        let sap_message = res.data.MESSAGE
        if(sap_status != '1'){
          toast.warning(sap_message)
        } else {
          // toast.success(`Sale Order (${sap_so}) Created`)  
          
          const data = new FormData()
          console.log(values)
          data.append('di_id', id) 

          let current_time = getCurrentDateTime()
          let di_so_info = getSODOInfo()
          di_so_info.push({
            doc_no: sap_so,
            type: 3, /* Invoice Creation */
            user: user_id,
            time: current_time,
            remarks: values.remarks,
          })
          data.append('nlfs_di_info', JSON.stringify(di_so_info))   
          
          setFetch(false)
          NLFSDieselIntentService.NLFSInvoiceCreation(data).then((res) => { 
            setFetch(true)
            if (res.status === 200) {
              // toast.success(res.data.message)
              // navigation('/DiApprovalHome')
              Swal.fire({
                title: 'Invoice Created',
                icon: "success",
                text:  'SAP Invoice No : ' + sap_so,
                confirmButtonText: "OK",
              }).then(function () {

                if((singleDIInfo.nlfs_sap_status == 2 && (singleDIInfo.diesel_to == 1 || singleDIInfo.diesel_to == 4)) || (singleDIInfo.nlfs_sap_status == 3 && singleDIInfo.diesel_to == 2)){
                  navigation('/DiApprovalHome')
                } else {
                  window.location.reload(false)
                }                
                
              })
            } else if (res.status === 201) {
              toast.warning(res.data.message)
            } else {
              toast.warning('Something went wrong!')
            } 
          })
        }
      })
    }
  }

  function NLFSEWayBillCreation () {
    let valid = BasicValidation()
    
    if(valid == 1)
    {
      toast.success('NLFS Eway Bill Creation Process')

      let vehicleNumber = (values.diesel_to == 1 || values.diesel_to == 4) ? values.vehicle_no : values.carry_vehicle
      let division_code = singleDIInfo.division_info.add_col_one 
       
      console.log('TRUCK_NO : ', vehicleNumber)
      console.log('INVOICE : ', nlfsSAPInfoFinder(3))

      let formData = new FormData() 
      formData.append('VEHICLE_NO', vehicleNumber) 
      formData.append('INVOICE', nlfsSAPInfoFinder(3)) 
      setFetch(false)
      NLFSSAPDieselIndentService.NLFSEWayBillCreation(formData).then((res) => {
        setFetch(true) 
        console.log(res,'NLFSEWayBillCreation')
        // return false
        let sap_status = res.data.STATUS
        let sap_so = res.data.EWAYBILL 
        let sap_message = res.data.MSG
        console.log(sap_status,'NLFSEWayBillCreation-sap_status')
        console.log(sap_so,'NLFSEWayBillCreation-sap_so') 
        console.log(sap_message,'NLFSEWayBillCreation-sap_message')
        if(sap_status != 1){
          console.log('1111')
          toast.warning(sap_message)
        } else {
          // toast.success(`Sale Order (${sap_so}) Created`)  
          console.log('2222')
          const data = new FormData()
          console.log(values)
          data.append('di_id', id) 

          let current_time = getCurrentDateTime()
          let di_so_info = getSODOInvInfo()
          di_so_info.push({
            doc_no: sap_so,
            type: 4, /* E Way Bill Creation */
            user: user_id,
            time: current_time, 
            remarks: values.remarks,
          })
          data.append('nlfs_di_info', JSON.stringify(di_so_info))   
          setFetch(false)
          NLFSDieselIntentService.NLFSEWayBillCreation(data).then((res) => { 
            setFetch(true)
            if (res.status === 200) {
              // toast.success(res.data.message)
              // navigation('/DiApprovalHome')
              Swal.fire({
                title: 'E Way Bill Created',
                icon: "success",
                text:  'SAP E Way Bill No : ' + sap_so,
                confirmButtonText: "OK",
              }).then(function () {
                navigation('/DiApprovalHome')
                // window.location.reload(false)
              })
            } else if (res.status === 201) {
              toast.warning(res.data.message)
            } else {
              toast.warning('Something went wrong!')
            } 
          })
        }
      })
    }
  }
  

  const [OdometerPhoto1, setOdometerPhoto1] = useState(false)
  const [OdometerPhoto2, setOdometerPhoto2] = useState(false)

  useEffect(() => {
  
    if(values.invoice_copy) {
      setFileuploaded1(true)
    } else {
      setFileuploaded1(false)
    }
  
  }, [values.invoice_copy])

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
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vNum">Diesel To</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="vNum"
                          value={DieselFor[values.diesel_to]}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vNum">{(values.diesel_to == 1 || values.diesel_to == 4) ? 'Vehicle Number & Division' : 'Carry Vehicle Number & Division'}</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="vNum"
                          value={(values.diesel_to == 1 || values.diesel_to == 4) ? `${values.vehicle_no} (${singleDIInfo ? singleDIInfo.vehicle_info.vehicle_division_info.short_name : '-'})` : `${values.carry_vehicle} (${singleDIInfo ? singleDIInfo.division_info.short_name : '-'})`}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="tripsheet_id">Diesel Indent Number</CFormLabel>
                        <CFormInput
                          size="sm" 
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          value={values.diesel_intent_no} 
                          type="text"
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="diesel_vendor_name">Vendor Name & Code</CFormLabel>
                        <CFormInput
                          size="sm" 
                          id="diesel_vendor_name"
                          value={`${values.diesel_vendor_name} (${values.vendor_code})`}
                          readOnly
                        />
                      </CCol>
                      
                      {singleDIInfo.nlfs_sap_status == null ? (
                        <>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="diesel_invoice_date">
                              Invoice Date <REQ />{' '}
                              {errors.diesel_invoice_date && (
                                <span className="small text-danger">{errors.diesel_invoice_date}</span>
                              )}
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="date"
                              name="diesel_invoice_date"
                              id="diesel_invoice_date"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              value={values.diesel_invoice_date}
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="invoice_no">
                              Invoice Number <REQ />{' '}
                              {errors.invoice_no && (
                                <span className="help text-danger">{errors.invoice_no}</span>
                              )}
                            </CFormLabel>
                            <CFormInput
                              name="invoice_no"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              className={`${errors.invoice_no && 'is-invalid'}`}
                              size="sm"
                              id="invoice_no"
                              value={values.invoice_no}
                              maxLength={15}
                            />
                          </CCol>                      
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="invoice_copy">Signed Diesel Indent / Manual Bill</CFormLabel>
                          
                            <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                
                                {!fileuploaded1 ? (
                                    <>
                                      <span className="float-start" onClick={uploadClick1}>
                                        <CIcon
                                          style={{color:'red'}}
                                          icon={icon.cilFolderOpen}
                                          size="lg"
                                        />
                                        &nbsp;Upload
                                      </span>
                                      
                                    </>
                                  ) : (
                                    <>
                                      <span className="float-start">
                                        &nbsp;{values.invoice_copy.name}
                                      </span>
                                      {values.invoice_copy.name == undefined &&
                                      <span className="float-start">
                                      <i
                                        className="fa fa-eye"
                                        onClick={() => setOdometerPhoto1(true)}
                                        aria-hidden="true"
                                      ></i>{' '}
                                      &nbsp;View
                                      </span>}
                                      <span className="float-end">
                                        <i
                                          className="fa fa-trash"
                                          aria-hidden="true"
                                          onClick={() => {
                                            setFileuploaded1(false)
                                            values.invoice_copy == ''
                                          }}
                                        ></i>
                                      </span>
                                    </>
                                  )}
                            </CButton>
                            <CFormInput
                              onBlur={onBlur}
                              onChange={(e)=>{imageCompress1(e)}}
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              name="invoice_copy"
                              size="sm"
                              id="invoice_copy"
                              onFocus={onFocus}
                              className={`${errors.invoice_copy && 'is-invalid'}`}
                              style={{display:'none'}}
                              ref={input1 => {
                                // assigns a reference so we can trigger it later
                                inputFile1 = input1;
                              }}
                            />
                          </CCol>                        
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="sap_fuel_rate_on_filling">
                              Fuel Rate on Filling
                              {errors.sap_fuel_rate_on_filling && (
                                <span className="help text-danger">{errors.sap_fuel_rate_on_filling}</span>
                              )}
                            </CFormLabel>
                            <CFormInput
                              name="sap_fuel_rate_on_filling"                          
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              value={values.sap_fuel_rate_on_filling}
                              size="sm"
                              id="sap_fuel_rate_on_filling"
                              maxLength={6}
                              // readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="no_of_ltrs1">
                              No. Of Liters <REQ />{' '}
                              {errors.no_of_ltrs && (
                                <span className="help text-danger">{errors.no_of_ltrs}</span>
                              )}
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              name="no_of_ltrs"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              id="no_of_ltrs"
                              // value={(formatter.format(values.no_of_ltrs))}
                              value={values.no_of_ltrs}
                              maxLength={7}
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="total_amount1">
                              Total Amount
                            </CFormLabel>
                            <CFormInput
                              name="total_amount1"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              size="sm"
                              value={values.sap_fuel_rate_on_filling != 0 ? parseFloat(values.no_of_ltrs * values.sap_fuel_rate_on_filling).toFixed(2) : 0}
                              id="total_amount1"
                              maxLength={6}
                              readOnly
                            />
                          </CCol>         
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="sap_diesel_invoice_posting_date">
                              Posting Date
                              {errors.sap_diesel_invoice_posting_date && (
                                <span className="small text-danger">{errors.sap_diesel_invoice_posting_date}</span>
                              )}
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="date"
                              name="sap_diesel_invoice_posting_date"
                              id="sap_diesel_invoice_posting_date"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              value={values.sap_diesel_invoice_posting_date}
                              // max={new Date().toISOString().split("T")[0]}
                              // min={datevalidation()}
                              min={Expense_Income_Posting_Date.min_date}
                              max={Expense_Income_Posting_Date.max_date}
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                            />
                          </CCol> 
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="diesel_vendor_name">SAP Diesel Rate</CFormLabel>
                            <CFormInput
                              size="sm"                  
                              id="diesel_vendor_name"
                              value={values.sap_diesel_invoice_posting_date ? sapDieselRate : 0}
                              readOnly
                            />
                          </CCol> 
                          {sapNlldFuelDiscountRate != 0 && (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vendor_code">{`${singleDIInfo ? singleDIInfo.division_info.short_name : '-'} Discount Rate Per Litre`}</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  name="vendor_code" 
                                  id="vendor_code"
                                  value={sapNlldFuelDiscountRate}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="total_amount">
                                  Discount Amount
                                </CFormLabel>
                                <CFormInput
                                  name="total_amount"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  // onChange={handleChange}
                                  size="sm"
                                  value={netAmountFinder(values.total_amount,1)}
                                  id="total_amount"
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="total_amount">
                                  Net Diesel Amount
                                </CFormLabel>
                                <CFormInput
                                  name="total_amount"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  // onChange={handleChange}
                                  size="sm"
                                  value={netAmountFinder(values.total_amount,2)}
                                  id="total_amount"
                                  readOnly
                                />
                              </CCol>
                            </>
                          )}
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="bunk_reading">Dispensary Bill</CFormLabel>
                          
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
                                  </>
                                ) : (
                                  <>
                                    <span className="float-start">
                                      &nbsp;{values.bunk_reading.name}
                                    </span>
                                    {values.bunk_reading.name == undefined &&
                                    <span className="float-start">
                                    <i
                                        className="fa fa-eye"
                                        onClick={() => setOdometerPhoto2(true)}
                                        aria-hidden="true"
                                      ></i>{' '}
                                      &nbsp;View
                                    </span>
                                    }
                                    <span className="float-end">
                                      <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                        onClick={() => {
                                          setFileuploaded(false)
                                          values.bunk_reading == ''
                                        }}
                                      ></i>
                                    </span>
                                  </>
                                )}
                            </CButton>
                            <CFormInput
                              onBlur={onBlur}
                              onChange={(e)=>{imageCompress(e)}}
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              name="bunk_reading"
                              size="sm"
                              id="bunk_reading"
                              style={{display:'none'}}
                              ref={input => {
                                // assigns a reference so we can trigger it later
                                inputFile = input;
                              }}
                            />
                          
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dic_remarks">
                              DI Creation Remarks                         
                            </CFormLabel>
                            <CFormInput
                              name="dic_remarks"                           
                              size="sm"
                              value={values.dic_remarks || '-'} 
                              id="dic_remarks" 
                              readOnly
                            />
                          </CCol>  
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dico_remarks">
                              DI Confirmation Remarks                         
                            </CFormLabel>
                            <CFormInput
                              name="dico_remarks"                           
                              size="sm"
                              value={values.dico_remarks} 
                              id="dico_remarks" 
                              readOnly
                            />
                          </CCol>  
                          {/* <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vendor_tds">
                              TDS Tax Type <REQ />{' '}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              name="vendor_tds"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              value={values.vendor_tds}
                              className={`${errors.vendor_tds && 'is-invalid'}`}
                              aria-label="Small select example"
                            >
                              <option value="">Select</option>
                              <option value="0">No Tax</option>
                
                              {tdsMasterData.map(({ definition_list_code, definition_list_name }) => {
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
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vendor_hsn">
                              HSN Code <REQ />{' '}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              name="vendor_hsn"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              value={values.vendor_hsn}
                              className={`${errors.vendor_hsn && 'is-invalid'}`}
                              aria-label="Small select example"
                            >
                              <option value="">Select</option>
                
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
                          </CCol>  */}
                        </>
                      ) : (
                        <>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="diesel_invoice_date">
                              Invoice Date  
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="date"
                              readOnly
                              value={values.diesel_invoice_date}
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="invoice_no">
                              Invoice Number 
                            </CFormLabel>
                            <CFormInput
                              readOnly
                              size="sm"
                              id="invoice_no"
                              value={values.invoice_no}
                              maxLength={15}
                            />
                          </CCol>                      
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="invoice_copy">Signed Diesel Indent / Manual Bill</CFormLabel>                          
                            <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                              <>
                                <span className="float-start">
                                  &nbsp;{values.invoice_copy.name}
                                </span>
                                {values.invoice_copy.name == undefined &&
                                <span className="float-start">
                                <i
                                  className="fa fa-eye"
                                  onClick={() => setOdometerPhoto1(true)}
                                  aria-hidden="true"
                                ></i>{' '}
                                &nbsp;View
                                </span>}                                      
                              </>
                            </CButton>
                            <CFormInput
                              onBlur={onBlur}
                              onChange={(e)=>{imageCompress1(e)}}
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              name="invoice_copy"
                              size="sm"
                              id="invoice_copy"
                              onFocus={onFocus}
                              className={`${errors.invoice_copy && 'is-invalid'}`}
                              style={{display:'none'}}
                              ref={input1 => {
                                // assigns a reference so we can trigger it later
                                inputFile1 = input1;
                              }}
                            />
                          </CCol>                        
                          {/* <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="sap_fuel_rate_on_filling">
                              Fuel Rate on Filling 
                            </CFormLabel>
                            <CFormInput                              
                              value={values.sap_fuel_rate_on_filling}
                              size="sm"
                              id="sap_fuel_rate_on_filling"
                              maxLength={6}
                              readOnly
                            />
                          </CCol> */}
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="no_of_ltrs1">
                              No. Of Liters  
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              readOnly
                              id="no_of_ltrs" 
                              value={values.no_of_ltrs}
                              maxLength={7}
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="total_amount1">
                              Total Amount
                            </CFormLabel>
                            <CFormInput                              
                              size="sm"
                              value={values.sap_fuel_rate_on_filling != 0 ? values.no_of_ltrs * values.sap_fuel_rate_on_filling : 0}
                              id="total_amount1"
                              maxLength={6}
                              readOnly
                            />
                          </CCol>         
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="sap_diesel_invoice_posting_date">
                              Posting Date 
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="date"
                              readOnly
                              value={values.sap_diesel_invoice_posting_date}
                              // max={new Date().toISOString().split("T")[0]}
                              // min={datevalidation()}
                              min={Expense_Income_Posting_Date.min_date}
                              max={Expense_Income_Posting_Date.max_date} 
                            />
                          </CCol> 
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="diesel_vendor_name">SAP Diesel Rate</CFormLabel>
                            <CFormInput
                              size="sm"                  
                              id="diesel_vendor_name"
                              value={values.sap_diesel_invoice_posting_date ? sapDieselRate : 0}
                              readOnly
                            />
                          </CCol> 
                          {sapNlldFuelDiscountRate != 0 && (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vendor_code">{`${singleDIInfo ? singleDIInfo.division_info.short_name : '-'} Discount Rate Per Litre`}</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  name="vendor_code" 
                                  id="vendor_code"
                                  value={singleDIInfo.discount_rate}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="total_amount">
                                  Discount Amount
                                </CFormLabel>
                                <CFormInput
                                  name="total_amount"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  // onChange={handleChange}
                                  size="sm"
                                  value={singleDIInfo.old_amount - singleDIInfo.total_amount}
                                  id="total_amount"
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="total_amount">
                                  Net Diesel Amount
                                </CFormLabel>
                                <CFormInput
                                  name="total_amount"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  // onChange={handleChange}
                                  size="sm"
                                  value={singleDIInfo.total_amount}
                                  id="total_amount"
                                  readOnly
                                />
                              </CCol>
                            </>
                          )}
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="bunk_reading">Dispensary Bill</CFormLabel>
                          
                            <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                               <>
                                  <span className="float-start">
                                    &nbsp;{values.bunk_reading.name}
                                  </span>
                                  {values.bunk_reading.name == undefined &&
                                  <span className="float-start">
                                  <i
                                      className="fa fa-eye"
                                      onClick={() => setOdometerPhoto2(true)}
                                      aria-hidden="true"
                                    ></i>{' '}
                                    &nbsp;View
                                  </span>
                                  }                                    
                                </>
                            </CButton>  
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dic_remarks">
                              DI Creation Remarks                         
                            </CFormLabel>
                            <CFormInput                         
                              size="sm"
                              value={values.dic_remarks || '-'} 
                              id="dic_remarks" 
                              readOnly
                            />
                          </CCol>  
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dico_remarks">
                              DI Confirmation Remarks                         
                            </CFormLabel>
                            <CFormInput                           
                              size="sm"
                              value={values.dico_remarks} 
                              id="dico_remarks" 
                              readOnly
                            />
                          </CCol>  
                          {/* <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vendor_tds">
                              TDS Tax Type  
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              disabled
                              value={values.vendor_tds} 
                              aria-label="Small select example"
                            >
                              <option value="">Select</option>
                              <option value="0">No Tax</option>
                
                              {tdsMasterData.map(({ definition_list_code, definition_list_name }) => {
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
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vendor_hsn">
                              HSN Code  
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              disabled
                              value={values.vendor_hsn} 
                              aria-label="Small select example"
                            >
                              <option value="">Select</option>
                
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
                          </CCol>  */}
                        </>
                      )}
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                        <CFormTextarea
                          id="remarks"
                          name="remarks"
                          onChange={handleChange}
                          value={values.remarks}
                          rows="1"
                        ></CFormTextarea>
                      </CCol>
                      {((singleDIInfo.acc_appr_status == 2 || singleDIInfo.acc_appr_status == 3) && singleDIInfo.nlfs_sap_status == null) && 
                        <CRow>
                          {/*Previous Diesel Information*/}
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                                marginTop:"8%"
                              }}
                            > 
                              {`Acc. Approval Process Type : ${singleVehicleInfo.acc_appr_status == 2 ? 'Approved ✔️' : 'Rejected ❌' }`}
                            </CFormLabel>
                          </CCol> 
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: 'greenyellow',
                                color: 'black',
                                marginTop:"8%"
                              }}
                            >
                              {`__ Previous Information : __`}
                            </CFormLabel>
                          </CCol>        
                          <CCol xs={12} md={3}></CCol>
                          <CCol xs={12} md={3}></CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="prev_di_nol">
                              No. Of Liters
                            </CFormLabel>
                            <CFormInput size="sm" 
                            readOnly
                            id="prev_di_nol"
                            value={`${customValueFinder(1)}`}
                            maxLength={7}
                            />
                          </CCol> 
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="prev_di_nol">
                              Rate Per Liter 
                            </CFormLabel>
                            <CFormInput size="sm" 
                            readOnly
                            id="prev_di_nol"
                            value={`${customValueFinder(2)}`}
                            maxLength={7}
                            />
                          </CCol> 
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="prev_di_amount">
                              Amount
                            </CFormLabel>
                            <CFormInput 
                              size="sm"
                              value={`${customValueFinder(3)}`}
                              id="prev_di_amount"
                              readOnly
                            />
                          </CCol> 
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="prev_di_amount">
                              Accounts Approval Submission Remarks
                            </CFormLabel>
                            <CFormInput 
                              size="sm"
                              value={singleDIInfo.acc_appr_done_remarks} 
                              id="prev_di_amount"
                              readOnly
                            />
                          </CCol> 
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="prev_di_amount">
                              Accounts Approval Submission Time
                            </CFormLabel>
                            <CFormInput 
                              size="sm"
                              value={timeFormatByOwn(singleDIInfo.acc_appr_done_at)} 
                              id="prev_di_amount"
                              readOnly
                            />
                          </CCol> 
                        </CRow>
                      }
                      {singleDIInfo.nlfs_sap_status >= 1 && 
                        (
                          <CRow>
                            <CCol xs={12} md={3}>
                              <CFormLabel
                                htmlFor="inputAddress"
                                style={{
                                  backgroundColor: 'greenyellow',
                                  color: 'black',
                                  marginTop:"8%"
                                }}
                              >
                                {`__ Sale Order Information : __`}
                              </CFormLabel>
                            </CCol> 
                        
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="prev_di_amount">
                                Sale Order Number
                              </CFormLabel>
                              <CFormInput 
                                size="sm"
                                value={nlfiDIInfoFinder(1,1)} 
                                id="prev_di_amount"
                                readOnly
                              />
                            </CCol> 
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="prev_di_amount">
                                Sale Order Creation Time
                              </CFormLabel>
                              <CFormInput 
                                size="sm"
                                value={nlfiDIInfoFinder(1,2)} 
                                id="prev_di_amount"
                                readOnly
                              />
                            </CCol> 
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="prev_di_amount">
                                Sale Order Creation Remarks
                              </CFormLabel>
                              <CFormInput 
                                size="sm"
                                value={nlfiDIInfoFinder(1,3)} 
                                id="prev_di_amount"
                                readOnly
                              />
                            </CCol> 
                          </CRow>
                        )
                      }
                      {singleDIInfo.nlfs_sap_status >= 2 && 
                        (
                          <CRow>
                            <CCol xs={12} md={3}>
                              <CFormLabel
                                htmlFor="inputAddress"
                                style={{
                                  backgroundColor: 'greenyellow',
                                  color: 'black',
                                  marginTop:"8%"
                                }}
                              >
                                {`__ Delivery Order Information : __`}
                              </CFormLabel>
                            </CCol> 
                        
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="prev_di_amount">
                                Delivery Order Number
                              </CFormLabel>
                              <CFormInput 
                                size="sm"
                                value={nlfiDIInfoFinder(2,1)} 
                                id="prev_di_amount"
                                readOnly
                              />
                            </CCol> 
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="prev_di_amount">
                                Delivery Order Creation Time
                              </CFormLabel>
                              <CFormInput 
                                size="sm"
                                value={nlfiDIInfoFinder(2,2)} 
                                id="prev_di_amount"
                                readOnly
                              />
                            </CCol> 
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="prev_di_amount">
                                Delivery Order Creation Remarks
                              </CFormLabel>
                              <CFormInput 
                                size="sm"
                                value={nlfiDIInfoFinder(2,3)} 
                                id="prev_di_amount"
                                readOnly
                              />
                            </CCol> 
                          </CRow>
                        )
                      }
                      {singleDIInfo.nlfs_sap_status >= 3 && 
                        (
                          <CRow>
                            <CCol xs={12} md={3}>
                              <CFormLabel
                                htmlFor="inputAddress"
                                style={{
                                  backgroundColor: 'greenyellow',
                                  color: 'black',
                                  marginTop:"8%"
                                }}
                              >
                                {`__ Invoice Information : __`}
                              </CFormLabel>
                            </CCol> 
                        
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="prev_di_amount">
                                Invoice Number
                              </CFormLabel>
                              <CFormInput 
                                size="sm"
                                value={nlfiDIInfoFinder(3,1)} 
                                id="prev_di_amount"
                                readOnly
                              />
                            </CCol> 
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="prev_di_amount">
                                Invoice Creation Time
                              </CFormLabel>
                              <CFormInput 
                                size="sm"
                                value={nlfiDIInfoFinder(3,2)} 
                                id="prev_di_amount"
                                readOnly
                              />
                            </CCol> 
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="prev_di_amount">
                                Invoice Creation Remarks
                              </CFormLabel>
                              <CFormInput 
                                size="sm"
                                value={nlfiDIInfoFinder(3,3)} 
                                id="prev_di_amount"
                                readOnly
                              />
                            </CCol> 
                          </CRow>
                        )
                      }
                      {singleDIInfo.nlfs_sap_status >= 4 && 
                        (
                          <CRow>
                            <CCol xs={12} md={3}>
                              <CFormLabel
                                htmlFor="inputAddress"
                                style={{
                                  backgroundColor: 'greenyellow',
                                  color: 'black',
                                  marginTop:"8%"
                                }}
                              >
                                {`__ EWay Bill Information : __`}
                              </CFormLabel>
                            </CCol> 
                        
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="prev_di_amount">
                                EWay Bill Number
                              </CFormLabel>
                              <CFormInput 
                                size="sm"
                                value={nlfiDIInfoFinder(4,1)} 
                                id="prev_di_amount"
                                readOnly
                              />
                            </CCol> 
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="prev_di_amount">
                                EWay Bill Creation Time
                              </CFormLabel>
                              <CFormInput 
                                size="sm"
                                value={nlfiDIInfoFinder(4,2)} 
                                id="prev_di_amount"
                                readOnly
                              />
                            </CCol> 
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="prev_di_amount">
                                EWay Bill Creation Remarks
                              </CFormLabel>
                              <CFormInput 
                                size="sm"
                                value={nlfiDIInfoFinder(4,3)} 
                                id="prev_di_amount"
                                readOnly
                              />
                            </CCol> 
                          </CRow>
                        )
                      }
                    </CRow>
                    <CRow className="mt-md-3">
                      <CCol className="" xs={12} sm={12} md={3}>
                        <CButton size="sm" color="primary" className="text-white" type="button">
                          <Link className="text-white" to="/DiApprovalHome">
                            Previous
                          </Link>
                        </CButton>
                      </CCol>
                      <CCol
                        className="offset-md-6"
                        xs={12}
                        sm={12}
                        md={3}
                        style={{ display: 'flex', justifyContent: 'end' }}
                      >
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-3 px-3 text-white"
                          // type="button"
                          // disabled={acceptBtn}
                          onClick={() => { 
                            NLFSDiApprovalSubmission()
                          }} 
                        >
                          {submitNameAssigner()}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CTabPane>
              </CTabContent>
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
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

      <CModal visible={OdometerPhoto1} onClose={() => setOdometerPhoto1(false)}>
        <CModalHeader>
          <CModalTitle>Signed Diesel Indent / Manual Bill Photo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {singleDIInfo.invoice_copy && !singleDIInfo.invoice_copy.includes('.pdf') ? (
            <CCardImage orientation="top" src={singleDIInfo.invoice_copy} />
            ) : (
            <iframe
              orientation="top"
              height={500}
              width={475}
              src={singleDIInfo.invoice_copy}
            ></iframe>
          )}
        </CModalBody> 
        <CModalFooter>
          <CButton color="secondary" onClick={() => setOdometerPhoto1(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal visible={OdometerPhoto2} onClose={() => setOdometerPhoto2(false)}>
        <CModalHeader>
          <CModalTitle>Dispensary Bill</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {singleDIInfo.bunk_reading_copy && !singleDIInfo.bunk_reading_copy.includes('.pdf') ? (
            <CCardImage orientation="top" src={singleDIInfo.bunk_reading_copy} />
          ):(
            <iframe
              orientation="top"
              height={500}
              width={475}
              src={singleDIInfo.bunk_reading_copy}
            ></iframe>
          )}
        </CModalBody> 
        <CModalFooter>
          <CButton color="secondary" onClick={() => setOdometerPhoto2(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/*Camera Image Copy model*/}
      <CModal
        visible={camEnable}
        backdrop="static"
        onClose={() => {
          setCamEnable(false)
          setImgSrc("")
        }}
      >
        <CModalHeader>
          <CModalTitle>Dispensary Bill Photo</CModalTitle>
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

      <CModal
        visible={camEnable1}
        backdrop="static"
        onClose={() => {
          setCamEnable1(false)
          setImgSrc1("")
        }}
      >
        <CModalHeader>
          <CModalTitle>Signed Diesel Indent / Manual Bill Photo</CModalTitle>
        </CModalHeader>
        <CModalBody>

          {!imgSrc1 && (
            <>
              <Webcam
                audio={false}
                ref={webcamRef1}
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
                    capture1()
                  }}
                >
                  Accept
                </CButton>
              </p>
            </>
          )}
          {imgSrc1 && (

            <>
              <img height={200}
                src={imgSrc1}
              />
              <p className='mt-2'>
                <CButton
                  size="sm"
                  color="warning"
                  className="mx-1 px-2 text-white"
                  type="button"
                  onClick={() => {
                    setImgSrc1("")
                  }}
                >
                  Delete
                </CButton>
              </p>
            </>
          )}

        </CModalBody>
        <CModalFooter>
          {imgSrc1 && (
            <CButton
              className="m-2"
              color="warning"
              onClick={() => {
                setCamEnable1(false)
                valueAppendToImage1(imgSrc1)
              }}
            >
              Confirm
            </CButton>
          )}
          <CButton
            color="secondary"
            onClick={() => {
              setCamEnable1(false)
              setImgSrc1("")
            }}
          >
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      {/*Camera Image Copy model*/}

    </>
  )
}

export default NLFSDiApproval
