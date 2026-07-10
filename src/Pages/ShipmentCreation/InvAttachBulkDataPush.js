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
  CCardImage,
  CModalFooter,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormLabel,
  CFormSelect,
  CAlert,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import CustomTable from 'src/components/customComponent/CustomTable'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import * as XLSX from 'xlsx';
import { read, utils, writeFile } from 'xlsx';
import FileSaver from 'file-saver'
import Swal from "sweetalert2";
import MaterialMasterService from 'src/Service/Master/MaterialMasterService'
import Loader from 'src/components/Loader'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import TripInfoCaptureService from 'src/Service/TripInfoCapture/TripInfoCaptureService'
import VehicleGroupService from 'src/Service/SmallMaster/Vehicles/VehicleGroupService'

const InvAttachBulkDataPush = () => {

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  // const navigation = useNavigate()

  console.log(user_info)

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const [movies, setMovies] = useState([])
  const [validDataLength, setValidDataLength] = useState(0)
  const [invalidDataLength, setInvalidDataLength] = useState(0)
  const [totalData, setTotaldata] = useState([])
  const [uploadStatus,setUploadStatus] = useState(false)
  const [fetch, setFetch] = useState(false)
  const [proTableExistsCheck, setProTableExistsCheck] = useState(true)
  const [proTableValidationFinished, setProTableValidationFinished] = useState(false)
  const [ticDataAll, setTicDataAll] = useState([])
  

  let viewData

  function changeMaterialMasterStatus(id) {
    MaterialMasterService.deleteMaterialInfo(id).then((res) => {
      toast.success('Material Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Material_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const importToCSV = () => { 
    let fileName='Invoice_Attachment_Bulk_Data_Push_Template1'
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    let sample_data = [{
      Original_Submission_to_Division: "",
      INV_NO: "",
      Submission_Date: "", 
    }] 
    const ws = XLSX.utils.json_to_sheet(sample_data);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  } 

  const [vehicleGroup, setVehicleGroup] = useState([])

  useEffect(() => {   

    //section for getting vehicle group from database
    VehicleGroupService.getVehicleGroup().then((res) => {
      setFetch(true)
      let veh_group_data = res && res.data ? res.data.data : []
      console.log(veh_group_data,'veh_group_data')
      setVehicleGroup(veh_group_data)
    })

  }, [mount])

  const handleImport = (event) => {
    console.log(event,'---')
    const files = event.target.files;
    console.log(files,'files')
    var allowedFiles = [".xls", ".xlsx", ".csv"];
    var file_prev_name = files[0].name
    var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");
    if (!regex.test(file_prev_name.toLowerCase())) {
      let error_text = "Please upload files having extensions: <b>" + allowedFiles.join(', ') + "</b> only.";
      Swal.fire({
        title: error_text,
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
        window.location.reload(false)
      });
      return false
    }
    // return false
    if (files.length) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const wb = read(event.target.result);
            const sheets = wb.SheetNames;

            if (sheets.length) {
              const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
              console.log(rows,'rows-rows')
              let validated_rows = validation(rows)
              console.log(validated_rows,'validated_rows')
              if(validated_rows.length == 0){
                Swal.fire({
                  title: 'Uploaded data was invalid..',
                  icon: "warning",
                  confirmButtonText: "OK",
                }).then(function () {
                  window.location.reload(false)
                });
              }
              setMovies(validated_rows)
            }
        }
        reader.readAsArrayBuffer(file);

    } else {
      Swal.fire({
        title: 'Invalid File..',
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
        window.location.reload(false)
      });
    }
  }

  useEffect(()=>{
    if(movies.length != 0){ 
      console.log('yes2')
      getBdcUploadData()
    }
  },[movies.length != 0])

  const [editModalEnable, setEditModalEnable] = useState(false)
  const [deleteModalEnable, setDeleteModalEnable] = useState(false)
  const [currentDataId, setCurrentDataId] = useState('')

  /* ============== Custom Functions Start ================== */

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

  const totalKMFinder = (a,b,c,d) => { 
    let km1 = Number.isInteger(Number(a)) ? Number(a) : 0
    let km2 = Number.isInteger(Number(b)) ? Number(b) : 0
    let km3 = Number.isInteger(Number(c)) ? Number(c) : 0
    let km4 = Number.isInteger(Number(d)) ? Number(d) : 0
    console.log('totalKMFinder : FJ Empty = > ',km1,', Start = > ',km2,', End = > ',km3,', To Empty = > ',km4)
    let tk = km1+km2+km3+km4
    let totalkm = Number(parseFloat(tk).toFixed(2))
    console.log(totalkm,'totalKMFinder-totalkm')
    return totalkm
  }

  const getDateTime = (myDateTime, type=0) => {
    let myTime = '-'
    if(type == 1){
      myTime = new Date(myDateTime).toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit' });
    } else if(type == 2){
      myTime = new Date(myDateTime).toLocaleDateString('en-US',{ month: 'short', year: 'numeric' });
    } else if(type == 3){
      myTime = new Date(myDateTime).toLocaleTimeString('en-US',{ hour12: false, hour: '2-digit', minute: '2-digit' });
    } else {
      myTime = new Date(myDateTime).toLocaleString('en-US');
    }
    
    return myTime
  }

  const kmDifference = (v1,v2) => {
    let ans = 0
    ans = Number(v1) - Number(v2)
    return ans
  }

  const ovticdiffTime=(start, end)=> {

    if(start == '0000-00-00 00:00:00' || end == '0000-00-00 00:00:00'){
      return '-'
    }

    let st = new Date(start)
    let et = new Date(end)
    console.log(start,'ovticdiffTime-start')
    console.log(end,'ovticdiffTime-end')

    const diffInMs = Math.abs(et-st); // difference in milliseconds
    const diffInSeconds = Math.floor(diffInMs / 1000);

    const hours = String(Math.floor(diffInSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((diffInSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(diffInSeconds % 60).padStart(2, '0');

    const result = `${hours}:${minutes}:${seconds}`;
     
    console.log(result,'ovticdiffTime-result')
    return result

  }

  const eDieselFinder = (data) => {
    let td = 0

    console.log(data,'diesel-data')
    if(!data || data.length == 0){
      return 0
    }
    data.map((vv,kk)=>{
      td = Number(parseFloat(td).toFixed(2)) + Number(parseFloat(vv.di_enr_qty).toFixed(2)) 
    })
    return Number(parseFloat(td).toFixed(2))
  }

  const totDieselFinder = (vv) => {

    let v1 = eDieselFinder(vv.tic_child2_info) /* Enroute Diesel */
    let v2 = vv.di_status > 1 ? vv.di_rns_qty : 0 /* RNS Diesel */

    return Number(parseFloat(v1).toFixed(2)) + Number(parseFloat(v2).toFixed(2)) 
  }

  const mileageFinder = (vv) => {

    let total_diesel = totDieselFinder(vv) 

    let startkm = vv.opening_km
    let endkm = vv.closing_km

    let tripkm = 0

    let ans = '-'

    if(startkm && Number(startkm) > 0 && endkm && Number(endkm) > 0){
      tripkm = Number(endkm) - Number(startkm)
    }  

    if(tripkm != 0){
      ans = Number(parseFloat(tripkm).toFixed(2)) / Number(parseFloat(total_diesel).toFixed(2)) 
      return Number(parseFloat(ans).toFixed(2))
    }    

    return ans
  }

  const TripTypyeFinder = (val1,val2) => {

    let type = ''
    const movement_type = ['','RMSTO','RAKE','OTHERS','FCI']
    if(val1 == 1){
      type = 'FG_SALES'
    } else if(val1 == 2){
      type = 'RJSO'
    } else if(val1 == 3){
      type = 'FG_STO'
    } else if(val1 == 4){
      type = movement_type[val2]
    }  
    console.log(val1,'TripTypyeFinder-val1')
    console.log(val2,'TripTypyeFinder-val2')
    console.log(type,'TripTypyeFinder-type')
    return type

  }

  const DaysFinder = (start_time, end_time) => {
    const time = ovticdiffTime(start_time,end_time);

    let days = 0

    if(time == '-'){
      return 0
    }

    const [hours, minutes, seconds] = time.split(":").map(Number);

    const totalDays = (hours * 3600 + minutes * 60 + seconds) / (24 * 3600);

    console.log(totalDays)
    console.log(totalDays.toFixed(2))
    return totalDays.toFixed(2)
  }

  const vehicleGroupName = (code) => {
    let vehicle_group_name = '-'
    vehicleGroup.map((val, key) => {
      if (val.id == code) {
        vehicle_group_name = val.vehicle_group
      }
    })

    console.log(vehicle_group_name,'vehicle_group_name')

    return vehicle_group_name
  }

  /* ============== Custom Functions End ================== */

  function SAPPushSubmit() {
    console.log(ticDataAll,'SAPPushSubmit-ticDataAll') 
    console.log(movies,'SAPPushSubmit-movies') 
     

    const formData = new FormData()
    formData.append('lp_data', JSON.stringify(movies)) 

    TripInfoCaptureService.invInfoUpdateByBulkUpload(formData).then((res) => {
      setFetch(true)
      let ans_data = res.data.data
      // console.log(res)
      console.log(ans_data)
      if (res.status == 200) { 
        Swal.fire({
          title: res.data.message,
          icon: "success", 
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        });
      } else {
        toast.warning(
          'Invoice Info Cannot Be pushed to PRO From LP.. Kindly Contact Admin!'
        )
      }
          
    })

  }

  const tripsheet_vehicleNo_duplicate_having = (data,Original_Submission_to_Division,invoice_no,index) => {

    let condition = 0
    data.map((vv,ii)=>{
      if(vv.Original_Submission_to_Division == Original_Submission_to_Division && vv.INV_NO == invoice_no){
        condition = 1
      }
    })

    if(condition == 1){
      return true
    } else {
      return false
    }

  }

  function isValidDate(dateStr) {
    const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/

    if (!regex.test(dateStr)) return false

    const [day, month, year] = dateStr.split('-').map(Number)

    const date = new Date(year, month - 1, day)

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    )
  }

  const validation = (data) => {
    console.log(data,'validation-validation')
    let valid_data = []

    data.map((val,ind)=>{
      console.log(val,'val-validation')
      // val.Vendor_Name1 = vnameFinder(val.Vendor_Code)

      // val.uom = 
      if(!val.INV_NO || val.INV_NO == '' || val.INV_NO == undefined){
        val.upload_status = '0'
        val.upload_remarks = 'Invoice No Required'
      } else if(val.INV_NO.toString().length < 8 || val.INV_NO.toString().length > 10){
        val.upload_status = '0'
        val.upload_remarks = 'Invalid Invoice No Length'
      } if(!val.Submission_Date || val.Submission_Date == '' || val.Submission_Date == undefined){
        val.upload_status = '0'
        val.upload_remarks = ' Submission Date Required'
      } else if(isValidDate(val.Submission_Date) == false){
        val.upload_status = '0'
        val.upload_remarks = 'Invalid Submission Date Format'
      } else if(tripsheet_vehicleNo_duplicate_having(valid_data,val.Original_Submission_to_Division,val.INV_NO,ind)){
        val.upload_status = '0'
        val.upload_remarks = 'Duplicate Data'
      } else if((!val.Original_Submission_to_Division || val.Original_Submission_to_Division == '' || val.Original_Submission_to_Division == undefined || val.Original_Submission_to_Division.toString().length != 1 || !(val.Original_Submission_to_Division.toString().match(/^[0-1]{1}$/)))){
        val.upload_status = '0'
        val.upload_remarks = 'Invalid Submission Code' 
      } else {
        val.upload_status = '1'
        val.upload_remarks = '--'
      }  
      setProTableExistsCheck(true)
      setProTableValidationFinished(false)
      setTicDataAll([])
      valid_data.push(val)

    })

    let invalidLength = 0
    let validLength = 0

    data.map((val,ind)=>{
      // console.log(val,'vvvvv')
      if(val.upload_status == '0'){
        setUploadStatus(true)
        invalidLength += 1
      } else {
        validLength += 1
      }

    })

    if(invalidLength == 0){
      setUploadStatus(false)
    }

    setInvalidDataLength(invalidLength)
    setValidDataLength(validLength)

    setTotaldata(data)

    return valid_data
  }

  const hd1 = {
    backgroundColor: 'skyblue',
    color: 'Black',
    fontWeight: 'bolder',
    width: '80%',
  }

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Invoice No',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Sumission Status',
      selector: (row) => row.Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Submission Date',
      selector: (row) => row.Code,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Status',
      selector: (row) => row.Status,
      center: true,
      sortable: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  const [bdcSubmit, setBdcSubmit] = useState(false) /* Bulk Upload Modal */
  const [bdcSubmit1, setBdcSubmit1] = useState(false) /* Single Upload Modal */

  const columns1 = [
    {
      name: 'S.No',
      selector: (row) => row.S_NO,
      sortable: true,
      center: true,
    },
     {
      name: 'Invoice No',
      selector: (row) => row.INV_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'Sumission',
      selector: (row) => row.Original_Submission_to_Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Sub. Date',
      selector: (row) => row.Submission_Date,
      sortable: true,
      center: true,
    }, 
    {
      name: 'Pro Status',
      selector: (row) => row.Pro_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Upload_Status,
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
      name: 'Pro Remarks',
      selector: (row) => row.Pro_Remarks,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  const removeBDCData = () => {
    getBdcUploadData(currentDataId,2)
  }

  const changeBdcTableItem = (event, child_property_name, parent_index) => {
    let getData2 = event.target.value

    // if (child_property_name == 'Tripsheet_No' || child_property_name == 'Vehicle_No') {
    //   getData2 = event.target.value.replace(/[^a-zA-Z0-9]/gi, '')
    // }

    const bdc_parent_info = [...movies]

    console.log(bdc_parent_info[parent_index],'bdc_parent_info')
    console.log(parent_index,'bdc_parent_info-parent_index')

    bdc_parent_info[parent_index][`${child_property_name}`] = getData2

    getBdcUploadData(parent_index,3,bdc_parent_info) 

  }

  const clickme = (vbn) => {
    console.log(vbn,'clickme-val')
    console.log(movies,'clickme-val movies')
  }

  const handleSubmit = (type) => {
    if(type == 1){
      if(movies.length == 0){
        Swal.fire({
            title: 'Please Attach the upload.',
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            // window.location.reload(false)
          })
      } else {
        setFetch(false)

        /* ===================== Submition Part Start ===================== */
        console.log(movies,'tripsheet_no-movies')

        var BDCSendData = {}
        var BDCSendData_seq = []
        var BDCSendData_seq1 = []

        /* Set BDC Data via Uploaded Data by Loop */
        for (var i = 0; i < movies.length; i++) {
          BDCSendData.Original_Submission_to_Division = movies[i].Original_Submission_to_Division
          BDCSendData.INV_NO = movies[i].INV_NO
          BDCSendData.Submission_Date = movies[i].Submission_Date 

          BDCSendData_seq[i] = BDCSendData

          let be_data = JSON.parse(JSON.stringify(BDCSendData)) 
          BDCSendData_seq1[i] = be_data
          be_data = {}

          BDCSendData = {}
        }

        console.log(BDCSendData_seq,'BDCSendData_seq')
        console.log(BDCSendData_seq1,'BDCSendData_seq1')
 

        const formData = new FormData()
        formData.append('lp_data', JSON.stringify(BDCSendData_seq1))
        formData.append('status', 1)
        formData.append('created_by', user_id)

        TripInfoCaptureService.invInfoCreateByBulkUpload(formData).then((res) => {
          setFetch(true)

          console.log(res,'createTripsheet')
          if(res.status == 200){
            toast.success('All Trip Info Details are in Pro Table..!')
            setProTableExistsCheck(false)
            setProTableValidationFinished(true)
            setTicDataAll(res.data.data)
          } else if(res.status == 201){

            let ans_data = res.data.data
            let error_message = res.data.message
            toast.warning(error_message)
            let movieser = [...rowData1]
            let movieser1 = [...movies]

            movieser.forEach((vv) => {
              ans_data.forEach((dd) => {
                if (
                  vv.INV_NO === dd.INV_NO 
                ) {
                  vv.Pro_Status =
                    dd.child_exists === 0 ?  '❌' : '✔️' 

                  vv.Pro_Remarks =
                    dd.child_exists === 0
                      ? 'Data not Exists in PRO'
                      : '-'
                }
              })
            })

            movieser1.forEach((vv) => {
              ans_data.forEach((dd) => {
                if (
                  vv.INV_NO === dd.INV_NO
                ) {
                  vv.Pro_Status =
                    dd.child_exists === 0 ?  '❌' : '-' 

                  vv.Pro_Remarks =
                    dd.child_exists === 0
                      ? 'Data not Exists in PRO'
                      : '-'
                }
              })
            })

            setRowData1(movieser)
            setMovies(movieser1)
            setProTableExistsCheck(true)
            setProTableValidationFinished(false)
            setTicDataAll([])
            
          } else {
            setProTableExistsCheck(true)
            setProTableValidationFinished(false)
            setTicDataAll([])
            toast.warning('Trip Info Updation Failed in LP. Kindly contact admin..!') 
          }

          console.log(movies,'movies after response')

        })
        .catch((error) => {
          console.log(error,'error')
          setFetch(true)
          var object = error.response.data.errors
          var output = ''
          for (var property in object) {
            output += '*' + object[property] + '\n'
          }
          setError(output)
          setErrorModal(true)
        })

        /* ===================== Submition Part End ===================== */
      }
    } else {
      Swal.fire({
          title: 'Material BDC Upload Rejected',
          icon: "warning",
          confirmButtonText: "OK",
      }).then(function () {
          window.location.reload(false)
      });
    }
  }

  function excelDateToFormattedDate(serial) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date = new Date(utc_value * 1000);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const [rowData1, setRowData1] = useState([])

  const getBdcUploadData = (editId = '', type = '', dataVal = []) => {
  
    console.log(movies,'getBdcUploadData')
    console.log(editId,'getBdcUploadData-editId')
    console.log(type,'getBdcUploadData-type')
    console.log(dataVal,'getBdcUploadData-dataVal')
    let rowDataList = []
    let updateData = []

    if(movies.length != 0){

      if((editId || editId == 0) && type){

        if(type == '2'){
          let todoCopy = [...movies]
          todoCopy.splice(editId, 1);
          updateData = validation(todoCopy)
          console.log(updateData,'getBdcUploadData-todoCopy1')
          setMovies(updateData)
        } else if(type == '3') {
          updateData = validation(dataVal)
          console.log(updateData,'getBdcUploadData-todoCopy2')
          setMovies(updateData)
        }

        updateData.map((data, index) => {
          rowDataList.push({
            S_NO: index + 1,
            INV_NO: data.INV_NO,
            Original_Submission_to_Division: data.Original_Submission_to_Division,
            Submission_Date: data.Submission_Date,          
            Upload_Status: data.upload_status == 1 ? '✔️' : '❌',
            Pro_Status: data.Pro_Status ? data.Pro_Status : '',
            Pro_Remarks: data.Pro_Remarks ? data.Pro_Remarks : '',
            Remarks: data.upload_remarks,
            Action: ( 
                <span className="float-start" color="danger">
                  <CButton
                    className="btn btn-secondary btn-sm me-md-1"
                    onClick={() => {
                      clickme(index)
                      setCurrentDataId(index)
                      setEditModalEnable(true)
                    }} 
                  >
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                  </CButton>

                  <CButton
                    className="btn btn-danger btn-sm me-md-1"
                    onClick={() => {
                      setCurrentDataId(index)
                      setDeleteModalEnable(true)
                    }}
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </CButton>
                </span>
            ),
          })
        })


      } else {
        let todoCopy1 = [...movies]
        console.log(todoCopy1,'todoCopy1')
        // todoCopy1.splice(editId, 1)
        updateData = validation(todoCopy1)
        console.log(todoCopy1,'todoCopy1')
        updateData.map((data, index) => {
          rowDataList.push({
            S_NO: index + 1,
            INV_NO: data.INV_NO,
            Original_Submission_to_Division: data.Original_Submission_to_Division,
            Submission_Date:data.Submission_Date,
            Upload_Status: data.upload_status == 1 ? '✔️' : '❌',
            Pro_Status: data.Pro_Status ? data.Pro_Status : '',
            Pro_Remarks: data.Pro_Remarks ? data.Pro_Remarks : '',
            Remarks: data.upload_remarks,
            Action: ( 
                <span className="float-start" color="danger">
                  <CButton
                    className="btn btn-secondary btn-sm me-md-1"
                    onClick={() => {
                      clickme(index)
                      setCurrentDataId(index)
                      setEditModalEnable(true)
                    }} 
                  >
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                  </CButton>

                  <CButton
                    className="btn btn-danger btn-sm me-md-1"
                    onClick={() => {
                      setCurrentDataId(index)
                      setDeleteModalEnable(true)
                    }}
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </CButton>
                </span>
            ),
          })
        })
      }
    }

    setRowData1(rowDataList)
  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          <CRow className="mt-1 mb-1">
            <CCol md={4}>
              <CFormLabel htmlFor="bdcCopy">
                Choose file for Import (Submission)
              </CFormLabel>
              <CInputGroup>
                <CFormInput
                  onChange={handleImport}
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  name="bdcCopy"
                  size="sm"
                  id="bdcCopy"
                />
                <CInputGroupText className="p-0">
                  <CButton
                    size="sm"
                    style={{ marginLeft:"1px" }}
                    color="primary"
                    onClick={() => {
                      window.location.reload(false)
                    }}
                  >
                    <i className="fa fa-refresh px-1"></i>
                  </CButton>
                  <CButton
                    size="sm"
                    color="danger"
                    className="px-3 text-white"
                    onClick={(e) => {
                      importToCSV()
                    }}
                  >
                    Sample <i className="fa fa-download"></i>
                  </CButton> 
                  
                </CInputGroupText>
              </CInputGroup>
            </CCol>        
            
          </CRow>
          {totalData.length > 0 && (
            <>
              <CRow className="m-3">
                <CCol xs>
                  <CInputGroup>
                    <CInputGroupText style={hd1}>
                      Total Data Uploaded
                    </CInputGroupText>
                    <CFormInput readOnly value={totalData.length} />
                  </CInputGroup>
                </CCol>
                <CCol xs>
                  <CInputGroup>
                    <CInputGroupText style={hd1}>
                      Count of Valid Data
                    </CInputGroupText>
                    <CFormInput readOnly value={validDataLength} />
                  </CInputGroup>
                </CCol>
                <CCol xs>
                  <CInputGroup>
                    <CInputGroupText style={hd1}>
                      Count of Invalid Data
                    </CInputGroupText>
                    <CFormInput readOnly value={invalidDataLength} />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CustomTable
                columns={columns1}
                pagination={false}
                data={rowData1}
                fieldName={'Driver_Name'}
                showSearchFilter={true}
              />

              <CRow className="m-3">

                <CCol
                  className="offset-md-6"
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >

                  {uploadStatus && (<span className="mr-5 text-danger float-right">* Please check Upload status </span>)}

                  <CButton
                    size="sm"
                    style={{ background: 'red'}}
                    className="mx-3 text-white"
                    onClick={(e)=>{
                      handleSubmit(2)
                    }}
                  >
                    Reject
                  </CButton>
                  {proTableExistsCheck && (
                    <CButton
                      size="sm"
                      style={{ background: 'green'}}
                      className="mx-3 text-white"
                      disabled={uploadStatus}
                      onClick={(e)=>{
                        handleSubmit(1)
                      }}
                    >
                      Pro Table - Exists Check
                    </CButton>
                  )}
                  {proTableValidationFinished && (
                    <CButton
                      size="sm"
                      style={{ background: 'green'}}
                      className="mx-3 text-white"
                      disabled={uploadStatus}
                      onClick={(e)=>{
                        setBdcSubmit(true)
                      }}
                    >
                      Submit
                    </CButton>
                  )}
                  {/* <button onClick={handleExport} className="btn btn-primary float-right">
                      Export <i className="fa fa-download"></i>
                  </button> */}
                </CCol>
              </CRow>
            </>
          )}
          {/* <CRow>
            <CCol
              className="offset-md-6"
              xs={15}
              sm={15}
              md={6}
              style={{ display: 'flex', justifyContent: 'end' }}
            >
              <Link className="text-white" to="/MaterialMaster">
                <CButton size="md" color="warning" className="px-3 text-white" type="button">
                  <span className="float-start">
                    <i className="" aria-hidden="true"></i> &nbsp;NEW
                  </span>
                </CButton>
              </Link>
              <CButton
                size="sm"
                color="secondary"
                className="px-3 text-white"
                onClick={(e) => {
                  exportToCSV()
                }}
              >
                EXPORT
              </CButton>      
              
            </CCol>
          </CRow>
          <CCard>
            <CustomTable
              columns={columns}
              data={rowData}
              fieldName={'diesel_Vendor_Name'}
              showSearchFilter={true}
              pending={pending}
            />
          </CCard> */}

          {/* ============== Edit Confirm Button Modal Area Start ================= */}
          <CModal
            visible={editModalEnable}
            size="lg"
            backdrop="static"
            // scrollable
            onClose={() => {
              setEditModalEnable(false)
              setCurrentDataId('')
            }}
          >
            {/* <CModalHeader>
              <CModalTitle>Are you sure to Update the data ?</CModalTitle>
            </CModalHeader> */}
            <CModalBody>

              <CRow className="mt-3">

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="Product_Name">Invoice No</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Product_Name"
                    onChange={(e) => {
                      changeBdcTableItem(e,'INV_NO',currentDataId)
                    }}
                    maxLength={12}
                    value={totalData[currentDataId] ? totalData[currentDataId].INV_NO : ''}
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="d_name">Submission Code</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Length"
                    onChange={(e) => {
                      changeBdcTableItem(e,'Original_Submission_to_Division',currentDataId)
                    }}
                    maxLength={30}
                    value={totalData[currentDataId] ? totalData[currentDataId].Original_Submission_to_Division : ''}
                  />
                </CCol> 
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="Material_Code">Submission Date</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Material_Code"
                    onChange={(e) => {
                      changeBdcTableItem(e,'Submission_Date',currentDataId)
                    }}
                    maxLength={10}
                    value={totalData[currentDataId] ? totalData[currentDataId].Submission_Date : ''}
                  />
                </CCol> 
                
    
              </CRow>
            </CModalBody>
            <CModalFooter>
              {/* <CButton
                className="m-2"
                color="warning"
                onClick={() => {
                  setEditModalEnable(false)
                  setCurrentDataId('')
                  // TripsheetPaymentSubmit()
                }}
              >
                Yes
              </CButton> */}
              <CButton
                color="secondary"
                onClick={() => {
                  setEditModalEnable(false)
                  setCurrentDataId('')
                }}
              >
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          {/* ============== Edit Confirm Button Modal Area End ================= */}
          {/* ============== Delete Confirm Button Modal Area Start ================= */}
          <CModal
            visible={deleteModalEnable}
            backdrop="static"
            size="lg"
            // scrollable
            onClose={() => {
              setDeleteModalEnable(false)
              setCurrentDataId('')
            }}
          >
            <CModalHeader>
              <CModalTitle>Are you sure to remove the data ?</CModalTitle>
            </CModalHeader>
            <CModalBody>

              <CRow className="mt-3">

              <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="Product_Name">Invoice No</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Product_Name"
                    readOnly
                    value={totalData[currentDataId] ? totalData[currentDataId].INV_NO : ''}
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="Material_Code">Submission Code</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Material_Code"
                    readOnly
                    value={totalData[currentDataId] ? totalData[currentDataId].Original_Submission_to_Division : ''}
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="Material_Code">Submission Date</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Uom_Code"
                    readOnly
                    value={totalData[currentDataId] ? totalData[currentDataId].Submission_Date : ''}
                  />
                </CCol> 
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton
                className="m-2"
                color="warning"
                onClick={() => {
                  setDeleteModalEnable(false)
                  setCurrentDataId('')
                  removeBDCData()
                }}
              >
                Yes
              </CButton>
              <CButton
                color="secondary"
                onClick={() => {
                  setDeleteModalEnable(false)
                  setCurrentDataId('')
                }}
              >
                No
              </CButton>
            </CModalFooter>
          </CModal>
          {/* ============== Delete Confirm Button Modal Area End ================= */}
          
          {/* ============== Bulk BDC Submit Confirm Button Modal Area ================= */}
          <CModal
          visible={bdcSubmit}
          backdrop="static"
          // scrollable
          onClose={() => {
            setBdcSubmit(false)
          }}
          >
          <CModalBody>
            <p className="lead">Are you sure to Check the Invoice Info. Details Push to PRO ?</p>
          </CModalBody>
          <CModalFooter>
            <CButton
              className="m-2"
              color="warning"
              onClick={() => {
                setBdcSubmit(false)
                SAPPushSubmit()
              }}
            >
              Confirm
            </CButton>
            <CButton
              color="secondary"
              onClick={() => {
                setBdcSubmit(false)
              }}
            >
              Cancel
            </CButton>
          </CModalFooter>
          </CModal>
          {/* ============== Bulk BDC Submit Confirm Button Modal Area ================= */}
        </>
      )}
    </>
  )
}

export default InvAttachBulkDataPush
