import React, { useState,useEffect,useRef  } from 'react';
import { FaPhone, FaVideo } from "react-icons/fa";
import { FaPaperPlane, FaImage } from 'react-icons/fa';
import Empty from './empty';
import './home.css';
import axios from 'axios';

const ChatWindow = (props) => {
  let [text , settext] = useState("");
  let [image ,setimage] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handletext = (e) =>{
    settext(e.target.value);
  }


  const handleimage = (e)=>{
    setLoading(true);
    let msgpic = e.target.files[0];
    let formdata = new FormData();
    formdata.append('msgpic' , msgpic);
    axios.post('/api/user/uploads', formdata, {
        headers:{
            'Content-Type': 'multipart/form-data',
        }
    })
    .then((response)=>{
        setimage(response.data);
        setLoading(false);
    }) 
    .catch((err)=>{
        console.log(err);
        setLoading(false);
    })

  }
  const handleRemoveImage = () => {
    setimage(null); 
    setLoading(false); 
  };
  
  const sendbutton = ()=>{
    props.sendmessage(text,image);
    settext('');
    setimage(null);
    // console.log(props.message);
  }
  



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.message]);

  const Id = props.selectedUser?._id || '';

  return (  
    <>
    {Id ? (
    <div className={`chatwindow ${props.darkMode ? "dark" : "bright"}`}>
    <div className='head'>
        <div className='t'> 
            <img src={props.selectedUser.profilepic} style={{ marginTop: '4px', height: '60px', width: '58px', borderRadius: '22px' }} />
            <div className='text'>
                <h4>{props.selectedUser.username}</h4>
                <i>select for more info</i>
            </div>
        </div>

        <div className='icons'>
            <ul>
                <li><FaPhone /></li>
                <li><FaVideo /></li>
            </ul>
        </div>
    </div>

    <div className='msg'>
    
       <div className='msgwindow'> 

       {props.message.map((m, index) => (
        <div 
        key={index} 
        className={props.selectedUser._id?.toString() === m.senderId?.toString() ? "receivedMessage" : "sentMessage"}>  
        {m.text && m.text}
        {m.image && <img src={m.image} style={{width:'300px' ,height:'300px'}}></img>}
        </div>
    ))}
    <div ref={messagesEndRef} />
    </div>
        
    </div>

    <div className="typeMessage">
        <div className="inputSection">
            <input type="text" 
           placeholder={loading || image ? "wait image is loading...." : "TYPE YOUR MESSAGE"}  value={text} onChange={handletext} />

            {image && (
                <div className="imagePreview">
                  <img src={image} alt="preview" style={{ width: '100px', height: '100px' }} />
                  <button className="removeImageButton" onClick={handleRemoveImage}>X</button>
                </div>
              )}


            <i>
                <label htmlFor="fileUpload" className="uploadIcon">
                    <FaImage />
                    <input type="file" id="fileUpload" accept="image/*" onChange={handleimage} hidden />
                </label>
                <button className="sendButton" onClick={sendbutton}>
                    <FaPaperPlane />
                </button>
            </i>
        </div>
    </div>
</div>
)
:   
(<Empty/>)} 
</>
);
};



export default ChatWindow;