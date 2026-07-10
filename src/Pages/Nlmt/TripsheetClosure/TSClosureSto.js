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
import validate from 'src/Utils/Validation'
import CustomTable from '../../components/customComponent/CustomTable'
const TSClosureSto = () => {
  const formValues = {
    vehicleType: '',
    OdometerKm: '',
  }

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    login,
    validate,
    formValues
  )

  function login() {
    alert('No Errors CallBack Called')
  }

  const [activeKey, setActiveKey] = useState(1)
  return (
    <>
      <CForm className="row" onSubmit={handleSubmit}>
        <CCard>
          <CTabContent className="m-1">
            {/* <CNav component="nav" > */}
            <CNav variant="tabs" role="tablist">
              <CNavItem>
                <CNavLink
                  href="javascript:void (0);"
                  active={activeKey === 1}
                  onClick={() => setActiveKey(1)}
                >
                  General Information
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey === 2}
                  onClick={() => setActiveKey(2)}
                >
                  Delivery Information
                </CNavLink>
              </CNavItem>
            </CNav>

            <CTabPane role="tabpanel" aria-labelledby="Page1-tab" visible={activeKey === 1}>
              <CRow className="mt-2">
                <CCol md={3}>
                  <CFormLabel htmlFor="inputAddress">Vehicle Number*</CFormLabel>
                  <CFormSelect size="sm" aria-label="Small select example">
                    <option hidden>Select</option>

                    <option value="1">TN45AT8614</option>

                    <option value="2">TN45AT8612</option>

                    <option value="3">TN45AT9687</option>
                  </CFormSelect>
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Vehicle Capacity</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" readOnly />
                </CCol>
                {/* <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Tripsheet No.</CFormLabel>

                  <CFormInput size="sm" id="inputAddress"  readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">TS Date & Time</CFormLabel>

                  <CFormInput size="sm" id="inputAddress"  readOnly />
                </CCol> */}
                <CCol md={3}>
                  <CFormLabel htmlFor="inputAddress">Driver Name*</CFormLabel>
                  <CFormSelect size="sm" aria-label="Small select example">
                    <option hidden>Select Vehicle Number</option>

                    <option value="1">Arun</option>

                    <option value="2">Balu</option>

                    <option value="3">Kannan</option>
                  </CFormSelect>
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Driver Code</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Driver Mobile Number</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Opening KM</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Opening Odometer Photo</CFormLabel>
                  <CButton
                    // onClick={() => setVisible(!visible)}
                    className="w-100"
                    color="info"
                    size="sm"
                  >
                    <span className="float-start">
                      <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                    </span>
                  </CButton>
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Tripsheet Number</CFormLabel>
                  <CFormInput size="sm" id="inputAddress" readOnly />
                </CCol>
              </CRow>

              <CRow className="">
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Tripsheet Date & Time</CFormLabel>
                  <CFormInput type="datetime-local" size="sm" id="inputAddress" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Closing KM*</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Closing Odometer Photo*</CFormLabel>

                  <CFormInput type="file" size="sm" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Trip KM</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" readOnly />
                </CCol>
              </CRow>

              <CRow className="">
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Other Charges*</CFormLabel>
                  <CFormSelect size="sm" aria-label="Small select example">
                    <option hidden>Select...</option>
                    <option>Select-LP</option>
                  </CFormSelect>
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Other Charges*</CFormLabel>
                  <CFormInput size="sm" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Trip Expense Sheet*</CFormLabel>

                  <CFormInput type="file" size="sm" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Driver Bata*</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" />
                </CCol>
              </CRow>

              <CRow className="">
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Misc Exp.*</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Municipal charges*</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Diesel Qty.</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Diesel Rate</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="100" readOnly />
                </CCol>
              </CRow>

              <CRow className="">
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Diesel Amount</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" readOnly />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Diesel Invoice*</CFormLabel>

                  <CFormInput type="file" size="sm" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="inputAddress">Total Diesel Consume*</CFormLabel>

                  <CFormInput type="text" size="sm" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="remarks">Remarks*</CFormLabel>
                  <CFormTextarea
                    name="remarks"
                    id="exampleFormControlTextarea1"
                    rows="1"
                  ></CFormTextarea>
                </CCol>
              </CRow>
            </CTabPane>

            <CTabPane role="tabpanel" aria-labelledby="Page2-tab" visible={activeKey === 2}>
              <CRow className="mt-2" hidden>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Invoice Number</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="123456" readOnly />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Delivery Date*</CFormLabel>

                  <CFormInput size="sm" type="date" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Delivery Time*</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" type="time" />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Load Charges</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Tarpaulin Charges</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">FJ POD Copy</CFormLabel>
                  <CFormInput type="file" name="fjPod1" size="sm" id="formFileSm" />

                  {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                </CCol>
              </CRow>

              <CRow className="" hidden>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Invoice Number</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="123456" readOnly />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Delivery Date</CFormLabel>

                  <CFormInput size="sm" type="date" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Delivery Time</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" type="time" />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Load Charges</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Tarpaulin Charges</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">FJ POD Copy</CFormLabel>
                  <CFormInput type="file" name="fjPod1" size="sm" id="formFileSm" />

                  {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                </CCol>
              </CRow>

              <CRow className="" hidden>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Invoice Number</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" value="123456" readOnly />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Delivery Date</CFormLabel>

                  <CFormInput size="sm" type="date" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Delivery Time</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" type="time" />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Load Charges</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">Tarpaulin Charges</CFormLabel>

                  <CFormInput size="sm" id="inputAddress" />
                </CCol>
                <CCol xs={12} md={2}>
                  <CFormLabel htmlFor="inputAddress">FJ POD Copy</CFormLabel>
                  <CFormInput type="file" name="fjPod1" size="sm" id="formFileSm" />

                  {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                </CCol>
              </CRow>

              <CRow className="mt-3">
                <CCol className="" xs={12} sm={12} md={3}>
                  <CButton size="sm" color="primary" className="text-white" type="submit">
                    Previous
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
                    disabled={enableSubmit}
                    className="text-white"
                    type="submit"
                  >
                    Close Tripsheet
                  </CButton>
                </CCol>
              </CRow>
            </CTabPane>
          </CTabContent>
        </CCard>
      </CForm>
    </>
  )
}

export default TSClosureSto
