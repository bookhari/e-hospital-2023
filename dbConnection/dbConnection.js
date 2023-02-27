const mysql = require('mysql');

var db = mysql.createConnection(
  {
    host: "frwahxxknm9kwy6c.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",

    user: "j6qbx3bgjysst4jr",
    password: 'mcbsdk2s27ldf37t',
    database: 'evjygdytdp2ev0d',
    port: 3306
}

// 'mysql://j6qbx3bgjysst4jr:mcbsdk2s27ldf37t@frwahxxknm9kwy6c.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/nkw2tiuvgv6ufu1z'
)

db.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');
  });

module.exports = db
