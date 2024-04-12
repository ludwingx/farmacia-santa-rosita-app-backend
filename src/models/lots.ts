import { DataTypes } from 'sequelize';
import db from '../db/connection';

const lots= db.define('lots', {
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    initial_quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    expiration_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    created_at:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    create_by_user_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    updated_at:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    last_update_by_user_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
    }

}, {
    timestamps: false,
});

export default lots;