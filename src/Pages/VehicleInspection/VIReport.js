import { 
  CButton, 
  CCard, 
  CContainer,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel
} from '@coreui/react' 
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import ReportService from 'src/Service/Report/ReportService'
import VehicleMasterValidation from 'src/Utils/Master/VehicleMasterValidation'
import useForm from 'src/Hooks/useForm'
import { DateRangePicker } from 'rsuite';
import VIReportFilterComponent from './VIReportFilterComponent/VIReportFilterComponent'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify'

const VIReport = () => {

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  const [value, setValue] = React.useState([new Date(getCurrentDate('-')), new Date(getCurrentDate('-'))]);

  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false) 
  const [visible, setVisible] = useState(false) 
  const [reportVehicle, setReportVehicle] = useState(0)
  const [reportVIStatus, setReportVIStatus] = useState(0)
  const [searchFilterData, setSearchFilterData] = useState([])

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
    } else if (event_type == 'vehicle_inspection_status') {
      if (selected_value) {
        setReportVIStatus(selected_value)
      } else {
        setReportVIStatus(0)
      }
    }
  }

  const ACTION = {
    INSPECTION_CREATED: 1,
    INSPECTION_REJECTED: 2,
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

  let tableData1 = []
  const loadVehicleReadyToTrip = () => {
    let tableData = new FormData()

    console.log(dateRangePickerStartDate, 'start date')
    console.log(dateRangePickerEndDate, 'end date')

    tableData.append('inspect_from_date_range', dateRangePickerStartDate)
    tableData.append('inspect_to_date_range', dateRangePickerEndDate)
    tableData.append('vehicle_number', reportVehicle)
    tableData.append('vehicle_inspection_status', reportVIStatus)
    tableData.append('user_id', user_id)

    ReportService.VehicleInspectionReport(tableData).then((res) => {
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
          truck_clean: data.truck_clean == '1' ? 'Yes':'NO',
          bad_smell: data.bad_smell == '1' ? 'Yes':'NO',
          insect_vevils_presence: data.insect_vevils_presence == 1 ? 'Yes':'NO',
          tarpaulin_srf: data.tarpaulin_srf,
          tarpaulin_non_srf: data.tarpaulin_non_srf,
          insect_vevils_presence_in_tar: data.insect_vevils_presence_in_tar =='1'?'Yes':'No',
          truck_platform: data.truck_platform == '1'?'Yes':'No',
          previous_load_details: data.previous_load_details,
          vehicle_fit_for_loading: data.vehicle_fit_for_loading == '1'?'Yes':'No',
          // vehicle_inspection_status: data.vehicle_inspection_status,
          created_at: formatDate(data.created_at),
          vehicle_inspection_status:(
              data.vehicle_inspection_status == ACTION.INSPECTION_CREATED
                ? 'Create'
                : data.vehicle_inspection_status == ACTION.INSPECTION_REJECTED
                ? 'Rejected'
                : ''
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
    if(rowData.length == 0){
      toast.warning('No Data Found..!')
      return false
    }
    let fileName='VIReport'
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType}); 
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
      name: 'Truck clean',
      selector: (row) => row.truck_clean ,
      sortable: true,
      center: true,
    },
    {
      name: 'Bad smell',
      selector: (row) => row.bad_smell,
      sortable: true,
      center: true,
    },
    {
      name: 'insect vevils presence',
      selector: (row) => row.insect_vevils_presence,
      sortable: true,
      center: true,
    },

    {
      name: 'Tarpaulin srf',
      selector: (row) => row.tarpaulin_srf ,
      sortable: true,
      center: true,
    },
    {
      name: 'tarpaulin non srf',
      selector: (row) => row.tarpaulin_non_srf,
      sortable: true,
      center: true,
    },
    {
      name: 'insect vevils presence in tar',
      selector: (row) => row.insect_vevils_presence_in_tar,
      sortable: true,
      center: true,
    },
    {
      name: 'truck platform',
      selector: (row) => row.truck_platform,
      sortable: true,
      center: true,
    },
    {
      name: 'previous load details',
      selector: (row) => row.previous_load_details,
      sortable: true,
      center: true,
    },
    {
      name: 'vehicle fit for loading',
      selector: (row) => row.vehicle_fit_for_loading,
      sortable: true,
      center: true,
    },
    {
      name: 'vehicle_inspection_status',
      selector: (row) => row.vehicle_inspection_status,
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

  const formValues = {
    trip_from_date_range: '',
    trip_to_date_range: '',
    vehicle_number:'',
    trip_sheet_no:'',
    purpose:'',
    to_divison:'',
    status:''
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
                />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">
                  Vehicle Number
                </CFormLabel>
                <VIReportFilterComponent
                  size="sm"
                  className="mb-1"
                  onChange={(e) => {
                    onChangeFilter(e, 'vehicle_number')
                  }}
                  label="vehicle_number"
                  id="vehicle_number"
                  name="vehicle_number" 
                  search_type="vehicle_number"
                  noOptionsMessage="Vehicle Not found"
                  search_data={searchFilterData}
                />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="VNum">
                  Inspection Status
                </CFormLabel>
                <VIReportFilterComponent
                  size="sm-lg"
                  className="mb-2"
                  onChange={(e) => {
                  onChangeFilter(e, 'vehicle_inspection_status')
                }}
                  label="vehicle_inspection_status"
                  id="vehicle_inspection_status"
                  name="vehicle_inspection_status" 
                  search_type="vehicle_inspection_status"
                  noOptionsMessage="Vehicle Not found"
                  search_data={searchFilterData}
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
                    exportToCSV()
                  }}
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

export default VIReport
