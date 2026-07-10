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

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const CustomerCreationApprovalHome = () => {
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [fetch, setFetch] = useState(false)

  const [documentSrc, setDocumentSrc] = useState('')
  let viewData
  let tableData = []

/*================== User Location Fetch ======================*/
const user_info_json = localStorage.getItem('user_info')
const user_info = JSON.parse(user_info_json)
const user_locations = []

/* Get User Locations From Local Storage */
user_info.location_info.map((data, index) => {
  user_locations.push(data.id)
})

// console.log(user_locations)
/*================== User Location Fetch ======================*/
/* ==================== Access Part Start ========================*/
const [screenAccess, setScreenAccess] = useState(false)
let page_no = LogisticsProScreenNumberConstants.RJCustomerModule.Customer_Creation_Approval

useEffect(()=>{

if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
  console.log('screen-access-allowed')
  setScreenAccess(true)
} else{
  console.log('screen-access-not-allowed')
  setScreenAccess(false)
}

},[])
/* ==================== Access Part End ========================*/




  //section for handling view model for each model

  useEffect(() => {
    CustomerCreationService.getCustomerCreationData().then((res) => {
      // viewData = response.data.data
      tableData = res.data.data
      console.log(tableData)
      console.log(viewData);
      let rowDataList = []
      const filterData = tableData.filter((data) => data.customer_status == 1)
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
          Waiting_At: <span className="badge rounded-pill bg-info">Customer Creation</span>,
          Action: (
            <CButton className="badge text-white" color="warning">
              <Link
                className="text-white"
                to={`RJcustomerCreationApproval/${data.customer_id}`}>
                RJ Customer Approval
              </Link>
            </CButton>
          ),
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
    {
      name: 'Current Status',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
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
         {screenAccess ? (
          <>
            <CCard>
              {/* <CRow className="mt-1 mb-1">
                  <CCol
                    className="offset-md-9 d-md-flex justify-content-end" xs={12} sm={12} md={3}
                    // style={{ display: 'flex', justifyContent: 'end' }}
                  >
                      <Link className="text-white" to="/RJcustomerCreationApprovalHome/RJcustomerCreationConfrimationUpload">
                      <CButton size="md" color="warning" className="px-3 text-white" type="button">
                        <span className="float-start">
                          <i className="" aria-hidden="true"></i> &nbsp;RJ Customer List
                        </span>
                      </CButton>
                    </Link>
                  </CCol>
                </CRow> */}
              <CContainer className="mt-1">
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
          </>) : (<AccessDeniedComponent />)}
    </>
  )}
  </>
  )
}

export default CustomerCreationApprovalHome
