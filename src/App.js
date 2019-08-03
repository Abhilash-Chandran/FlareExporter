import React from "react";
import "./App.css";
import FlareExporterOptions from "./components/FlareExporterOptions/FlareExporterOptions";
import ButtonWithOverlayText from "./components/Overlays/Overlay";
import Helpmd from "../src/components/Overlays/Help.md";
import Infomd from "../src/components/Overlays/Info.md";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ButtonWithOverlayText
          styleName="Help"
          menuText="Help?"
          mdfile={Helpmd}
        />
        <FlareExporterOptions />
        <ButtonWithOverlayText
          styleName="Info"
          menuText="Info!"
          mdfile={Infomd}
        />
      </header>
    </div>
  );
}

export default App;
