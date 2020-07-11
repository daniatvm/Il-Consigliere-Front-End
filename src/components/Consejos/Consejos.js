import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import Navegacion from '../Navegacion/Navegacion';
import auth from '../../helpers/auth';
import { getTodaysDate } from '../../helpers/todaysDate';

export default class Consejos extends Component {
  constructor(props) {
    super(props);
    const info = auth.getInfo()
    this.state = {
      cedula: info.cedula,
      nombre: info.nombre,
      apellido: info.apellido,
      consejos: [],
      redirect: false
    }
  }

  componentDidMount() {
    this.getCouncils();
  }

  getCouncils() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get(`/consejo/por_usuario/${this.state.cedula}/${getTodaysDate()}`)
            .then(res => {
              if (res.data.success) {
                this.setState({
                  consejos: res.data.councils
                });
              }
            })
            .catch((err) => console.log(err));
        } else {
          this.setState({
            redirect: true
          })
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
  }

  councilList() {
    const councils = [];
    for (let i = 0; i < this.state.consejos.length; i++) {
      let consejo = this.state.consejos[i];
      let consecutivo = consejo.consecutivo;
      let institucion = consejo.institucion;
      let escuela = consejo.escuela;
      let nombre_consejo = consejo.nombre_consejo;
      let lugar = consejo.lugar;
      let fecha = consejo.fecha;
      let hora = consejo.hora;
      let id_tipo_sesion = consejo.id_tipo_sesion;
      councils.push(
        <div className="col-md-4 fila-mis-consejos" key={i}>
          <div className="card border-primary mb-3">
            <div className="card-body">
              <div className='d-flex justify-content-between align-items-center'>
                <p className="card-title m-0">{institucion}</p>
                <Link to={`/consejos/${consecutivo}`}><i className="far fa-eye fa-lg ml-2" style={{ color: "navy" }}></i></Link>
              </div>
              <p className='m-0'>{escuela}</p>
              <p className='m-0'>{nombre_consejo}</p>
              <p className='m-0'>Sesión {id_tipo_sesion === 1 ? 'Ordinaria' : 'Extraordinaria'} {consecutivo}</p>
              <p className='m-0'>Lugar: {lugar}</p>
              <p className='m-0'>Fecha: {fecha}</p>
              <p className='m-0'>Hora: {hora}</p>
            </div>
          </div>
        </div>
      );
    }
    return councils;
  }

  render() {
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <Navegacion />
        <div className='container'>
          <h3>Il Consigliere</h3>
          <p className='lead mt-2'>Te damos la bienvenida {this.state.nombre} {this.state.apellido}</p>
          {this.state.consejos.length > 0 && <p className='text-center lead'>Consejos a los que te han convocado:</p>}
        </div>
        <div className="row m-0 mt-4">
          {this.state.consejos.length === 0 ? <p className='my-muted'>No tienes consejos próximos a asistir.</p> : this.councilList()}
        </div>
      </>
    );
  }
}