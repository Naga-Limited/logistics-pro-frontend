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
  CFormCheck,
  CButtonGroup,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm'
import Loader from 'src/components/Loader'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import validate from 'src/Utils/Validation'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import VehicleCapacityApi from 'src/Service/SubMaster/VehicleCapacityApi'
import VehicleAssignmentSapService from 'src/Service/SAP/VehicleAssignmentSapService'
import CustomTable from 'src/components/customComponent/CustomTable'
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'
import OpenDeliveryInfo from './Segments/OpenDeliveryInfo'
import ShipmentDeliveryInfo from './Segments/ShipmentDeliveryInfo'
import * as ShipmentCreationModifyConstants from './Segments/ShipmentCreationModifyConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import Swal from 'sweetalert2'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
const DepoShipmentCreationShipmentInfo = () => {
  const { id } = useParams()
  const formValues = {
    shipment_info: '',
    vehicle_location_id:''
  }

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id
  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Vehicle_Assignment

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

  const navigation = useNavigate()
  const [rowData, setRowData] = useState([])
  const [deliveryInsertData, setDeliveryInsertData] = useState([])
  const [OdometerPhoto, setOdometerPhoto] = useState(false)

  const [shipmentRequestReject, setShipmentRequestReject] = useState(false)
  const [shipmentCreateReject, setShipmentCreateReject] = useState(false)
  const [shipmentApprovalRejectionRemarks, setShipmentApprovalRejectionRemarks] = useState('')
  const [tripCancel, setTripCancel] = useState(0)

  const handleChangenew = event => {
    let result = event.target.value.toUpperCase();

    setShipmentApprovalRejectionRemarks(result);

  };

  const tripCancelChange = event => {
    let resultt = event.target.value
    setTripCancel(resultt)
  }

  /* =========================== Delete Process Before SAP Shipment Creation Start =========================== */

  const largestFreightFinder = () => {
    var largest= 0;
    console.log(drawDeleteTableData,'largestFreightFinder-drawDeleteTableData')
    for (let i=0; i<drawDeleteTableData.length; i++){
      let org_freight = Number(parseFloat(drawDeleteTableData[i].delivery_depo_freight_amount).toFixed(2))
        if (org_freight > largest) {
            largest = org_freight;
        }
    }
    return largest
  }

  const totalQty_DrawDeleteTableData = () => {
    var qty= 0;
    console.log(drawDeleteTableData,'totalQty_DrawDeleteTableData')
    for (let i=0; i<drawDeleteTableData.length; i++){
      // let org_qty = Number(parseFloat(drawDeleteTableData[i].delivery_qty).toFixed(3))
      let org_qty = Number(parseFloat(drawDeleteTableData[i].delivery_net_qty).toFixed(3))
      qty += org_qty;
    }
    return Number(parseFloat(qty).toFixed(2))
  }

  const actualFreightValue_DrawDeleteTableData = () => {
    var frit1= 0;
    console.log(drawDeleteTableData,'actualFreightValue_DrawDeleteTableData')
    for (let i=0; i<drawDeleteTableData.length; i++){
      // let org_frit = Number(parseFloat(drawDeleteTableData[i].delivery_qty).toFixed(3)) * Number(parseFloat(largestFreightFinder()).toFixed(3))
      let org_frit = Number(parseFloat(drawDeleteTableData[i].delivery_net_qty).toFixed(3)) * Number(parseFloat(largestFreightFinder()).toFixed(3))
      frit1 += org_frit;
    }
    return Number(parseFloat(frit1).toFixed(2))
  }

  const budjetFreightValue_DrawDeleteTableData = () => {
    var frit= 0;
    console.log(drawDeleteTableData,'budjetFreightValue_DrawDeleteTableData')
    for (let i=0; i<drawDeleteTableData.length; i++){
      let org_frit = Number(parseFloat(drawDeleteTableData[i].delivery_net_qty).toFixed(3)) * Number(parseFloat(drawDeleteTableData[i].delivery_depo_freight_amount).toFixed(3))
      // let org_frit = Number(parseFloat(drawDeleteTableData[i].delivery_qty).toFixed(3)) * Number(parseFloat(drawDeleteTableData[i].delivery_depo_freight_amount).toFixed(3))
      frit += org_frit;
    }
    return Number(parseFloat(frit).toFixed(2))
  }

  /* =========================== Delete Process Before SAP Shipment Creation End =========================== */


  const [deliveryinfo, setDeliveryInfo] = useState({
    delivery_orders: [],
    response: [],
  })

  const [updatedinfo, setUpdatedInfo] = useState({
    insert_deliveries_data: [],
    actual_freight: '',
    budget_freight: '',
    add_enable: false,
  })

  /* Getting Delivery Numbers From Child Component */
  const getDeliveries = (data_need) => {
    setDeliveryInfo(data_need)
  }

  const [shipmentApproval, setShipmentApproval] = useState(true)

  /* Getting Delivery Numbers From Child Component */
  const getUpdates = (data_need) => {
    console.log(data_need,'getUpdates-data_need')
    if(data_need.actual_freight != data_need.budget_freight && shipmentPYGData.contractor_info.freight_type == 2){
      setShipmentApproval(true)
    } else {
      setShipmentApproval(false)
    }
    setUpdatedInfo(data_need)
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
  const [drawDeleteTableData, setDrawDeleteTableData] = useState([])


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
    // {
    //   name: 'SO Date',
    //   selector: (row) => formatDate(row.SaleOrder_Date),
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Delivery No',
      selector: (row) => row.Delivery_No,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Delivery Date',
    //   selector: (row) => formatDate(row.Delivery_Date),
    //   sortable: true,
    //   center: true,
    // },
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
      name: 'Freight Per MTS ',
      selector: (row) => row.Freight_MTS,
      sortable: true,
      center: true,
    },
    {
      name: 'Total Freight',
      selector: (row) => row.Total_Freight,
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

  const Total_Freight_Calculator = (qty,freight) => {

    let freight_updated = Number(qty).toFixed(2) * Number(freight).toFixed(2)

    return Number(freight_updated).toFixed(2)

  }

  const [shipmentData, setShipmentData] = useState([])
  const [emptySelect, setEmptySelect] = useState(false)
  const [openDeliveryData, setOpenDeliveryData] = useState([])
  const [shipmentPYGData, setShipmentPYGData] = useState([])
  const [shedData, setShedData] = useState([])
  const [fetch, setFetch] = useState(false)
  const [vCapacity, setVCapacity] = useState('')
  const [weighmentDepoData, setWeighmentDepoData] = useState([]) 

  useEffect(() => {
    DepoShipmentCreationService.getSingleDepoShipment(id).then((res) => {
      console.log(res.data.data,'getSingleDepoShipment')
      setShipmentData(res.data.data)
      values.vehicle_location_id = res.data.data.vehicle_location_id

      DepoShipmentCreationService.getSingleDepoShipmentPYGData(res.data.data.parking_id).then((rest) => {
        setShipmentPYGData(rest.data.data)
        console.log(rest.data.data,'getSingleDepoShipmentPYGData')
        let needed_data = rest.data.data

        VehicleCapacityApi.getVehicleCapacityById(needed_data.vehicle_info.vehicle_capacity_id).then(
        (response) => {
          let editData = response.data.data
          setVCapacity(editData.capacity)
        })

        // if (needed_data.vehicle_type_id.id == 3) {
        //   ShedService.SingleShedData(needed_data.vehicle_document.shed_id).then((resp) => {
        //     setShedData(resp.data.data)
        //     console.log(resp.data.data)
        //   })
        // }

        setFetch(true)
      })
    })

    /* section for getting Weighment Depo Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(37).then((response) => {

      let viewData = response.data.data
      console.log(viewData, 'viewData - Weighment Depo Lists')
      let rowDataList_location = []
      viewData.map((data, index) => {
        if(data.definition_list_status == 1)
          {
            rowDataList_location.push({
              sno: index + 1,
              depo_name: data.definition_list_name,
              depo_code: data.definition_list_code,
              depo_status: data.definition_list_status,
            
            })
          }
      })

      setWeighmentDepoData(rowDataList_location)
    })
  }, [])

  useEffect(() => {
    DepoShipmentCreationService.getSingleDepoShipmentChildInfo(id).then((response) => {
      // setFetch(true)
      let viewData = response.data.data
      setShipmentDeliveryData(response.data.data)
      console.log(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          SaleOrder_No: data.sale_order_info.SaleOrderNumber,
          SaleOrder_Date: data.sale_order_info.SaleOrderDate,
          Delivery_No: data.delivery_no,
          Delivery_Date: data.delivery_date,
          Delivery_Status: data.delivery_status,
          Customer_Name: data.customer_info.CustomerName,
          Customer_City: data.customer_info.CustomerCity,
          Customer_Route: data.customer_info.CustomerRoute,
          // Delivery_Qty: data.delivery_qty,
          Delivery_Qty: data.delivery_net_qty,
          Freight_MTS: data.delivery_depo_freight_amount,
          // Total_Freight:  Total_Freight_Calculator(data.delivery_qty,data.delivery_depo_freight_amount),
          Total_Freight:  Total_Freight_Calculator(data.delivery_net_qty,data.delivery_depo_freight_amount),
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
              {/* {(!(shipmentData.shipment_no == '0' || shipmentData.shipment_no == null) && shipmentData.shipment_child_info.length > 1) && ( */}
              {(!(shipmentData.shipment_no == '0' || shipmentData.shipment_no == null) && shipmentData.shipment_delivery_info.length > 1) && (
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
              )}
            </div>
          ),
        })
      })
      setRowData(rowDataList)
    })
  }, [shipmentData])

  const drawTableData = (deliveryNo) => {
    // setDrawDeleteTableData
    // console.log(deliveryNo,'deliveryNo')
    let data_del = []
    // console.log(shipmentDeliveryData,'shipmentDeliveryData')
    data_del = shipmentDeliveryData.filter((data) => data.delivery_no != deliveryNo)
    console.log(data_del,'data_del')
    setDrawDeleteTableData(data_del)
  }

  useEffect(()=>{

    if(deliveryDelete){

      drawTableData(deliveryNoToDelete)
    } else {
      setDrawDeleteTableData([])
    }

  },[deliveryDelete])

  const delivery_depo_freight_amount_calculator = (del_no) => {

    let del_data = updatedinfo.insert_deliveries_data
    let del_freight = 0.00

    del_data.map((val1,ind1)=>{
      if(val1.deliveryNo == del_no){
        del_freight = val1.deliveryFreight
      }
    })

    return Number(del_freight).toFixed(2)
  }

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    login,
    validate,
    formValues
  )

  function checkModalDisplay(type) {

    console.log(openDeliveryData,'openDeliveryData')
    console.log(updatedinfo,'updatedinfo')
    console.log(deliveryinfo,'deliveryinfo')
    var del_orders_array = deliveryinfo.delivery_orders
    console.log(del_orders_array)
    var shipment_details1 = []
    var shipment_details2 = []

    // return false

    /* Create Shipment JSON String for DB Update */
    /*========(Start)================================================================================*/

    del_orders_array.map((value_item1, key_item1) => {
      console.log(value_item1)
      openDeliveryData.map((value_item, key_item) => {
        if (value_item1 == value_item.DeliveryOrderNumber) {
          value_item['delivery_sequence'] = key_item1 + 1
          value_item['delivery_depo_freight_amount'] = delivery_depo_freight_amount_calculator(value_item.DeliveryOrderNumber)
          shipment_details2.push(value_item)
        }
      })
    })

    // console.log(shipment_details1)
    console.log(shipment_details2)
    setDeliveryInsertData(shipment_details2)
    values.shipment_info = JSON.stringify(shipment_details2)

    /*=========(End)=================================================================================*/

    if (Object.keys(deliveryinfo.response).length > 0) {
      setEmptySelect(false)
      // insertDelivery(shipment_details2)
      if(type == '1'){
        insertDeliveryAfterShipmentCreation(shipment_details2,type)
      } else {
        insertDelivery(shipment_details2,type)
      }

      // setODVisible(false)
    } else {
      setEmptySelect(true)
      // toast.warning('Please Choose Atleast One Delivery Order for Delivery Insert !')
    }
  }

  // const pgiUpdateInDb = (json_data) => {
  //   // console.log(json_data)
  //   VehicleAssignmentService.updatePgiInfoToDb(json_data).then((res) => {
  //     console.log(res)
  //   })
  // }

  // const deliveryQuantityUpdateInDb = (json_data) => {
  //   // console.log(json_data)
  //   VehicleAssignmentService.updateDeliveryQuantityInfoToDb(json_data).then((res) => {
  //     console.log(res)
  //   })
  // }

  // const secondWeightUpdateInDb = (json_data) => {
  //   // console.log(json_data)
  //   VehicleAssignmentService.updateSecondWeightInfoToDb(json_data).then((res) => {
  //     console.log(res)
  //   })
  // }

  const vehicleTypeFind = (id) => {
    if (id == 1) {
      return 'Own'
    } else if (id == 2) {
      return 'Contract'
    } else if (id == 3) {
      return 'Hire'
    } else {
      return 'Party'
    }
  }

  function login() {
    alert('No Errors CallBack Called')
  }

  useEffect(() => {
    // /* section for getting PGI Info Details from SAP */
    // VehicleAssignmentSapService.getPGIInfoData().then((res) => {
    //   console.log(res.data)
    //   let response_info = res.data
    //   if (response_info.length > 0) {
    //     pgiUpdateInDb(JSON.stringify(response_info))
    //   } else {
    //     console.log('Nothing to Update PGI Info')
    //   }
    // })

    // /* section for getting Delivery Quantity update Details from SAP */
    // VehicleAssignmentSapService.getDeliveryQuantityInfoData().then((res) => {
    //   console.log(res.data)
    //   let response_info = res.data
    //   if (response_info.length > 0) {
    //     deliveryQuantityUpdateInDb(JSON.stringify(response_info))
    //   } else {
    //     console.log('Nothing to Update Delivery Quantity Info')
    //   }
    // })

    // /* section for getting 2nd Weight Info Details from SAP */
    // VehicleAssignmentSapService.getSecondWeightInfoData().then((res) => {
    //   console.log(res.data)
    //   let response_info = res.data
    //   if (response_info.length > 0) {
    //     secondWeightUpdateInDb(JSON.stringify(response_info))
    //   } else {
    //     console.log('Nothing to Update 2nd Weight Info')
    //   }
    // })
  }, [])

  /* Delivery Insert Request sent for Approval - After Shipment Creation Process */
  const insertDeliveryAfterShipmentCreation = (data_for_inserted_deliveries, process) => {
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

    console.log(totalShipmentQuantity,'totalShipmentQuantity')
    console.log(shipmentData.initial_shipment_qty,'initial_shipment_qty')
    console.log(shipmentData,'shipmentData-shipmentData')

    var ShipmentCreationSendData = {}
    var ShipmentCreationSendData_seq = []

    /* Set Shipment Data via Selected Deliveries by Loop */
    for (var i = 0; i < data_for_inserted_deliveries.length; i++) {
      ShipmentCreationSendData.STATUS = '1'
      ShipmentCreationSendData.SHIPMENT_NO = id
      ShipmentCreationSendData.vbeln = data_for_inserted_deliveries[i].DeliveryOrderNumber
      ShipmentCreationSendData.TRIP_SHEET = shipmentData.trip_sheet_info.depo_tripsheet_no

      ShipmentCreationSendData_seq[i] = ShipmentCreationSendData

      ShipmentCreationSendData = {}
    }

    console.log(ShipmentCreationSendData_seq,'ShipmentCreationSendData_seq')
    console.log(values.shipment_info,'values.shipment_info')
    console.log(updatedinfo,'updatedinfo-updatedinfo')

    const formDataForDBUpdate = new FormData()
    formDataForDBUpdate.append('shipment_id', id)
    formDataForDBUpdate.append('updated_by', user_id)
    formDataForDBUpdate.append('approval_needed', process) /* process 1-yes, 0-no */

    // formDataForDBUpdate.append('shipment_status', '2')
    formDataForDBUpdate.append('shipment_info', values.shipment_info)
    // formDataForDBUpdate.append('delivery_status', '2')

    formDataForDBUpdate.append('shipment_qty', totalShipmentQuantity)
    formDataForDBUpdate.append('shipment_net_qty', totalShipmentNetQuantity)
    formDataForDBUpdate.append('actual_freight_amount', updatedinfo.actual_freight)
    formDataForDBUpdate.append('budget_freight_amount', updatedinfo.budget_freight)

    DepoShipmentCreationService.updateShipmentOrderAfterShipmentCreation(formDataForDBUpdate)
      .then((res) => {
      setFetch(true)
      if (res.status == 200) {
        // toast.success('Shipment Delivery Inserted Successfully!')
        // navigation('/Dashboard')
        Swal.fire({
          title: "Delivery Insert Request Sent Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/Dashboard')
        });
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

  }

  const DepoVehicleTypeFinder = () => {
    let vt = 'DEPO' 
    console.log(weighmentDepoData,'weighmentDepoData')
    console.log(values.vehicle_location_id,'weighmentDepoData-vehicle_location_id')
    weighmentDepoData.map((data, index) => {
      if(data.depo_code == values.vehicle_location_id)
      {
        vt = 'APK_DEPO'
      }
    })
    return vt
  }

  /* Delivery Insert Process - without approval */
  const insertDelivery = (data_for_inserted_deliveries,process) => {
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
    console.log(shipmentData,'shipmentData-shipmentData')
    console.log(shipmentData.initial_shipment_qty,'initial_shipment_qty')

    var ShipmentCreationSendData = {}
    var ShipmentCreationSendData_seq = []

    /* Set Shipment Data via Selected Deliveries by Loop */
    for (var i = 0; i < data_for_inserted_deliveries.length; i++) {
      ShipmentCreationSendData.STATUS = '1'
      ShipmentCreationSendData.SHIPMENT_NO = shipmentData.shipment_no
      ShipmentCreationSendData.vbeln = data_for_inserted_deliveries[i].DeliveryOrderNumber
      ShipmentCreationSendData.TRIP_SHEET = shipmentData.trip_sheet_info.depo_tripsheet_no
      // ShipmentCreationSendData.VEH_TYPE = 'DEPO'
      ShipmentCreationSendData.VEH_TYPE = DepoVehicleTypeFinder()
      ShipmentCreationSendData.SIGNI = shipmentData.trip_vehicle_info.vehicle_number

      ShipmentCreationSendData_seq[i] = ShipmentCreationSendData

      ShipmentCreationSendData = {}
    }

    console.log(ShipmentCreationSendData_seq,'ShipmentCreationSendData_seq')
    console.log(values.shipment_info,'values.shipment_info')
    console.log(updatedinfo,'updatedinfo-updatedinfo')

    // return false

    VehicleAssignmentSapService.updateShipmentByDeliveryInsert(ShipmentCreationSendData_seq).then(
      (res) => {
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
          formDataForDBUpdate.append('shipment_id', id)
          formDataForDBUpdate.append('updated_by', user_id)
          formDataForDBUpdate.append('approval_needed', process) /* process 1-yes, 0-no */
          formDataForDBUpdate.append('shipment_info', values.shipment_info)

          formDataForDBUpdate.append('shipment_qty', totalShipmentQuantity)
          formDataForDBUpdate.append('shipment_net_qty', totalShipmentNetQuantity)
          formDataForDBUpdate.append('actual_freight_amount', updatedinfo.actual_freight)
          formDataForDBUpdate.append('budget_freight_amount', updatedinfo.budget_freight)

          DepoShipmentCreationService.updateShipmentOrderAfterShipmentCreation(formDataForDBUpdate).then((res) => {
            setFetch(true)
            if (res.status == 200) {
              // toast.success('Shipment Delivery Inserted Successfully!')
              // navigation('/Dashboard')
              Swal.fire({
                title: "Shipment Delivery Inserted Successfully!",
                icon: "success",
                confirmButtonText: "OK",
              }).then(function () {
                window.location.reload(false)
              });
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

    var editedShipmentQuantity = (Number(shipmentData.initial_shipment_qty) - Number(deliveryQty)).toFixed(2)

    if(shipmentData.initial_shipment_net_qty){
      var editedShipmentNetQuantity = (Number(shipmentData.initial_shipment_net_qty) - Number(deliveryNetQty)).toFixed(2)
    }

    console.log(budjetFreightValue_DrawDeleteTableData(),'budjetFreightValue_DrawDeleteTableData')
    console.log(actualFreightValue_DrawDeleteTableData(),'actualFreightValue_DrawDeleteTableData')
    console.log(shipmentData.initial_shipment_qty,'shipmentData.initial_shipment_qty')
    console.log(deliveryQty,'deliveryQty')
    console.log(shipmentToDelete,'shipmentToDelete')
    console.log(deliveryNoToDelete,'deliveryNoToDelete')
    console.log(deliveryNetQty,'deliveryNetQty')
    console.log(editedShipmentQuantity,'editedShipmentQuantity')
    console.log(shipmentData.trip_sheet_info.depo_tripsheet_no,'shipmentData.trip_sheet_info.depo_tripsheet_no')

    // return false

    const formDataForSAPDeliveryDelete = new FormData()
    formDataForSAPDeliveryDelete.append('STATUS', '2')
    formDataForSAPDeliveryDelete.append('SHIPMENT_NO', shipmentToDelete)
    formDataForSAPDeliveryDelete.append('vbeln', deliveryNoToDelete)
    formDataForSAPDeliveryDelete.append('TRIP_SHEET', shipmentData.trip_sheet_info.depo_tripsheet_no)

    VehicleAssignmentSapService.updateShipment(formDataForSAPDeliveryDelete)
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
          formDataForDBUpdate.append('process', 'delete')
          formDataForDBUpdate.append('shipment_id', id)
          formDataForDBUpdate.append('updated_by', user_id)
          formDataForDBUpdate.append('delivery_status', '2')
          formDataForDBUpdate.append('shipment_qty', editedShipmentQuantity)
          formDataForDBUpdate.append('shipment_net_qty', editedShipmentNetQuantity)
          formDataForDBUpdate.append('delivery_no', deliveryNoToDelete)
          formDataForDBUpdate.append('budget_freight_amount', budjetFreightValue_DrawDeleteTableData())
          formDataForDBUpdate.append('actual_Freight_amount', actualFreightValue_DrawDeleteTableData())

          DepoShipmentCreationService.updateDepoShipmentOrder(id, formDataForDBUpdate)
            .then((res) => {
              setFetch(true)
              if (res.status == 200) {
                Swal.fire({
                  title: "Delivery Deleted Successfully!",
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(function () {
                  window.location.reload(false)
                });
              }  else if (res.status == 201) {
                Swal.fire({
                  title: res.data.message,
                  icon: "warning",
                  confirmButtonText: "OK",
                }).then(function () {
                  window.location.reload(false)
                });
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

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard>
                <CTabContent>
                  <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                    <CForm className="container p-3" onSubmit={handleSubmit}>
                    <CRow className="">
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
                              <CFormLabel htmlFor="vNum">Tripsheet & Vehicle Number</CFormLabel>
                              <CFormInput
                                name="vNum"
                                size="sm"
                                id="vNum"
                                value={`${shipmentData.trip_sheet_info.depo_tripsheet_no} - ${shipmentPYGData.vehicle_info.vehicle_number}`}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vcim">Vehicle Capacity In MTS</CFormLabel>
                              <CFormInput
                                name="vcim"
                                size="sm"
                                id="vcim"
                                value={shipmentPYGData.vehicle_info.vehicle_capacity_info.capacity}
                                readOnly
                              />
                            </CCol>
                          </CRow>

                          <CRow className="">
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vbt">Vehicle Body Type</CFormLabel>
                              <CFormInput
                                name="vbt"
                                size="sm"
                                id="vbt"
                                value={shipmentPYGData.vehicle_info.vehicle_body_type_info.body_type}
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
                          </CRow>
                          <CRow className="">
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
                          </CRow>

                          <CRow className="mt-2">
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

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Shipment Request Date & Time</CFormLabel>

                              <CFormInput size="sm" id="tNum" value={shipmentData.shipment_date_time_string} readOnly />
                            </CCol>

                            {shipmentData.shipment_no && (
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Shipment Number</CFormLabel>

                                <CFormInput size="sm" id="tNum" value={shipmentData.shipment_no} readOnly />
                              </CCol>
                            )}

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Shipment Quantity in MTS</CFormLabel>

                              <CFormInput size="sm" id="tNum" value={shipmentData.initial_shipment_net_qty} readOnly />
                              {/* <CFormInput size="sm" id="tNum" value={shipmentData.initial_shipment_qty} readOnly /> */}
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                              <CFormInput size="sm" id="remarks" value={shipmentData.remarks} readOnly />
                            </CCol>
                          {/* </CRow>

                          <CRow className="mt-2"> */}

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="remarks">Budget Freight Amount</CFormLabel>
                              <CFormInput size="sm" id="remarks" value={shipmentData.shipment_depo_budget_freight_amount} readOnly />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="remarks">Actual Freight Amount</CFormLabel>
                              <CFormInput size="sm" id="remarks" value={shipmentData.shipment_depo_actual_freight_amount} readOnly />
                            </CCol>

                            {/* <CCol xs={12} md={3}></CCol> */}
                            {!(shipmentData.shipment_no == '0' || shipmentData.shipment_no == null) && (
                              <CCol

                                // className="offset-md-22"
                                xs={12}
                                // sm={15}
                                md={3}
                                // style={{ display: 'flex', justifyContent: 'center' }}
                              >

                                <CButton
                                  size="md"
                                  color="warning"
                                  className="px-3 mt-3 text-white"
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
                            )}
                          </CRow>

                      <CCard>
                        <CContainer>
                          <CustomTable columns={columns} data={rowData} showSearchFilter={true} />
                        </CContainer>
                      </CCard>
                    </CForm>
                  </CTabPane>
                </CTabContent>
              </CCard>
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
                        <CAlert color="danger">
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
                size="xl"
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
                    Are you sure to delete this Delivery - ({deliveryNoToDelete}) {shipmentToDelete ? `inside the Shipment ${shipmentToDelete}` :''}
                    {/* Are you sure to delete this Delivery ? */}
                  </p>
                  <CTable
                      style={{ height: 'auto' }}
                    >
                      <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                        <CTableRow>
                          <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '5%' }}
                            data-coreui-toggle="tooltip"
                            data-coreui-placement="top"
                            title="Sequence"
                          >
                            Seq.
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ color: 'white', width: '8%' }}>
                            Delivery No.
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white', width: '21%' }}>
                            Customer Name
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ color: 'white', width: '20%' }}>
                            Depo - Route
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            scope="col"
                            style={{ color: 'white', width: '8%' }}
                            data-coreui-toggle="tooltip"
                            data-coreui-placement="top"
                            title="Quantity in MTS"
                          >
                            Qty / MTS
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ color: 'white', width: '13%' }}>
                            Budget Freight / MTS
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ color: 'white', width: '13%' }}>
                            Actual Freight / MTS
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ color: 'white', width: '13%' }}>
                            Budget Freight Value
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ color: 'white', width: '13%' }}>
                            Actual Freight Value
                          </CTableHeaderCell>

                        </CTableRow>
                      </CTableHead>
                      <CTableBody>

                        {drawDeleteTableData.map((data, index) => {
                          console.log(data,'datareturn')
                          return (
                            <>
                              <CTableRow key={`test${index}`} style={{ background: '#ebc999' }}>
                                <CTableDataCell style={{ width: '5%' }}>{index + 1}</CTableDataCell>
                                <CTableDataCell style={{ width: '8%' }}>
                                  {data.delivery_no}
                                </CTableDataCell>
                                <CTableDataCell style={{ width: '21%' }}>
                                  {data.customer_info.CustomerName}
                                </CTableDataCell>
                                <CTableDataCell style={{ width: '20%' }}>
                                {data.customer_info.CustomerRoute}
                                </CTableDataCell>
                                <CTableDataCell style={{ width: '8%' }}>
                                  {/* {data.delivery_qty} */}
                                  {data.delivery_net_qty}
                                </CTableDataCell>
                                <CTableDataCell style={{ width: '13%' }}>
                                {data.delivery_depo_freight_amount}
                                </CTableDataCell>
                                <CTableDataCell style={{ width: '13%' }}>
                                  {ShipmentCreationModifyConstants.largestFreightFinder(drawDeleteTableData,1,[])}
                                </CTableDataCell>
                                <CTableDataCell style={{ width: '13%' }}>
                                  {ShipmentCreationModifyConstants.freightValueFinder(data.delivery_net_qty,data.delivery_depo_freight_amount)}
                                  {/* {ShipmentCreationModifyConstants.freightValueFinder(data.delivery_qty,data.delivery_depo_freight_amount)} */}
                                </CTableDataCell>
                                <CTableDataCell style={{ width: '13%' }}>
                                  {ShipmentCreationModifyConstants.freightValueFinder(data.delivery_net_qty,largestFreightFinder())}
                                  {/* {ShipmentCreationModifyConstants.freightValueFinder(data.delivery_qty,largestFreightFinder())} */}
                                </CTableDataCell>

                              </CTableRow>
                            </>
                          )
                        })}
                        <CTableRow style={{ background: '#ebc999'}}>
                          <CTableDataCell style={{ width: '5%' }}> </CTableDataCell>
                          <CTableDataCell style={{ width: '8%' }}> </CTableDataCell>
                          <CTableDataCell style={{ width: '21%' }}>
                          </CTableDataCell>
                          <CTableDataCell style={{ width: '20%' }}>
                            <b>Total</b>
                          </CTableDataCell>
                          <CTableDataCell style={{ width: '8%' }}>
                            <b>{totalQty_DrawDeleteTableData()}</b>
                          </CTableDataCell>
                          <CTableDataCell style={{ width: '13%' }}>
                            <b>-</b>
                          </CTableDataCell>
                          <CTableDataCell style={{ width: '13%' }}>
                            <b>-</b>
                          </CTableDataCell>
                          <CTableDataCell style={{ width: '13%' }}>
                            <b>{budjetFreightValue_DrawDeleteTableData()}</b>
                          </CTableDataCell>
                          <CTableDataCell style={{ width: '13%' }}>
                          <b>{actualFreightValue_DrawDeleteTableData()}</b>
                          </CTableDataCell>

                        </CTableRow>

                      </CTableBody>
                    </CTable>
                  {/* <div>
                  </div>
                  <div>{shipmentData.initial_shipment_qty}</div>
                  <div>{(shipmentData.initial_shipment_qty - deliveryQty).toFixed(2)}</div> */}
                </CModalBody>
                <CModalFooter>
                  <CButton
                    className="m-2"
                    color="warning"
                    onClick={() => {
                      deleteDelivery()
                      setDeliveryDelete(false)
                      setFetch(false)
                      // deleteDeliveryInAdvance()
                    }}
                  >
                    Yes
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
                    No
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
                    shipmentData={shipmentData}
                    getUpdates={getUpdates}
                  />
                </CModalBody>
                <CModalFooter>
                  {emptySelect && (
                    <span style={{ color: 'red' }}>
                      Please Choose Atleast One Delivery Order for Delivery Insert !{' '}
                    </span>
                  )}

                  {updatedinfo.add_enable && (
                    <>
                    {shipmentApproval && (<span style={{ color: 'indigo',marginRight:'5%',fontWeight:'bolder' }}>Added Delivery will be sent to Shipment Approval..</span>)}
                      <CButton
                        className="m-2"
                        color="warning"
                        onClick={() => {
                          // checkModalDisplay()
                          shipmentApproval ? checkModalDisplay(1) : checkModalDisplay(0)
                        }}
                        // visible={!emptySelect}
                      >
                        {/* Add Delivery */}
                        {shipmentApproval ? 'Add' : 'Add Delivery'}
                      </CButton>

                      <CButton color="secondary" onClick={() => setODVisible(false)}>
                        Close
                      </CButton>
                    </>
                  )}
                </CModalFooter>
              </CModal>
              {/* *********************************************************** */}
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default DepoShipmentCreationShipmentInfo
