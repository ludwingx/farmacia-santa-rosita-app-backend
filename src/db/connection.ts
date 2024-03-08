import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('farmacia_santa_rosita', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });

  export default sequelize;