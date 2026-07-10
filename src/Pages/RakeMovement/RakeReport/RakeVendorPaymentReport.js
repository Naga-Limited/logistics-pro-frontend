import { 
    CButton, 
    CCard, 
    CContainer,
    CCol,
    CRow,
    CModal,
    CModalHeader,
    CModalTitle, 
    CModalBody,
    CModalFooter,  
    CFormLabel
} from '@coreui/react' 
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader' 
import VehicleMasterValidation from 'src/Utils/Master/VehicleMasterValidation'
import useForm from 'src/Hooks/useForm'
import { DateRangePicker } from 'rsuite';
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';   
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants' 
import RakeTripsheetCreationService from 'src/Service/RakeMovement/RakeTripsheetCreation/RakeTripsheetCreationService'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import RakeSerachSelectComponent from '../CommonMethods/RakeSerachSelectComponent'
  
const RakeVendorPaymentReport = () => {

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
    let page_no = LogisticsProScreenNumberConstants.RakeReportModule.Rake_Vendor_Payment_report
  
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
  
    const [rowData, setRowData] = useState([])
    const [fetch, setFetch] = useState(false) 
    const [visible, setVisible] = useState(false) 
  
    const onChangeFilter = (event, event_type) => {
        var selected_value = event.value
        if (event_type == 'truck_no') {
            if (selected_value) {
                setReportVehicle(selected_value)
            } else {
                setReportVehicle(0)
            }
        } else if (event_type == 'vendor_code') {
            if (selected_value) {
                setReportVendor(selected_value)
            } else {
                setReportVendor(0)
            }
        } else if (event_type == 'po_no') {
            if (selected_value) {
                setReportPONo(selected_value)
            } else {
                setReportPONo(0)
            }
        }  
    }
    
    const [reportVehicle, setReportVehicle] = useState(0)
    const [reportVendor, setReportVendor] = useState(0)
    const [reportPONo, setReportPONo] = useState(0) 
    const [searchFilterData, setSearchFilterData] = useState([]) 
  
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
  
    let tableData1 = []
    const loadVehicleReadyToTrip = (type='') => {

        if(type == 1){
            console.log(type, 'type')
            if (defaultDate == null) {
                setFetch(true)
                toast.warning('Date Filter Should not be empty..!')
                return false
            } else if (
                defaultDate == null &&
                reportVehicle == 0 &&
                reportVendor == 0 &&
                reportPONo == 0  
            ) {
                toast.warning('Choose atleast one filter type..!')
                return false
            }
            let report_form_data = new FormData()
            report_form_data.append('date_between', defaultDate)
            report_form_data.append('truck_no', reportVehicle)
            report_form_data.append('po_no', reportPONo) 
            report_form_data.append('vendor_id', reportVendor) 
            console.log(defaultDate, 'defaultDate')
            console.log(reportVehicle, 'reportVehicle')
            console.log(reportVendor, 'reportVendor')
            console.log(reportPONo, 'reportPONo') 
            // return false 
            RakeTripsheetCreationService.sentVendorPaymentDataForReport(report_form_data).then((res) => {                  
                setFetch(true)
                tableData1 = res.data
                console.log(tableData1,'sentVendorPaymentDataForReport')
                let rowDataList = [] 
                setSearchFilterData(tableData1)
                tableData1.map((data, index) => {
                    rowDataList.push({
                        sno: index + 1,
                        PO_No: data.po_no,     
                        FNR_No: data.fnr_no,
                        Truck_No: data.truck_no,
                        Tripsheet_No: data.tripsheet_no, 
                        Migo_No: data.migo_no, 
                        Migo_Date: data.migo_date,  
                        RPS_No: data.expense_sequence_no,  
                        RPS_Date: formatDate(data.created_at),  
                        Vendor_Name: data.v_name,  
                        Vendor_Code: data.v_code,  
                        Vendor_PAN_No: data.v_pan_no, 
                        Payment_Doc_No: data.payment_document_no ? data.payment_document_no : '-', 
                        Payment_Amount: data.payment_amount ? data.payment_amount : '-', 
                        Payment_Remarks: data.payment_remarks ? data.payment_remarks : '-', 
                        Payment_Date: data.payment_posting_date ? formatDate(data.payment_posting_date) : '-', 
                        WB_Empty_Weight: data.wb_empty_weight ? data.wb_empty_weight : '-', 
                        WB_Load_Weight: data.wb_load_weight ? data.wb_load_weight : '-', 
                        WB_Net_Weight: data.wb_net_weight ? data.wb_net_weight : '-', 
                        No_of_Bags1: data.total_no_of_bags ? data.total_no_of_bags : '-', 
                        Plant_Description: data.to_plant, 
                        Freight_Amount: data.budget_freight ? data.budget_freight : '-', 
                        Additional_Freight: data.additional_freight ? data.additional_freight : '-', 
                        Deduction: data.deduction ? data.deduction : '-', 
                        Total_Freight: data.total_freight,  
                    })
                })
                setFetch(true)
                setRowData(rowDataList)
            })
        } else {

            RakeTripsheetCreationService.getVendorPaymentDataForReport().then((res) => { 
                let tableReportData = res.data
                console.log(res,'getVendorPaymentDataForReport')
        
                setFetch(true)
                let rowDataList = []
        
                setSearchFilterData(tableReportData)
                tableReportData.map((data, index) => {
                    rowDataList.push({
                        sno: index + 1,
                        PO_No: data.po_no,     
                        FNR_No: data.fnr_no,
                        Truck_No: data.truck_no,
                        Tripsheet_No: data.tripsheet_no, 
                        Migo_No: data.migo_no, 
                        Migo_Date: data.migo_date,  
                        RPS_No: data.expense_sequence_no,  
                        RPS_Date: formatDate(data.created_at),  
                        Vendor_Name: data.v_name,  
                        Vendor_Code: data.v_code,  
                        Vendor_PAN_No: data.v_pan_no, 
                        Payment_Doc_No: data.payment_document_no ? data.payment_document_no : '-', 
                        Payment_Amount: data.payment_amount ? data.payment_amount : '-', 
                        Payment_Remarks: data.payment_remarks ? data.payment_remarks : '-', 
                        Payment_Date: data.payment_posting_date ? formatDate(data.payment_posting_date) : '-', 
                        WB_Empty_Weight: data.wb_empty_weight ? data.wb_empty_weight : '-', 
                        WB_Load_Weight: data.wb_load_weight ? data.wb_load_weight : '-', 
                        WB_Net_Weight: data.wb_net_weight ? data.wb_net_weight : '-', 
                        No_of_Bags1: data.total_no_of_bags ? data.total_no_of_bags : '-', 
                        Plant_Description: data.to_plant, 
                        Freight_Amount: data.budget_freight ? data.budget_freight : '-', 
                        Additional_Freight: data.additional_freight ? data.additional_freight : '-', 
                        Deduction: data.deduction ? data.deduction : '-', 
                        Total_Freight: data.total_freight,  
                    })
                })
                setFetch(true)
                setRowData(rowDataList)
                // setPending(false)
            })
        }
    }

    useEffect(() => {
        loadVehicleReadyToTrip()
    }, [])
  
  
    function getCurrentDate(separator = '') {
        let newDate = new Date()
        let date = newDate.getDate()
        let month = newDate.getMonth() + 1
        let year = newDate.getFullYear()
    
        return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
    }
  
  
    const exportToCSV = () => {

        if (defaultDate == null) {
            toast.warning('Date Filter Should not be empty..!')
            return false
        } else if (
            defaultDate == null &&
            reportVehicle == 0 &&
            reportVendor == 0 &&
            reportPONo == 0  
        ) {
            toast.warning('Choose atleast one filter type..!')
            return false
        }
        let dateTimeString = GetDateTimeFormat(1)
        let fileName='Rake_Vendor_Payment_Report'+dateTimeString  
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
        {
            name: 'PO Number',
            selector: (row) => row.PO_No,
            sortable: true,
            center: true,
        },
        {
            name: 'Truck Number',
            selector: (row) => row.Truck_No,
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
            name: 'Empty Weight',
            selector: (row) => row.WB_Empty_Weight,
            sortable: true,
            center: true,
        },
        {
            name: 'Load Weight',
            selector: (row) => row.WB_Load_Weight,
            sortable: true,
            center: true,
        },
        {
            name: 'Net Weight',
            selector: (row) => row.WB_Net_Weight,
            sortable: true,
            center: true,
        },
        {
            name: 'No of Bags',
            selector: (row) => row.No_of_Bags1,
            sortable: true,
            center: true,
        },
        {
            name: 'Plant Description',
            selector: (row) => row.Plant_Description,
            sortable: true,
            center: true,
        },
        {
            name: 'Freight Amount',
            selector: (row) => row.Freight_Amount,
            sortable: true,
            center: true,
        },
        {
            name: 'Additional Freight',
            selector: (row) => row.Additional_Freight,
            sortable: true,
            center: true,
        },
        {
            name: 'Deduction ',
            selector: (row) => row.Deduction,
            sortable: true,
            center: true,
        },
        {
            name: 'Total Freight ',
            selector: (row) => row.Total_Freight,
            sortable: true,
            center: true,
        },
        {
            name: 'Payment date ',
            selector: (row) => row.Payment_Date,
            sortable: true,
            center: true,
        },
        {
            name: 'Payment Reference ',
            selector: (row) => row.RPS_No,
            sortable: true,
            center: true,
        },
    ] 

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
  
    const formValues = {
        document_from_date_range: '',
        document_to_date_range: '',
        vehicle_id:'',
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
                                            <CFormLabel htmlFor="VNum">PO Number</CFormLabel>
                                            <RakeSerachSelectComponent
                                                size="sm"
                                                className="mb-2"
                                                onChange={(e) => {
                                                    onChangeFilter(e, 'po_no')
                                                }}
                                                label="Select PO Number"
                                                noOptionsMessage="PO Not found"
                                                search_type="rake_vp_report_po_number"
                                                search_data={searchFilterData}
                                            />
                                        </CCol>

                                        <CCol xs={12} md={3}>
                                            <CFormLabel htmlFor="VNum">Vehicle Number</CFormLabel>
                                            <RakeSerachSelectComponent
                                                size="sm"
                                                className="mb-2"
                                                onChange={(e) => {
                                                    onChangeFilter(e, 'truck_no')
                                                }}
                                                label="Select Truck Number"
                                                noOptionsMessage="Truck Not found"
                                                search_type="rake_vp_report_vehicle_number"
                                                search_data={searchFilterData}
                                            />
                                        </CCol>

                                        <CCol xs={12} md={3}>
                                            <CFormLabel htmlFor="VNum">Vendor Name</CFormLabel>
                                            <RakeSerachSelectComponent
                                                size="sm"
                                                className="mb-2"
                                                onChange={(e) => {
                                                    onChangeFilter(e, 'vendor_code')
                                                }}
                                                label="Select Vendor name"
                                                noOptionsMessage="Vendor Not found"
                                                search_type="rake_vp_report_vendor_code"
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
                                            loadVehicleReadyToTrip(1)}}
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
                                        <CModalTitle style={{ display: 'flex', justifyContent: 'end'}}>
                                            Diesel Intent Vouchar
                                        </CModalTitle>
                                    </CModalHeader>                
                                    <CModalBody>                        
                                    </CModalBody>
                                    <CModalFooter>
                                        <CButton color="secondary" onClick={() => setVisible(false)}>
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
  
export default RakeVendorPaymentReport
  