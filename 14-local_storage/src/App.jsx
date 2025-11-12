import React from 'react'

const App = () => {
  // localStorage.clear()
  sessionStorage.clear()

  // localStorage.setItem('User', 'Karan') //Even after closing the browser, data will persist also even after removing this piece of code

  const user = localStorage.getItem('User') //To get the data from localStorage
  console.log(user)

  localStorage.setItem('Age', 21)
  localStorage.removeItem('Age') //To remove a particular item from localStorage


  const user_karan= {
    name: 'Karan',
    age: 20,
    city: 'Vadodara'
  }
  localStorage.setItem('User_Karan', JSON.stringify(user_karan)) //Storing object in localStorage after converting it to string
  localStorage.setItem("User_karan", user_karan) //This will store [object Object] in localStorage

  const karanDetails = JSON.parse(localStorage.getItem('User_Karan')) //To get the object from localStorage and converting it back to object
  console.log(karanDetails)


  return (
    <div>
      App
    </div>
  )
}

export default App