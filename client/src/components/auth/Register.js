import React, { Fragment, useState } from "react";
import axios from "axios";

export const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
    address: "",
    phone: "",
    user_type: ""
  });
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const {
    first_name,
    last_name,
    email,
    password,
    password2,
    address,
    phone,
    user_type
  } = formData;

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      console.log("password do not match");
    } else {
      console.log(formData);
      const newUser = {
        first_name,
        last_name,
        email,
        password,
        address,
        phone,
        user_type
      };

      try {
        const config = {
          headers: {
            "Content-Type": "application/json"
          }
        };

        const body = JSON.stringify(newUser);
        console.log(body);
        const res = await axios.post("/api/users", body, config);
        console.log(res.data);
      } catch (err) {
        console.log(err.response.data);
      }
    }
  };
  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="First Name"
            name="first_name"
            value={first_name}
            onChange={e => onChange(e)}
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            name="last_name"
            value={last_name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
            required
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={e => onChange(e)}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={address}
            onChange={e => onChange(e)}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="phone"
            name="phone"
            value={phone}
            onChange={e => onChange(e)}
            minLength="10"
            required
          />
        </div>
        <input
          type="radio"
          name="user_type"
          value="0"
          onChange={e => onChange(e)}
          required
        />
        Student &ensp;
        <input
          type="radio"
          name="user_type"
          value="1"
          onChange={e => onChange(e)}
          required
        />
        Employer
        <br></br>
        <br></br>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <a href="login.html">Sign In</a>
      </p>
    </Fragment>
  );
};

export default Register;
