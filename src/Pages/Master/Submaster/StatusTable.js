// Created By Mariavanaraj
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
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CTabContent,
  CTabPane,
  CNav,
  CNavItem,
  CNavLink,
  CTableDataCell,
  CTableRow,
  CTableBody,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CFormSelect,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useForm from 'src/Hooks/useForm'
import CustomTable from 'src/components/customComponent/CustomTable'
import StatusApi from '../../../Service/SubMaster/StatusApi'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import StatusSubMasterValidation from 'src/Utils/SubMaster/StatusSubMasterValidation'
import Loader from 'src/components/Loader'

const StatusTable = () => {
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [rowData, setRowData] = useState([])
  const [save, setSave] = useState(true)
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [update, setUpdate] = useState('')
  const [deleted, setDeleted] = useState('')
  const [error, setError] = useState('')
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const [enableSC, setEnableSC] = useState(true)
  const formValues = {
    status: '',
  }
  // =================== Validation ===============
  const {
    values,
    errors,
    handleChange,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
    onClick,
    onKeyUp,
  } = useForm(login, StatusSubMasterValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }
  // =================== Validation ===============

  /*                    */

  // =================== CRUD =====================
  const Create = (e) => {
    e.preventDefault()
    let createValues = { status: values.status }
    StatusApi.createStatus(createValues)
      .then((response) => {
        setSuccess('New Status Added Successfully')
      })
      .catch((error) => {
        setError(error.response.data.errors.status[0])
        setTimeout(() => {
          setError('')
        }, 1000)
      })
  }

  const [activeKey, setActiveKey] = useState(1)
  const REQ = () => <span className="text-danger"> * </span>
  const [vnum, setVnum] = useState('')
  const [tnum, setTnum] = useState('')
  const [snum, setSnum] = useState('')
  const [fetch, setFetch] = useState(false)
  const [shipmentParentInfo, setShipmentParentInfo] = useState([])
  const [shipmentInfo, setShipmentInfo] = useState([])
  const [deliveryInfo, setDeliveryInfo] = useState([])
  const [deliveryEdit, setDeliveryEdit] = useState(false)
  const [invoiceUom, setInvoiceUom] = useState('')
  const [invoiceQty, setInvoiceQty] = useState('')
  const [invoiceFreight, setInvoiceFreight] = useState('')
  const [invoiceNum, setInvoiceNum] = useState('')

  const Edit = (id) => {
    setSave(false)
    setEditId('')
    StatusApi.getStatusById(id).then((response) => {
      let editData = response.data.data
      setModal(true)
      values.status = editData.status
      setEditId(id)
    })
  }

  const Update = (id) => {
    let updateValues = { status: values.status }
    console.log(updateValues, id)
    StatusApi.updateStatus(updateValues, id)
      .then((res) => {
        if (res.status == 200) {
          setModal(false)
          toast.success('Status Updated Successfully!')
          setMount((prevState) => (prevState = prevState + 1))
        }
      })
      .catch((error) => {
        setError(error.response.data.errors.status[0])
        setTimeout(() => {
          setError('')
        }, 1000)
      })
  }

  const shipmentCompletion = () => {
    console.log(shipmentInfo, 'shipmentInfo')
    let validation = true
    let shipment_freight_value = 0
    shipmentInfo.map((dat, ind) => {
      if (
        dat.invoice_no == null ||
        dat.invoice_no == 0 ||
        dat.invoice_quantity == null ||
        dat.invoice_quantity == 0 ||
        dat.invoice_uom == null ||
        dat.invoice_uom == 0 ||
        dat.delivery_freight_amount == null ||
        dat.delivery_freight_amount == 0 ||
        dat.invoice_no == '' ||
        dat.invoice_quantity == '' ||
        dat.invoice_uom == '' ||
        dat.delivery_freight_amount == ''
      ) {
        validation = false
      } else {
        shipment_freight_value += Number(parseFloat(dat.delivery_freight_amount).toFixed(2))
      }
    })

    if (validation) {
      let shipment_data = new FormData()
      shipment_data.append('ShipmentNumber', shipmentInfo[0].shipment_no || snum)
      shipment_data.append('ShipmentFreight', shipment_freight_value)
      shipment_data.append('ParkingId', shipmentParentInfo.parking_id)
      shipment_data.append('DivisionId', shipmentParentInfo.assigned_by)
      StatusApi.updateShipmentInfo(shipment_data).then((resp) => {
        setFetch(true)
        if (resp.status == 200 && resp.data.status == 1) {
          toast.success(resp.data.message)
          setTimeout(() => {
            window.location.reload(false)
          }, 2000)
        } else if (resp.status == 201 && resp.data.status == 1) {
          toast.warning(resp.data.message)
          setTimeout(() => {
            window.location.reload(false)
          }, 2000)
        } else if (resp.status == 201 && resp.data.status == 2) {
          toast.warning(resp.data.message)
          setTimeout(() => {
            window.location.reload(false)
          }, 2000)
        } else if (resp.status == 201 && resp.data.status == 3) {
          toast.warning(resp.data.message)
          setTimeout(() => {
            window.location.reload(false)
          }, 2000)
        } else {
          toast.warning('Error Found. Kindly Contact Admin..')
          setTimeout(() => {
            window.location.reload(false)
          }, 2000)
        }
        console.log(resp, 'resp')
      })
    } else {
      setFetch(true)
      toast.warning('Deliveries are not ready for Shipment Completion..!')
      return false
    }
  }

  const SetDelData = (data = {}) => {
    if (data.invoice_no) {
      setInvoiceNum(data.invoice_no)
    } else {
      setInvoiceNum('')
    }

    if (data.delivery_freight_amount) {
      setInvoiceFreight(data.delivery_freight_amount)
    } else {
      setInvoiceFreight('')
    }

    if (data.invoice_quantity) {
      setInvoiceQty(data.invoice_quantity)
    } else {
      setInvoiceQty('')
    }

    if (data.invoice_uom) {
      setInvoiceUom(data.invoice_uom)
    } else {
      setInvoiceUom('')
    }
  }

  const SetDelDataEmpty = () => {
    setInvoiceNum('')
    setInvoiceQty('')
    setInvoiceFreight('')
    setInvoiceUom('')
  }

  const Delete = (deleteId) => {
    StatusApi.deleteStatus(deleteId).then((res) => {
      if (res.status === 204) {
        setMount((prevState) => (prevState = prevState + 1))
        toast.success('Status Status Updated Successfully!')
      }
    })
    setTimeout(() => setDeleteModal(false), 500)
  }

  const deliverySave = () => {
    setDeliveryEdit(false)
    setFetch(false)
    let form_data = new FormData()
    form_data.append('DeliveryNumber', deliveryInfo.delivery_no)
    form_data.append('InvoiceNumber', invoiceNum)
    form_data.append('InvoiceUom', invoiceUom)
    form_data.append('DeliveryFreight', invoiceFreight)
    form_data.append('InvoiceQty', invoiceQty)
    StatusApi.updateDeliveryInfo(form_data)
      .then((resp) => {
        setFetch(true)
        if (resp.status == 200 && resp.data.status == 3) {
          toast.success(resp.data.message)
          setTimeout(() => {
            window.location.reload(false)
          }, 2000)
        } else if (resp.status == 201 && resp.data.status == 1) {
          toast.warning(resp.data.message)
          setTimeout(() => {
            window.location.reload(false)
          }, 2000)
        } else if (resp.status == 201 && resp.data.status == 2) {
          toast.warning(resp.data.message)
          setTimeout(() => {
            window.location.reload(false)
          }, 2000)
        } else {
          toast.warning('Error Found. Kindly Contact Admin..')
          setTimeout(() => {
            window.location.reload(false)
          }, 2000)
        }
        console.log(resp, 'resp')
      })
      .catch((err) => {
        setFetch(true)
        toast.warning(err)
        setTimeout(() => {
          window.location.reload(false)
        }, 2000)
      })
  }

  const assign_values = (e) => {
    let var_name = e.target.name
    let var_val = e.target.value
    if (var_name == 'vehiclenumber') {
      setVnum(var_val)
      console.log(var_val, 'vehiclenumber')
    } else if (var_name == 'tripsheetnumber') {
      setTnum(var_val)
      console.log(var_val, 'tripsheetnumber')
    } else if (var_name == 'shipmentnumber') {
      setSnum(var_val)
      console.log(var_val, 'shipmentnumber')
    } else {
      //
    }
  }

  const deliverySubmit = (val) => {
    setDeliveryInfo(val)
    SetDelData(val)

    setDeliveryEdit(true)
  }

  const invoiceUomChange = (value) => {
    setInvoiceUom(value)
  }

  const invoiceQtyChange = (value) => {
    setInvoiceQty(value)
  }

  const invoiceNumChange = (value) => {
    setInvoiceNum(value)
  }

  const invoiceFreightChange = (value) => {
    setInvoiceFreight(value)
  }

  const shipment_search = () => {
    let updated_vnum = vnum.trim()
    let updated_tnum = tnum.trim()
    let updated_snum = snum.trim()

    if (updated_vnum == '') {
      toast.warning('Vehicle Number should Not be empty..!')
      return false
    } else if (!/^[a-zA-Z0-9]+$/.test(updated_vnum)) {
      toast.warning('Vehicle Number should have alpha numeric..!')
      return false
    }

    if (updated_tnum == '') {
      toast.warning('Tripsheet Number should Not be empty..!')
      return false
    } else if (updated_tnum.length != 11) {
      toast.warning('Tripsheet Number should Have 11 Digit..!')
      return false
    } else if (!/^[a-zA-Z0-9]+$/.test(updated_tnum)) {
      toast.warning('Tripsheet Number should have alpha numeric Only..!')
      return false
    }

    if (updated_snum == '') {
      toast.warning('Shipment Number should Not be empty..!')
      return false
    } else if (!/^\d+$/.test(updated_snum)) {
      toast.warning('Shipment Number should have numeric Only..!')
      return false
    }

    setFetch(false)
    let report_form_data = new FormData()
    report_form_data.append('vehicle_no', updated_vnum)
    report_form_data.append('shipment_no', updated_snum)
    report_form_data.append('tripsheet_no', updated_tnum)
    StatusApi.getShipmentInfo(report_form_data)
      .then((resp) => {
        setFetch(true)
        console.log(resp, 'resp')
        if (resp.status == 200) {
          let db_response = resp.data.data
          console.log(db_response, 'db_response')
          setShipmentParentInfo(db_response)
          let db_shipment_response = db_response.shipment_child_info
          console.log(db_shipment_response, 'db_shipment_response')
          if (db_shipment_response.length > 0) {
            setShipmentInfo(db_shipment_response)
          } else {
            toast.warning('Shipment PGI Not completed..!')
            setShipmentInfo([])
            setShipmentParentInfo([])
            return false
          }
        } else if (resp.status == 201) {
          setShipmentInfo([])
          setShipmentParentInfo([])
          let db_response_status = resp.data.status
          if (db_response_status == 1) {
            toast.warning('Vehicle Number Not Found..!')
            return false
          } else if (db_response_status == 2) {
            toast.warning('Tripsheet Number Not Found..!')
            return false
          } else if (db_response_status == 3) {
            toast.warning('Shipment Number either not found or already completed..!')
            return false
          }
        }
      })
      .catch((error) => {
        setFetch(true)
        alert(error)
      })
  }

  useEffect(() => {
    StatusApi.getStatus().then((response) => {
      setFetch(true)
      let viewData = response.data.data
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          StatusName: data.status,
          Created_at: data.created_at,
          Status: data.status_status === 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                id={data.id}
                onClick={() => Delete(data.id)}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              <CButton
                disabled={data.status_status === 1 ? false : true}
                size="sm"
                color="secondary"
                shape="rounded"
                id={data.id}
                onClick={() => Edit(data.id)}
                className="m-1"
              >
                {/* Edit */}
                <i className="fa fa-edit" aria-hidden="true"></i>
              </CButton>
            </div>
          ),
        })
      })
      setRowData(rowDataList)
      setPending(false)

      setTimeout(() => {
        setSuccess('')
        setUpdate('')
        setDeleted('')
      }, 1500)
    })
  }, [mount, modal, save, success, update, deleted])
  // ============ CRUD =====================
  /*                    */
  // ============ Column Header Data =======
  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation date',
      selector: (row) => row.Created_at,
      left: true,
      sortable: true,
    },
    {
      name: 'Status type',
      selector: (row) => row.StatusName,
      sortable: true,
      left: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      left: true,
      sortable: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]
  // =================== Column Header Data =======

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          <CContainer className="mt-2">
            <CRow className="mt-3">
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
                    values.status = ''
                    setSuccess('')
                    setUpdate('')
                    setError('')
                    setDeleted('')
                    setModal(!modal)
                  }}
                >
                  <span className="float-start">
                    <i className="" aria-hidden="true"></i> &nbsp;NEW
                  </span>
                </CButton>
              </CCol>
            </CRow>
            <CCard className="mt-1 p-1">
              <CNav className="m-2" variant="tabs" role="tablist">
                <CNavItem>
                  <CNavLink
                    className="btn btn-sm"
                    href="javascript:void(0);"
                    active={activeKey === 1}
                    onClick={() => setActiveKey(1)}
                  >
                    Status
                  </CNavLink>
                </CNavItem>

                <CNavItem>
                  <CNavLink
                    className="btn btn-sm"
                    href="javascript:void(0);"
                    active={activeKey === 2}
                    onClick={() => {
                      setActiveKey(2)
                    }}
                  >
                    Second Weight Info Submit
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane role="tabpanel" aria-labelledby="" visible={activeKey === 1}>
                  <CustomTable
                    columns={columns}
                    data={rowData}
                    fieldName={'StatusName'}
                    showSearchFilter={true}
                    pending={pending}
                  />
                </CTabPane>
              </CTabContent>
              <CTabContent>
                <br />
                <CTabPane role="tabpanel" aria-labelledby="" visible={activeKey === 2}>
                  <CRow className="m-2">
                    <CCol md={3} className="m-1">
                      <CFormLabel htmlFor="vehiclenumber">
                        Vehicle Number
                        <REQ />
                      </CFormLabel>
                      <CFormInput
                        name="vehiclenumber"
                        size="sm"
                        maxLength={10}
                        id="vehiclenumber"
                        onChange={assign_values}
                        value={vnum}
                        placeholder=""
                      />
                    </CCol>
                    <CCol md={3} className="m-1">
                      <CFormLabel htmlFor="tripsheetnumber">
                        Tripsheet Number
                        <REQ />
                      </CFormLabel>
                      <CFormInput
                        name="tripsheetnumber"
                        size="sm"
                        maxLength={11}
                        id="tripsheetnumber"
                        onChange={assign_values}
                        value={tnum}
                        placeholder=""
                      />
                    </CCol>
                    <CCol md={3} className="m-1">
                      <CFormLabel htmlFor="shipmentnumber">
                        Shipment Number
                        <REQ />
                      </CFormLabel>
                      <CFormInput
                        name="shipmentnumber"
                        size="sm"
                        maxLength={12}
                        id="shipmentnumber"
                        onChange={assign_values}
                        value={snum}
                        placeholder=""
                      />
                    </CCol>

                    <CCol md={2} className="m-1">
                      <CFormLabel className="mr-2" htmlFor="shipmentnumber">
                        Click TO Search
                      </CFormLabel>
                      <CButton
                        size="md"
                        color="warning"
                        className="mt-2 px-3 text-white"
                        onClick={shipment_search}
                      >
                        <span className="float-start">
                          <i className="" aria-hidden="true"></i> &nbsp;Search
                        </span>
                      </CButton>
                    </CCol>
                  </CRow>
                  {shipmentInfo && shipmentInfo.length > 0 && (
                    <>
                      <CRow>
                        <CTable className="overflow-scroll">
                          <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                            <CTableRow>
                              <CTableHeaderCell
                                scope="col"
                                style={{ color: 'white', textAlign: 'center' }}
                              >
                                S.No
                              </CTableHeaderCell>
                              <CTableHeaderCell
                                scope="col"
                                style={{ color: 'white', textAlign: 'center' }}
                              >
                                Shipment No
                              </CTableHeaderCell>
                              <CTableHeaderCell
                                scope="col"
                                style={{ color: 'white', textAlign: 'center' }}
                              >
                                Delivery No
                              </CTableHeaderCell>

                              <CTableHeaderCell
                                scope="col"
                                style={{ color: 'white', textAlign: 'center' }}
                              >
                                Delivery QTY in MTS
                              </CTableHeaderCell>

                              <CTableHeaderCell
                                scope="col"
                                style={{ color: 'white', textAlign: 'center' }}
                              >
                                Delivery Freight
                              </CTableHeaderCell>

                              <CTableHeaderCell
                                scope="col"
                                style={{ color: 'white', textAlign: 'center' }}
                              >
                                Invoice QTY
                              </CTableHeaderCell>

                              <CTableHeaderCell
                                scope="col"
                                style={{ color: 'white', textAlign: 'center' }}
                              >
                                Invoice No
                              </CTableHeaderCell>

                              <CTableHeaderCell
                                scope="col"
                                style={{ color: 'white', textAlign: 'center' }}
                              >
                                Edit
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {/* { saleOrders && { */}
                            {/* {fetch && */}
                            {shipmentInfo.map((data_child, index_child) => {
                              console.log(data_child, 'data')

                              // data.shipment_child_info.map((data_child, index_child) => {
                              //   console.log(data_child, 'data_child')
                              // if (data.VBELN2)
                              return (
                                <>
                                  <CTableRow key={`ShipmentInfoData${index_child}`}>
                                    <CTableDataCell style={{ textAlign: 'center' }} scope="row">
                                      {index_child + 1}
                                    </CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }} scope="row">
                                      {data_child.shipment_no}
                                    </CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }} scope="row">
                                      {data_child.delivery_no}
                                    </CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }} scope="row">
                                      {data_child.delivery_qty}
                                    </CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }} scope="row">
                                      {data_child.delivery_freight_amount}
                                    </CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }} scope="row">
                                      {data_child.invoice_quantity == null
                                        ? '-'
                                        : data_child.invoice_quantity}
                                      {' - '}
                                      {data_child.invoice_uom == null
                                        ? '-'
                                        : data_child.invoice_uom}
                                    </CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }} scope="row">
                                      {data_child.invoice_no == null ? '-' : data_child.invoice_no}
                                    </CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }} scope="row">
                                      <CButton
                                        onClick={() => {
                                          deliverySubmit(data_child)

                                          // setCurrentDeliveryId(data.DeliveryOrderNumber)
                                        }}
                                        className="text-white"
                                        color="warning"
                                        size="sm"
                                      >
                                        <span className="float-start">
                                          <i className="fa fa-eye" aria-hidden="true"></i>{' '}
                                          &nbsp;Edit
                                        </span>
                                      </CButton>

                                      {/* ======================= Delivery Info Modal Area ========================== */}
                                      {/* <CModal
                                      size="xl"
                                      visible={visible}
                                      backdrop="static"
                                      scrollable
                                      onClose={() => setVisible(false)}
                                    >
                                      <CModalHeader>
                                        <CModalTitle>Delivery Order Details</CModalTitle>
                                      </CModalHeader>

                                      <CModalBody></CModalBody>
                                      <CModalFooter>
                                        <CButton
                                          color="secondary"
                                          onClick={() => setVisible(false)}
                                        >
                                          Close
                                        </CButton>
                                      </CModalFooter>
                                    </CModal> */}
                                      {/* *********************************************************** */}
                                    </CTableDataCell>
                                  </CTableRow>
                                </>
                              )
                            })}
                          </CTableBody>
                        </CTable>
                      </CRow>
                      <CRow>
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
                            // disabled={enableSC}
                            className="mx-3 px-3 text-white"
                            // type="submit"
                            onClick={() => {
                              setFetch(false)
                              shipmentCompletion()
                            }}
                          >
                            Shipment Completion
                          </CButton>
                        </CCol>
                      </CRow>
                    </>
                  )}
                </CTabPane>
              </CTabContent>
            </CCard>
          </CContainer>
        </>
      )}

      {/* View & Edit Modal Section */}
      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader>
          <CModalTitle>Status</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              {update && (
                <CAlert color="primary" data-aos="fade-down" dismissible>
                  {update}
                </CAlert>
              )}
              {success && (
                <CAlert color="success" data-aos="fade-down" dismissible>
                  {success}
                </CAlert>
              )}
              {error && (
                <CAlert color="danger" data-aos="fade-down" dismissible>
                  {error}
                </CAlert>
              )}

              <CFormLabel htmlFor="status">
                Status*{' '}
                {errors.status && <span className="small text-danger">{errors.status}</span>}
              </CFormLabel>
              <CFormInput
                size="sm"
                id="status"
                maxLength={30}
                className={`${errors.status && 'is-invalid'}`}
                name="status"
                value={values.status || ''}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                aria-label="Small select example"
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={(e) => (save ? Create(e) : Update(editId))} color="primary">
            {save ? 'Save' : 'Update'}
          </CButton>
        </CModalFooter>
      </CModal>
      {/* View & Edit Modal Section */}

      {/* Delete Modal Section */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle className="h4">Confirm To Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormLabel htmlFor="status">Are you sure want to Delete ?</CFormLabel>
            </CCol>
          </CRow>
          {deleted && (
            <CAlert color="danger" dismissible>
              {deleted}
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton onClick={() => Delete()} color="danger">
            YES
          </CButton>
          <CButton onClick={() => setDeleteModal(false)} color="primary">
            NO
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Delete Modal Section */}

      {/* Delivery Details Edit Modal Section Start */}
      <CModal
        size="lg"
        backdrop="static"
        scrollable
        visible={deliveryEdit}
        onClose={() => {
          SetDelDataEmpty()
          setDeliveryEdit(false)
        }}
      >
        <CModalHeader>
          <CModalTitle className="h4">Delivery Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mt-3">
            <CCol>
              <CFormLabel htmlFor="dnum">Delivery Number</CFormLabel>
              <CFormInput
                size="sm"
                className="mb-2"
                id="dnum"
                value={deliveryInfo.delivery_no}
                readOnly
              />
            </CCol>
            <CCol>
              <CFormLabel htmlFor="dfreight">Delivery Freight</CFormLabel>
              <CFormInput
                size="sm"
                className="mb-2"
                id="dfreight"
                value={invoiceFreight}
                onChange={(e) => {
                  invoiceFreightChange(e.target.value)
                }}
              />
            </CCol>
            <CCol>
              <CFormLabel htmlFor="inqty">Invoice Qty.</CFormLabel>
              <CFormInput
                size="sm"
                className="mb-2"
                id="inqty"
                value={invoiceQty}
                onChange={(e) => {
                  invoiceQtyChange(e.target.value)
                }}
              />
            </CCol>
            <CCol>
              <CFormLabel htmlFor="inno">Invoice Number</CFormLabel>

              <CFormInput
                size="sm"
                className="mb-2"
                id="dfreight"
                value={invoiceNum}
                onChange={(e) => {
                  invoiceNumChange(e.target.value)
                }}
              />
            </CCol>
            <CCol>
              <CFormLabel htmlFor="inno">Invoice UOM</CFormLabel>
              <CFormSelect
                size="sm"
                className="mb-2"
                name="inno"
                value={invoiceUom}
                onChange={(e) => {
                  invoiceUomChange(e.target.value)
                }}
                aria-label="Small select example"
              >
                <option value={''}>Select...</option>
                <option value="BAG">Bag</option>
                <option value="KG">Kg</option>
                <option value="TON">Ton</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={() => deliverySave()} color="danger">
            Save
          </CButton>
          <CButton
            onClick={() => {
              SetDelDataEmpty()
              setDeliveryEdit(false)
            }}
            color="primary"
          >
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Delivery Details Edit Modal Section End */}
    </>
  )
}

export default StatusTable

// {
//   name: 'Creation Date',
//   selector: (row) => row.Creation_Date,
//   sortable: true,
//   center: true,
// },

// {
//   name: 'Status',
//   selector: (row) => row.Status,
//   center: true,
// },
