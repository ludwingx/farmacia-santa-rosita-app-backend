import { DataTypes } from 'sequelize';
import db from '../db/connection';


const roles = db.define('roles', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

export default roles;