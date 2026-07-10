/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabPane,
  CFormFloating,
  CFormTextarea,
  CModalTitle,
  CModalBody,
  CModal,
  CModalHeader,
  CModalFooter,
  CAlert,
  CCardImage,
  CTooltip,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm'
import Loader from 'src/components/Loader'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import validate from 'src/Utils/Validation' 
import ShipmentDeliveryInfo from './Segments/NlmtShipmentDeliveryInfo' 
import OpenDeliveryInfo from './Segments/NlmtOpenDeliveryInfo'
import CustomTable from 'src/components/customComponent/CustomTable'
import NlmtVehicleAssignmentService from 'src/Service/Nlmt/VehicleAssignment/NlmtVehicleAssignmentService'
import NlmtShedMasterService from 'src/Service/Nlmt/Masters/NlmtShedMasterService'
import NlmtVehicleAssignmentSapService from 'src/Service/Nlmt/SAP/NlmtVehicleAssignmentSapService'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import Swal from 'sweetalert2'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const NlmtShipmentInfo = () => {
  const { id } = useParams()

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

  /* ==================== Access Part Start ========================*/
    const [screenAccess, setScreenAccess] = useState(false)
    let page_no = NlmtScreenAccessCodes.NlmtTransactionScreens.Nlmt_Vehicle_Assignment
  
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

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id


  const formValues = {
    shipment_info: '',
  }

  const [rowData, setRowData] = useState([])
  const [deliveryInsertData, setDeliveryInsertData] = useState([])
  const [OdometerPhoto, setOdometerPhoto] = useState(false)

  const [deliveryinfo, setDeliveryInfo] = useState({
    delivery_orders: [],
    response: [],
  })

  /* Getting Delivery Numbers From Child Component */
  const getDeliveries = (data_need) => {
    setDeliveryInfo(data_need)
  }

  /* Fetching All Open Delivery Orders From Child Component */
  const fetchAllData = (data_need) => {
    setOpenDeliveryData(data_need)
  }

  const [visible, setVisible] = useState(false)
  const [odVisible, setODVisible] = useState(false)
  const [currentDeliveryId, setCurrentDeliveryId] = useState('')

  /* Get Delivery No to Delete */
  const [deliveryNoToDelete, setDeliveryNoToDelete] = useState('')

  /* Assign Delivery Quantity For Delete */
  const [deliveryQty, setDeliveryQty] = useState('')
  const [deliveryNetQty, setDeliveryNetQty] = useState('')

  /* Get Shipment No for Delete */
  const [shipmentToDelete, setShipmentToDelete] = useState('')

  /* Get Shipment Info for Delete Purpose */
  const [shipmentDeliveryData, setShipmentDeliveryData] = useState([])

  /* Modal Condition to Enable for Delivery Delete */
  const [deliveryDelete, setDeliveryDelete] = useState(false)

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  /* Date Format Change : yyyy-mm-dd to dd-mm-yy */
  const formatDate = (input) => {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2]

    return day + '-' + month + '-' + year
  }

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'SO No',
      selector: (row) => row.SaleOrder_No,
      sortable: true,
      center: true,
    },
    {
      name: 'SO Date',
      selector: (row) => formatDate(row.SaleOrder_Date),
      sortable: true,
      center: true,
    },
    {
      name: 'Delivery No',
      selector: (row) => row.Delivery_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Delivery Date',
      selector: (row) => formatDate(row.Delivery_Date),
      sortable: true,
      center: true,
    },
    {
      name: 'Customer',
      selector: (row) => row.Customer_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'City',
      selector: (row) => row.Customer_City,
      sortable: true,
      center: true,
    },
    {
      name: 'Route',
      selector: (row) => row.Customer_Route,
      sortable: true,
      center: true,
    },
    {
      name: 'Qty in MTS ',
      selector: (row) => row.Delivery_Qty,
      sortable: true,
      center: true,
    },
    {
      name: 'PGI Staus ',
      selector: (row) => row.PGI_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  function verifySAPPGIUpdate(delivery_no){
    setFetch(false)
    NlmtVehicleAssignmentSapService.verifyPgiUpdate(delivery_no).then((res)=>{
      let response_info = res.data ? res.data[0] : null
      console.log(response_info,'verifySAPPGIUpdate-SAP Response')
      console.log(shipmentData,'verifySAPPGIUpdate-shipmentData')
      if(response_info && response_info.STATUS == '1' && response_info.VBELN == delivery_no){
        // setFetch(true)

        const formDataForDBUpdate = new FormData()
        formDataForDBUpdate.append('pgi_completion', 1)
        formDataForDBUpdate.append('user_id', user_id)
        formDataForDBUpdate.append('shipment_id', shipmentData.shipment_id)
        formDataForDBUpdate.append('parking_id', shipmentData.parking_id)
        formDataForDBUpdate.append('delivery_no', delivery_no)

        NlmtVehicleAssignmentService.updateSinglePGICompletion(formDataForDBUpdate).then((res)=>{  

          console.log(res,'verifySAPPGIUpdate-PRO Response') 
          setFetch(true)
          if (res.status == 200) {
            Swal.fire({
              icon: "success", 
              text: res.data.message,
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
              // window.location.reload(false)
            })
          } else {
            toast.warning('PGI Completion cannot be updated. Kindly contact Admin..!')
          }

        })
        .catch(error=>{
          console.log(error,'catch part error')
          setFetch(true)
          toast.error('Error occurred while verifying PRO PGI update.')
        })

      } else if(response_info && response_info.STATUS == '2' && response_info.VBELN == delivery_no){
        setFetch(true)
        toast.warning('PGI Updation is still in pending.. Kindly Try Again After Some Time!')
      } else {
        setFetch(true)
        toast.warning('There is a problem in SAP PGI Updation.. Kindly contact SAP Admin.!')
      }
    })
    .catch(error=>{
      console.log(error,'catch part error')
      setFetch(true)
      toast.error('Error occurred while verifying SAP PGI update.')
    })
  }

  const [shipmentData, setShipmentData] = useState([])
  const [emptySelect, setEmptySelect] = useState(false)
  const [openDeliveryData, setOpenDeliveryData] = useState([])
  const [shipmentPYGData, setShipmentPYGData] = useState([])
  const [shedData, setShedData] = useState([])
  const [fetch, setFetch] = useState(false)
  const [vCapacity, setVCapacity] = useState([])

  useEffect(() => {
    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(2)
      .then((cap) => {
        setVCapacity(cap.data.data || [])
      })
  }, [])

  const vehicleCapacityName =
    vCapacity.find(
      (item) =>
        item.definition_list_id ===
        shipmentData?.vehicle_capacity_id
    )?.definition_list_name || '-'
  console.log(vCapacity,'vCapacityvCapacityvCapacityvCapacity')

  useEffect(() => {

    NlmtVehicleAssignmentService.getSingleShipment(id).then((res) => {
      console.log(res.data.data,'getSingleShipment')
      setShipmentData(res.data.data)

      NlmtVehicleAssignmentService.getSingleShipmentPYGData(res.data.data.parking_id).then((rest) => {
        setShipmentPYGData(rest.data.data)
        console.log(rest.data.data)
        let needed_data = rest.data.data
        if (needed_data.vehicle_type_id == 22) {
          NlmtShedMasterService.SingleShedData(needed_data.vehicle_document.shed_id).then((resp) => {
            setShedData(resp.data.data)
            console.log(resp.data.data)
          })
        }

        setFetch(true)
      })
    })

    NlmtVehicleAssignmentService.getSingleShipmentChildInfo(id).then((response) => {
      // setFetch(true)
      let viewData = response.data.data
      setShipmentDeliveryData(response.data.data,'getSingleShipmentChildInfo')
      console.log(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          SaleOrder_No: data.sale_order_info.SaleOrderNumber,
          SaleOrder_Date: data.sale_order_info.SaleOrderDate,
          Delivery_No: data.delivery_no,
          Delivery_Date: data.delivery_date,
          Customer_Name: data.customer_info.CustomerName,
          Customer_Type: data.customer_info.CustomerType,
          Customer_City: data.customer_info.CustomerCity,
          Customer_Route: data.customer_info.CustomerRoute,
          Delivery_Qty: data.delivery_qty,
          PGI_Status: data.delivery_status == 3 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                onClick={() => {
                  setVisible(!visible)
                  setCurrentDeliveryId(data.delivery_no)
                }}
                color="secondary"
                shape="rounded"
                id={data.id}
                className="m-1"
              >
                {/* View */}
                <i className="fa fa-eye" aria-hidden="true"></i>
              </CButton>
              {data.delivery_status == 1 && (
                <CButton
                  size="sm"
                  onClick={() => { 
                    verifySAPPGIUpdate(data.delivery_no)
                  }}
                  color="success"
                  shape="rounded"
                  id={data.id}
                  className="m-1"
                >
                  {/* View */}
                  <i className="fa fa-check" aria-hidden="true"></i>
                </CButton>
              )}
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                id={data.id}
                disabled={data.delivery_status == 3}
                onClick={() => {
                  setDeliveryDelete(true)
                  setDeliveryNoToDelete(data.delivery_no)
                  setDeliveryQty(data.delivery_qty)
                  setDeliveryNetQty(data.delivery_net_qty)
                  setShipmentToDelete(data.shipment_no)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
            </div>
          ),
        })
      })
      setRowData(rowDataList)
    })

  }, [shipmentPYGData.length == 0])

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    login,
    validate,
    formValues
  )

  function removeDuplicates(arr) {
    return arr.filter((item,index) => arr.indexOf(item) === index);
  }

  function checkModalDisplay() {
    console.log(openDeliveryData)
    console.log(deliveryinfo)
    var del_orders_array = deliveryinfo.delivery_orders
    console.log(del_orders_array)
    var shipment_details1 = []
    var shipment_details2 = []
    var shipment_delivery_plant_array = []

    // console.log(shipmentData,'shipmentData')
    console.log(shipmentDeliveryData,'shipmentDeliveryData')

    shipmentDeliveryData.map((vv,kk)=>{
      shipment_delivery_plant_array.push(vv.delivery_plant)
    })


    /* Create Shipment JSON String for DB Update */
    /*========(Start)================================================================================*/

    del_orders_array.map((value_item1, key_item1) => {
      console.log(value_item1)
      openDeliveryData.map((value_item, key_item) => {
        if (value_item1 == value_item.DeliveryOrderNumber) {
          value_item['delivery_sequence'] = key_item1 + 1
          shipment_details2.push(value_item)
          shipment_delivery_plant_array.push(value_item['DeliveryPlant'])
        }
      })
    })

    // console.log(shipment_details1)
    console.log(shipment_details2)

    /* === Restriction for clubbing the different plant deliveries in the Shipment Creation Process Start === */
    console.log(shipment_delivery_plant_array,'shipment_delivery_plant_array')

    let updated_shipment_delivery_plant_array = removeDuplicates(shipment_delivery_plant_array)
    console.log(updated_shipment_delivery_plant_array,'updated_shipment_delivery_plant_array')

    if(updated_shipment_delivery_plant_array.length > 1){
      toast.warning('Deliveries from different delivery plants cannot be allowed to create shipment...!')
      return false
    }

    /* === Restriction for clubbing the different plant deliveries in the Shipment Creation Process End === */

    setDeliveryInsertData(shipment_details2)
    values.shipment_info = JSON.stringify(shipment_details2)

    /*=========(End)=================================================================================*/
    // return false
    if (Object.keys(deliveryinfo.response).length > 0) {
      setEmptySelect(false)
      insertDelivery(shipment_details2)

      // setODVisible(false)
    } else {
      setEmptySelect(true)
      // toast.warning('Please Choose Atleast One Delivery Order for Delivery Insert !')
    }
  }

  const pgiUpdateInDb = (json_data) => {
    // console.log(json_data)
    NlmtVehicleAssignmentService.updatePgiInfoToDb(json_data).then((res) => {
      console.log(res)
    })
  }

  const deliveryQuantityUpdateInDb = (json_data) => {
    // console.log(json_data)
    NlmtVehicleAssignmentService.updateDeliveryQuantityInfoToDb(json_data).then((res) => {
      console.log(res)
    })
  }

  const secondWeightUpdateInDb = (json_data) => {
    // console.log(json_data)
    NlmtVehicleAssignmentService.updateSecondWeightInfoToDb(json_data).then((res) => {
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

  const vehicleTypeFind = (id) => {
    if (id == 21) {
      return 'Own'
    } else if (id == 22) {
      return 'Hire'
    } else if (id == 23) {
      return 'Party'
      return 'Party'
    }
    // else {
    //   if(shipmentData.parking_yard_info.vehicle_others_type == '2'){
    //     return 'D2R Vehicle'
    //   } else {
    //     return 'Party'
    //   }
    // }
  }

  function login() {
    alert('No Errors CallBack Called')
  }

  useEffect(() => {
    /* section for getting PGI Info Details from SAP */
    NlmtVehicleAssignmentSapService.getPGIInfoData().then((res) => {
      console.log(res.data)
      let response_info = res.data
      if (response_info.length > 0) {
        pgiUpdateInDb(JSON.stringify(response_info))
          console.log('response_info',response_info)
      } else {
        console.log('Nothing to Update PGI Info')
      }
    })

    /* section for getting Delivery Quantity update Details from SAP */
    NlmtVehicleAssignmentSapService.getDeliveryQuantityInfoData().then((res) => {
      console.log(res.data)
      let response_info = res.data
      if (response_info.length > 0) {
        deliveryQuantityUpdateInDb(JSON.stringify(response_info))
      } else {
        console.log('Nothing to Update Delivery Quantity Info')
      }
    })

    /* section for getting 2nd Weight Info Details from SAP */
    NlmtVehicleAssignmentSapService.getSecondWeightInfoData().then((res) => {
      console.log(res.data)
      let response_info = res.data
      if (response_info.length > 0) {
        secondWeightUpdateInDb(JSON.stringify(response_info))
      } else {
        console.log('Nothing to Update 2nd Weight Info')
      }
    })
  }, [])

  /* Delivery Insert Process */
  const insertDelivery = (data_for_inserted_deliveries) => {
    console.log('test')
    console.log(deliveryinfo)
    console.log(data_for_inserted_deliveries)

    setODVisible(false)
    setFetch(false)

    /* Get Total Shipment Quantity By Adding each New Delivery Quantity */
    var totalShipmentQuantity = 0
    var totalShipmentNetQuantity = 0
    data_for_inserted_deliveries.map((val, key) => {
      totalShipmentQuantity = totalShipmentQuantity + val.DeliveryQty
      totalShipmentNetQuantity = totalShipmentNetQuantity + val.DeliveryNetQty
    })

    console.log(totalShipmentQuantity)
    console.log(shipmentData.shipment_qty)

    var editedShipmentQuantity = (
      Number(totalShipmentQuantity) + Number(shipmentData.shipment_qty)
    ).toFixed(3)

    var editedShipmentNetQuantity = (
      Number(totalShipmentNetQuantity) + Number(shipmentData.shipment_net_qty)
    ).toFixed(2)

    var ShipmentCreationSendData = {}
    var ShipmentCreationSendData_seq = []

    /* Depo Party Locations 2-Trichy, 3-Chennai, 4-Kanyakumari, 5-Madurai */
    var depo_party_location_array = [2,3,4,5,13,14,15,16,18]

    /* Foods Party Locations 1-Dindigul, 6-Aruppukotai */
    var foods_party_location_array = [1,6,12,17,19]

    /* Set Vehicle Type Name { 1 - OWN, 2 - CON, 3 - HIRE } */
    var vehicleType = ''

    if (shipmentData.vehicle_type_id == '21') {
      vehicleType = 'OWN'
    } else if (shipmentData.vehicle_type_id == '22') {
      vehicleType = 'HIRE'
    } else if (shipmentData.vehicle_type_id == '23') {
      vehicleType = 'PARTY'
    }
console.log(shipmentData,'shipmentData123')
    /* Set Shipment Data via Selected Deliveries by Loop */
    for (var i = 0; i < data_for_inserted_deliveries.length; i++) {
      ShipmentCreationSendData.STATUS = '1'
      ShipmentCreationSendData.SHIPMENT_NO = id
      ShipmentCreationSendData.vbeln = data_for_inserted_deliveries[i].DeliveryOrderNumber
      ShipmentCreationSendData.TRIP_SHEET = shipmentData.trip_sheet_info.nlmt_tripsheet_no
      ShipmentCreationSendData.VEH_TYPE = vehicleType
      ShipmentCreationSendData.SIGNI = shipmentData.vehicle_number
      ShipmentCreationSendData.plant = 'NLMD'

      ShipmentCreationSendData_seq[i] = ShipmentCreationSendData

      ShipmentCreationSendData = {}
    }

    console.log(ShipmentCreationSendData_seq)

    NlmtVehicleAssignmentSapService.updateShipmentByDeliveryInsert(ShipmentCreationSendData_seq).then(
      (res) => {
        console.log(res.data,'hi')
        let sap_shipment_no = res.data.SHIPMENT_NO
        let sap_shipment_status = res.data.STATUS
        let sap_ts_shipment = res.data.TRIP_SHEET
        let sap_delivery = res.data.VBELN

        console.log(
          sap_shipment_no + '/' + sap_shipment_status + '/' + sap_ts_shipment + '/' + sap_delivery
        )

        if (
          sap_shipment_status == '1' &&
          res.status == 200 &&
          sap_delivery &&
          sap_shipment_no &&
          sap_ts_shipment
        ) {
          const formDataForDBUpdate = new FormData()
          formDataForDBUpdate.append('_method', 'PUT')
          formDataForDBUpdate.append('shipment_status', '2')
          formDataForDBUpdate.append('shipment_info', values.shipment_info)
          // formDataForDBUpdate.append('delivery_status', '2')
          // formDataForDBUpdate.append(
          //   'shipment_qty',
          //   (shipmentData.shipment_qty - deliveryQty).toFixed(3)
          // )
          formDataForDBUpdate.append('shipment_qty', editedShipmentQuantity)
          if(shipmentData.shipment_net_qty){
            formDataForDBUpdate.append('shipment_net_qty', editedShipmentNetQuantity)
          }
          // formDataForDBUpdate.append('delivery_no', deliveryNoToDelete)
          formDataForDBUpdate.append('process', 'insert')

          NlmtVehicleAssignmentService.updateShipmentOrder(id, formDataForDBUpdate)
            .then((res) => {
              setFetch(true)
              if (res.status == 200) {
                toast.success('Shipment Updated Successfully!')
                window.location.reload(false)
              } else {
                toast.warning(
                  'Shipment - Delivery Cannot Be Inserted From LP.. Kindly Contact Admin!'
                )
              }
            })
            .catch((error) => {
              setFetch(true)
              for (let value of formDataForDBUpdate.values()) {
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
          toast.warning('Shipment - Delivery Cannot Be Updated From SAP.. Kindly Contact Admin!')
        }
      }
    )
  }

  /* Delivery Delete Process */
  const deleteDelivery = () => {
    const formDataForSAPDeliveryDelete = new FormData()
    formDataForSAPDeliveryDelete.append('STATUS', '2')
    formDataForSAPDeliveryDelete.append('SHIPMENT_NO', shipmentToDelete)
    formDataForSAPDeliveryDelete.append('vbeln', deliveryNoToDelete)
    formDataForSAPDeliveryDelete.append('TRIP_SHEET', shipmentData.trip_sheet_info.trip_sheet_no)

    var editedShipmentQuantity = (Number(shipmentData.shipment_qty) - Number(deliveryQty)).toFixed(3)

    if(shipmentData.shipment_net_qty){
      var editedShipmentNetQuantity = (Number(shipmentData.shipment_net_qty) - Number(deliveryNetQty)).toFixed(3)
    }

    NlmtVehicleAssignmentSapService.updateShipment(formDataForSAPDeliveryDelete)
      .then((res) => {
        let sap_shipment_no = res.data.SHIPMENT_NO
        let sap_shipment_status = res.data.STATUS
        let sap_ts_shipment = res.data.TRIP_SHEET
        let sap_delivery = res.data.VBELN

        console.log(
          sap_shipment_no + '/' + sap_shipment_status + '/' + sap_ts_shipment + '/' + sap_delivery
        )

        if (
          sap_shipment_status == '2' &&
          res.status == 200 &&
          sap_delivery &&
          sap_shipment_no &&
          sap_ts_shipment
        ) {
          const formDataForDBUpdate = new FormData()

          formDataForDBUpdate.append('_method', 'PUT')
          formDataForDBUpdate.append('shipment_status', '2')
          formDataForDBUpdate.append('delivery_status', '2')
          formDataForDBUpdate.append('shipment_qty', editedShipmentQuantity)
          if(shipmentData.shipment_net_qty && editedShipmentNetQuantity > 0){
            formDataForDBUpdate.append('shipment_net_qty', editedShipmentNetQuantity)
          }
          formDataForDBUpdate.append('delivery_no', deliveryNoToDelete)
          formDataForDBUpdate.append('process', 'delete')

          NlmtVehicleAssignmentService.updateShipmentOrder(id, formDataForDBUpdate)
            .then((res) => {
              setFetch(true)
              if (res.status == 200) {
                toast.success('Shipment Updated Successfully!')
                window.location.reload(false)
              } else {
                toast.warning(
                  'Shipment - Delivery Cannot Be Deleted From LP.. Kindly Contact Admin!'
                )
              }
            })
            .catch((error) => {
              setFetch(true)
              for (let value of formDataForDBUpdate.values()) {
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
        } else if (res.status == 201) {
          setFetch(true)
          toast.warning(
            'Shipment has minimum one Delivery. So it Cannot Be Deleted From SAP.. Kindly Contact Admin!'
          )
        } else {
          setFetch(true)
          toast.warning('Shipment - Delivery Cannot Be Deleted From SAP.. Kindly Contact Admin!')
        }
      })
      .catch((error) => {
        setFetch(true)
        for (let value of formDataForSAPDeliveryDelete.values()) {
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

// console.log(shipmentData,'shipmentDatashipmentDatashipmentDatashipmentDatashipmentData')


  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <CCard>
              <CTabContent>
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                  <CForm className="container p-3" onSubmit={handleSubmit}>
                    <CRow className="">
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="tNum">Tripsheet Number</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="tNum"
                          value={shipmentData.trip_sheet_info?.nlmt_tripsheet_no}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="tNum">Shipment Number</CFormLabel>

                        <CFormInput size="sm" id="tNum" value={Number(id)} readOnly />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="tNum">Shipment Quantity in MTS</CFormLabel>

                        <CFormInput size="sm" id="tNum" value={shipmentData.shipment_qty} readOnly />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="vType"
                          value={vehicleTypeFind(shipmentData.vehicle_type_id)}
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="vNum"
                          value={shipmentData.vehicle_number}
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vCap">Vehicle Capacity</CFormLabel>

                        <CFormInput size="sm" id="vCap" value={vehicleCapacityName} readOnly />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dName">Driver Name</CFormLabel>

                        <CFormInput size="sm" id="dName" value={shipmentData.driver_name} readOnly />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dMob">Driver Mobile Number</CFormLabel>

                        <CFormInput size="sm" id="dMob" value={shipmentData.driver_number} readOnly />
                      </CCol>
                      {(shipmentData.vehicle_type_id == 1 || shipmentData.vehicle_type_id == 2) && (
                        <>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="OdometerKM">Odometer KM</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="OdometerKM"
                              value={shipmentData.parking_yard_info.odometer_km}
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="odoImg">Odometer Photo</CFormLabel>

                            {/* <CFormInput size="sm" id="inputAddress"  readOnly /> */}
                            <CButton
                              onClick={() => setOdometerPhoto(!OdometerPhoto)}
                              className="w-100"
                              color="info"
                              size="sm"
                              id="odoImg"
                            >
                              <span className="float-start">
                                <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                              </span>
                            </CButton>

                            <CModal visible={OdometerPhoto} onClose={() => setOdometerPhoto(false)}>
                              <CModalHeader>
                                <CModalTitle>Odometer Photo</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                                {shipmentData.parking_yard_info.odometer_photo &&
                                !shipmentData.parking_yard_info.odometer_photo.includes('.pdf') ? (
                                  <CCardImage
                                    orientation="top"
                                    src={shipmentData.parking_yard_info.odometer_photo}
                                  />
                                ) : (
                                  <iframe
                                    orientation="top"
                                    height={500}
                                    width={475}
                                    src={shipmentData.parking_yard_info.odometer_photo}
                                  ></iframe>
                                )}
                              </CModalBody>
                              {/* <CModalBody>
                <CCardImage orientation="top" src={singleVehicleInfo.odometer_photo} />
              </CModalBody> */}
                              <CModalFooter>
                                <CButton color="secondary" onClick={() => setOdometerPhoto(false)}>
                                  Close
                                </CButton>
                              </CModalFooter>
                            </CModal>
                          </CCol>
                        </>
                      )}
                      {/* </CRow>

                <CRow className=""> */}
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="gateInDateTime">Gate-In Time</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="gateInDateTime"
                          value={shipmentData.parking_yard_info.gate_in_date_time_string}
                          readOnly
                        />
                      </CCol>
                      {shipmentPYGData.vehicle_inspection && (
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="inspectionDateTime">Inspection Time</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="inspectionDateTime"
                            value={shipmentPYGData.vehicle_inspection.inspection_time_string}
                            readOnly
                          />
                        </CCol>
                      )}
                      {shipmentData.vehicle_type_id == 3 && (
                        <>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="verifyDate">Doc. Verify Time</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="verifyDate"
                              value={shipmentPYGData.vehicle_document.doc_verify_time_string}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="shedName">Shed Name</CFormLabel>

                            <CFormInput size="sm" id="shedName" value={shedData.shed_name} readOnly />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="ownerName">Owner Name</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="ownerName"
                              value={shedData.shed_owner_name}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="ownerMob">Owner Mobile Number</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="ownerMob"
                              value={shedData.shed_owner_phone_1}
                              readOnly
                            />
                          </CCol>{' '}
                        </>
                      )}
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                        <CFormInput size="sm" id="remarks" value={shipmentData.remarks} readOnly />
                        {/* <CFormTextarea name="remarks" id="remarks" rows="1"></CFormTextarea> */}
                      </CCol>
                    </CRow>
                    <br />
                    <CRow className="mt-1 mb-1">
                      <CCol
                        className="offset-md-6"
                        xs={15}
                        sm={15}
                        md={6}
                        style={{ display: 'flex', justifyContent: 'end' }}
                      >
                        <CButton
                          size="md"
                          color="warning"
                          className="px-3 text-white"
                          onClick={() => {
                            setODVisible(true)
                            setDeliveryInfo({
                              delivery_orders: [],
                              response: [],
                            })
                            setEmptySelect(false)
                          }}
                          type="button"
                        >
                          <span className="float-start">
                            <i className="" aria-hidden="true"></i> &nbsp;Add New Delivery
                          </span>
                        </CButton>
                      </CCol>
                    </CRow>
                    <CCard>
                      <CContainer>
                        <CustomTable columns={columns} data={rowData} showSearchFilter={true} />
                      </CContainer>
                    </CCard>

                    <CRow className="mt-3">
                      <CCol>
                        <Link to="/NlmtShipmentCreation">
                          <CButton size="sm" color="primary" className="text-white" type="button">
                            Previous
                          </CButton>
                        </Link>
                      </CCol>

                      <CCol
                        className="offset-md-7"
                        xs={12}
                        sm={12}
                        md={3}
                        style={{ display: 'flex', justifyContent: 'end' }}
                      >
                        {/* <CButton
                          size="sm"
                          color="warning"
                          // disabled={enableSubmit}
                          className="mx-3 px-3 text-white"
                          type="submit"
                        >
                          Submit
                        </CButton>
                        <CButton
                          size="sm"
                          // disabled={enableSubmit}
                          color="warning"
                          className="px-3 text-white"
                          type="submit"
                        >
                          Cancel
                        </CButton> */}
                      </CCol>
                    </CRow>
                  </CForm>
                </CTabPane>
              </CTabContent>
            </CCard>
            ) : (<AccessDeniedComponent />
          )}
          {/* ======================= Delivery Info Modal Area ========================== */}
          <CModal size="xl" visible={visible} onClose={() => setVisible(false)}>
            <CModalHeader>
              <CModalTitle>Delivery Order Details</CModalTitle>
            </CModalHeader>

            <CModalBody>
              <ShipmentDeliveryInfo
                all_delivery_data={shipmentDeliveryData}
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
            visible={deliveryDelete}
            onClose={() => {
              setDeliveryDelete(false)
              setDeliveryNoToDelete('')
              setDeliveryQty('')
              setDeliveryNetQty('')
              setShipmentToDelete('')
            }}
          >
            <CModalHeader
              style={{
                backgroundColor: '#ebc999',
              }}
            >
              <CModalTitle>Confirmation To Delete</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <p className="lead">
                {/* Are you sure to delete this Delivery - ({deliveryNoToDelete}) inside the Shipment - ({shipmentToDelete}) ? */}
                Are you sure to delete this Delivery ?
              </p>
              {/* <div>{deliveryQty}</div>
              <div>{shipmentData.shipment_qty}</div>
              <div>{(shipmentData.shipment_qty - deliveryQty).toFixed(2)}</div> */}
            </CModalBody>
            <CModalFooter>
              <CButton
                className="m-2"
                color="warning"
                onClick={() => {
                  deleteDelivery()
                  setFetch(false)
                  setDeliveryDelete(false)
                }}
              >
                Confirm
              </CButton>
              <CButton
                color="secondary"
                onClick={() => {
                  setDeliveryDelete(false)
                  setDeliveryNoToDelete('')
                  setDeliveryQty('')
                  setDeliveryNetQty('')
                  setShipmentToDelete('')
                }}
              >
                Cancel
              </CButton>
              {/* <CButton color="primary">Save changes</CButton> */}
            </CModalFooter>
          </CModal>

          {/* *********************************************************** */}
          {/* ======================= Delivery Insert Modal Area ========================== */}
          <CModal
            size="xl"
            // alignment="center"
            backdrop="static"
            scrollable
            visible={odVisible}
            onClose={() => setODVisible(false)}
          >
            <CModalHeader
              style={{
                backgroundColor: '#ebc999',
              }}
            >
              <CModalTitle>Open Delivery Details</CModalTitle>
            </CModalHeader>

            <CModalBody>
              <OpenDeliveryInfo
                getDeliveries={getDeliveries}
                fetchAllData={fetchAllData}
                division={'nlfd'}
              />
            </CModalBody>
            <CModalFooter>
              {emptySelect && (
                <span style={{ color: 'red' }}>
                  Please Choose Atleast One Delivery Order for Delivery Insert !{' '}
                </span>
              )}
              <CButton
                className="m-2"
                color="warning"
                onClick={() => {
                  checkModalDisplay()
                }}
              >
                Add Delivery
              </CButton>
              <CButton color="secondary" onClick={() => setODVisible(false)}>
                Cancel
              </CButton>
            </CModalFooter>
          </CModal>
          {/* *********************************************************** */}
        </>
      )}
    </>
  )
}

export default NlmtShipmentInfo
