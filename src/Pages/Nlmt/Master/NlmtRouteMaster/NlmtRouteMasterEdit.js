/* eslint-disable prettier/prettier */
import {
  CAlert,
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import NlmtRouteMasterService from 'src/Service/Nlmt/Masters/NlmtRouteMasterService'

const DEFAULT_END_DATE = '9999-12-31'

const NlmtRouteMasterEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  /* ================= USER INFO ================= */
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  const user_id = user_info.user_id

  /* ================= STATES ================= */
  const [routeName, setRouteName] = useState('')
  const [freightRate, setFreightRate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState(DEFAULT_END_DATE)
  const [approvalAttachment, setApprovalAttachment] = useState(null)
  const [existingAttachment, setExistingAttachment] = useState('')
  const [originalData, setOriginalData] = useState({})
  const [loading, setLoading] = useState(true)

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState('')

  const REQ = () => <span className="text-danger"> *</span>

  /* ================= HANDLERS ================= */
  const handleRouteChange = (e) => {
    setRouteName(e.target.value.toUpperCase())
  }

  const handleFreightChange = (e) => {
    const sanitized = e.target.value.replace(/[^\d]/g, '')
    setFreightRate(sanitized)
  }

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    NlmtRouteMasterService.getNlmtRouteById(id)
      .then((res) => {
        const data = res.data.data
        setRouteName(data.route_name)
        setFreightRate(String(data.freight_rate))
        setStartDate(data.start_date || '')
        setEndDate(data.end_date || DEFAULT_END_DATE)
        setExistingAttachment(data.approval_attachment || '')
        setOriginalData(data)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load route data')
        setLoading(false)
      })
  }, [id])

  /* ================= UPDATE ================= */
  const updateRoute = (e) => {
    e.preventDefault()

    /* ---------- Validations ---------- */
    if (!routeName.trim()) {
      toast.warning('Route Required')
      return
    }

    if (!/^[A-Z ]+$/.test(routeName)) {
      toast.warning('Route Name should contain only letters and spaces')
      return
    }

    if (!freightRate.trim()) {
      toast.warning('Freight Rate Required')
      return
    }

    if (!/^\d+$/.test(freightRate)) {
      toast.warning('Freight Rate must be a whole number (no decimals)')
      return
    }

    if (Number(freightRate) <= 0) {
      toast.warning('Freight Rate must be greater than 0')
      return
    }

    if (!startDate) {
      toast.warning('Start Date is required')
      return
    }

    if (!endDate) {
      toast.warning('End Date is required')
      return
    }

    /* ---------- API Call ---------- */
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('route_name', routeName)
    formData.append('freight_rate', freightRate)
    formData.append('start_date', startDate)
    formData.append('end_date', endDate)
    formData.append('updated_by', user_id)
    if (approvalAttachment) {
      formData.append('approval_attachment', approvalAttachment)
    }

    setLoading(true)

    NlmtRouteMasterService.updateNlmtRoutes(id, formData)
      .then((res) => {
        setLoading(false)

        if (res.status === 200) {
          toast.success('NLMT Route Updated Successfully!')
          setTimeout(() => {
            navigate('/NlmtRouteMasterTable')
          }, 800)
        }

        if (res.status === 202) {
          toast.warning('Route Already Exists!')
        }
      })
      .catch((err) => {
        setLoading(false)

        if (err.response?.data?.errors) {
          let output = ''
          const object = err.response.data.errors
          for (const key in object) {
            output += `• ${object[key]}\n`
          }
          setError(output)
          setErrorModal(true)
        } else {
          toast.error('Something went wrong!')
        }
      })
  }

  /* ================= JSX ================= */
  return (
    <>
      {loading && <Loader />}

      {!loading && (
        <CCard>
          <CTabContent>
            <CTabPane visible>
              <CForm className="row g-3 m-2 p-1" onSubmit={updateRoute}>
                <CRow>
                  <CCol md={3}>
                    <CFormLabel>
                      Route Name <REQ />
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      maxLength={30}
                      value={routeName}
                      onChange={handleRouteChange}
                    />
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel>
                      Freight Rate <REQ />
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      value={freightRate}
                      onChange={handleFreightChange}
                      maxLength={8}
                    />
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel>
                      Start Date <REQ />
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      size="sm"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel>
                      End Date <REQ />
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      size="sm"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </CCol>
                </CRow>

                <CRow className="mt-2">
                  <CCol md={4}>
                    <CFormLabel>Approval Attachment</CFormLabel>
                    <CFormInput
                      type="file"
                      size="sm"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setApprovalAttachment(e.target.files[0] || null)}
                    />
                    {existingAttachment && (
                      <small className="text-muted mt-1 d-block">
                        Current: <strong>{existingAttachment}</strong>
                        <span className="text-info ms-1">(Upload a new file to replace)</span>
                      </small>
                    )}
                  </CCol>
                </CRow>

                <CRow className="mt-3">
                  <CCol
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <CButton
                      type="submit"
                      color="warning"
                      className="mx-1 px-3 text-white"
                    >
                      UPDATE
                    </CButton>

                    <Link to="/NlmtRouteMasterTable">
                      <CButton
                        type="button"
                        color="warning"
                        className="mx-1 px-3 text-white"
                      >
                        BACK
                      </CButton>
                    </Link>
                  </CCol>
                </CRow>
              </CForm>
            </CTabPane>
          </CTabContent>

          {/* ERROR MODAL */}
          <CModal visible={errorModal} backdrop="static">
            <CModalHeader>
              <CModalTitle>Error</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CAlert color="danger" style={{ whiteSpace: 'pre-line' }}>
                {error}
              </CAlert>
            </CModalBody>
            <CModalFooter>
              <CButton color="primary" onClick={() => setErrorModal(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        </CCard>
      )}
    </>
  )
}

export default NlmtRouteMasterEdit
