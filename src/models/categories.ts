import { DataTypes } from 'sequelize';
import db from '../db/connection';


const categories = db.define('categorie', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

export default categories;