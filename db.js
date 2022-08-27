const Sequelize = require('sequelize');
const { VIRTUAL, STRING, BOOLEAN } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_party_planner_database');

const Item = conn.define('item', {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  purchased: {
    type: BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  needed: {
    type: VIRTUAL,
    get: function(){
      return !this.purchased;
    }
  }
});

module.exports = {
  conn,
  Item
};
