import React, { useState } from 'react'

const App = () => {
  const [num, setNum] = useState(20);
  const [userName, setUserName] = useState("Omkar Sahasrabuddhe");
  const [users , setUsers] = useState(["Karan ", "Omkar ", "Shubham"]);
  const [arr, setArr] = useState([10 , 20 , 30 , 40 , 50]);

  function changeNum(){
    setNum(num + 1);
    setUserName("Karan Patel");
    setUsers(["Karan Patel |", "Omkar Sahasrabuddhe |", "Shubham Gupta "]);
    setArr([100 , 200 , 300 , 400 , 500]);
  }


  // let a = 20;
  // function changeA(){
  //   console.log("Value of a is ", a);
  //   a++;
  //   console.log("Value of a changed to ", a);
  // }

  return (
    <div>
      <h1>Value of num is {num} <br /> Value of username is {userName} <br /> Value of arr is {arr}<br /> Value of users is {users}</h1>
      <button onClick={changeNum}>Click Me</button>
    </div>
  )
}

export default App