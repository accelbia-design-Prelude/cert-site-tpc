import React from "react";
import "./index.css";
import GetAppIcon from "@mui/icons-material/GetApp";

const Body: React.FC = () => {
  const [idValue, setIdValue] = React.useState<string>("");
  const [errormsg, setErrormsg] = React.useState<string>("");
  const [msgClass, setMsgClass] = React.useState<string>("info");

  const [pdf_b64, setPdf_b64] = React.useState<string>("");
  const [pdfLink, setPdfLink] = React.useState<string>("");

  const [pdfWidth, setPdfWidth] = React.useState<number>(600);
  const [pdfHeight, setPdfHeight] = React.useState<number>(400);

  const [placeholder, setPlaceholder] = React.useState<string>("");


  // handle screen width change
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setPdfWidth(420);
        setPdfHeight(300);
      } else {
        setPdfWidth(600);
        setPdfHeight(400);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // typing effect for placeholder
  const placeholderText = "Certificate ID";
  const placeholderSpeed = 100;
  const placeholderDelay = 2000;

  React.useEffect(() => {
    let i = 0;
    const placeholderInterval = setInterval(() => {
      if (i <= placeholderText.length) {
        setPlaceholder(placeholderText.slice(0, i));
        i++;
      } else {
        clearInterval(placeholderInterval);
      }
    }, placeholderSpeed);

    setTimeout(() => {
      clearInterval(placeholderInterval);
    }, placeholderDelay);
  }, []);


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
    <iframe src={pdfLink + '#toolbar=0'} width={pdfWidth} height={pdfHeight} title="certificate" style={{ border: "none" }} />

  ) : (
    <img
      // src="https://placehold.co/600x400/white/?text=Enter+Your+Certificate+ID"
      // src="https://placehold.co/600x400/FFF/CCC/?text=Enter+Your+Certificate+ID"
      src={`https://placehold.co/${pdfWidth}x${pdfHeight}/FFF/CCC/?text=Enter+Your+Certificate+ID`}
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
                placeholder={placeholder}
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
