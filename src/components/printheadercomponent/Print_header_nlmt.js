import { CCol, CRow } from '@coreui/react'
import { React } from 'react'
import houseofnaga from 'src/assets/naga/houseofnaga.png'
import nagalogo from 'src/assets/naga/nagalogo.png'


const Print_header_nlmt = (type) => {
  const h1s = {
    fontFamily: 'timesnewroman',
    fontSize: '24px',
    fontWeight: 'bold'
  }

  const h2s = {
    display: 'block',
    fontFamily: 'timesnewroman',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '-10px'
  }

  const h2s1 = {
    display: 'block',
    fontFamily: 'timesnewroman',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '5px'
  }

  const h3s = {
    display: 'block',
    fontFamily: 'timesnewroman',
    fontSize: '10px',
    fontWeight: 'bold',
    marginTop: '-3px'
  }

  const h4s = {
    display: 'block',
    fontFamily: 'timesnewroman',
    fontSize: '10px',
    letterSpacing: '0.5px'
  }
  console.log(type, 'type-type')

  return (
    <>

      <div>
        {/* <table height="700" border="0" cellSpacing="0" cellPadding="4"> */}
        <tr>
          <td width={type.type ? "200" : "200"} align="left"><img src={houseofnaga} /></td>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            marginTop: "0px",      // Ensures it starts at the very top
  paddingTop: "0px",
            lineHeight: "1.1",// Needed if you want to position "Original for..." absolutely
            width: "100%"
          }}>
            <span style={{ ...h1s, fontWeight: "900", fontSize: "28px", display: "block" }}>
              NAGA LIMITED
            </span>

            <span style={{ ...h2s, fontWeight: "bold", fontSize: "18px", marginTop: "4px", display: "block" }}>
              MINERALS DIVISION
            </span>

            <span style={{ ...h4s, fontSize: "11px", display: "block" }}>
              Branch/Depot: NAGA LIMITED-MINERALS, PARCEL A AND B, V.O. CHIDAMBARANAR PORT
            </span>

            <span style={{ ...h4s, fontSize: "11px", display: "block" }}>
              TRUST, ROAD NO.138, TUTICORIN - 628004
            </span>

            {/* <span style={{ ...h4s, fontSize: "11px", display: "block" }}>
    FSSAI Lic No , Mob:
  </span> */}

            <span style={{ ...h4s, fontSize: "11px", display: "block" }}>
              GSTIN: 33AAACN2369L1ZD, PAN: AAACN2369L, CIN: U10611TN1991PLC020409, State Code-33
            </span>
            {/* <span style={h4s}>GSTIN:33AAACN2369L1ZD,PAN:AAACN2369L,CIN:U24246TN1991PLC02040,State Code-33</span> */}
            {/* <span style={h4s}>GSTIN:33AAACN2369L1ZD,PAN:AAACN2369L,CIN:U10611TN1991PLC020409,State Code-33</span> */}



          </div>
          {/* <td width="300" align="center"><img src={type.type ? NLIF_Details : NLIF} /></td> */}
          <td width="100" align="right"><img src={nagalogo} /></td>
        </tr>
        {/* </table> */}
      </div>
    </>
  )
}

export default Print_header_nlmt
