import React from 'react';

const Empty = () => {
    return (
        <div style={{display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100vh',
            textAlign: 'center', 
            marginLeft:'110px'

        }}>
            <img src='https://static.thenounproject.com/png/692992-200.png'/>
            <h2>SELECT USER WHOM YOU WANT TO TALK...</h2>
        </div>
    );
}

export default Empty;
