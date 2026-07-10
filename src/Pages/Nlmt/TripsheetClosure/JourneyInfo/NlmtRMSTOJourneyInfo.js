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
import LocationApi from 'src/Service/SubMaster/LocationApi'

const NlmtRMSTOJourneyInfo = (props) => {
  const [plantMasterData, setPlantMasterData] = useState([])
  const [locationMasterData, setLocationMasterData] = useState([])
  useEffect(() => {
    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
      console.log(response.data.data,'plantMasterData')
      setPlantMasterData(response.data.data)
    })

    /* section for getting Plant Master List For Location Name Display from database */
    LocationApi.getLocation().then((response) => {
      console.log(response.data.data,'locationMasterData')
      setLocationMasterData(response.data.data)
    })
  }, [])

  const location_name = (code) => {
    let plant_name = ''

    // plantMasterData.map((val, key) => {
    //   if (val.definition_list_code == code) {
    //     plant_name = val.definition_list_name
    //   }
    // })

    locationMasterData.map((val, key) => {
      if (val.location_code == code) {
        plant_name = val.location
      }
    })

    return plant_name
  }

  console.log(props.rmstoJourneyInfo)

  var stoTripData = props.rmstoJourneyInfo
  const [rowData, setRowData] = useState([])

  const getClosureSTOData = () => {
    let rowDataList = []

    stoTripData.map((data, index) => {
      if((data.sto_delivery_type == '1' || data.sto_delivery_type == '2')){
        if (data.trip_driver_id) {
          if(data.sto_delivery_no){
            rowDataList.push({
              sno: index + 1,
              po_no: data.sto_po_no,
              delivery_no: (
                <CNavLink style={{'color':'blue'}} href={`${data.pod_copy}`} target={'_blank'}>
                  <b><u>{data.sto_delivery_no}</u></b>
                </CNavLink >
              ),
              delivery_type: data.sto_delivery_type == '1' ? 'FGSTO' : 'RMSTO',
              from_location: location_name(data.from_location)
                ? location_name(data.from_location)
                : 'Loading...',
              to_location: location_name(data.to_location)
                ? location_name(data.to_location)
                : 'Loading...',
              delivery_qty: data.sto_delivery_quantity,
              delivery_freight: data.freight_amount,
              delivered_time: data.delivered_date_time,
              driver_name: data.driver_name,
              opening_km: data.opening_km,
              closing_km: data.closing_km,
            })
          }
        } else {
          rowDataList.push({
            sno: index + 1,
            po_no: data.sto_po_no,
            delivery_no: (
              <CNavLink style={{'color':'blue'}} href={`${data.pod_copy}`} target={'_blank'}>
                <b><u>{data.sto_delivery_no}</u></b>
              </CNavLink >
            ),
            delivery_type: data.sto_delivery_type == '1' ? 'FGSTO' : 'RMSTO',
            from_location: location_name(data.from_location)
              ? location_name(data.from_location)
              : 'Loading...',
            to_location: location_name(data.to_location)
              ? location_name(data.to_location)
              : 'Loading...',
            delivery_qty: data.sto_delivery_quantity,
            delivery_freight: data.freight_amount,
            delivered_time: data.delivered_date_time,
          })
        }
      }
    })
    setRowData(rowDataList)
  }

  useEffect(() => {
    getClosureSTOData()
  }, [plantMasterData.length > 0, locationMasterData.length > 0])

  const columns_hire = [
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
      // sortable: true,
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
      // sortable: true,
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
  ]

  return (
    <>
      <div>
        {/* <h3>{props.title} </h3> */}
        {props.rmstoJourneyInfo.length > 0 && (
          <>
            <CContainer className="mt-2">
              <CustomTable
                columns={stoTripData[0].trip_driver_id ? columns_hire : columns}
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
NlmtRMSTOJourneyInfo.propTypes = {
  rmstoJourneyInfo: PropTypes.array.isRequired,
  title: PropTypes.string,
}

NlmtRMSTOJourneyInfo.defaultProps = {
  title: '',
}
export default NlmtRMSTOJourneyInfo
