import React, {useState} from 'react'
import axios from 'axios'

const App = () => {
  async function getData() {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    console.log(response)
  }


  const getData1 = async() => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json()
    console.log(data)
  }


  const getData2 = async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users')
    console.log(response.data)
  }




  const [dataa, setData] = useState([])
  const getData3 = async () => {
    const response = await axios.get('https://picsum.photos/v2/list')
    setData(response.data)
  }



  const getData4 = async () => {
    const response = await axios.get('https://picsum.photos/v2/list')
    console.log(response)
  }

  return (
    <div>
      <button onClick={getData}>Get Data</button>
      <button onClick={getData1}>Get Data 1</button>
      <button onClick={getData2}>Get Data 2</button>
      <button onClick={getData4}>Get Data 4</button>


      <button onClick={getData3}>Get Data 3</button>
      <div>
        {dataa.map(function(elem,idx){
          return <h3>Hello, {elem.author} {idx}</h3>
        })}
      </div>


    </div>
  )
}

export default App