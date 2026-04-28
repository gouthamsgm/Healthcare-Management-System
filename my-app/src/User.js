import React,{Component} from "react";
class User extends Component{
    constructor(props){
        super(props);
        this.state={
            data: "Hello"+ props.name,
        };
    }
    render(){
        return<h2>{this.state.data}</h2>
    }
}
export default User;