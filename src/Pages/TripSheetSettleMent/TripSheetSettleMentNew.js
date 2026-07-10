/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CTableCaption,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CModal,
  CModalHeader,
  CModalTitle,
  CTabPane,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CFormFloating,
  CNavbar,
  CTableRow,
  CFormTextarea,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
// import Select from 'react-select';
// import CModal from '@coreui/react/src/components/modal/CModal'
import useForm from 'src/Hooks/useForm'
import validate from 'src/Utils/Validation'
import CustomTable from '../../components/customComponent/CustomTable'

const TSSettlement = () => {
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

  const [mainKey, setMainKey] = useState(1)
  const [activeKey, setActiveKey] = useState(1)
  const [activeKey_2, setActiveKey_2] = useState(1)
  const [visible, setVisible] = useState(false)
  const [visible1, setVisible1] = useState(false)
  const [adharvisible, setAdharVisible] = useState(false)
  const [adhardel, setAdhardel] = useState(false)
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ]
  const [deliveryNumber, setSelectedDeliveryNumber] = useState([])

  const selecthandleChange = (e) => {
    console.log(e.value)
    // setSelectedDeliveryNumber({[...deliveryNumber, e.value]});
  }

  useEffect(() => {
    console.log(deliveryNumber)
  }, [deliveryNumber])
  return (
    <>
      <CCard className="p-1">
        <CNav variant="tabs" role="tablist">
          <CNavItem>
            <CNavLink
              href="javascript:void(0);"
              active={mainKey === 1}
              onClick={() => setMainKey(1)}
            >
              For Hire Vehicle
            </CNavLink>
          </CNavItem>

          <CNavItem>
            <CNavLink
              href="javascript:void(0);"
              active={mainKey === 2}
              onClick={() => setMainKey(2)}
            >
              For Own & Contract Vehicle
            </CNavLink>
          </CNavItem>
        </CNav>

        <CTabContent className="p-3">
          <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={mainKey === 1}>
            <CNav variant="tabs" role="tablist">
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
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
                  FJ Information
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey === 4}
                  onClick={() => setActiveKey(4)}
                >
                  STO Information
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey === 7}
                  onClick={() => setActiveKey(7)}
                >
                  Freight
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey === 5}
                  onClick={() => setActiveKey(5)}
                >
                  Diesel Information
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey === 6}
                  onClick={() => setActiveKey(6)}
                >
                  Return
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey === 3}
                  onClick={() => setActiveKey(3)}
                >
                  Expenses / Income
                </CNavLink>
              </CNavItem>
            </CNav>

            <CTabContent>
              <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                <CRow className="mt-2">
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="tNum">Tripsheet Number</CFormLabel>

                    <CFormInput size="sm" id="tNum" readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>

                    <CFormInput size="sm" id="vNum"  readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vCap">Vehicle Capacity</CFormLabel>

                    <CFormInput size="sm" id="vCap"  readOnly />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>

                    <CFormInput size="sm" id="vType" readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="dName">Driver Name</CFormLabel>

                    <CFormInput size="sm" id="dName" readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="dMob">Driver Cell Number</CFormLabel>

                    <CFormInput size="sm" id="dMob" readOnly />
                  </CCol>

                  {/* <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="inputAddress">Odometer Opening KM</CFormLabel>

                    <CFormInput size="sm" id="inputAddress" value="189736" readOnly />
                  </CCol> */}
                  {/* </CRow>
                <CModal visible={visible} onClose={() => setVisible(false)}>
                  <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Modal title</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <h2>Odometer Photo View</h2>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="primary" onClick={() => setVisible(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                <CModal visible={visible1} onClose={() => setVisible1(false)}>
                  <CModalHeader onClose={() => setVisible1(false)}>
                    <CModalTitle>Modal title</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <h2>Invoice Copy View</h2>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="primary" onClick={() => setVisible1(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                <CRow className="">
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="inputAddress">Odometer Opening Photo</CFormLabel>
                    <div className="d-grid gap-2">
                      <CButton
                        className="text-justify"
                        color="info"
                        size="sm"
                        onClick={() => setVisible(!visible)}
                      >
                        <span className="float-start">
                          <i className="fa fa-eye"></i> &nbsp; View
                        </span>
                      </CButton>
                    </div>
                  </CCol> */}

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>

                    <CFormInput
                      size="sm"
                      id="gateInDateTime"
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="inspectionDateTime">Vehicle Inspection Date & Time</CFormLabel>

                    <CFormInput
                      size="sm"
                      id="inspectionDateTime"
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="verifyDate">Doc. Verification Date & Time</CFormLabel>

                    <CFormInput
                      size="sm"
                      id="verifyDate"
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="shedName">Shed Name</CFormLabel>

                    <CFormInput size="sm" id="shedName" readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="ownerName">Owner Name</CFormLabel>

                    <CFormInput size="sm" id="ownerName" readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="ownerMob">Owner Cell Number</CFormLabel>

                    <CFormInput size="sm" id="ownerMob"readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="gateoutDate">Gate Out Date & Time</CFormLabel>

                    <CFormInput
                      size="sm"
                      id="gateoutDate"
                      readOnly
                    />
                  </CCol>
                </CRow>
              </CTabPane>

              <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
                <CRow className="mt-2" hidden>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="sNum">Shipment Number</CFormLabel>

                    <CFormInput size="sm" id="sNum" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="sInvoice">Invoice Number</CFormLabel>

                    <CFormInput size="sm" id="sInvoice" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="cNum">Customer Number</CFormLabel>

                    <CFormInput size="sm" id="cNum" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="sDelivery">Delivery Date & Time</CFormLabel>

                    <CFormInput size="sm" type="datetime-local" id="sDelivery" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="fjPod">FJ POD Copy</CFormLabel>
                    <CFormInput type="file" name="fjPod" size="sm" id="fjPod" />

                    {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor="DefectType">
                      Defect Type*{' '}
                      {errors.DefectType && (
                        <span className="small text-danger">{errors.DefectType}</span>
                      )}
                    </CFormLabel>

                    <CFormSelect
                      size="sm"
                      name="DefectType"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.DefectType}
                      className={`${errors.DefectType && 'is-invalid'}`}
                      aria-label="Small select example"
                      id='DefectType'
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">Shortage</option>
                      <option value="2">Rain Damage</option>
                      <option value="3">Sales Diversion</option>
                      <option value="4">Sales Return</option>
                      <option value="4">Halting</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className="" hidden>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="sNum1">Shipment Number</CFormLabel>

                    <CFormInput size="sm" id="sNum1" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="sInvoice1">Invoice Number</CFormLabel>

                    <CFormInput size="sm" id="sInvoice1" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="cNum1">Customer Number</CFormLabel>

                    <CFormInput size="sm" id="cNum1" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="sDelivery1">Delivery Date & Time</CFormLabel>

                    <CFormInput size="sm" type="datetime-local" id="sDelivery" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="fjPod2">FJ POD Copy</CFormLabel>
                    <CFormInput type="file" name="fjPod2" size="sm" id="fjPod2" />

                    {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor="DefectType2">
                      Defect Type*{' '}
                      {errors.DefectType2 && (
                        <span className="small text-danger">{errors.DefectType2}</span>
                      )}
                    </CFormLabel>

                    <CFormSelect
                      size="sm"
                      name="DefectType2"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.DefectType2}
                      className={`mb-3 ${errors.DefectType2 && 'is-invalid'}`}
                      aria-label="Small select example"
                      id='DefectType2'
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">Shortage</option>
                      <option value="2">Rain Damage</option>
                      <option value="3">Sales Diversion</option>
                      <option value="4">Sales Return</option>
                      <option value="4">Halting</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 4}>
                <CRow className="mt-2" hidden>
                  <CCol md={2}>
                    <CFormLabel htmlFor="stoNum">
                      STO Delivery Number{' '}
                      {errors.stoNum && <span className="small text-danger">{errors.stoNum}</span>}
                    </CFormLabel>
                    <CFormInput size="sm" id="stoNum" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="fromLoc">From Location</CFormLabel>
                    <CFormInput size="sm" id="fromLoc"  readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="toLoc">To Location</CFormLabel>
                    <CFormInput size="sm" type="" id="toLoc" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="sfreight">Freight Amount</CFormLabel>

                    <CFormInput size="sm" id="sfreight" type="" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="sdate">Delivery Date and Time</CFormLabel>

                    <CFormInput size="sm" type="datetime-local" id="sdate" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="fjPod1">POD Copy</CFormLabel>
                    <CFormInput type="file" name="fjPod1" size="sm" id="fjPod1" />

                    {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="inputAddress">Expense To Be Capture</CFormLabel>

                    <CTableDataCell scope="row">
                      <input type="checkbox" name="name2" />
                    </CTableDataCell>
                  </CCol>
                </CRow>

                <CButton color="primary">Add</CButton>
              </CTabPane>
              <br />
              <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 7}>
                <CTable caption="top" hover>
                  <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                    <CTableRow>
                      <CTableHeaderCell scope="col"  style={{ color: 'white' }}>
                        Load Tonnage
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Total Freight Amount
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Advance in Diesel
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Advance in Bank
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Total Advance
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Balance
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" Value="15" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" Value="25000" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress"  readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" Value="20000" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" Value="20000" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" Value="5000" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 5}>
                <CRow className="mt-2" hidden>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dVendor">Diesel Vendor</CFormLabel>

                    <CFormInput size="sm" id="dVendor"  readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dLtr">Diesel Liter</CFormLabel>

                    <CFormInput size="sm" id="dLtr"  readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="rateLtr">Rate Per Liter</CFormLabel>

                    <CFormInput size="sm" type="" id="rateLtr" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dAmount">Total Amount</CFormLabel>

                    <CFormInput size="sm" id="dAmount" type=""  readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="invoiceDate">Invoice Date & Time</CFormLabel>

                    <CFormInput
                      size="sm"
                      id="invoiceDate"
                      type="datetime-local"
                      readOnly
                    />
                  </CCol>
                  {!adhardel && (
                    <CCol xs={12} md={2}>
                      <CFormLabel htmlFor="invoiceCopy">
                        Invoice Copy
                        {errors.invoiceCopy && (
                          <span className="small text-danger">{errors.invoiceCopy}</span>
                        )}
                      </CFormLabel>
                      <CButton
                        // onClick={() => setAdharVisible(!adharvisible)}
                        className="w-100 m-0"
                        color="info"
                        size="sm"
                        id="invoiceCopy"
                      >
                        <span
                          className="float-start"
                          onClick={() => setAdharVisible(!adharvisible)}
                        >
                          <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                        </span>
                        <span
                          className="float-end"
                          onClick={() => {
                            if (window.confirm('Are you sure to remove this file?')) {
                              setAdhardel(true)
                            }
                          }}
                        >
                          <i
                            className="fa fa-trash"
                            aria-hidden="true"
                            // onMouseOver={changeBackground}
                            // onMouseLeave={changeBackground1}
                          ></i>
                        </span>
                      </CButton>
                    </CCol>
                  )}
                  {adhardel && (
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="AadharCard">Invoice copy*</CFormLabel>
                      <CFormInput type="file" name="AadharCard" size="sm" id="" />
                    </CCol>
                  )}
                </CRow>
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 6}>
                <CRow className="mt-2" hidden>
                  <CCol md={2}>
                    <CFormLabel htmlFor="sNum">
                      Shipment Number{' '}
                      {errors.sNum && (
                        <span className="small text-danger">{errors.sNum}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="sNum"
                      id='sNum'
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.sNum}
                      className={`${errors.sNum && 'is-invalid'}`}
                      aria-label="Small select example"
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">11111</option>
                      <option value="2">22222</option>
                      <option value="3">33333</option>
                    </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="deliveryNum">
                      Delivery Number{' '}
                      {errors.deliveryNum && (
                        <span className="small text-danger">{errors.deliveryNum}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="deliveryNum"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.deliveryNum}
                      className={`${errors.deliveryNum && 'is-invalid'}`}
                      aria-label="Small select example"
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">11111</option>
                      <option value="2">22222</option>
                      <option value="3">33333</option>
                    </CFormSelect>
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="returnTo">
                      Return To{' '}
                      {errors.returnTo && (
                        <span className="small text-danger">{errors.returnTo}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="returnTo"
                      id='returnTo'
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.returnTo}
                      className={`${errors.returnTo && 'is-invalid'}`}
                      aria-label="Small select example"
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">NLFD</option>
                      <option value="2">NLFA</option>
                      <option value="3">NLCD</option>
                      <option value="4">NLMD</option>
                      <option value="5">NLDV</option>
                    </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="returnQty">Retun QTY in Tons</CFormLabel>

                    <CFormInput size="sm" type="" id="returnQty" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="returnRate">Return Rate Per Ton</CFormLabel>

                    <CFormInput size="sm" id="returnRate" type=""  readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="returnFreight">Return Freight Amount</CFormLabel>

                    <CFormInput size="sm" id="returnFreight" type="" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dPod">Diverted POD</CFormLabel>
                    <CFormInput type="file" name="dPod" size="sm" id="dPod" />

                    {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                  </CCol>
                </CRow>
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 3}>
                <CTable caption="top" style={{ height: '75vh' }} hover>
                  <CTableCaption style={{ color: 'maroon' }}>Expenses</CTableCaption>

                  <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                    <CTableRow>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        S.No
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Type
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        FJ Delivery
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        RJ Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        STO Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Total
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    <CTableRow>
                      <CTableHeaderCell scope="row"></CTableHeaderCell>
                      <CTableDataCell>Division</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" Value="NLFD" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" Value="NLFD" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" Value="NLFD" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" Value="NLFD" id="inputAddress" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">1</CTableHeaderCell>
                      <CTableDataCell>Unloading Charges (Excess)*</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>Subdelivery Charges*</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">3</CTableHeaderCell>
                      <CTableDataCell>Weighment Charges*</CTableDataCell>

                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">4</CTableHeaderCell>
                      <CTableDataCell>Freight Charges</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="2500" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="2000" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="2500" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="2000" readOnly />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">5</CTableHeaderCell>
                      <CTableDataCell>Stock Diversion / Return Charges*</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">6</CTableHeaderCell>
                      <CTableDataCell>Halting Charges*</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <CTable caption="top" style={{ height: '30vh' }} hover>
                  <CTableCaption style={{ color: 'maroon' }}>Income</CTableCaption>
                  <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                    <CTableRow>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        S.No
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Type
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        FJ Delivery
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        RJ Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        STO Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Total
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    <CTableRow>
                      <CTableHeaderCell scope="row">1</CTableHeaderCell>
                      <CTableDataCell>Base Freight</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="Auto" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="Auto" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="Auto" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="Auto" readOnly />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>Additional Freight</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <CTable caption="top" style={{ height: '40vh' }} hover>
                  <CTableCaption style={{ color: 'maroon' }}>Profit and Loss</CTableCaption>
                  <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                    <CTableRow>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        S.No
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Type
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        FJ Delivery
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        RJ Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        STO Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Total
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    <CTableRow>
                      <CTableHeaderCell scope="row">1</CTableHeaderCell>
                      <CTableDataCell>Income</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>Expense</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">3</CTableHeaderCell>
                      <CTableDataCell>Profit and Loss</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <CTable caption="top" style={{ height: '40vh' }} hover>
                  <CTableCaption style={{ color: 'maroon' }}>Others</CTableCaption>
                  <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                    <CTableRow>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        S.No
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Type
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        FJ Delivery
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        RJ Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        STO Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Total
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    <CTableRow>
                      <CTableHeaderCell scope="row">1</CTableHeaderCell>
                      <CTableDataCell>Halt Days*</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>Attachment 1</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">3</CTableHeaderCell>
                      <CTableDataCell>Attachment 2</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <CRow className="mt-2">
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="remarks">Remarks*</CFormLabel>
                    <CFormTextarea
                      name="remarks"
                      id="exampleFormControlTextarea1"
                      rows="1"
                    ></CFormTextarea>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol
                    className="offset-md-9"
                    xs={12}
                    sm={12}
                    md={3}
                    // style={{ display: 'flex', justifyContent: 'space-between' }}
                    style={{ display: 'flex', flexDirection: 'row-reverse', cursor: 'pointer' }}
                  >
                    <CButton
                      size="sm"
                      color="warning"
                      // disabled={enableSubmit}
                      className="mx-3 text-white"
                      // className="align-self-end ml-auto"
                      type="submit"
                    >
                      Close Tripsheet
                    </CButton>
                  </CCol>
                </CRow>
              </CTabPane>
            </CTabContent>
          </CTabPane>

          <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={mainKey === 2}>
            <CNav variant="tabs" role="tablist">
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey_2 === 1}
                  onClick={() => setActiveKey_2(1)}
                >
                  General Information
                </CNavLink>
              </CNavItem>

              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey_2 === 2}
                  onClick={() => setActiveKey_2(2)}
                >
                  FJ & RJ Information
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey_2 === 4}
                  onClick={() => setActiveKey_2(4)}
                >
                  STO Information
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey_2 === 5}
                  onClick={() => setActiveKey_2(5)}
                >
                  Diesel Information
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey_2 === 8}
                  onClick={() => setActiveKey_2(8)}
                >
                  Gate Pass
                </CNavLink>
              </CNavItem>
              <CNavItem></CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey_2 === 6}
                  onClick={() => setActiveKey_2(6)}
                >
                  Return
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey_2 === 3}
                  onClick={() => setActiveKey_2(3)}
                >
                  Expenses / Income
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey_2 === 7}
                  onClick={() => setActiveKey_2(7)}
                >
                  Advance
                </CNavLink>
              </CNavItem>
            </CNav>

            <CTabContent>
              <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey_2 === 1}>
                <CRow className="mt-2">
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="tNum1">Tripsheet Number</CFormLabel>
                    <CFormInput size="sm" id="tNum1" value="700012" readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vNum1">Vehicle Number</CFormLabel>

                    <CFormInput size="sm" id="vNum1" value="TN48DE3902" readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vCap1">Vehicle Capacity</CFormLabel>

                    <CFormInput size="sm" id="vCap1" value="10 TON" readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vType1">Vehicle Type</CFormLabel>

                    <CFormInput size="sm" id="vType1" value="Own" readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="dName1">Driver Name</CFormLabel>

                    <CFormInput size="sm" id="dName1" value="NAGARAJ" readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="dMob1">Driver Mobile Number</CFormLabel>

                    <CFormInput size="sm" id="dMob1" value="8525097921" readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="OdometerKM">Odometer Opening KM</CFormLabel>

                    <CFormInput size="sm" id="OdometerKM" value="189736" readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="odoImg">Odometer Opening KM</CFormLabel>

                    <div className="d-grid gap-2">
                      <CButton
                        className="text-justify"
                        color="info"
                        size="sm"
                        id='odoImg'
                        onClick={() => setVisible(!visible)}
                      >
                        <span className="float-start">
                          <i className="fa fa-eye"></i> &nbsp; View
                        </span>
                      </CButton>
                    </div>
                  </CCol>
                  {/* <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="inputAddress">Gate-In Time</CFormLabel>

                    <CFormInput
                      size="sm"
                      id="inputAddress"
                      value="21 Sep 2021 12:00:00 PM"
                      readOnly
                    />
                  </CCol> */}
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="inspectionDateTime">Inspection Date Time</CFormLabel>
                    <CFormInput
                      size="sm"
                      id="inspectionDateTime"
                      value="21 Sep 2021 12:00:00 PM"
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="verifyDate">Doc. Verify Time</CFormLabel>

                    <CFormInput
                      size="sm"
                      id="verifyDate"
                      value="21 Sep 2021 12:00:00 PM"
                      readOnly
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="gateOut">Gate Out Date & Time</CFormLabel>

                    <CFormInput
                      size="sm"
                      id="gateOut"
                      value="21 Sep 2021 02:00:00 PM"
                      readOnly
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="gateInDateTime">Gate-In Time</CFormLabel>

                    <CFormInput
                      size="sm"
                      id="gateInDateTime"
                      value="24 Sep 2021 12:00:00 PM"
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="closingKM">Closing KM</CFormLabel>

                    <CFormInput size="sm" id="closingKM" value="198625" readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="codoKM">Odometer Closing KM</CFormLabel>

                    <div className="d-grid gap-2">
                      <CButton
                        className="text-justify"
                        color="info"
                        size="sm"
                        id='codoKM'
                        onClick={() => setVisible(!visible)}
                      >
                        <span className="float-start">
                          <i className="fa fa-eye"></i> &nbsp; View
                        </span>
                      </CButton>
                    </div>
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="tripKM" >Trip KM</CFormLabel>

                    <CFormInput size="sm" id="tripKM" value="8889" readOnly />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="budgetKM">Budgeted KM</CFormLabel>

                    <CFormInput size="sm" id="budgetKM" value="8800" />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="actualKM">Actual KM</CFormLabel>

                    <CFormInput size="sm" id="actualKM" value="8880" />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="diffKM">Diff. KM</CFormLabel>

                    <CFormInput size="sm" id="diffKM" value="80" readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="idlehrs">Idle Hrs</CFormLabel>

                    <CFormInput size="sm" id="idlehrs" value="4" />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="budgetMileage">Budged Mileage</CFormLabel>

                    <CFormInput size="sm" id="budgetMileage" value="5" />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="actalMileage">Actual Mileage</CFormLabel>

                    <CFormInput size="sm" id="actalMileage" value="4" />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="diffmil">Diff. Mileage</CFormLabel>

                    <CFormInput size="sm" id="diffmil" value="1" readOnly />
                  </CCol>
                </CRow>

                {/* <CRow className="">
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="inputAddress">Total Diesel Consume</CFormLabel>

                    <CFormInput size="sm" id="inputAddress" value="2" readOnly />
                  </CCol>
                </CRow> */}
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey_2 === 2}>
                <CRow className="mt-2" hidden>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="sNum2">Shipment Number</CFormLabel>

                    <CFormInput size="sm" id="sNum2" value="123456" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="sInvoice2">Invoice Number</CFormLabel>

                    <CFormInput size="sm" id="sInvoice2" value="126788" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="cNum2">Customer Number</CFormLabel>

                    <CFormInput size="sm" id="cNum2" value="111111" readOnly />
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="sDelivery2">Delivery Date & Time</CFormLabel>

                    <CFormInput size="sm" type="datetime-local" id="sDelivery2" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="unload2">Unloading Charges</CFormLabel>

                    <CFormInput size="sm" id="unload2" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="fjPod2">FJ POD Copy</CFormLabel>
                    <CFormInput type="file" name="fjPod2" size="sm" id="fjPod2" />

                    {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor="DefectType3">
                      Defect Type*{' '}
                      {errors.DefectType && (
                        <span className="small text-danger">{errors.DefectType}</span>
                      )}
                    </CFormLabel>

                    <CFormSelect
                      size="sm"
                      name="DefectType3"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.DefectType}
                      className={`${errors.DefectType && 'is-invalid'}`}
                      aria-label="Small select example"
                      id='DefectType3'
                    >
                      <option >Select Types</option>

                      <option value="1">Unloading Charges</option>

                      <option value="2">Subdelivery Charges</option>

                      <option value="3">Halting Charges</option>

                      <option value="4">Low Tonnage</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
                <hr />
                <CRow className="mb-md-1" hidden>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="rNum">RJ SO Number</CFormLabel>

                    <CFormInput size="sm" id="rNum" value="1234762" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="rCustomer">Customer Number</CFormLabel>

                    <CFormInput size="sm" id="rCustomer" value="1123661" readOnly />
                  </CCol>
                  {/* <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="inputAddress" >Opening KM</CFormLabel>

                    <CFormInput size="sm" id="inputAddress" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="inputAddress">Closing KM</CFormLabel>

                    <CFormInput size="sm" id="inputAddress" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="inputAddress">Running KM</CFormLabel>

                    <CFormInput htmlFor="inputAddress" readOnly />
                  </CCol> */}
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="rDelivery">Delivery Date & Time</CFormLabel>

                    <CFormInput size="sm" type="datetime-local" id="rDelivery" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="rUnload">Unloading Charges</CFormLabel>

                    <CFormInput size="sm" id="rUnload" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="rPOD">RJ POD Copy</CFormLabel>
                    <CFormInput type="file" name="rPOD" size="sm" id="rPOD" />

                    {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor="DefectType4">
                      Defect Type*{' '}
                      {errors.DefectType && (
                        <span className="small text-danger">{errors.DefectType}</span>
                      )}
                    </CFormLabel>

                    <CFormSelect
                      size="sm"
                      name="DefectType"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.DefectType}
                      className={`${errors.DefectType && 'is-invalid'}`}
                      aria-label="Small select example"
                      id='DefectType4'
                    >
                      <option >Select Types</option>

                      <option value="1">Unloading Charges</option>

                      <option value="2">Subdelivery Charges</option>

                      <option value="3">Halting Charges</option>

                      <option value="4">Low Tonage</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey_2 === 4}>
                <CRow className="mt-2" hidden>
                  <CCol md={2}>
                    <CFormLabel htmlFor="stoNum1">
                      STO Delivery Number{' '}
                      {errors.STONo && <span className="small text-danger">{errors.STONo}</span>}
                    </CFormLabel>
                    <CFormInput size="sm" id="stoNum1" value="15487126" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="fLoc">From Location</CFormLabel>

                    <CFormInput size="sm" id="fLoc"  readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="tLoc">To Location</CFormLabel>

                    <CFormInput size="sm" type="" id="tLoc" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="fAmount">Freight Amount</CFormLabel>

                    <CFormInput size="sm" id="fAmount" type=""  readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dDate">Delivery Date and Time</CFormLabel>

                    <CFormInput size="sm" type="datetime-local" id="dDate" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="pod">POD Copy</CFormLabel>
                    <CFormInput type="file" name="pod" size="sm" id="pod" />

                    {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor="DriverName">
                      Driver Name{' '}
                      {errors.DriverName && (
                        <span className="small text-danger">{errors.DriverName}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="DefectType"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.DriverName}
                      className={`${errors.DriverName && 'is-invalid'}`}
                      aria-label="Small select example"
                      id='DriverName'
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">11111</option>
                      <option value="2">22222</option>
                      <option value="3">33333</option>
                    </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="inputAddress">Expense To Be Capture</CFormLabel>

                    <CTableDataCell scope="row">
                      <input type="checkbox" name="name2" />
                    </CTableDataCell>
                  </CCol>
                </CRow>

                <CButton color="primary">Add</CButton>
                <hr />
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey_2 === 5}>
                <CRow className="mt-2" hidden>
                  <CCol xs={12} md={3}>
                    <CFormLabel
                      htmlFor="inputAddress"
                      style={{
                        backgroundColor: '#4d3227',
                        color: 'white',
                      }}
                    >
                      Diesel Filling :{' '}
                    </CFormLabel>
                  </CCol>
                </CRow>
                <CRow className="mt-2" hidden>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dVendor1">Diesel Vendor</CFormLabel>

                    <CFormInput size="sm" id="dVendor1"  readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dltr1">Diesel Liter</CFormLabel>

                    <CFormInput size="sm" id="dltr1"  />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="rltr">Rate Per Liter</CFormLabel>

                    <CFormInput size="sm" type="" id="rltr" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="tAmount">Total Amount</CFormLabel>

                    <CFormInput size="sm" id="tAmount" type=""  readOnly />
                  </CCol>
                  {!adhardel && (
                    <CCol xs={12} md={2}>
                      <CFormLabel htmlFor="dInvoice">
                        Invoice Copy
                        {errors.dInvoice && (
                          <span className="small text-danger">{errors.dInvoice}</span>
                        )}
                      </CFormLabel>
                      <CButton
                        // onClick={() => setAdharVisible(!adharvisible)}
                        className="w-100 m-0"
                        color="info"
                        size="sm"
                        id="dInvoice"
                      >
                        <span
                          className="float-start"
                          onClick={() => setAdharVisible(!adharvisible)}
                        >
                          <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                        </span>
                        <span
                          className="float-end"
                          onClick={() => {
                            if (window.confirm('Are you sure to remove this file?')) {
                              setAdhardel(true)
                            }
                          }}
                        >
                          <i
                            className="fa fa-trash"
                            aria-hidden="true"
                            // onMouseOver={changeBackground}
                            // onMouseLeave={changeBackground1}
                          ></i>
                        </span>
                      </CButton>
                    </CCol>
                  )}
                  {adhardel && (
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="AadharCard">Aadhar Card*</CFormLabel>
                      <CFormInput type="file" name="AadharCard" size="sm" id="" />
                    </CCol>
                  )}
                  <CCol md={2}>
                    <CFormLabel htmlFor="dName4">
                      Driver Name{' '}
                      {errors.DriverName && (
                        <span className="small text-danger">{errors.DriverName}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="DefectType"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.DriverName}
                      className={`${errors.DriverName && 'is-invalid'}`}
                      aria-label="Small select example"
                      id='dName4'
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">11111</option>
                      <option value="2">22222</option>
                      <option value="3">33333</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className="mt-2" hidden>
                  <CCol md={2}>
                    <CFormLabel htmlFor="rVendor">
                      Registered Vendor{' '}
                      {errors.rVendor && (
                        <span className="small text-danger">{errors.rVendor}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="DefectType"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.rVendor}
                      className={`${errors.rVendor && 'is-invalid'}`}
                      aria-label="Small select example"
                      id='rVendor'
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">11111</option>
                      <option value="2">22222</option>
                      <option value="3">33333</option>
                    </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dltr2">Diesel Liter</CFormLabel>

                    <CFormInput size="sm" id="dltr2"  />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="rltr1">Rate Per Liter</CFormLabel>

                    <CFormInput size="sm" type="" id="rltr1" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="tamount">Total Amount</CFormLabel>

                    <CFormInput size="sm" id="tamount" type=""  readOnly />
                  </CCol>
                  {!adhardel && (
                    <CCol xs={12} md={2}>
                      <CFormLabel htmlFor="dinvoice">
                        Invoice Number
                        {errors.vehicleType && (
                          <span className="small text-danger">{errors.vehicleType}</span>
                        )}
                      </CFormLabel>
                      <CButton
                        // onClick={() => setAdharVisible(!adharvisible)}
                        className="w-100 m-0"
                        color="info"
                        size="sm"
                        id="dinvoice"
                      >
                        <span
                          className="float-start"
                          onClick={() => setAdharVisible(!adharvisible)}
                        >
                          <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                        </span>
                        <span
                          className="float-end"
                          onClick={() => {
                            if (window.confirm('Are you sure to remove this file?')) {
                              setAdhardel(true)
                            }
                          }}
                        >
                          <i
                            className="fa fa-trash"
                            aria-hidden="true"
                            // onMouseOver={changeBackground}
                            // onMouseLeave={changeBackground1}
                          ></i>
                        </span>
                      </CButton>
                    </CCol>
                  )}
                  {adhardel && (
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="AadharCard">Aadhar Card*</CFormLabel>
                      <CFormInput type="file" name="AadharCard" size="sm" id="" />
                    </CCol>
                  )}
                  <CCol md={2}>
                    <CFormLabel htmlFor="dname">
                      Driver Name{' '}
                      {errors.DriverName && (
                        <span className="small text-danger">{errors.DriverName}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="DefectType"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.DriverName}
                      className={`${errors.DriverName && 'is-invalid'}`}
                      aria-label="Small select example"
                      id='dname'
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">11111</option>
                      <option value="2">22222</option>
                      <option value="3">33333</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className="mt-2" hidden>
                  <CCol md={2}>
                    <CFormLabel htmlFor="uVendor">Unregistered Vendor</CFormLabel>

                    <CFormInput size="sm" id="uVendor"  />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dltr2">Diesel Liter</CFormLabel>

                    <CFormInput size="sm" id="dltr2"  />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="rltr2">Rate Per Liter</CFormLabel>

                    <CFormInput size="sm" type="" id="rltr2" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="tamount1">Total Amount</CFormLabel>

                    <CFormInput size="sm" id="tamount1" type=""  readOnly />
                  </CCol>
                  {!adhardel && (
                    <CCol xs={12} md={2}>
                      <CFormLabel htmlFor="dinvoice1">
                        Invoice Number
                        {errors.vehicleType && (
                          <span className="small text-danger">{errors.vehicleType}</span>
                        )}
                      </CFormLabel>
                      <CButton
                        // onClick={() => setAdharVisible(!adharvisible)}
                        className="w-100 m-0"
                        color="info"
                        size="sm"
                        id="dinvoice1"
                      >
                        <span
                          className="float-start"
                          onClick={() => setAdharVisible(!adharvisible)}
                        >
                          <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                        </span>
                        <span
                          className="float-end"
                          onClick={() => {
                            if (window.confirm('Are you sure to remove this file?')) {
                              setAdhardel(true)
                            }
                          }}
                        >
                          <i
                            className="fa fa-trash"
                            aria-hidden="true"
                            // onMouseOver={changeBackground}
                            // onMouseLeave={changeBackground1}
                          ></i>
                        </span>
                      </CButton>
                    </CCol>
                  )}
                  {adhardel && (
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="AadharCard">Aadhar Card*</CFormLabel>
                      <CFormInput type="file" name="AadharCard" size="sm" id="" />
                    </CCol>
                  )}
                  <CCol md={2}>
                    <CFormLabel htmlFor="dname2">
                      Driver Name{' '}
                      {errors.DriverName && (
                        <span className="small text-danger">{errors.DriverName}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="dname2"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.DriverName}
                      className={`${errors.DriverName && 'is-invalid'}`}
                      aria-label="Small select example"
                      id='dname2'
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">11111</option>
                      <option value="2">22222</option>
                      <option value="3">33333</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="mt-2" hidden>
                  <CCol xs={12} md={2}>
                    <CFormLabel
                      htmlFor="inputAddress"
                      style={{
                        backgroundColor: '#4d3227',
                        color: 'white',
                      }}
                    ></CFormLabel>
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dTotal">Total Diesel Liter</CFormLabel>

                    <CFormInput size="sm" id="dTotal"  readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dAverage">Average Rate Per Liter</CFormLabel>

                    <CFormInput size="sm" type="" id="dAverage" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dtAmount">Total Diesel Amount</CFormLabel>

                    <CFormInput size="sm" id="dtAmount" type=""  readOnly />
                  </CCol>
                </CRow>
                <hr />
                <CRow className="mt-2" hidden>
                  <CCol xs={12} md={3}>
                    <CFormLabel
                      htmlFor="inputAddress"
                      style={{
                        backgroundColor: '#4d3227',
                        color: 'white',
                      }}
                    >
                      Diesel Consumption & Runnnig KM :{' '}
                    </CFormLabel>
                  </CCol>
                </CRow>
                <CRow className="mt-2" hidden>
                  <CCol md={2}>
                    <CFormLabel htmlFor="fjNum">
                      Forward Journey Number{' '}
                      {errors.STONo && <span className="small text-danger">{errors.STONo}</span>}
                    </CFormLabel>
                    <CFormInput size="sm" id="fjNum" value="15487126" readOnly />
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dCons">Diesel Consumption QTY</CFormLabel>

                    <CFormInput size="sm" type="" id="dCons" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="aLtr">Average Rate/Liter</CFormLabel>

                    <CFormInput size="sm" type="" id="aLtr" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="tdAmt">Total Diesel Amount</CFormLabel>

                    <CFormInput size="sm" id="tdAmt" type=""  readOnly />
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="openKM">Opening KM</CFormLabel>

                    <CFormInput size="sm" id="openKM" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="closeKM">Closing KM</CFormLabel>

                    <CFormInput size="sm" id="closeKM" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="runKM">Running KM</CFormLabel>

                    <CFormInput size="sm" id="runKM" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="loadTon">Load Tonnage</CFormLabel>

                    <CFormInput size="sm" id='loadTon' readOnly />
                  </CCol>
                </CRow>
                <CRow className="mt-2" hidden>
                  <CCol md={2}>
                    <CFormLabel htmlFor="rjNum">
                      Return Journey Number{' '}
                      {errors.STONo && <span className="small text-danger">{errors.STONo}</span>}
                    </CFormLabel>
                    <CFormInput size="sm" id="rjNum" value="15423426" readOnly />
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dCons1">Diesel Consumption QTY</CFormLabel>

                    <CFormInput size="sm" type="" id="dCons1" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="aLtr1">Average Rate/Liter</CFormLabel>

                    <CFormInput size="sm" type="" id="aLtr1" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="tdLtr1">Total Diesel Amount</CFormLabel>

                    <CFormInput size="sm" id="tdLtr1" type=""  readOnly />
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="openKM1">Opening KM</CFormLabel>

                    <CFormInput size="sm" id="openKM1" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="closeKM1">Closing KM</CFormLabel>

                    <CFormInput size="sm" id="closeKM1" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="runKM1">Running KM</CFormLabel>

                    <CFormInput size="sm" id="runKM1" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="loadTon1">Load Tonnage</CFormLabel>

                    <CFormInput size="sm" id="loadTon1" readOnly />
                  </CCol>
                </CRow>
                <CRow className="mt-2" hidden>
                  <CCol md={2}>
                    <CFormLabel htmlFor="stonum">
                      STO Delivery Number{' '}
                      {errors.STONo && <span className="small text-danger">{errors.STONo}</span>}
                    </CFormLabel>
                    <CFormInput size="sm" id="stonum" value="15487126" readOnly />
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dCons2">Diesel Consumption QTY</CFormLabel>

                    <CFormInput size="sm" type="" id="dCons2" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="aLtr2">Average Rate/Liter</CFormLabel>

                    <CFormInput size="sm" type="" id="aLtr2" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="tdLtr2">Total Diesel Amount</CFormLabel>

                    <CFormInput size="sm" id="tdLtr2" type=""  readOnly />
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="openKM2">Opening KM</CFormLabel>

                    <CFormInput size="sm" id="openKM2" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="closeKM2">Closing KM</CFormLabel>

                    <CFormInput size="sm" id="closeKM2" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="runKM2">Running KM</CFormLabel>

                    <CFormInput size="sm" id="runKM2" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="loadTon2">Load Tonnage</CFormLabel>

                    <CFormInput size="sm" id="loadTon2" readOnly />
                  </CCol>
                </CRow>
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey_2 === 6}>
                <CRow className="mt-2" hidden>
                  <CCol md={2}>
                    <CFormLabel htmlFor="snum">
                      Shipment Number{' '}
                      {errors.DriverName && (
                        <span className="small text-danger">{errors.DriverName}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="snum"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={setSelectedDeliveryNumber}
                      className={`${errors.DriverName && 'is-invalid'}`}
                      aria-label="Small select example"
                      id='snum'
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">11111</option>
                      <option value="2">22222</option>
                      <option value="3">33333</option>
                    </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dnum">
                      Delivery Number{' '}
                      {errors.DriverName && (
                        <span className="small text-danger">{errors.DriverName}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="dnum"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={setSelectedDeliveryNumber}
                      className={`${errors.DriverName && 'is-invalid'}`}
                      aria-label="Small select example"
                      id='dnum'
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">11111</option>
                      <option value="2">22222</option>
                      <option value="3">33333</option>
                    </CFormSelect>
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="Return">
                      Return To{' '}
                      {errors.DriverName && (
                        <span className="small text-danger">{errors.DriverName}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="Return"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.DriverName}
                      className={`${errors.DriverName && 'is-invalid'}`}
                      aria-label="Small select example"
                      id='Return'
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">NLFD</option>
                      <option value="2">NLFA</option>
                      <option value="3">NLCD</option>
                      <option value="4">NLMD</option>
                      <option value="5">NLDV</option>
                    </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="returnqty">Return QTY in Tons</CFormLabel>

                    <CFormInput size="sm" type="" id="returnqty" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="rRate">Return Rate Per Ton</CFormLabel>

                    <CFormInput size="sm" id="rRate" type=""  readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="rFreight">Return Freight Amount</CFormLabel>

                    <CFormInput size="sm" id="rFreight" type="" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="dPOD">Diverted POD</CFormLabel>
                    <CFormInput type="file" name="dPOD" size="sm" id="dPOD" />

                    {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                  </CCol>
                </CRow>
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey_2 === 8}>
                <CRow className="mt-2" hidden>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="gPass">
                      Gate Pass Type{' '}
                      {errors.gPass && (
                        <span className="small text-danger">{errors.gPass}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="gPass"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.gPass}
                      className={`${errors.gPass && 'is-invalid'}`}
                      aria-label="Small select example"
                      id='gPass'
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">Returnable</option>
                      <option value="2">Non Returnable</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor="gNum">
                      Gate Pass Number{' '}
                      {errors.gNum && (
                        <span className="small text-danger">{errors.gNum}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="gNum"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.gNum}
                      className={`${errors.gNum && 'is-invalid'}`}
                      aria-label="Small select example"
                      id='gNum'
                    >
                      <option  hidden selected>
                        Select...
                      </option>
                      <option value="1">11111</option>
                      <option value="2">22222</option>
                      <option value="3">33333</option>
                    </CFormSelect>
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="floc">From Loacation</CFormLabel>

                    <CFormInput size="sm" type="" id="floc" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="tloc">To Location</CFormLabel>

                    <CFormInput size="sm" id="tloc" type="" readOnly />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="famt">Freight Amount</CFormLabel>
                    <CFormInput size="sm" id="famt" type="" />
                  </CCol>
                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="attach">Attachment</CFormLabel>
                    <CFormInput type="file" name="attach" size="sm" id="attach" />

                    {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                  </CCol>
                </CRow>
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey_2 === 3}>
                <CTable caption="top" hover style={{ height: '150vh' }}>
                  <CTableCaption style={{ color: 'maroon' }}>Expenses</CTableCaption>
                  <br />
                  <CTableHead
                    style={{
                      backgroundColor: '#4d3227',
                      color: 'white',
                    }}
                  >
                    <CTableRow>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        S.No
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Type
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        FJ Delivery
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        RJ Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        STO Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Total
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    <CTableRow>
                      <CTableHeaderCell scope="row"></CTableHeaderCell>
                      <CTableDataCell>Division</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" Value="NLFD" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" Value="NLFD" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" Value="NLFD" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" Value="NLFD" id="inputAddress" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">1</CTableHeaderCell>
                      <CTableDataCell>Halting Charges</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>Toll Amount</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="2500" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="2000" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="2500" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="2000" readOnly />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">3</CTableHeaderCell>
                      <CTableDataCell>Bata</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">4</CTableHeaderCell>
                      <CTableDataCell>Municipal Charges</CTableDataCell>

                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">5</CTableHeaderCell>
                      <CTableDataCell>Registerd Diesel Amount</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">6</CTableHeaderCell>
                      <CTableDataCell>Enroute Diesel Amount</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">7</CTableHeaderCell>
                      <CTableDataCell>Port Entry Fee</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">8</CTableHeaderCell>
                      <CTableDataCell>Misc Charges</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">9</CTableHeaderCell>
                      <CTableDataCell>Fine Amount</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">10</CTableHeaderCell>
                      <CTableDataCell>Subdelivery Charges</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">11</CTableHeaderCell>
                      <CTableDataCell>Maintenance Cost</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">12</CTableHeaderCell>
                      <CTableDataCell>Loading Charges</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">13</CTableHeaderCell>
                      <CTableDataCell>Unloading Charges</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">14</CTableHeaderCell>
                      <CTableDataCell>Tarpaulin Charges</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">15</CTableHeaderCell>
                      <CTableDataCell>Weighment Charges</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">16</CTableHeaderCell>
                      <CTableDataCell>Low Tonage Charges </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">16</CTableHeaderCell>
                      <CTableDataCell>Stock Diversion / Return Charges* </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <CTable caption="top" hover style={{ height: '30vh' }}>
                  <CTableCaption style={{ color: 'maroon' }}>Income</CTableCaption>
                  <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                    <CTableRow>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        S.No
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Type
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        FJ Delivery
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        RJ Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        STO Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Total
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    <CTableRow>
                      <CTableHeaderCell scope="row">1</CTableHeaderCell>
                      <CTableDataCell>Base Freight</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="Auto" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="Auto" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="Auto" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="Auto" readOnly />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>Additional Freight</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <CTable caption="top" hover style={{ height: '40vh' }}>
                  <CTableCaption style={{ color: 'maroon' }}>Profit and Loss</CTableCaption>
                  <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                    <CTableRow>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        S.No
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Type
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        FJ Delivery
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        RJ Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        STO Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Total
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableHeaderCell scope="row">1</CTableHeaderCell>
                      <CTableDataCell>Expense</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>Income</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">3</CTableHeaderCell>
                      <CTableDataCell>Profit and Loss</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="Auto" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="Auto" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="Auto" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" value="Auto" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <CTable caption="top" hover style={{ height: '40vh' }}>
                  <CTableCaption style={{ color: 'maroon' }}>Others</CTableCaption>
                  <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                    <CTableRow>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        S.No
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Type
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        FJ Delivery
                      </CTableHeaderCell>

                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        RJ Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        STO Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Total
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    <CTableRow>
                      <CTableHeaderCell scope="row">1</CTableHeaderCell>
                      <CTableDataCell>Halt Days*</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput size="sm" id="inputAddress" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>Attachment 1</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell scope="row">3</CTableHeaderCell>
                      <CTableDataCell>Attachment 2</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="file" name="divortedPod" size="sm" id="formFileSm" />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey_2 === 7}>
                <CTable caption="top" hover>
                  <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                    <CTableRow>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        S.No
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Type
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        FJ Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        RJ Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        STO Delivery
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                        Total
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    <CTableRow>
                      <CTableHeaderCell scope="row">1</CTableHeaderCell>
                      <CTableDataCell>Advance Amount</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>RJ Recipt Amount</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">3</CTableHeaderCell>
                      <CTableDataCell>Total Amount</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">4</CTableHeaderCell>
                      <CTableDataCell>Balance</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput type="" name="divortedPod" size="sm" id="formFileSm" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <CRow className="mt-2">
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="remarks">Remarks*</CFormLabel>
                    <CFormTextarea
                      name="remarks"
                      id="exampleFormControlTextarea1"
                      rows="1"
                    ></CFormTextarea>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol
                    className="offset-md-9"
                    xs={12}
                    sm={12}
                    md={3}
                    // style={{ display: 'flex', justifyContent: 'space-between' }}
                    style={{ display: 'flex', flexDirection: 'row-reverse', cursor: 'pointer' }}
                  >
                    <CButton
                      size="sm"
                      color="warning"
                      // disabled={enableSubmit}
                      className="mx-3 text-white"
                      // className="align-self-end ml-auto"
                      type="submit"
                    >
                      Close Tripsheet
                    </CButton>
                  </CCol>
                </CRow>
              </CTabPane>
            </CTabContent>
          </CTabPane>
        </CTabContent>
      </CCard>
    </>
  )
}
export default TSSettlement
