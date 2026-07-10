/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { toast } from 'react-toastify'
import NlmtTripInService from 'src/Service/Nlmt/TripIn/NlmtTripInService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'

/* ================================================================
   NlmtTripInReportView
   ─────────────────────────────────────────────────────────────────
   Editable detail view for a single NLMT Trip-In record.
   Mirrors GateInUpdate.js — admin can update statuses & remarks.
   Route: /NlmtTripInReport/:id
   ================================================================ */

/* ── NLMT Vehicle Current Position options ────────────────────── */
const Vehicle_Current = [
  { id: 1,   CStatus: 'Gate In – 1' },
  { id: 2,   CStatus: 'Inspection Completed – 2' },
  { id: 3,   CStatus: 'Inspection Rejected – 3' },
  { id: 4,   CStatus: 'Veh. Maintenance Start – 4' },
  { id: 5,   CStatus: 'Veh. Maintenance End – 5' },
  { id: 9,   CStatus: 'Doc. Verify Rejected – 9' },
  { id: 16,  CStatus: 'TS Created – 16' },
  { id: 17,  CStatus: 'TS Cancelled – 17' },
  { id: 18,  CStatus: 'Advance Completed – 18' },
  { id: 20,  CStatus: 'FD Shipment Created – 20' },
  { id: 21,  CStatus: 'FD Shipment Deleted – 21' },
  { id: 22,  CStatus: 'FD Shipment Completed – 22' },
  { id: 23,  CStatus: 'CD Shipment Created – 23' },
  { id: 24,  CStatus: 'CD Shipment Deleted – 24' },
  { id: 25,  CStatus: 'CD Shipment Completed – 25' },
  { id: 26,  CStatus: 'Expense Completed – 26' },
  { id: 27,  CStatus: 'Income Completed – 27' },
  { id: 28,  CStatus: 'Settlement Completed – 28' },
  { id: 29,  CStatus: 'Settlement Rejected – 29' },
  { id: 37,  CStatus: 'Diesel Created – 37' },
  { id: 39,  CStatus: 'Diesel Confirmed – 39' },
  { id: 41,  CStatus: 'Diesel Approved – 41' },
  { id: 261, CStatus: 'Income Rejected – 261' },
]

/* ── NLMT Parking Status options ──────────────────────────────── */
const Parking_Status = [
  { id: 1,  PStatus: 'Own GateIn – 1' },
  { id: 2,  PStatus: 'Hire GateIn – 2' },
  { id: 3,  PStatus: 'Party GateIn – 3' },
  { id: 4,  PStatus: 'Inspection Rejected – 4' },
  { id: 5,  PStatus: 'Maintenance Out – 5' },
  { id: 6,  PStatus: 'Maintenance In – 6' },
  { id: 7,  PStatus: 'Doc. Failure – 7' },
  { id: 11, PStatus: 'Trip Closed – 11' },
  { id: 15, PStatus: 'Gate Out – 15' },
  { id: 19, PStatus: 'Trip Out – 19' },
]

const Maintenance_Options = [
  { id: 1, VMain: 'Inside' },
  { id: 2, VMain: 'Outside' },
]

/* ── Helper ───────────────────────────────────────────────────── */
const getVehicleTypeLabel = (typeId) => {
  switch (Number(typeId)) {
    case 21: return 'Own'
    case 22: return 'Hire'
    case 23: return 'Party'
    default: return '-'
  }
}

/* ================================================================ */

const NlmtTripInReportView = () => {
  const { id }    = useParams()
  const navigation = useNavigate()

  /* ── Access ────────────────────────────────────────────────── */
  const user_info = JSON.parse(localStorage.getItem('user_info') || '{}')
  const [screenAccess, setScreenAccess] = useState(false)
  const page_no = NlmtScreenAccessCodes.NlmtReportScreens.NLMT_Trip_In_Report

  useEffect(() => {
    setScreenAccess(
      user_info.is_admin == 1 ||
        JavascriptInArrayComponent(page_no, user_info.page_permissions)
    )
  }, [])

  /* ── State ─────────────────────────────────────────────────── */
  const [fetch,              setFetch]              = useState(false)
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [values,             setValues]             = useState({
    vehicle_type_id:              '',
    vehicle_number:               '',
    vehicle_capacity:             '',
    nlmt_tripsheet_no:            '',
    driver_name:                  '',
    driver_phone:                 '',
    driver_code:                  '',
    owner_name:                   '',
    vendor_code:                  '',
    pan_card_number:              '',
    odometer_km:                  '',
    odometer_closing_km:          '',
    vehicle_current_position:     '',
    parking_status:               '',
    vehicle_inspection_status:    '',
    maintenance_status:           '',
    tripsheet_open_status:        '',
    gate_in_date_time_string:     '',
    gate_out_date_time:           '',
    gate_out_date_times:          '',
    remarks:                      '',
    created_by:                   '',
    created_date:                 '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  /* ── Fetch record ────────────────────────────────────────────── */
  useEffect(() => {
    if (!id) return

    NlmtTripInService.getById(id)
      .then((res) => {
        console.log('NlmtTripInReportView response:', res.data)
        const d = res.data?.data ?? res.data

        const vTypeId = d?.vehicle_info?.vehicle_type_id
        const isOwn   = Number(vTypeId) === 21

        setCurrentVehicleInfo(d)

        setValues({
          vehicle_type_id:              vTypeId || '',
          vehicle_number:               d?.vehicle_info?.vehicle_number || '',
          vehicle_capacity:             d?.vehicle_info?.vehicle_capacity_details?.def_list_name || '',
          nlmt_tripsheet_no:            d?.tripsheet_info?.nlmt_tripsheet_no || '',
          driver_name: isOwn
            ? (d?.driver_info?.driver_name || d?.driver_name || '')
            : (d?.driver_name || ''),
          driver_phone: isOwn
            ? (d?.driver_info?.driver_phone_1 || d?.driver_phone_1 || '')
            : (d?.driver_phone_1 || ''),
          driver_code:                  d?.driver_info?.driver_code || '',
          owner_name:                   d?.vendor_info?.owner_name || '',
          vendor_code:                  d?.vendor_info?.vendor_code || '',
          pan_card_number:              d?.vendor_info?.pan_card_number || '',
          odometer_km:                  d?.odometer_km || '',
          odometer_closing_km:          d?.odometer_closing_km || '',
          vehicle_current_position:     d?.vehicle_current_position || '',
          parking_status:               d?.parking_status || '',
          vehicle_inspection_status:    d?.vehicle_inspection_status || '',
          maintenance_status:           d?.maintenance_status || '',
          tripsheet_open_status:        d?.tripsheet_open_status || '',
          gate_in_date_time_string:     d?.gate_in_date_time_string || '',
          gate_out_date_time:           d?.gate_out_date_time_string || '',
          gate_out_date_times:          '',
          remarks:                      d?.remarks || '',
          created_by:                   d?.nlmt_user_info?.emp_name || d?.created_by || '',
          created_date:                 d?.created_date || '',
        })

        setFetch(true)
      })
      .catch((err) => {
        console.error('Fetch error:', err)
        toast.error('Failed to load Trip-In details.')
        setFetch(true)
      })
  }, [id])

  /* ── Save / Update ───────────────────────────────────────────── */
  const UpdateTripInRecord = () => {
    setFetch(false)

    const data = {
      vehicle_current_position:      values.vehicle_current_position,
      parking_status:                values.parking_status,
      vehicle_inspection_status:     values.vehicle_inspection_status,
      maintenance_status:            values.maintenance_status,
      tripsheet_open_status:         values.tripsheet_open_status,
      gate_out_date_time:            values.gate_out_date_times || values.gate_out_date_time || '',
      remarks:                       values.remarks,
    }

    NlmtTripInService.updateById(id, data)
      .then((res) => {
        setFetch(true)
        if (res.data?.status) {
          toast.success('Trip-In Record Updated Successfully')
        }
      })
      .catch((err) => {
        console.error('Update error:', err)
        toast.error('Update failed. Please try again.')
        setFetch(true)
      })
  }

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard>
                <CTabContent>
                  <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                    <CForm className="container p-3">
                      <CRow className="">

                        {/* ── READ-ONLY info fields ────────────────── */}

                        <CCol md={3}>
                          <CFormLabel htmlFor="vehicle_type">Vehicle Type</CFormLabel>
                          <CFormInput
                            name="vehicle_type"
                            size="sm"
                            id="vehicle_type"
                            value={getVehicleTypeLabel(values.vehicle_type_id)}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vehicle_number">Vehicle Number</CFormLabel>
                          <CFormInput
                            name="vehicle_number"
                            size="sm"
                            id="vehicle_number"
                            value={values.vehicle_number}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vehicle_capacity">Vehicle Capacity</CFormLabel>
                          <CFormInput
                            name="vehicle_capacity"
                            size="sm"
                            id="vehicle_capacity"
                            value={values.vehicle_capacity}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="driver_name">Driver Name</CFormLabel>
                          <CFormInput
                            name="driver_name"
                            size="sm"
                            id="driver_name"
                            value={values.driver_name}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="driver_phone">Driver Contact Number</CFormLabel>
                          <CFormInput
                            name="driver_phone"
                            size="sm"
                            id="driver_phone"
                            value={values.driver_phone}
                            readOnly
                          />
                        </CCol>

                        {Number(values.vehicle_type_id) === 21 && (
                          <CCol md={3}>
                            <CFormLabel htmlFor="driver_code">Driver Code</CFormLabel>
                            <CFormInput
                              name="driver_code"
                              size="sm"
                              id="driver_code"
                              value={values.driver_code}
                              readOnly
                            />
                          </CCol>
                        )}

                        {Number(values.vehicle_type_id) !== 21 && (
                          <>
                            <CCol md={3}>
                              <CFormLabel htmlFor="owner_name">Owner Name</CFormLabel>
                              <CFormInput
                                name="owner_name" size="sm" id="owner_name"
                                value={values.owner_name} readOnly
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="vendor_code">Vendor Code</CFormLabel>
                              <CFormInput
                                name="vendor_code" size="sm" id="vendor_code"
                                value={values.vendor_code} readOnly
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel htmlFor="pan_card_number">PAN No.</CFormLabel>
                              <CFormInput
                                name="pan_card_number" size="sm" id="pan_card_number"
                                value={values.pan_card_number} readOnly
                              />
                            </CCol>
                          </>
                        )}

                        <CCol md={3}>
                          <CFormLabel htmlFor="odometer_km">Opening Odometer KM</CFormLabel>
                          <CFormInput
                            name="odometer_km" size="sm" id="odometer_km"
                            value={values.odometer_km} readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="odometer_closing_km">Closing Odometer KM</CFormLabel>
                          <CFormInput
                            name="odometer_closing_km" size="sm" id="odometer_closing_km"
                            value={values.odometer_closing_km} readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="nlmt_tripsheet_no">Tripsheet No.</CFormLabel>
                          <CFormInput
                            name="nlmt_tripsheet_no" size="sm" id="nlmt_tripsheet_no"
                            value={values.nlmt_tripsheet_no} readOnly
                          />
                        </CCol>

                        {/* Gate In Date — disabled like GateInUpdate */}
                        <CCol md={3}>
                          <CFormLabel htmlFor="gate_in_date_time_string">Trip-In Date</CFormLabel>
                          <CFormInput
                            name="gate_in_date_time_string"
                            size="sm"
                            id="gate_in_date_time_string"
                            value={values.gate_in_date_time_string}
                            disabled
                          />
                        </CCol>

                        {/* ── EDITABLE fields ─────────────────────── */}

                        {/* Vehicle Current Position */}
                        <CCol md={3}>
                          <CFormLabel htmlFor="vehicle_current_position">Veh. Current Position</CFormLabel>
                          <CFormSelect
                            name="vehicle_current_position"
                            size="sm"
                            id="vehicle_current_position"
                            onChange={handleChange}
                            value={values.vehicle_current_position}
                          >
                            <option value="0">Select...</option>
                            {Vehicle_Current.map(({ id, CStatus }) => (
                              <option key={id} value={id}>{CStatus}</option>
                            ))}
                          </CFormSelect>
                        </CCol>

                        {/* Parking Status */}
                        <CCol md={3}>
                          <CFormLabel htmlFor="parking_status">Parking Status</CFormLabel>
                          <CFormSelect
                            name="parking_status"
                            size="sm"
                            id="parking_status"
                            onChange={handleChange}
                            value={values.parking_status}
                          >
                            <option value="0">Select...</option>
                            {Parking_Status.map(({ id, PStatus }) => (
                              <option key={id} value={id}>{PStatus}</option>
                            ))}
                          </CFormSelect>
                        </CCol>

                        {/* Gate Out Date — editable if not yet set */}
                        {(!values.gate_out_date_time || values.gate_out_date_time === '-') ? (
                          <CCol md={3}>
                            <CFormLabel htmlFor="gate_out_date_times">Gate-Out Date</CFormLabel>
                            <CFormInput
                              type="datetime-local"
                              name="gate_out_date_times"
                              size="sm"
                              id="gate_out_date_times"
                              onChange={handleChange}
                              value={values.gate_out_date_times}
                            />
                          </CCol>
                        ) : (
                          <CCol md={3}>
                            <CFormLabel htmlFor="gate_out_date_time">Gate-Out Date</CFormLabel>
                            <CFormInput
                              name="gate_out_date_time"
                              size="sm"
                              id="gate_out_date_time"
                              value={values.gate_out_date_time}
                              disabled
                            />
                          </CCol>
                        )}

                        {/* Inspection Status */}
                        <CCol md={3}>
                          <CFormLabel htmlFor="vehicle_inspection_status">Inspection Status</CFormLabel>
                          <CFormSelect
                            name="vehicle_inspection_status"
                            size="sm"
                            id="vehicle_inspection_status"
                            onChange={handleChange}
                            value={values.vehicle_inspection_status}
                          >
                            <option value="">Select...</option>
                            <option value="1">Completed</option>
                          </CFormSelect>
                        </CCol>

                        {/* Maintenance Status */}
                        <CCol md={3}>
                          <CFormLabel htmlFor="maintenance_status">Maintenance Status</CFormLabel>
                          <CFormSelect
                            name="maintenance_status"
                            size="sm"
                            id="maintenance_status"
                            onChange={handleChange}
                            value={values.maintenance_status}
                          >
                            <option value="">Select...</option>
                            {Maintenance_Options.map(({ id, VMain }) => (
                              <option key={id} value={id}>{VMain}</option>
                            ))}
                          </CFormSelect>
                        </CCol>

                        {/* Trip Open Status */}
                        <CCol md={3}>
                          <CFormLabel htmlFor="tripsheet_open_status">Trip Open Status</CFormLabel>
                          <CFormSelect
                            name="tripsheet_open_status"
                            size="sm"
                            id="tripsheet_open_status"
                            onChange={handleChange}
                            value={values.tripsheet_open_status}
                          >
                            <option value="0">Select...</option>
                            <option value="1">Open</option>
                            <option value="2">Closed</option>
                            <option value="3">Assigned</option>
                          </CFormSelect>
                        </CCol>

                        {/* Remarks */}
                        <CCol md={3}>
                          <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                          <CFormTextarea
                            id="remarks"
                            name="remarks"
                            rows="1"
                            onChange={handleChange}
                            value={values.remarks}
                          />
                        </CCol>

                        {/* Created By — read-only */}
                        <CCol md={3}>
                          <CFormLabel htmlFor="created_by">Created By</CFormLabel>
                          <CFormInput
                            name="created_by"
                            size="sm"
                            id="created_by"
                            value={values.created_by}
                            readOnly
                          />
                        </CCol>

                      </CRow>

                      {/* ── Buttons ─────────────────────────────── */}
                      <CRow className="mt-2">
                        <CCol>
                          <Link to={'/NlmtTripInReport'}>
                            <CButton
                              size="sm"
                              color="primary"
                              className="text-white"
                              type="button"
                            >
                              Previous
                            </CButton>
                          </Link>
                        </CCol>

                        <CCol
                          className="pull-right"
                          xs={12} sm={12} md={3}
                          style={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-3 text-white"
                            type="button"
                            onClick={() => {
                              setFetch(false)
                              UpdateTripInRecord()
                            }}
                          >
                            Accept
                          </CButton>
                        </CCol>
                      </CRow>

                    </CForm>
                  </CTabPane>
                </CTabContent>
              </CCard>
            </>
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default NlmtTripInReportView
