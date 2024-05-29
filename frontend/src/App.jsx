import React from "react";
import { logout, login, whoami, getSession } from "./api/fetch"

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      csrf: "",
      username: "",
      password: "",
      error: "",
      isAuthenticated: false,
    };
  }

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleUserNameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  componentDidMount = () => {
    getSession();
  };

  render() {
    if (!this.state.isAuthenticated) {
      return (
        <div className='container mt-3'>
          <h1>React Cookie Auth</h1>
          <br />
          <h2>Login</h2>
          <form onSubmit={login}>
            <div className='form-group'>
              <label htmlFor='username'>Username</label>
              <input
                type='text'
                className='form-control'
                id='username'
                name='username'
                value={this.state.username}
                onChange={this.handleUserNameChange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='username'>Password</label>
              <input
                type='password'
                className='form-control'
                id='password'
                name='password'
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
              <div>
                {this.state.error && (
                  <small className='text-danger'>{this.state.error}</small>
                )}
              </div>
            </div>
            <button type='submit' className='btn btn-primary'>
              Login
            </button>
          </form>
        </div>
      );
    }
    return (
      <div className='container mt-3'>
        <h1>React Cookie Auth</h1>
        <p>You are logged in!</p>
        <button className='btn btn-primary mr-2' onClick={whoami}>
          WhoAmI
        </button>
        <button className='btn btn-danger' onClick={logout}>
          Log out
        </button>
      </div>
    );
  }
}

export default App;
