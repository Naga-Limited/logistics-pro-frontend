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
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import { Link } from 'react-router-dom'

const OthersJourneyInfo = (props) => {
  const [plantMasterData, setPlantMasterData] = useState([])
  useEffect(() => {
    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
      console.log(response.data.data)
      setPlantMasterData(response.data.data)
    })
  }, [])

  const location_name = (code) => {
    let plant_name = ''

    plantMasterData.map((val, key) => {
      if (val.definition_list_code == code) {
        plant_name = val.definition_list_name
      }
    })

    return plant_name
  }

  console.log(props.othersJourneyInfo)

  var othersTripData = props.othersJourneyInfo
  var allTripData = props.tripInfo
  const [rowData, setRowData] = useState([])

  const getClosureSTOData = () => {
    let rowDataList = []

    othersTripData.map((data, index) => {
      if (data.trip_driver_id) {
        if(data.sto_delivery_no){
          rowDataList.push({
            sno: index + 1,
            po_no: data.sto_po_no ? data.sto_po_no : '-',
            doc_no: data.sto_delivery_no,
            doc_type: data.others_process_type,
            doc_date: data.others_doc_date,
            from_location_name: data.others_from_plant_name ? data.others_from_plant_name : '-',
            from_location_code: data.from_location ? data.from_location : '-',
            to_location_name: data.others_to_plant_name ? data.others_to_plant_name : '-',
            to_location_code: data.to_location ? data.to_location : '-',
            vendor_name: data.others_vendor_name ? data.others_vendor_name : '-',
            vendor_code: data.others_vendor_code ? data.others_vendor_code : '-',
            delivery_qty: data.sto_delivery_quantity,
            delivery_freight: data.freight_amount,
            driver_name: allTripData.driver_name ? allTripData.driver_name : '-',
            opening_km: data.opening_km ? data.opening_km : '-',
            closing_km: data.closing_km ? data.closing_km : '-',
          })
        }
      } else {
        rowDataList.push({
          sno: index + 1,
          po_no: data.sto_po_no ? data.sto_po_no : '-',
          doc_no: data.sto_delivery_no,
          doc_type: data.others_process_type,
          doc_date: data.others_doc_date,
          from_location_name: data.others_from_plant_name ? data.others_from_plant_name : '-',
          from_location_code: data.from_location ? data.from_location : '-',
          to_location_name: data.others_to_plant_name ? data.others_to_plant_name : '-',
          to_location_code: data.to_location ? data.to_location : '-',
          vendor_name: data.others_vendor_name ? data.others_vendor_name : '-',
          vendor_code: data.others_vendor_code ? data.others_vendor_code : '-',
          delivery_qty: data.sto_delivery_quantity,
          delivery_freight: data.freight_amount,
        })
      }
    })
    setRowData(rowDataList)
  }

  useEffect(() => {
    getClosureSTOData()
  }, [plantMasterData.length > 0])

  const columns_hire = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Doc. No',
      selector: (row) => row.doc_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Doc. Type',
      selector: (row) => row.doc_type,
      sortable: true,
      center: true,
    },
    {
      name: 'Doc. Date',
      selector: (row) => row.doc_date,
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
      name: 'From Plant',
      selector: (row) => row.from_location_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Plant Code',
      selector: (row) => row.from_location_code,
      sortable: true,
      center: true,
    },
    {
      name: 'To Plant',
      selector: (row) => row.to_location_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Plant Code',
      selector: (row) => row.to_location_code,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Name',
      selector: (row) => row.vendor_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Code',
      selector: (row) => row.vendor_code,
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
  ]

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Doc. No',
      selector: (row) => row.doc_no,
      sortable: true,
      center: true,
    },
    {
      name: 'Doc. Type',
      selector: (row) => row.doc_type,
      sortable: true,
      center: true,
    },
    {
      name: 'Doc. Date',
      selector: (row) => row.doc_date,
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
      name: 'From Plant',
      selector: (row) => row.from_location_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Plant Code',
      selector: (row) => row.from_location_code,
      sortable: true,
      center: true,
    },
    {
      name: 'To Plant',
      selector: (row) => row.to_location_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Plant Code',
      selector: (row) => row.to_location_code,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Name',
      selector: (row) => row.vendor_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Code',
      selector: (row) => row.vendor_code,
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
        {props.othersJourneyInfo.length > 0 && (
          <>
            <CContainer className="mt-2">
              <CustomTable
                columns={othersTripData[0].trip_driver_id ? columns : columns_hire}
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
OthersJourneyInfo.propTypes = {
  othersJourneyInfo: PropTypes.array.isRequired,
  tripInfo: PropTypes.object.isRequired,
  title: PropTypes.string,
}

OthersJourneyInfo.defaultProps = {
  title: '',
}
export default OthersJourneyInfo
