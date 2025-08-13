# 🚀 Interactive Resume Builder

A modern, responsive resume application built with **HTML5**, **CSS3**, **JavaScript**, and **Python Flask**. Features a beautiful animated frontend with a powerful REST API backend for dynamic content management.

## ✨ Features

### 🎨 Frontend

- **Responsive Design** - Works perfectly on desktop and mobile
- **Dark/Light Mode Toggle** - Elegant theme switching with smooth transitions
- **Beautiful Animations** - Staggered entrance effects, hover animations, and particle effects
- **Modern UI/UX** - Clean, professional design with glassmorphism effects
- **Real-time Updates** - Changes appear immediately without page refresh

### 🔧 Backend

- **Flask REST API** - Full CRUD operations for all resume sections
- **JSON Database** - Simple, human-readable data storage
- **CORS Enabled** - Cross-origin requests supported
- **Error Handling** - Graceful fallbacks and user-friendly error messages
- **Automatic Saving** - All changes are persisted to the database

### 📱 Resume Sections

- **Personal Information** - Name, title, summary, avatar, contact details
- **Skills** - Progress bars with customizable levels (0-100)
- **Education** - Institution, degree, dates, descriptions
- **Experience/Projects** - Company/project details, roles, descriptions
- **Achievements** - Titles, descriptions, dates, optional links
- **Interests** - List of hobbies and interests

## 🏗️ Project Structure

```
resume-project/
├── index.html              # Main resume page
├── css/
│   └── style.css          # Styling and animations
├── js/
│   └── app.js             # Frontend logic and API integration
├── data/
│   └── resume.json        # Resume data (database)
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── test.html             # API testing interface
├── venv/                 # Python virtual environment
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** installed on your system
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Installation & Setup

1. **Clone or download the project**

   ```bash
   cd resume-project
   ```

2. **Create and activate virtual environment**

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Flask backend**

   ```bash
   python3 app.py
   ```

5. **Open your resume in the browser**
   - **Main Resume**: Open `index.html` in your browser
   - **API Testing**: Open `test.html` in your browser

## 🌐 API Endpoints

### Base URL: `http://localhost:5000/api`

| Method   | Endpoint            | Description                     |
| -------- | ------------------- | ------------------------------- |
| `GET`    | `/health`           | Server health check             |
| `GET`    | `/db`               | Get all resume data             |
| `GET`    | `/personal`         | Get personal information        |
| `PUT`    | `/personal`         | Update personal information     |
| `PATCH`  | `/personal`         | Partial update of personal info |
| `GET`    | `/skills`           | Get all skills                  |
| `POST`   | `/skills`           | Add new skill                   |
| `GET`    | `/skills/:id`       | Get specific skill              |
| `PUT`    | `/skills/:id`       | Update specific skill           |
| `PATCH`  | `/skills/:id`       | Partial update of skill         |
| `DELETE` | `/skills/:id`       | Delete specific skill           |
| `GET`    | `/education`        | Get all education items         |
| `POST`   | `/education`        | Add new education item          |
| `GET`    | `/education/:id`    | Get specific education item     |
| `PUT`    | `/education/:id`    | Update specific education item  |
| `PATCH`  | `/education/:id`    | Partial update of education     |
| `DELETE` | `/education/:id`    | Delete specific education item  |
| `GET`    | `/experience`       | Get all experience items        |
| `POST`   | `/experience`       | Add new experience item         |
| `GET`    | `/experience/:id`   | Get specific experience item    |
| `PUT`    | `/experience/:id`   | Update specific experience item |
| `PATCH`  | `/experience/:id`   | Partial update of experience    |
| `DELETE` | `/experience/:id`   | Delete specific experience item |
| `GET`    | `/achievements`     | Get all achievements            |
| `POST`   | `/achievements`     | Add new achievement             |
| `GET`    | `/achievements/:id` | Get specific achievement        |
| `PUT`    | `/achievements/:id` | Update specific achievement     |
| `PATCH`  | `/achievements/:id` | Partial update of achievement   |
| `DELETE` | `/achievements/:id` | Delete specific achievement     |
| `GET`    | `/interests`        | Get all interests               |
| `POST`   | `/interests`        | Add new interest                |
| `PUT`    | `/interests`        | Replace all interests           |

## 📊 Data Structure

### Personal Information

```json
{
  "personal": {
    "fullName": "Your Name",
    "title": "Your Job Title",
    "summary": "Brief description about yourself",
    "avatar": "URL to your profile picture",
    "contacts": [
      {
        "label": "Email",
        "value": "your.email@example.com",
        "href": "mailto:your.email@example.com"
      }
    ]
  }
}
```

### Skills

```json
{
  "skills": [
    {
      "id": 1,
      "name": "Skill Name",
      "level": 85
    }
  ]
}
```

### Education

```json
{
  "education": [
    {
      "id": 1,
      "institution": "University Name",
      "degree": "Degree Name",
      "start": "2020",
      "end": "2024",
      "description": "Description of your education"
    }
  ]
}
```

### Experience

```json
{
  "experience": [
    {
      "id": 1,
      "company": "Company Name",
      "role": "Your Role",
      "start": "Start Date",
      "end": "End Date",
      "description": "Description of your work"
    }
  ]
}
```

## 🧪 Testing the API

### Using the Test Interface

1. Open `test.html` in your browser
2. Use the interactive forms to test all endpoints
3. See real-time responses and data updates

### Using cURL

```bash
# Get all data
curl http://localhost:5000/api/db

# Add a new skill
curl -X POST http://localhost:5000/api/skills \
  -H "Content-Type: application/json" \
  -d '{"name": "Python", "level": 90}'

# Update a skill level
curl -X PATCH http://localhost:5000/api/skills/1 \
  -H "Content-Type: application/json" \
  -d '{"level": 95}'

# Delete a skill
curl -X DELETE http://localhost:5000/api/skills/1
```

## 🎨 Customization

### Adding New Sections

1. **Update the HTML** - Add new section containers in `index.html`
2. **Add CSS styling** - Style new sections in `css/style.css`
3. **Create JavaScript functions** - Add data population logic in `js/app.js`
4. **Extend the API** - Add new endpoints in `app.py`
5. **Update the data structure** - Add new fields in `data/resume.json`

### Modifying Themes

The application uses CSS variables for easy theming:

```css
:root {
  --bg: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  --text: #ffffff;
  --brand: #4f8cff;
  /* ... more variables */
}
```

### Adding Animations

New animations can be added using CSS keyframes:

```css
@keyframes yourAnimation {
  from {
    /* starting state */
  }
  to {
    /* ending state */
  }
}
```

## 🔧 Development

### Running in Development Mode

```bash
# Start Flask with debug mode (already enabled)
python3 app.py

# The server will auto-reload on file changes
# Debug mode shows detailed error messages
```

### File Watching

The Flask development server automatically detects file changes and restarts when needed.

### Logging

Check the terminal where Flask is running for:

- API request logs
- Error messages
- Debug information

## 🚀 Deployment

### Local Development

- Perfect for personal use and development
- No external dependencies
- Easy to modify and test

### Production Deployment

For production use, consider:

- **WSGI Server**: Use Gunicorn or uWSGI instead of Flask development server
- **Environment Variables**: Store sensitive configuration in environment variables
- **HTTPS**: Enable SSL/TLS for secure connections
- **Database**: Consider using a proper database (PostgreSQL, MySQL) for larger datasets

### Docker (Optional)

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

## 🐛 Troubleshooting

### Common Issues

**Flask server won't start**

- Check if port 5000 is already in use
- Ensure virtual environment is activated
- Verify all dependencies are installed

**API endpoints return 404**

- Ensure Flask server is running
- Check the endpoint URLs are correct
- Verify the server is running on the expected port

**Frontend can't load data**

- Check if Flask API is running
- Verify the API URL in `js/app.js`
- Check browser console for error messages

**Changes not saving**

- Ensure the `data/` directory is writable
- Check Flask server logs for error messages
- Verify the JSON file structure is valid

### Debug Mode

The Flask server runs in debug mode by default, providing:

- Detailed error messages
- Auto-reload on file changes
- Interactive debugger for errors

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 🙏 Acknowledgments

- **Flask** - Python web framework
- **Modern CSS** - For beautiful animations and responsive design
- **Vanilla JavaScript** - For dynamic functionality without heavy frameworks

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Test with the provided `test.html` interface
4. Check Flask server logs for error details

---

**Happy Resume Building! 🎉**

_Built with ❤️ using HTML5, CSS3, JavaScript, and Python Flask_
