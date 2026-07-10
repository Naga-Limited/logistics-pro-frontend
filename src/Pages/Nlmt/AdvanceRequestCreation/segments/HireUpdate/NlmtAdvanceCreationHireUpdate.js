
import { CCol, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CRow, CInputGroup } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DivisonListComponent from 'src/components/commoncomponent/DivisonListComponent'
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import AdvanceCreationService from 'src/Service/Advance/AdvanceCreationService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import NlmtAdvanceCreationService from 'src/Service/Nlmt/Advance/NlmtAdvanceCreationService'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'

const NlmtAdvanceCreationHireUpdate = ({
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
  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [vehicleBody, setVehicleBody] = useState([])
  const [advanceLimit, setadvanceLimit] = useState([])
  const [errors, setErrors] = useState({})
    const [values, setValues] = useState([])
  const VEHICLE_TYPE_MAP = {
    21: 'Own',
    22: 'Hire',
  }

  useEffect(() => {
    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(4)
      .then((res) => setadvanceLimit(res?.data?.data || []))
      .catch(() => setadvanceLimit([]))
  }, [])

  const advancePercentage =
    advanceLimit?.find((item) => item.definition_list_status === 1)
      ?.definition_list_name || 0
  const advanceEligible =
      ((Number(singleVehicleInfo.tripsheet_info.trip_vehicle_route.freight_rate) * Number(advancePercentage)) / 100).toFixed(2)

  useEffect(() => {
    Promise.all([
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(2),// Vehicle Capacity
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(1),// Vehicle Body Type
      // NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(3),// Vehicle Type
    ]).then(([cap, body, type]) => {
      setVehicleCapacity(cap.data.data || [])
      setVehicleBody(body.data.data || [])
      // setVehicleType(type.data.data || [])
      // setMastersLoaded(true)
    })
  }, [])

    const [tdsMasterData, setTdsMasterData] = useState([])
  const [sapHsnData, setSapHsnData] = useState([])
  const [GstTaxType, setGstTaxType] = useState([])
  useEffect(() => {
    /* section for getting Sap Hsn Data from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(27).then((response) => {
      console.log(response.data.data, 'DefinitionsListApi-setSapHsnData')
      setSapHsnData(response.data.data)
    })

        DefinitionsListApi.visibleDefinitionsListByDefinition(20).then((response) => {
          let tableData = response.data.data
          const filterData = tableData.filter((data) => (data.definition_list_status == 1))
          setGstTaxType(filterData)
        })


    /* section for getting TDS Master Data from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      console.log(response.data.data, 'DefinitionsListApi-setTdsMasterData')
      let tableData = response.data.data
      let filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setTdsMasterData(filterData)
    })
  }, [])

  const vehicleCapacityName = vehicleCapacity.find(
    (item) =>
      item.definition_list_id ===
      singleVehicleInfo?.vehicle_info?.vehicle_capacity_id
  )?.definition_list_name || '-'

  const vehicleBodyName = vehicleBody.find(
    (item) =>
      item.definition_list_id ===
      singleVehicleInfo?.vehicle_info?.vehicle_body_type_id
  )?.definition_list_name || '-'
  useEffect(() => {
    if (values.vendor_code) {
      VendorOutstanding.getVendoroutstanding(values.vendor_code).then((res) => {
        let driver_outstanding_data = res.data;
        console.log(driver_outstanding_data);
        driver_outstanding_data.map((res) => {
          console.log(res)
          console.log(res.L_DMBTR)
          // if(values.driver_code == res.L_DMBTR){
          isTouched.driver_outstanding = true
          values.driver_outstanding = res.L_DMBTR;
          setOutstanding(res.L_DMBTR)
          // }
        })
      })
    } else {
      values.driver_outstanding = '';
    }
  }, [values.vendor_code])
    const [currentDateVbr, setCurrentDateVbr] = useState(''); /* Vendor Bill Reference Date */
    const [currentDateAbp, setCurrentDateAbp] = useState(''); /* Advance Payment Bank Posting Date */
    const [currentDateFp, setCurrentDateFp] = useState(''); /* Freight Posting Date */

    useEffect(() => {
      // Set the current date in YYYY-MM-DD format
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD'
      setCurrentDateVbr(formattedDate);
      setCurrentDateAbp(formattedDate);
      setCurrentDateFp(formattedDate);
      values.sap_invoice_posting_date = formattedDate
      values.bank_date = formattedDate
      values.supplier_posting_date = formattedDate
    }, []);

const handleChange1 = (e) => {
  const { name, value } = e.target

  let newErrors = { ...errors }

  if (name === "advance_payment_update") {
    if (Number(value) > Number(advanceEligible)) {
      newErrors.advance_payments =
        "Amount should not exceed eligible amount (" + advanceEligible + ")"
    } else {
      delete newErrors.advance_payments
    }

    setErrors(newErrors)
  }

  setValues({
    ...values,
    [name]: value,
  })
}

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

  const [PaymentMode, setPaymentMode] = useState([])
      useEffect(() => {
          NlmtAdvanceCreationService.visibleDefinitionsListByDefinition(3).then((response) => {
            setPaymentMode(response.data.data)
          })
      },[])

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


  console.log(singleVehicleInfo, 'singleVehicleInfo in NlmtAdvanceCreationHireUpdate')
  return (
    <>
      <CRow>
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
            value={singleVehicleInfo.tripsheet_info.nlmt_tripsheet_no}
            // value={singleVehicleInfo.tripsheet_sheet_id}
            id="tripsheet_id"
            type="text"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
          <CFormInput size="sm" id="vNum" value={singleVehicleInfo.vehicle_info.vehicle_number} readOnly />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vCap">Vehicle Type / Capacity / Body Type </CFormLabel>
          <CFormInput
            size="sm"
            id="vCap"
            value={VEHICLE_TYPE_MAP[singleVehicleInfo.vehicle_info.vehicle_type_id]+' / ' +vehicleCapacityName + ' Mts' + ' / ' + vehicleBodyName}
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
            value={singleVehicleInfo.driver_phone_1}
            readOnly
          />
        </CCol>

            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="gateInDateTime">Trip-In Date & Time</CFormLabel>
              <CFormInput
                size="sm"
                id="gateInDateTime"
                type="text"
                value={singleVehicleInfo.created_at_time}
                readOnly
              />
            </CCol>



        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="shedName">Shed Name</CFormLabel>
          <CFormInput
            size="sm"
            id="shedName"
            value={singleVehicleInfo.vendor_info.nlmt_shed_info.shed_name}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="ownerName">Owner Name</CFormLabel>
          <CFormInput
            size="sm"
            id="ownerName"
            type="text"
            value={singleVehicleInfo.vendor_info.nlmt_shed_info.shed_owner_name}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="ownerMob">Owner Mobile Number</CFormLabel>
          <CFormInput
            size="sm"
            id="ownerMob"
            value={singleVehicleInfo.vendor_info.nlmt_shed_info.shed_owner_phone_1}
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
              value={singleVehicleInfo.vendor_info.vendor_code}
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
          <CFormLabel htmlFor="trip_route">
            Trip Route
            {errors.freight_rate_per_tone && (
              <span className="small text-danger">{errors.trip_route}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            onFocus={onFocus}
            onBlur={onBlur}
            value={singleVehicleInfo.tripsheet_info.trip_vehicle_route.route_name}
            id="trip_route"
            name="trip_route"
            type="text"
            readOnly
          />
        </CCol>
         <CCol xs={12} md={3}>
          <CFormLabel htmlFor="actual_freight">
            Freight Amount
            {/* {errors.actual_freight && (
              <span className="small text-danger">{errors.actual_freight}</span>
            )} */}
          </CFormLabel>
          <CFormInput
            size="sm"
            onFocus={onFocus}
            onBlur={onBlur}
            value={singleVehicleInfo.tripsheet_info.trip_vehicle_route.freight_rate}
            id="actual_freight"
            name="actual_freight"
            type="text"
            disabled
            maxLength={6}
          />
        </CCol>

        <CCol md={3}>
          <CFormLabel>
            Advance Eligible {advancePercentage} %
          </CFormLabel>
          <CFormInput
            size="sm"
            type="number"
            value={advanceEligible}
            readOnly
          />
        </CCol>
  <CCol xs={12} md={3}>
            <CFormLabel htmlFor="gst_tax_type">GST Tax Type <REQ />{' '}
              {errors.gst_tax_type && (
              <span className="small text-danger">{errors.gst_tax_type}</span>
                )}
            </CFormLabel>
            <CFormSelect
              size="sm"
              id="gst_tax_type"
              name="gst_tax_type"
              value={values.gst_tax_type}
              className={`${errors.gst_tax_type && 'is-invalid'}`}
              type="text"
              maxLength="6"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
            >
              <option value="">Select...</option>
                {/* <option value="Empty">No Tax</option>
                <option value="R5">Input Tax RCM (SGST,CGST @ 2.5% & 2.5%)</option>
                <option value="F6">Input Tax (SGST,CGST @ 6% & 6%)</option> */}
              {GstTaxType.map(({ definition_list_code, definition_list_name }) => {
                return (
                  <>
                    <option key={definition_list_code} value={definition_list_code}>
                      {definition_list_name}
                    </option>
                  </>
                )
              })}
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
                      value={values.vendor_tds}
                      onFocus={onFocus}
                      onChange={handleChange}
                      onBlur={onBlur}
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
            <CFormLabel htmlFor="vendor_hsn">
              HSN Code <REQ />{' '}
            </CFormLabel>
            <CFormSelect
              size="sm"
              name="vendor_hsn"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.vendor_hsn}
              className={`${errors.vendor_hsn && 'is-invalid'}`}
              aria-label="Small select example"
            >
              <option value="">Select</option>

              {sapHsnData.map(({ definition_list_code, definition_list_name }) => {
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
          <CFormLabel htmlFor="advance_payments">
            Advance Payment Bank <REQ />{' '}
            {errors.advance_payments && (
              <span className="small text-danger">{errors.advance_payments}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            type="number"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange1}
            value={values.advance_payment_update}
            //  disabled={singleVehicleInfo.advance_info.sap_bank_payment_document_no != 0}
            name="advance_payment_update"
            id="advance_payment_update"
            maxLength={6}
          />
        </CCol>


         <CCol xs={12} md={3}>
             <CFormLabel htmlFor="supplier_ref_no">Vendor Bill No/Reference
               {errors.supplier_ref_no && (
                 <span className="small text-danger">{errors.supplier_ref_no}</span>
               )}
             </CFormLabel>
             <CFormInput
               size="sm"
               id="supplier_ref_no"
               name="supplier_ref_no"
               value={values.supplier_ref_no}
               type="text"
               maxLength="16"
               onFocus={onFocus}
               onBlur={onBlur}
               onChange={handleChange}
             />
           </CCol>
           <CCol xs={12} md={3}>
             <CFormLabel htmlFor="supplier_posting_date">Vendor Bill/Reference Date<REQ />{' '}
               {errors.supplier_posting_date && (
                 <span className="small text-danger">{errors.supplier_posting_date}</span>
               )}
             </CFormLabel>
             <CFormInput
               size="sm"
               id="supplier_posting_date"
               name="supplier_posting_date"
               // value={values.supplier_posting_date}
               value={currentDateVbr}
               onChange={(e) => {
                 setCurrentDateVbr(e.target.value)
                 values.supplier_posting_date = e.target.value
               }}
               type="date"
               onFocus={onFocus}
               onBlur={onBlur}
             />
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
         <CCol xs={12} md={3}>
          <CFormLabel htmlFor="remarks"> Remarks</CFormLabel>
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
      </CRow>
      <CRow></CRow>
      <CRow></CRow>
    </>
  )
}

export default NlmtAdvanceCreationHireUpdate
