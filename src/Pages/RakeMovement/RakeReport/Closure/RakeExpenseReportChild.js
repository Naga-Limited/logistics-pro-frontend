

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
// import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from '../CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import RakeClosureSubmissionService from 'src/Service/RakeMovement/RakeClosureSubmission/RakeClosureSubmissionService'

const RakeExpenseReportChild = () => {
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
    let fileName='Rake_Expense_Report_Child_'+dateTimeString
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
  let page_no = LogisticsProScreenNumberConstants.RakeReportModule.Rake_Expense_report

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
  const [vendorFnrGroupingLPMigoData, setVendorFnrGroupingLPMigoData] = useState([])
  useEffect(() => {

    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
      console.log(response.data.data)
      setPlantMasterData(response.data.data)
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

  const [rakePlantData, setRakePlantData] = useState([])

  const locationFinder = (plant) => {
    let n_loc = '--'
    rakePlantData.map((datann, indexnn) => {
      if(datann.plant_code == plant){
        n_loc = datann.plant_name
      }
    })
    return n_loc
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
          RakeClosureSubmissionService.getFnrVendorSeqWiseTripMigoData(f__no,v__code,c__seq).then((res) => {
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
            let totTon = Number(parseFloat(tot_ton).toFixed(4))
            setTotalTonnage(totTon)
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
                      <CFormLabel htmlFor="cmn">Trip Count </CFormLabel>
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
                      <CFormLabel htmlFor="cmn">Base Expenses</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleClosureSeqArray.base_expenses}
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
                  {singleClosureSeqArray.expense_approval_remarks && (
                    <CCol md={3}>
                      <CFormLabel htmlFor="cmn">Approval Remarks</CFormLabel>
                      <CFormInput
                        style={{fontWeight: 'bolder'}}
                        name="cmn"
                        size="sm"
                        id="cmn"
                        value={singleClosureSeqArray.expense_approval_remarks}
                        readOnly
                      />
                    </CCol>
                  )}
                  {singleClosureSeqArray.income_remarks && (
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
                  )}
                    {/* <CCol md={3}></CCol> */}

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

                  </CRow>
                )}
                <CustomTable
                  columns={columns}
                  // pagination={true}
                  data={rowData}
                  fieldName={'Driver_Name'}
                  showSearchFilter={true}
                />

                <CRow className="mt-2">
                  <CCol className="m-2" xs={12} sm={12} md={3}>
                    <CButton size="sm" color="primary" className="text-white" type="button">
                      <Link className="text-white" to="/RakeExpenseReport">
                        Previous
                      </Link>
                    </CButton>
                  </CCol>
                </CRow>

              {/* *********************************************************** */}
              </CCard>
            </> ) : (<AccessDeniedComponent />)
          }

   	    </>
      )}
    </>
  )
}

export default RakeExpenseReportChild



