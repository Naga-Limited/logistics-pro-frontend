import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CCard,
  CCardBody,
  CCollapse,
  CContainer,
  CNavLink,
  CTable,
  CTableBody,
  CTableHead,
} from '@coreui/react'
import CustomTable from 'src/components/customComponent/CustomTable'
import { Link } from 'react-router-dom'
import FCIPlantMasterService from 'src/Service/FCIMovement/FCIPlantMaster/FCIPlantMasterService'

const NlmtFCIJourneyInfo = (props) => {
  const [plantMasterData, setPlantMasterData] = useState([])
  useEffect(() => {
    /* section for getting Plant Master List For Location Name Display from database */
    FCIPlantMasterService.getActiveFCIPlantRequestTableData().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'FCI Plant Data')
      setPlantMasterData(viewData)
    })
  }, [])

  const location_name = (code) => {
    let plant_name = ''

    plantMasterData.map((val, key) => {
      if (val.plant_symbol == code) {
        plant_name = val.plant_name
      }
    })

    return plant_name
  }

  console.log(props.rmstoJourneyInfo,'FCIJourneyInfo')

  var stoTripData = props.rmstoJourneyInfo
  const [rowData, setRowData] = useState([])

  const getClosureSTOData = () => {
    let rowDataList = []

    stoTripData.map((data, index) => {
      if (data.trip_driver_id && data.sto_delivery_type == '4') {
        rowDataList.push({
          sno: index + 1,
          po_no: data.sto_po_no,
          delivery_no: (
            <CNavLink style={{'color':'blue'}} href={`${data.pod_copy}`} target={'_blank'}>
              <b><u>{data.sto_delivery_no}</u></b>
            </CNavLink >
          ),
          delivery_type: 'FCI',
          FCI_Div: data.sto_delivery_division,
          from_location: location_name(data.from_location)
            ? location_name(data.from_location)
            : 'Loading...',
          to_location: data.to_location
            ? data.to_location
            : 'Loading...',
          delivery_qty: data.sto_delivery_quantity,
          delivery_freight: data.freight_amount,
          delivered_time: data.delivered_date_time,
          driver_name: data.driver_name,
          opening_km: data.opening_km,
          closing_km: data.closing_km,
          MIGO_NO: data.rake_migo_no,
          VA_NO: data.rake_va_no,
        })
      }
    })
    setRowData(rowDataList)
  }

  useEffect(() => {
    getClosureSTOData()
  }, [plantMasterData.length > 0])

  const columns_rake = [
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
      name: 'VA No',
      selector: (row) => row.VA_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'MIGO No',
      selector: (row) => row.MIGO_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'Division',
      selector: (row) => row.FCI_Div,
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
      name: 'To Plant',
      selector: (row) => row.to_location,
      sortable: true,
      center: true,
    },
    {
      name: 'Delivery Qty',
      selector: (row) => row.delivery_qty,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Amount',
      selector: (row) => row.delivery_freight,
      sortable: true,
      center: true,
    },
    {
      name: 'Delivered Time',
      selector: (row) => row.delivered_time,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Invoice',
    //   selector: (row) => row.invoice_copy,
    //   center: true,
    //   sortable: true,
    // },
    // {
    //   name: 'Driver Name',
    //   selector: (row) => row.driver_name,
    //   // sortable: true,
    //   center: true,
    // },
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
        {props.rmstoJourneyInfo.length > 0 && (
          <>
            <CContainer className="mt-2">
              <CustomTable
                columns={columns_rake}
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
NlmtFCIJourneyInfo.propTypes = {
  rmstoJourneyInfo: PropTypes.array.isRequired,
  title: PropTypes.string,
}

NlmtFCIJourneyInfo.defaultProps = {
  title: '',
}
export default NlmtFCIJourneyInfo
