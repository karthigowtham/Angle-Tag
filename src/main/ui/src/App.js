import React, { Component } from "react";
import AceEditor from "react-ace";
import "brace/mode/jsx";
import "brace/ext/language_tools";
import "brace/ext/searchbox";
import axios from "axios";
import NavBar from "./navbar";
import beautify from 'xml-beautifier';
import * as _ from "underscore";

const languages = [
  "xml",
];

const themes = [
  "monokai",
  "github",
  "tomorrow",
  "kuroir",
  "twilight",
  "xcode",
  "textmate",
  "solarized_dark",
  "solarized_light",
  "terminal",
  "tomorrow_night_eighties",
  "dracula",

];
languages.forEach(lang => {
  require(`brace/mode/${lang}`);
  require(`brace/snippets/${lang}`);
});

themes.forEach(theme => {
  require(`brace/theme/${theme}`);
});
/*eslint-disable no-alert, no-console */

const defaultValue = "<?xml version='1.0' encoding='UTF-8'?>"

const domain = {
  dev: process.env.REACT_APP_DOMAIN
}

class App extends Component {

  openClick() {
    this.refs.fileUploader.click();
  }
  
  openChooseFile(){
    this.refs.fileChooser.click();
  }
  
  onChange(newValue) {
    //console.log("change", newValue);
    this.setState({
      value: newValue
    });
  }

  onSelectionChange(newValue, event) {
    // console.log("select-change", newValue);
    //console.log("select-change-event", event);
  }

  onCursorChange(newValue, event) {
    // console.log("cursor-change", newValue);
    // console.log("cursor-change-event", event);
  }

  onValidate(annotations) {
    // console.log("onValidate", annotations);
  }

  setPlaceholder(e) {
    this.setState({
      placeholder: e.target.value
    });
  }
  setTheme(e) {
    this.setState({
      theme: e.target.value
    });
  }
  setMode(e) {
    this.setState({
      mode: e.target.value
    });
  }
  setBoolean(name, value) {
    this.setState({
      [name]: value
    });
  }
  setFontSize(e) {
    this.setState({
      fontSize: parseInt(e.target.value, 10)
    });
  }
  loadFromServer() {
    console.log("Calling from server");
    var myObj = this;
    console.log(myObj);
    axios.get("http://localhost:8080/api/xml/test", { responseType: 'text' }).then(
      res => {
        // console.log("load from server", res);
        myObj.setState({
          value: res.data
        });
      })
  }
  constructor(props) {
    super(props);
    this.state = {
      value: defaultValue,
      placeholder: "<?xml version='1.0' encoding='UTF-8'?>",
      theme: "xcode",
      mode: "xml",
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      fontSize: 16,
      showGutter: true,
      showPrintMargin: true,
      highlightActiveLine: true,
      enableSnippets: false,
      showLineNumbers: true,
      result: "",
      xpathVersion: "1.0",
      input:"",
      output: "",
      param: "",
      multiXSD:[]
    };
    this.setPlaceholder = this.setPlaceholder.bind(this);
    this.setTheme = this.setTheme.bind(this);
    this.setMode = this.setMode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setFontSize = this.setFontSize.bind(this);
    this.setBoolean = this.setBoolean.bind(this);

  }
  render() {
    return (
      <div>
        <NavBar
          openClick={() => this.openClick()}
          format={() => this.format()}
          serialize={() => this.serialize()}
          deSerialize={() => this.deserialize()}
          xpathEval={() => this.evaluateXpath()}
          transformXslt={() => this.transformXslt()}
          transformXquery={() => this.transformXquery()}
          saveClick={() => this.save()}
          generateXML={() => this.generateXML()}
          viewInGraph={() => this.handleSubmit()}
          saveToFile={()=>this.saveToFile()}
          validateXML={()=>this.validateXML()}
          validateMultiXML={()=>this.validateMultiXML()}
        >

        </NavBar>
        <div className="row mt-1">
          <div className="col-md-8">
            <div className="card text-white ace-container ">
              <div className="card-body p-1">
                <AceEditor
                  placeholder={this.state.placeholder}
                  mode={this.state.mode}
                  theme={this.state.theme}
                  name="angleEditor"
                  onLoad={this.onLoad}
                  onChange={this.onChange}
                  onSelectionChange={this.onSelectionChange}
                  onCursorChange={this.onCursorChange}
                  onValidate={this.onValidate}
                  value={this.state.value}
                  fontSize={this.state.fontSize}
                  showPrintMargin={this.state.showPrintMargin}
                  showGutter={this.state.showGutter}
                  highlightActiveLine={this.state.highlightActiveLine}
                  setOptions={{
                    enableBasicAutocompletion: this.state.enableBasicAutocompletion,
                    enableLiveAutocompletion: this.state.enableLiveAutocompletion,
                    enableSnippets: this.state.enableSnippets,
                    showLineNumbers: this.state.showLineNumbers,
                    tabSize: 2
                  }}
                  width="100%"
                  height="85vh"
                  ref="aceEditor"
                />
              </div>
            </div>
            <div><small>(ctrl+z->undo);(ctrl+y->redo);(ctrl+x->cut);(ctrl+c->copy);(ctrl+p->paste)</small></div>
          </div>
          <div className="col-md-4 pl-0">
            <div className="card text-white bg-right-side mb-1 ">
              <div className="card-body">
                <div className="form-group">
                  <label><a onClick={()=>this.openChooseFile()} href="#" className="btn btn-sm btn-warning">Choose</a>  or type xpath/xslt/xsd/xquery </label> 
                  &nbsp; ||   <a onClick={()=>this.chooseMultiXsd()} href="#" className="btn btn-sm btn-warning">Choose</a> multiple XSDs
                 <br/>
                  <a className="btn btn-sm btn-secondary mb-1" data-toggle="collapse" href="#paramCollapse" role="button" aria-expanded="false" aria-controls="paramCollapse">
                   Params &nbsp;<i className="fas fa-chevron-down"></i> 
                  </a> <label >Xpath Evaluate&nbsp;</label>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="xpath-version" id="xpath-version-1" value="1.0" checked={this.state.xpathVersion === '1.0'} onChange={() => this.xpathChange('1.0')} />
                    <label className="form-check-label">verison 1</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="xpath-version" id="xpath-version-2" value="2.0" checked={this.state.xpathVersion === '2.0'} onChange={() => this.xpathChange('2.0')} />
                    <label className="form-check-label">verison 2</label>
                  </div>
                  <button className="btn btn-sm btn-success" data-toggle="modal" data-target="#showTransformResult" data-backdrop="static" data-keyboard="false">View Result</button>
                  <div className="collapse" id="paramCollapse">
                  <textarea className="form-control" id="exampleTextarea" rows="2" value={this.state.param} onChange={this.handleParam.bind(this)}></textarea>
                  <small id="fileHelp" className="form-text">Ex)  param1=value1;param2=value2; (no single or double quotes)</small>
                  </div>
                  <textarea className="form-control" id="xpath" rows="16" onChange={this.xpathHandler.bind(this)} value={this.state.input}></textarea>
                
                </div>
              </div>
            </div>
            
          </div>
        </div>
        <input type="file" id="file" ref="fileUploader" accept=".xml,.xslt,.xsd,.xqy"
          style={{ display: "none" }} onChange={this.readValueFile.bind(this)} onClick={(event) => { event.target.value = null }} />

        <input type="file" id="chooseFile" ref="fileChooser" style={{ display: "none" }} 
          onChange={this.readInputFile.bind(this)} onClick={(event) => { event.target.value = null }} />

        <input type="file" id="multiXSD" ref="multiXSD" multiple style={{ display: "none" }} 
          onChange={this.readMultiInputFile.bind(this)} onClick={(event) => { event.target.value = null }} />

        <div className="modal fade" id="showTransformResult" role="dialog" ref="showTransformResult" >
          <div className="modal-dialog modal-dialog-centered model-liquid-xl" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Result</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <textarea rows="20" className="form-control" value={this.state.output} readOnly></textarea>
              </div>
            </div>
          </div>
        </div>

        <form target="_blank" ref="svgForm" method="post" encType="text/plain" action={domain.dev.concat("/api/xml/viewXsd.svg")}>
          <textarea name="xsd"
            rows="28"
            className="d-none"
            value={this.state.value}
            readOnly
          />
          <input type="submit" value="SVG-View" className="d-none" />
        </form>

      </div>

    );
  }

  validateXML(){
    let selectedXml = this.state.value
    if (selectedXml === "") {
      alert("Please provide input xml");
      return false;
    }
    let xsd = this.state.input
    if (xsd === "") {
      alert("Please provide input XSD");
      return false;
    }
    let self = this;
    let data = {
      xml: selectedXml,
      xsd: xsd,
    }
    axios.post(domain.dev.concat("/api/xml/xsd"),
      data,
      { responseType: "text" }
    ).then(response => {
      let output = response.data;
      self.setState({ output: output });
    }).catch(error => {
      console.log(error);
      alert("Error occured while doing xslt transformation");
    });
  }

  getCdata(str) {
    return "<![CDATA[".concat(_.escape(str)).concat("]]>")
  }

  validateMultiXML(){
    let selectedXml = this.state.value
    if (selectedXml === "") {
      alert("Please provide input xml");
      return false;
    }
    let xsds = this.state.multiXSD
    if (xsds.length === 0) {
      alert("Please provide input XSD");
      return false;
    }
    let self = this;
    let data = "<MultiXsdValidationInput><xml>".concat(this.getCdata(selectedXml)).concat("</xml>");
    for (var k = 0, len = xsds.length; k < len; k++) {
      let xsd = xsds[k];
      if (xsd !== "") {
        data = data.concat("<xsd>").concat(this.getCdata(xsd)).concat("</xsd>");
      }
    }
    data = data.concat("</MultiXsdValidationInput>");
    console.log("Data constructed");
    axios.post(domain.dev.concat("/api/xml/multixsd"),
      data,
      { headers: { 'Content-Type': 'text/xml' }, responseType: "text" }
    ).then(response => {
      let output = response.data;
      self.setState({ output: output });
    }).catch(error => {
      console.log(error);
      alert("Error occured while doing xquery transformation");
    });
  }

  
  chooseMultiXsd(){
    this.refs.multiXSD.click();
  }

  saveToFile() {
    let resultXml = this.state.value
    if (resultXml === "") {
      alert("No result to save");
      return false;
    }
    let element = document.createElement("a");
    let file = new Blob([resultXml], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "angleTag-result.txt";
    document.body.appendChild(element);
    element.click();
  }
  
  generateXML() {
    let selectedXml = this.state.value
    if (selectedXml === "") {
      alert("Please provide input xml");
      return false;
    }
    let self = this;

    axios.post(domain.dev.concat("/api/xml/generateXml"), selectedXml, { responseType: "text", headers: { 'Content-Type': 'application/xml' } }).then(response => {
      console.log(response)
      let value = response.data;
      self.setState({ output: value });
    }).catch(error => {
      console.log(error);
      alert("Error occured while doing getting generated xml");
    });

  }
  // Code for functionlity 
  format() {
    let selectedXml = this.state.value.trim();
    if (selectedXml === "") {
      alert("Please provide input xml");
      return false;
    }

    let self = this;
    if (selectedXml.includes("<xsl:stylesheet") || selectedXml.includes("<xsd:schema")) { // For xslt only
      let formatedData = beautify(selectedXml);
      //console.log(formatedData);
      self.setState({ value: formatedData });
    }
    else {
      let data = {
        xml: selectedXml
      }
      console.log(process.env.REACT_APP_DOMAIN);
      axios.post(domain.dev.concat("/api/xml/formatXML"),
        data,
        { responseType: "text" }
      ).then(response => {
        let formatedData = response.data;
        self.setState({ value: formatedData });
      }).catch(error => {
        console.log(error);
        alert("Error occured while format XML");
      });

    }
  }

  readValueFile(event) {
    let self = this;
    let fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = () => {
      let xml = fileReader.result.trim()
      self.setState({ value: xml });
    }
  }

  deserialize() {
    let selectedXml = this.state.value.trim();
    if (selectedXml === "") {
      alert("Please provide input xml");
      return false;
    }
    let formatedXMl = _.unescape(selectedXml);
    this.setState({ value: formatedXMl });
  }

  serialize() {
    let selectedXml = this.state.value.trim();
    if (selectedXml === "") {
      alert("Please provide input xml");
      return false;
    }
    let formatedXMl = _.escape(selectedXml);
    this.setState({ value: formatedXMl });
  }

  xpathChange(v) {
    this.setState({ xpathVersion: v })
  }

  xpathHandler(e) {
    this.setState({ input: e.target.value })
  }

  handleParam(e) {
    this.setState({ param: e.target.value })
  }

  evaluateXpath() {
    let selectedXml = this.state.value.trim();
    if (selectedXml === "") {
      alert("Please provide input xml");
      return false;
    }
    let xpath = this.state.input;
    if (xpath === "") {
      alert("Please provide input xpath");
      return false;
    }
    let xpathV = this.state.xpathVersion
    let self = this;
    let data = {
      xml: selectedXml,
      xpathValue: xpath,
      version: xpathV
    }

    axios.post(domain.dev.concat("/api/xml/xpath"), data, { responseType: "text" }
    ).then(response => {
      console.log(response)
      let value = response.data;
      self.setState({ output: value });
    }).catch(error => {
      console.log(error);
      alert("Error occured while doing xpath evaluation");
    });
  }

  readInputFile(event) {
    let self = this;
    let fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = () => {
      let xml = fileReader.result.trim()
      self.setState({ input: xml });
    }
  }

  readMultiInputFile(event) {
    let self = this;
    if(event.target.files.length>5){
      alert("Only 5 files allowed");
      return false;
    }
    let xsds=[];
    for(let i=0;i<event.target.files.length;i++){
      let fileReader = new FileReader();
      fileReader.readAsText(event.target.files[i], "UTF-8");
      fileReader.onload = () => {
        let xml = fileReader.result.trim()
        xsds[i]=xml
        self.setState({ multiXSD: xsds });
      }
    }
    
  }

  transformXslt() {
    let selectedXml = this.state.value
    if (selectedXml === "") {
      alert("Please provide input xml");
      return false;
    }
    let xpath = this.state.input
    if (xpath === "") {
      alert("Please provide input XSLT");
      return false;
    }
    let self = this;
    let data = {
      xml: selectedXml,
      xqueryValue: xpath,
      param: this.state.param
    }
    axios.post(domain.dev.concat("/api/xml/xslt"),
      data,
      { responseType: "text" }
    ).then(response => {
      let output = response.data;
      self.setState({ output: output });
    }).catch(error => {
      console.log(error);
      alert("Error occured while doing xslt transformation");
    });
  }

  transformXquery() {

    let selectedXml = this.state.value
    if (selectedXml === "") {
      alert("Please provide input xml");
      return false;
    }
    let xpath = this.state.input
    if (xpath === "") {
      alert("Please provide input Xquery");
      return false;
    }
    let self = this;

    let data = {
      xml: selectedXml,
      xqueryValue: xpath,
      param: this.state.param
    }
    axios.post(domain.dev.concat("/api/xml/xquery"),
      data,
      { responseType: "text" }
    ).then(response => {
      let output = response.data;
      self.setState({ output: output });
    }).catch(error => {
      console.log(error);
      alert("Error occured while doing xquery transformation");
    });
  }

  handleSubmit(event) {
    let selectedXml = this.state.value.trim();
    if (selectedXml === "") {
      alert("Please provide input xml");
      return false;
    }
    if (!selectedXml.includes(":schema")) { // For xslt only
      alert("invalid XSD");
      return false;
    }
    this.refs.svgForm.submit();
  }
}

export default App;