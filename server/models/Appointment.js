const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Schedule = require('./Schedule');

const Appointment = sequelize.define('Appointment', {
    reason: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'canceled', 'completed'),
        defaultValue: 'pending'
    }
});

Appointment.belongsTo(User, {
    foreignKey: 'patientId',
    as: 'patient',
    constraints: false,
    name: 'fk_appointment_patient_id'
});

User.hasMany(Appointment, {
    foreignKey: 'patientId',
    constraints: false,
    name: 'fk_user_appointments'
});

Appointment.belongsTo(Schedule, {
    foreignKey: 'scheduleId',
    constraints: false,
    name: 'fk_appointment_schedule_id'
});

Schedule.hasOne(Appointment, {
    foreignKey: 'scheduleId',
    constraints: false,
    name: 'fk_schedule_appointment_id'
});

module.exports = Appointment;