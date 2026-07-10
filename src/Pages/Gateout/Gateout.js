import { React, useState } from 'react'
import useForm from 'src/Hooks/useForm'
import {
  CButton,
  CCard,
  CCardImage,
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
import validate from 'src/Validations/FormValidation'
import { Link } from 'react-router-dom'
const Gateout = () => {

  const formValues = {
    vehicleType: '',
    OdometerKm: '',
    odometerPhoto: '',
  }
  const [activeKey, setActiveKey] = useState(1)
  const [activeKeySub, setactiveKeySub] = useState(1)

  const [OdometerPhoto, setOdometerPhoto] = useState(false)
  const [ClosingOdometerPhoto, setClosingOdometerPhoto] = useState(false)
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
                  <CFormLabel htmlFor="inputAddress">Vehicle Type</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="Own" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Vechicle No</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="TN48DE3902" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Vechicle Capacity</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="10 TON" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">VA Number</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="11123" readOnly />
                </CCol>
              </CRow>

              <CRow className="">
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Driver Name</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="Alvin" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Driver Cell No</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="8964386585" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Odometer KM</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="13133" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">
                    Odometer Photo
                    {errors.vehicleType && (
                      <span className="help text-danger">{errors.vehicleType}</span>
                    )}
                  </CFormLabel>
                  <div className="d-grid gap-">
                    <CButton
                      onClick={() => setOdometerPhoto(!OdometerPhoto)}
                      size="sm"
                      color="info"
                      id="inputAddress"
                    // value="view"
                    // readOnly
                    >
                      <span className="float-start">
                        <i className="fa fa-eye"></i> view
                      </span>
                    </CButton>
                  </div>
                  <CModal visible={OdometerPhoto} onClose={() => setOdometerPhoto(false)}>
                    <CModalHeader>
                      <CModalTitle>Odometer Photo</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                      <CCardImage
                        orientation="top"
                        src=""
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
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Gate-In Time</CFormLabel>

                  <CFormInput
                    size="sm"
                    id="inputAddress"
                    value="21 Sep 2021 12:00:00 PM"
                    readOnly
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Inspection Time</CFormLabel>

                  <CFormInput
                    size="sm"
                    id="inputAddress"
                    value="21 Sep 2021 12:00:00 PM"
                    readOnly
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Doc. Verify Time</CFormLabel>

                  <CFormInput
                    size="sm"
                    id="inputAddress"
                    value="21 Sep 2021 12:00:00 PM"
                    readOnly
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Tripsheet No</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="102501" readOnly />
                </CCol>
              </CRow>

              <CRow className="mb-md-3">
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Shed Name</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="GODOWN" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Owner Name</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="NAGARAJ" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Owner Cell No</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="9898987676" readOnly />
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <Link to="/GateIn">
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
                    Gate Out
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

export default Gateout
