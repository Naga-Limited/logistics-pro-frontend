import { CCol, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CRow } from '@coreui/react'
import React, { useEffect } from 'react'
import DivisonListComponent from 'src/components/commoncomponent/DivisonListComponent'

const TripSheetCreationHire = ({
  values,
  errors,
  handleChange,
  onFocus,
  handleSubmit,
  enableSubmit,
  onBlur,
  singleVehicleInfo,
  isTouched,
  Purpose,
  SourcedBy,
  DivisonList,
}) => {
  const REQ = () => <span className="text-danger"> * </span>
  return (
    <>
      <CRow>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>
          <CFormInput
            size="sm"
            name="vehicle_type"
            value={singleVehicleInfo.vehicle_type_id.type}
            id="vType"
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
            value={singleVehicleInfo.vehicle_capacity_id.capacity + '-TON'}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driverNameHire">Driver Name</CFormLabel>
          <CFormInput
            size="sm"
            id="driverNameHire"
            value={singleVehicleInfo.driver_name}
            readOnly
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="dMob">Driver Mobile Number</CFormLabel>
          <CFormInput
            size="sm"
            id="dMob"
            value={singleVehicleInfo.driver_contact_number}
            readOnly
          />
        </CCol>
        {singleVehicleInfo.trip_sto_status !== '1' && (
          <>
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
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="inspectionDateTime">Inspection Date & Time</CFormLabel>
              <CFormInput
                size="sm"
                id="inspectionDateTime"
                type="text"
                value={
                  singleVehicleInfo.vehicle_inspection_trip
                    ? singleVehicleInfo.vehicle_inspection_trip.inspection_time_string
                    : 'RMSTO'
                }
                // value={'RMSTO'}
                readOnly
              />
            </CCol>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="verifyDate">Doc. Verification Date & Time</CFormLabel>
              <CFormInput
                size="sm"
                type="inspection_time_string"
                id="verifyDate"
                // value={singleVehicleInfo.vehicle_inspection_trip.inspection_time_string || 'RMSTO'}
                // value={'RMSTO'}
                value={
                  singleVehicleInfo.vehicle_inspection_trip
                    ? singleVehicleInfo.vehicle_inspection_trip.inspection_time_string
                    : 'RMSTO'
                }
                readOnly
              />
            </CCol>
          </>
        )}
        {/* </CRow>
      <CRow> */}
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="shedName">Shed Name</CFormLabel>
          <CFormInput
            size="sm"
            id="shedName"
            value={singleVehicleInfo.vendor_info.shed_info.shed_name}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="ownerName">Owner Name</CFormLabel>
          <CFormInput
            size="sm"
            id="ownerName"
            type="text"
            value={singleVehicleInfo.vendor_info.owner_name}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="ownerMob">Owner Mobile Number</CFormLabel>
          <CFormInput
            size="sm"
            id="ownerMob"
            value={singleVehicleInfo.vendor_info.shed_info.shed_owner_phone_1}
            type="text"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="purpose">
            Purpose <REQ />{' '}
            {errors.purpose && <span className="small text-danger">{errors.purpose}</span>}
          </CFormLabel>
          <CFormSelect
            size="sm"
            name="purpose"
            id="purpose"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            disabled={singleVehicleInfo.trip_sto_status == '1' ? true : false}
            value={singleVehicleInfo.trip_sto_status != '1' ? values.purpose : 3}
            className={`${errors.purpose && 'is-invalid'}`}
            aria-label="Small select example"
          >
            <option value="">Select...</option>
            {singleVehicleInfo.trip_sto_status == '1' &&
              Purpose.map(({ id, purpose }) => {
                return (
                  <>
                    <option value={id}>{purpose}</option>
                  </>
                )
              })}
            {Purpose.map(({ id, purpose }) => {
              if (id == 1 || id == 2) {
                return (
                  <>
                    <option value={id}>{purpose}</option>
                  </>
                )
              }
            })}
          </CFormSelect>
        </CCol>
        {(values.purpose == 2 || values.purpose == 3) && (
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="Vehicle_Sourced_by">
              Vehicle sourced by <REQ />{' '}
              {errors.Vehicle_Sourced_by && (
                <span className="small text-danger">{errors.Vehicle_Sourced_by}</span>
              )}
            </CFormLabel>
            <CFormSelect
              size="sm"
              name="Vehicle_Sourced_by"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.Vehicle_Sourced_by}
              className={`${errors.Vehicle_Sourced_by && 'is-invalid'}`}
              aria-label="Small select example"
              id="Vehicle_Sourced_by"
            >
              <option value="">Select...</option>
              {SourcedBy.map(({ id, team }) => {
                if (values.purpose == 2) {
                  if (id == 1 || id == 3) {
                    return (
                      <>
                        <option value={id}>{team}</option>
                      </>
                    )
                  }
                } else {
                  if (id == 1 || id == 2) {
                    return (
                      <>
                        <option value={id}>{team}</option>
                      </>
                    )
                  }
                }
              })}
            </CFormSelect>
          </CCol>
        )}{' '}
        {singleVehicleInfo.trip_sto_status != '1' && (
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="division_id">
              Division <REQ />{' '}
              {errors.division_id && (
                <span className="small text-danger">{errors.division_id}</span>
              )}
            </CFormLabel>
            <CFormSelect
              size="sm"
              name="division_id"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.division_id}
              className={`${errors.division_id && 'is-invalid'}`}
              aria-label="Small select example"
              id="division_id"
            >
              <option value="">Select...</option>
              {DivisonList.map(({ id, division }) => {
                return (
                  <>
                    <option value={id}>{division}</option>
                  </>
                )
              })}
            </CFormSelect>
          </CCol>
        )}
        {singleVehicleInfo.trip_sto_status != '1' && (
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="freight_rate_per_tone">
              Freight Rate Per TON <REQ />{' '}
              {errors.freight_rate_per_tone && (
                <span className="small text-danger">{errors.freight_rate_per_tone}</span>
              )}
            </CFormLabel>
            <CFormInput
              size="sm"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.freight_rate_per_tone}
              id="freight_rate_per_tone"
              name="freight_rate_per_tone"
              type="number"
            />
          </CCol>
        )}
        {singleVehicleInfo.trip_sto_status != '1' && (
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="trip_advance_eligiblity">
              Trip Advance Eligibility
              {errors.trip_advance_eligiblity && (
                <span className="small text-danger">{errors.trip_advance_eligiblity}</span>
              )}
            </CFormLabel>
            <CFormSelect
              size="sm"
              name="trip_advance_eligiblity"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.trip_advance_eligiblity}
              className={`${errors.trip_advance_eligiblity && 'is-invalid'}`}
              aria-label="Small select example"
              id="trip_advance_eligiblity"
            >
              <option value="">Select...</option>
              <option value="1">Yes</option>
            </CFormSelect>
          </CCol>
        )}
        {values.trip_advance_eligiblity == 1 ? (
          <>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="advance_amount">
                Advance Payment Bank <REQ />{' '}
                {errors.advance_amount && (
                  <span className="small text-danger">{errors.advance_amount}</span>
                )}
              </CFormLabel>
              <CFormInput
                size="sm"
                type="number"
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                value={values.advance_amount}
                name="advance_amount"
                id="advance_amount"
              />
            </CCol>
          </>
        ) : (
          <></>
        )}
        {values.trip_advance_eligiblity == 1 ? (
          <>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="advance_payment_diesel">
                Advance Payment Diesel <REQ />{' '}
                {errors.advance_payment_diesel && (
                  <span className="small text-danger">{errors.advance_payment_diesel}</span>
                )}
              </CFormLabel>
              <CFormInput
                size="sm"
                name="advance_payment_diesel"
                type="number"
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                value={values.advance_payment_diesel}
                id="advance_payment_diesel"
              />
            </CCol>
          </>
        ) : (
          <></>
        )}
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="expected_date_time">
            Expected Delivery Date & Time <REQ />{' '}
            {errors.expected_date_time && (
              <span className="small text-danger">{errors.expected_date_time}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            value={values.expected_date_time}
            type="date"
            name="expected_date_time"
            id="expected_date_time"
          />
        </CCol>
      </CRow>
      <CRow></CRow>
      <CRow></CRow>
    </>
  )
}

export default TripSheetCreationHire
