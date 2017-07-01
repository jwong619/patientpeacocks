import React from 'react';
import { Redirect, Link } from 'react-router'
import $ from 'jquery';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToUser: false
    }
    this.UserPass = {};
    this.loginRequest = this.loginRequest.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.UserPass = {
      name: this.userName.value,
      password: this.password.value
    }
    this.loginRequest();
  }

  loginRequest() {
    $.ajax({
      url: '/login',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(this.UserPass),
      success: () => {
        console.log('login was successful');
        this.setState({
          redirectToUser: true
        })
        if(this.state.redirectToUser) {
          this.props.router.push('/userpage')
        }
      },
      error: function (err) {
        console.log('Signup failed', err);
      }
    })
  }

  render() {
    return (
      <div className = 'loginPage'>
        <form method="POST" onSubmit={this.handleSubmit.bind(this)}>
          <h2>Login</h2>
          <div>
            <label>
              Username:
              <input type="text" ref={(input) => this.userName = input} />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input type="text" ref={(input) => this.password = input} />
            </label>
          </div>
          <div>
            <input type="submit" value="Login!" />
          </div>
        </form>
        <Link to='/signup'>Click here if you have an account!</Link>
      </div>
    );
  }
}

export default Login;