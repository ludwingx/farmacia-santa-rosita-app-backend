import { DataTypes } from 'sequelize';
import db from '../db/connection';


const suppliers = db.define('supplier', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number:{
        type: DataTypes.STRING(20),
        allowNull: true,
    }

}, {
    timestamps: false,
} );

export default suppliers;