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
import VMReportFilterComponent from './VMReportFilterComponent/VMReportFilterComponent'


const VMainReport = (
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

  const [value, setValue] = React.useState([new Date(getCurrentDate('-')), new Date(getCurrentDate('-'))]);

  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)
  const [currentDeliveryId, setCurrentDeliveryId] = useState('')
  const [visible, setVisible] = useState(false)
  const [start, setStart] = useState('')
  const [searchFilterData, setSearchFilterData] = useState([])
  const [reportVehicle, setReportVehicle] = useState(0)


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

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value

    if (event_type == 'vehicle_number') {
      if (selected_value) {
        setReportVehicle(selected_value)
      } else {
        setReportVehicle(0)
      }
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

  const ACTION = {
    MAINTENANCE_INSIDE: 1,
    MAINTENANCE_OUTSIDE: 2,
    MAINTENANCE_COMPLETED: 3,
    MAINTENANCE_OUTSIDE_COMPLETED: 4,

  }

  let tableData1 = []
  const loadVehicleReadyToTrip = () => {
    let tableData = new FormData()
    // tableData.append('advpay_date_range', values.advpay_date_range)

    console.log(dateRangePickerStartDate, 'start date')
    console.log(dateRangePickerEndDate, 'end date')

    tableData.append('maintenance_from_date_range', dateRangePickerStartDate)
    tableData.append('maintenance_to_date_range', dateRangePickerEndDate)
    tableData.append('vehicle_number', reportVehicle)
    tableData.append('vehicle_maintenance_status', values.vehicle_maintenance_status)

    console.log(values.vehicle_maintenance_status)

    ReportService.VehicleMaintenanceReport(tableData).then((res) => {
      console.log(res.data)
      setFetch(true)
      tableData1 = res.data
      let rowDataList = []
      setSearchFilterData(tableData1)
      tableData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Vehicle_Type: data.vehicle_type,
          vehicle_number: data.vehicle_number,
          driver_name: data.driver_name,
          maintenance_by: data.maintenance_by,
          maintenance_typ: data.maintenance_typ,
          maintenance_end_datetime: formatDate(data.maintenance_end_datetime),
          maintenance_start_datetime: formatDate(data.maintenance_start_datetime),
          opening_odometer_km: data.opening_odometer_km,
          closing_odometer_km: data.closing_odometer_km  || '-',
          work_order: data.work_order === 'null' ? '-': data.work_order,
          vendor_id: data.vendor_id === 'null' ? '-': data.vendor_id,
          vehicle_maintenance_status: data.vehicle_maintenance_status,
          created_at:formatDate(data.created_at),
          vehicle_maintenance_status:(
              data.vehicle_maintenance_status == ACTION.MAINTENANCE_INSIDE
                ? 'Inhouse'
                : data.vehicle_maintenance_status == ACTION.MAINTENANCE_OUTSIDE
                ? 'Outside'
                : data.vehicle_maintenance_status == ACTION.MAINTENANCE_COMPLETED
                ? 'Inside Maintenance End'
                : data.vehicle_maintenance_status == ACTION.MAINTENANCE_OUTSIDE_COMPLETED
                ? 'Outside Maintenance End'
                : ''
          ),
          Action: (
            <CButton
            onClick={() => {
              setVisible(!visible)
              setCurrentDeliveryId(data.DeliveryOrderNumber)
            }}
            className="text-white"
            color="warning"
            size="sm"
          >
            <span className="float-start">
              <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
            </span>
          </CButton>
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
  setFetch(true)

let fileName='MaintenanceReport'
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
      name: 'Vehicle Type',
      selector: (row) => row.Vehicle_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.vehicle_number,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.driver_name,
      sortable: true,
      center: true,
    },
    {
      name: 'maintenance by',
      selector: (row) => row.maintenance_by,
      sortable: true,
      center: true,
    },
    {
      name: 'maintenance type',
      selector: (row) => row.maintenance_typ,
      sortable: true,
      center: true,
    },
    {
      name: 'work_order',
      selector: (row) => row.work_order,
      sortable: true,
      center: true,
    },
    {
      name: 'vendor name',
      selector: (row) => row.vendor_id,
      sortable: true,
      center: true,
    },
    {
      name: 'opening odometer km',
      selector: (row) => row.opening_odometer_km,
      sortable: true,
      center: true,
    },
    {
      name: 'closing odometer km',
      selector: (row) => row.closing_odometer_km,
      sortable: true,
      center: true,
    },

    {
      name: 'vehicle maintenance status',
      selector: (row) => row.vehicle_maintenance_status,
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
      maintenance_from_date_range: '',
      maintenance_to_date_range: '',
      vehicle_number:'',
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
            id="advpay_date_range"
            name="advpay_date_range"
            format="dd-MM-yyyy"
            value={value}
            onChange={setValue}
            // onChange={getAdvanceDateRange(e)}
          />
          </CCol>

          <CCol xs={12} md={3}>
          <CFormLabel htmlFor="VNum">
                Vehicle Number
          </CFormLabel>
          <VMReportFilterComponent
              size="sm"
              className="mb-1"
              onChange={(e) => {
                onChangeFilter(e, 'vehicle_number')
              }}
              label="vehicle_number"
              id="vehicle_number"
              name="vehicle_number"
              // value={values.vehicle_number}
              search_type="vehicle_number"
              noOptionsMessage="Vehicle Not found"
              search_data={searchFilterData}
            />
          </CCol>
          {/* <CCol xs={12} md={3}>
          <CFormLabel htmlFor="VNum">
                Maintenance By
          </CFormLabel>
            <VMReportFilterComponent
                   size="sm-lg"
                   className="mb-2"
                   onChange={(e) => {
                    vehicle_maintenance_status(e)
                   }}
                   label="vehicle_maintenance_status"
                   id="vehicle_maintenance_status"
                   name="vehicle_maintenance_status"
                   value={values.vehicle_maintenance_status}
                   search_type="vehicle_maintenance_status"
                  />

          </CCol> */}

        </CRow>
          {/* <CRow>
             <CCol xs={12}
                    sm={12}
                    md={3}
                    style={{ display: 'flex', justifyContent: 'end' }}className="offset-md-10">

              <CButton size='sm'
              // style={{width: '5rem',height:'2.5rem',marginLeft:'45%',marginTop:'20px'}}
              onClick={() => {
              loadVehicleReadyToTrip()}}
              >Filter</CButton>
              </CCol>
          </CRow> */}
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
              setFetch(false)
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
      )}
    </>
  )
}

export default VMainReport
