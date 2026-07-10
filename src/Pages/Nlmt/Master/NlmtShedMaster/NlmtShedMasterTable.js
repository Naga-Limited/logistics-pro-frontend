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
    CTooltip,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CustomSpanButton from 'src/components/customComponent/CustomSpanButton2'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import NlmtShedMasterService from 'src/Service/Nlmt/Masters/NlmtShedMasterService'
import NlmtShedMaster from './NlmtShedMaster'

const NlmtShedMasterTable = () => {
  const [ShedOwnerPhoto, setShedOwnerPhoto] = useState(false)
  const [ShedRCcopy, setShedRCcopy] = useState(false)

  const [deleteModal, setDeleteModal] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)

  const [documentSrc, setDocumentSrc] = useState('')
  let viewData
  function changeShedStatus(id) {
    NlmtShedMasterService.deleteShed(id).then((res) => {
      toast.success('Shed Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  const exportToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Nlmt_Shed_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  //section for handling view model for each model

  function handleViewDocuments(e, id, type) {
    switch (type) {
      case 'SHED_OWNER_PHOTO':
        {
          let singleShedInfo = viewData.filter((data) => data.shed_id == id)
          setDocumentSrc(singleShedInfo[0].shed_owner_photo)
          setShedOwnerPhoto(true)
        }
        break
      case 'RC_BACK':
        {
          let singleVehicleInfo = viewData.filter((data) => data.vehicle_id == id)
          setDocumentSrc(singleVehicleInfo[0].rc_copy_back)
          setShedRCcopy(true)
        }
        break
    }
  }
  useEffect(() => {
    NlmtShedMasterService.getShed().then((response) => {
      console.log(response)
      console.log('asd')
      viewData = response.data.data
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          Shed_Name: data.shed_name,
          Shed_Owner_Name: data.shed_owner_name,
          Shed_Owner_Phone_1: data.shed_owner_phone_1,
          Shed_Owner_Phone_2: data.shed_owner_phone_2 ? data.shed_owner_phone_1 : '-',
          Shed_Owner_Address: data.shed_owner_address,
          Shed_Owner_Photo: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              shedId={data.shed_id}
              documentType={'SHED_OWNER_PHOTO'}
            />
          ),
          Aadhar_Number: data.shed_adhar_number ? data.shed_adhar_number : '-',
          Pan_Number: data.pan_number,
          Gst_No: data.gst_no ? data.gst_no : '-',
          Status: data.shed_status === 1 ? '✔️' : '❌',

          Action: (
            <div className="d-flex justify-content-space-between">
                  <CTooltip
                    content={data.shed_status === 1 ? 'Unassign Shed' : 'Assign Shed'}
                    placement="top"
                  >
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeShedStatus(data.shed_id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              </CTooltip>
              <Link to={data.shed_status === 1 ? `NlmtShedMaster/${data.shed_id}` : ''}>
                  <CTooltip content="Update " placement="top">
                <CButton
                  size="sm"
                  color="secondary"
                  shape="rounded"
                  disabled={data.shed_status === 1 ? false : true}
                  id={data.id}
                  className="m-1"
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
      name: 'Shed Name',
      selector: (row) => row.Shed_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Name',
      selector: (row) => row.Shed_Owner_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Mobile Number 1',
      selector: (row) => row.Shed_Owner_Phone_1,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Mobile Number 2',
      selector: (row) => row.Shed_Owner_Phone_2,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Address',
      selector: (row) => row.Shed_Owner_Address,
      sortable: true,
      center: true,
    },
    {
      name: 'Aadhar Number',
      selector: (row) => row.Aadhar_Number,
      sortable: true,
      center: true,
    },
    {
      name: ' Shed Owner Photo',
      selector: (row) => row.Shed_Owner_Photo,
      center: true,
    },
    {
      name: 'PAN Number',
      selector: (row) => row.Pan_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'GST Number',
      selector: (row) => row.Gst_No,
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
  return (
    <>
      <CRow className="mt-1 mb-1">
        <CCol
          className="offset-md-6"
          xs={15}
          sm={15}
          md={6}
          style={{ display: 'flex', justifyContent: 'end' }}
        >
          <Link className="text-white" to="/NlmtShedMaster">
            <CButton size="sm" color="warning" className="px-5 text-white" type="button">
              NEW
            </CButton>
          </Link>
          <CButton
            size="sm"
            color="warning"
            className="px-5 text-white"
            onClick={(e) => {
              exportToCSV()
            }
              }>
            Export
          </CButton>
        </CCol>
      </CRow>
      <CCard>
        <CContainer>
          <CustomTable
            columns={columns}
            data={rowData}
            fieldName={'Shed_Name'}
            showSearchFilter={true}
            pending={pending}
          />
        </CContainer>

        <CModal visible={ShedOwnerPhoto} onClose={() => setShedOwnerPhoto(false)}>
          <CModalHeader>
            <CModalTitle>Shed Owner Photo</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CCardImage orientation="top" src={documentSrc} />
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShedOwnerPhoto(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      </CCard>
    </>
  )
}
export default NlmtShedMasterTable
