const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Doctor = require('./Doctor');
const Appointment = require('./Appointment');

const DoctorRating = sequelize.define('DoctorRating', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT
    }
});

// Mối quan hệ với User (bệnh nhân đánh giá)
DoctorRating.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
User.hasMany(DoctorRating, { foreignKey: 'patientId' });

// Mối quan hệ với Doctor
DoctorRating.belongsTo(Doctor, { foreignKey: 'doctorId' });
Doctor.hasMany(DoctorRating, { foreignKey: 'doctorId' });

// Mối quan hệ với Appointment
DoctorRating.belongsTo(Appointment, { foreignKey: 'appointmentId' });
Appointment.hasOne(DoctorRating, { foreignKey: 'appointmentId' });

module.exports = DoctorRating; 