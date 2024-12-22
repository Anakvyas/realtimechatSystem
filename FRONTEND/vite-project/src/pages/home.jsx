import React ,{useEffect, useState} from 'react';
import LEFTPART from '../components/home/LEFTPART';
import Navbar from '../components/navbar/navbar';
import axios from 'axios';
import ChatWindow from '../components/home/RIGHTPART';
import socket from './socket';

import './home.css'

const HomePage = () => {


    let [isopen,setisopen] = useState(true);
    let [selectedUser,setselectedUser] = useState({});
    const [darkMode, setDarkMode] = useState(false);
    const [loginuser ,setloginuser] = useState({});
    const [allusers , setallusers] = useState([]);
    let [message ,setmessage] = useState([]);
    let[onlineusers ,setonlineusers] = useState([]);
  
   
 

    useEffect(() => {
        axios.get('/api/user/getuser')
        .then((r)=>{    
            setloginuser(r.data);
            
        });
    },[])

    useEffect(() => {
        if (loginuser._id) {
            socket.emit('user-connected', loginuser._id);
        }
    }, [loginuser]);


    useEffect(() => {
        socket.on('update-users', (updatedUsers) => {
            setonlineusers(Object.keys(updatedUsers)); 
        });
    
        return () => {
            socket.off('update-users');
        };
    }, []);
    
    useEffect(()=>{
        if (loginuser?._id && selectedUser?._id) {
        axios.get(`/api/user/message?senderId=${loginuser._id}&receiverId=${selectedUser._id}`)
        .then((response)=>{
            setmessage(response.data);
        
        })
        .catch((err)=>{
                console.log(err);
        })
    }
    },[loginuser,selectedUser])

// ------------------------------------------------------

    useEffect(()=>{
        axios.get('/api/user/allusers')
        .then((r)=>{
            let users = r.data;

            let filter = users.filter((i)=>(i._id?.toString() !== loginuser._id?.toString()))
            setallusers(filter);
        })
        .catch((err)=>{
            console.log(err);
        })
      
    },[loginuser]);

    useEffect(()=>{
        socket.on('receivemessage',(newmessage)=>{
            if(newmessage.senderId?._id?.toString() === selectedUser?._id?.toString() || 
            newmessage.receiverId?._id?.toString() === selectedUser?._id?.toString()){
                setmessage((prev) =>[...prev, newmessage ])
                console.log(newmessage);
            }
            return () => {
                socket.off('receivemessage')
            };    
        })
    },[selectedUser])

    
       
       

    const  sendmessage = (text , image) =>{
        
        const messageData = {
            senderId: loginuser._id,
            receiverId: selectedUser._id,
            text: text,
            image: image
        };
        
        if(messageData.senderId !== undefined && messageData.receiverId !== undefined){
                socket.emit('sendmessage',{messageData})
                setmessage((prevMessages) => [...prevMessages,messageData]);
        }else{
            console.log("select user");
        }
    
    };

    return (
            <div className='home'>
                <Navbar setisopen = {setisopen} isopen = {isopen}  darkMode = {darkMode} setDarkMode = {setDarkMode}/>
                <LEFTPART isopen = {isopen} setselectedUser = {setselectedUser} darkMode = {darkMode} allusers = {allusers} loginuser={loginuser} onlineusers={onlineusers}/>
                <ChatWindow selectedUser={selectedUser}  darkMode = {darkMode} sendmessage = {sendmessage} message={message} />
            </div>
        
    );
}

export default HomePage;
