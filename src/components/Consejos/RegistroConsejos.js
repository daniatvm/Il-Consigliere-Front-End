import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Navegacion from '../Navegacion/Navegacion';
import swal from 'sweetalert';
import axios from 'axios';
import auth from '../../helpers/auth';

export default class RegistroConsejos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consecutivo: '',
            lugar: '',
            fecha: '',
            hora: '',
            hoy: this.getTodaysDate(),
            tipoSesion: [],
            sesionSeleccionada: 1,
            redirect: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        auth.verifyToken()
            .then(value => {
                if (value) {
                    axios.get('/tipo_consejo')
                        .then(res => {
                            if (res.data.success) {
                                this.setState({
                                    tipoSesion: res.data.councilTypes
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

    getTodaysDate() {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        return yyyy + '-' + mm + '-' + dd;
    }

    myAlert(title, text, icon) {
        this.setState({
            clave: '',
            confirmacion: ''
        });
        swal({
            title: title,
            text: text,
            icon: icon,
            button: "Ok"
        });
    }

    handleInputChange(e) {
        let value = e.target.value;
        let name = e.target.name;
        this.setState({
            [name]: value
        });
    }

    handleOptionChange(e) {
        this.setState({
            sesionSeleccionada: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        auth.verifyToken()
            .then(value => {
                if (value) {
                    axios.get(`/consejo/${this.state.consecutivo}`)
                        .then(resp => {
                            if (resp.data.success) {
                                this.myAlert('Atención', 'El número de consecutivo ya existe', 'warning');
                            } else {
                                const consejo = {
                                    consecutivo: this.state.consecutivo,
                                    lugar: this.state.lugar,
                                    fecha: this.state.fecha,
                                    hora: this.state.hora,
                                    id_tipo_sesion: this.state.sesionSeleccionada
                                };
                                axios.post('/consejo', consejo)
                                    .then(res => {
                                        if (res.data.success) {
                                            this.props.history.push('/consejos');
                                        } else {
                                            this.myAlert('Oh no!', 'Error interno del servidor.', 'error');
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

    getCouncilTypes() {
        const info = [];
        for (let i = 0; i < this.state.tipoSesion.length; i++) {
            let id = this.state.tipoSesion[i].id_tipo_sesion;
            let name = this.state.tipoSesion[i].descripcion;
            info.push(
                <div className="custom-control custom-radio" key={i}>
                    <input type="radio" id={id} name="sesion" value={id} onChange={this.handleOptionChange}
                        checked={this.state.sesionSeleccionada === id} className="custom-control-input" />
                    <label className="custom-control-label" htmlFor={id}>
                        {name}
                    </label>
                </div>
            );
        }
        return info;
    }

    render() {
        return (this.state.redirect ? <Redirect to='/' /> :
            <>
                <Navegacion />
                <div className="row m-0 my-row">
                    <div className="col-md-5 m-auto">
                        <div className="card border-primary mb-3">
                            <div className="card-body">
                                <h4 className="card-title text-center mb-4">Nuevo Consejo</h4>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <input type="text" required maxLength="10" name="consecutivo"
                                            placeholder="Consecutivo" autoComplete="off" className="form-control"
                                            autoFocus onChange={this.handleInputChange} value={this.state.consecutivo} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" required maxLength="30" name="lugar"
                                            placeholder="Lugar" autoComplete="off" className="form-control"
                                            onChange={this.handleInputChange} value={this.state.lugar} />
                                    </div>
                                    <p className='lead'>Seleccione el tipo de sesion:</p>
                                    <div className="form-group">
                                        {this.getCouncilTypes()}
                                    </div>
                                    <div className="form-group">
                                        <input type="date" required name="fecha" min={this.state.hoy} className="form-control"
                                            onChange={this.handleInputChange} value={this.state.fecha} />
                                        <p className="my-muted">*Fecha en la que se llevará a cabo el consejo.</p>
                                    </div>
                                    <div className="form-group">
                                        <input type="time" required name="hora" min='07:00' max='20:00' step='900' className="form-control"
                                            onChange={this.handleInputChange} value={this.state.hora} />
                                        <p className='my-muted'>*Hora en la que se llevará a cabo el consejo.</p>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-outline-primary btn-block mt-4">Crear Consejo</button>
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