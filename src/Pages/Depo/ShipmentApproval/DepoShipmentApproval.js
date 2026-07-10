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
import VehicleCapacityApi from 'src/Service/SubMaster/VehicleCapacityApi'
import CustomTable from 'src/components/customComponent/CustomTable'
import ShipmentDeliveryInfo from 'src/Pages/ShipmentCreation/Segments/ShipmentDeliveryInfo'
import OpenDeliveryInfo from 'src/Pages/ShipmentCreation/Segments/OpenDeliveryInfo'
import DepoShipmentCreationService from 'src/Service/Depo/Shipment/DepoShipmentCreationService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import Swal from 'sweetalert2'
const DepoShipmentApproval = () => {
  const { id } = useParams()
  const formValues = {
    shipment_info: '',
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
   let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Shipment_Approval

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

  const [shipmentRequestApproval, setShipmentRequestApproval] = useState(false)
  const [deliveryInsertRequestReject, setDeliveryInsertRequestReject] = useState(false)
  const [shipmentRequestReject, setShipmentRequestReject] = useState(false)
  const [shipmentCreateApproval, setShipmentCreateApproval] = useState(false)
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

  /* Manager Approval */
  const Shipment_Request_Approval = () => {

    let data = new FormData()

    data.append('request_remarks', shipmentApprovalRejectionRemarks)
    data.append('shipment_id', id)
    data.append('updated_by', user_id)

    console.log(shipmentApprovalRejectionRemarks,'shipmentApprovalRejectionRemarks1')

    DepoShipmentCreationService.confirmShipmentRequest(data).then((response) => {
      setFetch(true)
      console.log(response,'response')

      if (response.status == 200) {
        Swal.fire({
          icon: "success",
          title: 'Approved Successfully!',
          text: shipmentData.approval_status == '1' ? 'Shipment Creation Request Approved..' : 'Delivery Insert Request Approved..',
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/DepoShipmentApprovalTable')
        });
      }  else if (response.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/DepoShipmentApprovalTable')
        });
      } else {
        toast.warning('Shipment Cannot be Approved. Kindly contact Admin..!')
      }

    })
  }

  /* Manager Reject */
  const Shipment_Request_Reject = () => {
    let data = new FormData()

    data.append('request_remarks', shipmentApprovalRejectionRemarks)
    data.append('shipment_id', id)
    data.append('updated_by', user_id)
    data.append('trip_cancel', tripCancel)

    console.log(shipmentApprovalRejectionRemarks,'shipmentApprovalRejectionRemarks2')

    DepoShipmentCreationService.rejectShipmentRequest(data).then((response) => {
      setFetch(true)
      console.log(response,'response')

      if (response.status == 200) {
        Swal.fire({
          title: "Shipment Request Rejected Successfully!",
          // text:  'SAP Document No - ' + values.sap_fi_document_no,
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          // Redirect to Approval Home Page
          navigation('/DepoShipmentApprovalTable')
        });
      }  else if (response.status == 201) {
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // Redirect to Approval Home Page
          navigation('/DepoShipmentApprovalTable')
        });
      } else {
        toast.warning('Shipment Cannot be Rejected. Kindly contact Admin..!')
      }

    })
  }

  const Delivery_Insert_Request_Reject = () => {
    let data = new FormData()

    data.append('request_remarks', shipmentApprovalRejectionRemarks)
    data.append('shipment_id', id)
    data.append('updated_by', user_id)
    data.append('temp', 1)

    console.log(shipmentApprovalRejectionRemarks,'shipmentApprovalRejectionRemarks2')
    DepoShipmentCreationService.rejectDeliveryInsertRequest(data).then((response) => {
      setFetch(true)
      console.log(response,'response')

      if (response.status == 200) {
        // toast.success('Delivery Insert Request Rejected Successfully!')
        // navigation('/DepoShipmentApprovalTable')
        Swal.fire({
          title: "Delivery Insert Request Rejected Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function () {
          // Redirect to Approval Home Page
          navigation('/DepoShipmentApprovalTable')
        });
      }  else if (response.status == 201) {
        // toast.success(response.data.message)
        // navigation('/DepoShipmentApprovalTable')
        Swal.fire({
          title: response.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // Redirect to Approval Home Page
          navigation('/DepoShipmentApprovalTable')
        });
      } else {
        toast.warning('Shipment Cannot be Rejected. Kindly contact Admin..!')
      }

    })

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
    // {
    //   name: 'Updation',
    //   // selector: (row) => row.Delivery_Status == '4' ? '➕ Insertion ➕' : '-',
    //   selector: (row) => row.Delivery_Status == '4' ? 'Insertion' : '-',
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Del. Status',
      // selector: (row) => row.Delivery_Status == '4' ? 'Insertion' : '-',
      selector: (row) => row.Delivery_Status == '4' ? 'Wait for Approval' : (row.Delivery_Shipment != null ?  'Assigned' : 'Waiting'),
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
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  const Total_Freight_Calculator = (qty,freight) => {

    let freight_updated = Number(qty).toFixed(2) * Number(freight).toFixed(2)

    return Number(freight_updated).toFixed(2)

  }

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
          Delivery_Shipment: data.shipment_no,
          Customer_Name: data.customer_info.CustomerName,
          Customer_City: data.customer_info.CustomerCity,
          Customer_Route: data.customer_info.CustomerRoute,
          Delivery_Qty: data.delivery_net_qty,
          Freight_MTS: data.delivery_depo_freight_amount,
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

              <CButton
                style={{ display: 'none' }}
                size="sm"
                color="danger"
                shape="rounded"
                id={data.id}
                disabled={data.delivery_status == 3}
                onClick={() => {
                  setDeliveryDelete(true)
                  setDeliveryNoToDelete(data.delivery_no)
                  setDeliveryQty(data.delivery_qty)
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
  }, [])

  const [shipmentData, setShipmentData] = useState([])
  const [emptySelect, setEmptySelect] = useState(false)
  const [openDeliveryData, setOpenDeliveryData] = useState([])
  const [shipmentPYGData, setShipmentPYGData] = useState([])
  const [shedData, setShedData] = useState([])
  const [fetch, setFetch] = useState(false)
  const [vCapacity, setVCapacity] = useState('')

  useEffect(() => {
    DepoShipmentCreationService.getSingleDepoShipment(id).then((res) => {
      console.log(res.data.data,'getSingleDepoShipment')
      setShipmentData(res.data.data)

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
  }, [])

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    login,
    validate,
    formValues
  )

  function login() {
    alert('No Errors CallBack Called')
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
                                value={`${shipmentData.shipment_no} - ${shipmentPYGData.vehicle_info.vehicle_number}`}
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
                              <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                              <CFormInput size="sm" id="remarks" value={shipmentData.remarks} readOnly />
                            </CCol>

                            {shipmentData.approval_status != '7' && (
                              <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="tNum">Shipment Quantity in MTS</CFormLabel>
                                  <CFormInput size="sm" id="tNum" value={shipmentData.initial_shipment_net_qty} readOnly />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="remarks">Budget Freight Amount</CFormLabel>
                                  <CFormInput size="sm" id="remarks" value={shipmentData.shipment_depo_budget_freight_amount} readOnly />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="remarks">Actual Freight Amount</CFormLabel>
                                  <CFormInput size="sm" id="remarks" value={shipmentData.shipment_depo_actual_freight_amount} readOnly />
                                </CCol>
                              </>
                            )}

                            {shipmentData.approval_status == '7' && (
                              <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="tNum">Old Shipment Quantity in MTS</CFormLabel>
                                  {/* <CFormInput size="sm" id="tNum" value={shipmentData.previous_data[0]} readOnly /> */}
                                  <CFormInput size="sm" id="tNum" value={shipmentData.previous_data[3]} readOnly />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="remarks">Old Budget Freight Amount</CFormLabel>
                                  <CFormInput size="sm" id="remarks" value={shipmentData.previous_data[2]} readOnly />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="remarks">Old Actual Freight Amount</CFormLabel>
                                  <CFormInput size="sm" id="remarks" value={shipmentData.previous_data[1]} readOnly />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="tNum">Updated Shipment Quantity in MTS</CFormLabel>
                                  {/* <CFormInput size="sm" id="tNum" value={shipmentData.initial_shipment_qty} readOnly /> */}
                                  <CFormInput size="sm" id="tNum" value={shipmentData.initial_shipment_net_qty} readOnly />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="remarks">Updated Budget Freight Amount</CFormLabel>
                                  <CFormInput size="sm" id="remarks" value={shipmentData.shipment_depo_budget_freight_amount} readOnly />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="remarks">Updated Actual Freight Amount</CFormLabel>
                                  <CFormInput size="sm" id="remarks" value={shipmentData.shipment_depo_actual_freight_amount} readOnly />
                                </CCol>
                              </>
                            )}
                          </CRow>

                      <br />
                      {/* <CRow className="mt-1 mb-1">
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
                      </CRow> */}
                      <CCard>
                        <CContainer>
                          <CustomTable columns={columns} data={rowData} showSearchFilter={true} />
                        </CContainer>
                      </CCard>

                      <CRow className="mt-3">
                        <CCol>
                          <Link to="/DepoShipmentApprovalTable">
                            <CButton size="sm" color="primary" className="text-white" type="button">
                              Previous
                            </CButton>
                          </Link>
                        </CCol>

                        {(shipmentData.approval_status == '1' || shipmentData.approval_status == '7') && (
                          <>
                            <CCol
                              className="pull-right"
                              xs={12}
                              sm={12}
                              md={3}
                              style={{ display: 'flex', justifyContent: 'flex-end' }}
                            >
                              <CButton
                                size="sm"
                                color="warning"
                                className="mx-1 px-2 text-white"
                                type="button"
                                onClick={() => {
                                  setShipmentRequestApproval(true)
                                }}
                              >
                                Approve
                              </CButton>

                              {shipmentData.approval_status == '1' && (
                                <CButton
                                  size="sm"
                                  color="warning"
                                  className="mx-1 px-2 text-white"
                                  type="button"
                                  onClick={() => {
                                    setShipmentRequestReject(true)
                                  }}
                                >
                                  Reject
                                </CButton>
                              )}


                              {shipmentData.approval_status == '7' && (
                                <CButton
                                  size="sm"
                                  color="warning"
                                  className="mx-1 px-2 text-white"
                                  type="button"
                                  onClick={() => {
                                    setDeliveryInsertRequestReject(true)
                                  }}
                                >
                                  Reject
                                </CButton>
                              )}
                            </CCol>
                          </>
                        )}

                      </CRow>
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

              {/* ======================= Confirm shipment Request ========================== */}

              <CModal
                visible={shipmentRequestApproval}
                onClose={() => {
                  setShipmentRequestApproval(false)
                  setShipmentApprovalRejectionRemarks('')
                }}
              >
                <CModalHeader
                  style={{
                    backgroundColor: '#ebc999',
                  }}
                >
                  <CModalTitle>Confirmation To Approval</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <p className="lead">

                    Are you sure to approve this shipment ?
                  </p>
                  <CRow>
                    <CCol xs={12} md={6}>
                      <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                      <CFormInput
                        size="sm"
                        id="shipmentAppovalRejectionremarks"
                        value={shipmentApprovalRejectionRemarks}
                        maxLength={30}
                        onChange={handleChangenew}
                      />
                    </CCol>
                  </CRow>

                </CModalBody>
                <CModalFooter>
                  <CButton
                    className="m-2"
                    color="warning"
                    onClick={() => {
                      setShipmentRequestApproval(false)
                      setFetch(false)
                      Shipment_Request_Approval()
                    }}
                  >
                    Yes
                  </CButton>
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setShipmentRequestApproval(false)
                      setShipmentApprovalRejectionRemarks('')
                    }}
                  >
                    No
                  </CButton>
                </CModalFooter>
              </CModal>

              {/* *********************************************************** */}
              {/* ======================= Reject shipment Request ========================== */}

              <CModal
                backdrop="static"
                scrollable
                visible={shipmentRequestReject}
                onClose={() => {
                  setShipmentRequestReject(false)
                  setShipmentApprovalRejectionRemarks('')
                }}
              >
                <CModalHeader
                  style={{
                    backgroundColor: '#ebc999',
                  }}
                >
                  <CModalTitle>Confirmation To Reject</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <p className="lead">

                    Are you sure to reject this shipment ?
                  </p>
                  <CRow>
                    <CCol xs={12} md={6}>
                      <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                      <CFormInput
                        size="sm"
                        id="shipmentAppovalRejectionremarks"
                        value={shipmentApprovalRejectionRemarks}
                        maxLength={30}
                        onChange={handleChangenew}
                      />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="trip_cancel">
                        Trip Cancel
                      </CFormLabel>
                      <br />
                      <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                        <CFormCheck
                          type="radio"
                          button={{ color: 'danger', variant: 'outline' }}
                          name="trip_cancel"
                          id="btnradio5"
                          autoComplete="off"
                          label="Yes"
                          value="1"
                          onChange={tripCancelChange}
                        />
                        <CFormCheck
                          type="radio"
                          button={{ color: 'success', variant: 'outline' }}
                          name="trip_cancel"
                          id="btnradio6"
                          autoComplete="off"
                          label="No"
                          value="0"
                          onChange={tripCancelChange}
                        />
                      </CButtonGroup>
                    </CCol>
                  </CRow>

                </CModalBody>
                <CModalFooter>
                  <CButton
                    className="m-2"
                    color="warning"
                    onClick={() => {

                      setFetch(false)
                      setShipmentRequestReject(false)
                      Shipment_Request_Reject()
                    }}
                  >
                    Reject
                  </CButton>
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setShipmentRequestReject(false)
                      setShipmentApprovalRejectionRemarks('')
                    }}
                  >
                    Cancel
                  </CButton>
                </CModalFooter>
              </CModal>

              {/* *********************************************************** */}
              {/* ======================= Reject Delivery Insert Request ========================== */}

              <CModal
                backdrop="static"
                scrollable
                visible={deliveryInsertRequestReject}
                onClose={() => {
                  setDeliveryInsertRequestReject(false)
                  setShipmentApprovalRejectionRemarks('')
                }}
              >
                <CModalHeader
                  style={{
                    backgroundColor: '#ebc999',
                  }}
                >
                  <CModalTitle>Confirmation To Reject</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <p className="lead">

                    Are you sure to reject the waiting delivery ?
                  </p>
                  <CRow>
                    <CCol xs={12} md={6}>
                      <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                      <CFormInput
                        size="sm"
                        id="shipmentAppovalRejectionremarks"
                        value={shipmentApprovalRejectionRemarks}
                        maxLength={30}
                        onChange={handleChangenew}
                      />
                    </CCol>
                  </CRow>
                </CModalBody>
                <CModalFooter>
                  <CButton
                    className="m-2"
                    color="warning"
                    onClick={() => {
                      setFetch(false)
                      setDeliveryInsertRequestReject(false)
                      // Shipment_Request_Reject()
                      Delivery_Insert_Request_Reject()
                    }}
                  >
                    Yes
                  </CButton>
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setDeliveryInsertRequestReject(false)
                      setShipmentApprovalRejectionRemarks('')
                    }}
                  >
                    No
                  </CButton>
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

export default DepoShipmentApproval

