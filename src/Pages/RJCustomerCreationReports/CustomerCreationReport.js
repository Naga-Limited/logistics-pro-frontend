import { CButton, CCard, CContainer,CFormSelect,CForm,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CTabPane,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CFormInput,
  CFormLabel} from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import ReportService from 'src/Service/Report/ReportService'
import VehicleMasterValidation from 'src/Utils/Master/VehicleMasterValidation'
import useForm from 'src/Hooks/useForm'
import { DateRangePicker } from 'rsuite';
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import CustomerCreationFilterComponent from './CustomerCreationFilterComponent/CustomerCreationFilterComponent'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const CustomerCreationReport = (
  ) => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

// console.log(user_locations)
/*================== User Location Fetch ======================*/
/* ==================== Access Part Start ========================*/
const [screenAccess, setScreenAccess] = useState(false)
let page_no = LogisticsProScreenNumberConstants.RJCustomerModule.Customer_Creation_Report

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

  const [value, setValue] = React.useState([new Date(getCurrentDate('-')), new Date(getCurrentDate('-'))]);

  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)
  const [currentDeliveryId, setCurrentDeliveryId] = useState('')
  const [visible, setVisible] = useState(false)
  const [start, setStart] = useState('')


  {/* ============= Date Range Picker Part Start =========================== */}

  const [dateRangePickerStartDate, setDateRangePickerStartDate] = useState('')
  const [dateRangePickerEndDate, setDateRangePickerEndDate] = useState('')

  const  convert = (str) => {
    let date = new Date(str);
    let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");

  }

  useEffect (()=>{

    if(value){

      console.log(value)
      let fromDate = value[0];
      let toDate = value[1];
      console.log(convert(fromDate))
      console.log(convert(toDate))
      setDateRangePickerStartDate(convert(fromDate));
      setDateRangePickerEndDate(convert(toDate));

    } else {

      setDateRangePickerStartDate('');
      setDateRangePickerEndDate('');

    }
  },[value])

  {/* =============== Date Range Picker Part End =========================== */}

  const onChange = (event) => {
    let customer_status = event.value
    if (customer_status) {
      values.customer_status = customer_status
    } else {
      values.customer_status = ''
    }
  }
  const vehicle_maintenance_status = (event) => {
    // console.log(event)
    let vehicle_maintenance_status = event.value
    // console.log(division)
    // getvroute(route_no)
    if (vehicle_maintenance_status) {
      values.vehicle_maintenance_status = vehicle_maintenance_status
    } else {
      values.vehicle_maintenance_status = ''
    }
  }

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}

  const ACTION = {
    CUSTOMER_CREATION: 1,
    CUSTOMER_APPROVED: 2,
    CUSTOMER_CONFIRMED: 3,
    CUSTOMER_REJECTED: 4,
  }

  let tableData1 = []
  const loadVehicleReadyToTrip = () => {
    let tableData = new FormData()
    // tableData.append('advpay_date_range', values.advpay_date_range)

    console.log(dateRangePickerStartDate, 'start date')
    console.log(dateRangePickerEndDate, 'end date')

    tableData.append('rj_customer_from_date_range', dateRangePickerStartDate)
    tableData.append('rj_customer_to_date_range', dateRangePickerEndDate)
    tableData.append('customer_status', values.customer_status)
    console
    ReportService.RJCustomerReport(tableData).then((res) => {
      console.log(res.data)
      setFetch(true)
      tableData1 = res.data
      let rowDataList = []
      tableData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          creation_type: data.creation_type,
          customer_name: data.customer_name,
          customer_mobile_number: data.customer_mobile_number,
          customer_PAN_card_number: data.customer_PAN_card_number,
          customer_Aadhar_card_number: data.customer_Aadhar_card_number,
          customer_bank_passbook: data.customer_bank_passbook,
          customer_bank_id: data.customer_bank_id === 'null' ? '-': data.customer_bank_id,
          customer_bank_branch: data.customer_bank_branch,
          customer_bank_ifsc_code: data.customer_bank_ifsc_code === 'null' ? '-': data.customer_bank_ifsc_code,
          customer_bank_account_number: data.customer_bank_account_number,
          customer_street_name: data.customer_street_name,
          customer_city: data.customer_city,
          customer_district: data.customer_district,
          customer_area: data.customer_area,
          customer_state: data.customer_state,
          last_Delivery_point: data.last_Delivery_point,
          customer_postal_code: data.customer_postal_code,
          customer_region: data.customer_region,
          customer_gst_number: data.customer_gst_number === 'null' ? '-': data.customer_gst_number,
          customer_payment_terms: data.customer_payment_terms,
          customer_code: data.customer_code,
          incoterms_description: data.incoterms_description,
          customer_remarks:data.customer_remarks ,
          created_at: formatDate(data.created_at),
          customer_status:(
              data.customer_status == ACTION.CUSTOMER_CREATION
                ? 'Customer Creation'
                : data.customer_status == ACTION.CUSTOMER_CONFIRMED
                ? 'Customer Confirmed'
                : data.customer_status == ACTION.CUSTOMER_APPROVED
                ? 'Customer Approved'
                : 'Rejected'
          ),
        })
      })
      setRowData(rowDataList)
    })
  }
  useEffect(() => {
    loadVehicleReadyToTrip()
  }, [])




function getCurrentDate(separator = '') {
  let newDate = new Date()
  let date = newDate.getDate()
  let month = newDate.getMonth() + 1
  let year = newDate.getFullYear()

  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
}

const exportToCSV = () => {

let fileName='RJCustomer'
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const ws = XLSX.utils.json_to_sheet(rowData);
const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
const data = new Blob([excelBuffer], {type: fileType});
// debugger
//console.log(tableData);
FileSaver.saveAs(data, fileName + fileExtension);
}



  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'customer name',
      selector: (row) => row.customer_name,
      sortable: true,
      center: true,
    },
    {
      name: 'customer code',
      selector: (row) => row.customer_code,
      sortable: true,
      center: true,
    },
    {
      name: 'creation type',
      selector: (row) => row.creation_type,
      sortable: true,
      center: true,
    },
    {
      name: 'mobile number',
      selector: (row) => row.customer_mobile_number,
      sortable: true,
      center: true,
    },
    {
      name: 'PAN Number',
      selector: (row) => row.customer_PAN_card_number || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Aadhar number',
      selector: (row) => row.customer_Aadhar_card_number|| '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Bank Name',
      selector: (row) => row.customer_bank_id,
      sortable: true,
      center: true,
    },
    {
      name: 'Account Number',
      selector: (row) => row.customer_bank_account_number || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Bank Branch',
      selector: (row) => row.customer_bank_branch || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'IFSC Code',
      selector: (row) => row.customer_bank_ifsc_code,
      sortable: true,
      center: true,
    },

    {
      name: 'Street Name',
      selector: (row) => row.customer_street_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Area Name',
      selector: (row) => row.customer_area,
      sortable: true,
      center: true,
    },
    {
      name: 'City',
      selector: (row) => row.customer_city,
      sortable: true,
      center: true,
    },
    {
      name: 'District',
      selector: (row) => row.customer_district,
      sortable: true,
      center: true,
    },
    {
      name: 'State',
      selector: (row) => row.customer_state,
      sortable: true,
      center: true,
    },
    {
      name: 'Postal Code',
      selector: (row) => row.customer_postal_code,
      sortable: true,
      center: true,
    },
    {
      name: 'Region',
      selector: (row) => row.customer_region,
      sortable: true,
      center: true,
    },
    {
      name: 'GST_No',
      selector: (row) => row.customer_gst_number,
      sortable: true,
      center: true,
    },
    {
      name: 'Payment Terms',
      selector: (row) =>row.customer_payment_terms||'-',
      sortable: true,
      center: true,
    },
    {
      name: 'Incoterms',
      selector: (row) => row.incoterms_description||'-',
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.customer_status,
      sortable: true,
      center: true,
    },
    {
      name: 'Created_at',
      selector: (row) => row.created_at,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Action',
    //   selector: (row) => row.Action,
    //   center: true,
    // }
  ]
  // const [value, onChange] = useState([new Date(), new Date()]);

    const formValues = {
      rj_customer_from_date_range: '',
      rj_customer_to_date_range: '',
      customer_status:'',
      vehicle_maintenance_status:'',
    }
    const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
      loadVehicleReadyToTrip,
      VehicleMasterValidation,
      formValues
    )

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>
        {screenAccess ? (
         <>
          <CCard className="mt-4">
            <CContainer className="mt-1">
        <CRow className="mt-1 mb-1" >
            <CCol xs={12} md={3}>
            <CFormLabel htmlFor="VNum">
                  Date Filter
            </CFormLabel>
            <DateRangePicker
              style={{width: '100rem',height:'100%',borderColor:'black'}}
              className="mb-2"
              id="rj_date_range"
              name="rj_date_range"
              format="dd-MM-yyyy"
              value={value}
              onChange={setValue}
              // onChange={getAdvanceDateRange(e)}
            />
            </CCol>

          <CCol xs={12} md={3}>
          <CFormLabel htmlFor="VNum">
                Customer Status
          </CFormLabel>
          <CustomerCreationFilterComponent
                size="sm"
                className="mb-1"
                onChange={(e) => {
                  onChange(e)
                }}
                label="customer_status"
                id="customer_status"
                name="customer_status"
                value={values.customer_status}
                search_type="customer_status"
              />
          </CCol>
        </CRow>
          <CCol
                   className="offset-md-9"
                    xs={12}
                    sm={12}
                    md={3}
                    style={{ display: 'flex', justifyContent: 'end' }}
                  >
                    <CButton
                      size="lg-sm"
                      color="primary"
                      className="mx-3 px-3 text-white"
                      onClick={() => {
                        setFetch(false)
                        loadVehicleReadyToTrip()}}
                    >
                      Filter
                    </CButton>
          </CCol>
          <hr style={{height:'2px', marginTop:'0.5px'}}></hr>
          <CRow>

          <CCol
          className="offset-md-9"
          xs={12}
          sm={12}
          md={3}
          style={{ display: 'flex', justifyContent: 'end' }}
          >
            <CButton
             size="lg-sm"
             color="warning"
             className="mx-3 px-3 text-white"
             onClick={(e) => {
              exportToCSV()}
              }
             >
             Export
            </CButton>
        </CCol>
          </CRow>
            <CustomTable
              columns={columns}
              data={rowData}
              fieldName={'Advance_user'}
              showSearchFilter={true}
            />
          </CContainer>
          <CModal
          size="xl"
          visible={visible}
          backdrop="static"
          scrollable
          onClose={() => setVisible(false)}
        >
          <CModalHeader>
            <CModalTitle style={{ display: 'flex', justifyContent: 'end'}}>Diesel Intent Vouchar</CModalTitle>
          </CModalHeader>

          <CModalBody>

            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          </CCard>
         </>) : (<AccessDeniedComponent />)}
       </>
      )}
    </>
  )
}

export default CustomerCreationReport
