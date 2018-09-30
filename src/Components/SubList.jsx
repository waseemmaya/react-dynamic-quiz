import React, { Component } from "react";
import Button from "grommet/components/Button";
import App from "grommet/components/App";
import Heading from "grommet/components/Heading";
import Box from "grommet/components/Box";
import FormNext from "grommet/components/icons/base/FormNext";
import Revert from "grommet/components/icons/base/Revert";

import fire from "../fire";

class SubList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: this.props.subList,
      loaded: false
    };
  }
  render() {
    const { result, loaded } = this.state;
    console.log("render");

    return (
      <div>
        {loaded ? this.renderSubList() : <Heading>Loading...</Heading>}
      </div>
    )
    
      
  }

  renderSubList = () => {
    const {result} = this.state;

    return (
      <App>
        <Button
          icon={<Revert />}
          href="#"
          onClick={this.props.subBtnBack}
          primary={false}
          secondary={true}
          accent={false}
        />
        <Heading align="center">All {this.props.selectedName} Quizes</Heading>
        <Box
          direction="row"
          justify="center"
          align="center"
          wrap={true}
          pad="medium"
          margin="medium"
          colorIndex="light-1"
        >
          {result.map((val, i) => {
              return (
                <Box
                  key={i}
                  justify="center"
                  align="center"
                  wrap={true}
                  pad="medium"
                  margin="medium"
                  colorIndex="light-1"
                >
                  <Heading tag="h2">{val.subQuiz}</Heading>
                  <Button
                    secondary={false}
                    accent={false}
                    critical={false}
                    plain={true}
                    label={val.text}
                    icon={<FormNext />}
                    onClick={() => this.props.showQuiz(val.subQuiz)}
                    primary={val.hide}
                  />
                  {/* <Heading>{val.status}</Heading> */}
                </Box>
              );
            })}
        </Box>
      </App>
    )
    

  }

  componentDidMount() {
    console.log('componentDidMount');
    
    let myID = localStorage.getItem("myID");
    let quizName = this.props.selectedName;
    var { result } = this.state;
    // console.log('quizName',quizName);
    let scoreRef = fire.database().ref(`Users/${myID}`);
    scoreRef.on("value", x => {
      let data = x.val();
      data = data[quizName];
      // console.log('data',data);
      
      for (let i = 0; i < result.length; i++) {
        if (typeof data === "undefined") {
          result[i].status = "Not Done 1";
          result[i].hide = true;
          result[i].text = "Take Quiz";
        } else if (typeof data[result[i].subQuiz] === "undefined") {
          result[i].status = "Not Done 2";
          result[i].text = "Take Quiz";
          result[i].hide = true;
        } else {
          result[i].status = "Done";
          result[i].text = "Already Give";
          result[i].hide = false;
        }
      }
    });

    this.setState({
      loaded: true,
      result
    });
  }
}

export default SubList;
