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
import { formatDateAsDDMMYYY } from '../CommonMethods/CommonMethods'

const RakeExpenseClosure = () => {
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
    let fileName='Rake_MIGO_Expense_Expense_Closure_'+dateTimeString
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
  let page_no = LogisticsProScreenNumberConstants.RakeClosureModule.Rake_Expense_Closure

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

    /* section for getting GST Tax Terms Master List For GST Tax Code Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(20).then((response) => {
      console.log(response.data.data,'setGstTaxTermsData')
      setGstTaxTermsData(response.data.data)
    })

    /* section for getting Tds Tax Terms Master List For Tds Tax Code Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      console.log(response.data.data,'setTdsTaxTermsData')
      setTdsTaxTermsData(response.data.data)
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


  const gstTaxCodeName = (code) => {
    let gst_tax_code_name = ''
    if(code == "E0"){
      gst_tax_code_name = 'No Tax'
    } else if(code == "T0"){
      gst_tax_code_name = 'GST ITC Reversal Exp'
    } else if(code == "R5"){
      gst_tax_code_name = 'Input Tax RCM (SGST,CGST @ 2.5% & 2.5%)'
    } else if(code == "F6"){
      gst_tax_code_name = 'Input Tax (SGST,CGST @ 6% & 6%)'
    } else {
      gst_tax_code_name = '--'
    }

    return gst_tax_code_name
  }

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

  const rejectAllExpenseSubmission = () => {
    const formDataUpdate = new FormData()

    formDataUpdate.append('id', id)
    formDataUpdate.append('created_by', user_id)
    formDataUpdate.append('status', 5)
    formDataUpdate.append('remarks', values.inclremarks)
    console.log(id,'id')
    console.log(values.inclremarks,'remarks')
    console.log(user_id,'created_by')
    // return false
    RakeClosureSubmissionService.rejectExpenseSubmission(formDataUpdate).then((res) => {
    // DepoExpenseClosureService.rejectPaymentValidation(formDataUpdate).then((res) => {
      console.log(res)
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: "Income Closure Rejected Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/RakeIncomeClosureHome')
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
          'Income - Closure Cannot Be Updated From LP.. Kindly Contact Admin!'
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

        if(closure_info_id_data.status == 8){
          setExpenseUpdateAvailable(true)
          setAddiFreightExpense(Number(parseFloat(closure_info_id_data.additional_expenses).toFixed(4)))
          setDeductFreightExpense(Number(parseFloat(closure_info_id_data.deduction_expenses).toFixed(4)))
          setTotFreightExpense(Number(parseFloat(closure_info_id_data.total_expense_amount).toFixed(4)))
          setGstHave(closure_info_id_data.expense_gst)
          setTdsHave(closure_info_id_data.expense_tds)

          values.gstType = closure_info_id_data.expense_gst_type ? closure_info_id_data.expense_gst_type : ''
          values.addi_remarks = closure_info_id_data.ec_additional_remarks ? closure_info_id_data.ec_additional_remarks : ''
          values.deduct_remarks = closure_info_id_data.ec_deduction_remarks ? closure_info_id_data.ec_deduction_remarks : ''
          values.expens_remarks = closure_info_id_data.ec_remarks ? closure_info_id_data.ec_remarks : ''
          setInvoicePostingDate(closure_info_id_data.expense_posting_date)
          setInvoiceCopyAvailable(true)
        }

        setBaseFreightExpense()
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
            RakeClosureSubmissionService.getFnrVendorSeqWiseTripMigoData1(f__no,v__code,c__seq).then((res) => {
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

  const RakeIncomeClosureCancel = () => {
    console.log(values.inclremarks,'inclremarks')
    if (values.inclremarks && values.inclremarks.trim()) {
      setTripMigoAllDelete(true)
    } else {
      setFetch(true)
      Swal.fire({
        title: 'Income Closure Remarks required for rejection..',
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
      })
      values.inclremarks = ''
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

  const RakeTripsheetExpenseClosureSubmit = (type) => {

    let basExp = Number(parseFloat(Number(parseFloat(singleClosureSeqArray.expense_amount).toFixed(4))  + Number(parseFloat(totalTonnage*tonnageFreight).toFixed(4))).toFixed(4))

    if(user_info.is_admin == 1) {
      console.log(type,'RTECS-type')
      console.log(addiFreightExpense,'RTECS-addiFreightExpense')
      console.log(deductFreightExpense,'RTECS-deductFreightExpense')
      console.log(totFreightExpense,'RTECS-totFreightExpense')
      console.log(basExp,'RTECS-basExp')
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

    if(gstHave == ''){
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

    if(tdsHave == ''){
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

     /* ============== Submition Validation Part End =============== */

    const formDataUpdate = new FormData()

    formDataUpdate.append('id', id)
    formDataUpdate.append('expense_sequence_no', singleClosureSeqArray.expense_sequence_no)
    formDataUpdate.append('vendor_code', singleClosureSeqArray.vendor_code)
    formDataUpdate.append('fnr_no', singleClosureSeqArray.fnr_no)

    formDataUpdate.append('expense_tds', tdsHave)
    formDataUpdate.append('expense_tds_type', tdsHave == '1' ? singleClosureSeqArray.rake_vendor_info.v_tds_tax_type : '')
    formDataUpdate.append('expense_gst', gstHave)
    formDataUpdate.append('expense_gst_type', gstHave == '1' ? values.gstType : '')
    formDataUpdate.append('additional_expenses', addiFreightExpense)
    formDataUpdate.append('deduction_expenses', deductFreightExpense)
    formDataUpdate.append('total_expense_amount', totFreightExpense)
    formDataUpdate.append('expense_closure_by', user_id)
    formDataUpdate.append('ec_remarks', values.expens_remarks.trim())
    formDataUpdate.append('ec_additional_remarks', values.addi_remarks.trim())
    formDataUpdate.append('ec_deduction_remarks', values.deduct_remarks.trim())
    formDataUpdate.append('status', 6) // 6 - Expense Closure Completed
    formDataUpdate.append('expense_posting_date', invoicePostingDate)
    formDataUpdate.append('invoice_copy', invoiceCopy)
    setFetch(false)

    RakeClosureSubmissionService.updateExpenseClosureSubmission(formDataUpdate).then((res) => {
      setFetch(true)
      console.log(res,'updateExpenseClosureSubmission')
      if (res.status == 200) {
        Swal.fire({
          title: "Expense Validation Completed Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/RakeExpenseClosureHome')
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
          'Expense Validation Cannot Be Updated From LP.. Kindly Contact Admin!'
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
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 4}
                          onClick={() => setActiveKey(4)}
                        >
                          Expenses
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>

                        {singleClosureSeqArray && singleClosureSeqArray.vendor_info && (
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
                              <Link className="text-white" to="/RakeExpenseClosureHome">
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
                              <Link className="text-white" to="/RakeExpenseClosureHome">
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
                              <Link className="text-white" to="/RakeExpenseClosureHome">
                                Previous
                              </Link>
                            </CButton>
                          </CCol>
                        </CRow>
                      </CTabPane>
                    </CTabContent>

                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 4}>

                        <CTable caption="top" hover style={{ height: '35vh' }}>
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
                                Total Amount
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
                              <CTableDataCell scope="row">
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
                                  value="--"
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
                                  // style={{fontWeight: 'bolder'}}
                                  id="add_freight"
                                  name="add_freight"
                                  maxLength={5}
                                  onChange={(e) => {
                                    updateExpenseAmount(
                                      e,
                                      'add_freight',
                                    )
                                  }}
                                  size="sm"
                                  value={addiFreightExpense}
                                />

                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  style={{fontWeight: 'bolder'}}
                                  size="sm"
                                  id="expense_row_total_subdelivery_charge"
                                  name="expense_row_total_subdelivery_charge"
                                  value={addiFreightExpense}
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
                                  value={values.addi_remarks}
                                ></CFormTextarea>
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
                                  id="deduct_freight"
                                  name="deduct_freight"
                                  maxLength={5}
                                  onChange={(e) => {
                                    updateExpenseAmount(
                                      e,
                                      'deduct_freight',
                                    )
                                  }}
                                  size="sm"
                                  value={deductFreightExpense}
                                />

                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  style={{fontWeight: 'bolder'}}
                                  size="sm"
                                  id="expense_row_total_weighment_charge"
                                  name="expense_row_total_weighment_charge"
                                  value={deductFreightExpense}
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
                                  value={values.deduct_remarks}
                                ></CFormTextarea>
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Deduction Charges Part End ======================= */}

                            {/* ================== Total Charges Part Start ============ */}

                            <CTableRow>
                              <CTableDataCell scope="row" style={{ width:'10%' }}>
                                <b>*</b>
                              </CTableDataCell>
                              <CTableDataCell>Total Trip Expenses</CTableDataCell>
                              <CTableDataCell> </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  style={{fontWeight: 'bolder'}}
                                  size="sm"
                                  id="expense_row_total_total_charge"
                                  name="expense_row_total_total_charge"
                                  value={Number(parseFloat(totFreightExpense).toFixed(3))}
                                  readOnly
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormTextarea
                                  name="expens_remarks"
                                  id="expens_remarks"
                                  rows="1"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  onChange={handleChange}
                                  value={values.expens_remarks}
                                ></CFormTextarea>
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Total Charges Part End ========== */}
                          </CTableBody>
                        </CTable>

                        <CTable caption="top" hover style={{ height: '35vh' }}>
                          <CTableCaption style={{ color: 'maroon' }}>Others</CTableCaption>

                          {/* ================== Others Table Header Part Start ====================== */}
                          <CTableHead
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                            }}
                          >
                            <CTableRow>
                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                S.No
                              </CTableHeaderCell>

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Type
                              </CTableHeaderCell>

                              {/* <CTableHeaderCell></CTableHeaderCell> */}

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Value
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          {/* ================== Others Table Header Part End ======================= */}
                          {/* ================== Others Table Body Part Start ======================= */}
                          <CTableBody>


                            {/* ================== Tds Having Part Start ======================= */}

                            <CTableRow>
                              <CTableDataCell scope="row">
                                <b>1</b>
                              </CTableDataCell>
                              <CTableDataCell>
                                GST Applicable <REQ />{' '}
                              </CTableDataCell>
                              <CTableDataCell>
                                <CFormSelect
                                  size="sm"
                                  id="gstHaving"
                                  name="gstHaving"
                                  onChange={gstChangeValue}
                                  value={gstHave}
                                  aria-label="Small select example"
                                >
                                  <option value="">Select ...</option>
                                  <option value="1">Yes</option>
                                  <option value="0">No</option>
                                </CFormSelect>
                              </CTableDataCell>
                            </CTableRow>

                            {gstHave == '1' && (
                              <CTableRow>
                                <CTableDataCell scope="row">
                                  <b>1 A</b>
                                </CTableDataCell>
                                <CTableDataCell>GST Tax Type</CTableDataCell>
                                <CTableDataCell>
                                  {/* <CFormInput
                                    size="sm"
                                    value={(singleClosureSeqArray.rake_vendor_info && singleClosureSeqArray.rake_vendor_info.v_gst_tax_type ? gstTaxCodeName(singleClosureSeqArray.rake_vendor_info.v_gst_tax_type) : '--')}
                                    readOnly
                                  /> */}
                                  <CFormSelect
                                    size="sm"
                                    name="gstType"
                                    onChange={handleChange}
                                    onFocus={onFocus}
                                    value={values.gstType}
                                    // className={`mb-1 ${errors.gstType && 'is-invalid'}`}
                                    aria-label="Small select example"
                                    id="gstType"
                                  >
                                    <option value="">Select...</option>
                                    {/* <option value="E0">No Tax</option>
                                    <option value="T0">GST ITC Reversal Exp</option> */}
                                    {/* <option value="R5">Input Tax RCM (SGST,CGST @ 2.5% & 2.5%)</option>
                                    <option value="F6">Input Tax (SGST,CGST @ 6% & 6%)</option> */}
                                    {gstTaxTermsData.map(({ definition_list_code, definition_list_name }) => {
                                      return (
                                        <>
                                          <option key={definition_list_code} value={definition_list_code}>
                                            {definition_list_name}
                                          </option>
                                        </>
                                      )
                                    })}
                                  </CFormSelect>
                                </CTableDataCell>
                              </CTableRow>
                            )}

                            <CTableRow>
                              <CTableDataCell scope="row">
                                <b>2</b>
                              </CTableDataCell>
                              <CTableDataCell>
                                TDS Applicable <REQ />{' '}
                              </CTableDataCell>
                              <CTableDataCell>
                                <CFormSelect
                                  size="sm"
                                  id="TdsHaving"
                                  name="TdsHaving"
                                  onChange={tdsChangeValue}
                                  value={tdsHave}
                                  aria-label="Small select example"
                                >
                                  <option value="">Select ...</option>
                                  <option value="1">Yes</option>
                                  <option value="0">No</option>
                                </CFormSelect>
                              </CTableDataCell>
                            </CTableRow>

                            {tdsHave == '1' && (
                              <CTableRow>
                                <CTableDataCell scope="row">
                                  <b>2 A</b>
                                </CTableDataCell>
                                <CTableDataCell>TDS Tax Type</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={(singleClosureSeqArray.rake_vendor_info && singleClosureSeqArray.rake_vendor_info.v_tds_tax_type ? tdsTaxCodeName(singleClosureSeqArray.rake_vendor_info.v_tds_tax_type) : '--')}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}

                            {/* ================== Tds Having Part End ======================= */}

                          </CTableBody>
                          {/* ================== Expense Table Body Part End ======================= */}
                        </CTable>

                        <CRow className="mt-2">

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="incomePostingDate">
                              Expense Posting Date <REQ />{' '}
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
                          {expenseUpdateAvailable && (
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="rejectionRemarks">
                                Expense Rejection Remarks
                              </CFormLabel>
                              <CFormInput
                                // style={{fontWeight: 'bolder'}}
                                name="cmn"
                                size="sm"
                                id="cmn"
                                value={singleClosureSeqArray.Settlement_remarks}
                                readOnly
                              />
                            </CCol>
                          )}
                        </CRow>

                        <CRow>
                          <CCol
                            className="offset-md-9"
                            xs={12}
                            sm={12}
                            md={3}
                            // style={{ display: 'flex', justifyContent: 'space-between' }}
                            style={{ display: 'flex', flexDirection: 'row-reverse', cursor: 'pointer' }}
                          >
                            <CButton
                              size="sm"
                              color="warning"
                              disabled={enableSubmit}
                              className="mx-3 text-white"
                              // className="align-self-end ml-auto"
                              onClick={() => {
                                // setFetch(false)
                                RakeTripsheetExpenseClosureSubmit(expenseUpdateAvailable ? 'update' : 'submit')
                              }}
                              type="submit"
                            >
                              {expenseUpdateAvailable ? 'Update' : 'Submit'}
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
                    <p className="lead">Are you sure to reject this Income Closure</p>
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
                    <CModalTitle>Confirmation To Submit</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <p className="lead">Are you sure to Submit this Income Closure ?</p>


                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setTripMigoAllConfirm(false)
                        // setFetch(false)
                        incomeClosureSubmit()
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

export default RakeExpenseClosure





