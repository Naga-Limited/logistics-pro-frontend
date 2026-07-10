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
// import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from '../CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import RakeClosureSubmissionService from 'src/Service/RakeMovement/RakeClosureSubmission/RakeClosureSubmissionService'
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import RakeTripsheetSapService from 'src/Service/SAP/RakeTripsheetSapService'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'

const RakeIncomeClosure = () => {
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
    let fileName='Rake_MIGO_Expense_Approval_'+dateTimeString
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
  let page_no = LogisticsProScreenNumberConstants.RakeClosureModule.Rake_Income_Closure

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


  useEffect(() => {

    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
      console.log(response.data.data,'Plant Master List')
      setPlantMasterData(response.data.data)
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
                  Migo_No: data.migo_no,
                  Migo_Date: data.migo_date,
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

  const incomeClosureSubmitValidation = () => {
    if (invoicePostingDate) {
      //
    } else {
      setFetch(true)
      toast.warning('You should select income posting date before submitting..!')
      return false
    }

    // ============= Posting date Validation Part =================== //

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
    // ============= Posting date Validation Part =================== //

    if (rakeDivision == 0) {
      setFetch(true)
      toast.warning('You should select income posting division before submitting..!')
      return false
    }

    if (rakeDivision == 20068 && values.tdsremarks.trim() == '') {
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

  }

  const incomeClosureSubmit = () => {

    console.log(singleClosureSeqArray,'singleClosureSeqArray')

    let add_fri = Number(parseFloat(totalTonnage*tonnageFreight).toFixed(4))
    let tot_fri = Math.ceil(Number(parseFloat(Number(parseFloat(singleClosureSeqArray.expense_amount).toFixed(4))  + Number(parseFloat(totalTonnage*tonnageFreight).toFixed(4))).toFixed(4)))

    console.log(singleClosureSeqArray.expense_sequence_no,'RAKE_SEQ_NO')
    console.log(singleClosureSeqArray.vendor_code,'VENDOR')
    console.log(rakeDivision,'CUSTOMER')
    console.log(singleClosureSeqArray.fnr_no,'FNR_NO')
    console.log(singleClosureSeqArray.expense_amount,'BASE_FRE')
    console.log(add_fri,'ADD_FRE')
    console.log(tot_fri,'TOTAL_FRE')
    console.log(vendorFnrGroupingLPMigoData.length,'TRIP_COUNT')
    console.log(invoicePostingDate,'POST_DATE')
    console.log(values.inclremarks,'INC_REMARK')
    console.log(values.tdsremarks ? values.tdsremarks : '','TDS_REC_REMARK')

    // return false
    /* =================== Request Sent To SAP For Income Document No. Generation Start ======================= */

    let sap_data = new FormData()
    sap_data.append('RAKE_SEQ_NO', singleClosureSeqArray.expense_sequence_no)
    // sap_data.append('VENDOR', singleClosureSeqArray.vendor_code)
    sap_data.append('VENDOR', '')
    sap_data.append('CUSTOMER', rakeDivision)
    sap_data.append('FNR_NO', singleClosureSeqArray.fnr_no)
    sap_data.append('BASE_FRE', singleClosureSeqArray.expense_amount)
    sap_data.append('ADD_FRE', add_fri)
    sap_data.append('TOTAL_FRE', tot_fri)
    sap_data.append('TRIP_COUNT', vendorFnrGroupingLPMigoData.length)
    sap_data.append('POST_DATE', invoicePostingDate)
    sap_data.append('INC_REMARK', values.inclremarks)
    sap_data.append('TDS_REC_REMARK', values.tdsremarks ? values.tdsremarks : '')

    setFetch(false)

    RakeTripsheetSapService.rakeIncomeSubmission(sap_data).then(
      (res) => {
        let sap_sequence_no = res.data.RAKE_SEQ_NO
        let sap_fnr_no = res.data.FNR_NO
        let sap_income_status = res.data.STATUS
        let sap_income_tds_status = res.data.TDS_STATUS
        let sap_income_message = res.data.MESSAGE
        let sap_tds_income_message = res.data.TDS_MESSAGE
        let sap_income_document_no = res.data.DOCUMENT_NO
        let sap_income_tds_document_no = res.data.TDS_DOCUMENT_NO

        console.log(
          sap_sequence_no + '/' + sap_fnr_no + '/' + sap_income_status + '/' + sap_income_tds_status + '/' + sap_income_message + '/' + sap_tds_income_message + '/' + sap_income_document_no + '/' + sap_income_tds_document_no
        )

        if (
          sap_income_status == '1' &&
          res.status == 200 &&
          sap_income_document_no &&
          sap_income_message &&
          sap_sequence_no == singleClosureSeqArray.expense_sequence_no &&
          sap_fnr_no == singleClosureSeqArray.fnr_no && (
            rakeDivision != '20068' || ( sap_income_tds_status == '1' && sap_income_tds_document_no &&
            sap_tds_income_message )
          )
        ) {

            /* ====== Request Sent To SAP For Income Document No. Generation End ========== */

          const formDataUpdate = new FormData()

          formDataUpdate.append('id', id)
          formDataUpdate.append('expense_sequence_no', sap_sequence_no)
          formDataUpdate.append('vendor_code', singleClosureSeqArray.vendor_code)
          formDataUpdate.append('fnr_no', sap_fnr_no)

          formDataUpdate.append('created_by', user_id)
          formDataUpdate.append('remarks', values.inclremarks)
          formDataUpdate.append('customer_code', rakeDivision)
          formDataUpdate.append('income_posting_date', invoicePostingDate)

          formDataUpdate.append('income_tds', rakeDivision == '20068' ? 1 : 0)
          formDataUpdate.append('income_tds_document_no', rakeDivision == '20068' ? sap_income_tds_document_no : '')
          formDataUpdate.append('income_document_no', sap_income_document_no)
          formDataUpdate.append('income_tds_remarks', rakeDivision == '20068' ? values.tdsremarks : '')

          formDataUpdate.append('total_qty', totalTonnage)
          formDataUpdate.append('lp_income', add_fri)
          formDataUpdate.append('income_amount', tot_fri)

          // return false
          RakeClosureSubmissionService.updateIncomeClosureSubmission(formDataUpdate).then((res) => {

            console.log(res,'updateIncomeClosureSubmission')

            setFetch(true)
            if (res.status == 200) {
              Swal.fire({
                title: "Income Closure Submitted Successfully!",
                icon: "success",
                html: rakeDivision == '20068' ? 'SAP Inc. Doc. No. : ' + sap_income_document_no + '<br />' + 'SAP TDS Doc. No. : ' + sap_income_tds_document_no : 'Income Document No : ' + sap_income_document_no,
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
                'Income Closure - Submission Cannot Be Updated From LP.. Kindly Contact Admin!'
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
                      <CFormLabel htmlFor="cmn">Base & Other Expenses</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={`${singleClosureSeqArray.base_expenses} & ${singleClosureSeqArray.other_expenses}`}
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
                      <CFormLabel htmlFor="cmn">WM Expense Remarks</CFormLabel>
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
                        name="rake_division"
                        onChange={handleChangeRakeDivision}
                        value={rakeDivision}
                        id="rake_division"
                      >
                        <option value="0">Select</option>
                        <option value="1012">FOODS</option>
                        <option value="20068">MMD</option>
                      </CFormSelect>
                    </CCol>
                    {rakeDivision == 20068 ? (
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
                    {rakeDivision != 20068 && (<CCol xs={12} md={3}></CCol>)}
                    <CCol xs={12} md={3}></CCol>

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
                      <Link className="text-white" to="/RakeIncomeClosureHome">
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
                        RakeIncomeClosureCancel()
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

                        incomeClosureSubmitValidation()
                      }}
                      type="submit"
                    >
                      Submit
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

export default RakeIncomeClosure





