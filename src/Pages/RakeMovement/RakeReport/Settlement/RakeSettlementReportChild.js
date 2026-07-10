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

import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService';
import useFormDepoExpenseClosure from 'src/Hooks/useFormDepoExpenseClosure';
import LocationApi from 'src/Service/SubMaster/LocationApi';
import Swal from 'sweetalert2';
import CustomTable from 'src/components/customComponent/CustomTable';
// import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from '../CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import RakeClosureSubmissionService from 'src/Service/RakeMovement/RakeClosureSubmission/RakeClosureSubmissionService'
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import RakeTripsheetSapService from 'src/Service/SAP/RakeTripsheetSapService'
import ThirdPartyService from 'src/Service/ThirdPartyAPI/ThirdPartyService'
import { formatDateAsDDMMYYY } from '../../CommonMethods/CommonMethods'

const RakeSettlementReportChild = () => {
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

  const [tonnageFreight, setTonnageFreight] = useState(0)
  const [invoicePostingDate, setInvoicePostingDate] = useState('')
  const [invoiceCopy, setInvoiceCopy] = useState('')
  const [tdsHaving, setTdsHaving] = useState(0)
  const REQ = () => <span className="text-danger"> * </span>

  const handleChangeInvoiceCopy = (event) => {
    let valll = event.target.files[0]
    setInvoiceCopy(valll)
  }


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
    let fileName='Rake_Settlement_Closure_MIGO_Report_'+dateTimeString
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
  const [rakeDivision, setRakeDivision] = useState(0)
  const [locationData, setLocationData] = useState([])

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.RakeReportModule.Rake_Settlement_report

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
    gstType: '',
    settle_remarks: '',
  }

  const [plantMasterData, setPlantMasterData] = useState([])
  const [plantFreightMasterData, setPlantFreightMasterData] = useState([])
  const [vendorFnrGroupingLPMigoData, setVendorFnrGroupingLPMigoData] = useState([])

  const freightFinder = (plant) => {
    let n_freight = 0
    plantFreightMasterData.map((datann1, indexnn1) => {
      if(datann1.plant_code == plant){
        n_freight = datann1.plant_freight
      }
    })
    console.log(n_freight,'n_freight')
    return Number(parseFloat(n_freight).toFixed(4))
  }

  const [singleClosureSeqArray, setSingleClosureSeqArray] = useState([])

  useEffect(() => {
    let n_freight = 0
    plantFreightMasterData.map((datann1, indexnn1) => {
      if(datann1.plant_code == singleClosureSeqArray.rake_plant_code){
        n_freight = datann1.plant_freight
      }
    })
    console.log(n_freight,'n_freight')
    setTonnageFreight(Number(parseFloat(n_freight).toFixed(4)))

  },[plantFreightMasterData,singleClosureSeqArray])

  const [gstTaxTermsData, setGstTaxTermsData] = useState([])


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

    /* section for getting GST Tax Terms Master List For GST Tax Code Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      console.log(response.data.data,'setGstTaxTermsData')
      setGstTaxTermsData(response.data.data)
    })

    /* section for getting Plant Freight Master List from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(23).then((response) => {
      let viewData = response.data.data
      console.log(viewData,'Plant Freight Master Data1')
      let rowData_List_location = []
      viewData.map((data, index) => {
        rowData_List_location.push({
          sno: index + 1,
          plant_code: data.definition_list_code,
          plant_freight: data.definition_list_name,
        })
      })
      console.log(rowData_List_location,'Plant Freight Master Data2')
      setPlantFreightMasterData(rowData_List_location)
    })

    /* section for getting Rake Plant Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(21).then((response) => {
      // setFetch(true)
      let viewData = response.data.data
      console.log(viewData,'Rake Plant Data')
      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          plant_name: data.definition_list_name,
          plant_code: data.definition_list_code,
        })
      })

      setRakePlantData(rowDataList_location)
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

  const tdsTaxCodeName = (code) => {
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

  const handleChangeRakeDivision = (e) => {
    let ndata = e.target.value
    console.log(ndata,'handleChangeRakeDivision')
    if(ndata == 0){
      values.tdsremarks = ''
    }
    setRakeDivision(ndata)
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

  const [rakePlantData, setRakePlantData] = useState([])

  const locationFinder = (plant) => {
    let n_loc = '--'
    rakePlantData.map((datann, indexnn) => {
      if(datann.plant_code == plant){
        n_loc = datann.plant_name
      }
    })
    console.log(n_loc,'n_loc')
    return n_loc
  }

  const rejectExpensePosting = () => {
    const formDataUpdate = new FormData()

    formDataUpdate.append('id', id)
    formDataUpdate.append('expense_sequence_no', singleClosureSeqArray.expense_sequence_no)
    formDataUpdate.append('vendor_code', singleClosureSeqArray.vendor_code)
    formDataUpdate.append('fnr_no', singleClosureSeqArray.fnr_no)
    formDataUpdate.append('created_by', user_id)
    formDataUpdate.append('status', 8)
    formDataUpdate.append('remarks', values.settle_remarks)

    RakeClosureSubmissionService.rejectSettlementSubmission(formDataUpdate).then((res) => {
      console.log(res,'rejectExpensePosting')
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: "Expense Posting Rejected Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/RakeSettlementClosureHome')
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
          'Settlement - Closure Cannot Be Updated From LP.. Kindly Contact Admin!'
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

  const [fetch, setFetch] = useState(false)
  const [contractorInfo, setContractorInfo] = useState([])

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  /* ===================== The Constants Needed For First Render Part Start ===================== */

  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */

  useEffect(() => {

    RakeClosureSubmissionService.getExpenseApprovalInfoById(id).then((res) => {
      // DepoExpenseClosureService.getPaymentInfoById(id).then((res) => {
        let closure_info_id_data = res.data.data
        console.log(closure_info_id_data,'closure_info_id_data')
        // setSingleContractorArray(closure_info_id_data)

        setBaseFreightExpense()
        values.expens_remarks = closure_info_id_data.ec_remarks ? closure_info_id_data.ec_remarks : ''
        setGstHave(closure_info_id_data.expense_gst)
        setTdsHave(closure_info_id_data.expense_tds)
        values.gstType = closure_info_id_data.expense_gst_type ? closure_info_id_data.expense_gst_type : ''
        setInvoicePostingDate(closure_info_id_data.expense_posting_date)
        setInvoiceCopyAvailable(true)
        setSingleClosureSeqArray(closure_info_id_data)
      })

    }, [id])

    const [totalTonnage, setTotalTonnage] = useState(0)

    useEffect(()=>{
      if(singleClosureSeqArray){
        let f__no = singleClosureSeqArray.fnr_no
        let v__code = singleClosureSeqArray.vendor_code
        let c__seq = singleClosureSeqArray.expense_sequence_no
        if(f__no && v__code){
          // RakeClosureSubmissionService.getFnrVendorWiseTripMigoData1(f__no,v__code).then((res) => {
            RakeClosureSubmissionService.getFnrVendorSeqWiseTripMigoDataForReport(f__no,v__code,c__seq).then((res) => {
            setFetch(true)
            let trip_migo_data = res.data.data
            let tot_ton = 0
            console.log(trip_migo_data, 'getFnrVendorDeliveryLPMigoData')
            if (trip_migo_data.length > 0) {
              let rowDataList = []
              trip_migo_data.map((data, index) => {
                tot_ton += Number(parseFloat(data.total_qty).toFixed(4))
                rowDataList.push({
                  S_NO: index + 1,
                  Tripsheet_No: data.tripsheet_no,
                  FNR_No: data.fnr_no,
                  PO_No: data.po_no,
                  VA_No: data.pp_va_no,
                  MIGO_No: data.migo_no,
                  MIGO_Date: data.migo_date,
                  Vehicle_No: data.truck_no,
                  Quantity_In_MTS: data.total_qty,
                  Base_Freight: data.budget_freight,
                  Additional_Freight: data.additional_freight ? data.additional_freight : 0,
                  Deduction: data.deduction ? data.deduction : 0,
                  Remarks: data.remarks ? data.remarks : '-',
                  Total_Freight: data.total_freight,
                  Expense_Date: data.created_date,
                })
              })

              setRowData(rowDataList)
              setVendorFnrGroupingLPMigoData(trip_migo_data)
            } else {
              setVendorFnrGroupingLPMigoData([])
            }
            let totTon = Number(parseFloat(tot_ton).toFixed(4))
            setTotalTonnage(totTon)
            let totExp = Number(parseFloat(Number(parseFloat(singleClosureSeqArray.expense_amount).toFixed(4))))
            //  + Number(parseFloat(totTon*tonnageFreight).toFixed(4))).toFixed(4))

            // console.log(tonnageFreight,'totExp-tonnageFreight')
            // console.log(totTon,'totExp-totTon')
            // console.log(totExp,'totExp-totExp')
            // console.log(totExp+addiFreightExpense-deductFreightExpense,'totExp+addiFreightExpense-deductFreightExpense')
            setBaseFreightExpense(totExp)
            setTotFreightExpense(totExp+addiFreightExpense-deductFreightExpense)
          })
        }

      }
    },[singleClosureSeqArray,tonnageFreight])

  const [tdsTaxData, setTdsTaxData] = useState([])
  const [mainKey, setMainKey] = useState(1)
  const [activeKey, setActiveKey] = useState(1)
  const [visible, setVisible] = useState(false)
  const [invoiceCopyAvailable, setInvoiceCopyAvailable] = useState(false)

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

  const RakeSettlementClosureCancel = () => {
    console.log(values.settle_remarks,'settle_remarks')
    if (values.settle_remarks && values.settle_remarks.trim()) {
      setTripMigoAllDelete(true)
    } else {
      setFetch(true)
      Swal.fire({
        title: 'Settlement Remarks required for rejection..',
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
      })
      values.settle_remarks = ''
      return false
    }
  }

  const [tdsHave, setTdsHave] = useState('')
  const [gstHave, setGstHave] = useState('')
  const [expenseUpdateAvailable, setExpenseUpdateAvailable] = useState(false)

  const tdsChangeValue = (e) => {
    let val = e.target.value
    setTdsHave(val)
  }

  const gstChangeValue = (e) => {
    let val = e.target.value
    setGstHave(val)
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
      name: 'FNR No',
      selector: (row) => row.FNR_No,
      sortable: true,
      center: true,
    },
    {
      name: 'PO No',
      selector: (row) => row.PO_No,
      sortable: true,
      center: true,
    },
    {
      name: 'VA No',
      selector: (row) => row.VA_No,
      sortable: true,
      center: true,
    },
    {
      name: 'MIGO No',
      selector: (row) => row.MIGO_No,
      sortable: true,
      center: true,
    },
    {
      name: 'MIGO Date',
      selector: (row) => row.MIGO_Date,
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
      name: 'Base Freight',
      selector: (row) => row.Base_Freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Additional Freight',
      selector: (row) => row.Additional_Freight,
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
      name: 'Remarks',
      selector: (row) => row.Remarks,
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

  const checkDeductioninValid =(freight) => {
    if(freight && freight != '' &&  Number(parseFloat(freight).toFixed(3)) > 0){
      return false
    } else {
      return true
    }
  }

  const settlementClosureSubmitValidation = () => {

    let basExp = Number(parseFloat(Number(parseFloat(singleClosureSeqArray.expense_amount).toFixed(4))  + Number(parseFloat(totalTonnage*tonnageFreight).toFixed(4))).toFixed(4))

    if(user_info.is_admin == 1) {
      // console.log(type,'RTECS-type')
      console.log(addiFreightExpense,'RTECS-addiFreightExpense')
      console.log(deductFreightExpense,'RTECS-deductFreightExpense')
      console.log(totFreightExpense,'RTECS-totFreightExpense')
      console.log(basExp,'RTECS-basExp')
      console.log(gstHave,'RTECS-gstHave')
      console.log(values.deduct_remarks,'RTECS-basExp')
      console.log(values.addi_remarks,'RTECS-basExp')
      console.log(values.expens_remarks,'RTECS-basExp')
    }

    /* ============== Submition Validation Part Start =============== */

    if(addiFreightExpense != 0 && values.addi_remarks.trim() == ''){
      values.addi_remarks = ''
      Swal.fire({
          title: 'Remarks needed for additional expenses..',
          icon: "warning",
          confirmButtonText: "OK",
      }).then(function () {});
      return false
    }

    if(deductFreightExpense != 0 && values.deduct_remarks.trim() == ''){
      values.deduct_remarks = ''
      Swal.fire({
          title: 'Remarks needed for deduction expenses..',
          icon: "warning",
          confirmButtonText: "OK",
      }).then(function () {});
      return false
    }

    if(totFreightExpense != basExp && values.expens_remarks.trim() == ''){
      values.expens_remarks = ''
      Swal.fire({
          title: 'Remarks needed for total expenses..',
          icon: "warning",
          confirmButtonText: "OK",
      }).then(function () {});
      return false
    }

    if(!(gstHave == '1' || gstHave == '0')){
      Swal.fire({
          title: 'GST Applicable Required..',
          icon: "warning",
          confirmButtonText: "OK",
      }).then(function () {});
      return false
    }

    if(gstHave == 1 && values.gstType == ''){
      Swal.fire({
          title: 'GST Tax Type Required..',
          icon: "warning",
          confirmButtonText: "OK",
      }).then(function () {});
      return false
    }

    // if(tdsHave == ''){
    if(!(tdsHave == '1' || tdsHave == '0')){
      Swal.fire({
          title: 'TDS Applicable Required..',
          icon: "warning",
          confirmButtonText: "OK",
      }).then(function () {});
      return false
    }

    if (invoicePostingDate) {
      //
    } else {

      Swal.fire({
        title: 'Expense Posting Date Required..',
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {});
      return false
    }

    console.log(invoiceCopy,'invoiceCopy')
    if(invoiceCopyAvailable){
      //
    } else {
      if(invoiceCopy){
        //
      } else {
        Swal.fire({
          title: 'Invoice Attachment Copy Required..',
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {});
        return false
      }

      console.log(invoiceCopy.size,'invoiceCopy')
      if(invoiceCopy.size <= 5000000){
        //
      } else {
        Swal.fire({
          title: 'Attached invoice copy should not having size more than 5Mb..!',
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {});
        return false
      }
    }

    setTripMigoAllConfirm(true)

  }

  const settlementClosureSubmit = () => {

    console.log(singleClosureSeqArray,'singleClosureSeqArray')
    // return false

    let freightTotal = Number(parseFloat(singleClosureSeqArray.total_expense_amount).toFixed(3)) + Number(parseFloat(singleClosureSeqArray.deduction_expenses).toFixed(3))

    console.log(singleClosureSeqArray.expense_sequence_no,'RAKE_SEQ_NO')
    console.log(singleClosureSeqArray.vendor_code,'LIFNR')
    console.log(singleClosureSeqArray.fnr_no,'FNR_NO')
    console.log(singleClosureSeqArray.expense_amount,'BASE_FRE')
    console.log(singleClosureSeqArray.additional_expenses,'ADD_FRE')
    console.log(freightTotal,'TOTAL_FRE')
    console.log(singleClosureSeqArray.tripsheet_count,'TRIP_COUNT')
    console.log(singleClosureSeqArray.expense_posting_date,'POST_DATE')
    console.log(values.settle_remarks,'REMARKS')
    console.log(singleClosureSeqArray.expense_tds == '1' ? 'YES' : 'NO','TDS')
    console.log(singleClosureSeqArray.expense_gst_type == 'E0' || singleClosureSeqArray.expense_gst_type == null ? '' : singleClosureSeqArray.expense_gst_type,'TAX_TYPE')
    console.log(singleClosureSeqArray.deduction_expenses ? singleClosureSeqArray.deduction_expenses : 0,'DEDUCT_AMT')
    console.log(singleClosureSeqArray.ec_deduction_remarks,'DEDUCT_REMARKS')

    // return false
    /* =================== Request Sent To SAP For Expense Document No. Generation Start ======================= */

    let sap_data = new FormData()
    sap_data.append('RAKE_SEQ_NO', singleClosureSeqArray.expense_sequence_no)
    sap_data.append('LIFNR', singleClosureSeqArray.vendor_code)
    sap_data.append('FNR_NO', singleClosureSeqArray.fnr_no)
    sap_data.append('BASE_FRE', singleClosureSeqArray.expense_amount)
    sap_data.append('ADD_FRE', singleClosureSeqArray.additional_expenses)
    sap_data.append('TOTAL_FRE', freightTotal)
    sap_data.append('TRIP_COUNT', singleClosureSeqArray.tripsheet_count)
    sap_data.append('POST_DATE', singleClosureSeqArray.expense_posting_date)
    sap_data.append('REMARKS', values.settle_remarks)
    sap_data.append('TDS', singleClosureSeqArray.expense_tds == '1' ? 'YES' : 'NO')
    sap_data.append('TAX_TYPE',singleClosureSeqArray.expense_gst_type == 'E0' || singleClosureSeqArray.expense_gst_type == null ? '' : singleClosureSeqArray.expense_gst_type)
    sap_data.append('DEDUCT_AMT', singleClosureSeqArray.deduction_expenses ? singleClosureSeqArray.deduction_expenses : 0)
    sap_data.append('DEDUCT_REMARKS', singleClosureSeqArray.ec_deduction_remarks)

    setFetch(false)

    RakeTripsheetSapService.rakeExpenseSubmission(sap_data).then(
      (res) => {
        let sap_sequence_no = res.data.RAKE_SEQ_NO
        let sap_fnr_no = res.data.FNR_NO
        let sap_expense_document_no = res.data.DOCUMENT_NO
        let sap_expense_status = res.data.STATUS
        let sap_expense_message = res.data.MESSAGE
        let sap_expense_deduction_document_no = res.data.DEDUCTION_DOCUMENT_NO
        let sap_expense_deduction_status = res.data.DEDUCTION_STATUS
        let sap_expense_deduction_message = res.data.DEDUCTION_MESSAGE

        console.log(
          sap_sequence_no + '/' + sap_fnr_no + '/' + sap_expense_document_no + '/' + sap_expense_status + '/' + sap_expense_message + '/' + sap_expense_deduction_document_no + '/' + sap_expense_deduction_status + '/' + sap_expense_deduction_message
        )

        if (
          sap_expense_status == '1' &&
          res.status == 200 &&
          sap_expense_document_no &&
          sap_expense_message &&
          sap_sequence_no == singleClosureSeqArray.expense_sequence_no &&
          sap_fnr_no == singleClosureSeqArray.fnr_no && (
            checkDeductioninValid(singleClosureSeqArray.deduction_expenses) || ( sap_expense_deduction_status == '1' && sap_expense_deduction_document_no &&
            sap_expense_deduction_message )
          )
        ) {

            /* ====== Request Sent To SAP For Expense Document No. Generation End ========== */

          const formDataUpdate = new FormData()

          formDataUpdate.append('id', id)
          formDataUpdate.append('expense_sequence_no', sap_sequence_no)
          formDataUpdate.append('vendor_code', singleClosureSeqArray.vendor_code)
          formDataUpdate.append('fnr_no', sap_fnr_no)

          formDataUpdate.append('created_by', user_id)
          formDataUpdate.append('remarks', values.settle_remarks)

          formDataUpdate.append('deduction_document_no', checkDeductioninValid(singleClosureSeqArray.deduction_expenses) ? 0 : sap_expense_deduction_document_no)
          formDataUpdate.append('expense_document_no', sap_expense_document_no)

          // return false
          RakeClosureSubmissionService.approveSettlementSubmission(formDataUpdate).then((res) => {

            console.log(res,'approveSettlementSubmission')

            setFetch(true)
            if (res.status == 200) {
              Swal.fire({
                title: "Expense Posting Submitted Successfully!",
                icon: "success",
                html: checkDeductioninValid(singleClosureSeqArray.deduction_expenses) ?  'SAP Expense Document No : ' + sap_expense_document_no : 'SAP Exp. Doc. No. : ' + sap_expense_document_no + '<br />' + ' SAP Deduction Doc. No. : ' + sap_expense_deduction_document_no,
                confirmButtonText: "OK",
              }).then(function () {
                navigation('/RakeSettlementClosureHome')
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
          sap_fnr_no == singleClosureSeqArray.fnr_no
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
          toast.warning('Payment Invoice Creation Failed in SAP.. Kindly Contact Admin!')
        }

      }
    )
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
                          Income Information
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 3}
                          onClick={() => setActiveKey(3)}
                        >
                          Trip MIGO Information
                        </CNavLink>
                      </CNavItem>
                      {singleClosureSeqArray.rake_expense_user_info && (
                        <CNavItem>
                          <CNavLink
                            active={activeKey === 4}
                            onClick={() => setActiveKey(4)}
                          >
                            Expenses
                          </CNavLink>
                        </CNavItem>
                      )}
                    </CNav>
                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>

                        {singleClosureSeqArray && singleClosureSeqArray.vendor_info && (
                          <CRow className="m-2">
                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">Payment Sequence No.</CFormLabel>
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
                              <CFormLabel htmlFor="cmn">FNR No.</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={singleClosureSeqArray.fnr_no}
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
                                value={singleClosureSeqArray.vendor_info.v_name}
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
                                value={singleClosureSeqArray.vendor_info.v_code}
                                readOnly
                              />
                            </CCol>

                            <CCol md={3}>
                              <CFormLabel htmlFor="cname">Rake Location</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cname"
                                size="sm"
                                id="cname"
                                value={locationFinder(singleClosureSeqArray.rake_plant_code)}
                                readOnly
                              />
                            </CCol>

                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">Base Expenses</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={`${singleClosureSeqArray.base_expenses}`}
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

                            {/* <CCol md={3}>
                              <CFormLabel htmlFor="cmn">Other Expenses</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={singleClosureSeqArray.other_expenses}
                                readOnly
                              />
                            </CCol> */}

                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">Total Expense (Base + Other)</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={singleClosureSeqArray.expense_amount}
                                readOnly
                              />
                            </CCol>

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
                                value={singleClosureSeqArray.rake_user_info.emp_name}
                                readOnly
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">WM Submission Remarks</CFormLabel>
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
                              <CFormLabel htmlFor="cmn">WM Submission Date & Time</CFormLabel>
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
                              <CFormLabel htmlFor="cmn">WM Expense Approved By</CFormLabel>
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
                              <CFormLabel htmlFor="cmn">WM Approval Remarks</CFormLabel>
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
                              <CFormLabel htmlFor="cmn">WM Approval Date & Time</CFormLabel>
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
                              <Link className="text-white" to="/RakeSettlementReport">
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

                          {/* <CCol md={3}>
                            <CFormLabel htmlFor="cmn">Income Per Tonnage</CFormLabel>
                            <CFormInput
                              style={{fontWeight: 'bolder'}}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={tonnageFreight}
                              readOnly
                            />
                          </CCol> */}

                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">LP Income</CFormLabel>
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
                            <CFormLabel htmlFor="cmn">Total Income (Tot.Expense + Income)</CFormLabel>
                            <CFormInput
                              style={{fontWeight: 'bolder'}}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={Number(parseFloat(Number(parseFloat(singleClosureSeqArray.expense_amount).toFixed(4))  + Number(parseFloat(totalTonnage*tonnageFreight).toFixed(4))).toFixed(4))}
                              readOnly
                            />
                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">Division</CFormLabel>
                            <CFormInput
                              style={{fontWeight: 'bolder'}}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleClosureSeqArray.customer_code == '1012' ? 'FOODS' : 'MMD'}
                              readOnly
                            />
                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">Income Doc. No.</CFormLabel>
                            <CFormInput
                              style={{fontWeight: 'bolder'}}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleClosureSeqArray.income_document_no}
                              readOnly
                            />
                          </CCol>

                          {singleClosureSeqArray.customer_code == '20068' && (
                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">TDS Income Doc. No.</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={singleClosureSeqArray.income_tds_document_no}
                                readOnly
                              />
                            </CCol>
                          )}

                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">Income Submitted By</CFormLabel>
                            <CFormInput
                              style={{fontWeight: 'bolder'}}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleClosureSeqArray.rake_income_user_info.emp_name}
                              readOnly
                            />
                          </CCol>
                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">SAP Posting Date</CFormLabel>
                            <CFormInput
                              style={{fontWeight: 'bolder'}}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={formatDateAsDDMMYYY(singleClosureSeqArray.income_posting_date)}
                              readOnly
                            />
                          </CCol>
                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">Income Remarks</CFormLabel>
                            <CFormInput
                              style={{fontWeight: 'bolder'}}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleClosureSeqArray.income_remarks}
                              readOnly
                            />
                          </CCol>
                          {singleClosureSeqArray.customer_code == '20068' && (
                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">TDS Income Remarks</CFormLabel>
                              <CFormInput
                                style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={singleClosureSeqArray.income_tds_remarks}
                                readOnly
                              />
                            </CCol>
                          )}
                          <CCol md={3}>
                            <CFormLabel htmlFor="cmn">Income Date & Time</CFormLabel>
                            <CFormInput
                              style={{fontWeight: 'bolder'}}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleClosureSeqArray.income_closure_time_formatted}
                              readOnly
                            />
                          </CCol>
                        </CRow>
                        <CRow className="mt-2">
                          <CCol className="m-2" xs={12} sm={12} md={3}>
                            <CButton size="sm" color="primary" className="text-white" type="button">
                              <Link className="text-white" to="/RakeSettlementReport">
                                Previous
                              </Link>
                            </CButton>
                          </CCol>
                        </CRow>
                      </CTabPane>
                    </CTabContent>

                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 3}>
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
                          columns={columns}
                          pagination={true}
                          data={rowData}
                          fieldName={'Driver_Name'}
                          showSearchFilter={true}
                        />
                        <CRow className="mt-2">
                          <CCol className="m-2" xs={12} sm={12} md={3}>
                            <CButton size="sm" color="primary" className="text-white" type="button">
                              <Link className="text-white" to="/RakeSettlementReport">
                                Previous
                              </Link>
                            </CButton>
                          </CCol>
                        </CRow>
                      </CTabPane>
                    </CTabContent>

                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 4}>

                        <CTable caption="top" hover style={{ height: '38vh' }}>
                          <CTableCaption style={{ color: 'maroon' }}>Expenses For The Vendor : {`${singleClosureSeqArray.vendor_info.v_name} (${singleClosureSeqArray.vendor_info.v_code})`}</CTableCaption>

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
                              {singleClosureSeqArray.rake_settlement_user_info && (
                                <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                  SAP Doc. No
                                </CTableHeaderCell>
                              )}
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
                                  // style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={Number(parseFloat(Number(parseFloat(singleClosureSeqArray.expense_amount).toFixed(4))))}
                                  readOnly
                                />
                              </CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  // style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value="--"
                                  readOnly
                                />
                              </CTableDataCell>
                              {singleClosureSeqArray.rake_settlement_user_info && (
                                <CTableDataCell>
                                <CFormInput
                                  // style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value="--"
                                  readOnly
                                />
                                </CTableDataCell>
                              )}
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
                                  // style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={Number(parseFloat(Number(parseFloat(singleClosureSeqArray.additional_expenses).toFixed(4))))}
                                  readOnly
                                />

                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormTextarea
                                  name="addi_remarks"
                                  id="addi_remarks"
                                  rows="1"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  onChange={handleChange}
                                  value={singleClosureSeqArray.ec_additional_remarks}
                                  readOnly
                                ></CFormTextarea>
                              </CTableDataCell>
                              {singleClosureSeqArray.rake_settlement_user_info && (
                                <CTableDataCell>
                                  <CFormInput
                                    // style={{fontWeight: 'bolder'}}
                                    name="cmn"
                                    size="sm"
                                    id="cmn"
                                    value="--"
                                    readOnly
                                  />
                                </CTableDataCell>
                              )}
                            </CTableRow>
                            {/* ================== Additional Expenses - Charges Part End ======================= */}

                             {/* ================== Freight Expenses - Charges Part Start =================== */}

                             <CTableRow>
                              <CTableDataCell scope="row" style={{ width:'10%' }}>
                                <b>3</b>
                              </CTableDataCell>
                              <CTableDataCell>Freight Expenses</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  // style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={Number(parseFloat(singleClosureSeqArray.total_expense_amount).toFixed(3)) + Number(parseFloat(singleClosureSeqArray.deduction_expenses).toFixed(3))}
                                  readOnly
                                />

                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormTextarea
                                  name="addi_remarks"
                                  id="addi_remarks"
                                  rows="1"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  onChange={handleChange}
                                  value="--"
                                  readOnly
                                ></CFormTextarea>
                              </CTableDataCell>
                              {singleClosureSeqArray.rake_settlement_user_info && (
                                <CTableDataCell>
                                  <CFormInput
                                    // style={{fontWeight: 'bolder'}}
                                    name="cmn"
                                    size="sm"
                                    id="cmn"
                                    value={singleClosureSeqArray.expense_document_no ? singleClosureSeqArray.expense_document_no  : '--'}
                                    readOnly
                                  />
                                </CTableDataCell>
                              )}
                            </CTableRow>
                            {/* ================== Freight Expenses - Charges Part End ======================= */}

                            {/* ================== Deduction Charges Part Start ======================= */}

                            <CTableRow>
                              <CTableDataCell scope="row" style={{ width:'10%' }}>
                                <b>4</b>
                              </CTableDataCell>
                              <CTableDataCell>Deduction</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  // style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={Number(parseFloat(Number(parseFloat(singleClosureSeqArray.deduction_expenses).toFixed(4))))}
                                  readOnly
                                />

                              </CTableDataCell>

                              <CTableDataCell scope="row">
                                <CFormTextarea
                                  name="deduct_remarks"
                                  id="deduct_remarks"
                                  rows="1"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  onChange={handleChange}
                                  value={singleClosureSeqArray.ec_deduction_remarks}
                                  readOnly
                                ></CFormTextarea>
                              </CTableDataCell>
                              {singleClosureSeqArray.rake_settlement_user_info && (
                                <CTableDataCell>
                                  <CFormInput
                                    // style={{fontWeight: 'bolder'}}
                                    name="cmn"
                                    size="sm"
                                    id="cmn"
                                    value={singleClosureSeqArray.deduction_document_no ? singleClosureSeqArray.deduction_document_no  : '--'}
                                    readOnly
                                  />

                                </CTableDataCell>
                              )}
                            </CTableRow>
                            {/* ================== Deduction Charges Part End ======================= */}

                            {/* ================== Total Charges Part Start ============ */}

                            <CTableRow>
                              <CTableDataCell scope="row" style={{ width:'10%' }}>
                                <b>*</b>
                              </CTableDataCell>
                              <CTableDataCell>Total Trip Expenses</CTableDataCell>
                              {/* <CTableDataCell> </CTableDataCell> */}
                              <CTableDataCell scope="row">
                                <CFormInput
                                  // style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={Number(parseFloat(Number(parseFloat(singleClosureSeqArray.total_expense_amount).toFixed(4))))}
                                  readOnly
                                />
                              </CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  // style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={singleClosureSeqArray.ec_remarks}
                                  readOnly
                                />
                              </CTableDataCell>
                              {singleClosureSeqArray.rake_settlement_user_info && (
                                <CTableDataCell>
                                  <CFormInput
                                    // style={{fontWeight: 'bolder'}}
                                    name="cmn"
                                    size="sm"
                                    id="cmn"
                                    value="--"
                                    readOnly
                                  />
                                </CTableDataCell>
                              )}
                            </CTableRow>
                            {/* ================== Total Charges Part End ========== */}
                          </CTableBody>
                        </CTable>
                        <CRow key={`HireshipmentDeliveryData`} className="mt-2" hidden>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              Other Details
                            </CFormLabel>
                          </CCol>
                        </CRow>

                        <CRow className="mt-2">

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="gstApplicable">
                              GST Applicable
                            </CFormLabel>
                            <CFormInput
                              // style={{fontWeight: 'bolder'}}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleClosureSeqArray.expense_gst == '1' ? 'YES' : 'NO'}
                              readOnly
                            />
                          </CCol>
                          {singleClosureSeqArray.expense_gst == '1' && (
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="gstTaxType">
                                GST Tax Type
                              </CFormLabel>
                              <CFormInput
                                // style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={(singleClosureSeqArray.expense_gst_type ? gstTaxCodeName(singleClosureSeqArray.expense_gst_type) : '--')}
                                readOnly
                              />
                            </CCol>
                          )}

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="tdsApplicable">
                              TDS Applicable
                            </CFormLabel>
                            <CFormInput
                              // style={{fontWeight: 'bolder'}}
                              name="cmn"
                              size="sm"
                              id="cmn"
                              value={singleClosureSeqArray.expense_tds == '1' ? 'YES' : 'NO'}
                              readOnly
                            />
                          </CCol>
                          {singleClosureSeqArray.expense_tds == '1' && (
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tdsTaxType">
                                TDS Tax Type
                              </CFormLabel>
                              <CFormInput
                                // style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={(singleClosureSeqArray.rake_vendor_info && singleClosureSeqArray.rake_vendor_info.v_tds_tax_type ? tdsTaxCodeName(singleClosureSeqArray.rake_vendor_info.v_tds_tax_type) : '--')}
                                readOnly
                              />
                            </CCol>
                          )}

                        {/* </CRow>

                        <CRow className="mt-2"> */}

                          {singleClosureSeqArray.rake_expense_user_info && (
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="expenseValidatedBy">
                                Expense Validated By
                              </CFormLabel>
                              <CFormInput
                                // style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={singleClosureSeqArray.rake_expense_user_info.emp_name}
                                readOnly
                              />
                            </CCol>
                          )}

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
                          {singleClosureSeqArray.expense_posting_date && (
                            <CCol md={3}>
                              <CFormLabel htmlFor="cmn">Exp. Posting Date / Invoice Copy</CFormLabel>

                              <CButton
                                onClick={() => setVisible(!visible)}
                                className="w-100 m-0"
                                color="info"
                                size="sm"
                                id="odoImg"
                                style={border}
                              >
                                <span className="float-start">
                                  {formatDateAsDDMMYYY(singleClosureSeqArray.expense_posting_date)} / <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                                </span>
                              </CButton>
                              <CModal visible={visible} onClose={() => setVisible(false)}>
                                <CModalHeader>
                                  <CModalTitle>Payment Invoice Copy</CModalTitle>
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
                          )}
                          {singleClosureSeqArray.rake_settlement_user_info && (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="settle_remarks">Settlement Remarks</CFormLabel>
                                  <CFormTextarea
                                    name="settle_remarks"
                                    id="settle_remarks"
                                    rows="1"
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    value={singleClosureSeqArray.Settlement_remarks}
                                    readOnly
                                  ></CFormTextarea>

                              </CCol>

                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="settlementValidatedBy">
                                  Expense Posted By
                                </CFormLabel>
                                <CFormInput
                                  // style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={singleClosureSeqArray.rake_settlement_user_info.emp_name}
                                  readOnly
                                />
                              </CCol>

                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="expensePostingTime">
                                  Exp. Posting Date & Time
                                </CFormLabel>
                                <CFormInput
                                  // style={{fontWeight: 'bolder'}}
                                  name="cmn"
                                  size="sm"
                                  id="cmn"
                                  value={singleClosureSeqArray.settlement_closure_time_formatted}
                                  readOnly
                                />
                              </CCol>
                            </>
                          )}

                        </CRow>

                        <CRow className="mt-2">
                          <CCol className="m-2" xs={12} sm={12} md={3}>
                            <CButton size="sm" color="primary" className="text-white" type="button">
                              <Link className="text-white" to="/RakeSettlementReport">
                                Previous
                              </Link>
                            </CButton>
                          </CCol>
                        </CRow>

                      </CTabPane>
                    </CTabContent>
                  </CTabPane>
                </CTabContent>

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
                    <p className="lead">Are you sure to reject this Expense Posting</p>
                    </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setTripMigoAllDelete(false)
                        setFetch(false)
                        rejectExpensePosting()
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
                    <CModalTitle>Confirmation To Submit</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <p className="lead">Are you sure to Submit this Expense Posting ?</p>


                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setTripMigoAllConfirm(false)
                        // setFetch(false)
                        settlementClosureSubmit()
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

export default RakeSettlementReportChild





