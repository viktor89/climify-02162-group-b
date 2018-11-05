import React from "react";
import ReactDOM from "react-dom";
import Button from '@material-ui/core/Button';

class HelloMessage extends React.Component {
  render() {
    return <Button variant="contained">
      New Text 2
    </Button>
  }
}

let App = document.getElementById("root");

ReactDOM.render(<HelloMessage name="test" />, App);
