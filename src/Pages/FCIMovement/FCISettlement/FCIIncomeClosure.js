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
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CTable,
  CTableBody,
  CTableCaption,
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
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from 'src/Pages/Depo/CommonMethods/CommonMethods' 
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate' 
import ThirdPartyService from 'src/Service/ThirdPartyAPI/ThirdPartyService'
import { formatDateAsDDMMYYY } from '../CommonMethods/CommonMethods'
import FCIClosureSubmissionService from 'src/Service/FCIMovement/FCIClosureSubmission/FCIClosureSubmissionService'
import FCITripsheetSapService from 'src/Service/SAP/FCITripsheetSapService'
import Swal from 'sweetalert2';
import AuthService from 'src/Service/Auth/AuthService'
import LocalStorageService from 'src/Service/LocalStoage'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import FCIPlantMasterService from 'src/Service/FCIMovement/FCIPlantMaster/FCIPlantMasterService'

const FCIIncomeClosure = () => {
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

  const tonnageFreight = 10 

  const [invoiceCopy, setInvoiceCopy] = useState('')
  const [tdsHaving, setTdsHaving] = useState(0)
  const REQ = () => <span className="text-danger"> * </span>

  const border = {
    borderColor: '#b1b7c1',
  }

  const exportToCSV = () => {
    // console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='FCI_MIGO_Expense_In_Income_Closure_'+dateTimeString
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
  const [fciDivision, setFciDivision] = useState(0)
  const [locationData, setLocationData] = useState([])

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.FCIClosureModule.FCI_Income_Closure

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
    inclremarks: '',
    tdsremarks: '',
    addi_remarks: '',
    deduct_remarks: '',
    expens_remarks: '',
    expens_approval_remarks: '',
    gstType: '',
    tdsType: '',
  }

  const [plantMasterData, setPlantMasterData] = useState([])
  const [vendorPoGroupingMigoData, setVendorPoGroupingMigoData] = useState([])

  const [singleClosureSeqArray, setSingleClosureSeqArray] = useState([])

  const [gstTaxTermsData, setGstTaxTermsData] = useState([])
  const [tdsTaxTermsData, setTdsTaxTermsData] = useState([])

  useEffect(() => {

    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
      console.log(response.data.data,'Plant Master List')
      setPlantMasterData(response.data.data)
    })

    /* Get Current Date And Time From Third Party API */
    ThirdPartyService.getCurrentDateTime().then((response) => {
      console.log(response,'getCurrentDateTime')
      // setPlantMasterData(response.data.data)
    })

    /* section for getting TDS Tax Terms Master List For TDS Tax Code Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      console.log(response.data.data,'setTdsTaxTermsData')
      setTdsTaxTermsData(response.data.data)
    })

    /* section for getting GST Tax Terms Master List For GST Tax Code Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(20).then((response) => {
      console.log(response.data.data,'setGstTaxTermsData')
      setGstTaxTermsData(response.data.data)
    })

    /* section for getting FCI Plant Lists from database */
    // DefinitionsListApi.visibleDefinitionsListByDefinition(34).then((response) => {
    FCIPlantMasterService.getActiveFCIPlantRequestTableData().then((response) => {
      // setFetch(true)
      let viewData = response.data.data
      console.log(viewData,'FCI Plant Data')
      setFciPlantData(viewData)
    })
  }, [])
   
  // const gstTaxCodeName = (code) => {
  //   let gst_tax_code_name = ''
  //   if(code == "E0"){
  //     gst_tax_code_name = 'No Tax'
  //   } else if(code == "T0"){
  //     gst_tax_code_name = 'GST ITC Reversal Exp'
  //   } else if(code == "R5"){
  //     gst_tax_code_name = 'Input Tax RCM (SGST,CGST @ 2.5% & 2.5%)'
  //   } else if(code == "F6"){
  //     gst_tax_code_name = 'Input Tax (SGST,CGST @ 6% & 6%)'
  //   } else {
  //     gst_tax_code_name = '--'
  //   }

  //   return gst_tax_code_name
  // }

  const tdsTaxCodeName = (code) => {
    let tds_tax_code_name = '-'
    tdsTaxTermsData.map((val, key) => {
      if (val.definition_list_code == code) {
        tds_tax_code_name = val.definition_list_name
      }
    })

    console.log(tds_tax_code_name,'tds_tax_code_name')

    return tds_tax_code_name
  }

  const gstTaxCodeName = (code) => {
    let tds_tax_code_name = '-'
    gstTaxTermsData.map((val, key) => {
      if (val.definition_list_code == code) {
        tds_tax_code_name = val.definition_list_name
      }
    })

    console.log(tds_tax_code_name,'tds_tax_code_name')

    return tds_tax_code_name
  }


  /* Overall Journey Information Constants */

  const [tripMigoAllDelete, setTripMigoAllDelete] = useState(false)
  const [tripMigoAllConfirm, setTripMigoAllConfirm] = useState(false)


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

  const handleChangeFciDivision = (e) => {
    let ndata = e.target.value
    console.log(ndata,'handleChangeFciDivision')
    if(ndata == 0){
      values.tdsremarks = ''
    }
    setFciDivision(ndata)
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

  const [baseFreightExpense, setBaseFreightExpense] = useState(0)
  const [addiFreightExpense, setAddiFreightExpense] = useState(0)
  const [deductFreightExpense, setDeductFreightExpense] = useState(0)
  const [totFreightExpense, setTotFreightExpense] = useState(0)

  const updateExpenseAmount = (event, child_property_name) => {
    let getData = event.target.value
    console.log(getData, 'getData')

    var floatValues =  /[+-]?([0-9]*[.])?[0-9]+/;

    if (getData.match(floatValues) && !isNaN(getData)) {
      //
    } else {
      getData = event.target.value.replace(/\D/g, '')
    }

    let initial_tot_freight = Number(parseFloat(Number(parseFloat(singleClosureSeqArray.expense_amount).toFixed(4))))
      // + Number(parseFloat(totalTonnage*tonnageFreight).toFixed(4))).toFixed(4))

    let final_tot_freight = 0
    let addi_freight = addiFreightExpense
    let deducti_freight = deductFreightExpense

    if(getData){
      if(child_property_name == 'add_freight'){
        addi_freight = Number(parseFloat(getData).toFixed(4))
      } else {
        deducti_freight = Number(parseFloat(getData).toFixed(4))
      }
    } else {
      child_property_name == 'add_freight' ? addi_freight = 0 : deducti_freight = 0
    }

    final_tot_freight = Number(parseFloat(initial_tot_freight).toFixed(4)) + Number(parseFloat(addi_freight).toFixed(4)) - Number(parseFloat(deducti_freight).toFixed(4))

    setDeductFreightExpense(deducti_freight)
    setAddiFreightExpense(addi_freight)
    setBaseFreightExpense(initial_tot_freight)
    setTotFreightExpense(final_tot_freight)

  }

  const [fciPlantData, setFciPlantData] = useState([])

  const locationFinder = (plant) => {
    let n_loc = '--'
    fciPlantData.map((datann, indexnn) => {
      if(datann.plant_symbol == plant){
        n_loc = datann.plant_name
      }
    })
    console.log(n_loc,'n_loc')
    return n_loc
  }

  const [fetch, setFetch] = useState(false) 

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  function logout() {
    AuthService.forceLogout(user_id).then((res) => {
      // console.log(res)
      if (res.status == 204) {
        LocalStorageService.clear()
        window.location.reload(false)
      }
    })
  }

  /* ===================== The Constants Needed For First Render Part Start ===================== */

  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */

  useEffect(() => {

    FCIClosureSubmissionService.getTripClosureInfoById(id).then((res) => { 
        let closure_info_id_data = res.data.data
        console.log(closure_info_id_data,'closure_info_id_data') 
        setBaseFreightExpense()
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
    const [invoicePostingDate, setInvoicePostingDate] = useState(0)
    const handleChangeInvoicePostingDate = (event) => {
      let vall = event.target.value
      console.log('handleChangeInvoicePostingDate', vall)
      setInvoicePostingDate(vall)
    }

    useEffect(()=>{
      if(singleClosureSeqArray){
        let p__no = singleClosureSeqArray.po_no
        let v__code = singleClosureSeqArray.expense_vendor_code
        let c__seq = singleClosureSeqArray.expense_sequence_no
        if(p__no && v__code){ 
          if(singleClosureSeqArray.expense_vendor_type == 1){
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
                setVendorPoGroupingMigoData(trip_migo_data)
              } else {
                setVendorPoGroupingMigoData([])
              }
              let totTon = Number(parseFloat(tot_ton).toFixed(4))
              setTotalTonnage(totTon)
              let totExp = Number(parseFloat(Number(parseFloat(singleClosureSeqArray.expense_amount).toFixed(4))))
              setBaseFreightExpense(totExp)
              setTotFreightExpense(totExp+addiFreightExpense-deductFreightExpense)
            })
          } else {
            FCIClosureSubmissionService.getPoVendorSeqWiseTripLoadingMigoData1(p__no,v__code,c__seq).then((res) => { 
              setFetch(true)
              let trip_migo_data = res.data.data
              let tot_ton = 0
              console.log(trip_migo_data, 'getPoVendorSeqWiseTripLoadingMigoData1')
              if (trip_migo_data.length > 0) {
                let rowDataList = []
                trip_migo_data.map((data, index) => {
                  tot_ton += Number(parseFloat(data.total_qty).toFixed(4))
                  rowDataList.push({
                    S_NO: index + 1,
                    Tripsheet_No: data.tripsheet_no,
                    PO_No: data.po_no,
                    VA_No: data.pp_va_no,
                    Migo_No: data.migo_no,
                    Migo_Date: data.migo_date,
                    Vehicle_No: data.truck_no,
                    Quantity_In_MTS: data.total_qty,
                    AC_Deduction: data.atti_cooli_deduction == '1' ? 'YES' : 'NO',
                    AC_Charge: data.atti_cooli,
                    Other_Charge: data.extra_charge,
                    Office_Expense: data.office_expense,
                    Weighment_Expense: data.weighment_charge,
                    Gate_Expense: data.gate_expense,
                    Loading_Expense: data.nlfd_updated_loading_expense, 
                    Deduction: data.deduction ? data.deduction : 0,
                    Remarks:data.remarks,
                    Total_Freight: data.total_freight,
                    Expense_Date: data.created_date,
                  })
                })
  
                setRowData(rowDataList)
                setVendorPoGroupingMigoData(trip_migo_data)
              } else {
                setVendorPoGroupingMigoData([])
              }
              let totTon = Number(parseFloat(tot_ton).toFixed(4))
              setTotalTonnage(totTon)
              let totExp = Number(parseFloat(Number(parseFloat(singleClosureSeqArray.expense_amount).toFixed(4))))
              setBaseFreightExpense(totExp)
              setTotFreightExpense(totExp)
            })
          }
        }
      }
    },[singleClosureSeqArray]) 

  const [mainKey, setMainKey] = useState(1)
  const [activeKey, setActiveKey] = useState(1)
  const [visible, setVisible] = useState(false)
  const [invoiceCopyAvailable, setInvoiceCopyAvailable] = useState(false)

  const FCIExpenseValidationApprovalReject = () => {
    console.log(values.expens_approval_remarks,'expens_approval_remarks')
    if (values.expens_approval_remarks && values.expens_approval_remarks.trim()) {
      setTripMigoAllDelete(true)
    } else {
      setFetch(true)
      Swal.fire({
        title: 'Expense Approval Remarks required for rejection..',
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
      })
      values.expens_approval_remarks = ''
      return false
    }
  }

  const [expenseUpdateAvailable, setExpenseUpdateAvailable] = useState(false)

  const columns_Loading = [
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
      name: 'AC Deduction',
      selector: (row) => row.AC_Deduction,
      sortable: true,
      center: true,
    },
    {
      name: 'Atti Cooli',
      selector: (row) => row.AC_Charge,
      sortable: true,
      center: true,
    },
    {
      name: 'Other Expense',
      selector: (row) => row.Other_Charge,
      sortable: true,
      center: true,
    },
    {
      name: 'Office Expense',
      selector: (row) => row.Office_Expense,
      sortable: true,
      center: true,
    },
    {
      name: 'Weighment Expense',
      selector: (row) => row.Weighment_Expense,
      sortable: true,
      center: true,
    },
    {
      name: 'Gate Expense',
      selector: (row) => row.Gate_Expense,
      sortable: true,
      center: true,
    },
    {
      name: 'Loading Expense',
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
      name: 'Total Freight',
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
  const columns_Freight = [
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

  const checkDeductioninValid =(freight) => {
    if(freight && freight != '' &&  Number(parseFloat(freight).toFixed(3)) > 0){
      return false
    } else {
      return true
    }
  }

  const incomePostingValidation = () => {

    /* ============== Submition Validation Part Start =============== */

    if (invoicePostingDate) {
      //
    } else {
      setFetch(true)
      toast.warning('You should select income posting date before submitting..!')
      return false
    }

    let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate();
    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date

    if(JavascriptDateCheckComponent(from_date,invoicePostingDate,to_date)){
      //
    } else {
      setFetch(true)
      toast.warning('Invalid Income Posting date')
      return false
    }

    if (fciDivision == 0) {
      setFetch(true)
      toast.warning('You should select income posting division before submitting..!')
      return false
    }

    if (fciDivision == 20068 && values.tdsremarks.trim() == '') {
      setFetch(true)
      toast.warning('TDS Remarks required for MMD division before submitting..!')
      return false
    }

    if (values.inclremarks.trim() == '') {
      setFetch(true)
      toast.warning('Income Closure Remarks required before submitting..!')
      return false
    }

    setTripMigoAllConfirm(true)

     /* ============== Submition Validation Part End =============== */

    setTripMigoAllConfirm(true)
  }

  const IncomeBaseAmountFinder = (data) => {

    let income_base_amount = 0  
    let nlfd_expense = Number(parseFloat(data.nlfd_base_expenses).toFixed(4))
    let other_expenses = Number(parseFloat(data.other_expenses).toFixed(4))
    let additional_expenses = Number(parseFloat(data.additional_expenses).toFixed(4))
    let updated_income_base_amount = nlfd_expense+other_expenses+additional_expenses
    income_base_amount = Number(parseFloat(updated_income_base_amount).toFixed(4)) 
    console.log(income_base_amount,'IncomeBaseAmountFinder-income_base_amount')
    return income_base_amount
  }

  const IncomeAdditionalAmountFinder = () => {
    let tonnage_freight = Number(parseFloat(totalTonnage*tonnageFreight).toFixed(4))
    console.log(tonnage_freight,'IncomeAdditionalAmountFinder-tonnage_freight')
    return tonnage_freight
  }

  const IncomeAmountFinder = (data) => {

    let income_amount = 0
    let sap_expense_amount = Number(parseFloat(data.sap_expense_amount).toFixed(4))
    let tonnage_freight = Number(parseFloat(totalTonnage*tonnageFreight).toFixed(4))
    let nlfd_expense = Number(parseFloat(data.nlfd_base_expenses).toFixed(4))
    let nlld_expense = Number(parseFloat(data.nlld_base_expenses).toFixed(4))
    let nlfd_expense_amount = sap_expense_amount+nlfd_expense-nlld_expense
    console.log(sap_expense_amount,'IncomeAmountFinder-sap_expense_amount')
    console.log(nlfd_expense,'IncomeAmountFinder-nlfd_expense')
    console.log(nlld_expense,'IncomeAmountFinder-nlld_expense')
    console.log(tonnage_freight,'IncomeAmountFinder-tonnage_freight')
    console.log(nlfd_expense_amount,'IncomeAmountFinder-nlfd_expense_amount')
    income_amount = Number(parseFloat(nlfd_expense_amount+tonnage_freight).toFixed(4)) 
    console.log(income_amount,'IncomeAmountFinder-income_amount')
    return income_amount
  }

  const incomePostingSubmit = () => {

    console.log(singleClosureSeqArray,'singleClosureSeqArray')
    // return false

    let freightTotal = Number(parseFloat(singleClosureSeqArray.total_expense_amount).toFixed(3)) + Number(parseFloat(singleClosureSeqArray.deduction_expenses).toFixed(3))
    // 'Base Freight -	singleClosureSeqArray.nlfd_base_expenses',
    // 'Tonnage Commision -	tonnageFreight',
    // 'Other Expenses	- singleClosureSeqArray.other_expenses',
    // 'Additional Expenses	- singleClosureSeqArray.additional_expenses'
    console.log(singleClosureSeqArray.expense_sequence_no,'FCI_SEQ_NO')
    console.log(singleClosureSeqArray.expense_vendor_type,'VENDOR_TYPE')
    console.log(fciDivision,'CUSTOMER')    
    console.log(singleClosureSeqArray.po_no,'PO_NO')
    console.log(singleClosureSeqArray.expense_vendor_type == 2 ? singleClosureSeqArray.sap_expense_amount: IncomeBaseAmountFinder(singleClosureSeqArray),'BASE_FRE') 
    console.log(singleClosureSeqArray.expense_vendor_type == 2 ? 0 : IncomeAdditionalAmountFinder(),'ADD_FRE')
    console.log(0,'LOAD_FRE')
    console.log(singleClosureSeqArray.expense_vendor_type == 2 ? singleClosureSeqArray.sap_expense_amount : IncomeAmountFinder(singleClosureSeqArray),'TOTAL_FRE')
    console.log(singleClosureSeqArray.tripsheet_count,'TRIP_COUNT')
    console.log(invoicePostingDate,'POST_DATE')
    console.log(values.inclremarks,'INC_REMARK')
    console.log(fciDivision == '20068' ? values.tdsremarks : '','TDS_REC_REMARK') 

    // return false
    /* =================== Request Sent To SAP For Expense Document No. Generation Start ======================= */

    let sap_data = new FormData()
    sap_data.append('FCI_SEQ_NO', singleClosureSeqArray.expense_sequence_no)
    sap_data.append('CUSTOMER', fciDivision)
    sap_data.append('VENDOR_TYPE', singleClosureSeqArray.expense_vendor_type)
    sap_data.append('po_No', singleClosureSeqArray.po_no)
    sap_data.append('BASE_FRE', singleClosureSeqArray.expense_vendor_type == 2 ? singleClosureSeqArray.sap_expense_amount: IncomeBaseAmountFinder(singleClosureSeqArray))
    sap_data.append('ADD_FRE', singleClosureSeqArray.expense_vendor_type == 2 ? 0 : IncomeAdditionalAmountFinder())
    sap_data.append('LOAD_FRE', 0)
    sap_data.append('TOTAL_FRE', singleClosureSeqArray.expense_vendor_type == 2 ? singleClosureSeqArray.sap_expense_amount : IncomeAmountFinder(singleClosureSeqArray))
    sap_data.append('TRIP_COUNT', singleClosureSeqArray.tripsheet_count)
    sap_data.append('POST_DATE', invoicePostingDate)
    sap_data.append('INC_REMARK', values.inclremarks)
    sap_data.append('TDS_REC_REMARK', fciDivision == '20068' ? values.tdsremarks : '')

    setFetch(false)
    FCITripsheetSapService.fciSAPIncomePosting(sap_data).then((res) => {
        let sap_sequence_no = res.data.FCI_SEQ_NO
        let sap_po_no = res.data.PO_NO
        let sap_income_status = res.data.STATUS
        let sap_income_tds_status = res.data.TDS_STATUS
        let sap_income_message = res.data.MESSAGE
        let sap_tds_income_message = res.data.TDS_MESSAGE
        let sap_income_document_no = res.data.DOCUMENT_NO
        let sap_income_tds_document_no = res.data.TDS_DOCUMENT_NO

        console.log(
          sap_sequence_no + '/' + sap_po_no + '/' + sap_income_status + '/' + sap_income_tds_status + '/' + sap_income_message + '/' + sap_tds_income_message + '/' + sap_income_document_no + '/' + sap_income_tds_document_no
        )

        if (
          sap_income_status == '1' &&
          res.status == 200 &&
          sap_income_document_no &&
          sap_income_message &&
          sap_sequence_no == singleClosureSeqArray.expense_sequence_no &&
          sap_po_no == singleClosureSeqArray.po_no && (
            fciDivision != '20068' || ( sap_income_tds_status == '1' && sap_income_tds_document_no &&
            sap_tds_income_message )
          )
        ) {

            /* ====== Request Sent To SAP For Expense Document No. Generation End ========== */

          const formDataUpdate = new FormData()

          formDataUpdate.append('id', id)
          formDataUpdate.append('expense_sequence_no', sap_sequence_no)
          formDataUpdate.append('expense_vendor_code', singleClosureSeqArray.expense_vendor_code)
          formDataUpdate.append('po_no', sap_po_no)
          formDataUpdate.append('expense_vendor_type', singleClosureSeqArray.expense_vendor_type)

          formDataUpdate.append('created_by', user_id)
          formDataUpdate.append('remarks', values.inclremarks)
          formDataUpdate.append('income_customer_code', fciDivision)
          formDataUpdate.append('income_posting_date', invoicePostingDate)

          formDataUpdate.append('income_tds', fciDivision == '20068' ? 1 : 0)
          formDataUpdate.append('income_tds_document_no', fciDivision == '20068' ? sap_income_tds_document_no : '')
          formDataUpdate.append('income_document_no', sap_income_document_no)
          formDataUpdate.append('income_tds_remarks', fciDivision == '20068' ? values.tdsremarks : '')

          formDataUpdate.append('total_qty', totalTonnage)
          formDataUpdate.append('lp_income', IncomeAdditionalAmountFinder())
          formDataUpdate.append('income_amount', IncomeAmountFinder(singleClosureSeqArray))

          // return false
          FCIClosureSubmissionService.submitIncomePosting(formDataUpdate).then((res) => {

            console.log(res,'submitIncomePosting')
            setFetch(true)
            if (res.status == 200) {
              Swal.fire({
                title: "FCI Income Posting Submitted Successfully!",
                icon: "success",
                html: fciDivision == '20068' ? 'SAP Inc. Doc. No. : ' + sap_income_document_no + '<br />' + 'SAP TDS Doc. No. : ' + sap_income_tds_document_no : 'Income Document No : ' + sap_income_document_no,
                confirmButtonText: "OK",
              }).then(function () {
                navigation('/FCIIncomeClosureHome')
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
                'Expense Posting - Submission Cannot Be Updated From LP.. Kindly Contact Admin!'
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

        } else if (
          (sap_income_status == '2') &&
          res.status == 200 &&
          sap_income_document_no == '' &&
          sap_income_message &&
          sap_sequence_no == singleClosureSeqArray.expense_sequence_no &&
          sap_po_no == singleClosureSeqArray.po_no
        ) {

          Swal.fire({
            title: sap_income_message + ' Kindly Contact Admin..',
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            window.location.reload(false)
          })

        }else {
          setFetch(true)
          toast.warning('FCI Expense Posting Failed in SAP.. Kindly Contact Admin!')
        }

      }
    )
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

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>

          {screenAccess ? (
            <>
              <CCard className="p-1">
                <CTabContent className="p-3">
                  <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={mainKey === 1}>
                    {/* Hire Vehicles Part Header Tab Start */}
                    <CNav variant="tabs" role="tablist">
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 1}
                          onClick={() => setActiveKey(1)}
                        >
                          General Information
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 2}
                          onClick={() => setActiveKey(2)}
                        >
                          Trip MIGO Information
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 3}
                          onClick={() => setActiveKey(3)}
                        >
                          Expense Information
                        </CNavLink>
                      </CNavItem>                      
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 4}
                          onClick={() => setActiveKey(4)}
                        >
                          Income Information
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>

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
                              <CFormLabel htmlFor="cmn">Vendor Type</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={singleClosureSeqArray.expense_vendor_type == 2 ? 'Loading Vendor' : 'Freight Vendor'}
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
                              <CFormLabel htmlFor="cmn">Total Tonnage</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={totalTonnage}
                                readOnly
                              />
                            </CCol>

                            {singleClosureSeqArray.expense_vendor_type == 1 && (
                              <>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="cmn">Base Freight / Updated Freight</CFormLabel>
                                  <CFormInput
                                    style={{fontWeight: 'bolder'}}
                                    name="cmn"
                                    size="sm"
                                    id="cmn"
                                    value={`${singleClosureSeqArray.nlfd_base_expenses} / ${singleClosureSeqArray.nlld_base_expenses}`}
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
                                    value={`${singleClosureSeqArray.other_expenses}`}
                                    readOnly
                                  />
                                </CCol>

                                <CCol md={3}>
                                  <CFormLabel htmlFor="cmn">Total Expense (Updated + Other)</CFormLabel>
                                  <CFormInput
                                    style={{fontWeight: 'bolder'}}
                                    name="cmn"
                                    size="sm"
                                    id="cmn"
                                    value={singleClosureSeqArray.expense_amount}
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}

                            {singleClosureSeqArray.expense_vendor_type == 2 && (
                              <>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="cmn">Total Expense</CFormLabel>
                                  <CFormInput
                                    style={{fontWeight: 'bolder'}}
                                    name="cmn"
                                    size="sm"
                                    id="cmn"
                                    value={singleClosureSeqArray.expense_amount}
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}

                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">Tripsheet Count </CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={singleClosureSeqArray.tripsheet_count}
                                readOnly
                              />
                            </CCol>

                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">Expense Submitted By</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}                      
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={singleClosureSeqArray.fci_user_info.emp_name}
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
                                value={singleClosureSeqArray.expense_remarks}
                                readOnly
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">Submission Time</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={singleClosureSeqArray.expense_submission_time}
                                readOnly
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">Submission Approved By</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={singleClosureSeqArray.approval_user_info.emp_name}
                                readOnly
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">Submission Approval Remarks</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={singleClosureSeqArray.expense_approval_remarks ? singleClosureSeqArray.expense_approval_remarks : '--'}
                                readOnly
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">Submission Approval Time</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={singleClosureSeqArray.expense_approval_time_formatted}
                                readOnly
                              />
                            </CCol>

                          </CRow>
                        )}

                        <CRow className="mt-2">
                          <CCol className="m-2" xs={12} sm={12} md={3}>
                            <CButton size="sm" color="primary" className="text-white" type="button">
                              <Link className="text-white" to="/FCIIncomeClosureHome">
                                Previous
                              </Link>
                            </CButton>
                          </CCol>
                        </CRow>

                      </CTabPane>
                    </CTabContent>

                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 2}>
                        <CRow className="m-2">
                          <CCol md={3}></CCol>
                          <CCol md={3}></CCol>
                          <CCol md={3}></CCol>
                          <CCol md={3} style={{textAlign:'end'}}>
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
                        <CustomTable
                          columns={singleClosureSeqArray.expense_vendor_type == 1 ? columns_Freight : columns_Loading}
                          pagination={true}
                          data={rowData}
                          fieldName={'Driver_Name'}
                          showSearchFilter={true}
                        />
                        <CRow className="mt-2">
                          <CCol className="m-2" xs={12} sm={12} md={3}>
                            <CButton size="sm" color="primary" className="text-white" type="button">
                              <Link className="text-white" to="/FCIExpenseValidationHome">
                                Previous
                              </Link>
                            </CButton>
                          </CCol>
                        </CRow>
                      </CTabPane>
                    </CTabContent>

                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 3}>

                        <CTable caption="top" hover style={{ height: '35vh' }}>
                          <CTableCaption style={{ color: 'maroon' }}>Expenses For The Vendor : {`${singleClosureSeqArray.expense_vendor_name} (${singleClosureSeqArray.expense_vendor_code})`}</CTableCaption>

                          {/* ================== Expense Table Header Part Start ====================== */}
                          <CTableHead
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                            }}
                          >
                            <CTableRow>
                              <CTableHeaderCell scope="col" style={{ color: 'white',width:'10%' }}>
                                S.No
                              </CTableHeaderCell>

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Type
                              </CTableHeaderCell>

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Amount
                              </CTableHeaderCell>                              

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Remarks
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          {/* ================== Expense Table Header Part End ======================= */}
                          {/* ================== Expense Table Body Part Start ======================= */}
                          <CTableBody>
                            {/* ================== Expenses - Charges Part Start ======================= */}

                            <CTableRow>
                              <CTableDataCell scope="row" style={{ width:'10%' }}>
                                <b>1</b>
                              </CTableDataCell>
                              <CTableDataCell>Expenses</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={Number(parseFloat(Number(parseFloat(singleClosureSeqArray.expense_amount).toFixed(4))))}
                                  readOnly
                                />
                              </CTableDataCell>
                              
                              <CTableDataCell>
                                <CFormInput
                                  style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={singleClosureSeqArray.expense_remarks ? singleClosureSeqArray.expense_remarks : '-'}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Expenses - Charges Part End ======================= */}

                            {/* ================== Additional Expenses - Charges Part Start =================== */}

                            <CTableRow>
                              <CTableDataCell scope="row" style={{ width:'10%' }}>
                                <b>2</b>
                              </CTableDataCell>
                              <CTableDataCell>Additional Expenses</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={Number(parseFloat(Number(parseFloat(singleClosureSeqArray.additional_expenses).toFixed(4))))}
                                  readOnly
                                />
                              </CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={singleClosureSeqArray.ec_additional_remarks ? singleClosureSeqArray.ec_additional_remarks : '-'}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Additional Expenses - Charges Part End ======================= */}

                            {/* ================== Deduction Charges Part Start ======================= */}

                            <CTableRow>
                              <CTableDataCell scope="row" style={{ width:'10%' }}>
                                <b>3</b>
                              </CTableDataCell>
                              <CTableDataCell>Deduction</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={Number(parseFloat(Number(parseFloat(singleClosureSeqArray.deduction_expenses).toFixed(4))))}
                                  readOnly
                                />

                              </CTableDataCell>
                               
                              <CTableDataCell scope="row">
                                <CFormInput
                                  style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={singleClosureSeqArray.ec_deduction_remarks ? singleClosureSeqArray.ec_deduction_remarks : '-'}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Deduction Charges Part End ======================= */}

                            {/* ================== Total Charges Part Start ============ */}

                            <CTableRow>
                              <CTableDataCell scope="row" style={{ width:'10%' }}>
                                <b>*</b>
                              </CTableDataCell>
                              <CTableDataCell>Total Trip Expenses</CTableDataCell> 
                              <CTableDataCell scope="row">
                                <CFormInput
                                  style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={Number(parseFloat(Number(parseFloat(singleClosureSeqArray.total_expense_amount).toFixed(4))))}
                                  readOnly
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={singleClosureSeqArray.ec_remarks ? singleClosureSeqArray.ec_remarks : '-'}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Total Charges Part End ========== */}
                          </CTableBody>
                        </CTable>
                        <CRow className="mt-2" hidden>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              Expense Information
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <CRow className="mt-2">
                          
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="gstHave">
                              GST Having  
                            </CFormLabel>
                            <CFormInput
                              size="sm" 
                              id="gstHave"
                              name="gstHave"
                              value={singleClosureSeqArray.expense_gst == '1' ? 'YES' : 'NO'}
                              readOnly
                            />
                          </CCol>
                          {singleClosureSeqArray.expense_gst == 1 && (
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="gstValue">
                                GST Tax Type  
                              </CFormLabel>
                              <CFormInput
                                size="sm" 
                                id="gstValue"
                                name="gstValue"
                                // value={singleClosureSeqArray.expense_gst_type}
                                value={`${gstTaxCodeName(singleClosureSeqArray.expense_gst_type)} (${singleClosureSeqArray.expense_gst_type})`}
                                readOnly
                              />
                            </CCol>
                          )}
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="tdsHave">
                              TDS Having  
                            </CFormLabel>
                            <CFormInput
                              size="sm" 
                              id="tdsHave"
                              name="tdsHave"
                              value={singleClosureSeqArray.expense_tds == '1' ? 'YES' : 'NO'}
                              readOnly
                            />
                          </CCol>
                          {singleClosureSeqArray.expense_tds == 1 && (
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tdsValue">
                                TDS Tax Type  
                              </CFormLabel>
                              <CFormInput
                                size="sm" 
                                id="tdsValue"
                                name="tdsValue"
                                value={`${tdsTaxCodeName(singleClosureSeqArray.expense_tds_type)} (${singleClosureSeqArray.expense_tds_type})`}
                                readOnly
                              />
                            </CCol>
                          )}   
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="expenseValidatedBy">
                              Expense Validated By
                            </CFormLabel>
                            <CFormInput
                              // style={{fontWeight: 'bolder'}}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleClosureSeqArray.fci_expense_user_info.emp_name}
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="expenseValidationTime">
                              Expense Validation Date & Time
                            </CFormLabel>
                            <CFormInput
                              // style={{fontWeight: 'bolder'}}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleClosureSeqArray.expense_closure_time_formatted}
                              readOnly
                            />
                          </CCol>                      
                          
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="expensePostingDate">
                              Expense Posting Date  
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="date"
                              id="expensePostingDate"
                              name="expensePostingDate"
                              value={singleClosureSeqArray.expense_posting_date}
                              readOnly
                            />
                          </CCol>
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
                                <CModalTitle>Expense Invoice Copy</CModalTitle>
                              </CModalHeader>

                              <CModalBody>
                                {singleClosureSeqArray.invoice_copy &&
                                !singleClosureSeqArray.invoice_copy.includes('.pdf') ? (
                                  <CCardImage
                                    orientation="top"
                                    src={singleClosureSeqArray.invoice_copy}
                                  />
                                ) : (
                                  <iframe
                                    orientation="top"
                                    height={500}
                                    width={475}
                                    src={singleClosureSeqArray.invoice_copy}
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
                           
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="expenseValidatedBy">
                              Expense Posted By
                            </CFormLabel>
                            <CFormInput
                              // style={{fontWeight: 'bolder'}}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleClosureSeqArray.fci_expense_posting_user_info.emp_name}
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="expenseValidationTime">
                              Expense Posting Date & Time
                            </CFormLabel>
                            <CFormInput
                              // style={{fontWeight: 'bolder'}}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleClosureSeqArray.expense_posting_time_formatted}
                              readOnly
                            />
                          </CCol>      
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="expens_posting_remarks">Expense Posting Remarks</CFormLabel>
                            <CFormInput
                              size="sm" 
                              id="expens_posting_remarks"
                              name="expens_posting_remarks"
                              value={singleClosureSeqArray.expense_posting_remarks}
                              readOnly
                            />
                          </CCol> 
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="sap_expense_doc_no">SAP Expense Doc. No</CFormLabel>
                            <CFormInput
                              size="sm" 
                              id="sap_expense_doc_no"
                              name="sap_expense_doc_no"
                              value={singleClosureSeqArray.expense_document_no}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="sap_expense_ded_doc_no">SAP Deduction Doc. No</CFormLabel>
                            <CFormInput
                              size="sm" 
                              id="sap_expense_ded_doc_no"
                              name="sap_expense_ded_doc_no"
                              value={singleClosureSeqArray.deduction_document_no ? singleClosureSeqArray.deduction_document_no : '-'}
                              readOnly
                            />
                          </CCol>                          
                        </CRow>
                      </CTabPane>
                    </CTabContent>

                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 4}>
                        {singleClosureSeqArray && (
                          <>
                            <CRow className="m-2">                              
                              {singleClosureSeqArray.expense_vendor_type != 2 && (
                                <CCol md={3}>
                                  <CFormLabel htmlFor="cmn">NLLD Updated Freight</CFormLabel>
                                  <CFormInput
                                    style={{fontWeight: 'bolder'}}
                                    name="cmn"
                                    size="sm"
                                    id="cmn"
                                    value={singleClosureSeqArray.nlld_base_expenses}
                                    readOnly
                                  />
                                </CCol>
                              )}
                              <CCol md={3}>
                                <CFormLabel htmlFor="cmn">{singleClosureSeqArray.expense_vendor_type != 2 ? 'Other Expenses' : 'Loading Expenses'}</CFormLabel>
                                <CFormInput
                                  style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={singleClosureSeqArray.expense_vendor_type != 2 ? singleClosureSeqArray.other_expenses : singleClosureSeqArray.expense_amount}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={3}>
                                <CFormLabel htmlFor="cmn">Additional Expenses</CFormLabel>
                                <CFormInput
                                  style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={singleClosureSeqArray.additional_expenses}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={3}>
                                <CFormLabel htmlFor="cmn">SAP Expense Claimed Amount</CFormLabel>
                                <CFormInput
                                  style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={singleClosureSeqArray.sap_expense_amount}
                                  readOnly
                                />
                              </CCol> 
                              {singleClosureSeqArray.expense_vendor_type != 2  && (
                                <>
                                  <CCol md={3}>
                                    <CFormLabel htmlFor="cmn">Total Tonnage</CFormLabel>
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
                                    <CFormLabel htmlFor="cmn">Income Per Tonnage</CFormLabel>
                                    <CFormInput
                                      style={{fontWeight: 'bolder'}}
                                      name="cmn"
                                      size="sm"
                                      id="cmn"
                                      // value={freightFinder(singleClosureSeqArray.rake_plant_code)}
                                      value={tonnageFreight}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol md={3}>
                                    <CFormLabel htmlFor="cmn">Income</CFormLabel>
                                    <CFormInput
                                      style={{fontWeight: 'bolder'}}
                                      name="cmn"
                                      size="sm"
                                      id="cmn"
                                      value={Number(parseFloat(totalTonnage*tonnageFreight).toFixed(4))}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol md={3}>
                                    <CFormLabel htmlFor="cmn">NLFD Base Freight</CFormLabel>
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
                                    <CFormLabel htmlFor="cmn">Total Income</CFormLabel>
                                    <CFormInput
                                      style={{fontWeight: 'bolder'}}
                                      name="cmn"
                                      size="sm"
                                      id="cmn"
                                      value={IncomeAmountFinder(singleClosureSeqArray)} 
                                      readOnly
                                    />
                                  </CCol>
                                </>
                              )}
                              {singleClosureSeqArray.expense_vendor_type == 2  && (
                                <CCol md={3}>
                                  <CFormLabel htmlFor="cmn">Total Income</CFormLabel>
                                  <CFormInput
                                    style={{fontWeight: 'bolder'}}
                                    name="cmn"
                                    size="sm"
                                    id="cmn"
                                    value={singleClosureSeqArray.sap_expense_amount} 
                                    readOnly
                                  />
                                </CCol>
                              )}                               
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="incomePostingDate">
                                  Income Posting Date <REQ />{' '}
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  type="date"
                                  id="incomePostingDate"
                                  name="incomePostingDate"
                                  onChange={handleChangeInvoicePostingDate}
                                  min={Expense_Income_Posting_Date.min_date}
                                  max={Expense_Income_Posting_Date.max_date}
                                  onKeyDown={(e) => {
                                    e.preventDefault();
                                  }}
                                  value={invoicePostingDate}
                                />
                              </CCol>
                              <CCol md={3}>
                                <CFormLabel htmlFor="cmn">Division <REQ />{' '}</CFormLabel>
                                <CFormSelect
                                  size="sm"
                                  name="fci_division"
                                  onChange={handleChangeFciDivision}
                                  value={fciDivision}
                                  id="fci_division"
                                >
                                  <option value="0">Select</option>
                                  <option value="1012">FOODS</option>
                                  <option value="20068">MMD</option>
                                </CFormSelect>
                              </CCol>
                              {fciDivision == 20068 ? (
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="tdsremarks">TDS Receivable Remarks <REQ />{' '}</CFormLabel>
                                  <CFormTextarea
                                    name="tdsremarks"
                                    id="tdsremarks"
                                    rows="1"
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    value={values.tdsremarks}
                                  ></CFormTextarea>
                                </CCol>
                              ) : <></>}
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="inclremarks">Income Closure Remarks <REQ />{' '}</CFormLabel>
                                <CFormTextarea
                                  name="inclremarks"
                                  id="inclremarks"
                                  rows="1"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  onChange={handleChange}
                                  value={values.inclremarks}
                                ></CFormTextarea>
                              </CCol>                                        
                            </CRow>
                            <CRow>
                              <CCol
                                className="offset-md-9"
                                xs={12}
                                sm={12}
                                md={3} 
                                style={{ display: 'flex', flexDirection: 'row-reverse', cursor: 'pointer' }}
                              >                                
                                <CButton
                                  size="sm"
                                  color="warning" 
                                  className="mx-3 text-white" 
                                  onClick={() => { 
                                    incomePostingValidation()
                                  }}
                                  type="submit"
                                >
                                  Submit                               
                                </CButton>
                              </CCol>
                            </CRow>
                          </>
                          
                        )}
                      </CTabPane>
                    </CTabContent>
                  </CTabPane>
                </CTabContent>

                {/* ======================= Confirm Button Modal Area ========================== */}
                {/* ======================= Confirm Button Modal Area ========================== */}
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
                    <CModalTitle>Confirmation To Submit</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <p className="lead">Are you sure to Submit this Income Posting ?</p>


                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setTripMigoAllConfirm(false)
                        // setFetch(false)
                        incomePostingSubmit()
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

export default FCIIncomeClosure





