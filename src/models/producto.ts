import { DataTypes } from 'sequelize';
import db from '../db/connection';


const products = db.define('product', {
    image:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    product_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    purchase_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    selling_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    initial_stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    nutritional_information: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    storage_location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,

    },
    create_by_user_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    last_update_by_user_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    timestamps: false,
});

export default products;