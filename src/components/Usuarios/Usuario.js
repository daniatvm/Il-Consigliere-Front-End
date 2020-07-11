import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import Navegacion from '../Navegacion/Navegacion';
import auth from '../../helpers/auth';
import './Usuario.css';
import DefaultComponent from '../../helpers/DefaultComponent';
import { Loading } from '../../helpers/Loading';

export default class Usuario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      cedula: this.props.match.params.cedula,
      nombre: '',
      apellido: '',
      permisosUsuario: [],
      permisosSistema: [],
      id_tipo_convocado: 0,
      tipos_convocado: [],
      correos: [],
      gestionarUsuarios: false,
      gestionarConsejos: false,
      encontrado: true,
      redirect: false
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.state.cedula !== auth.getInfo().cedula) {
      auth.verifyToken()
        .then(value => {
          if (value) {
            axios.get(`/usuario/${this.state.cedula}`)
              .then(user => {
                if (user.data.success) {
                  const usuario = user.data.user;
                  this.setState({
                    isLoading: false,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    id_tipo_convocado: usuario.id_tipo_convocado
                  });
                  axios.get(`/correo/${this.state.cedula}`)
                    .then(emails => {
                      if (emails.data.success) {
                        this.setState({
                          correos: emails.data.emails
                        });
                      }
                      axios.get(`/usuario/permisos/${this.state.cedula}`)
                        .then(roles => {
                          if (roles.data.success) {
                            this.setState({
                              permisosUsuario: roles.data.roles
                            });
                          }
                          for (let i = 0; i < this.state.permisosUsuario.length; i++) {
                            if (this.state.permisosUsuario[i].id_permiso === 1) {
                              this.setState({
                                gestionarUsuarios: true
                              });
                            }
                            if (this.state.permisosUsuario[i].id_permiso === 2) {
                              this.setState({
                                gestionarConsejos: true
                              });
                            }
                          }
                          axios.get('/permiso')
                            .then(roles => {
                              if (roles.data.success) {
                                this.setState({
                                  permisosSistema: roles.data.roles
                                });
                              }
                            })
                            .catch((err) => console.log(err));
                          axios.get('/tipo_convocado')
                            .then(res => {
                              if (res.data.success) {
                                this.setState({
                                  tipos_convocado: res.data.attendantTypes
                                });
                              }
                            })
                            .catch((err) => console.log(err));
                        })
                        .catch((err) => console.log(err));
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
          } else {
            this.setState({
              redirect: true
            })
            auth.logOut();
          }
        })
        .catch((err) => console.log(err));
    } else {
      this.setState({
        encontrado: false
      });
    }
  }

  handleInputChange(e) {
    const value = e.target.checked;
    const name = e.target.name;
    this.setState({
      [name]: value
    });
  }

  handleOptionChange(e) {
    this.setState({
      id_tipo_convocado: e.target.value
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.delete(`/usuario_permiso/${this.state.cedula}`);
      if (this.state.gestionarUsuarios) {
        const usuarioPermiso = {
          id_permiso: 1,
          cedula: this.state.cedula
        };
        await axios.post('/usuario_permiso', usuarioPermiso);
      }
      if (this.state.gestionarConsejos) {
        const usuarioPermiso = {
          id_permiso: 2,
          cedula: this.state.cedula
        };
        await axios.post('/usuario_permiso', usuarioPermiso);
      }
      await axios.put(`/usuario/convocado/${this.state.cedula}`, { id_tipo_convocado: this.state.id_tipo_convocado });
    } catch (err) {
      console.log(err);
    }
    this.props.history.push('/gUsuarios/usuarios');
  }

  getEmails() {
    const emails = [];
    for (let i = 0; i < this.state.correos.length; i++) {
      emails.push(<p key={i}>{this.state.correos[i].correo}</p>);
    }
    return emails;
  }

  checks() {
    const checks = [];
    for (let i = 0; i < this.state.permisosSistema.length; i++) {
      let name = this.state.permisosSistema[i].nombre;
      let id = this.state.permisosSistema[i].id_permiso;
      checks.push(
        <div className="custom-control custom-checkbox" key={i}>
          <input type="checkbox" className="custom-control-input"
            id={name} checked={id === 1 ? this.state.gestionarUsuarios : this.state.gestionarConsejos}
            onChange={this.handleInputChange} name={name} />
          <label className="custom-control-label" htmlFor={name}>
            {id === 1 ? 'Gestionar Usuarios' : 'Gestionar Consejos'}
          </label>
        </div>
      );
    }
    return checks;
  }

  getAttendantType() {
    const tipo_convocado = [];
    for (let i = 0; i < this.state.tipos_convocado.length; i++) {
      let id = this.state.tipos_convocado[i].id_tipo_convocado;
      let descripcion = this.state.tipos_convocado[i].descripcion;
      tipo_convocado.push(
        <option value={id} key={i}>{descripcion}</option>
      );
    }
    return tipo_convocado;
  }

  render() {
    return (this.state.isLoading ? <Loading /> : this.state.redirect ? <Redirect to='/' /> : !this.state.encontrado ? <DefaultComponent /> :
      <>
        <Navegacion />
        <div className="row m-0 my-row">
          <div className="col-md-6 m-auto">
            <div className="card border-primary">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Información de {this.state.nombre} {this.state.apellido}</h3>
                <p>Cédula: {this.state.cedula}</p>
                {this.state.correos.length === 0 ? <p>Este usuario no tiene correos registrados.</p> : <h5>Correos asociados:</h5>}
                {this.getEmails()}
                <hr />
                <h4 className="text-center mb-4">Edición de permisos asociados</h4>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    {this.checks()}
                  </div>
                  <hr />
                  <div className="form-group">
                    <p className="lead">Se convoca como:</p>
                    <select className="custom-select" value={this.state.id_tipo_convocado} onChange={this.handleOptionChange}>
                      {this.getAttendantType()}
                    </select>
                  </div>
                  <div className="form-group d-flex justify-content-around">
                    <button type="submit" className="btn btn-outline-primary my-width mt-2">Guardar Cambios</button>
                    <Link to='/gUsuarios' className="btn btn-outline-secondary my-width mt-2">Cancelar</Link>
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
