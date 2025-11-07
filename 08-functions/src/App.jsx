import React from 'react'

// const App = () => {

//   const btnClicked = () => {
//     console.log("Button Clicked")
//   }

//   function mouseEnter(){
//     console.log("Mouse Entered")
//   }

//   function inputChanging(){
//     console.log("User is typing!!")
//   }

//   return (
//     <div>
//       <button onMouseEnter={mouseEnter} onClick={btnClicked}>Click Here</button>
//       <button onMouseEnter={mouseEnter} onClick={btnClicked}>Explore This</button>
//       <input onChange={inputChanging} type="text" placeholder='Enter Your Name' />

//       <input onChange={function(){
//         console.log("User is typing!!")
//       }} type="text" placeholder='Enter Your Name : ' />


//       <input onChange={function(elem){
//         console.log(elem)
//         console.log(elem.target.value)
//       }} type="text" placeholder='Enter Your Name : ' />
//     </div>
//   )
// }

// export default App








// const App = () => {
//   return (
//     <div>
//       <div onClick={(elem) => {
//         console.log("Red Light You are dead !!!!!")
//         console.log(elem.clientX, elem.clientY)
//       }} className="box"></div>
//     </div>
//   )
// }

// export default App;










const App = () => {

  const pageScrolling = (elem) => {
    if(elem > 0){
      console.log("Scrolling Down - Seedha Scroll")
    }else{
      console.log("Scrolling Up - Ulta Scroll")
    }
}


  return (
    <div onWheel={(elem) => {
      console.log(elem)
      console.log(elem.deltaX)
      console.log(elem.deltaY)
      console.log(elem.deltaZ)
      pageScrolling(elem)
    }}>
      <div className="page1"></div>
      <div className="page2"></div>
      <div className="page3"></div>
    </div>
  )
}

export default App;