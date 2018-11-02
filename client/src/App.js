import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import {Redirect} from 'react-router-dom';


class App extends Component {
  state={
    email:'',
    password:'',
    headers:{},
    id:'',
    currentUser:false
  }

  handleGet=(e)=>{
    e.preventDefault();
    axios.get('/users').then((res)=>{
      this.setState({users:res.data});
      console.log(res.data);
    });
  };
//USERS
  handleChange=(event)=>{
    event.preventDefault();
    const {name,value}=event.target;
    this.setState({[name]:value});
  }
  handleSignUp=(e)=>{
    e.preventDefault();
    const user={
      email:this.state.email,
      password:this.state.password
    };
    axios.post('/users',user).then((res)=>{
      console.log(res);
      console.log(res.data);
    }).catch((err)=>{
      console.log(err)
    });
  };

  handleLogin=(e)=>{
    e.preventDefault();
    const user={
      email:this.state.email,
      password:this.state.password
    };
    axios.post('/users/login',user).then((res)=>{
      this.setState({currentUser:true,headers:res.headers,id:res.data._id});
      console.log(res);
      console.log(res.data);
    }).catch((err)=>{
      console.log(err);
    });
  };
  render() {
    if(this.state.currentUser === true){
      return <Redirect to={{
        pathname:"/login",
        state:{
          headers:this.state.headers,
          id:this.state.id
        }
      }}/>
    }
    return (
      <div className="App">
      <form onSubmit={(e)=>this.handleSignUp(e)}>
       username:
       <input type="email" placeholder="username"  name="email" value={this.state.email} onChange={(event)=>this.handleChange(event)} autoFocus/>
       password :
       <input type="password" placeholder="password" name="password" onChange={(event)=>this.handleChange(event)} value={this.state.password}/>
       <button type="submit">Signup</button>
       <button type="submit" onClick={this.handleLogin}>login</button>
      </form>
      </div>
    );
  }
}

export default App;
