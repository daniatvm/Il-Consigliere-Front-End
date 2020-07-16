import React, { Component } from 'react';
import axios from 'axios';
import Navegacion from '../Navegacion/Navegacion';
import { Link } from 'react-router-dom';
import { myAlert } from '../../helpers/alert';
import auth from '../../helpers/auth';
import { requestDay } from '../../helpers/dates';
import './Consejos.css';

export default class Convocar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.match.params.consecutivo,
      usuarios: [],
      convocados: new Map(),
      seleccionarTodos: false,
      redirect: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.button = React.createRef();
  }

  componentDidMount() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          let convAntCantidad = 0;
          let usuariosCantidad = 0;
          let convAnt = [];
          let usuarios = [];
          axios.get('/usuario')
            .then(res => {
              if (res.data.success) {
                this.setState({
                  usuarios: res.data.users
                });
                usuariosCantidad = res.data.users.length;
                usuarios = res.data.users;
                let convocados = new Map();
                for (let i = 0; i < usuariosCantidad; i++) {
                  convocados.set(usuarios[i].cedula, false);
                }
                axios.get(`/convocado/por_consejo/${this.state.consecutivo}`)
                  .then(res => {
                    if (res.data.success) {
                      convAntCantidad = res.data.convocados.length;
                      convAnt = res.data.convocados;
                      if (convAntCantidad === usuariosCantidad) {
                        this.setState({
                          seleccionarTodos: true
                        });
                      }
                      for (let i = 0; i < usuariosCantidad; i++) {
                        for (let j = 0; j < convAntCantidad; j++) {
                          if (usuarios[i].cedula === convAnt[j].cedula) {
                            convocados.set(usuarios[i].cedula, true);
                          }
                        }
                      }
                    }
                    this.setState({
                      convocados: convocados
                    });
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

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.checked;
    if (name === 'seleccionarTodos') {
      this.setState({
        seleccionarTodos: value
      });
      let convocados = new Map();
      if (value) {
        let arrVerdaderos = Array(this.state.usuarios.length).fill(true);
        this.state.usuarios.map((e, i) => {
          return convocados.set(e.cedula, arrVerdaderos[i]);
        });
      } else {
        let arrFalsos = Array(this.state.usuarios.length).fill(false);
        this.state.usuarios.map((e, i) => {
          return convocados.set(e.cedula, arrFalsos[i]);
        });
      }
      this.setState({
        convocados: convocados
      });
    } else {
      let convocados = this.state.convocados;
      let values = convocados.set(name, value).values();
      this.checkSelectAll(values);
      this.setState(prevState => ({ convocados: prevState.convocados.set(name, value) }));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    auth.verifyToken()
      .then(async value => {
        if (value) {
          const convoque = [];
          for (let [key, value] of this.state.convocados.entries()) {
            if (value) {
              convoque.push({
                cedula: key
              });
            }
          }
          try {
            await axios.delete(`/convocado/por_consejo/${this.state.consecutivo}`);
            const res = await axios.post('/convocado', { convocados: convoque, consecutivo: this.state.consecutivo, limite_solicitud: requestDay() });
            if (res.data.success) {
              myAlert('Éxito', 'Se han convocado todos los usuarios que se escogieron.', 'success');
              this.props.history.push('/gConsejos');
            } else {
              myAlert('Oh no', 'Ha ocurrido un error en el sistema.', 'error');
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          this.setState({
            redirect: true
          })
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
  }

  checkSelectAll(values) {
    for (let value of values) {
      if (!value) {
        if (this.state.seleccionarTodos) {
          this.setState({
            seleccionarTodos: false
          });
        }
        return;
      }
    }
    if (!this.state.seleccionarTodos) {
      this.setState({
        seleccionarTodos: true
      });
    }
    return;
  }

  getUsers() {
    const users = [];
    for (let i = 0; i < this.state.usuarios.length; i++) {
      let cedula = this.state.usuarios[i].cedula;
      let nombre = this.state.usuarios[i].nombre;
      let apellido = this.state.usuarios[i].apellido;
      users.push(
        <div className="custom-control custom-checkbox" key={i}>
          <input type="checkbox" className="custom-control-input" id={cedula} name={cedula}
            checked={!!this.state.convocados.get(cedula)} onChange={this.handleInputChange} />
          <label className="custom-control-label" htmlFor={cedula}>{nombre} {apellido}</label>
        </div>
      );
    }
    return users;
  }

  render() {
    return (
      <>
        <Navegacion />
        <div className="row m-0" style={{ height: '80vh' }}>
          <div className="col-md-6 m-auto">
            <div className="card border-primary mb-3">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">Administrar participantes</h4>
                <form onSubmit={this.handleSubmit}>
                  <div className='form-group convocado-div'>
                    <div className="custom-control custom-checkbox">
                      <input type="checkbox" className="custom-control-input" id='default' name="seleccionarTodos"
                        checked={this.state.seleccionarTodos} onChange={this.handleInputChange} />
                      <label className="custom-control-label" htmlFor='default'>Seleccionar todos los usuarios</label>
                      <hr />
                    </div>
                    {this.getUsers()}
                  </div>
                  <div className="form-group d-flex justify-content-around">
                    <button type="submit" className="btn btn-outline-primary mt-4 convocar-button">Aceptar</button>
                    <Link className="btn btn-outline-secondary mt-4 convocar-button" to='/gConsejos'>Descartar</Link>
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
