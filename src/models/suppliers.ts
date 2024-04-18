import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';

interface SupplierAttributes {
  // Define las propiedades de tu modelo Supplier
  id: number;
  name: string;
  address: string;
  phone_number: string;
  email: string;
}

class Suppliers extends Model<SupplierAttributes> implements SupplierAttributes {
  public id!: number;
  public name!: string;
  public address!: string;
  public phone_number!: string;
  public email!: string;
}

// Define tu modelo Suppliers
Suppliers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize: db,
    modelName: 'Suppliers',
    timestamps: false,
  }
);

export default Suppliers;
