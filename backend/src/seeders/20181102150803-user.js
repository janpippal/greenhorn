'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user',

      [{
        name: 'Karel Zaměstnanec',
        email: 'karel.zamestnanec@greenhorn.com',
        password: 'karel',
        mobile:'686493573',
        role_id: 1,
        department_id: 1,
        jobPosition_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Aneta Bednaříková',
        email: 'aneta.bednarikova@greenhorn.com',
        password: 'aneta',
        mobile:'122666999',
        role_id: 1,
        department_id: 1,
        jobPosition_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Taťána Chromá',
        email: 'tatana.chroma@greenhorn.com',
        password: 'tatana',
        mobile:'777556489',
        role_id: 2,
        department_id: 1,
        jobPosition_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Josef Hlavatý',
        email: 'josef.hlavaty@greenhorn.com',
        password: 'josef',
        mobile:'255998655',
        role_id: 2,
        department_id: 2,
        jobPosition_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Kateřina Svobodová',
        email: 'katerina.svobodova@greenhorn.com',
        password: 'katka',
        mobile:'707169333',
        role_id: 2,
        department_id: 3,
        jobPosition_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Hana ZamHRDev',
        email: 'hana.zamHrDev@greenhorn.com',
        password: 'hana',
        mobile:'634824517',
        role_id: 1,
        department_id: 1,
        jobPosition_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Hugo zamHRTst',
        email: 'hugo.zamHRTst@greenhorn.com',
        password: 'hugo',
        mobile:'448504640',
        role_id: 1,
        department_id: 1,
        jobPosition_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Henry ZamHRMng',
        email: 'henry.zamHRMng@greenhorn.com',
        password: 'henry',
        mobile:'596202117',
        role_id: 1,
        department_id: 1,
        jobPosition_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Igor ZamITDev',
        email: 'igor.zamITDev@greenhorn.com',
        password: 'igor',
        mobile:'691858264',
        role_id: 1,
        department_id: 2,
        jobPosition_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Ivan ZamITTst',
        email: 'ivan.zamITst@greenhorn.com',
        password: 'ivan',
        mobile:'792885879',
        role_id: 1,
        department_id: 2,
        jobPosition_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Iveta ZamITMng',
        email: 'iveta.zamITMng@greenhorn.com',
        password: 'iveta',
        mobile:'851470042',
        role_id: 1,
        department_id: 2,
        jobPosition_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Filip ZamFinDev',
        email: 'filip.zamFinDev@greenhorn.com',
        password: 'filip',
        mobile:'699800671',
        role_id: 1,
        department_id: 3,
        jobPosition_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Frida ZamFinTst',
        email: 'frida.zamFinTst@greenhorn.com',
        password: 'frida',
        mobile:'823287308',
        role_id: 1,
        department_id: 3,
        jobPosition_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Felix ZamFinMng',
        email: 'felix.zamFinMng@greenhorn.com',
        password: 'felix',
        mobile:'690950859',
        role_id: 1,
        department_id: 3,
        jobPosition_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Alena ZamAccDev',
        email: 'alena.zamAccDev@greenhorn.com',
        password: 'alena',
        mobile:'723561094',
        role_id: 1,
        department_id: 4,
        jobPosition_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Anton ZamAccTst',
        email: 'anton.zamAccTst@greenhorn.com',
        password: 'anton',
        mobile:'688650027',
        role_id: 1,
        department_id: 4,
        jobPosition_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Amy ZamAccMng',
        email: 'amy.zamAccMng@greenhorn.com',
        password: 'amy',
        mobile:'647358384',
        role_id: 1,
        department_id: 4,
        jobPosition_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Marie AdminHR',
        email: 'marie.AdminHR@greenhorn.com',
        password: 'marie',
        mobile:'653553537',
        role_id: 2,
        department_id: 1,
        jobPosition_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Hope AdminHR',
        email: 'hope.adminHR@greenhorn.com',
        password: 'hope',
        mobile:'635389237',
        role_id: 2,
        department_id: 1,
        jobPosition_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Anna AdminIT',
        email: 'anna.AdminIT@greenhorn.com',
        password: 'anna',
        mobile:'889449053',
        role_id: 2,
        department_id: 2,
        jobPosition_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Ilona AdminIT',
        email: 'ilona.AdminIT@greenhorn.com',
        password: 'ilona',
        mobile:'735679053',
        role_id: 2,
        department_id: 2,
        jobPosition_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Franta AdminFin',
        email: 'franta.AdminFin@greenhorn.com',
        password: 'franta',
        mobile:'849928599',
        role_id: 2,
        department_id: 3,
        jobPosition_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Fabio AdminFin',
        email: 'fabio.adminFin@greenhorn.com',
        password: 'fabio',
        mobile:'863028599',
        role_id: 2,
        department_id: 3,
        jobPosition_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Tudor AdminAcc',
        email: 'tudor.AdminAcc@greenhorn.com',
        password: 'tudor',
        mobile:'686493573',
        role_id: 2,
        department_id: 4,
        jobPosition_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Adam AdminAcc',
        email: 'Adam.adminAcc@greenhorn.com',
        password: 'Adam',
        mobile:'673645573',
        role_id: 2,
        department_id: 4,
        jobPosition_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }],
    {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', null, {});
  }
};
