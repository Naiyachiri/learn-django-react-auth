import React from "react";
import { jwtDecode } from "jwt-decode";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      error: "",
      access: "",
      refresh: "",
      isAuthenticated: false,
      daccess: "",
      drefresh: "",
    };
  }

  whoami = () => {
    if (this.state.access) {
      fetch("/api/whoami/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.access}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("You are logged in as: " + data.username);
          this.setState({ whoami: data });
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
          isAuthenticated: false,
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
        this.setState({
          isAuthenticated: false,
          access: "",
          refresh: "",
          drefresh: "",
          daccess: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleGetAccessToken = () => {
    if (!this.state.password && !this.state.username) {
      this.setState({ error: "Username and password cannot be empty" });
      return;
    }
    fetch("api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then(this.isResponseOk)
      .then((data) => {
        this.setState(
          {
            access: data.access,
            refresh: data.refresh,
            isAuthenticated: true,
            username: "",
            password: "",
            error: "",
            drefresh: jwtDecode(data.refresh),
            daccess: jwtDecode(data.access),
          },
          () => console.log(this.state)
        );
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          error:
            "Unable to get token / access pair, Verify username and password",
          isAuthenticated: false,
        });
      });
  };

  handleRefresh = () => {
    fetch("api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: this.state.refresh,
      }),
    })
      .then(this.isResponseOk)
      .then((data) => {
        // Handle the response data (e.g., extract and use the new access token)
        console.log("New access token:", data.access);
        console.log("New access token:", data.refresh);
        this.setState({
          access: data.access,
          refresh: data.refresh,
          drefresh: jwtDecode(data.refresh),
          daccess: jwtDecode(data.access),
        });
      })
      .catch((error) => {
        // Handle errors
        console.error("Error: Unable to refresh tokens", error);
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
          </form>
          <button
            className='btn btn-primary'
            onClick={this.handleGetAccessToken}
          >
            Login for get access / refresh token pair
          </button>
        </div>
      );
    }
    return (
      <div className='container mt-3'>
        <h1>React Cookie Auth</h1>
        <p>You are logged in! User: {this.state.daccess.user_id}</p>
        <h3>JWT Token:</h3>
        <p
          style={{
            wordWrap: "break-word",
          }}
        >
          {JSON.stringify(jwtDecode(JSON.stringify(this.state.access)))}
        </p>
        <p
          style={{
            wordWrap: "break-word",
          }}
        >
          {JSON.stringify(jwtDecode(JSON.stringify(this.state.refresh)))}
        </p>
        <button className='btn btn-primary mr-2' onClick={this.whoami}>
          WhoAmI
        </button>
        <button className='btn btn-danger' onClick={this.handleLogout}>
          Log out
        </button>
        <button className='btn btn-danger' onClick={this.handleRefresh}>
          Refresh Token
        </button>

        <div>
          <h1>Anatomy of a default JWT Token provided by Django</h1>
          <p>
            <strong>token_type:</strong> This field specifies the type of token.
            In the provided tokens, one has a <code>token_type</code> of{" "}
            <code>"access"</code> and the other has a <code>token_type</code> of{" "}
            <code>"refresh"</code>. This indicates whether the token is an
            access token used for accessing protected resources or a refresh
            token used for obtaining new access tokens.
          </p>
          <p>
            <strong>exp (Expiration Time):</strong> This field represents the
            expiration time of the token, expressed as a Unix timestamp (number
            of seconds since the Unix epoch). The token will no longer be
            considered valid after this time. It helps ensure that the token
            cannot be used indefinitely, enhancing security by limiting its
            lifespan.
          </p>
          <p>
            <strong>iat (Issued At):</strong> This field represents the time at
            which the token was issued, also expressed as a Unix timestamp. It
            indicates the time when the token was created, providing additional
            information about the token's lifecycle.
          </p>
          <p>
            <strong>jti (JWT ID):</strong> This field contains a unique
            identifier for the token, known as the JWT ID. It helps distinguish
            the token from others and can be useful for tracking or identifying
            specific tokens, especially in distributed systems.
          </p>
          <p>
            <strong>user_id:</strong> This field typically represents the
            identifier of the user associated with the token. In the provided
            tokens, both have a <code>user_id</code> of <code>2</code>,
            indicating that they belong to the same user.
          </p>
        </div>
      </div>
    );
  }
}

export default App;
