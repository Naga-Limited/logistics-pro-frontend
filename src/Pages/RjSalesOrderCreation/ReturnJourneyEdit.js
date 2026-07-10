/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CAlert,
  CModalFooter,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import { React, useState, useEffect } from 'react'
import useFormRJSO from 'src/Hooks/useFormRJSO'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import UOMService from 'src/Service/SubMaster/UomApi'
import Loader from 'src/components/Loader'
import RJSaleOrderCreationValidation from 'src/Utils/RJSaleOrderCreation/RJSaleOrderCreationValidation'
import RJSaleOrderCreationService from 'src/Service/RJSaleOrderCreation/RJSaleOrderCreationService'
import CustomerCreationService from 'src/Service/CustomerCreation/CustomerCreationService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import Swal from 'sweetalert2'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import RJSaleOrderCreationSapService from 'src/Service/SAP/RJSaleOrderCreationSapService'

const ReturnJourneyEdit = () => {
  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  /*Remarks CAPS Textbox Start*/
  const [rjvehicleNumber, setRjvehicleNumber] = useState(0)
  const [message, setMessage] = useState('')
  const handleChangeRemarks = (event) => {
    const result = event.target.value.toUpperCase()
    console.log('value.message', message)
    setMessage(result)
  }

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.RJSOModule.RJSO_Account_Receivable

  const { id } = useParams()

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

  /*=========(*R)Return Journey Vehicle Number, Tripsheet Number Search Select Start=======*/
  useEffect(() => {
    if (rjvehicleNumber != 0) {
      values.vehicleNumber = rjvehicleNumber
      isTouched.tripsheetNumber = true
      console.log(rjvehicleNumber)
      let filterData = vehiclesToRJSO.filter((c, index) => {
        if (rjvehicleNumber == c.vehicle_id) {
          return true
        }
      })
      console.log(filterData)
      setTsno(filterData[0].trip_sheet_info.trip_sheet_no)
      setVehNo(filterData[0].vehicle_number)
      setTSID(filterData[0].tripsheet_sheet_id)
      setDID(filterData[0].driver_id)
      setParkingID(filterData[0].parking_yard_gate_id)
    } else {
      setTsno('')
      setVehNo('')
      setParkingID('')
      values.tripsheetNumber = ''
      values.vehicleNumber = ''
    }
  }, [rjvehicleNumber])
  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')
    if (event_type == 'vehicle_no') {
      if (selected_value) {
        setRjvehicleNumber(selected_value)
        console.log('Vehicle Number fetch 1')
      } else {
        setRjvehicleNumber(0)
        console.log('Vehicle Number fetch 2')
      }
    }
  }
  /*=======Return Journey Vehicle Number, Tripsheet Number Search Select End=========*/

  const [singleRjsoInfo,setSingleRjsoInfo] = useState({})
  const [materialTypeList, setMaterialTypeList] = useState([])
  const [RJSOCOPYDel, setRJSOCOPYDel] = useState(true)

  useEffect(() => {
    //section to fetch single RJSO info
    RJSaleOrderCreationService.getRJSaleOrderbyId(id).then((res) => {
      setFetch(true)
      let rjsodata = res.data.data
      console.log(rjsodata,'rjsodata')
      values.vehicleNumber = res.data.data.vehicle_id
      values.PaymentTerm = res.data.data.payment_terms
      values.shed_name = res.data.data.shed_id
      values.remarks = res.data.data.remarks
      values.materialDescription = res.data.data.material_descriptions
      values.uomType = res.data.data.uom_id
      values.orderQuantity = res.data.data.order_qty
      values.freight_income = res.data.data.freight_income
      values.advance_amount = res.data.data.advance_amount
      values.advancePaymentMode = res.data.data.advance_payment_mode
      values.advanceReceivedTime = res.data.data.advance_payment_received_time
      values.balancePaymentMode = res.data.data.balance_payment_mode
      values.lastDeliveryPoint = res.data.data.last_Delivery_point
      values.emptyLoad = res.data.data.empty_load_km
      values.loadPoint = res.data.data.loading_point
      values.unloadPoint = res.data.data.unloading_point
      values.emptyUnload = res.data.data.empty_km_after_unloaded
      values.deliveryTime = res.data.data.expected_delivery_date_time
      values.returnTime = res.data.data.expected_return_date_time
      values.material_type = res.data.data.hsn_code
      if(values.rj_shed_copy != null){
        setRJSOCOPYDel(true)
      } else {
        setRJSOCOPYDel(false)
      }
      setSingleRjsoInfo(rjsodata)
    })

    /* section for getting Material Type Lists from database For Material Type Grouping */
    DefinitionsListApi.visibleDefinitionsListByDefinition(15).then((response) => {
      console.log(response.data.data, 'material_type_search')
      setMaterialTypeList(response.data.data)
    })

  }, [id])

  /*Remarks CAPS Textbox End*/

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  const [showMobileWarning, setShowMobileWarning] = useState(false)

  useEffect(() => {
    console.log(window.innerWidth,'window.innerWidth')
    if(window.innerWidth <= 800)
      setShowMobileWarning(true)
  }, [])

  const [deviceType, setDeviceType] = useState("");

  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(
        navigator.userAgent
      )
    ) {
      console.group("deviceType - Mobile")
      setDeviceType("Mobile");
    } else {
      console.group("deviceType - Desktop")
      setDeviceType("Desktop");
    }
  }, []);

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/
  const formValues = {
    vehicleNumber: '',
    tripsheetNumber: '',
    PaymentTerm: '',
    customerName: '',
    customerMobile: '',
    customerPAN: '',
    shed_name: '',
    // shed_pan: '',
    // shed_aadhar: '',
    customerCode: '',
    materialType: '',
    materialDescription: '',
    hsnCode: '',
    uomType: '',
    orderQuantity: '',
    freight_income: '',
    advance_amount: '',
    lastDeliveryPoint: '',
    emptyLoad: '',
    loadPoint: '',
    unloadPoint: '',
    emptyUnload: '',
    deliveryTime: '',
    returnTime: '',
    remarks: '',
    rj_so_no: '',
    parking_id: '',
    advancePaymentMode: '',
    advanceReceivedTime: '',
    balancePaymentMode: '',
    balanceReceivedTime: '',
    balance_amount: '',
    rj_shed_copy:'',
  }
  const [uomType, setUOMType] = useState([])
  const [materialType, setMaterialType] = useState([])
  const [shedName, setShedName] = useState([])
  const [fetch, setFetch] = useState(false)
  const [custName, setCustName] = useState([])
  const [sRVehicle, setSRVehicle] = useState([])
  const [rjShedCopy, setRjShedCopy] = useState('')

  //Auto Fields

  const [tsno, setTsno] = useState('')
  const [hsnCode, setHsnCode] = useState('')
  const [vehNo, setVehNo] = useState('')
  const [parkingID, setParkingID] = useState('')
  const [dId, setDID] = useState('')
  const [tsId, setTSID] = useState('')
  const [vehiclesToRJSO, setVehiclesToRJSO] = useState([])

  const [shedPAN, setShedPAN] = useState('')
  const [shedAadhar, setShedAadhar] = useState('')
  const [shedCode, setShedCode] = useState('')
  const [custCode, setCustCode] = useState('')
  const [custPan, setCustPan] = useState('')
  const [rjsoBalance, setRjsoBalance] = useState('')
  const [custMobile, setCustMobile] = useState('')
  const REQ = () => <span className="text-danger"> * </span>

  const navigation = useNavigate()
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [materialTypeError, setMaterialTypeError] = useState('')

  const {
    values,
    errors,
    handleChange,
    isTouched,
    setIsTouched,
    setErrors,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
  } = useFormRJSO(login, RJSaleOrderCreationValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }

  /* section for getting Material type from database */
  useEffect(() => {
    isTouched.remarks = true

    // MaterialTypeService.getMaterialDescription().then((res) => {
    //   // console.log(res.data.data)
    //   setMaterialType(res.data.data)
    // })
  }, [])

  /* section for getting UOM type from database */
  useEffect(() => {
    UOMService.getUom().then((res) => {
      // console.log(res.data.data)
      setUOMType(res.data.data)
    })
  }, [])

  /* section for getting Customer Details from database */
  useEffect(() => {
    CustomerCreationService.getCustomerCreationData().then((res) => {
      const filterData_shed = res.data.data.filter(
        (datan) => datan.customer_status == 3 && datan.creation_type == 'shed'
      )

      const filterData_customer = res.data.data.filter(
        (datan) => datan.customer_status == 3 && datan.creation_type == 'customer'
      )
      console.log(filterData_shed)
      console.log(filterData_customer)
      setShedName(filterData_shed)
      setCustName(filterData_customer)
    })

    /* section for getting Vehicle Details for Assign RJSO from database */

    RJSaleOrderCreationService.getRJSaleOrder().then((rest) => {
      // setFetch(true)
      console.log('rest')
      console.log(rest.data.data,'tableData')
      let tableData = rest.data.data
      let filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )

      console.log(filterData1,'locationfilterData')
      let filterData = filterData1.filter(
        (data) => (data.trip_sheet_info.purpose == '2' && data.trip_sheet_info.advance_status == '1') || data.trip_sheet_info.purpose != '2'
      )
      console.log(filterData,'filterData')
      setVehiclesToRJSO(filterData)
      // setTsno(rest.data.data.trip_sheet_info.trip_sheet_no)
    })

    /* section for getting Shipment Routes For Shipment Creation from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(11).then((response) => {
      console.log(response.data.data)
      setSRVehicle(response.data.data)
    })
  }, [])

  const handleChangeRjShedCopy = (event) => {
    let valll = event.target.files[0]
    setRjShedCopy(valll)
  }

  /*Set Tripsheet Number, Tripsheet Id, Driver Id After Selecting Vehicle Number*/
  useEffect(() => {
    if (values.vehicleNumber != 0) {
      isTouched.tripsheetNumber = true
      console.log(values.vehicleNumber)
      let filterData = vehiclesToRJSO.filter((c, index) => {
        if (values.vehicleNumber == c.vehicle_id) {
          return true
        }
      })
      console.log(filterData)
      if(filterData.length > 0){
        setTsno(filterData[0].trip_sheet_info.trip_sheet_no)
        setVehNo(filterData[0].vehicle_number)
        setTSID(filterData[0].tripsheet_sheet_id)
        setDID(filterData[0].driver_id)
        setParkingID(filterData[0].parking_yard_gate_id)
      }
    } else {
      setTsno('')
      setVehNo('')
      setParkingID('')
      values.tripsheetNumber = ''
    }
  }, [values.vehicleNumber,vehiclesToRJSO])

  /*Set Shed Details After Selecting Shed Id*/
  useEffect(() => {
    // if (values.vehicleNumber != 0) {
    if (values.shed_name != 0) {
      isTouched.shed_name = true
      isTouched.shed_pan = true
      isTouched.shed_aadhar = true
      isTouched.customerCode = true
      let filterData1 = shedName.filter((c, index) => {
        if (values.shed_name == c.customer_id) {
          return true
        }
      })
      console.log(filterData1)
      if(filterData1.length > 0){
        setShedPAN(
          filterData1[0].customer_PAN_card_number
          // ? filterData1[0].customer_PAN_card_number
          // : 'Not Given'
        )
        setShedAadhar(
          filterData1[0].customer_Aadhar_card_number
          // ? filterData1[0].customer_Aadhar_card_number
          // : 'Not Given'
        )
        setShedCode(filterData1[0].customer_code)
      }

    } else {
      setShedPAN('')
      setShedAadhar('')
      setShedCode('')
    }
  }, [values.shed_name,shedName])

  /* Assign the Shipment Route for Shipment Creation */
  const onChange = (event) => {
    console.log(event, 'event')
    var hsn_value = event.value
    var hsn_label = event.label
    console.log(hsn_value, 'hsn_value')
    // getvroute(route_no)
    if (hsn_value) {
      setMaterialTypeError('')
      setMaterialType(hsn_label)
      setHsnCode(hsn_value)
    } else {
      setMaterialTypeError(' Required')
      setMaterialType('')
      setHsnCode('')
    }
  }

  /*Set Shed Details After Selecting Shed Id*/
  useEffect(() => {
    // if (values.vehicleNumber != 0) {
    if (values.material_type != 0) {
      isTouched.material_type = true
      isTouched.shed_pan = true
      isTouched.shed_aadhar = true
      isTouched.customerCode = true
      let filterData1 = materialTypeList.filter((c, index) => {
        if (values.material_type == c.definition_list_code) {
          return true
        }
      })
      console.log(filterData1)
      if(filterData1.length > 0){
        setMaterialTypeError('')
        setMaterialType(filterData1[0].definition_list_name)
        setHsnCode(filterData1[0].definition_list_code)
      }

    } else {
      setMaterialType('')
      setMaterialTypeError(' Required')
      setHsnCode('')
    }
  }, [values.material_type, materialTypeList])

  /* Set Customer Details After Selecting Customer Name */
  useEffect(() => {
    // if (values.vehicleNumber != 0) {
    if (values.customerName != 0) {
      isTouched.customerMobile = true
      isTouched.customerPAN = true
      isTouched.customerCode = true
      let filterData2 = custName.filter((c, index) => {
        if (values.customerName == c.customer_name) {
          return true
        }
      })
      console.log(filterData2)
      setCustPan(
        filterData2[0].customer_PAN_card_number
        // ? filterData2[0].customer_PAN_card_number
        // : 'Not Given'
      )
      setCustMobile(
        filterData2[0].customer_mobile_number
        // ? filterData2[0].customer_mobile_number : 'Not Given'
      )
      setCustCode(filterData2[0].customer_code)
      // setTsno(filterData[0].trip_sheet_info.trip_sheet_no)
    } else {
      setCustPan('')
      setCustMobile('')
      setCustCode('')
    }
  }, [values.customerName])

  useEffect(() => {
    console.log('1')
    if (
      (values.freight_income && Number(values.freight_income) > 0) ||
      (values.advance_amount && Number(values.advance_amount) > 0)
    ) {
      console.log('12')
      let freight_income =
        values.freight_income && Number(values.freight_income) > 0
          ? Number(values.freight_income)
          : 0
      let advance =
        values.advance_amount && Number(values.advance_amount) > 0
          ? Number(values.advance_amount)
          : 0

      console.log(freight_income, 'total_amount')
      console.log(advance, 'advance')
      console.log(freight_income - advance)
      setRjsoBalance(freight_income - advance)
    } else {
      console.log('123')
      setRjsoBalance('')
    }
  }, [values.freight_income, values.advance_amount,singleRjsoInfo])

  useEffect(() => {
    if (values.PaymentTerm != '0') {
      isTouched.customerCode = true
    } else {
      values.customerCode = ''
      setShedPAN('')
      setShedAadhar('')
      values.shed_name = '0'
      // console.log(values.customerCode + '/confirm1/')
    }
  }, [values.PaymentTerm])

  function createRJSalesOrder() {

    console.log(rjShedCopy,'rjShedCopy')

    if(singleRjsoInfo.rj_shed_copy == ''){
      if(rjShedCopy == ''){
        setFetch(true)
        toast.warning('Rj Shed Copy should be attach, before submission..!')
        return false
      }

      console.log(rjShedCopy.size,'rjShedCopy-size')

      if(rjShedCopy.size > 5000000){
        setFetch(true)
        toast.warning('Attached rj shed copy should not having size more than 5Mb..!')
        return false
      }
    }

    let data = new FormData()
    data.append('HSN_SAC', hsnCode)
    data.append('KUNNR', values.PaymentTerm == '1' ? shedCode : custCode)
    data.append('NETWR', values.freight_income)
    data.append('MATNR', materialType.toUpperCase())
    data.append('TRIPSHEET_NO', singleRjsoInfo.tripsheet_id)
    data.append('VEH_NO', singleRjsoInfo.vehicle_info.vehicle_number)

    RJSaleOrderCreationSapService.createRJSaleOrder(data).then((res) => {
        console.log(res)
        console.log(res.data.SALEORDER_NO)

        let sap_saleorder_no = res.data.SALEORDER_NO
        let sap_status = res.data.STATUS
        let sap_ts_saleorder = res.data.TRIPSHEET_NO

        console.log(sap_saleorder_no + '/' + sap_status + '/' + sap_ts_saleorder)

        if (sap_status == '1' && res.status == 200 && sap_saleorder_no && sap_ts_saleorder) {

          const formData = new FormData()
          formData.append('rjso_id', id)
          formData.append('vehicle_id', values.vehicleNumber)
          formData.append('driver_id', dId)
          formData.append('trip_id', tsId)
          formData.append('tripsheet_id', tsno)
          formData.append('payment_terms', values.PaymentTerm)
          formData.append('pay_customer_name', values.PaymentTerm == '2' ? values.customerName : '')
          formData.append('customer_mobile_no', values.PaymentTerm == '2' ? custMobile : '')
          formData.append('customer_PAN_number', values.PaymentTerm == '2' ? custPan : '')
          formData.append('shed_id', values.shed_name)
          // formData.append('shed_pan', values.shed_pan)
          // formData.append('shed_aadhar', values.shed_aadhar)
          // formData.append('material_description_id', values.materialType)
          formData.append('material_descriptions', values.materialDescription)
          formData.append('uom_id', values.uomType)
          formData.append('order_qty', values.orderQuantity)
          formData.append('freight_income', values.freight_income)
          formData.append('advance_amount', values.advance_amount)
          formData.append('advance_payment_mode', values.advancePaymentMode)
          formData.append('advance_payment_received_time', values.advanceReceivedTime || '')
          formData.append('balance_payment_received_time', values.balanceReceivedTime || '')
          formData.append('balance_amount', rjsoBalance)
          formData.append(
            'balance_payment_mode',
            values.balancePaymentMode ? values.balancePaymentMode : ''
          )
          formData.append('last_Delivery_point', values.lastDeliveryPoint)
          formData.append('empty_load_km', values.emptyLoad)
          formData.append('loading_point', values.loadPoint)
          formData.append('unloading_point', values.unloadPoint)
          formData.append('empty_km_after_unloaded', values.emptyUnload)
          formData.append('expected_delivery_date_time', values.deliveryTime)
          formData.append('expected_return_date_time', values.returnTime)

          /*===========(R*)Remarks Value Pass in ==========*/
          formData.append('update_remarks', message)
          /*==============================================*/
          formData.append('updated_by', user_id)
          formData.append('rjso_status', 1)
          formData.append('customer_code', values.PaymentTerm == '1' ? shedCode : custCode)
          formData.append('hsn_code', hsnCode)
          formData.append('parking_id', parkingID ? parkingID : '')
          formData.append('rj_so_no', sap_saleorder_no)
          formData.append('rj_shed_copy', rjShedCopy)
          RJSaleOrderCreationService.rjsoRequestFormUpdation(formData).then((res) => {
          // RJSaleOrderCreationService.rjsoRequestFormCreation(formData).then((res) => {

            console.log(res,'rjsoRequestFormUpdation')
            setFetch(true)
            if (res.status == 200) {
              Swal.fire({
                title: 'RJSaleOrder Created Successfully!',
                icon: "success",
                text:  'RJ SaleOrder No : ' + sap_saleorder_no,
                confirmButtonText: "OK",
              }).then(function () {
                navigation('/RjSalesOrderReceivable')
              });
            } else {
              Swal.fire({
                title: 'RJ Saleorder Request Cannot Be Updated in LP.. Kindly Contact Admin!',
                icon: "warning",
                confirmButtonText: "OK",
              }).then(function () {
                window.location.reload(false)
              })
            }
          })
          .catch((error) => {
            setFetch(true)
            // setState({ ...state })
            for (let value of formData.values()) {
              console.log(value)
            }
            console.log(error)
            var object = error.response.data.errors
            var output = ''
            for (var property in object) {
              output += '*' + object[property] + '\n'
            }
            setError(output)
            setErrorModal(true)
          })
        } else {
          setFetch(true)
          Swal.fire({
            title: 'RJ Saleorder Cannot Be Created From SAP.. Kindly Contact Admin!',
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            window.location.reload(false)
          })
          // toast.warning('RJ Saleorder Cannot Be Created From SAP.. Kindly Contact Admin!')
          // setTimeout(() => {
          //   window.location.reload(false)
          // }, 2000)
        }
      })
      .catch((error) => {
        setFetch(true)
        // setState({ ...state })
        console.log(error)
        alert(error.message)
      })

  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess && !showMobileWarning ? (
            <>
          <CCard>
            <CTabContent>
              <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                <CForm className="container p-3" onSubmit={handleSubmit}>
                  <CRow>
                    {/* =====================<(*R)Vehicle Number Trip Sheet Search Filter Start==============  */}
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="vehicleNumber">Vehicle Number</CFormLabel>
                      <CFormInput
                        size="sm"
                        id="vehicleNumber"
                        value={singleRjsoInfo.vehicle_info ? singleRjsoInfo.vehicle_info.vehicle_number : '-'}
                        readOnly
                      />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="tripsheetNumber">Tripsheet Number</CFormLabel>
                      <CFormInput
                        size="sm"
                        id="tripsheetNumber"
                        value={singleRjsoInfo.tripsheet_id ? singleRjsoInfo.tripsheet_id : '-'}
                        readOnly
                      />
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="PaymentTerm">
                        Payment Terms <REQ />{' '}
                        {errors.PaymentTerm && (
                          <span className="small text-danger">{errors.PaymentTerm}</span>
                        )}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="PaymentTerm"
                        id="PaymentTerm"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        value={values.PaymentTerm}
                        className={`${errors.PaymentTerm && 'is-invalid'}`}
                        aria-label="Small select example"
                        disabled
                      >
                        <option value="0">Select...</option>
                        <option value="1">Shed</option>
                        <option value="2">To Pay</option>
                      </CFormSelect>
                    </CCol>

                    {/* ================================================================================= */}

                    {values.PaymentTerm == 2 && (
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="customerName">
                          To Pay Customer Name <REQ />{' '}
                          {errors.customerName && (
                            <span className="small text-danger">{errors.customerName}</span>
                          )}
                        </CFormLabel>
                        <CFormSelect
                          size="sm"
                          name="customerName"
                          id="customerName"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          value={values.customerName}
                          className={`${errors.customerName && 'is-invalid'}`}
                          aria-label="Small select example"
                        >
                          {/* <CFormSelect size="sm" aria-label="Small select example" id="vNum"> */}
                          <option value="0">Select...</option>
                          {custName.map(({ customer_id, customer_name }) => {
                            if (customer_id) {
                              return (
                                <>
                                  <option key={customer_id} value={customer_name}>
                                    {customer_name}
                                  </option>
                                </>
                              )
                            }
                          })}
                        </CFormSelect>
                      </CCol>
                    )}

                    {values.PaymentTerm == 2 && (
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="customerMobile">
                          Customer Mobile Number <REQ />{' '}
                        </CFormLabel>
                        <CFormInput
                          name="customerMobile"
                          size="sm"
                          maxLength={10}
                          id="customerMobile"
                          onChange={handleChange}
                          value={custMobile}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          placeholder=""
                          readOnly
                        />
                      </CCol>
                    )}
                    {values.PaymentTerm == 2 && (
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="customerPAN">Customer PAN Number </CFormLabel>
                        <CFormInput
                          name="customerPAN"
                          size="sm"
                          maxLength={10}
                          id="customerPAN"
                          onChange={handleChange}
                          value={custPan}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          placeholder=""
                          readOnly
                        />
                      </CCol>
                    )}
                    {/* ================================================================================= */}
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="shed_name">
                        Shed Name <REQ />{' '}
                        {errors.shed_name && (
                          <span className="small text-danger">{errors.shed_name}</span>
                        )}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="shed_name"
                        onChange={handleChange}
                        onFocus={onFocus}
                        value={values.shed_name}
                        className={`mb-1 ${errors.shed_name && 'is-invalid'}`}
                        aria-label="Small select example"
                        id="shed_name"
                      >
                        <option value="0">Select ...</option>
                        {shedName.map(({ customer_id, customer_name }) => {
                          if (customer_id) {
                            return (
                              <>
                                <option key={customer_id} value={customer_id}>
                                  {customer_name}
                                </option>
                              </>
                            )
                          }
                        })}
                      </CFormSelect>
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="shedPAN">Shed PAN Number </CFormLabel>
                      <CFormInput
                        name="shed_pan"
                        size="sm"
                        maxLength={10}
                        id="shed_pan"
                        onChange={handleChange}
                        value={shedPAN}
                        // value={values.shedPAN}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                        readOnly
                      />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="shedPAN">Shed Aadhar Number </CFormLabel>
                      <CFormInput
                        name="shed_aadhar"
                        size="sm"
                        // maxLength={10}
                        id="shed_aadhar"
                        onChange={handleChange}
                        value={shedAadhar}
                        // value={values.shedPAN}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                        readOnly
                      />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="customerCode">
                        Customer Code
                        {errors.customerCode && (
                          <span className="small text-danger">{errors.customerCode}</span>
                        )}
                      </CFormLabel>

                      <CFormInput
                        name="customerCode"
                        size="sm"
                        id="orderQuantity"
                        onChange={handleChange}
                        value={
                          values.PaymentTerm == '1'
                            ? shedCode
                            : values.PaymentTerm == '2'
                            ? custCode
                            : ''
                        }
                        // value={}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        // maxLength={5}
                        className={`${errors.customerCode && 'is-invalid'}`}
                        placeholder=""
                        readOnly
                      />
                    </CCol>
                    <CCol>
                      <CFormLabel htmlFor="material_type">
                        Material Type <REQ />
                        {materialTypeError && (
                          <span className="small text-danger">{materialTypeError}</span>
                        )}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="material_type"
                        onChange={handleChange}
                        onFocus={onFocus}
                        value={values.material_type}
                        className={`mb-1 ${errors.material_type && 'is-invalid'}`}
                        aria-label="Small select example"
                        id="material_type"
                      >
                        <option value="0">Select ...</option>
                        {materialTypeList.map(({definition_list_code, definition_list_name}) => {
                          if (definition_list_code) {
                            return (
                              <>
                                <option key={definition_list_code} value={definition_list_code}>
                                  {definition_list_name}
                                </option>
                              </>
                            )
                          }
                        })}
                      </CFormSelect>
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="hsnCode">HSN Code</CFormLabel>
                      <CFormInput name="hsnCode" size="sm" maxLength={8} value={hsnCode} readOnly />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="materialDescription">
                        Material Description <REQ />{' '}
                        {errors.materialDescription && (
                          <span className="small text-danger">{errors.materialDescription}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="materialDescription"
                        size="sm"
                        maxLength={20}
                        id="materialDescription"
                        onChange={handleChange}
                        value={values.materialDescription}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="uomType">
                        UOM <REQ />{' '}
                        {errors.uomType && (
                          <span className="small text-danger">{errors.uomType}</span>
                        )}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="uomType"
                        onChange={handleChange}
                        onFocus={onFocus}
                        value={values.uomType}
                        className={`mb-1 ${errors.uomType && 'is-invalid'}`}
                        aria-label="Small select example"
                        id="uomType"
                      >
                        <option value="0">Select ...</option>
                        {uomType.map(({ id, uom }) => {
                          if (id) {
                            return (
                              <>
                                <option key={id} value={id}>
                                  {uom}
                                </option>
                              </>
                            )
                          }
                        })}
                      </CFormSelect>
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="orderQuantity">
                        Order Qty <REQ />{' '}
                        {errors.orderQuantity && (
                          <span className="small text-danger">{errors.orderQuantity}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="orderQuantity"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        maxLength={9}
                        className={`${errors.orderQuantity && 'is-invalid'}`}
                        value={values.orderQuantity}
                        size="sm"
                        id="orderQuantity"
                        placeholder=""
                      />
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="freight_income">
                        Freight Income <REQ />{' '}
                        {errors.freight_income && (
                          <span className="small text-danger">{errors.freight_income}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="freight_income"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        // type="number"
                        maxLength={5}
                        onChange={handleChange}
                        className={`${errors.freight_income && 'is-invalid'}`}
                        size="sm"
                        value={values.freight_income}
                        id="freight_income"
                        placeholder=""
                      />
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="advance_amount">
                        Advance Amount <REQ />{' '}
                        {errors.advance_amount && (
                          <span className="small text-danger">{errors.advance_amount}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="advance_amount"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        // type="number"
                        maxLength={5}
                        onChange={handleChange}
                        className={`${errors.advance_amount && 'is-invalid'}`}
                        value={values.advance_amount}
                        size="sm"
                        id="advance_amount"
                        placeholder=""
                      />
                    </CCol>
                    {values.advance_amount && Number(values.advance_amount) > 0 && (
                      <>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="advancePaymentMode">
                            Advance Payment Mode <REQ />{' '}
                            {errors.advancePaymentMode && (
                              <span className="small text-danger">{errors.advancePaymentMode}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="advancePaymentMode"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.advancePaymentMode}
                            className={`mb-1 ${errors.advancePaymentMode && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="advancePaymentMode"
                          >
                            <option value="0">Select ...</option>
                            {sRVehicle.map(({ definition_list_code, definition_list_name }) => {
                              if (definition_list_code) {
                                return (
                                  <>
                                    <option key={definition_list_code} value={definition_list_code}>
                                      {definition_list_name}
                                    </option>
                                  </>
                                )
                              }
                            })}
                          </CFormSelect>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="deliveryTime">
                            Advance Payment Received Date & Time
                            {errors.advanceReceivedTime && (
                              <span className="small text-danger">
                                {errors.advanceReceivedTime}
                              </span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="advanceReceivedTime"
                            size="sm"
                            // maxLength={3}
                            id="advanceReceivedTime"
                            onChange={handleChange}
                            type="datetime-local"
                            value={values.advanceReceivedTime}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>
                      </>
                    )}
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="balance_amount">Balance Amount</CFormLabel>
                      <CFormInput
                        name="balance_amount"
                        value={rjsoBalance}
                        size="sm"
                        id="balance_amount"
                        readOnly
                      />
                    </CCol>
                    {rjsoBalance > 0 && (
                      <>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="advancePaymentMode">
                            Balance Payment Mode <REQ />{' '}
                            {errors.balancePaymentMode && (
                              <span className="small text-danger">{errors.balancePaymentMode}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="balancePaymentMode"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.balancePaymentMode}
                            className={`mb-1 ${errors.balancePaymentMode && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="balancePaymentMode"
                          >
                            <option value="0">Select ...</option>
                            {sRVehicle.map(({ definition_list_code, definition_list_name }) => {
                              if (definition_list_code) {
                                return (
                                  <>
                                    <option key={definition_list_code} value={definition_list_code}>
                                      {definition_list_name}
                                    </option>
                                  </>
                                )
                              }
                            })}
                          </CFormSelect>
                        </CCol>
                      </>
                    )}
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="lastDeliveryPoint">
                        Last Delivery Point <REQ />{' '}
                        {errors.lastDeliveryPoint && (
                          <span className="small text-danger">{errors.lastDeliveryPoint}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="lastDeliveryPoint"
                        size="sm"
                        maxLength={20}
                        id="lastDeliveryPoint"
                        onChange={handleChange}
                        value={values.lastDeliveryPoint}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="emptyLoad">
                        Empty Load KM <REQ />{' '}
                        {errors.emptyLoad && (
                          <span className="small text-danger">{errors.emptyLoad}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="emptyLoad"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        maxLength={3}
                        className={`${errors.emptyLoad && 'is-invalid'}`}
                        value={values.emptyLoad}
                        size="sm"
                        id="emptyLoad"
                        placeholder=""
                      />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="loadPoint">
                        Loading Point <REQ />{' '}
                        {errors.loadPoint && (
                          <span className="small text-danger">{errors.loadPoint}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="loadPoint"
                        size="sm"
                        maxLength={20}
                        id="loadPoint"
                        onChange={handleChange}
                        value={values.loadPoint}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="unloadPoint">
                        Unloading Point <REQ />{' '}
                        {errors.unloadPoint && (
                          <span className="small text-danger">{errors.unloadPoint}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="unloadPoint"
                        size="sm"
                        maxLength={20}
                        id="unloadPoint"
                        onChange={handleChange}
                        value={values.unloadPoint}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="emptyUnload">
                        Empty Km After Unload <REQ />{' '}
                        {errors.emptyUnload && (
                          <span className="small text-danger">{errors.emptyUnload}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="emptyUnload"
                        size="sm"
                        maxLength={3}
                        id="emptyUnload"
                        onChange={handleChange}
                        value={values.emptyUnload}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="deliveryTime">
                        Expected Delivery Date & Time <REQ />{' '}
                        {errors.deliveryTime && (
                          <span className="small text-danger">{errors.deliveryTime}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="deliveryTime"
                        size="sm"
                        // maxLength={3}
                        id="deliveryTime"
                        onChange={handleChange}
                        type="datetime-local"
                        value={values.deliveryTime}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="returnTime">
                        Expected Return Date & Time <REQ />{' '}
                        {errors.returnTime && (
                          <span className="small text-danger">{errors.returnTime}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="returnTime"
                        size="sm"
                        // maxLength={3}
                        id="returnTime"
                        onChange={handleChange}
                        type="datetime-local"
                        value={values.returnTime}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />

                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="rjShedCopy">
                        RJ Shed Copy Attachment
                      </CFormLabel>
                      {RJSOCOPYDel ? (
                        <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                          <span className="float-start">
                            <a style={{color:'black'}} target='_blank' rel="noreferrer" href={singleRjsoInfo.rj_shed_copy}>
                              <i className="fa fa-eye" aria-hidden="true">&nbsp;View</i>
                            </a>
                          </span>
                          <span className="float-end">
                            <i
                              className="fa fa-trash"
                              aria-hidden="true"
                              onClick={() => setRJSOCOPYDel(false)}
                            >&nbsp;Delete</i>
                          </span>
                        </CButton>
                      ) : (
                        <CFormInput
                          onChange={handleChangeRjShedCopy}
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          name="rjShedCopy"
                          size="sm"
                          id="rjShedCopy"
                        />
                      )}

                    </CCol>
                    {/* <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="updateRjShedCopy">
                        Update RJ Shed Copy Attachment <REQ />{' '}
                      </CFormLabel>
                      <CFormInput
                        onChange={handleChangeRjShedCopy}
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        name="rjShedCopy"
                        size="sm"
                        id="rjShedCopy"
                      />
                    </CCol> */}
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="remarks">Request Remarks</CFormLabel>
                      <CFormInput
                        size="sm"
                        id="remarks"
                        name="remarks"
                        value={values.remarks}
                        readOnly
                      />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="message">Approval Remarks</CFormLabel>

                      {/* ================ Remarks Textbox Enter CAPS Start ============*/}
                      <CFormInput
                        size="sm"
                        id="message"
                        name="message"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        value={message}
                        onChange={handleChangeRemarks}
                      />
                      {/*=================== Remarks Textbox Enter CAPS End ==========*/}
                    </CCol>
                  </CRow>

                  <CRow className="mt-3">
                    <CCol className="" xs={12} sm={9} md={3}>
                      <Link to={'/RjSalesOrderReceivable'}>
                        <CButton
                          size="s-lg"
                          color="warning"
                          className="mx-1 px-2 text-white"
                          type="button"
                        >
                          BACK
                        </CButton>
                      </Link>
                    </CCol>

                    <CCol
                      className="offset-md-6"
                      xs={12}
                      sm={9}
                      md={3}
                      style={{ display: 'flex', justifyContent: 'end' }}
                    >
                      <CButton
                        size="sm"
                        color="warning"
                        disabled={enableSubmit}
                        className="mx-3 px-3 text-white"
                        // type="submit"
                        onClick={() => {
                          setFetch(false)
                          createRJSalesOrder()
                        }}
                      >
                        Submit
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CTabPane>
            </CTabContent>
          </CCard>
          {/* Error Modal Section */}
          <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
            <CModalHeader>
              <CModalTitle className="h4">Error</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <CCol>
                  {error && (
                    <CAlert color="danger" data-aos="fade-down">
                      {error}
                    </CAlert>
                  )}
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton onClick={() => setErrorModal(false)} color="primary">
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          {/* Error Modal Section */}
            </> ) : (<AccessDeniedComponent />)
          }
        </>
      )}
    </>
  )
}
export default ReturnJourneyEdit
