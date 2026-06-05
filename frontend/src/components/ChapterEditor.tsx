import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { usePlateEditor, Plate, PlateContent } from "@udecode/plate/react";
import api from "../api";
import { Box, Button, Typography, Switch, FormControlLabel, CircularProgress } from "@mui/material";

// A blank Plate document: one empty paragraph
const EMPTY: any = [{ type: "p", children: [{ text: "" }] }];

function ChapterEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [initialValue, setInitialValue] = useState<any>(EMPTY);
  const [isPublic, setIsPublic] = useState(false);
  const [courseId, setCourseId] = useState<number | null>(null);

  // Fetch the chapter's saved content before building the editor
  useEffect(() => {
    api.get(`chapter/${id}/`).then((res) => {
      const content = res.data.content;
      // If content is a non-empty array use it, else start blank
      setInitialValue(Array.isArray(content) && content.length ? content : EMPTY);
      setIsPublic(res.data.is_public);
      setCourseId(res.data.course);
      setLoaded(true);
    });
  }, [id]);

  if (!loaded) return <CircularProgress sx={{ m: 4 }} />;

  return <Editor id={id!} initialValue={initialValue} isPublic={isPublic} courseId={courseId} navigate={navigate} />;
}

// Separate inner component so the editor is created AFTER content is loaded
function Editor({ id, initialValue, isPublic, courseId, navigate }: any) {
  const editor = usePlateEditor({ value: initialValue });
  const [pub, setPub] = useState(isPublic);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await api.patch(`chapter/${id}/`, {
      content: editor.children,   // the current Plate document (JSON)
      is_public: pub,
    });
    setSaving(false);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Button onClick={() => navigate(`/instructor/course/${courseId}`)}>← Back</Button>
      <FormControlLabel
        control={<Switch checked={pub} onChange={(e) => setPub(e.target.checked)} />}
        label={pub ? "Public" : "Private"}
      />
      <Box sx={{ border: "1px solid #ccc", borderRadius: 1, p: 2, minHeight: 200, my: 2 }}>
        <Plate editor={editor}>
          <PlateContent placeholder="Write your chapter content..." />
        </Plate>
      </Box>
      <Button variant="contained" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </Box>
  );
}

export default ChapterEditor;