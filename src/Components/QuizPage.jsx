import React, { Component } from "react";
import FormField from "grommet/components/FormField";
import RadioButton from "grommet/components/RadioButton";
import Form from "grommet/components/Form";
import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Button from "grommet/components/Button";
import Heading from "grommet/components/Heading";

import Footer from "grommet/components/Footer";
import Spinning from "grommet/components/icons/Spinning";
import swal from "sweetalert";

import fire from "../fire";
class QuizPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCount: 120,
      score: 0,
      result: [],
      allAns: [],
      loaded: false
    };
  }
  render() {
    const { loaded } = this.state;

    return (
      <div>
        {!loaded ? (
          <Box justify="between" align="center">
            <Spinning size="xlarge" />
          </Box>
        ) : (
          this.renderQuiz()
        )}
      </div>
    );
  }

  renderQuiz = () => {
    const { result } = this.state;
    // console.log('name',result.id.name);

    return (
      <Box
        justify="between"
        align="center"
        wrap={true}
        pad="large"
        margin="large"
        colorIndex="light-1"
      >
      <Heading>{this.props.selectedName} > {this.props.selectedSubQuiz}</Heading>
        <Heading tag="h3">
          Time left : {this.state.currentCount} Seconds
        </Heading>
        <Form pad="large" plain={true}>
          {result.map((val, i) => {
            let data = val.quiz;
            return (
              <FormField key={i}>
                <Box
                  justify="center"
                  align="center"
                  wrap={true}
                  pad="large"
                  margin="large"
                  colorIndex="light-1"
                >
                  <Label>{data.question}</Label>
                </Box>
                <RadioButton
                  id={"choice" + i}
                  onChange={e => this.handleVal(e, i)}
                  name={"q" + i}
                  label={data.answers.ans1}
                  value={data.answers.ans1}
                />
                <RadioButton
                  id={"id" + i + 1}
                  onChange={e => this.handleVal(e, i)}
                  name={"q" + i}
                  label={data.answers.ans2}
                  value={data.answers.ans2}
                />
                <RadioButton
                  id={"id" + i + 2}
                  onChange={e => this.handleVal(e, i)}
                  name={"q" + i}
                  label={data.answers.ans3}
                  value={data.answers.ans3}
                />
                 <RadioButton
                  id={"id" + i + 3}
                  onChange={e => this.handleVal(e, i)}
                  name={"q" + i}
                  label={data.answers.ans4}
                  value={data.answers.ans4}
                />
              </FormField>
            );
          })}
          <Footer justify="between" size="large">
            <Button
              label="Submit"
              onClick={e => this.handleSubmit()}
              primary={true}
            />
          </Footer>
        </Form>
      </Box>
    );
  };

  handleVal(e, i) {
    // const { result } = this.state;
    var { allAns } = this.state;

    // let correctAns = result[i].quiz.correctAns;
    let getVal = e.target.value;

    // insert string 'someString' into the array at index 2
    allAns[i] = getVal;
    // console.log(allAns);
  }

  handleSubmit = e => {
    const { result } = this.state;
    // console.log("result****", result[0].quiz.correctAns);

    // console.log("result", this.state.result);

    // // e.preventDefault();
    const { allAns } = this.state;
    const { selectedSubQuiz, selectedName } = this.props;

    var { score } = this.state;
    // console.log("result", result.id);

    for (let i = 0; i < result.length; i++) {
      let correctAns = result[i].quiz.correctAns;
      console.log("correct", correctAns);
      if (allAns[i] === correctAns) {
        score++;
        this.setState({
          score
        });
      }
    }
    let myID = localStorage.getItem("myID");

    let scoreRef = fire.database().ref(`Users/${myID}/${selectedName}/${selectedSubQuiz}`);
    scoreRef.set({
      myScore: score,
      outOf: result.length
    });

    // scoreRef.on("value", x => {
    //   let data = x.val();
    //   let myScr = data.myScore;
    //   // console.log(myScr);
    //   // let userName = localStorage.setItem("myName", uffName);
    // });

    // list[quizIndex].eachQuiz

    let final = `
          Your Score is ${score}/${result.length}
    `;

    swal("Your Result", final, "success").then(() => {
      this.setState({
        score: 0
      });
      this.props.comeHome();
    });

    return false;
  };

  componentWillMount() {
    const { result } = this.state;
    const { selectedSubQuiz, selectedName } = this.props;

    let quizes = fire
      .database()
      .ref(`AllQuiz/${selectedName}/${selectedSubQuiz}`); //get from props
    quizes.on("child_added", snapshot => {
      let quiz = {
        quiz: snapshot.val(),
        id: snapshot.key
      };

      result.push(quiz);
      this.setState({
        result,
        loaded: true
      });

      // console.log("quiz name", quizName);
    });
  }

  componentDidMount() {
    var intervalId = setInterval(this.timer, 1000);
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId: intervalId });
  }
  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }

  timer = () => {
    // setState method is used to update the state
    var newCount = this.state.currentCount - 1;
    if (newCount >= 0) {
      this.setState({ currentCount: newCount });
    } else {
      swal("Time Out!", "Kesa Diya?", "error").then(() => {
        this.handleSubmit();
      });

      clearInterval(this.state.intervalId);
    }
  };
}

export default QuizPage;
