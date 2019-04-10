import React, { Component } from "react";
import {
  Tabs,
  Tab,
  InputGroup,
  FormControl,
  Button,
  Container,
  Card,
  Table
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
    this.setState({ loader: true, allIssues: [], located: false });
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
    this.setState({ loader: true });
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
              {this.state.repoData && (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Total Open issues</th>
                      <th>Opend Last 24hrs</th>
                      <th>24hrs-7days</th>
                      <th>7days and more</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{this.state.repoData.totalIssuesOpen}</td>
                      <td>{this.state.repoData.lastDayOpenIssue}</td>
                      <td>{this.state.repoData.lastWeekOpenIssue}</td>
                      <td>{this.state.repoData.moreThanAweekOpenIssue}</td>
                    </tr>
                  </tbody>
                </Table>
              )}
              {this.state.allIssues &&
                this.state.allIssues.map(item => {
                  //Iterate here
                  return (
                    <Card>
                      <Card.Body>
                        <Card.Title>{item.issueTitle}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          #{item.number}
                        </Card.Subtitle>
                        <Card.Text>{item.body}</Card.Text>
                      </Card.Body>
                      <Card.Link href={item.html_url} target="_blank">
                        Go to the issue
                      </Card.Link>
                    </Card>
                  );
                })}
              {this.state.repoData && this.state.allIssues && (
                <Button
                  onClick={() => {
                    this.setState({ page: (this.state.page || 0) + 1 });
                    this.findIssues();
                  }}
                  disabled={
                    this.state.repoData.totalIssuesOpen <= this.state.page * 20
                      ? true
                      : false
                  }
                >
                  Load more...
                </Button>
              )}
            </Container>
          </Tab>
          <Tab eventKey="history" title="History">
            <History />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

class History extends Component {
  state = {};

  componentDidMount = () => {
    //incase of paginate & also for grouping by the repo or grouping by some parent
    //control goes from here and make this a separate function
    fetch("/api/v1/issues/visit/history")
      .then(res => res.json())
      .then(data => {
        this.setState({ allHistory: data });
      });
  };
  render() {
    return (
      <Container>
        {this.state.allHistory &&
          this.state.allHistory.map(item => {
            if (item.docs) {
              return item.docs.map(i => {
                return (
                  <Card>
                    <Card.Body>
                      <Card.Title>{i.issueTitle}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        #{i.number}
                      </Card.Subtitle>
                      <Card.Text>{i.body}</Card.Text>
                    </Card.Body>
                    <Card.Link href={i.html_url} target="_blank">
                      Go to the issue
                    </Card.Link>
                  </Card>
                );
              });
            }
          })}
      </Container>
    );
  }
}
