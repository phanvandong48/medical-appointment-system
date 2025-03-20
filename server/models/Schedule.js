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

Schedule.belongsTo(Doctor, { foreignKey: 'doctorId' });
Doctor.hasMany(Schedule, { foreignKey: 'doctorId' });

module.exports = Schedule;