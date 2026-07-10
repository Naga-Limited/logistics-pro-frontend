import React, { useState } from 'react'
import {
  CButton,
  CCard, 
  CCol,
  CForm, 
  CModal,
  CModalBody,
  CModalFooter, 
  CRow, 
} from '@coreui/react'
import useForm from 'src/Hooks/useForm'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Object } from 'core-js'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import 'react-toastify/dist/ReactToastify.css' 
import DieselCreationOwn from './segments/OwnAndContract/DieselCreationOwn'
import DieselCreationHire from './segments/Hire/DieselCreationHire'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import DieselIntentValidation from 'src/Utils/DieselIntent/DieselIntentValidation' 
import TripSheetInfoService from 'src/Service/PurchasePro/TripSheetInfoService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

const DieselIntent = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DieselIntentModule.Diesel_Intent_Creation_Request

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  },[])
  /* ==================== Access Part End ========================*/

  const formValues = {
    vehicle_id: '',
    vendor_code: '',
    invoice_no: '',
    invoice_copy: '',
    no_of_ltrs: '',
    total_amount: '',
    bunk_reading: '',
    diesel_intent_po_no: '',
    diesel_status: '',
    remarks: '',
    frpt: '',
    diesel_vendor_name: '',
  }

  const { id } = useParams() 
  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
  const [dirverAssign, setDirverAssign] = useState(true)
  const [fetch, setFetch] = useState(false) 
  const [validateSubmit, setValidateSubmit] = useState(true) 
  const [acceptBtn, setAcceptBtn] = useState(true) 
  const [confirmBtn, setConfirmBtn] = useState(false)

  const [dieselAdvanceExists, setDieselAdvanceExists] = useState(false)
  const [dieselAdvanceLimitExists, setDieselAdvanceLimitExists] = useState(false)
  const [bankAdvanceExists, setBankAdvanceExists] = useState(false)

  const navigation = useNavigate()
  const vehicleType = {
    OWN: 1,
    CONTRACT: 2,
    HIRE: 3,
  }
  const vehicle_type_find = (veh_type_id) => {
    console.log(veh_type_id, 'veh_type_id')
    if (veh_type_id == '1') {
      return 'OWN'
    } else if (veh_type_id == '2') {
      return 'CONTRACT'
    } else if (veh_type_id == '3') {
      return 'HIRE'
    }
  } 

  const driver_info_find = (info_type) => {
    // console.log(driver_trip_id, 'driver_trip_id')
    console.log(info_type, 'info_type')

    if (info_type == 'name') {
      if (singleVehicleInfo.driver_id === null) {
        return singleVehicleInfo.driver_name
      } else {
        return singleVehicleInfo.driver_info.driver_name
      }
    }

    if (info_type == 'contact_no')
    if (singleVehicleInfo.driver_id == null) {
      return singleVehicleInfo.driver_contact_number
    }
    else
    {
      return singleVehicleInfo.driver_info.driver_phone_1
    }

    if (info_type == 'code') {
      if(singleVehicleInfo.driver_id == null){
        return "0"
      }
      else{
      return singleVehicleInfo.driver_info.driver_code
      }
    }
    return ''
  }


  useEffect(() => {
    DieselIntentCreationService.getSingleVehicleInfoOnGate(id).then((res) => {
      setFetch(true)
      console.log(res.data.data,'DieselIntentCreationService-getSingleVehicleInfoOnGate')
      if (res.status === 200) {
        isTouched.vehicle_id = true
        values.tripsheet_id = res.data.data.tripsheet_sheet_id
        isTouched.driver_id = true
        isTouched.tripsheet_id = true
        isTouched.vehicle_type_id = true
        isTouched.parking_id = true

        values.trip_sheet_no = res.data.data.trip_sheet_info != null ? res.data.data.trip_sheet_info.trip_sheet_no : ''
        values.driver_code =
          res.data.data.driver_info != null ? res.data.data.driver_info.driver_code : ''
        // values.vendor_code =
        // res.data.data.diesel_vendor != null ? res.data.data.diesel_vendor.vendor_code : ''
        values.advance_amount = res.data.data.trip_sheet_info.advance_amount
        values.advance_payment_diesel = res.data.data.trip_sheet_info.advance_payment_diesel
        values.total_amount =
          res.data.data.trip_sheet_info != null
            ? res.data.data.trip_sheet_info.advance_payment_diesel
            : ''
        values.frpt = res.data.data.trip_sheet_info.freight_rate_per_tone
        values.vehicle_type_id = res.data.data.vehicle_type_id.id
        values.vehicle_id = res.data.data.vehicle_id
        values.parking_id = res.data.data.parking_yard_gate_id
        values.driver_id = res.data.data != null ? res.data.data.driver_id : ''
        values.inspection_time =
          res.data.data.vehicle_inspection_trip != null
            ? res.data.data.vehicle_inspection_trip.inspection_time_string
            : ''
        values.driveMobile =
          res.data.data.driver_info != null ? res.data.data.driver_info.driver_phone_1 : ''
        // values.freight_rate_per_tone =
        //   res.data.data.vehicle_Freight_info == undefined
        //     ? '0'
        //     : res.data.data.vehicle_Freight_info.freight_rate_per_ton
        setSingleVehicleInfo(res.data.data)
        console.log(singleVehicleInfo)
      }
    })
  }, [])

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

  const totalvaluefinder = (type,data) => {
    console.log(values,'totalvaluefinder-values')
    console.log(type,'totalvaluefinder-type')
    console.log(data,'totalvaluefinder-data')
    let children = data.shipment_child_info
    let totval_type1 = 0
    let totval_type2 = 0
    let totval_type3 = 0
     
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
    if(type == 1){
      return Number(parseFloat(totval_type1).toFixed(2))
    } else if(type == 2){
      // return totval_type2
      return Math.round(totval_type2)
    } else if(type == 3){
      return Number(parseFloat(totval_type3).toFixed(2))
    } 
  }

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

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(CreateDieselIntent, DieselIntentValidation, formValues)

  function CreateDieselIntent(status) { 

    // Tripsheet Info - SAP Service
    const purpose_array = ['FG_SALES', 'FG_STO','RM_STO','OTHERS','FCI']
    const division_array = ['NLFD', 'NLCD']
    if(singleVehicleInfo.vehicle_type_id.id < '3' &&(singleVehicleInfo.trip_sheet_info.sap_flag == '1' ||singleVehicleInfo.trip_sheet_info.sap_flag == '2')) {
      let SAPData = new FormData()
      console.log(singleVehicleInfo)
      SAPData.append('TRIP_SHEET', singleVehicleInfo.trip_sheet_info.trip_sheet_no)
      SAPData.append('VEHICLE_NO', singleVehicleInfo.vehicle_number)
      SAPData.append('VEHICLE_TYPE', vehicle_type_find(singleVehicleInfo.vehicle_type_id.id))
      SAPData.append('DRIVER_NAME', driver_info_find('name'))
      SAPData.append('DRIVER_CODE', driver_info_find('code'))
      SAPData.append('DRIVER_PH_NO', driver_info_find('contact_no'))
      SAPData.append('Purpose', purpose_array[singleVehicleInfo.trip_sheet_info.purpose-1])
      SAPData.append('Division',singleVehicleInfo.trip_sheet_info.purpose == 4 ? '': (singleVehicleInfo.trip_sheet_info.purpose == 3 || singleVehicleInfo.trip_sheet_info.purpose == 5 ?'NLFD': division_array[singleVehicleInfo.trip_sheet_info.to_divison-1]))
      SAPData.append('Stop_Flag', '4') 

      if (values.total_amount < values.advance_payment_diesel) {
        setFetch(true)
        toast.warning('Please Check The Diesel Amount')
        return false
      }
      if (values.vendor_code == '') {
        setFetch(true)
        toast.warning('Please Check The Vendor Code')
        return false
      }
      TripSheetInfoService.StartTSInfoToSAP(SAPData).then((response) => {
        console.log(response, 'StopTSInfoToSAP')
        const data = new FormData()
        data.append('parking_id', values.parking_id)
        data.append('vehicle_id', values.vehicle_id)
        data.append('diesel_vendor_id', values.diesel_vendor_name)
        data.append('driver_id', values.driver_id)
        data.append('tripsheet_id', values.tripsheet_id)
        data.append('vendor_code', values.vendor_code)
        data.append('no_of_ltrs', values.no_of_ltrs || '')
        data.append('total_amount', values.total_amount || '')
        data.append('remarks', values.remarks)
        data.append('created_by', user_id)
        data.append('diesel_status', status)
        data.append('sap_flag','0')
        data.append('sap_tripsheet',response.data[0].TRIP_SHEET) 
        console.log(response.data[0].STATUS)

        if (response.data[0].STATUS != 1) {
          setFetch(true)
          toast.warning('There is a Problem to sent Tripsheet Number to SAP. Kindly Contact Admin..!')
          return false
        }

        DieselIntentCreationService.createDiesel(data).then((res) =>{

          setFetch(true)
          console.log(res)
          if (res.status == 200) {
            setFetch(true)
            toast.success('Diesel Intent Created Successfully!')
            setAcceptBtn(true)
            navigation('/DieselIntentHome')
          } else if (res.status == 202) {
            setFetch(true)
            toast.error(res.data.message)
            return false
          } else if (res.status == 201) {
            // setFetch(true)
            toast.error(res.data.message+'. Kindly contact Admin!')
            setAcceptBtn(true)
            navigation('/DieselIntentHome')
          }
        })
        .catch((error) => {
          // setState({ ...state })
          setFetch(true)
          for (let value of data.values()) {
            console.log(value)
          }
          console.log(error)
          var object = error.response.data.errors
          var output = ''
          for (var property in object) {
            output += '*' + object[property] + '\n'
          }
          // setError(output)
          // setErrorModal(true)
        })
      })
    } else {

      let FreightValue = Number(singleVehicleInfo.trip_sheet_info.freight_rate_per_tone * singleVehicleInfo.vehicle_capacity_id.capacity);
      let TotalValue = (singleVehicleInfo.trip_sheet_info.freight_rate_per_tone * singleVehicleInfo.vehicle_capacity_id.capacity)-(Number(values.total_amount)+Number(singleVehicleInfo.trip_sheet_info.advance_amount));

      console.log(TotalValue)
      console.log(FreightValue)

      let sum = FreightValue - TotalValue;
      console.log(sum)
      console.log(values.vehicle_type_id)
      if (values.vehicle_type_id == 3 && TotalValue < 0 && singleVehicleInfo.trip_sheet_info.purpose != 4) {
        /* Condition not suitable for others Tripsheets */
        setFetch(true)
        toast.warning('Freight Amount And Balance Amount Do Not Matched')
        return false
      }

      const data = new FormData()
      console.log('values')
      data.append('parking_id', values.parking_id)
      data.append('vehicle_id', values.vehicle_id)
      data.append('diesel_vendor_id', values.diesel_vendor_name)
      data.append('driver_id', values.driver_id)
      data.append('tripsheet_id', values.tripsheet_id)
      data.append('vendor_code', values.vendor_code)
      data.append('no_of_ltrs', values.no_of_ltrs || '')
      data.append('total_amount', values.total_amount || '')
      data.append('remarks', values.remarks)
      data.append('created_by', user_id)
      data.append('diesel_status', status)

      console.log(values.total_amount,'values.total_amount')
      console.log(values.advance_payment_diesel,'values.advance_payment_diesel')

      // if (values.total_amount != 0 && values.total_amount < values.advance_payment_diesel) {
      //   setFetch(true)
      //   toast.warning('Please Check The Diesel Amount')
      //   return false
      // }
      if (isTouched.total_amount && !/^[\d]{1,6}$/.test(values.total_amount)) {
        toast.warning('Diesel Amount Should be in a numeric..')
        setFetch(true)
        return false
      }
      if (values.vendor_code == '') {
        setFetch(true)
        toast.warning('Please Check The Vendor Code')
        return false
      }

      // return false

      if(idt.length > 0 && singleVehicleInfo.trip_sheet_info.purpose == 1 && singleVehicleInfo.trip_sheet_info.to_divison == 1){
        let totalfreight = totalvaluefinder(2,singleVehicleInfo.shipment_info[0])
        let fixed_1st_advance_freight = totalfreight*4/5
        data.append('is_freight_change', 1)
        data.append('total_freight', totalfreight)
        data.append('fixed_1st_advance_freight', fixed_1st_advance_freight)
        data.append('diesel_advance_amount', values.total_amount)
      }

      // toast.success('validation completed..')
      // return false
      DieselIntentCreationService.createDiesel(data).then((res) => {
        if (res.status === 200) {
          setFetch(true)
          toast.success('Diesel Intent Created Successfully!')
          setAcceptBtn(true)
          navigation('/DieselIntentHome')
        } else if (res.status == 202) {
          setFetch(true)
          toast.error(res.data.message)
          return false
        }
      })
      .catch((error) => {
        // setState({ ...state })
        for (let value of data.values()) {
          console.log(value)
        }
        console.log(error)
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        // setError(output)
        // setErrorModal(true)
      })
    }
  }

  useEffect(() => {
    if (Object.keys(errors).length === 0 && Object.keys(isTouched)) {
      setValidateSubmit(false)
    } else {
      setValidateSubmit(true)
    }

    console.log(singleVehicleInfo)
    console.log(values)
    topayPartyCheck(singleVehicleInfo)
  })

  useEffect(() => {
    if (isTouched.diesel_vendor_name && !errors.diesel_vendor_name) {
      setAcceptBtn(false)
    } else {
      setAcceptBtn(true)
    }
  }, [errors])

  const [topayPartyFreightLock, setTopayPartyFreightLock] = useState(false)

  const topayPartyCheck = (topayPartyCheckData) => {
    console.log(topayPartyCheckData,'topayPartyCheckData')
    let tpv = 0

    if(topayPartyCheckData && topayPartyCheckData.trip_sheet_info && topayPartyCheckData.trip_sheet_info.purpose == 1 && (topayPartyCheckData.trip_sheet_info.to_divison == 1 || topayPartyCheckData.trip_sheet_info.to_divison == 2)){

      if(topayPartyCheckData.shipment_info && topayPartyCheckData.shipment_info[0].shipment_all_child_info){
        tpv = topayPartyValid(topayPartyCheckData.shipment_info[0].shipment_all_child_info)
      }  
    }  
    console.log(tpv,'tpv')
    if(tpv == '101'){
      setTopayPartyFreightLock(true)
    } else {
      setTopayPartyFreightLock(false)
    }

  }

  const topayPartyValid = (topayPartyValidData) => {
    var inco_term_array = ["381","382"]
    let shipment_inco_term_array = []
    console.log(topayPartyValidData,'topayPartyValidData')

    topayPartyValidData.map((vv,kk)=>{

      if(JavascriptInArrayComponent(vv.inco_term_id,inco_term_array))
      {
        //
      } else {
        shipment_inco_term_array.push(vv.inco_term_id)
      }
      
    })

    console.log(shipment_inco_term_array,'shipment_inco_term_array')

    if(shipment_inco_term_array.length == 0 && topayPartyValidData.length > 0){
      return '101'
    } else {
      return '102'
    }

  }

  /* Getting Vehicle Route From Child Component */
  const getDA = (data_need) => {
    console.log(data_need,'getDA')
    setDieselAdvanceExists(data_need)
  }

  const getBA = (data_need) => {
    console.log(data_need,'getBA')
    setBankAdvanceExists(data_need)
  }

  const getDL = (data_need) => {
    console.log(data_need,'getDL')
    setDieselAdvanceLimitExists(data_need)
  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>
        {screenAccess ? (
         <>
          <CCard>
            {singleVehicleInfo && (
              <CForm className="container p-3" onSubmit={handleSubmit}>
                {singleVehicleInfo.vehicle_type_id.id === vehicleType.OWN ||
                singleVehicleInfo.vehicle_type_id.id === vehicleType.CONTRACT ? (
                  <DieselCreationOwn
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    singleVehicleInfo={singleVehicleInfo}
                    isTouched={isTouched}
                    dirverAssign={dirverAssign}
                    setDirverAssign={setDirverAssign}
                  />
                ) : (
                  <DieselCreationHire
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    singleVehicleInfo={singleVehicleInfo}
                    isTouched={isTouched}
                    getDA={getDA} /* Diesel Advancve Amount Exists */
                    getBA={getBA} /* Bank Advancve Amount Exists */
                    getDL={getDL} /* Diesel Advancve Amount Limit Exists */
                  />
                )}

              <CRow className="mt-md-3">

                {topayPartyFreightLock && (
                  <CCol xs={12} md={9} style={{ display: 'flex', justifyContent: 'end' }}>
                    {singleVehicleInfo && singleVehicleInfo.shipment_info &&  singleVehicleInfo.shipment_info[0] && singleVehicleInfo.shipment_info[0].shipment_no && (
                      <span style={{ color: 'red' }}>
                        {`*Shipment (${singleVehicleInfo.shipment_info[0].shipment_no}) Having Topay / Party Deliveries only. So Diesel Indent Creation not possible for this Tripsheet..`}
                      </span>
                    )}
                  </CCol>
                )}
              </CRow>

              <CRow className="mt-md-3">
                <CCol className="" xs={12} sm={12} md={3}>
                  <CButton size="sm" color="primary" className="text-white" type="button">
                    <Link className="text-white" to="/DieselIntentHome">
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
                   {singleVehicleInfo.vehicle_type_id.id === vehicleType.OWN ||
                   singleVehicleInfo.vehicle_type_id.id === vehicleType.CONTRACT ? (

                  <CButton
                    size="sm"
                    color="warning"
                    className="mx-3 px-3 text-white"
                    // type="button"
                    disabled={acceptBtn}
                    onClick={() => setConfirmBtn(true)}
                    // type="submit"
                  >
                    Submit
                  </CButton>) : (

                  <CButton
                  size="sm"
                  color="warning"
                  className="mx-3 px-3 text-white"
                  // type="button"
                  disabled={acceptBtn || topayPartyFreightLock || dieselAdvanceLimitExists || (idt.length > 0 && singleVehicleInfo.trip_sheet_info.purpose == 1 && singleVehicleInfo.trip_sheet_info.to_divison == 1 && (dieselAdvanceExists))}
                  // disabled={acceptBtn || topayPartyFreightLock || dieselAdvanceLimitExists || (idt.length > 0 && singleVehicleInfo.trip_sheet_info.purpose == 1 && singleVehicleInfo.trip_sheet_info.to_divison == 1 && (dieselAdvanceExists || bankAdvanceExists))} /* Bank Advancve Amount Exists */
                  onClick={() => {
                    setFetch(false)
                    CreateDieselIntent(1)
                  }}
                  // type="submit"
                >
                  Submit
                </CButton>
                  )}

                    {/* <CButton
                        size="sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        type="button"
                        onClick={ () =>{setFetch(false)
                          CreateAdvanceOwn(2)}}
                      >
                      Reject
                      </CButton> */}
                  </CCol>
                </CRow>
              </CForm>
            )}
          </CCard>
         </>) : (<AccessDeniedComponent />)}
        </>
      )}

    <CModal visible={confirmBtn} onClose={() => setConfirmBtn(false)}>
        <CModalBody>
          <p className="lead">Are You sure To Create Diesel Intent ?</p>
          <b style={{color:'red'}}>Note : If diesel intent created,You can not create RJ Sale Order for this tripsheet.</b>
        </CModalBody>
        <CModalFooter>
          <CButton className="m-2" color="secondary" onClick={() =>setConfirmBtn(false)}>
            No
          </CButton>
          <CButton color="warning" onClick={() => {
            setConfirmBtn(false)
            setFetch(false)
            CreateDieselIntent(1)}}>
            Yes
          </CButton>
          {/* <CButton color="primary">Save changes</CButton> */}
        </CModalFooter>
      </CModal>

    </>
  )
}

export default DieselIntent
