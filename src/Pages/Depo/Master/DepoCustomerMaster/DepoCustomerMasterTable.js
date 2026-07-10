import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CModalHeader,
  CModalTitle,
  CModal,
  CModalFooter,
  CModalBody,
  CCardImage,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import CustomTable from 'src/components/customComponent/CustomTable'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DepoCustomerMasterService from 'src/Service/Depo/Master/DepoCustomerMasterService'
import CustomSpanButton from 'src/components/customComponent/CustomSpanButton3'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from '../../CommonMethods/CommonMethods'

const DepoCustomerMasterTable = () => {

  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [documentSrc, setDocumentSrc] = useState('')
  const [customerCopy, setCustomerCopy] = useState(false)
  let viewData

  function changeCustomerStatus(id) {
    DepoCustomerMasterService.deleteDepoCustomer(id).then((res)=>{
      toast.success('Customer Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  //section for handling view model for each model

  function handleViewDocuments(e, id, type) {

    if(type == 'CUSTOMER_PHOTO') {
      let singleCustomerInfo = viewData.filter((data) => data.id == id)
      console.log(singleCustomerInfo,'singleCustomerInfo')
      documentSetup(singleCustomerInfo[0])
      setCustomerCopy(true)
    }
  }

  const documentSetup = (info) => {

    console.log(info,'info')
    let user_image = info.customer_photo
    if(user_image == null || user_image.slice(-1) == '/') {
      setDocumentSrc('https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg')
    } else {
      setDocumentSrc(info.customer_photo)
    }
  }

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()

  console.log(user_info)

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
const [screenAccess, setScreenAccess] = useState(false)
let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Customer_Master

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

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Depo_Customer_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  useEffect(()=>{
    DepoCustomerMasterService.getDepoCustomers().then((response)=>{
      setFetch(true)
      viewData = response.data.data
      console.log(viewData,'customer_data')
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          Location: data.location_info.location,
          Route_Name: data.route_info.route_name,
          Customer_Name: data.customer_name,
          Customer_Code: data.customer_code,
          Customer_Mobile_Number: data.customer_contact_number,
          Customer_Photo: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              Id={data.id}
              documentType={'CUSTOMER_PHOTO'}
            />
          ),
          Status: data.customer_status === 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color={data.customer_status === 1 ? "success" : "danger"}
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeCustomerStatus(data.id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>

              <Link to={data.customer_status === 1 ? `DepoCustomerMaster/${data.id}` : ''}>
                <CButton
                  disabled={data.customer_status === 1 ? false : true}
                  size="sm"
                  color={data.customer_status === 1 ? "success" : "secondary"}
                  shape="rounded"
                  id={data.id}
                  className="m-1"
                  type="button"
                >
                  {/* Edit */}
                  <i className="fa fa-edit" aria-hidden="true"></i>
                </CButton>
              </Link>
            </div>
          ),
        })
      })
      setRowData(rowDataList)
    })
  },[mount])

  // ============ Column Header Data =======

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation Date',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Depo Location',
      selector: (row) => row.Location,
      sortable: true,
      center: true,
    },
    {
      name: 'Route Name',
      selector: (row) => row.Route_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Name',
      selector: (row) => row.Customer_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Customer Code',
      selector: (row) => row.Customer_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Mobile Number',
      selector: (row) => row.Customer_Mobile_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'Photo',
      selector: (row) => row.Customer_Photo,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  //============ column header data=========

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CRow className="mt-1 mb-1">
                <CCol
                  className="offset-md-6"
                  xs={15}
                  sm={15}
                  md={6}
                  style={{ display: 'flex', justifyContent: 'end' }}
                >
                  <Link className="text-white" to="/DepoCustomerMaster">
                    <CButton size="sm" color="warning" className="px-3 text-white" type="button">
                      NEW
                    </CButton>
                  </Link>
                  <CButton
                    size="sm"
                    color="success"
                    className="px-3 text-white"
                    onClick={(e) => {
                      exportToCSV()
                    }}
                  >
                    EXPORT
                  </CButton>
                </CCol>
              </CRow>
              <CCard>
                <CContainer>
                  <CustomTable
                    columns={columns}
                    data={rowData}
                    fieldName={'vehicle_Number'}
                    showSearchFilter={true}
                  />
                </CContainer>
              </CCard>
              {/*Customer Copy model*/}
              <CModal visible={customerCopy} backdrop="static" onClose={() => setCustomerCopy(false)}>
                  <CModalHeader>
                    <CModalTitle>Customer Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                  {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setCustomerCopy(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/*Customer Copy model*/}
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default DepoCustomerMasterTable
