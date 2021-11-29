import React, { Component, Suspense } from "react";
import axios from "axios";
import Select from "react-select";
import ThumbnailViewer from "./ThumbnailViewer";
import PreviewPage from "./PreviewPage";
import "file-viewer";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foldernames: [],
      listYears: [],
      listProjectCreators: [],
      listProjectNames: [],
      listWorkOrders: [],
      listItems: [],
      filenames: [],
      year: '',
      projectCreator: '',
      projectName: '',
      workOrder: '',
      item: ''
    };
  }

  componentDidMount() {
    axios.get("/api/getYear").then((res) => {
      if (res.status === 200) {
        let temp = [];
        for (const e of res.data.foldernames) {
          temp.push({
            value: e,
            label: e,
          });
        }
        this.setState({
          listYears: temp,
        });
      }
    });
  }

  handleSelectChangeYear = async (value) => {
    console.log("You've selected:", value);
    if (value.length > 0) {
      this.setState ({year: value[0].value});

      axios.get(`/api/GetProjectCreator/${value[0].value}`).then((res) => {
        if (res.status === 200) {
          let temp = [];
          for (const e of res.data.foldernames) {
            temp.push({
              value: e,
              label: e,
            });
          }
          this.setState({
            listProjectCreators: temp,
          });
        }
      });
    }
    else{
      this.setState ({year: ''});
    }
  };
  
  handleSelectChangeProjectCreator = async (value) => {
    console.log("You've selected:", value);

    if (value.length > 0) {
      this.setState ({projectCreator: value[0].value});

      axios.get(`/api/GetProjectName/${this.state.year}/${value[0].value}`).then((res) => {
        if (res.status === 200) {
          let temp = [];
          for (const e of res.data.foldernames) {
            temp.push({
              value: e,
              label: e,
            });
          }
          this.setState({
            listProjectNames: temp,
          });
        }
      });
    }
    else{
      this.setState ({projectCreator: ''});
    }
  };

  handleSelectChangeProjectName = async (value) => {
    console.log("You've selected:", value);
    if (value.length > 0) {
      this.setState ({projectName: value[0].value});
      axios.get(`/api/GetWorkOrder/${this.state.year}/${this.state.projectCreator}/${value[0].value}`).then((res) => {
        if (res.status === 200) {
          let temp = [];
          for (const e of res.data.foldernames) {
            temp.push({
              value: e,
              label: e,
            });
          }
          this.setState({
            listWorkOrders: temp,
          });
        }
      });
    }
    else {
      this.setState ({projectName: ''});
    }
    
  };

  handleSelectChangeWorkOrder = async (value) => {
    console.log("You've selected:", value);
    if (value.length > 0) {
      this.setState ({workOrder: value[0].value});

      axios.get(`/api/GetItem/${this.state.year}/${this.state.projectCreator}/${this.state.projectName}/${value[0].value}`).then((res) => {
        if (res.status === 200) {
          let temp = [];
          for (const e of res.data.foldernames) {
            temp.push({
              value: e,
              label: e,
            });
          }
          this.setState({
            listItems: temp,
          });
        }
      });
    }
    else{
      this.setState ({workOrder: ''});
    }
  };

  handleSelectChangeItem = async (value) => {
    console.log("You've selected:", value);
    if (value.length > 0){
      this.setState ({item: value[0].value});
    }
    else{
      this.setState ({item: ''});
    }
  };

  onSearch = async () => {
    const temp = [];
    
    //for (const e of this.state.item) {
      if (this.state.item === ''){
        const res = await axios.get(`/api/getFileNames_WO/${this.state.year}/${this.state.projectCreator}/${this.state.projectName}/${this.state.workOrder}`);
        if (res.status === 200) {
          temp.push({
            folder: this.state.workOrder,
            files: res.data.filenames,
          });
        }
      }
      else {
        const res = await axios.get(`/api/getFileNames_item/${this.state.year}/${this.state.projectCreator}/${this.state.projectName}/${this.state.workOrder}/${this.state.item}`);
        if (res.status === 200) {
          temp.push({
            folder: this.state.item,
            files: res.data.filenames,
          });
        }
      }
      
    //}

    this.setState({
      filenames: temp,
    });
  };

  tailorFileName = (filename) => {
    if (filename.length >= 30) {
      return (
        filename.slice(0, 23) +
        "..." +
        filename.substr(filename.lastIndexOf(".") + 1)
      );
    }
    return filename;
  };

  checkItemURL_getFile = (item, filename) => {
    //let fileURL = '';
    if (item === ''){
      return `/api/getFile_WO/${this.state.year}/${this.state.projectCreator}/${this.state.projectName}/${this.state.workOrder}/${encodeURIComponent(filename)}`;
    }
    return `/api/getFile_Item/${this.state.year}/${this.state.projectCreator}/${this.state.projectName}/${this.state.workOrder}/${this.state.item}/${encodeURIComponent(filename)}`;
  }

  checkItemURL_getPDFFile = (item, filename) => {
    //let fileURL = '';
    if (item === ''){
      return `/api/getPDFFile_WO/${this.state.year}/${this.state.projectCreator}/${this.state.projectName}/${this.state.workOrder}/${encodeURIComponent(filename)}`;
    }
    return `/api/getPDFFile_Item/${this.state.year}/${this.state.projectCreator}/${this.state.projectName}/${this.state.workOrder}/${this.state.item}/${encodeURIComponent(filename)}`;
  }

  checkItemURL_getPDFFromImages = (item, filename) => {
    //let fileURL = '';
    if (item === ''){
      return `/api/getPDFFromImages_WO/${this.state.year}/${this.state.projectCreator}/${this.state.projectName}/${this.state.workOrder}/${encodeURIComponent(filename)}`;
    }
    return `/api/getPDFFromImages_Item/${this.state.year}/${this.state.projectCreator}/${this.state.projectName}/${this.state.workOrder}/${this.state.item}/${encodeURIComponent(filename)}`;
  }

  buildThumbnail = (foldername, filename) => {
    const listFolders = {
      year: this.state.year,
      pc: this.state.projectCreator,
      pn: this.state.projectName,
      wo: this.state.workOrder,
      item: this.state.item
    };
    const fileExt = filename
      .substr(filename.lastIndexOf(".") + 1)
      .toLowerCase();
    console.log("fileext=" + fileExt);

    return (
      <div className="col-3 text-center">
        <div className="containerbox">
          <button
            style={{
              borderWidth: "1px",
              borderColor: "grey",
            }}
            className="filecontent"
          >
            <div style={{ width: "180px", height: "210px" }}>
              {fileExt !== "docx" &&
                fileExt !== "xlsx" &&
                fileExt !== "pptx" &&
                fileExt !== "jpg" &&
                fileExt !== "jpeg" &&
                fileExt !== "png" && 
                this.state.year !== '' && 
                this.state.projectCreator !== '' &&
                this.state.projectName !== '' &&
                this.state.workOrder !== '' && (
                  <ThumbnailViewer
                    type={fileExt}
                    //filepath={`/api/getFile_WO/${this.state.year}/${this.state.projectCreator}/${this.state.projectName}/${this.state.workOrder}/${encodeURIComponent(filename)}`}
                    filepath = {this.checkItemURL_getFile(this.state.item, filename)}
                  />
                )}

              {(fileExt === "docx" ||
                fileExt === "xlsx" ||
                fileExt === "pptx") && 
                this.state.year !== '' && 
                this.state.projectCreator !== '' &&
                this.state.projectName !== '' &&
                this.state.workOrder !== '' && (
                  <ThumbnailViewer
                    type="pdf"
                    //filepath={`/api/getPDFFile_WO/${this.state.year}/${this.state.projectCreator}/${this.state.projectName}/${this.state.workOrder}/${filename}`}
                    filepath = {this.checkItemURL_getPDFFile(this.state.item, filename)}
                  />
              )}

              {(fileExt === "jpg" ||
                fileExt === "jpeg" ||
                fileExt === "png") && 
                this.state.year !== '' && 
                this.state.projectCreator !== '' &&
                this.state.projectName !== '' &&
                this.state.workOrder !== '' && (
                  <ThumbnailViewer
                    type="pdf"
                    //filepath={`/api/getPDFFromImages_WO/${this.state.year}/${this.state.projectCreator}/${this.state.projectName}/${this.state.workOrder}/${filename}`}
                    filepath = {this.checkItemURL_getPDFFromImages(this.state.item, filename)}
                  />
              )}
            </div>
          </button>

          <div className="topoverlay">
            <PreviewPage
              foldername={listFolders}
              filename={filename}
              ext={fileExt}
            />
          </div>
        </div>
        <div>
          <small style={{ wordWrap: "break-word" }} title={filename}>
            {this.tailorFileName(filename)}
          </small>
        </div>
      </div>
    );
  };

  buildThumbnails = (e, i) => {
    let count = 0;
    let thumbnails = [];
    const len = e.files.length;
    thumbnails.push(<hr />);
    thumbnails.push(
      <h6 style={{ backgroundColor: "antiquewhite", padding: "5px" }}>
        <b>{e.folder}</b>
      </h6>
    );
    while (count < len) {
      thumbnails.push(
        <>
          <div className="d-flex align-items-center" key={i}>
            {this.buildThumbnail(e.folder, e.files[count++])}
            {count < len && this.buildThumbnail(e.folder, e.files[count++])}
            {count < len && this.buildThumbnail(e.folder, e.files[count++])}
            {count < len && this.buildThumbnail(e.folder, e.files[count++])}
          </div>
          <br />
        </>
      );
    }
    return thumbnails;
  };

  render() {
    const { foldernames, listYears, listProjectCreators, listProjectNames, listWorkOrders, listItems } = this.state;
    return (
      <>
        <div className="outer justify-content-center">
          <div className="container-fluid padding-30px">
            <div className="inner inner-extension rounded padding-20px">
              <div>
                <div className="text-center">
                  <h5>
                    <strong>
                      Type/Select specific Work Orders and click Search
                    </strong>
                  </h5>
                </div>
                <br />
                <div className="d-flex justify-content-center align-items-center padding-top-10px padding-bottom-10px">
                  <h6 style={{ width: "120px", marginBottom: "0px" }}>
                    <b>Year</b>
                  </h6>
                  <div style={{ minWidth: "600px" }}>
                    <Select
                      placeholder="Select years"
                      options={listYears}
                      isMulti={true}
                      onChange={this.handleSelectChangeYear}
                    />
                  </div>
                </div>


                <div className="d-flex justify-content-center align-items-center padding-top-10px padding-bottom-10px">
                  <h6 style={{ width: "120px", marginBottom: "0px" }}>
                    <b>Project Creator</b>
                  </h6>
                  <div style={{ minWidth: "600px" }}>
                    <Select
                      placeholder="Select project creator"
                      options={listProjectCreators}
                      isMulti={true}
                      onChange={this.handleSelectChangeProjectCreator}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center align-items-center padding-top-10px padding-bottom-10px">
                  <h6 style={{ width: "120px", marginBottom: "0px" }}>
                    <b>Project Name</b>
                  </h6>
                  <div style={{ minWidth: "600px" }}>
                    <Select
                      placeholder="Select project name"
                      options={listProjectNames}
                      isMulti={true}
                      onChange={this.handleSelectChangeProjectName}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center align-items-center padding-top-10px padding-bottom-10px">
                  <h6 style={{ width: "120px", marginBottom: "0px" }}>
                    <b>Work Order</b>
                  </h6>
                  <div style={{ minWidth: "600px" }}>
                    <Select
                      placeholder="Select your work order"
                      options={listWorkOrders}
                      isMulti={true}
                      onChange={this.handleSelectChangeWorkOrder}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center align-items-center padding-top-10px padding-bottom-10px">
                  <h6 style={{ width: "120px", marginBottom: "0px" }}>
                    <b>Item</b>
                  </h6>
                  <div style={{ minWidth: "600px" }}>
                    <Select
                      placeholder="Select your item"
                      options={listItems}
                      isMulti={true}
                      onChange={this.handleSelectChangeItem}
                    />
                  </div>
                </div>
                  <div style={{ paddingRight: "20px", textAlign: "center", paddingTop: "20px" }}>
                    <button type="button" className="btn btn-info" onClick={this.onSearch}>
                      Search
                    </button>
                  </div>
                </div>
              <br />
              <br />
              <br />
              {this.state.filenames.map((e, i) => {
                return this.buildThumbnails(e, i);
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default HomePage;
