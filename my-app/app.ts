import React, { Component } from "react";

type Props = {}; // no props passed

type State = {
  name: string;
};

class User extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: "Goutham",
    };
  }

  render() {
    return <h2>User Name: {this.state.name}</h2>;
  }
}

export default User;