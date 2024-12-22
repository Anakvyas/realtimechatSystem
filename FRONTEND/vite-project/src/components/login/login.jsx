import React ,{useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'

const Login = () => {
    const navigate = useNavigate();
    let [formdata , setformdata] = useState({
        username : "",
        password : "",
    });

    const onhandlechange = (event)=>{
        let name = event.target.name;
        let value = event.target.value;

        setformdata((curr) =>{
            curr[name] = value;
            return {...curr};
        })
    };

    const onhandlesubmit = async (event)=>{4
        event.preventDefault();

        await axios.post('/api/user/login', formdata)
        .catch((error) => {
        console.error(error);
        });

        navigate('/home');

    }

    return (
        <div className='login' onSubmit={onhandlesubmit}>
        <h1>Login</h1>
            <form>
            <div className="mb-3">
                <label htmlFor="Username" className="form-label">Username</label>
                <input type="Username" className="form-control" id="Username" onChange={onhandlechange} name='username' value={formdata.username}/>
            </div>
            <div className="mb-3">
                <label htmlFor="Password1" className="form-label">Password</label>
                <input type="password" className="form-control" id="Password1" onChange={onhandlechange} name='password' value={formdata.password}/>
            </div>
            <button type="submit" className="btn btn-dark" >Login</button>
            </form>
        </div>
    );
}

export default Login;
