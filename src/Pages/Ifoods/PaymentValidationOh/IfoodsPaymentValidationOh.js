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
import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from '../CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import IfoodsExpenseClosureService from 'src/Service/Ifoods/ExpenseClosure/IfoodsExpenseClosureService'

const IfoodsPaymentValidationOh = () => {
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

  const exportToCSV = () => {
    // console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Depo_Payment_Validation_'+dateTimeString
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
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Payment_Approval_Oh

  /* Vehicle Current Position */
  const VEHICLE_CURRENT_POSITION = {
    DEPO_SHIPMENT_COMPLETED: 22,
    DEPO_EXPENSE_APPROVAL: 22,
    DEPO_SETTLEMENT_CLOSURE: 20
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

  const [tdsTaxData, setTdsTaxData] = useState([])
  useEffect(() => {

    /* section for getting TDS Tax Type Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {

     let viewData = response.data.data
    //  console.log(viewData,'viewData')
     setTdsTaxData(viewData)
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

  const deleteTripAllPayment = () => {
    const formDataUpdate = new FormData()

    formDataUpdate.append('id', id)
    formDataUpdate.append('created_by', user_id)
    formDataUpdate.append('oh_remarks', values.apremarks)
    IfoodsExpenseClosureService.rejectAllTripPaymentoh(formDataUpdate).then((res) => {
      console.log(res)
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: "Payment Rejected Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/IfoodsPaymentValidationOhTable')
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

  const deleteTripPayment = () => {
    console.log(tripPaymentDelete,'tripPaymentDelete')
    console.log(tripNoToDelete,'tripNoToDelete')
    console.log(tripIdToDelete,'tripIdToDelete')
    console.log(paymentAmountToDelete,'paymentAmountToDelete')
    console.log(shipmentIdToDelete,'shipmentIdToDelete')

    var editedFreightAmount = Number(singleContractorArray.freight_amount).toFixed(3) - Number(paymentAmountToDelete).toFixed(3)
    console.log(editedFreightAmount,'editedFreightAmount')

    const formDataForDBUpdate = new FormData()

    formDataForDBUpdate.append('shipment_id', shipmentIdToDelete)
    formDataForDBUpdate.append('updated_by', user_id)
    formDataForDBUpdate.append('trip_id', tripIdToDelete)
    formDataForDBUpdate.append('status', 3)
    formDataForDBUpdate.append('trip_no', tripNoToDelete)
    formDataForDBUpdate.append('freight_amount', editedFreightAmount)

    IfoodsExpenseClosureService.rejectSingleTripPayment(formDataForDBUpdate) .then((res) => {
      console.log(res)
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
        console.log(payment_info_id_data,'payment_info_id_data')
        values.apremarks = payment_info_id_data.approval_remarks ? payment_info_id_data.approval_remarks : ''
        payment_info_id_data.reference_text ? setReference(payment_info_id_data.reference_text) : setReference('')

        /* Set TDS Having Value */
        payment_info_id_data.tds_having == 'YES' ? setTdsHaving(1) : (!(payment_info_id_data.vendor_info.tds_tax_type == null || payment_info_id_data.vendor_info.tds_tax_type == 'Empty') ? setTdsHaving(1) : setTdsHaving(0))

        let a = payment_info_id_data.invoice_copy
        if(!a || a.substr((a.length - 1)) == '/'){
          setInvoiceCopyAvailable(false)
        } else {
          setInvoiceCopyAvailable(true)
        }
        setSingleContractorArray(payment_info_id_data)
        //console.log(payment_info_id_data+'singleContractorArray')
      })
    
    }, [id])
  

  useEffect(() => {

      IfoodsExpenseClosureService.getSettlementValidationInfoById(id).then((res) => {
        setFetch(true)
        let payment_info_data = res.data.data
        console.log(payment_info_data,'closure_info_data')
        setSettlementClosureData(payment_info_data)
        let vendor_info_data = payment_info_data.ifoods_Vendor_info
        setContractorInfo(vendor_info_data)
        values.remarks = payment_info_data.remarks
        let rowDataList = []
        payment_info_data.map((data, index) => {
          let fm = data.closure_info.total_expenses
          let ae = data.closure_info.freight_charges
       let additionalexpense = fm - ae
        console.log(fm+"-"+ae+"="+additionalexpense)
          rowDataList.push({
            S_NO: index + 1,
            Depo_Location:data.vehicle_location_info.location,
            Contractor_Name: data.ifoods_Vendor_info.vendor_name,
            Contractor_Code: data.ifoods_Vendor_info.vendor_code,
            Contractor_Number: data.ifoods_Vendor_info.vendor_contact_no,
            Shipment_No: data.tripsheet_info[0].shipment_po,
            Tripsheet: data.tripsheet_info[0].ifoods_tripsheet_no,
            GateIn_Date: data.created_date,
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
              <Link className='text-black' target='_blank' to={`/IfoodsPaymentValidationOhTable/IfoodsPaymentValidationOhChild/${data.closure_info.closure_id}`}>
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
                  <Link className="text-white" target='_blank' to={`/IfoodsPaymentValidationTable/IfoodsPaymentValidationChild/${data.closure_info.closure_id}`}>
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
      name: 'Loading Point In',
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
      name: 'Additional Freight',
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


    let form_data = new FormData()
    form_data.append('payment_id', id)
    form_data.append('updated_by', user_id)
    form_data.append('tds_having', tdsHaving == '1' ? 'YES' : 'NO')
    form_data.append('oh_remarks', values.apremarks)
    form_data.append('reference_text', reference)
    form_data.append('status', 3)
    // form_data.append('invoice_posting_date', invoicePostingDate)
    form_data.append('invoice_copy', invoiceCopy)
    IfoodsExpenseClosureService.ohsendValidationApproval(form_data).then((res)=>{
      console.log(res,'sendValidationApproval')
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: 'Payment Approval Completed Successfully!',
          icon: "success",
          text: 'Payment Process Send To Accounts Team',
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/IfoodsPaymentValidationOhTable')
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
                        value={`${singleContractorArray.vendor_info.freight_type == '2' ? "Actual" : "Budget"}`}
                        readOnly
                      />
                    </CCol>

                    {/* <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Contractor Mobile Number</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.vendor_info.vendor_number}
                        readOnly
                      />
                    </CCol> */}

                    {/* <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Contractor Freight Type</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.vendor_info.freight_type == '2' ? "Budget" : "Actual"}
                        readOnly
                      />
                    </CCol> */}

                    {/* <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Tripsheets Count</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleContractorArray.trip_info.length}
                        readOnly
                      />
                    </CCol> */}

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

                    {/* <CCol md={3}>
                      <CFormLabel htmlFor="cmn">GST Tax Type</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={getGstTax(singleContractorArray.vendor_info.gst_tax_type)}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">TDS Tax Type</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={getTdsTax(singleContractorArray.vendor_info.tds_tax_type)}
                        readOnly
                      />
                    </CCol> */}

                    {/* <CCol md={3}>
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
                    </CCol> */}

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
                      />
                    </CCol>

                    <CCol md={2}></CCol>
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
                    {/* <CFormLabel htmlFor="apremarks">Validation / Approval Remarks</CFormLabel> */}
                    <CFormLabel htmlFor="apremarks"> OH - Remarks </CFormLabel>
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
                  {/* <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="reference">
                      SAP - Reference Text
                    </CFormLabel>
                    <CFormInput
                      name="reference"
                      id="reference"
                      value={reference}
                      onChange={handleChangeReference}
                    />
                  </CCol> */}

                  {/* <CCol xs={12} md={3}>
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
                  </CCol> */}

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
                  </CCol> */}
                  {/* {invoiceCopyAvailable && (
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
                    </CCol> */}
                  {/* )} */}
                </CRow>
                <CRow className="mt-2">
                  <CCol className="m-2" xs={12} sm={12} md={3}>
                    <CButton size="sm" color="primary" className="text-white" type="button">
                      <Link className="text-white" to="/IfoodsPaymentValidationOhTable">
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

export default IfoodsPaymentValidationOh


