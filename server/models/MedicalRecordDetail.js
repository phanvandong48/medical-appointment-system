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
}, {
    tableName: 'Medicalrecorddetails'
});

MedicalRecordDetail.belongsTo(MedicalRecord, {
    foreignKey: 'recordId',
    constraints: false,
    name: 'fk_recorddetail_record_id'
});

MedicalRecord.hasMany(MedicalRecordDetail, {
    foreignKey: 'recordId',
    constraints: false,
    name: 'fk_record_details'
});

MedicalRecordDetail.belongsTo(Appointment, {
    foreignKey: 'appointmentId',
    constraints: false,
    name: 'fk_recorddetail_appointment_id'
});

Appointment.hasOne(MedicalRecordDetail, {
    foreignKey: 'appointmentId',
    constraints: false,
    name: 'fk_appointment_recorddetail'
});

MedicalRecordDetail.belongsTo(Doctor, {
    foreignKey: 'doctorId',
    constraints: false,
    name: 'fk_recorddetail_doctor_id'
});

Doctor.hasMany(MedicalRecordDetail, {
    foreignKey: 'doctorId',
    constraints: false,
    name: 'fk_doctor_recorddetails'
});

module.exports = MedicalRecordDetail;