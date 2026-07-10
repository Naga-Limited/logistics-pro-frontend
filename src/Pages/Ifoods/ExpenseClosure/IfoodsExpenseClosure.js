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
  CCardImage,
  CBadge,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CButtonGroup,
  CFormCheck,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import Loader from 'src/components/Loader'

import * as TripsheetClosureConstants from 'src/components/constants/TripsheetClosureConstants'

import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

import TripSheetClosureSapService from 'src/Service/SAP/TripSheetClosureSapService'
import { MultiSelect } from 'react-multi-select-component'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import FileResizer from 'react-image-file-resizer'
import ExpenseCalculations from 'src/Pages/TripsheetClosure/Calculations/ExpenseCalculations'
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'
import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService'
import useFormDepoExpenseClosure from 'src/Hooks/useFormDepoExpenseClosure'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import Swal from 'sweetalert2'
import IfoodsExpenseClosureService from 'src/Service/Ifoods/ExpenseClosure/IfoodsExpenseClosureService'

const IfoodsExpenseClosure = () => {
  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  // const Expense_Income_Posting_Date = ExpenseIncomePostingDate();
  // console.log(Expense_Income_Posting_Date,'ExpenseIncomePostingDate')

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  const webcamRef = React.useRef(null)
  const [fileuploaded, setFileuploaded] = useState(false)
  const [camEnable, setCamEnable] = useState(false)
  const [camEnableType, setCamEnableType] = useState('')
  const [imgSrc, setImgSrc] = React.useState(null)
  const [locationData, setLocationData] = useState([])
  const [settlementAvailable, setSettlementAvailable] = useState(false)

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImgSrc(imageSrc)
  }, [webcamRef, setImgSrc])

  /* Expense Constants Declaration */
  const [unloadingCharge, setUnloadingCharge] = useState('')
  const [subDeliveryCharge, setSubDeliveryCharge] = useState('')
  const [weighmentCharge, setWeighmentCharge] = useState('')
  const [freightCharge, setFreightCharge] = useState('')
  const [diversionCharge, setDiversionCharge] = useState('')
  const [haltingCharge, setHaltingCharge] = useState('')
  const [adjustedFreightCharge, setAdjustedFreightCharge] = useState('')

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  const [restrictScreenById, setRestrictScreenById] = useState(true)
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Expense_closure

  useEffect(() => {
    if (
      user_info.is_admin == 1 ||
      JavascriptInArrayComponent(page_no, user_info.page_permissions)
    ) {
      //  console.log('screen-access-allowed')
      setScreenAccess(true)
    } else {
      //   console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      setLocationData(res.data.data, 'LocationData')
    })
  }, [])
  /* ==================== Access Part End ========================*/

  const formValues = {
    halt_days: '',
    remarks: '',
    apremarks: '',
    trip_actual_km: '',
    odometer_closing_km: '',
    //  differenceKM:'',
  }

  const [plantMasterData, setPlantMasterData] = useState([])
  useEffect(() => {
    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
      //   console.log(response.data.data)
      setPlantMasterData(response.data.data)
    })
  }, [])

  /* Overall Journey Information Constants */
  const [pmData, setPMData] = useState([])

  const {
    values,
    errors,
    handleChange,
    size,
    name,
    onChange,
    selectedValue,
    isMultiple,
    className,
    label,
    search_type,
    noOptionsMessage,
    isTouched,
    setIsTouched,
    setErrors,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
    handleMultipleChange,
  } = useFormDepoExpenseClosure(login, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }

  const { id } = useParams()
  const [fetch, setFetch] = useState(false)

  const [clearValuesObject, setClearValuesObject] = useState(false)
  const [expenseClosureApproval, setExpenseClosureApproval] = useState(false)
  const [fileImageKey, setFileImageKey] = useState('')

  const [shipmentInfo, setShipmentInfo] = useState([])
  const [rjsoInfo, setRjsoInfo] = useState([])
  const [stoTableData, setStoTableData] = useState([])
  const [stoTableDataRMSTO, setStoTableDataRMSTO] = useState([])
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 5,
      }}
    />
  )

  const [totalChargesDepo, setTotalChargesDepo] = useState('')

  useEffect(() => {
    setTotalChargesDepo(totalChargesCalculator())
  }, [
    unloadingCharge,
    subDeliveryCharge,
    weighmentCharge,
    freightCharge,
    diversionCharge,
    haltingCharge,
    adjustedFreightCharge,
  ])

   useEffect(()=>{

      console.log(totalChargesDepo, 'totalChargesDepo')
      console.log(freightCharge,'freightCharge')

      if(Number(freightCharge) != Number(totalChargesDepo)){
         console.log('Amount Approval Yes')
        setExpenseClosureApproval(true)
      } else {
        console.log('Amount Approval No')
        setExpenseClosureApproval(false)
      }

  },[totalChargesDepo])

  const vadDataUpdate = (original, input) => {
    // return input === undefined ? original : input
    return input === undefined ? original : input
  }

  useEffect(() => {
    const val_obj = Object.entries(values)

    val_obj.forEach(([key_st, value]) => {})
    // console.log(values, 'values')
    // console.log(formValues, 'formValues')

    if (clearValuesObject) {
      setClearValuesObject(false)
    }
  }, [values, formValues, clearValuesObject])

  const locationFinder = (data) => {
    let location = ''
    let code = ''
    // console.log(data,'locationFinderData')
    locationData.map((val, ind) => {
      if (val.id == data) {
        location = val.location
        code = val.location_code
      }
    })

    let needed_data = location != '' && code != '' ? `${location} / ${code}` : ''

    return needed_data
  }

  /* ===================== The Constants Needed For First Render Part Start ===================== */

  const [mainKey, setMainKey] = useState(1)
  const [activeKey, setActiveKey] = useState(1)
  const [activeKey_2, setActiveKey_2] = useState(1)
  const [ExpenseUnloadingCharges, setExpenseUnloadingCharges] = useState(0)

  const [shipmentPYGData, setShipmentPYGData] = useState([])
  const [expenseClosureData, setExpenseClosureData] = useState([])

  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */

  useEffect(() => {
    if (shipmentPYGData) {
      ///////////////////////// Purpose : Actual Vendor Freight Calculation From Freight Master/////////////////////////////////
      if (
        shipmentPYGData?.ifoods_Vendor_info &&
        shipmentPYGData?.ifoods_Vendor_info?.freight_type == 2 &&
        shipmentPYGData?.ifoods_Vehicle_info?.vehicle_freight == 2
      ) {
        console.log("From Freight Master")
        let freight_info_data1 = runningKM
        let freight_info_data2 = shipmentPYGData?.ifoods_Salesfreight_info?.freight_per_km
           let payment_info_data1 = freight_info_data1 * freight_info_data2
        console.log(freight_info_data1, 'runningKM')
        console.log(freight_info_data2, 'freight_per_km')
        console.log(payment_info_data1, 'payment_info_data')
        setShipmentInfo(payment_info_data1)
        if (freight_info_data1 !== freight_info_data2) {
          setFreightCharge(Number(payment_info_data1))
        } else {
          Swal.fire({
            title: 'Freight not Maintained?!',
            text: 'Vehicle Feet Based Freight not Maintained',
            icon: 'question',
          })
          //   toast.warning('Shipment Cannot be Approved. Kindly contact Admin..!')
        }
      }

        ///////////////////////// Purpose : Actual Vendor Freight Calculation From Vehicle Master/////////////////////////////////
        if (
          shipmentPYGData?.ifoods_Vendor_info &&
          shipmentPYGData?.ifoods_Vendor_info?.freight_type == 2 &&
          shipmentPYGData?.ifoods_Vehicle_info?.vehicle_freight == 1
        ) {
          console.log("From Freight Master")
          let freight_info_data1 = runningKM
          let freight_info_data2 = shipmentPYGData?.ifoods_Vehicle_info?.vehicle_freight_per_km
          let payment_info_data1 = freight_info_data1 * freight_info_data2
          console.log(freight_info_data1, 'runningKM')
          console.log(freight_info_data2, 'freight_per_km')
          console.log(payment_info_data1, 'payment_info_data')
          setShipmentInfo(payment_info_data1)
          if (freight_info_data1 !== freight_info_data2) {
            setFreightCharge(Number(payment_info_data1))
          } else {
            Swal.fire({
              title: 'Freight not Maintained?!',
              text: 'Vehicle Feet Based Freight not Maintained',
              icon: 'question',
            })
            //   toast.warning('Shipment Cannot be Approved. Kindly contact Admin..!')
          }
        }

            ///////////////////////// Purpose : Actual Vendor Freight Calculation From Freight Master/////////////////////////////////
            if (
              shipmentPYGData?.ifoods_Vendor_info &&
              shipmentPYGData?.ifoods_Vendor_info?.freight_type == 2&&
              shipmentPYGData?.ifoods_Vehicle_info?.vehicle_freight == 2
            ) {
              let freight_info_data1 = runningKM
              let freight_info_data2 = shipmentPYGData?.ifoods_Salesfreight_info?.freight_per_km
              let payment_info_data1 = freight_info_data1 * freight_info_data2
              console.log(freight_info_data1, 'runningKM')
              console.log(freight_info_data2, 'freight_per_km')
              console.log(payment_info_data1, 'payment_info_data')
              setShipmentInfo(payment_info_data1)
              if (freight_info_data1 !== freight_info_data2) {
                setFreightCharge(Number(payment_info_data1))
              } else {
                Swal.fire({
                  title: 'Freight not Maintained?!',
                  text: 'Vehicle Feet Based Freight not Maintained',
                  icon: 'question',
                })
                //   toast.warning('Shipment Cannot be Approved. Kindly contact Admin..!')
              }
            }
      //////////////////// Purpose : STO  Freight Calculation /////////////////////////////////
      if (shipmentPYGData.purpose == 2 && shipmentPYGData.ifoods_Vendor_info.freight_type == 1) {
        let payment_info_data = shipmentPYGData.ifoods_StoRoute_info.freight_rate
        let freight_info_data = shipmentPYGData.ifoods_StoRoute_info.vehicle_capacity_info.capacity
        let freight_info_data1 = shipmentPYGData.ifoods_Vehicle_info.feet_info.capacity

        setShipmentInfo(payment_info_data)
        if (freight_info_data == freight_info_data1) {
          setFreightCharge(Number(payment_info_data))
          console.log(payment_info_data, 'payment_info_data')
        } else {
          Swal.fire({
            title: 'Freight not Maintained?!',
            text: 'Vehicle Feet Based Freight not Maintained',
            icon: 'question',
          })
        }
        // let Budget_kmcheck = shipmentPYGData.unplanned_km
        // console.log(Budget_kmcheck, 'Budget_kmcheck')
        // if (Number(totalChargesDepo) !== Number(payment_info_data)) {
        //   // console.log('yesssss')
        //   setExpenseClosureApproval(true)
        // } else {
        //   console.log('nooooo')
        //   setExpenseClosureApproval(false)
        // }
      }
    }
  }, [shipmentPYGData, totalChargesDepo, values.odometer_closing_km,])

  useEffect(()=>{
if(shipmentPYGData){
    let freight_info_data1 = Number(values.odometer_closing_km) - Number(shipmentPYGData.odometer_km)
    let Budget_kmcheck = shipmentPYGData.unplanned_km ?shipmentPYGData.unplanned_km:shipmentPYGData?.ifoods_SalesRoute_info?.budgeted_km
    console.log(Budget_kmcheck, 'Budget_kmcheck')
    console.log(freight_info_data1, 'runningKM')
    if (freight_info_data1 > Budget_kmcheck) {
       console.log('KM Approval Yes')
      setExpenseClosureApproval(true)
    } else {
      console.log('KM Approval No')
      setExpenseClosureApproval(false)
    }
  }
 //   setFetch(true)
},[values.odometer_closing_km])
  const [flatShipment, setFlatShipment] = useState([])
  useEffect(() => {
    IfoodsExpenseClosureService.getTruckInfoById(id).then((res) => {
      // setFetch(true)
      console.log(res.data.data, 'getSingleDepoShipmentPYGData')
      setShipmentPYGData(res.data.data)

      const jsonString = res.data.data.tripsheet_info[0].delivery_info
      try {
        const data = JSON.parse(jsonString)

        const shipments = data[0].map((shipmentData) => {
          const deliveryInfo = shipmentData.DELIVERY_COUNT.map((delivery) => ({
            SHIPMENT_OR_PO: shipmentData.SHIPMENT_OR_PO,
            DELIVERY_NO: delivery.DELIVERY_NO,
            CUSTOMER: delivery.CUSTOMER,
            OUTLET: delivery.OUTLET,
            ZZCRATE_NUMBER: delivery.ZZCRATE_NUMBER,
            QUANTITY: delivery.QUANTITY,
            NET_WEIGHT: delivery.NET_WEIGHT,
          }))

          return deliveryInfo
        })
        const flatShipments = [].concat(...shipments)
        setFlatShipment(flatShipments)
        console.log(flatShipments)
      } catch (error) {
        console.error('Error parsing JSON:', error)
      }
    })
  }, [id])

  //}

  useEffect(() => {
    /* section for getting Shipment Routes For Shipment Creation from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(11).then((response) => {
      // console.log(response.data.data)
      setPMData(response.data.data)
    })
  }, [id])

  useEffect(() => {
    if (shipmentPYGData) {
      let pID = shipmentPYGData.ifoods_parking_yard_gate_id
      console.log(pID, 'pID')
      if (pID) {
        IfoodsExpenseClosureService.getTruckInfoById(pID)
          .then((res) => {
            setFetch(true)
            console.log(pID, 'pID')
            setSettlementAvailable(true)
            let closure_info_data = res.data.data
            console.log(closure_info_data, 'closure_info_data')

            setExpenseClosureData(closure_info_data)
            setUnloadingCharge(closure_info_data.unloading_charges)
            setSubDeliveryCharge(closure_info_data.sub_delivery_charges)
            setWeighmentCharge(closure_info_data.weighment_charges)
            setFreightCharge(closure_info_data.freight_charges)
            setAdjustedFreightCharge(closure_info_data.freight_adjustment)
            setDiversionCharge(closure_info_data.diversion_return_charges)
            setHaltingCharge(closure_info_data.halting_charges)
            setTotalChargesDepo(closure_info_data.total_expenses)
            values.halt_days = closure_info_data.halt_days
            values.remarks = closure_info_data.remarks
            values.apremarks = closure_info_data.closure_approval_remarks
          })
          .catch((errortemp) => {
            // console.log(errortemp)
            setFetch(true)
            // var object = errortemp.response.data.errors
            // var output = ''
            // for (var property in object) {
            //   output += '*' + object[property] + '\n'
            // }
            // setError(output)
            // setErrorModal(true)
          })
      } else {
        // setFetch(true)
      }
    }
  }, [shipmentPYGData, id])

  const isNumericCheck = (event, type) => {
    console.log(type)
    const re = /^[0-9\b]+$/
    // const re = /^[+-]?\d+(\.\d+)?$/;

    let result = event.target.value

    if (type == 1) {
      if (re.test(result)) {
        setUnloadingCharge(result)
      } else if (result == '') {
        setUnloadingCharge('')
      }
    } else if (type == 2) {
      if (re.test(result)) {
        setSubDeliveryCharge(result)
      } else if (result == '') {
        setSubDeliveryCharge('')
      }
    } else if (type == 3) {
      if (re.test(result)) {
        setWeighmentCharge(result)
      } else if (result == '') {
        setWeighmentCharge('')
      }
    } else if (type == 4) {
      if (re.test(result)) {
        setFreightCharge(result)
      } else if (result == '') {
        setFreightCharge('')
      }
    } else if (type == 5) {
      if (re.test(result)) {
        setDiversionCharge(result)
      } else if (result == '') {
        setDiversionCharge('')
      }
    } else if (type == 6) {
      if (re.test(result)) {
        setHaltingCharge(result)
      } else if (result == '') {
        setHaltingCharge('')
      }
    }
  }
  const [shipmentPYGData1, setShipmentPYGData1] = useState([])
  const [selectedValues, setSelectedValues] = useState([])
  useEffect(() => {
    IfoodsExpenseClosureService.getTruckInfoById(id)
      .then((res) => {
        const jsonString = res.data.data.tripsheet_info[0].delivery_info
        console.log(jsonString + 'jsonString')
        try {
          const data = JSON.parse(jsonString)

          const shipments = data[0].flatMap((shipmentData1) =>
            shipmentData1.DELIVERY_COUNT.map((delivery) => {
              const formattedCustomer = delivery.CUSTOMER.substring(4)

              return {
                label: `${delivery.OUTLET?delivery.OUTLET:'STO'} - ${delivery.DELIVERY_NO} `,
                value: `${delivery.OUTLET?delivery.OUTLET:'STO'} - ${delivery.DELIVERY_NO} `,
              }
            })
          )
          console.log(shipments)
          setShipmentPYGData1(shipments)
        } catch (error) {
          console.error('Error parsing JSON:', error)
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [id])

  console.log(shipmentPYGData1)
  console.log(JSON.stringify(selectedValues) + 'selectedValues')

  /* ===================== The Very First Render Part End ===================== */

  /* ===================== Header Tabs Controls Part Start ===================== */

  /* ===================== Vehicle Assignment Details (FG-SALES) Table Data Part Start ===================== */

  const changeVadTableItem = (event, child_property_name, child_index) => {
    let getData = event.target.value
    //console.log(getData, 'getData')

    // if (child_property_name == 'unloading_charges') {
    //   getData = event.target.value.replace(/\D/g, '')
    // }

    const shipment_parent_info = JSON.parse(JSON.stringify(shipmentInfo))

    if (child_property_name == 'fj_pod_copy') {
      let dataNeeded = {}
      dataNeeded.child = child_index
      imageCompress(event, dataNeeded, 'fjsales')
    } else {
      shipment_parent_info.shipment_child_info[child_index][
        `${child_property_name}_input`
      ] = getData
    }

    // console.log(shipment_parent_info,'updated_shipment_parent_info')
    setShipmentInfo(shipment_parent_info)
  }

  /* ===================== Header Tabs Controls Part End ===================== */

  const freightAdjustment = (event) => {
    let val = event.target.value
    //console.log(freightCharge,'freightCharge')
    // console.log(val,'AdjustedFreightCharge')
    let adjustment = isNaN(Number(val)) ? 0 : Number(val) + Number(freightCharge)
    setAdjustedFreightCharge(val)
  }
  const [runningKM, setRunningKM] = useState(0)
  const [differenceKM, setDifferenceKM] = useState(0)
  const [differenceKMs, setDifferenceKMs] = useState(0)
  const [differenceKMFinder, setDifferenceKMFinder] = useState('-')

  useEffect(() => {
    if (values.odometer_closing_km) {
      let start_point = Number(shipmentPYGData.odometer_km)
      let end_point = Number(values.odometer_closing_km)
      let difference = end_point - start_point
      setRunningKM(difference ? difference : 0)
    } else {
      setRunningKM(0)
    }
    if (
      shipmentPYGData.ifoods_Vendor_info &&
      shipmentPYGData?.ifoods_Vendor_info?.freight_type == 2
    ) {
      let freight_info_data1 = runningKM
      let freight_info_data2 = shipmentPYGData?.ifoods_Salesfreight_info?.freight_per_km
      let payment_info_data1 = freight_info_data1 * freight_info_data2
      console.log(freight_info_data1, 'runningKM')
      console.log(freight_info_data2, 'freight_per_km')
      console.log(payment_info_data1, 'payment_info_data')
      setShipmentInfo(payment_info_data1)
      if (freight_info_data1 !== freight_info_data2) {
        setFreightCharge(Number(payment_info_data1))
      } else {
        Swal.fire({
          title: 'Freight not Maintained?!',
          text: 'Vehicle Feet Based Freight not Maintained',
          icon: 'question',
        })
        //   toast.warning('Shipment Cannot be Approved. Kindly contact Admin..!')
      }
      // if (Number(totalChargesDepo) !== Number(payment_info_data1)) {
      //   setExpenseClosureApproval(true)
      // } else {
      //   console.log('nooooo')
      //   setExpenseClosureApproval(false)
      // }
    }
  }, [values.odometer_closing_km,runningKM])
  const tripKMFinder = (openingKM, closingKM) => {
    return openingKM - closingKM
  }

  useEffect(() => {
    if (shipmentPYGData.purpose == 1) {
      if (values.odometer_closing_km) {
        setDifferenceKMFinder(
          tripKMFinder(
            runningKM,
            shipmentPYGData.unplanned_km,
            shipmentPYGData?.ifoods_SalesRoute_info?.budgeted_km
          ) - Number(shipmentPYGData?.ifoods_SalesRoute_info?.budgeted_km)
        )
      } else {
        setDifferenceKMFinder('-')
      }
    }
  })

  /* ===================== All Expenses Capture Part Start  ======================= */

  const totalChargesCalculator = () => {
    let total_charge =
      Number(unloadingCharge ? unloadingCharge : 0) +
      Number(subDeliveryCharge ? subDeliveryCharge : 0) +
      Number(weighmentCharge ? weighmentCharge : 0) +
      Number(freightCharge ? freightCharge : 0) +
      Number(isNaN(adjustedFreightCharge) ? 0 : adjustedFreightCharge) +
      Number(diversionCharge ? diversionCharge : 0) +
      Number(haltingCharge ? haltingCharge : 0)
    //  Number(payment_info_data?payment_info_data:0)
    return total_charge
  }

  /* ================= FGSALES ========================================= */

  /* ===================== All Expenses Capture Part End  ======================= */

  const REQ = () => <span className="text-danger"> * </span>

  /* ==================== FIle Compress Code Start=========================*/

  const resizeFile = (file) =>
    new Promise((resolve) => {
      FileResizer.imageFileResizer(
        file,
        1000,
        1000,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri)
        },
        'base64'
      )
    })

  /************************************************************************************ */

  const imageCompress = async (event, need_data, ftype) => {
    //console.log(need_data,'need_data')

    const file = event.target.files[0]
    //   console.log(file,'file')

    //  if (ftype == 'fjsales') {
    const shipment_parent_info_for_fjsales = JSON.parse(JSON.stringify(shipmentInfo))

    console.log(shipment_parent_info_for_fjsales.shipment_child_info[need_data.child], 'fjsales')
    shipment_parent_info_for_fjsales.shipment_child_info[need_data.child].fj_pod_copy_file_name =
      file.name

    if (file.type == 'application/pdf') {
      if (file.size > 5000000) {
        alert('File too Big, please select a file less than 5mb')
        shipment_parent_info_for_fjsales.shipment_child_info[need_data.child].fj_pod_copy = null
        return false
      } else {
        shipment_parent_info_for_fjsales.shipment_child_info[need_data.child].fj_pod_copy = file
      }
    } else {
      // console.log(file,'filename')
      //  console.log(file.type,'filename')

      const image = await resizeFile(file)

      if (file.size > 2000000) {
        valueAppendToImage(
          image,
          shipment_parent_info_for_fjsales.shipment_child_info[need_data.child],
          'fjsales'
        )
      } else {
        shipment_parent_info_for_fjsales.shipment_child_info[need_data.child].fj_pod_copy = file
      }
    }

    setShipmentInfo(shipment_parent_info_for_fjsales)
    // }
  }

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  }

  const uploadClickFJ = (index_val) => {
    //console.log(index_val,'index_val')

    let div_val = document.getElementById(`fj_pod_copy_upload_yes_parent_child${index_val}`)

    if (div_val) {
      document.getElementById(`fj_pod_copy_upload_yes_parent_child${index_val}`).click()
    }
  }

  const clearValues = (index_val, ftype) => {
    if (ftype == 'fjsales') {
      shipmentInfo.shipment_child_info[index_val].fj_pod_copy_file_name = ''
      shipmentInfo.shipment_child_info[index_val].fj_pod_copy = null
    }

    setClearValuesObject(true)
  }

  const valueAppendToImage1 = (image) => {
    let file_name = 'dummy' + getRndInteger(100001, 999999) + '.jpg'
    let file = dataURLtoFile(image, file_name)

    //console.log(camEnableType,'camEnableType')

    if (camEnableType == 'fjsales') {
      //console.log(fileImageKey,'fileImageKey')

      shipmentInfo.shipment_child_info[fileImageKey].fj_pod_copy = file
      shipmentInfo.shipment_child_info[fileImageKey].fj_pod_copy_file_name = file.name
    }
  }

  const valueAppendToImage = (image, need_data, ftype) => {
    let file_name = 'dummy' + getRndInteger(100001, 999999) + '.jpg'
    let file = dataURLtoFile(image, file_name)

    if (ftype == 'fjsales') {
      if (need_data) {
        need_data.fj_pod_copy = file
      }
    }
  }

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [day, month, year].join('-')
  }

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
  }

  const TripsheetClosureSubmit = (process) => {
    const formData = new FormData()

    formData.append(
      'vendor_id',
      shipmentPYGData.ifoods_Vendor_info.id ? shipmentPYGData.ifoods_Vendor_info.id : ''
    )
    formData.append(
      'vehicle_id',
      shipmentPYGData.ifoods_Vehicle_info.id ? shipmentPYGData.ifoods_Vehicle_info.id : ''
    )
    formData.append('driver_name', shipmentPYGData.driver_name)
    formData.append(
      'parking_id',
      shipmentPYGData.ifoods_parking_yard_gate_id ? shipmentPYGData.ifoods_parking_yard_gate_id : ''
    )
    formData.append(
      'vehicle_inspection_id',
      shipmentPYGData.vehicle_inspection_id ? shipmentPYGData.vehicle_inspection_id : ''
    )
    formData.append(
      'tripsheet_id',
      shipmentPYGData.tripsheet_sheet_id ? shipmentPYGData.tripsheet_sheet_id : ''
    )
    formData.append(
      'odometer_closing_km',
      values.odometer_closing_km ? values.odometer_closing_km : 0
    )
    formData.append(
      'return_delivery',
      JSON.stringify(selectedValues) ? JSON.stringify(selectedValues) : '-'
    )
    formData.append('return_stock', values.return_stock ? values.return_stock : '0')
    formData.append('return_remarks', values.return_remarks ? values.return_remarks : '-')
    formData.append('break_down', values.break_down ? values.break_down : '0')
    formData.append('alt_vh_no', values.alt_vh_no ? values.alt_vh_no : '-')
    formData.append('breakdown_reason', values.breakdown_reason ? values.breakdown_reason : '-')
    formData.append('breakdown_km', values.breakdown_km ? values.breakdown_km : '-')
    formData.append('return_crate', values.return_crate ? values.return_crate : 0)
    formData.append('differencekm', differenceKMFinder ? differenceKMFinder : 0)
    formData.append('runningkm', runningKM ? runningKM : 0)
    formData.append(
      'odometer_opening_km',
      shipmentPYGData.odometer_km ? shipmentPYGData.odometer_km : 0
    )
    formData.append('unloading_charges', unloadingCharge ? unloadingCharge : 0)
    formData.append('sub_delivery_charges', subDeliveryCharge ? subDeliveryCharge : 0)
    formData.append('weighment_charges', weighmentCharge ? weighmentCharge : 0)
    formData.append('freight_charges', freightCharge ? freightCharge : 0)
    formData.append('freight_adjustment', adjustedFreightCharge ? adjustedFreightCharge : 0)
    formData.append('diversion_return_charges', diversionCharge ? diversionCharge : 0)
    formData.append('halting_charges', haltingCharge ? haltingCharge : 0)
    formData.append('total_expenses', totalChargesDepo ? totalChargesDepo : 0)
    if (values.odometer_closing !== '') {
      formData.append('odometer_closing', values.odometer_closing)
    }
    // if (values.return_proof !== '') {
    //   formData.append('return_proof', values.return_proof)
    // }
    formData.append('return_proof', values.return_proof?values.return_proof:'-' )
    if (expenseClosureApproval) {
      formData.append('status', 1)
      formData.append('closure_approval_needed', 1)
    } else {
      formData.append('status', 4)
      formData.append('closure_approval_needed', 2)
    }

    formData.append('remarks', values.remarks ? values.remarks : '')
    formData.append('halt_days', values.halt_days ? values.halt_days : '')
    formData.append('created_by', user_id)

    formData.append('trip_shipment_info', JSON.stringify(shipmentInfo))

    console.log(formData, 'formData-closure')

    var closing_km = values.odometer_closing_km
    if (closing_km < shipmentPYGData.odometer_km) {
      setFetch(true)
      toast.warning('Actual KM Less than Budgeted KM.')
      return false
    } else if (closing_km < shipmentPYGData.odometer_km) {
      setFetch(true)
      toast.warning('Actual KM Less than Budgeted KM.')
      return false
    }
    if (values.return_crate < shipmentPYGData.tripsheet_info.trip_crate) {
      setFetch(true)
      toast.warning("Return Crate's Less than Despatched Crate's .")
      //return false
    }

    if (process == 'Submit') {
      IfoodsExpenseClosureService.createExpenseClosure(formData)
        .then((res) => {
          if (res.status == 200) {
            setFetch(true)
            Swal.fire({
              icon: 'success',
              title: process == 'Submit' ? 'Submitted Successfully..!' : 'Updated Successfully..!',
              text: expenseClosureApproval
                ? 'Updated Expenses Sent to Approval..'
                : 'Trip Expense Capture Process Done..',
              confirmButtonText: 'OK',
            }).then(function () {
              navigation('/IfoodsExpenseClosureHome')
            })
          } else if (res.status == 201) {
            Swal.fire({
              title: res.data.message,
              icon: 'warning',
              confirmButtonText: 'OK',
            }).then(function () {
              window.location.reload(false)
            })
          } else {
            toast.warning('Shipment Cannot be Approved. Kindly contact Admin..!')
          }
        })
        .catch((errortemp) => {
          setFetch(true)
          var object = errortemp.response.data.errors
          var output = ''
          for (var property in object) {
            output += '*' + object[property] + '\n'
          }
          setError(output)
          setErrorModal(true)
        })
    } else if (process == 'Update') {
      formData.append('_method', 'PUT')

      let expenseClosureID = expenseClosureData.closure_id
      setFetch(true)
      //debugger
      IfoodsExpenseClosureService.updateExpenseClosure(expenseClosureID, formData)
        .then((res) => {
          if (res.status == 200) {
            setFetch(true)

            Swal.fire({
              icon: 'success',
              title: process == 'Submit' ? 'Submitted Successfully..!' : 'Updated Successfully..!',
              text: expenseClosureApproval
                ? 'Updated Expenses Sent to Approval..'
                : 'Trip Expense Capture Process Done..',
              confirmButtonText: 'OK',
            }).then(function () {
              navigation('/IfoodsExpenseClosureHome')
            })
          } else if (res.status == 201) {
            Swal.fire({
              title: res.data.message,
              icon: 'warning',
              confirmButtonText: 'OK',
            }).then(function () {
              window.location.reload(false)
            })
          } else {
            toast.warning('Shipment Cannot be Approved. Kindly contact Admin..!')
          }
        })
        .catch((errortemp) => {
          // console.log(errortemp)
          setFetch(true)
          var object = errortemp.response.data.errors
          var output = ''
          for (var property in object) {
            output += '*' + object[property] + '\n'
          }
          setError(output)
          setErrorModal(true)
        })
    }

    /* Values Assigning To Save Details into DB Part End*/
  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard className="p-1">
                <CTabContent className="p-3">
                  <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={mainKey === 1}>
                    {/* Hire Vehicles Part Header Tab Start */}
                    <CNav variant="tabs" role="tablist">
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 1}
                          style={{ backgroundColor: 'green' }}
                          onClick={() => setActiveKey(1)}
                        >
                          General Information
                        </CNavLink>
                      </CNavItem>

                      <CNavItem>
                        <CNavLink
                          active={activeKey === 2}
                          style={{
                            backgroundColor: 'green',
                          }}
                          onClick={() => setActiveKey(2)}
                        >
                          Shipment Info
                        </CNavLink>
                      </CNavItem>
                      {values.odometer_closing_km && values.return_crate && (
                        <>
                          <CNavItem>
                            <CNavLink
                              active={activeKey === 3}
                              style={{ backgroundColor: 'green' }}
                              onClick={() => setActiveKey(3)}
                            >
                              Expenses
                            </CNavLink>
                          </CNavItem>
                        </>
                      )}
                    </CNav>
                    {/* Hire Vehicles Part Header Tab End */}
                    {/* Hire Vehicles Part Start */}
                    <CTabContent>
                      <CTabPane
                        role="tabpanel"
                        aria-labelledby="home-tab"
                        visible={activeKey === 1}
                      >
                        {/* Hire Vehicle General Info Part Start */}
                        {shipmentPYGData && (
                          <CRow className="">
                            {shipmentPYGData.ifoods_Vendor_info && (
                              <>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="cname">Vendor Name</CFormLabel>
                                  <CFormInput
                                    name="cname"
                                    size="sm"
                                    id="cname"
                                    value={shipmentPYGData.ifoods_Vendor_info.vendor_name}
                                    readOnly
                                  />
                                </CCol>

                                <CCol md={3}>
                                  <CFormLabel htmlFor="clo">Vendor Location / Code</CFormLabel>
                                  <CFormInput
                                    name="clo"
                                    size="sm"
                                    id="clo"
                                    value={locationFinder(
                                      shipmentPYGData?.ifoods_Vendor_info?.location_id
                                    )}
                                    readOnly
                                  />
                                </CCol>

                                <CCol md={3}>
                                  <CFormLabel htmlFor="cmn">Vendor Mobile Number</CFormLabel>
                                  <CFormInput
                                    name="cmn"
                                    size="sm"
                                    id="cmn"
                                    value={shipmentPYGData.ifoods_Vendor_info.vendor_contact_no}
                                    readOnly
                                  />
                                </CCol>

                                <CCol md={3}>
                                  <CFormLabel htmlFor="cfr">Vendor Freight Type</CFormLabel>
                                  <CFormInput
                                    name="cfr"
                                    size="sm"
                                    id="cfr"
                                    value={
                                      shipmentPYGData.ifoods_Vendor_info.freight_type == '2'
                                        ? 'Actual Freight'
                                        : 'Budget Freight'
                                    }
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}

                            {shipmentPYGData.ifoods_Vehicle_info && (
                              <>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                                  <CFormInput
                                    name="vNum"
                                    size="sm"
                                    id="vNum"
                                    value={shipmentPYGData.ifoods_Vehicle_info.vehicle_number}
                                    readOnly
                                  />
                                </CCol>

                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="vbt">
                                    Vehicle Feet / Capacity / Body Type{' '}
                                  </CFormLabel>
                                  <CFormInput
                                    name="vbt"
                                    size="sm"
                                    id="vbt"
                                    // value={`${shipmentPYGData.ifoods_Vehicle_info.vehicle_capacity_info.capacity} - Ton / ${shipmentPYGData.ifoods_Vehicle_info.vehicle_body_type_info.body_type}`}
                                    value={`${shipmentPYGData.ifoods_Vehicle_info.feet_info.capacity} - Feet / ${shipmentPYGData.ifoods_Vehicle_info.vehicle_capacity_info.capacity} - Ton / ${shipmentPYGData.ifoods_Vehicle_info.vehicle_body_type_info.body_type}`}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="vivt">
                                    Vehicle Insurance Valid To{' '}
                                  </CFormLabel>
                                  <CFormInput
                                    name="vivt"
                                    size="sm"
                                    id="vivt"
                                    value={shipmentPYGData.ifoods_Vehicle_info.insurance_validity}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="vfvt">Vehicle FC Valid To </CFormLabel>
                                  <CFormInput
                                    name="vfvt"
                                    size="sm"
                                    id="vfvt"
                                    value={shipmentPYGData.ifoods_Vehicle_info.fc_validity}
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}

                            {shipmentPYGData && (
                              <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="dname">Driver name </CFormLabel>
                                  <CFormInput
                                    name="dname"
                                    size="sm"
                                    id="dname"
                                    value={shipmentPYGData.driver_name}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="dmn">Driver Mobile Number </CFormLabel>
                                  <CFormInput
                                    name="dmn"
                                    size="sm"
                                    id="dmn"
                                    value={shipmentPYGData.driver_number}
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>
                              <CFormInput
                                name="gateInDateTime"
                                size="sm"
                                id="gateInDateTime"
                                value={shipmentPYGData.gate_in_date_time_string}
                                readOnly
                              />
                            </CCol>

                            {shipmentPYGData.ifoods_inspection_info && (
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="inspectionDateTime">
                                  Inspection Date
                                </CFormLabel>
                                <CFormInput
                                  name="inspectionDateTime"
                                  size="sm"
                                  id="inspectionDateTime"
                                  value={formatDate(
                                    shipmentPYGData.ifoods_inspection_info[0].created_at
                                  )}
                                  readOnly
                                />
                              </CCol>
                            )}

                            {shipmentPYGData.tripsheet_info && (
                              <>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="TNum">Tripsheet Number</CFormLabel>
                                  <CFormInput
                                    name="TNum"
                                    size="sm"
                                    id="TNum"
                                    value={shipmentPYGData.tripsheet_info[0].ifoods_tripsheet_no}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="TDate">Tripsheet Date</CFormLabel>
                                  <CFormInput
                                    name="TDate"
                                    size="sm"
                                    id="TDate"
                                    value={formatDate(shipmentPYGData.tripsheet_info[0].created_at)}
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}
                            {shipmentPYGData.vehicle_tripsheet_info && (
                              <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="SRDateTime">Shipment Number</CFormLabel>
                                  <CFormInput
                                    name="SRDateTime"
                                    size="sm"
                                    id="SRDateTime"
                                    value={shipmentPYGData.shipment_info.shipment_no}
                                    readOnly
                                  />
                                </CCol>
                                {/* <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="SRDateTime">Shipment Date & Time</CFormLabel>
                                  <CFormInput
                                    name="SRDateTime"
                                    size="sm"
                                    id="SRDateTime"
                                    value={shipmentPYGData.shipment_info.shipment_date_time_string}
                                    readOnly
                                  />
                                </CCol> */}
                              </>
                            )}
                            {/* <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="gateOutDateTime">
                                Gate-Out Date & Time
                              </CFormLabel>
                              <CFormInput
                                name="gateOutDateTime"
                                size="sm"
                                id="gateOutDateTime"
                                value={shipmentPYGData.gate_out_date_time_string}
                                readOnly
                              />
                            </CCol> */}

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="SRDateTime">Purpose</CFormLabel>
                              <CFormInput
                                name="SRDateTime"
                                size="sm"
                                id="SRDateTime"
                                value={shipmentPYGData.purpose == 1 ? 'FG-Sales' : 'FG-STO'}
                                readOnly
                              />
                            </CCol>
                            {shipmentPYGData.purpose == 1 && (
                              <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="SRDateTime">Route Name</CFormLabel>
                                  <CFormInput
                                    name="SRDateTime"
                                    size="sm"
                                    id="SRDateTime"
                                    value={shipmentPYGData.ifoods_SalesRoute_info.route_name}
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}
                            {shipmentPYGData.purpose == 1 && (
                              <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="SRDateTime">Budgeted KM</CFormLabel>
                                  <CFormInput
                                    name="SRDateTime"
                                    size="sm"
                                    id="SRDateTime"
                                    value={
                                      shipmentPYGData.unplanned_km
                                        ? shipmentPYGData.unplanned_km
                                        : shipmentPYGData.ifoods_SalesRoute_info.budgeted_km
                                    }
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}

                            {shipmentPYGData.purpose == 2 && (
                              <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="SRDateTime">Route Name</CFormLabel>
                                  <CFormInput
                                    name="SRDateTime"
                                    size="sm"
                                    id="SRDateTime"
                                    value={`${shipmentPYGData.ifoods_StoRoute_info.from_location_info.location}  - ${shipmentPYGData.ifoods_StoRoute_info.to_location_info.location} `}
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="odometer_closing_km">
                                Odometer Openning KM
                              </CFormLabel>
                              <CFormInput
                                name="odometer_closing_km"
                                size="sm"
                                id="odometer_closing_km"
                                value={shipmentPYGData.odometer_km}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="odometer_closing_km">
                                Odometer Closing KM
                                <REQ />{' '}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="odometer_closing_km"
                                value={values.odometer_closing_km}
                                onChange={handleChange}
                                name="odometer_closing_km"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                className={`${errors.odometer_closing_km && 'is-invalid'}`}
                                maxLength={6}
                                required
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="odoImg">
                                Odometer Closing Photo <REQ />{' '}
                                {errors.odometer_closing && (
                                  <span className="small text-danger">
                                    {errors.odometer_closing}
                                  </span>
                                )}
                              </CFormLabel>
                              <CFormInput
                                type="file"
                                name="odometer_closing"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                className={`${errors.odometer_closing && 'is-invalid'}`}
                                size="sm"
                                id="odometer_closing"
                                accept=".jpg,.jpeg,.png,.pdf"
                                required
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="trip_actual_km">Trip Actual KM</CFormLabel>
                              <CFormInput
                                name="trip_actual_km"
                                size="sm"
                                id="trip_actual_km"
                                value={runningKM}
                                readOnly
                              />
                            </CCol>

                            {shipmentPYGData.purpose == 1 && (
                              <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="difference_km">Difference KM</CFormLabel>
                                  <CFormInput
                                    name="difference_km"
                                    size="sm"
                                    id="difference_km"
                                    value={differenceKMFinder}
                                    // value={differenceKM}
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}

                            {/* {shipmentPYGData.purpose == 2 && (
                              <>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="trip_actual_km">Trip Actual KM</CFormLabel>
                              <CFormInput
                                name="trip_actual_km"
                                size="sm"
                                id="trip_actual_km"
                                value={runningKM}
                                readOnly
                              />
                            </CCol>




                            </>
                             )}  */}

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="trip_crate">Despatched Crate Count</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="trip_crate"
                                value={shipmentPYGData.tripsheet_info[0].trip_crate}
                                onChange={handleChange}
                                name="trip_crate"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                className={`${errors.trip_crate && 'is-invalid'}`}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="return_crate">
                                Return Crate Count <REQ />{' '}
                                {errors.return_crate && (
                                  <span className="small text-danger">{errors.return_crate}</span>
                                )}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="return_crate"
                                value={values.return_crate}
                                onChange={handleChange}
                                name="return_crate"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                className={`${errors.return_crate && 'is-invalid'}`}
                                required
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="return_stock">
                                Return Stock <REQ />{' '}
                              </CFormLabel>
                              &nbsp; &nbsp;&nbsp;
                              <CButtonGroup
                                role="group"
                                aria-label="Basic checkbox toggle button group"
                              >
                                <CFormCheck
                                  type="radio"
                                  button={{
                                    color: 'danger',
                                    variant: 'outline',
                                    shape: 'rounded-circle',
                                  }}
                                  name="return_stock"
                                  id="return_stock"
                                  onChange={handleChange}
                                  autoComplete="off"
                                  value="1"
                                  label="Yes"
                                />{' '}
                                &nbsp; &nbsp;&nbsp;
                                <CFormCheck
                                  type="radio"
                                  button={{
                                    color: 'success',
                                    variant: 'outline',
                                    shape: 'rounded-circle',
                                  }}
                                  name="return_stock"
                                  id="return_stock1"
                                  autoComplete="off"
                                  onChange={handleChange}
                                  value="0"
                                  label="No"
                                />
                              </CButtonGroup>
                            </CCol>
                            {values.return_stock == 1 && (
                              <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="return_shipment">
                                    Delivery Number (Return)
                                    <REQ />{' '}
                                  </CFormLabel>

                                  <MultiSelect
                                    id={id}
                                    size={size}
                                    options={shipmentPYGData1}
                                    value={selectedValues}
                                    name={name}
                                    className={className}
                                    isMulti={isMultiple}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={(e) => {
                                      setSelectedValues(e)
                                      console.log('Selected Values:', JSON.stringify(e)) // Convert object to JSON string before logging
                                      onChange(e, name)
                                    }}
                                    placeholder={label}
                                    noOptionsMessage={() => noOptionsMessage}
                                  />
                                </CCol>

                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="return_remarks">
                                    Return Remarks

                                  </CFormLabel>
                                  <CFormTextarea
                                    name="return_remarks"
                                    id="return_remarks"
                                    rows="1"
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    value={values.return_remarks}
                                    required
                                  ></CFormTextarea>
                                </CCol>
                                <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="return_proof">
                                Delivery Return Proof
                                {errors.return_proof && (
                                  <span className="small text-danger">
                                    {errors.return_proof}
                                  </span>
                                )}
                              </CFormLabel>
                              <CFormInput
                                type="file"
                                name="return_proof"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                className={`${errors.return_proof && 'is-invalid'}`}
                                size="sm"
                                id="return_proof"
                                accept=".jpg,.jpeg,.png,.pdf"

                              />
                            </CCol>
                              </>
                            )}

                              <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="break_down">
                                Break Down <REQ />{' '}
                              </CFormLabel>
                              &nbsp; &nbsp;&nbsp;
                              <CButtonGroup
                                role="group"
                                aria-label="Basic checkbox toggle button group"
                              >
                                <CFormCheck
                                  type="radio"
                                  button={{
                                    color: 'danger',
                                    variant: 'outline',
                                    shape: 'rounded-circle',
                                  }}
                                  name="break_down"
                                  id="break_down"
                                  onChange={handleChange}
                                  autoComplete="off"
                                  value="1"
                                  label="Yes"
                                />{' '}
                                &nbsp; &nbsp;&nbsp;
                                <CFormCheck
                                  type="radio"
                                  button={{
                                    color: 'success',
                                    variant: 'outline',
                                    shape: 'rounded-circle',
                                  }}
                                  name="break_down"
                                  id="break_down1"
                                  autoComplete="off"
                                  onChange={handleChange}
                                  value="0"
                                  label="No"
                                />
                              </CButtonGroup>
                            </CCol>

                            {values.break_down == 1 && (
                              <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="alt_vh_no">
                                   Alt-Vehicle Number
                                  </CFormLabel>

                                  <CFormInput
                                size="sm"
                                id="alt_vh_no"
                                value={values.alt_vh_no}
                                onChange={handleChange}
                                name="alt_vh_no"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                className={`${errors.alt_vh_no && 'is-invalid'}`}
                                required
                              />
                                </CCol>

                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="breakdown_reason">
                                  Break Down Reason

                                  </CFormLabel>
                                  <CFormTextarea
                                    name="breakdown_reason"
                                    id="breakdown_reason"
                                    rows="1"
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    value={values.breakdown_reason}
                                  ></CFormTextarea>
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="breakdown_km">
                                   Break Down KM
                                  </CFormLabel>

                                  <CFormInput
                                size="sm"
                                id="breakdown_km"
                                value={values.breakdown_km}
                                onChange={handleChange}
                                name="breakdown_km"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                className={`${errors.breakdown_km && 'is-invalid'}`}
                                required
                              />
                                </CCol>
                              </>
                            )}




























                          </CRow>
                        )}
                      </CTabPane>
                      {/* Hire Vehicle General Info Part End */}

                      {/* Hire Vehicle FG-SALES Part Start */}
                      <CTabPane
                        role="tabpanel"
                        aria-labelledby="profile-tab"
                        visible={activeKey === 2}
                      >
                        <>
                          <CRow key={`HireshipmentDeliveryData`} className="mt-2" hidden>
                            <CCol xs={12} md={3}>
                              <CFormLabel
                                htmlFor="inputAddress"
                                style={{
                                  backgroundColor: '#4d3227',
                                  color: 'white',
                                }}
                              >
                                Delivery Details
                              </CFormLabel>
                            </CCol>
                          </CRow>
                          {flatShipment &&
                            flatShipment.map((val, val_index) => {
                              return (
                                <>
                                  <CRow key={`HireshipmentChildData_${val_index}`}>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="sNum">Shipment / PO Number</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        id="sNum"
                                        value={val.SHIPMENT_OR_PO}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="sNum">Delivery Number</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="sNum"
                                        value={val.DELIVERY_NO}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={1}>
                                      <CFormLabel htmlFor="sNum">Delivery Qty</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="sNum"
                                        value={val.QUANTITY + ' Box'}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={1}>
                                      <CFormLabel htmlFor="sNum">Net Weight</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="sNum"
                                        value={val.NET_WEIGHT ? `${val.NET_WEIGHT} KG` : '-'}
                                        readOnly
                                      />
                                    </CCol>
                                    {/* <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="sNum">Crate Number</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="sNum"
                                        value={val.ZZCRATE_NUMBER}
                                        readOnly
                                      />
                                    </CCol> */}
                                    {shipmentPYGData.purpose == 1 && (
                                      <>
                                        {/* <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="sInvoice">Outlet Code</CFormLabel>

                                          <CFormInput
                                            size="sm"
                                            id="sInvoice"
                                            value={val.CUSTOMER}
                                            readOnly
                                          />
                                        </CCol> */}
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="sNum">Outlet Name</CFormLabel>

                                          <CFormInput
                                            size="sm"
                                            id="sNum"
                                            value={val.OUTLET}
                                            readOnly
                                          />
                                        </CCol>

                                      </>
                                    )}
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="sNum">Delivery Date</CFormLabel>

                                          <CFormInput
                                            size="sm"
                                            id="sNum"
                                          //  value={val.OUTLET}
                                          onChange={handleChange}
                                          type="date"
                                           // readOnly
                                          />
                                        </CCol>


                                    <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="sNum">POD Copy</CFormLabel>
                                          <CFormInput
                                            type="file"
                                            name="podimg"
                                            onFocus={onFocus}
                                            onBlur={onBlur}
                                            //value={val.OUTLET}
                                            onChange={handleChange}
                                            size="sm"
                                            id="sNum"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                          />
                                        </CCol>
                                  </CRow>
                                  <ColoredLine color="red" />
                                </>
                              )
                            })}
                        </>
                      </CTabPane>
                      {/* Hire Vehicle FG-SALES Part End */}

                      {/* Hire Vehicle Expenses Capture Start */}
                      <CTabPane
                        role="tabpanel"
                        aria-labelledby="contact-tab"
                        visible={activeKey === 3}

                      >
                        <CTable caption="top" hover style={{ height: '60vh' }}>
                          <CTableCaption style={{ color: 'maroon' }}>Expenses</CTableCaption>

                          {/* ================== Expense Table Header Part Start ====================== */}
                          <CTableHead
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                            }}
                          >
                            <CTableRow>
                              {/* <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                S.No
                              </CTableHeaderCell> */}

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Type
                              </CTableHeaderCell>

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Expense Amount
                              </CTableHeaderCell>

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Total Expense Amount
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          {/* ================== Expense Table Header Part End ======================= */}
                          {/* ================== Expense Table Body Part Start ======================= */}
                          <CTableBody>
                            {/* ================== Unloading Charges Part Start ======================= */}

                            <CTableRow>
                              {/* <CTableDataCell scope="row">
                                <b>1</b>
                              </CTableDataCell> */}
                              <CTableDataCell>Unloading Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  id="unloading_charges"
                                  name="unloading_charges"
                                  maxLength={5}
                                  onChange={(e) => {
                                    isNumericCheck(e, 1)
                                  }}
                                  value={unloadingCharge}
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_unloading_charge"
                                  name="expense_row_total_unloading_charge"
                                  value={unloadingCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Unloading Charges Part End ======================= */}

                            {/* ================== Subdelivery Charges Part Start =================== */}

                            <CTableRow>
                              {/* <CTableDataCell scope="row">
                                <b>2</b>
                              </CTableDataCell> */}
                              <CTableDataCell>Halting Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  id="sub_delivery_charges"
                                  name="sub_delivery_charges"
                                  maxLength={5}
                                  size="sm"
                                  onChange={(e) => {
                                    isNumericCheck(e, 2)
                                  }}
                                  value={subDeliveryCharge}
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_subdelivery_charge"
                                  name="expense_row_total_subdelivery_charge"
                                  value={subDeliveryCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Subdelivery Charges Part End ======================= */}

                            {/* ================== Weighment Charges Part Start ======================= */}

                            <CTableRow>
                              {/* <CTableDataCell scope="row">
                                <b>3</b>
                              </CTableDataCell> */}
                              <CTableDataCell>Toll Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  id="weighment_charges"
                                  name="weighment_charges"
                                  maxLength={5}
                                  onChange={(e) => {
                                    isNumericCheck(e, 3)
                                  }}
                                  size="sm"
                                  value={weighmentCharge}
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_weighment_charge"
                                  name="expense_row_total_weighment_charge"
                                  value={weighmentCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Weighment Charges Part End ======================= */}
                            {/* ================== Freight Charges Part Start ======================= */}

                            <CTableRow>
                              {/* <CTableDataCell scope="row">
                                <b>4</b>
                              </CTableDataCell> */}
                              {/* {shipmentPYGData.purpose == 2 || shipmentPYGData.ifoods_Vendor_info.freight_type == 2&& (   */}
                              {/* {shipmentPYGData.purpose == 2 && ( */}
                              {/* <> */}
                              <CTableDataCell>Freight Charges</CTableDataCell>
                              <CTableDataCell>
                                {/* shipmentPYGData.ifoods_Vendor_info.freight_type == 2&&  ( */}
                                <CFormInput
                                  size="sm"
                                  id="freight_charges"
                                  name="freight_charges"
                                  value={freightCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_freight_charge"
                                  name="expense_row_total_freight_charge"
                                  value={freightCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                              {/* </> */}
                              {/* )}
                               {shipmentPYGData.purpose == 2 && (
                                <> */}
                              {/* <CTableDataCell>Freight Charges</CTableDataCell>
                                  <CTableDataCell>

                                    <CFormInput
                                      size="sm"
                                      id="freight_charges"
                                      name="freight_charges"
                                      value={freightCharge}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell scope="row">
                                    <CFormInput
                                      size="sm"
                                      id="expense_row_total_freight_charge"
                                      name="expense_row_total_freight_charge"
                                      value={freightCharge}
                                      readOnly
                                    />
                                  </CTableDataCell> */}
                              {/* </>
                              )}  */}
                            </CTableRow>

                            {/* ================== Freight Charges Part End ======================= */}
                            {/* ================== Freight Adjustment Part Start ========= */}

                            <CTableRow>
                              {/* <CTableDataCell scope="row">
                                <b>5</b>
                              </CTableDataCell> */}
                              <CTableDataCell>Freight Adjustment</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  id="adjustedFreightCharge"
                                  name="adjustedFreightCharge"
                                  maxLength={9}
                                  onChange={(e) => {
                                    freightAdjustment(e)
                                  }}
                                  size="sm"
                                  value={adjustedFreightCharge}
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_adjusted_freight_charge"
                                  name="expense_row_total_adjusted_freight_charge"
                                  value={adjustedFreightCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Freight Adjustment Part End ========== */}
                            {/* ================== Stock Diversion / Return Charges Part Start ========= */}

                            <CTableRow>
                              {/* <CTableDataCell scope="row">
                                <b>6</b>
                              </CTableDataCell> */}
                              <CTableDataCell>Stock Diversion / Return Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  id="diversion_return_charges"
                                  name="diversion_return_charges"
                                  maxLength={5}
                                  onChange={(e) => {
                                    isNumericCheck(e, 5)
                                  }}
                                  size="sm"
                                  value={diversionCharge}
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_stock_return_charge"
                                  name="expense_row_total_stock_return_charge"
                                  value={diversionCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Stock Diversion / Return Charges Part End ========== */}
                            {/* ================== Halting Charges Part Start ======================= */}

                            <CTableRow>
                              {/* <CTableDataCell scope="row">
                                <b>7</b>
                              </CTableDataCell> */}
                              <CTableDataCell>Subdelivery Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  id="halting_charges"
                                  name="halting_charges"
                                  maxLength={5}
                                  onChange={(e) => {
                                    isNumericCheck(e, 6)
                                  }}
                                  size="sm"
                                  value={haltingCharge}
                                />
                              </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_halting_charge"
                                  name="expense_row_total_halting_charge"
                                  value={haltingCharge}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Halting Charges Part End ======================= */}

                            {/* ================== Total Charges Part Start ============ */}

                            <CTableRow>
                              <CTableDataCell scope="row">
                                <b>*</b>
                              </CTableDataCell>
                              <CTableDataCell>Total Trip Expense Charges</CTableDataCell>
                              <CTableDataCell> </CTableDataCell>
                              <CTableDataCell scope="row">
                                <CFormInput
                                  size="sm"
                                  id="expense_row_total_total_charge"
                                  name="expense_row_total_total_charge"
                                  value={totalChargesDepo}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Total Charges Part End ========== */}
                          </CTableBody>
                        </CTable>
                        {/* ================== Expense Table Body Part Start ======================= */}

                        <CTable caption="top" hover style={{ height: '20vh' }}>
                          <CTableCaption style={{ color: 'maroon' }}>Others</CTableCaption>

                          {/* ================== Others Table Header Part Start ====================== */}
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

                              {/* <CTableHeaderCell></CTableHeaderCell> */}

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Total
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          {/* ================== Others Table Header Part End ======================= */}
                          {/* ================== Others Table Body Part Start ======================= */}
                          <CTableBody>
                            {/* ================== Others Halt Days Part Start ======================= */}
                            <CTableRow>
                              <CTableDataCell scope="row">
                                <b>1</b>
                              </CTableDataCell>
                              <CTableDataCell>Halt Days</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  className={`${errors.halt_days && 'is-invalid'}`}
                                  id="halt_days"
                                  name="halt_days"
                                  maxLength={2}
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  onChange={handleChange}
                                  required={errors.halt_days ? true : false}
                                  size="sm"
                                  values={values.halt_days}
                                />
                                {errors.halt_days && (
                                  <span className="small text-danger">{errors.halt_days}</span>
                                )}
                              </CTableDataCell>
                            </CTableRow>

                            {/* ================== Others Halt Days Part End ======================= */}
                          </CTableBody>
                          {/* ================== Expense Table Body Part End ======================= */}
                        </CTable>

                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                            <CFormTextarea
                              name="remarks"
                              id="remarks"
                              rows="1"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              value={values.remarks}
                            ></CFormTextarea>
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="apremarks">Approval Remarks</CFormLabel>
                            <CFormTextarea
                              name="apremarks"
                              id="apremarks"
                              rows="1"
                              readOnly
                              value={values.apremarks}
                            ></CFormTextarea>
                          </CCol>
                          <CCol xs={12} md={6}>
                            {expenseClosureApproval && (
                              <span
                                style={{
                                  color: 'indigo',
                                  marginRight: '5%',
                                  fontWeight: 'bolder',
                                  float: 'right',
                                }}
                              >
                                Updated Expenses will be sent to Expense Closure Approval..
                              </span>
                            )}
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol
                            className="offset-md-9"
                            xs={12}
                            sm={12}
                            md={3}
                            // style={{ display: 'flex', justifyContent: 'space-between' }}
                            style={{
                              display: 'flex',
                              flexDirection: 'row-reverse',
                              cursor: 'pointer',
                            }}
                          >
                            <CButton
                              size="sm"
                              color="warning"
                              className="mx-3 text-white"
                              onClick={() => {
                                setFetch(false)
                                TripsheetClosureSubmit(settlementAvailable ? 'Update' : 'Submit')
                              }}
                              type="submit"
                            >
                              {settlementAvailable ? 'Update' : 'Submit'}
                            </CButton>
                          </CCol>
                        </CRow>
                      </CTabPane>
                      {/* Hire Vehicle Expenses Capture End */}
                    </CTabContent>
                  </CTabPane>
                </CTabContent>

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

                {/*Camera Image Copy model*/}
                <CModal
                  visible={camEnable}
                  backdrop="static"
                  onClose={() => {
                    setCamEnable(false)
                    setImgSrc('')
                    setFileImageKey('')
                    setCamEnableType('')
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>POD Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    {!imgSrc && (
                      <>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/png"
                          height={200}
                        />
                        <p className="mt-2">
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              capture()
                            }}
                          >
                            Accept
                          </CButton>
                        </p>
                      </>
                    )}
                    {imgSrc && (
                      <>
                        <img height={200} src={imgSrc} />
                        <p className="mt-2">
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrc('')
                            }}
                          >
                            Delete
                          </CButton>
                        </p>
                      </>
                    )}
                  </CModalBody>
                  <CModalFooter>
                    {imgSrc && (
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          setCamEnable(false)
                          valueAppendToImage1(imgSrc)
                        }}
                      >
                        Confirm
                      </CButton>
                    )}
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setCamEnable(false)
                        setImgSrc('')
                        setFileImageKey('')
                        setCamEnableType('')
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/*Camera Image Copy model*/}
              </CCard>
            </>
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default IfoodsExpenseClosure
