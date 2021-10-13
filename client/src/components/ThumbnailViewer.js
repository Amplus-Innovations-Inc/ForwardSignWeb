import React, { Component } from "react";
import FileViewer from "react-file-viewer";

class ThumbnailViewer extends Component {
  onError(e) {
    console.log("error:" + e);
  }
  render() {
    return (
      <FileViewer
        key={this.props.filepath}
        fileType={this.props.type}
        filePath={this.props.filepath}
        errorComponent={this.CustomErrorComponent}
        onError={this.onError}
      />
    );
  }
}

export default ThumbnailViewer;
