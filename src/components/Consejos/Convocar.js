import React, { Component } from 'react';
import axios from 'axios';
import Navegacion from '../Navegacion/Navegacion';
import { Link } from 'react-router-dom';
import { myAlert } from '../../helpers/alert';
import auth from '../../helpers/auth';
import './Consejos.css';

let convocados = [];

export default class Convocar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.match.params.consecutivo,
      usuarios: [],
      convocadosAnteriormente: [],
      convocados: [],
      seleccionarTodos: false,
      redirect: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.button = React.createRef();
  }

  componentDidMount() {
    convocados = [];
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
                axios.get(`/convocado/por_consejo/${this.state.consecutivo}`)
                  .then(res => {
                    if (res.data.success) {
                      this.setState({
                        convocadosAnteriormente: res.data.convocados
                      });
                      convAntCantidad = res.data.convocados.length;
                      convAnt = res.data.convocados;
                      if (convAntCantidad === usuariosCantidad) {
                        convocados = Array(usuariosCantidad).fill(true);
                        this.setState({
                          convocados: convocados,
                          seleccionarTodos: true
                        });
                      } else {
                        convocados = Array(usuariosCantidad).fill(false);
                        if (convAntCantidad !== 0) {
                          for (let i = 0; i < usuariosCantidad; i++) {
                            for (let j = 0; j < convAntCantidad; j++) {
                              if (usuarios[i].cedula === convAnt[j].cedula) {
                                convocados[i] = true;
                              }
                            }
                          }
                          this.setState({
                            convocados: convocados
                          });
                        }
                      }
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

  handleInputChange(e) {
    const value = e.target.checked;
    const name = e.target.name;
    if (name === 'seleccionarTodos') {
      this.setState({
        seleccionarTodos: value
      })
      if (value) {
        convocados = Array(this.state.usuarios.length).fill(true);
      } else {
        convocados = Array(this.state.usuarios.length).fill(false);
      }
    } else {
      convocados[name] = value;
    }
    this.setState({
      convocados: convocados
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    auth.verifyToken()
      .then(async value => {
        if (value) {
          const convoque = [];
          for (let i = 0; i < convocados.length; i++) {
            if (convocados[i]) {
              let { cedula } = this.state.usuarios[i]
              convoque.push({
                cedula: cedula
              });
            }
          }
          try {
            await axios.delete(`/convocado/por_consejo/${this.state.consecutivo}`);
            const res = await axios.post('/convocado', { convocados: convoque, consecutivo: this.state.consecutivo });
            if (res.data.success) {
              convocados = [];
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

  getUsers() {
    const users = [];
    for (let i = 0; i < this.state.usuarios.length; i++) {
      let cedula = this.state.usuarios[i].cedula;
      let nombre = this.state.usuarios[i].nombre;
      let apellido = this.state.usuarios[i].apellido;
      users.push(
        <div className="custom-control custom-checkbox" key={i}>
          <input type="checkbox" className="custom-control-input" id={cedula} name={i}
            checked={convocados[i]} onChange={this.handleInputChange} />
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
