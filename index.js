//syed
const express = require('express');
const conn = require('./dbConnection/dbConnection')
const body_parse = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
var sql = '';
var crypto = require('crypto')

app.use(body_parse.json());
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.render("pages/index");
})
app.get('/services', (req, res) => {
    res.render("pages/services");
})
app.get('/index', (req, res) => {
    res.render("pages/index");
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
        res.render('pages/patientLogin',{
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

app.post('/get_patientInfo', (req, res) => {

    const getDetails = req.body
    let uuid = "PAT-"+ "ON-" + getDetails.Age + "-" + getDetails.province + "-" + Math.floor(Math.random()*90000) + 10000;
    var password = crypto.randomBytes(16).toString("hex");
    sql = "INSERT INTO `patients_registration`(`FName`, `MName`, `LName`, `Age`, `BloodGroup`, `MobileNumber`, `EmailId`, `Address`, `Location`, `PostalCode`, `City`, `Province`, `HCardNumber`, `PassportNumber`, `PRNumber`, `DLNumber`, `Gender`, `uuid`, `verification`, `password`) VALUES ?";
    var VALUES = [[getDetails.Fname, getDetails.Mname,
    getDetails.LName, getDetails.Age, getDetails.bloodGroup, getDetails.number,
    getDetails.EmailId, getDetails.Address, getDetails.Location, getDetails.PostalCode, getDetails.City, getDetails.province, getDetails.H_CardNo,
    getDetails.PassportNo, getDetails.PRNo, getDetails.DLNo, getDetails.gender, uuid, false, password]]

    conn.query(sql, [VALUES], (error, result) => {
        if (error) throw error
        res.render("pages/thankyou");
    })
})
app.post('/get_doctorInfo', (req, res) => {
    const get_doctorInfo = req.body
    var password = crypto.randomBytes(16).toString("hex");
    let uuid = "DOC-"+ "ON-" + get_doctorInfo.age + "-" + get_doctorInfo.province + "-" + Math.floor(Math.random()*90000) + 10000;
    // let randomId = Math.floor(Math.random()*90000) + 10000;
    sql = 'INSERT INTO `doctors_registration`(`Fname`, `Mname`, `Lname`, `Age`, `bloodGroup`, `MobileNumber`, `EmailId`, `ConfirmEmail`, `Location1`, `Location2`, `PostalCode`, `City`, `Country`, `Province`, `Medical_LICENSE_Number`, `DLNumber`, `Specialization`, `PractincingHospital`, `Gender`, `uuid`, `verification`, `password`) VALUES ?';

    var getDoctorsInfo = [[get_doctorInfo.Fname, get_doctorInfo.Mname,
    get_doctorInfo.LName, get_doctorInfo.age, get_doctorInfo.bloodGroup, get_doctorInfo.MobileNo,
    get_doctorInfo.EmailId, get_doctorInfo.ConfirmEmail, get_doctorInfo.Location1, get_doctorInfo.Location1, get_doctorInfo.PostalCode, get_doctorInfo.city, get_doctorInfo.Country, get_doctorInfo.province, get_doctorInfo.MLno,
    get_doctorInfo.DLNo, get_doctorInfo.Specialization, get_doctorInfo.PractincingHospital, get_doctorInfo.gender, uuid, false, password]]

    conn.query(sql, [getDoctorsInfo], (error, result) => {
        if (error) throw error
      res.render("pages/thankyou");
    })
})
app.post('/Hospital', (req, res) => {
    const get_HospitalInfo = req.body;
    var password = crypto.randomBytes(16).toString("hex");
    sql = "INSERT INTO `hospital_admin`(`Hospital_Name`, `Email_Id`, `Confirm_Email`, `Location1`, `Location2`, `PostalCode`, `City`, `Province`, `Country`, `Facilities_departments​`, `Number_Doctors`, `Number_Nurse`, `No_Admins`, `Patients_per_year`, `​Tax_registration_number​`, `uuid`, `verification`, `password`) VALUES ?";

    var getDoctorsInfo = [[get_HospitalInfo.Hospital_Name,
    get_HospitalInfo.EmailId, get_HospitalInfo.ConfirmEmail, get_HospitalInfo.Location1, get_HospitalInfo.Location1, get_HospitalInfo.PostalCode, get_HospitalInfo.city, get_HospitalInfo.Country, get_HospitalInfo.province,
    get_HospitalInfo.Facilities_departments, get_HospitalInfo.DoctorNo, get_HospitalInfo.N_Nureses, get_HospitalInfo.No_Admin, get_HospitalInfo.PatientsPerYear, get_HospitalInfo.TaxRegNo, "HOS-" + Math.floor(Math.random()*90000) + 10000, false, password
    ]]

    conn.query(sql, [getDoctorsInfo], (error, result) => {
        if (error) throw error
        res.render("pages/thankyou");
    })
})

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
      email = result[0].EmailId || result[0].Email_Id;

      if(usertype === 'pat' || usertype === 'doc'){
        fname = result[0].Fname;
        lname = result[0].Lname;
        name = fname +" "+lname;
      }

      else  if(usertype === 'hos') {
        name = result[0].Hospital_Name;
      }

      console.log(uniqueID);
      console.log(password);

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
        // main().catch(console.error);
    })

app.listen(port, () => console.log(`Server running on the port : ${port}`))
