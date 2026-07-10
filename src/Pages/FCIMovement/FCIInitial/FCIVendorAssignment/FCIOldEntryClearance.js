import {
  CForm,
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CModal,
  CFormInput,
  CFormLabel,
  CModalHeader,
  CFormSelect,
  CInputGroupText,
  CInputGroup,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CFormCheck,
  CListGroup,
  CListGroupItem,
  CTabPane,
  CAccordion,
  CAccordionItem,
  CAccordionBody,
  CAccordionHeader,
  CTabContent,
  CNavItem,
  CNav,
  CNavLink,
  CButtonGroup,
  CFormTextarea,
  CCardImage,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import maintenance_logo from 'src/assets/naga/main2.png'
import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader'
import TripSheetClosureService from 'src/Service/TripSheetClosure/TripSheetClosureService'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'
// import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import TripSheetClosureSapService from 'src/Service/SAP/TripSheetClosureSapService'
import Swal from 'sweetalert2'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import RakeClosureSubmissionService from 'src/Service/RakeMovement/RakeClosureSubmission/RakeClosureSubmissionService'
import CustomTable from 'src/components/customComponent/CustomTable'
import RakeTripsheetSapService from 'src/Service/SAP/RakeTripsheetSapService'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import { formatDateAsDDMMYYY } from '../../CommonMethods/CommonMethods'

const FCIOldEntryClearance = () => {
  const REQ = () => <span className="text-danger"> * </span>

  /*================== User Id & Location Fetch ======================*/ 
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()
  const is_admin = user_info.user_id == 1 && user_info.is_admin == 1

  if(is_admin){
    console.log(user_info)
  }

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate();
  console.log(Expense_Income_Posting_Date,'ExpenseIncomePostingDate')

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  //let page_no = LogisticsProScreenNumberConstants.HireDeductionPaymentModule.Hire_Payment_Screen
  let page_no = LogisticsProScreenNumberConstants.FCIModule.FCI_FP_Vendor_Assignment_APPROVAL

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

  const [fetch, setFetch] = useState(false)
  const [smallfetch, setSmallFetch] = useState(false)
  const [pageList, setPageList] = useState([])

  const [tripFNRData, setTripFNRData] = useState([])
  const [tripHirePaymentData, setTripHirePaymentData] = useState({})
  const [tripRPSClosureData, setTripRPSClosureData] = useState({})
  const [sapTdsFreightData, setSapTdsFreightData] = useState({})
  const [hireVendorData, setHireVendorData] = useState({})
  const [tdsTaxTermsData, setTdsTaxTermsData] = useState([])
  const [tripSheetHaving, setTripsheetHaving] = useState(false)
  const [rPSHaving, setRPSHaving] = useState(false)
  const [fnrHaving, setFNRHaving] = useState(false)
  const [paymentSubmit, setPaymentSubmit] = useState(false)
  const [sapPaymentPostingPossibility, setSapPaymentPostingPossibility] = useState(false)
  const [vont, setVont] = useState(0) /* Vendor Outstanding Next Trip */
  const [activeKey, setActiveKey] = useState(1)
  const [hireVendorCode, setHireVendorCode] = useState(0)
  const [hireVendorOutstanding, setHireVendorOutstanding] = useState(0)
  const [totalDeductionAmount, setTotalDeductionAmount] = useState(0)
  const [totalBalancePaymentAmount, setTotalBalancePaymentAmount] = useState(0)
  const [sapPostingPayment, setSapPostingPayment] = useState(0)
  const [unloadingDeduction, setUnloadingDeduction] = useState(0)
  const [subdeliveryDeduction, setSubdeliveryDeduction] = useState(0)
  const [weighmentDeduction, setWeighmentDeduction] = useState(0)
  const [freightDeduction, setFreightDeduction] = useState(0)
  const [diversionReturnDeduction, setDiversionReturnDeduction] = useState(0)
  const [haltingDeduction, setHaltingDeduction] = useState(0)
  const [tollDeduction, setTollDeduction] = useState(0)
  const [deductionRemarks, setDeductionRemarks] = useState('')
  const [paymentRemarks, setPaymentRemarks] = useState('')
  const [paymentPostingDate, setPaymentPostingDate] = useState('')

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const [rakeRowData, setRakeRowData] = useState([])
  const [visible, setVisible] = useState(false)
  const [fiImgSrc, setFiImgSrc] = React.useState(null);

  const deduction_type_amount = [unloadingDeduction,subdeliveryDeduction,weighmentDeduction,freightDeduction,diversionReturnDeduction,haltingDeduction,tollDeduction]

  const [tripRPSNumberNew, setTripRPSNumberNew] = useState('');
  const [tripFNRNumberNew, setTripFNRNumberNew] = useState('');
  const handleChangenewtrip = event => {
    let tripResult = event.target.value.toUpperCase();
    setTripRPSNumberNew(tripResult.trim());
  };
  const handleChangenewtrip1 = event => {
    let tripResult = event.target.value.toUpperCase();
    setTripFNRNumberNew(tripResult.trim());
  };

  useEffect(()=>{

    let v_o_n_t = 0
    console.log(hireVendorOutstanding,'11111 - hireVendorOutstanding')
    console.log(sapPostingPayment,'11111 - sapPostingPayment')

    let difference_amount = (getInt(sapPostingPayment)) - getInt(hireVendorOutstanding)

    if(sapPostingPayment <= 0){
      setSapPaymentPostingPossibility(false)
      v_o_n_t = 0
    } else {
      if(difference_amount > sapPostingPayment){
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

      let sap_payment_amount = sapPaymentPosting()
      console.log(sap_payment_amount,'sap_payment_amount')
      console.log(sap_payment_amount == sapPostingPayment,'sap_payment_amount == sapPostingPayment')
      let needed_val = 0
      if(sap_payment_amount == sapPostingPayment){
        needed_val = getInt(hireVendorOutstanding)+getInt(sapPostingPayment)
        setVont(needed_val)
      } else {
        setVont(needed_val)
      }
      console.log(needed_val,'v-0-n-t')
    }

  },[hireVendorOutstanding,totalBalancePaymentAmount,sapPaymentPostingPossibility,vont,sapPostingPayment])

  const clearValues = () => {
    setCurrentProcessId(0)  
    setTripRPSNumberNew('') 
    setTripFNRNumberNew('') 
    setTripsheetHaving(false)
    setRPSHaving(false)
    setFNRHaving(false)
    setTripFNRData([])
    setHeadEnable(true) 
  }

  const gettripRPSData = (e) => {
    e.preventDefault() 
    console.log(tripRPSNumberNew,'tripRPSNumberNew')
    if(/^[a-zA-Z0-9]+$/i.test(tripRPSNumberNew) && /[a-zA-Z]/.test(tripRPSNumberNew) && /[0-9]/.test(tripRPSNumberNew)){
        RakeClosureSubmissionService.getRPSInfoForClearance(tripRPSNumberNew).then((res) => {
          setSmallFetch(true)
        let tableReportData = res.data.data
        console.log(res.data.data,'getExpenseApprovalInfoByRPSForFiPayment')
        let bpa = Number(parseFloat(tableReportData.total_expense_amount).toFixed(3)) + Number(parseFloat(tableReportData.deduction_expenses).toFixed(3))
        console.log(bpa,'bpa')
        setTripsheetHaving(true)
        setRPSHaving(true)

        if (res.status == 200 && res.data != '') {

          // setSmallFetch(true)
          setTripHirePaymentData(tableReportData)
          setTripRPSClosureData(tableReportData)
          setTotalBalancePaymentAmount(bpa)
          setHireVendorData(tableReportData.rake_vendor_info)
          setHireVendorCode(tableReportData.rake_vendor_info.v_code)
          toast.success('RPS Details Detected!')

        } else {

          setTripHirePaymentData([])
          setTripRPSClosureData([])
          setHireVendorCode(0)
          setTotalBalancePaymentAmount(0)
          setHireVendorData({})
          setTripsheetHaving(false)
          setRPSHaving(false)
          setSmallFetch(true)
          if (res.status == 201 && (res.data.status == '1' ||res.data.status == '2')) {
            toast.warning(res.data.message)
          } else {
            setSmallFetch(true)
            toast.warning('RPS Details cannot be detected from LP!')
          }
        }
      })
    } else {

      setTripHirePaymentData([])
      setTripRPSClosureData([])
      setHireVendorCode(0) 
      setTripsheetHaving(false)
      setRPSHaving(false)
      setSmallFetch(true)
      // toast.warning('RPS Number Must Like "AB123456789"')
      toast.warning('RPS Number Must Like "RPS1234567"')
      return false
    }

  }

  const [rowData, setRowData] = useState([])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet No',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Date',
      selector: (row) => row.Created_date,
      sortable: true,
      center: true,
    },
    {
      name: 'FNR No',
      selector: (row) => row.FNR_No,
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
      name: 'Vendor Name',
      selector: (row) => row.Vendor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Plant',
      selector: (row) => row.Rake_Plant,
      sortable: true,
      center: true,
    }
  ]

  const gettripFNRData = (e) => {
    e.preventDefault() 
    console.log(tripFNRNumberNew,'tripFNRNumberNew')
    if (/^[0-9]{11}$/.test(tripFNRNumberNew)) {
      RakeClosureSubmissionService.getFNRInfoForClearance(tripFNRNumberNew).then((res) => {
        setSmallFetch(true)
        let tableReportData = res.data.data
        console.log(res.data.data,'getFNRInfoForClearance') 
        setFNRHaving(true) 
        let rowDataList = []
        if (res.status == 200 && res.data != '') {
 
          setTripFNRData(tableReportData) 
          tableReportData.map((data, index) => {
            rowDataList.push({
              sno: index + 1,
              Tripsheet_No: data.rake_tripsheet_no,
              FNR_No: data.fnr_no,
              Vehicle_No: data.vehicle_no,
              Driver_Name: data.driver_name,
              Driver_Number: data.driver_phone_number,
              // Tripsheet_Status: data.status == 1 ? 'Created' : 'Closed',
              // Cancel_Status: data.is_cancelled == 1 ? 'Cancelled' : 'Not Cancelled',
              Vendor_Name: data.tripsheet_creation_vendor_info.v_name,
              Vendor_Code: data.vendor_code,
              Rake_Plant: data.tripsheet_creation_plant_info.definition_list_name,
              Created_date: data.created_date,
              Created_By: data.tripsheet_creation_user_info.emp_name,
            })
          })
          setRowData(rowDataList)
           
          toast.success('FNR Details Detected!')

        } else {

          setTripHirePaymentData([])
          setTripRPSClosureData([])
          setHireVendorCode(0)
          setTotalBalancePaymentAmount(0)
          setHireVendorData({})
          setTripsheetHaving(false)
          setRPSHaving(false)
          setSmallFetch(true)
          if (res.status == 201 && (res.data.status == '1' ||res.data.status == '2')) {
            toast.warning(res.data.message)
          } else {
            setSmallFetch(true)
            toast.warning('RPS Details cannot be detected from LP!')
          }
        }
      })
    } else {

      setTripFNRData([]) 
      setFNRHaving(false)
      setSmallFetch(true) 
      toast.warning('FNR Number Must Like 11 Digit Numeric')
      return false
    }

  }

  const revert_rps_clearance = (e) => {
    e.preventDefault()
    setSmallFetch(false) 
    console.log(tripRPSNumberNew,'tripRPSNumberNew')
    if(/^[a-zA-Z0-9]+$/i.test(tripRPSNumberNew) && /[a-zA-Z]/.test(tripRPSNumberNew) && /[0-9]/.test(tripRPSNumberNew)){
        RakeClosureSubmissionService.revertRPSClearance(tripRPSNumberNew).then((res) => {
        setSmallFetch(true)         
        console.log(res,'res-revert_rps_clearance')
        Swal.fire({
          title: res.data.message,
          icon: res.status == 200 ? "success" : "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        }) 
        
      })
    } else {

      setTripHirePaymentData([])
      setTripRPSClosureData([])
      setHireVendorCode(0)
      
      setTripsheetHaving(false)
      setRPSHaving(false)
      setSmallFetch(true)
      // toast.warning('RPS Number Must Like "AB123456789"')
      toast.warning('RPS Number Must Like "RPS1234567"')
      return false
    }

  }

  const start_rps_clearance = (e) => {
    e.preventDefault()
    setSmallFetch(false) 
    console.log(tripRPSNumberNew,'tripRPSNumberNew')
    if(/^[a-zA-Z0-9]+$/i.test(tripRPSNumberNew) && /[a-zA-Z]/.test(tripRPSNumberNew) && /[0-9]/.test(tripRPSNumberNew)){
        RakeClosureSubmissionService.startRPSClearance(tripRPSNumberNew).then((res) => {
        setSmallFetch(true)         
        console.log(res,'res-start_rps_clearance')
        Swal.fire({
          title: res.data.message,
          icon: res.status == 200 ? "success" : "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        })  
      })
    } else {

      setTripHirePaymentData([])
      setTripRPSClosureData([])
      setHireVendorCode(0)
      
      setTripsheetHaving(false)
      setRPSHaving(false)
      setSmallFetch(true)
      // toast.warning('RPS Number Must Like "AB123456789"')
      toast.warning('RPS Number Must Like "RPS1234567"')
      return false
    }

  }

  const start_fnr_clearance = (e) => {
    e.preventDefault()
    setSmallFetch(false) 
    console.log(tripFNRNumberNew,'tripFNRNumberNew')
    if (/^[0-9]{11}$/.test(tripFNRNumberNew)) {
        RakeClosureSubmissionService.startFNRClearance(tripFNRNumberNew).then((res) => {
        setSmallFetch(true)         
        console.log(res,'res-start_fnr_clearance')
        Swal.fire({
          title: res.data.message,
          icon: res.status == 200 ? "success" : "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        })  
      })
    } else {

      setTripFNRData([])
      setFNRHaving(false)
      setSmallFetch(true) 
      toast.warning('FNR Number Must Like 11 Digit Numeric')
      return false
    }

  }

  const revert_fnr_clearance = (e) => {
    e.preventDefault()
    setSmallFetch(false) 
    console.log(tripFNRNumberNew,'tripFNRNumberNew')
    if (/^[0-9]{11}$/.test(tripFNRNumberNew)) {
        RakeClosureSubmissionService.revertFNRClearance(tripFNRNumberNew).then((res) => {
        setSmallFetch(true)         
        console.log(res,'res-revert_fnr_clearance')
        Swal.fire({
          title: res.data.message,
          icon: res.status == 200 ? "success" : "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        })  
      })
    } else {

      setTripFNRData([])
      setFNRHaving(false)
      setSmallFetch(true)
      toast.warning('FNR Number Must Like 11 Digit Numeric')
      return false
    }

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
    if (hireVendorCode != 0) {
      VendorOutstanding.getVendoroutstanding(hireVendorCode).then((res) => {
        let driver_outstanding_data = res.data[0];
        console.log(driver_outstanding_data,'driver_outstanding_data');
        setHireVendorOutstanding(driver_outstanding_data.L_DMBTR)
      })
    }else {
      setHireVendorOutstanding(0)
    }
  },[hireVendorCode])

  useEffect(() => {
    /* section for getting Pages List from database For Setting Permission */
    DefinitionsListApi.visibleDefinitionsListByDefinition(8).then((response) => {
      console.log(response.data.data)
      setPageList(response.data.data)
      setFetch(true)
      setSmallFetch(true)
    })

     /* section for getting TDS Tax Terms Master List For TDS Tax Code Display from database */
     DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      console.log(response.data.data,'setTdsTaxTermsData')
      setTdsTaxTermsData(response.data.data)
    })
  }, [])

  const getInt = (val) => {
    return Number(parseFloat(val).toFixed(2))
  }

  const sapPaymentPosting = () => {

    let payment = 0

    if(sapPaymentPostingPossibility){

      payment = getLowerValue(getInt(hireVendorOutstanding),getInt(sapPostingPayment))

    }

    console.log(payment,'sapPaymentPosting-Amount')

    return payment
  }

  // useEffect(() => {
  //   if(rPSHaving){
  //     RakeTripsheetSapService.getSapTripExpensesByRpsNo(tripRPSNumberNew).then((res) => {
  //       let trip_sap_expenses_data = res.data[0]
  //       console.log(trip_sap_expenses_data,'trip_sap_expenses_data')
  //       setFetch(true)
  //       setSmallFetch(true)
  //       if(trip_sap_expenses_data.RPS_NO == tripRPSNumberNew && trip_sap_expenses_data.STATUS == 1 && trip_sap_expenses_data.EXP_AMT != 0){
  //         setSapTdsFreightData(trip_sap_expenses_data)
  //       } else {
  //         setSapTdsFreightData({})
  //         Swal.fire({
  //           title: 'RPS Data not found in SAP.. Kindly Contact Admin!',
  //           icon: "warning",
  //           confirmButtonText: "OK",
  //         }).then(function () {
  //           // window.location.reload(false)
  //         })
  //       }
  //     })
  //   }else {
  //     setSapTdsFreightData({})
  //   }

  // },[rPSHaving])
  const [currentProcessId, setCurrentProcessId] = useState(0)
  const [headEnable, setHeadEnable] = useState(true)

  const assignValues = (id) => {
    console.log(id,'assignValues-id')
    if(id !=0){
      setHeadEnable(false)
    }
    setCurrentProcessId(id)
  }

  return (
    <>
      {!fetch && <Loader />}

      {fetch && (
        <>
          {screenAccess ? (
            <>
              {/* {headEnable && (
                <CRow className="mt-3">
                  <CCol xs={12} md={6}>
                    <div className="p-3">
                      <CInputGroup className="mb-3">
                        <CInputGroupText component="label" htmlFor="inputGroupSelect01">
                          Clearance By
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

                          <option value={1}> FNR Number</option>
                          <option value={2}> RPS Number</option>

                        </CFormSelect>
                      </CInputGroup>
                    </div>
                  </CCol>
                </CRow>
              )}
              {currentProcessId == 1 && (
                <CContainer className="mt-2">
                   
                  {tripFNRData.length == 0 && (
                    <CRow>
                      <CCol xs={12} md={4}>
                        <div className="w-100 p-3">
                          <CFormLabel htmlFor="tripFNRNumberNew">
                            Enter FNR Number
                            <REQ />{' '}

                          </CFormLabel>
                          <CInputGroup>
                            <CFormInput
                              size="sm"
                              name="tripFNRNumberNew"
                              id="tripFNRNumberNew"
                              maxLength={15}
                              autoComplete='off'
                              value={tripFNRNumberNew}
                              readOnly={tripFNRData.length > 0 ? true : false}
                              onChange={handleChangenewtrip1}
                            />
                            <CInputGroupText className="p-0">
                              <CButton
                                size="sm"
                                color="primary"
                                onClick={(e) => {
                                  // setFetch(false)
                                  setSmallFetch(false)
                                  gettripFNRData(e)
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
                  )}                  
                     
                  {!smallfetch && <SmallLoader />}

                  {smallfetch && (

                    <CCard style={{display: fnrHaving ? 'block' : 'none'}}  className="p-3">
                      <CButton 
                        className="badge m-3" 
                        color="secondary" 
                        onClick={(e) => {
                          start_fnr_clearance(e)
                        }}
                      > 
                        Click here to Close FNR Info
                      </CButton>
                      <CButton 
                        style={{color:'white'}} 
                        className="badge m-3" 
                        color="primary"
                        onClick={(e) => {
                          revert_fnr_clearance(e)
                        }}
                      > 
                        Click here to Revert FNR Info
                      </CButton>
                      {tripFNRData && tripFNRData.length > 0 && (
                        <CustomTable
                          columns={columns}
                          data={rowData}
                          fieldName={'Driver_Name'}
                          showSearchFilter={true}
                        />
                      )}
                      <CRow>
                        <CCol>
                          <CButton size="sm" color="primary" className="text-white m-4" onClick={clearValues} type="button">
                            Previous
                          </CButton>
                        </CCol>
                      </CRow>                     
                       
                    </CCard>

                  )}

                </CContainer>
              )}
              {currentProcessId == 2 && (
                <CContainer className="mt-2">
                  {Object.keys(tripRPSClosureData).length == 0  && (
                    <>
                      <CRow>
                        <CCol xs={12} md={4}>
                          <div className="w-100 p-3">
                            <CFormLabel htmlFor="tripRPSNumberNew">
                              Enter RPS Number
                              <REQ />{' '}

                            </CFormLabel>
                            <CInputGroup>
                              <CFormInput
                                size="sm"
                                name="tripRPSNumberNew"
                                id="tripRPSNumberNew"
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

                  {smallfetch && Object.keys(tripRPSClosureData).length != 0  && (

                    <CCard style={{display: tripSheetHaving ? 'block' : 'none'}}  className="p-3">

                      <CButton className="badge m-3" color="warning">
                        <Link className="text-white" target='_blank' to={`/RakeExpenseReport/${tripRPSClosureData.closure_id}`}>
                          Click here to Show RPS Info in an New Tab
                        </Link>
                      </CButton> 
                      <CButton 
                        className="badge m-3" 
                        color="secondary" 
                        onClick={(e) => {
                          start_rps_clearance(e)
                        }}
                      > 
                        Click here to Close RPS Info
                      </CButton>
                      <CButton 
                        style={{color:'white'}} 
                        className="badge m-3" 
                        color="primary"
                        onClick={(e) => {
                          revert_rps_clearance(e)
                        }}
                      > 
                        Click here to Revert RPS Info
                      </CButton>
                      <CRow>
                        <CCol>
                          <CButton size="sm" color="primary" className="text-white m-4" onClick={clearValues} type="button">
                            Previous
                          </CButton>
                        </CCol>
                      </CRow> 
                    </CCard>

                  )}

                </CContainer>
              )} */}
              <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                   
                   <div className="card mt-3" style={{backgroundColor:"dimgrey", margin:"5%"}} >
                       <img style={{ margin: '5% 25%', borderRadius: '10%', width:"40%" }} src={maintenance_logo} />
                   </div>                               
                    
               </CTabPane>
            </> ) : (<AccessDeniedComponent />)
          }
        </>
      )}
    </>
  )
}

export default FCIOldEntryClearance
