const _getCSRF = () => {
  fetch("/api/csrf/", {
    credentials: "same-origin",
  })
    .then((res) => {
      let csrfToken = res.headers.get("X-CSRFToken");
      // this.setState({ csrf: csrfToken });
      console.log(csrfToken);
      return csrfToken;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getSession = () => {
  fetch("/api/session/", {
    credentials: "same-origin",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.isAuthenticated) {
        // this.setState({ isAuthenticated: true });
      } else {
        // this.setState({ isAuthenticated: false });
        return _getCSRF();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const whoami = () => {
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

function _isResponseOk(response) {
  if (response.status >= 200 && response.status <= 299) {
    return response.json();
  } else {
    throw Error(response.statusText);
  }
}

export const login = (event) => {
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
    .then(_isResponseOk)
    .then((data) => {
      // set state have logging in to be authenticated and reset form
      console.log(data);
      // this.setState({
      //   isAuthenticated: true,
      //   username: "",
      //   password: "",
      //   error: "",
      // });
    })
    .catch((err) => {
      console.log(err);
      this.setState({ error: "Wrong username or password." });
    });
};

export const logout = () => {
  fetch("/api/logout", {
    credentials: "same-origin",
  })
    .then(_isResponseOk)
    .then((data) => {
      console.log(data);
      // this.setState({ isAuthenticated: false });
      _getCSRF;
    })
    .catch((err) => {
      console.log(err);
    });
};
