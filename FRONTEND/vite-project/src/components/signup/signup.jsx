import React ,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';

import axios from 'axios'
import './signup.css'

const Signup = () => {

    const navigate = useNavigate();

    let [formdata , setformdata] = useState({
        username : "",
        email : "",
        password : "",
        profilepic : null,
    });
    

    const onhandlechange = (event)=>{
        let name = event.target.name;
        let value = event.target.value;

        setformdata((curr) =>{
            curr[name] = value;
            return {...curr};
        })
    };
    
    const onhandlefile = (event)=>{
        setformdata((curr)=>{
            return {...curr,profilepic  : event.target.files[0]};
        });
    }
    const onhandlesubmit = async (event)=>{
        event.preventDefault();

        const data = new FormData();
        data.append('username', formdata.username);
        data.append('email', formdata.email);
        data.append('password', formdata.password);
        if (formdata.profilepic) {
            data.append('profilepic', formdata.profilepic);
        }
       try{
        console.log(formdata.profilepic);
        const response  = await axios.post('/api/user/signup',data ,{
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
        );
            
        navigate('/home');
    

       }catch(err) {
        if (err.response) {
            console.log('Error response:', err.response.data);
        }
    }
    }

    return (   
       <div className='form signup'>
        <h1>Signup</h1>
        <form encType='multipart/form-data' onSubmit={onhandlesubmit}>
            <div className="mb-3">
                <label htmlFor="Username" className="form-label">Username</label>
                <input type="Username" className="form-control" id="Username" onChange={onhandlechange} name='username' value={formdata.username}/>
            </div>
            <div className="mb-3">
                <label htmlFor="Email1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="Email1" aria-describedby="emailHelp" onChange={onhandlechange} name='email' value={formdata.email}/>
            </div>
            <div className="mb-3">
                <label htmlFor="formFile" className="form-label">Profile Pic</label>
                <input className="form-control form-control" id="formFile" type="file" onChange={onhandlefile}/>
            </div>
            <div className="mb-3">
                <label htmlFor="Password1" className="form-label">Password</label>
                <input type="password" className="form-control" id="Password1" onChange={onhandlechange} name='password' value={formdata.password}/>
            </div>
            <button type="submit" className="btn btn-dark" >Sign in</button>
        </form>
        <br></br>
        Have a account ? <Link to="/login">Login</Link>
       </div>
    );
}

export default Signup;
