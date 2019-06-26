import React, { Component } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';


import Button from '../../ui/Button/Button';
import InputField from '../../ui/InputField/InputField';
import Modal from '../../ui/Modal/Modal';
import Auxi from '../../hoc/Auxi';
import setAuthToken from '../../utils/setAuthToken';
import store from '../../redux/store/store';
import './SignUp.css';
import Login from '../Login/Login';

class SignUp extends Component {
   constructor() {
      super();
      this.state = {
         name: '',
         email: '',
         password: '',
         password2: '',
         faculty: '',
         errors: {},
         showModal: false
      };

   };

   onChangeHandler = (e) => {
      this.setState({ [e.target.name]: e.target.value });

      const newErr = { ...this.state.errors };
      newErr[e.target.name] = '';
      this.setState({ errors: newErr });
   };



   onClickHandler = (e) => {
      e.preventDefault(); //prevents from default submission
      const newUser = {
         name: this.state.name,
         email: this.state.email,
         password: this.state.password,
         password2: this.state.password2,
      };
      axios
         .post('/auth/register', newUser)
         .then(res => {
            console.log("user has been registered", res.data);
            localStorage.setItem('jwtToken', res.data.token);
            setAuthToken(res.data.token);
            const decoded = jwtDecode(res.data.token);
            console.log("Decoded output of the data", decoded);
            store.dispatch({ type: 'SET_USER', payload: decoded });
         })
         .catch(err => {
            this.setState({ errors: err.response.data })
         });

   };

   onLoginClickHandler = (e) => {
      e.preventDefault();
      this.setState((prevState) => ({ showModal: !prevState.showModal }))

   }

   onBackDropClickHandler = () => this.setState({ showModal: false })


   render() {
      return (
         <Auxi>
            <div className="FormBox" id="signUpForm">
               <form className="Form" noValidate>

                  <InputField
                     className="Input"
                     value={this.state.name}
                     type="text"
                     placeholder="Full Name"
                     name="name"
                     changed={this.onChangeHandler}
                     errors={this.state.errors}
                  />
                  <InputField
                     className="Input"
                     value={this.state.email}
                     type="email"
                     placeholder="Email"
                     name="email"
                     changed={this.onChangeHandler}
                     errors={this.state.errors}
                  />
                  <InputField
                     className="Input"
                     value={this.state.password}
                     type="password"
                     placeholder="Password"
                     name="password"
                     changed={this.onChangeHandler}
                     errors={this.state.errors}
                  />
                  <InputField
                     className="Input"
                     value={this.state.password2}
                     type="password"
                     placeholder="Confirm Password"
                     name="password2"
                     changed={this.onChangeHandler}
                     errors={this.state.errors}
                  />
               </form>

               <Button cls="Success" clicked={this.onClickHandler} >Sign Up</Button>
               <div className="InfoBar">
                  <div onClick={this.onLoginClickHandler} className="Info" >Already regesitered? signi In</div>
               </div>

            </div>
            <Modal
               show={this.state.showModal} modalClosed={() => {
                  this.setState({ showModal: false });
               }}
               fromTop='27%'
            >
               <Login showModal={this.state.showModal} />
            </Modal>
         </Auxi>
      )
   }
}




export default SignUp;