import { useRef, useState } from 'react';

function App() {
  const [message, setMessage] = useState("")
  const [data, setData] = useState([])
  const scrollRef = useRef()

  const getAns = async (message) => {
    try {
      const res = await fetch("http://localhost:5000", {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      })

      const ans = await res.json()
      setData(p => [...p, {
        ...ans,
        id: p.length
      }])
      scrollRef.current?.scrollIntoView({ behavior: "smooth" })

    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit = () => {
    if (message) {
      getAns(message)
      setData(p => [...p, { content: message, id: p.length, role: "user" }])
      setMessage("")
      scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="grid grid-rows-[1fr_auto] h-screen max-w-3xl mx-auto p-6">
      <div className="p-4 overflow-auto mt-2 border">
        {
          data.map(d => (
            <div
              key={d.id}
              className={`flex my-2 text-sm ${d.role === "user" ? "justify-end" : ""}`}
            >
              <p className={`px-2 py-1 rounded ${d.role === "user" ? "bg-blue-200" : "bg-gray-200"}`}>
                {d.content}
              </p>
            </div>
          ))
        }
        <div ref={scrollRef}></div>
      </div>

      <div className='flex items-center gap-2 p-2 border'>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => {
            if (e.code === "Enter") {
              onSubmit()
            }
          }}
          className='w-full py-1 px-2 border focus:outline-none'
        />

        <button
          onClick={onSubmit}
          className='px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700'
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default App
