import React, { Component } from 'react';
import Navegacion from '../Navegacion/Navegacion';
import auth from '../../helpers/auth';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import './Usuario.css';

export default class Usuario extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cedula: this.props.match.params.usuario,
            nombre: '',
            apellido: '',
            permisosUsuario: [],
            permisosSistema: [],
            correos: [],
            gestionarUsuarios: false,
            gestionarConsejos: false,
            redirect: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        auth.verifyToken()
            .then(value => {
                if (value) {
                    axios.get(`http://localhost:5000/usuario/${this.state.cedula}`)
                        .then(user => {
                            if (user.data.success) {
                                const usuario = user.data.user;
                                this.setState({
                                    nombre: usuario.nombre,
                                    apellido: usuario.apellido
                                });
                            }
                            axios.get(`http://localhost:5000/correo/${this.state.cedula}`)
                                .then(emails => {
                                    if (emails.data.success) {
                                        this.setState({
                                            correos: emails.data.emails
                                        });
                                    }
                                    axios.get(`http://localhost:5000/usuario/permisos/${this.state.cedula}`)
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
                                            axios.get('http://localhost:5000/permiso')
                                                .then(roles => {
                                                    if (roles.data.success) {
                                                        this.setState({
                                                            permisosSistema: roles.data.roles
                                                        });
                                                    }
                                                })
                                                .catch((err) => console.log(err));
                                        })
                                        .catch((err) => console.log(err));
                                })
                                .catch((err) => console.log(err));
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
        const value = e.target.checked
        const name = e.target.name;
        this.setState({
            [name]: value
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        await axios.delete(`http://localhost:5000/usuarioPermiso/${this.state.cedula}`);
        if (this.state.gestionarUsuarios) {
            const usuarioPermiso = {
                id_permiso: 1,
                cedula: this.state.cedula
            };
            await axios.post('http://localhost:5000/usuarioPermiso', usuarioPermiso);
        }
        if (this.state.gestionarConsejos) {
            const usuarioPermiso = {
                id_permiso: 2,
                cedula: this.state.cedula
            };
            await axios.post('http://localhost:5000/usuarioPermiso', usuarioPermiso);
        }
        this.props.history.push('/gUsuarios/usuarios');
    }

    emails() {
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

    render() {
        return (this.state.redirect ? <Redirect to='/' /> :
            <>
                <Navegacion />
                <div className="row m-0 my-row">
                    <div className="col-md-6 m-auto">
                        <div className="card border-primary">
                            <div className="card-body">
                                <h4 className="card-title text-center mb-4">Información de {this.state.nombre} {this.state.apellido}</h4>
                                <p>Cédula: {this.state.cedula}</p>
                                {this.state.correos.length === 0 ? <p>Este usuario no tiene correos registrados.</p> : <h5>Correos asociados:</h5>}
                                {this.emails()}
                                <hr />
                                <h4 className="text-center mb-4">Edición de permisos asociados</h4>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        {this.checks()}
                                    </div>
                                    <div className="form-group d-flex justify-content-around">
                                        <button type="submit" className="btn btn-outline-primary my-width mt-2">Guardar Cambios</button>
                                        <Link to='/gUsuarios/usuarios' className="btn btn-outline-primary my-width mt-2">Cancelar</Link>
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
