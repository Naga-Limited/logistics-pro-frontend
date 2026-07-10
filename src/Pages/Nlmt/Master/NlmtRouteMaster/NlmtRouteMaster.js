/* eslint-disable prettier/prettier */
import {
  CAlert,
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NlmtRouteMasterService from 'src/Service/Nlmt/Masters/NlmtRouteMasterService'

const DEFAULT_END_DATE = '9999-12-31'

const NlmtRouteMaster = () => {
  /* ==================== User Info ==================== */
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  const user_id = user_info.user_id
  const navigation = useNavigate()

  /* ==================== States ==================== */
  const [routeName, setRouteName]                   = useState('')
  const [freightRate, setFreightRate]               = useState('')
  const [startDate, setStartDate]                   = useState('')
  const [endDate, setEndDate]                       = useState(DEFAULT_END_DATE)
  const [approvalAttachment, setApprovalAttachment] = useState(null)
  const [loading, setLoading]                       = useState(false)

  // Route-existence tracking
  const [routeExists, setRouteExists]               = useState(false)   // true → existing route
  const [startDateLocked, setStartDateLocked]       = useState(false)   // true → lock start date field
  const [endDateNotClosed, setEndDateNotClosed]     = useState(false)   // true → previous record still open

  const debounceRef = useRef(null)

  const REQ  = () => <span className="text-danger"> * </span>

  /* ==================== Handlers ==================== */
  const handleRouteChange = (e) => {
    const val = e.target.value.toUpperCase()
    setRouteName(val)

    // Reset states on every keystroke
    setRouteExists(false)
    setStartDateLocked(false)
    setEndDateNotClosed(false)
    setStartDate('')

    // Debounce API call by 400ms
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (val.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        NlmtRouteMasterService.getLatestEndDateByRouteName(val.trim())
          .then((res) => {
            const latestEndDate = res.data.end_date

            if (latestEndDate === null) {
              // Route does not exist yet — fresh entry
              setRouteExists(false)
              setStartDateLocked(false)
              setEndDateNotClosed(false)
              setStartDate('')
            } else if (latestEndDate === DEFAULT_END_DATE) {
              // Route exists but its latest End Date is still open (9999-12-31)
              setRouteExists(true)
              setStartDateLocked(false)
              setEndDateNotClosed(true)   // ← block submission
              setStartDate('')
            } else {
              // Route exists and end date has been closed → auto-fill & lock start date
              setRouteExists(true)
              setStartDate(latestEndDate)
              setStartDateLocked(true)    // ← read-only
              setEndDateNotClosed(false)
            }
          })
          .catch(() => {
            setRouteExists(false)
            setStartDateLocked(false)
            setEndDateNotClosed(false)
          })
      }, 400)
    }
  }

  const handleFreightChange = (e) => {
    const sanitized = e.target.value.replace(/[^\d]/g, '')
    setFreightRate(sanitized)
  }

  /* ==================== Submit ==================== */
  const addNewRoute = (e) => {
    e.preventDefault()

    if (!routeName.trim()) {
      toast.warning('Route Required')
      return
    }

    if (!/^[A-Z ]+$/.test(routeName)) {
      toast.warning('Route Name should contain only letters and spaces')
      return
    }

    // Block if the previous record's End Date is still open
    if (endDateNotClosed) {
      toast.error('Close the End Date of the existing record before adding a new rate!')
      return
    }

    if (!freightRate.trim()) {
      toast.warning('Freight Rate Required')
      return
    }

    if (Number(freightRate) <= 0) {
      toast.warning('Freight Rate must be greater than 0')
      return
    }

    if (!/^\d+$/.test(freightRate)) {
      toast.warning('Freight Rate must be a whole number (no decimals)')
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

    // Approval Attachment is mandatory when updating an existing route's rate
    if (routeExists && !approvalAttachment) {
      toast.warning('Approval Attachment is mandatory for an existing route')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('route_name', routeName)
    formData.append('freight_rate', freightRate)
    formData.append('start_date', startDate)
    formData.append('end_date', endDate)
    formData.append('created_by', user_id)
    if (approvalAttachment) {
      formData.append('approval_attachment', approvalAttachment)
    }

    NlmtRouteMasterService.createNlmtRoute(formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success('Route Created Successfully!')
          navigation('/NlmtRouteMasterTable')
        } else if (res.status === 202) {
          toast.warning('Route with the same Start Date already exists!')
        }
      })
      .catch(() => {
        toast.error('Something went wrong!')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /* ==================== JSX ==================== */
  return (
    <>
      {loading && <Loader />}

      <CCard>
        <CTabContent>
          <CTabPane visible>
            <CForm className="row g-3 m-2 p-1" onSubmit={addNewRoute}>

              {/* ── End Date Not Closed Warning ── */}
              {endDateNotClosed && (
                <CRow>
                  <CCol xs={12}>
                    <CAlert color="danger" className="py-2 mb-0 d-flex align-items-center gap-2">
                      <i className="fa fa-exclamation-circle me-2" aria-hidden="true"></i>
                      <strong>Close the End Date</strong>&nbsp;— The existing record for this route
                      still has an open End Date (9999-12-31). Please update the End Date of
                      that record before adding a new freight rate.
                    </CAlert>
                  </CCol>
                </CRow>
              )}

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
                    disabled={endDateNotClosed}
                  />
                </CCol>

                {/* Start Date — locked when auto-filled from previous end date */}
                <CCol md={3}>
                  <CFormLabel>
                    Start Date <REQ />
                    {startDateLocked && (
                      <span
                        className="ms-1 text-muted"
                        style={{ fontSize: '11px', fontWeight: 'normal' }}
                      >
                        (auto-filled)
                      </span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    type="date"
                    size="sm"
                    value={startDate}
                    onChange={(e) => !startDateLocked && setStartDate(e.target.value)}
                    readOnly={startDateLocked}
                    style={startDateLocked ? { background: '#e9ecef', cursor: 'not-allowed' } : {}}
                    disabled={endDateNotClosed}
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
                    disabled={endDateNotClosed}
                  />
                </CCol>
              </CRow>

              <CRow className="mt-2">
                <CCol md={4}>
                  <CFormLabel>
                    Approval Attachment
                    {/* Mandatory only for existing-route rate update */}
                    {routeExists && <REQ />}
                  </CFormLabel>
                  <CFormInput
                    type="file"
                    size="sm"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setApprovalAttachment(e.target.files[0] || null)}
                    disabled={endDateNotClosed}
                  />
                  {routeExists && !endDateNotClosed && (
                    <small className="text-danger mt-1 d-block">
                      Mandatory — required when adding a new rate for an existing route.
                    </small>
                  )}
                </CCol>
              </CRow>

              <CRow className="mt-3">
                <CCol xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <CButton
                    type="submit"
                    color="success"
                    className="mx-1 px-3 text-white"
                    disabled={loading || endDateNotClosed}
                  >
                    Submit
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
      </CCard>
    </>
  )
}

export default NlmtRouteMaster
