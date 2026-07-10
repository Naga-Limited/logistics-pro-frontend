import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol,
  CContainer,
  CFormLabel,
  CModalHeader,
  CModalTitle,
  CCardImage,
  CModal,
  CModalFooter,
  CModalBody,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { DateRangePicker } from 'rsuite'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import RakeClosureSubmissionService from 'src/Service/RakeMovement/RakeClosureSubmission/RakeClosureSubmissionService'
import { formatDateAsDDMMYYY } from '../../CommonMethods/CommonMethods'

const RakeFIEntryReport = () => {

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()
  const is_admin = user_info.user_id == 1 && user_info.is_admin == 1

  if(is_admin){
    console.log(user_info)
  }

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
  let page_no = LogisticsProScreenNumberConstants.RakeReportModule.Rake_FIEntry_report

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


  const onChangeFilter = (event, event_type) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')

   if (event_type == 'rps_no') {
      if (selected_value) {
        setReportRPSNo(selected_value)
      } else {
        setReportRPSNo(0)
      }
    } else if (event_type == 'rake_fi_type') {
      if (selected_value) {
        setReportFiType(selected_value)
      } else {
        setReportFiType(0)
      }
    }
  }

  const exportToCSV = () => {
    console.log(rowData,'exportCsvData')
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Rake_FIEntry_Report_'+dateTimeString
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
  const [visible, setVisible] = useState(false)
  const [fiImgSrc, setFiImgSrc] = React.useState(null);

  /* Report Variables */

  const [reportRPSNo, setReportRPSNo] = useState(0)
  const [reportRakeFiType, setReportFiType] = useState(0)

  let tableData = []
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

  const rake_column = [
    {
      name: 'S.No',
      selector: (row) => row.SNO,
      sortable: true,
      center: true,
    },
    {
      name: 'RPS No',
      selector: (row) => row.RPS_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'FNR No',
      selector: (row) => row.FNR_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'Plant',
      selector: (row) => row.RAKE_LOC,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Name',
      selector: (row) => row.VENDOR_NAME,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Code',
      selector: (row) => row.VENDOR_CODE,
      sortable: true,
      center: true,
    },
    {
      name: 'FI Entry Type',
      selector: (row) => row.FI_TYPE,
      sortable: true,
      center: true,
    },
    {
      name: 'Income Division',
      selector: (row) => row.INCOME_DIV,
      sortable: true,
      center: true,
    },
    {
      name: 'GST Tax Type',
      selector: (row) => row.GST_TAX,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Available',
      selector: (row) => row.TDS_AVAIL,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Tax Type',
      selector: (row) => row.TDS_TAX,
      sortable: true,
      center: true,
    },
    {
      name: 'GL Count',
      selector: (row) => row.GL_COUNT,
      sortable: true,
      center: true,
    },
    {
      name: 'Supp. Ref. No',
      selector: (row) => row.SUP_REF_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'Supp. Doc. Date',
      selector: (row) => row.SUP_DOC_DATE,
      sortable: true,
      center: true,
    },
    {
      name: 'FI Doc. No',
      selector: (row) => row.INCOME_FI_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'FI TDS Doc. No',
      selector: (row) => row.INCOME_FI_TDS_DOC,
      sortable: true,
      center: true,
    },
    {
      name: 'Attachment',
      selector: (row) => row.ATTACHMENT,
      // sortable: true,
      center: true,
    },
    {
      name: 'SAP Posting Date',
      selector: (row) => row.POSTING_DATE,
      sortable: true,
      center: true,
    },
    {
      name: 'GL Code',
      selector: (row) => row.INCOME_GL,
      sortable: true,
      center: true,
    },
    {
      name: 'GL Code',
      selector: (row) => row.GL_TYPE,
      sortable: true,
      center: true,
    },
    {
      name: 'GL Amount',
      selector: (row) => row.GL_AMOUNT,
      sortable: true,
      center: true,
    },
    {
      name: 'Amount',
      selector: (row) => row.INCOME_EXPENSE_AMOUNT,
      sortable: true,
      center: true,
    },
    {
      name: 'Remarks',
      selector: (row) => row.FI_REMARKS,
      sortable: true,
      center: true,
    },
    {
      name: 'TDS Remarks',
      selector: (row) => row.FI_TDS_REMARKS,
      sortable: true,
      center: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.USER_NAME,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation Time',
      selector: (row) => row.CREATION_TIME,
      sortable: true,
      center: true,
    },
  ]

  const border = {
    borderColor: '#b1b7c1',
    cursor: 'pointer'
  }

  const RakeFI_Array = ['','Expense Credit','Expense Debit','Income Credit','Income Debit']
  const RakePlant_Array = []
  RakePlant_Array['R1'] = 'Dindigul'
  RakePlant_Array['R2'] = 'Aruppukottai'

  const rakeFIEntryReport = (fresh_type = '') => {
    /*================== User Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    var user_locations = []

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    if (fresh_type !== '1') {
      // console.log(user_locations)
      /*================== User Location Fetch ======================*/

      RakeClosureSubmissionService.getFiEntryDataForReport().then((res) => {
        setFetch(true)
        tableReportData = res.data.data
        setSearchFilterData(tableReportData)
        console.log(res.data.data,'getFiEntryDataForReport')
        let rowDataList = []
        let filterData = tableReportData
        console.log(filterData)
        let indexNo = 0
        filterData.map((data, index) => {
          console.log(data,'getFIInfoByRPSChild',index)
          if(data.fi_entry_mode == 3 || data.fi_entry_mode == 4){
            indexNo += 1
            rowDataList.push({
              SNO: indexNo,
              RPS_NO: data.rps_no,
              FNR_NO: data.fnr_no,
              RAKE_LOC: RakePlant_Array[data.rake_plant_code],
              RPS_DATE: data.created_at_date,
              VENDOR_NAME: data.rake_vendor_info.v_name,
              VENDOR_CODE:data.vendor_code,
              INCOME_DIV:data.income_division,
              FI_TYPE: RakeFI_Array[data.fi_entry_mode],
              FI_REMARKS:data.fi_remarks,
              FI_TDS_REMARKS:data.fi_tds_remarks,
              INCOME_GL:data.income_gl_code,
              GL_AMOUNT:data.amount,
              INCOME_EXPENSE_AMOUNT:data.amount,
              INCOME_FI_DOC:data.sap_fi_doc_no,
              ATTACHMENT:(
                <span
                  onClick={() => {
                    setVisible(!visible)
                    setFiImgSrc(data.attachment_copy)
                  }}
                  className="w-100 m-0"
                  color="info"
                  size="sm"
                  id="odoImg"
                  style={border}
                >
                  <span className="float-start">
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </span>
                </span>
              ),
              INCOME_FI_TDS_DOC:data.sap_fi_tds_doc_no,
              POSTING_DATE:formatDateAsDDMMYYY(data.sap_posting_date),
              USER_NAME:data.fi_user_info.emp_name,
              CREATION_TIME: data.fi_date_time_string,
              GST_TAX:'--',
              TDS_AVAIL:'--',
              TDS_TAX:'--',
              GL_COUNT:'1',
              SUP_REF_NO:'--',
              SUP_DOC_DATE:'--',
              GL_TYPE:'FREIGHT INCOME - INTER COMPANY',
            })

          } else {
            data.freight_gl_info.map((data1, index2) => {
              indexNo += 1
              rowDataList.push({
                SNO: indexNo,
                RPS_NO: data.rps_no,
                FNR_NO: data.fnr_no,
                RAKE_LOC: RakePlant_Array[data.rake_plant_code],
                RPS_DATE: data.created_at_date,
                VENDOR_NAME: data.rake_vendor_info.v_name,
                VENDOR_CODE:data.vendor_code,
                INCOME_DIV:data.income_division,
                FI_TYPE: RakeFI_Array[data.fi_entry_mode],
                FI_REMARKS:data.fi_remarks,
                FI_TDS_REMARKS:'--',
                INCOME_GL:data1.GL_CODE,
                GL_AMOUNT:data1.EXPENSE_AMT,
                INCOME_EXPENSE_AMOUNT:data.amount,
                INCOME_FI_DOC:data.sap_fi_doc_no,
                ATTACHMENT:(
                  <span
                    onClick={() => {
                      setVisible(!visible)
                      setFiImgSrc(data.attachment_copy)
                    }}
                    className="w-100 m-0"
                    color="info"
                    size="sm"
                    id="odoImg"
                    style={border}
                  >
                    <span className="float-start">
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </span>
                  </span>
                ),
                INCOME_FI_TDS_DOC:'--',
                POSTING_DATE:formatDateAsDDMMYYY(data.sap_posting_date),
                USER_NAME:data.fi_user_info.emp_name,
                CREATION_TIME: data.fi_date_time_string,
                GST_TAX:data.gst_tax_type,
                TDS_AVAIL:data.tds_available == '1' ? 'YES' : 'NO',
                TDS_TAX:data.tds_tax_type,
                GL_COUNT:data.freight_gl_info.length,
                SUP_REF_NO:data.supplier_ref_no,
                SUP_DOC_DATE:data.supplier_doc_date,
                GL_TYPE:data1.label
              })
            })
          }

        })
        setRowData(rowDataList)

      })
    } else {
      if (defaultDate == null) {
        setFetch(true)
        toast.warning('Date Filter Should not be empty..!')
        return false
      } else if (
        defaultDate == null &&
        reportRPSNo == 0 &&
        reportRakeFiType == 0
      ) {
        setFetch(true)
        toast.warning('Choose atleast one filter type..!')
        return false
      }
      let report_form_data = new FormData()
      report_form_data.append('date_between', defaultDate)
      report_form_data.append('rps_no', reportRPSNo)
      report_form_data.append('fi_entry_mode', reportRakeFiType)
      console.log(defaultDate, 'defaultDate')
      console.log(reportRPSNo, 'reportTSNo')
      console.log(reportRakeFiType, 'reportRakeFiType')

      RakeClosureSubmissionService.sentFiEntryDataForReport(report_form_data).then((res) => {
        setFetch(true)
        tableReportData = res.data.data
        setSearchFilterData(tableReportData)
        console.log(res.data.data,'sentFiEntryDataForReport')
        let rowDataList = []
        let filterData = tableReportData
        console.log(filterData)
        let indexNo = 0
        filterData.map((data, index) => {
          console.log(data,'getFIInfoByRPSChild',index)
          if(data.fi_entry_mode == 3 || data.fi_entry_mode == 4){
            indexNo += 1
            rowDataList.push({
              SNO: indexNo,
              RPS_NO: data.rps_no,
              FNR_NO: data.fnr_no,
              RAKE_LOC: RakePlant_Array[data.rake_plant_code],
              RPS_DATE: data.created_at_date,
              VENDOR_NAME: data.rake_vendor_info.v_name,
              VENDOR_CODE:data.vendor_code,
              INCOME_DIV:data.income_division,
              FI_TYPE: RakeFI_Array[data.fi_entry_mode],
              FI_REMARKS:data.fi_remarks,
              FI_TDS_REMARKS:data.fi_tds_remarks,
              INCOME_GL:data.income_gl_code,
              GL_AMOUNT:data.amount,
              INCOME_EXPENSE_AMOUNT:data.amount,
              INCOME_FI_DOC:data.sap_fi_doc_no,
              ATTACHMENT:(
                <span
                  onClick={() => {
                    setVisible(!visible)
                    setFiImgSrc(data.attachment_copy)
                  }}
                  className="w-100 m-0"
                  color="info"
                  size="sm"
                  id="odoImg"
                  style={border}
                >
                  <span className="float-start">
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </span>
                </span>
              ),
              INCOME_FI_TDS_DOC:data.sap_fi_tds_doc_no,
              POSTING_DATE:formatDateAsDDMMYYY(data.sap_posting_date),
              USER_NAME:data.fi_user_info.emp_name,
              CREATION_TIME: data.fi_date_time_string,
              GST_TAX:'--',
              TDS_AVAIL:'--',
              TDS_TAX:'--',
              GL_COUNT:'1',
              SUP_REF_NO:'--',
              SUP_DOC_DATE:'--',
              GL_TYPE:'FREIGHT INCOME - INTER COMPANY',
            })

          } else {
            data.freight_gl_info.map((data1, index2) => {
              indexNo += 1
              rowDataList.push({
                SNO: indexNo,
                RPS_NO: data.rps_no,
                FNR_NO: data.fnr_no,
                RAKE_LOC: RakePlant_Array[data.rake_plant_code],
                RPS_DATE: data.created_at_date,
                VENDOR_NAME: data.rake_vendor_info.v_name,
                VENDOR_CODE:data.vendor_code,
                INCOME_DIV:data.income_division,
                FI_TYPE: RakeFI_Array[data.fi_entry_mode],
                FI_REMARKS:data.fi_remarks,
                FI_TDS_REMARKS:'--',
                INCOME_GL:data1.GL_CODE,
                GL_AMOUNT:data1.EXPENSE_AMT,
                INCOME_EXPENSE_AMOUNT:data.amount,
                INCOME_FI_DOC:data.sap_fi_doc_no,
                ATTACHMENT:(
                  <span
                    onClick={() => {
                      setVisible(!visible)
                      setFiImgSrc(data.attachment_copy)
                    }}
                    className="w-100 m-0"
                    color="info"
                    size="sm"
                    id="odoImg"
                    style={border}
                  >
                    <span className="float-start">
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </span>
                  </span>
                ),
                INCOME_FI_TDS_DOC:'--',
                POSTING_DATE:formatDateAsDDMMYYY(data.sap_posting_date),
                USER_NAME:data.fi_user_info.emp_name,
                CREATION_TIME: data.fi_date_time_string,
                GST_TAX:data.gst_tax_type,
                TDS_AVAIL:data.tds_available == '1' ? 'YES' : 'NO',
                TDS_TAX:data.tds_tax_type,
                GL_COUNT:data.freight_gl_info.length,
                SUP_REF_NO:data.supplier_ref_no,
                SUP_DOC_DATE:data.supplier_doc_date,
                GL_TYPE:data1.label
              })
            })
          }

        })
        setRowData(rowDataList)
      })
    }
  }

  useEffect(() => {
    rakeFIEntryReport()
  }, [])

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
            <>
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
                      <CFormLabel htmlFor="VNum">RPS Number</CFormLabel>
                      <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'rps_no')
                        }}
                        label="Select RPS Number"
                        noOptionsMessage="RPS Not found"
                        search_type="rake_fi_report_rps_number"
                        search_data={searchFilterData}
                      />
                    </CCol>

                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="VNum">FI Entry Type</CFormLabel>
                      <SearchSelectComponent
                        size="sm"
                        className="mb-2"
                        onChange={(e) => {
                          onChangeFilter(e, 'rake_fi_type')
                        }}
                        label="Select FI Type"
                        noOptionsMessage="Type Not found"
                        search_type="rake_fi_report_type"
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
                          rakeFIEntryReport('1')
                        }}
                      >
                        Filter
                      </CButton>
                      <CButton
                        size="lg-sm"
                        color="warning"
                        className="mx-3 px-3 text-white"
                        onClick={(e) => {
                            // loadVehicleReadyToTripForExportCSV()
                            exportToCSV()
                          }}
                      >
                        Export
                      </CButton>
                    </CCol>
                  </CRow>
                  <CustomTable
                    columns={rake_column}
                    data={rowData}
                    fieldName={'Driver_Name'}
                    showSearchFilter={true}
                  />
                </CContainer>
              </CCard>
              {/* ============== FI-Entry Attachment Copy Modal Area Start ================= */}
                <CModal
                  visible={visible}
                  onClose={() => {
                    setVisible(false)
                    setFiImgSrc("")
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>FI Attachment Copy</CModalTitle>
                  </CModalHeader>

                  <CModalBody>
                    {fiImgSrc &&
                    !fiImgSrc.includes('.pdf') ? (
                      <CCardImage orientation="top" src={fiImgSrc} />
                    ) : (
                      <iframe
                        orientation="top"
                        height={500}
                        width={475}
                        src={fiImgSrc}
                      ></iframe>
                    )}
                  </CModalBody>

                  <CModalFooter>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setVisible(false)
                        setFiImgSrc("")
                      }}
                    >
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
              {/* ============== FI-Entry Attachment Copy Modal Area Start ================= */}
            </> ) : (<AccessDeniedComponent />)
          }
        </>
      )}
    </>
  )
}

export default RakeFIEntryReport

