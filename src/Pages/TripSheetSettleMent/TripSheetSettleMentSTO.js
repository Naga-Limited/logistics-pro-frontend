import {
  CButton,
  CCard,
  CCardImage,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
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
} from '@coreui/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useForm from 'src/Hooks/useForm'
import VendorRequestValidation from 'src/Utils/VendorCreation/VendorRequestValidation'

const TripSheetSettleMentSTO = () => {
  const formValues = {
    vehicleType: '',
    OdometerKm: '',
    odometerPhoto: '',
  }
  const [activeKey, setActiveKey] = useState(1)
  const [activeKeySub, setactiveKeySub] = useState(1)

  const [OdometerPhoto, setOdometerPhoto] = useState(false)
  const [ClosingOdometerPhoto, setClosingOdometerPhoto] = useState(false)
  const [TripExpenseSheet, setTripExpenseSheet] = useState(false)

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    login,
    VendorRequestValidation,
    formValues
  )

  function login() {
    alert('No Errors CallBack Called')
  }
  return (
    <CCard>
      <CNav variant="tabs" size="sm" className="m-2" role="tablist">
        <CNavItem>
          <CNavLink
            className="btn btn-sm"
            href="javascript:void(0);"
            active={activeKey === 1}
            onClick={() => setActiveKey(1)}
          >
            Page 1
          </CNavLink>
        </CNavItem>

        <CNavItem>
          <CNavLink
            className="btn btn-sm"
            href="javascript:void(0);"
            active={activeKey === 2}
            onClick={() => setActiveKey(2)}
          >
            Page 2
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            className="btn btn-sm"
            href="javascript:void(0);"
            active={activeKey === 3}
            onClick={() => setActiveKey(3)}
          >
            Summary
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent>
        <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
          <CForm className="p-2" onSubmit={handleSubmit}>
            <CRow className="">
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Vehicle Number
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" value="" readOnly />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Vehicle Capacity
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" value="" readOnly />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Tripsheet Number
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" value="" readOnly />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  TS Date & Time
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" value="" readOnly />
              </CCol>
            </CRow>
            <CRow className="">
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Driver Name
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" value="" readOnly />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Driver Code
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" readOnly />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Driver Cell Number
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" readOnly />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Opening KM
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" value="" readOnly />
              </CCol>
            </CRow>
            <CRow className="">
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Opening Odometer Photo
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput
                  onClick={() => setOdometerPhoto(!OdometerPhoto)}
                  size="sm"
                  id="inputAddress"
                  value="view"
                  readOnly
                />
                <CModal visible={OdometerPhoto} onClose={() => setOdometerPhoto(false)}>
                  <CModalHeader>
                    <CModalTitle>Odometer Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CCardImage
                      orientation="top"
                      src="data:image/jpeg;base64,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"
                    />
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setOdometerPhoto(false)}>
                      Close
                    </CButton>
                    <CButton color="primary">Save changes</CButton>
                  </CModalFooter>
                </CModal>
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Closing KM
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" type="text" id="inputAddress" value="" readOnly />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Closing Odometer Photo
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput
                  onClick={() => setOdometerPhoto(!OdometerPhoto)}
                  size="sm"
                  id="inputAddress"
                  value="view"
                  readOnly
                />
                <CModal visible={OdometerPhoto} onClose={() => setOdometerPhoto(false)}>
                  <CModalHeader>
                    <CModalTitle>Odometer Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CCardImage
                      orientation="top"
                      src="data:image/jpeg;base64,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"
                    />
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setOdometerPhoto(false)}>
                      Close
                    </CButton>
                    <CButton color="primary">Save changes</CButton>
                  </CModalFooter>
                </CModal>
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Trip KM
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput type="text" size="sm" id="inputAddress" readOnly />
              </CCol>
            </CRow>
            <CRow className="">
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Other Charges
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" readOnly />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Other Charges Amount
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" type="text" id="inputAddress" readOnly />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Trip Expense Sheet
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput
                  onClick={() => setTripExpenseSheet(!TripExpenseSheet)}
                  size="sm"
                  id="inputAddress"
                  value="view"
                  readOnly
                />
                <CModal visible={TripExpenseSheet} onClose={() => setTripExpenseSheet(false)}>
                  <CModalHeader>
                    <CModalTitle>TripExpenseSheet Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CCardImage
                      orientation="top"
                      src="data:image/jpeg;base64,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"
                    />
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setTripExpenseSheet(false)}>
                      Close
                    </CButton>
                    <CButton color="primary">Save changes</CButton>
                  </CModalFooter>
                </CModal>
              </CCol>
            </CRow>
          </CForm>
        </CTabPane>
      </CTabContent>
      <CTabContent>
        <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 2}>
          <CForm className="p-2" onSubmit={handleSubmit}>
            <CRow className="">
              <CCol xs={12} md={2}>
                <CFormLabel htmlFor="inputAddress">
                  Delivery Invoice Number
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" value="" readOnly />
              </CCol>
              <CCol xs={12} md={2}>
                <CFormLabel htmlFor="inputAddress">
                  Delivery Date & Time
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" type="datetime-local" id="inputAddress" value="" readOnly />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Loading & Unloading Charges
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" value="" readOnly />
              </CCol>
              <CCol xs={12} md={2}>
                <CFormLabel htmlFor="inputAddress">
                  Tarpaulin Charges
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" value="" readOnly />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Opening Odometer Photo
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput
                  onClick={() => setOdometerPhoto(!OdometerPhoto)}
                  size="sm"
                  id="inputAddress"
                  value="view"
                  readOnly
                />
                <CModal visible={OdometerPhoto} onClose={() => setOdometerPhoto(false)}>
                  <CModalHeader>
                    <CModalTitle>Odometer Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CCardImage
                      orientation="top"
                      src="data:image/jpeg;base64,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"
                    />
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setOdometerPhoto(false)}>
                      Close
                    </CButton>
                    <CButton color="primary">Save changes</CButton>
                  </CModalFooter>
                </CModal>
              </CCol>
            </CRow>
            <CRow className="">
              <CCol xs={12} md={2}>
                <CFormLabel htmlFor="inputAddress">
                  Delivery Invoice Number
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" value="" readOnly />
              </CCol>
              <CCol xs={12} md={2}>
                <CFormLabel htmlFor="inputAddress">
                  Delivery Date & Time
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" type="datetime-local" id="inputAddress" value="" readOnly />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Loading & Unloading Charges
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" value="" readOnly />
              </CCol>
              <CCol xs={12} md={2}>
                <CFormLabel htmlFor="inputAddress">
                  Tarpaulin Charges
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput size="sm" id="inputAddress" value="" readOnly />
              </CCol>
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="inputAddress">
                  Opening Odometer Photo
                  {errors.vehicleType && (
                    <span className="small text-danger">{errors.vehicleType}</span>
                  )}
                </CFormLabel>
                <CFormInput
                  onClick={() => setOdometerPhoto(!OdometerPhoto)}
                  size="sm"
                  id="inputAddress"
                  value="view"
                  readOnly
                />
                <CModal visible={OdometerPhoto} onClose={() => setOdometerPhoto(false)}>
                  <CModalHeader>
                    <CModalTitle>Odometer Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CCardImage
                      orientation="top"
                      src="data:image/jpeg;base64,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"
                    />
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setOdometerPhoto(false)}>
                      Close
                    </CButton>
                    <CButton color="primary">Save changes</CButton>
                  </CModalFooter>
                </CModal>
              </CCol>
            </CRow>
          </CForm>
        </CTabPane>
      </CTabContent>
      <CTabContent>
        <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 3}>
          <CTabContent>
            <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={1}>
              <CContainer>
                <CRow className="py-2">
                  <CCol style={{ display: 'flex', justifyContent: 'center' }}>
                    <h3> Over All</h3>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs={12} md={4}>
                    <CTable>
                      <CTableHead style={{ background: '#4D3227' }}>
                        <CTableRow>
                          <CTableHeaderCell
                            style={{ color: '#fff', textAlign: 'center' }}
                            colSpan="2"
                            scope="col"
                          >
                            Income
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Freight Income</CTableHeaderCell>
                          <CTableDataCell>20000</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Halting Charges</CTableHeaderCell>
                          <CTableDataCell>15000</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Penality</CTableHeaderCell>
                          <CTableDataCell>11000</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Total Income</CTableHeaderCell>
                          <CTableDataCell>54000</CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCol>
                  <CCol xs={12} md={4}>
                    <CTable>
                      <CTableHead style={{ background: '#4D3227' }}>
                        <CTableRow>
                          <CTableHeaderCell
                            style={{ color: '#fff', textAlign: 'center' }}
                            colSpan="2"
                            scope="col"
                          >
                            Expenses
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Halting Charges</CTableHeaderCell>
                          <CTableDataCell>20000</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Toll Amount</CTableHeaderCell>
                          <CTableDataCell>3500</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Bata</CTableHeaderCell>
                          <CTableDataCell>2000</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Additional Bata</CTableHeaderCell>
                          <CTableDataCell>750</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Maintenance Charges</CTableHeaderCell>
                          <CTableDataCell>2250</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Total</CTableHeaderCell>
                          <CTableDataCell>54000</CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCol>
                  <CCol xs={12} md={4}>
                    <CTable>
                      <CTableHead style={{ background: '#4D3227' }}>
                        <CTableRow>
                          <CTableHeaderCell
                            style={{ color: '#fff', textAlign: 'center' }}
                            colSpan="2"
                            scope="col"
                          >
                            Mileage (KM)
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Standard Mileage</CTableHeaderCell>
                          <CTableDataCell>15000</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Actual Mileage</CTableHeaderCell>
                          <CTableDataCell>15320</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Difference</CTableHeaderCell>
                          <CTableDataCell>320</CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                    <CCard>
                      <h2 className="p-3">Profit : 38500</h2>
                    </CCard>
                  </CCol>
                </CRow>
              </CContainer>
            </CTabPane>
            <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKeySub === 2}>
              <CContainer>
                <CRow>
                  <CCol xs={12} md={8} className="p-3">
                    <CTable>
                      <CTableHead style={{ background: '#4D3227' }}>
                        <CTableRow>
                          <CTableHeaderCell style={{ color: '#fff' }} scope="col">
                            Shipments
                          </CTableHeaderCell>

                          <CTableHeaderCell style={{ color: '#fff' }} scope="col">
                            Income
                          </CTableHeaderCell>

                          <CTableHeaderCell style={{ color: '#fff' }} scope="col">
                            Expenses
                          </CTableHeaderCell>

                          <CTableHeaderCell style={{ color: '#fff' }} scope="col">
                            Profit / Loss
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Shipment 1</CTableHeaderCell>

                          <CTableDataCell>15000</CTableDataCell>

                          <CTableDataCell>13000</CTableDataCell>

                          <CTableDataCell>2000</CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCol>
                </CRow>
                <CRow className="py-2">
                  <CCol style={{ display: 'flex', justifyContent: 'center' }}>
                    <h3>Shipment 1 </h3>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs={12} md={4}>
                    <CTable>
                      <CTableHead style={{ background: '#4D3227' }}>
                        <CTableRow>
                          <CTableHeaderCell
                            style={{ color: '#fff', textAlign: 'center' }}
                            colSpan="2"
                            scope="col"
                          >
                            Income
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Freight Income</CTableHeaderCell>
                          <CTableDataCell>20000</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Halting Charges</CTableHeaderCell>
                          <CTableDataCell>15000</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Penality</CTableHeaderCell>
                          <CTableDataCell>11000</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Total Income</CTableHeaderCell>
                          <CTableDataCell>54000</CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCol>
                  <CCol xs={12} md={4}>
                    <CTable>
                      <CTableHead style={{ background: '#4D3227' }}>
                        <CTableRow>
                          <CTableHeaderCell
                            style={{ color: '#fff', textAlign: 'center' }}
                            colSpan="2"
                            scope="col"
                          >
                            Expenses
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Halting Charges</CTableHeaderCell>
                          <CTableDataCell>20000</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Toll Amount</CTableHeaderCell>
                          <CTableDataCell>3500</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Bata</CTableHeaderCell>
                          <CTableDataCell>2000</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Additional Bata</CTableHeaderCell>
                          <CTableDataCell>750</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Maintenance Charges</CTableHeaderCell>
                          <CTableDataCell>2250</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Total</CTableHeaderCell>
                          <CTableDataCell>54000</CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCol>
                  <CCol xs={12} md={4}>
                    <CTable>
                      <CTableHead style={{ background: '#4D3227' }}>
                        <CTableRow>
                          <CTableHeaderCell
                            style={{ color: '#fff', textAlign: 'center' }}
                            colSpan="2"
                            scope="col"
                          >
                            Mileage (KM)
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Standard Mileage</CTableHeaderCell>
                          <CTableDataCell>15000</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Actual Mileage</CTableHeaderCell>
                          <CTableDataCell>15320</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Difference</CTableHeaderCell>
                          <CTableDataCell>320</CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                    <CCard>
                      <h2 className="p-3">Profit : 38500</h2>
                    </CCard>
                  </CCol>
                </CRow>
              </CContainer>
            </CTabPane>
          </CTabContent>

          <CRow>
            <CCol className="mt-3 py-2" xs={12} sm={12} md={3}>
              <CButton size="sm" color="primary" className="text-white" type="button">
                <Link className="text-white" to="/TripSheetSettleMentHome">
                  Previous
                </Link>
              </CButton>
            </CCol>
            <CCol className="mt-3 offset-md-7  py-2" xs={12} sm={12} md={2}>
              <CButton size="sm" color="warning" className="mx-3 text-white" type="submit">
                Trip Settlement
              </CButton>
            </CCol>
          </CRow>
        </CTabPane>
      </CTabContent>
    </CCard>
  )
}

export default TripSheetSettleMentSTO
