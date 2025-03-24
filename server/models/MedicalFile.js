const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const MedicalRecordDetail = require('./MedicalRecordDetail');

const MedicalFile = sequelize.define('MedicalFile', {
    fileType: {
        type: DataTypes.ENUM('image', 'pdf', 'document'),
        allowNull: false
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileSize: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uploadDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Medicalfiles'
});

MedicalFile.belongsTo(MedicalRecordDetail, {
    foreignKey: 'recordDetailId',
    constraints: false,
    name: 'fk_medicalfile_recorddetail_id'
});

MedicalRecordDetail.hasMany(MedicalFile, {
    foreignKey: 'recordDetailId',
    constraints: false,
    name: 'fk_recorddetail_files'
});

module.exports = MedicalFile;