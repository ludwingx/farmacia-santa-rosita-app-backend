import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';
import Categories from './categories';
import Suppliers from './suppliers';
import Storage_locations from './storage_locations';


interface ProductInstance extends Model {
    id: number;
    image: string;
    name: string;
    product_code: string;
    description: string;
    purchase_price: number;
    selling_price: number;
    initial_stock: number;
    supplier_id: number;
    nutritional_information: string;
    storage_location_id: number;
    notes: string;
    category_id: number;
    create_at: Date;
    update_at: Date;
    create_by_user_id: number;
    last_update_by_user_id: number;
    status_id: number;
}
const products = db.define<ProductInstance>('product', {
    image:{
        type: DataTypes.TEXT,
        allowNull: true
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
        allowNull:false,
    },
    selling_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    initial_stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    current_stock: {
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
    },
    status_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    expiration_status: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    timestamps: false,
});

products.belongsTo(Suppliers, {
    foreignKey: 'supplier_id',
    as: 'supplier'
});
products.belongsTo(Storage_locations, {
    foreignKey: 'storage_location_id',
    as: 'storage_location'
});
products.belongsTo(Categories, {
    foreignKey: 'category_id',
    as: 'categories'
});

export default products;