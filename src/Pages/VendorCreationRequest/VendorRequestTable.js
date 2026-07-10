import { React, useState, useEffect } from 'react'
import { CButton, CCard, CContainer, CSpinner, CBadge, CRow, CCol } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import VendorCreationService from 'src/Service/VendorCreation/VendorCreationService'
import Loader from 'src/components/Loader'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import { GetDateTimeFormat } from '../Depo/CommonMethods/CommonMethods'

const VendorCreationHome = () => {
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
  let page_no = LogisticsProScreenNumberConstants.VendorCreationModule.Vendor_Creation_Request

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
  const [pending, setPending] = useState(true)
  const purpose_array = ['','FG_SALES','FG_STO','RM_STO','OTHERS']

  let tableData = []
  const ACTION = {
    GATE_IN: 1,
    GATE_OUT: 2,
    WAIT_OUTSIDE: 3,
  }

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

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='vendor_creation_request_screen_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const getDateTime = (myDateTime, type=0) => {
    let myTime = '-'
    if(type == 1){
      myTime = new Date(myDateTime).toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit' });
    } else if(type == 2){
      myTime = new Date(myDateTime).toLocaleDateString('en-US',{ month: 'short', year: 'numeric' });
    } else {
      myTime = new Date(myDateTime).toLocaleString('en-US');
    }
    
    return myTime
  }

  const loadVendorCreationTable = () => {
    VendorCreationService.getVendorRequestTableData().then((res) => {
      // console.log(res)
      setFetch(true)
      tableData = res.data.data
      // console.log(res.data.data)
      let rowDataList = []
      console.log(tableData)
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      console.log(filterData1,'filterData1')
      const filterData = filterData1.filter(
        (data) =>
          (data.trip_sto_status == 1 || data.vehicle_document != null) &&
          data.vehicle_type_id.id == 3 &&
          data.vendor_info?.vendor_status == 1 &&
          data.vendor_info?.vendor_code == 0 &&
          (data.trip_sto_status == 1 || data.vehicle_document.document_status == 1) &&
          (data.trip_sto_status == 1 || data.vehicle_document.vendor_flag == 0)
      )

      console.log(filterData,'filterData2')
      filterData.map((data, index) => {
        // if (data.vehicle_document != null) {
        rowDataList.push({
          sno: index + 1,
          // Tripsheet_No: '',
          Vehicle_Type: data.vehicle_type_id.type,
          Vehicle_No: data.vehicle_number,
          Driver_Name: data.driver_name,
          Owner_Name: data.vendor_info?.owner_name,
          Owner_Mobile_No: data.vendor_info?.owner_number,
          PAN_NUMBER: data.vendor_info?.pan_card_number,
          Shed_Name: data.vendor_info && data.vendor_info.shed_info ? data.vendor_info.shed_info.shed_name : '-',
          Shed_Mobile_No: data.vendor_info && data.vendor_info.shed_info ? data.vendor_info.shed_info.shed_owner_phone_1 : '-', 
          Division: data.trip_sheet_info && data.trip_sheet_info.to_division == '2' ? 'NLCD' : (data.trip_sheet_info && data.trip_sheet_info.purpose == '4' ? '-' : 'NLFD'),
          Purpose: data.trip_sheet_info ? purpose_array[data.trip_sheet_info.purpose] : '-' ,
          Waiting_at_screen: 'Vendor Creation Request',          
          Doc_Verify_Date: data.vehicle_document ? formatDate(data.vehicle_document.created_at) : '-',
          Doc_Verify_Month: data.vehicle_document ? getDateTime(data.vehicle_document.created_at,2) : '-',
          Doc_Verify_By: data.vehicle_document && data.vehicle_document.doc_verify_user_info ? data.vehicle_document.doc_verify_user_info.emp_name : '-',
          Tripsheet_Created_By: data.trip_sheet_info && data.trip_sheet_info.trip_user_info ? data.trip_sheet_info.trip_user_info.emp_name : '-',
          TSC_User_Division: data.trip_sheet_info && data.trip_sheet_info.trip_user_info && data.trip_sheet_info.trip_user_info.user_division_info ? data.trip_sheet_info.trip_user_info.user_division_info.division : '-',
          TSC_User_Department: data.trip_sheet_info && data.trip_sheet_info.trip_user_info && data.trip_sheet_info.trip_user_info.user_department_info ? data.trip_sheet_info.trip_user_info.user_department_info.department : '-',
          Tripsheet_No: data.trip_sheet_info ? data.trip_sheet_info.trip_sheet_no : '-',
          Tripsheet_Date: data.trip_sheet_info ? data.trip_sheet_info.created_date : '-',
          Tripsheet_Month: data.trip_sheet_info ? getDateTime(data.trip_sheet_info.created_at,2) : '-',
          Screen_Duration: data.updated_at,
          Overall_Duration: data.created_at,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.parking_status == ACTION.GATE_IN
                ? 'Vendor Creation'
                : data.parking_status == ACTION.WAIT_OUTSIDE
                ? 'Waiting Outside'
                : 'Vendor Creation'}
            </span>
          ),
          Action: (
            <CButton className="badge" color="warning">
              <Link className="text-white" to={`VendorCreationRequest/${data.vehicle_id}`}>
                Create Vendor
              </Link>
            </CButton>
          ),
        })
        // }
      })
      setRowData(rowDataList)
      setPending(false)
    })
  }

  useEffect(() => {
    loadVendorCreationTable()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'VA No',
    //   selector: (row) => row.VA_No,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Tripsheet No',
    //   selector: (row) => row.Tripsheet_No,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Vehicle Type',
      selector: (row) => row.Vehicle_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.Driver_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Owner Name',
      selector: (row) => row.Owner_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'PAN Number',
      selector: (row) => row.PAN_NUMBER,
      sortable: true,
      center: true,
    },
    {
      name: 'Waiting At',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      sortable: true,
      center: true,
    },
    // {
    //   name: ' Overall Duration',
    //   selector: (row) => row.Overall_Duration,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Action',
      selector: (row) => row.Action,
      sortable: true,
      center: true,
    },
  ]

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>
       {screenAccess ? (
        <>
          <CCard className="mt-4">
            <CContainer className="mt-2">
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
                fieldName={'Driver_Name'}
                showSearchFilter={true}
                // pending={pending}
              />
            </CContainer>
          </CCard>
        </>
	     ) : (<AccessDeniedComponent />)}
       </>
      )}
    </>
  )
}

export default VendorCreationHome
