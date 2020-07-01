import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import auth from '../../helpers/auth';
import './InvitarUsuario.css';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import 'bootstrap';

export default class InvitarUsuario extends Component {
    constructor(props) {
        super(props);
        this.state = {
            correo: '',
            permisos: [],
            gestionarUsuarios: false,
            gestionarConsejos: false,
            redirect: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.button = React.createRef();
        this.input = React.createRef();
    }

    componentDidMount() {
        auth.verifyToken()
            .then(value => {
                if (value) {
                    axios.get('/permiso')
                        .then(res => {
                            if (res.data.success) {
                                this.setState({
                                    permisos: res.data.roles
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

    handleInputChange(e) {
        const name = e.target.name;
        const value = ((name === 'gestionarUsuarios') || (name === 'gestionarConsejos')) ? e.target.checked : e.target.value;
        this.setState({
            [name]: value
        });
    }

    myAlert(title, text, icon) {
        swal({
            title: title,
            text: text,
            icon: icon,
            button: "Ok"
        });
        this.setState({
            actual: '',
            nueva: '',
            confirmacion: ''
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.button.current.setAttribute('disabled', 'disabled');
        this.button.current.style.cursor = 'progress';
        auth.verifyToken()
            .then(value => {
                if (value) {
                    const info = {
                        correo: this.state.correo
                    };
                    if (this.state.gestionarConsejos && this.state.gestionarUsuarios) {
                        info.permisos = [1, 2];
                    } else if (this.state.gestionarConsejos) {
                        info.permisos = [2];
                    } else if (this.state.gestionarUsuarios) {
                        info.permisos = [1]
                    } else {
                        info.permisos = []
                    }
                    axios.post('/usuario/enviar_link/', info)
                        .then(resp => {
                            if (resp.data.success) {
                                this.myAlert("Invitación Exitosa", `Se ha enviado un link con la invitación de registro a ${this.state.correo}`, "success");
                            } else {
                                this.myAlert("Oh no!", "Error interno del servidor.", "error");
                            }
                            $('#invitar').modal('hide');
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

    render() {
        const checks = [];
        for (let i = 0; i < this.state.permisos.length; i++) {
            let name = this.state.permisos[i].nombre;
            let id = this.state.permisos[i].id_permiso;
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
        return (this.state.redirect ? <Redirect to='/' /> :
            <>
                <button type="button" className="btn btn-outline-primary py-0" data-toggle="modal" data-target="#invitar" style={{ height: "30px" }}>
                    Invita a un usuario
                </button>
                <div className="modal fade" id="invitar" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content modal-border">
                            <div className="modal-body">
                                <h3 className="modal-title text-center mb-4">Invitación</h3>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <input type="email" required maxLength="20" name="correo"
                                            placeholder="Correo electrónico" autoComplete="off" className="form-control"
                                            ref={this.input} onChange={this.handleInputChange} value={this.state.correo} />
                                    </div>
                                    <div className="form-group">
                                        <p className="lead">Permisos que le desea asociar:</p>
                                        {checks}
                                    </div>
                                    <div className="form-group d-flex justify-content-around">
                                        <button ref={this.button} type="submit" className="btn btn-outline-primary mt-4 my-size">Invitar</button>
                                        <button type="button" className="btn btn-outline-secondary my-size mt-4" data-dismiss="modal">Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}