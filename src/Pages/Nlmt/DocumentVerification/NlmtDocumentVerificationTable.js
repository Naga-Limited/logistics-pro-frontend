import React, { useState, useEffect } from 'react'
import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import NlmtDocumentVerificationService from 'src/Service/Nlmt/DocsVerify/NlmtDocumentVerificationService'

const NlmtDocumentVerificationTable = () => {
  /* ================= User Location ================= */
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  const user_locations = user_info.location_info.map((d) => d.id)

  /* ================= State ================= */
  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)

  const ACTION = {
    VEHICLE_INSPECTION_COMPLETED: 2,
  }
    const getVehicleTypeLabel = (vehicleTypeId) => {
    switch (Number(vehicleTypeId)) {
      case 21:
        return 'Own'
      case 22:
        return 'Hire'
      case 23:
        return 'Party'
      default:
        return '-'
    }
  }

  /* ================= Load Table ================= */
  const loadDocsVerifyTable = () => {
    NlmtDocumentVerificationService.getDocsVerifyTableData().then((res) => {
      const tableData = res.data // ✅ FIXED

      const filtered = tableData
        // Location filter
        .filter((data) => user_locations.includes(data.vehicle_location_id))

        // Vehicle type filter (22 = Truck)
        .filter(
          (data) =>
            data.nlmt_vehicle_info &&
            data.nlmt_vehicle_info.vehicle_type_id === 22 &&
            data.vendor_info &&                     // vendor exists
            data.vendor_info.vendor_status === 1 && // vendor verified
            data.tripsheet_open_status === '0'      // docs pending
        )

      const rows = filtered.map((data, index) => ({
        sno: index + 1,
        Vehicle_Type: getVehicleTypeLabel(data.nlmt_vehicle_info.vehicle_type_id),

        Vehicle_No: data.nlmt_vehicle_info.vehicle_number,
        Driver_Name: data.driver_name,
        Waiting_At: (
          <span className="badge rounded-pill bg-info">
            {Number(data.vehicle_current_position) === ACTION.VEHICLE_INSPECTION_COMPLETED
              ? 'VI Completed'
              : 'Gate In'}
          </span>
        ),
        Screen_Duration: data.vehicle_current_position_updated_time,
        Overall_Duration: data.created_at,
        Action: (
          <CButton className="badge" color="warning">
            <Link
              className="text-white"
              to={`NlmtDocumentVerification/${data.id}`}
            >
              VERIFY
            </Link>
          </CButton>
        ),
      }))

      setRowData(rows)
      setFetch(true)
    })
  }

  useEffect(() => {
    loadDocsVerifyTable()
  }, [])

  /* ================= Table Columns ================= */
  const columns = [
    { name: 'S.No', selector: (row) => row.sno, center: true },
    { name: 'Vehicle Type', selector: (row) => row.Vehicle_Type, center: true },
    { name: 'Vehicle No', selector: (row) => row.Vehicle_No, center: true },
    { name: 'Driver Name', selector: (row) => row.Driver_Name, center: true },
    { name: 'Current Status', selector: (row) => row.Waiting_At, center: true },
    { name: 'Screen Duration', selector: (row) => row.Screen_Duration, center: true },
    { name: 'Overall Duration', selector: (row) => row.Overall_Duration, center: true },
    { name: 'Action', selector: (row) => row.Action, center: true },
  ]

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <CCard className="mt-4">
          <CContainer className="mt-2">
            <CustomTable
              columns={columns}
              data={rowData}
              fieldName="Driver_Name"
              showSearchFilter={true}
            />
          </CContainer>
        </CCard>
      )}
    </>
  )
}

export default NlmtDocumentVerificationTable
