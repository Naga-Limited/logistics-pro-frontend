import { CCol, CRow } from '@coreui/react'
import { React } from 'react'
import houseofnaga from 'src/assets/naga/houseofnaga.png'
import nagalogo from 'src/assets/naga/nagalogo.png'


const Print_header_ifoods = (type) => {
  const h1s = {
    fontFamily:'timesnewroman',
    fontSize:'24px',
    fontWeight:'bold'
  }
  
  const h2s = {
    display:'block',
    fontFamily:'timesnewroman',
    fontSize:'12px',
    fontWeight:'bold',
    marginTop:'-10px'
  }
  
  const h2s1 = {
    display:'block',
    fontFamily:'timesnewroman',
    fontSize:'12px',
    fontWeight:'bold',
    marginTop:'5px'
  }
  
  const h3s = {
    display:'block',
    fontFamily:'timesnewroman',
    fontSize:'10px',
    fontWeight:'bold',
    marginTop:'-3px'
  }
  
  const h4s = {
    display:'block',
    fontFamily:'timesnewroman',
    fontSize:'10px',
    letterSpacing:'0.5px'
  }
  console.log(type,'type-type')
  
  return (
    <>
    
    <div>
        {/* <table height="700" border="0" cellSpacing="0" cellPadding="4"> */}
        <tr>
            <td width={type.type ? "130" : "180"} align="left"><img src={houseofnaga} /></td>
            <div style={{align:"center"}}>
                          <span style={h1s}>NAGA LIMITED</span>
                         
                            <>
                              <span style={h2s}>INNOVATIVE FOODS DIVISION</span>
                              <span style={h3s}>FSSAI No 12421999000536</span>
                              <span style={h4s}>Branch/Depot:NAGA LIMITED ,NO.4/213,PUTHUPATTI VILLAGE, ,PADIYUR,DINDIGUL-624005</span>
                              <span style={h4s}>Ph:, Mo:, Fax:0451-2410122</span>
                              {/* <span style={h4s}>GSTIN:33AAACN2369L1ZD,PAN:AAACN2369L,CIN:U24246TN1991PLC02040,State Code-33</span> */}
                              <span style={h4s}>GSTIN:33AAACN2369L1ZD,PAN:AAACN2369L,CIN:U10611TN1991PLC020409,State Code-33</span>
                            </>
                        
                      
                        </div>
          {/* <td width="300" align="center"><img src={type.type ? NLIF_Details : NLIF} /></td> */}
          <td width="100" align="right"><img src={nagalogo} /></td>
          </tr>
        {/* </table> */}
      </div>
    </>
  )
}

export default Print_header_ifoods
