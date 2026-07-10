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
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService';
import useFormDepoExpenseClosure from 'src/Hooks/useFormDepoExpenseClosure';
import LocationApi from 'src/Service/SubMaster/LocationApi';
import Swal from 'sweetalert2';
import CustomTable from 'src/components/customComponent/CustomTable';
import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from '../CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import IfoodsExpenseClosureService from 'src/Service/Ifoods/ExpenseClosure/IfoodsExpenseClosureService'

const IfoodsPaymentValidationAc = () => {
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
  const [reference1, setReference1] = useState('')
  const [invoiceCopy, setInvoiceCopy] = useState('')
  const [tdsHaving, setTdsHaving] = useState(0)
  const [invoicePostingDate, setInvoicePostingDate] = useState('')
  const [invoicePostingDate1, setInvoicePostingDate1] = useState('')
  const REQ = () => <span className="text-danger"> * </span>

  const handleChangeInvoiceCopy = (event) => {
    let valll = event.target.files[0]
    setInvoiceCopy(valll)
  }

  const handleChangeReference = (event) => {
    let val = event.target.value.toUpperCase()
   // console.log('Reference', val)
    setReference(val)
  }
  const handleChangeReference1 = (event) => {
    let val = event.target.value.toUpperCase()

    setReference1(val)
  }
  const handleChangeInvoicePostingDate = (event) => {
    let vall = event.target.value
   // console.log('handleChangeInvoicePostingDate', vall)
    setInvoicePostingDate(vall)
  }
  const handleChangeInvoicePostingDate1 = (event) => {
    let vall = event.target.value
   // console.log('handleChangeInvoicePostingDate', vall)
    setInvoicePostingDate1(vall)
  }

  const exportToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Payment_Validation_'+dateTimeString
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
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Payment_Validationac

  /* Vehicle Current Position */
  const VEHICLE_CURRENT_POSITION = {
    DEPO_SHIPMENT_COMPLETED: 22,
    DEPO_EXPENSE_APPROVAL: 27,
    DEPO_SETTLEMENT_CLOSURE: 28
  }

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
     // console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
    //  console.log('screen-access-not-allowed')
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
  //  console.log(code,'code')
  //  console.log(locationData,'filtered_location_data')
    let filtered_location_data = locationData.filter((c, index) => {
      if (c.location_code == code) {
        return true
      }
    })
   // console.log(filtered_location_data,'filtered_location_data')
    let locationName = filtered_location_data.length > 0 ? filtered_location_data[0].Location : 'Loading..'
    return locationName
  }













  // const [submitBtn, setSubmitBtn] = useState(true)
  // useEffect(() => {
  //   setFetch(true)
  //   let freight_type = !errors.freight_type && values.freight_type
  //   let payment_amt = !errors.payment_amt && values.payment_amt
  //   let expense_amt = !errors.expense_amt && values.expense_amt
  //   let gst_tax_type = !errors.gst_tax_type && values.gst_tax_type
  //   let tds_tax_type = !errors.tds_tax_type && values.tds_tax_type != '0'

  //   let condition_check =
  //     freight_type && payment_amt && expense_amt && gst_tax_type && tds_tax_type && reference&&reference1

  //   if (condition_check) {
  //     setSubmitBtn(false)
  //   } else {
  //     setSubmitBtn(true)
  //   }
  // }, [values, errors])

  useEffect(() => {
    LocationApi.getLocation().then((response) => {
      let viewData = response.data.data
   //   console.log(viewData,'viewData')
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
  //Exemption Details Getting SAP Start
  const [exemption, setExemption] = useState('')
  useEffect(() => {
    if (values.tds_tax_type) {
      let sapData = [{
        "LIFNR": singleContractorArray.vendor_info.vendor_code,
        "TDS": values.tds_tax_type
    }];

       IfoodsExpenseClosureService.getExemptionbyVendor(sapData).then((res) => {
        if (res.data.EXEMP > 0) {
        setFetch(true)
        setExemption(res.data.EXEMP);
        toast.success('Vendor Exemption Found..!')
        
      } else {
        setFetch(true)
        setExemption(res.data.EXEMP);
        toast.warning('There is no exemption..!')
      }

    })
  }else {
    values.tds_tax_type = '';
  }
}, [values.tds_tax_type])
//Exemption Details Getting SAP End















  const Expense_Income_Posting_Date = ExpenseIncomePostingDate();
  const [tdsTaxData, setTdsTaxData] = useState([])
  const [gstTaxData, setGstTaxData] = useState([])
  
  
  useEffect(() => {

    DefinitionsListApi.visibleDefinitionsListByDefinition(31).then((response) => {
     let viewData = response.data.data
     setTdsTaxData(viewData)
   })

   DefinitionsListApi.activevisibleDefinitionsListByDefinition(24).then((response) => {
    let viewData = response.data.data
    setGstTaxData(viewData)
  })

  }, [])



  const getTdsTax = (code) => {
    let tds_text = '-'
  //  console.log(code,'code')
    tdsTaxData.map((val,ind)=>{
      if(val.definition_list_code == code){
        tds_text = val.definition_list_name
      } else if('Empty' == code){
        tds_text = 'No Tax'
      }
    })
    return tds_text
  }
  const getGstTax = (code) => {
    let gst_text = '-'
   // console.log(code,'code')
    gstTaxData.map((val,ind)=>{
      if(val.definition_list_code == code){
        gst_text = val.definition_list_name
      } else if('E0' == code){
        gst_text = 'No Tax'
      }
    })
    return tds_text
  }

  const deleteTripAllPayment = () => {
    const formDataUpdate = new FormData()

    formDataUpdate.append('id', id)
    formDataUpdate.append('created_by', user_id)
    formDataUpdate.append('am_remarks', values.apremarks)
    IfoodsExpenseClosureService.rejectAllTripPayment1(formDataUpdate).then((res) => {
     // console.log(res)
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: "Payment Rejected Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/IfoodsPaymentValidationTableAc')
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
          'Shipment - Delivery Cannot Be Deleted From LP.. Kindly Contact Admin!'
        )
      }
    })
    .catch((error) => {
      setFetch(true)
      // for (let value of formDataForDBUpdate.values()) {
      //   console.log(value)
      // }
    //  console.log(error)
      var object = error.response.data.errors
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      }
      setError(output)
      setErrorModal(true)
    })

  }


  const deleteTripPayment = () => {
    // console.log(tripPaymentDelete,'tripPaymentDelete')
    // console.log(tripNoToDelete,'tripNoToDelete')
    // console.log(tripIdToDelete,'tripIdToDelete')
    // console.log(paymentAmountToDelete,'paymentAmountToDelete')
    // console.log(shipmentIdToDelete,'shipmentIdToDelete')

    var editedFreightAmount = Number(singleContractorArray.freight_amount).toFixed(3) - Number(paymentAmountToDelete).toFixed(3)
   // console.log(editedFreightAmount,'editedFreightAmount')

    const formDataForDBUpdate = new FormData()

    formDataForDBUpdate.append('shipment_id', shipmentIdToDelete)
    formDataForDBUpdate.append('updated_by', user_id)
    formDataForDBUpdate.append('trip_id', tripIdToDelete)
    formDataForDBUpdate.append('status', 8)
    formDataForDBUpdate.append('trip_no', tripNoToDelete)
    formDataForDBUpdate.append('freight_amount', editedFreightAmount)

    IfoodsExpenseClosureService.rejectSingleTripPaymentam(formDataForDBUpdate) .then((res) => {
      // console.log(res)
    })

  }


  const [fetch, setFetch] = useState(false)

  const [contractorInfo, setContractorInfo] = useState([])

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  /* ===================== The Constants Needed For First Render Part Start ===================== */

  const [settlementClosureData, setSettlementClosureData] = useState([])
  const [singleContractorArray, setSingleContractorArray] = useState([])
  const [visible, setVisible] = useState(false)
  const [invoiceCopyAvailable, setInvoiceCopyAvailable] = useState(false)

  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */

  useEffect(() => {

    IfoodsExpenseClosureService.getPaymentInfoById(id).then((res) => {
        let payment_info_id_data = res.data.data
      //  console.log(payment_info_id_data,'payment_info_id_data')
        values.apremarks = payment_info_id_data.approval_remarks ? payment_info_id_data.approval_remarks : ''
        payment_info_id_data.reference_text ? setReference(payment_info_id_data.reference_text) : setReference('')

        /* Set TDS Having Value */
        payment_info_id_data.tds_having == 'YES' ? setTdsHaving(1) : (!(payment_info_id_data.vendor_info.tds_tax_type == null || payment_info_id_data.vendor_info.tds_tax_type == 'Empty') ? setTdsHaving(1) : setTdsHaving(0))

      let a = payment_info_id_data.invoice_copy
      if (!a || a.substr(a.length - 1) == '/') {
        setInvoiceCopyAvailable(false)
      } else {
        setInvoiceCopyAvailable(true)
      }
      setSingleContractorArray(payment_info_id_data)
      //console.log(payment_info_id_data+'singleContractorArray')
    })
  }, [id])

//************************************Manual calculation Start********************************************************** */
// const base_value = singleContractorArray.freight_amount
// console.log(base_value + 'base_value')
// const tds_value = values.tds_tax_type
// let tds_dec_value = 0

  // if (values.tds_tax_type == 'T1') {
  //   tds_dec_value = (base_value * 10) / 100
  //   console.log(tds_dec_value + 'tds_dec_value')
  // }
  // if (values.tds_tax_type == 'T2') {
  //   tds_dec_value = (base_value * 2) / 100
  //   console.log(tds_dec_value + 'tds_dec_value')
  // }
  // if (values.tds_tax_type == 'T4') {
  //   tds_dec_value = (base_value * 2) / 100
  //   console.log(tds_dec_value + 'tds_dec_value')
  // }
  // if (values.tds_tax_type == 'T7') {
  //   tds_dec_value = (base_value * 1) / 100
  //   console.log(tds_dec_value + 'tds_dec_value')
  // }
  // if (values.tds_tax_type == 'T8') {
  //   tds_dec_value = (base_value * 10) / 100
  //   console.log(tds_dec_value + 'tds_dec_value')
  // }
  
  // let gst_dec_value = 0
  // let gstcal118 = (base_value / 118) * 100
  // let gstcal18 = (base_value * 18) / 100
  // let gstcal112 = (base_value / 112) * 100
  // let gstcal12 = (base_value * 12) / 100
  // let payment_value = 0
  // if (values.gst_tax_type == 'E0') {
  //   gst_dec_value = 0
  //   console.log(gst_dec_value + 'gst_dec_value')
  //   payment_value = Number(base_value) - tds_dec_value
  // }
  // else if (values.gst_tax_type == 'R5') {
  //   gst_dec_value = 0
  //   console.log(gst_dec_value + 'gst_dec_value')
  //   payment_value = Number(base_value) - tds_dec_value
  // }
 
  // else if (values.gst_tax_type == 'F7') {
  //   gst_dec_value = gstcal18
  //   console.log(gst_dec_value+'gst_dec_value')
  //   payment_value = Number(base_value) - tds_dec_value +gst_dec_value
  // }
  // else if (values.gst_tax_type == 'F6') {
  //   gst_dec_value = gstcal12
  //   payment_value = Number(base_value) - tds_dec_value +gst_dec_value
  // }
  // else if (values.gst_tax_type == 'Z1') {
  //   // gst_dec_value = 0
  //   console.log(gst_dec_value + 'gst_dec_value')
  //   payment_value = Number(base_value) - tds_dec_value+gst_dec_value
  // }
  // else if (values.gst_tax_type == 'Z2') {
  //   // gst_dec_value = 0
  //   console.log(gst_dec_value + 'gst_dec_value')
  //   payment_value = Number(base_value) - tds_dec_value+gst_dec_value
  // }

  // else{
  //  // gst_dec_value = 0
  //   console.log(gst_dec_value + 'gst_dec_value')
  //   payment_value = Number(base_value) - tds_dec_value
  // }

  // payment_value = payment_value.toFixed(2)
  // gst_dec_value = gst_dec_value.toFixed(2)
  // tds_dec_value = tds_dec_value.toFixed(2)
  //************************************Manual calculation End********************************************************** */


const base_value = singleContractorArray.freight_amount
const tds_value = values.tds_tax_type

const [tds_dec_value, setTdsDecValue] = useState(0);
const [payment_value, setPaymentValue] = useState(0);
const [gst_dec_value, setGstDecValue] = useState(0);
useEffect(() => {
  let calculatedGstDecValue = 0;
  let calculatedPaymentValue = 0;
  let calculatedTdsDecValue = 0;

  if (values.gst_tax_type) {
    const matchedGSTTax = gstTaxData.find(item => item.definition_list_code === values.gst_tax_type);
    if (matchedGSTTax) {
      const alphaCodeGST = matchedGSTTax.definition_list_alpha_code;
      
    
      const gst_cal = (base_value * alphaCodeGST) / 100;
      console.log(base_value+'(base_value) *'+alphaCodeGST+'(alphaCodeGST)/100 = '+gst_cal)
      calculatedGstDecValue = gst_cal;
    }
  }

  if (values.tds_tax_type&&exemption==0) {
    console.log(exemption+'exemption not Calculation')
    const matchedTDSTax = tdsTaxData.find(item => item.definition_list_code === values.tds_tax_type);

    if (matchedTDSTax) {
      const alphaCodeTDS = matchedTDSTax.definition_list_alpha_code;
      const tds_cal = (base_value * alphaCodeTDS) / 100;
      console.log(base_value+'(base_value) *'+alphaCodeTDS+'(alphaCodeTDS)/100 = '+tds_cal)
      calculatedTdsDecValue = tds_cal;
    }
    console.log(exemption+'exemption Calculation')
  }
  if (values.tds_tax_type&&exemption!=0) {
    const matchedTDSTax = tdsTaxData.find(item => item.definition_list_code === values.tds_tax_type);
    console.log(exemption+'exemption Calculation')
    if (matchedTDSTax) {
      const alphaCodeTDS = matchedTDSTax.definition_list_alpha_code;
      const exem_cal = alphaCodeTDS* exemption/100
      const exem_find = alphaCodeTDS-exem_cal
      console.log('exemption % '+exem_find)
      const tds_cal = (base_value * exem_find) / 100;
      console.log(base_value+'(base_value) *'+exem_find+'(exem_find)/100 = '+tds_cal)
      calculatedTdsDecValue = tds_cal;
    }
   
  }

  calculatedPaymentValue = base_value - calculatedTdsDecValue + calculatedGstDecValue;

  // Formatting values to 2 decimal places
  const formattedPaymentValue = calculatedPaymentValue.toFixed(2);
  const formattedTdsDecValue = calculatedTdsDecValue.toFixed(2);
  const formattedGstDecValue = calculatedGstDecValue.toFixed(2);

  // Updating state with the formatted values
  setPaymentValue(parseFloat(formattedPaymentValue));
  setTdsDecValue(parseFloat(formattedTdsDecValue));
  setGstDecValue(parseFloat(formattedGstDecValue));

}, [values.gst_tax_type, values.tds_tax_type,exemption]);


//*********************************************************************************************** */


  useEffect(() => {

      IfoodsExpenseClosureService.getSettlementValidationInfoById(id).then((res) => {
        setFetch(true)
        let payment_info_data = res.data.data
      //  console.log(payment_info_data,'closure_info_data')
        setSettlementClosureData(payment_info_data)
        let vendor_info_data = payment_info_data.ifoods_Vendor_info
        setContractorInfo(vendor_info_data)
        values.remarks = payment_info_data.remarks
        let rowDataList = []
        payment_info_data.map((data, index) => {
          let fm = data.closure_info.total_expenses
          let ae = data.closure_info.freight_charges
       let additionalexpense = fm - ae
     //   console.log(fm + '-' + ae + '=' + additionalexpense)
          rowDataList.push({
            S_NO: index + 1,
            Depo_Location:data.vehicle_location_info.location,
            Contractor_Name: data.ifoods_Vendor_info.vendor_name,
            Contractor_Code: data.ifoods_Vendor_info.vendor_code,
            Contractor_Number: data.ifoods_Vendor_info.vendor_contact_no,
            Shipment_No: data.tripsheet_info[0].shipment_po,
            Tripsheet: data.tripsheet_info[0].ifoods_tripsheet_no,
            GateIn_Date: data.created_date,
          purpose: data.purpose==1?'FG-Sales':'FG-STO',
            Tripsheet_Date: data.tripsheet_info[0].created_at,
            Expense_Date: data.closure_info.created_at_date,
            Vehicle_No: data.ifoods_Vehicle_info.vehicle_number,
            Driver_Name: data.driver_name,
            Driver_Number: data.driver_number,
    //        Shipment_Freight: data.shipment_info.freight_type == '2' ? data.shipment_info.shipment_depo_actual_freight_amount : data.shipment_info.shipment_depo_budget_freight_amount,
            Adjustment_Freight: getFreightAdjustment(data.shipment_info,data.closure_info),
            Additional_Freight: additionalexpense,
            Total_Freight: fm,
          
            Screen_Duration: data.vehicle_current_position_updated_time,
            Overall_Duration: data.created_at,
            // Waiting_At: (
            //   <span className="badge rounded-pill bg-info">
            //     {data.vehicle_current_position ==
            //         VEHICLE_CURRENT_POSITION.DEPO_SETTLEMENT_CLOSURE
            //       ? statusSetter(data.closure_info)
            //       : 'Gate Out'}
            //   </span>
            // ),
            Tripsheet_No: (
              <Link className='text-black' target='_blank' to={`/IfoodsPaymentValidationTableAc/IfoodsPaymentValidationChildAc/${data.closure_info.closure_id}`}>
                <u><strong>{data.tripsheet_info[0].ifoods_tripsheet_no}</strong></u>
              </Link>
            ),
            // Freight_Amount: fm,
            additionalexpense_amt: ( <span style={{color:(additionalexpense) == 0 ? '' : 'red'}}>
             
             </span>),
            // Freight_Amount2: ( <span style={{color:getFreightAdjustment(data.shipment_info,data.closure_info) == 0 ? '' : 'red'}}>
            //   {/* {getFreightAdjustment(data.shipment_info,data.closure_info)} */}
            // </span>),
            // Freight_Amount3: ( <span style={{color:getFreightAdjustment(data.closure_info) == 0 ? '' : 'red'}}>
            //   {data.closure_info.total_expenses}
            // </span>),
            Action: (
              <>
                <CButton className="btn btn-success btn-sm me-md-1">
                  <Link className="text-white" target='_blank' to={`/IfoodsPaymentValidationTableAc/IfoodsPaymentValidationChildAc/${data.closure_info.closure_id}`}>
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </Link>
                </CButton>
                <CButton
                  size="sm"
                  color="danger"
                  shape="rounded"
                  id={data.id}
                  onClick={() => {
                    setTripPaymentDelete(true)
                    setTripNoToDelete(data.tripsheet_info.ifoods_tripsheet_no)
                    setTripIdToDelete(data.tripsheet_info.tripsheet_sheet_id)
                    setPaymentAmountToDelete(fm)
                   // setShipmentIdToDelete(data.shipment_info.shipment_id)
                  }}
                  className="m-1"
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </CButton>
              </>
            ),
          })
        })
        setRowData(rowDataList)
      })

  }, [id])

  const DepoTripSettlementValidationCancel = () => {
   // console.log(values.apremarks,'apremarks')
    if (values.apremarks && values.apremarks.trim()) {
      setTripPaymentAllDelete(true)
    } else {
      setFetch(true)
      Swal.fire({
        title: 'Remarks required for rejection..',
        icon: 'warning',
        confirmButtonText: 'OK',
      }).then(function () {})
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
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment No',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Purpose',
      selector: (row) => row.purpose,
      sortable: true,
      center: true,
    },

    {
      name: 'Loading Point - In',
      selector: (row) => row.GateIn_Date,
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
      name: 'Adjustment',
      selector: (row) => row.Additional_Freight,
       sortable: true,
      center: true,
    },
    // {
    //   name: 'Tot.Freight',
    //   selector: (row) => row.Total_Freight,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Expense Date',
      selector: (row) => row.Expense_Date,
      sortable: true,
      center: true,
    },
   
  ]

  const validationApproval = () => {

    // console.log(tdsHaving,'tdsHaving')
    // console.log(invoiceCopy,'invoiceCopy')
    if(invoiceCopyAvailable){
      //
    } else {
      if(invoiceCopy){
        //
      } else {
        setFetch(true)
        toast.warning('You should attach invoice copy before submitting..!')
        return false
      }

       if (invoicePostingDate) {
          //
        } else {
          setFetch(true)
          toast.warning('You should select invoice posting date before submitting..!')
          return false
        }
        if (invoicePostingDate1) {
          //
        } else {
          setFetch(true)
          toast.warning('You should select invoice posting date before submitting..!')
          return false
        }    
    
   //   console.log(invoiceCopy.size,'invoiceCopy')
      if(invoiceCopy.size <= 5000000){
        //
      } else {
        setFetch(true)
        toast.warning('Attached invoice copy should not having size more than 5Mb..!')
        return false
      }
    }

    // if (values.expense_amt > singleContractorArray.freight_amount) {
    //   setFetch(true)
    //   toast.warning('The Posting Expense Amount is greater than Actual Freight Amount..!')
    //   return false
    // } 
    if (!values.gst_tax_type || values.gst_tax_type === null) {
      setFetch(true);
      toast.warning(" Posting GST Tax Type is Mandatory ..!");
      return false;
    }
    
    if (!values.tds_tax_type || values.tds_tax_type === null) {
      setFetch(true);
      toast.warning(" Posting TDS Tax Type is Mandatory ..!");
      return false;
    }

    if (!values.expense_amt || values.expense_amt === null) {
      setFetch(true);
      toast.warning(" Posting Expense Amount is Mandatory ..!");
      return false;
    }
    if (values.expense_amt > singleContractorArray.freight_amount) {
      setFetch(true)
      toast.warning("Posting Expense Amount is Less than Total Freight Amount..!")
      return false
    }
    if (!values.payment_amt || values.payment_amt === null) {
      setFetch(true);
      toast.warning(" Posting Payment Amount is Mandatory ..!");
      return false;
    }
    if (values.payment_amt > payment_value) {
      setFetch(true)
      toast.warning("Posting Payment Amount is Less than Actual Payment Value..!")
      return false
    }
    if (!values.freight_type || values.freight_type === null) {
      setFetch(true);
      toast.warning(" Posting Freight Type is Mandatory ..!");
      return false;
    }

    if (!reference1 || reference1 === null) {
      setFetch(true);
      toast.warning(" SAP Expense Text is Mandatory ..!");
      return false;
    }
    if (!reference || reference === null) {
      setFetch(true);
      toast.warning(" SAP Payment Text is Mandatory ..!");
      return false;
    }
    if (!invoicePostingDate || invoicePostingDate === null) {
      setFetch(true);
      toast.warning(" Posting Expense Date is Mandatory ..!");
      return false;
    }
    if (!invoicePostingDate1 || invoicePostingDate1 === null) {
      setFetch(true);
      toast.warning(" Posting Payment Date is Mandatory ..!");
      return false;
    }
    if (invoiceCopyAvailable) {
      //
    } else {
      if (invoiceCopy) {
        //
      } else {
        setFetch(true)
        toast.warning('You should attach invoice copy before submitting..!')
        return false
      }
    
   //   console.log(invoiceCopy.size, 'invoiceCopy')
      if (invoiceCopy.size <= 5000000) {
        //
      } else {
        setFetch(true)
        toast.warning('Attached invoice copy should not having size more than 5Mb..!')
        return false
      }
    }




 
  // console.log(values.payment_amt+"values.payment_amt")
  // console.log(payment_value+"payment_value")
  //console.log(singleContractorArray.freight_amount+"singleContractorArray.freight_amount")
    let form_data = new FormData()
    form_data.append('payment_id', id)
    form_data.append('updated_by', user_id)
    form_data.append('tds_having', tdsHaving == '1' ? 'YES' : 'NO')
    form_data.append('exp_reference_text', reference1)
    form_data.append('am_remarks', values.apremarks)
    form_data.append('gst_tax_type', values.gst_tax_type)
    form_data.append('tds_tax_type', values.tds_tax_type=='G'?'':values.tds_tax_type)
    form_data.append('tds_dec_value', tds_dec_value)
    form_data.append('gst_dec_value', gst_dec_value)
   // form_data.append('payment_value', payment_value)
 //   form_data.append('payment_value', payment_value)
    form_data.append('expense_amount', values.expense_amt)
    form_data.append('payment_amount', values.payment_amt)
    form_data.append('freight_type', values.freight_type)
    form_data.append('reference_text', reference)
    form_data.append('expense_posting_date', invoicePostingDate)
    form_data.append('payment_posting_date', invoicePostingDate1)
    form_data.append('status', 5)
    // form_data.append('invoice_posting_date', invoicePostingDate)
    form_data.append('invoice_copy', invoiceCopy)
    IfoodsExpenseClosureService.sendValidationApprovalAm(form_data).then((res)=>{
     // console.log(res,'sendValidationApproval')
      setFetch(true)
      
      if (res.status == 200) {
        Swal.fire({
          title: 'Payment Validation Completed Successfully!',
          icon: "success",
          text: 'Validation Request Sent to Payment Approval',
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/IfoodsPaymentValidationTableAc')
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
        toast.warning('Payment Submission Cannot be Updated. Kindly contact Admin..!')
      }
    })
    .catch((errortemp) => {
    //  console.log(errortemp)
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
                {singleContractorArray && singleContractorArray.vendor_info && (
                  <CRow className="m-2">
                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Invoice Sequence No.</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.invoice_sequence}
                        readOnly
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Vendor Name</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.vendor_info.vendor_name}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Vendor Code / Mobile No.</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={`${singleContractorArray.ifoods_Vendor_Code_info.vendor_code} / ${singleContractorArray.vendor_info.vendor_contact_no}`}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cname">Freight Type</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cname"
                        size="sm"
                        id="cname"
                        value={` ${singleContractorArray.vendor_info.freight_type == '2' ? "Actual" : "Budget"}`}
                        readOnly
                      />
                    </CCol>

                 

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Total Freight / Tripsheets Count </CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={`${singleContractorArray.freight_amount} / ${singleContractorArray.trip_info.length}`}
                        readOnly
                      />
                    </CCol>

                  
                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Payment Requested By</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.payment_user_info.emp_name}
                        readOnly
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Updated Additional Expense</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.updated_expense}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Submission Remarks</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.remarks}
                        readOnly
                        required
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">SCM - Remarks</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.scm_remarks}
                        readOnly
                        required
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">OH - Remarks</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.oh_remarks}
                        readOnly
                        required
                      />
                    </CCol>
                    <CCol md={3}>
                          <CFormLabel htmlFor="gst_tax_type">
                            GST Tax Type <REQ />{' '}
                            {errors.gst_tax_type && (
                              <span className="small text-danger">{errors.gst_tax_type}</span>
                            )}
                          </CFormLabel>
                     
                          <CFormSelect
                        size="sm"
                        name="gst_tax_type"
                        onChange={handleChange}
                        onFocus={onFocus}
                        value={values.gst_tax_type}
                        className={`mb-1 ${errors.gst_tax_type && 'is-invalid'}`}
                        aria-label="Small select example"
                        id="gst_tax_type"
                        required
                      >
                        <option value="0">Select ...</option>
                    
                        {gstTaxData &&
                          gstTaxData.map(({ definition_list_code, definition_list_name }) => {
                            if (definition_list_code) {
                              return (
                                <>
                                  <option key={definition_list_code} value={definition_list_code}>
                                    {definition_list_name}
                                  </option>
                                </>
                              )
                            }
                          })}
                      </CFormSelect>
                        </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="gst_dec_value">GST Tax Value</CFormLabel>
                      <CFormInput
                        name="gst_dec_value"
                        id="gst_dec_value"
                        value={gst_dec_value}
                        onChange={handleChange}
                        readOnly
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="tds_tax_type">
                        TDS Tax Type <REQ />{' '}
                        {errors.tds_tax_type && (
                          <span className="small text-danger">{errors.tds_tax_type}</span>
                        )}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="tds_tax_type"
                        onChange={handleChange}
                        onFocus={onFocus}
                        value={values.tds_tax_type}
                        className={`mb-1 ${errors.tds_tax_type && 'is-invalid'}`}
                        aria-label="Small select example"
                        id="tds_tax_type"
                        required
                      >
                        <option value="0">Select ...</option>
                        <option value="G">No Tax</option>
                        {tdsTaxData &&
                          tdsTaxData.map(({ definition_list_code, definition_list_name }) => {
                            if (definition_list_code) {
                              return (
                                <>
                                  <option key={definition_list_code} value={definition_list_code}>
                                    {definition_list_name}
                                  </option>
                                </>
                              )
                            }
                          })}
                       
                      </CFormSelect>
                    </CCol>



                    <CCol md={3}>
                      <CFormLabel htmlFor="tds_dec_value">TDS Deduction Value</CFormLabel>
                      <CFormInput
                        name="tds_dec_value"
                        id="tds_dec_value"
                        value={tds_dec_value}
                        onChange={handleChange}
                        readOnly
                      />
                    </CCol>
                   
                    <CCol md={3}>
                      <CFormLabel htmlFor="exemption">Exemption Value</CFormLabel>
                      <CFormInput  
                        name="exemption"
                        id="exemption"
                        value={exemption}
                        onChange={handleChange}
                        readOnly
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="payment_value">Actual Payment Value</CFormLabel>
                      <CFormInput
                        name="payment_value"
                        id="payment_value"
                        value={payment_value?payment_value:'0'}
                        onChange={handleChange}
                        readOnly
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="expense_amt">
                        Posting Expense Amount <REQ />{' '}
                        {errors.expense_amt && (
                          <span className="small text-danger">{errors.expense_amt}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="expense_amt"
                        id="expense_amt"
                        min={singleContractorArray.freight_amount}
                        max={singleContractorArray.freight_amount}
                        placeholder={singleContractorArray.freight_amount}
                        value={values.expense_amt}
                        onChange={handleChange}
                        required
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="payment_amt">
                        Posting Payment Amount <REQ />{' '}
                        {errors.payment_amt && (
                          <span className="small text-danger">{errors.payment_amt}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="payment_amt"
                        id="payment_amt"
                        min={payment_value}
                        max={singleContractorArray.freight_amount}
                        placeholder={payment_value}
                        value={values.payment_amt}
                        onChange={handleChange}
                        required
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="freight_type">
                        Freight Type <REQ />{' '}
                        {errors.freight_type && (
                          <span className="small text-danger">{errors.freight_type}</span>
                        )}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="freight_type"
                        onChange={handleChange}
                        onFocus={onFocus}
                        value={values.freight_type}
                        className={`mb-1 ${errors.freight_type && 'is-invalid'}`}
                        aria-label="Small select example"
                        id="freight_type"
                        required
                      >
                        <option value="0">Select...</option>
                        <option value="P">Primary</option>
                        <option value="S">Secondary</option>
                      </CFormSelect>
                    </CCol>

                    <CCol md={9}></CCol>
                    <CCol style={{textAlign:'end'}}>
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
                )}
                <CustomTable
                  columns={columns}
                  pagination={false}
                  data={rowData}
                  fieldName={'Driver_Name'}
                  showSearchFilter={true}
                />

                <CRow className="m-2">
               
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="reference1"> SAP - Expense Reference Text <REQ />{' '} </CFormLabel>
                    <CFormTextarea
                      name="reference1"
                      id="reference1"
                      rows="1"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChangeReference1}
                      value={reference1}
                    ></CFormTextarea>
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="reference">
                      SAP - Payment Reference Text
                      <REQ />{' '}
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
                      Expense Posting Date <REQ />{' '}
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
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="invoicePostingDate1">
                      Payment Posting Date <REQ />{' '}
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      type="date"
                      id="invoicePostingDate1"
                      name="invoicePostingDate1"
                      onChange={handleChangeInvoicePostingDate1}
                      min={Expense_Income_Posting_Date.min_date}
                      max={Expense_Income_Posting_Date.max_date}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      value={invoicePostingDate1}
                    />
                  </CCol>


                  <CCol xs={12} md={3}>
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
                  )}

                   <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="apremarks">
                      AM - Remarks
                      <REQ />{' '}
                    </CFormLabel>
                    <CFormInput
                      name="apremarks"
                      id="apremarks"
                      value={values.apremarks}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-2">
                  <CCol className="m-2" xs={12} sm={12} md={3}>
                    <CButton size="sm" color="primary" className="text-white" type="button">
                      <Link className="text-white" to="/IfoodsPaymentValidationTableAc">
                        Previous
                      </Link>
                    </CButton>
                  </CCol>
                  <CCol
                    className="offset-md-9"
                    // xs={12}
                    // sm={12}
                    // md={3}
                    // style={{ display: 'flex', justifyContent: 'space-between' }}
                    // style={{ display: 'flex', flexDirection: 'row-reverse', cursor: 'pointer' }}
                    // className="pull-right"
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
                  //    disabled={submitBtn}
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
                    <p className="lead">Are you sure to reject this Payment</p>
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

export default IfoodsPaymentValidationAc


