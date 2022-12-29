const mysql = require('mysql');

var db = mysql.createConnection(
//   {
//     host: "cwe1u6tjijexv3r6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
//     user: "mxoscy1pyrqkpc04",
//     password: 'qhqcut72vwxyl8k9',
//     database: 'evjygdytdp2ev0d',
//     port: 3306
// }
'mysql://j6qbx3bgjysst4jr:mcbsdk2s27ldf37t@frwahxxknm9kwy6c.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/nkw2tiuvgv6ufu1z'
)

db.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');
  });

module.exports = db
