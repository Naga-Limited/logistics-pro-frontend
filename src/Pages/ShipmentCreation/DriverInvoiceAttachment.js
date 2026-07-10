import React, { useEffect, useState } from "react";
import { 
  CButton,
  CRow,
  CCol, 
  CCard,
  CContainer,
  CModal,
  CFormInput,
  CFormLabel,
  CModalHeader, 
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CTabPane,
  CTabContent,
  CCardImage
} from "@coreui/react"; 
import { Link, useNavigate } from "react-router-dom";
import FileResizer from 'react-image-file-resizer'
import VehicleAssignmentService from "src/Service/VehicleAssignment/VehicleAssignmentService";
import { toast } from 'react-toastify'
import LocalStorageService from 'src/Service/LocalStoage'
import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader'
import Swal from 'sweetalert2'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
import { driverPodImageUrlValidation } from '../Depo/CommonMethods/CommonMethods'
import { useLocation } from 'react-router-dom';

const DriverInvoiceAttachment = () => {

  const navigation = useNavigate()

  const [shipmentHaving, setShipmentHaving] = useState(false)
  const [smallfetch, setSmallFetch] = useState(false)
  const [shipmentData, setShipmentData] = useState([]) 
  const [clearValuesObject, setClearValuesObject] = useState(false) 
  const [uploadedCamEnable, setUploadedCamEnable] = useState(false) 
  const [uploadedImgSrc, setUploadedImgSrc] = useState('')
  const [attachmentSubmit, setAttachmentSubmit] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [fetch, setFetch] = useState(false)

  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 5
      }}
    />
  )

  useEffect(() => {

    if (clearValuesObject) {
      setClearValuesObject(false)
    }

  }, [clearValuesObject, shipmentData])  

  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const id = params.get('pbh')
  console.log(id, 'sdfsdfsdf-id')
  const shipment_id = parseInt(id, 36)
  console.log(shipment_id, 'sdfsdfsdf-shipment_id')

  console.log(shipment_id, 'id-id')

  useEffect(() => {

    VehicleAssignmentService.getShipInfoBySId(shipment_id).then((res) => {
      setShipmentHaving(true)
      setSmallFetch(true)
      setFetch(true)
      let needed_data1 = res.data.data
      if (needed_data1 && needed_data1.shipment_child_info.length > 0) {
        console.log(needed_data1)
        setShipmentData(needed_data1)
        toast.success('Shipment Details Detected!')
      } else {
        setShipmentData([])
        setShipmentHaving(false)
        setSmallFetch(true)
        if (needed_data1 && needed_data1.shipment_child_info && needed_data1.shipment_child_info.length == 0) {
          toast.warning('Before Invoice Capturing, Deliveries of the Shipment Number should be completed with Second Weight Process in Logistics Pro')
        } else {
          toast.warning('Shipment Number Not Found in Logistics Pro')
        }

        return false
      }

    })

  }, [id])

  const changeVadTableItem = (event, child_property_name, child_index) => {
    let getData = event.target.value
    console.log(getData, 'getData')

    // let shipment_parent_info = Object.assign({}, shipmentData);

    const shipment_parent_info = JSON.parse(JSON.stringify(shipmentData))

    if (child_property_name == 'fj_pod_copy') {

      const files = Array.from(event.target.files) // 👈 get all selected files

      console.log(files, 'changeVadTableItem - selected files')

      let dataNeeded = {
        child: child_index,
        files: files
      }

      imageCompress(event, dataNeeded, 'fjsales')

      console.log(files, 'changeVadTableItem updated files')


    } else {
      shipment_parent_info.shipment_child_info[child_index][
        `${child_property_name}_input`
      ] = getData
      console.log(shipment_parent_info, 'updated_shipment_parent_info')
      setShipmentData(shipment_parent_info)
    }

  }

  const InvoiceAttachmentValidation = () => {

    let attachment_missing_delivery_no = ''
    shipmentData.shipment_child_info.map((child, child_index) => {

      if ((child.fj_pod_copy_file_name != '' && !driverPodImageUrlValidation(child.fj_pod_copy))) {
        console.log('shipmentInfo.shipment_child_info1', child_index)
        attachment_missing_delivery_no = child.delivery_no
      }

      if ((child.fj_pod_copy_file_name == undefined && !driverPodImageUrlValidation(child.fj_pod_copy))) {
        console.log('shipmentInfo.shipment_child_info2', child_index)
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
        console.log(result, 'result')
        if (result.isConfirmed) {
          InvoiceAttachmentSubmit(1)
        } else {
          // cancel
        }
      })

  }

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
  }

  const resizeFile = (file) =>
    new Promise((resolve) => {
      FileResizer.imageFileResizer(
        file,
        1000,
        1000,
        'JPEG',
        80,
        0,
        (uri) => {
          resolve(uri)
        },
        'base64'
      )
    })

  const imageCompress = async (event, need_data, ftype) => {
    const files = Array.from(event.target.files)

    if (ftype === 'fjsales') {
      let updatedData = {
        ...shipmentData,
        shipment_child_info: [...shipmentData.shipment_child_info],
      }

      const childIndex = need_data.child
      let processedFiles = []
      let fileNames = []

      for (let file of files) {
        let finalFile = file
        let isPdf = file.type === 'application/pdf'

        if (isPdf) {
          if (file.size > 2000000) {
            toast.warning(`${file.name} is too big (max 2MB for PDF)`)
            continue
          }
        } else {
          // It's an image
          if (file.size > 2000000) {
            toast.info(`Compressing ${file.name}...`)
            const compressedBase64 = await resizeFile(file)
            finalFile = dataURLtoFile(compressedBase64, file.name)

            if (finalFile.size > 2000000) {
              toast.warning(`${file.name} is still over 2MB after compression. Not allowed.`)
              continue
            }
          }
        }

        processedFiles.push(finalFile)
        fileNames.push(finalFile.name)
      }

      if (processedFiles.length > 0) {
        updatedData.shipment_child_info[childIndex] = {
          ...updatedData.shipment_child_info[childIndex],
          fj_pod_copy: processedFiles,
          fj_pod_copy_file_name: fileNames,
        }
        setShipmentData(updatedData)
      }
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

    return new File([u8arr], filename, { type: mime });
  };

  const uploadClickFJ = (index_val) => {

    console.log(index_val, 'index_val')

    let div_val = document.getElementById(`fj_pod_copy_upload_yes_parent_child${index_val}`)

    if (div_val) {
      div_val.value = null
      div_val.click() 
    }

  } 

  const clearValues = (index_val, ftype) => {
    console.log(index_val, 'index_val-ftype');
    console.log(ftype, 'clearValues-ftype');
    console.log(shipmentData, 'clearValues-shipmentData');

    // let updatedData = { ...shipmentData };
    let updatedData = JSON.parse(JSON.stringify(shipmentData))

    if (ftype === 'fjsales') {
      updatedData.shipment_child_info[index_val].fj_pod_copy_file_name = [];
      updatedData.shipment_child_info[index_val].fj_pod_copy = [];
    }

    setShipmentData(updatedData); // ✅ IMPORTANT
    setClearValuesObject(true);
  }

  const [visible, setVisible] = useState(false)
  const [imageData, setImageData] = useState([])

  const [visible1, setVisible1] = useState(false)
  const [imageData1, setImageData1] = useState([])

  const [visible2, setVisible2] = useState(false)
  const [imageData2, setImageData2] = useState([]) 

  const InvoiceAttachmentSubmit = () => {

    console.log('-------------------shipmentInfo---------------------------')
    console.log(shipmentData)
    // return false

    /* Values Assigning To Save Details into DB Part Start*/

    const formData = new FormData()

    formData.append('parking_id', shipmentData.parking_id ? shipmentData.parking_id : '')
    formData.append('tripsheet_id', shipmentData.tripsheet_id ? shipmentData.tripsheet_id : '')
    formData.append('shipment_id', shipmentData.shipment_id ? shipmentData.shipment_id : '')
    // formData.append('updated_by', user_id)    

    formData.append('trip_shipment_info', JSON.stringify(shipmentData)) 

    shipmentData.shipment_child_info.forEach((child) => {
      if (Array.isArray(child.fj_pod_copy)) {
        child.fj_pod_copy.forEach((file, index) => {
          formData.append(
            `fg_pod_copy_shipment_${child.shipment_no}_delivery_${child.delivery_no}_${index}`,
            file
          )
        })
      } else if (child.fj_pod_copy) {
        formData.append(
          `fg_pod_copy_shipment_${child.shipment_no}_delivery_${child.delivery_no}`,
          child.fj_pod_copy
        )
      }
    })

    // return false
    // toast.success('All Are Done..')
    setFetch(false)
    VehicleAssignmentService.updateDriverInvoiceAttachment(formData).then((res) => {
      console.log(res, 'createExpenseClosureres')
      if (res.status == 200) {
        setFetch(true)
        Swal.fire({
          icon: "success",
          title: 'Invoice Attachments Updated Successfully..!',
          confirmButtonText: "OK",
        }).then(function () {
          if (LocalStorageService.getLocalstorage('auth_token')) {
            navigation('/Dashboard')
          } else {
            window.location.reload(false)
          }
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

  return (
    <>
      {!fetch && <Loader />}

      {fetch && (
        <>
          <CContainer className="mt-2">

            {!smallfetch && <SmallLoader />}

            {smallfetch && Object.keys(shipmentData).length != 0 && (

              <CCard style={{ display: shipmentHaving ? 'block' : 'none' }} className="p-3">

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
                    <CFormLabel htmlFor="tNum">Shipment Number / Qty</CFormLabel>
                    <CFormInput
                      size="sm"
                      id="tNum"
                      value={
                        `${shipmentData.shipment_no ? shipmentData.shipment_no : ''} / ${shipmentData.billed_net_qty ? shipmentData.billed_net_qty : (shipmentData.shipment_net_qty ? shipmentData.shipment_net_qty : (shipmentData.shipment_qty ? shipmentData.shipment_qty : ''))} TON`
                      }
                      readOnly
                    />
                  </CCol>

                  <CCol xs={12} md={2}>
                    <CFormLabel htmlFor="vNum">Vehicle Number / Capacity</CFormLabel>
                    <CFormInput size="sm" id="vNum" value={`${shipmentData.vehicle_number} / ${shipmentData.vehicle_capacity_id_info ? shipmentData.vehicle_capacity_id_info.capacity : ''}`} readOnly />
                  </CCol>

                </CRow>
                <ColoredLine color="black" />

                {shipmentData.shipment_child_info.map((val, val_index) => {
                  return (
                    <>
                      <CRow className="m-1" key={`HireshipmentChildData_${val_index}`}>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="sNum">Delivery / Invoice Number / Qty</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="sNum"
                            value={`${val.delivery_no} / ${val.invoice_no ? val.invoice_no : '-'} / ${val.delivery_net_qty ? val.delivery_net_qty : (val.invoice_quantity ? val.invoice_quantity : val.delivery_qty)} ${val.delivery_net_qty ? ' TON' : val.invoice_uom}`}
                            readOnly
                          />
                        </CCol> 
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="cNum">Customer Name / Code</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="cNum"
                            value={`${val.customer_info.CustomerName} / ${val.customer_info.CustomerCode}`}
                            readOnly
                          />
                        </CCol> 
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="fjPod">FJ POD Copy</CFormLabel>
                          <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                            {!(driverPodImageUrlValidation(shipmentData.shipment_child_info[val_index].fj_pod_copy) ||
                              shipmentData.shipment_child_info[val_index].fj_pod_copy_file_name?.length) ? (
                              <>
                                <span
                                  className="float-start"
                                  onClick={() => uploadClickFJ(val_index)}
                                >
                                  <CIcon style={{ color: 'red' }} icon={icon.cilFolderOpen} size="lg" />
                                  &nbsp;Upload
                                </span>
                              </>
                            ) : (
                              <>
                                {/* ✅ SHOW MULTIPLE FILE NAMES */}
                                <span className="float-start">
                                  {console.log(shipmentData, 'console.log(shipmentData)')}
                                  {
                                    shipmentData.shipment_child_info[val_index].fj_pod_copy_file_name?.length
                                      ? shipmentData.shipment_child_info[val_index].fj_pod_copy_file_name.join(', ')
                                      : driverPodImageUrlValidation(
                                        shipmentData.shipment_child_info[val_index].fj_pod_copy,
                                        'url'
                                      )?.join(', ')
                                  }
                                </span>

                                {/* ✅ VIEW (only for URLs or previewable) */}
                                {!shipmentData.shipment_child_info[val_index].fj_pod_copy_file_name?.length && (
                                  <span className="ml-2">
                                    <i
                                      className="fa fa-eye"
                                      onClick={() => {
                                        setUploadedCamEnable(true);
                                        setUploadedImgSrc(
                                          shipmentData.shipment_child_info[val_index].fj_pod_copy
                                        );
                                      }}
                                    ></i>
                                  </span>
                                )}

                                {/* ✅ DELETE */}
                                <span className="float-end">
                                  <i
                                    className="fa fa-trash"
                                    onClick={() => clearValues(val_index, 'fjsales')}
                                  ></i>
                                </span>
                              </>
                            )
                            }
                          </CButton>
                          <CFormInput
                            onChange={(e) => changeVadTableItem(e, 'fj_pod_copy', val_index)}
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            name={'fj_pod_copy'}
                            size="sm"
                            multiple
                            id={`fj_pod_copy_upload_yes_parent_child${val_index}`}
                            style={{ display: 'none' }}
                          />
                        </CCol>
                        {val.driver_fj_pod_copy && (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="cNum">POD First Copy View / Time</CFormLabel>
                            <CButton
                              onClick={() => {
                                setVisible(!visible)
                                setImageData(val)
                              }}
                              className="w-100 m-0"
                              color="info"
                              size="sm"
                              id="dInvoice"
                            >

                              <span className="float-start">
                                <i className="fa fa-eye" aria-hidden="true"></i>
                                View / {val.driver_fj_pod_attachment_time}
                              </span>
                            </CButton>

                          </CCol>
                        )}
                        {val.driver_fj_pod_second_copy && (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="cNum">POD Second Copy View / Time</CFormLabel>
                            <CButton
                              onClick={() => {
                                setVisible1(!visible1)
                                setImageData1(val)
                              }}
                              className="w-100 m-0"
                              color="info"
                              size="sm"
                              id="dInvoice"
                            >

                              <span className="float-start">
                                <i className="fa fa-eye" aria-hidden="true"></i>
                                View / {val.driver_fj_pod_second_attachment_time}
                              </span>
                            </CButton>
                          </CCol>
                        )}
                        {val.driver_fj_pod_third_copy && (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="cNum">POD Third Copy View / Time</CFormLabel>
                            <CButton
                              onClick={() => {
                                setVisible2(!visible2)
                                setImageData2(val)
                              }}
                              className="w-100 m-0"
                              color="info"
                              size="sm"
                              id="dInvoice"
                            >

                              <span className="float-start">

                                <i className="fa fa-eye" aria-hidden="true"></i>
                                View / {val.driver_fj_pod_third_attachment_time}
                              </span>
                            </CButton>
                          </CCol>
                        )}
                      </CRow >
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
                    style={{ display: 'flex', flexDirection: 'row-reverse', cursor: 'pointer' }}
                  >

                    <CButton
                      size="sm"
                      color="success"
                      className="mx-3 text-white"
                      onClick={() => {
                        InvoiceAttachmentValidation() 
                      }}
                      type="submit"
                    >
                      Submit
                    </CButton>
                    {LocalStorageService.getLocalstorage('auth_token') && (
                      <Link to={'/Dashboard'}>
                        <CButton
                          size="s-lg"
                          color="warning"
                          className="mx-1 px-2 text-white"
                          type="button"
                        >
                          Cancel
                        </CButton>
                      </Link>
                    )}
                  </CCol>
                </CRow>



                <CTabContent style={{ display: "none" }}>
                  <CTabPane role="tabpanel" aria-labelledby="home-tab"
                  // visible={activeKey === 1}
                  >
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
                            : ''} / ${shipmentData.trip_sheet_info
                              ? (shipmentData.trip_sheet_info.to_divison == 2
                                ? 'CONSUMER'
                                : 'FOODS')
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

                <CModal
                  backdrop="static"
                  scrollable
                  size="xl"
                  visible={visible}
                  onClose={() => setVisible(false)}
                >
                  <CModalHeader>
                    <CModalTitle>Driver POD Copy</CModalTitle>
                  </CModalHeader>

                  <CModalBody>
                    {imageData.driver_fj_pod_copy &&
                      imageData.driver_fj_pod_copy.map((file, index) => (
                        // <CModalBody key={index}>
                        <div key={index} style={{ marginBottom: '15px', textAlign: 'center' }}>
                          {!file.includes('.pdf') ? (
                            <CCardImage orientation="top" src={imageData.pod_file_path + file} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                          ) : (
                            <iframe
                              orientation="top"
                              style={{ width: '100%', height: '500px', border: 'none' }}
                              src={imageData.pod_file_path + file}
                              title={`invoice-${index}`}
                            ></iframe>
                          )}
                        </div>

                      ))}
                  </CModalBody>


                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>

                <CModal
                  backdrop="static"
                  scrollable
                  size="xl"
                  visible={visible1}
                  onClose={() => setVisible1(false)}
                >
                  <CModalHeader>
                    <CModalTitle>Driver POD Copy</CModalTitle>
                  </CModalHeader>


                  <CModalBody>
                    {imageData1.driver_fj_pod_second_copy &&
                      imageData1.driver_fj_pod_second_copy.map((file, index) => (
                        // <CModalBody key={index}>
                        <div key={index} style={{ marginBottom: '15px', textAlign: 'center' }}>
                          {!file.includes('.pdf') ? (
                            <CCardImage orientation="top" src={imageData1.pod_file_path + file} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                          ) : (
                            <iframe
                              orientation="top"
                              style={{ width: '100%', height: '500px', border: 'none' }}
                              src={imageData1.pod_file_path + file}
                              title={`invoice-${index}`}
                            ></iframe>
                          )}
                        </div>

                      ))}
                  </CModalBody>


                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible1(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>

                <CModal
                  backdrop="static"
                  scrollable
                  size="xl"
                  visible={visible2}
                  onClose={() => setVisible2(false)}
                >
                  <CModalHeader>
                    <CModalTitle>Driver POD Copy</CModalTitle>
                  </CModalHeader>


                  <CModalBody>
                    {imageData2.driver_fj_pod_third_copy &&
                      imageData2.driver_fj_pod_third_copy.map((file, index) => (
                        // <CModalBody key={index}>
                        <div key={index} style={{ marginBottom: '15px', textAlign: 'center' }}>
                          {!file.includes('.pdf') ? (
                            <CCardImage orientation="top" src={imageData2.pod_file_path + file} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                          ) : (
                            <iframe
                              orientation="top"
                              style={{ width: '100%', height: '500px', border: 'none' }}
                              src={imageData2.pod_file_path + file}
                              title={`invoice-${index}`}
                            ></iframe>
                          )}
                        </div>

                      ))}
                  </CModalBody>


                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible2(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>

              </CCard>

            )}

          </CContainer>
        </>
      )
      }
    </>
  ) 
}

export default DriverInvoiceAttachment
