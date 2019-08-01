import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import FlareExporterOptions from "./components/FlareExporterOptions/FlareExporterOptions";
import IconButton from "./components/IconButtons/IconButton";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div id="helpMenu" className="HelpToggle" />
        <IconButton
          handleClick={evt => {
            document.getElementById("helpMenu").classList.toggle("collapse");
          }}
          iconText="?"
          label=""
        />
        <FlareExporterOptions />
        <IconButton
          handleClick={evt => {
            document.getElementById("infoMenu").classList.toggle("collapse");
          }}
          iconText="i"
          label=""
        />
        <div id="infoMenu" className="InfoToggle" />
      </header>
    </div>
  );
}

export default App;
