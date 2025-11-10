import React from 'react'
import { useState } from 'react'

// const App = () => {

//   // const[title, setTitle] = useState(' ')


//   const submitHandler = (e) => {
//     e.preventDefault();  // Prevents the default form submission behavior (that is form doesn't reload on submitting)
//     console.log('Form Submitted')
//     // alert('Form Submitted')
    
//   }

//   return (
//     <div>
//       <form onSubmit={(e) => {
//         submitHandler(e)
//       }}>
//         <input type="text" placeholder='Enter your name : ' onChange={(e) =>{
//           console.log("Writting....")
//           console.log(e.target.value)}}
//         />
//         <button>Submit</button>
//       </form>
//     </div>
//   )
// }

// export default App











const App = () => {

  const[title, setTitle] = useState('')


  const submitHandler = (e) => {
    e.preventDefault();
    console.log('Form Submitted by ', title)
    // alert('Form Submitted')

    setTitle('')
  }

  return (
    <div>
      <form onSubmit={(e) => {
        submitHandler(e)
      }}>
        <input type="text" placeholder='Enter your name : ' value={title} onChange={(e)=>{
          setTitle(e.target.value)
        }}/>
        <button>Submit</button>
      </form>
    </div>
  )
}

export default App