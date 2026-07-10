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
import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import CustomTable from 'src/components/customComponent/CustomTable'
import { GetDateTimeFormat, getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import * as XLSX from 'xlsx';
import { read, utils, writeFile } from 'xlsx';
import FileSaver from 'file-saver'
import Swal from "sweetalert2";
import MaterialMasterService from 'src/Service/Master/MaterialMasterService'
import Loader from 'src/components/Loader'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'

const MaterialMasterTable = () => {

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
  

  const [assignMaterialLogModal, setAssignMaterialLogModal] = useState(false)
  const [assignMaterialData, setAssignMaterialData] = useState([])
  const [userMasterData, setUserMasterData] = useState([])

  let viewData
  const viewDataRef = useRef([])

  useEffect(() => {
    viewDataRef.current = viewData
  }, [viewData])

  const userNameFinder = (id) => {
    if (typeof id === 'string' && isNaN(id)) return id
    const targetId = Number(id)
    let uname = ''
    if (targetId === 1) {
      uname = 'Admin'
    } else {
      userMasterData.map((user) => {
        if (Number(user.user_id) === targetId) {
          uname = user.emp_name
        }
      })
    }
    return uname || id || '--'
  }

  function changeMaterialMasterStatus(id) {
    let current_time = getCurrentDateTime()
    const singleMaterialData = viewDataRef.current.filter((data) => data.material_id == id)

    if (!singleMaterialData || singleMaterialData.length === 0) {
      toast.error('Material data not found!')
      return
    }

    let old_info = []
    try {
      old_info = singleMaterialData[0].log_info ? JSON.parse(singleMaterialData[0].log_info) : []
    } catch (error) {
      old_info = []
    }

    let current_status = singleMaterialData[0].status == 0 ? 1 : 0
    let current_info = [{
      product_name: singleMaterialData[0].product_name,
      material_code: singleMaterialData[0].material_code,
      uom: singleMaterialData[0].uom,
      length: singleMaterialData[0].length,
      width: singleMaterialData[0].width,
      height: singleMaterialData[0].height,
      volume: singleMaterialData[0].volume,
      division: singleMaterialData[0].add_col_one,
      plant: singleMaterialData[0].add_col_two,
      type: 3,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    }]

    let complete_info = [...old_info, ...current_info]
    let formData = new FormData()
    formData.append('id', id)
    formData.append('status', current_status)
    formData.append('log_info', JSON.stringify(complete_info))

    MaterialMasterService.softDeleteMaterial(formData).then((res) => {
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
    let fileName='Material_Master_BDC_Upload_Template'
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    let sample_data = [{
      Product_Name: "",
      Material_Code: "",
      Uom: "",
      Length: "",
      Width: "",
      Height: "",
      Division: "",
      Plant: "",
      Remarks: ""
    }]; 
    const ws = XLSX.utils.json_to_sheet(sample_data);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const material_division_plant_duplicate_having = (data,code,division,plant,index) => {

    let condition = 0
    data.map((vv,ii)=>{
      if(vv.Material_Code == code && vv.Division == division && vv.Plant == plant){
        condition = 1
      }
    })

    if(condition == 1){
      return true
    } else {
      return false
    }

  }

  const material_division_plant_duplicate_master_having = (data,code,division,plant,index) => {
    let condition = 0
    console.log(allMaterialInfo,'allMaterialInfo')
    allMaterialInfo.map((vv,ii)=>{
      if(vv.material_code == code && vv.add_col_one == division && vv.add_col_two == plant){
        condition = 1
      }
    })

    if(condition == 1){
      return true
    } else {
      return false
    }
  }

  const [allMaterialInfo, setAllMaterialInfo] = useState([])
  const [materialUomData, setMaterialUomData] = useState([])

  useEffect(() => {
    MaterialMasterService.getMaterialInfo().then((response) => {
      viewData = response.data.data
      viewDataRef.current = response.data.data
      let rowDataList = []
      setFetch(true)
      setAllMaterialInfo(viewData)
      viewData.map((data, index) => {
        console.log(data)
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          Name: data.product_name,
          Code: data.material_code,
          UOM: data.uom,
          Length: data.length,
          Width: data.width,
          Height: data.height,
          Division: data.add_col_one,
          Plant: data.add_col_two,
          Volume: data.volume,
          Remarks: data.add_col_three, 
          Status: data.status == 1 ? '✔️' : '❌',

          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                className="m-1"
                color={'info'}
                onClick={() => {
                  setAssignMaterialLogModal(true)
                  assignMaterialLogInfo(data.material_id)
                }}
              >
                <i className="fa fa-eye" aria-hidden="true"></i>
              </CButton>
              <CButton
                size="sm"
                color={data.status == 1 ? 'success' : 'danger'}
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeMaterialMasterStatus(data.material_id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              <Link
                to={
                  data.status == 1
                    ? `MaterialMaster/${data.material_id}`
                    : ''
                }
              >
                <CButton
                  size="sm"
                  color="secondary"
                  shape="rounded"
                  disabled={data.status == 1 ? false : true}
                  id={data.id}
                  className="m-1"
                >
                  {/* Edit */}
                  <i className="fa fa-edit" aria-hidden="true"></i>
                </CButton>
              </Link>
            </div>
          ),
        })
      })
      setRowData(rowDataList)
      setPending(false)
    })

    /* section for getting Material Uom Master from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(38).then((response) => {
      console.log(response.data.data,'setMaterialUomData')
      setMaterialUomData(response.data.data)
    })

    UserLoginMasterService.getUser().then((res) => {
      setUserMasterData(res.data.data)
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

  const uomExists = (dt) => {
    let uom_exists = false
    console.log(materialUomData,'materialUomData')
    materialUomData.map((vv,kk)=>{
      if(vv.definition_list_code == dt){
        uom_exists = true
      }
    })
    console.log(uom_exists,'uomExists')
    return uom_exists
  }

  const validation = (data) => {
    console.log(data,'validation-validation')
    let valid_data = []

    data.map((val,ind)=>{
      console.log(val,'val-validation')
      // val.Vendor_Name1 = vnameFinder(val.Vendor_Code)

      // val.uom = 

      if(material_division_plant_duplicate_having(valid_data,val.Material_Code,val.Division,val.Plant,ind)){
        val.upload_status = '0'
        val.upload_remarks = 'Duplicate Data'
      } else if(material_division_plant_duplicate_master_having(valid_data,val.Material_Code,val.Division,val.Plant,ind)){
        val.upload_status = '0'
        val.upload_remarks = 'Already in Master'
      } else if(!val.Product_Name || val.Product_Name == '' || val.Product_Name == undefined || val.Product_Name.toString().length < 3 ){
        val.upload_status = '0'
        val.upload_remarks = 'Invalid Product Name'
      } else if(!val.Material_Code || val.Material_Code == '' || val.Material_Code == undefined || val.Material_Code.toString().length < 5) {
        console.log(val.Material_Code,'val.Material_Code err')  
        val.upload_status = '0'
        val.upload_remarks = 'Invalid Material Code'
      } else if(!val.Uom || val.Uom == '' || val.Uom == undefined || val.Uom.toString().length > 2 || !uomExists(val.Uom)) {
        console.log(val.Uom,'val.Material_Code err')  
        val.upload_status = '0'
        val.upload_remarks = 'Invalid Uom Type'
      } else if(!val.Length || val.Length == '' || val.Length == undefined || val.Length.toString().length < 2 || isNaN(val.Length) || !(/^\d+(\.\d{1,3})?$/.test(val.Length)) ){
        val.upload_status = '0'
        val.upload_remarks = 'Invalid Length Value'
      } else if(!val.Width || val.Width == '' || val.Width == undefined || val.Width.toString().length < 2 || isNaN(val.Width) || !(/^\d+(\.\d{1,3})?$/.test(val.Width)) ){
        val.upload_status = '0'
        val.upload_remarks = 'Invalid Width Value'
      } else if(!val.Height || val.Height == '' || val.Height == undefined || val.Height.toString().length < 2 || isNaN(val.Height) || !(/^\d+(\.\d{1,3})?$/.test(val.Height)) ){
        val.upload_status = '0'
        val.upload_remarks = 'Invalid Height Value'
      } else if(!val.Division || val.Division == '' || val.Division == undefined){
        console.log(val.Division,'val.Rake_Plant err') 
        val.upload_status = '0'
        val.upload_remarks = 'Invalid Division'
      } else if(!val.Plant || val.Plant == '' || val.Plant == undefined){
        console.log(val.Plant,'val.Rake_Plant err') 
        val.upload_status = '0'
        val.upload_remarks = 'Invalid Plant'
      } else {
        val.upload_status = '1'
        val.upload_remarks = '--'
      }

      // val.Vendor_Name = val.Vendor_Name.toUpperCase()
      // val.Product_Name = val.Product_Name.toUpperCase()
      val.Material_Code = val.Material_Code.toUpperCase()

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
      name: 'Create On',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Name',
      selector: (row) => row.Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Code',
      selector: (row) => row.Code,
      sortable: true,
      center: true,
    },
    {
      name: 'UOM',
      selector: (row) => row.UOM,
      sortable: true,
      center: true,
    },
    {
      name: 'Length',
      selector: (row) => row.Length,
      sortable: true,
      center: true,
    },    
    {
      name: 'Width',
      selector: (row) => row.Width,
      sortable: true,
      center: true,
    },
    {
      name: 'Height',
      selector: (row) => row.Height,
      sortable: true,
      center: true,
    },
    {
      name: 'Division',
      selector: (row) => row.Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Plant',
      selector: (row) => row.Plant,
      sortable: true,
      center: true,
    },
    {
      name: 'Volume',
      selector: (row) => row.Volume,
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

  const statusFinder = (type) => {
    switch (type) {
      case 1:
        return 'Creation'
      case 2:
        return 'Updation'
      case 3:
        return 'Active Status Changed'
      default:
        return 'Unknown'
    }
  }

  const assignMaterialLogInfo = (mno) => {
    let rowDataList = []
    const filterData = viewDataRef.current.filter((data) => data.material_id == mno)
    let needed_data = []
    try {
      needed_data = filterData[0].log_info ? JSON.parse(filterData[0].log_info) : []
    } catch (error) {
      needed_data = []
    }
    // Exclude creation logs - show empty table by default
    needed_data = needed_data.filter((data) => data.type !== 1)

    needed_data.map((data, index) => {
      rowDataList.push({
        sno: index + 1,
        Product_Name: data.product_name ? data.product_name : '-',
        Material_Code: data.material_code ? data.material_code : '-',
        UOM: data.uom ? data.uom : '-',
        Length: data.length ? data.length : '-',
        Width: data.width ? data.width : '-',
        Height: data.height ? data.height : '-',
        Volume: data.volume ? data.volume : '-',
        Division: data.division ? data.division : '-',
        Plant: data.plant ? data.plant : '-',
        Status: statusFinder(data.type),
        Time: data.time,
        User: userNameFinder(data.user),
      })
    })
    setAssignMaterialData(rowDataList)
  }

  const columns_log = [
    { name: 'S.No', selector: (row) => row.sno, width: '70px', sortable: true, center: true },
    { name: 'Product Name', selector: (row) => row.Product_Name, sortable: true, center: true },
    { name: 'Material Code', selector: (row) => row.Material_Code, sortable: true, center: true },
    { name: 'UOM Type', selector: (row) => row.UOM, sortable: true, center: true },
    { name: 'Length', selector: (row) => row.Length, sortable: true, center: true },
    { name: 'Width', selector: (row) => row.Width, sortable: true, center: true },
    { name: 'Height', selector: (row) => row.Height, sortable: true, center: true },
    { name: 'Total Volume', selector: (row) => row.Volume, sortable: true, center: true },
    { name: 'Division', selector: (row) => row.Division, sortable: true, center: true },
    { name: 'Plant', selector: (row) => row.Plant, sortable: true, center: true },
    { name: 'Status', selector: (row) => row.Status, sortable: true, center: true },
    { name: 'Time', selector: (row) => row.Time, sortable: true, center: true },
    { name: 'User', selector: (row) => row.User, sortable: true, center: true },
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
      name: 'Product',
      selector: (row) => row.Product_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Code',
      selector: (row) => row.Material_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Uom',
      selector: (row) => row.Uom,
      sortable: true,
      center: true,
    },
    {
      name: 'Length',
      selector: (row) => row.Length,
      sortable: true,
      center: true,
    },
    {
      name: 'Width',
      selector: (row) => row.Width,
      sortable: true,
      center: true,
    },
    {
      name: 'Height',
      selector: (row) => row.Height,
      sortable: true,
      center: true,
    },
    {
      name: 'Division',
      selector: (row) => row.Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Plant',
      selector: (row) => row.Plant,
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

    if (child_property_name == 'Length' || child_property_name == 'Width' || child_property_name == 'Height') {
      getData2 = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')      
    } else if (child_property_name == 'Division') {
      getData2 = event.target.value.replace(/[^A-Z]/gi, '')
    } else if (child_property_name == 'Plant' || child_property_name == 'Material_Code') {
      getData2 = event.target.value.replace(/[^a-zA-Z0-9]/gi, '')
    }

    const bdc_parent_info = JSON.parse(JSON.stringify(movies))

    console.log(bdc_parent_info[parent_index],'bdc_parent_info')
    console.log(parent_index,'bdc_parent_info-parent_index')

    bdc_parent_info[parent_index][`${child_property_name}`] = getData2

    getBdcUploadData(parent_index,3,bdc_parent_info) 

  }

  const clickme = (vbn) => {
    console.log(vbn,'clickme-val')
    console.log(movies,'clickme-val movies')
  }

  const uomIdFinder = (code) => {
    let uom = ''

    materialUomData.map((vv,kk)=>{
      if(vv.definition_list_code == code){
        uom = vv.definition_list_id
      }
    })
    console.log(uom,'uomIdFinder')
    return uom
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
          BDCSendData.product_name = movies[i].Product_Name
          BDCSendData.material_code = movies[i].Material_Code
          BDCSendData.uom = movies[i].Uom
          BDCSendData.uom_id = uomIdFinder(movies[i].Uom)
          BDCSendData.length = movies[i].Length
          BDCSendData.width = movies[i].Width
          BDCSendData.height = movies[i].Height
          BDCSendData.add_col_one = movies[i].Division
          BDCSendData.add_col_two = movies[i].Plant
          BDCSendData.add_col_three = movies[i].Remarks

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

        MaterialMasterService.createByBulkUpload(formData).then((res) => {
          setFetch(true)

          console.log(res,'createTripsheet')
          if(res.status == 200){
            Swal.fire({
              // title: movies.length+' Tripsheets Inserted Successfully!',
              title: 'Materials Inserted Successfully!',
              icon: "success",
              confirmButtonText: "OK",
            }).then(function () {
                window.location.reload(false)
            });
          } else {
            Swal.fire({
              title: 'Material Insertion Failed in LP. Kindly contact admin..!',
              icon: "warning",
              confirmButtonText: "OK",
            }).then(function () {
              // window.location.reload(false)
            })
          }

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
          let todoCopy = JSON.parse(JSON.stringify(movies))
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
            Product_Name: data.Product_Name,
            Material_Code: data.Material_Code,
            Uom: data.Uom,
            Length: data.Length,
            Width: data.Width,
            Height: data.Height,
            Division: data.Division,
            Plant: data.Plant,
            Upload_Status: data.upload_status == 1 ? '✔️' : '❌',
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
        let todoCopy1 = JSON.parse(JSON.stringify(movies))
        console.log(todoCopy1,'todoCopy1')
        // todoCopy1.splice(editId, 1)
        updateData = validation(todoCopy1)
        console.log(todoCopy1,'todoCopy1')
        updateData.map((data, index) => {
          rowDataList.push({
           S_NO: index + 1,
            Product_Name: data.Product_Name,
            Material_Code: data.Material_Code,
            Uom: data.Uom,
            Length: data.Length,
            Width: data.Width,
            Height: data.Height,
            Division: data.Division,
            Plant: data.Plant,
            Upload_Status: data.upload_status == 1 ? '✔️' : '❌',
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
                Choose file for Import 
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
                  {/* <button onClick={handleExport} className="btn btn-primary float-right">
                      Export <i className="fa fa-download"></i>
                  </button> */}
                </CCol>
              </CRow>
            </>
          )}
          <CRow>
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
          </CCard>

          {/* Log Information Modal */}
          <CModal
            size="xl"
            visible={assignMaterialLogModal}
            onClose={() => setAssignMaterialLogModal(false)}
          >
            <CModalHeader>
              <CModalTitle>Log Information</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <CCol md={12}>
                  <CustomTable columns={columns_log} data={assignMaterialData} />
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setAssignMaterialLogModal(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          {/* Log Information Modal */}

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
                  <CFormLabel htmlFor="Product_Name">Product Name</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Product_Name"
                    onChange={(e) => {
                      changeBdcTableItem(e,'Product_Name',currentDataId)
                    }}
                    maxLength={12}
                    value={totalData[currentDataId] ? totalData[currentDataId].Product_Name : ''}
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="Material_Code">Material Code</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Material_Code"
                    onChange={(e) => {
                      changeBdcTableItem(e,'Material_Code',currentDataId)
                    }}
                    maxLength={10}
                    value={totalData[currentDataId] ? totalData[currentDataId].Material_Code : ''}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="uom">
                    UOM Type 
                  </CFormLabel>
                  <CFormSelect
                    size="sm"
                    name="uom"
                    onChange={(e) => {
                      changeBdcTableItem(e,'Uom',currentDataId)
                    }}
                    value={totalData[currentDataId] ? totalData[currentDataId].Uom : 0}                     
                    aria-label="Small select example"
                    placeholder="Select UOM Type"
                    id="uom"
                  >
                    <option value="0">Select ...</option>
                    {materialUomData.map(({ definition_list_name, definition_list_code, definition_list_id }) => {
                    
                        return (
                          <>
                            <option key={definition_list_id} value={definition_list_code}>
                              {`${definition_list_name} - (${definition_list_code})`}
                            </option>
                          </>
                        )
                        
                    })}
                  </CFormSelect>
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="d_name">Length</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Length"
                    onChange={(e) => {
                      changeBdcTableItem(e,'Length',currentDataId)
                    }}
                    maxLength={30}
                    value={totalData[currentDataId] ? totalData[currentDataId].Length : ''}
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="d_no">Width</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Width"
                    onChange={(e) => {
                      changeBdcTableItem(e,'Width',currentDataId)
                    }}
                    maxLength={10}
                    value={totalData[currentDataId] ? totalData[currentDataId].Width : ''}
                  />
                </CCol> 

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="d_no">Height</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Height"
                    onChange={(e) => {
                      changeBdcTableItem(e,'Height',currentDataId)
                    }}
                    maxLength={10}
                    value={totalData[currentDataId] ? totalData[currentDataId].Height : ''}
                  />
                </CCol> 

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="d_no">Division</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Division"
                    onChange={(e) => {
                      changeBdcTableItem(e,'Division',currentDataId)
                    }}
                    maxLength={10}
                    value={totalData[currentDataId] ? totalData[currentDataId].Division : ''}
                  />
                </CCol> 

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="d_no">Plant</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Plant"
                    onChange={(e) => {
                      changeBdcTableItem(e,'Plant',currentDataId)
                    }}
                    maxLength={10}
                    value={totalData[currentDataId] ? totalData[currentDataId].Plant : ''}
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
                  <CFormLabel htmlFor="Product_Name">Product Name</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Product_Name"
                    readOnly
                    value={totalData[currentDataId] ? totalData[currentDataId].Product_Name : ''}
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="Material_Code">Material Code</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Material_Code"
                    readOnly
                    value={totalData[currentDataId] ? totalData[currentDataId].Material_Code : ''}
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="Material_Code">Uom Code</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Uom_Code"
                    readOnly
                    value={totalData[currentDataId] ? totalData[currentDataId].Uom : ''}
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="d_name">Length</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Length"
                    readOnly
                    value={totalData[currentDataId] ? totalData[currentDataId].Length : ''}
                  />
                </CCol>
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="d_no">Width</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Width"
                    readOnly
                    value={totalData[currentDataId] ? totalData[currentDataId].Width : ''}
                  />
                </CCol> 

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="d_no">Height</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Height"
                    readOnly
                    value={totalData[currentDataId] ? totalData[currentDataId].Height : ''}
                  />
                </CCol> 

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="d_no">Division</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Division"
                    readOnly
                    value={totalData[currentDataId] ? totalData[currentDataId].Division : ''}
                  />
                </CCol> 

                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="d_no">Plant</CFormLabel>
                  <CFormInput
                    size="sm"
                    className="mb-2"
                    id="Plant"
                    readOnly 
                    value={totalData[currentDataId] ? totalData[currentDataId].Plant : ''}
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
            <p className="lead">Are you sure to Submit the Material Master Details ?</p>
          </CModalBody>
          <CModalFooter>
            <CButton
              className="m-2"
              color="warning"
              onClick={() => {
                setBdcSubmit(false)
                handleSubmit(1)
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

export default MaterialMasterTable
