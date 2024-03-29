import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';

interface RoleAttributes {
  // Define las propiedades de tu modelo Role
  id: number;
  name: string;
}

class Roles extends Model<RoleAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;
}

// Define tu modelo Roles
Roles.init(
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
  },
  {
    sequelize: db,
    modelName: 'Roles',
    timestamps: false,
  }
);

export default Roles;
