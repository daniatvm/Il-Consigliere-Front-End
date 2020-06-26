import React, { Component } from 'react';
import Navegacion from '../Navegacion/Navegacion';
import axios from 'axios';
import swal from 'sweetalert';
import auth from '../../helpers/auth';

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
                            this.props.history.push('/gUsuarios/usuarios');
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
        return (
            <>
                <Navegacion />
                <div className="row m-0 my-row" style={{ height: '70vh' }}>
                    <div className="col-md-5 m-auto">
                        <div className="card border-primary mb-3">
                            <div className="card-body">
                                <h4 className="card-title text-center mb-4">Invita a un Usuario</h4>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <input type="email" required maxLength="20" name="correo"
                                            placeholder="Correo electrónico" autoComplete="off" className="form-control"
                                            autoFocus onChange={this.handleInputChange} value={this.state.correo} />
                                    </div>
                                    <div className="form-group">
                                        <p className="lead">Permisos que le desea asociar:</p>
                                        {checks}
                                    </div>
                                    <div className="form-group">
                                        <button ref={this.button} type="submit" className="btn btn-outline-primary btn-block mt-4">Invitar</button>
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