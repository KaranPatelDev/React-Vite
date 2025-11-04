import React from 'react'
import Card from './components/card.jsx'
import Navbar from './components/navbar.jsx';

const App = () => {
  const user = "Karan";
  const age = 20;

  return (
    <div>
      <div className='navbar'>
        <Navbar />
      </div>
      {/* <div className='navbar'>
        <Navbar />
      </div> */}
      <div className='card'>
        <h1>Hello Vite + React!</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, eum?
        </p>
        <p>User Name: {user}</p>
        <p>User Age: {age}</p>
      </div>
      <Card />
      
    </div>
  )
}

export default App