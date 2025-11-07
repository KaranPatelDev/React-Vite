import React from 'react'

const App = () => {

  const btnClicked = () => {
    console.log("Button Clicked")
  }

  function mouseEnter(){
    console.log("Mouse Entered")
  }

  function inputChanging(){
    console.log("User is typing!!")
  }

  return (
    <div>
      {/* <h1>Karan Patel</h1> */}
      <button onMouseEnter={mouseEnter} onClick={btnClicked}>Click Here</button>
      <button onMouseEnter={mouseEnter} onClick={btnClicked}>Explore This</button>
      <input onChange={inputChanging} type="text" placeholder='Enter Your Name' />

      <input onChange={function(){
        console.log("User is typing!!")
      }} type="text" placeholder='Enter Your Name : ' />


      <input onChange={function(elem){
        console.log(elem)
        console.log(elem.target.value)
      }} type="text" placeholder='Enter Your Name : ' />
    </div>
  )
}

export default App