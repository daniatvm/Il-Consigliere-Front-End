import React, { Component } from 'react';
import axios from 'axios';
import { myAlert } from '../../helpers/alert';
import $ from 'jquery';

let convocados = [];

export default class Convocar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.consecutivo,
      usuarios: [],
      convocadosAnteriormente: [],
      update: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.button = React.createRef();
  }

  componentDidMount() {
    axios.get(`/convocado/por_consejo/${this.props.consecutivo}`)
      .then(res => {
        if (res.data.success) {
          this.setState({
            convocadosAnteriormente: res.data.convocados
          });
        }
      })
      .catch((err) => console.log(err));
    axios.get('/usuario')
      .then(res => {
        if (res.data.success) {
          this.setState({
            usuarios: res.data.users
          });
          convocados = Array(res.data.users.length).fill(false);
        }
      })
      .catch((err) => console.log(err));
    let convAntCantidad = this.state.convocadosAnteriormente.length;
    let usuariosCantidad = this.state.usuarios.length;
    if (convAntCantidad !== 0 || convAntCantidad !== usuariosCantidad) {
      for (let i = 0; i < usuariosCantidad; i++) {
        for (let j = 0; j < convAntCantidad; j++) {
          if (this.state.usuarios[i].cedula === this.state.convocadosAnteriormente[j].cedula) {
            convocados[i] = true;
          }
        }
      }
    }
  }

  handleInputChange(e) {
    const value = e.target.checked;
    const name = e.target.name;
    convocados[name] = value;
    this.setState({
      update: true
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const convoque = [];
    for (let i = 0; i < convocados.length; i++) {
      if (convocados[i]) {
        let { cedula } = this.state.usuarios[i]
        convoque.push({
          cedula: cedula
        });
      }
      await axios.delete(`/convocado/por_consejo/${this.state.consecutivo}`);
      const res = await axios.post('/convocado', { convocados: convoque, consecutivo: this.state.consecutivo });
      if (res.data.success) {
        myAlert('Éxito', 'Se han convocado todos los usuarios que se escogieron', 'success');
      } else {
        myAlert('Oh no', 'Ha ocurrido un error en el sistema', 'error');
      }
      $('#convocar').modal('hide');
      this.button.current.removeAttribute('disabled', 'disabled');
      this.button.current.style.cursor = 'default';
    }
  }

  usersFormat() {
    const users = [];
    for (let i = 0; i < this.state.usuarios.length; i++) {
      let cedula = this.state.usuarios[i].cedula;
      let nombre = this.state.usuarios[i].nombre;
      let apellido = this.state.usuarios[i].apellido;
      users.push(
        <div className='d-flex justify-content-around' key={i}>
          <div className='form-group'>
            <div className="custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id={cedula} name={i}
                checked={convocados[i]} onChange={this.handleInputChange} />
              <label className="custom-control-label" htmlFor={cedula}>{nombre} {apellido}</label>
            </div>
          </div>
        </div>
      );
    }
    return users;
  }

  render() {
    return (
      <>
        <button type="button" className="btn btn-block btn-outline-primary mt-2 py-0" data-toggle="modal" data-target="#convocar">
          Convocar participantes
        </button>
        <div className="modal fade" id="convocar" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content modal-border">
              <div className="modal-body">
                <h3 className="modal-title text-center mb-4">Lista de Usuarios</h3>
                <form onSubmit={this.handleSubmit}>
                  {this.usersFormat()}
                  <div className="form-group d-flex justify-content-around">
                    <button ref={this.button} type="submit" className="btn btn-outline-primary mt-4 my-size">Convocar</button>
                    <button type="button" className="btn btn-outline-secondary my-size mt-4" data-dismiss="modal">Cancelar</button>
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
