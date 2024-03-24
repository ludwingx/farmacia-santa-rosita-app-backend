import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';

interface StatusAttributes {
  // Define las propiedades de tu modelo Status
  id: number;
  name: string;
}

class Status extends Model<StatusAttributes> implements StatusAttributes {
  public id!: number;
  public name!: string;
}

// Define tu modelo Status
Status.init(
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
    modelName: 'Status',
    timestamps: false,
  }
);

export default Status;
