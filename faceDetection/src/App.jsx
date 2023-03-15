import { useEffect, useRef } from 'react'
import './index.css'
import * as faceapi from 'face-api.js'
import { TinyFaceDetectorOptions } from 'face-api.js'

function App() {
  const video = useRef()
    useEffect( () => {
      async function startVideo() {
        const stream = await navigator.mediaDevices.getUserMedia({video}) // get user video , for aur write audio along with video parameter
        video.current.srcObject = stream // returned stream is fed to video component
        // we can also use try catch
      }
      startVideo()
    },[])

    useEffect(() => {Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ]).then(console.log('Loaded'))}
    ,[])

     function handlePlay() {
        const canvas = faceapi.createCanvasFromMedia(video.current)
        document.body.append(canvas)
        const displaySize = { width : video.current.width , height : video.current.height}
        faceapi.matchDimensions(canvas,displaySize)
        setInterval( async() => {
          const detections = await faceapi.detectAllFaces(video.current,new TinyFaceDetectorOptions()).withFaceExpressions()
          let resizedDetections
          if(window.innerWidth < 720)
            resizedDetections = faceapi.resizeResults(detections,{width:window.innerWidth,  height:400})
          else
            resizedDetections = faceapi.resizeResults(detections,displaySize)
          canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
          faceapi.draw.drawDetections(canvas,resizedDetections)
          faceapi.draw.drawFaceExpressions(canvas,resizedDetections)
        },100)
    }
  

  return (
    <div className="App">
        <video width={720} height={500} autoPlay ref={video} onPlay={handlePlay} ></video>
    </div>
  )
}

export default App
