import React from "react";
import "./index.css";
import GetAppIcon from "@mui/icons-material/GetApp";

const Body: React.FC = () => {
  const [idValue, setIdValue] = React.useState<string>("");
  const [errormsg, setErrormsg] = React.useState<string>("");
  const [msgClass, setMsgClass] = React.useState<string>("info");

  const [pdf_b64, setPdf_b64] = React.useState<string>("");
  const [pdfLink, setPdfLink] = React.useState<string>("");

  const VerifyInput = () => {
    if (idValue === "") {
      setErrormsg("Please enter a valid Certificate ID");
      setMsgClass("error");
    } else {
      setErrormsg("Searching for Certificate...");
      setMsgClass("info");
    }
  };

  // onLoad
  React.useEffect(() => {
    setErrormsg("Enter the Certificate ID to view the certificate");
  }, []);

  const fetchCertificate = (download : boolean) => {
    VerifyInput();
    const API_endpoint =
      "https://c25zxt9hxh.execute-api.ap-south-1.amazonaws.com/dev/fetch-certificate";
    const Body = {
      certificateId: idValue,
    };

    fetch(API_endpoint, {
      method: "POST",
      body: JSON.stringify(Body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setErrormsg("This Certificate is Authentic!");
          setMsgClass("success");
          setPdf_b64(data.body.file);
          setPdfLink(data.body.url);

          if (download){
            // open the url in a new tab
            window.open(pdfLink, '_blank');
          }

        }
        else {
          setErrormsg("Certificate Not Found");
          setMsgClass("error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const pdfElement = pdf_b64 ? (
    // <Base64PDFViewer base64String={pdf_b64} />
    <iframe src={pdfLink} width="600px" height="400px" title="PDF Viewer" style={{ border: "none" }} />

  ) : (
    <img
      src="https://placehold.co/600x400?text=Enter+Your+Certificate_ID"
      alt="placeholder"
    />
  );


  return (
    <div>
      <div className="container">
        <div className="content">
          <div className="input-form">
            <h1>Verify your Certificate</h1>
            <div className="input-field">
              <input
                type="text"
                placeholder="Enter Certificate ID"
                value={idValue}
                onChange={(e) => setIdValue(e.target.value)}
                id="certificate-id"
              />
            </div>
            <div className="buttons">
              <button id="search-btn" onClick={() => 
                {
                  const regex = /^TPC\d{2}-[A-Z]{2}\d{6}$/;
                  if (regex.test(idValue)) {
                    fetchCertificate(false);
                  } else {
                    setErrormsg("Invalid Certificate ID format");
                    setMsgClass("error");
                  }
                }
              }>
                View Certificate
              </button>

              <button id="download-btn" onClick={()=>{
                fetchCertificate(true);
              }}>
                <GetAppIcon />
              </button>
            </div>

            <p className={msgClass}>{errormsg}</p>
          </div>

          <div className="certificate-view">{pdfElement}</div>
        </div>
      </div>
    </div>
  );
};

export default Body;
