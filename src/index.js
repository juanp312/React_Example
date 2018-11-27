// Imports needed it
import ReactDOM from 'react-dom';
import update from 'immutability-helper';
import { Button } from 'reactstrap';

// Const for the suitable working
const ReactDataGrid = require('react-data-grid');
const React = require('react');
const { Editors, Toolbar, Formatters } = require('react-data-grid-addons');

// Main component
class Example extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { rows: this.createRows()  };
    this._columns = this.createColums();
      
}

  createColums = () => {
    return [
      { key: 'risk_id', name: 'Consecutivo del Riesgo', editable: true },
      { key: 'code', name: 'Codigo',  editable: true },
      { key: 'procedure', name: 'Proceso',  editable: true },
      { key: 'risk', name: 'Riesgo',  editable: true },        
      { key: 'description', name: 'Descripcion',  editable: true },
      { key: 'cause', name: 'Causa',  editable: true },
      { key: 'legal_risk', name: 'R. Legal', editable: true },
      { key: 'operative_risk', name: 'R. Operativo', editable: true },
      { key: 'contagious_risk', name: 'R. de Contagio', editable: true },
      { key: 'reputational_risk', name: 'R. Reputacional', editable: true },
      { key: 'risk_client', name: 'Clientes/Asociados', editable: true },
      { key: 'risk_products', name: 'Productos', editable: true },
      { key: 'risk_distribution', name: 'Canales de Distribucion', editable: true },
      { key: 'risk_jurisdiction', name: 'Jurisdiccion', editable: true } ];
  };

  createRows = (numberOfRows) => {
    let rows = [];
    let i;
    for(i = 0; i < numberOfRows; i++ ) {
       rows[i] = this.createRowByOne()
    }
    return rows;
  };

  createRowByOne = () => {
     return {
        risk_id: '',
        risk: '',
        code: '',
        procedure: '',
        description: '',
        cause: '',
        related_risks: '',
        legal_risk: '',
        operative_risk: '',
        contagious_risk: '',
        reputational_risk: '',
        risk_factors: '',
      };
  }

  createRowByOneWithDate = (information) => {
    return {
       risk_id: information.risk_id,
       risk: information.risk,
       code: information.code,
       procedure: information.procedure,
       description: information.description,
       cause: information.cause,
       related_risks: information.related_risks,
       legal_risk: information.legal_risk,
       operative_risk: information.operative_risk,
       contagious_risk: information.contagious_risk,
       reputational_risk: information.reputational_risk,
       risk_factors: information.risk_factors
     };
 }

  restoreInformation = () => {
    console.log("Im in the restore information");
    try {
      const urlVendor = 'http://localhost:8080/identification/';
      fetch(urlVendor, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(data => {
          console.log(data);
          if(data.length === 0) {
            alert("There is no value to return");
          } else {
          let rows = this.state.rows.slice();
          console.log("Im in the show");
          for (let index = 0; index < data.length; index++) {
            console.log("This is the index " + index);
            const newRow = this.createRowByOneWithDate(data[index]);
            rows = update(rows, {$push: [newRow]});
          }
          this.setState({ rows });
        }
        });
    } catch(error) {
      console.log("There was a error?" + error)
    }
  };

  addArrow = () => {
    console.log("Im in the addArrow");
    const newRow = this.createRowByOne();
    let rows = this.state.rows.slice();
    rows = update(rows, {$push: [newRow]});
    this.setState({ rows });
  };

  saveInformation = () => {
    console.log("Save information");
    for (let index = 0; index < this.state.rows.length; index++) {
      requestPost(this.state.rows[index]);
    }
  }

  getRowAt = (index) => {
    if (index < 0 || index > this.getSize()) {
      return undefined;
    }
    return this.state.rows[index];
  };

  
  getSize = () => {
    return this.state.rows.length;
  };

  rowGetter = (i) => {
    return this.state.rows[i];
  };


  render() {
    return  (
      <div>
        <Button color="primary" size="lg" onClick={() => this.addArrow()}>Add Row</Button>
        <Button color="secondary" size="lg" onClick={() => this.restoreInformation()}>Restore Information</Button>
        <Button color="primary" size="lg" onClick={() => this.saveInformation()}>Save Information</Button>
        <ReactDataGrid
          enableCellSelect={true}
          columns={this._columns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={500}
          onGridRowsUpdated={this.handleGridRowsUpdated} 
        />
      </div>
      );
  }
}

async function requestGet() {
  try {
    const urlVendor = 'http://localhost:8080/identification/';
    await fetch(urlVendor, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => this.showInformationInTable(data));
  } catch(error) {
    console.log("There was a error?" + error)
  }
}


async function requestPost(params) {
  try {
    const urlVendor = 'http://localhost:8080/identification/';
    let response = await fetch(urlVendor, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)    
    });
    let responseJson = await response.json();
    console.log(responseJson)
    return responseJson.result;
  } catch(error) {

  }

}



    ReactDOM.render(
        <Example/>,
        document.getElementById('root')
    );
  