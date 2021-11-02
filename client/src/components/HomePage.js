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
      filenames: [],
      selected: [],
    };
  }

  componentDidMount() {
    axios.get("/api/getWorkOrders").then((res) => {
      if (res.status === 200) {
        let temp = [];
        for (const e of res.data.foldernames) {
          temp.push({
            value: e,
            label: e,
          });
        }
        this.setState({
          foldernames: temp,
        });
      }
    });
  }

  handleSelectChange = async (value) => {
    console.log("You've selected:", value);
    this.setState((prevstate) => {
      return { ...prevstate, selected: value };
    });
  };

  onSearch = async () => {
    const temp = [];
    for (const e of this.state.selected) {
      const res = await axios.get(`/api/getFileNames/${e.label}`);
      if (res.status === 200) {
        temp.push({
          folder: e.label,
          files: res.data.filenames,
        });
      }
    }

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

  buildThumbnail = (foldername, filename) => {
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
                fileExt !== "png" && (
                  <ThumbnailViewer
                    type={fileExt}
                    filepath={`/api/getFile/${foldername}/${encodeURIComponent(
                      filename
                    )}`}
                  />
                )}

              {(fileExt === "docx" ||
                fileExt === "xlsx" ||
                fileExt === "pptx") && (
                <ThumbnailViewer
                  type="pdf"
                  filepath={`/api/getPDFFile/${foldername}/${filename}`}
                />
              )}

              {(fileExt === "jpg" ||
                fileExt === "jpeg" ||
                fileExt === "png") && (
                <ThumbnailViewer
                  type="pdf"
                  filepath={`/api/getPDFFromImages/${foldername}/${filename}`}
                />
              )}
            </div>
          </button>

          <div className="topoverlay">
            <PreviewPage
              foldername={foldername}
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
    const { foldernames } = this.state;
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
                    <b>Work Order</b>
                  </h6>
                  <div style={{ minWidth: "600px" }}>
                    <Select
                      placeholder="Select your work order(s)"
                      options={foldernames}
                      isMulti={true}
                      onChange={this.handleSelectChange}
                    />
                  </div>
                  <div style={{ paddingLeft: "20px" }}>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={this.onSearch}
                      //disabled={this.state.selected.length === 0}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
              <br />
              <br />
              <br />
              <div className="d-flex justify-content-between align-items-center">
                {/*
                <div className="col-3 text-center">
                  <div className="containerbox">
                    <button
                      style={{
                        borderWidth: "1px",
                        borderColor: "grey",
                      }}
                      className="filecontent"
                    >
                      <div style={{ width: "180px", height: "180px" }}>
                        <ThumbnailViewer
                          type="pdf"
                          filepath="/api/getPDFFile/20J7189/AnnuaForm.xlsx"
                        />
                      </div>
                    </button>
                    <div className="topoverlay">
                      <PreviewPage />
                    </div>
                  </div>
                  <div>
                    <small
                      style={{ wordWrap: "break-word" }}
                      title="AnnuaFormgdfgdf_df_gdfgdf_df_gdfgd_gdf_gdgdfgdf.xlsx"
                    >
                      {this.tailorFileName(
                        "AnnuaFormgdfgdf_df_gdfgdf_df_gdfgd_gdf_gdgdfgdf.xlsx"
                      )}
                    </small>
                  </div>
                      </div> */}
              </div>
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
