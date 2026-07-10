import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import AfterDeliveryGateInService from 'src/Service/AfterDeliveryGateIn/AfterDeliveryGateInService'
const AfterDeliveryGateIn = () => {
  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)
  let tableData = []

  const loadVehicleReadyToTrip = () => {
    AfterDeliveryGateInService.getVehicleReadyToGatein().then((res) => {
      setFetch(true)
      tableData = res.data.data
      console.log(tableData)
      let rowDataList = []
      tableData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.trip_sheet_info?.trip_sheet_no,
          Vehicle_Type: data.vehicle_type_id.type,
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Waiting_At: <span className="badge rounded-pill bg-info">After Delivery GateIn</span>,
          Screen_Duration: data.updated_at,
          Overall_Duration: data.created_at,
          Action: (
            <CButton className="badge text-white" color="warning">
              <Link to={`${data.parking_yard_gate_id}`}>After Delivery GateIn</Link>
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

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Number',
      selector: (row) => row.Tripsheet_No,
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
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.Driver_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Waiting At',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      center: true,
    },
    {
      name: ' Overall Duration',
      selector: (row) => row.Overall_Duration,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]
  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <CCard className="mt-4">
         <CContainer className="mt-1">
         <CustomTable
          columns={columns}
          data={rowData}
          fieldName={'After_Delivery_gatein'}
          showSearchFilter={true}
        />
        <hr></hr>
      </CContainer>
        </CCard>
      )}
    </>
  )
}

export default AfterDeliveryGateIn
