import React from "react";

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

  componentDidMount = () => {
    // ensures the frontend has a csrf token so it can make api requests itself
    if (!this.state.csrf && !this.state.isAuthenticated) {
      this.getCSRF();
    } else {
      this.getSession();
    }
  };

  getCSRF = () => {
    fetch("/api/csrf/", {
      credentials: "same-origin",
    })
      .then((res) => {
        let csrfToken = res.headers.get("X-CSRFToken");
        this.setState({ csrf: csrfToken });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getSession = () => {
    fetch("/api/session/", {
      credentials: "same-origin",
    })
      .then((res) => {
        res.json();
      })
      .then((data) => {
        if (data?.isAuthenticated) {
          this.setState({ isAuthenticated: true });
        } else {
          this.setState({ isAuthenticated: false });
          this.getCSRF();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  whoami = () => {
    fetch("/api/whoami/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("You are logged in as: " + data.username);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleUserNameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  // helper function
  isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }

  handleLogin = (event) => {
    event.preventDefault();
    fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.state.csrf,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then(this.isResponseOk)
      .then((data) => {
        console.log(data);
        this.setState({
          isAuthenticated: true,
          username: "",
          password: "",
          error: "",
        });
      })
      .catch(() => {
        this.setState({
          error: "Unable to login. Wrong username or password.",
        });
      });
  };

  handleLogout = () => {
    fetch("/api/logout", {
      credentials: "same-origin",
    })
      .then(this.isResponseOk)
      .then((data) => {
        console.log(data);
        this.setState({ isAuthenticated: false });
        this.getCSRF();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (!this.state.isAuthenticated) {
      return (
        <div className='container mt-3'>
          <h1>React Cookie Auth</h1>
          <br />
          <h2>Login</h2>
          <form onSubmit={this.handleLogin}>
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
            <button
              type='submit'
              className='btn btn-primary'
              disabled={!this.state.csrf}
            >
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
        <button className='btn btn-primary mr-2' onClick={this.whoami}>
          WhoAmI
        </button>
        <button className='btn btn-danger' onClick={this.handleLogout}>
          Log out
        </button>
      </div>
    );
  }
}

export default App;
