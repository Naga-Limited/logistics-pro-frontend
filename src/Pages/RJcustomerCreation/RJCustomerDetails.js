import {
    CButton,
    CCard,
    CContainer,
    CCol,
    CRow,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CCardImage,
    CModalFooter,
  } from '@coreui/react'
  import React, { useEffect, useState } from 'react'
  import { Link } from 'react-router-dom'
  import CustomTable from 'src/components/customComponent/CustomTable'
  import DriverMasterService from 'src/Service/Master/DriverMasterService'
  import { toast } from 'react-toastify'
  import 'react-toastify/dist/ReactToastify.css'
  import CustomSpanButton from 'src/components/customComponent/CustomSpanButton1'
  import CustomerCreationService from 'src/Service/CustomerCreation/CustomerCreationService'
  import Loader from 'src/components/Loader'

  const RJCustomerDetails = () => {
    const [rowData, setRowData] = useState([])
    const [mount, setMount] = useState(1)
    const [fetch, setFetch] = useState(false)

    const [documentSrc, setDocumentSrc] = useState('')
    let viewData
    let tableData



    //section for handling view model for each model

    useEffect(() => {
      CustomerCreationService.getCustomerCreationData().then((res) => {
        // viewData = response.data.data
        tableData = res.data.data
        console.log(tableData)
        console.log(viewData);
        let rowDataList = []
        const filterData = tableData.filter((data) => data.customer_status == 3)
        console.log(filterData)
        filterData.map((data, index) => {
          // tableData.map((data, index) => {
            console.log(data.customer_status)
          rowDataList.push({
            sno: index + 1,
            Creation_Date: data.created_at,
            customer_name: data.customer_name,
            customer_PAN_card_number: data.customer_PAN_card_number,
            customer_Aadhar_card_number: data.customer_Aadhar_card_number,
            customer_mobile_number: data.customer_mobile_number,
            customer_street_name: data.customer_street_name,
            customer_area: data.customer_area,
            customer_city: data.customer_city,
            customer_state: data.customer_state,
            customer_district: data.customer_district,
            customer_postal_code: data.customer_postal_code,
            customer_code: data.customer_code,
            // Waiting_At: (
            //   <span className="badge rounded-pill bg-info">
            //     {data.customer_status == ACTION.GATE_IN
            //       ? 'Vehicle Inspection'
            //       : data.customer_status == ACTION.WAIT_OUTSIDE
            //       ? 'Waiting Outside'
            //       : 'Gate Out'}
            //   </span>
            // ),
          })
        })
        setRowData(rowDataList)
        setFetch(true)

      })
    }, [mount])

    // ============ Column Header Data =======

    const columns = [
      {
        name: 'S.No',
        selector: (row) => row.sno,
        sortable: true,
        center: true,
      },
      {
        name: 'Customer Code',
        selector: (row) => row.customer_code,
        sortable: true,
        center: true,
      },
      {
        name: 'Customer Name',
        selector: (row) => row.customer_name,
        sortable: true,
        center: true,
      },
      {
        name: 'PAN Number',
        selector: (row) => row.customer_PAN_card_number,
        sortable: true,
        center: true,
      },
      {
        name: 'Aadhar Number',
        selector: (row) => row.customer_Aadhar_card_number,
        sortable: true,
        center: true,
      },
      {
        name: 'Mobile Number',
        selector: (row) => row.customer_mobile_number,
        sortable: true,
        center: true,
      },
      // {
      //   name: 'Street Name',
      //   selector: (row) => row.customer_street_name,
      //   sortable: true,
      //   center: true,
      // },
      // {
      //   name: 'Area',
      //   selector: (row) => row.customer_area,
      //   sortable: true,
      //   center: true,
      // },
      {
        name: 'City',
        selector: (row) => row.customer_city,
        sortable: true,
        center: true,
      },
      // {
      //   name: 'District',
      //   selector: (row) => row.customer_district,
      //   sortable: true,
      //   center: true,
      // },
      // {
      //   name: 'State',
      //   selector: (row) => row.customer_state,
      //   sortable: true,
      //   center: true,
      // },
      // {
      //   name: ' Postal code',
      //   selector: (row) => row.customer_postal_code,
      //   sortable: true,
      //   center: true,
      // },

    ]

    //============ column header data=========

    return (
      <>
      {!fetch && <Loader />}
      {fetch && (
        <>
      <CCard>
        <CContainer className="mt-1">
        <CRow className="mt-1 mb-1">
          <CCol
            className="offset-md-9 d-md-flex justify-content-end" xs={12} sm={12} md={3}
            // style={{ display: 'flex', justifyContent: 'end' }}
          >
            <Link className="text-white" to="/RJcustomerCreationHome/RJcustomerCreation">
              <CButton size="md" color="warning" className="px-3 text-white" type="button">
                <span className="float-start">
                  <i className="" aria-hidden="true"></i> &nbsp;New
                </span>
              </CButton>
            </Link>
          </CCol>
        </CRow>
            <CustomTable
            columns={columns}
            data={rowData}
            fieldName={'customer_name'}
            showSearchFilter={true}
          />
          <hr></hr>
        </CContainer>
        {/*License copy front model*/}

        {/*Driver Photo model*/}
      </CCard>
      </>
      )}
      </>
    )
  }

  export default RJCustomerDetails
