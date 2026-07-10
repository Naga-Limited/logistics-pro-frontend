/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCardImage,
  CCol,
  CFormInput,
  CFormLabel, 
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow, 
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import Loader from 'src/components/Loader'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes' 
import useFormDepoExpenseClosure from 'src/Hooks/useFormDepoExpenseClosure';
import LocationApi from 'src/Service/SubMaster/LocationApi';
import Swal from 'sweetalert2';
import CustomTable from 'src/components/customComponent/CustomTable';
import { GetDateTimeFormat } from 'src/Pages/Nlmt/CommonMethods/CommonMethods';
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import NlmtTripSheetClosureService from 'src/Service/Nlmt/TripSheetClosure/NlmtTripSheetClosureService'

const NlmtSettlementValidation = () => {

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
    let fileName = 'NLMT_Payment_Validation_' + dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
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
  let page_no = NlmtScreenAccessCodes.NlmtClosureScreens.Nlmt_Payment_Validation

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
      console.log(viewData, 'viewData')
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

  }, [id])

  const [totalTonnage, setTotalTonnage] = useState(0)

  const [TaxType, setTaxType] = useState([])
  const [gstType, setGstType] = useState([])
  useEffect(() => {

    // First API call
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      let tableData = response.data.data;

      const filterData = tableData.filter(
        (data) => data.definition_list_status == 1
      );

      setTaxType(filterData);
    });

    // Second API call
    DefinitionsListApi.visibleDefinitionsListByDefinition(20).then((response) => {
      let viewData = response.data.data;

      console.log(viewData, "setGstTaxTermsData");

      setGstType(viewData);
    });

  }, []);
  
  const totalRateFinder = (type, data, deduction) => {

    // let freight = tdsRateFinder(type,data)
    let freight = 0

    if(type == 1){
      freight = balanceFreight(data.advance_payment_info.sap_freight_payment_amount,data.advance_payment_info.sap_bank_payment_amount)
    } else {
      freight = data.trip_settlement_info.sap_expense_amount
    }

    let frt = Number(parseFloat(freight).toFixed(2))
    let ded = Number(parseFloat(deduction).toFixed(2))

    let rate = Number(parseFloat(frt - ded).toFixed(2))
    console.log(rate,'totalRateFinder-rate')
    return rate
  }

  const tdsRateFinder = (type, data) => {
    console.log(data,'tdsRateFinder-data')
    let frt = 0
    if(type == 1){
      frt = data.advance_payment_info.sap_freight_payment_amount
    } else {
      frt = data.trip_settlement_info.sap_expense_amount
    }
    console.log(frt,'tdsRateFinder-frt')
    return frt
  }

  const balanceFreight = (a,b) => {

    if(!a || !b)
      return 0

    let freight = Number(parseFloat(a).toFixed(2))
    let advance = Number(parseFloat(b).toFixed(2))

    let frt = Number(parseFloat(freight - advance).toFixed(2))
    console.log(frt,'balanceFreight-frt')
    return frt

  }

  const deleteTripAllPayment = () => {
    const formDataUpdate = new FormData()

    formDataUpdate.append('id', id)
    formDataUpdate.append('created_by', user_id)
    formDataUpdate.append('remarks', values.apremarks)
    NlmtTripSheetClosureService.rejectAllTripPayment(formDataUpdate).then((res) => {
      console.log(res)
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: "Payment Rejected Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/NlmtSettlementValidationTable')
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
    console.log(tripPaymentDelete, 'tripPaymentDelete')
    console.log(tripNoToDelete, 'tripNoToDelete')
    console.log(tripIdToDelete, 'tripIdToDelete')
    console.log(paymentAmountToDelete, 'paymentAmountToDelete')
    console.log(shipmentIdToDelete, 'shipmentIdToDelete')

    var editedFreightAmount = Number(singleVendorArray.freight_amount).toFixed(3) - Number(paymentAmountToDelete).toFixed(3)
    console.log(editedFreightAmount, 'editedFreightAmount')

    const formDataForDBUpdate = new FormData()

    formDataForDBUpdate.append('shipment_id', shipmentIdToDelete)
    formDataForDBUpdate.append('updated_by', user_id)
    formDataForDBUpdate.append('trip_id', tripIdToDelete)
    formDataForDBUpdate.append('status', 3)
    formDataForDBUpdate.append('trip_no', tripNoToDelete)
    formDataForDBUpdate.append('freight_amount', editedFreightAmount)

    // NlmtTripSheetClosureService.rejectSingleTripPayment(formDataForDBUpdate).then((res) => {
    //   console.log(res)
    // })

  }

  const [fetch, setFetch] = useState(false)

  const [contractorInfo, setContractorInfo] = useState([])

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  /* ===================== The Constants Needed For First Render Part Start ===================== */

  const [settlementClosureData, setSettlementClosureData] = useState([])
  const [singleVendorArray, setSingleVendorArray] = useState([])
  const [visible, setVisible] = useState(false)
  const [invoiceCopyAvailable, setInvoiceCopyAvailable] = useState(false)

  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */

  useEffect(() => {

    NlmtTripSheetClosureService.getPaymentInfoById(id).then((res) => {
      let payment_info_id_data = res.data.data
      console.log(payment_info_id_data, 'payment_info_id_data')
      values.apremarks = payment_info_id_data.approval_remarks ? payment_info_id_data.approval_remarks : ''
      payment_info_id_data.reference_text ? setReference(payment_info_id_data.reference_text) : setReference('')

      let a = payment_info_id_data.invoice_copy
      if (!a || a.substr((a.length - 1)) == '/') {
        setInvoiceCopyAvailable(false)
      } else {
        setInvoiceCopyAvailable(true)
      }
      setSingleVendorArray(payment_info_id_data)
    })

  }, [id])
  console.log(singleVendorArray, "singleVendorArray")

  useEffect(() => {

    NlmtTripSheetClosureService.getSettlementValidationInfoById(id).then((res) => {
      setFetch(true)
      // Response is an ARRAY — each element is one parking-yard/trip record
      let payment_info_data = res.data.data
      console.log(payment_info_data, 'closure_info_data')
      setSettlementClosureData(payment_info_data)

      // Set vendor & remarks from the first record
      if (payment_info_data.length > 0) {
        setContractorInfo(payment_info_data[0].vendor_info)
        values.remarks = payment_info_data[0].trip_settlement_info
          ? payment_info_data[0].trip_settlement_info.remarks
          : ''
      }

      let rowDataList = []
      let tot_ton = 0

      // Iterate over the top-level array; each item has its own tripsheet/settlement/vehicle_assignment
      payment_info_data.map((data, index) => {
        const tripsheetInfo = data.tripsheet_info || {}
        const tripSettlement = data.trip_settlement_info || {}
        const vehicleInfo = data.vehicle_info || {} 
        const advanceAmount = data.advance_payment_info?.advance_payment || '0'
        const settlementInfo = data.trip_settlement_info || {}  
        // Use first vehicle_assignment item for shipment details
        const assignment = data.vehicle_assignment && data.vehicle_assignment.length > 0
          ? data.vehicle_assignment[0]
          : {}

        let qty_ton = assignment.shipment_net_qty && Number(assignment.shipment_net_qty) != 0
          ? Number(parseFloat(assignment.shipment_net_qty).toFixed(3))
          : parseFloat(assignment.shipment_qty || 0)
        console.log(qty_ton, 'qty_ton')
        tot_ton += Number(parseFloat(qty_ton).toFixed(3))

        rowDataList.push({
          sno: index+1,          
          Tripsheet: tripsheetInfo.nlmt_tripsheet_no || '-',
          Shipment_No: assignment.shipment_no || '-',
          GateIn_Date: data.created_date || '-',
          Tripsheet_Date: tripsheetInfo.created_date || '-',
          Expense_Date: tripSettlement.created_date || '-',
          Vehicle_No: vehicleInfo.vehicle_number || assignment.vehicle_number || '-',
          Driver_Name: data.driver_name || '-',
          Driver_Number: String(data.driver_phone_1 || '-'),   
          expenseAmount: Number(settlementInfo.expense),
          expenseGstTdsTax: `${(settlementInfo.gst_tax_type && settlementInfo.gst_tax_type != 'Empty') ? settlementInfo.gst_tax_type : '-'} / ${settlementInfo.tds_having == 1 ?  settlementInfo.vendor_tds : '-'}`, 
          expTdsPayment_100: tdsRateFinder(singleVendorArray.freight_percentage == 10 ? 1 : 2, data),
          expTdsPayment_10: singleVendorArray.freight_percentage == 10 ? balanceFreight(data.advance_payment_info.sap_freight_payment_amount,data.advance_payment_info.sap_bank_payment_amount) : '-',
          expenseDeduction: Number(settlementInfo.diversion_return_charges),
          expPayment: totalRateFinder(singleVendorArray.freight_percentage == 10 ? 1 : 2,data,data.trip_settlement_info.diversion_return_charges),
          Shipment_Net_Qty: assignment.shipment_net_qty || '-', 
          Screen_Duration: data.vehicle_current_position_updated_time || '-',
          Overall_Duration: data.created_at || '-',
          Tripsheet_No: (
            <Link
              className='text-black'
              target='_blank'
              to={`/NlmtSettlementClosureInfo/${data.nlmt_trip_in_id}`}
            >
              <u><strong>{tripsheetInfo.nlmt_tripsheet_no}</strong></u>
            </Link>
          ),  
          S_NO: (
            <a style={{color:'black'}} target='_blank' rel="noreferrer" href={data.trip_settlement_info.expense_form}>
              <u><strong>{index+1}</strong></u>
            </a>  
          ),
        })
        console.log(tot_ton, 'totTon', index)
      })

      let totTon = Number(parseFloat(tot_ton).toFixed(3))
      console.log(totTon, 'totTon-tot')
      setTotalTonnage(totTon)
      setRowData(rowDataList)
    })

  }, [id, singleVendorArray.length == 0])

  const DepoTripSettlementValidationCancel = () => {
    console.log(values.apremarks, 'apremarks')
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
      // sortable: true,
      center: true,
    },
    {
      name: 'TripSheet',
      selector: (row) => row.Tripsheet_No,
      // sortable: true,
      center: true,
    },
    {
      name: 'Shipment',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    }, 
    {
      name: 'GateIn',
      selector: (row) => row.GateIn_Date,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Truck No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Driver',
    //   selector: (row) => row.Driver_Name,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Ship. Qty',
    //   selector: (row) => row.Shipment_Qty,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Ship. Qty',
      selector: (row) => row.Shipment_Net_Qty,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight',
      selector: (row) => row.expenseAmount,
      sortable: true,
      center: true,
    }, 
    {
      name: 'GST/TDS',
      selector: (row) => row.expenseGstTdsTax,
      sortable: true,
      center: true,
    },
    {
      name: '100 % Amt.',
      selector: (row) => row.expTdsPayment_100,
      sortable: true,
      center: true,
    },
    {
      name: '10 % Amt.',
      selector: (row) => row.expTdsPayment_10,
      sortable: true,
      center: true,
    },
    {
      name: 'Deduction',
      selector: (row) => row.expenseDeduction,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Payment',
      selector: (row) => row.expPayment, 
      center: true,
    }, 
    // {
    //   name: 'Expense Date',
    //   selector: (row) => row.Expense_Date,
    //   sortable: true,
    //   center: true,
    // }, 
  ]

  const validationApproval = () => {

    console.log(invoiceCopy, 'invoiceCopy')

    if (invoiceCopyAvailable) {
      //
    } else {
      if (invoiceCopy) {
        //
      } else {
        // setFetch(true)
        // toast.warning('You should attach invoice copy before submitting..!')
        // return false
      }

      console.log(invoiceCopy.size, 'invoiceCopy')
      if (invoiceCopy.size <= 5000000 || !invoiceCopy) {
        //
      } else {
        setFetch(true)
        toast.warning('Attached invoice copy should not having size more than 5Mb..!')
        return false
      }
    }

    let form_data = new FormData()
    form_data.append('payment_id', id)
    form_data.append('updated_by', user_id)
    // form_data.append('tds_having', tdsHaving == '1' ? 'YES' : 'NO')
    // form_data.append('vendor_tds', tdsHaving == '1' ? tdsValue : '')
    form_data.append('remarks', values.apremarks)
    form_data.append('reference_text', reference)
    form_data.append('status', 3)
    // form_data.append('invoice_posting_date', invoicePostingDate)
    form_data.append('invoice_copy', invoiceCopy)
    NlmtTripSheetClosureService.sendValidationApproval(form_data).then((res) => {
      console.log(res, 'sendValidationApproval')
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: 'Payment Validation Completed Successfully!',
          icon: "success",
          text: 'Validation Request Sent to Payment Approval',
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/NlmtSettlementValidationTable')
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
        toast.warning('Payment Validation Cannot be Updated. Kindly contact Admin..!')
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
                {singleVendorArray && (
                  <CRow className="m-2">
                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Invoice Sequence No.</CFormLabel>
                      <CFormInput
                        style={{ fontWeight: 'bolder' }}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleVendorArray.invoice_sequence}
                        readOnly
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Vendor Name</CFormLabel>
                      <CFormInput
                        style={{ fontWeight: 'bolder' }}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleVendorArray.vendor_info ? singleVendorArray.vendor_info.owner_name : ''}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Vendor Code / Mobile No.</CFormLabel>
                      <CFormInput
                        style={{ fontWeight: 'bolder' }}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={`${singleVendorArray.vendor_info ? singleVendorArray.vendor_info.vendor_code : ''} / ${singleVendorArray.vendor_info ? singleVendorArray.vendor_info.owner_number : ''}`}

                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Tripsheet Count / Freight %</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={`${singleVendorArray.trip_info.length} / ${singleVendorArray.freight_percentage} %`}
                        readOnly
                      />
                    </CCol>  

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Total Qty. in MTS </CFormLabel>
                      <CFormInput
                        style={{ fontWeight: 'bolder' }}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleVendorArray.shipment_qty}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Total Payment</CFormLabel>
                      <CFormInput
                        style={{ fontWeight: 'bolder' }}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={`${singleVendorArray.freight_amount}`}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Payment Requested By</CFormLabel>
                      <CFormInput
                        style={{ fontWeight: 'bolder' }}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleVendorArray.payment_user_info.emp_name}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Payment Remarks</CFormLabel>
                      <CFormInput
                        style={{ fontWeight: 'bolder' }}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleVendorArray.remarks}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}></CCol>
                    <CCol md={3}></CCol>
                    <CCol md={3}></CCol>
                    <CCol md={3} style={{ textAlign: 'end' }}>
                      {/* <CFormLabel htmlFor="cmn">.</CFormLabel> */}
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        style={{ marginTop: '10%' }}
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

                <CRow className="m-4">
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

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="invoiceCopy">
                      Invoice Attachment  
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
                          {singleVendorArray.invoice_copy &&
                            !singleVendorArray.invoice_copy.includes('.pdf') ? (
                            <CCardImage
                              orientation="top"
                              src={singleVendorArray.invoice_copy}
                            />
                          ) : (
                            <iframe
                              orientation="top"
                              height={500}
                              width={475}
                              src={singleVendorArray.invoice_copy}
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
                </CRow>
                <CRow className="mt-2">
                  <CCol className="m-2" xs={12} sm={12} md={3}>
                    <CButton size="sm" color="primary" className="text-white" type="button">
                      <Link className="text-white" to="/NlmtSettlementValidationTable">
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
                      style={{ background: 'red' }}
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
                      style={{ background: 'green' }}
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
                        <CInputGroup style={{ width: '80%' }} >
                          <CInputGroupText
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                              width: '60%',
                            }}
                          >
                            Previous Trip Freight Amount
                          </CInputGroupText>
                          <CFormInput readOnly value={Number(singleVendorArray.freight_amount).toFixed(3)} />
                        </CInputGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xs>
                        <CInputGroup style={{ width: '80%' }} >
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
                        <CInputGroup style={{ width: '80%' }} >
                          <CInputGroupText
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                              width: '60%',
                            }}
                          >
                            Updated Trip Freight Amount
                          </CInputGroupText>
                          <CFormInput readOnly value={(Number(singleVendorArray.freight_amount).toFixed(3) - Number(paymentAmountToDelete).toFixed(3)).toFixed(3)} />
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
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default NlmtSettlementValidation
