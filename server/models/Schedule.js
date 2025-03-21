const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Doctor = require('./Doctor');

const Schedule = sequelize.define('Schedule', {
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('available', 'booked'),
        defaultValue: 'available'
    }
});

Schedule.belongsTo(Doctor, {
    foreignKey: 'doctorId',
    constraints: false,
    name: 'fk_schedule_doctor_id'
});

Doctor.hasMany(Schedule, {
    foreignKey: 'doctorId',
    constraints: false,
    name: 'fk_doctor_schedule_id'
});

module.exports = Schedule;