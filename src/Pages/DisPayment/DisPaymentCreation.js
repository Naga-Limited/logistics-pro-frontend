/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCardImage,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import Loader from 'src/components/Loader'

import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService';
import useFormDepoExpenseClosure from 'src/Hooks/useFormDepoExpenseClosure';
import LocationApi from 'src/Service/SubMaster/LocationApi';
import Swal from 'sweetalert2';
import CustomTable from 'src/components/customComponent/CustomTable';
import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from '../Depo/CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'; 
import NLFSDieselIntentService from 'src/Service/NLFS/Master/NLFSDieselIntentService'
import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import TripSheetClosureSapService from 'src/Service/SAP/TripSheetClosureSapService'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'

export const nlfs_diesel_vendor_code = process.env.REACT_APP_NLFS_DIESEL_VENDOR

const DisPaymentCreation = () => {
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

  const [reference, setReference] = useState('')
  const [invoiceCopy, setInvoiceCopy] = useState('')
  const [tdsHaving, setTdsHaving] = useState(0)
  const [tdsValue, setTdsValue] = useState('')
  const [hsnValue, setHsnValue] = useState('')
  const REQ = () => <span className="text-danger"> * </span>

  const handleChangeInvoiceCopy = (event) => {
    let valll = event.target.files[0]
    setInvoiceCopy(valll)
  }

  const handleChangeReference = (event) => {
    let val = event.target.value.toUpperCase()
    console.log('Reference', val)
    setReference(val)
  }

  const handleChangeTdsHaving = (event) => {
    let val = event.target.value
    if(val == 1)
      setTdsHaving(1)
    else 
      setTdsHaving(0)
  }

  const handleChangeTdsValue = (event) => {
    let val = event.target.value
    setTdsValue(val)
  }

  const handleChangeHsnValue = (event) => {
    let val = event.target.value
    setHsnValue(val)
  }

  const exportToCSV = () => {
    if(rowData.length == 0){
      toast.warning('No Data Found..!')
      return false
    }
    // console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='NLFS_Payment_Diesel_Info_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  const { id } = useParams()
  const [rowData, setRowData] = useState([])
  const [locationData, setLocationData] = useState([])

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.NLFSDieselIntentModule.DIS_Payment

  /* Vehicle Current Position */
  const VEHICLE_CURRENT_POSITION = {
    DEPO_SHIPMENT_COMPLETED: 22,
    DEPO_EXPENSE_APPROVAL: 27,
    DEPO_SETTLEMENT_CLOSURE: 28
  }

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
    halt_days: '',
    remarks: '',
    apremarks: ''
  }

  const border = {
    borderColor: '#b1b7c1',
  }

  /* Overall Journey Information Constants */
  const [pmData, setPMData] = useState([])

  const [tripPaymentDelete, setTripPaymentDelete] = useState(false)
  const [tripPaymentAllDelete, setTripPaymentAllDelete] = useState(false)
  const [tripIdToDelete, setTripIdToDelete] = useState('')
  const [tripNoToDelete, setTripNoToDelete] = useState('')
  const [paymentAmountToDelete, setPaymentAmountToDelete] = useState(0)
  const [shipmentIdToDelete, setShipmentIdToDelete] = useState('')

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

  useEffect(() => {
    LocationApi.getLocation().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'viewData')
      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          Location: data.location,
          location_code: data.id,
        })
      })
      setLocationData(rowDataList_location)
    })

  },[id])

  const [totalTonnage, setTotalTonnage] = useState(0)

  const [tdsTaxData, setTdsTaxData] = useState([])
  const [sapHsnData, setSapHsnData] = useState([])

  useEffect(() => {

    /* section for getting TDS Tax Type Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {

     let viewData = response.data.data
      console.log(viewData,'viewData')
     setTdsTaxData(viewData)
   })

   /* section for getting Sap Hsn Data from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(27).then((response) => {
      console.log(response.data.data,'DefinitionsListApi-setSapHsnData')
      setSapHsnData(response.data.data)
    })

  }, [])

  const getTdsTax = (code) => {
    let tds_text = '-'
    console.log(code,'code')
    tdsTaxData.map((val,ind)=>{
      if(val.definition_list_code == code){
        tds_text = val.definition_list_name
      } else if('Empty' == code){
        tds_text = 'No Tax'
      }
    })
    return tds_text
  }

  const [fetch, setFetch] = useState(false)

  const [contractorInfo, setContractorInfo] = useState([])

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const [invoicePostingDate, setInvoicePostingDate] = useState('')
  const Expense_Income_Posting_Date = ExpenseIncomePostingDate()
  const handleChangeInvoicePostingDate = (event) => {
    let vall = event.target.value
    console.log('handleChangeInvoicePostingDate', vall)
    setInvoicePostingDate(vall)
  }

  /* ===================== The Constants Needed For First Render Part Start ===================== */

  const [settlementClosureData, setSettlementClosureData] = useState([])
  const [singleContractorArray, setSingleContractorArray] = useState([])
  const [visible, setVisible] = useState(false)
  const [invoiceCopyAvailable, setInvoiceCopyAvailable] = useState(false)
  const [sapTdsFreightData, setSapTdsFreightData] = useState({})

  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */

  useEffect(() => {

    NLFSDieselIntentService.getNLFSDISInfoById(id).then((res) => {
      setFetch(true) 
      let payment_info_id_data = res.data.data
      console.log(payment_info_id_data,'payment_info_id_data') 
      setHireVendorCode(payment_info_id_data.vendor_code)      
      let rowDataList = []
      let diesel_indent_info_data = payment_info_id_data.di_id_info_objects
      diesel_indent_info_data.map((data, index) => {
          
        rowDataList.push({
          S_NO: index + 1,             
          Tripsheet: payment_info_id_data.type == 1 ? payment_info_id_data.trip_di_no_info[index].trip_sheet_no : payment_info_id_data.trip_di_no_info[index].di_no, 
          Vehicle_Type: payment_info_id_data.type == 1 ? (data.driver_id == 0 ? 'Hire' : 'Own') : (data.diesel_to == 1 ? 'Vehicle' : (data.diesel_to == 2 ? 'Barel' :  (data.diesel_to == 4 ? 'Car' : 'Others'))),
          Vehicle_No: payment_info_id_data.trip_di_no_info[index].vehicle_number,
          // Driver_Name: data.driver_info.driver_name,
          Diesel_Quantity: payment_info_id_data.type == 1 ? data.no_of_ltrs : data.fuel_quantity,
          Diesel_Rate: payment_info_id_data.type == 1 ? data.rate_of_ltrs : data.sap_fuel_rate,
          Total_Amount: data.total_amount,
          Fuel_Dispensary_Number: data.invoice_no,
          Fuel_Dispensary_No: (
            <a className='text-black' target='_blank' rel="noreferrer" href={data.invoice_copy}>
              <u><strong>{data.invoice_no}</strong></u>
            </a>
          ),
          SAP_Invoice_No: invoiceNoFider(data)
        })
          
      })

      setRowData(rowDataList) 
      setSingleContractorArray(payment_info_id_data)
    })

  }, [id])

  const [hireVendorCode, setHireVendorCode] = useState(0)
  const [hireVendorOutstanding, setHireVendorOutstanding] = useState(0)
  const [vont, setVont] = useState(0) /* Vendor Outstanding Next Trip */
  const [totalBalancePaymentAmount, setTotalBalancePaymentAmount] = useState(0)
  const [sapPaymentPostingPossibility, setSapPaymentPostingPossibility] = useState(false)

   const sapPaymentPosting = (type) => {

    let payment = 0

    if(sapPaymentPostingPossibility){

      /* Type 1 : Deduction Not Having */
      if(type == 1){ 

        payment = getLowerValue(getInt(hireVendorOutstanding),getInt(totalBalancePaymentAmount))

      } else { 
        //
      }

    }

    console.log(payment,'sapPaymentPosting-Amount')

    return payment
  }

  useEffect(() => {
    if (hireVendorCode != 0) {

      VendorOutstanding.getVendoroutstanding(hireVendorCode).then((res) => {
        let driver_outstanding_data = res.data[0];
        console.log(driver_outstanding_data,'driver_outstanding_data');
        setHireVendorOutstanding(driver_outstanding_data.L_DMBTR)
      })
      
    }else {
      setHireVendorOutstanding(0)
    }
  },[hireVendorCode, !singleContractorArray])

  const getInt = (val) => {
    return Number(parseFloat(val).toFixed(2))
  }

  const getLowerValue = (a,b) => {
    let lower = 0
    console.log(a,'a')
    console.log(b,'b')
    if(-a >= b){
      lower = b
    } else {
      lower = -a
    }
    console.log(lower,'lower-Amount')
    return lower
  }

  useEffect(()=>{
  
    let v_o_n_t = 0
   
    console.log(hireVendorOutstanding,'hireVendorOutstanding')
    console.log(totalBalancePaymentAmount,'totalBalancePaymentAmount') 

    let difference_amount = (getInt(totalBalancePaymentAmount)) - getInt(hireVendorOutstanding)

    if(totalBalancePaymentAmount <= 0){
      setSapPaymentPostingPossibility(false)
      v_o_n_t = 0
    } else {
      if(difference_amount > totalBalancePaymentAmount){
        setSapPaymentPostingPossibility(true)
        v_o_n_t = 1
      } else {
        setSapPaymentPostingPossibility(false)
        v_o_n_t = 0
      }
    }

    if(v_o_n_t = 0){
        setVont(getInt(hireVendorOutstanding))
    } else {

      let sap_payment_amount = getLowerValue(getInt(hireVendorOutstanding),getInt(totalBalancePaymentAmount))

      console.log(sap_payment_amount,'sap_payment_amount')
      console.log(sap_payment_amount == totalBalancePaymentAmount,'sap_payment_amount == totalBalancePaymentAmount')
      let needed_val = 0
      if(sap_payment_amount == totalBalancePaymentAmount){
        needed_val = getInt(hireVendorOutstanding)+getInt(totalBalancePaymentAmount)
        setVont(needed_val)
      } else {
        setVont(needed_val)
      }
      console.log(needed_val,'v-0-n-t')
    } 

  },[hireVendorOutstanding,totalBalancePaymentAmount,sapPaymentPostingPossibility,vont])

  const invoiceNoFider = (data) => {
    // Convert string to JSON
    const di_info_data = JSON.parse(data.nlfs_di_info);

    const docNo = di_info_data.find(item => item.type === 3)?.doc_no;
    console.log(docNo,'invoiceNoFider')
    return docNo
  } 

  useEffect(() => {  
    if(singleContractorArray && singleContractorArray.dis_no){  
      DieselIntentCreationService.getSapTripExpensesByDisNo(singleContractorArray.dis_no).then((res) => {
        let trip_sap_expenses_data = res.data[0]
        console.log(trip_sap_expenses_data,'trip_sap_expenses_data')
        if(trip_sap_expenses_data.INV_REF == singleContractorArray.dis_no && trip_sap_expenses_data.STATUS == 1 && trip_sap_expenses_data.TDS_AMT != 0){
          setSapTdsFreightData(trip_sap_expenses_data) 
          let balance_amount = Number(parseFloat(trip_sap_expenses_data.TDS_AMT).toFixed(2))
          setTotalBalancePaymentAmount(balance_amount)
        } else {
          setSapTdsFreightData({})
          Swal.fire({
            title: 'Tripsheet Data not found in SAP.. Kindly Contact Admin!',
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            window.location.reload(false)
          })
        }
      })     

    } else {
      setSapTdsFreightData({})
    }

  },[singleContractorArray])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.S_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet No',
      selector: (row) => row.Tripsheet,
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
      name: 'Diesel Qty.',
      selector: (row) => row.Diesel_Quantity,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Rate',
      selector: (row) => row.Diesel_Rate,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Total Amount',
      selector: (row) => row.Total_Amount,
      // sortable: true,
      center: true,
    },
    {
      name: 'Dispensary No.',
      selector: (row) => row.Fuel_Dispensary_No,
      sortable: true,
      center: true,
    }, 
    {
      name: 'SAP Inv. No.',
      selector: (row) => row.SAP_Invoice_No,
      sortable: true,
      center: true,
    }, 
  ]

  const columns1 = [
    {
      name: 'S.No',
      selector: (row) => row.S_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'DI No',
      selector: (row) => row.Tripsheet,
      sortable: true,
      center: true,
    },
    {
      name: 'Fuel To',
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
      name: 'Diesel Qty.',
      selector: (row) => row.Diesel_Quantity,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Rate',
      selector: (row) => row.Diesel_Rate,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Total Amount',
      selector: (row) => row.Total_Amount,
      // sortable: true,
      center: true,
    },
    {
      name: 'Dispensary No.',
      selector: (row) => row.Fuel_Dispensary_No,
      sortable: true,
      center: true,
    }, 
    {
      name: 'SAP Inv. No.',
      selector: (row) => row.SAP_Invoice_No,
      sortable: true,
      center: true,
    }, 
  ]

  useEffect(() => {
    // Set the current date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD'
    setInvoicePostingDate(formattedDate) 
  }, [])

  const validationApproval = () => {

    console.log(tdsHaving,'tdsHaving')
    console.log(invoiceCopy,'invoiceCopy') 

    if (invoicePostingDate) {
      //
    } else {
      setFetch(true)
      toast.warning('You should select payment posting date before submitting..!')
      return false
    }

    // if(invoiceCopyAvailable){
    //   //
    // } else {
    //   if(invoiceCopy){
    //     //
    //   } else {
    //     setFetch(true)
    //     toast.warning('You should attach invoice copy before submitting..!')
    //     return false
    //   }

    //   console.log(invoiceCopy.size,'invoiceCopy')
    //   if(invoiceCopy.size <= 5000000){
    //     //
    //   } else {
    //     setFetch(true)
    //     toast.warning('Attached invoice copy should not having size more than 5Mb..!')
    //     return false
    //   }
    // }

    // ============= Posting date Validation Part =================== //
    
    let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate();
    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date

    if(JavascriptDateCheckComponent(from_date,invoicePostingDate,to_date)){
      //
    } else {
      setFetch(true)
      toast.warning('Invalid Payment Posting date')
      return false
    }
    // ============= Posting date Validation Part =================== //

    if(sapPaymentPostingPossibility){
      //
    } else {
      setFetch(true)
      toast.error(`Sap Payment Posting Not Available for this Dis No. (${singleContractorArray.dis_no}). Kindly Contact Admin..`)
      return false
    }

    /* ===================== Validations Part End ===================== */

    let sap_data = new FormData()
    sap_data.append('INV_REF', singleContractorArray.dis_no)
    // sap_data.append('LIFNR', singleContractorArray.vendor_code)
    sap_data.append('LIFNR', nlfs_diesel_vendor_code)
    sap_data.append('BANK_PAYMENT', sapPaymentPosting(1))
    sap_data.append('POST_DATE', invoicePostingDate)
    sap_data.append('PLANT', 'NLLD')
    sap_data.append('BANK_REMARKS', reference)

    // setFetch(true)
    // return false
    DieselIntentCreationService.disSapVendorPaymentCreation(sap_data).then( 
      (res) => {

        // console.log(res,'invoiceCopy')
      let sap_invoice_no = res.data.BANK_PAYMENT_DOC_NO
      let sap_invoice_status = res.data.BANK_PAYMENT_STATUS
      let sap_invoice_message = res.data.BANK_PAYMENT_MESSAGE
      let sap_invoice_reference = res.data.TRIPSHEET_NO

      console.log(
        sap_invoice_no + '/' + sap_invoice_status + '/' + sap_invoice_message + '/' + sap_invoice_reference
      )

      if (
        (sap_invoice_status == '1' || sap_invoice_status == '3') &&
        res.status == 200 &&
        sap_invoice_no &&
        sap_invoice_message &&
        sap_invoice_reference == singleContractorArray.dis_no
      ) {

          /* ====== Request Sent To SAP For Invoice No. Generation End ========== */

          
          let form_data = new FormData()
          form_data.append('dis_id', id)
          form_data.append('created_by', user_id) 
          form_data.append('sap_book_division', 1)
          form_data.append('remarks', values.apremarks)
          form_data.append('reference_text', reference)
          form_data.append('post_date', invoicePostingDate)
          form_data.append('status', 3) /* Payment Completed */ 
          // form_data.append('payment_copy', invoiceCopy)            
          form_data.append('sap_payment_doc_no', sap_invoice_no) 
          form_data.append('sap_payment_amount', sapPaymentPosting(1)) 
          DieselIntentCreationService.sendVendorPaymentCreation(form_data).then((res)=>{
            console.log(res,'sendVendorInvoiceCreation')
            setFetch(true)
            if (res.status == 200 && res.data.lp_status == 1 && res.data.invoice_reference == sap_invoice_no) {
              Swal.fire({
                title: 'DIS Vendor Payment Posted Successfully!',
                icon: "success",
                text:  'Payment Doc. No : ' + sap_invoice_no,
                confirmButtonText: "OK",
              }).then(function () {
                navigation('/DISPaymentHome')
              });
            } else if (res.status == 201) {
              Swal.fire({
                title: res.data.message,
                icon: "warning",
                confirmButtonText: "OK",
              }).then(function () {
                // window.location.reload(false)
              })
            } else {
              toast.warning('DIS Vendor Payment Created in SAP But there is an issue in LP Updation. Kindly contact Admin..!')
            }
          })
          .catch((errortemp) => {
            console.log(errortemp)
            setFetch(true)
            var object = errortemp.response.data.errors
            var output = ''
            // for (var property in object) {
            //   output += '*' + object[property] + '\n'
            // }
            setError(output)
            setErrorModal(true)
          })
      } else if (
        (sap_invoice_status == '2') &&
        res.status == 200 &&
        sap_invoice_no == '' &&
        sap_invoice_message &&
        sap_invoice_reference == singleContractorArray.dis_no
      ) {

        Swal.fire({
          title: sap_invoice_message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // window.location.reload(false)
        })

      }else {
        setFetch(true)
        toast.warning('DIS Vendor Invoice Creation Failed in SAP.. Kindly Contact Admin!')
      }
    })
    .catch((errortemp) => {
      console.log(errortemp)
      setFetch(true)
      var object = errortemp.response.data.errors
      var output = ''
      // for (var property in object) {
      //   output += '*' + object[property] + '\n'
      // }
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
                {/* {singleContractorArray && singleContractorArray.contractor_info && ( */}
                  <CRow className="m-2">
                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Invoice Sequence No.</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.dis_no}
                        readOnly
                      />
                    </CCol>                

                   

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn"> Tripsheets Count / Total Qty </CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                      value={`${singleContractorArray.di_count} / ${singleContractorArray.fuel_quantity}`}
                        readOnly
                      />
                    </CCol> 

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">DIS Created By / Remarks</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={`${singleContractorArray.creation_user_info?.emp_name} / ${singleContractorArray.remarks}`}
                        readOnly
                      />
                    </CCol> 

                    <CCol md={3}>
                      <CFormLabel htmlFor="cname">Vendor Name & Code</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cname"
                        size="sm"
                        id="cname"
                        value={`NAGA LIMITED FUEL STATION (${singleContractorArray.vendor_code})`}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cname">Vendor Current Outstanding</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cname"
                        size="sm"
                        id="cname"
                        value={`${hireVendorOutstanding}`}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Vendor Invoice No.</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.sap_vendor_invoice_no}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Vendor Invoice Posting Date</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.sap_vendor_invoice_posting_date}
                        readOnly
                      />
                    </CCol> 

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Vendor Invoice Created By</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.vinvoice_creation_user_info?.emp_name}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Vendor Invoice Creation Remarks</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.approval_remarks}
                        readOnly
                      />
                    </CCol>
                  
                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn"> Vendor Invoice Amount </CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={`${singleContractorArray.fuel_amount}`}
                        readOnly
                      />
                    </CCol> 

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn"> TDS Tax Type </CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={`${getTdsTax(singleContractorArray.vendor_tds)}`}
                        readOnly
                      />
                    </CCol> 

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn"> TDS Deduction Amount </CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={`${singleContractorArray.fuel_amount-totalBalancePaymentAmount}`}
                        readOnly
                      />
                    </CCol> 

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="total_balance_payment_amount">
                        Trip Balance Amount
                      </CFormLabel>
                      <br />
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        id="total_balance_payment_amount"
                        name="total_balance_payment_amount"
                        value={totalBalancePaymentAmount}
                        size="sm"
                        readOnly
                      />
                    </CCol>                  
                    
                    

                    {sapPaymentPostingPossibility && (
                      <>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="sap_balance_payment_amount">
                            SAP Posting Payment
                          </CFormLabel>
                          <br />
                          <CFormInput
                            style={{fontWeight: 'bolder'}}
                            id="sap_balance_payment_amount"
                            name="sap_balance_payment_amount"
                            value={sapPaymentPosting(1)}
                            size="sm"
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="after_payment_vendor_outstanding">
                            After Payment - Vendor Outstanding
                          </CFormLabel>
                          <br />
                          <CFormInput
                            style={{fontWeight: 'bolder'}}
                            id="after_payment_vendor_outstanding"
                            name="after_payment_vendor_outstanding"
                            value={vont}
                            size="sm"
                            readOnly
                          />
                        </CCol>
                      </>
                    )}

                    {tdsHaving != '1' && (<></>)}
                    <CCol md={3} style={{textAlign:tdsHaving != '1' ? 'end' : 'initial'}}>
                      {/* <CFormLabel htmlFor="cmn">.</CFormLabel> */}
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        style={{marginTop:'10%'}}
                        onClick={(e) => {
                            // loadVehicleReadyToTripForExportCSV()
                            exportToCSV()
                          }}
                      >
                        Export
                      </CButton>
                    </CCol>

                  </CRow>
                {/* )} */}
                <CRow className="m-2">
                  <CustomTable
                    columns={singleContractorArray && singleContractorArray.type == 2 ? columns1 : columns}
                    pagination={false}
                    data={rowData}
                    fieldName={'Driver_Name'}
                    showSearchFilter={true}
                  />
                </CRow>

                <CRow className="m-2">
                  <CCol xs={12} md={3}>
                    {/* <CFormLabel htmlFor="apremarks">Validation / Approval Remarks</CFormLabel> */}
                    <CFormLabel htmlFor="apremarks"> Remarks</CFormLabel>
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
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="reference">
                      SAP - Reference Text
                    </CFormLabel>
                    <CFormInput
                      name="reference"
                      id="reference"
                      value={reference}
                      onChange={handleChangeReference}
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="invoicePostingDate">
                      Payment Posting Date <REQ />{' '}
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      type="date"
                      id="invoicePostingDate"
                      name="invoicePostingDate"
                      onChange={handleChangeInvoicePostingDate}
                      min={Expense_Income_Posting_Date.min_date}
                      max={Expense_Income_Posting_Date.max_date}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      value={invoicePostingDate}
                    />
                  </CCol>

                  {/* <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="invoiceCopy">
                      Payment Attachment {invoiceCopyAvailable ? '' : <REQ />}
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
                  {invoiceCopyAvailable && (
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="odoImg">Invoice Copy</CFormLabel>
                      <CButton
                        onClick={() => setVisible(!visible)}
                        className="w-100 m-0"
                        color="info"
                        size="sm"
                        id="odoImg"
                        style={border}
                      >
                        <span className="float-start">
                          <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                        </span>
                      </CButton>
                      <CModal visible={visible} onClose={() => setVisible(false)}>
                        <CModalHeader>
                          <CModalTitle>Payment Invoice Copy</CModalTitle>
                        </CModalHeader>

                        <CModalBody>
                          {singleContractorArray.invoice_copy &&
                          !singleContractorArray.invoice_copy.includes('.pdf') ? (
                            <CCardImage
                              orientation="top"
                              src={singleContractorArray.invoice_copy}
                            />
                          ) : (
                            <iframe
                              orientation="top"
                              height={500}
                              width={475}
                              src={singleContractorArray.invoice_copy}
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
                  )} */}
                </CRow>
                <CRow className="mt-2">
                  <CCol className="m-2" xs={12} sm={12} md={3}>
                    <CButton size="sm" color="primary" className="text-white" type="button">
                      <Link className="text-white" to="/DISPaymentHome">
                        Previous
                      </Link>
                    </CButton>
                  </CCol>
                  <CCol
                    className="offset-md-9" 
                    xs={12}
                    sm={12}
                    md={3}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >

                   
                    <CButton
                      size="sm"
                      style={{ background: 'green'}}
                      className="mx-3 text-white"
                      disabled={!sapPaymentPostingPossibility}
                      onClick={() => {
                        setFetch(false)
                        validationApproval()
                      }}
                      type="submit"
                    >
                      Submit
                    </CButton>
                  </CCol>
                </CRow>
                 

              {/* *********************************************************** */}
              </CCard>
            </> ) : (<AccessDeniedComponent />)
          }

        </>
      )}
    </>
  )
}

export default DisPaymentCreation


