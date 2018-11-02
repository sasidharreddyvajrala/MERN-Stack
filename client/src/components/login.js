import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Redirect} from 'react-router-dom';


class Login extends React.Component{

    state={
            text:'',
            completed:false,
            todos:[],
            logout:false
          }

    handleChange=(event)=>{
       event.preventDefault();
       const {name,value}=event.target;
       this.setState({[name]:value});
    }
    handleGetTodo=(e)=>{
        e.preventDefault();
        const {headers}=this.props.location.state;
        const header={
            'x-auth':headers['x-auth']
        };
        axios.get('/todos',{headers:header}).then((res)=>{
        console.log(res);
        console.log(...res.data.todos);
        this.setState({todos:[...res.data.todos]});
        });
    }
    handleUpdateTodo=(id)=>{
        //e.preventDefault();
        const {headers}=this.props.location.state;
        //console.log(id);
        const header={
            'x-auth':headers['x-auth']
        };
        const todo={
            text:this.state.text,
            completed:Boolean(this.state.completed)
          };
           axios.patch(`/todos/${id}`,todo,{headers:header}).then((res)=>{
            console.log(res.data);
        });

    }

    handlePostTodo=(e)=>{
        e.preventDefault();
        const {headers}=this.props.location.state;
        const header={
            'x-auth':headers['x-auth']
        };
        const todo={
            text:this.state.text,
            completed:Boolean(this.state.completed)
        };
        axios.post('/todos',todo,{headers:header}).then((res)=>{
           console.log(res);
           console.log(res.data);
           this.setState({todos:[...this.state.todos,res.data]});
        });
      };
      handleDelete=(id)=>{
        //e.preventDefault();
        const {headers}=this.props.location.state;
        //const id=this.state.todos._id;
        const header={
            'x-auth':headers['x-auth']
        };
        axios.delete(`/todos/${id}`,{headers:header}).then((res)=>{
           console.log(res.data);
        });
      };

    //   handleOnClick=(e)=>{
    //       e.preventDefault();
    //       for(let todo of this.state.todos){
    //         let id=todo._id;
    //       }
    //       return id;
    //   };

      handleLogout=(e)=>{
        e.preventDefault();
        const {headers}=this.props.location.state;
        const header={
            'x-auth':headers['x-auth']
        };
        axios.delete('/users/me/token',{headers:header}).then((res)=>{
           if(res){
               this.setState({logout:true});
           }
           console.log(res);
           console.log(res.body);
        });
      };
   
    
    render(){

        if(this.state.logout===true){
           return <Redirect to="/"/>
        }
        console.log("todo: ",this.state.todos);
        return(
            <div>
            <Link to='/'>Home</Link>
            <h4>LoginPage</h4>
            <h5>ToDoList</h5>
            <form>
            <button onClick={(e)=>this.handleLogout(e)}>Logout</button>
            text:
            <input type="text" 
            placeholder="Enter the task"  
            name="text" 
            value={this.state.text}
            onChange={(event)=>this.handleChange(event)} autoFocus/>
            completed:
            <select name="completed" value={this.state.completed} onChange={(event)=>this.handleChange(event)}>
            <option value="true">True</option>
            <option value="false">False</option>
            </select>
            <button onClick={(e)=>this.handleGetTodo(e)}>Get Todo</button>
            <button onClick={(e)=>this.handlePostTodo(e)}>Post Todo</button>
            </form>
            <div>
            <ol onClick={this.handleGetTodo}>
            {this.state.todos && this.state.todos.map((todo)=>
                <li key={todo._id}>{todo.text}-{String(todo.completed)}
                <button onClick={()=>this.handleUpdateTodo(todo._id)}>Update</button>
                <button onClick={()=>this.handleDelete(todo._id)}>Remove</button>
                </li>
                )}
            </ol>
            </div>
        </div>
        );
    }
   
}


export default Login;