import React, { Component, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import ThumbnailViewer from "./ThumbnailViewer";
import ReactToPrint from "react-to-print";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";

// Plugins
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function PreviewPage(props) {
  const [show, setShow] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const componentRef = useRef();
  const year = props.foldername.year;
  const pc = props.foldername.pc;
  const pn = props.foldername.pn;
  const wo = props.foldername.wo;
  const item = props.foldername.item;


  const onDownload = () => {
    if (item === ''){
      window.open(`/api/getFile_WO/${year}/${pc}/${pn}/${wo}/${encodeURIComponent(props.filename)}`);
    }
    else{
      window.open(`/api/getFile_Item/${year}/${pc}/${pn}/${wo}/${item}/${encodeURIComponent(props.filename)}`);
    }
  };

  const checkItemURL_getFile = (item, filename) => {
    if (item === ''){
      return `/api/getFile_WO/${year}/${pc}/${pn}/${wo}/${encodeURIComponent(filename)}`;
    }
    return `/api/getFile_Item/${year}/${pc}/${pn}/${wo}/${item}/${encodeURIComponent(filename)}`;
  }

  const checkItemURL_getPDFFile = (item, filename) => {
    //let fileURL = '';
    if (item === ''){
      return `/api/getPDFFile_WO/${year}/${pc}/${pn}/${wo}/${encodeURIComponent(filename)}`;
    }
    return `/api/getPDFFile_Item/${year}/${pc}/${pn}/${wo}/${item}/${encodeURIComponent(filename)}`;
  }

  const checkItemURL_getPDFFromImages = (item, filename) => {
    //let fileURL = '';
    if (item === ''){
      return `/api/getPDFFromImages_WO/${year}/${pc}/${pn}/${wo}/${encodeURIComponent(filename)}`;
    }
    return `/api/getPDFFromImages_Item/${year}/${pc}/${pn}/${wo}/${item}/${encodeURIComponent(filename)}`;
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-info btn-sm"
        onClick={() => setShow(true)}
      >
        Preview
      </button>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              <button
                type="button"
                className="btn btn-info"
                onClick={onDownload}
              >
                Download
              </button>
              {props.ext === "pdf" && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                      <Viewer
                        //fileUrl={`/api/getFile_WO/${year}/${pc}/${pn}/${wo}/${encodeURIComponent(props.filename)}`}
                        fileUrl = {checkItemURL_getFile(item, props.filename)}
                        plugins={[defaultLayoutPluginInstance]}
                        defaultScale={SpecialZoomLevel.PageWidth}
                      />
                </Worker>
              )}
              {(props.ext === "docx" ||
                props.ext === "xlsx" ||
                props.ext === "pptx") && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                  
                      <Viewer
                        //fileUrl={`/api/getPDFFile_WO/${year}/${pc}/${pn}/${wo}/${encodeURIComponent(props.filename)}`}
                        fileUrl = {checkItemURL_getPDFFile(item, props.filename)}
                        plugins={[defaultLayoutPluginInstance]}
                        defaultScale={SpecialZoomLevel.PageWidth}
                      />
                 
                </Worker>
              )}

              {(props.ext === "jpg" ||
                props.ext === "jpeg" ||
                props.ext === "png") && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                  
                      <Viewer
                        //fileUrl={`/api/getPDFFromImages_WO/${year}/${pc}/${pn}/${wo}/${encodeURIComponent(props.filename)}`}
                        fileUrl = {checkItemURL_getPDFFromImages(item, props.filename)}
                        plugins={[defaultLayoutPluginInstance]}
                        defaultScale={SpecialZoomLevel.PageWidth}
                      />
                 
                  
                </Worker>
              )}

              {/*
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.min.js">
                <Viewer
                  fileUrl="/api/getFile/20J7189/123 hhhh.pdf"
                  plugins={[
                    // Register plugins
                    defaultLayoutPluginInstance,
                  ]}
                />
              </Worker>
              {/*
                <ReactToPrint
                  trigger={() => <button>Print this out!</button>}
                  content={() => this.componentRef}
                />
                <ThumbnailViewer
                  type="docx"
                  filepath="/api/getFile/20J7189/file-sample_100kB1.docx"
                  ref={(el) => (this.componentRef = el)}
                /> */}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.ext !== "docx" &&
            props.ext !== "xlsx" &&
            props.ext !== "pdf" &&
            props.ext !== "pptx" &&
            props.ext !== "jpg" &&
            props.ext !== "jpeg" &&
            props.ext !== "png" && (
              <h5>
                <b>{props.ext}</b> extension doesn't support to open on Browser,
                please click the <strong>download</strong> button
              </h5>
            )}
        </Modal.Body>
      </Modal>
    </>
  );
}