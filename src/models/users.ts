// users.model.ts
import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';
import Roles from './roles';
import Status from './status';

interface UserInstance extends Model {
    id: number;
    name: string;
    email: string;
    image: string;
    ci: number;
    username: string;
    password: string;
    role_id: number;
    status_id: number;
}

const Users = db.define<UserInstance>('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING
    },
    ci: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(70),
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false,
});

Users.belongsTo(Roles, {
    foreignKey: 'role_id',
    as: 'role'
});

Users.belongsTo(Status, {
    foreignKey: 'status_id',
    as: 'status'
});

export default Users;
