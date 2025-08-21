import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgress } from "@mui/material";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { IoArrowBack } from "react-icons/io5";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const CreateEditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    venue: "",
    eventType: "conference",
    videoUrl: "",
    category: "",
    meetingId: "",
    passcode: "",
    duration: "",
    meetingLink: "",
    speakers: [],
    image: null,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [speakers, setSpeakers] = useState([]);

  const showAlertMessage = useCallback((message, variant) => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  const eventTypes = useMemo(
    () => [
      { value: "conference", label: "Conference" },
      { value: "workshop", label: "Workshop" },
      { value: "seminar", label: "Seminar" },
      { value: "webinar", label: "Webinar" },
      { value: "other", label: "Other" },
    ],
    []
  );

  const showMeetingFields = useMemo(() => {
    return ["webinar", "conference"].includes(formData.eventType);
  }, [formData.eventType]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleQuillChange = useCallback((value) => {
    setFormData((prevData) => ({
      ...prevData,
      description: value,
    }));
  }, []);

  const handleDateChange = useCallback((newDate) => {
    setFormData((prevData) => ({
      ...prevData,
      date: newDate,
    }));
  }, []);

  const handleSpeakerChange = useCallback((event) => {
    setFormData((prevData) => ({
      ...prevData,
      speakers: event.target.value,
    }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target?.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await fetch(`${backendURL}/api/getAllSpeakers`);
        const data = await res.json();
        setSpeakers(data);
      } catch (error) {
        console.error("Failed to fetch speakers:", error);
        showAlertMessage("Failed to fetch speakers", "error");
      }
    };

    const fetchEvent = async () => {
      if (eventId) {
        try {
          setLoading(true);
          const res = await fetch(`${backendURL}/api/getEventById/${eventId}`);
          const event = await res.json();
          if (event) {
            setFormData({
              title: event.title || "",
              description: event.content || "",
              videoUrl: event.videoUrl || "",
              date: event.date ? new Date(event.date) : new Date(),
              venue: event.venue || "",
              eventType: event.eventType || "conference",
              category: event.category || "",
              meetingId: event.meetingId || "",
              passcode: event.passcode || "",
              duration: event.duration || "",
              meetingLink: event.meetingLink || "",
              speakers: event.speakers?.map((speaker) => speaker._id) || [],
              image: event.image || null,
            });
            setImagePreview(event.image ? `${event.image}` : null);
          }
        } catch (error) {
          console.error("Error fetching event:", error);
          showAlertMessage("Failed to fetch event", "error");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSpeakers();
    fetchEvent();
  }, [eventId, showAlertMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.eventType) {
      showAlertMessage("Title, date, and event type are required", "error");
      return;
    }

    if (showMeetingFields && (!formData.meetingLink || !formData.duration)) {
      showAlertMessage(
        "Meeting link and duration are required for online events",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const eventFormData = new FormData();
      for (const key in formData) {
        if (key === "date") {
          eventFormData.append(key, formData[key].toISOString());
        } else if (key === "speakers") {
          eventFormData.append(key, JSON.stringify(formData[key]));
        } else {
          eventFormData.append(key, formData[key]);
        }
      }
      if (selectedFile) {
        eventFormData.append("image", selectedFile);
      }

      const url = eventId
        ? `${backendURL}/api/updateEvent/${eventId}`
        : `${backendURL}/api/createEvent`;
      const method = eventId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: eventFormData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to save event");

      showAlertMessage(
        eventId ? "Event updated successfully" : "Event created successfully",
        "success"
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/Admin/Events");
    } catch (error) {
      console.error("Error saving event:", error);
      showAlertMessage(error.message || "Failed to save event", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="p-3 max-w-3xl mx-auto min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200">
          <IoArrowBack className="mr-2" size={24} />
          Back
        </button>

        <h1 className="text-center text-3xl my-7 font-semibold">
          {eventId ? "Edit Event" : "Create an Event"}
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            required
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
          />

          <DateTimePicker
            label="Date and Time"
            value={formData.date}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
            required
          />

          <TextField
            select
            label="Event Type"
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleInputChange}
            fullWidth
            required>
            {eventTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>

          {formData.eventType === "conference" && (
            <TextField
              label="Venue"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              fullWidth
            />
          )}

          {formData.eventType === "webinar" && (
            <TextField
              label="Video URL"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleInputChange}
              fullWidth
            />
          )}

          {showMeetingFields && (
            <Box className="flex flex-col gap-4">
              <TextField
                label="Meeting ID"
                id="meetingId"
                name="meetingId"
                value={formData.meetingId}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Passcode"
                id="passcode"
                name="passcode"
                value={formData.passcode}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Duration"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                fullWidth
                required={showMeetingFields}
              />
              <TextField
                label="Meeting Link"
                id="meetingLink"
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleInputChange}
                fullWidth
                required={showMeetingFields}
              />
            </Box>
          )}

          <TextField
            label="Category"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="speakers-select-label">Speakers</InputLabel>
            <Select
              labelId="speakers-select-label"
              id="speakers"
              multiple
              value={formData.speakers}
              onChange={handleSpeakerChange}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => {
                    const speaker = speakers.find((s) => s._id === value);
                    return <Chip key={value} label={speaker?.name || value} />;
                  })}
                </Box>
              )}>
              {speakers.map((speaker) => (
                <MenuItem key={speaker._id} value={speaker._id}>
                  {speaker.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current.click()}
              color="primary">
              Choose File
            </Button>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="w-[15rem] h-[10rem] object-cover"
              />
            )}
          </Box>

          <ReactQuill
            theme="snow"
            placeholder="Write event description..."
            className="h-72 mb-12"
            value={formData.description}
            onChange={handleQuillChange}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              backgroundColor: "#16a34a",
              "&:hover": { backgroundColor: "#14532d" },
            }}>
            {loading ? (
              <CircularProgress size={24} />
            ) : eventId ? (
              "Update Event"
            ) : (
              "Create Event"
            )}
          </Button>
        </form>

        {showAlert && (
          <Alert
            variant={alertConfig.variant}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            autoClose={true}
            autoCloseTime={5000}>
            <AlertDescription>{alertConfig.message}</AlertDescription>
            {alertConfig.variant === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 ml-2" />
            )}
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default CreateEditEvent;
