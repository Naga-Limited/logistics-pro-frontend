import {
  CCol,
  CRow,
  CContainer,
  CCard,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CTableHeaderCell,
  CInputGroupText,
  CInputGroup,
  CTableDataCell,
  CTableBody,
  CTableRow,
  CTable,
  CTableHead,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'

const NlmtShipmentDeliveryInfo = ({ all_delivery_data, delivery_id }) => {
  console.log(all_delivery_data)
  console.log(delivery_id)

  /* Date Format Change : yyyy-mm-dd to dd-mm-yy */
  const formatDate = (input) => {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2]

    return day + '-' + month + '-' + year
  }

  var all_del_nos = []

  all_del_nos.push(delivery_id)
  console.log(all_del_nos)

  const obj = Object.entries(all_delivery_data)
  var del_line_items = []
  var delivery_orders_array = {}

  let filtered_data = all_delivery_data.filter((c, index) => {
    if (all_del_nos.includes(c.delivery_no)) {
      return true
    } else {
      all_del_nos.push(c.delivery_no)
    }
  })

  const data = filtered_data[0]
  console.log(data)

  let lineItem = data.line_item_details

  Object.keys(lineItem).forEach(function (key) {
    delivery_orders_array['line_item_number'] = lineItem[key].POSNR
    delivery_orders_array['line_item_name'] = lineItem[key].ARKTX

    delivery_orders_array['delivery_qty_bag'] = lineItem[key].DEL_QTY_BAG
    delivery_orders_array['delivery_qty_mts'] = lineItem[key].DEL_QTY_MTS
    // delivery_orders_array['delivery_qty_mts'] = lineItem[key].DEL_NET_MTS
    delivery_orders_array['status'] = lineItem[key].STATUS

    del_line_items.push({
      LineItemNumber: delivery_orders_array['line_item_number'],
      LineItemName: delivery_orders_array['line_item_name'],
      LineItemQtyInBags: delivery_orders_array['delivery_qty_bag'],
      LineItemQtyInMTS: delivery_orders_array['delivery_qty_mts'],
      Status: delivery_orders_array['status'],
    })
  })
  console.log(del_line_items)

  return (
    <>
      {/* {!fetch && <SmallLoader />}
      {fetch && ( */}
      <CContainer>
        <CContainer>
          <CRow>
            <CCol xs>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '35%',
                  }}
                >
                  Sale Order Number
                </CInputGroupText>
                <CFormInput readOnly value={data.sale_order_info.SaleOrderNumber} />
              </CInputGroup>
            </CCol>

            <CCol xs>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '35%',
                  }}
                >
                  Delivery Order Number
                </CInputGroupText>
                <CFormInput readOnly value={data.delivery_no} />
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow>
            <CCol xs>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '35%',
                  }}
                >
                  Sale Order Date
                </CInputGroupText>
                <CFormInput readOnly value={formatDate(data.sale_order_info.SaleOrderDate)} />
              </CInputGroup>
            </CCol>

            <CCol xs>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '35%',
                  }}
                >
                  Delivery Order Date
                </CInputGroupText>
                <CFormInput readOnly value={formatDate(data.delivery_date)} />
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol xs>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '35%',
                  }}
                >
                  Quantity in MTS
                </CInputGroupText>
                <CFormInput readOnly value={data.sale_order_info.SaleOrderQty} />
              </CInputGroup>
            </CCol>

            <CCol xs>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '35%',
                  }}
                >
                  Quantity in MTS
                </CInputGroupText>
                <CFormInput readOnly value={data.delivery_qty} />
                {/* <CFormInput readOnly value={data.delivery_net_qty} /> */}
              </CInputGroup>
            </CCol>
          </CRow>
        </CContainer>

        <CContainer className="p-3">
          <CRow>
            <CCol xs={12}>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '35%',
                  }}
                >
                  Customer Name
                </CInputGroupText>
                <CFormInput readOnly value={data.customer_info.CustomerName} />
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12}>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '35%',
                  }}
                >
                  Customer Type
                </CInputGroupText>
                <CFormInput readOnly value={data.customer_info.CustomerType} />
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12}>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '35%',
                  }}
                >
                  Customer Code
                </CInputGroupText>
                <CFormInput readOnly value={data.customer_info.CustomerCode} />
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12}>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '35%',
                  }}
                >
                  Customer City
                </CInputGroupText>
                <CFormInput readOnly value={data.customer_info.CustomerCity} />
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12}>
              <CInputGroup>
                <CInputGroupText
                  style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '35%',
                  }}
                >
                  Truck Route
                </CInputGroupText>
                <CFormInput readOnly value={data.customer_info.CustomerRoute} />
              </CInputGroup>
            </CCol>
          </CRow>
        </CContainer>
        <CContainer className="p-3">
          <CRow>
            <CCol xs={12}>
              <CTable style={{ height: '20vh' }}>
                <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                  <CTableRow>
                    <CTableHeaderCell scope="col" style={{ color: 'white', width: '15%' }}>
                      S.No
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                      Line Item Description
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                      Quantity in Bags
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                      Quantity in MTS
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {del_line_items.map((val, index) => {
                    if (val.Status == '1') {
                      return (
                        <>
                          <CTableRow style={{ background: '#ebc999' }}>
                            <CTableDataCell style={{ width: '15%' }}>
                              {val.LineItemNumber}
                            </CTableDataCell>
                            <CTableDataCell>{val.LineItemName}</CTableDataCell>
                            <CTableDataCell>{val.LineItemQtyInBags}</CTableDataCell>
                            <CTableDataCell>{val.LineItemQtyInMTS}</CTableDataCell>
                          </CTableRow>
                        </>
                      )
                    }
                  })}
                </CTableBody>
              </CTable>
            </CCol>
          </CRow>
        </CContainer>
      </CContainer>
    </>
  )
}

export default NlmtShipmentDeliveryInfo
