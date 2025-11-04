import React from "react";

const Card = (props) => {
    console.log(props);
    console.log(props.age)
    console.log(props.user)

    
    return (
        <div className="card">
        <img
            src={props.imgURL}
            alt="Vegeta : Ultra Ego"
        />
        <h1>Son Goku</h1>
        <p>“Final Year B.Tech Student at Drs. Kiran and Pallavi Patel Global
            University | Python & Web Developer | Data Analyst | ML and Full Stack
            Enthusiast”
        </p>
        <button
            onClick={() =>
            window.open("https://www.linkedin.com/in/karan-patel-16700a215/")
            }
        >
            LinkedIn Profile
        </button>
            {props.user && props.age && (
                <div className="card-footer">
                    <h2>User Name: {props.user}</h2>
                    <h2>Age: {props.age}</h2>
                </div>
            )}
        </div>
    );
};

export default Card;



// Second Method

// import React from "react";

// const Card = (props) => {
//   let footerContent;

//   // 🧠 Conditional logic before returning JSX
//   if (props.user && props.age) {
//     footerContent = (
//       <div className="card-footer">
//         <h2>User Name: {props.user}</h2>
//         <h2>Age: {props.age}</h2>
//       </div>
//     );
//   } else {
//     footerContent = (
//       <div className="card-footer">
//         <h2>No user data provided.</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="card">
//       <img
//         src="https://w0.peakpx.com/wallpaper/874/7/HD-wallpaper-ultra-instinct-goku-anime-blue-dragon-ball-galaxy-goku-hero-son-goku-ultra-instinct-goku-white.jpg"
//         alt="Son Goku"
//       />
//       <h1>Son Goku</h1>
//       <p>
//         “Final Year B.Tech Student at Drs. Kiran and Pallavi Patel Global
//         University | Python & Web Developer | Data Analyst | ML and Full Stack
//         Enthusiast”
//       </p>
//       <button
//         onClick={() =>
//           window.open("https://www.linkedin.com/in/karan-patel-16700a215/")
//         }
//       >
//         LinkedIn Profile
//       </button>

//       {/* 👇 Conditionally rendered content */}
//       {footerContent}
//     </div>
//   );
// };

// export default Card;

