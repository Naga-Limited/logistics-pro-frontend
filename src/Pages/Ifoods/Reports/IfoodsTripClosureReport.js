// import { React, useState, useEffect } from 'react'
import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
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

import { Link, useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import { DateRangePicker } from 'rsuite'
import { toast } from 'react-toastify'
//import TripPaymentSubmissionComponent from './TripPaymentSubmissionComponent'
import UserMasterValidation from 'src/Utils/Master/UserMasterValidation'
import useForm from 'src/Hooks/useForm'
import Swal from 'sweetalert2'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import { GetDateTimeFormat, getFreightAdjustment, getGstTax } from '../CommonMethods/CommonMethods'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import IfoodsExpenseClosureService from 'src/Service/Ifoods/ExpenseClosure/IfoodsExpenseClosureService'
import IfoodsSalesfreightMasterService from 'src/Service/Ifoods/Master/IfoodsSalesfreightMasterService'

const IfoodsTripClosureReport = () => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const user_vehicle_types = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })
  const navigation = useNavigate()
  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* Get User Vehicle Types From Local Storage */
  user_info.vehicle_type_info.map((data, index) => {
    user_vehicle_types.push(data.id)
  })

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  const formValues = {
    vehicleNumber: '',
    tripsheetNumber: '',
    tripPaymentSubmission: '',
  }

  const {
    values,
    errors,
    handleChange,
    handleMultipleChange,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
    isTouched,
  } = useForm(login, UserMasterValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Trip_Closure

  useEffect(() => {
    if (
      user_info.is_admin == 1 ||
      JavascriptInArrayComponent(page_no, user_info.page_permissions)
    ) {
   //   console.log('screen-access-allowed')
      setScreenAccess(true)
    } else {
  //    console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }
  }, [])
  /* ==================== Access Part End ========================*/

  const [rowData, setRowData] = useState([])
  const [tripPaymentsArray, setTripPaymentsArray] = useState([])
  const [singleVendorArray, setSingleVendorArray] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([])
  // const [pending, setPending] = useState(true)
  const [fetch, setFetch] = useState(false)
  let tableData = []
  let closureData = []
  var tdInfo = {
    tripsheet_orders: [],
    response: [],
  }

  const ACTION = {
    GATE_IN: 1,
    GATE_OUT: 2,
    WAIT_OUTSIDE: 0,
  }

  const [message, setMessage] = useState('')

  const handleChangeRemarks = (event) => {
    const result = event.target.value.toUpperCase()
    // console.log('value.message', message)
    setMessage(result)
  }

  /* Vehicle Current Position */
  const VEHICLE_CURRENT_POSITION = {
    DEPO_SHIPMENT_COMPLETED: 22,
    DEPO_EXPENSE_APPROVAL: 27,
    DEPO_SETTLEMENT_CLOSURE: 20,
  }

  /* Set Default Date (Today) in a Variable State */
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])
  const minDate = new Date()
  const maxDate = new Date(new Date().getTime() + 32 * 24 * 60 * 60 * 1000)

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

  const statusSetter = (value) => {
    if (value.closure_approval_needed == '1' && value.closure_approval_time != null) {
      return <span>{'Expense Approval ✔️'}</span>
    } else {
      return <span>{'Expense Closure ✔️'}</span>
    }
  }

  const exportToCSV = () => {
    // console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'Ifoods_TripClosure_Report' + dateTimeString
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const ws = XLSX.utils.json_to_sheet(rowData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  const removeDuplicates = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index)
  }

  const [assignPSModal, setAssignPSModal] = useState(false)

  const checkModalDisplay = () => {
    let trip_payments_array = JSON.parse(JSON.stringify(values.tripPaymentSubmission))

    // console.log(searchFilterData,'searchFilterData-searchFilterData')
    //console.log(trip_payments_array,'trip_payments_array-trip_payments_array')

    let trip_payments_selected_array = searchFilterData.filter((value) =>
      JavascriptInArrayComponent(value.tripsheet_sheet_id, trip_payments_array)
    )

    // console.log(trip_payments_selected_array,'trip_payments_selected_array-trip_payments_selected_array')

    setTripPaymentsArray(trip_payments_selected_array)

    let contractor_array = []
    let purpose_array = []
    let purpose_array_updated = []
    let single_purpose_array = []
    let contractor_array_updated = []
    let single_contractor_array = []
    trip_payments_selected_array.map((vall, indd) => {
      contractor_array.push(vall.ifoods_Vendor_info.id)
    })
    trip_payments_selected_array.map((vall, indd) => {
      purpose_array.push(vall.purpose)
    })

    // console.log(contractor_array,'contractor_array-contractor_array')

    contractor_array_updated = removeDuplicates(contractor_array)
    purpose_array_updated = removeDuplicates(purpose_array)

    // console.log(contractor_array_updated,'contractor_array_updated-contractor_array_updated')

    // console.log(values.tripPaymentSubmission,'values.tripPaymentSubmission')

    if (trip_payments_array.length == 0) {
      toast.warning('Please Choose Atleast One Tripsheet for Payment Submission..!')
      setAssignPSModal(false)
    } else {
      if (contractor_array_updated.length > 1) {
        toast.warning('The selection of tripsheets should only be for a single vendor...!')
        setAssignPSModal(false)
      } else {
        single_contractor_array = searchFilterData.filter((value) =>
          JavascriptInArrayComponent(value.ifoods_Vendor_info.id, contractor_array_updated)
        )

        // console.log(removeDuplicates(single_contractor_array),'removeDuplicates(single_contractor_array)')
        setSingleVendorArray(removeDuplicates(single_contractor_array))
        setAssignPSModal(true)
      }
    }

  //  console.log(removeDuplicates(single_contractor_array))
  }
  
  //console.log(singleVendorArray + 'singleVendorArray')


  const getClosureVehiclesData = () => {
    IfoodsExpenseClosureService.getSettlementClosureReport().then((res) => {
      closureData = res.data.data

  
      console.log(closureData, 'Report   1 ')
   
      setFetch(true)

      let rowDataList = []
      const filterData = closureData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
     
      setSearchFilterData(filterData)
      let extractedValue
      filterData.map((data, index) => {
        if (data.closure_info && data.closure_info.total_expenses !== null) {
          let fm = data.closure_info.total_expenses
          let ae = data.closure_info.freight_charges
       let additionalexpense = fm - ae
      //  console.log(fm+"-"+ae+"="+additionalexpense)
   
        const jsonData = data.closure_info.return_delivery
        if (jsonData) {
          try {
              const parsedData = JSON.parse(jsonData);
              if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].value !== undefined) {
                  extractedValue = parsedData[0].value;
          
              } else {
                //  console.error("Invalid data structure in parsed JSON data.");
               
              }
          } catch (error) {
           //   console.error("Error parsing JSON data:", error);
          
          }
      } else {
        //  console.error("JSON data is undefined or null.");
         
      }
  
        rowDataList.push({
          S_NO: index + 1,     
          return_delivery: extractedValue,  
          Ifoods_Location: data.vehicle_location_info.location,
          Vendor_Name: data.ifoods_Vendor_info.vendor_name,
          break_down: data.closure_info.break_down == 1 ? 'Yes' : 'No',
          alt_vh_no: data.closure_info.alt_vh_no,
          breakdown_km: data.closure_info.breakdown_km,
          breakdown_reason: data.closure_info.breakdown_reason,
          return_stock: data.closure_info.return_stock == 1 ? 'Yes' : 'No',
         
          return_remarks: data.closure_info.return_remarks,
          purpose: data.purpose == 1 ? 'FG-Sales' : 'FG-STO',
          Vendor_Code: data.ifoods_Vendor_info.vendor_code,
          Vendor_Number: data.ifoods_Vendor_info.vendor_contact_no,
          Tripsheet: data.tripsheet_info.ifoods_tripsheet_no,
          Shipment_No: data.tripsheet_info.shipment_po,
          GateIn_Date: data.created_date,
          Tripsheet_Date: data.tripsheet_info.created_at,
          Product_temp: data.tripsheet_info[0].product_temp,
          Expense_Date: data.closure_info.created_at_date,
          Vehicle_No: data.ifoods_Vehicle_info.vehicle_number,
          Driver_Name: data.driver_name,
          Driver_Number: data.driver_number,
          Openning_km: data.closure_info.odometer_opening_km,
          Closing_km: data.closure_info.odometer_closing_km,
          Running_Km: data.closure_info.runningkm,
          Despatch_Crate: data.tripsheet_info[0].trip_crate,
          Return_Crate: data.closure_info.return_crate,
          shipment_po: data.tripsheet_info[0].shipment_po,
          Additioal_expense: additionalexpense,
          Total_Expenses: data.closure_info.total_expenses,
          budget_km_master: data.ifoods_Salesfreight_info.budget_km,
          budget_freight_master: data.ifoods_Salesfreight_info.budget_km_freight,
          freight_per_km_master: data.ifoods_Salesfreight_info.freight_per_km,
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Tripsheet_No: data.tripsheet_info[0].ifoods_tripsheet_no,
         
        })
      } else {
    //    console.log("closure_info data is null or total_expenses is null.");
    }
      })
    

      setRowData(rowDataList)
    
    })
  }

  useEffect(() => {
    getClosureVehiclesData()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.S_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'Loading Point In',
      selector: (row) => row.GateIn_Date,
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
      name: 'Location',
      selector: (row) => row.Ifoods_Location,
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
      name: 'Purpose',
      selector: (row) => row.purpose,
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
      name: 'Product Temp°',
      selector: (row) => row.Product_temp,
      sortable: true,
      center: true,
    },
    {
      name: 'Openning KM',
      selector: (row) => row.Openning_km,
       sortable: true,
      center: true,
    },
    {
      name: 'Closing KM',
      selector: (row) => row.Closing_km,
       sortable: true,
      center: true,
    },
   
    {
      name: 'Run KM',
      selector: (row) => row.Running_Km,
       sortable: true,
      center: true,
    },
    {
      name: 'Des.Crate',
      selector: (row) => row.Despatch_Crate,
       sortable: true,
      center: true,
    },
    {
      name: 'Ret. Crate',
      selector: (row) => row.Return_Crate,
       sortable: true,
      center: true,
    },
    {
      name: 'Shipment Number',
      selector: (row) => row.shipment_po,
       sortable: true,
      center: true,
    },
    
    {
      name: 'Additional Expense',
      selector: (row) => row.Additioal_expense,
       sortable: true,
      center: true,
    },
    {
      name: 'Total Freight',
      selector: (row) => row.Total_Expenses,
       sortable: true,
      center: true,
    },
    {
      name: 'Return Stock',
      selector: (row) => row.return_stock,
       sortable: true,
      center: true,
    },
    // {
    //   name: 'Return Delivery',
    //   selector: (row) => row.return_delivery,
    //    sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Return Remarks',
    //   selector: (row) => row.return_remarks,
    //    sortable: true,
    //   center: true,
    // },
    {
      name: 'Break Down',
      selector: (row) => row.break_down,
       sortable: true,
      center: true,
    },
    // {
    //   name: 'Alt Vehicle',
    //   selector: (row) => row.alt_vh_no,
    //    sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Break Down Reason',
    //   selector: (row) => row.breakdown_reason,
    //    sortable: true,
    //   center: true,
    // },
  ]

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
    }`
  }

  /* Report Variables */
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportLocation, setReportLocation] = useState(0)
  const [reportVendor, setReportVendor] = useState(0)

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
   // console.log(selected_value, 'selected_value')

    if (event_type == 'depo_vehicle') {
      if (selected_value) {
        setReportVehicle(selected_value)
      } else {
        setReportVehicle(0)
      }
    } else if (event_type == 'ifoods_purpose') {
      if (selected_value) {
        setReportLocation(selected_value)
      } else {
        setReportLocation(0)
      }
    } else if (event_type == 'ifoods_vendor') {
      if (selected_value) {
        setReportVendor(selected_value)
      } else {
        setReportVendor(0)
      }
    }
  }

  const [tdsTaxData, setTdsTaxData] = useState([])
  useEffect(() => {
    /* section for getting TDS Tax Type Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      let viewData = response.data.data
      // console.log(viewData,'viewData')
      setTdsTaxData(viewData)
    })
  }, [])

  const getTdsTax = (code) => {
    let tds_text = '-'
    tdsTaxData.map((val, ind) => {
      if (val.definition_list_code == code) {
        tds_text = val.definition_list_name
      }
    })
    return tds_text
  }

  const loadTripPaymentSubmission = (type) => {
    console.log('loadTripPaymentReport--' + type)

    if (defaultDate == null) {
      setFetch(true)
      toast.warning('Date Filter Should not be empty..!')
      return false
    } else if (
      defaultDate == null &&
      reportVehicle == 0 &&
      reportShipmentNo == 0 &&
      reportTSNo == 0 &&
      reportShipmentStatus == 0 &&
      reportLocation == 0
    ) {
      setFetch(true)
      toast.warning('Choose atleast one filter type..!')
      return false
    }
    let report_form_data = new FormData()

    report_form_data.append('date_between', defaultDate)
    report_form_data.append('vehicle_id', reportVehicle)
    report_form_data.append('purpose', reportLocation)
    report_form_data.append('vendor_id', reportVendor)
    console.log(report_form_data)
    console.log(defaultDate, 'defaultDate')
    console.log(reportVehicle, 'reportVehicle')
    console.log(reportLocation, 'reportLocation')
    console.log(reportVendor, 'reportVendor')

    IfoodsExpenseClosureService.getSettlementClosureReportFilter(report_form_data).then((res) => {
      //   console.log(res, 'res')
      closureData = res.data.data
      console.log(closureData, 'sentPaymentSubmissionDataForFilter')

      setFetch(true)

      let rowDataList = []
      const filterData1 = closureData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )

      setSearchFilterData(filterData1)
      let extractedValue
      filterData1.map((data, index) => {
        let fm = data?.closure_info?.total_expenses
          let ae = data?.closure_info?.freight_charges
       let additionalexpense = fm - ae
       const jsonData = data?.closure_info?.return_delivery
       if (jsonData) {
        try {
            const parsedData = JSON.parse(jsonData);
            if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].value !== undefined) {
                extractedValue = parsedData[0].value;
        
            } else {
                // console.error("Invalid data structure in parsed JSON data.");
             
            }
        } catch (error) {
            // console.error("Error parsing JSON data:", error);
        
        }
    } else {
        // console.error("JSON data is undefined or null.");
       
    }
       
       console.log(extractedValue)
        rowDataList.push({
          S_NO: index + 1,       
          Ifoods_Location: data.vehicle_location_info.location,
          Vendor_Name: data.ifoods_Vendor_info.vendor_name,
          break_down: data.closure_info.break_down == 1 ? 'Yes' : 'No',
          alt_vh_no: data.closure_info.alt_vh_no,
          breakdown_km: data.closure_info.breakdown_km,
          breakdown_reason: data.closure_info.breakdown_reason,
          return_stock: data.closure_info.return_stock == 1 ? 'Yes' : 'No',
          return_delivery: extractedValue,
          return_remarks: data.closure_info.return_remarks,
          purpose: data.purpose == 1 ? 'FG-Sales' : 'FG-STO',
          Vendor_Code: data.ifoods_Vendor_info.vendor_code,
          Vendor_Number: data.ifoods_Vendor_info.vendor_contact_no,
          Tripsheet: data.tripsheet_info.ifoods_tripsheet_no,
          Shipment_No: data.tripsheet_info.shipment_po,
          GateIn_Date: data.created_date,
          Tripsheet_Date: data.tripsheet_info.created_at,
          Product_temp: data.tripsheet_info[0].product_temp,
          Expense_Date: data.closure_info.created_at_date,
          Vehicle_No: data.ifoods_Vehicle_info.vehicle_number,
          Driver_Name: data.driver_name,
          Driver_Number: data.driver_number,
          Openning_km: data.closure_info.odometer_opening_km,
          Closing_km: data.closure_info.odometer_closing_km,
          Running_Km: data.closure_info.runningkm,
          Despatch_Crate: data.tripsheet_info[0].trip_crate,
          Return_Crate: data.closure_info.return_crate,
          shipment_po: data.tripsheet_info[0].shipment_po,
          Additioal_expense: additionalexpense,
          Total_Expenses: data.closure_info.total_expenses,
          budget_km_master: data.ifoods_Salesfreight_info.budget_km,
          budget_freight_master: data.ifoods_Salesfreight_info.budget_km_freight,
          freight_per_km_master: data.ifoods_Salesfreight_info.freight_per_km,
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Tripsheet_No: data.tripsheet_info[0].ifoods_tripsheet_no,
       

        
        })
      })

      setRowData(rowDataList)
      // setPending(false)
    })

    if (type == '1') {
      loadTripPaymentSubmission(0)
    }
  }




 

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard className="mt-4">
                <CContainer className="m-2">
                  <CRow className="mt-1 mb-1">
                  <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="VNum">Loading Point - In Date Filter</CFormLabel>
                          <DateRangePicker
                            style={{ width: '100rem', height: '100%', borderColor: 'black' }}
                            className="mb-2"
                            id="start_date"
                            name="end_date"
                            format="dd-MM-yyyy"
                            value={defaultDate}
                            // value={''}
                            onChange={setDefaultDate}
                          />
                        </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">Vendor Name</CFormLabel>
                      <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'ifoods_vendor')
                        }}
                        label="Select Vendor"
                        noOptionsMessage="Vendor Not found"
                        search_type="ifoods_payment_submission_contractor"
                        search_data={searchFilterData}
                      />
                    </CCol>
                   
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="VNum">Trip Purpose</CFormLabel>
                          <SearchSelectComponent
                            size="sm"
                            className="mb-2"
                            onChange={(e) => {
                              onChangeFilter(e, 'ifoods_purpose')
                            }}
                            label="Select Purpoes"
                            noOptionsMessage="Purpoes Not found"
                            search_type="ifoods_purpose"
                            search_data={searchFilterData}
                          />
                        </CCol>
                       
                    
                        
                   
                  </CRow>
                  <CRow className="mt-3">
                    <CCol style={{ display: 'flex', justifyContent: 'end' }}>
                      <CButton
                        size="sm"
                        color="primary"
                        className="mx-3 px-3 text-white"
                        onClick={() => {
                          setFetch(false)
                          loadTripPaymentSubmission(1)
                        }}
                      >
                        Filter
                      </CButton>
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        // style={{marginTop:'10%'}}
                        onClick={(e) => {
                          // loadVehicleReadyToTripForExportCSV()
                          exportToCSV()
                        }}
                      >
                        Export
                      </CButton>
                    </CCol>
                  </CRow>
                  {/* <CRow className="mt-3">


                  </CRow> */}
                  <CustomTable
                    columns={columns}
                    pagination={false}
                    data={rowData}
                    fieldName={'Driver_Name'}
                    showSearchFilter={true}
                  />
                </CContainer>
              </CCard>
            </>
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default IfoodsTripClosureReport
