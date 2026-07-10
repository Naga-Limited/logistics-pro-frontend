import { React, useState,useEffect } from 'react'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CFormLabel,
  CWidgetStatsB,
  CInputGroup,
  CFormInput,
  CInputGroupText
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import DashboardService from 'src/Service/Dashboard/DashboardService'

const WidgetsDropdown = () => {

    const [opencount, setOpencount] = useState(false)

    useEffect(() => {
      DashboardService.getDashboardDetails().then((res) => {
        console.log(res.data)
        setOpencount(res.data)
        })
    },[])
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  return (
    <CRow>
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          className="mb-1"
          color="primary"
          style={{paddingBottom:15}}
          value={
            <>
            <div>
            <CInputGroup style={{color:'white'}}>
            <CInputGroupText style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                  }}>
            TripSheet Count -
            <CFormInput value={formatter.format(
                        isFinite(Number(opencount.TripSheet_Own)+Number(opencount.TripSheet_Hire))?(Number(opencount.TripSheet_Own)+Number(opencount.TripSheet_Hire)):0)} style={{color:'white',backgroundColor:'#4d3227',border:'#4d3227'}}/>
            <span>(<CIcon icon={cilArrowBottom} />)</span>
            </CInputGroupText>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '75%',
                  }}>Own & Contract</CInputGroupText><CFormInput readOnly value={opencount.TripSheet_Own} style={{color:'white',backgroundColor:'#4d3227'}}/>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '75%',
                  }}>Hire</CInputGroupText><CFormInput readOnly value={opencount.TripSheet_Hire} style={{color:'white',backgroundColor:'#4d3227'}}/>
            </CInputGroup>
            </div>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          className="mb-1"
          color="info"
          style={{paddingBottom:15}}
          value={
            <>
            <CInputGroup className="bg-info text-dark" >
            <CInputGroupText className="bg-info text-dark" style={{borderColor:'black'}}>
            Shipment Count -
            <CFormInput readOnly value={formatter.format(
                        isFinite(Number(opencount.Vehicle_Assignment_Own)+Number(opencount.Vehicle_Assignment_Hire))?(Number(opencount.Vehicle_Assignment_Own)+Number(opencount.Vehicle_Assignment_Hire)):0)} className="bg-info text-dark"style={{border:'hidden'}} />
            <span>(<CIcon icon={cilArrowBottom} />)</span>

            </CInputGroupText>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText className="bg-info text-dark" style={{
                            width: '75%',borderColor:'black'
                  }}>Own & Contract</CInputGroupText><CFormInput readOnly value={opencount.Vehicle_Assignment_Own}className="bg-info text-dark"style={{borderColor:'black'}}/>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText className="bg-info text-dark" style={{width: '75%',borderColor:'black'}}>Hire</CInputGroupText><CFormInput readOnly value={opencount.Vehicle_Assignment_Hire} className="bg-info text-dark"style={{borderColor:'black'}}/>
            </CInputGroup>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          className="mb-4"
          color="warning"
          style={{paddingBottom:15}}
          value={
            <>
            <CInputGroup style={{color:'white'}}>
            <CInputGroupText style={{
                    backgroundColor: 'dodgerblue',
                    color: 'white',
                  }}>
            Advance Count -
            <CFormInput readOnly value={formatter.format(
                        isFinite(Number(opencount.Advance_Own)+Number(opencount.Advance_Hire))?(Number(opencount.Advance_Own)+Number(opencount.Advance_Hire)):0)} style={{color:'white',backgroundColor:'dodgerblue',border:'#4d3227'}}/>
            <span>(<CIcon icon={cilArrowBottom} />)</span>
            </CInputGroupText>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText style={{
                    backgroundColor: 'dodgerblue',
                    color: 'white',
                    width: '75%',
                  }}>Own & Contract</CInputGroupText><CFormInput readOnly value={opencount.Advance_Own} style={{color:'white',backgroundColor:'dodgerblue'}}/>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText style={{
                    backgroundColor: 'dodgerblue',
                    color: 'white',
                    width: '75%',
                  }}>Hire</CInputGroupText><CFormInput readOnly value={opencount.Advance_Hire} style={{color:'white',backgroundColor:'dodgerblue'}}/>
            </CInputGroup>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          className="mb-2 bg-danger text-white gradient"
          style={{paddingBottom:15}}
          value={
            <>
            <CInputGroup  className="bg-danger text-white gradient" style={{color:'white'}}>
            <CInputGroupText  className="bg-danger text-white gradient" style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                  }}>
            Diesel Intent -
            <CFormInput readOnly value={formatter.format(
                        isFinite(Number(opencount.Diesel_Own)+Number(opencount.Diesel_Hire))?(Number(opencount.Diesel_Own)+Number(opencount.Diesel_Hire)):0)}  className="bg-danger text-white gradient" style={{color:'white',backgroundColor:'#4d3227',border:'#4d3227'}}/>
            <span>(<CIcon icon={cilArrowBottom} />)</span>
            </CInputGroupText>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText  className="bg-danger text-white gradient" style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '75%',
                  }}>Own & Contract</CInputGroupText><CFormInput readOnly value={opencount.Diesel_Own}  className="bg-danger text-white gradient" style={{color:'white',backgroundColor:'#4d3227'}}/>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText  className="bg-danger text-white gradient" style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '75%',
                  }}>Hire</CInputGroupText><CFormInput readOnly value={opencount.Diesel_Hire}  className="bg-danger text-white gradient" style={{color:'white',backgroundColor:'#4d3227'}}/>
            </CInputGroup>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          // className="mb-2 bg-yellow text-white"
          style={{paddingBottom:15,backgroundColor: '#ffa500'}}
          value={
            <>
            <CInputGroup  style={{color:'white'}}>
            <CInputGroupText  className="bg-yellow text-white" style={{
                    backgroundColor: ' #ffa500',
                    color: 'white',
                  }}>
            Trip Expense Closure -
            <CFormInput readOnly value={formatter.format(
                        isFinite(Number(Number(opencount.Trip_closure_Own)+Number(opencount.Trip_closure_Hire)))?(Number(Number(opencount.Trip_closure_Own)+Number(opencount.Trip_closure_Hire))):0)} style={{color:'white',backgroundColor:'#ffa500',border:'#ffa500'}}/>
            <span>(<CIcon icon={cilArrowBottom} />)</span>
            </CInputGroupText>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText style={{
                    backgroundColor: '#ffa500',
                    color: 'white',
                    width: '75%',
                  }}>Own & Contract</CInputGroupText><CFormInput readOnly value={opencount.Trip_closure_Own} style={{color:'white',backgroundColor:'#ffa500'}}/>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText style={{
                    backgroundColor: '#ffa500',
                    color: 'white',
                    width: '75%',
                  }}>Hire</CInputGroupText><CFormInput readOnly value={opencount.Trip_closure_Hire} style={{color:'white',backgroundColor:'#ffa500'}}/>
            </CInputGroup>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          // className="mb-2 bg-yellow text-white"
          style={{paddingBottom:15,backgroundColor: '#ff66cc'}}
          value={
            <>
            <CInputGroup  style={{color:'white'}}>
            <CInputGroupText  className="bg-yellow text-white" style={{
                    backgroundColor: ' #ff66cc',
                    color: 'white',
                  }}>
            Trip Income Closure -
            <CFormInput readOnly value={formatter.format(
                        isFinite(Number(Number(opencount.Trip_closure_Income_Own)+Number(opencount.Trip_closure_Income_Hire)))?(Number(Number(opencount.Trip_closure_Income_Own)+Number(opencount.Trip_closure_Income_Hire))):0)} style={{color:'white',backgroundColor:'#ff66cc',border:'#ff66cc'}}/>
            <span>(<CIcon icon={cilArrowBottom} />)</span>
            </CInputGroupText>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText style={{
                    backgroundColor: '#ff66cc',
                    color: 'white',
                    width: '75%',
                  }}>Own & Contract</CInputGroupText><CFormInput readOnly value={opencount.Trip_closure_Income_Own} style={{color:'white',backgroundColor:'#ff66cc'}}/>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText style={{
                    backgroundColor: '#ff66cc',
                    color: 'white',
                    width: '75%',
                  }}>Hire</CInputGroupText><CFormInput readOnly value={opencount.Trip_closure_Income_Hire} style={{color:'white',backgroundColor:'#ff66cc'}}/>
            </CInputGroup>
            </>
          }
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsA
          className="mb-1"
          color='success'
          style={{paddingBottom:15}}
          value={
            <>
            <CInputGroup  className="bg-success text-white" style={{color:'white'}}>
            <CInputGroupText  className="bg-success text-white" style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                  }}>
            Trip Settlement -
            <CFormInput readOnly value={formatter.format(
                        isFinite(Number(opencount.Trip_Settlement_Own)+Number(opencount.Trip_Settlement_Hire))?(Number(opencount.Trip_Settlement_Own)+Number(opencount.Trip_Settlement_Hire)):0)}  className="bg-success text-white" style={{color:'white',backgroundColor:'#4d3227',border:'#4d3227'}}/>
            <span>(<CIcon icon={cilArrowBottom} />)</span>
            </CInputGroupText>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText  className="bg-success text-white" style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '75%',
                  }}>Own & Contract</CInputGroupText><CFormInput readOnly value={opencount.Trip_Settlement_Own}  className="bg-success text-white" style={{color:'white',backgroundColor:'#4d3227'}}/>
            </CInputGroup>
            <CInputGroup>
            <CInputGroupText  className="bg-success text-white" style={{
                    backgroundColor: '#4d3227',
                    color: 'white',
                    width: '75%',
                  }}>Hire</CInputGroupText><CFormInput readOnly value={opencount.Trip_Settlement_Hire}  className="bg-success text-white" style={{color:'white',backgroundColor:'#4d3227'}}/>
            </CInputGroup>
            </>
          }
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
