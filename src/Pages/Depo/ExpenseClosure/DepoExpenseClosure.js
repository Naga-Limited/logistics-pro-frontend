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
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import Loader from 'src/components/Loader'

import * as TripsheetClosureConstants from 'src/components/constants/TripsheetClosureConstants'

import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

import TripSheetClosureSapService from 'src/Service/SAP/TripSheetClosureSapService'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import FileResizer from 'react-image-file-resizer'
import ExpenseCalculations from 'src/Pages/TripsheetClosure/Calculations/ExpenseCalculations';
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService';
import DepoExpenseClosureService from 'src/Service/Depo/ExpenseClosure/DepoExpenseClosureService';
import useFormDepoExpenseClosure from 'src/Hooks/useFormDepoExpenseClosure';
import LocationApi from 'src/Service/SubMaster/LocationApi';
import Swal from 'sweetalert2';
import { imageUrlValidation } from '../CommonMethods/CommonMethods';

const DepoExpenseClosure = () => {
  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()

  console.log(user_info)

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

  const webcamRef = React.useRef(null);
  const [fileuploaded, setFileuploaded] = useState(false)
  const [camEnable, setCamEnable] = useState(false)
  const [uploadedCamEnable, setUploadedCamEnable] = useState(false)
  const [camEnableType, setCamEnableType] = useState('')
  const [imgSrc, setImgSrc] = React.useState(null);
  const [uploadedImgSrc, setUploadedImgSrc] = useState('')
  const [locationData, setLocationData] = useState([])
  const [settlementAvailable, setSettlementAvailable] = useState(false)

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);



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
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Expense_Closure

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      setLocationData(res.data.data,'LocationData')
    })

  },[])
  /* ==================== Access Part End ========================*/

  const formValues = {
    halt_days: '',
    remarks: '',
    apremarks: ''
  }

  const [plantMasterData, setPlantMasterData] = useState([])
  useEffect(() => {
    /* section for getting Plant Master List For Location Name Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(12).then((response) => {
      console.log(response.data.data)
      setPlantMasterData(response.data.data)
    })
  }, [])


  /* Overall Journey Information Constants */
  const [pmData, setPMData] = useState([])

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
            height: 5
        }}
    />
  );

  const [totalChargesDepo, setTotalChargesDepo] = useState('')

  useEffect(() => {
      setTotalChargesDepo(totalChargesCalculator())
  }, [unloadingCharge, subDeliveryCharge, weighmentCharge, freightCharge, diversionCharge, haltingCharge, adjustedFreightCharge])

  useEffect(()=>{

    if(shipmentInfo){
      let previous_freight = shipmentInfo.freight_type == '2' ? shipmentInfo.shipment_depo_actual_freight_amount : shipmentInfo.shipment_depo_budget_freight_amount

      console.log(totalChargesDepo,'totalChargesDepo')
      console.log(previous_freight,'previous_freight')

      if(Number(totalChargesDepo) !== Number(previous_freight)){
        // console.log('yesssss')
        setExpenseClosureApproval(true)
      } else {
        // console.log('nooooo')
        setExpenseClosureApproval(false)
      }

    }

  },[totalChargesDepo])

  const vadDataUpdate = (original, input) => {
    // return input === undefined ? original : input
    return input === undefined ? original : input
  }


  useEffect(() => {
    const val_obj = Object.entries(values)

    val_obj.forEach(([key_st, value]) => {})
    console.log(values, 'values')
    console.log(formValues, 'formValues')

    if(clearValuesObject) {
      setClearValuesObject(false)
    }

  }, [values, formValues, clearValuesObject, shipmentInfo])

 const locationFinder = (data) =>{
  let location = ''
  let code = ''
  // console.log(data,'locationFinderData')
  locationData.map((val,ind)=>{
    if(val.id == data){
      location = val.location
      code = val.location_code
    }
  })

  let needed_data = (location != '' && code != '') ?  `${location} / ${code}` : ''

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

      DepoExpenseClosureService.getTruckInfoById(id).then((res) => {
        // setFetch(true)
        console.log(res.data.data,'getSingleDepoShipmentPYGData')
        setShipmentPYGData(res.data.data)
        let shipment_info_data = res.data.data.shipment_info
        setShipmentInfo(shipment_info_data)
        if(shipment_info_data.freight_type == '2'){
          setFreightCharge(Number(shipment_info_data.shipment_depo_actual_freight_amount))
        } else {
          setFreightCharge(Number(shipment_info_data.shipment_depo_budget_freight_amount))
        }
      })

  }, [id])

  useEffect(() => {

     /* section for getting Shipment Routes For Shipment Creation from database */
     DefinitionsListApi.visibleDefinitionsListByDefinition(11).then((response) => {
      console.log(response.data.data)
      setPMData(response.data.data)
    })

}, [id])

  useEffect(() => {

    if(shipmentPYGData){
      let pID = shipmentPYGData.depo_parking_yard_gate_id
      console.log(pID,'pID')
      if(pID){
        DepoExpenseClosureService.getClosureInfoById1(pID).then((res) => {
          setFetch(true)
          setSettlementAvailable(true)
          let closure_info_data = res.data.data
          console.log(closure_info_data,'closure_info_data')
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

}, [id,shipmentPYGData])

  const isNumericCheck = (event,type) => {

    const re = /^[0-9\b]+$/;
    // const re = /^[+-]?\d+(\.\d+)?$/;

    let result = event.target.value;

    if(type == 1){
      if (re.test(result)) {
        setUnloadingCharge(result)
      } else if(result == '') {
        setUnloadingCharge('')
      }
    } else if(type == 2){
      if (re.test(result)) {
        setSubDeliveryCharge(result)
      } else if(result == '') {
        setSubDeliveryCharge('')
      }
    } else if(type == 3){
      if (re.test(result)) {
        setWeighmentCharge(result)
      } else if(result == '') {
        setWeighmentCharge('')
      }
    } else if(type == 4){
      if (re.test(result)) {
        setFreightCharge(result)
      } else if(result == '') {
        setFreightCharge('')
      }
    } else if(type == 5){
      if (re.test(result)) {
        setDiversionCharge(result)
      } else if(result == '') {
        setDiversionCharge('')
      }
    } else if(type == 6){
      if (re.test(result)) {
        setHaltingCharge(result)
      } else if(result == '') {
        setHaltingCharge('')
      }
    }

  }

  /* ===================== The Very First Render Part End ===================== */

  /* ===================== Header Tabs Controls Part Start ===================== */

  /* ===================== Vehicle Assignment Details (FG-SALES) Table Data Part Start ===================== */

  const changeVadTableItem = (event, child_property_name, child_index) => {
    let getData = event.target.value
    console.log(getData, 'getData')

    // if (child_property_name == 'unloading_charges') {
    //   getData = event.target.value.replace(/\D/g, '')
    // }

    let shipment_parent_info = Object.assign({}, shipmentInfo);

    if (child_property_name == 'fj_pod_copy') {
      let dataNeeded = {}
      dataNeeded.child = child_index
      imageCompress(event,dataNeeded,'fjsales')
    } else {
      shipment_parent_info.shipment_child_info[child_index][
        `${child_property_name}_input`
      ] = getData
      console.log(shipment_parent_info,'updated_shipment_parent_info')
      setShipmentInfo(shipment_parent_info)
      // reUpload()

    }

  }

  /* ===================== Header Tabs Controls Part End ===================== */

  const freightAdjustment = (event) => {
    let val = event.target.value
    console.log(freightCharge,'freightCharge')
    console.log(val,'AdjustedFreightCharge')
    let adjustment = isNaN(Number(val)) ? 0 : Number(val) + Number(freightCharge)
    setAdjustedFreightCharge(val)
  }

  /* ===================== All Expenses Capture Part Start  ======================= */

  const totalChargesCalculator = () => {

    let  total_charge =
      Number(unloadingCharge ? unloadingCharge : 0) +
      Number(subDeliveryCharge ? subDeliveryCharge : 0) +
      Number(weighmentCharge ? weighmentCharge : 0) +
      Number(freightCharge ? freightCharge : 0) +
      Number(isNaN(adjustedFreightCharge) ? 0 : adjustedFreightCharge) +
      Number(diversionCharge ? diversionCharge : 0) +
      Number(haltingCharge ? haltingCharge : 0)

    console.log(total_charge,'total_charge')
    return total_charge
  }

  /* ================= FGSALES ========================================= */

  /* ===================== All Expenses Capture Part End  ======================= */

  const REQ = () => <span className="text-danger"> * </span>


  /* ==================== FIle Compress Code Start=========================*/

  const resizeFile = (file) => new Promise(resolve => {
    FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
    uri => {
      resolve(uri);
    }, 'base64' );
  })

  const imageCompress = async (event, need_data, ftype) => {

  console.log(need_data,'need_data')

    const file = event.target.files[0];
    console.log(file,'file')

    if(ftype == 'fjsales') {

      let shipment_parent_info_for_fjsales = Object.assign({}, shipmentInfo);

      if(file.type == 'application/pdf') {

        if(file.size > 5000000){
          toast.warning('File too Big, please select a file less than 5mb')
          shipment_parent_info_for_fjsales.shipment_child_info[need_data.child].fj_pod_copy = null
          shipment_parent_info_for_fjsales.shipment_child_info[need_data.child].fj_pod_copy_file_name = ''
          return false
        } else {
          shipment_parent_info_for_fjsales.shipment_child_info[need_data.child].fj_pod_copy = file
          shipment_parent_info_for_fjsales.shipment_child_info[need_data.child].fj_pod_copy_file_name = file.name
        }
      } else {

        shipment_parent_info_for_fjsales.shipment_child_info[need_data.child].fj_pod_copy_file_name = file.name
        if(file.size > 2000000){
          const image = await resizeFile(file)
          valueAppendToImage(image, shipment_parent_info_for_fjsales.shipment_child_info[need_data.child],'fjsales')
        } else {
          shipment_parent_info_for_fjsales.shipment_child_info[need_data.child].fj_pod_copy = file
        }
      }

      setShipmentInfo(shipment_parent_info_for_fjsales)

    }

  }

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  };

  const uploadClickFJ = (index_val) => {

    console.log(index_val,'index_val')

    let div_val = document.getElementById(`fj_pod_copy_upload_yes_parent_child${index_val}`)

    if(div_val) {
      document.getElementById(`fj_pod_copy_upload_yes_parent_child${index_val}`).click();
    }

  }

  const clearValues = (index_val,ftype) => {

   if(ftype == 'fjsales') {
      shipmentInfo.shipment_child_info[index_val].fj_pod_copy_file_name = ''
      shipmentInfo.shipment_child_info[index_val].fj_pod_copy = null
    }

    setClearValuesObject(true)

  }

  const valueAppendToImage1 = (image) => {
    let file_name = 'dummy'+getRndInteger(100001,999999)+'.jpg'
    let file = dataURLtoFile(
      image,
      file_name,
    );

    if(camEnableType == 'fjsales') {

      shipmentInfo.shipment_child_info[fileImageKey].fj_pod_copy = file
      shipmentInfo.shipment_child_info[fileImageKey].fj_pod_copy_file_name = file.name
    }

  }

  const valueAppendToImage = (image,need_data,ftype) => {

    let file_name = 'dummy'+getRndInteger(100001,999999)+'.jpg'
    let file = dataURLtoFile(
      image,
      file_name,
    );

    if(ftype == 'fjsales'){

      if(need_data) {
        need_data.fj_pod_copy = file
      }
    }

  }

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /* ==================== FIle Compress Code End =========================*/

  /* ===================== RM-STO Needed Functions Part End  ======================= */

  /* ================= FGSALES ========================================= */

  const TripsheetClosureSubmit = (process) => {

    console.log('-------------------parkingYardInfo---------------------------')
    console.log(shipmentPYGData)

    console.log('-------------------shipmentInfo---------------------------')
    console.log(shipmentInfo)

    console.log('-------------------FormValues---------------------------')
    console.log(values)

    /* Values Assigning To Save Details into DB Part Start*/

    const formData = new FormData()

    formData.append('contractor_id', shipmentPYGData.contractor_id ? shipmentPYGData.contractor_id : '')
    formData.append('vehicle_id', shipmentPYGData.vehicle_id ? shipmentPYGData.vehicle_id : '')
    formData.append('driver_id', shipmentPYGData.driver_id ? shipmentPYGData.driver_id : '')
    formData.append('parking_id', shipmentPYGData.depo_parking_yard_gate_id ? shipmentPYGData.depo_parking_yard_gate_id : '')
    formData.append('vehicle_inspection_id', shipmentPYGData.vehicle_inspection_id ? shipmentPYGData.vehicle_inspection_id : '')
    formData.append('tripsheet_id', shipmentPYGData.tripsheet_sheet_id ? shipmentPYGData.tripsheet_sheet_id : '')
    formData.append('shipment_id', shipmentPYGData.shipment_info.shipment_id ? shipmentPYGData.shipment_info.shipment_id : '')

    formData.append('unloading_charges', unloadingCharge ? unloadingCharge : 0)
    formData.append('sub_delivery_charges', subDeliveryCharge ? subDeliveryCharge : 0)
    formData.append('weighment_charges', weighmentCharge ? weighmentCharge : 0)
    formData.append('freight_charges', freightCharge ? freightCharge : 0)
    formData.append('freight_adjustment', adjustedFreightCharge ? adjustedFreightCharge : 0)
    formData.append('diversion_return_charges', diversionCharge ? diversionCharge : 0)
    formData.append('halting_charges', haltingCharge ? haltingCharge : 0)
    formData.append('total_expenses', totalChargesDepo ? totalChargesDepo : 0)

    if(expenseClosureApproval){
      formData.append('status', 1)
      formData.append('closure_approval_needed', 1)
    } else {
      formData.append('status', 4)
      formData.append('closure_approval_needed', 0)
    }

    formData.append('remarks', values.remarks ? values.remarks : '')
    formData.append('halt_days', values.halt_days ? values.halt_days : '')
    formData.append('created_by', user_id)

    let attachment_missing_delivery_no = ''
    formData.append('trip_shipment_info', JSON.stringify(shipmentInfo))
    shipmentInfo.shipment_child_info.map((child, child_index) => {

      if((child.fj_pod_copy_file_name != '' && !imageUrlValidation(child.fj_pod_copy))){
        console.log('shipmentInfo.shipment_child_info1',child_index)
        attachment_missing_delivery_no = child.delivery_no
      }

      if((child.fj_pod_copy_file_name == undefined && !imageUrlValidation(child.fj_pod_copy))){
        console.log('shipmentInfo.shipment_child_info2',child_index)
        attachment_missing_delivery_no = child.delivery_no
      }
      formData.append(
        `fg_pod_copy_shipment_${child.shipment_no}_delivery_${child.delivery_no}`,
        child.fj_pod_copy
      )
    })

    if(attachment_missing_delivery_no != ''){
      setFetch(true)
      Swal.fire({
        title: 'Attachment Invalid',
        text: `FJ POD copy missing/invalid for the Delivery : ${attachment_missing_delivery_no}`,
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
        // window.location.reload(false)
      })
      return false
    }

    console.log(process,'process')

    if (process == 'Submit') {

      DepoExpenseClosureService.createExpenseClosure(formData).then((res) => {
        console.log(res,'createExpenseClosureres')
        if (res.status == 200) {
          setFetch(true)
          // toast.success('Depo Trip Expense Capture Process Done Successfully!')
          // navigation('/TSExpenseCapture')
          Swal.fire({
            icon: "success",
            title: process == 'Submit' ? 'Submitted Successfully..!' : 'Updated Successfully..!',
            text: expenseClosureApproval ? 'Updated Expenses Sent to Approval..' : 'Depo Trip Expense Capture Process Done..',
            confirmButtonText: "OK",
          }).then(function () {
            navigation('/DepoExpenseClosureHome')
          });
        } else if (res.status == 201) {
          Swal.fire({
            title: res.data.message,
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            window.location.reload(false)
          })
        } else {
          toast.warning('Shipment Cannot be Approved. Kindly contact Admin..!')
        }
      })
      .catch((errortemp) => {
        console.log(errortemp)
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
      // formData.append('tripsheet_is_settled', 1)
      let expenseClosureID = expenseClosureData.closure_id
      setFetch(true)
      DepoExpenseClosureService.updateExpenseClosure(expenseClosureID, formData)
        .then((res) => {
          if (res.status == 200) {
            setFetch(true)
            // toast.success('Depo Trip Expense Capture Process Done Successfully!')
            // navigation('/TSExpenseCapture')
            Swal.fire({
              icon: "success",
              title: process == 'Submit' ? 'Submitted Successfully..!' : 'Updated Successfully..!',
              text: expenseClosureApproval ? 'Updated Expenses Sent to Approval..' : 'Depo Trip Expense Capture Process Done..',
              confirmButtonText: "OK",
            }).then(function () {
              navigation('/DepoExpenseClosureHome')
            });
          } else if (res.status == 201) {
            Swal.fire({
              title: res.data.message,
              icon: "warning",
              confirmButtonText: "OK",
            }).then(function () {
              window.location.reload(false)
            })
          } else {
            toast.warning('Shipment Cannot be Approved. Kindly contact Admin..!')
          }
        })
        .catch((errortemp) => {
          console.log(errortemp)
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
                            backgroundColor: 'green'
                          }}
                          onClick={() => setActiveKey(2)}
                        >
                          {/* FJ Information */}
                          Shipment Info
                        </CNavLink>
                      </CNavItem>

                      <CNavItem>
                        <CNavLink
                          active={activeKey === 3}
                          style={{ backgroundColor:  'green'  }}

                          onClick={() => setActiveKey(3)}
                        >
                          Expenses
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    {/* Hire Vehicles Part Header Tab End */}
                    {/* Hire Vehicles Part Start */}
                    <CTabContent>
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                        {/* Hire Vehicle General Info Part Start */}
                        {shipmentPYGData && (
                          <CRow className="">
                            {shipmentPYGData.contractor_info && (
                              <>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="cname">Contractor Name</CFormLabel>
                                  <CFormInput
                                    name="cname"
                                    size="sm"
                                    id="cname"
                                    value={shipmentPYGData.contractor_info.contractor_name}
                                    readOnly
                                  />
                                </CCol>

                                <CCol md={3}>
                                  <CFormLabel htmlFor="clo">Contractor Location / Code</CFormLabel>
                                  <CFormInput
                                    name="clo"
                                    size="sm"
                                    id="clo"
                                    value={locationFinder(shipmentPYGData.contractor_info.contractor_location)}
                                    readOnly
                                  />
                                </CCol>

                                <CCol md={3}>
                                  <CFormLabel htmlFor="cmn">Contractor Mobile Number</CFormLabel>
                                  <CFormInput
                                    name="cmn"
                                    size="sm"
                                    id="cmn"
                                    value={shipmentPYGData.contractor_info.contractor_number}
                                    readOnly
                                  />
                                </CCol>

                                <CCol md={3}>
                                  <CFormLabel htmlFor="cfr">Contractor Freight Type</CFormLabel>
                                  <CFormInput
                                    name="cfr"
                                    size="sm"
                                    id="cfr"
                                    value={shipmentPYGData.contractor_info.freight_type == '2' ? 'Actual Freight' :'Budget Freight'}
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}

                            {shipmentPYGData.vehicle_info && (
                              <>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                                  <CFormInput
                                    name="vNum"
                                    size="sm"
                                    id="vNum"
                                    value={shipmentPYGData.vehicle_info.vehicle_number}
                                    readOnly
                                  />
                                </CCol>

                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="vbt">Vehicle Capacity / Body Type </CFormLabel>
                                  <CFormInput
                                    name="vbt"
                                    size="sm"
                                    id="vbt"
                                    value={`${shipmentPYGData.vehicle_info.vehicle_capacity_info.capacity} - Ton / ${shipmentPYGData.vehicle_info.vehicle_body_type_info.body_type}`}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="vivt">Vehicle Insurance Valid To </CFormLabel>
                                  <CFormInput
                                    name="vivt"
                                    size="sm"
                                    id="vivt"
                                    value={shipmentPYGData.vehicle_info.insurance_validity}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="vfvt">Vehicle FC Valid To </CFormLabel>
                                  <CFormInput
                                    name="vfvt"
                                    size="sm"
                                    id="vfvt"
                                    value={shipmentPYGData.vehicle_info.fc_validity}
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}

                            {shipmentPYGData.vehicle_info && (
                              <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="dname">Driver name </CFormLabel>
                                  <CFormInput
                                    name="dname"
                                    size="sm"
                                    id="dname"
                                    value={shipmentPYGData.driver_info.driver_name}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="dmn">Driver Mobile Number </CFormLabel>
                                  <CFormInput
                                    name="dmn"
                                    size="sm"
                                    id="dmn"
                                    value={shipmentPYGData.driver_info.driver_number}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="dln">Driver License Number </CFormLabel>
                                  <CFormInput
                                    name="dln"
                                    size="sm"
                                    id="dln"
                                    value={shipmentPYGData.driver_info.license_no}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="dlvt">Driver License Valid To </CFormLabel>
                                  <CFormInput
                                    name="dlvt"
                                    size="sm"
                                    id="dlvt"
                                    value={shipmentPYGData.driver_info.license_validity_to}
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

                            {shipmentPYGData.vehicle_inspection_info && (
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="inspectionDateTime">Inspection Date & Time</CFormLabel>
                                <CFormInput
                                  name="inspectionDateTime"
                                  size="sm"
                                  id="inspectionDateTime"
                                  value={shipmentPYGData.vehicle_inspection_info.inspection_time_string}
                                  readOnly
                                />
                              </CCol>
                            )}

                            {shipmentPYGData.vehicle_tripsheet_info && (
                              <>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="TNum">Tripsheet Number</CFormLabel>
                                  <CFormInput
                                    name="TNum"
                                    size="sm"
                                    id="TNum"
                                    value={shipmentPYGData.vehicle_tripsheet_info.depo_tripsheet_no}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={3}>
                                  <CFormLabel htmlFor="TDate">Tripsheet Date & Time</CFormLabel>
                                  <CFormInput
                                    name="TDate"
                                    size="sm"
                                    id="TDate"
                                    value={shipmentPYGData.vehicle_tripsheet_info.ts_creation_time_string}
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
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="SRDateTime">Shipment Date & Time</CFormLabel>
                                  <CFormInput
                                    name="SRDateTime"
                                    size="sm"
                                    id="SRDateTime"
                                    value={shipmentPYGData.shipment_info.shipment_date_time_string}
                                    readOnly
                                  />
                                </CCol>
                              </>
                            )}
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="gateOutDateTime">Gate-Out Date & Time</CFormLabel>
                              <CFormInput
                                name="gateOutDateTime"
                                size="sm"
                                id="gateOutDateTime"
                                value={shipmentPYGData.gate_out_date_time_string}
                                readOnly
                              />
                            </CCol>
                          </CRow>
                        )}
                      </CTabPane>
                      {/* Hire Vehicle General Info Part End */}

                      {/* Hire Vehicle FG-SALES Part Start */}
                      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
                         <>
                            <CRow key={`HireshipmentData1`} className="mt-2" hidden>
                              <CCol xs={12} md={3}>
                                <CFormLabel
                                  htmlFor="inputAddress"
                                  style={{
                                    backgroundColor: '#4d3227',
                                    color: 'white',
                                  }}
                                >
                                  Shipment Details
                                </CFormLabel>
                              </CCol>
                            </CRow>
                            <CRow key={`HireshipmentData`} className="mt-2" hidden>

                              <CCol md={2}>
                                <CFormLabel htmlFor="ShNum">Shipment Number</CFormLabel>
                                <CFormInput
                                  name="ShNum"
                                  size="sm"
                                  id="ShNum"
                                  value={shipmentInfo.shipment_no}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel htmlFor="ShDate">Shipment Date</CFormLabel>
                                <CFormInput
                                  name="ShDate"
                                  size="sm"
                                  id="ShDate"
                                  value={shipmentInfo.created_at_date}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel htmlFor="ShQty">Shipment Qty in MTS</CFormLabel>
                                <CFormInput
                                  name="ShQty"
                                  size="sm"
                                  id="ShQty"
                                  value={ shipmentInfo.final_shipment_net_qty ? shipmentInfo.final_shipment_net_qty : shipmentInfo.final_shipment_qty}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel htmlFor="sft">Shipment Freight Type</CFormLabel>
                                <CFormInput
                                  name="sft"
                                  size="sm"
                                  id="sft"
                                  value={shipmentInfo.freight_type == '2' ? 'Actual Freight' :'Budget Freight'}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel htmlFor="BuFreight">Budget / Actual Freight</CFormLabel>
                                <CFormInput
                                  name="BuFreight"
                                  size="sm"
                                  id="BuFreight"
                                  value={`${shipmentInfo.shipment_depo_budget_freight_amount} / ${shipmentInfo.shipment_depo_actual_freight_amount}`}
                                  readOnly
                                />
                              </CCol>

                              <CCol md={2}>
                                <CFormLabel htmlFor="SAPFreight">SAP Freight</CFormLabel>
                                <CFormInput
                                  name="SAPFreight"
                                  size="sm"
                                  id="SAPFreight"
                                  value={shipmentInfo.shipment_sap_freight_amount}
                                  readOnly
                                />
                              </CCol>

                            </CRow>
                            <ColoredLine color="red" />
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
                            {shipmentInfo && shipmentInfo.shipment_child_info && shipmentInfo.shipment_child_info.map((val, val_index) => {
                              return (
                                <>

                                    <CRow key={`HireshipmentChildData_${val_index}`}>
                                      <CCol xs={12} md={2}>
                                        <CFormLabel htmlFor="sNum">Delivery Number</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          id="sNum"
                                          value={val.delivery_no}
                                          readOnly
                                        />
                                      </CCol>
                                      <CCol xs={12} md={2}>
                                        <CFormLabel htmlFor="sNum">Delivery Quantity in MTS</CFormLabel>

                                        <CFormInput
                                          size="sm"
                                          id="sNum"
                                          // value={val.delivery_qty}
                                          value={val.delivery_net_qty}
                                          readOnly
                                        />
                                      </CCol>
                                      <CCol xs={12} md={2}>
                                        <CFormLabel htmlFor="sInvoice">Invoice Number</CFormLabel>

                                        <CFormInput
                                          size="sm"
                                          id="sInvoice"
                                          value={val.invoice_no}
                                          readOnly
                                        />
                                      </CCol>
                                      <CCol xs={12} md={2}>
                                        <CFormLabel htmlFor="sNum">Invoice Quantity</CFormLabel>

                                        <CFormInput
                                          size="sm"
                                          id="sNum"
                                          // value={`${val.invoice_qty} - ${val.invoice_uom}`}
                                          value= {val.invoice_net_qty ? `${val.invoice_net_qty} - ${val.invoice_uom}` : `${val.invoice_qty} - ${val.invoice_uom}`}
                                          readOnly
                                        />
                                      </CCol>

                                      <CCol xs={12} md={2}>
                                        <CFormLabel htmlFor="cNum">Customer Name</CFormLabel>

                                        <CFormInput
                                          size="sm"
                                          id="cNum"
                                          value={val.customer_info.CustomerName}
                                          readOnly
                                        />
                                      </CCol>
                                      <CCol xs={12} md={2}>
                                        <CFormLabel htmlFor="cNum">Customer Code</CFormLabel>

                                        <CFormInput
                                          size="sm"
                                          id="cNum"
                                          value={val.customer_info.CustomerCode}
                                          readOnly
                                        />
                                      </CCol>
                                      <CCol xs={12} md={2}>
                                        <CFormLabel htmlFor="cNum">Customer City</CFormLabel>

                                        <CFormInput
                                          size="sm"
                                          id="cNum"
                                          value={val.customer_info.CustomerCity}
                                          readOnly
                                        />
                                      </CCol>
                                      <CCol xs={12} md={2}>
                                        <CFormLabel htmlFor="sDelivery">Delivered Date & Time</CFormLabel>

                                        <CFormInput
                                          size="sm"
                                          type="datetime-local"
                                          onChange={(e) => {
                                            changeVadTableItem(e, 'delivered_date_time', val_index)
                                          }}
                                          value={vadDataUpdate(
                                            val.delivered_date_time,
                                            val.delivered_date_time_input
                                          )}
                                        />
                                        {/* {val.delivered_date_time_validated === false && (
                                          <span className="small text-danger">
                                            Date & Time Should be Filled
                                          </span>
                                        )} */}
                                      </CCol>

                                      <CCol xs={12} md={2}>
                                        <CFormLabel htmlFor="fjPod">FJ POD Copy</CFormLabel>
                                        <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                          {/* {console.log(shipmentInfo,'shipmentInfo-FGSALES')} */}
                                          { !(imageUrlValidation(shipmentInfo.shipment_child_info[val_index].fj_pod_copy) || shipmentInfo.shipment_child_info[val_index].fj_pod_copy_file_name) ? (
                                            <>
                                              <span
                                                className="float-start"
                                                onClick={() => {
                                                  uploadClickFJ(val_index)
                                                }}
                                              >
                                                <CIcon
                                                  style={{color:'red'}}
                                                  icon={icon.cilFolderOpen}
                                                  size="lg"
                                                />
                                                &nbsp;Upload
                                              </span>
                                              <span
                                                style={{marginRight:'10%'}}
                                                className="mr-10 float-end"
                                                onClick={() => {
                                                  setFileImageKey(val_index)
                                                  setCamEnableType("fjsales")
                                                  setCamEnable(true)
                                                }}
                                              >
                                                <CIcon
                                                    style={{color:'red'}}
                                                    icon={icon.cilCamera}
                                                    size="lg"
                                                  />
                                                &nbsp;Camera
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <span className="float-start">
                                                {/* &nbsp;{shipmentInfo.shipment_child_info[val_index].fj_pod_copy_file_name} */}
                                                &nbsp;{shipmentInfo.shipment_child_info[val_index].fj_pod_copy_file_name ? shipmentInfo.shipment_child_info[val_index].fj_pod_copy_file_name : imageUrlValidation(shipmentInfo.shipment_child_info[val_index].fj_pod_copy,'url')}
                                              </span>
                                              {!shipmentInfo.shipment_child_info[val_index].fj_pod_copy_file_name && (
                                                <span className="ml-2">
                                                  <i
                                                    className="fa fa-eye"
                                                    aria-hidden="true"
                                                    onClick={() => {
                                                      setUploadedCamEnable(true)
                                                      setUploadedImgSrc(shipmentInfo.shipment_child_info[val_index].fj_pod_copy)
                                                      // clearValues(val_index,'fjsales')

                                                    }}
                                                  ></i>
                                                </span>
                                              )}
                                              <span className="float-end">
                                                <i
                                                  className="fa fa-trash"
                                                  aria-hidden="true"
                                                  onClick={() => {
                                                    clearValues(val_index,'fjsales')

                                                  }}
                                                ></i>
                                              </span>
                                            </>
                                          )}
                                        </CButton>
                                        <CFormInput
                                          onBlur={onBlur}
                                          onChange={(e) => changeVadTableItem(e, 'fj_pod_copy', val_index)}
                                          type="file"
                                          accept=".jpg,.jpeg,.png,.pdf"
                                          name={'fj_pod_copy'}
                                          size="sm"
                                          id={`fj_pod_copy_upload_yes_parent_child${val_index}`}
                                          style={{display:'none'}}
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
                      <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 3}>
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
                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                S.No
                              </CTableHeaderCell>

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
                              <CTableDataCell scope="row">
                                <b>1</b>
                              </CTableDataCell>
                              <CTableDataCell>Unloading Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  id="unloading_charges"
                                  name="unloading_charges"
                                  maxLength={5}
                                  onChange={(e) =>
                                    {isNumericCheck(e,1)}
                                  }
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
                              <CTableDataCell scope="row">
                                <b>2</b>
                              </CTableDataCell>
                              <CTableDataCell>Subdelivery Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  id="sub_delivery_charges"
                                  name="sub_delivery_charges"
                                  maxLength={5}
                                  size="sm"
                                  onChange={(e) =>
                                    {isNumericCheck(e,2)}
                                  }
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
                              <CTableDataCell scope="row">
                                <b>3</b>
                              </CTableDataCell>
                              <CTableDataCell>Weighment Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  id="weighment_charges"
                                  name="weighment_charges"
                                  maxLength={5}
                                  onChange={(e) =>
                                    {isNumericCheck(e,3)}
                                  }
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
                              <CTableDataCell scope="row">
                                <b>4</b>
                              </CTableDataCell>
                              <CTableDataCell>Freight Charges</CTableDataCell>
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
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Freight Charges Part End ======================= */}
                            {/* ================== Freight Adjustment Part Start ========= */}

                            <CTableRow>
                              <CTableDataCell scope="row">
                                <b>-</b>
                              </CTableDataCell>
                              <CTableDataCell>Freight Adjustment</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  id="adjustedFreightCharge"
                                  name="adjustedFreightCharge"
                                  maxLength={9}
                                  onChange={(e) =>
                                    {freightAdjustment(e)}
                                  }
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
                              <CTableDataCell scope="row">
                                <b>5</b>
                              </CTableDataCell>
                              <CTableDataCell>Stock Diversion / Return Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  id="diversion_return_charges"
                                  name="diversion_return_charges"
                                  maxLength={5}
                                  onChange={(e) =>
                                    {isNumericCheck(e,5)}
                                  }
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
                              <CTableDataCell scope="row">
                                <b>6</b>
                              </CTableDataCell>
                              <CTableDataCell>Halting Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  id="halting_charges"
                                  name="halting_charges"
                                  maxLength={5}
                                  onChange={(e) =>
                                    {isNumericCheck(e,6)}
                                  }
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
                            {expenseClosureApproval && (<span style={{ color: 'indigo',marginRight:'5%',fontWeight:'bolder',float:'right' }}>Updated Expenses will be sent to Expense Closure Approval..</span>)}
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
                    setImgSrc("")
                    setFileImageKey("")
                    setCamEnableType("")
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
                        <p className='mt-2'>
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
                        <img height={200}
                          src={imgSrc}
                        />
                        <p className='mt-2'>
                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            onClick={() => {
                              setImgSrc("")
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
                        setImgSrc("")
                        setFileImageKey("")
                        setCamEnableType("")
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/*Camera Image Copy model*/}

                {/* Uploaded Camera Image Copy model*/}
                <CModal
                  visible={uploadedCamEnable}
                  backdrop="static"
                  onClose={() => {
                    setUploadedCamEnable(false)
                    setUploadedImgSrc("")
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>POD Copy</CModalTitle>
                  </CModalHeader>

                  <CModalBody>
                    {uploadedImgSrc &&
                    !uploadedImgSrc.includes('.pdf') ? (
                      <CCardImage orientation="top" src={uploadedImgSrc} />
                    ) : (
                      <iframe
                        orientation="top"
                        height={500}
                        width={475}
                        src={uploadedImgSrc}
                      ></iframe>
                    )}
                  </CModalBody>

                  <CModalFooter>

                    <CButton
                      color="secondary"
                      onClick={() => {
                        setUploadedCamEnable(false)
                        setUploadedImgSrc("")
                      }}
                    >
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
                {/*Uploaded Camera Image Copy model*/}
              </CCard>
            </> ) : (<AccessDeniedComponent />)
          }

   	    </>
      )}
    </>
  )
}

export default DepoExpenseClosure
