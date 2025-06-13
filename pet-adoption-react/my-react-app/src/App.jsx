import './App.css'

function App() {
  return (
    <div className="bg-red-500 text-white p-8">
      <h1 className="text-4xl font-bold">Tailwind Test</h1>
      <p className="text-lg mt-4">If this is red background with white text, Tailwind is working!</p>
      <button className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded mt-4">
        Click me
      </button>
    </div>
  )
}

export default App