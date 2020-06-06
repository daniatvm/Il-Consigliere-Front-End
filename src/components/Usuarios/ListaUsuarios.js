import React, { Component } from 'react';
import Navegacion from '../Navegacion/Navegacion';
import axios from 'axios';
import auth from '../../helpers/auth';
import swal from 'sweetalert';
import './ListaUsuarios.css';

export default class ListaUsuarios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuarios: []
        };
        this.deleteUser = this.deleteUser.bind(this);
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {
        axios.get('http://localhost:5000/usuario/')
            .then(res => {
                this.setState({
                    usuarios: res.data
                });
            })
            .catch((err) => console.log(err));
    }

    deleteUser(e, cedula, nombre, apellido) {
        e.preventDefault();
        swal({
            title: "Confirmación",
            text: `Se eliminará la información de ${nombre} ${apellido}`,
            icon: "warning",
            buttons: ["Cancelar", "Confirmar"],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.delete(`http://localhost:5000/usuarioPermiso/${cedula}`)
                        .then(() => {
                            axios.delete(`http://localhost:5000/usuario/${cedula}`)
                                .then(() => {
                                    this.getUsers();
                                })
                                .catch((err) => console.log(err));
                        })
                        .catch((err) => console.log(err));
                }
            });
    }

    userList() {
        const tableRows = [];
        for (let i = 0; i < this.state.usuarios.length; i++) {
            let user = this.state.usuarios[i];
            let { cedula, nombre, apellido } = user;
            if (cedula !== auth.getInfo().cedula) {
                tableRows.push(
                    <tr key={i}>
                        <td>{cedula}</td>
                        <td>{nombre}</td>
                        <td>{apellido}</td>
                        <td>
                            <button className='btn btn-outline-secondary' onClick={(e) => this.deleteUser(e, cedula, nombre, apellido)}><i className="fas fa-trash-alt"></i></button>
                        </td>
                    </tr>
                );
            }
        }
        return tableRows;
    }

    render() {
        return (
            <>
                <Navegacion />
                <div className="container">
                    <h3 className="mb-4">Lista de Usuarios</h3>
                    <table className="table m-auto">
                        <tbody>
                            {this.userList()}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}
