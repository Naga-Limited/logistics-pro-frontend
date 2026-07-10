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
import CustomTable from 'src/components/customComponent/CustomTable' 
import Loader from 'src/components/Loader'
import 'react-toastify/dist/ReactToastify.css' 
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import NLFSVehicleMsterApi from 'src/Service/NLFS/Master/NLFSVehicleMasterApi'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'

const NLFSVehicleMasterTableData = () => {
  const [RCCopyFront, setRCCopyFront] = useState(false)
  const [RCCopyBack, setRCCopyBack] = useState(false)
  const [InsuranceCopyBack, setInsuranceCopyBack] = useState(false)
  const [InsuranceCopyFront, setInsuranceCopyFront] = useState(false)
  const REQ = () => <span className="text-danger"> * </span>
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)

  const [documentSrc, setDocumentSrc] = useState('')
  let viewData

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
    let page_no_for_view_access = LogisticsProScreenNumberConstants.NLFSDieselIntentModule.Vehicle_Master_View 

    useEffect(()=>{
  
      if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no_for_view_access,user_info.page_permissions)){
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
    let fileName='NLFS_Vehicle_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  useEffect(() => {
    NLFSVehicleMsterApi.getNLFSVehicles().then((response) => {
      viewData = response.data.data
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,          
          vehicle_Number: data.vehicle_no,
          Vehicle_Division: data.vehicle_division_info.short_name,
          Vehicle_Variety: data.vehicle_variety_info ? data.vehicle_variety_info.vehicle_variety : '-',
          Vehicle_Capacity: data.vehicle_capacity_info.capacity + '-TON',
          Vehicle_Model: data.vehicle_model_info.dropdown_list_name,
          Vehicle_FuelType: data.vehicle_fuel_info.dropdown_list_name,
          Vehicle_FuelTankCapacity: data.vehicle_fuel_tank_capacity_info.dropdown_list_name,
          Vehicle_Username: data.vehicle_user_info.username,
          Vehicle_UserEmpCode: data.vehicle_user_info.empid,
          Status: data.status == 1 ? '✔️' : '❌',
          Creation_Time: data.created_at_format,
          // Action: (
          //   <div className="d-flex justify-content-space-between">
          //     <CButton
          //       size="sm"
          //       color="danger"
          //       shape="rounded"
          //       id={data.id}
          //       onClick={() => {
          //         changeVehicleStatus(data.vehicle_id)
          //       }}
          //       className="m-1"
          //     >
          //       {/* Delete */}
          //       <i className="fa fa-trash" aria-hidden="true"></i>
          //     </CButton>

          //     <Link to={data.status == 1 ? `NLFSVehicleMaster/${data.vehicle_id}` : ''}>
          //       <CButton
          //         disabled={data.status == 1 ? false : true}
          //         size="sm"
          //         color="secondary"
          //         shape="rounded"
          //         id={data.vehicle_id}
          //         className="m-1"
          //         type="button"
          //       >
          //         {/* Edit */}
          //         <i className="fa fa-edit" aria-hidden="true"></i>
          //       </CButton>
          //     </Link>
          //   </div>
          // ),
        })
      })
      setRowData(rowDataList)
      setPending(false)
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
      name: 'Creation Date',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Number',
      selector: (row) => row.vehicle_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Division',
      selector: (row) => row.Vehicle_Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Capacity',
      selector: (row) => row.Vehicle_Capacity,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Veh. Variety',
      selector: (row) => row.Vehicle_Variety,
      sortable: true,
      center: true,
    },
    {
      name: 'Veh. Modal',
      selector: (row) => row.Vehicle_Model,
      sortable: true,
      center: true,
    },
     
    {
      name: 'Status',
      selector: (row) => row.Status,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Action',
    //   selector: (row) => row.Action,
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
              <CRow className="mt-1 mb-1">
                <CCol
                  className="offset-md-6"
                  xs={15}
                  sm={15}
                  md={6}
                  style={{ display: 'flex', justifyContent: 'end' }}
                >
                  {/* <Link className="text-white" to="/NLFSVehicleMaster">
                    <CButton size="sm" color="warning" className="px-3 text-white" type="button">
                      NEW
                    </CButton>
                  </Link> */}
                  <CButton
                    size="sm"
                    color="warning"
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
                    pending={pending}
                  />
                </CContainer>

                {/*Rc copy front model*/}
                <CModal visible={RCCopyFront} onClose={() => setRCCopyFront(false)}>
                  <CModalHeader>
                    <CModalTitle>RC Copy Front</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                  {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setRCCopyFront(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/*Rc copy front model*/}
                {/*Rc copy back model*/}
                <CModal visible={RCCopyBack} onClose={() => setRCCopyBack(false)}>
                  <CModalHeader>
                    <CModalTitle>RC Copy Back</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                  {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }

                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setRCCopyBack(false)}>
                      Close
                    </CButton>
                    {/* <CButton color="primary">Save changes</CButton> */}
                  </CModalFooter>
                </CModal>
                {/*Rc copy back model*/}

                {/*Insurance copy front*/}
                <CModal visible={InsuranceCopyFront} onClose={() => setInsuranceCopyFront(false)}>
                  <CModalHeader>
                    <CModalTitle>Insurance Copy Front</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                  {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setInsuranceCopyFront(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/*Insurance copy front*/}
                {/*Insurance copy back*/}
                <CModal visible={InsuranceCopyBack} onClose={() => setInsuranceCopyBack(false)}>
                  <CModalHeader>
                    <CModalTitle>Insurance Copy Back</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                  {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setInsuranceCopyBack(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/*Insurance copy back*/}
              </CCard>
            </>
            ) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default NLFSVehicleMasterTableData
