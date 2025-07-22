import LightRays from "./components/Background";

function App() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <div className="absolute top-0 left-0 z-0 w-full h-full">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
        />
      </div>

      <div>
        <h1 className="text-4xl font-bold mb-6">Sri Lankan NIC Info Finder </h1>
      </div>
    </div>
  );
}

export default App;
