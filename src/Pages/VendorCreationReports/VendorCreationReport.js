import { CButton, CCard, CContainer,CFormSelect,CForm,
  CCol,
  CRow,
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
  CFormInput,
  CCardImage,
  CFormLabel} from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import ReportService from 'src/Service/Report/ReportService'
import VehicleMasterValidation from 'src/Utils/Master/VehicleMasterValidation'
import useForm from 'src/Hooks/useForm'
import { DateRangePicker } from 'rsuite';
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import VendorFilterComponent from './VendorFilterComponent/VendorFilterComponent'
import CustomSpanButton from 'src/components/customComponent/CustomSpanButton2'
import CustomSpanButtonDocVerify from 'src/components/customComponent/CustomSpanButtonDocVerify'
import CustomSpanButton3 from 'src/components/customComponent/CustomSpanButton3'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

const VendorCreationReport = (
  ) => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

   /* ==================== Access Part Start ========================*/
   const [screenAccess, setScreenAccess] = useState(false)
   let page_no = LogisticsProScreenNumberConstants.VendorCreationModule.Vendor_Creation_Report

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

  const [value, setValue] = React.useState([new Date(getCurrentDate('-')), new Date(getCurrentDate('-'))]);

  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)
  const [currentDeliveryId, setCurrentDeliveryId] = useState('')
  const [visible, setVisible] = useState(false)
  const [start, setStart] = useState('')


  {/* ============= Date Range Picker Part Start =========================== */}

  const [dateRangePickerStartDate, setDateRangePickerStartDate] = useState('')
  const [dateRangePickerEndDate, setDateRangePickerEndDate] = useState('')
  const [reportVehicle, setReportVehicle] = useState(0)
  const [searchFilterData, setSearchFilterData] = useState([])

  const  convert = (str) => {
    let date = new Date(str);
    let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");

  }

  useEffect (()=>{

    if(value){

      console.log(value)
      let fromDate = value[0];
      let toDate = value[1];
      console.log(convert(fromDate))
      console.log(convert(toDate))
      setDateRangePickerStartDate(convert(fromDate));
      setDateRangePickerEndDate(convert(toDate));

    } else {

      setDateRangePickerStartDate('');
      setDateRangePickerEndDate('');

    }
  },[value])

  {/* =============== Date Range Picker Part End =========================== */}

  // const onChange = (event) => {
  //   let vendor_status = event.value
  //   if (vendor_status) {
  //     values.vendor_status = vendor_status
  //   } else {
  //     values.vendor_status = ''
  //   }
  // }

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'vendor_status') {
      if (selected_value) {
        setReportVehicle(selected_value)
      } else {
        setReportVehicle(0)
      }
     }
  }
   
  const [RCCopyFront, setRCCopyFront] = useState(false)
  const [RCCopyBack, setRCCopyBack] = useState(false)
  const [License_copy, setLicense_copy] = useState(false)
  const [Aadhar_copy, setAadhar_copy] = useState(false)
  const [Pan_copy, setPan_copy] = useState(false)
  const [Bank_pass_copy, setBank_pass_copy] = useState(false)
  const [Insurance_copy_front, setInsurance_copy_front] = useState(false)
  const [Insurance_copy_back, setInsurance_copy_back] = useState(false)
  const [Transport_shed_sheet, setTransport_shed_sheet] = useState(false)
  const [TDS_dec_form_front, setTDS_dec_form_front] = useState(false)
  const [TDS_dec_form_back, setTDS_dec_form_back] = useState(false)
  const [Ownership_transfer_form, setOwnership_transfer_form] = useState(false)

  const [documentSrc, setDocumentSrc] = useState('')

  function handleViewDocuments(e, id, type) {
    switch (type) {
      case 'RC_FRONT':
        {
          let singleVehicleInfo = tableData1.filter((data) => data.document_id == id)
          setDocumentSrc(singleVehicleInfo[0].rc_copy_front)
          setRCCopyFront(true)
        }
        break
        case 'RC_BACK':
        {
          let singleVehicleInfo = tableData1.filter((data) => data.document_id == id)
          setDocumentSrc(singleVehicleInfo[0].rc_copy_back)
          setRCCopyBack(true)
        }
        break
        case 'LICENSE_COPY':
        {
          let singleVehicleInfo = tableData1.filter((data) => data.document_id == id)
          setDocumentSrc(singleVehicleInfo[0].license_copy)
          setLicense_copy(true)
        }
        break
        case 'AADHAR_COPY':
          {
            let singleVehicleInfo = tableData1.filter((data) => data.vendor_code_id == id)
            setDocumentSrc(singleVehicleInfo[0].document_info.aadhar_copy)
            setAadhar_copy(true)
          }
          break
        case 'PAN_COPY':
          {
            let singleVehicleInfo = tableData1.filter((data) => data.vendor_code_id == id)
            setDocumentSrc(singleVehicleInfo[0].document_info.pan_copy)
            setPan_copy(true)
          }
          break
          case 'PASS_BOOK':
          {
            let singleVehicleInfo = tableData1.filter((data) => data.vendor_code_id == id)
            setDocumentSrc(singleVehicleInfo[0].document_info.bank_pass_copy)
            setBank_pass_copy(true)
          }
          break
          case 'INSURANCE_FRONT':
          {
            let singleVehicleInfo = tableData1.filter((data) => data.document_id == id)
            setDocumentSrc(singleVehicleInfo[0].insurance_copy_front)
            setInsurance_copy_front(true)
          }
          break
          case 'INSURANCE_BACK':
          {
            let singleVehicleInfo = tableData1.filter((data) => data.document_id == id)
            setDocumentSrc(singleVehicleInfo[0].insurance_copy_front)
            setInsurance_copy_back(true)
          }
          break
          case 'TRANSPORT_SHEET':
          {
            let singleVehicleInfo = tableData1.filter((data) => data.document_id == id)
            setDocumentSrc(singleVehicleInfo[0].transport_shed_sheet)
            setTransport_shed_sheet(true)
          }
          break
          case 'TDS_COPY_FRONT':
          {
            let singleVehicleInfo = tableData1.filter((data) => data.vendor_code_id == id)
            setDocumentSrc(singleVehicleInfo[0].document_info.tds_dec_form_front)
            setTDS_dec_form_front(true)
          }
          break
          case 'TDS_COPY_BACK':
          {
            let singleVehicleInfo = tableData1.filter((data) => data.vendor_code_id == id)
            setDocumentSrc(singleVehicleInfo[0].document_info.tds_dec_form_back)
            setTDS_dec_form_back(true)
          }
          break
          case 'OWNER_FORM':
            {
              let singleVehicleInfo = tableData1.filter((data) => data.document_id == id)
              setDocumentSrc(singleVehicleInfo[0].ownership_transfer_form)
              setOwnership_transfer_form(true)
            }
          break
    }

  }

  let tableData1 = []
  const loadVehicleReadyToTrip = () => {
    let tableData = new FormData()
    // tableData.append('advpay_date_range', values.advpay_date_range)

    console.log(dateRangePickerStartDate, 'start date')
    console.log(dateRangePickerEndDate, 'end date')
    tableData.append('document_from_date_range', dateRangePickerStartDate)
    tableData.append('document_to_date_range', dateRangePickerEndDate)
    tableData.append('vendor_status', reportVehicle)

    ReportService.Vendor_Report(tableData).then((res) => {
      console.log(res.data.data)
      setFetch(true)
      tableData1 = res.data.data
      let rowDataList = []
      // const filterData = tableData1.filter((data) =>
      //   // data.vendor_info?.bank_name != null )
      setSearchFilterData(tableData1)

        tableData1.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          // vehicle_number: data.Parking_info.vehicle_number,
          // driver_name: data.Parking_info.driver_name,
          owner_name: data.owner_name,
          license_copy: (
            <CustomSpanButtonDocVerify
              handleViewDocuments={handleViewDocuments}
              Document_id={data.document_id}
              documentType={'LICENSE_COPY'}
            />
          ),
          aadhar_copy: (
            <CustomSpanButtonDocVerify
              handleViewDocuments={handleViewDocuments}
              Document_id={data.document_id}
              documentType={'AADHAR_COPY'}
            />
          ),
          pan_copy: (
            <CustomSpanButtonDocVerify
              handleViewDocuments={handleViewDocuments}
              Document_id={data.document_id}
              documentType={'PAN_COPY'}
            />
          ),
          bank_pass_copy:  (
            <CustomSpanButtonDocVerify
              handleViewDocuments={handleViewDocuments}
              Document_id={data.document_id}
              documentType={'PASS_BOOK'}
            />
          ),
          rc_copy_front: (
            <CustomSpanButtonDocVerify
              handleViewDocuments={handleViewDocuments}
              Document_id={data.document_id}
              documentType={'RC_FRONT'}
            />
          ),
          rc_copy_back: (
            <CustomSpanButtonDocVerify
              handleViewDocuments={handleViewDocuments}
              Document_id={data.document_id}
              documentType={'RC_BACK'}
            />
          ),
          insurance_copy_front: (
            <CustomSpanButtonDocVerify
              handleViewDocuments={handleViewDocuments}
              Document_id={data.document_id}
              documentType={'INSURANCE_FRONT'}
            />
          ),
          insurance_copy_back: (
            <CustomSpanButtonDocVerify
              handleViewDocuments={handleViewDocuments}
              Document_id={data.document_id}
              documentType={'INSURANCE_BACK'}
            />
          ),
          transport_shed_sheet: (
            <CustomSpanButtonDocVerify
              handleViewDocuments={handleViewDocuments}
              Document_id={data.document_id}
              documentType={'TRANSPORT_SHEET'}
            />
          ),
          tds_dec_form_front:(
            <CustomSpanButtonDocVerify
              handleViewDocuments={handleViewDocuments}
              Document_id={data.document_id}
              documentType={'TDS_COPY_FRONT'}
            />
          ),
          tds_dec_form_back: (
            <CustomSpanButtonDocVerify
              handleViewDocuments={handleViewDocuments}
              Document_id={data.document_id}
              documentType={'TDS_COPY_BACK'}
            />
          ),
          ownership_transfer_form: (
            <CustomSpanButtonDocVerify
              handleViewDocuments={handleViewDocuments}
              Document_id={data.document_id}
              documentType={'OWNER_FORM'}
            />
          ),
          vendor_flag:data.document_info && data.document_info.vendor_flag && data.document_info.vendor_flag == '1' ? 'Yes':'No',
          shed_name: data.shed_info.shed_name,
          region: data.region,
          postal_code: data.postal_code,
          payment_term_3days: data.payment_term_3days,
          pan_card_number: data.pan_card_number,
          owner_number: data.owner_number,
          gst_tax_code: data.gst_tax_code,
          gst_registration_number: data.gst_registration_number,
          gst_registration: data.gst_registration == 0 ? 'UnRegistered':'Registered',
          district: data.district,
          created_by: data.created_by,
          city: data.city,
          bank_name: data.bank_name,
          bank_ifsc: data.bank_ifsc,
          bank_branch: data.bank_branch,
          bank_acc_number: data.bank_acc_number,
          bank_acc_holder_name: data.bank_acc_holder_name,
          area: data.area,
          aadhar_card_number: data.aadhar_card_number,
          state: data.state,
          street: data.street,
          vendor_code:data.vendor_code,
          remarks:data.remarks,
          created_at: data.created_at,
          vendor_status:data.vendor_status == 1 ? 'Waiting':data.vendor_status == 2 ? 'Created':data.vendor_status == 3 ? 'Approved':data.vendor_status == 4 ?'Confirmed':'Available',
          // vendor_status:(
          //   <span className="badge rounded-pill bg-info">
          //     {data.vendor_status == ACTION.MAINTENANCE_INSIDE
          //       ? 'Inhouse'
          //       : data.vendor_status == ACTION.MAINTENANCE_OUTSIDE
          //       ? 'Outside'
          //       : data.vendor_status == ACTION.MAINTENANCE_COMPLETED
          //       ? 'Maintenance End'
          //       : ''}
          //   </span>
          // ),
          Action: (
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
          ),
        })
      })
      setRowData(rowDataList)
    })
  }
  useEffect(() => {
    loadVehicleReadyToTrip()
  }, [])


  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}

function getCurrentDate(separator = '') {
  let newDate = new Date()
  let date = newDate.getDate()
  let month = newDate.getMonth() + 1
  let year = newDate.getFullYear()

  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
}


const exportToCSV = () => {
let fileName='Vendor Report'
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const ws = XLSX.utils.json_to_sheet(rowData);
const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
const data = new Blob([excelBuffer], {type: fileType});
// debugger
//console.log(tableData);
FileSaver.saveAs(data, fileName + fileExtension);
}



  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Vehicle Type',
    //   selector: (row) => row.Vehicle_Type,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Vendor Code',
      selector: (row) => row.vendor_code,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Name',
      selector: (row) => row.owner_name,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Vendor No',
    //   selector: (row) => row.ve,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'PAN NO',
      selector: (row) => row.pan_card_number,
      sortable: true,
      center: true,
    },
    {
      name: 'Aadhar No',
      selector: (row) => row.aadhar_card_number,
      sortable: true,
      center: true,
    },
    {
      name: 'Bank Name',
      selector: (row) => row.bank_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Account.No',
      selector: (row) => row.bank_acc_number,
      sortable: true,
      center: true,
    },
    {
      name: 'Account hoder',
      selector: (row) => row.bank_acc_holder_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Bank Branch',
      selector: (row) => row.bank_branch,
      sortable: true,
      center: true,
    },
    {
      name: 'Bank IFSC',
      selector: (row) => row.bank_ifsc,
      sortable: true,
      center: true,
    },
    {
      name: 'Street',
      selector: (row) => row.street,
      sortable: true,
      center: true,
    },
    {
      name: 'Area',
      selector: (row) => row.area,
      sortable: true,
      center: true,
    },
    {
      name: 'City',
      selector: (row) => row.city,
      sortable: true,
      center: true,
    },
    {
      name: 'District',
      selector: (row) => row.district,
      sortable: true,
      center: true,
    },
    {
      name: 'State',
      selector: (row) => row.state,
      sortable: true,
      center: true,
    },
    {
      name: 'Postal Code',
      selector: (row) => row.postal_code,
      sortable: true,
      center: true,
    },
    {
      name: 'Gst Reg',
      selector: (row) => row.gst_registration,
      sortable: true,
      center: true,
    },
    {
      name: 'Gst Reg No',
      selector: (row) => row.gst_registration_number || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Gst tax Code',
      selector: (row) => row.gst_tax_code,
      sortable: true,
      center: true,
    },
    {
      name: 'Payment Terms',
      selector: (row) => row.payment_term_3days,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Name',
      selector: (row) => row.shed_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Aadhar Copy',
      selector: (row) => row.aadhar_copy,
      sortable: true,
      center: true,
    },
    {
      name: 'Pan copy',
      selector: (row) => row.pan_copy,
      sortable: true,
      center: true,
    },
    {
      name: 'Bank Passbook Copy',
      selector: (row) => row.bank_pass_copy,
      sortable: true,
      center: true,
    },

    {
      name: 'TDS Form Front',
      selector: (row) => row.tds_dec_form_front,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Form Back',
      selector: (row) => row.tds_dec_form_back,
      sortable: true,
      center: true,
    },
    {
      name: 'Created_at',
      selector: (row) => formatDate(row.created_at),
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Status',
      selector: (row) => row.vendor_status,
      sortable: true,
      center: true,
    },
  ]
  // const [value, onChange] = useState([new Date(), new Date()]);

    const formValues = {
      document_from_date_range: '',
      document_to_date_range: '',
      vendor_status:'',
    }
    const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
      loadVehicleReadyToTrip,
      VehicleMasterValidation,
      formValues
    )

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>
       {screenAccess ? (
        <>
        <CCard className="mt-4">
          <CContainer className="mt-1">
       <CRow className="mt-1 mb-1" >
          <CCol xs={12} md={3}>
          <CFormLabel htmlFor="VNum">
                Date Filter
          </CFormLabel>
          <DateRangePicker
            style={{width: '100rem',height:'100%',borderColor:'black'}}
            className="mb-2"
            id="rj_date_range"
            name="rj_date_range"
            format="dd-MM-yyyy"
            value={value}
            onChange={setValue}
            // onChange={getAdvanceDateRange(e)}
          />
          </CCol>

          <CCol xs={12} md={3}>
          <CFormLabel htmlFor="VNum">
                Vendor Status
          </CFormLabel>
          <VendorFilterComponent
                size="sm"
                className="mb-2"
                onChange={(e) => {
                  onChangeFilter(e, 'vendor_status')
                }}
                label="vendor_status"
                noOptionsMessage="Status Not found"
                search_type="vendor_status"
                search_data={searchFilterData}
              />
          </CCol>
        </CRow>
          <CCol
                   className="offset-md-9"
                    xs={12}
                    sm={12}
                    md={3}
                    style={{ display: 'flex', justifyContent: 'end' }}
                  >
                    <CButton
                      size="lg-sm"
                      color="primary"
                      className="mx-3 px-3 text-white"
                      onClick={() => {
                        setFetch(false)
                        loadVehicleReadyToTrip()}}
                    >
                      Filter
                    </CButton>
          </CCol>
          <hr style={{height:'2px', marginTop:'0.5px'}}></hr>
          <CRow>

          <CCol
          className="offset-md-9"
          xs={12}
          sm={12}
          md={3}
          style={{ display: 'flex', justifyContent: 'end' }}
          >
            <CButton
             size="lg-sm"
             color="warning"
             className="mx-3 px-3 text-white"
             onClick={(e) => {
              exportToCSV()}
              }
             >
             Export
            </CButton>
        </CCol>
          </CRow>
            <CustomTable
              columns={columns}
              data={rowData}
              fieldName={'Advance_user'}
              showSearchFilter={true}
            />
          </CContainer>
          <CModal
          size="xl"
          visible={visible}
          backdrop="static"
          scrollable
          onClose={() => setVisible(false)}
        >
          <CModalHeader>
            <CModalTitle style={{ display: 'flex', justifyContent: 'end'}}>Diesel Intent Vouchar</CModalTitle>
          </CModalHeader>

          <CModalBody>

          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
         {/*Rc copy front model*/}
         <CModal visible={RCCopyFront} onClose={() => setRCCopyFront(false)}>
          <CModalHeader>
            <CModalTitle>RC Copy Front</CModalTitle>
          </CModalHeader>
          <CModalBody>
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setRCCopyFront(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
         {/*Rc copy back model*/}
         <CModal visible={RCCopyBack} onClose={() => setRCCopyBack(false)}>
          <CModalHeader>
            <CModalTitle>RC Copy Back</CModalTitle>
          </CModalHeader>
          <CModalBody>
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setRCCopyBack(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
                 {/*lisense copy back model*/}
        <CModal visible={License_copy} onClose={() => setLicense_copy(false)}>
          <CModalHeader>
            <CModalTitle>License Copy</CModalTitle>
          </CModalHeader>
          <CModalBody>
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setLicense_copy(false) }>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
                         {/*Aadhar copy model*/}
        <CModal visible={Aadhar_copy} onClose={() => setAadhar_copy(false)}>
          <CModalHeader>
            <CModalTitle>Aadhar Copy</CModalTitle>
          </CModalHeader>
          <CModalBody>
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setAadhar_copy(false) }>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
            {/*pan copy model*/}
        <CModal visible={Pan_copy} onClose={() => setPan_copy(false)}>
          <CModalHeader>
            <CModalTitle>PAN Copy</CModalTitle>
          </CModalHeader>
          <CModalBody>
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setPan_copy(false) }>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
            {/*Passbook copy model*/}
        <CModal visible={Bank_pass_copy} onClose={() => setBank_pass_copy(false)}>
          <CModalHeader>
            <CModalTitle>Bank Passbook Copy</CModalTitle>
          </CModalHeader>
          <CModalBody>
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setBank_pass_copy(false) }>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
                    {/*Insurance front copy model*/}
        <CModal visible={Insurance_copy_front} onClose={() => setInsurance_copy_front(false)}>
          <CModalHeader>
            <CModalTitle>Insurance Copy Front</CModalTitle>
          </CModalHeader>
          <CModalBody>
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setInsurance_copy_front(false) }>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
                    {/*Insurance copy front model*/}
        <CModal visible={Insurance_copy_back} onClose={() => setInsurance_copy_back(false)}>
          <CModalHeader>
            <CModalTitle>Insurance Copy Back</CModalTitle>
          </CModalHeader>
          <CModalBody>
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setInsurance_copy_back(false) }>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
                      {/*Transporter shed copy model*/}
        <CModal visible={Transport_shed_sheet} onClose={() => setTransport_shed_sheet(false)}>
          <CModalHeader>
            <CModalTitle>Transport Shed Sheet</CModalTitle>
          </CModalHeader>
          <CModalBody>
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setTransport_shed_sheet(false) }>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
                      {/*TDS Front copy model*/}
       <CModal visible={TDS_dec_form_front} onClose={() => setTDS_dec_form_front(false)}>
          <CModalHeader>
            <CModalTitle>TDS Copy Front</CModalTitle>
          </CModalHeader>
          <CModalBody>
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setTDS_dec_form_front(false) }>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
                      {/*TDS Back copy model*/}
        <CModal visible={TDS_dec_form_back} onClose={() => setTDS_dec_form_back(false)}>
          <CModalHeader>
            <CModalTitle>TDS Copy Back</CModalTitle>
          </CModalHeader>
          <CModalBody>
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setTDS_dec_form_back(false) }>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
                     {/*Owner Transfer form model*/}
        <CModal visible={Ownership_transfer_form} onClose={() => setOwnership_transfer_form(false)}>
          <CModalHeader>
            <CModalTitle>Owner Transfer From</CModalTitle>
          </CModalHeader>
          <CModalBody>
          {(!documentSrc.includes(".pdf"))?<CCardImage orientation="top" src={documentSrc} />: <iframe orientation="top" height={500} width={475} src={documentSrc} ></iframe> }
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setOwnership_transfer_form(false) }>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
        </CCard>
        </>
	     ) : (<AccessDeniedComponent />)}
      </>
      )}
    </>
  )
}

export default VendorCreationReport
