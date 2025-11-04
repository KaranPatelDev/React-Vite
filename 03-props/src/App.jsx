import Card from "./components/Card"

const App = () => {
  return (
    <div className='parent'>
      <div className="card">
        <img src="https://w0.peakpx.com/wallpaper/434/414/HD-wallpaper-ultra-ego-vegeta-dragon-ball-2023.jpg" alt="Son Goku" />
        <h1>Vegeta : Ultra Ego</h1>
        <p>“Final Year B.Tech Student at Drs. Kiran and Pallavi Patel Global University | Python & Web Developer | Data Analyst | ML and Full Stack Enthusiast”</p>
        <button
          onClick={() =>
            window.open(
              'https://www.linkedin.com/in/karan-patel-16700a215/',
            )
          }
        >
          Learn More
        </button>
      </div>
      {/* <Card user = "Karan" age = "20"/> */}

      <Card user = "Omkar" age = {18} imgURL = "https://w0.peakpx.com/wallpaper/434/414/HD-wallpaper-ultra-ego-vegeta-dragon-ball-2023.jpg"/> {/* Passing props to Card component and {} is used to pass integers as props*/}

      <Card user = "Karan" age = {20} imgURL = "https://w0.peakpx.com/wallpaper/434/414/HD-wallpaper-ultra-ego-vegeta-dragon-ball-2023.jpg"/>

      <Card user = "Karan Patel" age ={20} imgURL = "https://w0.peakpx.com/wallpaper/434/414/HD-wallpaper-ultra-ego-vegeta-dragon-ball-2023.jpg" />

      <Card/>

      <Card user = "Omkar" age = {18} imgURL = "https://w0.peakpx.com/wallpaper/434/414/HD-wallpaper-ultra-ego-vegeta-dragon-ball-2023.jpg"/>
      
    </div>
  )
}

export default App