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

export const nlfs_diesel_vendor_code = process.env.REACT_APP_NLFS_DIESEL_VENDOR

const DIVendorInvoiceCreation = () => {
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
    let fileName='NLFS_TS_Diesel_Info_Report_'+dateTimeString
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
  let page_no = LogisticsProScreenNumberConstants.NLFSDieselIntentModule.DIS_Vendor_Invoice

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

    // //section for getting Location Data from database
    // LocationApi.getLocation().then((res) => {
    //   setLocationData(res.data.data,'LocationData')
    // })

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

  /* Display The Delivery Plant Name via Given Delivery Plant Code */
  const getLocationNameByCode = (code) => {
    console.log(code,'code')
    console.log(locationData,'filtered_location_data')
    let filtered_location_data = locationData.filter((c, index) => {
      if (c.location_code == code) {
        return true
      }
    })
    console.log(filtered_location_data,'filtered_location_data')
    let locationName = filtered_location_data.length > 0 ? filtered_location_data[0].Location : 'Loading..'
    return locationName
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

  const deleteTripAllPayment = () => {
    const formDataUpdate = new FormData()

    formDataUpdate.append('id', id)
    formDataUpdate.append('cancelled_by', user_id)
    formDataUpdate.append('remarks', values.apremarks)
    DieselIntentCreationService.rejectAllTripDiData(formDataUpdate).then((res) => {
      console.log(res)
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: "DIS Rejected Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/DIInvoiceCreationHome')
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
          'Disel Indents Cannot Be Deleted From LP.. Kindly Contact Admin!'
        )
      }
    })
    .catch((error) => {
      setFetch(true)
      // for (let value of formDataForDBUpdate.values()) {
      //   console.log(value)
      // }
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

  // const deleteTripPayment = () => {
  //   console.log(tripPaymentDelete,'tripPaymentDelete')
  //   console.log(tripNoToDelete,'tripNoToDelete')
  //   console.log(tripIdToDelete,'tripIdToDelete')
  //   console.log(paymentAmountToDelete,'paymentAmountToDelete')
  //   console.log(shipmentIdToDelete,'shipmentIdToDelete')

  //   var editedFreightAmount = Number(singleContractorArray.freight_amount).toFixed(3) - Number(paymentAmountToDelete).toFixed(3)
  //   console.log(editedFreightAmount,'editedFreightAmount')

  //   const formDataForDBUpdate = new FormData()

  //   formDataForDBUpdate.append('shipment_id', shipmentIdToDelete)
  //   formDataForDBUpdate.append('updated_by', user_id)
  //   formDataForDBUpdate.append('trip_id', tripIdToDelete)
  //   formDataForDBUpdate.append('status', 3)
  //   formDataForDBUpdate.append('trip_no', tripNoToDelete)
  //   formDataForDBUpdate.append('freight_amount', editedFreightAmount)

  //   DepoExpenseClosureService.rejectSingleTripPayment(formDataForDBUpdate) .then((res) => {
  //     console.log(res)
  //   })

  // }


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

  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */

  useEffect(() => {

    NLFSDieselIntentService.getNLFSDISInfoById(id).then((res) => {
      setFetch(true) 
      let payment_info_id_data = res.data.data
      console.log(payment_info_id_data,'payment_info_id_data')
      values.apremarks = payment_info_id_data.approval_remarks ? payment_info_id_data.approval_remarks : ''
      payment_info_id_data.reference_text ? setReference(payment_info_id_data.reference_text) : setReference('')
      let rowDataList = []
      let diesel_indent_info_data = payment_info_id_data.di_id_info_objects
      diesel_indent_info_data.map((data, index) => {
          
        rowDataList.push({
          S_NO: index + 1,             
          Tripsheet: payment_info_id_data.trip_di_no_info[index].trip_sheet_no, 
          Vehicle_Type: data.driver_id == 0 ? 'Hire' : 'Own',
          Vehicle_No: payment_info_id_data.trip_di_no_info[index].vehicle_number,
          // Driver_Name: data.driver_info.driver_name,
          Diesel_Quantity: data.no_of_ltrs,
          Diesel_Rate: data.rate_of_ltrs,
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

  useEffect(() => {
    // Set the current date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD'
    setInvoicePostingDate(formattedDate) 
  }, [])

  const invoiceNoFider = (data) => {
    // Convert string to JSON
    const di_info_data = JSON.parse(data.nlfs_di_info);

    const docNo = di_info_data.find(item => item.type === 3)?.doc_no;
    console.log(docNo,'invoiceNoFider')
    return docNo
  } 

  const DepoTripSettlementValidationCancel = () => {
    console.log(values.apremarks,'apremarks')
    if (values.apremarks && values.apremarks.trim()) {
      setTripPaymentAllDelete(true)
    } else {
      setFetch(true)
      Swal.fire({
        title: 'Remarks required for rejection..',
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
      })
      values.apremarks = ''
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

  const validationApproval = () => {

    console.log(tdsHaving,'tdsHaving')
    // console.log(invoiceCopy,'invoiceCopy')

    if(hsnValue == ''){
        setFetch(true)
        toast.warning('HSN Type Should be seleceted..!')
        return false
    }

    if(tdsHaving == '1' && tdsValue == ''){
        setFetch(true)
        toast.warning('TDS Tax Type Should be filled for having TDS..!')
        return false
    }

    if (invoicePostingDate) {
      //
    } else {
      setFetch(true)
      toast.warning('You should select invoice posting date before submitting..!')
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

    var HireDeductionSeq = []
    var HireDeduction = {}
    let di_array_length = singleContractorArray.di_id_info ? singleContractorArray.di_id_info.length : 0

    for (var i = 0; i < di_array_length; i++) {

      HireDeduction.LINE_ITEM = i+1
      HireDeduction.DIE_AMT = singleContractorArray.di_id_info_objects[i].total_amount
      HireDeduction.VEHICLE_NO = singleContractorArray.trip_di_no_info[i].vehicle_number
      HireDeduction.REFERENCE = singleContractorArray.trip_di_no_info[i].trip_sheet_no
      HireDeduction.RATE_PER_LTR = singleContractorArray.di_id_info_objects[i].rate_of_ltrs
      HireDeduction.NO_OF_LTR = singleContractorArray.di_id_info_objects[i].no_of_ltrs

      HireDeductionSeq[i] = HireDeduction
      HireDeduction = {}

    }

    if(user_info.is_admin){
      console.log('-------------------HireDeduction---------------------------')
      console.log(HireDeductionSeq)
    }

    /* =================== Request Sent To SAP For Invoice No. Generation Start ======================= */

    let sap_data = new FormData()

    var SAPApendData_Seq = []
    var SAPApendData = {}

    SAPApendData.INV_REF = singleContractorArray.dis_no
    SAPApendData.LIFNR = nlfs_diesel_vendor_code
    SAPApendData.DIE_TOT_AMT = singleContractorArray.fuel_amount
    SAPApendData.POST_DATE = invoicePostingDate 
    SAPApendData.TDS = tdsHaving == '1' ? 'YES' : 'NO'
    SAPApendData.TDS_VALUE = tdsHaving == '1' ? tdsValue : ''
    SAPApendData.HSN = hsnValue
    SAPApendData.PLANT = 'NLLD' 
    SAPApendData.TOTAL_DIE_LTR = singleContractorArray.fuel_quantity
    SAPApendData.REMARKS = reference
    SAPApendData.LINE = HireDeductionSeq

    console.log(sap_data,'sap_data')
    SAPApendData_Seq.push(SAPApendData)
    // setFetch(true)
    // return false
    DieselIntentCreationService.disSapVendorInvoiceCreation(SAPApendData_Seq).then( 
      (res) => {
      let sap_invoice_no = res.data.DOCUMENT_NO
      let sap_invoice_status = res.data.STATUS
      let sap_invoice_message = res.data.MESSAGE
      let sap_invoice_reference = res.data.INV_REF

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
          form_data.append('tds_having', tdsHaving == '1' ? 'YES' : 'NO')
          form_data.append('vendor_tds', tdsHaving == '1' ? tdsValue : '')
          form_data.append('vendor_hsn', hsnValue)
          form_data.append('sap_book_division', 1)
          form_data.append('remarks', values.apremarks)
          form_data.append('reference_text', reference)
          form_data.append('post_date', invoicePostingDate)
          form_data.append('status', 2) /* Approved */ 
          // form_data.append('invoice_copy', invoiceCopy)            
          form_data.append('sap_invoice_no', sap_invoice_no) 
          DieselIntentCreationService.sendVendorInvoiceCreation(form_data).then((res)=>{
            console.log(res,'sendVendorInvoiceCreation')
            setFetch(true)
            if (res.status == 200 && res.data.lp_status == 1 && res.data.invoice_reference == sap_invoice_no) {
              Swal.fire({
                title: 'DIS Vendor Invoice Created Successfully!',
                icon: "success",
                text:  'Invoice No : ' + sap_invoice_no,
                confirmButtonText: "OK",
              }).then(function () {
                navigation('/DIInvoiceCreationHome')
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
              toast.warning('DIS Vendor Invoice Created in SAP But there is an issue in LP Updation. Kindly contact Admin..!')
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
                      <CFormLabel htmlFor="cmn">Total Qty </CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.fuel_quantity}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Total Amount / Tripsheets Count </CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={`${singleContractorArray.fuel_amount} / ${singleContractorArray.di_count}`}
                        readOnly
                      />
                    </CCol> 

                    <CCol md={3}>
                      <CFormLabel htmlFor="vendor_hsn">
                        HSN Code <REQ />{' '}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="hsnValue"
                        onChange={handleChangeHsnValue}
                        value={hsnValue}
                        id="hsnValue"
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
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">TDS Applicable</CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="tdsHaving"
                        onChange={handleChangeTdsHaving}
                        value={tdsHaving}
                        id="tdsHaving"
                      >
                        <option value="0">NO</option>
                        <option value="1">YES</option>
                      </CFormSelect>
                    </CCol>
                    {tdsHaving == '1' && (
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vendor_tds">
                          TDS Tax Type <REQ />{' '}
                        </CFormLabel>
                        <CFormSelect
                          size="sm"
                          name="vendor_tds"                           
                          onChange={handleChangeTdsValue}
                          value={tdsValue}                           
                          aria-label="Small select example"
                        >
                          <option value="">Select</option>
                          {/* <option value="0">No Tax</option> */}

                          {tdsTaxData.map(({ definition_list_code, definition_list_name }) => {
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
                    )}

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">DIS Created By</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.creation_user_info?.emp_name}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">DIS Creation Remarks</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.remarks}
                        readOnly
                      />
                    </CCol>

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
                    columns={columns}
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
                      Invoice Posting Date <REQ />{' '}
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
                      Invoice Attachment {invoiceCopyAvailable ? '' : <REQ />}
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
                      <Link className="text-white" to="/DIInvoiceCreationHome">
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
                      style={{ background: 'red'}}
                      className="mx-3 text-white"
                      onClick={() => {
                        // setFetch(false)
                        DepoTripSettlementValidationCancel()

                      }}
                      type="submit"
                    >
                      Reject
                    </CButton>
                    <CButton
                      size="sm"
                      style={{ background: 'green'}}
                      className="mx-3 text-white"
                      onClick={() => {
                        setFetch(false)
                        validationApproval()
                      }}
                      type="submit"
                    >
                      Approve
                    </CButton>
                  </CCol>
                </CRow>
                {/* ======================= Confirm Button Modal Area ========================== */}
                {/* ======================= Confirm Button Modal Area ========================== */}

                <CModal
                  size="md"
                  visible={tripPaymentAllDelete}
                  onClose={() => {
                    setTripPaymentAllDelete(false)
                  }}
                >
                  <CModalHeader
                    style={{
                      backgroundColor: '#ebc999',
                    }}
                  >
                    <CModalTitle>Confirmation To Reject</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <p className="lead">Are you sure to reject this FSB Sequence ?</p>
                    </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setTripPaymentAllDelete(false)
                        setFetch(false)
                        deleteTripAllPayment()
                      }}
                    >
                      Yes
                    </CButton>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setTripPaymentAllDelete(false)
                      }}
                    >
                      No
                    </CButton>
                  </CModalFooter>
                </CModal>
                <CModal
                  size="md"
                  visible={tripPaymentDelete}
                  onClose={() => {
                    setTripPaymentDelete(false)
                    setTripIdToDelete('')
                    setTripNoToDelete('')
                    setPaymentAmountToDelete(0)
                    setShipmentIdToDelete('')
                  }}
                >
                  <CModalHeader
                    style={{
                      backgroundColor: '#ebc999',
                    }}
                  >
                    <CModalTitle>Confirmation To Removal</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <p className="lead">Are you sure to remove this Tripsheet - ({tripNoToDelete})</p>
                    <CRow>
                      <CCol xs>
                        <CInputGroup style={{width: '80%'}} >
                          <CInputGroupText
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                              width: '60%',
                            }}
                          >
                            Previous Trip Freight Amount
                          </CInputGroupText>
                          <CFormInput readOnly value={Number(singleContractorArray.freight_amount).toFixed(3)} />
                        </CInputGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xs>
                        <CInputGroup style={{width: '80%'}} >
                          <CInputGroupText
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                              width: '60%',
                            }}
                          >
                            Removal Trip Freight Amount
                          </CInputGroupText>
                          <CFormInput readOnly value={Number(paymentAmountToDelete).toFixed(3)} />
                        </CInputGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xs>
                        <CInputGroup style={{width: '80%'}} >
                          <CInputGroupText
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                              width: '60%',
                            }}
                          >
                            Updated Trip Freight Amount
                          </CInputGroupText>
                          <CFormInput readOnly value={(Number(singleContractorArray.freight_amount).toFixed(3) - Number(paymentAmountToDelete).toFixed(3)).toFixed(3)} />
                        </CInputGroup>
                      </CCol>
                    </CRow>

                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setTripPaymentDelete(false)
                        // setFetch(false)
                        deleteTripPayment()
                      }}
                    >
                      Confirm
                    </CButton>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setTripPaymentDelete(false)
                        setTripIdToDelete('')
                        setTripNoToDelete('')
                        setPaymentAmountToDelete(0)
                        setShipmentIdToDelete('')
                      }}
                    >
                      Cancel
                    </CButton>
                    {/* <CButton color="primary">Save changes</CButton> */}
                  </CModalFooter>
                </CModal>

              {/* *********************************************************** */}
              </CCard>
            </> ) : (<AccessDeniedComponent />)
          }

        </>
      )}
    </>
  )
}

export default DIVendorInvoiceCreation


