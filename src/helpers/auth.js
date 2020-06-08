import axios from 'axios';

class Auth {
    constructor() {
        this.info = {
            cedula: '',
            nombre: '',
            apellido: ''
        }
    }

    setInfo(info) {
        this.info = {
            cedula: info.cedula,
            nombre: info.nombre,
            apellido: info.apellido
        }
    }

    getInfo() {
        return this.info
    }

    cleanInfo() {
        this.info = {
            cedula: '',
            nombre: '',
            apellido: ''
        }
    }

    async isAuthenticated() {
        try {
            let store = JSON.parse(localStorage.getItem('il-consigliere'));
            if (store) {
                let token = 'Bearer ' + store.token;
                let header = {
                    headers: {
                        authorization: token
                    }
                }
                const res = await axios.post('http://localhost:5000/usuario/verificar_token', null, header);
                if (res.data.success) {
                    const user = res.data.token.user;
                    this.setInfo(user);
                    return true;
                }
            } else {
                const cleanUser = {
                    cedula: '',
                    nombre: '',
                    apellido: ''
                }
                this.setInfo(cleanUser);
                return false;
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default new Auth();
