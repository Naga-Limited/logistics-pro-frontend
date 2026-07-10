

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
import useFormDepoExpenseClosure from 'src/Hooks/useFormDepoExpenseClosure';
import LocationApi from 'src/Service/SubMaster/LocationApi'; 
import CustomTable from 'src/components/customComponent/CustomTable';
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
// import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from '../CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import FCIClosureSubmissionService from 'src/Service/FCIMovement/FCIClosureSubmission/FCIClosureSubmissionService'
import FCITripsheetSapService from 'src/Service/SAP/FCITripsheetSapService'
import Swal from "sweetalert2";
import AuthService from 'src/Service/Auth/AuthService'
import LocalStorageService from 'src/Service/LocalStoage'
import FCIPlantMasterService from 'src/Service/FCIMovement/FCIPlantMaster/FCIPlantMasterService'

const FreightExpenseSubmissionApproval = () => {
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

  function logout() {
    AuthService.forceLogout(user_id).then((res) => {
      // console.log(res)
      if (res.status == 204) {
        LocalStorageService.clear()
        window.location.reload(false)
      }
    })
  }

  const exportToCSV = () => {
    // console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='FCI_FREIGHT_MIGO_Expense_Approval_'+dateTimeString
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

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.FCIModule.FCI_FP_Vendor_Assignment_APPROVAL

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
  const [vendorPoGroupingFPMigoData, setVendorPoGroupingFPMigoData] = useState([])
  useEffect(() => {

    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
      console.log(response.data.data)
      setPlantMasterData(response.data.data)
    })

    /* section for getting FCI Plant Lists from database */
    // DefinitionsListApi.visibleDefinitionsListByDefinition(34).then((response) => {
    FCIPlantMasterService.getActiveFCIPlantRequestTableData().then((response) => {
      setFetch(true)
      let viewData = response.data.data
      console.log(viewData,'FCI Plant Data')
      setFciPlantData(viewData)
    })
  }, [])


  /* Overall Journey Information Constants */
  const [pmData, setPMData] = useState([])

  const [visible, setVisible] = useState(false)
  const [tripPaymentDelete, setTripPaymentDelete] = useState(false)
  const [tripMigoAllDelete, setTripMigoAllDelete] = useState(false)
  const [tripMigoAllConfirm, setTripMigoAllConfirm] = useState(false)
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

  const [fciPlantData, setFciPlantData] = useState([])

  const locationFinder = (plant) => {
    let n_loc = '--'
    fciPlantData.map((datann, indexnn) => {
      if(datann.plant_symbol == plant){
        n_loc = datann.plant_name
      }
    })
    return n_loc
  }

  const rejectAllExpenseSubmission = () => {
    const formDataUpdate = new FormData()

    formDataUpdate.append('id', id)
    formDataUpdate.append('created_by', user_id)
    formDataUpdate.append('status', 3)
    formDataUpdate.append('remarks', values.apremarks)
    console.log(id,'id')
    console.log(values.apremarks,'remarks')
    console.log(user_id,'created_by')
    // return false

    var SentVAInfoData = {}
    var SentVAInfoData_seq = []
    var SentVAInfoData_seq1 = []

    /* Set VAInfo Data via Clubbed Data by Loop */
    for (var i = 0; i < vendorPoGroupingFPMigoData.length; i++) {
      SentVAInfoData.VA_NO = vendorPoGroupingFPMigoData[i].pp_va_no
      SentVAInfoData.TRIPSHEET_NO = vendorPoGroupingFPMigoData[i].tripsheet_no
      SentVAInfoData.VENDOR_TYPE = vendorPoGroupingFPMigoData[i].vendor_type == 2 ? 3 : 1   /* 1 - Freight Vendor, 2 - Loading Vendor, 3 - Freight & Loading Vendor */             
      SentVAInfoData.ASSIGN_FLAG = 2
      SentVAInfoData_seq[i] = SentVAInfoData

      let be_data = JSON.parse(JSON.stringify(SentVAInfoData)) 
      SentVAInfoData_seq1[i] = be_data
      be_data = {}
      SentVAInfoData = {}
    }

    console.log(SentVAInfoData_seq,'SentVAInfoData_seq')
    console.log(SentVAInfoData_seq1,'SentVAInfoData_seq1')
    // setFetch(true)
    // return false

    FCITripsheetSapService.sentVAInfoToSAP(SentVAInfoData_seq).then((res) => {
      console.log(res,'sentVAInfoToSAP-response')
      let sap_tsc_res = JSON.stringify(res.data) 
      console.log(sap_tsc_res,'sap_tsc_res')

      if(sap_tsc_res && sap_tsc_res.length > 0){
         
        // fci_closure_data.append('lp_data', JSON.stringify(SentVAInfoData_seq1))
        // fci_closure_data.append('sap_res', sap_tsc_res)  

        toast.success('Vendor Assignment Rejection Sent to SAP Successfully!')  

        FCIClosureSubmissionService.rejectFreightExpenseSubmission(formDataUpdate).then((res) => { 
          console.log(res)
          setFetch(true)
          if (res.status == 200) {
            Swal.fire({
              title: "Freight Expense Submission Rejected Successfully!",
              icon: "success",
              confirmButtonText: "OK",
            }).then(function () {
              navigation('/FreightExpenseSubmissionApprovalHome')
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
              'Expense - Submission Cannot Be Updated From LP.. Kindly Contact Admin!'
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

      } else {
        setFetch(true)
        Swal.fire({
          title: 'Sent VA Info to SAP process Failed in SAP. Kindly contact admin..!',
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // window.location.reload(false)
        })

      }

    })
    .catch((error) => {
      setFetch(true)
      Swal.fire({
        title: 'Server Connection Failed. Kindly contact Admin.!',
        // text:  error.response.data.message,
        text:  error.message,
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
        // window.location.reload(false)
      })       
    })

  }

  const [fetch, setFetch] = useState(false)
  const [contractorInfo, setContractorInfo] = useState([])

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  /* ===================== The Constants Needed For First Render Part Start ===================== */

  const [settlementClosureData, setSettlementClosureData] = useState([])
  const [singleContractorArray, setSingleContractorArray] = useState([])
  const [singleClosureSeqArray, setSingleClosureSeqArray] = useState([])

  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */

  useEffect(() => {

      FCIClosureSubmissionService.getFreightExpenseApprovalInfoById(id).then((res) => {
        let closure_info_id_data = res.data.data
        console.log(closure_info_id_data,'closure_info_id_data')
        // setSingleContractorArray(closure_info_id_data)
        setSingleClosureSeqArray(closure_info_id_data)
      })
      .catch((error) => {
        setFetch(true)
        console.log(error)
        let errorText = error.response.data.message
        console.log(errorText,'errorText')
        let timerInterval;
        if (error.response.status === 401) { 
          Swal.fire({
            title: "Unauthorized Activities Found..",
            html: "App will close in <b></b> milliseconds.",
            icon: "error",
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              const timer = Swal.getPopup().querySelector("b");
              timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            }
          }).then((result) => {
            // console.log(result,'result') 
            if (result.dismiss === Swal.DismissReason.timer) { 
              logout()
            }
          });      
        }
      })

    }, [id])

    const [totalTonnage, setTotalTonnage] = useState(0)

    useEffect(()=>{
      if(singleClosureSeqArray){
        let p__no = singleClosureSeqArray.po_no
        let v__code = singleClosureSeqArray.expense_vendor_code
        let c__seq = singleClosureSeqArray.expense_sequence_no
        if(p__no && v__code){ 
          FCIClosureSubmissionService.getPoVendorSeqWiseTripFreightMigoData1(p__no,v__code,c__seq).then((res) => { 
            setFetch(true)
            let trip_migo_data = res.data.data
            let tot_ton = 0
            console.log(trip_migo_data, 'getPoVendorSeqWiseTripFreightMigoData1')
            if (trip_migo_data.length > 0) {
              let rowDataList = []
              trip_migo_data.map((data, index) => {
                tot_ton += Number(parseFloat(data.total_qty).toFixed(4))
                rowDataList.push({
                  S_NO: index + 1,
                  Tripsheet_No: data.tripsheet_no,
                  Migo_No: data.migo_no,
                  Migo_Date: data.migo_date,
                  Vehicle_No: data.truck_no,
                  Quantity_In_MTS: data.total_qty,
                  Vendor_Type: data.vendor_type == '1' ? 'Freight': 'Freight & Loading',
                  Base_Freight: data.budget_freight,
                  Actual_Freight: data.sap_actual_freight,
                  Updated_Freight: data.nlld_updated_freight,
                  Toll_Freight: data.toll_freight ? data.toll_freight : 0,
                  Atti_Cooli_Having: data.atti_cooli_having == '1' ? 'YES' : 'NO',
                  Atti_Cooli_Freight: data.atti_cooli_having == '1' ? data.atti_cooli : 0,
                  Other_Charge: data.vendor_type == '1' ? 0 : data.extra_charge,
                  Office_Expense: data.vendor_type == '1' ? 0 : data.office_expense,
                  Weighment_Expense: data.vendor_type == '1' ? 0 : data.weighment_charge,
                  Gate_Expense: data.vendor_type == '1' ? 0 : data.gate_expense,
                  Loading_Expense: data.vendor_type == '1' ? 0 : data.loading_freight, 
                  Additional_Freight: data.additional_freight ? data.additional_freight : 0,
                  Deduction: data.deduction ? data.deduction : 0,
                  Remarks:data.remarks,
                  Total_Freight: data.total_freight,
                  Expense_Date: data.created_date,
                })
              })
              setRowData(rowDataList)
              setVendorPoGroupingFPMigoData(trip_migo_data)
            } else {
              setVendorPoGroupingFPMigoData([])

            }
            setTotalTonnage(Number(parseFloat(tot_ton).toFixed(4)))
          })
        }

      }
    },[singleClosureSeqArray])

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

  const RakeSubmissionApprovalCancel = () => {
    console.log(values.apremarks,'apremarks')
    if (values.apremarks && values.apremarks.trim()) {
      setTripMigoAllDelete(true)
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
      name: 'Tripsheet No',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Migo No',
      selector: (row) => row.Migo_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Migo Date',
      selector: (row) => row.Migo_Date,
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
      name: 'Quantity in MTS',
      selector: (row) => row.Quantity_In_MTS,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Type',
      selector: (row) => row.Vendor_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Base Frt(PO)',
      selector: (row) => row.Base_Freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Act. Frt(WM)',
      selector: (row) => row.Actual_Freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Upd. Frt(LD)',
      selector: (row) => row.Updated_Freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Toll Exp.',
      selector: (row) => row.Toll_Freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Atti Cooli Having',
      selector: (row) => row.Atti_Cooli_Having,
      sortable: true,
      center: true,
    },
    {
      name: 'Atti Cooli Exp.',
      selector: (row) => row.Atti_Cooli_Freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Additional Exp.',
      selector: (row) => row.Additional_Freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Other Exp.',
      selector: (row) => row.Other_Charge,
      sortable: true,
      center: true,
    },
    {
      name: 'Office Exp.',
      selector: (row) => row.Office_Expense,
      sortable: true,
      center: true,
    },
    {
      name: 'Weighment Exp.',
      selector: (row) => row.Weighment_Expense,
      sortable: true,
      center: true,
    },
    {
      name: 'Gate Exp.',
      selector: (row) => row.Gate_Expense,
      sortable: true,
      center: true,
    },
    {
      name: 'Loading Exp.',
      selector: (row) => row.Loading_Expense,
      sortable: true,
      center: true,
    },
    {
      name: 'Deduction',
      selector: (row) => row.Deduction,
      sortable: true,
      center: true,
    },
    {
      name: 'Total Frt',
      selector: (row) => row.Total_Freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Expense Date',
      selector: (row) => row.Expense_Date,
      sortable: true,
      center: true,
    },
  ]

  const validationApproval = () => {

    const formDataUpdate = new FormData()

    formDataUpdate.append('id', id)
    formDataUpdate.append('created_by', user_id)
    formDataUpdate.append('remarks', values.apremarks)
    console.log(id,'id')
    console.log(values.apremarks,'remarks')
    console.log(user_id,'created_by')
    console.log(singleClosureSeqArray,'singleClosureSeqArray')
    // return false
    FCIClosureSubmissionService.approveFreightExpenseSubmission(formDataUpdate).then((res) => { 
      console.log(res)
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: "Freight Expense Submission Approved Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/FreightExpenseSubmissionApprovalHome')
        });
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // window.location.reload(false)
        });
      } else {
        toast.warning(
          'Freight Expense - Submission Cannot Be Updated From LP.. Kindly Contact Admin!'
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

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>

          {screenAccess ? (
            <>
              <CCard className="p-1">
                {singleClosureSeqArray && (
                  <CRow className="m-2">
                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Closure Sequence No.</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleClosureSeqArray.expense_sequence_no}
                        readOnly
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">PO No.</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleClosureSeqArray.po_no}
                        readOnly
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="cname">FCI Location</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cname"
                        size="sm"
                        id="cname"
                        value={locationFinder(singleClosureSeqArray.fci_plant_code)}
                        readOnly
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Closure Vendor Type</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleClosureSeqArray.expense_vendor_type == 1 ? 'Freight Vendor' : 'Loading Vendor'}
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
                        value={singleClosureSeqArray.expense_vendor_name}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Vendor Code</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleClosureSeqArray.expense_vendor_code}
                        readOnly
                      />
                    </CCol>                    

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Tripsheet Count / Total Tonnage (MTS)</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={`${singleClosureSeqArray.tripsheet_count} / ${totalTonnage}`}
                        readOnly
                      />
                    </CCol>

                    {/* <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Total Tonnage</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={totalTonnage}
                        readOnly
                      />
                    </CCol> */}

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Actual Freight</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleClosureSeqArray.nlfd_base_expenses}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Updated Freight</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleClosureSeqArray.nlld_base_expenses}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Other Expenses</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleClosureSeqArray.other_expenses}
                        readOnly
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Total Expenses</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleClosureSeqArray.expense_amount}
                        readOnly
                      />

                    </CCol>
                    {/* <CCol md={3}></CCol> */}
                    <CCol md={3} style={{textAlign:'end'}}>
                      {/* <CFormLabel htmlFor="cmn">.</CFormLabel> */}
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        style={{marginTop:'10%'}}
                        onClick={(e) => { 
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

                <CRow className="m-5">
                  <CCol md={3}>
                    <CFormLabel htmlFor="cmn">Expense Remarks</CFormLabel>
                    <CFormInput
                      style={{fontWeight: 'bolder'}}
                      name="cmn"
                      size="sm"
                      id="cmn"
                      value={singleClosureSeqArray.expense_remarks}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="apremarks">Approval Remarks</CFormLabel>
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

                </CRow>
                <CRow className="mt-2">
                  <CCol className="m-2" xs={12} sm={12} md={3}>
                    <CButton size="sm" color="primary" className="text-white" type="button">
                      <Link className="text-white" to="/RakeExpenseSubmissionApprovalHome">
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
                        RakeSubmissionApprovalCancel()

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
                        // setFetch(false)
                        setTripMigoAllConfirm(true)
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
                  backdrop="static"
                  visible={tripMigoAllDelete}
                  onClose={() => {
                    setTripMigoAllDelete(false)
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
                    <p className="lead">Are you sure to reject this Freight Expense Submission ?</p>
                    </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setTripMigoAllDelete(false)
                        setFetch(false)
                        rejectAllExpenseSubmission()
                      }}
                    >
                      Yes
                    </CButton>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setTripMigoAllDelete(false)
                      }}
                    >
                      No
                    </CButton>
                  </CModalFooter>
                </CModal>
                <CModal
                  size="md"
                  visible={tripMigoAllConfirm}
                  onClose={() => {
                    setTripMigoAllConfirm(false)
                  }}
                >
                  <CModalHeader
                    style={{
                      backgroundColor: '#ebc999',
                    }}
                  >
                    <CModalTitle>Confirmation To Approval</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <p className="lead">Are you sure to Approve this Freight Expense Submission ?</p>


                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setTripMigoAllConfirm(false)
                        setFetch(false)
                        validationApproval()
                      }}
                    >
                      Yes
                    </CButton>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setTripMigoAllConfirm(false)
                      }}
                    >
                      No
                    </CButton>
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

export default FreightExpenseSubmissionApproval



