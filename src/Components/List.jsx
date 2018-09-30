import React, { Component } from "react";
import Button from "grommet/components/Button";
import App from "grommet/components/App";
import Heading from "grommet/components/Heading";
import Box from "grommet/components/Box";
import FormNext from "grommet/components/icons/base/FormNext";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { allNames } = this.props;
    return (
      <App>
       
        <Heading align="center">All Available Quiz</Heading>
        <Box
          direction="row"
          justify="center"
          align="center"
          wrap={true}
          pad="medium"
          margin="medium"
          colorIndex="light-1"
        >
          {allNames.map((val, i) => {
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
                <Heading tag="h2">{val}</Heading>
                <Button
                  secondary={false}
                  accent={false}
                  critical={false}
                  plain={true}
                  label="View Quiz"
                  icon={<FormNext />}
                  onClick={() => this.props.renderSub(val)}
                  primary={true}
                />
              </Box>
            );
          })}
        </Box>
      </App>
    );
  }
}

export default List;
