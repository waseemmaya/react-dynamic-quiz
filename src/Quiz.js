import React, { Component } from "react";
import MyHeader from "./Main/MyHeader";
import MyFooter from "./Main/MyFooter";
import Auth from "./Main/Auth";
import List from "./Components/List";
import SubList from "./Components/SubList";
import QuizPage from "./Components/QuizPage";
import Spinning from "grommet/components/icons/Spinning";

import fire from "./fire";

import App from "grommet/components/App";
import Box from "grommet/components/Box";
import Section from "grommet/components/Section";

class Quiz extends Component {
  constructor() {
    super();
    this.state = {
      displayName: "",
      checkUser: true,
      isAuth: true,
      subList: [],
      showList: false,
      allNames: [],
      selectedName: "",
      selectedSubQuiz: "",
      enableQuizPage: false
    };
  }
  render() {
    const {
      displayName,
      isAuth,
      showList,
      checkUser,
      allNames,
      selectedName,
      subList,
      showSubList,
      selectedSubQuiz,
      enableQuizPage
    } = this.state;
    return (
      <App centerd="true">
        <MyHeader
          comeHome={this.comeHome}
          displayName={displayName}
          isAuth={isAuth}
          logout={this.logout}
        />

        {checkUser && (
          <Box justify="between" align="center">
            <Spinning size="xlarge" />
          </Box>
        )}

        {!isAuth &&
          !showSubList &&
          !enableQuizPage && <Auth afterLogin={this.afterLogin} />}

        {isAuth &&
          showList &&
          !showSubList && (
            <Section>
              <List renderSub={this.renderSub} allNames={allNames} />
            </Section>
          )}

        {isAuth &&
          !showList &&
          showSubList && (
            <Section>
              <SubList
                subBtnBack={this.subBtnBack}
                allNames={allNames}
                showQuiz={this.showQuiz}
                selectedName={selectedName}
                selectedSubQuiz={selectedSubQuiz}
                subList={subList}
              />
            </Section>
          )}

        {isAuth &&
          !showList &&
          !showSubList &&
          enableQuizPage && (
            <Section>
              <QuizPage
                comeHome={this.comeHome}
                selectedSubQuiz={selectedSubQuiz}
                selectedName={selectedName}
              />
            </Section>
          )}

        <MyFooter />
      </App>
    );
  }

  renderSub = val => {
    let subRef = fire.database().ref(`AllQuiz/${val}`);
    let subList = [];
    subRef.on("child_added", snapshot => {
      let subObj = {
        subQuiz: snapshot.key
      };
      subList.push(subObj);
    });

    this.setState({
      subList,
      selectedName: val,
      showList: false,
      showSubList: true
    });
  };

  subBtnBack = () => {
    this.setState({
      isAuth: true,
      showList: true,
      showSubList: false
    });
  };

  comeHome = () => {
    this.setState({
      isAuth: true,
      showList: true,
      showSubList: false
    });
  };

  afterLogin = displayName => {
    this.setState({
      displayName
    });
  };

  showQuiz = val => {
    console.log("val", val);

    this.setState({
      selectedSubQuiz: val,
      isAuth: true,
      showList: false,
      showSubList: false,
      enableQuizPage: true
    });
  };

  

  componentDidMount() {
    const { allNames } = this.state;

    fire.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("Signed In");
        let userName = localStorage.getItem("myName");

        let quizes = fire.database().ref(`AllQuiz`);
        quizes.on("child_added", snapshot => {
          allNames.push(snapshot.key);
          this.setState({
            allNames
          });
        });

        this.setState({
          displayName: userName,
          isAuth: true,
          checkUser: false,
          showList: true
        });
      } else {
        console.log("Not Signed In...!");
        this.setState({
          checkUser: false,
          isAuth: false
        });
      }
    });
  }

  logout = () => {
    fire
      .auth()
      .signOut()
      .then(
        () => {
          console.log("Signed Out");
          localStorage.clear();
          this.setState({
            displayName: "",
            isAuth: false
          });
        },
        error => {
          console.error("Sign Out Error", error);
        }
      );
  };
}

export default Quiz;
