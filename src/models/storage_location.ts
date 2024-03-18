import { DataTypes } from 'sequelize';
import db from '../db/connection';


const storage_locations = db.define('storage_locations', {
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    additional_info:{
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

export default storage_locations;