import React, { useState } from "react";
import { read, utils, writeFile } from 'xlsx';
import CustomTable from 'src/components/customComponent/CustomTable'

const FreightMasterTableImport = () => {
    const [freights, setFreights] = useState([]);

    const handleImport = ($event) => {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    setFreights(rows)
                }
               // console.log(freights)
            }
            reader.readAsArrayBuffer(file);
        }
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

    const handleExport = () => {
        const headings = [[

            'customer_name',
            'customer_code',
            'customer_type',
            'location_id',
            'type',
            'freight_rate',
            'start_date',
            'end_date'
        ]];
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, freights, { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Logisticspro_Master.xlsx');
    }

    return (
        <>
            <div className="row mb-2 mt-5">
                <div className="col-sm-6 offset-3">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="input-group">
                                <div className="custom-file">
                                    <input type="file" name="file" className="custom-file-input" id="inputGroupFile" required onChange={handleImport}
                                        accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                                    <label className="custom-file-label" htmlFor="inputGroupFile"></label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <button onClick={handleExport} className="btn btn-primary float-right">
                                Export <i className="fa fa-download"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Customer Name</th>
                                <th scope="col">Customer Code</th>
                                <th scope="col">Customer Type</th>
                                <th scope="col">Location</th>
                                <th scope="col">Sales Type</th>
                                <th scope="col">Freight Rate</th>
                                <th scope="col">Start Date</th>
                                {/* <th scope="col">end_date</th> */}

                            </tr>
                        </thead>
                        <tbody>
                                {
                                    freights.length
                                    ?
                                    freights.map((freight, index) => (

                                        <tr key={index}>
                                            {/* <span>{ (new Date(freight.start_date)).toLocaleDateString() }</span>
                                            <span>{ (new Date(freight.end_date)).toLocaleDateString() }</span> */}
                                            <th scope="row">{ index + 1 }</th>
                                            <td>{ freight.customer_name }</td>
                                            <td>{ freight.customer_code }</td>
                                            <td>{ freight.customer_type }</td>
                                            <td>{ freight.location_id }</td>
                                            <td>{ freight.type }</td>
                                            <td>{ freight.freight_rate }</td>.
                                             <td> <span>{ (new Date(freight.start_date)).toLocaleDateString() }</span></td>
                                            {/* <td> <span>{ (new Date(freight.end_date)).toLocaleDateString() }</span></td> */}
                                            {/* <td>{ freight.start_date}</td>
                                            <td>{ freight.end_date }</td> */}
                                           {/* <td><span className="badge bg-warning text-dark">{ freight.Rating }</span></td> */}
                                        </tr>
                                    ))
                                    :

                                    <tr>
                                        <td colSpan="8" className="text-center">No Freight Rate Found.</td>
                                    </tr>
                                }
                        </tbody>
                    </table>
                </div>
            </div>

        </>


    );
};

export default FreightMasterTableImport;
