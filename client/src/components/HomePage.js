import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import ThumbnailViewer from "./ThumbnailViewer";
import PreviewPage from "./PreviewPage";
import "file-viewer";
import FolderImg from "../static/images/folder.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listYears: [],
      listProjectCreators: [],
      listProjectNames: [],
      listWorkOrders: [],

      filenames: [],
      year: null,
      projectCreator: null,
      projectName: null,
      workOrder: null,
      item: null,
      onScanner: false,
      byPassMode: false,

      printSelectedFiles: [],
    };
    this.searchButton = React.createRef();
  }

  onSelectAllFiles = (e) => {
    let temp = [];
    for (const file of this.state.filenames) {
      for (const item of file.files) {
        temp.push({
          filename: item,
          folderName: file.folder,
        });
      }
    }
    this.setState({
      printSelectedFiles: temp,
    });

    let checkboxes = document.getElementsByName("cbFiles");
    for (let checkbox of checkboxes) {
      checkbox.checked = true;
    }
  };

  onUnselectAllFiles = (e) => {
    this.setState({
      printSelectedFiles: [],
    });

    let checkboxes = document.getElementsByName("cbFiles");
    for (let checkbox of checkboxes) {
      checkbox.checked = false;
    }
  };

  timeout = (delay) => {
    return new Promise((res) => setTimeout(res, delay));
  };

  onPrintSelectedItems = async (e) => {
    for (const item of this.state.printSelectedFiles) {
      await this.timeout(5000);
      console.log("Printing " + item.folderName + "/" + item.filename);
      this.printFile(item.folderName, item.filename);
    }
  };

  onSelectedFile = (e, filename, folderName) => {
    let temp = this.state.printSelectedFiles;
    if (e.target.checked) {
      temp.push({
        filename,
        folderName,
      });
    } else {
      for (let i = 0; i < temp.length; i++) {
        if (
          temp[i].filename === filename &&
          temp[i].folderName === folderName
        ) {
          temp.splice(i, 1);
          break;
        }
      }
    }
    this.setState({
      printSelectedFiles: temp,
    });
  };

  componentDidMount() {
    if (
      sessionStorage.getItem("wo") !== undefined &&
      sessionStorage.getItem("wo") !== null &&
      sessionStorage.getItem("wo") !== ""
    ) {
      // this is a bypassmode
      this.setState({
        filenames: [],
        onScanner: true,
        byPassMode: true,
      });
      this.findAncestors(sessionStorage.getItem("wo"));
    } else {
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
  }

  handleSelectChangeYear = async (value) => {
    axios.get(`/api/GetProjectCreator/${value.value}`).then((res) => {
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
          year: value,
          projectCreator: null,
          projectName: null,
          workOrder: null,
          filenames: [],
        });
      }
    });
  };

  handleSelectChangeProjectCreator = async (value) => {
    axios
      .get(`/api/GetProjectName/${this.state.year.value}/${value.value}`)
      .then((res) => {
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
            projectCreator: value,
            projectName: null,
            workOrder: null,
            filenames: [],
          });
        }
      });
  };

  handleSelectChangeProjectName = async (value) => {
    axios
      .get(
        `/api/GetWorkOrder/${this.state.year.value}/${this.state.projectCreator.value}/${value.value}`
      )
      .then((res) => {
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
            projectName: value,
            workOrder: null,
            filenames: [],
          });
        }
      });
  };

  handleSelectChangeWorkOrder = async (value) => {
    this.setState({
      workOrder: value,
      filenames: [],
    });
  };

  handleKeyDown = (e) => {
    console.log("e:" + e.target.value);
    // run after 1 second => make sure all characters have been populated already.
    setTimeout(() => {
      console.log("e:" + e.target.value);
      if (!this.state.onScanner) {
        this.setState({
          filenames: [],
          onScanner: true,
        });
        this.findAncestors(e.target.value);
      }
    }, 1000);
  };

  findAncestors = (wo) => {
    axios
      .get(`/api/getAncestors/${wo}`)
      .then((res) => {
        if (res.data.year !== "") {
          this.setState({
            listYears: [{ value: res.data.year, label: res.data.year }],
            year: { value: res.data.year, label: res.data.year },
            listProjectCreators: [{ value: res.data.pc, label: res.data.pc }],
            projectCreator: { value: res.data.pc, label: res.data.pc },
            listProjectNames: [{ value: res.data.pn, label: res.data.pn }],
            projectName: { value: res.data.pn, label: res.data.pn },
            listWorkOrders: [{ value: res.data.wo, label: res.data.wo }],
            workOrder: [{ value: res.data.wo, label: res.data.wo }],
            onScanner: false,
          });
          this.callOnSearchDelay(500);
        } else {
          this.setState({
            onScanner: false,
          });
          toast.error(`${wo} does not exist in the database.`);
        }
        this.searchButton.current.focus();
      })
      .catch((error) => {
        this.setState({
          onScanner: false,
        });
      });
  };

  sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  callOnSearchDelay = async (time) => {
    await this.sleep(time);
    this.onSearch();
  };

  onSearch = async () => {
    const temp = [];
    console.log("this.state.workOrder:" + this.state.workOrder);
    for (const e of this.state.workOrder) {
      const res = await axios.get(
        `/api/getFileNames_WO/${this.state.year.value}/${this.state.projectCreator.value}/${this.state.projectName.value}/${e.label}`
      );
      if (res.status === 200) {
        let temp_filenames = [];
        let temp_foldernames = [];
        for (const element of res.data.filenames) {
          if (element.lastIndexOf(".") >= 0) {
            temp_filenames.push(element);
          } else {
            temp_foldernames.push(element);
          }
        }

        temp.push({
          folder: e.label,
          files: temp_filenames,
        });

        // get all files in item folder
        for (const item of temp_foldernames) {
          const values = await this.getFileNameInItem(e.label, item);
          temp.push({
            folder: e.label + "/" + item,
            files: values,
          });
        }
      }
    }

    this.setState({
      filenames: temp,
    });
  };

  getFileNameInItem = async (wo, itemName) => {
    let response = await axios.get(
      `/api/getFileNames_Item/${this.state.year.value}/${this.state.projectCreator.value}/${this.state.projectName.value}/${wo}/${itemName}`
    );

    return response.data.filenames;
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

  buildThumbnail = (foldername, filename) => {
    const parentFolder = {
      year: this.state.year.value,
      pc: this.state.projectCreator.value,
      pn: this.state.projectName.value,
      wo: foldername,
    };

    var fileExt = "";
    if (filename.lastIndexOf(".") >= 0) {
      fileExt = filename.substr(filename.lastIndexOf(".") + 1).toLowerCase();
    }

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
                fileExt !== "" && (
                  <ThumbnailViewer
                    type={fileExt}
                    filepath={`/api/${
                      foldername.lastIndexOf("/") >= 0
                        ? "GetFile_Item"
                        : "GetFile_WO"
                    }/${this.state.year.value}/${
                      this.state.projectCreator.value
                    }/${
                      this.state.projectName.value
                    }/${foldername}/${encodeURIComponent(filename)}`}
                  />
                )}

              {(fileExt === "docx" ||
                fileExt === "xlsx" ||
                fileExt === "pptx") && (
                <ThumbnailViewer
                  type="pdf"
                  filepath={`/api/${
                    foldername.lastIndexOf("/") >= 0
                      ? "GetPDFFile_Item"
                      : "GetPDFFile_WO"
                  }/${this.state.year.value}/${
                    this.state.projectCreator.value
                  }/${
                    this.state.projectName.value
                  }/${foldername}/${encodeURIComponent(filename)}`}
                />
              )}

              {(fileExt === "jpg" ||
                fileExt === "jpeg" ||
                fileExt === "png") && (
                <ThumbnailViewer
                  type="pdf"
                  filepath={`/api/${
                    foldername.lastIndexOf("/") >= 0
                      ? "GetPDFFromImages_Item"
                      : "GetPDFFromImages_WO"
                  }/${this.state.year.value}/${
                    this.state.projectCreator.value
                  }/${
                    this.state.projectName.value
                  }/${foldername}/${encodeURIComponent(filename)}`}
                />
              )}

              {fileExt === "" && (
                <img src={FolderImg} width="100%" height="100%" alt="user" />
              )}
            </div>
          </button>
          <div className="topoverlay">
            <PreviewPage
              foldername={parentFolder}
              filename={filename}
              ext={fileExt}
              //onOpenFolder={this.onOpenFolder}
              onPrintFile={this.printFile}
            />
          </div>
        </div>
        <div>
          <small style={{ wordWrap: "break-word" }} title={filename}>
            {this.tailorFileName(filename)}
          </small>
        </div>
        <div>
          <div className="form-check">
            <input
              type="checkbox"
              name="cbFiles"
              className="form-check-input"
              onClick={(e) => this.onSelectedFile(e, filename, foldername)}
            />
          </div>
        </div>
      </div>
    );
  };

  refreshFolder = (e) => {
    e.preventDefault();
    this.onSearch();
  };

  printFile = (foldername, filename) => {
    toast.info(`Sending file ${filename} to the printer`);
    axios
      .post("/api/printFile", {
        year: this.state.year.value,
        pc: this.state.projectCreator.value,
        pn: this.state.projectName.value,
        wo: foldername,
        filename: filename,
      })
      .then((res) => {
        if (res.data.status) {
          toast.success(`File ${filename} has been printed successfully`);
        } else {
          toast.error(`File ${filename} has failed to print!`);
        }
      });
  };

  buildThumbnails = (e, i) => {
    let count = 0;
    let thumbnails = [];
    const len = e.files.length;
    thumbnails.push(<hr />);

    if (e.folder.lastIndexOf("/") >= 0) {
      let temp = e.folder.split("/");
      if (temp.length > 1) {
        thumbnails.push(
          <h6
            style={{
              backgroundColor: "antiquewhite",
              padding: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <a
                href="www.google.com"
                onClick={this.refreshFolder}
                title="Refresh the work order"
              >
                <b>{temp[0]}</b>
                <span>
                  <b> -&gt; {temp[1]}</b>
                </span>
              </a>
            </div>
          </h6>
        );
      }
    } else {
      thumbnails.push(
        <h6
          style={{
            backgroundColor: "antiquewhite",
            padding: "5px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <a
            href="www.google.com"
            onClick={this.refreshFolder}
            title="Refresh the work order"
          >
            <b>{e.folder}</b>
          </a>
        </h6>
      );
    }

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
          <br />
        </>
      );
    }
    return thumbnails;
  };

  render() {
    const { listYears, listProjectCreators, listProjectNames, listWorkOrders } =
      this.state;
    return (
      <>
        <ToastContainer position="bottom-right" autoClose={3000} />
        <div className="outer justify-content-center">
          <div className="container-fluid padding-30px">
            <div className="inner inner-extension rounded padding-20px">
              {!this.state.byPassMode && (
                <div>
                  <div className="text-center">
                    <h4>
                      <strong>Please select options</strong>
                    </h4>
                  </div>
                  <br />
                  <div className="d-flex justify-content-center align-items-center padding-top-10px padding-bottom-10px">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "lightblue",
                        border: "solid thin lightgray",
                        borderRadius: "3px",
                      }}
                    >
                      <h6
                        style={{
                          width: "150px",
                          marginBottom: "0px",
                          paddingRight: "20px",
                          textAlign: "right",
                        }}
                      >
                        <b>Year</b>
                      </h6>
                      <div style={{ minWidth: "500px" }}>
                        <Select
                          placeholder="Select years"
                          options={listYears}
                          onChange={this.handleSelectChangeYear}
                          value={this.state.year}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center align-items-center padding-top-10px padding-bottom-10px">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "lightblue",
                        border: "solid thin lightgray",
                        borderRadius: "3px",
                      }}
                    >
                      <h6
                        style={{
                          width: "150px",
                          marginBottom: "0px",
                          paddingRight: "20px",
                          textAlign: "right",
                        }}
                      >
                        <b>Project Creator</b>
                      </h6>
                      <div style={{ minWidth: "500px" }}>
                        <Select
                          placeholder="Select project creator"
                          options={listProjectCreators}
                          onChange={this.handleSelectChangeProjectCreator}
                          value={this.state.projectCreator}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center align-items-center padding-top-10px padding-bottom-10px">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "lightblue",
                        border: "solid thin lightgray",
                        borderRadius: "3px",
                      }}
                    >
                      <h6
                        style={{
                          width: "150px",
                          marginBottom: "0px",
                          paddingRight: "20px",
                          textAlign: "right",
                        }}
                      >
                        <b>Project Name</b>
                      </h6>
                      <div style={{ minWidth: "500px" }}>
                        <Select
                          placeholder="Select project name"
                          options={listProjectNames}
                          onChange={this.handleSelectChangeProjectName}
                          value={this.state.projectName}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center align-items-center padding-top-10px padding-bottom-10px">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "lightblue",
                        border: "solid thin lightgray",
                        borderRadius: "3px",
                      }}
                    >
                      <h6
                        style={{
                          width: "150px",
                          marginBottom: "0px",
                          paddingRight: "20px",
                          textAlign: "right",
                        }}
                      >
                        <b>Work Order</b>
                      </h6>
                      <div style={{ minWidth: "500px" }}>
                        <Select
                          placeholder="Select your work order"
                          options={listWorkOrders}
                          isMulti={true}
                          onChange={this.handleSelectChangeWorkOrder}
                          onKeyDown={this.handleKeyDown}
                          value={this.state.workOrder}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      paddingRight: "20px",
                      textAlign: "center",
                      paddingTop: "20px",
                    }}
                  >
                    <button
                      ref={this.searchButton}
                      type="button"
                      className="btn btn-info"
                      onClick={this.onSearch}
                      disabled={
                        this.state.year === null ||
                        this.state.projectCreator === null ||
                        this.state.projectName === null ||
                        this.state.workOrder === null ||
                        this.state.workOrder.length === 0
                      }
                    >
                      Search
                    </button>

                    {this.state.filenames.length > 0 && (
                      <button
                        style={{ marginLeft: "20px" }}
                        type="button"
                        className="btn btn-info"
                        onClick={this.onSelectAllFiles}
                        disabled={
                          this.state.year === null ||
                          this.state.projectCreator === null ||
                          this.state.projectName === null ||
                          this.state.workOrder === null ||
                          this.state.workOrder.length === 0
                        }
                      >
                        Select All Files
                      </button>
                    )}

                    {this.state.filenames.length > 0 && (
                      <button
                        style={{ marginLeft: "20px" }}
                        type="button"
                        className="btn btn-info"
                        onClick={this.onUnselectAllFiles}
                        disabled={
                          this.state.year === null ||
                          this.state.projectCreator === null ||
                          this.state.projectName === null ||
                          this.state.workOrder === null ||
                          this.state.workOrder.length === 0
                        }
                      >
                        Unselect All Files
                      </button>
                    )}
                  </div>
                  <br />
                  <div
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {this.state.printSelectedFiles.length > 0 && (
                      <button
                        style={{ marginLeft: "20px" }}
                        type="button"
                        className="btn btn-primary"
                        onClick={this.onPrintSelectedItems}
                        disabled={
                          this.state.year === null ||
                          this.state.projectCreator === null ||
                          this.state.projectName === null ||
                          this.state.workOrder === null ||
                          this.state.workOrder.length === 0
                        }
                      >
                        Print Selected Files
                      </button>
                    )}
                  </div>
                  <br />
                  <br />
                </div>
              )}

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
