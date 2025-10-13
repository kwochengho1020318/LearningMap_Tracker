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

        <div className="learning-map-intro p-8 bg-gray-50 rounded-xl shadow-md max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            🚀 AI-Powered Learning Map for New Hires
          </h2>

          <p className="text-gray-700 text-lg mb-6 text-center">
            Turn scattered internal documents into a guided, role-based onboarding experience.
            Our AI analyzes your company's files and generates a personalized learning path,
            showing new hires exactly what to learn and in what order.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">How it works</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li><strong>Index:</strong> Upload docs (PDF, Drive, Confluence, SOPs) to ElasticSearch.</li>
                <li><strong>Analyze:</strong> AI scans and ranks content by relevance and difficulty.</li>
                <li><strong>Generate:</strong> Creates a phased learning path (Day 1 → Week 1 → Month 1).</li>
                <li><strong>Guide:</strong> Direct links to exact sections, quizzes, and practical tasks.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Key Benefits</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>Accelerate new hire ramp-up</li>
                <li>Company-specific, actionable learning paths</li>
                <li>Permission-aware access to internal content</li>
                <li>Track progress and continuously improve training</li>
              </ul>
            </div>
            </div>

            <p className="text-center">
              <a 
                href="/signup" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition mr-4"
              >
                Get Started
              </a>
              <a 
                href="/demo" 
                className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                See a Demo
              </a>
            </p>
</div>

      </div>
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