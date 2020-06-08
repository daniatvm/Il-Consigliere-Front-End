import axios from 'axios';
import auth from './auth';

class Roles {
    constructor() {
        this.roles = []
    }

    getRoles() {
        return this.roles;
    }

    setRoles(roles) {
        this.roles = roles;
    }

    cleanRoles(){
        this.roles = [];
    }

    async checkRoles() {
        try {
            const user = auth.getInfo();
            if (user.cedula === '') {
                this.roles = [];
            } else {
                const roles = await axios.get(`http://localhost:5000/usuario/permisos/${user.cedula}`);
                this.setRoles(roles.data);
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default new Roles();
