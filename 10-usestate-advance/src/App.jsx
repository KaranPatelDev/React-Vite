import React, { useState } from 'react'

// const App = () => {

//   const [num, setNum] = useState(10)
//   const btnClicked = () => {
//     setNum(prev => (prev + 1))
//     setNum(prev => (prev + 1))
//     setNum(prev => (prev + 1))
//   }


//   const [name, setName] = useState({
//     name: "Karan",
//     age: 20
//   })
//   const btnClicked2 = () => {
//     const newName = {...name};
//     console.log(newName)
//     newName.name = "Rahul"
//     newName.age = 21
//     setName(newName)
//   }



//   return (
//     <div>
//       <h1>{num}</h1>
//       <button onClick={btnClicked}>click</button>
//       <h1>{name.name} : {name.age}</h1>
//       <button onClick={btnClicked2}>click to change age</button>
//     </div>
//   )
// }







const App = () => {

  const [num, setNum] = useState([10, 20, 30])
  const btnClicked = () => {
    const newNum = [...num]
    newNum.push(40)
    setNum(newNum)
  }
  return (
    <div>
      <h1>{num}</h1>
      <button onClick={btnClicked}>click</button>
    </div>
  )
}



export default App