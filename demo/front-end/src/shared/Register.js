// import React, { useState } from "react";
// import Form from "react-bootstrap/Form";
// import "../CSS/Login.css";
// import Alert from "react-bootstrap/Alert";
// import Card from "react-bootstrap/Card";
// import axios, { AxiosError } from "axios";
// import { Button } from "react-bootstrap";
// import { setAuthUser } from "../helper/storage";
// import { useNavigate } from "react-router-dom";
// import { encrypt } from "../middleware/encryption";
// import CryptoJS from "crypto-js";
// const Register = () => {
//   const navigate = useNavigate();
//   const [register, setRegister] = useState({
//     user_name: "",
//     email: "",
//     password: "",
//     phone: "",
//     type: "",
//     loading: false,
//     err: [],
//     success: false,
//   });

//   const RegisterFun = (e) => {
//     e.preventDefault();
//     const key = "2425345aef1e328f430274826ad110b37c721ac348320f2f";

//     // e.email = encryptedEmail;
//     // e.phone = encryptedPhone;
//     console.log("Encrypted Email:", register.email);
//     console.log("Encrypted Phone:", register.phone);
//     setRegister({
//       ...register,
//       // email: encryptedEmail,
//       // phone: encryptedPhone,
//       loading: true,
//       err: [],
//       success: false,
//     });

//     const encryptedEmail = encrypt(register.email, key);
//     const encryptedPhone = encrypt(register.phone, key);
//     axios
//       .post("http://localhost:4000/Auth/register", {
//         user_name: register.user_name,
//         password: register.password,
//         email: encryptedEmail,
//         type: register.type,
//         phone: encryptedPhone,
//       })
//       .then((resp) => {
//         console.log(register);
//         setRegister({ ...register, loading: false, err: [], success: true });
//         setTimeout(() => {
//           navigate("/Login");
//         }, 3000);
//       })
//       .catch((errors) => {
//         setRegister({
//           ...register,
//           loading: false,
//           err: errors.response.data.errors,
//           success: false,
//         });
//       });
//   };

//   return (
//     <div className="register-container">
//       <Card style={{ width: "40rem", backgroundColor: "#87CEEB" }}>
//         <h2 className="regtitle">Registration Form</h2>
//         {register.err &&
//           register.err.map((error, index) => (
//             <Alert variant="danger" className="p-2" key={index}>
//               {error.msg}
//             </Alert>
//           ))}
//         {register.success && (
//           <Alert variant="success" className="p-2">
//             Account created successfully!
//           </Alert>
//         )}
//         <Form onSubmit={RegisterFun}>
//           <Form.Group className="mb-3">
//             <Form.Label
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-start",
//                 alignItems: "center",
//                 padding: "1rem",
//               }}
//             >
//               Enter full name :
//             </Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Full name"
//               value={register.user_name}
//               onChange={(e) =>
//                 setRegister({ ...register, user_name: e.target.value })
//               }
//               style={{ fontSize: "18px", width: "600px", marginLeft: "10px" }}
//             />
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="formBasicPassword">
//             <Form.Label
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-start",
//                 alignItems: "center",
//                 padding: "1rem",
//               }}
//             >
//               Password :
//             </Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="password"
//               value={register.password}
//               onChange={(e) =>
//                 setRegister({ ...register, password: e.target.value })
//               }
//               style={{ fontSize: "18px", width: "600px", marginLeft: "10px" }}
//             />
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="formBasicEmail">
//             <Form.Label
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-start",
//                 alignItems: "center",
//                 padding: "1rem",
//               }}
//             >
//               Email :
//             </Form.Label>
//             <Form.Control
//               type="email"
//               placeholder="Email"
//               value={register.email}
//               onChange={(e) =>
//                 setRegister({ ...register, email: e.target.value })
//               }
//               style={{ fontSize: "18px", width: "600px", marginLeft: "10px" }}
//             />
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="formBasicPassword">
//             <Form.Label
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-start",
//                 alignItems: "center",
//                 padding: "1rem",
//               }}
//             >
//               Type:
//             </Form.Label>
//             <Form.Control
//               as="select"
//               value={register.type}
//               onChange={(e) =>
//                 setRegister({ ...register, type: e.target.value })
//               }
//               style={{ fontSize: "18px", width: "600px", marginLeft: "10px" }}
//             >
//               <option value="">Select Type</option>
//               <option value="seller">Seller</option>
//               <option value="bidder">Bidder</option>
//             </Form.Control>
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="formBasicPassword">
//             <Form.Label
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-start",
//                 alignItems: "center",
//                 padding: "1rem",
//               }}
//             >
//               Phone:
//             </Form.Label>
//             <Form.Control
//               type="phone"
//               placeholder="Phone"
//               value={register.phone}
//               onChange={(e) =>
//                 setRegister({ ...register, phone: e.target.value })
//               }
//               style={{ fontSize: "18px", width: "600px", marginLeft: "10px" }}
//             />
//           </Form.Group>
//           <Button
//             variant="primary "
//             type="submit"
//             disabled={register.loading === true}
//           >
//             Register
//           </Button>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import "../CSS/Login.css";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { Button } from "react-bootstrap";
import { setAuthUser } from "../helper/storage";
import { useNavigate } from "react-router-dom";
import { encrypt } from "../middleware/encryption";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    phone: "",
    type: "",
  });
  const [register, setRegister] = useState({
    loading: false,
    err: [],
    success: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const RegisterFun = (e) => {
    e.preventDefault();
    const key = "2425345aef1e328f430274826ad110b37c721ac348320f2f";

    // Encrypt email and phone
    const encryptedEmail = encrypt(formData.email, key);
    const encryptedPhone = encrypt(formData.phone, key);

    setRegister({
      loading: true,
      err: [],
      success: false,
    });

    axios
      .post("http://localhost:4000/Auth/register", {
        user_name: formData.user_name,
        password: formData.password,
        email: encryptedEmail,
        type: formData.type,
        phone: encryptedPhone,
      })
      .then((resp) => {
        setRegister({
          loading: false,
          err: [],
          success: true,
        });
        setTimeout(() => {
          navigate("/Login");
        }, 3000);
      })
      .catch((errors) => {
        setRegister({
          loading: false,
          err: errors.response.data.errors,
          success: false,
        });
      });
  };

  return (
    <div className="register-container">
      <Card style={{ width: "40rem", backgroundColor: "#87CEEB" }}>
        <h2 className="regtitle">Registration Form</h2>
        {register.err &&
          register.err.map((error, index) => (
            <Alert variant="danger" className="p-2" key={index}>
              {error.msg}
            </Alert>
          ))}
        {register.success && (
          <Alert variant="success" className="p-2">
            Account created successfully!
          </Alert>
        )}
        <Form onSubmit={RegisterFun}>
          <Form.Group className="mb-3">
            <Form.Label>Enter full name :</Form.Label>
            <Form.Control
              type="text"
              name="user_name"
              placeholder="Full name"
              value={formData.user_name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password :</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email :</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Type:</Form.Label>
            <Form.Control
              as="select"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="">Select Type</option>
              <option value="seller">Seller</option>
              <option value="bidder">Bidder</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Phone:</Form.Label>
            <Form.Control
              type="phone"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={register.loading}>
            Register
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
