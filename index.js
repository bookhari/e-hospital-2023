const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const conn = require('./dbConnection/dbConnection');
const mongoClient = require('./dbConnection/mongodbConnection');
const mongoDb = mongoClient.getDb();
const body_parse = require('body-parser');
const app = express();
const upload = multer();
const port = process.env.PORT || 5000;


var sql = '';
var crypto = require('crypto')

app.use(body_parse.json());
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }));
// mongoClient.connectToServer();

app.get('/', (req, res) => {
    res.render("pages/index");
})
app.get('/services', (req, res) => {
    res.render("pages/services");
})
app.get('/index', (req, res) => {
    res.render("pages/index");
})

app.get('/Breast-Diagnostic', (req, res) => {
    res.render("pages/Breast-Diagnostic");
})

app.get('/Login', (req, res) => {
  errorMessage = '';
  res.render("pages/logina8b9",{
    error: errorMessage
  });
})
app.get('/register', (req, res) => {
    res.render("pages/register");
})
app.get('/signin', (req, res) => {
    res.render("pages/signin");
})
app.get('/doctorpasswordchange', (req, res) => {
    errorMessage = '';
    res.render("pages/doctorpasswordchange");
})
app.get('/patientpasswordchange', (req, res) => {
    errorMessage = '';
    res.render("pages/doctorpasswordchange");
})
app.get('/hospitalpasswordchange', (req, res) => {
    errorMessage = '';
    res.render("pages/hospitalpasswordchange");
})
app.get('/passwordresetmessage', (req, res) => {
    errorMessage = '';
    res.render("pages/passwordresetmessage");
})
app.post('/passwordreset', (req, res) => {
  const uuid = req.body.id;
  const newpassword = req.body.newpassword;
  const oldpassword = req.body.oldpassword;
  const prefix = uuid.split("-")[0];
  if(prefix === 'PAT'){
    sql = "UPDATE patients_registration SET password = ? WHERE password = ? AND uuid = ?";
  }

  else  if(prefix === 'HOS') {
    sql = "UPDATE hospital_admin SET password = ? WHERE password = ? AND uuid = ?";
  }

  else  if(prefix === 'DOC'){
    sql = "UPDATE doctors_registration SET password = ? WHERE password = ? AND uuid = ?";
  }
  conn.query(sql,[newpassword,oldpassword,uuid],(error, result) => {
      res.render('pages/passwordresetmessage');
  })

})
app.get('/patientLogin', (req, res) => {
    errorMessage = '';
    res.render("pages/patientLogin",{
      error: errorMessage
    });
})
app.get('/doctorLogin', (req, res) => {
    errorMessage = '';
    res.render("pages/doctorLogin",{
      error: errorMessage
    });
})
app.get('/hospitalLogin', (req, res) => {
    errorMessage = '';
    res.render("pages/hospitalLogin",{
      error: errorMessage
    });
})
app.get('/about', (req, res) => {
    res.render("pages/about-us");
})
app.get('/Contact', (req, res) => {
    res.render("pages/contact-us");
})
app.get('/thankyou', (req, res) => {
    res.render("pages/thankyou");
})
app.get('/post', (req, res) => {
    res.render("pages/post");
})
app.get('/create-account.html', (req, res) => {
    res.render("pages/create-account");
})
app.get('/patientRegister', (req, res) => {
    res.render("pages/patient");
})
app.get('/DoctorRegister', (req, res) => {
    res.render("pages/doctorRegister");
})
app.get('/b', (req, res) => {
    res.render("pages/b");
})
app.get('/hospital', (req, res) => {
    res.render("pages/hospital");
})

// Lab reterival
app.get('/lab', (req, res) => {
  res.render("pages/lab");
})
app.get('/contact-us', (req, res) => {
  res.render("pages/contact-us");
});

app.post('/send-contact-form', (req, res) => {

  // Define mandatory parameters
  const SENDER_EMAIL = "ehospital112233@gmail.com";
  const SENDER_PASS = "hlcvsrrzempexzhw";
  const RECEIVER_NAME = req.body.userName;
  const RECEIVER_EMAIL = req.body.userEmail;
  const USER_MESSAGE = req.body.userMessage;

  var VALID_INPUTS = true;


  if(Boolean(!RECEIVER_NAME)||Boolean(!RECEIVER_EMAIL)||Boolean(!USER_MESSAGE)){
    VALID_INPUTS = false;
  }

  // Function to call to nodemailer
  if(VALID_INPUTS){
    const nodeMailer = require("nodemailer");
    const html = `
      <h3> E-Hospital: Your contact us response </h3>
      <p> Hi ${RECEIVER_NAME}, </p>
      <br>
      Thank you for your email. This is to notify you that we have received your contact-us query.
      We will respond in 3-5 business days. The following is the query for your records.
      <br>
      <p> Name: ${RECEIVER_NAME} </p>
      <p> Email: ${RECEIVER_EMAIL} </p>
      <p> Message: ${USER_MESSAGE} </p>
    `;

    // Respond to the request and alert the user.
    res.send(`
    <script>alert("Thank you ${RECEIVER_NAME}. Your response has been recorded."); 
      window.location.href = "/contact-us";
    </script>`
    );

    async function main() {
      const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: SENDER_EMAIL,
          pass: SENDER_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const info = await transporter.sendMail({
        from: SENDER_EMAIL,
        to: RECEIVER_EMAIL,
        subject: "Your Contact Us Query to E-Hospital",
        html: html,
      });
      console.log("Message sent: " + info.messageId);
    }

    main().catch((e) => {
      console.log(e);
    });
  } 
  else{
    // Respond to the user that inputs are invalid
    res.send(`
    <script>alert("Your inputs are invalid. Make sure that every field is filled."); 
      window.location.href = "/contact-us";
    </script>`
    );

  }
})

app.post('/Hospital_DashBoard', (req, res) => { // For the Admin Credentials:  (Admin , Admin)

  const uuid = req.body.email;
  const password = req.body.password;

  sql = "SELECT * FROM `hospital_admin` WHERE uuid = ? AND verification = ?";
  conn.query(sql,[uuid, true],(error, result) => {
    if(result.length == 0){
      var errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";
      res.render('pages/hospitalLogin',{
        error: errorMessage
      })
    } else {
     var hospital_data = result[0];
       if (error) {
        var errorMessage = "Issue with initiating a request. Check the credentials . Please Try again Later";
        res.render('pages/hospitalLogin',{
          error: errorMessage
        })
      }
      if (result[0].uuid === uuid && result[0].password === password) {
        var patients_data;
        var doctors_data;
        sql = "SELECT * FROM `doctors_registration` WHERE 1";
        conn.query(sql, (error, result) => {
          if (error) throw error
          doctors_data   = result;
          sql = "SELECT * FROM `patients_registration` WHERE 1";
          conn.query(sql, (error, result) => {
            patients_data = result;

            if (error) throw error
            res.render("pages/Dashboard/HospitalDashBoard", {
              patients: patients_data,
              doctors: doctors_data,
              hospital: hospital_data
            });
          })
        })
      } else {
        var errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";
        res.render('pages/hospitalLogin',{
          error: errorMessage
        })
      }
    }
      })
})
app.get('/HealthCare_DashBoard', (req, res) => {
    res.render("pages/Dashboard/HealthCare_DashBoard");
})

app.post('/DoctorsDashBoard', (req, res) => {
  const uuid = req.body.email;
  const password = req.body.password;
  sql = 'SELECT * FROM `doctors_registration` WHERE uuid =  ? AND verification = ?';
  conn.query(sql,[uuid,true],(error, result) => {
      if (error) throw error
      if(result.length == 0){
        errorMessage = 'Either ID or Password is wrong or your account is not verified. Please Check';
        res.render("pages/doctorLogin",{
          error: errorMessage
        });
      } else {
      if (result[0].uuid === uuid && result[0].password === password) {
        var patients_data;
        var doctors_data;
        doctors_data   = result[0];
        console.log(doctors_data);
          sql = "SELECT * FROM `patients_registration` WHERE 1";
          conn.query(sql, (error, result) => {
            patients_data = result;
            if (error) throw error
            res.render("pages/Dashboard/DoctorDashBoard", {
              patients: patients_data,
              doctor: doctors_data
            });
        })
      } else {
        errorMessage = 'Either ID or Password is wrong or your account is not verified. Please Check';
        res.render("pages/doctorLogin",{
          error: errorMessage
        });
      }
    }
      })
})

app.post('/patientsDashboard', (req, res) => {
  const uuid = req.body.email;
  const password = req.body.password;
  sql = 'SELECT * FROM `patients_registration` WHERE uuid =  ? AND verification = ?';
  console.log(sql);
  conn.query(sql, [uuid,true] ,(error, result) => {
      if (error) throw error
      if(result.length == 0){
        var errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";
        res.render('pages/patientLogin',{    //patientsDashboard
          error: errorMessage
        })
      } else {
      if (result[0].uuid === uuid && result[0].password === password) {
        var patients_data = result[0];
          res.render("pages/Dashboard/patientsDashboard", {
              patient: patients_data,
            });
        }
        else {
          var errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";
          res.render('pages/patientLogin',{
            error: errorMessage
          })
        }
      }
      })
})

//Editable

app.get('/patientsDashboardEdit', (req, res) => {
  const uuid = req.query.id;
  const fname = req.query.fname;
  const MName = req.query.MName;
  const LName = req.query.LName;
  const MobileNumber = req.query.MobileNumber;
  const Age = req.query.Age;
  const BloodGroup = req.query.BloodGroup;
  const Location = req.query.Location;
  console.log(MName)
  
  sql = "UPDATE patients_registration SET FName = ?, MName = ? , LName = ? , MobileNumber = ? , Age = ? , BloodGroup = ? , Location = ?  WHERE uuid =  ?";
  conn.query(sql,[fname,MName,LName,MobileNumber,Age,BloodGroup,Location,uuid],(error, result) => {
    // console.log(result);
    //var patients_data = "result[0]";
    // res.render("pages/Dashboard/patientsDashboard", {
    //   patient: patients_data,
      
    // })
  
  })

})

app.post('/patientsDashboardEditTest', (req, res) => {
  const uuid = req.body.email;
  const password = req.body.password;
  const Fname = req.body.Fname;

  sql = 'SELECT * FROM `patients_registration` WHERE uuid =  ? AND verification = ?';
  console.log(sql);
  conn.query(sql, [uuid,true] ,(error, result) => {
      if (error) throw error
      if(result.length == 0){
        var errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";
        res.render('pages/patientLogin',{    //patientsDashboard
          error: errorMessage
        })
      } else {
      if (result[0].uuid === uuid && result[0].password === password) {
        var patients_data = result[0];
        
         sql = "UPDATE patients_registration SET FName = ? WHERE uuid =  ? AND verification = ?";
        conn.query(sql,[Fname,uuid,true],(error, result) => {
          
          res.render("pages/Dashboard/patientsDashboard", {
            patient: patients_data,
          });
      })
        }
        else {
          var errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";
          res.render('pages/patientLogin',{
            error: errorMessage
          })
        }
      }
      })
})

app.post('/get_patientInfo', (req, res) => {
    const getDetails = req.body
    let uuid = "PAT-"+ "ON-" + getDetails.Age + "-" + getDetails.province + "-" + Math.floor(Math.random()*90000) + 10000;
    var password = crypto.randomBytes(16).toString("hex");
    sql = "INSERT INTO `patients_registration`(`FName`, `MName`, `LName`, `Age`, `BloodGroup`, `MobileNumber`, `EmailId`, `Address`, `Location`, `PostalCode`, `City`, `Province`, `HCardNumber`, `PassportNumber`, `PRNumber`, `DLNumber`, `Gender`, `uuid`, `verification`, `password`) VALUES ?";
    var VALUES = [[getDetails.Fname, getDetails.Mname,
    getDetails.LName, getDetails.Age, getDetails.bloodGroup, getDetails.number,
    getDetails.EmailId, getDetails.Address, getDetails.Location, getDetails.PostalCode, getDetails.City, getDetails.province, getDetails.H_CardNo,
    getDetails.PassportNo, getDetails.PRNo, getDetails.DLNo, getDetails.gender, uuid, true, password]]

    conn.query(sql, [VALUES], (error, result) => {
        if (error) throw error
        res.render("pages/thankyou");
    })
    sms();

    async function sms(){

      const accountSid = 'ACcd90ad6235243c49f5f806ddbbcf26d1'; //process.env.TWILIO_ACCOUNT_SID;
      const authToken = '05c14694c309118ab18ae8c12c4a208d'; //process.env.TWILIO_AUTH_TOKEN;
      
      const client = require('twilio')(accountSid, authToken,{
        logLevel: 'debug'
      });
      
      client.messages
            .create({body: '\n\n E-Hospital Account \n User: '+uuid+ ' \n Password: '+password
            , from: '+13433074905', to: getDetails.number})
            .then(message => console.log(message.dateCreated));    //message.sid
              }
}
)



app.post('/get_doctorInfo', (req, res) => {
    const get_doctorInfo = req.body
    var password = crypto.randomBytes(16).toString("hex");
    let uuid = "DOC-"+ "ON-" + get_doctorInfo.age + "-" + get_doctorInfo.province + "-" + Math.floor(Math.random()*90000) + 10000;
    // let randomId = Math.floor(Math.random()*90000) + 10000;
    sql = 'INSERT INTO `doctors_registration`(`Fname`, `Mname`, `Lname`, `Age`, `bloodGroup`, `MobileNumber`, `EmailId`, `ConfirmEmail`, `Location1`, `Location2`, `PostalCode`, `City`, `Country`, `Province`, `Medical_LICENSE_Number`, `DLNumber`, `Specialization`, `PractincingHospital`, `Gender`, `uuid`, `verification`, `password`) VALUES ?';

    var getDoctorsInfo = [[get_doctorInfo.Fname, get_doctorInfo.Mname,
    get_doctorInfo.LName, get_doctorInfo.age, get_doctorInfo.bloodGroup, get_doctorInfo.MobileNo,
    get_doctorInfo.EmailId, get_doctorInfo.ConfirmEmail, get_doctorInfo.Location1, get_doctorInfo.Location1, get_doctorInfo.PostalCode, get_doctorInfo.city, get_doctorInfo.Country, get_doctorInfo.province, get_doctorInfo.MLno,
    get_doctorInfo.DLNo, get_doctorInfo.Specialization, get_doctorInfo.PractincingHospital, get_doctorInfo.gender, uuid, true, password]]

    conn.query(sql, [getDoctorsInfo], (error, result) => {
        if (error) throw error
      res.render("pages/thankyou");
    })
    sms();

    async function sms(){

      const accountSid = 'ACcd90ad6235243c49f5f806ddbbcf26d1'; //process.env.TWILIO_ACCOUNT_SID;
      const authToken = '05c14694c309118ab18ae8c12c4a208d'; //process.env.TWILIO_AUTH_TOKEN;
      
      const client = require('twilio')(accountSid, authToken,{
        logLevel: 'debug'
      });
      
      client.messages
            .create({body: '\n\n E-Hospital Account \n User: '+uuid+ ' \n Password: '+password
            , from: '+13433074905', to: get_doctorInfo.MobileNo})
            .then(message => console.log(message.dateCreated));    //message.sid
              }
})


app.post('/recordUpdate', upload.single("image"), (req,res) => {
  // console.log(req.file);
  // console.log(req.value);
  // console.log(mongoDb);
 
  // Check file extension path.extname()
  if (typeof req.file != 'undefined') {
    if (path.extname(req.file.originalname) == ".jpeg") {
      const form = new FormData();
      const file = req.file;
      form.append('image', file.buffer, file.originalname);
      form.append('value', "0");
    
      const response = axios.post('http://localhost:5000/connectionTesting', form)
        .then(async response => {
          console.log(`Status: ${response.status}`)
          // const result = await mongoDb.collection("test").insertOne(req.file);
          // console.log(`New image created with the following id: ${result.insertedId}`);
          res.send({message: response.data});
        })
        .catch(err => {
          console.error(err)
          res.send({error: err});
      })
    
    } else {
      res.send({error: "The file is in the wrong format."});
    }
  } else {
    res.send({error: "File not receive."});
  }

})

// This is a connection testing api 
app.post('/connectionTesting', upload.single("image"), (req,res) => {
  console.log("Request receive.");
  console.log(req.file);
  console.log(req.body);
  res.send("Request received by test api.");
})

app.post('/Hospital', (req, res) => {
    const get_HospitalInfo = req.body;
    var password = crypto.randomBytes(16).toString("hex");
    sql = "INSERT INTO `hospital_admin`(`Hospital_Name`, `Email_Id`, `Confirm_Email`, `Location1`, `Location2`, `PostalCode`, `City`, `Province`, `Country`, `Facilities_departments`, `Number_Doctors`, `Number_Nurse`, `No_Admins`, `Patients_per_year`, `Tax_registration_number`, `uuid`, `verification`, `password`) VALUES ?";

    var getDoctorsInfo = [[get_HospitalInfo.Hospital_Name,
    get_HospitalInfo.EmailId, get_HospitalInfo.ConfirmEmail, get_HospitalInfo.Location1, get_HospitalInfo.Location1, get_HospitalInfo.PostalCode, get_HospitalInfo.city, get_HospitalInfo.Country, get_HospitalInfo.province,
    get_HospitalInfo.Facilities_departments, get_HospitalInfo.DoctorNo, get_HospitalInfo.N_Nureses, get_HospitalInfo.No_Admin, get_HospitalInfo.PatientsPerYear, get_HospitalInfo.TaxRegNo, "HOS-" + Math.floor(Math.random()*90000) + 10000, false, password
    ]]

    conn.query(sql, [getDoctorsInfo], (error, result) => {
        if (error) throw error
        res.render("pages/thankyou");
    })
})

const nodemailer = require("nodemailer");


// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: "gmail",
auth:{
     user:'ehospital112233@gmail.com',
     pass:'hlcvsrrzempexzhw'
    }
  });




// Lab Registration

app.post('/Lab', (req, res) => {
  const get_LabInfo = req.body;
  var uniqueID = "HOS-" + Math.floor(Math.random()*90000) + 10000;
  var password = crypto.randomBytes(16).toString("hex");
  email=req.body.ConfirmEmail;
  
  var login_url = 'http://www.e-hospital.ca/signin';
  transporter.sendMail({
    from: "ehospital112233@gmail.com", // sender address
    to:email, // list of receivers
    subject: "Your E-Lab account confirmed", // Subject line
    html: `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Lab Registration Confirmation</title>
</head>
<body>
  <h1>Lab Registration Confirmation</h1>
  <p> Hi There,</p>
  <p>We are pleased to confirm your registration for the ${get_LabInfo.Lab_Name}.</p>
  <p>Details of your registration:</p>
  <ul>
    <li>Email: ${get_LabInfo.EmailId}</li>
  </ul>
  <p>Best regards,</p>
  <p>E-Hospital</p>
  <p>http://e-hospital.ca/</p>

</body>
</html>

 `, // html body
});


  sql = "INSERT INTO `lab_admin`(`Lab_Name`, `Email_Id`, `Confirm_Email`, `Location1`, `Location2`, `PostalCode`, `City`, `Country` ,`Province`, `Ref_Phy_Name`, `Ref_Phy_Con_Info`, `Insu_Info`, `Payment_Metho`, `uuid`, `verification`, `password`, `TRN`) VALUES ?;";

  var getLabInfo = [[get_LabInfo.Lab_Name,get_LabInfo.EmailId, get_LabInfo.ConfirmEmail, get_LabInfo.Location1, get_LabInfo.Location2, get_LabInfo.PostalCode, get_LabInfo.city, get_LabInfo.Country, get_LabInfo.province, get_LabInfo.Ref_Phy_Name, get_LabInfo.Ref_Phy_Con_Info, get_LabInfo.Insu_Info, get_LabInfo.Payment_Metho, uniqueID, password,false, get_LabInfo.Tax_registration_number]]

  conn.query(sql, [getLabInfo], (error, result) => {
      if (error) throw error
      res.render("pages/thankyou");
      
  })
}
)

// app.post('/masterDashboard', (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     sql = "SELECT * FROM `master_admin` WHERE 1";
//     conn.query(sql, (error, result) => {
//       if(result.length == 0) {
//         var errorMessage = "ID or Password is wrong. Please Try again";
//         res.render('pages/logina8b9',{
//           error: errorMessage
//         })
//       } else {
//         if (error) {
//           res.send(error);
//         }
//         if (result[1].userName === email && result[1].password === password) {
//           var patients_data;
//           var doctors_data;
//           var hospitals_data;
//           sql = "SELECT * FROM `doctors_registration` WHERE 1";
//           conn.query(sql, (error, result) => {
//             if (error) throw error
//             doctors_data   = result;
//             sql = "SELECT * FROM `patients_registration` WHERE 1";
//             conn.query(sql, (error, result) => {
//               patients_data = result;
//               if (error) throw error
//               sql = "SELECT * FROM `hospital_admin` Order by id DESC";
//               conn.query(sql, (error, result) => {
//                 hospitals_data = result
//                 if (error) throw error
//                 res.render("pages/Dashboard/MasterDashboard", {
//                   patients: patients_data,
//                   doctors: doctors_data,
//                   hospitals: hospitals_data
//                 });
//               })
//             })
//           })
//         } else {
//           var errorMessage = "ID or Password is wrong. Please Try again";
//           res.render('pages/logina8b9',{
//             error: errorMessage
//           })
//         }
//       }
//     })
// })

app.get('/hospitalData', (req, res) => {
    sql = "SELECT * FROM `hospital_admin` Order by id DESC";
    conn.query(sql, (error, result) => {
        res.send(result)
        if (!error) {
            res.render(result)
        }
    })
})

// user: "uottawabiomedicalsystems@gmail.com", //
// pass: "@uOttawa5902",

const twilio = require("twilio");

app.get('/sendEmail', (req, res) => {

  usertype = req.query.usertype;
    var uniqueID = ''
    var password = '';
    var sql = '';
    if(usertype === 'pat'){
      sql = "SELECT * FROM `patients_registration` WHERE id = ?";
    }

    else  if(usertype === 'hos') {
      sql = "SELECT * FROM `hospital_admin` WHERE id = ?";
    }

    else  if(usertype === 'doc'){
      sql = "SELECT * FROM `doctors_registration` WHERE id = ?";
    }

    conn.query(sql,[req.query.id],(error, result) => {
      if (error) throw error
      uniqueID = result[0].uuid;
      password = result[0].password;
      MobileNo = result[0].MobileNumber;
      email = result[0].EmailId || result[0].Email_Id;

      if(usertype === 'pat' || usertype === 'doc'){
        fname = result[0].Fname;
        lname = result[0].Lname;
        name = fname +" "+lname;
      }

      else  if(usertype === 'hos') {
        name = result[0].Hospital_Name;
      }

      // console.log(uniqueID);
      // console.log(password);

      main();

    });


    "use strict";
    const nodemailer = require("nodemailer");

        async function main() {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: "ehospital112233@gmail.com",//add your smtp server
                    pass: "hlcvsrrzempexzhw"//with password
                },
            });

            var login_url = 'http://www.e-hospital.ca/signin';
            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: "ehospital112233@gmail.com", // sender address
                to: email, // list of receivers
                subject: "Your E-Hospital account confirmed", // Subject line
                html: `
            <h1>This is to confirm that, your registration with E-Hospital is completed</h1> <br/>
            <h3>Please use the below details to login</h3> <br/>
            <div>
            <strong> Name : ${name}</strong> </br>
            </div>
            <div>
            <strong> Unique-Id : ${uniqueID}</strong> </br>
            </div>
            <div>
            <strong> Password : ${password}</strong> </br>
            </div>
            <div>
            <strong> Login Link : ${login_url}</strong> </br>
            </div> `, // html body
            });

            if (info.messageId) {
              var sql = '';
              if(usertype === 'pat'){
                sql = "UPDATE patients_registration SET verification = ? WHERE id = ?";
                sms();
              }

              else  if(usertype === 'hos') {
                sql = "UPDATE hospital_admin SET verification = ? WHERE id = ?";
              }

              else  if(usertype === 'doc'){
                sql = "UPDATE doctors_registration SET verification = ? WHERE id = ?";
              }
              conn.query(sql,[true,req.query.id],(error, result) => {
                if (error) throw error
                res.json({status: true});
              });
            }

        }

async function sms(){

const accountSid = 'ACcd90ad6235243c49f5f806ddbbcf26d1'; //process.env.TWILIO_ACCOUNT_SID;
const authToken = '05c14694c309118ab18ae8c12c4a208d'; //process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken,{
  logLevel: 'debug'
});

client.messages
      .create({body: '\n\n E-Hospital Account \n User: '+uniqueID+ ' \n Password: '+password
      , from: '+13433074905', to: MobileNo})
      .then(message => console.log(message.dateCreated));    //message.sid
        }
    })








app.listen(port, () => console.log(`Server running on the port : ${port}`))
