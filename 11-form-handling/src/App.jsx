import React from 'react'

const App = () => {

  const submitHandler = (e) => {
    e.preventDefault();  // Prevents the default form submission behavior (that is form doesn't reload on submitting)
    console.log('Form Submitted')
    // alert('Form Submitted')
    
  }

  return (
    <div>
      <form onSubmit={(e) => {
        submitHandler(e)
      }}>
        <input type="text" placeholder='Enter your name : '/>
        <button>Submit</button>
      </form>
    </div>
  )
}

export default App