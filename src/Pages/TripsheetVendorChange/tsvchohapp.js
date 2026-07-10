/* tsvchahapp : Trip Sheet Vendor Change AH Approval Screen */
 
import React, { useState, useEffect } from 'react'
import {
    CButton,
    CCard,
    CRow,
    CCol, 
    CContainer,  
} from '@coreui/react'  
import CustomTable from 'src/components/customComponent/CustomTable' 
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader' 
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'; 
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants' 
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'  
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import VendorCreationService from 'src/Service/VendorCreation/VendorCreationService'
import { Link } from 'react-router-dom'

const tsvchohapp = () => { 

    /*================== User Id & Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    const user_locations = []

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
        user_locations.push(data.id)
    })

    /* Get User Id From Local Storage */
    const user_id = user_info.user_id

    /* ==================== Access Part Start ========================*/
    const [screenAccess, setScreenAccess] = useState(false) 
    let page_no = LogisticsProScreenNumberConstants.TSVendorChangeModule.TSVCH_OH_Approval

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

    const exportToCSV = (e1) => {
        if(rowData.length == 0){
        toast.warning('No Data Found..!')
        return false
        }
        console.log(rowData,'exportCsvData')
        let dateTimeString = GetDateTimeFormat(1)
        let fileName='VCH_OH_Approval_Report_'+dateTimeString
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const ws = XLSX.utils.json_to_sheet(rowData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension); 
    }

    const [rowData, setRowData] = useState([]) 
    const [fetch, setFetch] = useState(false) 
    let tableReportData = []  

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('/');
    } 

    const [divisionData, setDivisionData] = useState([])
    const othersDivisionArray = ['','NLFD','NLFA','NLDV','NLMD','NLLD','NLCD','NLIF','NLSD']

    useEffect(() => { 
        DivisionApi.getDivision().then((response) => {
            let editData = response.data.data
            console.log(response,'getDivision-response')
            // setFetch(true)
            setDivisionData(editData)
        })
    }, [divisionData && divisionData.length > 1])
    
    const othersDivisionNameFinder = (data) => {
        let ot_div = '-'
        console.log(divisionData,'divisionData')
        divisionData && divisionData.map((vv,kk)=>{
            if(data.others_division == vv.id){
                ot_div = othersDivisionArray[vv.id]
            }
        })
        return ot_div
    } 
    const ACTION = {
        TRIPSHEET_CREATED: 1,
        TRIPSHEET_ASSIGNED: 3,
        TRIPSHEET_CONFIRMED: 2,
    }
    const PURPOSE = {
        FG_SALES: 1,
        FG_STO: 2,
        RM_STO: 3,
        OTHERS: 4,
        FCI: 5,
    }
    const vehicle_current_position_array =
    [
        "",                                 /*0*/
        "Parking Yard Gate In",             /*1*/
        "Vehicle Inspection Completed",     /*2*/
        "Vehicle Inspection Rejected",      /*3*/
        "Vehicle Maintenance Started",      /*4*/
        "Vehicle Maintenance Ended",        /*5*/
        "RMSTO Vehicle Taken",              /*6*/
        "OTHERS Vehicle Taken",             /*7*/
        "Document Verification Completed",  /*8*/
        "Document Verification Rejected",   /*9*/
        "-","-","-","-","-","-",                  /*10 - 15*/
        "Tripsheet Created",                /*16*/
        "Tripsheet Cancelled",              /*17*/
        "Advance Payment Completed","",     /*18,19*/
        "NLFD Shipment Created",            /*20*/
        "NLFD Shipment Deleted",            /*21*/
        "NLFD Shipment Completed",          /*22*/
        "NLCD Shipment Created",            /*23*/
        "NLCD Shipment Deleted",            /*24*/
        "NLCD Shipment Completed",          /*25*/
        "Expense Closure Completed",        /*26*/  
        "Income Closure Completed",         /*27*/
        "Settlement Closure Completed",     /*28*/    
        "-","-","-","-","-","-",            /*29 - 34*/   
        "RJ Sale Order Created","",         /*35,36*/
        "Diesel Indent Completed","",       /*37*/
        "Diesel Indent Confirmed","",       /*39*/
        "Diesel Indent Approved","",        /*41*/
    ]

    function goToEncryptedProfile(id) {
        // Encrypt the ID
        const encryptedId = btoa(id.toString())
        console.log(encryptedId,'encryptedId')
        return encryptedId 
    }

    const vchStatusFinder = (data, type = 0) => {
        let status = '-'

        if(type == 1){
            if(data.vch_time_info && data.vch_time_info.vch_requested_at){
                let temp = timeDiffFormatted(data.vch_time_info.vch_ah_approved_at)
                return temp
            }
        }
        if(data.vch_status == 3){
            status = 'AH Approved'
        } 

        return status
    }

    const loadTripShipmentReport = (fresh_type = '') => {

        if (fresh_type !== '1') {   
            VendorCreationService.getTSVendorChangeOhApprovalRequestData().then((res) => { 
                console.log(res,'res')  
                tableReportData = res.data.data
                console.log(tableReportData,'tableReportData') 
                let ind = 0
                let rowDataList = [] 

                // let filterData = tableReportData.filter(
                //     (data) => data.trip_sheet_info.vch_status < 2
                // )
                // console.log(filterData,'filterData') 
                tableReportData.map((data, index) => {
                ind++
                
                rowDataList.push({
                    S_NO : ind,              
                    Tripsheet_No : data.trip_sheet_no, 
                    Tripsheet_Status:(
                    data.parking_info.tripsheet_open_status == ACTION.TRIPSHEET_CREATED
                        ? 'TS Created'
                        : data.parking_info.tripsheet_open_status == ACTION.TRIPSHEET_ASSIGNED
                        ? 'TS Assigned' 
                        : data.parking_info.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED && (data.parking_info.vehicle_current_position == '17' || data.parking_info.vehicle_current_position == '21' || data.parking_info.vehicle_current_position == '24')
                        ? 'TS Cancelled'
                        : data.parking_info.tripsheet_open_status == ACTION.TRIPSHEET_CONFIRMED
                        ? 'TS Closed'
                        :'TS Rejected'
                    ),             
                    Vehicle_Previous_Status: vehicle_current_position_array[data.parking_info.vehicle_current_position],
                    Division: data.purpose == PURPOSE.OTHERS ? othersDivisionNameFinder(data) : data.to_divison == 2 ? 'NLCD':'NLFD',
                    Purpose: (
                        data.purpose == PURPOSE.FG_SALES
                        ? 'FG Sales'
                        : data.purpose == PURPOSE.FG_STO
                        ? 'FG STO'
                        : data.purpose == PURPOSE.RM_STO
                        ? 'RM STO'
                        : data.purpose == PURPOSE.OTHERS
                        ? 'OTHERS'
                        : data.purpose == PURPOSE.FCI
                        ? 'FCI'
                        :''
                    ),
                    Vehicle_No : data.parking_info.vehicle_number,	 
                    Driver_Name	: data.parking_info.driver_name,
                    Driver_Number : data.parking_info.driver_contact_number, 
                    Vendor_Name : data.parking_info && data.parking_info.vendor_info ? data.parking_info.vendor_info.owner_name : '-', 
                    Vendor_Code : data.parking_info && data.parking_info.vendor_info ? data.parking_info.vendor_info.vendor_code : '-', 
                    PAN_Number : data.parking_info && data.parking_info.vendor_info ? data.parking_info.vendor_info.pan_card_number : '-', 
                    Vch_Status : vchStatusFinder(data),
                    Screen_Duration: vchStatusFinder(data,1),
                    Action: (
                        <CButton className="badge" color="warning">
                            <Link className="text-white" target='_blank' to={`OHApproval/${goToEncryptedProfile(data.trip_sheet_id)}`}> 
                                VCH OH Approval
                            </Link>
                        </CButton>
                    ), 
                }) 
            }) 
            setFetch(true)
            setRowData(rowDataList) 
        })
        } 
    }
    
    useEffect(() => {
        loadTripShipmentReport()
    }, [divisionData && divisionData.length > 1])

    function timeDiffFormatted(inputTime) {
        const past = new Date(inputTime);
        const now = new Date();

        const diffMs = Math.abs(now - past); // diff in milliseconds

        const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
        const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        return `${days} days ${hours} hrs and ${minutes} min`;
    }

 
    // ============ Column Header Data =======

    const columns = [
        {
            name: 'S.No',
            selector: (row) => row.S_NO,
            sortable: true,
            center: true,
        },
        {
            name: 'Tripsheet No.',
            selector: (row) => row.Tripsheet_No,
            sortable: true,
            center: true,
        }, 
        {
            name: 'Vehicle No.',
            selector: (row) => row.Vehicle_No,
            sortable: true,
            center: true,
        },
        // {
        //     name: 'Driver Name',
        //     selector: (row) => row.Driver_Name,
        //     sortable: true,
        //     center: true,
        // },
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
            name: 'PAN Number',
            selector: (row) => row.PAN_Number,
            sortable: true,
            center: true,
        }, 
        {
            name: 'Waiting At',
            selector: (row) => row.Vehicle_Previous_Status,
            sortable: true,
            center: true,
        },
        {
            name: 'VCH Status',
            selector: (row) => row.Vch_Status,
            sortable: true,
            center: true,
        },
        {
            name: 'Screen Duration',
            selector: (row) => row.Screen_Duration,
            center: true,
            sortable: true,
        },
        {
            name: 'Action',
            selector: (row) => row.Action,
            // sortable: true,
            center: true,
        }
        
    ]

    //============ column header data=========

    return (
        <>
        {!fetch && <Loader />}
        {fetch && (
            <>
            {screenAccess ? (
                <CCard className="mt-4">
                    <CContainer className="m-2"> 
                        {user_info.is_admin == 1 && (
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
                                        size="lg-sm"
                                        color="warning"
                                        className="mx-3 px-3 text-white"
                                        onClick={(e) => { 
                                            exportToCSV(e)
                                        }}
                                    >
                                        Export
                                    </CButton>
                                </CCol>
                            </CRow>
                        )}                        
                        <CustomTable
                            columns={columns}
                            data={rowData}
                            fieldName={'Driver_Name'}
                            showSearchFilter={true}
                        />
                    </CContainer>
                </CCard>
            ) : (<AccessDeniedComponent />)}
            </>
        )}
        </>
    )
}

export default tsvchohapp

 

