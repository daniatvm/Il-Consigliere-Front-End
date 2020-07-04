import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Navegacion from '../Navegacion/Navegacion';
import axios from 'axios';
import auth from '../../helpers/auth';
import { myAlert } from '../../helpers/alert';
import './RegistroConsejos.css';

const puntos = [];

export default class RegistroConsejos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consecutivo: '',
      lugar: '',
      fecha: '',
      hora: '',
      hoy: this.getTodaysDate(),
      tipoSesion: [],
      sesionSeleccionada: 1,
      punto: '',
      updatePuntos: false,
      redirect: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addDiscussion = this.addDiscussion.bind(this);
  }

  componentDidMount() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get('/tipo_consejo')
            .then(res => {
              if (res.data.success) {
                this.setState({
                  tipoSesion: res.data.councilTypes
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

  getTodaysDate() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

  handleInputChange(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState({
      [name]: value
    });
  }

  handleOptionChange(e) {
    this.setState({
      sesionSeleccionada: e.target.value
    });
  }

  addDiscussion(e) {
    e.preventDefault();
    if (this.state.punto !== '') {
      puntos.push(this.state.punto);
      this.setState({
        punto: ''
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get(`/consejo/${this.state.consecutivo}`)
            .then(resp => {
              if (resp.data.success) {
                myAlert('Atención', `El número de consecutivo: ${this.state.consecutivo} ya existe en el sistema.`, 'warning');
              } else {
                const consejo = {
                  consecutivo: this.state.consecutivo,
                  lugar: this.state.lugar,
                  fecha: this.state.fecha,
                  hora: this.state.hora,
                  id_tipo_sesion: this.state.sesionSeleccionada,
                  puntos: puntos
                };
                axios.post('/consejo', consejo)
                  .then(res => {
                    if (res.data.success) {
                      this.props.history.push('/consejos');
                    } else {
                      myAlert('Oh no!', 'Error interno del servidor.', 'error');
                    }
                  })
                  .catch((err) => console.log(err));
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

  deletePunto(e, i) {
    e.preventDefault();
    puntos.splice(i, 1);
    this.setState({
      updatePuntos: true
    });
  }

  getDiscussions() {
    let formatoPuntos = [];
    if (puntos.length === 0) {
      return <p className='my-muted'>No se han agregado puntos de agenda</p>;
    }
    for (let i = 0; i < puntos.length; i++) {
      formatoPuntos.push(
        <div className='d-flex justify-content-between align-items-center my-2' key={i}>
          <p className='m-0'>{(i + 1) + '. ' + puntos[i]}</p>
          <i className="fas fa-trash-alt my-icon fa-lg" onClick={(e) => this.deletePunto(e, i)} />
        </div>
      );
    }
    return formatoPuntos;
  }

  getCouncilTypes() {
    const info = [];
    for (let i = 0; i < this.state.tipoSesion.length; i++) {
      let id = this.state.tipoSesion[i].id_tipo_sesion;
      let name = this.state.tipoSesion[i].descripcion;
      info.push(
        <div className="custom-control custom-radio" key={i}>
          <input type="radio" id={id} name="sesion" value={id} onChange={this.handleOptionChange}
            checked={this.state.sesionSeleccionada === id} className="custom-control-input" />
          <label className="custom-control-label" htmlFor={id}>
            {name}
          </label>
        </div>
      );
    }
    return info;
  }

  render() {
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <Navegacion />
        <div className="row m-0">
          <div className="col-md-10 m-auto">
            <div className="card border-primary consejo-card">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Nuevo Consejo</h3>
                <form onSubmit={this.handleSubmit}>
                  <div className='todo-registro'>
                    <div className='registro-container izq'>
                      <div className="form-group">
                        <input type="text" required maxLength="10" name="consecutivo"
                          placeholder="Consecutivo" autoComplete="off" className="form-control"
                          autoFocus onChange={this.handleInputChange} value={this.state.consecutivo} />
                      </div>
                      <div className="form-group">
                        <input type="text" required maxLength="30" name="lugar"
                          placeholder="Lugar" autoComplete="off" className="form-control"
                          onChange={this.handleInputChange} value={this.state.lugar} />
                      </div>
                      <p className='lead'>Seleccione el tipo de sesión:</p>
                      <div className="form-group">
                        {this.getCouncilTypes()}
                      </div>
                      <div className="form-group">
                        <input type="date" required name="fecha" min={this.state.hoy} className="form-control"
                          onChange={this.handleInputChange} value={this.state.fecha} />
                        <p className="my-muted">*Fecha en la que se llevará a cabo el consejo.</p>
                      </div>
                      <div className="form-group">
                        <input type="time" required name="hora" min='07:00' max='20:00' step='900' className="form-control"
                          onChange={this.handleInputChange} value={this.state.hora} />
                        <p className='my-muted'>*Hora en la que se llevará a cabo el consejo.</p>
                      </div>
                    </div>
                    <div className='registro-container der'>
                      <p className='lead text-center'>
                        Puntos de Agenda Iniciales
                    </p>
                      <div className="form-group">
                        <div className='d-flex align-items-center'>
                          <textarea placeholder='Punto de agenda (opcional)' maxLength="300" name='punto' className="form-control mr-2" onChange={this.handleInputChange} value={this.state.punto} />
                          <i className="fas fa-plus-square my-icon fa-lg" onClick={(e) => this.addDiscussion(e)} />
                        </div>
                        <div className='punto-container mt-2'>
                          {this.getDiscussions()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group d-flex justify-content-center">
                    <button type="submit" className="btn btn-outline-primary mt-4 consejo-button">Crear Consejo</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
