/* eslint-disable prettier/prettier */
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabPane,
  CFormFloating,
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
} from '@coreui/react'
import { cilInput, cilDescription, cilCheckCircle, cilCog } from '@coreui/icons'

import { React, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import validate from 'src/Utils/Validation'
import { Link } from 'react-router-dom'

const ChangeVehicle = () => {
  const formValues = {
    status: '',
  }

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    login,
    validate,
    formValues
  )

  function login() {
    alert('No Errors CallBack Called')
  }
  // document.title=('Vehicle Inspection');
  return (
    <>
      <CCard>
        <CTabContent className="m-0 p-0">
          <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
            <CForm className="container p-3" onSubmit={handleSubmit}>
              <CRow className="">
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="tNum">Tripsheet Number*</CFormLabel>
                  <CFormInput type="text" name="tNum" size="sm" id="tNum" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="wait">Waiting_At</CFormLabel>
                  <CFormInput type="text" name="wait" size="sm" id="wait" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="status">
                    Status*{' '}
                    {errors.status && <span className="small text-danger">{errors.status}</span>}
                  </CFormLabel>
                  <CFormSelect
                    size="sm"
                    id="status"
                    className={`${errors.status && 'is-invalid'}`}
                    name="status"
                    value={values.status || ''}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                  >
                    <option hidden>Select...</option>
                    <option value="0">Gate In</option>
                    <option value="1">Vehicle Inspection</option>
                    <option value="2">Vehicle Maintenance</option>
                    <option value="3">Trip STO</option>
                    <option value="4">Doc. Verification</option>
                    <option value="5">TS Creation</option>
                    <option value="6">Vehicle Assignment</option>
                    <option value="7">Vehicle Assignment Consumer</option>
                    <option value="8">Advance Payment</option>
                    <option value="9">DI Creation</option>
                    <option value="10">DI Confirmation</option>
                    <option value="11">DI Approval</option>
                    <option value="12">Tripsheet Closure</option>
                    <option value="13">Tripsheet Settlement</option>
                  </CFormSelect>
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                  <CFormTextarea id="remarks" rows="1"></CFormTextarea>
                </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <Link to="/ChangeVehicleHome">
                    <CButton
                      md={9}
                      size="sm"
                      color="primary"
                      disabled=""
                      className="text-white"
                      type="submit"
                    >
                      Previous
                    </CButton>
                  </Link>
                </CCol>

                <CCol
                  className=""
                  xs={12}
                  sm={12}
                  md={3}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <CButton
                    size="sm"
                    // disabled={enableSubmit}
                    color="warning"
                    className="px-3 text-white"
                    type="submit"
                  >
                    Submit
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CTabPane>
        </CTabContent>
      </CCard>
    </>
  )
}

export default ChangeVehicle
