import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";

// Plugins
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function PreviewPage(props) {
  const [show, setShow] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const year = props.foldername.year;
  const pc = props.foldername.pc;
  const pn = props.foldername.pn;
  const wo = props.foldername.wo;

  const onDownload = () => {
    window.open(
      `/api/${
        wo.lastIndexOf("/") >= 0 ? "GetFile_Item" : "GetFile_WO"
      }/${year}/${pc}/${pn}/${wo}/${encodeURIComponent(props.filename)}`
    );
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-info btn-sm"
        onClick={() => setShow(true)}
      >
        Preview
      </button>
      <div style={{ height: "10px" }}></div>

      <button
        type="button"
        className="btn btn-info btn-sm"
        onClick={() => props.onPrintFile(wo, props.filename)}
      >
        Print
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
                    fileUrl={`/api/${
                      wo.lastIndexOf("/") >= 0 ? "GetFile_Item" : "GetFile_WO"
                    }/${year}/${pc}/${pn}/${wo}/${encodeURIComponent(
                      props.filename
                    )}`}
                    plugins={[defaultLayoutPluginInstance]}
                    defaultScale={SpecialZoomLevel.ActualSize}
                  />
                </Worker>
              )}
              {(props.ext === "docx" ||
                props.ext === "xlsx" ||
                props.ext === "pptx") && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={`/api/${
                      wo.lastIndexOf("/") >= 0
                        ? "GetPDFFile_Item"
                        : "GetPDFFile_WO"
                    }/${year}/${pc}/${pn}/${wo}/${encodeURIComponent(
                      props.filename
                    )}`}
                    plugins={[defaultLayoutPluginInstance]}
                    defaultScale={SpecialZoomLevel.ActualSize}
                  />
                </Worker>
              )}

              {(props.ext === "jpg" ||
                props.ext === "jpeg" ||
                props.ext === "png") && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={`/api/${
                      wo.lastIndexOf("/") >= 0
                        ? "GetPDFFromImages_Item"
                        : "GetPDFFromImages_WO"
                    }/${year}/${pc}/${pn}/${wo}/${encodeURIComponent(
                      props.filename
                    )}`}
                    plugins={[defaultLayoutPluginInstance]}
                    defaultScale={SpecialZoomLevel.ActualSize}
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
