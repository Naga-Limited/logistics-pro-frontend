import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol, 
  CContainer,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CCardImage,
} from '@coreui/react' 
import CustomTable from 'src/components/customComponent/CustomTable' 
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite' 
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods' 
import FCIVendorSerachSelectComponent from '../CommonMethods/FCIVendorSerachSelectComponent'
import Swal from 'sweetalert2';
import AuthService from 'src/Service/Auth/AuthService'
import LocalStorageService from 'src/Service/LocalStoage'
import FCIVendorCreationService from 'src/Service/FCIMovement/FCIVendorCreation/FCIVendorCreationService'
import CustomSpanButtonDocVerify from 'src/components/customComponent/CustomSpanButtonDocVerify'
import noimage_logo from 'src/assets/naga/image-not-found.png'

const FCIVendorReport = () => { 

  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  var user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })
  /* Get User Id From Local Storage */
  const user_id = user_info.user_id
  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

    if (event_type == 'report_vendor_pan') {
      if (selected_value) {
        setReportPANNo(selected_value)
      } else {
        setReportPANNo('')
      }
    } else if (event_type == 'report_vendor_status') {
      if (selected_value) {
        setReportVStatus(selected_value)
      } else {
        setReportVStatus('')
      }
    }  
  }

  function logout() {
    AuthService.forceLogout(user_id).then((res) => {
      // console.log(res)
      if (res.status == 204) {
        LocalStorageService.clear()
        window.location.reload(false)
      }
    })
  }

  const exportToCSV = () => {
    if (defaultDate == null) {
      toast.warning('Date Filter Should not be empty..!')
      return false
    } else if (
      defaultDate == null &&
      reportVehicle == '' &&
      reportShipmentNo == 0 &&
      reportTripsheetNo == 0 &&
      reportShipmentStatus == 0
    ) {
      toast.warning('Choose atleast one filter type..!')
      return false
    }
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='FCI_Vendor_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const [rowData, setRowData] = useState([])
  const [searchFilterData, setSearchFilterData] = useState([]) 
  const [fetch, setFetch] = useState(false)

  const [pending, setPending] = useState(true)

  /* Report Variables */  
  const [reportPANNo, setReportPANNo] = useState('')
  const [reportVStatus, setReportVStatus] = useState('') 

  let tableReportData = []

  /* Set Default Date (Today) in a Variable State */
  const [defaultDate, setDefaultDate] = React.useState([
    new Date(getCurrentDate('-')),
    new Date(getCurrentDate('-')),
  ])

  useEffect(() => {
    console.log(defaultDate)
    if (defaultDate) {
      setDefaultDate(defaultDate)
    } else {
    }
  }, [defaultDate])

  const [Aadhar_copy, setAadhar_copy] = useState(false)
  const [Pan_copy, setPan_copy] = useState(false)
  const [Bank_pass_copy, setBank_pass_copy] = useState(false)
  const [TDS_copy, setTDS_copy] = useState(false)

  const [documentSrc, setDocumentSrc] = useState('')

  function handleViewDocuments(e, id, type) {
    switch (type) {       
      case 'AADHAR_COPY':
      {
        let singleVehicleInfo = tableReportData.filter((data) => data.vendor_id == id)
        console.log(singleVehicleInfo,'singleVehicleInfo')
        console.log(id,'id')
        setDocumentSrc(singleVehicleInfo[0].aadhar_card_copy)
        setAadhar_copy(true)
      }
      break
      case 'PAN_COPY':
      {
        let singleVehicleInfo = tableReportData.filter((data) => data.vendor_id == id)
        setDocumentSrc(singleVehicleInfo[0].pan_card_copy)
        setPan_copy(true)
      }
      break
      case 'PASS_BOOK':
      {
        let singleVehicleInfo = tableReportData.filter((data) => data.vendor_id == id)
        setDocumentSrc(singleVehicleInfo[0].bank_passbook_copy)
        setBank_pass_copy(true)
      }
      break 
      case 'TDS_COPY':
      {
        let singleVehicleInfo = tableReportData.filter((data) => data.vendor_id == id)
        setDocumentSrc(singleVehicleInfo[0].tds_declaration_copy)
        setTDS_copy(true)
      }
      break 
    }

  }

  const VSTATUS = ["FCI VC Rejected","FCI VC Requested","FCI VC Approved","FCI VC Confirmed","FCI VC Cancelled"]

  const loadTripSheetReport = (fresh_type = '') => {

    if (fresh_type !== '1') {

      FCIVendorCreationService.getVendorMasterDataForReport().then((res) => { 
        tableReportData = res.data.data
        console.log(tableReportData,'getVendorMasterDataForReport')

        setFetch(true)
        let rowDataList = []

        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Vendor_Name: data.vendor_name, 
            Vendor_Code: data.vendor_code, 
            Vendor_Mobile_No: data.vendor_mobile_no, 
            Vendor_Bank_Acc_No: data.bank_acc_no, 
            Vendor_PAN_No: data.pan_no, 
            Vendor_Aadhar_Card_No: data.aadhar_card_no, 
            Vendor_Bank_Name: data.bank_name, 
            Vendor_Bank_Acc_Holder_Name: data.bank_acc_holder_name, 
            Vendor_Bank_Branch_Name: data.bank_branch, 
            Vendor_Bank_IFSC_Code: data.bank_ifsc_code, 
            Vendor_Street: data.street, 
            Vendor_Area: data.area, 
            Vendor_City: data.city, 
            Vendor_District: data.district, 
            Vendor_State: data.state, 
            Vendor_Postal_Code: data.postal_code, 
            Vendor_Region: data.region,   
            Vendor_Shed_Name: data.vcr_shed_info?.shed_name, 
            Vendor_Shed_Owner_Name: data.vcr_shed_info?.shed_owner_name, 
            Vendor_Shed_Owner_Mobile_No: data.vcr_shed_info?.shed_owner_phone_1,  
            Vendor_Payment_Term_Type: data.payment_term_type, 
            Vendor_TDS_Tax_Code: data.tds_tax_code, 
            Vendor_GST_Reg_Having: data.gst_registration_having == 1 ? 'Yes': 'No', 
            Vendor_GST_Reg_No: data.gst_registration_number ?  data.gst_registration_number : '-', 
            Vendor_GST_Tax_Code: data.gst_tax_code ? data.gst_tax_code : '-', 
            Vendor_Aadhar_Copy: (
              <CustomSpanButtonDocVerify
                handleViewDocuments={handleViewDocuments}
                Document_id={data.vendor_id}
                documentType={'AADHAR_COPY'}
              />
            ),
            Vendor_PAN_Copy: (
              <CustomSpanButtonDocVerify
                handleViewDocuments={handleViewDocuments}
                Document_id={data.vendor_id}
                documentType={'PAN_COPY'}
              />
            ),
            Vendor_Bank_Passbook_Copy:  (
              <CustomSpanButtonDocVerify
                handleViewDocuments={handleViewDocuments}
                Document_id={data.vendor_id}
                documentType={'PASS_BOOK'}
              />
            ),
            Vendor_Tds_Copy:  (
              <CustomSpanButtonDocVerify
                handleViewDocuments={handleViewDocuments}
                Document_id={data.vendor_id}
                documentType={'TDS_COPY'}
              />
            ),          
            Remarks: data.remarks ? data.remarks : '-',                 
            Status: data.vendor_status >= 0 ? VSTATUS[data.vendor_status]: '-',
            Created_date: data.created_date,
            Created_By: data.vcr_user_info?.emp_name,
          })
        })
        setFetch(true)
        setRowData(rowDataList)
        setPending(false)
      })
      .catch((error) => {
        setFetch(true)
        console.log(error)
        let errorText = error.response.data.message
        console.log(errorText,'errorText')
        let timerInterval;
        if (error.response.status === 401) { 
          Swal.fire({
            title: "Unauthorized Activities Found..",
            html: "App will close in <b></b> milliseconds.",
            icon: "error",
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              const timer = Swal.getPopup().querySelector("b");
              timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            }
          }).then((result) => { 
            if (result.dismiss === Swal.DismissReason.timer) { 
              logout()
            }
          });      
        }
      })
    } else {
      if (defaultDate == null) {
        setFetch(true)
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportPANNo == '' &&
        reportVStatus == ''  
      ) {
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('pan_no', reportPANNo)
      report_form_data.append('v_status', reportVStatus) 
      console.log(defaultDate, 'defaultDate')
      console.log(reportPANNo, 'reportPANNo')
      console.log(reportVStatus, 'reportVStatus')  
      // setFetch(true)
      // return false

      FCIVendorCreationService.sentVendorMasterForReport(report_form_data).then((res) => {
        console.log(res, 'res')
        tableReportData = res.data.data 
        console.log(tableReportData,'sentVendorMasterForReport')

        setFetch(true)
        let rowDataList = []

        setSearchFilterData(tableReportData)
        tableReportData.map((data, index) => {
          rowDataList.push({
            sno: index + 1,
            Vendor_Name: data.vendor_name, 
            Vendor_Code: data.vendor_code, 
            Vendor_Mobile_No: data.vendor_mobile_no, 
            Vendor_Bank_Acc_No: data.bank_acc_no, 
            Vendor_PAN_No: data.pan_no, 
            Vendor_Aadhar_Card_No: data.aadhar_card_no, 
            Vendor_Bank_Name: data.bank_name, 
            Vendor_Bank_Acc_Holder_Name: data.bank_acc_holder_name, 
            Vendor_Bank_Branch_Name: data.bank_branch, 
            Vendor_Bank_IFSC_Code: data.bank_ifsc_code, 
            Vendor_Street: data.street, 
            Vendor_Area: data.area, 
            Vendor_City: data.city, 
            Vendor_District: data.district, 
            Vendor_State: data.state, 
            Vendor_Postal_Code: data.postal_code, 
            Vendor_Region: data.region,   
            Vendor_Shed_Name: data.vcr_shed_info?.shed_name, 
            Vendor_Shed_Owner_Name: data.vcr_shed_info?.shed_owner_name, 
            Vendor_Shed_Owner_Mobile_No: data.vcr_shed_info?.shed_owner_phone_1,  
            Vendor_Payment_Term_Type: data.payment_term_type, 
            Vendor_TDS_Tax_Code: data.tds_tax_code, 
            Vendor_GST_Reg_Having: data.gst_registration_having == 1 ? 'Yes': 'No', 
            Vendor_GST_Reg_No: data.gst_registration_number ?  data.gst_registration_number : '-', 
            Vendor_GST_Tax_Code: data.gst_tax_code ? data.gst_tax_code : '-', 
            Vendor_Aadhar_Copy: (
              <CustomSpanButtonDocVerify
                handleViewDocuments={handleViewDocuments}
                Document_id={data.vendor_id}
                documentType={'AADHAR_COPY'}
              />
            ),
            Vendor_PAN_Copy: (
              <CustomSpanButtonDocVerify
                handleViewDocuments={handleViewDocuments}
                Document_id={data.vendor_id}
                documentType={'PAN_COPY'}
              />
            ),
            Vendor_Bank_Passbook_Copy:  (
              <CustomSpanButtonDocVerify
                handleViewDocuments={handleViewDocuments}
                Document_id={data.vendor_id}
                documentType={'PASS_BOOK'}
              />
            ),
            Vendor_Tds_Copy:  (
              <CustomSpanButtonDocVerify
                handleViewDocuments={handleViewDocuments}
                Document_id={data.vendor_id}
                documentType={'TDS_COPY'}
              />
            ),                
            Remarks: data.remarks ? data.remarks : '-',                
            Status: data.vendor_status ? VSTATUS[data.vendor_status]: '-',
            Created_date: data.created_date,
            Created_By: data.vcr_user_info?.emp_name,
          })
        })
        setRowData(rowDataList)
        setPending(false)
      })
      .catch((error) => {
        setFetch(true)
        console.log(error)
        let errorText = error.response.data.message
        console.log(errorText,'errorText')
        let timerInterval;
        if (error.response.status === 401) { 
          Swal.fire({
            title: "Unauthorized Activities Found..",
            html: "App will close in <b></b> milliseconds.",
            icon: "error",
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              const timer = Swal.getPopup().querySelector("b");
              timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            }
          }).then((result) => {  
            if (result.dismiss === Swal.DismissReason.timer) { 
              logout()
            }
          });      
        }
      })
    }
  }

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.FCIReportModule.FCI_Vendor_Master_report

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

  useEffect(() => {
    loadTripSheetReport()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Name',
      selector: (row) => row.Vendor_Name,
      sortable: true,
      center: true,
    },  
    {
      name: 'Vendor Code',
      selector: (row) => row.Vendor_Code,
      sortable: true,
      center: true,
    },    
    {
      name: 'PAN No.',
      selector: (row) => row.Vendor_PAN_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Mobile No',
      selector: (row) => row.Vendor_Mobile_No,
      sortable: true,
      center: true,
    },
    {
      name: 'City',
      selector: (row) => row.Vendor_City,
      sortable: true,
      center: true,
    },
    {
      name: 'District',
      selector: (row) => row.Vendor_District,
      sortable: true,
      center: true,
    },
    {
      name: 'Region-State',
      selector: (row) => row.Vendor_State,
      sortable: true,
      center: true,
    },
    {
      name: 'PIN Code',
      selector: (row) => row.Vendor_Postal_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Name',
      selector: (row) => row.Vendor_Shed_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Type',
      selector: (row) => row.Vendor_TDS_Tax_Code,
      sortable: true,
      center: true,
    },   
    {
      name: 'Aadhar Copy',
      selector: (row) => row.Vendor_Aadhar_Copy,
      sortable: true,
      center: true,
    },
    {
      name: 'Pan copy',
      selector: (row) => row.Vendor_PAN_Copy,
      sortable: true,
      center: true,
    },
    {
      name: 'Bank Passbook Copy',
      selector: (row) => row.Vendor_Bank_Passbook_Copy,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Copy',
      selector: (row) => row.Vendor_Tds_Copy,
      sortable: true,
      center: true,
    },
    {
      name: 'Remarks',
      selector: (row) => row.Remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Creation By',
      selector: (row) => row.Created_By,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation Date',
      selector: (row) => row.Created_date,
      sortable: true,
      center: true,
    },  
  ]

  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
    }`
  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <CCard className="mt-4">
              <CContainer className="m-2">
                <CRow className="mt-1 mb-1">
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">Date Filter</CFormLabel>
                    <DateRangePicker
                      style={{ width: '100rem', height: '100%', borderColor: 'black' }}
                      className="mb-2"
                      id="start_date"
                      name="end_date"
                      format="dd-MM-yyyy"
                      value={defaultDate}
                      onChange={setDefaultDate}
                    />
                  </CCol>                  
 
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">PAN Number</CFormLabel>
                    <FCIVendorSerachSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'report_vendor_pan')
                      }}
                      label="Select PAN Number"
                      noOptionsMessage="PAN Not found"
                      search_type="report_vendor_pan"
                      search_data={searchFilterData}
                    />
                  </CCol>  

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="VNum">
                      Vendor Status
                    </CFormLabel>
                    <FCIVendorSerachSelectComponent
                      size="sm"
                      className="mb-2"
                      onChange={(e) => {
                        onChangeFilter(e, 'report_vendor_status')
                      }}
                      label="Select Vendor Status"
                      noOptionsMessage="Vendor Status Not found"
                      search_type="report_vendor_status"
                      search_data={searchFilterData}
                    />
                  </CCol>


                </CRow>
                <CRow className="mt-3">
                  <CCol className="" xs={12} sm={9} md={3}></CCol>

                  <CCol
                    className="offset-md-6"
                    xs={12}
                    sm={9}
                    md={3}
                    style={{ display: 'flex', justifyContent: 'end' }}
                  >
                    <CButton
                      size="sm"
                      color="primary"
                      className="mx-3 px-3 text-white"
                      onClick={() => {
                        setFetch(false)
                        loadTripSheetReport('1')
                      }}
                    >
                      Filter
                    </CButton>
                    <CButton
                      size="sm"
                      color="warning"
                      className="mx-3 px-3 text-white"
                      onClick={(e) => { 
                          exportToCSV()
                        }}
                    >
                      Export
                    </CButton>
                  </CCol>
                </CRow>
                <CustomTable
                  columns={columns}
                  data={rowData}
                  fieldName={'Driver_Name'}
                  showSearchFilter={true}
                />
                {/*Aadhar copy model*/}
                <CModal visible={Aadhar_copy} onClose={() => setAadhar_copy(false)}>
                  <CModalHeader>
                    <CModalTitle>Aadhar Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                  <CModalBody>
                    {(!documentSrc.includes(".pdf")) ? 
                      <CCardImage 
                        orientation="top"   
                        src={documentSrc ? documentSrc : noimage_logo}
                      /> : 
                      <iframe 
                        orientation="top" 
                        height={500} 
                        width={475} 
                        src={documentSrc ? documentSrc : noimage_logo} 
                      >
                      </iframe> 
                    }
                  </CModalBody>
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
                  <CModalBody>
                    {(!documentSrc.includes(".pdf")) ? 
                      <CCardImage 
                        orientation="top"   
                        src={documentSrc ? documentSrc : noimage_logo}
                      /> : 
                      <iframe 
                        orientation="top" 
                        height={500} 
                        width={475} 
                        src={documentSrc ? documentSrc : noimage_logo} 
                      >
                      </iframe> 
                    }
                  </CModalBody>
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
                  <CModalBody>
                    {(!documentSrc.includes(".pdf")) ? 
                      <CCardImage 
                        orientation="top"   
                        src={documentSrc ? documentSrc : noimage_logo}
                      /> : 
                      <iframe 
                        orientation="top" 
                        height={500} 
                        width={475} 
                        src={documentSrc ? documentSrc : noimage_logo} 
                      >
                      </iframe> 
                    }
                  </CModalBody>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setBank_pass_copy(false) }>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>

                {/*TDS copy model*/}
                <CModal visible={TDS_copy} onClose={() => setTDS_copy(false)}>
                  <CModalHeader>
                    <CModalTitle>TDS Copy</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    {(!documentSrc.includes(".pdf")) ? 
                      <CCardImage 
                        orientation="top"   
                        src={documentSrc ? documentSrc : noimage_logo}
                      /> : 
                      <iframe 
                        orientation="top" 
                        height={500} 
                        width={475} 
                        src={documentSrc ? documentSrc : noimage_logo} 
                      >
                      </iframe> 
                    }
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setTDS_copy(false) }>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
              </CContainer>
            </CCard> ) : ( <AccessDeniedComponent />
          )}
        </>
      )}      
    </>
  )
}

export default FCIVendorReport
