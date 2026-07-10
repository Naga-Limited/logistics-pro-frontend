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
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from '../CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'

const DepoFinalReportChild = () => {
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

  const exportToCSV = () => {
    // console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName=`Depo_Payment_Child_Info_Report_`+dateTimeString
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

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate();

  const { id } = useParams()
  const [rowData, setRowData] = useState([])
  const [locationData, setLocationData] = useState([])
  const [totalShipmentFreight, setTotalShipmentFreight] = useState(0)
  const [totalAdjustmentFreight, setTotalAdjustmentFreight] = useState(0)

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Final_Report

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

  const [fetch, setFetch] = useState(false)
  const [contractorInfo, setContractorInfo] = useState([])

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  /* ===================== The Constants Needed For First Render Part Start ===================== */

  const [settlementClosureData, setSettlementClosureData] = useState([])
  const [singleContractorArray, setSingleContractorArray] = useState([])

  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */

  useEffect(() => {

      DepoExpenseClosureService.getPaymentInfoById(id).then((res) => {
        let payment_info_id_data = res.data.data
        console.log(payment_info_id_data,'payment_info_id_data')
        setSingleContractorArray(payment_info_id_data)
      })

    }, [id])

  const [totalTonnage, setTotalTonnage] = useState(0)
  const [tdsTaxData, setTdsTaxData] = useState([])
  useEffect(() => {

    /* section for getting TDS Tax Type Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {

     let viewData = response.data.data
      console.log(viewData,'viewData')
     setTdsTaxData(viewData)
   })

 }, [])

  const getTdsTax = (code) => {
    let tds_text = '-'
    tdsTaxData.map((val,ind)=>{
      if(val.definition_list_code == code){
        tds_text = val.definition_list_name
      } else if('Empty' == code){
        tds_text = 'No Tax'
      }
    })
    return tds_text
  }

  useEffect(() => {

      DepoExpenseClosureService.getSettlementApprovalInfoById(id).then((res) => {
        setFetch(true)
        let payment_info_data = res.data.data
        console.log(payment_info_data,'closure_info_data')
        setSettlementClosureData(payment_info_data)
        let contractor_info_data = payment_info_data.contractor_info
        setContractorInfo(contractor_info_data)
        values.remarks = payment_info_data.remarks
        let rowDataList = []
        let tot_ton = 0
        let totShip = 0
        let totAdj = 0
        payment_info_data.map((data, index) => {
          let fm = data.closure_info.total_expenses
          let qty_ton = data.shipment_info.final_shipment_net_qty && data.shipment_info.final_shipment_net_qty != 0 ? Number(parseFloat(data.shipment_info.final_shipment_net_qty).toFixed(3)) : (parseFloat(data.shipment_info.final_shipment_qty).toFixed(3))
          console.log(qty_ton,'qty_ton')
          tot_ton += Number(parseFloat(qty_ton).toFixed(3))

          /* Total Shipment Freight */          
          let val1 = data.shipment_info.freight_type == '2' ? data.shipment_info.shipment_depo_actual_freight_amount : data.shipment_info.shipment_depo_budget_freight_amount
          totShip += Number(parseFloat(val1).toFixed(3))

          /* Total Adjustment Freight */
          let val2 = getFreightAdjustment(data.shipment_info,data.closure_info)          
          totAdj += Number(parseFloat(val2).toFixed(3))

          rowDataList.push({
            S_NO: index + 1,
            Depo_Location:data.vehicle_location_info.location,
            Contractor_Name: data.contractor_info.contractor_name,
            Contractor_Code: data.contractor_info.contractor_code,
            Contractor_Number: data.contractor_info.contractor_number,
            Tripsheet: data.vehicle_tripsheet_info.depo_tripsheet_no,
            Shipment_No: data.shipment_info.shipment_no,
            GateIn_Date: data.created_date,
            Tripsheet_Date: data.vehicle_tripsheet_info.created_date,
            Expense_Date: data.closure_info.created_at_date,
            Vehicle_No: data.vehicle_info.vehicle_number,
            Driver_Name: data.driver_info.driver_name,
            Driver_Number: data.driver_info.driver_number,
            Shipment_Qty: data.shipment_info.final_shipment_qty,
            Shipment_Net_Qty: data.shipment_info.final_shipment_net_qty,
            Shipment_Freight: data.shipment_info.freight_type == '2' ? data.shipment_info.shipment_depo_actual_freight_amount : data.shipment_info.shipment_depo_budget_freight_amount,
            Adjustment_Freight: getFreightAdjustment(data.shipment_info,data.closure_info),
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
              <Link className='text-black' target='_blank' to={`/DepoSettlementApprovalTable/DepoSettlementApprovalChild/${data.closure_info.closure_id}`}>
                <u><strong>{data.vehicle_tripsheet_info.depo_tripsheet_no}</strong></u>
              </Link>
            ),
            // Freight_Amount: fm,
            Freight_Amount1: ( <span style={{color:getFreightAdjustment(data.shipment_info,data.closure_info) == 0 ? '' : 'red'}}>
              {data.shipment_info.freight_type == '2' ? data.shipment_info.shipment_depo_actual_freight_amount : data.shipment_info.shipment_depo_budget_freight_amount}
            </span>),
            Freight_Amount2: ( <span style={{color:getFreightAdjustment(data.shipment_info,data.closure_info) == 0 ? '' : 'red'}}>
              {getFreightAdjustment(data.shipment_info,data.closure_info)}
            </span>),
            Freight_Amount3: ( <span style={{color:getFreightAdjustment(data.shipment_info,data.closure_info) == 0 ? '' : 'red'}}>
              {data.closure_info.total_expenses}
            </span>),
            Action: (
              <>
                <CButton className="btn btn-success btn-sm me-md-1">
                  <Link className="text-white" target='_blank' to={`/DepoSettlementApprovalTable/DepoSettlementApprovalChild/${data.closure_info.closure_id}`}>
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </Link>
                </CButton>
                {/* <CButton
                  size="sm"
                  color="danger"
                  shape="rounded"
                  id={data.id}
                  onClick={() => {
                    setTripPaymentDelete(true)
                    setTripNoToDelete(data.vehicle_tripsheet_info.depo_tripsheet_no)
                    setTripIdToDelete(data.vehicle_tripsheet_info.depo_tripsheet_id)
                    setPaymentAmountToDelete(fm)
                    setShipmentIdToDelete(data.shipment_info.shipment_id)
                  }}
                  className="m-1"
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </CButton> */}
              </>
            ),
          })
          console.log(tot_ton,'totTon',index)
        })
        let totTon = Number(parseFloat(tot_ton).toFixed(3))
        console.log(totTon,'totTon-tot')
        setTotalTonnage(totTon)
        setTotalAdjustmentFreight(totAdj)
        setTotalShipmentFreight(totShip)
        setRowData(rowDataList)
      })

  }, [id])

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
    // {
    //   name: 'Location',
    //   selector: (row) => row.Depo_Location,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'GateIn Date',
      selector: (row) => row.GateIn_Date,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Contractor',
    //   selector: (row) => row.Contractor_Name,
    //   sortable: true,
    //   center: true,
    // },
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
      name: 'Ship. Qty',
      selector: (row) => row.Shipment_Qty,
      sortable: true,
      center: true,
    },
    {
      name: 'Ship. Net Qty',
      selector: (row) => row.Shipment_Net_Qty,
      sortable: true,
      center: true,
    },
    {
      name: 'Ship.Freight',
      selector: (row) => row.Freight_Amount1,
      // sortable: true,
      center: true,
    },
    {
      name: 'Adjustment',
      selector: (row) => row.Freight_Amount2,
      // sortable: true,
      center: true,
    },
    {
      name: 'Tot.Freight',
      selector: (row) => row.Freight_Amount3,
      // sortable: true,
      center: true,
    },
    {
      name: 'Expense Date',
      selector: (row) => row.Expense_Date,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Current Status',
    //   selector: (row) => row.Waiting_At,
    //   center: true,
    // },
    // {
    //   name: 'View',
    //   selector: (row) => row.Action,
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
                {singleContractorArray && singleContractorArray.contractor_info && (
                  <>
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
                        <CFormLabel htmlFor="cmn">Contractor Name</CFormLabel>
                        <CFormInput
                          style={{fontWeight: 'bolder'}}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={singleContractorArray.contractor_info.contractor_name}
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Contractor Code / Mobile No.</CFormLabel>
                        <CFormInput
                          style={{fontWeight: 'bolder'}}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={`${singleContractorArray.contractor_info.contractor_code} / ${singleContractorArray.contractor_info.contractor_number}`}
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cname">Contractor Location / Freight Type</CFormLabel>
                        <CFormInput
                          style={{fontWeight: 'bolder'}}
                          name="cname"
                          size="sm"
                          id="cname"
                          value={`${getLocationNameByCode(singleContractorArray.contractor_info.contractor_location)} / ${singleContractorArray.contractor_info.freight_type == '2' ? "End Point" : "Point To Point"}`}
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
                          value={singleContractorArray.contractor_info.contractor_number}
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
                          value={singleContractorArray.contractor_info.freight_type == '2' ? "Budget" : "Actual"}
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
                        <CFormLabel htmlFor="cmn">Total Qty </CFormLabel>
                        <CFormInput
                          style={{fontWeight: 'bolder'}}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={totalTonnage}
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Shipment Freight</CFormLabel>
                        <CFormInput
                          style={{fontWeight: 'bolder'}}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={totalShipmentFreight}                         
                          readOnly
                        /> 
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Adjustment Freight</CFormLabel>
                        <CFormInput
                          style={{fontWeight: 'bolder', color:'rgb(255,0,0)'}}
                          name="cmn"
                          size="sm"
                          id="cmn"
                                
                          value={totalAdjustmentFreight}                    
                          readOnly
                        /> 
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Total Freight</CFormLabel>
                        <CFormInput
                          style={{fontWeight: 'bolder'}}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={`${singleContractorArray.freight_amount}`}
                          
                          readOnly
                        /> 
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Tripsheets Count / GST Tax Type</CFormLabel>
                        <CFormInput
                          style={{fontWeight: 'bolder'}}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={`${singleContractorArray.trip_info.length} / ${getGstTax(singleContractorArray.contractor_info.gst_tax_type)}`}
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">GST Tax Type</CFormLabel>
                        <CFormInput
                          style={{fontWeight: 'bolder'}}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={getGstTax(singleContractorArray.contractor_info.gst_tax_type)}
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">TDS Applicable / Invoice Copy</CFormLabel>
                        {/* <CFormInput
                          style={{fontWeight: 'bolder'}}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={singleContractorArray.tds_having || '-'}
                          readOnly
                        /> */}
                        <CButton
                          onClick={() => setVisible(!visible)}
                          className="w-100 m-0"
                          color="info"
                          size="sm"
                          id="odoImg"
                          style={border}
                        >
                          <span className="float-start">
                          {singleContractorArray.tds_having || '-'} / <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
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

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">TDS Tax Type</CFormLabel>
                        <CFormInput
                          style={{fontWeight: 'bolder'}}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={getTdsTax(singleContractorArray.vendor_tds)}
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">Payment Remarks</CFormLabel>
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
                        <CFormLabel htmlFor="cmn">Validation Remarks</CFormLabel>
                        <CFormInput
                          style={{fontWeight: 'bolder'}}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={singleContractorArray.approval_remarks || '-'}
                          readOnly
                        />
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="cmn">SAP Reference Text</CFormLabel>
                        <CFormInput
                          style={{fontWeight: 'bolder'}}
                          name="cmn"
                          size="sm"
                          id="cmn"
                          value={singleContractorArray.reference_text || '-'}
                          readOnly
                        />
                      </CCol>
                    {/* </CRow>
                    <CRow> */}
                      {/* <CCol md={3}></CCol>
                      <CCol md={3}></CCol>
                      <CCol md={3}></CCol> */}
                      <CCol md={3} style={{textAlign:'end'}}>
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

                      {/* <CCol xs={12} md={3}>
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

                <CRow className="m-2">
                  <CCol xs={12} md={6}>
                    <CFormLabel htmlFor="apremarks">Approval Remarks</CFormLabel>
                    <CFormTextarea
                      name="apremarks"
                      id="apremarks"
                    //   rows="1"
                    //   onFocus={onFocus}
                    //   onBlur={onBlur}
                    //   onChange={handleChange}
                      value={singleContractorArray.approval_remarks}
                      readOnly
                    ></CFormTextarea>
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="invoicePostingDate">
                      Invoice Posting Date  
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      type="date"
                      id="invoicePostingDate"
                      name="invoicePostingDate"
                    //   onChange={handleChangeInvoicePostingDate}
                    //   min={Expense_Income_Posting_Date.min_date}
                    //   max={Expense_Income_Posting_Date.max_date}
                    //   onKeyDown={(e) => {
                    //     e.preventDefault();
                    //   }}
                      value={singleContractorArray.invoice_posting_date}
                      readOnly
                    />
                  </CCol>

                </CRow>
                <CRow className="mt-2">
                  <CCol className="m-2" xs={12} sm={12} md={3}>
                    <CButton size="sm" color="primary" className="text-white" type="button">
                      <Link className="text-white" to="/DepoFinalReport">
                        Previous
                      </Link>
                    </CButton>
                  </CCol>
                   
                </CRow>
                {/* ======================= Confirm Button Modal Area ========================== */}
                {/* ======================= Confirm Button Modal Area ========================== */}

              {/* *********************************************************** */}
              </CCard>
            </> ) : (<AccessDeniedComponent />)
          }

        </>
      )}
    </>
  )
}

export default DepoFinalReportChild


