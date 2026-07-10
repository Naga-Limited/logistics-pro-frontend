
import { CCol, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CRow,CInputGroup, CTableHeaderCell, CTableRow, CTableBody, CTable, CTableHead } from '@coreui/react'
import React, { useEffect,useState } from 'react'
import DieseVendorSelectComponent from 'src/components/commoncomponent/DieselVendorSelectComponent'
import DivisonListComponent from 'src/components/commoncomponent/DivisonListComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'

const NlmtDieselCreationHire = ({
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
  getDA,
  getBA,
  getDL
}) => {
  const [vendor_code, setVendor_code] = useState('')
  console.log(getDA,'getDA111')
  console.log(getBA,'getBA111')
  console.log(getDL,'getDL111')
  useEffect(() => {
    if (values.diesel_vendor_name) {
      DieselIntentCreationService.getDieselInfoById(values.diesel_vendor_name).then((res) => {
        // console.log(res)
        // isTouched.diesel_vendor_id =true
        // values.diesel_vendor_id = res.data.data.diesel_vendor_id
        values.vendor_code = res.data.data.vendor_code
        setVendor_code(res.data.data.vendor_code)
      })
    }else{
      values.vendor_code = ''
    }
  }, [values.diesel_vendor_name])

  const [incoTermData, setIncoTermData] = useState([])

  useEffect(() => {

    /* section for getting Inco Term Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(16).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'Inco Term Lists')

      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          incoterm_id: data.definition_list_id,
          incoterm_name: data.definition_list_name,
          incoterm_code: data.definition_list_code,
        })
      })

      setIncoTermData(rowDataList_location)
    })

  }, [])

  const totalvaluefinder = (type,data) => {
    console.log(values,'totalvaluefinder-values')
    console.log(type,'totalvaluefinder-type')
    console.log(data,'totalvaluefinder-data')
    let totval_type1 = 0
    let totval_type2 = 0
    let totval_type3 = 0
    if(data){

      let children = data.shipment_child_info
      children.map((vv,kk)=>{
        if(vv.invoice_uom == 'KG'){
          let qtty = Number(vv.invoice_net_quantity)/1000
          console.log(qtty,'totalvaluefinder1')
          totval_type1 = totval_type1+qtty
          if(JavascriptInArrayComponent(vv.inco_term_id ,[381,382])){
            //
          } else {
            totval_type3 = totval_type3+qtty
          }

        } else {
          //
        }
        let ammt = freightamountfinder(vv.inco_term_id,values.frpt,getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom))
        console.log(ammt,'totalvaluefinderammt')
        totval_type2 = totval_type2+ammt
      })

      console.log(totval_type1,'totalvaluefinder1')
      console.log(totval_type2,'totalvaluefinder2')
      console.log(totval_type3,'totalvaluefinder3')
    }
    if(type == 1){
      return Number(parseFloat(totval_type1).toFixed(2))
    } else if(type == 2){
      // return totval_type2
      return Math.round(totval_type2)
    } else if(type == 3){
      return Number(parseFloat(totval_type3).toFixed(2))
    }
  }

  useEffect(()=>{
    console.log('useEffect-1111')
    if(bankAmountExists(totalvaluefinder(2,singleVehicleInfo.shipment_info[0]),singleVehicleInfo.trip_sheet_info.advance_amount,values.total_amount) == '101'){
      console.log('useEffect-2222')
      getBA(true)
    } else {
      console.log('useEffect-3333')
      getBA(false)
    }
    console.log('useEffect-4444')
    if(dieselAmountExists(totalvaluefinder(2,singleVehicleInfo.shipment_info[0]),singleVehicleInfo.trip_sheet_info.advance_amount,values.total_amount) == '101'){
      console.log('useEffect-5555')
      getDA(true)
    } else {
      console.log('useEffect-6666')
      getDA(false)
    }
    console.log('useEffect-7777')

    if(Number(values.total_amount) > 10000){
      console.log('useEffect-8888')
      getDL(true)
    } else {
      console.log('useEffect-9999')
      getDL(false)
    }
    console.log('useEffect-101010')

  },[values])

  /* Display The Inco Term Name via Given Inco Term Code */
  const getIncoTermNameByCode = (code) => {

    console.log(incoTermData,'getIncoTermNameByCode-incoTermData')
    console.log(code,'getIncoTermNameByCode-code')

    let filtered_incoterm_data = incoTermData.filter((c, index) => {

      if (c.incoterm_id == code) {
        return true
      }
    })

    let incoTermName = filtered_incoterm_data[0] ? filtered_incoterm_data[0].incoterm_code : 'Loading..'

    return incoTermName
  }

  const [idt,setIdt] = useState([])

  const getDeliveryQuantity = (qty,uom) => {
    if(uom == 'KG'){
      console.log(Number(qty)/1000,'getDeliveryQuantity')
      // return Number(parseFloat(qty).toFixed(2))
      return Number(qty)/1000
    } else {
      return '-'
    }
  }

  const freightamountfinder = (id,ton,qty) => {
    console.log(id,'freightamountfinder-id')
    console.log(ton,'freightamountfinder-ton')
    console.log(qty,'freightamountfinder-qty')
    if(JavascriptInArrayComponent(id,[381,382])){
      return 0
    }
    let ans = Number(ton)*qty
    console.log(ans,'freightamountfinder-ans')
    // return Math.round(ans)
    return Number(ans)
    // return parseInt(ans)
  }

  useEffect(()=>{
    if(singleVehicleInfo && singleVehicleInfo.shipment_info && singleVehicleInfo.shipment_info.length > 0 && incoTermData.length > 0){
      let shp = singleVehicleInfo.shipment_info[0]
      let shp_incoterm_array = []
      var incoTableData = []
      shp.shipment_child_info.map((vv,kk)=>{
        if(JavascriptInArrayComponent(vv.inco_term_id,shp_incoterm_array)){

          incoTableData.filter((data)=> (data.inco_term_id == vv.inco_term_id)).map((v1,k1)=>{
            v1.qty = v1.qty + getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom)
            v1.amount = v1.amount + freightamountfinder(vv.inco_term_id,singleVehicleInfo.trip_sheet_info.freight_rate_per_tone,getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom))
          })
          // let old_qty = child_array_data[0].qty
          // let old_amount = child_array_data[0].amount
          // console.log(child_array_data[0],'incoTableData-child_array_data')

          // let valarray1 = {}
          // valarray1.inco_term_id = child_array_data[0].inco_term_id
          // valarray1.inco_term = child_array_data[0].inco_term
          // valarray1.qty = old_qty + getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom)
          // valarray1.amount = old_amount + freightamountfinder(vv.inco_term_id,singleVehicleInfo.trip_sheet_info.freight_rate_per_tone,getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom))

          // incoTableData.push(valarray1)

        } else {
          console.log(vv,'incoTableData-vv')
          shp_incoterm_array.push(vv.inco_term_id)
          let valarray = {}
          valarray.inco_term_id = vv.inco_term_id
          valarray.inco_term = getIncoTermNameByCode(vv.inco_term_id)
          valarray.qty = getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom)
          valarray.amount = freightamountfinder(vv.inco_term_id,singleVehicleInfo.trip_sheet_info.freight_rate_per_tone,getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom))
          console.log(valarray.amount,'incoTableData-valarray.amount')
          incoTableData.push(valarray)
        }
      })
      setIdt(incoTableData)
      console.log(incoTableData,'incoTableData1')
    } else {
      console.log('incoTableData2')
      setIdt([])
      console.log(singleVehicleInfo,'incoTableData21')
    }
  },[incoTermData,singleVehicleInfo.shipment_info])

  const freightTypeArray = ['','TON','KG','TRIP','FIXED']

  const REQ = () => <span className="text-danger"> * </span>

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
  )

  const bankAmountExists = (v1,v2,v3) => {
    console.log(v1,'bankAmountExists:Freight-Tonnage-Amount')
    console.log(v2,'bankAmountExists:Bank-Advance-Amount')
    console.log(v3,'bankAmountExists:Diesel-Advance-Amount')
    let lowtoncharge = values.low_tonnage_charges
    let Total_Freight = Number(v1) + (Number.isInteger(Number(lowtoncharge)) ? Number(lowtoncharge) : 0)
    let alloted_amount = Total_Freight*4/5
    let alloted_amount1 = Math.round(alloted_amount)
    console.log(alloted_amount1,'bankAmountExists:80%-Advance-Amount')
    let bank_advance_allowed_amount = alloted_amount1 - v3
    let bank_advance_allowed_amount1 = Math.round(bank_advance_allowed_amount)
    console.log(bank_advance_allowed_amount1,'bankAmountExists:bank_advance_allowed_amount')
    if(v2 > bank_advance_allowed_amount1 ){
      return 101
    }
    return 102
  }
  const dieselAmountExists = (v1,v2,v3) => {
    console.log(v1,'dieselAmountExists:Freight-Tonnage-Amount')
    console.log(v2,'dieselAmountExists:Bank-Advance-Amount')
    console.log(v3,'dieselAmountExists:Diesel-Advance-Amount')
    let alloted_amount = v1*4/5
    let alloted_amount1 = Math.round(alloted_amount)
    console.log(alloted_amount1,'dieselAmountExists:80%-Advance-Amount')
    let exact_diesel_advance_amount = alloted_amount1-v2
    console.log(exact_diesel_advance_amount,'dieselAmountExists:exact_diesel_advance_amount')
    // if(exact_diesel_advance_amount < v3 ){ /* Ship Bank Advance Amount exists check condition */
    if(alloted_amount1 < v3 ){
      return 101
    }
    return 102
  }

  const idtTotalAmountFinder = (val1,val2) => {
    console.log(val1,'idtTotalAmountFinder:Freight-Tonnage-Amount')
    console.log(val2,'idtTotalAmountFinder:Bank-Advance-Amount')
    let alloted_amount = val1*4/5
    console.log(alloted_amount,'idtTotalAmountFinder:80%-Advance-Amount')
    return 1000
  }

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
           onChange={vendor_code}
            id="vendor_code"
            value={values.vendor_code }
            readOnly />
        </CCol>
        {singleVehicleInfo.trip_sheet_info.purpose != 4 ? (
          <>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="total_amount">
                Freight Amount<REQ />{' '}
                {errors.total_amount && <span className="small text-danger">{errors.total_amount}</span>}
              </CFormLabel>
              <CFormInput
                size="sm"
                name='total_amount'
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                id="total_amount"
                value={idt.length > 0 && singleVehicleInfo.trip_sheet_info.purpose == 1 && singleVehicleInfo.trip_sheet_info.to_divison == 1 ? totalvaluefinder(2,singleVehicleInfo.shipment_info[0]) : (singleVehicleInfo.trip_sheet_info.freight_rate_per_tone * singleVehicleInfo.vehicle_capacity_id.capacity)}
                maxLength={7}
                readOnly
              />
            </CCol>
            {idt.length > 0 && singleVehicleInfo.trip_sheet_info.purpose == 1 && singleVehicleInfo.trip_sheet_info.to_divison == 1 &&
              (
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="ownerName">80% Advance Freight</CFormLabel>
                  <CFormInput
                    size="sm"
                    id="ownerName"
                    type="text"
                    value={totalvaluefinder(2,singleVehicleInfo.shipment_info[0])*4/5}
                    readOnly
                  />
                </CCol>
              )
            }
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="ownerName">Bank Advance Amount</CFormLabel>
              <CFormInput
                size="sm"
                id="ownerName"
                type="text"
                value={singleVehicleInfo.trip_sheet_info.advance_amount}
                readOnly
              />
            </CCol>
            {idt.length > 0 && singleVehicleInfo.trip_sheet_info.purpose == 1 && singleVehicleInfo.trip_sheet_info.to_divison == 1 ?
              (
                <>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="total_amount">
                      Diesel Amount<REQ />{' '}
                      {errors.total_amount && <span className="small text-danger">{errors.total_amount}</span>}
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      name='total_amount'
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      id="total_amount"
                      value={values.total_amount}
                      maxLength={7}
                    />
                  </CCol>
                  </>
              ) : (<>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="total_amount">
                      Diesel Amount<REQ />{' '}
                      {errors.total_amount && <span className="small text-danger">{errors.total_amount}</span>}
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      name='total_amount'
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      id="total_amount"
                      value={values.total_amount}
                      maxLength={7}
                      readOnly
                    />
                  </CCol>
              </>)
            }
            {/* <CCol xs={12} md={3}>
              <CFormLabel htmlFor="total_amount">
                Balance<REQ />{' '}
                {errors.total_amount && <span className="small text-danger">{errors.total_amount}</span>}
              </CFormLabel>
              <CFormInput
                size="sm"
                name='total_amount'
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                id="total_amount"
                value={idt.length > 0 && singleVehicleInfo.trip_sheet_info.purpose == 1 && singleVehicleInfo.trip_sheet_info.to_divison == 1 ? (idtTotalAmountFinder(totalvaluefinder(2,singleVehicleInfo.shipment_info[0]),singleVehicleInfo.trip_sheet_info.advance_amount)) : (singleVehicleInfo.trip_sheet_info.freight_rate_per_tone * singleVehicleInfo.vehicle_capacity_id.capacity)-(Number(values.total_amount)+Number(singleVehicleInfo.trip_sheet_info.advance_amount))}
                maxLength={7}
                readOnly
              />
            </CCol> */}
          </>
        ) : (
          <>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="ownerName">Freight (Unit - Amount)</CFormLabel>
              <CFormInput
                size="sm"
                id="ownerName"
                type="text"
                value={`${freightTypeArray[singleVehicleInfo.trip_sheet_info.others_freight_calc_type]} - ${singleVehicleInfo.trip_sheet_info.freight_rate_per_tone}`}
                readOnly
              />
            </CCol>
            {singleVehicleInfo.trip_sheet_info.others_freight_calc_type != '4' && (
              <CCol xs={12} md={3}>
                <CFormLabel htmlFor="ownerName">Total Freight Amount</CFormLabel>
                <CFormInput
                  size="sm"
                  id="ownerName"
                  type="text"
                  value={singleVehicleInfo.trip_sheet_info.others_total_freight}
                  readOnly
                />
              </CCol>
            )}
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="ownerName">Bank Advance Amount</CFormLabel>
              <CFormInput
                size="sm"
                id="ownerName"
                type="text"
                value={singleVehicleInfo.trip_sheet_info.advance_amount}
                readOnly
              />
            </CCol>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="ownerName">Diesel Amount</CFormLabel>
              <CFormInput
                size="sm"
                id="ownerName"
                type="text"
                value={singleVehicleInfo.trip_sheet_info.advance_payment_diesel}
                readOnly
              />
            </CCol>
          </>
        )}
        {/* <CCol xs={12} md={3}>
          <CFormLabel htmlFor="total_amount">
            Total Value<REQ />{' '}
            {errors.total_amount && <span className="small text-danger">{errors.total_amount}</span>}
          </CFormLabel>
          <CFormInput size="sm" name='total_amount'
           onFocus={onFocus}
           onBlur={onBlur}
           onChange={handleChange}
            id="total_amount"
            value={Number(values.total_amount) + Number(singleVehicleInfo.trip_sheet_info.freight_rate_per_tone * singleVehicleInfo.vehicle_capacity_id.capacity)-(values.total_amount)}
            maxLength={7}
            readOnly
             />
        </CCol> */}
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
        {/* {idt.length > 0 && singleVehicleInfo.trip_sheet_info.purpose == 1 && singleVehicleInfo.trip_sheet_info.to_divison == 1 && bankAmountExists(totalvaluefinder(2,singleVehicleInfo.shipment_info[0]),singleVehicleInfo.trip_sheet_info.advance_amount,values.total_amount) == '101' ? (
          <CCol xs={12} md={3} style={{ display: 'flex', justifyContent: 'start' }}>
            <span style={{ color: 'red' }}>
              *Bank Advance Amount exists..
            </span>
          </CCol>
        ):(<CCol xs={12} md={3}></CCol>)}   */}
        <CCol xs={12} md={3}></CCol>
        <CCol xs={12} md={3}></CCol>
        {idt.length > 0 && singleVehicleInfo.trip_sheet_info.purpose == 1 && singleVehicleInfo.trip_sheet_info.to_divison == 1 && dieselAmountExists(totalvaluefinder(2,singleVehicleInfo.shipment_info[0]),singleVehicleInfo.trip_sheet_info.advance_amount,values.total_amount) == '101' ? (
          <CCol xs={12} md={3} style={{ display: 'flex', justifyContent: 'start' }}>
            <span style={{ color: 'red' }}>
              *Diesel Advance Amount exists..
            </span>
          </CCol>
        ):(<CCol xs={12} md={3}></CCol>)}
        {Number(values.total_amount) > 10000 ? (
          <CCol xs={12} md={6} style={{ display: 'flex', justifyContent: 'start' }}>
            <span style={{ color: 'red' }}>
              *Diesel Advance Amount Limit (10000) exists..
            </span>
          </CCol>
        ):(<CCol xs={12} md={3}></CCol>)}
      </CRow>
      {idt.length > 0 && singleVehicleInfo.trip_sheet_info.purpose == 1 && singleVehicleInfo.trip_sheet_info.to_divison == 1 &&
          (
            <>
              <ColoredLine color="green" />
              <CRow className="mt-2" hidden>
                <CCol xs={12} md={3}>
                  <CFormLabel
                    htmlFor="inputAddress"
                    style={{
                      backgroundColor: '#4d3227',
                      margin: '15px 0',
                      color: 'white',
                    }}
                  >
                    IncoTerm wise Freight Information
                  </CFormLabel>
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="dname">Freight Paid Tonnage</CFormLabel>
                  <CFormInput
                    name="dname"
                    size="sm"
                    id="dname"
                    readOnly
                    // value={`${totalvaluefinder(1,singleVehicleInfo.shipment_info[0])} / ${totalvaluefinder(3,singleVehicleInfo.shipment_info[0])}`}
                    value={totalvaluefinder(3,singleVehicleInfo.shipment_info[0])}
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="shipment_ton">
                  Shipment No. / Qty. In MTS
                  </CFormLabel>
                  <CFormInput
                    size="sm"
                    name="shipment_ton"
                    type="text"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    value={`${singleVehicleInfo.shipment_info[0].shipment_no} / ${singleVehicleInfo.shipment_info[0].billed_net_qty}`}
                    id="shipment_ton"
                    readOnly
                  />
                </CCol>
              </CRow>
              <CRow>
                <CTable style={{ height: '40vh', width: 'auto' }} className="overflow-scroll">
                  <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                    <CTableRow style={{ width: '100%' }}>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                      >
                        S.No
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '9%', textAlign: 'center' }}
                      >
                        Inco Term
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                      >
                        QTY in MTS
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                      >
                        Rate Per TON
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                      >
                        Amount
                      </CTableHeaderCell>

                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                  {idt.map((data, index) => {
                      console.log(data,'rowData-data')

                      return (
                        <>
                          <CTableRow style={{ width: '100%' }}>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '5%', textAlign: 'center' }}
                            >
                              {index+1}
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '9%', textAlign: 'center' }}
                            >
                              {getIncoTermNameByCode(data.inco_term_id)}
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '5%', textAlign: 'center' }}
                            >
                              {Number(parseFloat(data.qty).toFixed(2))}
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '5%', textAlign: 'center' }}
                            >
                              {JavascriptInArrayComponent(data.inco_term_id,[381,382]) ? 0 : values.frpt}
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '5%', color: `${JavascriptInArrayComponent(data.inco_term_id,[381,382]) ? 'white' : ''}`, textAlign: 'center',background: `${JavascriptInArrayComponent(data.inco_term_id,[381,382]) ? 'red' : ''}`}}

                            >
                              {/* {data.amount} */}
                              {Math.round(Number(parseFloat(Number(values.frpt)*Number(data.qty)).toFixed(2)))}
                            </CTableHeaderCell>

                          </CTableRow>
                        </>
                      )
                    })
                  }
                    <CTableRow style={{ width: '100%', background:'cyan' }}>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '5%', textAlign: 'center' }}
                      >
                        -
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '9%', textAlign: 'center',color:'indigo' }}
                      >
                        BILLED TONNAGE TOTAL
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '5%', textAlign: 'center' }}
                      >
                        {totalvaluefinder(1,singleVehicleInfo.shipment_info[0])}
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '5%', textAlign: 'center', color:'green' }}
                      >
                        Total
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '5%', textAlign: 'center' }}
                      >
                        {totalvaluefinder(2,singleVehicleInfo.shipment_info[0])}
                      </CTableHeaderCell>

                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CRow>
            </>
          )
        }
      <CRow></CRow>
      <CRow></CRow>
    </>
  )
}

export default NlmtDieselCreationHire
