import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CTooltip,
  CBadge,
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
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from '../../CommonMethods/CommonMethods'
import NlmtRouteMasterService from 'src/Service/Nlmt/Masters/NlmtRouteMasterService'
import CustomSpanButton from 'src/components/customComponent/CustomSpanButton'

const NlmtRouteMasterTable = () => {

  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [rawApiData, setRawApiData] = useState([])

  const [approvalModal, setApprovalModal] = useState(false)
  const [documentSrc, setDocumentSrc] = useState('')

  function changeRouteStatus(id) {
    NlmtRouteMasterService.deleteNlmtRoute(id).then((res) => {
      toast.success('Route Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  function handleViewDocuments(e, directSrc, type) {
    console.log('handleViewDocuments trigger:', { type, directSrc });
    if (type === 'APPROVAL' && directSrc) {
      console.log('Setting doc src to:', directSrc);
      setDocumentSrc(directSrc)
      setApprovalModal(true)
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

  /*================== Helpers ======================*/
  const formatDateDDMMYY = (dateStr) => {
    if (!dateStr) return '-'
    // Handle strings like "2026-05-12 18:00:00", "2026-05-12T00:00:00", or "2026-05-12"
    const pureDate = dateStr.replace('T', ' ').split(' ')[0]
    const parts = pureDate.split('-')
    if (parts.length !== 3) return dateStr
    const [year, month, day] = parts
    const shortYear = year.length === 4 ? year.slice(2) : year
    return `${day}-${month}-${shortYear}`
  }

  const isOpenEnded = (dateStr) => {
    return dateStr && (dateStr.startsWith('9999') || dateStr === '9999-12-31')
  }

  /*================== Export ======================*/
  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'Nlmt_Route_Master_Report_' + dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    // Filter out the react nodes before excel exporting
    const exportData = rowData.map(({ Action, Approval_Attachment, End_Date, ...rest }) => {
      const rawRow = rawApiData.find(d => d.id === rest.sno_id)
      return {
        ...rest,
        End_Date: rawRow ? rawRow.end_date : '-',
        Approval_Attachment: rawRow && rawRow.approval_attachment ? 'Yes' : 'None'
      }
    })
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  useEffect(() => {
    NlmtRouteMasterService.getNlmtRoutes().then((response) => {
      const fetched = response.data.data
      setRawApiData(fetched)
      setFetch(true)
      console.log(fetched, 'route_data')
      let rowDataList = []
      fetched.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          sno_id: data.id, // kept internal for export lookup
          Creation_Date: formatDateDDMMYY(data.created_at),
          Route_Name: data.route_name,
          Freight_Rate: data.freight_rate,
          Start_Date: formatDateDDMMYY(data.start_date),
          End_Date: isOpenEnded(data.end_date)
            ? <CBadge color="success">Open (9999-12-31)</CBadge>
            : formatDateDDMMYY(data.end_date),
          Approval_Attachment: data.approval_attachment
            ? (
              <CustomSpanButton
                handleViewDocuments={handleViewDocuments}
                vehicleId={data.approval_attachment} /* Pass direct source URL to act as argument */
                documentType={'APPROVAL'}
              />
            )
            : <CBadge color="secondary">None</CBadge>,
          Status: data.status === 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CTooltip content="Active / Inactive" placement="top">
                <CButton
                  size="sm"
                  color={data.status === 1 ? "success" : "danger"}
                  shape="rounded"
                  id={data.id}
                  onClick={() => {
                    changeRouteStatus(data.id)
                  }}
                  className="m-1"
                >
                  {/* Delete */}
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </CButton>
              </CTooltip>
              <Link to={data.status === 1 ? `NlmtRouteMaster/${data.id}` : ''}>
                <CTooltip content="Update" placement="top">
                  <CButton
                    disabled={data.status === 1 ? false : true}
                    size="sm"
                    color={data.status === 1 ? "success" : "secondary"}
                    shape="rounded"
                    id={data.id}
                    className="m-1"
                    type="button"
                  >
                    {/* Edit */}
                    <i className="fa fa-edit" aria-hidden="true"></i>
                  </CButton>
                </CTooltip>
              </Link>
            </div>
          ),
        })
      })
      setRowData(rowDataList)
    })
  }, [mount])

  // ============ Column Header Data =======

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
      width: '70px',
    },
    {
      name: 'Creation Date',
      selector: (row) => row.Creation_Date,
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
      name: 'Freight Rate',
      selector: (row) => row.Freight_Rate,
      sortable: true,
      center: true,
    },
    {
      name: 'Start Date',
      selector: (row) => row.Start_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'End Date',
      selector: (row) => row.End_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Approval',
      selector: (row) => row.Approval_Attachment,
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

          <CRow className="mt-1 mb-1">
            <CCol
              className="offset-md-6"
              xs={15}
              sm={15}
              md={6}
              style={{ display: 'flex', justifyContent: 'end' }}
            >
              <Link className="text-white" to="/NlmtRouteMaster">
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
                showSearchFilter={true}
              />
            </CContainer>

            {/* Approval Attachment View Modal */}
            <CModal visible={approvalModal} onClose={() => setApprovalModal(false)}>
              <CModalHeader>
                <CModalTitle>Approval Attachment</CModalTitle>
              </CModalHeader>
              <CModalBody>
                {
                  documentSrc ? (
                    !documentSrc.toLowerCase().endsWith(".pdf") ? (
                      <CCardImage orientation="top" src={documentSrc} />
                    ) : (
                      <iframe orientation="top" height={500} width={475} src={documentSrc} title="Approval Doc"></iframe>
                    )
                  ) : (
                    <p className="text-center">No attachment found.</p>
                  )
                }
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setApprovalModal(false)}>
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
          </CCard>

        </>
      )}
    </>
  )
}

export default NlmtRouteMasterTable
