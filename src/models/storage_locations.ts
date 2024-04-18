import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';

interface Storage_locationAttributes {
  // Define las propiedades de tu modelo Storage_location
  id: number;
  location: string;
  additional_info: string;
  status_id: number;
}

class Storage_locations extends Model<Storage_locationAttributes> implements Storage_locationAttributes {
  public id!: number;
  public location!: string;
  public additional_info!: string;
  public status_id!: number;
}

// Define tu modelo Storage_locations
Storage_locations.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    additional_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    sequelize: db,
    modelName: 'Storage_locations',
    timestamps: false,
  }
);

export default Storage_locations;
