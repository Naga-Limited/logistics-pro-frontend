import { CButton, CCard, CContainer } from '@coreui/react'
import { Link, useParams } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import { id } from 'date-fns/locale'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'
const SingleTripDetails = () => {

  const { id } = useParams()
  const [rowData, setRowData] = useState([])
  let tableData = []
  const ACTION = {
    DI_CREATED: 1,
    DI_CONFIRMED: 2,
    DI_APPROVAL: 2,
  }
  const loadVehicleReadyToTrip = () => {
    DieselIntentCreationService.singleAdditionalDieselDetailsList(id).then((res) => {
      tableData = res.data.data
      console.log(tableData)
      let rowDataList = []
      tableData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          vendor_code: data.vendor_code,
          no_of_ltrs: data.no_of_ltrs,
          total_amount: data.total_amount,
          invoice_no: data.invoice_no,
          rate_of_ltrs: data.rate_of_ltrs,
          diesel_type: data.diesel_type,
          diesel_status : data.diesel_status,
          diesel_vendor_sap_invoice_no: data.diesel_vendor_sap_invoice_no,
          created_at: data.created_at,
          diesel_status:(
            <span className="badge rounded-pill bg-info">
              {data.diesel_status == ACTION.DI_CREATED
                ? 'DI Creation'
                : data.diesel_status == ACTION.DI_CONFIRMED
                ? 'DI Confirmation'
                : 'DI Approval'}
            </span>
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
      name: 'Creation Date',
      selector: (row) => row.created_at,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Name',
      selector: (row) => row.vendor_code =='225831'?'RNS_Fuel_Station':"RS Petroliam",
      sortable: true,
      center: true,
    },
    {
      name: 'Invoice No',
      selector: (row) => row.invoice_no|| '-',
      sortable: true,
      center: true,
    },
    {
      name: 'No.of.Liters',
      selector: (row) => row.no_of_ltrs|| '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Rate Per Liters',
      selector: (row) => row.rate_of_ltrs|| '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Total Amount',
      selector: (row) => row.total_amount || '-',
      center: true,
    },
    {
      name: 'SAP No',
      selector: (row) => row.diesel_vendor_sap_invoice_no || '-',
      center: true,
    },
    {
      name: 'Diesel Type',
      selector: (row) => row.diesel_type==0 ? 'Home Diesel':'Addtional Diesel',
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.diesel_status,
      center: true,
    },
  ]
  return (
    <>
        <CCard className="mt-4">
          <CContainer className="mt-1">
            <CustomTable
              columns={columns}
              data={rowData}
              fieldName={'Diesel_intent'}
              showSearchFilter={true}
            />
            <hr></hr>
          </CContainer>
        </CCard>
    </>
  )
}

export default SingleTripDetails
