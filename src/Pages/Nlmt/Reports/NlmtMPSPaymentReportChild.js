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
import useFormDepoExpenseClosure from 'src/Hooks/useFormDepoExpenseClosure'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import Swal from 'sweetalert2'
import CustomTable from 'src/components/customComponent/CustomTable'
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import { GetDateTimeFormat } from 'src/Pages/Nlmt/CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import NlmtTripSheetClosureService from 'src/Service/Nlmt/TripSheetClosure/NlmtTripSheetClosureService'

const NlmtMPSPaymentReportChild = () => {

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
  const [invoicePostingDate, setInvoicePostingDate] = useState('')
  const [invoiceCopy, setInvoiceCopy] = useState('')
  const [tdsHaving, setTdsHaving] = useState(0)
  const REQ = () => <span className="text-danger"> * </span>

  const handleChangeInvoicePostingDate = (event) => {
    let vall = event.target.value
    console.log('handleChangeInvoicePostingDate', vall)
    setInvoicePostingDate(vall)
  }

  const border = {
    borderColor: '#b1b7c1',
  }

  const tdsRateFinder = (type, data) => {

    let frt = 0
    if(type == 1){
      frt = data.advance_payment_info.sap_freight_payment_amount
    } else {
      frt = data.trip_settlement_info.sap_expense_amount
    }
    console.log(frt,'tdsRateFinder-frt')
    return frt
  }

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

  const balanceFreight = (a,b) => {

    if(!a || !b)
      return 0

    let freight = Number(parseFloat(a).toFixed(2))
    let advance = Number(parseFloat(b).toFixed(2))

    let frt = Number(parseFloat(freight - advance).toFixed(2))
    console.log(frt,'balanceFreight-frt')
    return frt

  }

  const exportToCSV = () => {
    // console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'NLMT_Payment_Approval_' + dateTimeString
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const ws = XLSX.utils.json_to_sheet(rowData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate()

  const { id } = useParams()
  const [rowData, setRowData] = useState([])
  const [locationData, setLocationData] = useState([])

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = NlmtScreenAccessCodes.NlmtReportScreens.NLMT_Payment_Report

  useEffect(() => {
    if (
      user_info.is_admin == 1 ||
      JavascriptInArrayComponent(page_no, user_info.page_permissions)
    ) {
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else {
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    } 
  }, [])
  /* ==================== Access Part End ========================*/

  const formValues = {
    halt_days: '',
    remarks: '',
    apremarks: '',
  }

  /* Overall Journey Information Constants */
  const [pmData, setPMData] = useState([])

  const [visible, setVisible] = useState(false)
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

  const [fetch, setFetch] = useState(false)
  const [vendorInfo, setVendorInfo] = useState([])

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  /* ===================== The Constants Needed For First Render Part Start ===================== */

  const [settlementClosureData, setSettlementClosureData] = useState([]) 

  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */

  // useEffect(() => {
  //   NlmtTripSheetClosureService.getPaymentInfoById(id).then((res) => {
  //     let payment_info_id_data = res.data.data
  //     console.log(payment_info_id_data, 'payment_info_id_data')
  //     setSingleVendorArray(payment_info_id_data)
  //   })
  // }, [id])
  // console.log(singleVendorArray, 'singleVendorArray')

  // const [totalTonnage, setTotalTonnage] = useState(0)

  // useEffect(() => {
  //   NlmtTripSheetClosureService.getSettlementApprovalInfoById(id).then((res) => {
  //     setFetch(true)
  //     // Response is an ARRAY — each element is one parking-yard/trip record
  //     let payment_info_data = res.data.data
  //     console.log(payment_info_data, 'closure_info_data')
  //     setSettlementClosureData(payment_info_data)

  //     // Set vendor & remarks from the first record
  //     if (payment_info_data.length > 0) {
  //       setVendorInfo(payment_info_data[0].vendor_info)
  //       values.remarks = payment_info_data[0].trip_settlement_info
  //         ? payment_info_data[0].trip_settlement_info.remarks
  //         : ''
  //     }

  //     let rowDataList = []
  //     let tot_ton = 0

  //     // Iterate over the top-level array; each item has its own tripsheet/settlement/vehicle_assignment
  //     payment_info_data.map((data, index) => {
  //       const tripsheetInfo = data.tripsheet_info || {}
  //       const tripSettlement = data.trip_settlement_info || {}
  //       const vehicleInfo = data.vehicle_info || {} 
  //       const advanceAmount = data.advance_payment_info?.advance_payment || '0'
  //       const settlementInfo = data.trip_settlement_info || {}  
  //       // Use first vehicle_assignment item for shipment details
  //       const assignment = data.vehicle_assignment && data.vehicle_assignment.length > 0
  //         ? data.vehicle_assignment[0]
  //         : {}

  //       let qty_ton = assignment.shipment_net_qty && Number(assignment.shipment_net_qty) != 0
  //         ? Number(parseFloat(assignment.shipment_net_qty).toFixed(3))
  //         : parseFloat(assignment.shipment_qty || 0)
  //       console.log(qty_ton, 'qty_ton')
  //       tot_ton += Number(parseFloat(qty_ton).toFixed(3))

  //       rowDataList.push({
  //         S_NO: (
  //           <Link
  //             className='text-black'
  //             target='_blank'
  //             to={`/${data.trip_settlement_info.expense_form}`}
  //           >
  //             <u><strong>{index+1}</strong></u>
  //           </Link>
  //         ),
           
  //         Tripsheet: tripsheetInfo.nlmt_tripsheet_no || '-',
  //         Shipment_No: assignment.shipment_no || '-',
  //         GateIn_Date: data.created_date || '-',
  //         Tripsheet_Date: tripsheetInfo.created_date || '-',
  //         Expense_Date: tripSettlement.created_date || '-',
  //         Vehicle_No: vehicleInfo.vehicle_number || assignment.vehicle_number || '-',
  //         Driver_Name: data.driver_name || '-',
  //         Driver_Number: String(data.driver_phone_1 || '-'),   
  //         expenseAmount: Number(settlementInfo.expense),
  //         expenseGstTdsTax: `${(settlementInfo.gst_tax_type && settlementInfo.gst_tax_type != 'Empty') ? settlementInfo.gst_tax_type : '-'} / ${settlementInfo.tds_having == 1 ?  settlementInfo.vendor_tds : '-'}`, 
  //         expTdsPayment_100: tdsRateFinder(singleVendorArray.freight_percentage == 10 ? 1 : 2, data),
  //         expTdsPayment_10: singleVendorArray.freight_percentage == 10 ? balanceFreight(data.advance_payment_info.sap_freight_payment_amount,data.advance_payment_info.sap_bank_payment_amount) : '-',
  //         expenseDeduction: Number(settlementInfo.diversion_return_charges),
  //         expPayment: totalRateFinder(singleVendorArray.freight_percentage == 10 ? 1 : 2,data,data.trip_settlement_info.diversion_return_charges),
  //         Shipment_Net_Qty: assignment.shipment_net_qty || '-', 
  //         Screen_Duration: data.vehicle_current_position_updated_time || '-',
  //         Overall_Duration: data.created_at || '-',
  //         Tripsheet_No: (
  //           <Link
  //             className="text-black"
  //             target="_blank"
  //             to={`/NlmtSettlementClosureInfo/${data.nlmt_trip_in_id}`}
  //           >
  //             <u>
  //               <strong>{tripsheetInfo.nlmt_tripsheet_no}</strong>
  //             </u>
  //           </Link>
  //         ),
          
         
  //       })
  //       console.log(tot_ton, 'totTon', index)
  //     })
  //     let totTon = Number(parseFloat(tot_ton).toFixed(3))
  //     console.log(totTon, 'totTon-tot')
  //     setTotalTonnage(totTon)
  //     setRowData(rowDataList)
  //   })
  // }, [id]) //singleVendorArray.length == 0

  const [singleVendorArray, setSingleVendorArray] = useState({})
  const [totalTonnage, setTotalTonnage] = useState(0)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const [paymentRes, settlementRes] = await Promise.all([
          NlmtTripSheetClosureService.getPaymentInfoById(id),
          NlmtTripSheetClosureService.getNlmtSettlementApprovalInfoById(id),
        ]);

        const vendorData = paymentRes?.data?.data || {}
        const closureData = settlementRes?.data?.data || []

        console.log("dd payment_info_id_data", vendorData)
        console.log("dd closure_info_data", closureData)

        setSingleVendorArray(vendorData)
        setSettlementClosureData(closureData)

        if (closureData.length > 0) {
          setVendorInfo(closureData[0]?.vendor_info || {})

          values.remarks =
            closureData[0]?.trip_settlement_info?.remarks || ""
        }

        const freightType =
          vendorData?.freight_percentage == 10 ? 1 : 2

        const rowDataList = closureData.map((data, index) => {
          const tripsheetInfo = data?.tripsheet_info || {}
          const tripSettlement = data?.trip_settlement_info || {}
          const vehicleInfo = data?.vehicle_info || {}
          const advanceInfo = data?.advance_payment_info || {}
          const assignment = data?.vehicle_assignment?.[0] || {}

          return {
            S_NO: index + 1,
            Tripsheet: tripsheetInfo?.nlmt_tripsheet_no || "-",
            Shipment_No: assignment?.shipment_no || "-",
            GateIn_Date: data?.created_date || "-",
            Tripsheet_Date: tripsheetInfo?.created_date || "-",
            Expense_Date: tripSettlement?.created_date || "-",

            Vehicle_No:
              vehicleInfo?.vehicle_number ||
              assignment?.vehicle_number ||
              "-",

            Driver_Name: data?.driver_name || "-",
            Driver_Number: String(data?.driver_phone_1 || "-"),

            expenseAmount: Number(tripSettlement?.expense || 0),

            expenseGstTdsTax: `${
              tripSettlement?.gst_tax_type &&
              tripSettlement?.gst_tax_type != "Empty"
                ? tripSettlement?.gst_tax_type
                : "-"
            } / ${
              tripSettlement?.tds_having == 1
                ? tripSettlement?.vendor_tds
                : "-"
            }`,

            expTdsPayment_100: tdsRateFinder(
              freightType,
              data
            ),

            expTdsPayment_10:
              vendorData?.freight_percentage == 10
                ? balanceFreight(
                    advanceInfo?.sap_freight_payment_amount,
                    advanceInfo?.sap_bank_payment_amount
                  )
                : "-",

            expenseDeduction: Number(
              tripSettlement?.diversion_return_charges || 0
            ),

            expPayment: totalRateFinder(
              freightType,
              data,
              tripSettlement?.diversion_return_charges
            ),

            Shipment_Net_Qty:
              assignment?.shipment_net_qty || "-",

            Screen_Duration:
              data?.vehicle_current_position_updated_time || "-",

            Overall_Duration: data?.created_at || "-",

            Tripsheet_No: (
              <Link
                className="text-black"
                target="_blank"
                to={`/NlmtSettlementClosureInfo/${data?.nlmt_trip_in_id}`}
              >
                <u>
                  <strong>
                    {tripsheetInfo?.nlmt_tripsheet_no || "-"}
                  </strong>
                </u>
              </Link>
            ), 
            Advance_Form: advanceInfo ? (
              <a style={{color:'black'}} target='_blank' rel="noreferrer" href={advanceInfo.advance_form}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </a> 
            ) : '-',
            Expense_Form: (
              <a style={{color:'black'}} target='_blank' rel="noreferrer" href={tripSettlement?.expense_form}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </a>  
            ),
          }
        })

        const totalTon = closureData.reduce((sum, data) => {
          const assignment = data?.vehicle_assignment?.[0] || {}

          const qty =
            assignment?.shipment_net_qty &&
            Number(assignment.shipment_net_qty) !== 0
              ? Number(
                  parseFloat(
                    assignment.shipment_net_qty
                  ).toFixed(3)
                )
              : Number(assignment?.shipment_qty || 0)

          return sum + qty
        }, 0)

        setTotalTonnage(Number(totalTon.toFixed(3)))
        setRowData(rowDataList)
        setFetch(true)
      } catch (error) {
        console.error("Error fetching closure data:", error);
      }
    }

    fetchData()
  }, [id])

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
      name: 'Adv. Form',
      selector: (row) => row.Advance_Form,
      // sortable: true,
      center: true,
    },
    {
      name: 'Exp. Form',
      selector: (row) => row.Expense_Form,
      // sortable: true,
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

  

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard className="p-1">
                {singleVendorArray && (
                  <>
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
                        <CFormLabel htmlFor="cmn">Payment Request By</CFormLabel>
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
                        <CFormLabel htmlFor="cmn">Payment Request Time</CFormLabel>
                        <CFormInput
                          style={{ fontWeight: 'bolder' }}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={singleVendorArray.creation_time}
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Payment Request Remarks</CFormLabel>
                        <CFormInput
                          style={{ fontWeight: 'bolder' }}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={singleVendorArray.remarks}
                          readOnly
                        />
                      </CCol> 
                      {singleVendorArray.validation_by && (
                        <>

                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">Invoice Copy</CFormLabel>
                            
                            <CButton
                              onClick={() => setVisible(!visible)}
                              className="w-100 m-0"
                              color="info"
                              size="sm"
                              id="odoImg"
                              style={border}
                            >
                               
                              <span className="float-start"> 
                                {singleVendorArray.invoice_copy ? (
                                  <>
                                    <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                                  </>
                                ) : <> {'Not Attached.'} </>
                                }
                              </span>
                            </CButton>
                            <CModal visible={visible} onClose={() => setVisible(false)}>
                              <CModalHeader>
                                <CModalTitle>Payment Invoice Copy</CModalTitle>
                              </CModalHeader>

                              <CModalBody>
                                {singleVendorArray.invoice_copy &&
                                !singleVendorArray.invoice_copy.includes('.pdf') ? (
                                  <CCardImage orientation="top" src={singleVendorArray.invoice_copy} />
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

                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">Validation By</CFormLabel>
                            <CFormInput
                              style={{ fontWeight: 'bolder' }}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleVendorArray.payment_validation_user_info.emp_name}
                              readOnly
                            />
                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">Validation Time</CFormLabel>
                            <CFormInput
                              style={{ fontWeight: 'bolder' }}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleVendorArray.validation_time}
                              readOnly
                            />
                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">Validation Remarks</CFormLabel>
                            <CFormInput
                              style={{ fontWeight: 'bolder' }}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleVendorArray.validation_remarks || '-'}
                              readOnly
                            />
                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">SAP Reference Text</CFormLabel>
                            <CFormInput
                              style={{ fontWeight: 'bolder' }}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleVendorArray.reference_text || '-'}
                              readOnly
                            />
                          </CCol>
                        </>
                      )}
                      {singleVendorArray.approval_by ? (
                        <>
                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">Approval By</CFormLabel>
                            <CFormInput
                              style={{ fontWeight: 'bolder' }}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleVendorArray.payment_approval_user_info.emp_name}
                              readOnly
                            />
                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">Approval Time</CFormLabel>
                            <CFormInput
                              style={{ fontWeight: 'bolder' }}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleVendorArray.approval_time}
                              readOnly
                            />
                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">Approval Remarks</CFormLabel>
                            <CFormInput
                              style={{ fontWeight: 'bolder' }}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleVendorArray.approval_remarks || '-'}
                              readOnly
                            />
                          </CCol>
                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">SAP Invoice Posting Date</CFormLabel>
                            <CFormInput
                              style={{ fontWeight: 'bolder' }}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleVendorArray.invoice_posting_date || '-'}
                              readOnly
                            />
                          </CCol>
                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">SAP Invoice Doc. No</CFormLabel>
                            <CFormInput
                              style={{ fontWeight: 'bolder' }}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleVendorArray.sap_invoice_no || '-'}
                              readOnly
                            />
                          </CCol>
                        </>
                      ) : <CCol md={3}></CCol>
                      }
                      
                      
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
                  </>
                )}
                <CustomTable
                  columns={columns}
                  pagination={false}
                  data={rowData}
                  fieldName={'Driver_Name'}
                  showSearchFilter={true}
                /> 
                <CRow className="mt-2">
                  <CCol className="m-2" xs={12} sm={12} md={3}>
                    <CButton size="sm" color="primary" className="text-white" type="button">
                      <Link className="text-white" to="/NlmtMPSPaymentReport">
                        Previous
                      </Link>
                    </CButton>
                  </CCol>                   
                </CRow>                

                {/* *********************************************************** */}
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default NlmtMPSPaymentReportChild
