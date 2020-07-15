import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import SolicitudAgenda from './SolicitudAgenda';
import auth from "../../helpers/auth";


export default class AgendaOficial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.consecutivo,
      punto: '',
      puntos: [],
      redirect: false
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addDiscussion = this.addDiscussion.bind(this);
    this.deleteDiscussion = this.deleteDiscussion.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    this.getDiscussionsFromBD();
  }

  getDiscussionsFromBD() {
    axios.get(`/punto/aprobado/${this.state.consecutivo}`)
      .then(resp => {
        if (resp.data.success) {
          this.setState({
            puntos: resp.data.discussions
          });
        }
      })
      .catch((err) => console.log(err));
  }

  handleInputChange(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState({
      [name]: value
    });
  }

  addDiscussion(e) {
    e.preventDefault();
    if (this.state.punto !== '') {
      auth.verifyToken()
        .then(value => {
          if (value) {
            axios.post('/punto', { asunto: this.state.punto, consecutivo: this.state.consecutivo, id_tipo_punto: 1, cedula: auth.getInfo().cedula })
              .then(res => {
                if (res.data.success) {
                  this.getDiscussionsFromBD();
                  this.setState({
                    punto: ''
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
  }

  deleteDiscussion(e, id_punto) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.delete(`/punto/${id_punto}`)
            .then(res => {
              if (res.data.success) {
                this.getDiscussionsFromBD();
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

  handleUpdate() {
    this.getDiscussionsFromBD();
  }

  getDiscussions() {
    const discussions = [];
    for (let i = 0; i < this.state.puntos.length; i++) {
      let punto = this.state.puntos[i];
      discussions.push(
        <div className='d-flex justify-content-between align-items-center my-2' key={i}>
          <li className='text-justify'>{punto.asunto}</li>
          <i className="fas fa-trash-alt my-icon fa-lg mx-1" onClick={(e) => this.deleteDiscussion(e, punto.id_punto)} />
        </div>
      );
    }
    return discussions;
  }

  render() {
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <div className='d-flex justify-content-center'>
          <p className='text-center pr-4'>Puntos de Agenda Oficiales</p>
          <SolicitudAgenda consecutivo={this.state.consecutivo} updateParent={this.handleUpdate} />
        </div>
        <div className="form-group">
          <div className='d-flex align-items-center'>
            <textarea placeholder='Punto de agenda (opcional)' maxLength="800" name='punto' className="form-control mr-2" onChange={this.handleInputChange} value={this.state.punto} />
            <i className="fas fa-plus-square my-icon fa-lg" onClick={(e) => this.addDiscussion(e)} />
          </div>
          <div className='punto-editable mt-2'>
            <ol className='pl-4 m-0'>
              {this.getDiscussions()}
            </ol>
          </div>
        </div>
      </>
    );
  }
}