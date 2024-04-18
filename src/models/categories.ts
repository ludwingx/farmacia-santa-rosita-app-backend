import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';

interface CategoriesAttributes {
  // Define las propiedades de tu modelo Role
  id: number;
  name: string;
  status_id: number
}

class Categories extends Model<CategoriesAttributes> implements CategoriesAttributes {
  public id!: number;
  public name!: string;
  public status_id!: number
}

// Define tu modelo Roles
Categories.init(
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
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    sequelize: db,
    modelName: 'Categories',
    timestamps: false,
  }
);

export default Categories;
