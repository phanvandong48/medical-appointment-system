const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const MedicalRecord = require('./MedicalRecord');
const Appointment = require('./Appointment');
const Doctor = require('./Doctor');

const MedicalRecordDetail = sequelize.define('MedicalRecordDetail', {
    diagnosis: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    prescription: {
        type: DataTypes.TEXT
    },
    notes: {
        type: DataTypes.TEXT
    },
    recordDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
});

MedicalRecordDetail.belongsTo(MedicalRecord, { foreignKey: 'recordId' });
MedicalRecord.hasMany(MedicalRecordDetail, { foreignKey: 'recordId' });

MedicalRecordDetail.belongsTo(Appointment, { foreignKey: 'appointmentId' });
Appointment.hasOne(MedicalRecordDetail, { foreignKey: 'appointmentId' });

MedicalRecordDetail.belongsTo(Doctor, { foreignKey: 'doctorId' });
Doctor.hasMany(MedicalRecordDetail, { foreignKey: 'doctorId' });

module.exports = MedicalRecordDetail;