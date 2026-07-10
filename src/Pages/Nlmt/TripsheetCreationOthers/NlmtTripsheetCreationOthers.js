/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTabContent,
  CTabPane,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CTooltip,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from 'src/components/Loader'
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify'
import useForm from 'src/Hooks/useForm'
import VehicleInspectionValidation from 'src/Utils/TransactionPages/VehicleInspection/VehicleInspectionValidation'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import NlmtTSCreationService from 'src/Service/Nlmt/TSCreation/NlmtTSCreationService'
import NlmtVehicleMasterService from 'src/Service/Nlmt/Masters/NlmtVehicleMasterService'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import VendorAvaiable from 'src/Pages/DocumentVerification/Segments/VendorAvaiable'
import OthersVendorNotAvailable from 'src/Pages/DocumentVerification/Segments/OthersVendorNotAvailable'
import PanDataService from 'src/Service/SAP/PanDataService'
import NlmtRouteMasterService from 'src/Service/Nlmt/Masters/NlmtRouteMasterService'
import AdvanceRequest from 'src/Pages/AdvanceRequestCreation/AdvanceRequest'
import NlmtVendorRequestService from 'src/Service/Nlmt/VendorRequest/NlmtVendorRequestService'
import NlmtTripInService from 'src/Service/Nlmt/TripIn/NlmtTripInService'
import NlmtShedListSearchSelect from '../Master/Component/NlmtShedListSearchSelect'
import NlmtShedMasterService from 'src/Service/Nlmt/Masters/NlmtShedMasterService'
import { getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'

const HIRE_ID = 22
const PARTY_ID = 23

const NlmtTripsheetCreationOthers = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  /* Get User Locations From Local Storage */
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  const user_id = user_info.user_id
  /*================== User Location Fetch ======================*/

  /* Get User Locations From Local Storage */
  const user_location_info = user_info.location_info
  var user_locations_id = ''
  user_location_info.map((data, index) => {
    user_locations_id = user_locations_id + data.id + ','
  })
  var lastIndex = user_locations_id.lastIndexOf(',')

  const userLocation = user_locations_id.substring(0, lastIndex)
  const [tdsDeclarationCopy, setTdsDeclarationCopy] = useState('')

  const handleChangeRjShedCopy = (event) => {
    let valll = event.target.files[0]
    setTdsDeclarationCopy(valll)
  }

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no =  NlmtScreenAccessCodes.NlmtTransactionScreens.Nlmt_Others_Vehicle_TS_Creation

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
    vehicle_type: '',
    vehicleId: '',
    vehicleNumber: '',
    vehicleCapacity: '',
    vehicleBodyType: '',
    driverName: '',
    driverMobile1: '',
    panNumber: '',
    ownerName: '',
    ownerMob: '',
    aadhar: '',
    bankAcc: '',
    expected_delivery_date: '',
    remarks: '',
    tripRoute: '',
    freightRate: '',
    advanceRequest: '',
    shedName: '',
    tds_form: ''
  }

  const { errors, values, setValues, handleChange, handleSubmit, onFocus, onBlur, handleChangeOTS } =
    useForm(() => { }, VehicleInspectionValidation, formValues)
  const [fetch, setFetch] = useState(false)
  const [loading, setLoading] = useState(true)
  const [vehicleTypeList, setVehicleTypeList] = useState([])
  const [capacityList, setCapacityList] = useState([])
  const [bodyTypeList, setBodyTypeList] = useState([])
  const [typedVehicleNo, setTypedVehicleNo] = useState('')
  const [isExistingVehicle, setIsExistingVehicle] = useState(false)
  const [rejectConfirm, setRejectConfirm] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [panData, setPanData] = useState({})
  const [panNumbernew, setpanNumber] = useState('')
  const [vendor, setVendor] = useState(false)
  const [freightRate, setFreightRate] = useState(0)
  const [routeLoading, setRouteLoading] = useState(false)
  const [tripRouteList, setTripRouteList] = useState([])
  const [advanceLimit, setadvanceLimit] = useState([])
  const [shedMob, setShedMob] = useState('')
  const [shedWhats, setShedWhats] = useState('')
  const [shed_Name1, setShed_Name1] = useState('')
  const [freightRateEditModal, setFreightRateEditModal] = useState(false)
  const [updatedFreightExists, setUpdatedFreightExists] = useState(false)
  const [updatedFreightRate, setUpdatedFreightRate] = useState('')
  const [originalVehicleConfig, setOriginalVehicleConfig] = useState({
    vehicle_capacity_id: '',
    vehicle_body_type_id: '',
  })

  const [advanceReqList, setadvanceReqList] = useState([
    { id: 1, name: 'Yes' },
    { id: 0, name: 'No' },
  ])

  const REQ = () => <span className="text-danger"> *</span>

  const handleChangenewpan = (event) => {
    let panResult = event.target.value.toUpperCase()
    var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/
    if (panResult.trim() === '') errors.panNumber = 'Required'
    else if (!regpan.test(panResult)) errors.panNumber = 'Invalid Pan Format (Ex:ABCDE1234F)'
    else errors.panNumber = ''
    setpanNumber(panResult)
    setPanData({})
  }

  useEffect(() => {
    setValues((prev) => ({
      vehicle_type: prev.vehicle_type,
      vehicle_number: prev.vehicle_number,
      vehicleId: '',
      vehicleNumber: '',
      vehicleCapacity: '',
      vehicleBodyType: '',
      vehicle_capacity_id: '',
      vehicle_body_type_id: '',
      driverName: '',
      driverMobile1: '',
      panNumber: '',
      ownerName: '',
      ownerMob: '',
      aadhar: '',
      bankAcc: '',
      expected_delivery_date: '',
      remarks: '',
      tripRoute: '',
      freightRate: '',
      advanceRequest: '',
      shedMob: '',
      shedWhats: '',
      shedName: '',

    }));
    setTypedVehicleNo('');
    setIsExistingVehicle(false);
    setPanData({});
    setpanNumber('');
    setVendor(false);
  }, [values.vehicle_type, values.vehicle_number]);



  useEffect(() => {

    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(2).then((res) => {
      setFetch(true)
      const list = res?.data?.data || []
      const sortedList = [...list].sort(
        (a, b) => Number(a.definition_list_name) - Number(b.definition_list_name)
      )
      setCapacityList(sortedList)
    })
      .catch(() => setCapacityList([]))

    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(1).then((res) => {
      setBodyTypeList(res?.data?.data || [])
    })
      .catch(() => setBodyTypeList([]))

    NlmtRouteMasterService.getNlmtRoutes().then((res) => {
      let route_data = res?.data?.data || []
      console.log(route_data,'getNlmtRoutes-alldata')
      let filter_data = route_data.filter((data)=> data.status == 1 )
      console.log(filter_data,'getNlmtRoutes-filter_data')
      setTripRouteList(filter_data)
    })
      .catch(() => setTripRouteList([]))

    NlmtVehicleMasterService.getNlmtOtherVehicleType().then((res) => {
      setVehicleTypeList(res?.data?.data || [])
    })
      .finally(() => setLoading(false))

  }, [])

  console.log(advanceLimit, 'advanceLimit')
  //const [advanceLimit, setadvanceLimit] = useState([])
  const onChange = (event) => {
    let shedId = event.value
    console.log(shedId, 'shedId')
    if (shedId != '') {
      values.shedName = shedId

      NlmtShedMasterService.getShedById(shedId).then((res) => {
        console.log(res.data.data)
        setShedMob(res.data.data.shed_owner_phone_1)
        setShedWhats(res.data.data.shed_owner_phone_2)
        setShed_Name1(res.data.data.shed_name)
        errors.shedName = ''
      })
      console.log(setShed_Name1)
    } else {
      values.shedName = ''
      setShedMob('')
      setShedWhats('')
      errors.shedName = 'Required'
      // console.log()
    }
  }
  const [panGroupData, setPanGroupData] = useState([])
  const [vendorCode, setVendorCode] = useState('0')
  const customElement = (vk) => {
    const val = (v) => (v ? v : '-')

    return `
    <div style="border:2px solid #dcdcdc;border-radius:8px;overflow:hidden;font-family:sans-serif">

      <div style="
        background: linear-gradient(90deg,#4e73df,#5a8dee);
        color:#fff;
        padding:10px 10px;
        font-size:16px;
        font-weight:600;">
        Vendor Information
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:15px">
        <tbody>

          ${row(1, "Vendor Code", val(vk.LIFNR))}
          ${row(2, "Vendor Name", val(vk.NAME1))}
          ${row(3, "Vendor Name 2", val(vk.NAME2))}
          ${row(4, "Mobile No.", val(vk.TELF1))}
          ${row(5, "Aadhar No.", val(vk.IDNUMBER))}
          ${row(6, "TDS Tax Type", val(vk.WITHT))}
          ${row(7, "Bank Account No.", val(vk.BANKN))}
          ${row(8, "PAN Card No.", val(vk.J_1IPANNO))}
          ${row(9, "City", val(vk.CITY))}

        </tbody>
      </table>
    </div>
  `
  }

  const row = (no, label, value) => `
  <tr style="border-bottom:1px solid #eee">
    <td style="width:8%;padding:8px 10px;font-weight:600;color:#555">${no}</td>
    <td style="width:42%;padding:8px 10px;color:#444">${label}</td>
    <td style="width:50%;padding:8px 10px;font-weight:600;color:#222">${value}</td>
  </tr>
`

  const getPanData = (e) => {
    e.preventDefault()

    // if (!panNumbernew || errors.panNumber) return

    if (panNumbernew == '' || panNumbernew.trimStart() == '') {
      toast.error("Vendor PAN No. Required..")
      return false
    }

    if (!/^[A-Z]{5}[\d]{4}[A-Z]{1}$/.test(panNumbernew)) {
      toast.error("PAN No. Must Like 'ABCDE1234F")
      return false
    }

    PanDataService.getMultiVendorInfoByPan(panNumbernew)
      .then((res) => {
        if (res.status === 200 && res.data && res.data.length > 0) {

          setPanGroupData(res.data)

          // ✅ If only one vendor → auto select
          if (res.data.length === 1) {
            setVendor(true)
            setPanData(res.data[0])
            setVendorCode(res.data[0].LIFNR)

            Swal.fire({
              // title: "Are you sure?",
              text: "You won't be able to revert this!",
              // icon: "warning",
              title: `Pan Number Details Detected!`,
              icon: "success",
              width: "600px",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              html: `<table style="height: fit-content" id="table" border=1>
                      <tbody>
                        ${customElement(res.data[0])}
                      </tbody>
                    </table>`,
              // confirmButtonText: "Vendor Update",
              //  cancelButtonText: "Cancel",
            }).then((result) => {

              if (result.isConfirmed) {
                // setFetch(false)
              }
            });
          }

          toast.success('PAN Details Detected!')
        } else {
          setVendor(false)
          setPanGroupData([])
          setPanData({})
          toast.warning('No PAN Details Detected!')
        }
      })
      .catch(() => {
        toast.error('Failed to fetch PAN data')
      })
  }
  const getPanChildData = (e) => {
    e.preventDefault()
    let res = e.target.value
    setVendorCode(res)

    panGroupData.map((vv, kk) => {
      if (vv.LIFNR == res) {
        setVendor(true)
        setPanData(vv)
        setpanNumber(vv.J_1IPANNO)

        Swal.fire({
          // title: "Are you sure?",
          text: "You won't be able to revert this!",
          // icon: "warning",
          title: `Pan Number Details Detected!`,
          icon: "success",
          width: "600px",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          html: `<table style="height: fit-content" id="table" border=1>
                  <tbody>
                    ${customElement(vv)}
                  </tbody>
                </table>`,
          // confirmButtonText: "Vendor Update",
          //  cancelButtonText: "Cancel",
        }).then((result) => {

          if (result.isConfirmed) {
            // setFetch(false)
          }
        });
        // setTDS(vv.WITHT)
        // setErrorsTdsType('')
      }
    })
    if (res == 0) {
      setVendor(false)
      setPanData({})
      setVendorCode('')
    }
  }
  useEffect(() => {
    if (!values.tripRoute) {
      setFreightRate(0)
      return
    }

    setRouteLoading(true)

    NlmtRouteMasterService.getNlmtRouteById(values.tripRoute)
      .then((res) => {
        const data = res?.data?.data
        setFreightRate(String(data?.freight_rate || 0))
      })
      .catch(() => {
        toast.error('Failed to load freight rate')
        setFreightRate(0)
      })
      .finally(() => setRouteLoading(false))
  }, [values.tripRoute])

  useEffect(() => {
    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(4)
      .then((res) => setadvanceLimit(res?.data?.data || []))
      .catch(() => setadvanceLimit([]))
  }, [])

  const advancePercentage =
    advanceLimit?.find((item) => item.definition_list_status === 1)
      ?.definition_list_name || 0

  const advanceEligible =
    values.advanceRequest === '1' &&
      values.vehicleCapacity &&
      freightRate
      ? (
        (Number(values.vehicleCapacity) * Number(freightRate) * Number(advancePercentage)) / 100
      ).toFixed(2)
      : '';
  console.log("panData:", panData)
  // Vehicle Create & Update - Vendor Creation Pending Start

  const vendorClear = () => {
    setpanNumber('')
    setPanGroupData([])
    setPanData({})
    // setTDS('0')
    // setErrorsTdsType('')
    setVendorCode('0')
    setVendor(false)
  }

  const tripCreationValidation = () => {

    console.log(values, 'tripCreationValidation-values')
    console.log(panNumbernew, 'tripCreationValidation-panNumbernew')

    if (values.vehicleNumber == '' || values.vehicleNumber.trimStart() == '') {
      toast.error("Vehicle Number Required..")
      return false
    }

    if (values.vehicleNumber.length < 7) {
      toast.error("Vehicle Number Should be at least 7 characters long..")
      return false
    }

    if (values.vehicle_capacity_id == '') {
      toast.error("Vehicle Capacity Required..")
      return false
    }

    if (values.vehicle_body_type_id == '') {
      toast.error("Vehicle Body Type Required..")
      return false
    }

    if (values.driverName == '' || values.driverName.trimStart() == '') {
      toast.error("Driver Name Required..")
      return false
    }

    if (values.driverName.length < 3) {
      toast.error("Driver Name Should be at least 3 characters long..")
      return false
    }

    if (values.driverMobile1 == '' || values.driverMobile1.trimStart() == '') {
      toast.error("Driver Mobile No. Required..")
      return false
    }

    if (!/^[\d]{10}$/.test(values.driverMobile1)) {
      toast.error("Driver Mobile No. Should be 10 digit numeric.")
      return false
    }

    if(values.vehicle_type == HIRE_ID){

      if (panNumbernew == '' || panNumbernew.trimStart() == '') {
        toast.error("Vendor PAN No. Required..")
        return false
      }

      if (!/^[A-Z]{5}[\d]{4}[A-Z]{1}$/.test(panNumbernew)) {
        toast.error("PAN No. Must Like 'ABCDE1234F")
        return false
      }

      console.log(panGroupData, 'tripCreationValidation-panGroupData')
      console.log(panData, 'tripCreationValidation-panData')
      console.log(vendorCode, 'tripCreationValidation-vendorCode')

      if (panGroupData.length > 0 && (!panData || vendorCode == 0)) {
        toast.error("Vendor Name Required..")
        return false
      }

      if (panGroupData.length == 0 && vendorCode == 0) {

        if (values.ownerName == '' || values.ownerName.trimStart() == '') {
          toast.error("Vendor Name Required..")
          return false
        }

        if (values.ownerMob == '' || values.ownerMob.trimStart() == '') {
          toast.error("Vendor Mobile No. Required..")
          return false
        }

        if (!/^[\d]{10}$/.test(values.ownerMob)) {
          toast.error("Vendor Mobile No. Should be 10 digit numeric.")
          return false
        }

        if (values.aadhar == '' || values.aadhar.trimStart() == '') {
          toast.error("Vendor Aadhar No. Required..")
          return false
        }

        if (!/^[\d]{12}$/.test(values.aadhar)) {
          toast.error("Aadhar No. Should be 12 digit numeric.")
          return false
        }

        if (values.bankAcc == '' || values.bankAcc.trimStart() == '') {
          toast.error("Bank Account No. Required..")
          return false
        }

      }

      console.log(values.tds_form, 'tdsDeclarationCopy')

      if (values.tds_form == '') {
        toast.error('TDS declaration copy should be attach, before submission..!')
        return false
      }

      console.log(values.tds_form.size, 'tdsDeclarationCopy-size')

      if (values.tds_form.size > 5000000) {
        toast.error('Attached TDS declaration copy should not having size more than 5Mb..!')
        return false
      }

      if (values.tripRoute == '') {
        toast.error("Trip Route Required..")
        return false
      }

      if (values.advanceRequest == '') {
        toast.error("Trip Advance Option Required..")
        return false
      }

      if (values.shedName == '') {
        toast.error("Shed Name Required..")
        return false
      }

    }

    if (values.expected_delivery_date == '') {
      toast.error("Expected Delivery Date Required..")
      return false
    }

    handleCreateClick()
  }

  const handleCreateClick = async () => {


    console.log(values, 'handleCreateClick-values')
    console.log(values.vehicleId, 'handleCreateClick-values.vehicleId')
    console.log(isExistingVehicle, 'handleCreateClick-isExistingVehicle')

    // return false

    try {
      let vehicleId = values.vehicleId;

      setFetch(false)
      /* ===============================
         1️⃣ CREATE VEHICLE (NEW)
      =============================== */
      if (!isExistingVehicle && !vehicleId) {
        const vehiclePayload = {
          vehicle_type_id: values.vehicle_type,
          vehicle_number: values.vehicleNumber,
          vehicle_capacity_id: values.vehicle_capacity_id,
          vehicle_body_type_id: values.vehicle_body_type_id,
          created_by: user_id,
        };
        console.log(vehiclePayload, 'vehiclePayload')
        const vehicleRes =
          await NlmtVehicleMasterService.createNlmtVehicles(vehiclePayload);

        if (!vehicleRes) {
          toast.error("Vehicle creation failed");
          return;
        }

        // ✅ CORRECT EXTRACTION
        vehicleId = vehicleRes?.data?.data?.vehicle_id;

        if (!vehicleId) {
          console.error("Vehicle create response:", vehicleRes);
          toast.error("Vehicle ID not generated");
          return;
        }

        // store for later usage
        setValues((prev) => ({ ...prev, vehicleId }));

        toast.success("Vehicle Created Successfully");
      }

      /* ===============================
         2️⃣ UPDATE VEHICLE (EXISTING)
      =============================== */
      if (isExistingVehicle && vehicleId) {
        const capacityChanged =
          originalVehicleConfig.vehicle_capacity_id !== values.vehicle_capacity_id;
        const bodyTypeChanged =
          originalVehicleConfig.vehicle_body_type_id !== values.vehicle_body_type_id;

        if (capacityChanged || bodyTypeChanged) {
          await NlmtVehicleMasterService.updateNlmtVehicles(vehicleId, {
            vehicle_capacity_id: values.vehicle_capacity_id,
            vehicle_body_type_id: values.vehicle_body_type_id,
            updated_by: user_id,
            _method: "PUT"
          });

          toast.success("Vehicle Updated Successfully");
        }
      }

      /* ===============================
         3️⃣ TRIP-IN → parking_id
      =============================== */
      if (!vehicleId) {
        toast.error("vehicleId missing before Trip-In");
        return;
      }

      const tripRes = await NlmtTripInService.handleTripInAction({
        vehicle_id: vehicleId,
        driver_id: values.driverId || null,
        driver_name: values.driverName,     // ✅ nullable bcoz Stored driver Name
        advance_request: values.advanceRequest,
        driver_phone_1: values.driverMobile1,    // ✅ nullable values.driverMobile1
        vehicle_inspection_id: null,
        vehicle_location_id: userLocation,            // ✅ nullable bcoz not VI
        created_by: user_id,
        vehicle_current_position: 8, /* Doc. Verified */
        parking_status: 1,
        tripsheet_open_status: 0,
      });
      console.log("Trip-In Response:", tripRes);

      if (tripRes.status == '201') {
        setFetch(true)
        toast.error(tripRes.data.message)
        return false
      }

      const parking_id = tripRes?.data?.data?.nlmt_trip_in_id;
      console.log("Trip-In parking_id:", parking_id);
      if (!parking_id) {
        setFetch(true)
        toast.error("parking_id not generated");
        return;
      }

      /* =============================== Hire Vendor Request  =============================== */


      if (
        values.vehicle_type == 22 &&
        values.ownerName &&
        values.ownerMob &&
        values.aadhar &&
        values.bankAcc
      ) {
        console.log("Vendor Response:")

        const formData = new FormData();

        formData.append('shed_id', values.shedName);
        formData.append('parking_id', parking_id);
        formData.append('vehicle_id', vehicleId);
        formData.append('owner_name', values.ownerName);
        formData.append('owner_number', values.ownerMob);
        formData.append('pan_card_number', panNumbernew);
        formData.append('aadhar_card_number', values.aadhar);
        formData.append('bank_acc_number', values.bankAcc);
        formData.append('tds_dec_form_front', values.tds_form); // ✅ file
        formData.append('existing_vendor', 0); /* 0 - New Vendor */
        formData.append('vendor_status', 1); /* 0 - New Vendor */
        formData.append('created_by', user_id);

        const vendorRes = await NlmtVendorRequestService.createNlmtVendorRequest(formData);
        console.log("Vendor Response:", vendorRes)

        toast.success("Vendor Request Submitted Successfully");
      }

      if (values.vehicle_type == 22 && panData.NAME1) {

        const formData = new FormData()

        formData.append('shed_id', values.shedName);
        formData.append('parking_id', parking_id);
        formData.append('vehicle_id', vehicleId);
        formData.append('owner_name', panData.NAME1);
        formData.append('owner_name2', panData.NAME2);
        formData.append('owner_number', panData.TELF1);
        formData.append('pan_card_number', panData.J_1IPANNO);
        formData.append('aadhar_card_number', panData.IDNUMBER);
        formData.append('bank_acc_number', panData.BANKN);
        formData.append('city', panData.CITY);
        formData.append('vendor_code', panData.LIFNR);
        formData.append('gst_tax_code', panData.WITHT);
        formData.append('tds_dec_form_front', values.tds_form); // ✅ file
        formData.append('existing_vendor', 1);  /* 1 - Existing Vendor */
        formData.append('vendor_status', 1);  
        formData.append('created_by', user_id);

        const vendorRes = await NlmtVendorRequestService.createNlmtVendorRequest(formData);
        console.log("Vendor Response:", vendorRes)

        toast.success("Vendor Request Submitted Successfully");
      }

      /* ===============================
         5️⃣ CREATE TRIPSHEET
      =============================== */
      const tsRes = await createTripsheet({
        status: 1,
        vehicleId,
        parking_id,
      })
      if (tsRes?.message === 'Tripsheet Creation Completed') {
        Swal.fire({
          title: 'NLMT TripSheet Created Successfully!',
          icon: 'success',
          text: `TripSheet No : ${tsRes.nlmt_tripsheet_no}`,
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.reload();   // ✅ refresh window
          //navigate('/NlmtTripsheetCreationOthers') // ✅ redirect works
        })
      } else if(tsRes?.sap_status == '2') {
        setFetch(true)
        // toast.error(tsRes.message)
        // return false

        Swal.fire({
          title: tsRes.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        })

      }
    } catch (error) {
      console.error("handleCreateClick error:", error);
      toast.error(error.message || "Something went wrong");
    }

  }

  // Vehicle Create & Update - Vendor Creation Pending End

  const createTripsheet = async ({ status, vehicleId, parking_id }) => {
    if (!vehicleId || !parking_id) {
      throw new Error("vehicleId or parking_id missing for Tripsheet");
    }

    const data = new FormData();

    data.append("vehicle_type", values.vehicle_type);
    data.append("vehicle_id", vehicleId);
    data.append("parking_id", parking_id);
    data.append("route_id", values.tripRoute);
    data.append("vehicle_type_id", values.vehicle_type);
    data.append("vehicle_number", values.vehicleNumber);
    data.append("vehicle_capacity_id", values.vehicle_capacity_id);
    data.append("vehicle_body_type_id", values.vehicle_body_type_id);
    data.append("advance_request", values.advanceRequest);
    data.append("expected_delivery_date", values.expected_delivery_date);
    data.append("remarks", values.remarks);
    data.append("status", status);
    data.append("created_by", user_id);

    data.append("driverName", values.driverName);
    data.append("driverMobile1", values.driverMobile1);
    data.append("panNumber", panNumbernew);
    data.append("ownerName", values.ownerName);
    data.append("ownerMobile", values.ownerMob);
    data.append("aadharNumber", values.aadhar);
    data.append("bankAccountNumber", values.bankAcc);
    data.append("advanceRequest", values.advanceRequest);
    data.append("tripRoute", values.tripRoute || "");

    data.append("trip_freight_rate", freightRate)

    let current_time = getCurrentDateTime()
    let current_info = []
    current_info.push({ 
      route_id: values.tripRoute,
      freight_rate: freightRate, 
      freight_change: updatedFreightExists ? 1 : 0, 
      updated_freight_rate: updatedFreightRate, 
      type: updatedFreightExists ? 1 : 0, /* 1 - Creation, 0 - No Need */
      user: user_id,
      time: current_time,
      remarks: values.remarks,
    })
    data.append('freight_log_info', JSON.stringify(current_info))

    if(updatedFreightExists){
      data.append("trip_updated_freight_rate", updatedFreightRate)
      data.append("freight_approval_status", updatedFreightExists ? 1 : 0)
    }     

    const res = await NlmtTSCreationService.handleTripsheetCreationAction(data);
    return res.data;
  };

  if (loading) return <Loader />

  const isHire = values.vehicle_type == HIRE_ID
  const isParty = values.vehicle_type == PARTY_ID

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard>
                <CTabContent>
                  <CTabPane visible>
                    <CForm onSubmit={handleSubmit} className="p-3">
                      <CRow className="mt-3">
                        {/* VEHICLE TYPE */}
                        <CCol md={3}>
                          <CFormLabel>Vehicle Type  <REQ />{' '}
                            {errors.vehicle_type && <span className="text-danger">{errors.vehicle_type}</span>}
                          </CFormLabel>
                          <CFormSelect size="sm" name="vehicle_type" value={values.vehicle_type} onChange={handleChange}>
                            <option value="">Select</option>
                            {vehicleTypeList.map((v) => (
                              <option key={v.id} value={v.id}>
                                {v.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </CCol>


                        {(isHire || isParty) && (
                          <CCol md={3}>
                            <CFormLabel>Vehicle Number <REQ />{' '}
                              {errors.vehicleNumber && <span className="text-danger">{errors.vehicleNumber}</span>}
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              maxLength="12"
                              placeholder="Enter Vehicle Number"
                              value={typedVehicleNo}
                              onChange={(e) => {
                                const vNo = e.target.value.toUpperCase()
                                // if(vNo.trimStart() != '' && vNo.length > 6)
                                // {
                                setTypedVehicleNo(vNo)
                                setValues((prev) => ({ ...prev, vehicleNumber: vNo }))
                                if (isHire && isParty) setIsExistingVehicle(false)
                                // }
                              }}
                              onBlur={async () => {
                                if (!typedVehicleNo) return

                                try {
                                  const res = await NlmtVehicleMasterService.getNlmtHireVehicleCheck(typedVehicleNo)

                                  if (res?.data?.exists) {
                                    const v = res.data.data
                                    console.log(v, 'vehicle data')

                                    if (Number(v.vehicle_is_assigned) === 1) {
                                      console.log(v.id, 'v.id')
                                      const tripRes = await NlmtTripInService.getTripInOpenTrucks(v.id)
                                      console.log(tripRes, 'tripRes')
                                      const tripData = tripRes?.data?.data
                                      const tripsheetNo = tripData?.nlmt_tripsheet_no 
                                      console.log(tripData, 'tripData')
                                      console.log(tripsheetNo, 'tripsheetNo')
                                      await Swal.fire({
                                        title: tripsheetNo ? 'Vehicle Already Assigned' : 'Vehicle is still assigned. But Last Tripsheet closed..',
                                        html: tripsheetNo ? `<p><b>TripSheet No:</b> ${tripsheetNo}</p>` : `<p><b>Vehicle No:</b> ${v.vehicle_number}</p>`,
                                        icon: 'warning',
                                        confirmButtonText: 'OK',
                                      })

                                      window.location.reload()
                                      return
                                    }

                                    // ✅ Existing but NOT assigned
                                    setIsExistingVehicle(true)
                                    setOriginalVehicleConfig({
                                      vehicle_capacity_id: String(v.vehicle_capacity_id),
                                      vehicle_body_type_id: String(v.vehicle_body_type_id),
                                    })

                                    setValues((prev) => ({
                                      ...prev,
                                      vehicleId: v.id,
                                      vehicleCapacity: v.vehicle_capacity_info?.def_list_name || '',
                                      vehicleBodyType: v.vehicle_body_type_info?.def_list_name || '',
                                      vehicle_capacity_id: String(v.vehicle_capacity_id),
                                      vehicle_body_type_id: String(v.vehicle_body_type_id),
                                    }))
                                  } else {
                                    // ❌ New vehicle
                                    setIsExistingVehicle(false)
                                    setOriginalVehicleConfig({
                                      vehicle_capacity_id: '',
                                      vehicle_body_type_id: '',
                                    })

                                    setValues((prev) => ({
                                      ...prev,
                                      vehicleId: '',
                                      vehicleCapacity: '',
                                      vehicleBodyType: '',
                                      vehicle_capacity_id: '',
                                      vehicle_body_type_id: '',
                                    }))
                                  }
                                } catch (error) {
                                  console.error('Vehicle check failed:', error)
                                  toast.error('Failed to verify vehicle')
                                }
                              }}

                            />
                          </CCol>
                        )}

                        {/* VEHICLE CAPACITY */}
                        {(isHire || isParty) && (
                          <CCol md={3}>
                            <CFormLabel>
                              Vehicle Capacity <REQ />{' '}
                              {errors.vehicleCapacity && <span className="text-danger">{errors.vehicleCapacity}</span>}
                            </CFormLabel>

                            <CFormSelect
                              size="sm"
                              name="vehicle_capacity_id"
                              value={values.vehicle_capacity_id}
                              onChange={(e) =>
                                setValues((prev) => ({
                                  ...prev,
                                  vehicle_capacity_id: e.target.value,
                                  vehicleCapacity:
                                    capacityList.find(
                                      (c) => String(c.definition_list_id) === e.target.value
                                    )?.definition_list_name || '',
                                }))
                              }
                            >
                              <option value="">Select Vehicle Capacity</option>
                              {capacityList.map(({ definition_list_id, definition_list_name }) => (
                                <option key={definition_list_id} value={String(definition_list_id)}>
                                  {definition_list_name}
                                </option>
                              ))}
                            </CFormSelect>

                          </CCol>
                        )}

                        {/* VEHICLE BODY TYPE */}
                        {(isHire || isParty) && (
                          <CCol md={3}>
                            <CFormLabel>
                              Vehicle Body Type <REQ />{' '}
                              {errors.vehicleBodyType && <span className="text-danger">{errors.vehicleBodyType}</span>}
                            </CFormLabel>

                            <CFormSelect
                              size="sm"
                              name="vehicle_body_type_id"
                              value={values.vehicle_body_type_id}
                              onChange={(e) =>
                                setValues((prev) => ({
                                  ...prev,
                                  vehicle_body_type_id: e.target.value,
                                  vehicleBodyType:
                                    bodyTypeList.find(
                                      (b) => String(b.definition_list_id) === e.target.value
                                    )?.definition_list_name || '',
                                }))
                              }
                            >
                              <option value="">Select Vehicle Body Type</option>
                              {bodyTypeList.map(({ definition_list_id, definition_list_name }) => (
                                <option key={definition_list_id} value={String(definition_list_id)}>
                                  {definition_list_name}
                                </option>
                              ))}
                            </CFormSelect>
                          </CCol>
                        )}

                      </CRow>
                      <CRow className="mt-3">
                        {values.vehicle_type && (
                          <>

                            {/* DRIVER NAME */}
                            <CCol md={3}>
                              <CFormLabel>
                                Driver Name <REQ /> {errors.driverName && <span className="text-danger">{errors.driverName}</span>}
                              </CFormLabel>
                              <CFormInput maxLength="30" name="driverName" value={values.driverName} onChange={handleChange} />
                            </CCol>

                            {/* DRIVER MOBILE */}
                            <CCol md={3}>
                              <CFormLabel>
                                Driver Mobile Number <REQ />{' '}
                                {errors.driverMobile1 && <span className="text-danger">{errors.driverMobile1}</span>}
                              </CFormLabel>
                              <CFormInput type="tel"
                                maxLength="10" name="driverMobile1" value={values.driverMobile1} placeholder="Enter Mobile Number" onChange={handleChange} />
                            </CCol>

                            {/* PAN for Hire only */}
                            {isHire && (
                              <>
                                <CCol md={3}>
                                  <CFormLabel>
                                    PAN Card Number <REQ />{' '}
                                    {errors.panNumber && <span className="text-danger">{errors.panNumber}</span>}
                                  </CFormLabel>

                                  <CInputGroup>
                                    <CFormInput
                                      size="sm"
                                      name="panNumber"
                                      value={panNumbernew}
                                      // readOnly={vendor}
                                      readOnly={panGroupData.length > 0 ? true : false}
                                      onFocus={onFocus}
                                      onBlur={onBlur}
                                      onChange={handleChangenewpan}
                                      style={{
                                        backgroundColor: vendor ? '#f29a52' : '',
                                        cursor: vendor ? 'not-allowed' : 'text'
                                      }}
                                    />
                                    <CInputGroupText className="p-0">
                                      {/* <CTooltip content="Verify Pan Card" placement="top">
                                        <CButton
                                          size="sm"
                                          color="success"
                                          className="px-2 rounded-pill"
                                          onClick={getPanData}
                                        >
                                          <i className="fa fa-check"></i>
                                        </CButton>
                                      </CTooltip> */}
                                      {panGroupData.length == 0 ? (
                                        <CButton
                                          size="sm"
                                          color="success"
                                          onClick={(e) => getPanData(e)}
                                        >
                                          <i className="fa fa-check px-1"></i>
                                        </CButton>
                                      ) : (
                                        <CButton
                                          size="sm"
                                          color="danger"
                                          onClick={(e) => vendorClear()}
                                        >
                                          <i className="fa fa-refresh px-1"></i>
                                        </CButton>
                                      )
                                      }
                                    </CInputGroupText>
                                  </CInputGroup>
                                </CCol>

                                {panGroupData.length > 1 && (
                                  <CCol md={3}>
                                    <CFormLabel>Vendor Name</CFormLabel>
                                    <CFormSelect
                                      size="sm"
                                      name="pan_data"
                                      value={vendorCode}
                                      onChange={getPanChildData}
                                      style={{ marginTop: '5px' }}
                                    >
                                      <option value="">Select Vendor</option>
                                      {panGroupData.map(({ LIFNR, NAME1 }) => (
                                        <option key={LIFNR} value={LIFNR}>
                                          {LIFNR} - {NAME1}
                                        </option>
                                      ))}
                                    </CFormSelect>
                                  </CCol>
                                )}
                              </>
                            )}

                            {/* OWNER, Aadhar, Bank */}
                            {isHire && (panData?.LIFNR || panGroupData.length === 0) && (
                              vendor ? (
                                <VendorAvaiable panData={panData} />
                              ) : (
                                <OthersVendorNotAvailable
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  handleChange={handleChangeOTS}
                                  values={values}
                                  errors={errors}
                                />
                              )
                            )}


                            {/* TripRoute */}
                            {/* {panNumbernew && (
                              <>
                                <CCol md={3}>
                                  <CFormLabel>Trip Routes</CFormLabel>
                                  <CFormSelect name="tripRoute" value={values.tripRoute} onChange={handleChange}>
                                    <option value="">Select</option>
                                    {tripRouteList.map(({ id, route_name }) => (
                                      <option key={id} value={String(id)}>
                                        {route_name}
                                      </option>
                                    ))}
                                  </CFormSelect>
                                </CCol>
                                <CCol md={3}>
                                  <CFormLabel>
                                    Freight Rate <REQ />
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="number"
                                    value={freightRate}
                                    readOnly
                                    placeholder={routeLoading ? 'Loading...' : ''}
                                  />
                                </CCol>
                                <CCol md={3}>
                                  <CFormLabel>Trip Advance </CFormLabel>
                                  <CFormSelect name="advanceRequest" value={values.advanceRequest} onChange={handleChange}>
                                    <option value="">Select</option>
                                    {advanceReqList.map(({ id, name }) => (
                                      <option key={id} value={String(id)}>
                                        {name}
                                      </option>
                                    ))}
                                  </CFormSelect>
                                </CCol>
                                {values.advanceRequest === '1' && (
                                  <CCol md={3}>
                                    <CFormLabel>
                                      Advance Eligible {advancePercentage} % <REQ />
                                    </CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      type="number"
                                      value={advanceEligible}
                                      readOnly
                                    />
                                  </CCol>
                                )}
                              </>
                            )} */}
                            {(isHire && vendor) ? (
                              <>
                                {/* <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="shedName">
                                    Shed Name <REQ />
                                    {errors.shedName && (
                                      <span className="small text-danger">{errors.shedName}</span>
                                    )}
                                  </CFormLabel>
                                  <NlmtShedListSearchSelect
                                    size="sm"
                                    className="mb-1"
                                    name="shedName"
                                    value={values.shedName}
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    search_type="shed_name"
                                  />
                                </CCol>

                                <CCol xs={12} md={3}>
                                  <CFormLabel>Shed Mobile Number</CFormLabel>
                                  <CFormInput size="sm" value={shedMob} readOnly />
                                </CCol>

                                <CCol xs={12} md={3}>
                                  <CFormLabel>Shed WhatsApp Number</CFormLabel>
                                  <CFormInput size="sm" value={shedWhats} readOnly />
                                </CCol> */}
                              </>
                            ) : null}

                          </>
                        )}
                        {/* {(isHire && values.driverMobile1 && values.tripRoute) ? (

                          <CCol md={3}>
                            <CFormLabel>
                              Freight Rate <REQ />
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="number"
                              value={freightRate}
                              readOnly
                              placeholder={routeLoading ? 'Loading...' : ''}
                            />
                          </CCol>
                        ) : null} */}
                        {(isHire) ? (
                          <>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tdsDeclarationCopy">
                                TDS Declaration Form <REQ />{' '}
                              </CFormLabel>
                              <CFormInput 
                                type="file"
                                name="tds_form"
                                id="tds_form"
                                size="sm"
                                accept=".pdf,.jpg,.jpeg,.png" 
                                onChange={handleChange} 
                              />                                
                              {/* <CFormInput
                                onChange={handleChangeRjShedCopy}
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                name="tdsDeclarationCopy"
                                size="sm"
                                id="tdsDeclarationCopy"
                              /> */}
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel>Trip Routes</CFormLabel>
                              <CFormSelect name="tripRoute" value={values.tripRoute} onChange={handleChange}>
                                <option value="">Select</option>
                                {tripRouteList.map(({ id, route_name }) => (
                                  <option key={id} value={String(id)}>
                                    {route_name}
                                  </option>
                                ))}
                              </CFormSelect>
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel>
                                Freight Rate <REQ />
                              </CFormLabel>
                              <CInputGroup>
                                <CFormInput
                                  size="sm"
                                  // type="number"
                                  value={freightRate}
                                  readOnly
                                  placeholder={routeLoading ? 'Loading...' : ''}
                                />
                                {!updatedFreightExists && (
                                  <CButton
                                    size="sm"
                                    color="secondary"
                                    disabled={freightRate == 0 || routeLoading || values.tripRoute == ''}
                                    onClick={(e) => {
                                      // getPanData(e)
                                      setFreightRateEditModal(true)
                                    }}
                                  >
                                    <i className="fa fa-edit px-1"></i>
                                  </CButton>
                                )}

                              </CInputGroup>
                            </CCol>
                            {updatedFreightExists && (
                              <CCol md={3}>
                                <CFormLabel>Updated Freight Rate</CFormLabel>
                                <CInputGroup>
                                  <CFormInput
                                    size="sm"
                                    // type="number"
                                    value={updatedFreightRate}
                                    readOnly
                                  />
                                  <CButton
                                    size="sm"
                                    color="danger"
                                    onClick={(e) => {
                                      setUpdatedFreightExists(false)
                                      setUpdatedFreightRate('')
                                    }}
                                  >
                                    <i className="fa fa-trash px-1"></i>
                                  </CButton>
                                </CInputGroup>
                              </CCol>
                            )}
                            <CCol md={3}>
                              <CFormLabel>Trip Advance </CFormLabel>
                              <CFormSelect name="advanceRequest" value={values.advanceRequest} onChange={handleChange}>
                                <option value="">Select</option>
                                {advanceReqList.map(({ id, name }) => (
                                  <option key={id} value={String(id)}>
                                    {name}
                                  </option>
                                ))}
                              </CFormSelect>
                            </CCol>
                            {values.advanceRequest === '1' && (
                              <CCol md={3}>
                                <CFormLabel>
                                  Advance Eligible {advancePercentage} % <REQ />
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  type="text"
                                  value={advanceEligible}
                                  readOnly
                                />
                              </CCol>
                            )}
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="shedName">
                                Shed Name <REQ />
                                {errors.shedName && (
                                  <span className="small text-danger">{errors.shedName}</span>
                                )}
                              </CFormLabel>
                              <NlmtShedListSearchSelect
                                size="sm"
                                className="mb-1"
                                name="shedName"
                                value={values.shedName}
                                onChange={onChange}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                search_type="shed_name"
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel>Shed Mobile Number</CFormLabel>
                              <CFormInput size="sm" value={shedMob} readOnly />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel>Shed WhatsApp Number</CFormLabel>
                              <CFormInput size="sm" value={shedWhats} readOnly />
                            </CCol>
                          </>
                        ) : null}

                        {values.vehicle_type && (
                          <>
                            <CCol md={3}>
                              <CFormLabel>Expected Delivery Date <REQ /></CFormLabel>
                              <CFormInput
                                type="date"
                                name="expected_delivery_date"
                                value={values.expected_delivery_date}
                                onChange={handleChange}
                              />
                            </CCol>
                            <CCol md={3}>
                              <CFormLabel>Remarks</CFormLabel>
                              <CFormTextarea rows="1" name="remarks" value={values.remarks} onChange={handleChange} />
                            </CCol>
                          </>
                        )}


                      </CRow>

                      {(isParty && values.driverMobile1) ? (
                        <CRow className="mt-3">
                          {(isHire && values.driverMobile1 && values.tripRoute) ? (

                            <CCol >
                              <CFormLabel>Trip Route</CFormLabel>
                              <CFormSelect name="tripRoute" value={values.tripRoute} onChange={handleChange}>
                                <option value="">Select</option>
                                {tripRouteList.map(({ id, route_name }) => (
                                  <option key={id} value={String(id)}>
                                    {route_name}
                                  </option>
                                ))}
                              </CFormSelect>
                            </CCol>
                          ) : null}




                        </CRow>
                      ) : null}
                      <CRow className="mt-4">
                        {values.vehicle_type && (
                          <>
                            {(Number(freightRate) != Number(updatedFreightRate)) && updatedFreightRate && (
                              <CCol md={2} className="text-end">
                                {/* */}
                              </CCol>
                            )}
                            {(Number(freightRate) != Number(updatedFreightRate)) && updatedFreightRate != '' && (
                              <CCol md={7} style={{ border: "1px solid black", marginTop: "2px", background: "aliceblue" }}>
                                <CFormLabel>
                                  Note :
                                </CFormLabel>
                                <span style={{ display: "block", fontWeight: "bold" }} className="big text-danger">
                                  Note: If the updated freight differs from the original freight, manager approval is required.
                                </span>
                              </CCol>
                            )}

                            <CCol md={(Number(freightRate) != Number(updatedFreightRate)) && updatedFreightRate != '' ? 3 : 12} className="text-end">
                              <CButton size="md" color="success" onClick={tripCreationValidation}>
                                Create
                              </CButton>
                              {/* <CButton size="md" color="danger" className="ms-2" onClick={() => setRejectConfirm(true)}>
                                Reject
                              </CButton> */}
                            </CCol>
                          </>
                        )}
                      </CRow>
                    </CForm>
                  </CTabPane>
                </CTabContent>
              </CCard>
            </>
          ) : (
            <AccessDeniedComponent />
          )}

          {/*edit Freight rate model*/}
          <CModal
            visible={freightRateEditModal} 
            onClose={() => setFreightRateEditModal(false)}
            backdrop="static"
          >
            <CModalHeader>
              <CModalTitle>EDIT FREIGHT RATE</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <CCol>
                  <CFormLabel htmlFor="defect_type">
                    Freight Rate
                  </CFormLabel>
                  <CFormInput
                    size="sm"
                    id="bankName"
                    maxLength={4}
                    value={updatedFreightRate}
                    onChange={(e) => { setUpdatedFreightRate(e.target.value.replace(/\D/g, '')) }}
                  />
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => {
                  setFreightRateEditModal(false)
                  setUpdatedFreightExists(false)
                  setUpdatedFreightRate('')
                }}
              >
                Cancel
              </CButton>
              <CButton
                color="primary"
                disabled={!updatedFreightRate}
                onClick={(e) => {
                  setUpdatedFreightExists(true)
                  setFreightRateEditModal(false)
                }}
              >
                Update
              </CButton>
            </CModalFooter>
          </CModal>
          {/*edit Bank model*/}

          {/* REJECT MODAL */}
          <CModal visible={rejectConfirm} backdrop="static">
            <CModalBody>Are you sure to reject this Tripsheet?</CModalBody>
            <CModalFooter>
              <CButton color="danger" onClick={() => createTripsheet(2)}>
                Confirm
              </CButton>
              <CButton color="secondary" onClick={() => setRejectConfirm(false)}>
                Cancel
              </CButton>
            </CModalFooter>
          </CModal>

          {/* ERROR MODAL */}
          <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
            <CModalHeader>
              <CModalTitle>Error</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CAlert color="danger">{errorMsg}</CAlert>
            </CModalBody>
          </CModal>
          <ToastContainer />
        </>
      )}
    </>
  )
}

export default NlmtTripsheetCreationOthers
