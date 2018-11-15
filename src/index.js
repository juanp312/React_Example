// Imports needed it
import ReactDOM from 'react-dom';
import update from 'immutability-helper';

// Const for the suitable working
const ReactDataGrid = require('react-data-grid');
const React = require('react');
const { Editors, Toolbar, Formatters } = require('react-data-grid-addons');

// Main component
class Example extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { rows: this.createRows(1)  };

    this._columns = [
        { key: 'risk_id', name: 'Identificador del Riesgo', editable: true },
        { key: 'risk', name: 'Riesgo',  editable: true },
        { key: 'code', name: 'Codigo',  editable: true },
        { key: 'procedure', name: 'Procedimiento',  editable: true },
        { key: 'description', name: 'Descripcion',  editable: true },
        { key: 'cause', name: 'Causa',  editable: true },
        { key: 'related_risks', name: 'Riesgos Asociados', editable: true },
        { key: 'risk_factors', name: 'Factores de Riesgo', editable: true }, ];

    this.createRows();  
      
}


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
        risk_factors: '',
      };
  }

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let rows = this.state.rows.slice();

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});
      rows[i] = updatedRow;
    }
    this.setState({ rows });
  };

  handleAddRow = ({ newRowIndex }) => {
    console.log(this.state.rows[0].risk);
    requestGet();
    console.log(JSON.stringify(this.state.rows));
    requestPost(this.state.rows);
    const newRow = {
      value: newRowIndex,
      userStory: '',
      developer: '',
      epic: ''
    };

    let rows = this.state.rows.slice();
    rows = update(rows, {$push: [newRow]});
    this.setState({ rows });
  };

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
      <ReactDataGrid
        enableCellSelect={true}
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        minHeight={500}
        onGridRowsUpdated={this.handleGridRowsUpdated}
        toolbar={<Toolbar onAddRow={this.handleAddRow}/>} />);
  }
}

async function requestGet() {
  try {
    const urlVendor = 'http://localhost:8080/shop/vendors/';
    let response = await fetch(urlVendor, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    let responseJson = await response.json();
    console.log(responseJson)
    return responseJson.result;
  } catch(error) {

  }
}


async function requestPost(params) {
  try {
    const urlVendor = 'http://localhost:8080/shop/vendors/';
    let response = await fetch(urlVendor, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params[0])    
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
  