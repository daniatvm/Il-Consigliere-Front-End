import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Navegacion from '../Navegacion/Navegacion';
import auth from '../../helpers/auth';
import DefaultComponent from '../../helpers/DefaultComponent';
import './RegistroConsejos.css';

export default class Consejos extends Component {

  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.match.params.consecutivo,
      consejo: {},
      solicitudes: [],
      aprobados: [],
      punto: '',
      convocados: [],
      cedula: auth.getInfo().cedula,
      encontrado: true,
      redirect: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get(`/consejo/${this.state.consecutivo}`)
            .then(res => {
              if (res.data.success) {
                this.setState({
                  consejo: res.data.council
                });
                axios.get(`/convocado/nombres_usuario/${this.state.consecutivo}`)
                  .then(resp => {
                    if (resp.data.success) {
                      this.setState({
                        convocados: resp.data.convocados
                      });
                    }
                  })
                  .catch((err) => console.log(err));
                axios.get(`/punto/por_consejo/${this.state.consecutivo}`)
                  .then(resp => {
                    if (resp.data.success) {
                      const aprobados = [];
                      for (let i = 0; i < resp.data.discussions.length; i++) {
                        let punto = resp.data.discussions[i];
                        if (punto.descripcion === 'aceptado') {
                          aprobados.push(punto);
                        }
                      }
                      this.setState({
                        aprobados: aprobados
                      });
                    }
                  })
                  .catch((err) => console.log(err));
              } else {
                this.setState({
                  encontrado: false
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
    this.getRequestsFromBD();
  }

  getRequestsFromBD() {
    axios.get(`/punto/solicitud/${this.state.cedula}/${this.state.consecutivo}`)
      .then(res => {
        if (res.data.success) {
          this.setState({
            solicitudes: res.data.discussions
          });
        }
      })
      .catch((err) => console.log(err));
  }

  handleInputChange(e) {
    this.setState({
      punto: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.punto !== '') {
      const info = {
        id_tipo_punto: 2,
        asunto: this.state.punto,
        cedula: this.state.cedula,
        consecutivo: this.state.consecutivo
      };
      axios.post('/punto', info)
        .then(res => {
          if (res.data.success) {
            this.getRequestsFromBD();
          }
        })
        .catch((err) => console.log(err));
    }
  }

  getAttendants() {
    const attendants = [];
    for (let i = 0; i < this.state.convocados.length; i++) {
      attendants.push(<p className='m-0' key={i}>{this.state.convocados[i].nombre} {this.state.convocados[i].apellido}</p>);
    }
    return attendants;
  }

  getDiscussions() {
    const discussions = [];
    for (let i = 0; i < this.state.aprobados.length; i++) {
      discussions.push(<p className='m-0 text-justify' key={i}>{(i + 1) + '. ' + this.state.aprobados[i].asunto}</p>);
    }
    return discussions;
  }

  getRequests() {
    const requests = [];
    for (let i = 0; i < this.state.solicitudes.length; i++) {
      requests.push(<p className='m-0 text-justify' key={i}>{(i + 1) + '. ' + this.state.solicitudes[i].asunto}</p>);
    }
    return requests;
  }

  render() {
    return (this.state.redirect ? <Redirect to='/' /> : !this.state.encontrado ? <DefaultComponent /> :
      <>
        <Navegacion />
        <div className="row m-0">
          <div className="col-md-10 m-auto">
            <div className="card border-primary consejo-card">
              <div className="card-body">
                <div className='todo-registro'>
                  <div className='registro-container izq'>
                    <p className="card-title text-center text-uppercase m-0">{this.state.consejo.institucion}</p>
                    <p className='text-uppercase text-center m-0'>{this.state.consejo.escuela}</p>
                    <p className='text-uppercase text-center m-0'>Convocatoria</p>
                    <p className='text-uppercase text-center m-0'>Sesión {this.state.consejo.id_tipo_sesion === 1 ? 'Ordinaria' : 'Extraordinaria'} {this.state.consecutivo}</p>
                    <p className='text-uppercase text-center m-0'>{this.state.consejo.nombre_consejo}</p>
                    <p className='text-center m-0'>FECHA: {this.state.consejo.fecha}</p>
                    <p className='text-center m-0'>HORA: {this.state.consejo.hora}</p>
                    <p className='text-center m-0'>LUGAR: {this.state.consejo.lugar}</p>
                    <hr />
                    <p>Personas convocadas al consejo:</p>
                    <div className='punto-container'>
                      {this.getAttendants()}
                    </div>
                  </div>
                  <div className='registro-container der'>
                    <div className='puntos-conrainer'>
                      <p>Puntos de Agenda:</p>
                      <div className='punto-container'>
                        {this.getDiscussions()}
                      </div>
                      <p>Solicita puntos de agenda</p>
                      <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                          <div className='d-flex align-items-center'>
                            <textarea placeholder='Punto de agenda (opcional)' maxLength="800" name='punto' className="form-control mr-2" onChange={this.handleInputChange} value={this.state.punto} />
                            <i className="fas fa-plus-square my-icon fa-lg" onClick={(e) => this.handleSubmit(e)} />
                          </div>
                        </div>
                        <div className='solicitud-container'>
                          {this.getRequests()}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}