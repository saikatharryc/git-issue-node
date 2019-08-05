import React, { Component } from "react";
import {
  Tabs,
  Tab,
  InputGroup,
  FormControl,
  Button,
  Container,
  Table,Alert
} from "react-bootstrap";
import Loader from "react-loader-spinner";
import "./app.css";

export default class App extends Component {
  state = { username: null, showAlert:false };

  componentDidMount() {
    fetch("/api/getUsername")
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  onChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  locateRepo = async e => {
    this.setState({ 
      loader: true, 
      allIssues: [],
      showAlert:false, 
      located: false 
    });
    
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
            this.setState({ repoData: data, located: true, loader: false });
            // this.findIssues();
          } else {
            console.log(data.message);
            //show error notification here
            this.setState({ 
              located: false,
              message:data.message === "Not Found" ? "Repo not found" : data.message, 
              repoData: [], 
              showAlert:true,
              loader: false
             });
          }
        },
        error => {
          if (error) {
            console.log(error.message);
            //show error notification here
            this.setState({ 
              located: false, 
              message:"Unknown error occured!", 
              repoData: [],
              showAlert:true,
              loader: false 
            });
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
         {!this.state.located && this.state.showAlert && this.state.message &&
           <Alert variant="danger" onClose={() => this.setState({showAlert:true})}  dismissible>
           <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
           <p>
           {this.state.message || "Unknown Error Occured!"}
           </p>
         </Alert>
         }
               

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
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Repo Id</th>
              <th>Repo Name</th>
              <th>Total Open issues</th>
              <th>user Id</th>
              <th>user name</th>
            </tr>
          </thead>
          {this.state.allHistory &&
            this.state.allHistory.map(item => {
              return (
                <tbody>
                  <tr>
                    <td>#{item.repoId}</td>
                    <td>{item.reponame}</td>
                    <td>{item.totalIssuesOpen}</td>
                    <td>{item.ownerMeta.id}</td>
                    <td>{item.ownerMeta.name}</td>
                  </tr>
                </tbody>
              );
            })}
        </Table>
      </Container>
    );
  }
}
