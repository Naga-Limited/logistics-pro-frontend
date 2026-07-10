import {
  CButton,
  CCardImage,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CInputGroup,
  CInputGroupText
} from '@coreui/react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import AllDriverListSelectComponent from 'src/components/commoncomponent/AllDriverListSelectComponent'
import DieseVendorSelectComponent from 'src/components/commoncomponent/DieselVendorSelectComponent'
import DivisonListComponent from 'src/components/commoncomponent/DivisonListComponent'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'
import DriverMasterService from '../../../../Service/Master/DriverMasterService'

const DieselApprovalOwn = ({
  values,
  errors,
  handleChange,
  onFocus,
  handleSubmit,
  enableSubmit,
  onBlur,
  singleVehicleInfo,
  isTouched,
  setDirverAssign,
  dirverAssign,
  Purpose,
  SourcedBy,
  DivisonList,
}) => {
  const [OdometerPhoto, setOdometerPhoto] = useState(false)
  const [vendorData, setvendorData] = useState({})
  const [vendor, setVendor] = useState(false)
  const [readOnly, setReadOnly] = useState(true)
  const [write, setWrite] = useState(false)
  const [driverPhoneNumberById, setDriverPhoneNumberById] = useState(0)
  const REQ = () => <span className="text-danger"> * </span>

  useEffect(() => {
    if (values.diesel_vendor_name) {
      DieselIntentCreationService.getDieselInfoById(values.diesel_vendor_name).then((res) => {
            console.log(res)
            isTouched.diesel_vendor_id =true
            values.diesel_vendor_id = res.data.data.diesel_vendor_id
            values.vendor_code = res.data.data.vendor_code;
            console.log(res)
      })
    }
  }, [values.diesel_vendor_name])

  return (
    <>
      <CRow className="">
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>
          <CFormInput
            size="sm"
            id="vType"
            value={singleVehicleInfo.vehicle_type_id.type}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
          <CFormInput size="sm" id="vNum" value={singleVehicleInfo.vehicle_number} readOnly />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vCap">Vehicle Capacity</CFormLabel>
          <CFormInput
            size="sm"
            id="vCap"
            value={singleVehicleInfo.vehicle_capacity_id.capacity}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="OdometerKM">Odometer KM</CFormLabel>
          <CFormInput size="sm" id="OdometerKM" value={singleVehicleInfo.odometer_km} readOnly />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="odoImg">
            Odometer Photo
            {errors.vehicleType && <span className="small text-danger">{errors.vehicleType}</span>}
          </CFormLabel>

          <CButton
            onClick={() => setOdometerPhoto(!OdometerPhoto)}
            className="w-100 m-0"
            color="info"
            size="sm"
            id="odoImg"
          >
            <span className="float-start">
              <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
            </span>
          </CButton>
          <CModal visible={OdometerPhoto} onClose={() => setOdometerPhoto(false)}>
            <CModalHeader>
              <CModalTitle>Odometer Photo</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {singleVehicleInfo.odometer_photo &&
              !singleVehicleInfo.odometer_photo.includes('.pdf') ? (
                <CCardImage orientation="top" src={singleVehicleInfo.odometer_photo} />
              ) : (
                <iframe
                  orientation="top"
                  height={500}
                  width={475}
                  src={singleVehicleInfo.odometer_photo}
                ></iframe>
              )}
            </CModalBody>
            {/* <CModalBody>
              <CCardImage orientation="top" src={singleVehicleInfo.odometer_photo} />
            </CModalBody> */}
            <CModalFooter>
              <CButton color="secondary" onClick={() => setOdometerPhoto(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>
          <CFormInput
            size="sm"
            id="gateInDateTime"
            type="text"
            value={singleVehicleInfo.gate_in_date_time_string}
            readOnly
          />
        </CCol>
            {singleVehicleInfo.vehicle_inspection_status==null || '' || undefined ||
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="inspectionDateTime">Inspection Date & Time</CFormLabel>
              <CFormInput
                size="sm"
                id="inspectionDateTime"
                type="text"
                value={values.inspection_time}
                readOnly
              />
            </CCol>}
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="tripsheet_id">
              Trip Sheet Number
            </CFormLabel>
            <CFormInput
              size="sm"
              // name="tripsheet_sheet_id"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={singleVehicleInfo.trip_sheet_info.trip_sheet_no}
              // value={singleVehicleInfo.tripsheet_sheet_id}
              // id="tripsheet_id"
              type="text"
              readOnly
            />
          </CCol>
          <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driver_id">
            Driver Name
            {errors.driver_id && <span className="small text-danger">{errors.driver_id}</span>}
          </CFormLabel>

          {dirverAssign ? (
            <CFormInput
              size="sm"
              id="driverName"
              value={singleVehicleInfo.driver_info.driver_name}
              readOnly
            />
          ) : (
            <CFormSelect
              size="sm"
              name="driver_id"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.driver_id}
              className={`${errors.driver_id && 'is-invalid'}`}
              aria-label="Small select example"
            >
              <AllDriverListSelectComponent />
            </CFormSelect>
          )}
        </CCol>
          <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driveMobile">
            Driver Mobile Number
            {errors.driveMobile && <span className="small text-danger">{errors.driveMobile}</span>}
          </CFormLabel>
          <CFormInput size="sm" id="driveMobile" value={values.driveMobile} readOnly />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="diesel_vendor_name">
            Vendor Name <REQ />{' '}
            {errors.diesel_vendor_name && <span className="small text-danger">{errors.diesel_vendor_name}</span>}
          </CFormLabel>
            <CFormSelect
              size="sm"
              name="diesel_vendor_name"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.diesel_vendor_name}
              id="vendor_id"
              className={`${errors.diesel_vendor_name && 'is-invalid'}`}
              aria-label="Small select example"
            >
              <DieseVendorSelectComponent/>
            </CFormSelect>
        </CCol>
          <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vendor_code">
            Vendor Code
            {errors.vendor_code && <span className="small text-danger">{errors.vendor_code}</span>}
          </CFormLabel>
          <CFormInput size="sm" name='vendor_code'
           onFocus={onFocus}
           onBlur={onBlur}
           onChange={handleChange}
            id="vendor_code"
            value={values.vendor_code}
            readOnly />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="fill_dank">
            Diesel Liters <REQ />{' '}
            {errors.fill_dank && <span className="small text-danger">{errors.fill_dank}</span>}
          </CFormLabel>
          <CFormInput size="sm" name='fill_dank'
           onFocus={onFocus}
           onBlur={onBlur}
           onChange={handleChange}
            id="fill_dank"
            value={'Fill Tank'}
            readOnly
            maxLength={7}
             />
        </CCol>
        <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                  <CFormTextarea
                    id="remarks"
                    name="remarks"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                    value={values.remarks}
                    rows="1"
                  >
                    {values.remarks}
                  </CFormTextarea>
          </CCol>
      </CRow>
    </>
  )
}

export default DieselApprovalOwn
