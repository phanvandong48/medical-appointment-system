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
}, {
    tableName: 'Medicalrecords'
});

MedicalRecord.belongsTo(User, {
    foreignKey: 'patientId',
    as: 'patient',
    constraints: false,
    name: 'fk_medicalrecord_patient_id'
});

User.hasMany(MedicalRecord, {
    foreignKey: 'patientId',
    constraints: false,
    name: 'fk_user_medicalrecords'
});

module.exports = MedicalRecord;