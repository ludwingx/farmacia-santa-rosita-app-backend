import { DataTypes } from 'sequelize';
import db from '../db/connection';

const purchase_price_history= db.define('purchase_price_history', {
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    old_purchase_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    new_purchase_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    changed_by_user_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    changed_at:{
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    timestamps: false,
});

export default purchase_price_history;