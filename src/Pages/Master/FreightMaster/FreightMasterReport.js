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
// import FMReportFilterComponent from './FMReportFilterComponent/FMReportFilterComponent'
import FreightCustomerListSearchSelect from 'src/components/commoncomponent/FreightCustomerListSearchSelect'
import LocationSearchSelect from 'src/components/commoncomponent/LocationSearchSelect'
import FreightMasterService from 'src/Service/Master/FreightMasterService'



const FreightMasterReport = (
  ) => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })


  const [value, setValue] = React.useState([new Date(getCurrentDate('-')), new Date(getCurrentDate('-'))]);
  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([])
  const [fetch, setFetch] = useState(false)
  const [currentDeliveryId, setCurrentDeliveryId] = useState('')
  const [visible, setVisible] = useState(false)
  const [start, setStart] = useState('')

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'institution_customer_id') {
      if (selected_value) {
        setReportCustomer(selected_value)
      } else {
        setReportCustomer(0)
      }
    }
     else if (event_type == 'customer_type') {
      if (selected_value) {
        setReportCusType(selected_value)
      } else {
        setReportCusType(0)
      }
    }
     else if (event_type == 'location_id') {
      if (selected_value) {
        setLocation(selected_value)
      } else {
        setLocation(0)
      }
    }
    else if(event_type == 0)
     {
      toast.warning('Choose atleast one filter type..!')
      return false
    }
  }

  const [reportCustomer, setReportCustomer] = useState(0)
  const [reportStatus, setReportStatus] = useState(0)
  const [reportCusType, setReportCusType] = useState(0)
  const [reportlocation, setLocation] = useState(0)
  let tableData1 = []
  const FreightReports = () => {
    let tableData = new FormData()
    tableData.append('institution_customer_id', reportCustomer)
    tableData.append('location_name', reportlocation)
    tableData.append('customer_type', reportCusType)
    tableData.append('freight_status', reportStatus)
   console.log(tableData)
    ReportService.getFreightDataForReport(tableData).then((res) => {
      console.log(res.data.data)
      setFetch(true)
      tableData1 = res.data.data
      let filterData = tableData1
      let rowDataList = []
      setSearchFilterData(filterData)
      tableData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          institution_customer_id: data.customer_info?.institution_customer_id,
          customer_name: data.customer_info?.customer_name,
          customer_code: data.customer_info?.customer_code,
          customer_type: data.customer_info?.customer_type,
          location_id: data.location_info?.location,
          freight_rate: data.freight_rate,
          type: data.type,
          start_date: data.start_date,
          end_date: data.end_date,
          created_at: data.created_at,
          Status: data.freight_status === 1 ? 'Active' : 'In-Active',
        })
      })
      setRowData(rowDataList)
    })
  }
  useEffect(() => {
    FreightReports()
  }, [])


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

function getCurrentDate(separator = '') {
  let newDate = new Date()
  let date = newDate.getDate()
  let month = newDate.getMonth() + 1
  let year = newDate.getFullYear()

  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
}

const [reportData, setreportData] = useState([])

  const freightForFilter = () => {
  const tableData = new FormData()
  tableData.append('institution_customer_id', reportCustomer)
  tableData.append('location_id', reportlocation)
  tableData.append('customer_type', reportCusType)
  tableData.append('freight_status', reportStatus)

  console.log(reportCustomer)
  ReportService.sentFreightDataForReport(tableData).then((res) => {
    setreportData(res.data)
    let tableReportData = []
    tableReportData = res.data.data
    setFetch(true)
    let rowDataList = []
    let filterData = tableReportData
    setSearchFilterData(filterData)
    filterData.map((data, index) => {
      rowDataList.push({
        sno: index + 1,
        institution_customer_id: data.customer_info?.institution_customer_id,
        customer_name: data.customer_info?.customer_name,
        customer_code: data.customer_info?.customer_code,
        customer_type: data.customer_info?.customer_type,
        location_id: data.location_info?.location,
        freight_rate: data.freight_rate,
        type: data.type,
        start_date: data.start_date,
        end_date: data.end_date,
        created_at: data.created_at,
        Status: data.freight_status === 1 ? 'Active' : 'In-Active',
      })
    })
    setRowData(rowDataList)
  })
}
const [exportCsvData, setExportCsvData] = useState([])

const FreightForExportCSV = () => {
  const tableData = new FormData()
  tableData.append('institution_customer_id', reportCustomer)
  tableData.append('location_id', reportlocation)
  tableData.append('customer_type', reportCusType)
  ReportService.sentFreightDataForReport(tableData).then((res) => {
    setExportCsvData(res.data.data)
  })
}
const exportToCSV = () => {

  let fileName='Freight_Master'
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
      name: 'S.no',
      selector: (row) => row.sno,
      left: true,
      sortable: true,
    },

    {
      name: 'Customer Name',
      selector: (row) => row.customer_name,
      left: true,
      sortable: true,
    },
    {
      name: 'Customer Code',
      selector: (row) => row.customer_code,
      left: true,
      sortable: true,
    },
    {
      name: 'Customer type',
      selector: (row) => row.customer_type,
      left: true,
      sortable: true,
    },
    {
      name: 'Supplying Plant',
      selector: (row) => row.location_id,
      left: true,
      sortable: true,
    },

    {
      name: 'Freight Rate',
      selector: (row) => row.freight_rate,
      left: true,
      sortable: true,
    },
    {
      name: 'Supply Type',
      selector: (row) => row.type,
      left: true,
      sortable: true,
    },
    {
      name: 'Start Date',
      selector: (row) => formatDate(row.start_date),
      left: true,
      sortable: true,
    },
    {
      name: 'End Date',
      selector: (row) => formatDate(row.end_date),
      left: true,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      left: true,
      sortable: true,
    },
  ]
    const formValues = {
      institution_customer_id:'',
      location_id:'',
    }
    const {} = useForm(
      FreightReports,
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
                 Location
             </CFormLabel>
             <LocationSearchSelect
              size="sm"
              className="mb-1"
              onChange={(e) => {
                onChangeFilter(e, 'location_id')
              }}
              label="Location"
              id="location_id"
              name="location_id"
             // value={location_id}
              search_type="location_id"
             search_data={searchFilterData}
              noOptionsMessage="Status Not found"
             />
           </CCol>

          <CCol xs={12} md={5}>
            <CFormLabel htmlFor="VNum">
               Customer Name & Code
            </CFormLabel>
             <FreightCustomerListSearchSelect
               size="sm"
               className="mb-1"
               onChange={(e) => {
                 onChangeFilter(e, 'institution_customer_id')
               }}
               label="Customer Name & Code"
               id="institution_customer_id"
               name="institution_customer_id"
               search_type="institution_customer_id"
               noOptionsMessage="Status Not found"
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
                        freightForFilter()}}
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
              FreightForExportCSV()
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
              fieldName={'customer_type'}
              showSearchFilter={true}
              search_data={searchFilterData}
            />
          </CContainer>
          <CModal
          size="xl"
          visible={visible}
          backdrop="static"
          scrollable
          onClose={() => setVisible(false)}
        >
        </CModal>
        </CCard>
      )}
    </>
  )
}

export default FreightMasterReport
