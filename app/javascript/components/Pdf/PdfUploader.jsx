import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Input,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import ApiService from "../common/apiService";
import {
  API_PDF_ADD_TEXT,
  API_PDF_ADD_IMAGE,
  API_PDF_DELETE_PAGE,
  API_PDF_ADD_ANNOTATION,
  API_PDF_ADD_FORM_FIELD,
  API_PDF_ADD_WATERMARK,
  API_PDF_ENCRYPT,
  API_PDF_MERGE,
  API_PDF_SPLIT
} from "../common/apiEndpoints";

const positions = [
  { label: "Top-Left", value: "top_left" },
  { label: "Top-Right", value: "top_right" },
  { label: "Bottom-Left", value: "bottom_left" },
  { label: "Bottom-Right", value: "bottom_right" },
  { label: "Center", value: "center" },
  { label: "Manual", value: "manual" },
];

const PdfUploader = () => {
  const [pdf, setPdf] = useState(null);
  const [additionalPdf, setAdditionalPdf] = useState(null);
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [annotation, setAnnotation] = useState("");
  const [formField, setFormField] = useState("");
  const [watermark, setWatermark] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState("");
  const [position, setPosition] = useState("top_left");
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "pdf" && file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return;
    }
    if (type === "image" && !file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    type === "pdf" ? setPdf(file) : setImage(file);
  };

  const uploadData = async (url, formData) => {
    try {
      const response = await ApiService.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPreviewUrl(response.data.url || response.data.files?.[0]);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Upload failed.");
    }
  };

  const handleAction = async (url, fields = []) => {
    if (!pdf) return toast.error("Please upload a PDF first.");
    
    const formData = new FormData();
    formData.append("pdf", pdf);
    
    if (url === API_PDF_MERGE) {
      if (!additionalPdf) return toast.error("Please upload an additional PDF to merge.");
      formData.append("pdf2", additionalPdf);
    }
  
    if (page) formData.append("page", page);
    formData.append("position", position);
  
    if (position === "manual") {
      formData.append("x", x);
      formData.append("y", y);
    }
  
    fields.forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
  
    uploadData(url, formData);
  };  

  return (
    <Box sx={{ p: 3, display: "flex", gap: 3 }}>
      {/* Tools Section */}
      <Card sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tools
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, "pdf")} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Page Number" fullWidth type="number" onChange={(e) => setPage(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <Select fullWidth value={position} onChange={(e) => setPosition(e.target.value)}>
                {positions.map((pos) => (
                  <MenuItem key={pos.value} value={pos.value}>
                    {pos.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            {position === "manual" && (
              <>
                <Grid item xs={6}>
                  <TextField label="X Coordinate" type="number" fullWidth onChange={(e) => setX(e.target.value)} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Y Coordinate" type="number" fullWidth onChange={(e) => setY(e.target.value)} />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Input type="file" accept="application/pdf" fullWidth onChange={(e) => setAdditionalPdf(e.target.files[0])} />
            </Grid>

            <Grid item xs={6}>
              <Button fullWidth variant="contained" onClick={() => handleAction(API_PDF_MERGE)}>
                Merge PDFs
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button fullWidth variant="contained" onClick={() => handleAction(API_PDF_SPLIT)}>
                Split PDF
              </Button>
            </Grid>
            <Grid item xs={6}><Button fullWidth variant="contained" onClick={() => handleAction(API_PDF_DELETE_PAGE)}>Delete Page</Button></Grid>
            <Grid item xs={6}><TextField label="Password" type="password" fullWidth onChange={(e) => setPassword(e.target.value)} /><Button fullWidth variant="contained" onClick={() => handleAction(API_PDF_ENCRYPT, [["password", password]])}>Encrypt PDF</Button></Grid>
            <Grid item xs={6}><TextField label="Text" fullWidth onChange={(e) => setText(e.target.value)} /><Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={() => handleAction(API_PDF_ADD_TEXT, [["text", text]])}>Add Text</Button></Grid>
            <Grid item xs={6}><Input type="file" accept="image/*" fullWidth onChange={(e) => handleFileChange(e, "image")} /><Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={() => handleAction(API_PDF_ADD_IMAGE, [["image", image]])}>Add Image</Button></Grid>
            <Grid item xs={6}><TextField label="Annotation" fullWidth onChange={(e) => setAnnotation(e.target.value)} /><Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={() => handleAction(API_PDF_ADD_ANNOTATION, [["annotation", annotation]])}>Add Annotation</Button></Grid>
            <Grid item xs={6}><TextField label="Watermark" fullWidth onChange={(e) => setWatermark(e.target.value)} /><Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={() => handleAction(API_PDF_ADD_WATERMARK, [["watermark", watermark]])}>Add Watermark</Button></Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Preview Section */}
      {previewUrl && (
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">PDF Preview</Typography>
            <iframe src={previewUrl} width="100%" height="500px" title="PDF Preview"></iframe>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PdfUploader;
