import './App.css';

const images = [
  require("./assets/image1.png"),
  require("./assets/chat2.png"),
  require("./assets/dashboard1.png"),
  require("./assets/tracker1.png"),
  require("./assets/Edit1.png"),

];
export default function About() {
  return (
    <header className="App-header base">
      <p>
        LearningMap_Tracker<br /> A powerful tool for making your own systematic learning plan with AI support <br /> Completely free
      </p>
      <a
        className="App-link"
        href="/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Go try out!
      </a>
      <features></features>
      
      <div className='wrapper'>
        <div>
          <h3>Some UI screens</h3>
          {images.map((img, idx) => (
        <div className='my-5'><img key={idx} src={img} style={{ width:"80%", objectFit: "cover" }}alt="demo pictures" /></div>
      ))}
        </div></div>

    </header>
  )
}