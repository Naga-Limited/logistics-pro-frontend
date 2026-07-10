import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CCard,
  CCardBody,
  CCollapse,
  CContainer,
  CTable,
  CTableBody,
  CTableHead,
} from '@coreui/react'
import CustomTable from 'src/components/customComponent/CustomTable'

const NlmtRJSOJourneyInfo = (props) => {
  console.log(props.rjsoJourneyInfo)

  var rjsoTripData = props.rjsoJourneyInfo
  const [rowData, setRowData] = useState([])

  const getClosureSTOData = () => {
    let rowDataList = []

    rjsoTripData.map((data, index) => {
      rowDataList.push({
        sno: index + 1,
        po_no: data.sto_po_no,
        delivery_no: data.sto_delivery_no,
        delivery_type: data.sto_delivery_type == '1' ? 'FGSTO' : 'RMSTO',
        from_location: data.from_location,
        to_location: data.to_location,
        delivery_qty: data.sto_delivery_quantity,
        delivery_freight: data.freight_amount,
        delivered_time: data.delivered_date_time,
        invoice_copy: index + 1,
        driver_name: data.driver_name,
        opening_km: data.opening_km,
        closing_km: data.closing_km,
      })
    })
    setRowData(rowDataList)
  }

  useEffect(() => {
    getClosureSTOData()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'PO No',
      selector: (row) => row.po_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Delivery No',
      selector: (row) => row.delivery_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Type',
      selector: (row) => row.delivery_type,
      sortable: true,
      center: true,
    },
    {
      name: 'From',
      selector: (row) => row.from_location,
      sortable: true,
      center: true,
    },
    {
      name: 'To',
      selector: (row) => row.to_location,
      // sortable: true,
      center: true,
    },
    {
      name: 'Delivery Qty',
      selector: (row) => row.delivery_qty,
      // sortable: true,
      center: true,
    },
    {
      name: 'Freight Amount',
      selector: (row) => row.delivery_freight,
      // sortable: true,
      center: true,
    },
    {
      name: 'Delivered Time',
      selector: (row) => row.delivered_time,
      // sortable: true,
      center: true,
    },
    {
      name: 'Invoice',
      selector: (row) => row.invoice_copy,
      center: true,
      sortable: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.driver_name,
      // sortable: true,
      center: true,
    },
    {
      name: 'Opening KM',
      selector: (row) => row.opening_km,
      // sortable: true,
      center: true,
    },
    {
      name: 'Closing KM',
      selector: (row) => row.closing_km,
      // sortable: true,
      center: true,
    },
  ]

  return (
    <>
      <div>
        {/* <h3>{props.title} </h3> */}
        {props.rjsoJourneyInfo.length > 0 && (
          <>
            <CContainer className="mt-2">
              <CustomTable
                columns={columns}
                data={rowData}
                // title={props.title}
                showSearchFilter={true}
              />
            </CContainer>
          </>
        )}
      </div>
    </>
  )
}
NlmtRJSOJourneyInfo.propTypes = {
  rjsoJourneyInfo: PropTypes.array.isRequired,
  title: PropTypes.string,
}

NlmtRJSOJourneyInfo.defaultProps = {
  title: '',
}
export default NlmtRJSOJourneyInfo
