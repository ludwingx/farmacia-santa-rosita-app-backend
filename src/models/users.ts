import { DataTypes } from 'sequelize';
import db from '../db/connection';
import Roles from './roles'; // Importa el modelo de roles

const users = db.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image:{
        type: DataTypes.TEXT,
        allowNull: false,
    }, 
    ci:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
    username:{
        type: DataTypes.STRING(30),
        allowNull: false,
    }, 
    password:{
        type: DataTypes.STRING(70),
        allowNull: false,
    }, 
    role_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false,
});
users.belongsTo(Roles, {
    foreignKey: 'role_id', // La clave foránea en la tabla de usuarios
    as: 'role' // Alias para la relación
});
export default users;