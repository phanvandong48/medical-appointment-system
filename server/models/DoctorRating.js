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
DoctorRating.belongsTo(User, {
    foreignKey: 'patientId',
    as: 'patient',
    constraints: false,
    name: 'fk_doctorrating_patient_id'
});

User.hasMany(DoctorRating, {
    foreignKey: 'patientId',
    constraints: false,
    name: 'fk_user_doctorratings'
});

// Mối quan hệ với Doctor
DoctorRating.belongsTo(Doctor, {
    foreignKey: 'doctorId',
    constraints: false,
    name: 'fk_doctorrating_doctor_id'
});

Doctor.hasMany(DoctorRating, {
    foreignKey: 'doctorId',
    constraints: false,
    name: 'fk_doctor_ratings'
});

// Mối quan hệ với Appointment
DoctorRating.belongsTo(Appointment, {
    foreignKey: 'appointmentId',
    constraints: false,
    name: 'fk_doctorrating_appointment_id'
});

Appointment.hasOne(DoctorRating, {
    foreignKey: 'appointmentId',
    constraints: false,
    name: 'fk_appointment_doctorrating'
});

module.exports = DoctorRating; 