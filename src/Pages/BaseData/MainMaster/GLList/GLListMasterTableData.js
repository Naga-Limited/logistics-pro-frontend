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
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import CustomTable from 'src/components/customComponent/CustomTable'
import GLListMasterService from 'src/Service/Master/GLListMasterService'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const GLListMasterTableData = () => {
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const [fetch, setFetch] = useState(false)

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
          let page_no_for_view_access = LogisticsProScreenNumberConstants.MasterAccessModule.GLList_Master_View
          let page_no_for_edit_access = LogisticsProScreenNumberConstants.MasterAccessModule.GLList_Master_Edit
      
          const edit_access = JavascriptInArrayComponent(page_no_for_edit_access,user_info.page_permissions)
        
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

  let viewData

  function changeGLList(id) {
    GLListMasterService.deleteGLlist(id).then((res) => {
      console.log(res)
      toast.success('GL Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='GL_List_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  useEffect(() => {
    GLListMasterService.getGLlist().then((response) => {
      setFetch(true)
      viewData = response.data.data
      console.log(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          gl_description: data.gl_description,
          gl_code: data.gl_code,
          gl_type:data.gltype,
          cost_center: data.cost_center,
          profit_center: data.profit_center,
          amount_type: data.amount_type == 1 ? 'Income' : 'Expense',
          plant: data.plant,
          Status: data.gl_status == 1 ? '✔️' : '❌',
          Action: (
            (user_info && user_info.is_admin == 1) || edit_access ? (
              <div className="d-flex justify-content-space-between">
                <CButton
                  size="sm"
                  color="danger"
                  shape="rounded"
                  id={data.id}
                  onClick={() => {
                    changeGLList(data.gl_list_id)
                  }}
                  className="m-1"
                >
                  {/* Delete */}
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </CButton>
                <Link
                  to={
                    data.gl_status === 1
                      ? `GLListMaster/${data.gl_list_id}`
                      : ''
                  }
                >
                  <CButton
                    size="sm"
                    color="secondary"
                    shape="rounded"
                    disabled={data.gl_status === 1 ? false : true}
                    id={data.id}
                    className="m-1"
                  >
                    {/* Edit */}
                    <i className="fa fa-edit" aria-hidden="true"></i>
                  </CButton>
                </Link>
              </div>
            ) : '-'
          ),
        })
      })
      setRowData(rowDataList)
      setPending(false)
    })
  }, [mount])

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
      name: 'gl description',
      selector: (row) => row.gl_description,
      sortable: true,
      center: true,
    },
    {
      name: 'gl code',
      selector: (row) => row.gl_code,
      sortable: true,
      center: true,
    },
    {
      name: 'cost center',
      selector: (row) => row.cost_center,
      sortable: true,
      center: true,
    },
    {
      name: 'profit center',
      selector: (row) => row.profit_center,
      sortable: true,
      center: true,
    },
    {
      name: 'amount type',
      selector: (row) => row.amount_type,
      sortable: true,
      center: true,
    },
    {
      name: 'plant',
      selector: (row) => row.plant,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      center: true,
      sortable: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  return (
    <>
    {!fetch && <Loader />}
    {fetch && (
      <>
        {screenAccess ? (
          <>
            <CCard className="mt-4">
              <CContainer className="mt-1">
                <CRow className="mt-1 mb-1">
                  <CCol
                    className="offset-md-6"
                    xs={15}
                    sm={15}
                    md={6}
                    style={{ display: 'flex', justifyContent: 'end' }}
                  >
                    {/* <Link className="text-white" to="/GLListMaster">
                      <CButton size="md" color="warning" className="px-3 text-white" type="button">
                        <span className="float-start">
                          <i className="" aria-hidden="true"></i> &nbsp;NEW
                        </span>
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
                  <CustomTable
                    columns={columns}
                    data={rowData}
                    fieldName={'diesel_Vendor_Name'}
                    showSearchFilter={true}
                    pending={pending}
                  />
              </CContainer>
            </CCard>
          </>) : (<AccessDeniedComponent />
        )}
      </>
    )}
    </>
  )
}

export default GLListMasterTableData
