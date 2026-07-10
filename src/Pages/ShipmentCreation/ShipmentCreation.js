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
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CInputGroup,
  CInputGroupText,
  CAlert,
} from '@coreui/react'
import { React, useState, useEffect } from 'react'
// import CModal from '@coreui/react/src/components/modal/CModal'
import useForm from 'src/Hooks/useForm'
import validate from 'src/Utils/Validation'
import CustomTable from '../../components/customComponent/CustomTable'
import VehicleAssignmentSapService from '../../Service/SAP/VehicleAssignmentSapService'
import { Link, useNavigate } from 'react-router-dom'
import AssignTruckInfo from './Segments/AssignTruckInfo'
import LocationApi from '../../Service/SubMaster/LocationApi'
import DeliveryOrderInfo from './Segments/DeliveryOrderInfo'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import Swal from 'sweetalert2'
import TripSheetInfoService from 'src/Service/PurchasePro/TripSheetInfoService'
import SmallLoader from 'src/components/SmallLoader'
import JavascriptGivenDateValidation from 'src/components/commoncomponent/JavascriptGivenDateValidation'
import CustomerFreightApi from 'src/Service/SubMaster/CustomerFreightApi'
import { GetDateTimeFormat } from '../Nlmt/CommonMethods/CommonMethods'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'

const Shipment = () => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const user_access_locations = []

  console.log(user_info)
  const navigation = useNavigate()

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* ===== User Inco Terms Declaration Start ===== */

  const user_inco_terms = []
  /* Get User Inco Terms From Local Storage */
  user_info.inco_term_info.map((data, index) => {
    user_inco_terms.push(data.def_list_code)
  })
  const [incoTermData, setIncoTermData] = useState([])
  const [nlcdPlantsData, setNlcdPlantsData] = useState([])
  const [nlcdPlantsArrayData, setNlcdPlantsArrayData] = useState([])
  const [tripShipmentCustomerData, setTripShipmentCustomerData] = useState([])
  useEffect(() => {

    /* section for getting Inco Term Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(16).then((response) => {

      let viewData = response.data.data

      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          incoterm_name: data.definition_list_name,
          incoterm_code: data.definition_list_code,
        })
      })

      setIncoTermData(rowDataList_location)
    })

    CustomerFreightApi.getCustomerFreight().then((response) => {
      console.log(response.data.data, 'trip_shipment_customer_data')
      let trip_shipment_customer_data = response.data.data
      setTripShipmentCustomerData(trip_shipment_customer_data)
    })

    /* section for getting NLCD Plants List Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(35).then((response) => {

      let nlcd_plants_data = response.data.data
      console.log(nlcd_plants_data, 'nlcd_all_plants_data')
      let active_plant_array = []
      let filter_Data = nlcd_plants_data.filter((c, index) => {

        if (c.definition_list_status == 1) {
          active_plant_array.push(c.definition_list_code)
          return true
        }
      })
      console.log(filter_Data, 'nlcd_active_plants_data')
      console.log(active_plant_array, 'active_plant_array')
      setNlcdPlantsArrayData(active_plant_array)
      setNlcdPlantsData(filter_Data)
    })

  }, [])
  const REQ = () => <span className="text-danger"> * </span>

  /* Display The Inco Term Name via Given Inco Term Code */
  const getIncoTermNameByCode = (code) => {

    let filtered_incoterm_data = incoTermData.filter((c, index) => {

      if (c.incoterm_code == code) {
        return true
      }
    })

    let incoTermName = filtered_incoterm_data[0] ? filtered_incoterm_data[0].incoterm_name : 'Loading..'

    return incoTermName
  }

  /* ===== User Inco Terms Declaration End ===== */


  /* Get User Plant Access From Local Storage */
  user_info.location_info.map((data1, index1) => {
    user_access_locations.push(data1.location_code)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  console.log(user_locations, 'user_locations')
  console.log(user_access_locations, 'user_access_locations')
  /*================== User Location Fetch ======================*/

  const [rowData, setRowData] = useState([])
  const [shipmentRowData, setShipmentRowData] = useState([])
  const [shipmentInvoiceRowData, setShipmentInvoiceRowData] = useState([])
  const [locationData, setLocationData] = useState([])

  const [mainKey, setMainKey] = useState(1)

  const [activeKey, setActiveKey] = useState(1)
  const [truckinfo, setTruckinfo] = useState(1)
  const [activeKey_2, setActiveKey_2] = useState(1)

  const [visible, setVisible] = useState(false)
  const [saleOrders, setSaleOrders] = useState([])

  const [fetch, setFetch] = useState(false)
  const [smallfetch, setSmallFetch] = useState(false)
  const [truckHavingTS, setTruckHavingTS] = useState(true)
  const [visible1, setVisible1] = useState(false)

  /* Modal Condition to Enable for Shipment Delete */
  const [shipmentDelete, setShipmentDelete] = useState(false)

  /* Get Shipment No to Delete */
  const [shipmentToDelete, setShipmentToDelete] = useState('')

  /* Get Deleted Shipment Info */
  const [deletedShipmentInfo, setDeletedShipmentInfo] = useState([])

  /* Get Shipment Datas By Using Parking Id */
  const [shipmentAvailableData, setShipmentAvailableData] = useState(false)

  /* Get Shipment-Tripsheet No to Delete */
  const [shipmentTSToDelete, setShipmentTSToDelete] = useState('')

  const [ChildVnum, setChildVnum] = useState('')
  const [ChildVroute, setChildVroute] = useState('')
  const [errorModal, setErrorModal] = useState(false)
  const [shipmentData, setShipmentData] = useState([])
  const [shipmentRoute, setShipmentRoute] = useState('')
  const [ShipmentCreatedData, setShipmentCreatedData] = useState([])
  const [error, setError] = useState({})
  const [tsVehicleOwnFgstoHavingIssue, setTsVehicleOwnFgstoHavingIssue] = useState(false)

  /* Shipment Expire (Older than 5 Days) Check */
  const [ShipmentNotExpire, setShipmentNotExpire] = useState(true)

  /* Getting Vehicle's Tripsheet Info. From Child Component */
  const [ChildVtripinfo, setChildVtripinfo] = useState([])

  /* FOP DO not mingle in shipment (Other than party) Check */
  const [fopMixedShipment, setFopMixedShipment] = useState(false)

  const getvtripinfo = (data_need) => {

    console.log(data_need, 'getvtripinfo-dd data_need')
    console.log(deliveryinfo, 'getvtripinfo-dd deliveryinfo')
    console.log(values.shipment_info, 'getvtripinfo-dd values.shipment_info')

    /* ====================  FOP Mixed Shipment Check Part Start ==================== */

    // Reverse: string → object
    const parsed = JSON.parse(values.shipment_info)
    console.log(parsed, 'getvtripinfo-dd parsed')
    let fop_mixed_shipment = false
    let party_vehicle_type = 0

    parsed.map((data, index) => {
      if (data.IncoTerm == 'FOP') {
        fop_mixed_shipment = true
      }
    })

    if (data_need && data_need.length > 0) {
      party_vehicle_type = data_need[0].vehicle_type_id.id
    } else {
      party_vehicle_type = 0
    }
    console.log(party_vehicle_type, 'getvtripinfo-dd party_vehicle_type')
    if (fop_mixed_shipment && !(party_vehicle_type == 0 || party_vehicle_type == 4)) {
      setFopMixedShipment(true)
      console.log(party_vehicle_type, 'getvtripinfo-dd TRUE')
    } else {
      setFopMixedShipment(false)
      console.log(party_vehicle_type, 'getvtripinfo-dd FALSE')
    }

    /* ====================  FOP Mixed Shipment Check Part End ==================== */
    console.log(parsed, 'getvtripinfo-dd parsed')

    setChildVtripinfo(data_need)

    let vehtype = data_need.length > 0 && data_need[0] && data_need[0].vehicle_type_id && data_need[0].vehicle_type_id.id ? data_need[0].vehicle_type_id.id : ''
    console.log(vehtype,'getvtripinfo-shipment creation nlfd - vehtype')
    if(vehtype == 3){
      if(data_need.length > 0 && data_need[0] && data_need[0].trip_sheet_info && data_need[0].trip_sheet_info.created_date){
        let start_date = data_need[0].trip_sheet_info.created_date
        let condition = JavascriptGivenDateValidation(start_date,1,6)
        if(condition){
          setShipmentNotExpire(true)
        } else {
          setShipmentNotExpire(false)
        }
      } else {
        setShipmentNotExpire(true)
      }
    } else {
      setShipmentNotExpire(true)
    }
    
  }

  /* Getting Vehicle Number From Child Component */
  const getvnum = (data_need) => {
    setChildVnum(data_need)
  }

  /* Getting Own Vehicle FGSTO Info From Child Component */
  const getFgstoData = (data_need) => {
    setTsVehicleOwnFgstoHavingIssue(data_need)
  }

  /* Getting Vehicle Route From Child Component */
  const getvroute = (data_need) => {
    setChildVroute(data_need)
  }

  const [deliveryinfo, setDeliveryInfo] = useState({
    delivery_orders: [],
    response: [],
  })

  const formValues = {
    parking_id: '',
    vehicle_id: '',
    driver_id: '',
    tripsheet_id: '',
    tripsheet_no: '',
    assigned_by: '',
    // shipment_no: '',
    shipment_route: '',
    // shipment_status: '',
    vehicle_number: '',
    vehicle_type_id: '',
    vehicle_others_type: '',
    vehicle_location_id: '',
    vehicle_capacity_id: '',
    driver_name: '',
    driver_number: '',
    shipment_info: '',
    remarks: '',
  }
    const purpose_array = ['FG_SALES','FG_STO','RM_STO','OTHERS']
    const division_array = ['NLFD','NLCD']
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
  const assign_delivery = (e) => {
    // Destructuring
    const { value, checked } = e.target
    const { delivery_orders } = deliveryinfo

    // Case 1 : The user checks the box
    if (checked) {
      setDeliveryInfo({
        delivery_orders: [...delivery_orders, value],
        response: [...delivery_orders, value],
      })
    }

    // Case 2 : The user unchecks the box
    else {
      setDeliveryInfo({
        delivery_orders: delivery_orders.filter((e) => e !== value),
        response: delivery_orders.filter((e) => e !== value),
      })
    }
    console.log(deliveryinfo.response)
  }
  const [currentDeliveryId, setCurrentDeliveryId] = useState('')

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Number',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Number',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Date',
      selector: (row) => row.Tripsheet_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment Number',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment Date',
      selector: (row) => row.Shipment_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.Shipment_User,
      sortable: true,
      center: true,
    },
    {
      name: 'PGI Status',
      selector: (row) => row.PGI_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      // sortable: true,
      center: true,
    },
  ]

  const columns_invoice = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Number',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Number',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Date',
      selector: (row) => row.Tripsheet_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment Number',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment Date',
      selector: (row) => row.Shipment_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.Shipment_User,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'PGI Status',
    //   selector: (row) => row.PGI_Status,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Action',
      selector: (row) => row.Action,
      // sortable: true,
      center: true,
    },
  ]

  const [assignTruckErrorModal, setAssignTruckErrorModal] = useState(false)
  const [assignTruckModal, setAssignTruckModal] = useState(false)
  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    login,
    validate,
    formValues
  )

  function login() {
    alert('No Errors CallBack Called')
  }

  function removeDuplicates(arr) {
    return arr.filter((item,index) => arr.indexOf(item) === index);
  }

  function checkModalDisplay() {
    console.log(rowData)
    console.log(deliveryinfo)
    var del_orders_array = deliveryinfo.delivery_orders
    console.log(del_orders_array)
    var shipment_details1 = []
    var shipment_details2 = []
    var shipment_delivery_plant_array = []

    /* Create Shipment JSON String for DB Update */
    /*========(Start)================================================================================*/

    del_orders_array.map((value_item1, key_item1) => {
      console.log(value_item1)
      rowData.map((value_item, key_item) => {
        if (value_item1 == value_item.DeliveryOrderNumber) {
          value_item['delivery_sequence'] = key_item1 + 1
          shipment_details2.push(value_item)
          shipment_delivery_plant_array.push(value_item['DeliveryPlant'])
        }
      })
    })

    // console.log(shipment_details1)
    console.log(shipment_details2,'shipment_details2')

    /* === Restriction for clubbing the different plant deliveries in the Shipment Creation Process Start === */
    console.log(shipment_delivery_plant_array,'shipment_delivery_plant_array')

    let updated_shipment_delivery_plant_array = removeDuplicates(shipment_delivery_plant_array)
    console.log(updated_shipment_delivery_plant_array,'updated_shipment_delivery_plant_array')

    if(updated_shipment_delivery_plant_array.length > 1){
      toast.warning('Deliveries from different delivery plants cannot be allowed to create shipment...!')
      return false
    }

    /* === Restriction for clubbing the different plant deliveries in the Shipment Creation Process End === */

    if (shipment_details2.length > 0) {
      let shipment_route = shipment_details2[shipment_details2.length - 1].CustomerRoute
      console.log(shipment_route)
      setShipmentRoute(shipment_route)
    } else {
      setShipmentRoute('')
    }

    setShipmentData(shipment_details2)
    values.shipment_info = JSON.stringify(shipment_details2)

    /*=========(End)=================================================================================*/

    if (Object.keys(deliveryinfo.response).length > 0) {
      setAssignTruckModal(true)
      // setAssignTruckErrorModal(false)
    } else {
      toast.warning('Please Choose Atleast One Delivery Order for Shipment Creation !')
      setAssignTruckModal(false)
      // setAssignTruckErrorModal(true)
    }
  }

  /* Display The Delivery Plant Name via Given Delivery Plant Code */
  const getLocationNameByCode = (code) => {
    // console.log(code)
    // console.log(locationData)
    let filtered_location_data = locationData.filter((c, index) => {
      if (c.location_code == code) {
        return true
      }
    })
    // console.log(filtered_location_data)
    let locationName = filtered_location_data[0] ? filtered_location_data[0].Location : 'Loading..'
    return locationName
  }

    /* Shipment Delete Process */
    const deleteShipment = () => {
        /* Tripsheet Info SAP Service */
        setFetch(true)
      console.log(shipmentRowData,"shipmentRowData")
      console.log(shipmentToDelete,"shipmentToDelete")
      console.log(shipmentTSToDelete,"shipmentTSToDelete")
      console.log(deletedShipmentInfo,"deletedShipmentInfo")
      var vehicleType = ''
      
      /* Depo Party Locations 2-Trichy, 3-Chennai, 4-Kanyakumari, 5-Madurai */
      var depo_party_location_array = [2,3,4,5,13,14,15,16,18,20]

      /* Foods Party Locations 1-Dindigul, 6-Aruppukotai */
      var foods_party_location_array = [1,6,12,17,19]

      if (deletedShipmentInfo.vehicle_type_id == '1') {
        vehicleType = 'OWN'
      } else if (deletedShipmentInfo.vehicle_type_id == '2') {
        vehicleType = 'CONTRACT'
      } else if (deletedShipmentInfo.vehicle_type_id == '3') {
        vehicleType = 'HIRE'
      } else {
        if(deletedShipmentInfo.vehicle_type_id == '4' && deletedShipmentInfo.vehicle_others_type == '2'){
          vehicleType = 'D2R'
        } else if(inArray(values.vehicle_location_id,depo_party_location_array)){
          vehicleType = 'DEPO_PARTY'
        } else if(inArray(values.vehicle_location_id,foods_party_location_array)){
          vehicleType = 'FOODS_PARTY'
        } else {
          vehicleType = 'PARTY'
        }       
      }
    console.log(shipmentAvailableData,'shipmentAvailableData')
    let ship_parent_not_having = shipmentAvailableData.length == 0

    console.log(ship_parent_not_having,'ship_parent_not_having')
      // return false

      // alert(shipmentToDelete + shipmentTSToDelete)
    if (deletedShipmentInfo.vehicle_type_id != '4' && ship_parent_not_having && (deletedShipmentInfo.trip_sheet_info.sap_flag == '1' || deletedShipmentInfo.trip_sheet_info.sap_flag == '2')) {

        let SAPData = new FormData()
        SAPData.append('TRIP_SHEET', deletedShipmentInfo.trip_sheet_info.trip_sheet_no)
        SAPData.append('VEHICLE_NO', deletedShipmentInfo.vehicle_number)
        SAPData.append('VEHICLE_TYPE',vehicleType)
        SAPData.append('DRIVER_NAME', deletedShipmentInfo.driver_name)
        SAPData.append('DRIVER_CODE', deletedShipmentInfo.driver_id)
        SAPData.append('DRIVER_PH_NO', deletedShipmentInfo.driver_number)
        SAPData.append('Purpose', purpose_array[deletedShipmentInfo.trip_sheet_info.purpose-1])
        // SAPData.append('Division', division_array[deletedShipmentInfo.trip_sheet_info.to_divison-1])
        SAPData.append('Division', deletedShipmentInfo.trip_sheet_info.purpose == 3 ? 'NLFD':  (deletedShipmentInfo.trip_sheet_info.purpose == 4 ? '' : division_array[deletedShipmentInfo.trip_sheet_info.to_divison-1]))
        SAPData.append('Stop_Flag', '4')
        // SAPData.append('Purpose', purpose_array[singleVehicleInfo.advance_info.purpose - 1])

        TripSheetInfoService.StartTSInfoToSAP(SAPData).then((response) => {
          console.log(response.data[0], 'StopTSInfoToSAP')
          if(response.data[0].STATUS=='2')
          {
            setFetch(true)
            toast.error(response.data[0].TRIP_SHEET +' - '+response.data[0].MESSAGE+' Kindly Contact Admin!')
            return false
          }
          else if(response.data[0].STATUS!='1')
          {
            setFetch(true)
            toast.error("Shipment can't be deleted due to some reasons. Kindly Contact Admin!")
            return false
          }

          const formDataForSAPShipmentDelete = new FormData()
          formDataForSAPShipmentDelete.append('shipment_no', shipmentToDelete)
          formDataForSAPShipmentDelete.append('trip_sheet', shipmentTSToDelete)
          // formDataForSAPShipmentDelete.append('sap_flag','0')
          VehicleAssignmentSapService.deleteShipment(formDataForSAPShipmentDelete).then((res) => {
            console.log(res)
            let sap_shipment_no = res.data.SHIPMENT_NO
            let sap_shipment_status = res.data.STATUS
            let sap_ts_shipment = res.data.TRIP_SHEET

            console.log(sap_shipment_no + '/' + sap_shipment_status + '/' + sap_ts_shipment)

            if (sap_shipment_status == '1' && res.status == 200 && sap_shipment_no && sap_ts_shipment) {

              VehicleAssignmentService.deleteShipmentOrder(shipmentToDelete).then((res) => {
                  setFetch(true)
                  if (res.status == 204) {
                    toast.success('Shipment Deleted Successfully!')
                    navigation('/Dashboard')
                  } else {
                    toast.warning('Shipment Cannot Be Deleted From LP.. Kindly Contact Admin!')
                    setFetch(true)
                    setTimeout(() => {
                     // window.location.reload(false)
                      }, 1000)
                    }
              })
                .catch((error) => {
                  setFetch(true)
                  for (let value of formDataForSAPShipmentDelete.values()) {
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
                toast.warning('Shipment Cannot Be Deleted From SAP.. Kindly Contact Admin!')
                setFetch(true)
                setTimeout(() => {
                  // window.location.reload(false)
                }, 1000)
              }
          })
          .catch((error) => {
            setFetch(true)
            for (let value of formDataForSAPShipmentDelete.values()) {
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
        })

    } else {

    const formDataForSAPShipmentDelete = new FormData()
    formDataForSAPShipmentDelete.append('shipment_no', shipmentToDelete)
    formDataForSAPShipmentDelete.append('trip_sheet', shipmentTSToDelete)
    VehicleAssignmentSapService.deleteShipment(formDataForSAPShipmentDelete)
      .then((res) => {
        let sap_shipment_no = res.data.SHIPMENT_NO
        let sap_shipment_status = res.data.STATUS
        let sap_ts_shipment = res.data.TRIP_SHEET

        console.log(sap_shipment_no + '/' + sap_shipment_status + '/' + sap_ts_shipment)

        if (sap_shipment_status == '1' && res.status == 200 && sap_shipment_no && sap_ts_shipment) {
          VehicleAssignmentService.deleteShipmentOrder(shipmentToDelete)
            .then((res) => {
              setFetch(true)
              if (res.status == 204) {
                toast.success('Shipment Deleted Successfully!')
                navigation('/Dashboard')
              } else {
                toast.warning('Shipment Cannot Be Deleted From LP.. Kindly Contact Admin!')
                setFetch(true)
                setTimeout(() => {
                  window.location.reload(false)
                }, 1000)
              }
            })
            .catch((error) => {
              setFetch(true)
              for (let value of formDataForSAPShipmentDelete.values()) {
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
          toast.warning('Shipment Cannot Be Deleted From SAP.. Kindly Contact Admin!')
          setFetch(true)
          setTimeout(() => {
            window.location.reload(false)
          }, 1000)
        }
      })
      .catch((error) => {
        setFetch(true)
        for (let value of formDataForSAPShipmentDelete.values()) {
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
    }
  }

  /* Date Format Change : yyyy-mm-dd to dd-mm-yy */
  const formatDate = (input) => {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2]

    return day + '-' + month + '-' + year
  }

  const pgiUpdateInDb = (json_data) => {
    // console.log(json_data)
    VehicleAssignmentService.updatePgiInfoToDb(json_data).then((res) => {
      console.log(res)
    })
  }

  const deliveryQuantityUpdateInDb = (json_data) => {
    // console.log(json_data)
    VehicleAssignmentService.updateDeliveryQuantityInfoToDb(json_data).then((res) => {
      console.log(res)
    })
  }

   /* ---- Export to Excel ---- */
  const exportToCSV = () => {
    if (!rowData || rowData.length === 0) {
      toast.warning('No data to export!')
      return
    }
    // Flatten JSX cells for export and return all original columns
    const exportData = rowData.map((row,key) => ({
      'S.No': (key) + 1,
      'Customer Route': row.CustomerRoute,
      'Delivery Plant': row.DeliveryPlant,  
      'Delivery Order Number': row.DeliveryOrderNumber,
      'Delivery Order Date': formatDate(row.DeliveryOrderDate),
      'Delivery Qty': row.DeliveryQty,
      'Delivery Net Qty.': row.DeliveryNetQty,
      'TL NAME': row.TL_NAME, 
      'Inco-Term': row.IncoTerm,
      'CFR Freight Have':  (row.IncoTerm == 'CFR' && row.freightHave == 1) ? 'Having' : (row.IncoTerm == 'CFR' && row.freightHave != 1 ? 'Not Having' : '-'),
      'Customer Code': row.CustomerCode,
      'Customer Name': row.CustomerName,
      'Customer City': row.CustomerCity,
      'Sale Order Number': row.SaleOrderNumber,
      'Sale Order Date': formatDate(row.SaleOrderDate),
      'Sale Order Qty': row.SaleOrderQty,
      'freight Per Ton': row.freightPerTon,
      'Delivery Truck': row.DeliveryTruck,
      'Customer Type 1': row.CustomerType,
      'Customer Type 2': row.CustomerType2,           
    }))

    const dateTimeString = GetDateTimeFormat(1)
    const fileName = 'OPEN DELIVERIES REPORT_' + dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(blob, fileName + '.xlsx')
  }

  const secondWeightUpdateInDb = (json_data) => {
    // console.log(json_data)
    VehicleAssignmentService.updateSecondWeightInfoToDb(json_data).then((res) => {
      console.log(res)
    })
  }

  const inArray = (plant, plants) => {
    var length = plants.length
    for (var i = 0; i < length; i++) {
      if (plants[i] == plant) return true
    }
    return false
  }

  const loadSaleOrderInfoTable = () => {
    var del_order = []

    var delivery_orders_array = {}

    console.log(saleOrders)

    // Converting the Delivery Details into Delivery Orders
    // =================================================================================================

    const obj = Object.entries(saleOrders)

    obj.forEach(([key_st, value]) => {
      let lineItem = value.LINE_ITEM
      // console.log(key_st)
      // console.log(value)

    //   if (inArray(value.WERKS, user_access_locations)) {
        // if (value.WERKS != '9290' && inArray(value.WERKS, user_access_locations) && inArray(value.INCO1,user_inco_terms)) {
        if (!inArray(value.WERKS, nlcdPlantsArrayData) && inArray(value.WERKS, user_access_locations) && inArray(value.INCO1,user_inco_terms)) {
        // if (value.WERKS == '1009') {
        del_order.push({
          sno: (key_st % 10) + 1,
          SaleOrderNumber: value.VBELN,
          SaleOrderDate: value.ERDAT,
          SaleOrderQty: value.SO_QTY,
          DeliveryOrderNumber: value.VBELN2,
          TL_NAME: value.TL_NAME,
          // DeliveryOrderDate: value.WADAT_IST,
          DeliveryOrderDate: value.BLDAT,
          CustomerName: value.NAME1,
          CustomerType: value.TXT30,
          CustomerCode: value.KUNNR,
          CustomerCity: value.ORT01,
          freightHave: value.FRE_HAVE,
          freightPerTon: value.FRE_PER_TON,
          CustomerType2: value.CUS_TYPE,
          DeliveryTruck: value.TRUCKNO,
          CustomerRoute: value.ROUTE,
          DeliveryQty: value.TOT_DEL_MTS,
          DeliveryNetQty: value.TOT_NET_MTS,
          DeliveryItems: value.LINE_ITEM,
          DeliveryPlant: value.WERKS,
          IncoTerm: value.INCO1,
        })
      }
    })

    // Conversion completed
    // =================================================================================================

    var all_del_no = []
    var glo = 0
    console.log(del_order)
    let filtered_del_order = del_order.filter((c, index) => {
      if (!all_del_no.includes(c.DeliveryOrderNumber)) {
        c.sno = glo + 1
        all_del_no.push(c.DeliveryOrderNumber)
        glo++
        return true
      }
    })

    // console.log(saleOrders)
    // console.log(del_order)
    // console.log(filtered_del_order)
    // setRowData(filtered_del_order)

    setRowData(del_order)
    // setFetch(true)
  }

  useEffect(() => {
    /* section for getting Sale Order Details from SAP */
    VehicleAssignmentSapService.getSaleOrders()
      .then((res) => {
        // console.log(res.data)

        setSaleOrders(res.data)
        setFetch(true)
        setSmallFetch(true)
        // loadSaleOrderInfoTable()
      }) 
    .catch((error) => {
      setFetch(true)
      Swal.fire({
        title: 'Server Connection Failed. Kindly contact Admin.!',
        // text:  error.response.data.message,
        text:  error.message,
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
        // window.location.reload(false)
      })       
      // .catch((err) => {
      //   setFetch(true)
      //   console.log(err)
    })

    /* section for getting PGI Info Details from SAP */
    VehicleAssignmentSapService.getPGIInfoData()
      .then((res) => {
        console.log(res.data)
        let response_info = res.data
        if (response_info.length > 0) {
          pgiUpdateInDb(JSON.stringify(response_info))
        } else {
          console.log('Nothing to Update PGI Info')
        }
      })
      .catch((err) => {
        console.log(err)
      })

    /* section for getting Delivery Quantity update Details from SAP */
    VehicleAssignmentSapService.getDeliveryQuantityInfoData()
      .then((res) => {
        console.log(res.data)
        let response_info = res.data
        if (response_info.length > 0) {
          deliveryQuantityUpdateInDb(JSON.stringify(response_info))
        } else {
          console.log('Nothing to Update Delivery Quantity Info')
        }
      })
      .catch((err) => {
        console.log(err)
      })

    /* section for getting 2nd Weight Info Details from SAP */
    VehicleAssignmentSapService.getSecondWeightInfoData()
      .then((res) => {
        console.log(res.data)
        let response_info = res.data
        if (response_info.length > 0) {
          secondWeightUpdateInDb(JSON.stringify(response_info))
        } else {
          console.log('Nothing to Update 2nd Weight Info')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])


  // ============================ Missing Shipment Updation Part Start ASK1 ====================== //

  const columns_missing_Shipments = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Number',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Number',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Shipment Number',
      selector: (row) => row.Shipment_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      // sortable: true,
      center: true,
    },
  ]

  /* Missing Shipment Delete Process */
  const deleteMissingShipment = () => {
    setFetch(true)
    console.log(shipmentToDelete,"shipmentToDelete")
    console.log(shipmentTSToDelete,"shipmentTSToDelete")

    const formDataForSAPShipmentDelete = new FormData()
    formDataForSAPShipmentDelete.append('shipment_no', shipmentToDelete)
    formDataForSAPShipmentDelete.append('trip_sheet', shipmentTSToDelete)
    VehicleAssignmentSapService.deleteShipment(formDataForSAPShipmentDelete).then((res) => {
      console.log(res)
      let sap_shipment_no = res.data.SHIPMENT_NO
      let sap_shipment_status = res.data.STATUS
      let sap_ts_shipment = res.data.TRIP_SHEET

      console.log(sap_shipment_no + '/' + sap_shipment_status + '/' + sap_ts_shipment)

      if (sap_shipment_status == '1' && res.status == 200 && sap_shipment_no && sap_ts_shipment) {
        setFetch(true)
        toast.success('Missing Shipment Deleted Successfully!')
        navigation('/Dashboard')
      } else {
        toast.warning('Missing Shipment Cannot Be Deleted From SAP.. Kindly Contact Admin!')
        setFetch(true)
      }
    })
    .catch((error) => {
      setFetch(true)
      for (let value of formDataForSAPShipmentDelete.values()) {
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
  }

  const[shipmentRemarks,setShipmentRemarks] = useState('')
  const[shipmentPgiStatus,setShipmentPgiStatus] = useState(0)
  const[msuId,setMsuId] = useState(0)
  const[missingShipmentRoute,setMissingShipmentRoute] = useState(0)
  const[foodsRouteData, setFoodsRouteData] = useState([])
  const[msSaleOrders, setMsSaleOrders] = useState([])
  const [msRowData, setMsRowData] = useState([])
  const[msuSubmitEnable, setMsuSubmitEnable] = useState(false)
  const[shipmentHaving, setShipmentHaving] = useState(false)
  const [missingRowData, setMissingRowData] = useState([])
  const [missingShipmentRowData, setMissingShipmentRowData] = useState([])

  /* Set Missing Shipment Delete */
  const [missingShipmentDelete, setMissingShipmentDelete] = useState(false)
  const [msuModalEnable, setMsuModalEnable] = useState(false)

  const display_modal_values = (type) => {
    let needed_data = ''
    let current_ms_data = ''
    missingShipmentRowData.map((vh,kh)=>{
      if(msuId == vh.S_NO){
        current_ms_data = vh
      }
    })
    if(current_ms_data != ''){
      if(type == 1){
        needed_data = current_ms_data.VEHICLE
      } else if(type == 2){
        needed_data = current_ms_data.TRIPSHEET
      } else if(type == 3){
        needed_data = current_ms_data.SHIPMENT
      } else if(type == 4){
        needed_data = current_ms_data.pyg_resource
      }
    }
    return needed_data
  }

  useEffect(() => {

    /* section for getting Foods Routes List Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(1).then((response) => {
      console.log(response.data.data,'setFoodsRouteData')
      setFoodsRouteData(response.data.data)
    })

  }, [])

  // GET Shipment DETAILS FROM SAP
  const getShipmentData = (shipmentNo) => {
    console.log(shipmentNo,'shipmentNo')
    let data = new FormData()
    data.append('TKNUM', shipmentNo)
    data.append('PGI_STATUS', shipmentPgiStatus)
    // data.append('HSN_SAC', hsnCode)
    setSmallFetch(false)
    VehicleAssignmentSapService.getShipmentInfoForUpdation(data).then((res) => {

      console.log(res,'getShipmentInfoForUpdation')

      if (res.status == 200 && res.data != '' && res.data != '\n') {
        setSmallFetch(true)
        setShipmentHaving(true)
        setMsSaleOrders(res.data)
        toast.success('Shipment Details Detected!')
      } else {
        setSmallFetch(true)
        setShipmentHaving(false)
        setMsSaleOrders([])
        if (res.status == 201 && (res.data.status == '1' ||res.data.status == '2')) {
          toast.warning(res.data.message)
        } else {
          setSmallFetch(true)
          toast.warning('Tripsheet Details cannot be detected from LP!')
        }
      }
    })
  }

  const loadMSSaleOrderInfoTable = () => {
    var del_order = []

    console.log(msSaleOrders,'msSaleOrders')

    // Converting the Delivery Details into Delivery Orders
    // =================================================================================================

    const obj = Object.entries(msSaleOrders)

    obj.forEach(([key_st, value]) => {
      let lineItem = value.LINE_ITEM

      del_order.push({
        sno: (key_st % 10) + 1,
        SaleOrderNumber: value.VBELN,
        SaleOrderDate: value.ERDAT,
        SaleOrderQty: value.SO_QTY,
        DeliveryOrderNumber: value.VBELN2,
        TL_NAME: value.TL_NAME,
        DeliveryOrderDate: value.BLDAT,
        CustomerName: value.NAME1,
        CustomerType: value.TXT30,
        CustomerCode: value.KUNNR,
        CustomerCity: value.ORT01,
        freightHave: value.FRE_HAVE,
        freightPerTon: value.FRE_PER_TON,
        CustomerType2: value.CUS_TYPE,
        DeliveryTruck: value.TRUCKNO,
        CustomerRoute: value.ROUTE,
        DeliveryQty: value.TOT_DEL_MTS,
        DeliveryNetQty: value.TOT_NET_MTS,
        DeliveryItems: value.LINE_ITEM,
        DeliveryPlant: value.WERKS,
        IncoTerm: value.INCO1,
      })

    })

    // Conversion completed
    // =================================================================================================

    var all_del_no = []
    var glo = 0
    console.log(del_order)
    let filtered_del_order = del_order.filter((c, index) => {
      if (!all_del_no.includes(c.DeliveryOrderNumber)) {
        c.sno = glo + 1
        all_del_no.push(c.DeliveryOrderNumber)
        glo++
        return true
      }
    })

    setMsRowData(del_order)
  }

  useEffect(() => {
    loadMSSaleOrderInfoTable()
  }, [fetch,msSaleOrders])

  const remarksHandleChange = (event,type) => {

    let result = event.target.value
    if(type == 1){ // Remarks
      let result1 = result.toUpperCase()
      setShipmentRemarks(result1.trimStart())
    } else if(type == 2){
      setShipmentPgiStatus(result) // Pgi Completion
    } else if(type == 3){
      setMissingShipmentRoute(result) // Route
    }

    if(type == 3 && result == 0){
      setMsuSubmitEnable(false)
    } else if(missingShipmentRoute != 0 || type == 3 && result != 0) {
      setMsuSubmitEnable(true)
    } else {
      setMsuSubmitEnable(false)
    }

  }

  /* Missing Shipment Updation Process */
  const TripsheetShipmentUpdate = () => {

    let tripHirePaymentData = display_modal_values(4)
    setFetch(false)

    console.log('-------------------tripHirePaymentData---------------------------')
    console.log(tripHirePaymentData)
    console.log('-------------------Tripsheet No---------------------------')
    console.log(tripHirePaymentData.trip_sheet_info.trip_sheet_no)
    console.log('-------------------Vehicle No---------------------------')
    console.log(tripHirePaymentData.vehicle_number)

    var missing_shipment_details = []

    /* Create Shipment JSON String for DB Update */
    /*========(Start)================================================================================*/

      msRowData.map((value_item, key_item) => {
        value_item['delivery_sequence'] = key_item + 1
        missing_shipment_details.push(value_item)
      })


    // console.log(shipment_details1)
    console.log(missing_shipment_details)

    setShipmentData(missing_shipment_details)
    let shipment_info = JSON.stringify(missing_shipment_details)
    console.log(shipment_info,'shipment_info')

    /* Get Total Shipment Quantity By Adding each Delivery Quantity */
    var totalShipmentQuantity = 0
    var totalShipmentNetQuantity = 0
    var totalShipmentQuantityRounded = 0
    var totalShipmentNetQuantityRounded = 0
    missing_shipment_details.map((val, key) => {
      totalShipmentQuantity = totalShipmentQuantity + val.DeliveryQty
      totalShipmentNetQuantity = totalShipmentNetQuantity + val.DeliveryNetQty
    })


    totalShipmentQuantityRounded = parseFloat(totalShipmentQuantity).toFixed(2)
    totalShipmentNetQuantityRounded = parseFloat(totalShipmentNetQuantity).toFixed(2)

    console.log(totalShipmentQuantityRounded,'totalShipmentQuantityRounded')
    console.log(totalShipmentNetQuantityRounded,'totalShipmentNetQuantityRounded')

    /*=========(End)=================================================================================*/

    const formData = new FormData()
    formData.append('parking_id', tripHirePaymentData.parking_yard_gate_id)
    formData.append('vehicle_id', tripHirePaymentData.vehicle_id)
    formData.append('driver_id', tripHirePaymentData.driver_id)
    formData.append('driver_name', tripHirePaymentData.driver_name)
    formData.append('driver_number', tripHirePaymentData.driver_contact_number)
    formData.append('remarks', shipmentRemarks == '' ? null : shipmentRemarks)
    formData.append('created_by', user_id)
    formData.append('shipment_info', shipment_info)
    formData.append('shipment_no', display_modal_values(3))
    formData.append('transport_plant', 'FD00')
    formData.append('shipment_qty', totalShipmentQuantityRounded)
    formData.append('shipment_net_qty', totalShipmentNetQuantityRounded)
    formData.append('shipment_route', missingShipmentRoute)
    formData.append('tripsheet_id', tripHirePaymentData.tripsheet_sheet_id)
    formData.append('assigned_by', 1)
    formData.append('tripsheet_no', tripHirePaymentData.trip_sheet_info.trip_sheet_no)
    formData.append('vehicle_capacity_id', tripHirePaymentData.vehicle_type_id_new)
    formData.append('vehicle_location_id', tripHirePaymentData.vehicle_location_id)
    formData.append('vehicle_number', tripHirePaymentData.vehicle_number)
    formData.append('vehicle_type_id', tripHirePaymentData.vehicle_type_id_new)

    if(shipmentPgiStatus == 1){
      formData.append('shipment_status', 3)
      formData.append('shipment_pgi_status', 1)
    }

    VehicleAssignmentService.insertShipmentOrder(formData).then((res)=>{
      console.log(res,'insertShipmentOrder')
      setFetch(true)
      if (res.status == 200) {
        Swal.fire({
          title: 'Shipment Updated Successfully!',
          icon: "success",
          text:  'Shipment No : ' + display_modal_values(3),
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
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
        toast.warning('Manual Shipment Insertion Failed. Kindly contact Admin..!')
      }
    })
    .catch((error) => {
      setFetch(true)
      console.log(error)
      var object = error.response.data.errors
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      }
      setError(output)
      setErrorModal(true)
    })

  }

  // ============================ Missing Shipment Updation Part End ASK2 ====================== //

  useEffect(() => {
    loadShipmentViewTable()
  }, [])

  const cusFreightChecker = (data, type) => {
    console.log(data, 'cusFreightChecker-data')
    if (type == 1) { /* 1 - Set Customer Name Color based on the conditions */
      if (data.IncoTerm == 'CFR') {
        return data.freightHave == '1' ? 'black' : 'red'
      } else if (data.IncoTerm == 'FOB' || data.IncoTerm == 'CIF' || data.IncoTerm == 'NFR') {

        let customerData = tripShipmentCustomerData.filter((dataname) => dataname.customer_status == 1 && dataname.customer_code == data.CustomerCode)
        console.log(data.CustomerCode, 'cusFreightChecker-data.customer_code ')
        console.log(tripShipmentCustomerData, 'cusFreightChecker-tripShipmentCustomerData ')
        console.log(customerData, 'cusFreightChecker-customerData')
        console.log(Array.isArray(customerData), 'cusFreightChecker-customerData123')
        console.log(customerData.length > 0, 'cusFreightChecker-customerData456')
        console.log(customerData.freight_info, 'cusFreightChecker-customerData789')

        if (Array.isArray(customerData) && customerData.length > 0) {

          let freightInfo = customerData[0].freight_info
          console.log(freightInfo, 'cusFreightChecker-freightInfo')

          if(freightInfo && freightInfo.length > 0){
            return 'black'
          }

          return 'blue'
        } else {
          return 'red'
        }

      } else {
        return 'black'
      }
    } else { /* 2 - Allow delivery cubbing based on the conditions */
      if (data.IncoTerm == 'CFR') {
        return data.freightHave == '1' ? 2 : 1
      } else if (data.IncoTerm == 'FOB' || data.IncoTerm == 'CIF' || data.IncoTerm == 'NFR') {
        let customerData = tripShipmentCustomerData.filter((dataname) => dataname.customer_code == data.CustomerCode)
        if (Array.isArray(customerData) && customerData.length > 0) {

          let freightInfo = customerData[0].freight_info
          console.log(freightInfo, 'cusFreightChecker-freightInfo')

          if(freightInfo && freightInfo.length > 0){
            return 2
          } 
          return 1
        } else {
          return 1 /* 1 - Not allow to culubbing */
        }
      } else {
        return 2 /* 2 - Allow to culubbing */
      }
    }
  }

  const invoiceCompletionCheck = (Shipment_Data) => {
    console.log(Shipment_Data,'Shipment_Data-Shipment_Data')

    const formDataForSAPInvoiceComplete = new FormData()
    formDataForSAPInvoiceComplete.append('tknum', Shipment_Data.shipment_no)
    formDataForSAPInvoiceComplete.append('tripsheet_no', Shipment_Data.trip_sheet_info.trip_sheet_no)
    formDataForSAPInvoiceComplete.append('veh_no', Shipment_Data.vehicle_number)
    formDataForSAPInvoiceComplete.append('del_count', Shipment_Data.shipment_child_info.length)

    VehicleAssignmentSapService.updateShipmentInvoiceCompletionCheck(formDataForSAPInvoiceComplete)
      .then((res) => {

        let sap_response = res.data
        console.log(res,'res-res-res')
        console.log(sap_response,'updateShipmentInvoiceCompletionCheck')

        if (res.status == 200) {

          if(sap_response.STATUS == 1) {

            // sap_response.updated_by = user_id
            let sap_response_data  = JSON.stringify(sap_response)
            // let sap_response_data  = JSON.parse(sap_response)
            console.log(sap_response_data,'sap_response_data')
            VehicleAssignmentService.updateSecondWeightInfoToDbData(sap_response_data).then((res) => {
              console.log(res)
              setFetch(true)
              if (res.status == 200) {
                 Swal.fire({
                  title: res.data.message,
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(function () {
                  window.location.reload(false)
                });
              } else if (res.status == 201) {
                Swal.fire({
                  icon: "warning",
                  title: "Vehicle Gate-Out Failed",
                  text: res.data.message,
                  confirmButtonText: "OK",
                }).then(function () {
                  window.location.reload(false)
                });
              } else {
                toast.warning('Something went wrong. Kindly contact Admin..!')
              }
            })
            .catch((error) => {
              console.log(error)
              setFetch(true)
              var object = error.response.data.errors
              var output = ''
              for (var property in object) {
                output += '*' + object[property] + '\n'
              }
              setError(output)
              setErrorModal(true)
            })

          } else if(sap_response.STATUS == 2 || sap_response.STATUS == 5 || sap_response.STATUS == 6 || sap_response.STATUS == 7) {
            setFetch(true)
            Swal.fire({
              title: sap_response.MESSAGE,
              icon: "warning",
              confirmButtonText: "OK",
            }).then(function () {
              window.location.reload(false)
            });
          } else if(sap_response.STATUS == 3 || sap_response.STATUS == 4) {
            setFetch(true)
            Swal.fire({
              title: sap_response.MESSAGE,
              icon: "info",
              confirmButtonText: "OK",
            }).then(function () {
              window.location.reload(false)
            });
          }
        } else {
          setFetch(true)
          toast.warning('Shipment Cannot be Approved. Kindly contact Admin..!')
        }

      })

  }

  useEffect(() => {
    if (shipmentToDelete != '') {
      VehicleAssignmentService.getSingleShipment(shipmentToDelete).then((res) => {
        console.log(res.data.data,'getSingleShipment-todelete')
        setDeletedShipmentInfo(res.data.data)

        VehicleAssignmentService.getShipmentInfoByPId(res.data.data.parking_id).then((res) => {
          console.log(res.data.data, 'VehicleAssignmentService.getShipmentInfoByPId')
          let shipment_data = res.data.data
          let fetchedData_shipment_info = shipment_data.filter((data) =>data.shipment_status == 5)
          console.log(fetchedData_shipment_info, 'fetchedData_shipment_info')
          setShipmentAvailableData(fetchedData_shipment_info)
        })
      })

    } else {
      setDeletedShipmentInfo([])
      setShipmentAvailableData([])
    }
  }, [shipmentToDelete])

  const loadShipmentViewTable = () => {
    VehicleAssignmentService.getAllShipmentOrders().then((res) => {
      // console.log(res)
      // setFetch(true)
      let tableData = res.data.data
      // console.log(res.data.data)
      let rowDataList = []
      let invoiceRowDataList = []
      const filterData = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      console.log(filterData,'filterData-getAllShipmentOrders')
      let temp = 0
      let temp_invoice = 0
      filterData.map((data, index) => {
        if (data.assigned_by == 1) {
          rowDataList.push({
            sno: temp + 1,
            Vehicle_No: data.vehicle_number,
            Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
            Tripsheet_Date: data.trip_sheet_info.created_date,
            Shipment_No: data.shipment_no,
            Shipment_Date: data.created_at,
            Shipment_User: data.shipment_user_info.emp_name,
            PGI_Status: data.shipment_pgi_status == 1 ? '✔️' : '❌',
            Action: (
              <span className="float-start" color="danger">
                <CButton className="btn btn-secondary btn-sm me-md-1">
                  <Link className="text-white" to={`ShipmentInfo/${data.shipment_no}`}>
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </Link>
                </CButton>

                <CButton
                  className="btn btn-danger btn-sm me-md-1"
                  onClick={() => {
                    setShipmentDelete(true)
                    setShipmentToDelete(data.shipment_no)
                    setShipmentTSToDelete(data.trip_sheet_info.trip_sheet_no)
                  }}
                  disabled={data.shipment_pgi_status == 1}
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </CButton>
              </span>
            ),
          })
          temp++
        }

        if (data.assigned_by == 1 && data.shipment_pgi_status == 1) {
          invoiceRowDataList.push({
            sno: temp_invoice + 1,
            Vehicle_No: data.vehicle_number,
            Tripsheet_No: data.trip_sheet_info.trip_sheet_no,
            Tripsheet_Date: data.trip_sheet_info.created_date,
            Shipment_No: data.shipment_no,
            Shipment_Date: data.created_at,
            Shipment_User: data.shipment_user_info.emp_name,
            PGI_Status: data.shipment_pgi_status == 1 ? '✔️' : '❌',
            Action: (
              <span className="float-start" color="danger">
                <CButton
                  className="btn btn-danger btn-sm me-md-1"
                  onClick={() => {
                    setFetch(false)
                    invoiceCompletionCheck(data)
                  }}
                >
                  <i className="fa fa-check-square" aria-hidden="true"></i>
                </CButton>
              </span>
            ),
          })
          temp_invoice++
        }
      })
      setShipmentRowData(rowDataList)
      setShipmentInvoiceRowData(invoiceRowDataList)
      // setRowData(rowDataList)
    })

    VehicleAssignmentService.getMissingShipmentOrders().then((res) => {
      // setFetch(true)
      let missingData = res.data
      console.log(missingData,'getMissingShipmentOrders')
      let rowSDataList = []
      const filterSData = missingData.filter(
        (data) => user_locations.indexOf(data.pyg_resource.vehicle_location_id) != -1 && data.pyg_resource.trip_sheet_info.to_divison != 2
      )
      setMissingShipmentRowData(filterSData)
      console.log(filterSData,'filterData-getMissingShipmentOrders')
      let tempS = 0
      filterSData.map((data, index) => {
        rowSDataList.push({
          sno: tempS + 1,
          Vehicle_No: data.VEHICLE,
          Tripsheet_No: data.TRIPSHEET,
          Shipment_No: data.SHIPMENT,
          Action: (
            <span className="float-start" color="danger">
              <CButton
                className="btn btn-success btn-sm me-md-1"
                onClick={() => {
                  setMsuModalEnable(true)
                  setSmallFetch(true)
                  setMsuId(data.S_NO)
                }}
              >
                <i color='black' className="fa fa-check-square-o" aria-hidden="true"></i>
              </CButton>

              <CButton
                className="btn btn-danger btn-sm me-md-1"
                onClick={() => {
                  setShipmentDelete(true)
                  setShipmentToDelete(data.SHIPMENT)
                  setShipmentTSToDelete(data.TRIPSHEET)
                  setMissingShipmentDelete(true)
                }}
              >
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
            </span>
          ),
        })
        tempS++
      })
      setMissingRowData(rowSDataList)
    })
  }

  useEffect(() => {
    LocationApi.getLocation().then((response) => {
      let viewData = response.data.data
      // let rowDataList = []
      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          Location: data.location,
          location_code: data.location_code,
        })
      })
      setLocationData(rowDataList_location)
    })
  }, [])

  useEffect(() => {
    loadSaleOrderInfoTable()
    // setFetch(true)
    if (values.vehicle_number == '') {
      console.log('vehicle_no')
    } else {
      console.log('vehicle_yes')
    }
  }, [fetch])

  function createShipment() {
    console.log(values)
    console.log(shipmentData,'createShipment-shipmentData')
    console.log(tsVehicleOwnFgstoHavingIssue,'createShipment-tsVehicleOwnFgstoHavingIssue')
    console.log('++++++++++++++++++++++++++(( === 1 ===))+++++++++++++++++++++++++++')
    if(tsVehicleOwnFgstoHavingIssue){
      console.log('++++++++++++++++++++++++++(( === 2 ===))+++++++++++++++++++++++++++')
      toast.warning('Cannot make Shipment Creation for the Own Vehicle New FGSTO Tripsheet. Kindly contact admin..!')
      setFetch(true)
      return false
    } else {
      console.log('++++++++++++++++++++++++++(( === 3 ===))+++++++++++++++++++++++++++')
    }
    console.log('++++++++++++++++++++++++++(( === 4 ===))+++++++++++++++++++++++++++')
    // setFetch(true)
    // return false

    setAssignTruckModal(false)

    /* Get Total Shipment Quantity By Adding each Delivery Quantity */
    var totalShipmentQuantity = 0
    var totalShipmentNetQuantity = 0
    var totalShipmentQuantityRounded = 0
    var totalShipmentNetQuantityRounded = 0
    shipmentData.map((val, key) => {
      totalShipmentQuantity = totalShipmentQuantity + val.DeliveryQty
      totalShipmentNetQuantity = totalShipmentNetQuantity + val.DeliveryNetQty
    })

    // console.log(totalShipmentQuantity)
    totalShipmentQuantityRounded = parseFloat(totalShipmentQuantity).toFixed(2)
    totalShipmentNetQuantityRounded = parseFloat(totalShipmentNetQuantity).toFixed(2)

    var ShipmentCreationSendData = {}
    var ShipmentCreationSendData_seq = []

    /* Depo Party Locations 2-Trichy, 3-Chennai, 4-Kanyakumari, 5-Madurai */
    var depo_party_location_array = [2,3,4,5,13,14,15,16,18,20]

    /* Foods Party Locations 1-Dindigul, 6-Aruppukotai */
    var foods_party_location_array = [1,6,12,17,19]

    /*Get Shipment Number From SAP*/

    /* Set Vehicle Type Name { 1 - OWN, 2 - CON, 3 - HIRE } */
    var vehicleType = ''

    if (values.vehicle_type_id == '1') {
      vehicleType = 'OWN'
    } else if (values.vehicle_type_id == '2') {
      vehicleType = 'CON'
    } else if (values.vehicle_type_id == '3') {
      vehicleType = 'HIRE'
    } else {
      if(values.vehicle_type_id == '4' && values.vehicle_others_type == '2'){
        vehicleType = 'D2R'
      } else if(inArray(values.vehicle_location_id,depo_party_location_array)){
        vehicleType = 'DEPO_PARTY'
      } else if(inArray(values.vehicle_location_id,foods_party_location_array)){
        vehicleType = 'FOODS_PARTY'
      } else {
        vehicleType = 'PARTY'
      }
    }

    /* Set Shipment Data via Selected Deliveries by Loop */
    for (var i = 0; i < shipmentData.length; i++) {
      ShipmentCreationSendData.SIGNI = values.vehicle_number
      ShipmentCreationSendData.trip_sheet = values.tripsheet_no
      ShipmentCreationSendData.Driver_name = values.driver_name
      ShipmentCreationSendData.Contact_no = values.driver_number
      ShipmentCreationSendData.LFIMG = totalShipmentQuantityRounded
      ShipmentCreationSendData.VEH_TYPE = vehicleType
      ShipmentCreationSendData.ROUTE = values.shipment_route
      ShipmentCreationSendData.TPRFO = shipmentData[i].delivery_sequence
      ShipmentCreationSendData.VBELN = shipmentData[i].DeliveryOrderNumber
      ShipmentCreationSendData.DEL_QTY_MTS = shipmentData[i].DeliveryQty

      ShipmentCreationSendData_seq[i] = ShipmentCreationSendData

      ShipmentCreationSendData = {}
    }

    console.log(ShipmentCreationSendData_seq)

    VehicleAssignmentSapService.createShipment(ShipmentCreationSendData_seq).then((res) => {
      console.log(res)
      let sap_shipment_no = res.data.SHIPMENT_NO
      // let sap_shipment_status = res.data.STATUS
      let sap_ts_shipment = res.data.TRIP_SHEET
      let sap_trans_plant = res.data.TRANS_PLAN_POINT

      if (sap_shipment_no && sap_ts_shipment) {
        const formData = new FormData()
        formData.append('parking_id', values.parking_id)
        formData.append('vehicle_id', values.vehicle_id)
        formData.append('driver_id', values.driver_id)
        formData.append('driver_name', values.driver_name)
        formData.append('driver_number', values.driver_number)
        formData.append('remarks', values.remarks)
        formData.append('created_by', user_id)
        formData.append('shipment_info', values.shipment_info)
        formData.append('shipment_no', sap_shipment_no)
        formData.append('transport_plant', sap_trans_plant)
        formData.append('shipment_qty', totalShipmentQuantityRounded)
        formData.append('shipment_net_qty', totalShipmentNetQuantityRounded)
        formData.append('shipment_route', values.shipment_route)
        // formData.append('shipment_status', values.shipment_status)
        formData.append('tripsheet_id', values.tripsheet_id)
        formData.append('assigned_by', 1)
        formData.append('tripsheet_no', values.tripsheet_no)
        formData.append('vehicle_capacity_id', values.vehicle_capacity_id)
        formData.append('vehicle_location_id', values.vehicle_location_id)
        formData.append('vehicle_number', values.vehicle_number)
        formData.append('vehicle_type_id', values.vehicle_type_id)
        VehicleAssignmentService.createShipmentOrder(formData)
          .then((res) => {
            setFetch(true)
            if (res.status === 200) {
              // toast.success('Shipment Created Successfully!')
              // navigation('/Dashboard')
              Swal.fire({
                title: 'Shipment Created Successfully!',
                icon: "success",
                text:  'Shipment No : ' + sap_shipment_no,
                confirmButtonText: "OK",
              }).then(function () {
                window.location.reload(false)
              });
            }
          })
          .catch((error) => {
            setFetch(true)
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
        toast.warning('Shipment Not Created..Kindly Contact Admin!')
        setFetch(true)
        setTimeout(() => {
          window.location.reload(false)
        }, 1000)
      }
    })
  }

  return (
    <>
      {!fetch && <Loader />}{' '}
      {fetch && (
        <CCard className="p-1">
          <CNav variant="tabs" role="tablist">
            <CNavItem>
              <CNavLink
                className="btn btn-sm"
                // href="javascript:void(0);"
                active={activeKey === 1}
                onClick={() => setActiveKey(1)}
              >
                Open Delivery
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink
                className="btn btn-sm"
                // href="javascript:void(0);"
                active={activeKey === 2}
                onClick={() => {
                  setActiveKey(2)
                }}
              >
                Shipment Information
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink
                className="btn btn-sm"
                // href="javascript:void(0);"
                active={activeKey === 3}
                onClick={() => {
                  setActiveKey(3)
                }}
              >
                Invoice Completion
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink
                className="btn btn-sm"
                // href="javascript:void(0);"
                active={activeKey === 4}
                onClick={() => {
                  setActiveKey(4)
                }}
              >
                Missing Shipment
              </CNavLink>
            </CNavItem>

          </CNav>

          <CTabContent>
            <CTabPane role="tabpanel" aria-labelledby="" visible={activeKey === 1}>
              {Object.keys(rowData).length == 0 && (
                <>
                  <div className="m-5">
                    <h2>There are no delivery records to display..</h2>
                  </div>
                </>
              )}
              {Object.keys(rowData).length > 0 && (
                <>
                  <CRow>
                    <CCol
                      className="mt-2 offset-md-9"
                      xs={12}
                      sm={12}
                      md={3}
                      // style={{ display: 'flex', justifyContent: 'space-between' }}
                      style={{ display: 'flex', flexDirection: 'row-reverse', cursor: 'pointer' }}
                    >
                      
                      <CButton
                        onClick={() => {
                          checkModalDisplay()
                          // setAssignTruckModal(!assignTruckModal)
                        }}
                        color="warning"
                        className="mx-3 text-white"
                        size="sm"
                        id="inputAddress"
                      >
                        <span className="float-start">
                          <i className="" aria-hidden="true"></i> &nbsp;Assign Truck
                        </span>
                      </CButton>
                      <CButton
                        onClick={() => {
                          exportToCSV() 
                        }}
                        color="primary"
                        className="mx-3 text-white"
                        size="sm"
                        id="inputAddress"
                      >
                        <span className="float-start">
                          <i className="" aria-hidden="true"></i> &nbsp;Export
                        </span>
                      </CButton>

                      {/* Assign Truck Modal */}
                      <CModal
                        size="xl"
                        backdrop="static"
                        scrollable
                        visible={assignTruckModal}
                        onClose={() => setAssignTruckModal(false)}
                      >
                        <CModalHeader>
                          <CModalTitle>Vehicle Assignment</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                          <AssignTruckInfo
                            values={values}
                            getvnum={getvnum}
                            getvtripinfo={getvtripinfo}
                            getvroute={getvroute}
                            delivery_sequence={deliveryinfo}
                            delivery_data={rowData}
                            division={1}
                            last_delivery_route={shipmentRoute}
                            getFgstoData={getFgstoData}
                          />
                        </CModalBody>
                        <CModalFooter>
                          {ShipmentNotExpire ? (
                            <span>

                            </span>) : (
                              <span style={{ color: 'red' }}>
                                *Tripsheet Date Expired. Kindly close the old one and try with new tripsheet..
                              </span>
                            )
                          }
                          {fopMixedShipment && (
                            <span style={{ color: 'red' }}>
                              *FOP mixed deliveries cannot be allowed for own / hire vehicles during Shipment creation..
                            </span>
                          )}
                          {console.log('Tested:' + ChildVnum+'||'+ChildVroute+'||'+ShipmentNotExpire+'||'+fopMixedShipment+'||'+ChildVroute)}
                          <CButton
                            color="primary"
                            onClick={() => {
                              // setAssignTruckModal(false)
                              setFetch(false)
                              // ChildVnum && ChildVroute && ShipmentNotExpire && fopMixedShipment ? createShipment() : ''
                              ChildVnum && ChildVroute && ShipmentNotExpire ? createShipment() : ''
                            }}
                            // disabled={shipmentSave}
                            disabled={ChildVnum && ChildVroute && ShipmentNotExpire ? false : true}
                            // disabled={ChildVnum && ChildVroute && ShipmentNotExpire && fopMixedShipment ? false : true}
                          >
                            Save
                          </CButton>
                        </CModalFooter>
                      </CModal>

                      {/* Assign Truck Empty Error Modal */}
                      <CModal
                        visible={assignTruckErrorModal}
                        onClose={() => setAssignTruckErrorModal(false)}
                      >
                        <CModalHeader>
                          <CModalTitle>Error</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                          <h3 style={{ color: 'red' }}>
                            * Please Choose Atleast One Delivery Order for Shipment Creation
                          </h3>
                        </CModalBody>
                        <CModalFooter>
                          <CButton
                            color="secondary"
                            onClick={() => setAssignTruckErrorModal(false)}
                          >
                            Close
                          </CButton>
                        </CModalFooter>
                      </CModal>
                    </CCol>
                  </CRow>

                  <CRow>
                    <CTable style={{ height: '80vh', width: 'auto' }} className="overflow-scroll">
                      <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                        <CTableRow style={{ width: '100%' }}>
                          <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '5%', textAlign: 'center' }}
                          >
                            #
                          </CTableHeaderCell>
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
                            Route
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '9%', textAlign: 'center' }}
                          >
                            Delivery Plant
                          </CTableHeaderCell>
                          
                          <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '9%', textAlign: 'center' }}
                          >
                            Delivery No
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '9%', textAlign: 'center' }}
                          >
                            Delivery Date
                          </CTableHeaderCell>
                          {/* <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '9%', textAlign: 'center' }}
                          >
                            SO No
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '9%', textAlign: 'center' }}
                          >
                            SO Date
                          </CTableHeaderCell> */}
                          <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '9%', textAlign: 'center' }}
                          >
                            Inco Term
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '9%', textAlign: 'center' }}
                          >
                            Customer Type
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '15%', textAlign: 'center' }}
                          >
                            Customer Name
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '8%', textAlign: 'center' }}
                          >
                            City
                          </CTableHeaderCell>
                          

                          <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '5%', textAlign: 'center' }}
                          >
                            QTY in MTS
                          </CTableHeaderCell>

                          <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '8%', textAlign: 'center' }}
                          >
                            Action
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>

                        {/* { saleOrders && { */}
                        {/* {fetch && */}
                        {rowData.map((data, index) => {
                          console.log('data')
                          // console.log(data)
                          // if (data.VBELN2)
                          return (
                            <>
                              <CTableRow>
                                <CTableDataCell
                                  style={{ width: '5%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  {cusFreightChecker(data, 2) == 1 ? (
                                    <>
                                      <i
                                        style={{ color: 'red', fontSize: 'x-large' }}
                                        className="fa fa-bullseye"
                                        aria-hidden="true"
                                      ></i>
                                    </>
                                  ) :
                                    (<input
                                      className="form-check-input"
                                      style={{ minHeight: '18px !important' }}
                                      type="checkbox"
                                      name="delivery_orders"
                                      value={data.DeliveryOrderNumber}
                                      id="flexCheckDefault"
                                      onChange={assign_delivery}
                                    />
                                    )
                                  }
                                  {/* <input type="checkbox" name="name2" /> */}
                                </CTableDataCell>
                                <CTableDataCell
                                  style={{ width: '5%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  {data.sno}
                                </CTableDataCell>
                                
                                <CTableDataCell
                                  style={{ width: '9%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  {data.CustomerRoute}
                                </CTableDataCell> 
                                <CTableDataCell
                                  style={{ width: '9%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  {getLocationNameByCode(data.DeliveryPlant)}
                                </CTableDataCell>
                                
                                <CTableDataCell
                                  style={{ width: '9%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  {data.DeliveryOrderNumber}
                                </CTableDataCell>
                                <CTableDataCell
                                  style={{ width: '9%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  {formatDate(data.DeliveryOrderDate)}{' '}
                                </CTableDataCell>
                                <CTableDataCell
                                  style={{ width: '9%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  {/* {getIncoTermNameByCode(data.IncoTerm)} */}
                                  {data.IncoTerm}
                                </CTableDataCell>
                                {/* <CTableDataCell
                                  style={{ width: '9%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  {data.SaleOrderNumber}
                                </CTableDataCell>
                                <CTableDataCell
                                  style={{ width: '9%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  {formatDate(data.SaleOrderDate)}{' '}
                                </CTableDataCell> */}
                                <CTableDataCell
                                  style={{ width: '9%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  {data.CustomerType}{' '}
                                </CTableDataCell>
                                <CTableDataCell
                                  style={{ width: '15%', textAlign: 'center', color: cusFreightChecker(data, 1) }}
                                  scope="row"
                                >
                                  {data.CustomerName}
                                </CTableDataCell>
                                <CTableDataCell
                                  style={{ width: '8%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  {data.CustomerCity}
                                </CTableDataCell>
                                
                                <CTableDataCell
                                  style={{ width: '5%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  {data.DeliveryQty}
                                  {/* {data.DeliveryNetQty} */}
                                </CTableDataCell>

                                <CTableDataCell
                                  style={{ width: '8%', textAlign: 'center' }}
                                  scope="row"
                                >
                                  <CButton
                                    onClick={() => {
                                      setVisible(!visible)
                                      setCurrentDeliveryId(data.DeliveryOrderNumber)
                                    }}
                                    className="text-white"
                                    color="warning"
                                    size="sm"
                                  >
                                    <span className="float-start">
                                      <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                                    </span>
                                  </CButton>

                                  {/* ======================= Delivery Info Modal Area ========================== */}
                                  <CModal
                                    size="xl"
                                    visible={visible}
                                    backdrop="static"
                                    scrollable
                                    onClose={() => setVisible(false)}
                                  >
                                    <CModalHeader>
                                      <CModalTitle>Delivery Order Details</CModalTitle>
                                    </CModalHeader>

                                    <CModalBody>
                                      <DeliveryOrderInfo
                                        all_delivery_data={rowData}
                                        delivery_id={currentDeliveryId}
                                      />
                                    </CModalBody>
                                    <CModalFooter>
                                      <CButton color="secondary" onClick={() => setVisible(false)}>
                                        Close
                                      </CButton>
                                    </CModalFooter>
                                  </CModal>
                                  {/* *********************************************************** */}
                                </CTableDataCell>
                              </CTableRow>
                            </>
                          )
                        })}
                      </CTableBody>
                    </CTable>
                  </CRow>
                </>
              )}
            </CTabPane>
          </CTabContent>

          <CTabContent>
            <br />
            <CTabPane role="tabpanel" aria-labelledby="" visible={activeKey === 2}>
              {/* {fetch && ( */}
              <CCard className="mt-4">
                <CContainer className="mt-2">
                  <CustomTable columns={columns} data={shipmentRowData} showSearchFilter={true} />
                </CContainer>
              </CCard>
              {/* )} */}

              <CTable style={{ display: 'none' }}>
                <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                  <CTableRow>
                    <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                      S.no
                    </CTableHeaderCell>

                    <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                      Truck No
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                      Trip Sheet No
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                      Shipment No
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                      Action
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {
                    // fetch &&
                    ShipmentCreatedData.map((data, index) => {
                      return (
                        <>
                          <CTableRow>
                            <CTableDataCell scope="row">1</CTableDataCell>
                            {/* <CTableDataCell>1789</CTableDataCell> */}
                            <CTableDataCell>TN57AT6789</CTableDataCell>
                            <CTableDataCell>637534</CTableDataCell>
                            <CTableDataCell>6547234</CTableDataCell>

                            <CTableDataCell>
                              <CButton color="warning" size="sm" className="mx-3 text-white">
                                <Link className="text-white" to="/VehicleAssignmentFoods">
                                  Show
                                </Link>
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        </>
                      )
                    })
                  }
                </CTableBody>
              </CTable>
            </CTabPane>
          </CTabContent>

          <CTabContent>
            <br />
            <CTabPane role="tabpanel" aria-labelledby="" visible={activeKey === 3}>
              {/* {fetch && ( */}
              <CCard className="mt-4">
                <CContainer className="mt-2">
                  <CustomTable columns={columns_invoice} data={shipmentInvoiceRowData} showSearchFilter={true} />
                </CContainer>
              </CCard>
              {/* )} */}

              <CTable style={{ display: 'none' }}>
                <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                  <CTableRow>
                    <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                      S.no
                    </CTableHeaderCell>

                    <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                      Truck No
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                      Trip Sheet No
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                      Shipment No
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                      Action
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {
                    // fetch &&
                    ShipmentCreatedData.map((data, index) => {
                      return (
                        <>
                          <CTableRow>
                            <CTableDataCell scope="row">1</CTableDataCell>
                            {/* <CTableDataCell>1789</CTableDataCell> */}
                            <CTableDataCell>TN57AT6789</CTableDataCell>
                            <CTableDataCell>637534</CTableDataCell>
                            <CTableDataCell>6547234</CTableDataCell>

                            <CTableDataCell>
                              <CButton color="warning" size="sm" className="mx-3 text-white">
                                <Link className="text-white" to="/VehicleAssignmentFoods">
                                  Show
                                </Link>
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        </>
                      )
                    })
                  }
                </CTableBody>
              </CTable>
            </CTabPane>
          </CTabContent>
          {/* ================ Missing Shipments Part Start ================ */}
          <CTabContent>
            <br />
            <CTabPane role="tabpanel" aria-labelledby="" visible={activeKey === 4}>
              <CCard className="mt-4">
                <CContainer className="mt-2">
                  <CustomTable columns={columns_missing_Shipments} data={missingRowData} showSearchFilter={true} />
                </CContainer>
              </CCard>
            </CTabPane>
          </CTabContent>
          {/* ================ Missing Shipments Part End ================== */}
        </CCard>
      )}
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
      {/* ======================= Confirm Button Modal Area ========================== */}
      <CModal
        visible={shipmentDelete}
        backdrop="static"
        // scrollable
        onClose={() => {
          setShipmentDelete(false)
          setShipmentToDelete('')
          setShipmentTSToDelete('')
          setMissingShipmentDelete(false)
        }}
      >
        <CModalBody>
          <p className="lead">Are you sure to delete this shipment - ({shipmentToDelete}) ?</p>
        </CModalBody>
        <CModalFooter>
          <CButton
            className="m-2"
            color="warning"
            onClick={() => {
              missingShipmentDelete ? deleteMissingShipment() : deleteShipment()
              setShipmentDelete(false)
              setMissingShipmentDelete(false)
              setFetch(false)
            }}
          >
            Confirm
          </CButton>
          <CButton
            color="secondary"
            onClick={() => {
              setShipmentDelete(false)
              setShipmentToDelete('')
              setShipmentTSToDelete('')
              setMissingShipmentDelete(false)
            }}
          >
            Cancel
          </CButton>
          {/* <CButton color="primary">Save changes</CButton> */}
        </CModalFooter>
      </CModal>
      {/* *********************************************************** */}
      {/* ======= Missing Shipment Updation Modal Area Start ========= */}
      <CModal
        visible={msuModalEnable}
        backdrop="static"
        size="xl"
        // scrollable
        onClose={() => {
          setMsuModalEnable(false)
          setMissingShipmentRoute(0)
          setMsuSubmitEnable(false)
          setShipmentRemarks('')
          setShipmentHaving(false)
          setSaleOrders([])
        }}
      >
        <CModalHeader>
          <CModalTitle>Missing Shipment Updation</CModalTitle>
        </CModalHeader>
        <CModalBody>

          <CRow className="mt-3">

            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="fnr_no">Vehicle Number</CFormLabel>
              <CFormInput
                size="sm"
                className="mb-2"
                id="veh_no"
                value={display_modal_values(1)}
                readOnly
              />
            </CCol>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="fnr_no">Tripsheet Number</CFormLabel>
              <CFormInput
                size="sm"
                className="mb-2"
                id="veh_no"
                value={display_modal_values(2)}
                readOnly
              />
            </CCol>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="fnr_no">Shipment Number</CFormLabel>
              <CFormInput
                size="sm"
                className="mb-2"
                id="veh_no"
                value={display_modal_values(3)}
                readOnly
              />
            </CCol>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="shipment_route_nlfd">
                Shipment Route <REQ />{' '}
              </CFormLabel>
              <CFormSelect
                size="sm"
                name="shipment_route_nlfd"
                onChange={(e) => { remarksHandleChange(e, '3') }}
                value={missingShipmentRoute}
                id="shipment_route_nlfd"
              >
                <option value="0">Select ...</option>
                {foodsRouteData.map((val, ind) => {
                  return (
                    <>
                      <option key={ind} value={val.definition_list_code}>
                        {`${val.definition_list_name} (${val.definition_list_code})`}
                      </option>
                    </>
                  )
                })}
              </CFormSelect>
            </CCol>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="shipment_pgi_status">
                PGI Completion
              </CFormLabel>
              <CFormSelect
                size="sm"
                name="shipment_pgi_status"
                onChange={(e) => { remarksHandleChange(e, '2') }}
                value={shipmentPgiStatus}
                id="shipment_pgi_status"
              >
                <option value="0" selected>Not Completed</option>
                <option value="1">Completed</option>
              </CFormSelect>
            </CCol>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="shipment_remarks">Remarks</CFormLabel>
              <CFormTextarea
                name="shipment_remarks"
                id="shipment_remarks"
                rows="1"
                onChange={(e) => { remarksHandleChange(e, '1') }}
                value={shipmentRemarks}
              ></CFormTextarea>
            </CCol>
          </CRow>
          {!smallfetch && <SmallLoader />}
          {shipmentHaving && (
            <>
              <CRow className="mt-2" hidden>
                <CCol xs={12} md={3}>
                  <CFormLabel
                    htmlFor="inputAddress"
                    style={{
                      backgroundColor: '#4d3227',
                      color: 'white',
                    }}
                  >
                    Delivery Information
                  </CFormLabel>
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
                        style={{ color: 'white', width: '9%', textAlign: 'center' }}
                      >
                        Delivery Plant
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '9%', textAlign: 'center' }}
                      >
                        Delivery No
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '9%', textAlign: 'center' }}
                      >
                        Delivery Date
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '9%', textAlign: 'center' }}
                      >
                        SO No
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '9%', textAlign: 'center' }}
                      >
                        SO Date
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '15%', textAlign: 'center' }}
                      >
                        Customer Name
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '8%', textAlign: 'center' }}
                      >
                        City
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '9%', textAlign: 'center' }}
                      >
                        Route
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                      >
                        QTY in MTS
                      </CTableHeaderCell>

                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {msRowData.map((data, index) => {
                      console.log(data,'rowData-data')
                      // console.log(data)
                      // if (data.VBELN2)
                      return (
                        <>
                          <CTableRow>
                            <CTableDataCell
                              style={{ width: '5%', textAlign: 'center' }}
                              scope="row"
                            >
                              {data.sno}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ width: '9%', textAlign: 'center' }}
                              scope="row"
                            >
                              {/* {getIncoTermNameByCode(data.IncoTerm)} */}
                              {data.IncoTerm}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ width: '9%', textAlign: 'center' }}
                              scope="row"
                            >
                              {getLocationNameByCode(data.DeliveryPlant)}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ width: '9%', textAlign: 'center' }}
                              scope="row"
                            >
                              {data.DeliveryOrderNumber}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ width: '9%', textAlign: 'center' }}
                              scope="row"
                            >
                              {formatDate(data.DeliveryOrderDate)}{' '}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ width: '9%', textAlign: 'center' }}
                              scope="row"
                            >
                              {data.SaleOrderNumber}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ width: '9%', textAlign: 'center' }}
                              scope="row"
                            >
                              {formatDate(data.SaleOrderDate)}{' '}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ width: '15%', textAlign: 'center' }}
                              scope="row"
                            >
                              {data.CustomerName}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ width: '8%', textAlign: 'center' }}
                              scope="row"
                            >
                              {data.CustomerCity}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ width: '9%', textAlign: 'center' }}
                              scope="row"
                            >
                              {data.CustomerRoute}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ width: '5%', textAlign: 'center' }}
                              scope="row"
                            >
                              {data.DeliveryQty}
                              {/* {data.DeliveryNetQty} */}
                            </CTableDataCell>

                          </CTableRow>
                        </>
                      )
                    })}
                  </CTableBody>
                </CTable>
              </CRow>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          {!shipmentHaving && smallfetch && (
            <CButton
              className="m-2"
              color="warning"
              disabled={!msuSubmitEnable}
              onClick={() => {
                getShipmentData(display_modal_values(3))
              }}
            >
              Fetch Shipment
            </CButton>
          )}
          {smallfetch && shipmentHaving && (
            <CButton
              className="m-2"
              color="warning"
              disabled={!msuSubmitEnable}
              onClick={() => {
                setMsuModalEnable(false)
                TripsheetShipmentUpdate()
              }}
            >
              Update
            </CButton>
          )}
          <CButton
            className="m-2"
            color="warning"
            onClick={() => {
              setMsuModalEnable(false)
              setMissingShipmentRoute(0)
              setMsuSubmitEnable(false)
              setShipmentRemarks('')
              setShipmentHaving(false)
              setSaleOrders([])
            }}
          >
            No
          </CButton>

        </CModalFooter>
      </CModal>
      {/* ======= Missing Shipment Updation Modal Area End ========= */}
    </>
  )
}

export default Shipment
