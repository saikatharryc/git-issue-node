import React, { Component } from "react";
import {
  Tabs,
  Tab,
  InputGroup,
  FormControl,
  Button,
  Container,
  Card
} from "react-bootstrap";
import Loader from "react-loader-spinner";
import "./app.css";

export default class App extends Component {
  state = { username: null };

  componentDidMount() {
    fetch("/api/getUsername")
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  onChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  locateRepo = async e => {
    this.setState({ loader: true });
    fetch("/api/v1/issues/locateRepo", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.username,
        reponame: this.state.reponame
      })
    })
      .then(res => res.json())
      .then(
        data => {
          if (data.success) {
            this.setState({ repoData: data, located: true });
            this.findIssues();
          } else {
            console.log(data.message);
            //show error notification here
            this.setState({ located: false, loader: false });
          }
        },
        error => {
          if (error) {
            console.log(error.message);
            //show error notification here
            this.setState({ located: false, loader: false });
          }
        }
      );
  };
  findIssues = () => {
    this.state({ loader: true });
    fetch("/api/v1/issues/", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.username,
        reponame: this.state.reponame,
        repoId: this.state.repoData._id,
        page: this.state.page || 1
      })
    })
      .then(res => res.json())
      .then(
        data => {
          if (data.success) {
            const { allIssues = [] } = this.state;
            const newArr = allIssues.concat(data.data);
            this.setState({ allIssues: newArr, loader: false });
          } else {
            console.log(data.message);
            //show error notification here
            this.setState({ loader: false });
          }
        },
        error => {
          if (error) {
            console.log(error.message);
            //show error notification here
            this.setState({ loader: false });
          }
        }
      );
  };

  render() {
    const { username } = this.state;
    return (
      <div>
        {username ? (
          <h1>{`Hello ${username}`}</h1>
        ) : (
          <h1>Loading.. please wait!</h1>
        )}
        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
          <Tab eventKey="home" title="Home">
            <InputGroup className="mb-3 mt-3" style={{ width: "45%" }}>
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon3">
                  https://github.com/
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                name="username"
                placeholder="user name / org"
                onChange={this.onChangeHandler}
                aria-describedby="basic-addon3"
              />
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon3">/</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                name="reponame"
                placeholder="repository name"
                onChange={this.onChangeHandler}
                aria-describedby="basic-addon3"
              />
              <Button className="ml-3" onClick={this.locateRepo.bind(this)}>
                Go
              </Button>
            </InputGroup>
            <Container>
              {this.state.loader ? (
                <Loader type="Puff" color="#00BFFF" height="100" width="100" />
              ) : (
                ""
              )}
              {this.state.allIssues &&
                this.state.allIssues.map(item => {
                  return (
                    <Card>
                      <Card.Body>
                        <Card.Title>{item.issueTitle}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          #{item.number}
                        </Card.Subtitle>
                        <Card.Text>{item.body}</Card.Text>
                      </Card.Body>
                    </Card>
                  );
                })}
            </Container>
          </Tab>
          <Tab eventKey="history" title="History">
            hello
          </Tab>
        </Tabs>
      </div>
    );
  }
}
