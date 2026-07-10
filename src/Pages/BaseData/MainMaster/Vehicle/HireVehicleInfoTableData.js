import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import CustomTable from 'src/components/customComponent/CustomTable'
import VehicleMasterService from 'src/Service/Master/VehicleMasterService'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const HireVehicleInfoTableData = () => {
  const [rowData, setRowData] = useState([])
  const [pending, setPending] = useState(true)

  /*================== User Info From Local Storage ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no_for_view_access =
    LogisticsProScreenNumberConstants.MasterAccessModule.Vehicle_Master_View

  useEffect(() => {
    if (
      user_info.is_admin == 1 ||
      JavascriptInArrayComponent(page_no_for_view_access, user_info.page_permissions)
    ) {
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else {
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }
  }, [])
  /* ==================== Access Part End ========================*/

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'Hire_Vehicle_Info_Report_' + dateTimeString
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const exportData = rowData.map((data) => ({
      'S.No': data.sno,
      'Creation Date': data.Creation_Date,
      'Veh Number': data.vehicle_Number,
      'Veh Capacity': data.Vehicle_Capacity,
      'Veh Body Type': data.Vehicle_Bodytype,
      'Last Tripsheet No': data.Last_Tripsheet_No,
      'Vehicle Usage': data.Vehicle_Usage_Count,
    }))
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  useEffect(() => {
    if (screenAccess) {
      VehicleMasterService.getHireVehicles().then((response) => {
        let viewData = response.data.data
        let rowDataList = []
        viewData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Creation_Date: data.created_at,
            vehicle_Number: data.vehicle_number,
            Vehicle_Capacity: data.vehicle_capacity_info
              ? data.vehicle_capacity_info.capacity + '-TON'
              : '-',
            Vehicle_Bodytype: data.vehicle_body_type_info
              ? data.vehicle_body_type_info.body_type
              : '-',
            Last_Tripsheet_No: data.last_tripsheet_no ? data.last_tripsheet_no : '-',
            Vehicle_Usage_Count: data.vehicle_usage_count ? data.vehicle_usage_count : 0,
          })
        })
        setRowData(rowDataList)
        setPending(false)
      })
    }
  }, [screenAccess])

  // ============ Column Header Data =======

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation Date',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh Number',
      selector: (row) => row.vehicle_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh Capacity',
      selector: (row) => row.Vehicle_Capacity,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh Body Type',
      selector: (row) => row.Vehicle_Bodytype,
      sortable: true,
      center: true,
    },
    {
      name: 'Last Tripsheet No',
      selector: (row) => row.Last_Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Usage',
      selector: (row) => row.Vehicle_Usage_Count,
      sortable: true,
      center: true,
    },
  ]

  //============ column header data=========

  if (!screenAccess) {
    return <AccessDeniedComponent />
  }

  return (
    <>
      <CRow className="mt-1 mb-1">
        <CCol
          className="offset-md-6"
          xs={15}
          sm={15}
          md={6}
          style={{ display: 'flex', justifyContent: 'end' }}
        >
          <CButton
            size="sm"
            color="warning"
            className="px-3 text-white"
            onClick={() => exportToCSV()}
          >
            EXPORT
          </CButton>
        </CCol>
      </CRow>
      <CCard>
        <CContainer>
          <CustomTable
            columns={columns}
            data={rowData}
            fieldName={'vehicle_Number'}
            showSearchFilter={true}
            pending={pending}
          />
        </CContainer>
      </CCard>
      <ToastContainer />
    </>
  )
}

export default HireVehicleInfoTableData
