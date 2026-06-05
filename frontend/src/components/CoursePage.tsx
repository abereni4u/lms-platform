import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../api";
import { Box, Typography, Button, Card, CardContent, CardActionArea, TextField } from "@mui/material";

interface Chapter {
  id: number;
  title: string;
  is_public: boolean;
}

function CoursePage() {
  const { id } = useParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [title, setTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadChapters();
  }, [id]);

  const loadChapters = async () => {
    const res = await api.get(`chapter/?course=${id}`);
    setChapters(res.data);
  };

  const createChapter = async () => {
    if (!title.trim()) return;
    await api.post("chapter/", {
      title,
      course: id,
      content: {},
      is_public: false,
    });
    setTitle("");
    setShowForm(false);
    loadChapters();
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Button onClick={() => navigate("/instructor")}>← Back to courses</Button>
      <Typography variant="h4" gutterBottom>Chapters</Typography>

      {chapters.length === 0 && <Typography>You have no chapters. Add a new chapter.</Typography>}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, my: 2 }}>
        {chapters.map((ch) => (
          <Card key={ch.id} sx={{ width: 200 }}>
            <CardActionArea onClick={() => navigate(`/instructor/chapter/${ch.id}`)}>
              <CardContent>
                <Typography variant="h6">{ch.title}</Typography>
                <Typography variant="caption">{ch.is_public ? "Public" : "Private"}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {showForm ? (
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <TextField label="Chapter title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Button variant="contained" onClick={createChapter}>Save</Button>
          <Button onClick={() => setShowForm(false)}>Cancel</Button>
        </Box>
      ) : (
        <Button variant="contained" onClick={() => setShowForm(true)}>+ Add Chapter</Button>
      )}
    </Box>
  );
}

export default CoursePage;