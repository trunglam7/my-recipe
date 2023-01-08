import React from 'react'
import 'firebase/compat/auth';
import bgImage from '../images/myrecipebg.jpg';

import './LoginPage.css'

function LoginPage({signIn}) {

    return (
        <div className='login-container'>
            <nav className='login-nav-header'>
                <div className='website-name'>My Recipes</div>
                <button className='sign-btn' onClick={signIn}>Sign In / Sign Up</button>
            </nav>
            <main>
                <div style={{'fontWeight': 'bold', 'fontSize': '100%', 'color': 'white', 'fontFamily': 'Lobster, cursive' }}>My Recipes</div>
                <img className='home-image' src={bgImage} />
            </main>
        </div>
  )
}

export default LoginPage