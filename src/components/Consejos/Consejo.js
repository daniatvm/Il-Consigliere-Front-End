import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Convocados from './Convocados';
import Navegacion from '../Navegacion/Navegacion';
import auth from '../../helpers/auth';
import DefaultComponent from '../../helpers/DefaultComponent';
import { Loading } from '../../helpers/Loading';
import './Consejos.css';

export default class Consejos extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      consecutivo: this.props.match.params.consecutivo,
      consejo: {},
      solicitudes: [],
      aprobados: [],
      punto: '',
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
                  isLoading: false,
                  consejo: res.data.council
                });
                axios.get(`/punto/aprobado/${this.state.consecutivo}`)
                  .then(resp => {
                    if (resp.data.success) {
                      this.setState({
                        aprobados: resp.data.discussions
                      });
                    }
                  })
                  .catch((err) => console.log(err));
              } else {
                this.setState({
                  isLoading: false,
                  encontrado: false
                });
              }
            })
            .catch((err) => console.log(err));
          this.getRequestsFromBD();
        } else {
          this.setState({
            redirect: true
          })
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
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
      auth.verifyToken()
        .then(value => {
          if (value) {
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
          } else {
            this.setState({
              redirect: true
            })
            auth.logOut();
          }
        })
        .catch((err) => console.log(err));
    }
  }

  getDiscussions() {
    const discussions = [];
    for (let i = 0; i < this.state.aprobados.length; i++) {
      discussions.push(<li className='m-0 text-justify' key={i}>{this.state.aprobados[i].asunto}</li>);
    }
    return discussions;
  }

  getRequests() {
    const requests = [];
    for (let i = 0; i < this.state.solicitudes.length; i++) {
      requests.push(<li className='m-0 text-justify' key={i}>{this.state.solicitudes[i].asunto}</li>);
    }
    return requests;
  }

  render() {
    return (this.state.isLoading ? <Loading /> : this.state.redirect ? <Redirect to='/' /> : !this.state.encontrado ? <DefaultComponent /> :
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
                    <Convocados consecutivo={this.state.consecutivo} />
                  </div>
                  <div className='registro-container der'>
                    <div className='puntos-conrainer'>
                      <p>Puntos de Agenda:</p>
                      <div className='punto-container'>
                        <ol className='pl-3'>
                          {this.getDiscussions()}
                        </ol>
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
                          <ol className='pl-3'>
                            {this.getRequests()}
                          </ol>
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
    );
  }
}
