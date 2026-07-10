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
import Loader from 'src/components/Loader'
import CustomSpanButton from 'src/components/customComponent/CustomSpanButton'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import NlmtVehicleMasterService from 'src/Service/Nlmt/Masters/NlmtVehicleMasterService'

const NlmtVehicleMasterTable = () => {
  const [RCCopyFront, setRCCopyFront] = useState(false)
  const [RCCopyBack, setRCCopyBack] = useState(false)
  const [InsuranceCopyBack, setInsuranceCopyBack] = useState(false)
  const [InsuranceCopyFront, setInsuranceCopyFront] = useState(false)
  const REQ = () => <span className="text-danger"> * </span>
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)

  const [documentSrc, setDocumentSrc] = useState('')
  const [viewData, setViewData] = useState([])

  function changeVehicleStatus(id) {
    NlmtVehicleMasterService.deleteNlmtVehicles(id).then((res) => {
      toast.success('Vehicle Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  function handleViewDocuments(e, id, type) {
    switch (type) {
      case 'RC_FRONT':
        {
          let singleVehicleInfo = viewData.filter((data) => data.vehicle_id == id)
          setDocumentSrc(singleVehicleInfo[0].rc_copy_front)
          setRCCopyFront(true)
        }
        break
      case 'RC_BACK':
        {
          let singleVehicleInfo = viewData.filter((data) => data.vehicle_id == id)
          setDocumentSrc(singleVehicleInfo[0].rc_copy_back)
          setRCCopyBack(true)
        }
        break
      case 'INSURANCE_FRONT':
        {
          let singleVehicleInfo = viewData.filter((data) => data.vehicle_id == id)
          setDocumentSrc(singleVehicleInfo[0].insurance_copy_front)
          setInsuranceCopyFront(true)
        }
        break
      case 'INSURANCE_BACK':
        {
          let singleVehicleInfo = viewData.filter((data) => data.vehicle_id == id)
          setDocumentSrc(singleVehicleInfo[0].insurance_copy_back)
          setInsuranceCopyBack(true)
        }
        break
      default:
        return 0
    }
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName = 'Vehicle_Master_Report_' + dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  useEffect(() => {
    NlmtVehicleMasterService.getNlmtVehicles().then((response) => {
      console.log("555555555555555555")
      const fetchedData = response.data.data
      setViewData(fetchedData)
      console.log(fetchedData)
      let rowDataList = []
      fetchedData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          vehicle_Number: data.vehicle_number,
      Vehicle_Type:
  data.vehicle_type_info?.definition_list_name || '-',

Vehicle_Capacity:
  (data.vehicle_capacity_info?.definition_list_name || '-') + '-TON',

Vehicle_Bodytype:
  data.vehicle_body_type_info?.definition_list_name || '-',
          RC_Copy_Front: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              vehicleId={data.vehicle_id}
              documentType={'RC_FRONT'}
            />
          ),
          RC_Copy_Back: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              vehicleId={data.vehicle_id}
              documentType={'RC_BACK'}
            />
          ),
          Insuranance_Copy_Front: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              vehicleId={data.vehicle_id}
              documentType={'INSURANCE_FRONT'}
            />
          ),
          Insuranance_Copy_Back: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              vehicleId={data.vehicle_id}
              documentType={'INSURANCE_BACK'}
            />
          ),
          Insurance_Validity: data.insurance_validity,
          FC_Validity: data.fc_validity,
          Status: data.vehicle_status === 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CTooltip content="Active / Inactive" placement="top">
                <CButton
                  size="sm"
                  color="danger"
                  shape="rounded"
                  id={data.id}
                  onClick={() => {
                    changeVehicleStatus(data.vehicle_id)
                  }}
                  className="m-1"
                >
                  {/* Delete */}
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </CButton>
              </CTooltip>

              <Link to={data.vehicle_status === 1 ? `NlmtVehicleMaster/${data.vehicle_id}` : ''}>
                <CTooltip content="Update" placement="top">
                  <CButton
                    disabled={data.vehicle_status === 1 ? false : true}
                    size="sm"
                    color="secondary"
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
      name: 'Veh. Type',
      selector: (row) => row.Vehicle_Type,
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
      name: 'Veh. Body Type',
      selector: (row) => row.Vehicle_Bodytype,
      sortable: true,
      center: true,
    },
    {
      name: 'RC Copy Front',
      selector: (row) => row.RC_Copy_Front,
      center: true,
    },
    {
      name: 'RC Copy Back',
      selector: (row) => row.RC_Copy_Back,
      center: true,
    },
    {
      name: 'Insurance Copy Front',
      selector: (row) => row.Insuranance_Copy_Front,
      center: true,
    },
    {
      name: ' Insurance Copy Back',
      selector: (row) => row.Insuranance_Copy_Back,
      center: true,
    },
    {
      name: 'Insurance Validity',
      selector: (row) => row.Insurance_Validity,
      center: true,
      sortable: true,
      Cell: ({ row }) => format(row, 'DD/mm/yyyy'),
    },
    {
      name: 'FC Validity',
      selector: (row) => row.FC_Validity,
      center: true,
      sortable: true,
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
      <CRow className="mt-1 mb-1">
        <CCol
          className="offset-md-6"
          xs={15}
          sm={15}
          md={6}
          style={{ display: 'flex', justifyContent: 'end' }}
        >
          <Link className="text-white" to="/NlmtVehicleMaster">
            <CButton size="sm" color="warning" className="px-3 text-white" type="button">
              NEW
            </CButton>
          </Link>
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
            {(!documentSrc.includes(".pdf")) ? <CCardImage orientation="top" src={documentSrc} /> : <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe>}
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
            {(!documentSrc.includes(".pdf")) ? <CCardImage orientation="top" src={documentSrc} /> : <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe>}

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
            {(!documentSrc.includes(".pdf")) ? <CCardImage orientation="top" src={documentSrc} /> : <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe>}
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
            {(!documentSrc.includes(".pdf")) ? <CCardImage orientation="top" src={documentSrc} /> : <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe>}
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
  )
}

export default NlmtVehicleMasterTable
