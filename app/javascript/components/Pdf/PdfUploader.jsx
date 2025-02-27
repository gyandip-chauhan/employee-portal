import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Button, TextField, Typography, Select, MenuItem } from "@mui/material";
import ApiService from "../common/apiService";
import { API_PDF_SIGN, API_PDF_STAMP } from "../common/apiEndpoints";
import { toast } from "react-toastify";

const PdfUploader = () => {
  const [pdf, setPdf] = useState(null);
  const [signature, setSignature] = useState(null);
  const [stampText, setStampText] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [coordinates, setCoordinates] = useState({ x: "", y: "", page: 1, position: "" });

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "pdf" && file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return;
    }
    if (type === "signature" && !file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    type === "pdf" ? setPdf(file) : setSignature(file);
  };

  const handleInputChange = (e) => setCoordinates({ ...coordinates, [e.target.name]: e.target.value });

  const uploadData = async (url, formData) => {
    try {
      const response = await ApiService.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setPreviewUrl(response.data.url);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Upload failed.");
    }
  };

  const uploadSignature = async () => {
    if (!pdf || !signature) return toast.error("Please select a PDF and signature.");
    if (!coordinates.position && (!coordinates.x || !coordinates.y)) return toast.error("Provide coordinates or select a position.");
    
    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("signature", signature);
    formData.append("page", coordinates.page);
    formData.append("position", coordinates.position);
    
    if (!coordinates.position) {
      formData.append("x", coordinates.x);
      formData.append("y", coordinates.y);
    }

    uploadData(API_PDF_SIGN, formData);
  };

  const uploadStamp = async () => {
    if (!pdf || !stampText) return toast.error("Please select a PDF and enter stamp text.");
    if (!coordinates.position && (!coordinates.x || !coordinates.y)) return toast.error("Provide coordinates or select a position.");

    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("text", stampText);
    formData.append("page", coordinates.page);
    formData.append("position", coordinates.position);
    
    if (!coordinates.position) {
      formData.append("x", coordinates.x);
      formData.append("y", coordinates.y);
    }

    uploadData(API_PDF_STAMP, formData);
  };

  return (
    <Box sx={{ height: "calc(100vh - 120px)", width: "100vw", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column" }}>
          <Card sx={{ flex: 1, overflow: "auto" }}>
            <CardContent>
              <Typography variant="h6">Upload PDF</Typography>
              <TextField type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, "pdf")} fullWidth />
              
              <Typography variant="h6" sx={{ mt: 2 }}>Upload Signature</Typography>
              <TextField type="file" accept="image/*" onChange={(e) => handleFileChange(e, "signature")} fullWidth />
              
              <Typography variant="h6" sx={{ mt: 2 }}>Stamp Text</Typography>
              <TextField type="text" value={stampText} onChange={(e) => setStampText(e.target.value)} fullWidth />
              
              <Typography variant="h6" sx={{ mt: 2 }}>Select Page</Typography>
              <TextField type="number" name="page" value={coordinates.page} onChange={handleInputChange} fullWidth />
              
              <Typography variant="h6" sx={{ mt: 2 }}>Position</Typography>
              <Select name="position" value={coordinates.position} onChange={handleInputChange} fullWidth>
                <MenuItem value="">Manual</MenuItem>
                <MenuItem value="top_right">Top Right</MenuItem>
                <MenuItem value="top_left">Top Left</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="bottom_right">Bottom Right</MenuItem>
                <MenuItem value="bottom_left">Bottom Left</MenuItem>
              </Select>
              
              {!coordinates.position && (
                <>
                  <Typography variant="h6" sx={{ mt: 2 }}>Manual Coordinates</Typography>
                  <TextField type="number" name="x" label="X Coordinate" value={coordinates.x} onChange={handleInputChange} fullWidth />
                  <TextField type="number" name="y" label="Y Coordinate" value={coordinates.y} onChange={handleInputChange} fullWidth sx={{ mt: 1 }} />
                </>
              )}
              
              <Button onClick={uploadSignature} variant="contained" fullWidth sx={{ mt: 2 }}>Add Signature</Button>
              <Button onClick={uploadStamp} variant="contained" fullWidth sx={{ mt: 2, backgroundColor: "green" }}>Add Stamp</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8} sx={{ display: "flex", flexDirection: "column" }}>
          <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6">Preview</Typography>
                {previewUrl ? (<>
                    <Box sx={{ flex: 1, overflow: "hidden" }}>
                      <iframe src={previewUrl} width="100%" height="100%" style={{ border: "none" }} title="PDF Preview"></iframe>
                    </Box>
                    <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => window.open(previewUrl, "_blank")}>
                      Open in New Tab
                    </Button>
                  </>
                ) :  (
                  <Typography variant="body1" color="textSecondary">No preview available</Typography>
                )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PdfUploader;