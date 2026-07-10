/* eslint-disable  */
import {
  CButton,
  CCard,
  CCol, 
  CForm,
  CFormInput,
  CFormLabel, 
  CRow,
  CTabContent, 
  CTabPane, 
  CFormTextarea,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CAlert,
  CModalFooter,
  CCardImage,
  CFormSelect,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useForm from 'src/Hooks/useForm'
import { useNavigate, useParams } from 'react-router-dom' 
import { Link } from 'react-router-dom'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import DieselIntentValidation from 'src/Utils/DieselIntent/DieselIntentValidation'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader' 
import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';
import Swal from 'sweetalert2'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

import FileResizer from 'react-image-file-resizer' 
import NLFSDieselIntentService from 'src/Service/NLFS/Master/NLFSDieselIntentService'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import NLFSDivisionApi from 'src/Service/NLFS/Master/NLFSDivisionApi'
export const nlfs_diesel_vendor_code = process.env.REACT_APP_NLFS_DIESEL_VENDOR

const NLFSDIAccountsApproval = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
const [screenAccess, setScreenAccess] = useState(false)
let page_no = LogisticsProScreenNumberConstants.NLFSDieselIntentModule.FS_Accounts_Approval

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

  const formValues = {
    vehicle_id: '',
    vehicle_division: '',
    vendor_code: '',
    diesel_to: '',
    invoice_no: '',
    invoice_copy: '',
    no_of_ltrs: '',
    rate_of_ltrs: '',
    total_amount: '',
    bunk_reading: '',
    diesel_intent_no: '',
    diesel_status: '',
    remarks: '',
    diesel_vendor_name: '',
    vehicle_no: '',
    carry_vehicle:'',
    dic_remarks:'',
    dico_remarks:'',
    sap_diesel_invoice_posting_date:'',
    prev_di_nol:'',
    prev_di_rpl:'',
    prev_di_amount:'',
  }

  const { id } = useParams()
  const [OdometerPhoto1, setOdometerPhoto1] = useState(false)
  const [OdometerPhoto2, setOdometerPhoto2] = useState(false) 
  
  const [state, setState] = useState({
    page_loading: false,
  })
  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
  const [singleDIInfo, setSingleDIInfo] = useState([])
  const [dirverAssign, setDirverAssign] = useState(true)
  const [fetch, setFetch] = useState(false)
  const [vendorData, setvendorData] = useState({})
  const [validateSubmit, setValidateSubmit] = useState(true)
  const [vendor, setVendor] = useState(false)
  const [acceptBtn, setAcceptBtn] = useState(true)
  const [acceptBtn1, setAcceptBtn1] = useState(true)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [vendor_no, setVendor_no] = useState('')
  const navigation = useNavigate()
  const vehicleType = {
    OWN: 1,
    CONTRACT: 2,
    HIRE: 3,
  }
  const REQ = () => <span className="text-danger"> * </span>
  const DieselFor = ['','Vehicle','Barel','Others','Car']
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
  const formatter1 = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  useEffect(() => {
    NLFSDieselIntentService.getNLFSDIInfoById(id).then((res) => {
     
      let view_data = res.data.data
       console.log(view_data,'getNLFSDIInfoById')
      if (res.status === 200) {
        values.vendor_code = nlfs_diesel_vendor_code
        values.diesel_vendor_name = 'NAGA LIMITED FUEL STATION' 
        values.diesel_intent_no = view_data.di_no
        values.diesel_to = view_data.diesel_to
        values.vehicle_no = view_data.vehicle_no
        values.carry_vehicle = view_data.carry_vehicle
        values.diesel_invoice_date = view_data.diesel_invoice_date
        values.sap_diesel_invoice_posting_date = view_data.sap_diesel_invoice_posting_date
        values.invoice_no = view_data.invoice_no 
        values.rate_of_ltrs = view_data.sap_fuel_rate
        values.no_of_ltrs = view_data.fuel_quantity
        values.total_amount = view_data.total_amount
        values.vehicle_division = view_data.division_id
        values.dic_remarks = view_data.remarks
        values.dico_remarks = view_data.confirmation_remarks
        values.vendor_tds = view_data.vendor_tds
        values.vendor_hsn = view_data.vendor_hsn
        values.acc_appr_request_remarks = view_data.acc_appr_request_remarks
        values.acc_appr_request_at = view_data.acc_appr_request_at
        let temp = JSON.parse(res.data.data.acc_appr_info)
        console.log(temp,'temp') 
        if(temp[0]){
          values.prev_di_nol = temp[0].nol
          values.prev_di_rpl = temp[0].rpl
          values.prev_di_amount = temp[0].amount
        } else {
          values.prev_di_nol = ''
          values.prev_di_rpl = ''
          values.prev_di_amount = '' 
        }
        setSingleDIInfo(view_data)
        setFetch(true) 
        console.log(view_data,'singleDIInfo')
      }
    })
  }, [singleDIInfo.length == 0])

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(FSDIApproval, DieselIntentValidation, formValues)

   /* ====================Bunk Reading Web Cam Start ========================*/
    const webcamRef = React.useRef(null);
    const [fileuploaded, setFileuploaded] = useState(false)
    const [camEnable, setCamEnable] = useState(false)
    const [imgSrc, setImgSrc] = React.useState(null);

    const capture = React.useCallback(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    }, [webcamRef, setImgSrc]);

   /* ====================Bunk Reading Web Cam End ========================*/

  /* ==================== Bunk Reading ReSize Start ========================*/
    const resizeFile = (file) => new Promise(resolve => {
      FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
      uri => {
        resolve(uri);
      }, 'base64' );
    })

    const imageCompress = async (event) => {
      const file = event.target.files[0];
      console.log(file)

      if(file.type == 'application/pdf') {

      if(file.size > 5000000){
        alert('File to Big, please select a file less than 5mb')
        setFileuploaded(false)
      } else {
        values.bunk_reading = file
        setFileuploaded(true)
      }
    }else{

      const image = await resizeFile(file);
      if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
        valueAppendToImage(image)
        setFileuploaded(true)
      } else {
        values.bunk_reading = file
        setFileuploaded(true)
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

      return new File([u8arr], filename, {type: mime});
    };

    const valueAppendToImage = (image) => {

      let file_name = 'dummy'+getRndInteger(100001,999999)+'.png'
      let file = dataURLtoFile(
        image,
        file_name,
      );

      console.log(file )

      values.bunk_reading = file
    }

    // will hold a reference for our real input file
    let inputFile = '';

    // function to trigger our input file click
    const uploadClick = e => {
      e.preventDefault();
      inputFile.click();
      return false;
    };

  const divisionCodeFinder = (div) => {
    console.log(divisionData,'divisionData')
    let div_code = 0 
    divisionData.map((vv,kk)=>{
      if(vv.division_id == div){
        div_code = vv.add_col_one
      }
    }) 
    return div_code
  }

  const getRndInteger = (min, max) => {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    useEffect(() => {

      if(values.bunk_reading) {
        setFileuploaded(true)
      } else {
        setFileuploaded(false)
      }

    }, [values.bunk_reading])
      /* ==================== Bunk Reading Image ReSize End ========================*/

      /* ====================Invoice Copy Web Cam Start ========================*/

    const webcamRef1 = React.useRef(null);
    const [fileuploaded1, setFileuploaded1] = useState(false)
    const [camEnable1, setCamEnable1] = useState(false)
    const [imgSrc1, setImgSrc1] = React.useState(null);

    const capture1 = React.useCallback(() => {
      const imageSrc1 = webcamRef1.current.getScreenshot();
      setImgSrc1(imageSrc1);
    }, [webcamRef1, setImgSrc1]);
   /* ====================Invoice Copy Reading Web Cam End ========================*/

   /* ==================== Invoice Copy Image ReSize Start ========================*/

    const resizeFile1 = (file) => new Promise(resolve => {
      FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
      uri => {
        resolve(uri);
      }, 'base64' );
    })

    const imageCompress1 = async (event) => {
      const file = event.target.files[0];
      console.log(file)

      if(file.type == 'application/pdf') {

      if(file.size > 5000000){
        alert('File too Big, please select a file less than 5mb')
        setFileuploaded1(false)
      } else {
        values.invoice_copy = file
        setFileuploaded1(true)
      }
    }else{

      const image = await resizeFile1(file);
      if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
        valueAppendToImage1(image)
        setFileuploaded1(true)
      } else {
        values.invoice_copy = file
        setFileuploaded1(true)
      }
    }
  }

    const dataURLtoFile1 = (dataurl, filename) => {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, {type: mime});
    };

    const valueAppendToImage1 = (image) => {

      let file_name = 'dummy'+getRndInteger1(100001,999999)+'.png'
      let file = dataURLtoFile1(
        image,
        file_name,
      );

      console.log(file)

      values.invoice_copy = file
    }

    // will hold a reference for our real input file
    let inputFile1 = '';

    // function to trigger our input file click
    const uploadClick1 = e => {
      e.preventDefault();
      inputFile1.click();
      return false;
    };

  const getRndInteger1 = (min, max) => {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    useEffect(() => {

      if(values.invoice_copy) {
        setFileuploaded1(true)
      } else {
        setFileuploaded1(false)
      }

    }, [values.invoice_copy])

   /* ==================== Invoice Copy Image ReSize End ========================*/

  const [sapHsnData, setSapHsnData] = useState([])
  const [tdsMasterData, setTdsMasterData] = useState([]) 
  const [divisionData, setDivisionData] = useState([])

  useEffect(()=>{

  /* section for getting Sap Hsn Data from database */
  DefinitionsListApi.visibleDefinitionsListByDefinition(27).then((response) => {
    console.log(response.data.data,'DefinitionsListApi-setSapHsnData')
    setSapHsnData(response.data.data)
  })

  /* section for getting TDS Master Data from database */
  DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
    console.log(response.data.data,'DefinitionsListApi-setTdsMasterData')
    setTdsMasterData(response.data.data)
  })

  //section for getting Divisions Data from database
  NLFSDivisionApi.getActiveDivisions().then((response) => {
    let viewData = response.data.data
    console.log(viewData,'getActiveDivisions')
    setDivisionData(viewData)
  })

  },[])

   const [sapDieselRate, setSapDieselRate] = useState(0)

   useEffect(()=>{
   
       if(values.vehicle_division && values.vehicle_division != 0)
       {
         console.log(values.vehicle_division,'ifelse-if part')
         let dirate = 0
         console.log(values.vehicle_division,'sapFuelRateFinder-div')
          let divicode = divisionCodeFinder(values.vehicle_division)
         setFetch(false)
         VendorOutstanding.getNLFSDieselRate(divicode).then((res) => {
           // let driver_outstanding_data = res.data[0];
           setFetch(true)
           let op_array = res.data[0]
           dirate = 121
           console.log(op_array,'getNLFSDieselRate');
           if(op_array.STATUS == 1){
             setSapDieselRate(op_array.AMOUNT)
           } else {
             setSapDieselRate(0)
           }
           
           // setHireVendorOutstanding(driver_outstanding_data.L_DMBTR)
         })
         
       } else {
         console.log(values.vehicle_division,'ifelse-else part')
         setSapDieselRate(0)
       }
   
     },[values.vehicle_division])

  useEffect(() => {
    if (
      isTouched.invoice_no &&
      !errors.invoice_no && 
      !errors.diesel_invoice_date &&
      isTouched.diesel_invoice_date &&
      !errors.invoice_copy && 
      !errors.bunk_reading
    ) {
      setAcceptBtn(false)
    } else {
      setAcceptBtn(true)
    }
  }, [errors])
  useEffect(() => {
    if (
      !errors.no_of_ltrs1&&
      isTouched.invoice_no &&
      !errors.invoice_no &&
      // isTouched.invoice_copy &&
      !errors.invoice_copy &&
      !errors.diesel_invoice_date &&
      isTouched.diesel_invoice_date &&
      // isTouched.bunk_reading &&
      isTouched.rate_of_ltrs1 &&
      !errors.rate_of_ltrs1 &&
      !errors.bunk_reading
    ) {
      setAcceptBtn1(false)
    } else {
      setAcceptBtn1(true)
    }
  }, [errors])


  function FSDIApproval(){
    //
  }

  const [remarks, setRemarks] = useState('') 
  const handleChangenew = event => {
    const result = event.target.value.toUpperCase();
    setRemarks(result);
  }

  const DepoTripExpenseApprovalCancel = () => {
    console.log(remarks,'apremarks')
    if (remarks && remarks.trim()) {
      console.log('iop')
      // setApprovalReject(true)
      expenseApproval(2)
    } else {
      setFetch(true)
      Swal.fire({
        title: 'You should give the proper reason for rejection via approval remarks...',
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
      })
      setRemarks('')
      return false
    }
  }
  
  const expenseApproval = (type) => {
    /* Values Assigning To Save Details into DB Part Start*/

    const formData = new FormData()

    formData.append('acc_appr_status', type == 1 ? 2 : 3)
    formData.append('acc_appr_done_remarks', remarks)
    formData.append('acc_appr_done_by', user_id)
    formData.append('di_id', id) 
    
    if(type == 2){
      let accounts_approval_info = []
      accounts_approval_info.push({
        nol: singleDIInfo.fuel_quantity,
        rpl: singleDIInfo.sap_fuel_rate,
        amount: singleDIInfo.total_amount,
      })
      formData.append('acc_appr_info', JSON.stringify(accounts_approval_info))
      formData.append('fuel_quantity', values.prev_di_nol) 
      formData.append('total_amount', values.prev_di_amount) 
      formData.append('sap_fuel_rate', values.prev_di_rpl) 
    }  

    NLFSDieselIntentService.accountsApprovalSumission(formData).then((res) => {
      setFetch(true)
      console.log(res,'accountsApprovalSumission')
      if (res.status == 200) {
        setFetch(true) 
        Swal.fire({
          icon: "success",
          title: type == 1 ? 'DI Accounts Approval Process Approved Successfully..!' : 'DI Accounts Approval Process Rejected Successfully..!',
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/DIAccountsApprovalHome')
        });
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        })
      } else {
        toast.warning('Accounts Approval Submission Cannot be Updated. Kindly contact Admin..!')
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
        {screenAccess ? (
         <>
          <CCard>
            <CTabContent>
              <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                <CForm className="container p-3" onSubmit={handleSubmit}>
                  <CRow className="">
                     
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vNum">Diesel To</CFormLabel>
                    <CFormInput
                      size="sm"
                      id="vNum"
                      value={DieselFor[values.diesel_to]}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vNum">{(values.diesel_to == 1 || values.diesel_to == 4) ? 'Vehicle Number & Division' : 'Carry Vehicle Number & Division'}</CFormLabel>
                    <CFormInput
                      size="sm"
                      id="vNum"
                      value={(values.diesel_to == 1 || values.diesel_to == 4) ? `${values.vehicle_no} (${singleDIInfo ? singleDIInfo.vehicle_info.vehicle_division_info.short_name : '-'})` : `${values.carry_vehicle} (${singleDIInfo ? singleDIInfo.division_info.short_name : '-'})`}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="tripsheet_id">Diesel Indent Number</CFormLabel>
                    <CFormInput
                      size="sm"
                      // name="tripsheet_sheet_id"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.diesel_intent_no}
                      // value={singleVehicleInfo.trip_sheet_info.trip_sheet_no}
                      // id="tripsheet_id"
                      type="text"
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="diesel_vendor_name">Vendor Name & Code</CFormLabel>
                    <CFormInput
                      size="sm"
                      name="diesel_vendor_name"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      id="diesel_vendor_name"
                      value={`${values.diesel_vendor_name} (${values.vendor_code})`}
                      readOnly
                    />
                  </CCol>

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="dic_remarks">
                      DI Creation Remarks                         
                    </CFormLabel>
                    <CFormInput
                      name="dic_remarks"                           
                      size="sm"
                      value={values.dic_remarks} 
                      id="dic_remarks" 
                      readOnly
                    />
                  </CCol> 
                  
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="diesel_invoice_date">
                      NLFS Invoice Date  
                      
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      type="date"
                      readOnly
                      value={values.diesel_invoice_date}
                    />
                 </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="invoice_no">
                      Invoice Number  
                    </CFormLabel>
                    <CFormInput
                      readOnly
                      size="sm"
                      id="invoice_no"
                      value={values.invoice_no}
                      maxLength={15}
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="invoice_copy">
                      Invoice Copy  
                    </CFormLabel>
                    <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                        <span className="float-start">
                        &nbsp;{values.invoice_copy.name}
                      </span>
                      {values.invoice_copy.name == undefined &&
                        <span className="float-start">
                        <i
                          className="fa fa-eye"
                          onClick={() => setOdometerPhoto1(true)}
                          aria-hidden="true"
                        ></i>{' '}
                        &nbsp;View
                        </span>
                      }
                    </CButton> 
                  </CCol> 
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="invoice_copy">
                      Bunk Reading Copy  
                    </CFormLabel>
                    <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                      <span className="float-start">
                        &nbsp;{values.bunk_reading.name}
                      </span>
                      {values.bunk_reading.name == undefined &&
                        <span className="float-start">
                          <i
                            className="fa fa-eye"
                            onClick={() => setOdometerPhoto2(true)}
                            aria-hidden="true"
                          ></i>
                          &nbsp;View
                        </span>
                      } 
                    </CButton> 
                  </CCol> 

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="sap_invoice_diesel_posting_date">
                      SAP Posting Date & Diesel Rate
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      // type="date" 
                      id="sap_invoice_diesel_posting_date" 
                      readOnly
                      value={`${values.sap_diesel_invoice_posting_date} { ${sapDieselRate} }`} 
                    />
                  </CCol>
                  
                  {/* ================ ASK Part Start ================ */}
                  <CCol xs={12} md={3}>
                    {/* <CFormLabel htmlFor="vendor_tds">
                      TDS Tax Type  
                    </CFormLabel>
                    <CFormSelect
                      size="sm" 
                      value={values.vendor_tds} 
                      disabled 
                      aria-label="Small select example"
                    >
                      <option value="">Select</option>
                      <option value="0">No Tax</option>
          
                      {tdsMasterData.map(({ definition_list_code, definition_list_name }) => {
                        if (definition_list_code) {
                          return (
                            <>
                              <option
                                key={definition_list_code}
                                value={definition_list_code}
                              >
                                {definition_list_name}
                              </option>
                            </>
                          )
                        }
                      })}
                    </CFormSelect> */}
                  </CCol>
                  <CCol xs={12} md={3}>
                    {/* <CFormLabel htmlFor="vendor_hsn">
                      HSN Code  
                    </CFormLabel>
                    <CFormSelect
                      size="sm" 
                      value={values.vendor_hsn}
                      disabled 
                      aria-label="Small select example"
                    >
                      <option value="">Select</option>
          
                      {sapHsnData.map(({ definition_list_code, definition_list_name }) => {
                        if (definition_list_code) {
                          return (
                            <>
                              <option
                                key={definition_list_code}
                                value={definition_list_code}
                              >
                                {definition_list_name}
                              </option>
                            </>
                          )
                        }
                      })}
                    </CFormSelect> */}
                  </CCol>
                  
                  {/*Previous Diesel Information*/}
                  <CCol xs={12} md={3}>
                    <CFormLabel
                      htmlFor="inputAddress"
                      style={{
                        backgroundColor: 'red',
                        color: 'white',
                        marginTop:"8%"
                      }}
                    >
                      {`__ Previous Diesel Information : __`}
                    </CFormLabel>
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="prev_di_nol">
                      No. Of Liters 
                    </CFormLabel>
                    <CFormInput size="sm" 
                    readOnly
                    id="prev_di_nol"
                    value={values.prev_di_nol}
                    maxLength={7}
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="prev_di_rpl">
                      Rate Per Liter 
                    </CFormLabel>
                    <CFormInput 
                      value={values.prev_di_rpl} 
                      size="sm"
                      readOnly
                      id="prev_di_rpl"
                      maxLength={6}
                    />
                  </CCol> 
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="prev_di_amount">
                      Amount
                    </CFormLabel>
                    <CFormInput 
                      size="sm"
                      value={values.prev_di_amount} 
                      id="prev_di_amount"
                      readOnly
                    />
                  </CCol> 
                  {/*Current Diesel Information*/}
                  <CCol xs={12} md={3}>
                    <CFormLabel
                      htmlFor="inputAddress"
                      style={{
                        backgroundColor: 'greenyellow',
                        color: 'black',
                        marginTop:"8%"
                      }}
                    >
                      {`__ Current Diesel Information : __`}
                    </CFormLabel>
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="no_of_ltrs1">
                      No. Of Liters 
                    </CFormLabel>
                    <CFormInput size="sm" 
                    readOnly
                    id="no_of_ltrs1"
                    value={singleDIInfo.fuel_quantity}
                    maxLength={7}
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="rate_of_ltrs">
                      Rate Per Liter 
                    </CFormLabel>
                    <CFormInput 
                      value={values.rate_of_ltrs} 
                      size="sm"
                      readOnly
                      id="rate_of_ltrs"
                      maxLength={6}
                    />
                  </CCol> 
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="total_amount">
                      Amount
                    </CFormLabel>
                    <CFormInput 
                      size="sm"
                      // value={(formatter1.format(isFinite(values.total_amount) ? values.total_amount : 0))}
                      value={values.total_amount} 
                      id="total_amount"
                      readOnly
                    />
                  </CCol> 
                  {/* ================ ASK Part End ================ */} 
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="dico_remarks">
                      DI Confirmation Remarks                         
                    </CFormLabel>
                    <CFormInput
                      name="dico_remarks"                           
                      size="sm"
                      value={values.dico_remarks} 
                      id="dico_remarks" 
                      readOnly
                    />
                  </CCol> 
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="acc_appr_request_remarks">
                      Accounts Approval Request Remarks
                    </CFormLabel>
                    <CFormInput 
                      size="sm"
                      value={values.acc_appr_request_remarks}
                      id="acc_appr_request_remarks"
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="acc_appr_request_at">
                      Accounts Approval Request Time
                    </CFormLabel>
                    <CFormInput 
                      size="sm"
                      value={values.acc_appr_request_at}
                      id="acc_appr_request_at"
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="remarks">Approval Remarks</CFormLabel>                     
                    <CFormTextarea
                      id="remarks"
                      name="remarks"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChangenew}
                      value={remarks}
                      rows="1"
                    ></CFormTextarea>
                  </CCol>                    
                    
                  </CRow>
                  <CRow className="mt-md-3">
                    <CCol className="" xs={12} sm={12} md={3}>
                      <CButton size="sm" color="primary" className="text-white" type="button">
                        <Link className="text-white" to="/DIAccountsApprovalHome">
                          Previous
                        </Link>
                      </CButton>
                    </CCol>
                    <CCol
                      className="offset-md-6"
                      xs={12}
                      sm={12}
                      md={3}
                      style={{ display: 'flex', justifyContent: 'end' }}
                    >
                      <CButton
                        size="sm"
                        style={{ background: 'red'}}
                        className="mx-3 text-white"
                        onClick={() => {
                          setFetch(false)
                          DepoTripExpenseApprovalCancel()
                        }}
                        type="submit"
                      >
                        Reject
                      </CButton>
                      <CButton
                        size="sm"
                        style={{ background: 'green'}}
                        className="mx-3 text-white"
                        onClick={() => {
                          setFetch(false)
                          expenseApproval(1)
                        }}
                        type="submit"
                      >
                        Approve
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CTabPane>
            </CTabContent>
          </CCard>
         </>) : (<AccessDeniedComponent />)}
       </>
      )}
      {/* Error Modal Section */}
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
      {/*Camera Image Copy model*/}
      <CModal
              visible={camEnable}
              backdrop="static"
              onClose={() => {
                setCamEnable(false)
                setImgSrc("")
              }}
            >
              <CModalHeader>
                <CModalTitle>Bunk Reading Photo</CModalTitle>
              </CModalHeader>
              <CModalBody>

                {!imgSrc && (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/png"
                      height={200}
                    />
                    <p className='mt-2'>
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-1 px-2 text-white"
                        type="button"
                        onClick={() => {
                          capture()
                        }}
                      >
                        Accept
                      </CButton>
                    </p>
                  </>
                )}
                {imgSrc && (

                  <>
                    <img height={200}
                      src={imgSrc}
                    />
                    <p className='mt-2'>
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-1 px-2 text-white"
                        type="button"
                        onClick={() => {
                          setImgSrc("")
                        }}
                      >
                        Delete
                      </CButton>
                    </p>
                  </>
                )}

              </CModalBody>
              <CModalFooter>
                {imgSrc && (
                  <CButton
                    className="m-2"
                    color="warning"
                    onClick={() => {
                      setCamEnable(false)
                      valueAppendToImage(imgSrc)
                    }}
                  >
                    Confirm
                  </CButton>
                )}
                <CButton
                  color="secondary"
                  onClick={() => {
                    setCamEnable(false)
                    setImgSrc("")
                  }}
                >
                  Cancel
                </CButton>
              </CModalFooter>
      </CModal>

      <CModal visible={OdometerPhoto1} onClose={() => setOdometerPhoto1(false)}>
        <CModalHeader>
          <CModalTitle>Invoice Copy</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {singleDIInfo.invoice_copy && !singleDIInfo.invoice_copy.includes('.pdf') ? (
            <CCardImage orientation="top" src={singleDIInfo.invoice_copy} />
            ) : (
            <iframe
              orientation="top"
              height={500}
              width={475}
              src={singleDIInfo.invoice_copy}
            ></iframe>
          )}
        </CModalBody> 
        <CModalFooter>
          <CButton color="secondary" onClick={() => setOdometerPhoto1(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={OdometerPhoto2} onClose={() => setOdometerPhoto2(false)}>
        <CModalHeader>
          <CModalTitle>Bunk Reading</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {singleDIInfo.bunk_reading_copy && !singleDIInfo.bunk_reading_copy.includes('.pdf') ? (
              <CCardImage orientation="top" src={singleDIInfo.bunk_reading_copy} />
          ):(
            <iframe
              orientation="top"
              height={500}
              width={475}
              src={singleDIInfo.bunk_reading_copy}
            ></iframe>
          )}
        </CModalBody> 
        <CModalFooter>
          <CButton color="secondary" onClick={() => setOdometerPhoto2(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      {/*Camera Image Copy model*/}
    </>
  )
}

export default NLFSDIAccountsApproval
