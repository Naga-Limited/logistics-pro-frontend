import DataTable from 'react-data-table-component'
import React from 'react'
import { CButton } from '@coreui/react'
import { Link } from 'react-router-dom'
const ChangeVehicleHome = () => {
  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
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
      name: 'Tripsheet No',
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
      name: 'Driver Cell No',
      selector: (row) => row.Driver_No,
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

  const data = [
    {
      id: 1,
      sno: 1,
      VA_No: 12000,
      Tripsheet_No: 102556,
      Vehicle_Type: 'own',
      Vehicle_No: 'TN45AT8417',
      Driver_Name: 'Tester',
      Driver_No: '8867162629',
      Waiting_At: <span className="badge rounded-pill bg-info">DI Creation</span>,
      Screen_Duration: '0 Hrs 07 Mins',
      Overall_Duration: '0 Hrs 55 Mins',
      Action: (
        <CButton className="badge text-white" color="warning">
          <Link className="text-white" to="/ChangeVehicleHome/ChangeVehicle">
            Change
          </Link>
        </CButton>
      ),
    },
    {
      id: 2,
      sno: 2,
      VA_No: 12070,
      Tripsheet_No: 102501,
      Vehicle_Type: 'contract',
      Vehicle_No: 'TN54AT8417',
      Driver_Name: 'David',
      Driver_No: '8995625773',
      Waiting_At: <span className="badge rounded-pill bg-info">Trip Sheet Creation</span>,
      Screen_Duration: '0 Hrs 07 Mins',
      Overall_Duration: '0 Hrs 55 Mins',
      Action: (
        <CButton className="badge text-white" color="warning">
          <Link className="text-white" to="/ChangeVehicleHome/ChangeVehicle">
            Change
          </Link>
        </CButton>
      ),
    },
  ]
  const customStyles = {
    // rdt_TableHeadRow:{
    //   style:{
    //     color:'red'
    //   }
    // },
    rows: {
      style: {
        minHeight: '2.0rem', // override the row height
      },
    },
    headCells: {
      style: {
        padding: '0',
        margin: '0',
        paddingLeft: '5px', // override the cell padding for head cells
        paddingRight: '5px',
        backgroundColor: '#4d3227',
        color: '#fff',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        height: '2.2rem',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
        fontSize: '0.75rem',
        textAlign: 'center',
      },
    },
  }
  return <DataTable columns={columns} data={data} customStyles={customStyles} />
}

export default ChangeVehicleHome
