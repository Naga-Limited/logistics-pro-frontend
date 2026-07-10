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
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import CustomTable from 'src/components/customComponent/CustomTable'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CustomSpanButton from 'src/components/customComponent/CustomSpanButton3'
import DepoContractorMasterService from 'src/Service/Depo/Master/DepoContractorMasterService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from '../../CommonMethods/CommonMethods'

const DepoContractorMasterTable = () => {

  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [documentSrc, setDocumentSrc] = useState('')
  const [contractorCopy, setContractorCopy] = useState(false)
  const [locationData, setLocationData] = useState([])
  let viewData

  function changeContractorStatus(id) {
    DepoContractorMasterService.deleteDepoContractor(id).then((res)=>{
      toast.success('Contractor Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
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
let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Contractor_Master

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

  function handleViewDocuments(e, id, type) {
    console.log(id,'iddd')
    if(type == 'CONTRACTOR_PHOTO') {
      let singleContractorInfo = viewData.filter((data) => data.id == id)
      console.log(singleContractorInfo,'singleContractorInfo')
      documentSetup(singleContractorInfo[0])
      setContractorCopy(true)
    }
  }

  useEffect(() => {

    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      console.log(res.data.data,'location data')
      setLocationData(res.data.data)
    })

  }, [])

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Depo_Contractor_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }


  const documentSetup = (info) => {

    console.log(info,'info')
    let user_image = info.contractor_owner_photo
    if(user_image.slice(-1) == '/') {
      setDocumentSrc('https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg')
    } else {
      setDocumentSrc(info.contractor_owner_photo)
    }
  }

  const contractorLocationFinder = (data) => {
    let location = ''
    if(data) {

      let needed_data = locationData.filter((c, index) => {

        if (c.id == data) {
          return true
        }
      })

      location = needed_data[0] ? needed_data[0].location : 'Loading..'

     return location
    }
    return location
  }


  useEffect(()=>{
    DepoContractorMasterService.getDepoContractors().then((response)=>{
      setFetch(true)
      viewData = response.data.data
      console.log(viewData,'contractor_data')
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          Contractor_Location: contractorLocationFinder(data.contractor_location),
          Contractor_Name: data.contractor_name,
          Contractor_Owner_Name: data.contractor_owner_name,
          Contractor_Number: data.contractor_number,
          Contractor_Owner_Photo: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              Id={data.id}
              documentType={'CONTRACTOR_PHOTO'}
            />
          ),
          Status: data.contractor_status === 1 ? '✔️' : '❌',
          Freight_Type: data.freight_type === 1 ? 'Budget' : 'Actual',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color={data.contractor_status === 1 ? "success" : "danger"}
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeContractorStatus(data.id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>

              <Link to={data.contractor_status === 1 ? `DepoContractorMaster/${data.id}` : ''}>
                <CButton
                  disabled={data.contractor_status === 1 ? false : true}
                  size="sm"
                  color={data.contractor_status === 1 ? "success" : "secondary"}
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
  },[locationData,mount])

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
      selector: (row) => row.Contractor_Location,
      sortable: true,
      center: true,
    },
    {
      name: 'Contractor Name',
      selector: (row) => row.Contractor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Contractor Number',
      selector: (row) => row.Contractor_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'Contractor Owner Name',
      selector: (row) => row.Contractor_Owner_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Contractor Owner Photo',
      selector: (row) => row.Contractor_Owner_Photo,
      sortable: true,
      center: true,
    },
    {
      name: 'Freight Type',
      selector: (row) => row.Freight_Type,
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
                  <Link className="text-white" to="/DepoContractorMaster">
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

                {/*Contractor Copy model*/}
                <CModal visible={contractorCopy} backdrop="static" onClose={() => setContractorCopy(false)}>
                  <CModalHeader>
                    <CModalTitle>Contractor Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                  {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setContractorCopy(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/*Contractor Copy model*/}
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default DepoContractorMasterTable
