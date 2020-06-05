import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import roles from '../../helpers/roles';
import auth from '../../helpers/auth';
import './Navegacion.css';

export default class Navegacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autenticado: false,
            gestUsuario: false,
            gestConsejo: false
        }
        this.logOut = this.logOut.bind(this);
    }

    componentDidMount() {
        const userRoles = roles.getRoles();
        const cedula = auth.getInfo().cedula;
        const length = userRoles.length;
        if (cedula > 0) {
            this.setState({
                autenticado: true
            });
            for (let i = 0; i < length; i++) {
                let role = roles[i];
                if (role.id_usuario === 1) {
                    this.setState({
                        gestUsuario: true
                    });
                }
                if (role.id_usuario === 1) {
                    this.setState({
                        gestConsejo: true
                    });
                }
            }
        }
    }

    logOut() {
        localStorage.removeItem('il-consigliere');
        const cleanUser = {
            cedula: '',
            nombre: '',
            apellido: ''
        }
        auth.setInfo(cleanUser);
        roles.checkRoles();
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 p-0">
                <div className="container">
                    <Link className="navbar-brand" to="/"><img src="https://www.tec.ac.cr/sites/all/themes/tec/img/logo.svg" alt="logo del TEC" /></Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarColor01">
                        {this.state.autenticado ?
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <NavLink className="nav-link text" activeClassName="active" exact to="/consejos">Mis Consejos</NavLink>
                                </li>
                                {this.state.gestUsuario &&
                                    <li className="nav-item">
                                        <NavLink className="nav-link text" activeClassName="active" exact to="/gUsuarios">Gestión de Usuarios</NavLink>
                                    </li>
                                }
                                {this.state.gestConsejo &&
                                    <li className="nav-item">
                                        <NavLink className="nav-link text" activeClassName="active" exact to="/gConsejos">Gestión de Consejos</NavLink>
                                    </li>
                                }
                                <li className="nav-item">
                                    <NavLink className="nav-link text" activeClassName="active" exact to="/cuenta">Mi Cuenta</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link text" activeClassName="active" exact to="/" onClick={this.logOut}>Salir</NavLink>
                                </li>
                            </ul>
                            :
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <NavLink className="nav-link text" activeClassName="active" exact to="/">Inicio</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link text" activeClassName="active" to="/acceso">Acceso</NavLink>
                                </li>
                            </ul>
                        }
                    </div>
                </div>
            </nav>
        );
    }
}
