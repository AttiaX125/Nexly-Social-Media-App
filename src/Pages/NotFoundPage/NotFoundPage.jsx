import cavman1 from "../../assets/cavman1.jpeg"
import cavman2 from "../../assets/cavman2.jpeg"
import cavman3 from "../../assets/cavman-3.jpeg"
import cavman4 from "../../assets/cavman-4.jpeg"
import cavman5 from "../../assets/cavman-5.jpeg"
import cavman6 from "../../assets/cavman-6.jpeg"
import { useEffect, useState } from "react"
export default function NotFoundPage() {
  const frames = [cavman1, cavman2, cavman3, cavman4, cavman5,cavman6];

  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 1000); // speed (200ms per frame)

    return () => clearInterval(interval);
  });

  
  return (
    <div className="min-h-screen z-40 bg-black flex justify-center items-center font-sans inset-0">
      <div className="card bg-transparent w-125 p-10 text-center rounded-md">
        <h1 className="text-6xl text-[#555] mb-5">404</h1>
        <div className="animation-container my-5">
              <img
      src={frames[currentFrame]}
      alt="404 animation"
      style={{ width: "250px" } }
     
    />
        </div>
        <h2>Look like you are lost</h2>
      <p>the page you are looking for not availble !</p>
      <button>Go to Home</button>
      </div>
    </div>
  )
}
