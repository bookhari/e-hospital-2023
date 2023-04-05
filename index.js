const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const conn = require('./dbConnection/dbConnection');
const mongoClient = require('./dbConnection/mongodbConnection');
const mongoDb = mongoClient.getDb();
const body_parse = require('body-parser');
const app = express();
const fs = require('fs');
const FormData = require('form-data');
const memoryStorage = multer.memoryStorage()
const upload = multer({ storage: memoryStorage })


const port = process.env.PORT || 5000;


/* Please use comments to identify your work thankyou */

var sql = '';
var crypto = require('crypto')


app.use(body_parse.json());
app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
// mongoClient.connectToServer();

app.get('/', (req, res) => {
  res.render("pages/index");
})

/* TaskName -Alzheimers Detecction

 (Parisa) - Team8, Course-BMG5111

*/

app.get('/AlzheimerMRIDetection', (req, res) => {

  res.render("pages/AlzheimerMRIDetection");
})

// Hamza Khan Team for Specialities Page
app.get('/specialities', (req, res) => {
  res.render("pages/specialities");
})
//// Hamza Khan Team for Specialities Page

app.get('/pneumoniahome', (req, res) => {
  res.render("pages/index");
})
app.get('/heartdiseasefrontend', (req, res) => {
  res.render("pages/heartdiseasefrontend");
})
app.get('/respiratorymedicine', (req, res) => {
  // Send a GET request to the Flask app's /pneumonia endpoint to get the HTML content of the page
  axios.get('https://mlmodel2.herokuapp.com/pneumonia')
    .then(response => {
      // The response data contains the HTML content of the page
      const html = response.data;

      // Set the Content-Type header to text/html
      res.set('Content-Type', 'text/html');

      // Send the HTML content of the page as the response
      res.send(html);
      console.log(req)
    })
    .catch(error => {
      // If an error occurs, log the error and send a 500 Internal Server Error response
      console.error(error);
      res.sendStatus(500);
    });
});


app.post('/pneumoniapredict', upload.single('image'), (req, res) => {
  const form = new FormData();

  // Get the uploaded image file from the request body
  const imageFile = req.file

  // Convert the image file to a buffer and add it to the form data
  const imageData = fs.readFileSync(imageFile.path);
  form.append('image', imageData, { filename: 'image.jpg', contentType: 'image/jpeg' });


  // Send a POST request to the Flask app's /pneumoniapredict endpoint with the image data
  axios.post('https://mlmodel2.herokuapp.com/pneumoniapredict', form, {
    headers: form.getHeaders()
  })
    .then(response => {
      // The response data contains the HTML content of the predict page
      const html = response.data;
      res.set('Content-Type', 'text/html');
      res.send(html);
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});


app.get('/respiratoryMedicine2', (req, res) => {
  res.render('pages/respiratoryMedicine', { message: '', prediction: '' });
});

// Set up a route to handle form submissions and post to the Flask app
app.post('/predict', upload.single('file'), (req, res) => {
  const form = new FormData();
  // Construct the URL of the Flask app's /predict endpoint


  const imageFile = req.file

  // Convert the image file to a buffer and add it to the form data
  const imageData = fs.readFileSync(imageFile.path);
  form.append('file', imageData, { filename: 'image.jpg', contentType: 'image/jpeg' });


  // Send a POST request to the Flask app's /pneumoniapredict endpoint with the image data
  axios.post('http://127.0.0.1:5000/predict', form, {
    headers: form.getHeaders()
  })
    .then(response => {
      // The response data contains the HTML content of the predict page
      const prediction = response.data;
      res.render('pages/respiratoryMedicine', { message: 'File uploaded successfully', prediction: prediction });

    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});


app.get('/pneumonia', (req, res) => {
  res.render("pages/pneumonia");
})

app.get('/arrhythmia', (req, res) => {
  res.render("pages/ecg-ml");
})

app.get('/services', (req, res) => {
  res.render("pages/services");
})

/* Diabetology, code started for adding route to Diabetology Page (Jennifer Rovt, Ramis Ileri, Sridhanussh Srinivasan)
   Group 1, Course-BMG5111, Winter 2023
*/

app.get('/diabetology', (req, res) => {
  res.render("pages/diabetology");
})
app.get('/diabetology_specialists', (req, res) => {
  res.render("pages/diabetology_specialists");
})
app.get('/DiabetologyDiagnostics', (req, res) => {
  res.render("pages/DiabetologyDiagnostics");
})
app.get('/DiabetologyPatients', (req, res) => {
  res.render("pages/DiabetologyPatients");
})


app.get('/get_diabetologyList', (req, res) => {
  sql = "SELECT Fname, Mname, Lname, Specialization, Location1, Location2, City, Province, Country, PostalCode, Availability FROM doctors_registration WHERE Specialization = 'Diabetology'";
  conn.query(sql, (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log(error);
      return;
    }
    res.send(result);
  })
})

app.post('/DiabetologyData', (req, res) => {
  const getDetails = req.body
  console.log(req.body)
  const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
  //const date = req.body.date; // prediction date, e.g. "2023-03-01 09:00:00"
  const date = new Date();
  if (!phoneNumber) {
    res.send({error:"Missing patient phone number"});
    return;
  }
  sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
  // console.log(sql);
  conn.query(sql, (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      return;
    }
    if (result.length != 1) {
      console.log(result.length)
      res.send({error:"No patient matched in database."});
      return;
    }
  
    const patient_id = result[0].id;

    console.log(patient_id)

    sql = "INSERT INTO `diabetes`(`patient_id`,`phoneNumber`,`date`, `Age`, `BMI`, `SkinThickness`, `Glucose`, `BloodPressure`, `Insulin`, `DiabetesPedigreeFunction`, `Sex`, `Pregnancies`, `ML_result`) VALUES ?";
    var VALUES = [[patient_id, phoneNumber, date, getDetails.Age, getDetails.BodyMassIndex, 
     getDetails.SkinThickness, getDetails.Glucose, getDetails.BloodPressure, getDetails.Insulin,
     getDetails.DiabetesPedigreeFunction, getDetails.Sex, getDetails.Pregnancies, getDetails.ML_result]]

    conn.query(sql, [VALUES], (error, result) => {
      if (error) throw error
      console.log(result);

    })
  })
})


// This is the MySQL health test search API
app.post('/DiabetologyPatients', async (req,res) => {
  const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
  const recordType = req.body.recordType; // the record type, e.g. "ecg", this represents the table name in the database

  // Check parameters
  if (!phoneNumber) {
    res.send({error:"Missing patient phone number."});
    return;
  }
  if (!recordType) {
    res.send({error:"Missing record type."});
    return;
  }

  var patient_id = 0;
  sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
  
  conn.query(sql, async (error, result) => {
    if (error) {
      console.log()
      res.send({error:"Something wrong in MySQL."});
      return;
    }
    if (result.length != 1) {
      res.send({error:"No patient matched in database."});
      return;
    }
    patient_id = result[0].id;

    sql = `SELECT * FROM ${recordType} WHERE patient_id = "${patient_id}" ORDER BY date DESC`
    conn.query(sql, async (error, result) => {
      if (error) {
        console.log()
        res.send({error:"Something wrong in MySQL."});
        return;
      }

      var temp = removeKey(result,"patient_id");
      res.send({success:temp});
    });
  });
})


/* Diabetology, code ended
*/

app.get('/diagnostic-depart', (req, res) => {
  res.render("pages/diagnostic-depart");
})
app.get('/Pneumonia-diagnostics', (req, res) => {
  res.render("pages/Pneumonia-diagnostics");
})
app.get('/kidney-diagnostic', (req, res) => {
  res.render("pages/kidney-diagnostic");
})
app.get('/brain', (req, res) => { //Enrico, Apeksha, Tarin
  res.render("pages/brain");
})
/* Psychology, code started for adding route to Psychology Page (Alexis McCreath Frangakis, Parisa Nikbakht)
   Group 8, Course-BMG5111, Winter 2023
*/
app.get('/psychology', (req, res) => {
  res.render("pages/psychology");
})
app.get('/psychologyQuestionnaire', (req, res) => {
  res.render("pages/psychologyQuestionnaire");
})

app.get('/psychologyDiagnosisQuestionnaires', (req, res) => {
  res.render("pages/psychologyDiagnosisQuestionnaires");
})
app.get('/psychologyDiagnosisQuestionnaires/patientID=:patientID&type=:type', (req, res) => {  
  const { patientID, type } = req.query; 
  res.render("pages/psychologyDiagnosisQuestionnaires", { patientID, type });
})
app.get('/psychologyDiagnosis', (req, res) => {
  res.render("pages/psychologyDiagnosis");
})
app.get('/depressionQuestionnaire', (req, res) => {
  res.render("pages/depressionQuestionnaire");
})
/* Psychology - code ended for adding route to Psychology Page Alexis McCreath Frangakis, Parisa Nikbakht)
   Group 8, Course-BMG5111, Winter 2023 */


app.get('/liver', (req, res) => {
  res.render("pages/liver-prediction");
})
app.get('/liver2', (req, res) => {
  res.render("pages/liver-direct-prediction");
})

/* TaskName -Heart Disease prediction using Machine learning
 (Front-end - Venkata Durga sai ram Villa, Jananii Meganathan, Aditya Krishnamurthy) - Group2, Course-BMG5109, 1 year-2 term
 (Machine learning - Haoming Jue, Alexis McCreath Frangakis, Ishnoor Bajaj) - Course-BMG5109,
*/
app.get('/heartDiseasePrediction', (req, res) => {
  res.render("pages/heartDiseasePrediction");
})

/* TaskName -Alzheimers Disease Prediction
 (Venkata Durga sai ram Villa,Yufei wang, Varun Naik) - Group7, Course-BMG5111, 1 year-2 term
*/
app.get('/alzheimersPrediction', (req, res) => {
  res.render("pages/alzheimersPrediction");
})

/* TaskName -Gastro Image prediction
 (Front-end - Venkata Durga sai ram Villa, Jananii Meganathan, Aditya Krishnamurthy) - Group2, Course-BMG5109, 1 year-2 term
 (Machine learning - Christina Sebastian) - Course-BMG5109,
*/
app.get('/gastroImagePrediction', (req, res) => {
  res.render("pages/gastroImagePrediction");
})

app.get('/Breast-Diagnostic', (req, res) => {
  res.render("pages/Breast-Diagnostic");
})
app.get('/symptoms-checker', (req, res) => {
  res.render("pages/symptoms-checker");
})
app.get('/index', (req, res) => {
  res.render("pages/index");
})
app.get('/labtest', (req, res) => { //Christina&Sanika
  res.render("pages/labtest");
})
app.get('/labapp', (req, res) => { //Christina&Sanika
  res.render("pages/labapp");
})
app.get('/vitaminform', (req, res) => { //Christina&Sanika
  res.render("pages/vitaminform");
})
app.get('/lipidform', (req, res) => { //Christina&Sanika
  res.render("pages/lipidform");
})
app.get('/uform', (req, res) => { //Christina&Sanika
  res.render("pages/uform");
})
app.get('/bmpform', (req, res) => { //Christina&Sanika
  res.render("pages/bmpform");
})
app.get('/cmpform', (req, res) => { //Christina&Sanika
  res.render("pages/cmpform");
})
app.get('/cbcform', (req, res) => { //Christina&Sanika
  res.render("pages/cbcform");
})
app.get('/thyroidform', (req, res) => { //Christina&Sanika
  res.render("pages/thyroidform");
})
app.get('/findadentist', (req, res) => { //Christina&Sanika
  res.render("pages/findadentist");
})
app.get('/widget', (req, res) => { //Christina&Sanika
  res.render("pages/widget");
})
app.get('/Breast-Diagnostic', (req, res) => {
  res.render("pages/Breast-Diagnostic");
})

app.get('/heartStrokeDetection', (req, res) => {
  res.render("pages/heartStrokeDetection");
})

app.get('/heartStrokeDetection', (req, res) => {
  res.render("pages/heartStrokeDetection");
})

app.get('/cancerDetection', (req, res) => {
  res.render("pages/cancerDetection");
})

/* TaskName -AlzheimersDiagnostics and BrainTumorDiagnostics
 (Prateek Walia, Shrey, Advaith) - Group9, Course-BMG5101, 
*/

app.get('/AlzheimersDiagnostics', (req, res) => {
  res.render("pages/AlzheimersDiagnostics");
})

app.get('/BrainTumorDiagnostics', (req, res) => {
  res.render("pages/BrainTumorDiagnostics");
})

/* TaskName -AlzheimersDiagnostics and BrainTumorDiagnostics
 (Prateek Walia, Shrey, Advaith) - Group9, Course-BMG5101, 
*/




app.get('/Login', (req, res) => {
  errorMessage = '';
  res.render("pages/logina8b9", {
    error: errorMessage
  });
})
app.get('/register', (req, res) => {
  res.render("pages/register");
})

app.get('/signin', (req, res) => {
  res.render("pages/signin");
})
app.get('/cardiovascularDiseaseQuestionnaire', (req, res) => {
  res.render("pages/cardiovascularDiseaseQuestionnaire");
})
app.get('/cardiovascularDiseaseQuestionresult', (req, res) => {
  res.render("pages/cardiovascularDiseaseQuestionresult");
})
app.get('/internalmedicine', (req, res) => {
  res.render("pages/internalmedicine");
})
app.get('/doctorpasswordchange', (req, res) => {
  errorMessage = '';
  res.render("pages/doctorpasswordchange");
})
app.get('/common-diseases-diagnostics', (req, res) => {
  errorMessage = '';
  res.render("pages/common-diseases-diagnostics");
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
  if (prefix === 'PAT') {
    sql = "UPDATE patients_registration SET password = ? WHERE password = ? AND uuid = ?";
  }

  else if (prefix === 'HOS') {
    sql = "UPDATE hospital_admin SET password = ? WHERE password = ? AND uuid = ?";
  }

  else if (prefix === 'DOC') {
    sql = "UPDATE doctors_registration SET password = ? WHERE password = ? AND uuid = ?";
  }
  conn.query(sql, [newpassword, oldpassword, uuid], (error, result) => {
    res.render('pages/passwordresetmessage');
  })

})
app.get('/patientLogin', (req, res) => {
  errorMessage = '';
  res.render("pages/patientLogin", {
    error: errorMessage
  });
})
app.get('/specialty', (req, res) => {
  errorMessage = '';
  res.render("pages/specialty", {
    error: errorMessage
  });
})
app.get('/Oncology', (req, res) => {
  errorMessage = '';
  res.render("pages/Oncology", {
    error: errorMessage
  });
});
app.get('/patientLogin', (req, res) => {
  errorMessage = '';
  res.render("pages/patientLogin", {
    error: errorMessage
  });
})
app.get('/doctorLogin', (req, res) => {
  errorMessage = '';
  res.render("pages/doctorLogin", {
    error: errorMessage
  });
})
app.get('/hospitalLogin', (req, res) => {
  errorMessage = '';
  res.render("pages/hospitalLogin", {
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

app.get('/heartDiseasePrediction', (req, res) => {
  res.render("pages/heartDiseasePrediction");
})


// Lab reterival
app.get('/lab', (req, res) => {
  res.render("pages/lab");
})


/* TaskName - Contact Us page with email confirmation 
   Team: Apeksha, Enrico, Tarin
*/
app.get('/contact-us', (req, res) => {
  res.render("pages/contact-us");
});

app.get('/contact-us', (req, res) => {
  res.render("pages/contact-us");
});

app.post('/send-contact-form', (req, res) => {
  const SENDER_EMAIL = "ehospital23@gmail.com";
  const SENDER_PASS = "bozsyftcnmqhokte";
  
  const RECEIVER_NAME = req.body.userName;
  const RECEIVER_EMAIL = req.body.userEmail;
  const PHONE_NUMBER = req.body.phoneNumber;
  const USER_MESSAGE = req.body.userMessage;

  let VALID_INPUTS = true;

  if (Boolean(!RECEIVER_NAME) || Boolean(!RECEIVER_EMAIL) || Boolean(!USER_MESSAGE)) {
    VALID_INPUTS = false;
  }

  // Store request to database
  if (VALID_INPUTS) {
    sql = `INSERT INTO contact_us (name, email, phoneNumber, message) VALUES ("${RECEIVER_NAME}", "${RECEIVER_EMAIL}", "${PHONE_NUMBER}", "${USER_MESSAGE}")`;
    console.log(sql);
    conn.query(sql, (error, result) => {
      if (error) {
        res.send(`
        <script>alert("An error occured while sending. Error message: ${error.sqlMessage}"); 
          window.location.href = "/contact-us";
        </script>`
        );
        
        return;
      }
      if (result.affectedRows != 1) {
        res.send(`
        <script>alert("Sorry, an error occured in the database. Please contact the site admin."); 
          window.location.href = "/contact-us";
        </script>`
        );
        return;
      }
    })
  }

  // Function to call to nodemailer
  if (VALID_INPUTS) {
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
      <p> Phone: ${PHONE_NUMBER} </p>
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
  else {
    // Respond to the user that inputs are invalid
    res.send(`
    <script>alert("Your inputs are invalid. Make sure that every field is filled."); 
      window.location.href = "/contact-us";
    </script>`
    );
  }
})

app.get('/emergency-locations', async (req, res) => {
  res.render("pages/emergency-locations");
});





app.post('/Hospital_DashBoard', (req, res) => { // For the Admin Credentials:  (Admin , Admin)

  const uuid = req.body.email;
  const password = req.body.password;

  sql = "SELECT * FROM `hospital_admin` WHERE uuid = ? AND verification = ?";
  conn.query(sql, [uuid, true], (error, result) => {
    if (result.length == 0) {
      var errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";
      res.render('pages/hospitalLogin', {
        error: errorMessage
      })
    } else {
      var hospital_data = result[0];
      if (error) {
        var errorMessage = "Issue with initiating a request. Check the credentials . Please Try again Later";
        res.render('pages/hospitalLogin', {
          error: errorMessage
        })
      }
      if (result[0].uuid === uuid && result[0].password === password) {
        var patients_data;
        var doctors_data;
        sql = "SELECT * FROM `doctors_registration` WHERE 1";
        conn.query(sql, (error, result) => {
          if (error) throw error
          doctors_data = result;
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
        res.render('pages/hospitalLogin', {
          error: errorMessage
        })
      }
    }
  })
})
app.get('/HealthCare_DashBoard', (req, res) => {
  res.render("pages/Dashboard/HealthCare_DashBoard");
})

app.post('/DoctorDashBoard', (req, res) => {
  const uuid = req.body.email;
  const password = req.body.password;
  sql = 'SELECT * FROM `doctors_registration` WHERE uuid =  ? AND verification = ?';
  conn.query(sql, [uuid, true], (error, result) => {
    if (error) throw error
    if (result.length == 0) {
      errorMessage = 'Either ID or Password is wrong or your account is not verified. Please Check';
      res.render("pages/doctorLogin", {
        error: errorMessage
      });
    } else {
      if (result[0].uuid === uuid && result[0].password === password) {
        var patients_data;
        var doctors_data;
        doctors_data = result[0];
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
        res.render("pages/doctorLogin", {
          error: errorMessage
        });
      }
    }
  })
})


app.post('/searchpatient', (req, res) => {
  const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
  console.log(phoneNumber);
  // Check patient identity
  if (!phoneNumber) {
    res.send({error:"Missing patient phone number"});
    return;
  }
  var patient_id = 0;
  var check_list=[];
  sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
  console.log(sql);
  conn.query(sql, (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log("Something wrong in MySQL");
      return;
    }
    if (result.length != 1) {
      check_list[0]=1;
      res.render('pages/searchpatient', {check:check_list});
      res.send({error:"No patient matched in database."});
      console.log("No patient matched in database");
      return;
    }
    patient_id = result[0].id;
    console.log(patient_id);
    sql_search_query = `SELECT * FROM patients_registration WHERE id = "${patient_id}"`;
    conn.query(sql_search_query, function (err, result) {
      if (err) throw err;

      ///res.render() function
      res.render('pages/searchpatient', {data: result});
    });
    console.log(sql_search_query);
    });
})

// To search for patient info based on id
app.post('/searchid', (req, res) => {
  const id = req.query.id;
  console.log("requestId", id);

    sql_search_query = `SELECT * FROM patients_registration WHERE id = ${id}`;
    conn.query(sql_search_query, function (err, result) {
      if (err) throw err;
      // console.log(result);
        res.json(result)
    });
    
    console.log(sql_search_query);
})

// To search for Ecg blood test records  based on id & mobile number

app.post('/searchEcgBloodtest', (req, res) => {
  const mobileNumber = req.query.mobileNumber;
  const id = req.query.id;

  // console.log("requestMobileNumber", mobileNumber);

  const sql_search_query = `
    SELECT * 
    FROM ecg_bloodtest_going_to_delete
    WHERE phone_number = "${mobileNumber}"
    limit 100
  `;   
  conn.query(sql_search_query, function (err, result) {
    if (err) throw err;
    //console.log("blood test",result[0]);
    res.json(result[0]);
  });
      //console.log("sql_search_query",sql_search_query);

});


//app.post('/searchpatient', async (req,res) => {  
//})
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
 // API to fetch data from SQL, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */

/* Patient Dashboard For showing the test results, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */

app.get('/patientscardio', function(req, res) {
  const id = req.query.id;
  if (!id) {
    res.status(400).json({ error: 'id parameter is required' });
    return;
  }
    const ptd = req.query.id;
  sqlCardio = 'SELECT * FROM `ecg` WHERE patient_id = ?';
  conn.query(sqlCardio, [ptd],(error, result)=>{
    if (error) throw error
    if (result[0].patient_id == ptd) {

      }

    res.json(result[0].RecordDate);
})

});

app.get('/patientscardiovascular', function(req, res) {
  const id = req.query.id;
  if (!id) {
    res.status(400).json({ error: 'id parameter is required' });
    return;
  }
    const ptd = req.query.id;
  sqlCardio = 'SELECT * FROM `cardiovascular` WHERE patient_id = ?';

  conn.query(sqlCardio, [ptd],(error, result)=>{
    if (error) throw error
    if (result[0].patient_id == ptd) {

      }
    res.json(result[0]);

})

});




/* Patient Dashboard For showing the test results, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */


const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://ehuser:ehuser@e-hospital.mgq2xgp.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

// API to fetch data from MongoDB, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */

async function getRecordDate(patient_id, recordType) {
  try {
    const parsedId = parseInt(patient_id, 10); // convert to number
    // console.log(parsedId);
    // console.log(recordType);
    await client.connect();
    const database = client.db("htdata");
    const collection = database.collection(recordType);
    const result = await collection.findOne({ patient_id: parsedId }); // use parsed ID in query
    if (result === null) {
      console.log(`No record found for patient ID: ${patient_id}`);
      return null;
    }
    return result.RecordDate;
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}


async function GetInformation(id, recordType)
{
  const patient_id = id;
  const recordDate = await getRecordDate(patient_id, recordType);
  if (recordDate !== null) {
    return recordDate;
  }
  
}

app.get('/RetrieveXray', async function(req, res) {
  const id = req.query.id;
  const recordType = "X-Ray_Lung";
  if (!id) {
    res.status(400).json({ error: 'id parameter is required' });
    return;
  }
  tmp = await GetInformation(id, recordType);
  // console.log(tmp);
  res.json(tmp);
});



app.get('/RetrieveEndoscopic', async function(req, res) {
  const id = req.query.id;
  const recordType = "Endoscopic";
  if (!id) {
    res.status(400).json({ error: 'id parameter is required' });
    return;
  }
  tmp = await GetInformation(id, recordType);
  console.log(tmp);
  res.json(tmp);
});
// API to fetch data from MongoDB, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */

/* Patient Dashboard For showing the test results, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */

/* Patient Dashboard with Editable fields, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */
//Editable Part

app.get('/patientsDashboardEdit', (req, res) => {
  const uuid = req.query.id;
  const fname = req.query.fname;
  const MName = req.query.MName;
  const LName = req.query.LName;
  const MobileNumber = req.query.MobileNumber;
  const Age = req.query.Age;
  const BloodGroup = req.query.BloodGroup;
  const Location = req.query.Location;
  const weight = req.query.weight;
  const height = req.query.height;

  sql = "UPDATE patients_registration SET FName = ?, MName = ? , LName = ? , MobileNumber = ? , Age = ? , BloodGroup = ? , Location = ? , weight = ? , height = ? WHERE uuid =  ?";
  conn.query(sql, [fname, MName, LName, MobileNumber, Age, BloodGroup, Location, weight, height, uuid], (error, result) => {
    var patients_data = [fname, MName, LName, MobileNumber, Age, BloodGroup, Location, weight, height, uuid];
    res.render("pages/Dashboard/patientsDashboard", {
      patient: patients_data,

    })

  })

})
/* Patient Dashboard with Editable fields, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */


// Text Phone verification for Patients, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */

app.post('/get_patientInfoTest',(req,res)=>{
  
  const getDetails = req.body
  const uuid = getDetails.EmailId;
  // console.log(uuid)
  sql = 'SELECT * FROM `patients_registration` WHERE EmailId =  ? ';
  // console.log(sql);
  conn.query(sql, [uuid,true] ,(error, result) => {
    console.log("T1");
      if (error) throw error
      if(result.length != 0){
        console.log(result.length)
        var errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";
        res.render('pages/patientLogin',{    //patientsDashboard
          error: errorMessage
        })
      } 
      else {

      let uuid = "PAT-" + "ON-" + getDetails.Age + "-" + getDetails.province + "-" + Math.floor(Math.random() * 90000) + 10000;
      var password = crypto.randomBytes(16).toString("hex");
      sql = "INSERT INTO `patients_registration`(`uuid`,`FName`, `MName`, `LName`, `Age`, `BloodGroup`, `MobileNumber`, `EmailId`, `Address`, `Location`, `PostalCode`, `City`, `Province`, `HCardNumber`, `PassportNumber`, `PRNumber`, `DLNumber`, `Gender`, `verification`, `password`) VALUES ?";

      // sqlt = "SELECT * FROM `patients_registration` WHERE uuid = ?";

      var VALUES = [[uuid, getDetails.Fname, getDetails.Mname,
        getDetails.LName, getDetails.Age, getDetails.bloodGroup, getDetails.number,
        getDetails.EmailId, getDetails.Address, getDetails.Location, getDetails.PostalCode, getDetails.City, getDetails.province, getDetails.H_CardNo,
        getDetails.PassportNo, getDetails.PRNo, getDetails.DLNo, getDetails.gender, true, password]]
            conn.query(sql,[VALUES], (error, result) => {
              if (error) throw error
              res.render("pages/thankyou");
              })
              sms(uuid,password,getDetails.number);

      }
      })
})

// API for sending sms from TWILIO website to the patients' phone, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */
    async function sms(uuid,password,number){

      const accountSid = 'ACcd90ad6235243c49f5f806ddbbcf26d1'; //process.env.TWILIO_ACCOUNT_SID;
      const authToken = '5589b3a47f698ac1942197b62b0082c9'; //process.env.TWILIO_AUTH_TOKEN;
      
      const client = require('twilio')(accountSid, authToken,{
        logLevel: 'debug'
      });
      
      client.messages
            .create({body: '\n\n E-Hospital Account \n User: '+uuid+ ' \n Password: '+password
            , from: '+13433074905', to: number})
            .then(message => console.log(message.dateCreated));    //message.sid
              }
// Text Phone verification for Patients, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */

/* Patient Dashboard with editable feilds, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */

app.post('/get_patientInfo', (req, res) => {
  const getDetails = req.body
  let uuid = "PAT-" + "ON-" + getDetails.Age + "-" + getDetails.province + "-" + Math.floor(Math.random() * 90000) + 10000;
  var password = crypto.randomBytes(16).toString("hex");
  sql = "INSERT INTO `patients_registration`(`uuid`,`FName`, `MName`, `LName`, `Age`, `BloodGroup`, `MobileNumber`, `EmailId`, `Address`, `Location`, `PostalCode`, `City`, `Province`, `HCardNumber`, `PassportNumber`, `PRNumber`, `DLNumber`, `Gender`, `verification`, `password`) VALUES ?";

  var VALUES = [[uuid, getDetails.Fname, getDetails.Mname,
    getDetails.LName, getDetails.Age, getDetails.bloodGroup, getDetails.number,
    getDetails.EmailId, getDetails.Address, getDetails.Location, getDetails.PostalCode, getDetails.City, getDetails.province, getDetails.H_CardNo,
    getDetails.PassportNo, getDetails.PRNo, getDetails.DLNo, getDetails.gender, true, password]]
        conn.query(sql,[VALUES], (error, result) => {
          if (error) throw error
          res.render("pages/thankyou");
          })
    // sms();


}
)
/* Patient Dashboard with editable field, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */


app.post('/get_docotorInfoTest',(req,res)=>{


  const uuid = req.body.EmailId;
  const password = req.body.password;
  sql = 'SELECT * FROM `doctors_registration` WHERE uuid =  ? AND verification = ?';
  conn.query(sql, [uuid, true], (error, result) => {
    if (error) throw error
    if (result.length == 0) {
      errorMessage = 'Either ID or Password is wrong or your account is not verified. Please Check';

      const get_doctorInfo = req.body
      var password = crypto.randomBytes(16).toString("hex");
      let uuid = "DOC-" + "ON-" + get_doctorInfo.age + "-" + get_doctorInfo.province + "-" + Math.floor(Math.random() * 90000) + 10000;
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

      res.render("pages/doctorLogin", {
        error: errorMessage
      });
    } else {
      if (result[0].uuid === uuid && result[0].password === password) {
        var patients_data;
        var doctors_data;
        doctors_data = result[0];
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
        res.render("pages/doctorLogin", {
          error: errorMessage
        });
      }
    }
  })

})

app.post('/get_doctorInfo', (req, res) => {
  const get_doctorInfo = req.body
  var password = crypto.randomBytes(16).toString("hex");
  let uuid = "DOC-" + "ON-" + get_doctorInfo.age + "-" + get_doctorInfo.province + "-" + Math.floor(Math.random() * 90000) + 10000;
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
  // sms();

  async function sms() {

      const accountSid = 'ACcd90ad6235243c49f5f806ddbbcf26d1'; //process.env.TWILIO_ACCOUNT_SID;
      const authToken = '05c14694c309118ab18ae8c12c4a208d'; //process.env.TWILIO_AUTH_TOKEN;
      
      const client = require('twilio')(accountSid, authToken,{
        logLevel: 'debug'
      });
      
      client.messages
            .create({body: '\n\n E-Hospital Account \n User: '+uuid+ ' \n Password: '+password
            , from: '+13433074905', to: get_doctorInfo.MobileNo})
            .then(message => console.log(message.status));    //message.sid
              }
})

/* LAB TEST APPOINTMENT FORM, backenf api code started for adding route to register (Team-member1-Christina, Team-member2-Sanika), BMG5109H, 2nd term-1stYear */
// Get a list of available labs
app.get('/get_availableLabs', (req, res) => {
  sql = "SELECT Lab_Name, Email_Id, Location1, Location2, PostalCode, City, Province, Country, uuid FROM lab_admin WHERE verification = 1 ORDER BY Lab_Name";
  conn.query(sql, (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log(error);
      return;
    }
    res.send(result);
  })
})

// Get the appointment schedule of the specific lab
app.post('/get_appointmentList', (req, res) => {
  const uuid = req.body.id;

  if (!uuid) {
    res.send({error:"Missing lab uuid."});
    return;
  }

  let today = new Date()
  const offset = today.getTimezoneOffset()
  today = new Date(today.getTime() - (offset*60*1000))

  sql = `SELECT appointmentDate, slot
  FROM lab_admin join lab_appointment ON lab_admin.id = lab_appointment.lab_id
  WHERE lab_admin.uuid = "${uuid}" AND appointmentDate = "${today.toISOString().slice(0, 10)}";`;
  console.log(sql);
  conn.query(sql, (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log(error);
      return;
    }
    res.send(result);
  })
})

// Get the appointment schedule of the specific lab
app.post('/update_appointment', (req, res) => {
  const lab_uuid = req.body.lab_id;
  const uuid = req.body.id;
  const password = req.body.password;
  const date = req.body.date;
  const slot = req.body.slot;
  console.log(uuid)
  console.log(password)
  console.log(date)
  console.log(slot)

  if (!lab_uuid || !uuid || !password) {
    res.send({error:"Missing lab uuid, patient uuid, or patient password."});
    return;
  }
  if (!date || !slot) {
    res.send({error:"Missing appointment date or slot."});
    return;
  }

  sql = 'SELECT * FROM `patients_registration` WHERE uuid = ? AND verification = ?';
  console.log(sql);
  conn.query(sql, [uuid,true] ,(error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log(error);
      return;
    }
    if(result.length == 0){
      res.send({error: "Either ID or Password is wrong or your account is not verified. Please Check."});
      return;
    } else {
      if (result[0].uuid === uuid && result[0].password === password) {
        // Correct patients
        const patient_id = result[0].id;
        sql = `SELECT id FROM lab_admin WHERE uuid = "${lab_uuid}" AND verification = true`
        conn.query(sql, (error, result) => {
          if (error) {
            res.send({error:"Something wrong in MySQL."});
            console.log(error);
            return;
          }
          if(result.length == 0){
            res.send({error: "No valid lab match in the database."});
            return;
          } else {
            sql = `INSERT INTO lab_appointment (lab_id, patient_id, appointmentDate, slot)  VALUES (${result[0].id}, ${patient_id}, "${date}", ${slot})`;
            
            conn.query(sql,(error, result) => {
              if (error) {
                res.send({error:"Something wrong in MySQL."});
                console.log(error);
                return;
              }
              if (result.affectedRows == 1) {
                res.send({success:"Appointment scheduled."})
              } else {
                res.send({error:"Something goes wrong in the database."});
              }
            })
          }
        })
      } else {
        res.send({error: "Either ID or Password is wrong or your account is not verified. Please Check."});
        return;
      }
    }
  })
})
/* LAB TEST APPOINTMENT FORM, backenf api code ended for adding route to register (Team-member1-Christina, Team-member2-Sanika), BMG5109H, 2nd term-1stYear */

// Get the appointment list and the lab info for the specific patient
app.post('/check_patientAppointment', (req, res) => {
  const uuid = req.body.id;

  if (!uuid) {
    res.send({error:"Missing patient uuid."});
    return;
  }

  let today = new Date()
  const offset = today.getTimezoneOffset()
  today = new Date(today.getTime() - (offset*60*1000))

  sql = `SELECT lab_admin.Lab_Name, lab_admin.Email_Id, lab_admin.Location1, lab_admin.Location2, lab_admin.City, lab_admin.Province, lab_admin.Country, appointmentDate, slot
  FROM lab_admin JOIN lab_appointment JOIN patients_registration 
  ON lab_admin.id = lab_appointment.lab_id AND patients_registration.id = lab_appointment.patient_id
  WHERE patients_registration.uuid = "${uuid}" AND appointmentDate = "${today.toISOString().slice(0, 10)}";`;
  console.log(sql);
  conn.query(sql, (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log(error);
      return;
    }
    res.send(result);
  })
})

// Get the appointment list and the patient info for the specific lab
app.post('/check_labAppointment', (req, res) => {
  const uuid = req.body.id;

  if (!uuid) {
    res.send({error:"Missing lab uuid."});
    return;
  }

  let today = new Date()
  const offset = today.getTimezoneOffset()
  today = new Date(today.getTime() - (offset*60*1000))

  sql = `SELECT patients_registration.FName, patients_registration.MName, patients_registration.LName, patients_registration.MobileNumber, appointmentDate, slot
  FROM lab_admin JOIN lab_appointment JOIN patients_registration 
  ON lab_admin.id = lab_appointment.lab_id AND patients_registration.id = lab_appointment.patient_id
  WHERE lab_admin.uuid = "${uuid}" AND appointmentDate = "${today.toISOString().slice(0, 10)}";`;
  console.log(sql);
  conn.query(sql, (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log(error);
      return;
    }
    res.send(result);
  })
})
/* notification widget, backenf api code started for adding route to index (Team-member1-Christina, Team-member2-Sanika), BMG5109H, 2nd term-1stYear */
app.get('/get_availableDoctors', (req, res) => {
  sql = "SELECT Specialization, COUNT(Specialization) AS 'NumberOfDoctors' FROM doctors_registration WHERE Availability = 1 AND verification = 1 GROUP BY Specialization";
  conn.query(sql, (error, result) => {
    if (error) {
      res.send({error: error.sqlMessage});
      return;
    }
    res.send(result);
  })
})
/* find a dentist, backenf api code ended for adding route to services (Team-member1-Christina, Team-member2-Sanika), BMG5109H, 2nd term-1stYear */

/* find a dentist, backenf api code started for adding route to services (Team-member1-Christina, Team-member2-Sanika), BMG5109H, 2nd term-1stYear */
app.post('/get_availableDentists', (req, res) => {
  const Province = req.body.Province;
  const Country= req.body.Country;
  const City = req.body.City;
  console.log(req.body)
  
  //sql = "SELECT Fname, Mname, Lname, Specialization, MobileNumber, Location1, Location2, City, Province, Country, PostalCode, Availability FROM doctors_registration WHERE Specialization = 'Dentist' AND Availability = 1";
  sql = `SELECT Fname, Mname, Lname, Specialization, MobileNumber, Location1, Location2, City, Province, Country, PostalCode, Availability FROM doctors_registration WHERE Specialization = 'Dentist' AND Availability = 1 AND Province = "${Province}" AND Country = "${Country}" AND City = "${City}"  `;
  conn.query(sql, (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log(error);
      return;
    }
    res.send(result);
  })
})
/* find a dentist, backenf api code ended for adding route to services (Team-member1-Christina, Team-member2-Sanika), BMG5109H, 2nd term-1stYear */

app.post('/update_availability', (req, res) => {
  const Availability = req.body.Availability;
  const uuid = req.body.id;
  const password = req.body.password;

  sql = `UPDATE doctors_registration SET Availability = ${Availability} WHERE uuid = "${uuid}" AND password = "${password}" AND verification = true`;
  console.log(sql)
  conn.query(sql,(error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log(error);
      return;
    }
    if (result.affectedRows == 1) {
      result.changedRows == 1 ? res.send({success:"Availability updated."}) : res.send({success:"The update is already in place."})
    } else if (result.affectedRows == 0) {
      res.send({error:"Your account info is not correct."});
    } else if (result.affectedRows > 1) {
      res.send({error:"Duplicate account updated, please contact the system manager."});
    } else {
      res.send({error:"Something goes wrong in the database."});
    }
  })
})



app.post('/recordUpdate', upload.single("image"), (req, res) => {
  // console.log(req.file);
  // console.log(req.body);

  if (!req.body) {
    res.send({ error: "Missing request body." });
    return;
  }
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  // Checkout the patient profile
  if (!email || !firstName || !lastName) {
    res.send({ error: "Missing patient email, first name, or last name." });
    return;
  }
  var pid = 0;
  sql = `SELECT id FROM patients_registration WHERE EmailId = "${email}" AND FName = "${firstName}" AND LName = "${lastName}"`;
  console.log(sql);
  conn.query(sql, (error, result) => {
    if (error) {
      res.send({ "MySQL_Error": error });
      return;
    }
    if (result.length == 0) {
      res.send({ error: "No patient matched in database." });
      return;
    } else if (result.length > 1) {
      res.send({ error: "Duplicate patient profile matched." });
      return;
    } else if (result.length < 0) {
      res.send({ error: "Invalid index on the backend." });
      return;
    }
    pid = result[0].id;

    // Check file extension path.extname()
    if (!req.file) {
      res.send({ error: "File not receive." });
      return;
    } else if (path.extname(req.file.originalname) != ".jpeg") {
      res.send({ error: "The file is in the wrong format." });
      return;
    }

    // Check Record existed
    const diseaseType = req.body.diseaseType;
    const testType = req.body.testType;
    const date = req.body.date;

    if (!diseaseType || !testType || !date) {
      res.send({ error: "Missing patient disease type, test type, or date." });
      return;
    }

    // Check disease type
    var extURL;
    switch (diseaseType) {
      case "Malignant":
        extURL = "http://localhost:5000/connectionTesting";
        break;
      case "Pneumonia":
        extURL = "https://lfsrepo-mlmodel-pneumonia.herokuapp.com/predict";
        break;
      case "Glioma":
        extURL = "http://localhost:5000/connectionTesting";
        break;
      case "Alzheimers":
        extURL = "http://localhost:5000/connectionTesting";
        break;
        case "kidney-stones":
        extURL = "http://localhost:5000/connectionTesting";
        break;
      case "TBD":
        extURL = "http://localhost:5000/connectionTesting";
        break;
      default:
        res.send({ error: `Unknown disease type: ${diseaseType}` });
        return;
    }

    // Send data to external api
    const form = new FormData();
    const file = req.file;
    form.append('image', file.buffer, file.originalname);
    form.append('diseaseType', diseaseType);
    form.append('testType', testType);
    form.append('date', date);
    axios.post(extURL, form)
      .then(async response => {
        console.log(`Status: ${response.status}`)
        // const result = await mongoDb.collection("test").insertOne(req.file);
        // console.log(`New image created with the following id: ${result.insertedId}`);
        res.send(response.data);
      })
      .catch(err => {
        console.log(err.response)
        res.send({ error: err.response.data });
      })
    // res.send({success: "test"});
  })
})

app.post('/Hospital', (req, res) => {
  const get_HospitalInfo = req.body;
  var password = crypto.randomBytes(16).toString("hex");
  sql = "INSERT INTO `hospital_admin`(`Hospital_Name`, `Email_Id`, `Confirm_Email`, `Location1`, `Location2`, `PostalCode`, `City`, `Province`, `Country`, `Facilities_departments`, `Number_Doctors`, `Number_Nurse`, `No_Admins`, `Patients_per_year`, `Tax_registration_number`, `uuid`, `verification`, `password`) VALUES ?";

  var getDoctorsInfo = [[get_HospitalInfo.Hospital_Name,
  get_HospitalInfo.EmailId, get_HospitalInfo.ConfirmEmail, get_HospitalInfo.Location1, get_HospitalInfo.Location1, get_HospitalInfo.PostalCode, get_HospitalInfo.city, get_HospitalInfo.Country, get_HospitalInfo.province,
  get_HospitalInfo.Facilities_departments, get_HospitalInfo.DoctorNo, get_HospitalInfo.N_Nureses, get_HospitalInfo.No_Admin, get_HospitalInfo.PatientsPerYear, get_HospitalInfo.TaxRegNo, "HOS-" + Math.floor(Math.random() * 90000) + 10000, false, password
  ]]

  conn.query(sql, [getDoctorsInfo], (error, result) => {
    if (error) throw error
    res.render("pages/thankyou");
  })
})

app.post('/update_tumorRecord', (req, res) => {
  if (!req.body) {
    res.send({error:"Missing request body."});
    return;
  }
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  // Checkout the patient profile
  if (!email || !firstName || !lastName) {
    res.send({error:"Missing patient email, first name, or last name."});
    return;
  }
  var pid = 0;
  sql = `SELECT id FROM patients_registration WHERE EmailId = "${email}" AND FName = "${firstName}" AND LName = "${lastName}"`;
  console.log(sql);
  conn.query(sql, (error, result) => {
    if (error) {
      res.send({"MySQL_Error": error});
      return;
    }
    if (result.length == 0) {
      res.send({error:"No patient matched in database."});
      return;
    } else if (result.length > 1) {
      res.send({error:"Duplicate patient profile matched."});
      return;
    } else if (result.length < 0) {
      res.send({error:"Invalid index on the backend."});
      return;
    }
    pid = result[0].id;

    // Check Record existed
    const radius = req.body.radius;
    const texture = req.body.texture;
    const perimeter = req.body.perimeter;
    const area = req.body.area;
    const smoothness = req.body.smoothness;
    const compactness = req.body.compactness;
    const concavity = req.body.concavity;
    const concavePoints = req.body.concavePoints;
    const symmetry = req.body.symmetry;
    const fractalDimension = req.body.fractalDimension;
    const date = req.body.date;
    const prediction = req.body.prediction;

    if (!radius || !texture || !perimeter || !area || !smoothness || !compactness || !concavity || !concavePoints || !symmetry || !fractalDimension || !date || !prediction) {
      res.send({error: "Missing patient record or date."});
      return;
    }

    sql = `INSERT INTO tumor (patient_id, radius, texture, perimeter, area, smoothness, compactness, concavity, concavePoints, symmetry, fractalDimension, recordDate, prediction)
    VALUES (${pid}, ${radius}, ${texture}, ${perimeter}, ${area}, ${smoothness}, ${compactness}, ${concavity}, ${concavePoints}, ${symmetry}, ${fractalDimension}, "${date}", "${prediction}")`;
    console.log(sql);
    conn.query(sql, (error, result) => {
      if (error) {
        res.send({"MySQL_Error": error});
        return;
      }
      if (result.affectedRows == 1) {
        res.send({success:"Tumor Record update success."});
        return;
      } else {
        res.send({error:"Something goes wrong in the database."});
      }
    })
  })
})

app.post('/get_tumorRecord', (req, res) => {
  if (!req.body) {
    res.send({error:"Missing request body."});
    return;
  }
  const uuid = req.body.id;
  const password = req.body.password;
  sql = `SELECT radius, texture, perimeter, area, smoothness, compactness, concavity, concavePoints, symmetry, fractalDimension, recordDate, prediction 
  FROM tumor JOIN patients_registration ON tumor.patient_id = patients_registration.id 
  WHERE uuid = "${uuid}" AND PASSWORD = "${password}" AND verification = 1`;
  conn.query(sql,(error, result) => {
      if (error) throw error
      res.send({result: result});
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
/* Lab Registration webpage with email Notification and connection with db, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */
app.post('/Lab', (req, res) => {
  const get_LabInfo = req.body;
  var uniqueID = "HOS-" + Math.floor(Math.random()*90000) + 10000;
  var password = crypto.randomBytes(16).toString("hex");
  email = req.body.ConfirmEmail;

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

  var getLabInfo = [[get_LabInfo.Lab_Name, get_LabInfo.EmailId, get_LabInfo.ConfirmEmail, get_LabInfo.Location1, get_LabInfo.Location2, get_LabInfo.PostalCode, get_LabInfo.city, get_LabInfo.Country, get_LabInfo.province, get_LabInfo.Ref_Phy_Name, get_LabInfo.Ref_Phy_Con_Info, get_LabInfo.Insu_Info, get_LabInfo.Payment_Metho, uniqueID, password, false, get_LabInfo.Tax_registration_number]]

  conn.query(sql, [getLabInfo], (error, result) => {
    if (error) throw error
    res.render("pages/thankyou");

  })
}
)
/* Lab Registration webpage with email Notification and connection with db, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */



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

app.get('/MS-diagnoses', (req, res) => {
  res.render("pages/MS-diagnoses")
})

app.get('/diagnosisMS', (req, res) => {
  res.render("pages/diagnosisMS")
})

app.get('/ECG-diagnoses', (req, res) => {
  res.render("pages/ECG-diagnoses")
})

app.post('/getPatientInformation',(req,res)=>{
  const recordReq=req.body;
  sql = "SELECT pyramidal, cerebella, brain_stem, sensory, visual, mental, bowel_and_bladder_function, mobility, RecordDate FROM `physical_test_ms` WHERE patient_id= ?";
  conn.query(sql, [recordReq.id], (error, result) => {
  res.send({data: result});
});
})

app.get('/ECG-Doctor',(req,res) => {
  res.render("pages/ECG-Doctor")
})
app.get('/MS-Doctor',(req,res) => {
  res.render("pages/MS-Doctor")
})
// user: "uottawabiomedicalsystems@gmail.com", //
// pass: "@uOttawa5902",

//christina&sanika
app.route("/ajax")
.post(function(req,res){

 res.send({response:req.body.Country});
 console.log("success")
console.log(req.body)
console.log(req.body.Country)
});
//christina&sanika

const twilio = require("twilio");
const { pid } = require('process');
const { checkServerIdentity } = require('tls');

app.get('/sendEmail', (req, res) => {

  usertype = req.query.usertype;
  var uniqueID = ''
  var password = '';
  var sql = '';
  if (usertype === 'pat') {
    sql = "SELECT * FROM `patients_registration` WHERE id = ?";
  }

  else if (usertype === 'hos') {
    sql = "SELECT * FROM `hospital_admin` WHERE id = ?";
  }

  else if (usertype === 'doc') {
    sql = "SELECT * FROM `doctors_registration` WHERE id = ?";
  }

  conn.query(sql, [req.query.id], (error, result) => {
    if (error) throw error
    uniqueID = result[0].uuid;
    password = result[0].password;
    MobileNo = result[0].MobileNumber;
    email = result[0].EmailId || result[0].Email_Id;

    if (usertype === 'pat' || usertype === 'doc') {
      fname = result[0].Fname;
      lname = result[0].Lname;
      name = fname + " " + lname;
    }

    else if (usertype === 'hos') {
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
      if (usertype === 'pat') {
        sql = "UPDATE patients_registration SET verification = ? WHERE id = ?";
        // f
      }

      else if (usertype === 'hos') {
        sql = "UPDATE hospital_admin SET verification = ? WHERE id = ?";
      }

      else if (usertype === 'doc') {
        sql = "UPDATE doctors_registration SET verification = ? WHERE id = ?";
      }
      conn.query(sql, [true, req.query.id], (error, result) => {
        if (error) throw error
        res.json({ status: true });
      });
    }

  }

  async function sms() {

    const accountSid = 'ACcd90ad6235243c49f5f806ddbbcf26d1'; //process.env.TWILIO_ACCOUNT_SID;
    const authToken = '05c14694c309118ab18ae8c12c4a208d'; //process.env.TWILIO_AUTH_TOKEN;

    const client = require('twilio')(accountSid, authToken, {
      logLevel: 'debug'
    });

    client.messages
      .create({
        body: '\n\n E-Hospital Account \n User: ' + uniqueID + ' \n Password: ' + password
        , from: '+13433074905', to: MobileNo
      })
      .then(message => console.log(message.dateCreated));    //message.sid
  }
})



// API for symptoms checker
app.get('/get_symptoms_checker', (req, res) => {
  sql = "SELECT * FROM symptoms_checker";
  conn.query(sql, (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log(error);
      return;
    }
    res.send({success: result});
  })
})

// This API is for authorized access to doctor
app.post('/authorizeToDoctor', (req, res) => {
  const uuid = req.body.uuid;
  const password = req.body.password;
  const doctorPhoneNumber = req.body.doctorPhoneNumber;
  const isAuthorized = req.body.isAuthorized == "1" ? true : false;

  sql = `SELECT id FROM patients_registration WHERE uuid = "${uuid}" AND password = "${password}" AND verification = true`;
  var patient_id = 0;
  var doctor_id = 0;
  conn.query(sql, (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log(error);
      return;
    }
    if (result.length == 0) {
      res.send({error:"Either ID or Password is wrong or your account is not verified. Please Check."});
      return;
    }
  
    patient_id = result[0].id;
    sql = `SELECT id FROM doctors_registration WHERE MobileNumber = "${doctorPhoneNumber}" AND verification = true`;
    conn.query(sql, (error, result) => {
      if (error) {
        res.send({error:"Something wrong in MySQL."});
        console.log(error);
        return;
      }
      if (result.length == 0) {
        res.send({error:"Invalid doctor phone number. Please Check."});
        return;
      }

      doctor_id = result[0].id;
      sql = isAuthorized ? `INSERT INTO doctor_recordauthorized (doctor_id,patient_id) VALUES (${doctor_id},${patient_id});` : `DELETE FROM doctor_recordauthorized WHERE doctor_id = "${doctor_id}" AND patient_id = "${patient_id}";`
      console.log(sql);
      conn.query(sql, (error, result) => {
        if (error && error.code != 'ER_DUP_ENTRY') {
          res.send({error:"Something wrong in MySQL."});
          console.log(error);
          return;
        }
        res.send({success: isAuthorized? "Authorize success." : "Deauthorize success." });
      })
    })
  })
})

// This API is for checking the authorized patient list
app.post('/checkAuthorizedPatients', (req, res) => {
  const uuid = req.body.uuid;
  const password = req.body.password;
  const accountType = req.body.accountType;

  var accountTable = "";

  switch(accountType) {
    case ("doctor"):
      accountTable = "doctors_registration";
      break;
    case ("hospital"):
      accountTable = "hospital_admin";
      break;
    case ("lab"):
      accountTable = "lab_admin";
      break;
    case ("clinic"):
      accountTable = "clinic_admin";
      break;
    default:
      res.send({ error: `Unknown account type: ${accountType}` });
      return;
  }

  // Check parameters
  if (!uuid || !password) {
    res.send({error:"Missing doctor credential."});
    return;
  }

  sql = `SELECT id FROM ${accountTable} WHERE uuid = "${uuid}" AND password = "${password}" AND verification = true`;
  var id = 0;
  conn.query(sql, (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log(error);
      return;
    }
    if (result.length == 0) {
      res.send({error:"Either ID or Password is wrong or your account is not verified. Please Check."});
      return;
    }
  
    id = result[0].id;
    sql = `SELECT FName, MName, LName, Age, Gender, BloodGroup, height, weight, MobileNumber, EmailId
    FROM ${accountType}_recordauthorized join patients_registration ON ${accountType}_recordauthorized.patient_id = patients_registration.id
    WHERE ${accountType}_id = ${id}`
    conn.query(sql, (error, result) => {
      if (error) {
        res.send({error:"Something wrong in MySQL."});
        console.log(error);
        return;
      }
      res.send({success:result});
    })
  })
})


// This API is for updating the ML prediction result to the database. 
app.post('/updateDisease', (req, res) => {
  const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
  const disease = req.body.disease; // the name of the disease, e.g. "pneumonia"
  const date = req.body.date; // prediction date, e.g. "2023-03-01 09:00:00"
  const prediction = req.body.prediction; // prediction result, e.g. "diseased" or "detail disease type"
  const accuracy = req.body.accuracy; // prediction accuracy, e.g. "90%"
  const recordType = req.body.recordType; // the type of the health test, e.g. "X-Ray" or "ecg"
  const recordId = req.body.recordId; // the id of the health test, e.g. "12", "640b68a96d5b6382c0a3df4c"

  if (!phoneNumber || !disease || !date || !prediction) {
    res.send({error:"Missing patient phone number, disease, date, or prediction."});
    return;
  }

  var patient_id = 0;
  sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
  // console.log(sql);
  conn.query(sql, async (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log(error);
      return;
    }
    if (result.length != 1) {
      res.send({error:"No patient matched in database."});
      return;
    }
    patient_id = result[0].id;

    sql = `INSERT into ${disease} (patient_id, prediction_date, prediction, accuracy, record_type, record_id)
    VALUES (${patient_id}, "${date}", "${prediction}", ${accuracy?"\""+accuracy+"\"":"NULL"}, ${recordType?"\""+recordType+"\"":"NULL"}, ${recordId?"\""+recordId+"\"":"NULL"})
    ON DUPLICATE KEY 
    UPDATE prediction_date = "${date}", 
    prediction = "${prediction}",
    accuracy = ${accuracy?"\""+accuracy+"\"":"NULL"},
    record_type = ${recordType?"\""+recordType+"\"":"NULL"},
    record_id = ${recordId?"\""+recordId+"\"":"NULL"};`;
    conn.query(sql, async (error, result) => {
      if (error) {
        res.send({error:"Something wrong in MySQL."});
        console.log(error);
        return;
      }
      res.send({success: "Submit success."});
    });
  });
});

/* Psychology, code started for logging info into database from psychology Questionnaire, also for finding the patient ID and showing results to the doctor. (Alexis McCreath Frangakis, Parisa Nikbakht)
   Group 8, Course-BMG5111, Winter 2023
*/
app.post('/psychologyQuestionnaire', (req, res) => {
  const getDetails = req.body
  const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
  //const date = req.body.date; // prediction date, e.g. "2023-03-01 09:00:00"
  const date = new Date();
  // Check patient identity
  if (!phoneNumber) {
    res.send({error:"Missing patient phone number"});
    return;
  }
  var patient_id = 0;
  sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
  // console.log(sql);
  conn.query(sql, async (error, result) => {
    if (error) {
      console.log(error)
      res.send({error:"Something wrong in MySQL."});
      return;
    }
    if (result.length != 1) {
      res.send({error:"No patient matched in database."});
      return;
    }
  
    patient_id = result[0].id;  
    sql = "INSERT INTO `psychology_patients`(`patient_id`,`phoneNumber`,`date`,`sex`,`language`, `treatment_setting`, `age_group`, `type_of_therapy`, `psychological_treatment`, `time_frame`, `frequency`, `cost`, `chosen_dr`) VALUES ?";
    var VALUES = [[patient_id, phoneNumber, date, getDetails.sex, getDetails.language,
     getDetails.treatment_setting, getDetails.age_group, getDetails.type_of_therapy, getDetails.psychological_treatment,
     getDetails.time_frame, getDetails.frequency, getDetails.cost, getDetails.chosen_dr]]

    conn.query(sql, [VALUES], (error, result) => {
      if (error) throw error
      let params1 = encodeURIComponent(phoneNumber)
      let params2 = encodeURIComponent(getDetails.type_of_therapy)
      //console.log("/psychologyDiagnosisQuestionnaires?phoneNumber="+params1+"&type="+params2)
      res.redirect("/psychologyDiagnosisQuestionnaires?phoneNumber="+params1+"&type="+params2);
    })
  })
})

app.post('/depressionQuestionnaire', (req, res) => {
  const getDetails = req.body
  const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
  //const date = req.body.date; // prediction date, e.g. "2023-03-01 09:00:00"
  const date = new Date();
  // Check patient identity
  if (!phoneNumber) {
    res.send({error:"Missing patient phone number"});
    return;
  }
  var patient_id = 0;
  sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
  // console.log(sql);
  conn.query(sql, async (error, result) => {
    if (error) {
      console.log(error)
      res.send({error:"Something wrong in MySQL."});
      return;
    }
    if (result.length != 1) {
      res.send({error:"No patient matched in database."});
      return;
    }
  
    patient_id = result[0].id;  
    sql = "INSERT INTO `psychology_patients`(`patient_id`,`phoneNumber`,`date`,`sex`,`language`, `treatment_setting`, `age_group`, `type_of_therapy`, `psychological_treatment`, `time_frame`, `frequency`, `cost`, `chosen_dr`) VALUES ?";
    var VALUES = [[patient_id, phoneNumber, date]]

    conn.query(sql, [VALUES], (error, result) => {
      if (error) throw error
      let params1 = encodeURIComponent(phoneNumber)
      let params2 = encodeURIComponent(getDetails.type_of_therapy)
      //console.log("/psychologyDiagnosisQuestionnaires?phoneNumber="+params1+"&type="+params2)
      res.redirect("/psychologyDiagnosisQuestionnaires?phoneNumber="+params1+"&type="+params2);
    })
  })
})

/*getting all of the doctors from the database*/
app.get('/get_psychologistsinfo', (req, res) => {
  sql = "SELECT dr_name, sex, language, treatment_type, age_group, type_of_therapy, psychological_treatment, time_frame, frequency, cost FROM psychology_dr";
  conn.query(sql, (error, result) => {
    if (error) throw error
    res.send(result);
  })
})
/*end getting all of the doctors from the database*/

// This is the MySQL health test search API
app.post('/psychologyDiagnosis', async (req,res) => {
  const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
  const recordType = req.body.recordType; // the record type, e.g. "ecg", this represents the table name in the database

  // Check parameters
  if (!phoneNumber) {
    res.send({error:"Missing patient phone number."});
    return;
  }
  if (!recordType) {
    res.send({error:"Missing record type."});
    return;
  }

  var patient_id = 0;
  sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
  
  conn.query(sql, async (error, result) => {
    if (error) {
      console.log()
      res.send({error:"Something wrong in MySQL."});
      return;
    }
    if (result.length != 1) {
      res.send({error:"No patient matched in database."});
      return;
    }
    patient_id = result[0].id;

    sql = `SELECT * FROM ${recordType} WHERE patient_id = "${patient_id}" ORDER BY date DESC`
    conn.query(sql, async (error, result) => {
      if (error) {
        console.log()
        res.send({error:"Something wrong in MySQL."});
        return;
      }

      var temp = removeKey(result,"patient_id");
      res.send({success:temp});
    });
  });
})
/* Psychology - code ended for logging info into database from psychology Questionnaire, also for finding the patient ID and showing results to the doctor. (Alexis McCreath Frangakis, Parisa Nikbakht)
   Group 8, Course-BMG5111, Winter 2023 */

// This API is for receiveing the basic info of the patient like age and gender.
app.post('/get_patientBasicHealthInfo', (req, res) => {
  const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"

  if (!phoneNumber) {
    res.send({error:"Missing patient phone number"});
    return;
  }

  sql = `SELECT Age, BloodGroup, Gender, height, weight FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
  // console.log(sql);
  conn.query(sql, async (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log(error);
      return;
    }
    if (result.length != 1) {
      res.send({error:"No patient matched in database."});
      return;
    }
    res.send({success: result});
  });

});

// This is the MySQL health test search API
app.post('/healthTestRetrieveByPhoneNumber', async (req,res) => {
  const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
  const recordType = req.body.recordType; // the record type, e.g. "ecg", this represents the table name in the database

  // Check parameters
  if (!phoneNumber) {
    res.send({error:"Missing patient phone number."});
    return;
  }
  if (!recordType) {
    res.send({error:"Missing record type."});
    return;
  }

  var patient_id = 0;
  sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
  // console.log(sql);
  conn.query(sql, async (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      return;
    }
    if (result.length != 1) {
      res.send({error:"No patient matched in database."});
      return;
    }
    patient_id = result[0].id;

    sql = `SELECT * FROM ${recordType} WHERE patient_id = "${patient_id}" ORDER BY RecordDate DESC`
    conn.query(sql, async (error, result) => {
      if (error) {
        res.send({error:"Something wrong in MySQL."});
        return;
      }

      var temp = removeKey(result,"patient_id");
      res.send({success:temp});
    });
  });
})

// This is a MongoDB import API template
app.post('/imageUpload', upload.single("image"), async (req,res) => {
  const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
  const recordType = req.body.recordType; // the record type, e.g. "X-Ray", this represents the collection in the database (case sensitive)
  const recordDate = req.body.recordDate; // record date, e.g. "2023-03-01 09:00:00"

  // Check parameters
  if (!phoneNumber) {
    res.send({error:"Missing patient phone number."});
    return;
  }
  if (!recordType || !recordDate) {
    res.send({error:"Missing record type or record date."});
    return;
  }

  var patient_id = 0;
  sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
  // console.log(sql);
  conn.query(sql, async (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      return;
    }
    if (result.length != 1) {
      res.send({error:"No patient matched in database."});
      return;
    }
    patient_id = result[0].id;

    const MongoResult = await imageUpload(patient_id, recordType, recordDate, req.file);
    res.send(MongoResult);
  });
})

// This is a MongoDB API template for retrieving image by patient phone number
app.post('/imageRetrieveByPhoneNumber', async (req,res) => {
  const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
  const recordType = req.body.recordType; // the record type, e.g. "X-Ray", this represents the collection in the database (case sensitive)

  // Check parameters
  if (!phoneNumber) {
    res.send({error:"Missing patient phone number."});
    return;
  }
  if (!recordType) {
    res.send({error:"Missing record type."});
    return;
  }

  var patient_id = 0;
  sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
  console.log(sql);
  conn.query(sql, async (error, result) => {
    if (error) {
      res.send({error:"Something wrong in MySQL."});
      console.log(error);
      return;
    }
    if (result.length != 1) {
      res.send({error:"No patient matched in database."});
      return;
    }
    patient_id = result[0].id;

    const MongoResult = await imageRetrieveByPatientId(patient_id, recordType);
    res.send(MongoResult);
  });
})

// This is a MongoDB API template for retrieving image by record id 
app.post('/imageRetrieveByRecordId', async (req,res) => {
  const _id = req.body._id; // record id, e.g. "640b68a96d5b6382c0a3df4c"
  const recordType = req.body.recordType; // the record type, e.g. "X-Ray", this represents the collection in the database (case sensitive)

  // Check parameters
  if (!_id) {
    res.send({error:"Missing record id."});
    return;
  }
  if (!recordType) {
    res.send({error:"Missing record type."});
    return;
  }

  const MongoResult = await imageRetrieveByRecordId(_id, recordType);
  res.send(MongoResult);
})

// This is a connection testing api 
app.post('/connectionTesting', upload.single("image"), (req,res) => {
  console.log("Request received by test api.");
  console.log(req.file);
  console.log(req.body);
  if (req.file) {
    res.send({prediction: "File received by test api.", accuracy: "100%"});
  } else {
    res.send({prediction: "Request received by test api.", accuracy: "100%"});
  }
  
})

/**
 * Remove the sensitive field from the result.
 * @ param {*} result The result from the database.
 * @ param {*} key The field that is sensitive.
 * @ returns The result without the sensitive field.
 */
function removeKey(result, key) {
  for (let i = 0; i < result.length; i++) {
    delete result[i][key];
  }
  return result;
}

/**
 * This is the function that updates a single file (image) to the patient record in MongoDB.
 * @ param {*} patient_id Existed id from the table "patients_registration" under MySQL database.
 * @ param {*} recordType The record type, e.g. "X-Ray", this also represents the collection name in the MongoDB (case sensitive).
 * @ param {*} recordDate The date when this record was generated, e.g. "2023-03-01 09:00:00".
 * @ param {*} file The record, can be an image or other file that can be used on ML prediction directly.
 * @ returns If success, return {success: "New image created.", id: "id of this record"}; otherwise, return {error:"Error message."}.
 */
async function imageUpload(patient_id, recordType, recordDate, file) {
  if (!patient_id || !recordType || !recordDate || !file) {
    return {error:"Missing patient id, record type, record date, or record file."};
  }

  const record = {
    patient_id: patient_id,
    RecordDate: recordDate,
    file: file
  }

  const result = await mongoDb.collection(recordType).insertOne(record);
  return {success: "New image created.", id: result.insertedId};
}

/**
 * This is the function that retrieves all records in a specific record type in MongoDB through patient id.
 * @ param {*} patient_id Existed id from the table "patients_registration" under MySQL database.
 * @ param {*} recordType The record type, e.g. "X-Ray", this also represents the collection name in the MongoDB (case sensitive).
 * @ returns If success, return {success: [{Record A in JSON}, {Record B in JSON}, ...]}; otherwise, return return {error:"Error message."}.
 */
async function imageRetrieveByPatientId(patient_id, recordType) {
  if (!patient_id || !recordType) {
    return {error:"Missing patient id or record type."};
  }

  const sort = { RecordDate: -1 };
  const result = await mongoDb.collection(recordType).find({ patient_id: patient_id }, { projection: { patient_id: 0 }}).sort(sort).toArray();
  return {success: result};
}

/**
 * This is the function that retrieves specific records in a specific record type in MongoDB through the id of the record.
 * @ param {*} _id The id of the record in MongoDB.
 * @ param {*} recordType The record type, e.g. "X-Ray", this also represents the collection name in the MongoDB (case sensitive).
 * @ returns If success, return {success: {Record in JSON}}; otherwise, return return {error:"Error message."}.
 */
async function imageRetrieveByRecordId(_id, recordType) {
  if (!_id || !recordType) {
    return {error:"Missing patient id or record type."};
  }

  var mongo = require('mongodb');
  var o_id = new mongo.ObjectId(_id);
  const result = await mongoDb.collection(recordType).findOne({ _id: o_id }, { projection: { patient_id: 0 }});
  return {success: result};
}

app.listen(port, () => console.log(`Server running on the port : ${port}`))
