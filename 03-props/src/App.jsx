import Card from "./components/Card"

const App = () => {
  return (
    <div className='parent'>
      <div className="card">
        <img src="https://w0.peakpx.com/wallpaper/874/7/HD-wallpaper-ultra-instinct-goku-anime-blue-dragon-ball-galaxy-goku-hero-son-goku-ultra-instinct-goku-white.jpg" alt="Son Goku" />
        <h1>Karan Patel</h1>
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
      <Card />
      <Card />
    </div>
  )
}

export default App