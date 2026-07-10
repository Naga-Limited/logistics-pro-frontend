import {
    CButton,
    CCard,
    CContainer,
    CCol,
    CRow,
    CModal,
    CFormInput,
    CFormLabel,
    CModalHeader,
    CInputGroupText,
    CInputGroup,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CAlert,
    CTabPane,
    CTabContent,
    CNavItem,
    CNav,
    CNavLink,
    CCardImage,
  } from '@coreui/react'
  import React, { useState, useEffect } from 'react'
  import { useNavigate } from 'react-router-dom'
  import { toast } from 'react-toastify'
  import 'react-toastify/dist/ReactToastify.css'
  import Webcam from 'react-webcam'
  import Loader from 'src/components/Loader'
  import SmallLoader from 'src/components/SmallLoader'
  import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/NlmtExpenseIncomePostingDate'
  import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
  import Swal from 'sweetalert2'
  import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
  import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
  import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import VehicleCapacityApi from 'src/Service/SubMaster/VehicleCapacityApi'
import ShedService from 'src/Service/SmallMaster/Shed/ShedService'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
import { imageUrlValidation } from '../Depo/CommonMethods/CommonMethods'

  const InvoiceAttachment = () => {
    const REQ = () => <span className="text-danger"> * </span>

    /*================== User Id & Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    const user_locations = []
    const is_admin = user_info.user_id == 1 && user_info.is_admin == 1

    if(is_admin){
      console.log(user_info)
    }

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    const Expense_Income_Posting_Date = ExpenseIncomePostingDate();
    console.log(Expense_Income_Posting_Date,'ExpenseIncomePostingDate')

    /* Get User Id From Local Storage */
    const user_id = user_info.user_id

    // console.log(user_locations)
    /*================== User Location Fetch ======================*/

    /* ==================== Access Part Start ========================*/
    const [screenAccess, setScreenAccess] = useState(false)
    let page_no = LogisticsProScreenNumberConstants.InvoiceReport.Invoice_Attachment_Screen

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

    const [fetch, setFetch] = useState(false)
    const [smallfetch, setSmallFetch] = useState(false)
    const [pageList, setPageList] = useState([])
    const [activeKey, setActiveKey] = useState(1)

    const [errorModal, setErrorModal] = useState(false)
    const [error, setError] = useState({})


    // =============================================================================================== //

    const [shipmentNumberNew, setShipmentNumberNew] = useState('');
    const handleChangenewShipment = event => {
        let getData6 = event.target.value.replace(/\D/g, '')
      let tripResult = getData6.toUpperCase();
      setShipmentNumberNew(tripResult.trim());

    };

    const [shipmentHaving, setShipmentHaving] = useState(false)
    const [shipmentData, setShipmentData] = useState([])
    const [shipmentPYGData, setShipmentPYGData] = useState([])
    const [shedData, setShedData] = useState([])
    const [vCapacity, setVCapacity] = useState('')
    const [clearValuesObject, setClearValuesObject] = useState(false)
    const [fileImageKey, setFileImageKey] = useState('')
    const webcamRef = React.useRef(null);
    const [camEnable, setCamEnable] = useState(false)
    const [uploadedCamEnable, setUploadedCamEnable] = useState(false)
    const [camEnableType, setCamEnableType] = useState('')
    const [imgSrc, setImgSrc] = React.useState(null);
    const [uploadedImgSrc, setUploadedImgSrc] = useState('')
    const [attachmentSubmit, setAttachmentSubmit] = useState(false)

    useEffect(() => {

        if(clearValuesObject) {
          setClearValuesObject(false)
        }

    }, [ clearValuesObject, shipmentData])

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef, setImgSrc]);


  const navigation = useNavigate()

    const gettripShipmentData = () => {

        if(/[0-9]/.test(shipmentNumberNew)){
            VehicleAssignmentService.getSingleShipment(shipmentNumberNew).then((res) => {
                setShipmentHaving(true)
                setSmallFetch(true)
                let needed_data1 = res.data.data
                if(needed_data1 && needed_data1.shipment_child_info.length > 0){
                    console.log(needed_data1)
                    setShipmentData(needed_data1)
                    toast.success('Shipment Details Detected!')

                    VehicleCapacityApi.getVehicleCapacityById(needed_data1.vehicle_capacity_id).then(
                        (response) => {
                        let editData = response.data.data
                        setVCapacity(editData.capacity)
                    })

                    VehicleAssignmentService.getSingleShipmentPYGData(needed_data1.parking_id).then((rest) => {
                        setShipmentPYGData(rest.data.data)
                        console.log(rest.data.data)
                        let needed_data = rest.data.data
                        if (needed_data.vehicle_type_id.id == 3) {
                            ShedService.SingleShedData(needed_data.vehicle_document.shed_id).then((resp) => {
                                setShedData(resp.data.data)
                                console.log(resp.data.data)
                            })
                        }
                    })
                } else {
                    setShipmentData([])
                    setShedData([])
                    setShipmentPYGData([])
                    setVCapacity('')
                    setShipmentHaving(false)
                    setSmallFetch(true)
                    if(needed_data1 && needed_data1.shipment_child_info && needed_data1.shipment_child_info.length == 0){
                        toast.warning('Before Invoice Capturing, Deliveries of the Shipment Number should be completed with Second Weight Process in Logistics Pro')
                    } else {
                        toast.warning('Shipment Number Not Found in Logistics Pro')
                    }

                    return false
                }

            })
        } else {
            setShipmentData([])
            setShedData([])
            setShipmentPYGData([])
            setVCapacity('')
            setShipmentHaving(false)
            setSmallFetch(true)
            toast.warning('Shipment Number should be numeric')
            return false
        }
    }

    const ColoredLine = ({ color }) => (
        <hr
            style={{
                color: color,
                backgroundColor: color,
                height: 5
            }}
        />
      )

    const changeVadTableItem = (event, child_property_name, child_index) => {
        let getData = event.target.value
        console.log(getData, 'getData')

        let shipment_parent_info = Object.assign({}, shipmentData);

        if (child_property_name == 'fj_pod_copy') {
          let dataNeeded = {}
          dataNeeded.child = child_index
          imageCompress(event,dataNeeded,'fjsales')
        } else {
          shipment_parent_info.shipment_child_info[child_index][
            `${child_property_name}_input`
          ] = getData
          console.log(shipment_parent_info,'updated_shipment_parent_info')
          setShipmentData(shipment_parent_info)
        }

    }

    const imageCompress = async (event, need_data, ftype) => {

        console.log(need_data,'need_data')

        const file = event.target.files[0];
        console.log(file,'file')

        if(ftype == 'fjsales') {

            let shipment_parent_info_for_fjsales = Object.assign({}, shipmentData);

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

            setShipmentData(shipment_parent_info_for_fjsales)

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
            shipmentData.shipment_child_info[index_val].fj_pod_copy_file_name = ''
            shipmentData.shipment_child_info[index_val].fj_pod_copy = null
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

          shipmentData.shipment_child_info[fileImageKey].fj_pod_copy = file
          shipmentData.shipment_child_info[fileImageKey].fj_pod_copy_file_name = file.name
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

    const vadDataUpdate = (original, input) => {
        // return input === undefined ? original : input
        return input === undefined ? original : input
      }

    const vehicle_type_finder = (v_type_id_data) => {
        let v_type = ''
        if(v_type_id_data.vehicle_type_id_info.id != '4'){
          v_type = v_type_id_data.vehicle_type_id_info.type
        } else {
          if(v_type_id_data.vehicle_others_type == '2'){
            v_type = 'D2R Vehicle'
          } else {
            v_type = v_type_id_data.vehicle_type_id_info.type
          }
        }
        return v_type
      }


    // =============================================================================================== //

    const InvoiceAttachmentValidation = () => {

        let attachment_missing_delivery_no = ''
        shipmentData.shipment_child_info.map((child, child_index) => {

          if((child.fj_pod_copy_file_name != '' && !imageUrlValidation(child.fj_pod_copy))){
            console.log('shipmentInfo.shipment_child_info1',child_index)
            attachment_missing_delivery_no = child.delivery_no
          }

          if((child.fj_pod_copy_file_name == undefined && !imageUrlValidation(child.fj_pod_copy))){
            console.log('shipmentInfo.shipment_child_info2',child_index)
            attachment_missing_delivery_no = child.delivery_no
          }
        })

        setFetch(true)
        Swal.fire({
        title: attachment_missing_delivery_no != '' ? 'Attachment Invalid' : 'Invoice Attachment',
        text: attachment_missing_delivery_no != '' ? `One of the Delivery - FJ POD copy is missing / invalid. Are you sure to submit ?` : 'Are you sure to submit ?',
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: 'GREEN',
        cancelButtonColor: 'RED',
        confirmButtonText: 'Yes'
        })
        .then((result) => {
            console.log(result,'result')
            if (result.isConfirmed) {
                InvoiceAttachmentSubmit(1)
            }  else {
                // cancel
            }
        })

    }

    const InvoiceAttachmentSubmit = () => {

        console.log('-------------------shipmentInfo---------------------------')
        console.log(shipmentData)

        /* Values Assigning To Save Details into DB Part Start*/

        const formData = new FormData()

        formData.append('parking_id', shipmentData.parking_id ? shipmentData.parking_id : '')
        formData.append('tripsheet_id', shipmentData.tripsheet_id ? shipmentData.tripsheet_id : '')
        formData.append('shipment_id', shipmentData.shipment_id ? shipmentData.shipment_id : '')
        formData.append('updated_by', user_id)

        formData.append('trip_shipment_info', JSON.stringify(shipmentData))

        shipmentData.shipment_child_info.map((child, child_index) => {
            formData.append(
              `fg_pod_copy_shipment_${child.shipment_no}_delivery_${child.delivery_no}`,
              child.fj_pod_copy
            )
        })

        // toast.success('All Are Done..')
        setFetch(false)
        VehicleAssignmentService.updateInvoiceAttachment(formData).then((res) => {
            console.log(res,'createExpenseClosureres')
            if (res.status == 200) {
                setFetch(true)
                Swal.fire({
                icon: "success",
                title: 'Invoice Attachments Updated Successfully..!',
                confirmButtonText: "OK",
                }).then(function () {
                    window.location.reload(false)
                });
            } else if (res.status == 201) {
                setFetch(true)
                Swal.fire({
                title: res.data.message,
                icon: "warning",
                confirmButtonText: "OK",
                }).then(function () {
                window.location.reload(false)
                })
            } else {
                setFetch(true)
                toast.warning('Invoice Attachments Cannot be Updated. Kindly contact Admin..!')
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

    useEffect(() => {
      /* section for getting Pages List from database For Setting Permission */
      DefinitionsListApi.visibleDefinitionsListByDefinition(8).then((response) => {
        console.log(response.data.data)
        setPageList(response.data.data)
        setFetch(true)
        setSmallFetch(true)
      })

    }, [])

    const getInt = (val) => {
      return Number(parseFloat(val).toFixed(2))
    }

    return (
      <>
        {!fetch && <Loader />}

        {fetch && (
          <>
            {screenAccess ? (
              <>
                <CContainer className="mt-2">
                  <CRow>
                    <CCol xs={12} md={4}>
                      <div className="w-100 p-3">
                        <CFormLabel htmlFor="shipmentNumberNew">
                          Enter Shipment Number
                          <REQ />{' '}

                        </CFormLabel>
                        <CInputGroup>
                          <CFormInput
                            size="sm"
                            name="shipmentNumberNew"
                            id="shipmentNumberNew"
                            maxLength={15}
                            autoComplete='off'
                            value={shipmentNumberNew}
                            onChange={handleChangenewShipment}
                          />
                          <CInputGroupText className="p-0">
                            <CButton
                              size="sm"
                              color="primary"
                              onClick={(e) => {
                                // setFetch(false)
                                setSmallFetch(false)
                                // gettripHirePaymentData(e)
                                gettripShipmentData(e)
                              }}
                            >
                              <i className="fa fa-search px-1"></i>
                            </CButton>
                            <CButton
                              size="sm"
                              style={{ marginLeft:"3px" }}
                              color="primary"
                              onClick={() => {
                                window.location.reload(false)
                              }}
                            >
                              <i className="fa fa-refresh px-1"></i>
                            </CButton>
                          </CInputGroupText>
                        </CInputGroup>
                      </div>
                    </CCol>
                  </CRow>

                  {!smallfetch && <SmallLoader />}

                  {smallfetch && Object.keys(shipmentData).length != 0  && (

                    <CCard style={{display: shipmentHaving ? 'block' : 'none'}}  className="p-3">

                      <CRow className="m-2">
                        <CCol xs={12} md={2}>
                          <CFormLabel htmlFor="tNum">Tripsheet Number</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="tNum"
                            value={
                                shipmentData.trip_sheet_info ? shipmentData.trip_sheet_info.trip_sheet_no : ''
                            }
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={2}>
                          <CFormLabel htmlFor="tNum">Shipment Number</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="tNum"
                            value={
                                shipmentData.shipment_no ? shipmentData.shipment_no : ''
                            }
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={2}>
                          <CFormLabel htmlFor="tNum">Shipment Quantity in MTS</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="tNum"
                            value={
                                shipmentData.billed_net_qty ? shipmentData.billed_net_qty : (shipmentData.shipment_net_qty ? shipmentData.shipment_net_qty : (shipmentData.shipment_qty ? shipmentData.shipment_qty : ''))
                            }
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={2}>
                          <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="vType"
                            value={vehicle_type_finder(shipmentData)}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={2}>
                          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                          <CFormInput size="sm" id="vNum" value={shipmentData.vehicle_number} readOnly />
                        </CCol>
                        <CCol xs={12} md={2}>
                          <CFormLabel htmlFor="vCap">Vehicle Capacity in MTS</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="vCap"
                            value={
                                shipmentData.vehicle_capacity_id_info ? shipmentData.vehicle_capacity_id_info.capacity : ''
                            }
                            readOnly
                          />
                        </CCol>
                      </CRow>
                      <ColoredLine color="black" />

                      {shipmentData.shipment_child_info.map((val, val_index) => {
                        return (
                          <>
                            <CRow className="m-1" key={`HireshipmentChildData_${val_index}`}>

                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="cNum">Customer Name </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="cNum"
                                  value={`${val.customer_info.CustomerName}`}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="sNum">Customer Code</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="sNum"
                                  value={`${val.customer_info.CustomerCode}`}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="sNum">Invoice Number</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="sNum"
                                  value={`${val.invoice_no ? val.invoice_no : '-'}`}
                                  readOnly
                                />
                              </CCol>
                              {/* <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="sNum">Delivery / Invoice Number / Qty</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="sNum"
                                  value={`${val.delivery_no} / ${val.invoice_no ? val.invoice_no : '-'} / ${val.invoice_quantity ? val.invoice_quantity : (val.delivery_net_qty ? val.delivery_net_qty : val.delivery_qty)} ${val.invoice_quantity ? val.invoice_uom : ' TON'}`}
                                  readOnly
                                />
                              </CCol> */}
                              {/* <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="sNum">Delivery Quantity in MTS</CFormLabel>

                                  <CFormInput
                                      size="sm"
                                      id="sNum"
                                      value={val.delivery_qty}
                                      readOnly
                                  />
                              </CCol> */}
                              {/* <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="sInvoice">Invoice Number</CFormLabel>

                                  <CFormInput
                                      size="sm"
                                      id="sInvoice"
                                      value={val.invoice_no}
                                      readOnly
                                  />
                              </CCol> */}
                              {/* <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="sNum">Invoice Quantity</CFormLabel>

                                  <CFormInput
                                      size="sm"
                                      id="sNum"
                                      value={`${val.invoice_quantity} - ${val.invoice_uom}`}
                                      readOnly
                                  />
                              </CCol> */}

                              {/* <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="cNum">Customer City</CFormLabel>

                                  <CFormInput
                                  size="sm"
                                  id="cNum"
                                  value={val.customer_info.CustomerCity}
                                  readOnly
                                  />
                              </CCol> */}
                              {/* <CCol xs={12} md={2}>
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

                              </CCol> */}
                              <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="fjPod">FJ POD Copy</CFormLabel>
                                  <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                  {/* {console.log(shipmentInfo,'shipmentInfo-FGSALES')} */}
                                  { !(imageUrlValidation(shipmentData.shipment_child_info[val_index].fj_pod_copy) || shipmentData.shipment_child_info[val_index].fj_pod_copy_file_name) ? (
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
                                          &nbsp;{shipmentData.shipment_child_info[val_index].fj_pod_copy_file_name ? shipmentData.shipment_child_info[val_index].fj_pod_copy_file_name : imageUrlValidation(shipmentData.shipment_child_info[val_index].fj_pod_copy,'url')}
                                      </span>
                                      {!shipmentData.shipment_child_info[val_index].fj_pod_copy_file_name && (
                                          <span className="ml-2">
                                          <i
                                              className="fa fa-eye"
                                              aria-hidden="true"
                                              onClick={() => {
                                              setUploadedCamEnable(true)
                                              setUploadedImgSrc(shipmentData.shipment_child_info[val_index].fj_pod_copy)
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
                                      // onBlur={onBlur}
                                      onChange={(e) => changeVadTableItem(e, 'fj_pod_copy', val_index)}
                                      type="file"
                                      accept=".jpg,.jpeg,.png,.pdf"
                                      name={'fj_pod_copy'}
                                      size="sm"
                                      id={`fj_pod_copy_upload_yes_parent_child${val_index}`}
                                      style={{display:'none'}}
                                  />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="sDelivery">Remarks</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  type="text"
                                  onChange={(e) => {
                                      changeVadTableItem(e, 'defect_type', val_index)
                                  }}
                                  value={vadDataUpdate(
                                      val.defect_type,
                                      val.defect_type_input
                                  )}
                                />
                              </CCol>
                            </CRow>
                            <ColoredLine color="red" />
                          </>
                        )
                      })}
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
                                  InvoiceAttachmentValidation()
                                  // setAttachmentSubmit(true)
                              }}
                              type="submit"
                          >
                              Submit
                          </CButton>
                          </CCol>
                      </CRow>

                      {/* <CNav variant="tabs" role="tablist">
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
                            active={activeKey === 5}
                            style={{ backgroundColor: 'red' }}
                            onClick={() => setActiveKey(5)}
                          >
                            Invoice Information
                          </CNavLink>
                        </CNavItem>

                      </CNav> */}

                      <CTabContent style={{display:"none"}}>
                        <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                          <CRow className="mt-2">
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Tripsheet Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={
                                    shipmentData.trip_sheet_info ? shipmentData.trip_sheet_info.trip_sheet_no : ''
                                }
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Shipment Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={
                                    shipmentData.shipment_no ? shipmentData.shipment_no : ''
                                }
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="tNum">Shipment Quantity in MTS</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="tNum"
                                value={
                                    shipmentData.billed_net_qty ? shipmentData.billed_net_qty : (shipmentData.shipment_net_qty ? shipmentData.shipment_net_qty : (shipmentData.shipment_qty ? shipmentData.shipment_qty : ''))
                                }
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="vType"
                                value={vehicle_type_finder(shipmentData)}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                              <CFormInput size="sm" id="vNum" value={shipmentData.vehicle_number} readOnly />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vCap">Vehicle Capacity in MTS</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="vCap"
                                value={
                                    shipmentData.vehicle_capacity_id_info ? shipmentData.vehicle_capacity_id_info.capacity : ''
                                }
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="dName">Driver Name</CFormLabel>
                              <CFormInput size="sm" id="dName" value={shipmentData.driver_name} readOnly />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="dMob">Driver Cell Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="dMob"
                                value={shipmentData.driver_number}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="gateInDateTime"
                                value={shipmentData.parking_yard_info ? shipmentData.parking_yard_info.gate_in_date_time_org1 : ''}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="gateoutDate">Gate Out Date & Time</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="gateoutDate"
                                value={shipmentData.parking_yard_info ? shipmentData.parking_yard_info.gate_out_date_time_org1 : ''}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vtf">Trip Purpose / Division</CFormLabel>
                              <CFormInput
                                size="sm"
                                id="vtf"
                                value={`${shipmentData.trip_sheet_info ? (shipmentData.trip_sheet_info.purpose == 1
                                      ? 'FG-SALES'
                                      : shipmentData.trip_sheet_info.purpose == 2
                                      ? 'FG-STO'
                                      : shipmentData.trip_sheet_info.purpose == 3
                                      ? 'RM-STO'
                                      : shipmentData.trip_sheet_info.purpose == 4
                                      ? 'OTHERS'
                                      : shipmentData.trip_sheet_info.purpose == 5
                                      ? 'FCI'
                                      : (vehicle_type_finder(shipmentData) == 'D2R Vehicle' ? 'D2R FG-SALES' : 'PARTY FG-SALES'))
                                    : ''} / ${ shipmentData.trip_sheet_info
                                        ? (shipmentData.trip_sheet_info.to_divison == 2
                                          ? 'CONSUMER'
                                          :  'FOODS')
                                        : ''
                                    }`}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="TSCreationDateTime">
                                Tripsheet Creation Date & Time
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="TSCreationDateTime"
                                value={
                                    shipmentData.trip_sheet_info
                                    ? shipmentData.trip_sheet_info.tripsheet_creation_time_string
                                    : '---'
                                }
                                readOnly
                              />
                            </CCol>

                          </CRow>
                        </CTabPane>
                        <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 5}>

                            {shipmentData.shipment_child_info.map((val, val_index) => {
                                return (
                                    <>
                                        <CRow className="mt-3" key={`HireshipmentChildData_${val_index}`}>
                                            <CCol xs={12} md={3}>
                                                <CFormLabel htmlFor="sNum">Delivery Number</CFormLabel>
                                                <CFormInput
                                                    size="sm"
                                                    id="sNum"
                                                    value={val.delivery_no}

                                                    readOnly
                                                />
                                            </CCol>
                                            <CCol xs={12} md={3}>
                                                <CFormLabel htmlFor="sNum">Delivery Quantity in MTS</CFormLabel>

                                                <CFormInput
                                                    size="sm"
                                                    id="sNum"
                                                    value={val.delivery_qty}
                                                    readOnly
                                                />
                                            </CCol>
                                            <CCol xs={12} md={3}>
                                                <CFormLabel htmlFor="sInvoice">Invoice Number</CFormLabel>

                                                <CFormInput
                                                    size="sm"
                                                    id="sInvoice"
                                                    value={val.invoice_no}
                                                    readOnly
                                                />
                                            </CCol>
                                            <CCol xs={12} md={3}>
                                                <CFormLabel htmlFor="sNum">Invoice Quantity</CFormLabel>

                                                <CFormInput
                                                    size="sm"
                                                    id="sNum"
                                                    value={`${val.invoice_quantity} - ${val.invoice_uom}`}
                                                    readOnly
                                                />
                                            </CCol>

                                            <CCol xs={12} md={3}>
                                                <CFormLabel htmlFor="cNum">Customer Name</CFormLabel>

                                                <CFormInput
                                                    size="sm"
                                                    id="cNum"
                                                    value={val.customer_info.CustomerName}
                                                    readOnly
                                                />
                                            </CCol>
                                            <CCol xs={12} md={3}>
                                                <CFormLabel htmlFor="cNum">Customer Code</CFormLabel>

                                                <CFormInput
                                                size="sm"
                                                id="cNum"
                                                value={val.customer_info.CustomerCode}
                                                readOnly
                                                />
                                            </CCol>
                                            <CCol xs={12} md={3}>
                                                <CFormLabel htmlFor="cNum">Customer City</CFormLabel>

                                                <CFormInput
                                                size="sm"
                                                id="cNum"
                                                value={val.customer_info.CustomerCity}
                                                readOnly
                                                />
                                            </CCol>
                                            <CCol xs={12} md={3}>
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

                                            </CCol>

                                            <CCol xs={12} md={3}>
                                                <CFormLabel htmlFor="fjPod">FJ POD Copy</CFormLabel>
                                                <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                                {/* {console.log(shipmentInfo,'shipmentInfo-FGSALES')} */}
                                                { !(imageUrlValidation(shipmentData.shipment_child_info[val_index].fj_pod_copy) || shipmentData.shipment_child_info[val_index].fj_pod_copy_file_name) ? (
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
                                                        &nbsp;{shipmentData.shipment_child_info[val_index].fj_pod_copy_file_name ? shipmentData.shipment_child_info[val_index].fj_pod_copy_file_name : imageUrlValidation(shipmentData.shipment_child_info[val_index].fj_pod_copy,'url')}
                                                    </span>
                                                    {!shipmentData.shipment_child_info[val_index].fj_pod_copy_file_name && (
                                                        <span className="ml-2">
                                                        <i
                                                            className="fa fa-eye"
                                                            aria-hidden="true"
                                                            onClick={() => {
                                                            setUploadedCamEnable(true)
                                                            setUploadedImgSrc(shipmentData.shipment_child_info[val_index].fj_pod_copy)
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
                                                    // onBlur={onBlur}
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
                                })
                            }
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
                                        InvoiceAttachmentValidation()
                                        // setAttachmentSubmit(true)
                                    }}
                                    type="submit"
                                >
                                    Submit
                                </CButton>
                                </CCol>
                            </CRow>
                        </CTabPane>
                      </CTabContent>
                      {/* ============== Settlement Submit Confirm Button Modal Area Start ================= */}
                      <CModal
                        visible={attachmentSubmit}
                        backdrop="static"
                        // scrollable
                        onClose={() => {
                          setAttachmentSubmit(false)
                        }}
                      >
                        <CModalBody>
                          <p className="lead">Are you sure to Post the Payment Details to SAP ?</p>
                        </CModalBody>
                        <CModalFooter>
                          <CButton
                            className="m-2"
                            color="warning"
                            onClick={() => {
                                setAttachmentSubmit(false)
                                InvoiceAttachmentSubmit()
                            }}
                          >
                            Yes
                          </CButton>
                          <CButton
                            color="secondary"
                            onClick={() => {
                                setAttachmentSubmit(false)
                            }}
                          >
                            No
                          </CButton>
                        </CModalFooter>
                      </CModal>
                      {/* ============== Settlement Submit Confirm Button Modal Area End ================= */}
                      {/* Error Modal Section Start */}
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
                      {/* Error Modal Section End */}
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

                  )}

                </CContainer>
              </> ) : (<AccessDeniedComponent />)
            }
          </>
        )}
      </>
    )
  }

  export default InvoiceAttachment
