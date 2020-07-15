import React, { Component } from "react";
import axios from "axios";
import auth from "../../helpers/auth";
import { Redirect } from "react-router-dom";
import $ from 'jquery';

export default class SolicitudAgenda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.consecutivo,
      solicitudes: [],
      redirect: false
    }

    this.acceptDiscussion = this.acceptDiscussion.bind(this);
  }

  componentDidMount() {
    this.getRequestsFromDB();
  }

  getRequestsFromDB() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get(`/punto/solicitud/${this.state.consecutivo}`)
            .then(res => {
              if (res.data.success) {
                this.setState({
                  solicitudes: res.data.discussions
                });
              } else {
                this.setState({
                  solicitudes: []
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

  acceptDiscussion(e, id_punto) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.put(`/punto/${id_punto}`, { id_tipo_punto: 1 })
            .then(res => {
              if (res.data.success) {
                this.getRequestsFromDB();
                this.props.updateParent();
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

  getRequests() {
    const requests = [];
    for (let i = 0; i < this.state.solicitudes.length; i++) {
      let request = this.state.solicitudes[i];
      requests.push(
        <div className='d-flex justify-content-between align-items-center my-2' key={i}>
          <p className='m-0 text-justify'>{request.nombre + ' ' + request.apellido}: {request.asunto}</p>
          {/* <div className='d-flex justify-content-between align-items-center'> */}
          <i className="far fa-check-circle fa-lg ml-2 my-success" onClick={(e) => this.acceptDiscussion(e, request.id_punto)}></i>
          {/* <i className="far fa-times-circle fa-lg my-danger" onClick={(e) => this.discardDiscussion(e, request.id_punto)}></i> */}
          {/* </div> */}
        </div>
      );
    }
    return requests;
  }

  render() {
    $('#solicitudes').on('shown.bs.modal', function () {
      $('#modal-input').focus();
    });
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <button type="button" className="btn btn-outline-primary py-0 solicitud-button" data-toggle="modal" data-target="#solicitudes">
          Ver solicitudes
        </button>
        <div className="modal fade" id="solicitudes" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content modal-border">
              <div className="modal-body">
                <h3 className="modal-title text-center mb-4">Solicitudes de Agenda</h3>
                {this.state.solicitudes.length === 0 && <p className='my-muted'>No hay solicitudes de agenda para este consejo.</p>}
                {this.getRequests()}
                <div className='d-flex justify-content-center'>
                  <button type="button" className="btn btn-outline-primary my-size mt-4" data-dismiss="modal">Listo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}