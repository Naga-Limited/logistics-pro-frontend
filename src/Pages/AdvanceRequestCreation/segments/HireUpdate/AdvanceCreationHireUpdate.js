
import { CCol, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CRow,CInputGroup } from '@coreui/react'
import React, { useEffect,useState } from 'react'
import DivisonListComponent from 'src/components/commoncomponent/DivisonListComponent'
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import AdvanceCreationService from 'src/Service/Advance/AdvanceCreationService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'

const AdvanceCreationHireUpdate = ({
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
  remarks,
  handleChangenew
}) => {
  const [outstanding, setOutstanding] = useState('')
  const [TaxType, setTaxType] = useState([])

  useEffect(() => {
    if (values.vendor_code) {
    VendorOutstanding.getVendoroutstanding(values.vendor_code).then((res) => {
      let driver_outstanding_data = res.data;
      console.log(driver_outstanding_data);
      driver_outstanding_data.map((res)=>{
         console.log(res)
         console.log(res.L_DMBTR)
        // if(values.driver_code == res.L_DMBTR){
          isTouched.driver_outstanding =true
          values.driver_outstanding = res.L_DMBTR;
          setOutstanding(res.L_DMBTR)
        // }
        })
      })
    }else {
      values.driver_outstanding = '';
    }
  },[values.vendor_code])
  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}
const REQ = () => <span className="text-danger"> * </span>
// useEffect(() => {
//   if (singleVehicleInfo.trip_sheet_info.freight_rate_per_tone && values.shipment_ton) {
//     isTouched.actual_freight =true
//     values.actual_freight = singleVehicleInfo.trip_sheet_info.freight_rate_per_tone * values.shipment_ton
//   }
// })
// const [PaymentMode, setPaymentMode] = useState([])
//     useEffect(() => {
//         AdvanceCreationService.visibleDefinitionsListByDefinition(3).then((response) => {
//           setPaymentMode(response.data.data)
//         })
//     },[])

const Expense_Income_Posting_Date = ExpenseIncomePostingDate();


const datevalidation = function () {

  let today = new Date();
  today.setDate(today.getDate() - 3);

  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();

  if (dd < 10) {
      dd = '0' + dd
  }
  if (mm < 10) {
      mm = '0' + mm
  }

  today = yyyy + '-' + mm + '-' + dd;

  return today;
}


useEffect(() => {
  DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
    let tableData = response.data.data
    const filterData = tableData.filter((data) => (data.definition_list_status == 1))
    setTaxType(filterData)
  })
  }, [])

  const [tdsMasterData, setTdsMasterData] = useState([])
  const [sapHsnData, setSapHsnData] = useState([])

  useEffect(() => {
    /* section for getting Sap Hsn Data from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(27).then((response) => {
      console.log(response.data.data,'DefinitionsListApi-setSapHsnData')
      setSapHsnData(response.data.data)
    })

    /* section for getting TDS Master Data from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      console.log(response.data.data,'DefinitionsListApi-setTdsMasterData')
      let tableData = response.data.data
      let filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setTdsMasterData(filterData)
    })
  }, [])

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
          <CFormLabel htmlFor="ownerMob">Vendor PAN Number</CFormLabel>
          <CFormInput
            size="sm"
            id="ownerMob"
            value={singleVehicleInfo?.vendor_info?.pan_card_number}
            type="text"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vendor_code">
            Vendor Code
            {/* {errors.vendor_code && (
              <span className="small text-danger">{errors.vendor_code}</span>
            )} */}
          </CFormLabel>
          <CInputGroup>
          <CFormInput
            size="sm"
            name="vendor_code"
            onFocus={onFocus}
            onBlur={onBlur}
            value={values.vendor_code}
            //onChange={handleChange}
            id="vendor_code"
            type="text"
            readOnly
          />
          {/* <CInputGroupText className="p-0">
                        <CButton size="sm" color="success" onClick={(e) => getvendorData(e)}>
                          <i className="fa fa-check px-1"></i>
                        </CButton>
                      </CInputGroupText> */}
          </CInputGroup>
        </CCol>
        {/* <VendorOutstandingDetails vendorData={vendorData} /> */}

          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="driver_outstanding">
              Vendor Outstanding
              {errors.driver_outstanding && (
                <span className="small text-danger">{errors.driver_outstanding}</span>
              )}
            </CFormLabel>
            <CFormInput
              size="sm"
              name="driver_outstanding"
              onFocus={onFocus}
              onBlur={onBlur}
              value={values.driver_outstanding}
              onChange={outstanding}
              id="driver_outstanding"
              type="text"
              readOnly
            />
          </CCol>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="freight_rate_per_tone">
              Freight Rate per Ton
              {errors.freight_rate_per_tone && (
                <span className="small text-danger">{errors.freight_rate_per_tone}</span>
              )}
            </CFormLabel>
            <CFormInput
              size="sm"
              onFocus={onFocus}
              onBlur={onBlur}
              value={singleVehicleInfo.trip_sheet_info.freight_rate_per_tone}
              id="freight_rate_per_tone"
              name="freight_rate_per_tone"
              type="text"
              readOnly
            />
          </CCol>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="gst_tax_type">GST Tax Type
              {errors.gst_tax_type && (
                <span className="small text-danger">{errors.gst_tax_type}</span>
              )}
            </CFormLabel>
            <CFormSelect
              size="sm"
              id="gst_tax_type"
              name="gst_tax_type"
              value={singleVehicleInfo.advance_info.gst_tax_type}
              className={`${errors.gst_tax_type && 'is-invalid'}`}
              type="text"
              maxLength="6"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              disabled
            >
              <option value="">Select...</option>
              <option value="Empty">No Tax</option>
              <option value="R5">Input Tax RCM (SGST,CGST @ 2.5% & 2.5%)</option>
              <option value="F6">Input Tax (SGST,CGST @ 6% & 6%)</option>
            </CFormSelect>
          </CCol>
          <CCol className="mb-3" md={3}>
            <CFormLabel htmlFor="vendor_tds">
                TDS Tax Type<REQ />{' '}
            </CFormLabel>
            <CFormSelect
              size="sm"
              id="vendor_tds"
              className={`${errors.vendor_tds && 'is-invalid'}`}
              name="vendor_tds"
              // value={singleVehicleInfo.advance_info.tds_type}
              value={values.vendor_tds}
              onFocus={onFocus}
              onChange={handleChange}
              onBlur={onBlur}
              // disabled
            >
              <option value="">Select</option>
              <option value="0">No Tax</option>

              {tdsMasterData.map(({ definition_list_code, definition_list_name }) => {
                if (definition_list_code) {
                  return (
                    <>
                      <option
                        key={definition_list_code}
                        value={definition_list_code}
                      >
                        {definition_list_name}
                      </option>
                    </>
                  )
                }
              })}
            </CFormSelect>
          </CCol>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="sap_invoice_posting_date">
              Posting Date <REQ />{' '}
              {errors.sap_invoice_posting_date && (
                <span className="small text-danger">{errors.sap_invoice_posting_date}</span>
              )}
            </CFormLabel>
            <CFormInput
              size="sm"
              type="date"
              name="sap_invoice_posting_date"
              id="sap_invoice_posting_date"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.sap_invoice_posting_date}
              // max={new Date().toISOString().split("T")[0]}
              // min={datevalidation()}
              min={Expense_Income_Posting_Date.min_date}
              max={Expense_Income_Posting_Date.max_date}
              onKeyDown={(e) => {
                e.preventDefault();
              }}
            />
          </CCol>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="actual_freight">
              Actual Freight <REQ />
              {errors.actual_freight && (
                <span className="small text-danger">{errors.actual_freight}</span>
              )}
            </CFormLabel>
            <CFormInput
              size="sm"
              onFocus={onFocus}
              onBlur={onBlur}
              value={singleVehicleInfo.advance_info.actual_freight}
              id="actual_freight"
              name="actual_freight"
              type="text"
              disabled
              maxLength={6}
            />
          </CCol>

          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="advance_payments">
              Advance Payment Bank <REQ />{' '}
              {errors.advance_payments && (
                <span className="small text-danger">{errors.advance_payments}</span>
              )}
            </CFormLabel>
            <CFormInput
              size="sm"
              type="text"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.advance_payment_update}
              disabled={singleVehicleInfo.advance_info.sap_bank_payment_document_no != 0}
              name="advance_payment_update"
              id="advance_payment_update"
              maxLength={6}
            />
          </CCol>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="advance_payment_diesel_update">
              Advance Payment Diesel <REQ />{' '}
              {errors.advance_payment_diesel && (
                <span className="small text-danger">{errors.advance_payment_diesel}</span>
              )}
            </CFormLabel>
            <CFormInput
              size="sm"
              name="advance_payment_diesel_update"
              type="text"
              onFocus={onFocus}
              onBlur={onBlur}
              // onChange={handleChange}
              value={values.advance_payment_diesel_update}
              disabled
              id="advance_payment_diesel_update"
              maxLength={5}
            />
          </CCol>
            {/* <CCol xs={12} md={3}>
              <CFormLabel htmlFor="income_freight">
              Income Base Freight Amount
              </CFormLabel>
              <CFormInput
                size="sm"
                name="income_freight"
                type="text"
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                value={values.income_freight}
                id="income_freight"
                readOnly
              />
            </CCol> */}
          {singleVehicleInfo.shipment_info.length > 0 &&
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="shipment_ton">
              Shipment Tonnage In MTS
              </CFormLabel>
              <CFormInput
                size="sm"
                name="shipment_ton"
                type="text"
                onFocus={onFocus}
                onBlur={onBlur}
                value={singleVehicleInfo.shipment_info[0].shipment_qty}
                id="shipment_ton"
                readOnly
              />
            </CCol>
          }
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="expected_date_time">
              Expected Delivery Date
              {errors.expected_date_time && (
                <span className="small text-danger">{errors.expected_date_time}</span>
              )}
            </CFormLabel>
            <CFormInput
              size="sm"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={formatDate(singleVehicleInfo.trip_sheet_info.expected_date_time || '')}
              type="text"
              name="expected_date_time"
              id="expected_date_time"
              readOnly
            />
          </CCol>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
            <CFormTextarea
              id="remarks"
              name="remarks"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChangenew}
              value={remarks}
              rows="1"
              maxLength={"50"}
            >
            </CFormTextarea>
        </CCol>
        {values.advance_payment_update > "0" &&
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="bank_remarks">Bank Payment Remarks</CFormLabel>
            <CFormTextarea
              id="bank_remarks"
              name="bank_remarks"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.bank_remarks}
              rows="1"
              maxLength={"50"}
            >
            </CFormTextarea>
          </CCol>
        }
      </CRow>
      <CRow></CRow>
      <CRow></CRow>
    </>
  )
}

export default AdvanceCreationHireUpdate
