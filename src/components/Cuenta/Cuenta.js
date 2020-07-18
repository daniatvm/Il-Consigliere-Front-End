import React, { Component } from 'react';
import Navegacion from '../Navegacion/Navegacion';
import AdministrarCorreo from './AdministrarCorreo';
import CambioClave from './CambioClave';
import auth from '../../helpers/auth';
import './Cuenta.css';

export default class Cuenta extends Component {
  constructor(props) {
    super(props);

    const info = auth.getInfo();
    this.state = {
      cedula: info.cedula,
      nombre: info.nombre,
      apellido: info.apellido
    }
  }

  render() {
    return (
      <>
        <Navegacion />
        <div className="row m-0 my-row">
          <div className="col-md-5 m-auto">
            <div className="card border-primary">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">Mi Información</h4>
                <p>Cédula: {this.state.cedula}</p>
                <p>Nombre: {this.state.nombre}</p>
                <p>Apellido: {this.state.apellido}</p>
                <hr />
                <CambioClave />
              </div>
            </div>
          </div>
          <div className="col-md-7 h-auto">
            <AdministrarCorreo />
          </div>
        </div>
      </>
    );
  }
}