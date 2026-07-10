
import CIcon from '@coreui/icons-react'
import { CCol, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CRow, CInputGroup, CTableHeaderCell, CTable, CTableHead, CTableRow, CTableBody, CButton } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import * as icon from '@coreui/icons';
import FileResizer from 'react-image-file-resizer'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import NlmtVendorOutstanding from 'src/Service/Nlmt/Advance/NlmtVendorOutstanding'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'
import Swal from 'sweetalert2'
const NlmtAdvanceCreationHire = ({

  values,
  handleChange,
  onFocus,
  onBlur,
  singleVehicleInfo,
  isTouched,
  remarks,
  rejRemarks,
  handleChangenew,
  handleChangenew1,
  setTotalFreightAmount,
  vendorMobileValue
}) => {
  const [errors, setErrors] = useState({})
  const [outstanding, setOutstanding] = useState('')
  const [TaxType, setTaxType] = useState([])
  const [GstTaxType, setGstTaxType] = useState([])
  // const [incoTableData, setIncoTableData] = useState([])

  console.log(rejRemarks, 'values-rejRemarks')
  console.log(remarks, 'values-remarks')

  const advance_data = singleVehicleInfo.advance_payment_info ?? {}
  console.log(singleVehicleInfo,'singleVehicleInfo')
  console.log(advance_data,'advance_data')

  const [currentDateVbr, setCurrentDateVbr] = useState(''); /* Vendor Bill Reference Date */
  const [currentDateAbp, setCurrentDateAbp] = useState(''); /* Advance Payment Bank Posting Date */
  const [currentDateFp, setCurrentDateFp] = useState(''); /* Freight Posting Date */
  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [vehicleBody, setVehicleBody] = useState([])
  const [advanceLimit, setadvanceLimit] = useState([])
  // const [values, setValues] = useState([])
  const VEHICLE_TYPE_MAP = {
    21: 'Own',
    22: 'Hire',
  }
  useEffect(() => {
    Promise.all([
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(2),// Vehicle Capacity
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(1),// Vehicle Body Type
      // NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(3),// Vehicle Type
    ]).then(([cap, body, type]) => {
      setVehicleCapacity(cap.data.data || [])
      setVehicleBody(body.data.data || [])
      // setVehicleType(type.data.data || [])
      // setMastersLoaded(true)
    })
  }, [])
  const vehicleCapacityName = vehicleCapacity.find(
    (item) =>
      item.definition_list_id ===
      singleVehicleInfo?.vehicle_info?.vehicle_capacity_id
  )?.definition_list_name || '-'

  const vehicleBodyName = vehicleBody.find(
    (item) =>
      item.definition_list_id ===
      singleVehicleInfo?.vehicle_info?.vehicle_body_type_id
  )?.definition_list_name || '-'

  useEffect(() => {
    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(4)
      .then((res) => setadvanceLimit(res?.data?.data || []))
      .catch(() => setadvanceLimit([]))
  }, [])

  const getNumericCapacity = (capacityName) => {
    if (!capacityName) return 0
    return parseFloat(capacityName) || 0
  }


  const billedQty = Number(singleVehicleInfo?.vehicle_assignment?.[0]?.billed_qty || 0)

  const advancePercentage =
    advanceLimit?.find((item) => item.definition_list_status === 1)
      ?.definition_list_name || 0

  const totalFreightAmount = singleVehicleInfo?.tripsheet_info?.freight_approval_status == 2 ? Number(singleVehicleInfo?.tripsheet_info?.trip_updated_freight_rate || 0) * billedQty : Number(singleVehicleInfo?.tripsheet_info?.trip_freight_rate || 0) * billedQty

  const advanceEligible = (totalFreightAmount * Number(advancePercentage) / 100).toFixed(2)

  const balanceAmount = Number(totalFreightAmount) - Number(advanceEligible)
    
  console.log(billedQty, 'billedQty')
  console.log(singleVehicleInfo?.tripsheet_info?.trip_vehicle_route?.freight_rate, 'freight_rate')
  console.log(advancePercentage, 'advancePercentage')
  console.log(advanceEligible, 'advanceEligible')
  console.log(totalFreightAmount, 'totalFreightAmount')

  useEffect(() => {
    if (!isNaN(totalFreightAmount) && totalFreightAmount > 0) {
      handleChange({
        target: {
          name: 'actual_freight',
          value: Number(totalFreightAmount.toFixed(2)),
        },
      })
      setTotalFreightAmount(Number(totalFreightAmount.toFixed(2))) // ✅ now valid
    }
  }, [totalFreightAmount])

  useEffect(() => {
    // Set the current date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD'
    setCurrentDateVbr(formattedDate);
    setCurrentDateAbp(formattedDate);
    setCurrentDateFp(formattedDate);
    values.sap_invoice_posting_date = formattedDate
    values.bank_date = formattedDate
    values.supplier_posting_date = formattedDate
  }, []);

  useEffect(() => {
    if (singleVehicleInfo?.vendor_info?.vendor_code) {
      NlmtVendorOutstanding.getVendoroutstanding(singleVehicleInfo.vendor_info.vendor_code).then((res) => {

        const vos = res?.data?.[0]?.L_DMBTR || ''

        console.log(vos, 'L_DMBTR')

        setOutstanding(vos)

        handleChange({
          target: {
            name: 'driver_outstanding',
            value: vos,
          },
        })
      })
    }
  }, [singleVehicleInfo?.vendor_info?.vendor_code])


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
  const REQ = () => <span className="text-danger"> * </span>

  /* ===== User Inco Terms Declaration Start ===== */

  const [incoTermData, setIncoTermData] = useState([])

  useEffect(() => {

    /* section for getting Inco Term Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(16).then((response) => {

      let viewData = response.data.data
      console.log(viewData, 'Inco Term Lists')

      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          incoterm_id: data.definition_list_id,
          incoterm_name: data.definition_list_name,
          incoterm_code: data.definition_list_code,
        })
      })

      setIncoTermData(rowDataList_location)
    })

  }, [])

  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 5
      }}
    />
  )

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate();
  // console.log(Expense_Income_Posting_Date,'ExpenseIncomePostingDate')

  const [Balance, setBalance] = useState('')
  const [TotalValue, setTotalValue] = useState('')

  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      let tableData = response.data.data
      const filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setTaxType(filterData)
    })
  }, [])

  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(20).then((response) => {
      let tableData = response.data.data
      const filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setGstTaxType(filterData)
    })
  }, [])

  console.log(Balance)

  const [tdsMasterData, setTdsMasterData] = useState([])
  const [sapHsnData, setSapHsnData] = useState([])
  const [frpt1, setFrpt1] = useState('')

  useEffect(() => {
    /* section for getting Sap Hsn Data from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(27).then((response) => {
      console.log(response.data.data, 'DefinitionsListApi-setSapHsnData')
      setSapHsnData(response.data.data)
    })

    /* section for getting TDS Master Data from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      console.log(response.data.data, 'DefinitionsListApi-setTdsMasterData')
      let tableData = response.data.data
      let filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setTdsMasterData(filterData)
    })
  }, [])


  // const [mgiTime, setMgiTime] = useState('');

  const frptUpdate = (eve) => {
    let need_val = eve.target.value.replace(/\D/g, '')
    console.log(need_val)
    // values.frpt = need_val
    setFrpt1(need_val)
  }
  console.log(singleVehicleInfo, '001singleVehicleInfo')

  /* ====================Advance Form Web Cam Start ========================*/
  const webcamRef = React.useRef(null);
  const [fileuploaded, setFileuploaded] = useState(false)
  const [camEnable, setCamEnable] = useState(false)
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]); 
  /* ====================Advance Form Web Cam End ========================*/

  /* ==================== Advance Form Image ReSize Start ========================*/
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
      values.advance_form = file
      setFileuploaded(true)
    }
  } else {

    const image = await resizeFile(file);
    if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
      valueAppendToImage(image)
      setFileuploaded(true)
    } else {
      values.advance_form = file
      setFileuploaded(true)
    }
  }
  }

  function formatYMD(dateTime) {
    return dateTime ? dateTime.split(' ')[0] : '';
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

    values.advance_form = file
  }

  // will hold a reference for our real input file
  let inputFile = '';

  // function to trigger our input file click
  const uploadClick = e => {
    e.preventDefault();
    inputFile.click();
    return false;
  };

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {

    if(values.advance_form) {
      setFileuploaded(true)
    } else {
      setFileuploaded(false)
    }

  }, [values.advance_form])
  /* ==================== Advance Form Image ReSize End ========================*/

  return (
    <>
      <CRow>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="tripsheet_id">
            Trip Sheet Number
          </CFormLabel>
          <CFormInput
            size="sm"  
            value={singleVehicleInfo.tripsheet_info.nlmt_tripsheet_no} 
            type="text"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
          <CFormInput size="sm" id="vNum" value={singleVehicleInfo.vehicle_info.vehicle_number} readOnly />
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="shedName">Shed Name</CFormLabel>
          <CFormInput
            size="sm"
            id="shedName"
            value={singleVehicleInfo.vendor_info.nlmt_shed_info.shed_name}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="ownerMob">Shed Owner Mobile Number</CFormLabel>
          <CFormInput
            size="sm"
            id="ownerMob"
            value={singleVehicleInfo.vendor_info?.nlmt_shed_info?.shed_owner_phone_1 || singleVehicleInfo.vendor_info?.shed_info.shed_owner_phone_1}
            type="text"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="ownerName">Vendor Name</CFormLabel>
          <CFormInput
            size="sm"
            id="ownerName"
            type="text"
            value={singleVehicleInfo.vendor_info?.owner_name || singleVehicleInfo?.vendor_info?.owner_name}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vendor_code">
            Vendor Code / Mobile Number
          </CFormLabel>
          <CInputGroup>
            <CFormInput
              size="sm"
              name="vendor_code" 
              value={`${singleVehicleInfo.vendor_info.vendor_code} / ${singleVehicleInfo?.vendor_info?.owner_number}`}
              id="vendor_code"
              type="text"
              readOnly
            />
          </CInputGroup>
        </CCol>
        
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="ownerMob">Vendor PAN Number</CFormLabel>
          <CFormInput
            size="sm"
            id="ownerMob"
            value={singleVehicleInfo?.vendor_info?.pan_card_number || singleVehicleInfo?.vendor_info?.pan_card_number}
            type="text"
            readOnly
          />
        </CCol> 
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vCap">Vehicle Capacity</CFormLabel>
          <CFormInput
            size="sm"
            id="vCap"
            value={`${VEHICLE_TYPE_MAP[singleVehicleInfo?.vehicle_info?.vehicle_type_id] || '-'
              } / ${vehicleCapacityName || '-'
              } Mts / ${vehicleBodyName || '-'
              }`}
            readOnly
          />
        </CCol>


        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driver_outstanding">
            Vendor Current O/S in SAP
            {errors.driver_outstanding && (
              <span className="small text-danger">{errors.driver_outstanding}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            name="driver_outstanding" 
            value={values.driver_outstanding || 0} 
            id="driver_outstanding"
            type="text"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driverNameHire">Driver Name</CFormLabel>
          <CFormInput
            size="sm"
            id="driverNameHire"
            value={singleVehicleInfo.driver_name}
            readOnly
          />
        </CCol> 

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="gst_tax_type">GST Tax Type  
          </CFormLabel>
          <CFormSelect
            size="sm"
            id="gst_tax_type"
            name="gst_tax_type"
            value={advance_data ? advance_data.gst_tax_type : ''} 
            type="text"
            maxLength="6" 
            disabled
          >
            <option value="">Select...</option> 
            {GstTaxType.map(({ definition_list_code, definition_list_name }) => {
              return (
                <>
                  <option key={definition_list_code} value={definition_list_code}>
                    {definition_list_name}
                  </option>
                </>
              )
            })}
          </CFormSelect>
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vendor_hsn">
            HSN Code  
          </CFormLabel>
          <CFormSelect
            size="sm"
            name="vendor_hsn" 
            value={advance_data ? advance_data.vendor_hsn : ''} 
            aria-label="Small select example"
            disabled
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
          </CFormSelect>
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="sap_invoice_posting_date">
            Freight Posting Date  
             
          </CFormLabel>
          <CFormInput
            size="sm"
            type="date"
            name="sap_invoice_posting_date"
            id="sap_invoice_posting_date"
            value={advance_data ? formatYMD(advance_data.sap_invoice_posting_date) : ''} 
            readOnly
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onChange={handleChange}
            // value={values.sap_invoice_posting_date}
            // value={currentDateFp}
            // onChange={(e) => {
            //   setCurrentDateFp(e.target.value)
            //   values.sap_invoice_posting_date = e.target.value
            // }}
            // min={Expense_Income_Posting_Date.min_date}
            // max={Expense_Income_Posting_Date.max_date}
            // onKeyDown={(e) => {
            //   e.preventDefault();
            // }}
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="rjShedCopy">
            TDS Declaration Copy
          </CFormLabel>
          
          <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
            <span className="float-start">
              <a style={{color:'black'}} target='_blank' rel="noreferrer" href={singleVehicleInfo.vendor_info?.tds_dec_form_front}>
                <i className="fa fa-eye" aria-hidden="true">&nbsp;View</i>
              </a>
            </span> 
          </CButton> 

        </CCol>
        <CCol className="mb-3" md={3}>
          <CFormLabel htmlFor="vendor_tds">
            TDS Tax Type 
          </CFormLabel>
          <CFormSelect
            size="sm"
            id="vendor_tds" 
            name="vendor_tds"
            value={advance_data ? advance_data.vendor_tds : ''} 
            disabled
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
          </CFormSelect>
        </CCol>
        {/* <CCol xs={12} md={3}>
          <CFormLabel htmlFor="advance_payments">
            Advance Payment Banks <REQ />{' '}

          </CFormLabel>
          <CFormInput
            size="sm"
            type="number"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange1}
            value={values.advance_payments}
            name="advance_payments"
            id="advance_payments"
            maxLength={6}
          />
        </CCol> */}

        
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="bank_date">
            Advance Payment Bank Posting Date 
          </CFormLabel>
          <CFormInput
            size="sm"
            type="date"
            name="bank_date"
            id="bank_date"
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onChange={handleChange}
            value={advance_data ? formatYMD(advance_data.bank_date) : ''} 
            readOnly
            // value={currentDateAbp}
            // onChange={(e) => {
            //   setCurrentDateAbp(e.target.value)
            //   values.bank_date = e.target.value
            // }}
            // value={values.bank_date}
            // min={Expense_Income_Posting_Date.min_date}
            // max={Expense_Income_Posting_Date.max_date}
            // onKeyDown={(e) => {
            //   e.preventDefault();
            // }}
          />
        </CCol>
         
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="supplier_ref_no">Vendor Bill No/Reference
            {/* {errors.supplier_ref_no && (
              <span className="small text-danger">{errors.supplier_ref_no}</span>
            )} */}
          </CFormLabel>
          <CFormInput
            size="sm"
            id="supplier_ref_no"
            name="supplier_ref_no" 
            value={advance_data ? (advance_data.supplier_ref_no ? advance_data.supplier_ref_no : singleVehicleInfo.tripsheet_info.nlmt_tripsheet_no) : ''}
            type="text"
            // maxLength="50"
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onChange={handleChange}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="supplier_posting_date">Vendor Bill/Reference Date 
            
          </CFormLabel>
          <CFormInput
            size="sm"
            id="supplier_posting_date"
            name="supplier_posting_date"
            // value={values.supplier_posting_date}
            value={advance_data ? advance_data.supplier_posting_date : ''}
            // onChange={(e) => {
            //   setCurrentDateVbr(e.target.value)
            //   values.supplier_posting_date = e.target.value
            // }}
            type="date"
            // onFocus={onFocus}
            // onBlur={onBlur}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="remarks">Accounting Remarks<REQ /></CFormLabel>
          <CFormTextarea
            id="remarks"
            name="remarks"
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onChange={handleChangenew}
            // value={remarks}
            value={advance_data ? advance_data.remarks : ''}
            rows="1"
            maxLength={"50"}
            readOnly
          >
          </CFormTextarea>
        </CCol>

        
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="bank_remarks">Bank Payment Remarks<REQ /></CFormLabel>
          <CFormTextarea
            id="bank_remarks"
            name="bank_remarks"
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onChange={(e) => {
            //   e.target.value = e.target.value.toUpperCase()
            //   handleChange(e)               
            // }}
            value={advance_data ? advance_data.bank_remarks : ''}
            // onChange={handleChange}
            // value={values.bank_remarks}
            rows="1"
            maxLength={"50"}
            readOnly
          >
          </CFormTextarea>
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="rjShedCopy">
            Advance Attachment Copy
          </CFormLabel>
          
          <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
            <span className="float-start">
              <a style={{color:'black'}} target='_blank' rel="noreferrer" href={advance_data.advance_form}>
                <i className="fa fa-eye" aria-hidden="true">&nbsp;View</i>
              </a>
            </span> 
          </CButton> 

        </CCol>         
        
        <ColoredLine color="red" />

        <CRow className="mt-2" hidden>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="trip_route">
              Trip Route
              {errors.freight_rate_per_tone && (
                <span className="small text-danger">{errors.trip_route}</span>
              )}
            </CFormLabel>
            <CFormInput
              size="sm" 
              value={singleVehicleInfo.tripsheet_info.trip_vehicle_route.route_name}
              id="trip_route"
              name="trip_route"
              type="text"
              readOnly
            />
          </CCol>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="actual_freight">
              Actual Freight Per Ton 
            </CFormLabel>
            <CFormInput
              size="sm"
              value={singleVehicleInfo.tripsheet_info.trip_freight_rate}
              id="actual_freight"
              name="actual_freight"
              type="text"
              disabled 
            />
          </CCol>
          
          {singleVehicleInfo.tripsheet_info.freight_approval_status == 2 && (
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="trip_updated_freight_rate">
                Updated Freight Per Ton 
              </CFormLabel>
              <CFormInput
                size="sm"
                value={singleVehicleInfo.tripsheet_info.trip_updated_freight_rate}
                id="trip_updated_freight_rate"
                name="trip_updated_freight_rate"
                type="text"
                disabled 
              />
            </CCol>

          )}


          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="actual_freight">
              Shipment No / Billed Qty In MTS              
            </CFormLabel>
            <CFormInput
              size="sm"
              value={`${singleVehicleInfo?.vehicle_assignment?.[0]?.shipment_no || 0} / ${singleVehicleInfo?.vehicle_assignment?.[0]?.billed_net_qty || '-'
                }`}
              id="actual_freight"
              name="actual_freight"
              type="text"
              disabled
              maxLength={6}
            />
          </CCol>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="actual_freight">
              Total Freight Amount 
            </CFormLabel>
            <CFormInput
              size="sm"
              value={totalFreightAmount}
              id="actual_freight"
              name="actual_freight"
              type="text"
              disabled
              maxLength={6}
            />
          </CCol>

          <CCol md={3}>
            <CFormLabel>
              Advance Eligible {advancePercentage} %
            </CFormLabel>
            <CFormInput
              size="sm"
              type="text"
              value={advanceEligible}
              readOnly
            />
          </CCol>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="balance_amount">
              Balance Trip Amount
            </CFormLabel>
            <CFormInput
              size="sm"
              name="balance_amount"
              type="text"
              value = {balanceAmount || 0}
              id="income_freight"
              readOnly
            />
          </CCol>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="rejRemarks">Approval / Rejection Remarks<REQ /></CFormLabel>
            <CFormTextarea
              id="rejRemarks"
              name="rejRemarks"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChangenew1}
              value={rejRemarks}
              rows="1"
              maxLength={"50"}
            >
            </CFormTextarea>
          </CCol>
          
          {/* {(singleVehicleInfo.tripsheet_info.freight_approval_status == 0 || singleVehicleInfo.tripsheet_info.freight_approval_status == 2) && (
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="rejRemarks">Freight Rejection Remarks<REQ /></CFormLabel>
              <CFormTextarea
                id="rejRemarks"
                name="rejRemarks"
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChangenew1}
                value={rejRemarks}
                rows="1"
                maxLength={"50"}
              >
              </CFormTextarea>
            </CCol>
          )}   */}
        </CRow>
        <ColoredLine color="red" />
        
      </CRow>
      <CRow></CRow>
      <CRow></CRow>
    </>
  )
}

export default NlmtAdvanceCreationHire
