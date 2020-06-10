import React, { Component } from 'react';
import axios from 'axios';
import Navegacion from '../Navegacion/Navegacion';

export default class Registro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cedula: '',
            nombre: '',
            apellido: '',
            permisos: [],
            gestionarUsuarios: false,
            gestionarConsejos: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:5000/permiso')
            .then(res => {
                this.setState({
                    permisos: res.data
                });
            })
            .catch((err) => console.log(err));
    }

    handleInputChange(e) {
        const target = e.target;
        const name = e.target.name;
        const value = ((name === 'gestionarUsuarios') || (name === 'gestionarConsejos')) ? target.checked : target.value;
        if ((name === 'cedula') && (!Number(value)) && (value !== '')) {
            return;
        }
        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const usuario = {
            cedula: this.state.cedula,
            nombre: this.state.nombre,
            apellido: this.state.apellido,
            clave: this.state.apellido
        };
        axios.post('http://localhost:5000/usuario', usuario)
            .then((res) => {
                if (this.state.gestionarUsuarios) {
                    const usuarioPermiso = {
                        id_permiso: 1,
                        cedula: this.state.cedula
                    };
                    try {
                        axios.post('http://localhost:5000/usuarioPermiso', usuarioPermiso);
                    } catch (err) {
                        console.log(err);
                    }
                }
                if (this.state.gestionarConsejos) {
                    const usuarioPermiso = {
                        id_permiso: 2,
                        cedula: this.state.cedula
                    };
                    try {
                        axios.post('http://localhost:5000/usuarioPermiso', usuarioPermiso);
                    } catch (err) {
                        console.log(err);
                    }
                }
                this.props.history.push('/gUsuarios/usuarios');
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
        return (
            <>
                <Navegacion />
                <div className="row m-0 my-row">
                    <div className="col-md-4 mx-auto my-auto">
                        <div className="card border-primary mb-3">
                            <div className="card-body">
                                <h4 className="card-title text-center mb-4">Nuevo Usuario</h4>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <input type="text" required maxLength="20" name="cedula"
                                            placeholder="Cédula" autoComplete="off" className="form-control"
                                            autoFocus onChange={this.handleInputChange} value={this.state.cedula} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" required maxLength="20" name="nombre"
                                            placeholder="Nombre" className="form-control"
                                            onChange={this.handleInputChange} value={this.state.nombre} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" required maxLength="20" name="apellido"
                                            placeholder="Apellido" className="form-control"
                                            onChange={this.handleInputChange} value={this.state.apellido} />
                                    </div>
                                    <div className="form-group">
                                        {checks}
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-outline-primary btn-block mt-4">Registrar</button>
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
