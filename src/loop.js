
const DEAFULT_FPS = 60


const loop = (fn, fps = DEAFULT_FPS) => {
  const intervalId = window.setInterval(() => fn(), 1000 / fps)
  console.log("here...", intervalId)

  return {
    stop: window.clearInterval(intervalId),
  }
}

export default loop
