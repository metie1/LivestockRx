'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove all existing unique constraints on tag_number
    await queryInterface.removeConstraint('Animals', 'tag_number');
    await queryInterface.removeConstraint('Animals', 'tag_number_2');
    await queryInterface.removeConstraint('Animals', 'tag_number_3');
    await queryInterface.removeConstraint('Animals', 'tag_number_4');
    await queryInterface.removeConstraint('Animals', 'tag_number_5');
    await queryInterface.removeConstraint('Animals', 'tag_number_6');
    await queryInterface.removeConstraint('Animals', 'tag_number_7');
    await queryInterface.removeConstraint('Animals', 'tag_number_8');
    await queryInterface.removeConstraint('Animals', 'tag_number_9');
    await queryInterface.removeConstraint('Animals', 'tag_number_10');
    await queryInterface.removeConstraint('Animals', 'tag_number_11');
    await queryInterface.removeConstraint('Animals', 'tag_number_12');
    await queryInterface.removeConstraint('Animals', 'tag_number_13');
    await queryInterface.removeConstraint('Animals', 'tag_number_14');
    await queryInterface.removeConstraint('Animals', 'tag_number_15');
    await queryInterface.removeConstraint('Animals', 'tag_number_16');
    await queryInterface.removeConstraint('Animals', 'tag_number_17');
    await queryInterface.removeConstraint('Animals', 'tag_number_18');
    await queryInterface.removeConstraint('Animals', 'tag_number_19');
    await queryInterface.removeConstraint('Animals', 'tag_number_20');
    await queryInterface.removeConstraint('Animals', 'tag_number_21');
    await queryInterface.removeConstraint('Animals', 'tag_number_22');
    await queryInterface.removeConstraint('Animals', 'tag_number_23');
    await queryInterface.removeConstraint('Animals', 'tag_number_24');
    await queryInterface.removeConstraint('Animals', 'tag_number_25');
    await queryInterface.removeConstraint('Animals', 'tag_number_26');
    await queryInterface.removeConstraint('Animals', 'tag_number_27');
    await queryInterface.removeConstraint('Animals', 'tag_number_28');
    await queryInterface.removeConstraint('Animals', 'tag_number_29');
    await queryInterface.removeConstraint('Animals', 'tag_number_30');
    await queryInterface.removeConstraint('Animals', 'tag_number_31');
    await queryInterface.removeConstraint('Animals', 'tag_number_32');
    await queryInterface.removeConstraint('Animals', 'tag_number_33');
    await queryInterface.removeConstraint('Animals', 'tag_number_34');

    // Add the new unique constraint on tag_number and user_id
    await queryInterface.addConstraint('Animals', {
        fields: ['tag_number', 'user_id'],
        type: 'unique',
        name: 'Animals_tag_number_user_id_key'
    });
},

down: async (queryInterface, Sequelize) => {
    // Remove the new unique constraint
    await queryInterface.removeConstraint('Animals', 'Animals_tag_number_user_id_key');

    // Add back the original unique constraint on tag_number
    await queryInterface.addConstraint('Animals', {
        fields: ['tag_number'],
        type: 'unique',
        name: 'tag_number'
    });
}
};
