const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const MedicalRecord = sequelize.define('MedicalRecord', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    }
});

MedicalRecord.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
User.hasMany(MedicalRecord, { foreignKey: 'patientId' });

module.exports = MedicalRecord;