/* eslint-disable prettier/prettier */
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
  CFormTextarea,
} from '@coreui/react'
import { React, useState } from 'react'
import useForm from 'src/Hooks/useForm'
import validate from 'src/Validations/FormValidation'
import { Link } from 'react-router-dom'
import CustomTable from '../../components/customComponent/CustomTable'
const AdvanceOwn = () => {
  const formValues = {
    vehicleType: '',
    OdometerKm: '',
    odometerPhoto: '',
  }

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    login,
    validate,
    formValues
  )

  function login() {
    alert('No Errors CallBack Called')
  }
  return (
    <>
      <CCard>
        <CTabContent>
          <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
            <CForm className="container p-3" onSubmit={handleSubmit}>
              <CRow className="">
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>

                  <CFormInput size="sm" id="vType"  readOnly />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>

                  <CFormInput size="sm" id="vNum"  readOnly />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="vCap">Vehicle Capacity</CFormLabel>

                  <CFormInput size="sm" id="vCap"  readOnly />
                </CCol>

                {/* <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">VA Number</CFormLabel>

                  <CFormInput size="sm" id="inputAddress"  readOnly />
                </CCol>
              </CRow>
              <CRow className=""> */}
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="dName">Driver Name</CFormLabel>

                  <CFormInput size="sm" id="dName"  readOnly />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="dMob">Driver Mobile Number</CFormLabel>

                  <CFormInput size="sm" id="dMob"  readOnly />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="OdometerKM">Odometer KM</CFormLabel>

                  <CFormInput size="sm" id="OdometerKM"  readOnly />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="odoIMG">Odometer Photo</CFormLabel>
                  <CButton
                    // onClick={() => setVisible(!visible)}
                    className="w-100"
                    color="info"
                    size="sm"
                    id='odoIMG'
                  >
                    <span className="float-start">
                      <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                    </span>
                  </CButton>
                </CCol>
              {/* </CRow>
              <CRow className=""> */}
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>

                  <CFormInput size="sm" id="gateInDateTime"  readOnly />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inspectionDateTime">Vehicle Inspection Date & Time</CFormLabel>

                  <CFormInput size="sm" id="inspectionDateTime"  readOnly />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="verifyDate">Doc. Verification Date & Time</CFormLabel>

                  <CFormInput size="sm" id="verifyDate"  readOnly />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="tNum">Tripsheet Number</CFormLabel>

                  <CFormInput size="sm" id="tNum"  readOnly />
                </CCol>
              {/* </CRow>
              <CRow className=""> */}
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="vCode">Vendor Code</CFormLabel>

                  <CFormInput size="sm" id="vCode"  readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="dOutstand">Driver Outstanding</CFormLabel>

                  <CFormInput size="sm" id="dOutstand"  readOnly />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="advanceReq">Advance Request Form</CFormLabel>

                  <CFormInput type="file" size="sm" id="advanceReq"  />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="advance">
                    Advance Amount*
                    {errors.advance && (
                      <span className="help text-danger">{errors.advance}</span>
                    )}
                  </CFormLabel>
                  <CFormInput size="sm" id="inputAddress"  readOnly />
                  {/* <CFormInput
                      name="Order Qty"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      className={`${errors.OdometerKm && 'is-invalid'}`}
                      size="sm"
                      id="inputAddress"
                      placeholder=""
                    /> */}
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="sTon">Shipment Tonnage*</CFormLabel>

                  <CFormInput type="text" size="sm" id="sTon"  readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="expectDelivery">
                    Expected Delivery Date & Time*
                    {errors.expectDelivery && (
                      <span className="help text-danger">{errors.expectDelivery}</span>
                    )}
                  </CFormLabel>
                  <CFormInput size="sm" type="datetime-local" id="expectDelivery" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="expectReturn">
                    Expected Return Date & Time*
                    {errors.expectReturn && (
                      <span className="help text-danger">{errors.expectReturn}</span>
                    )}
                  </CFormLabel>
                  <CFormInput size="sm" type="datetime-local" id="expectReturn" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="otp">OTP Generate</CFormLabel>
                  <CButton
                    // onClick={() => setVisible(!visible)}
                    className="w-100"
                    color="info"
                    size="sm"
                    id='otp'
                  >
                    <span className="float-start">
                      <i className="fa fa-key" aria-hidden="true"></i> &nbsp;Click Here To Generate
                      OTP
                    </span>
                  </CButton>
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="enterOtp">Enter OTP*</CFormLabel>

                  <CFormInput size="sm" id="enterOtp" />
                </CCol>

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                  <CFormTextarea id="remarks" rows="1"></CFormTextarea>
                </CCol>
              </CRow>

              <CRow className="mt-3">
                <CCol>
                  <CButton
                    size="sm"
                    color="primary"
                    // disabled={enableSubmit}
                    className="px-3 text-white"
                    type="submit"
                  >
                    <Link className="text-white" to="/AdvancePayment">
                      Previous
                    </Link>
                  </CButton>
                </CCol>
                <CCol
                  className="offset-md-6"
                  xs={12}
                  sm={12}
                  md={3}
                  style={{ display: 'flex', justifyContent: 'end' }}
                >
                  <CButton
                    size="sm"
                    color="warning"
                    // disabled={enableSubmit}
                    className="mx-3 px-3 text-white"
                    type="submit"
                  >
                    Submit
                  </CButton>
                  <CButton
                    size="sm"
                    color="warning"
                    // disabled={enableSubmit}
                    className="mx-3 px-3 text-white"
                    type="submit"
                  >
                    Reject
                  </CButton>
                  {/* <CButton
                                        size="sm"
                                        // disabled={enableSubmit}
                                        color="warning"
                                        className="mx-3 px-3 text-white"
                                        type="submit"
                                    >
                                        Cancel
                                    </CButton> */}
                </CCol>
              </CRow>
            </CForm>
          </CTabPane>
        </CTabContent>
      </CCard>
    </>
  )
}
export default AdvanceOwn
