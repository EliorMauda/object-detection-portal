# Object Detection Portal

A comprehensive web-based dashboard for managing and monitoring object detection services. This portal provides an intuitive interface for uploading images, viewing detection results, monitoring system performance, and managing detection configurations.

## 🚀 Features

### Core Functionality
- **Image Upload & Detection**: Upload images via file or URL for real-time object detection
- **Interactive Dashboard**: Real-time metrics, charts, and system status monitoring
- **Detection Results**: Detailed view of detected objects with confidence scores and bounding boxes
- **Recent Detections**: Gallery view of recent detection results with filtering options

### Analytics & Monitoring
- **Performance Metrics**: API call statistics, response times, and error rates
- **Usage Analytics**: Hourly usage patterns, detection categories, and device distribution
- **System Status**: Real-time monitoring of detection services and system health
- **Error Logging**: Comprehensive error tracking with categorized log views

### Configuration Management
- **Detection Parameters**: Configurable confidence thresholds and detection limits
- **Model Management**: Support for multiple detection models with performance comparison
- **API Settings**: Customizable API endpoints and timeout configurations
- **System Controls**: Enable/disable detection services and maintenance mode

## 📋 Prerequisites

- **Node.js** (v14.0 or higher)
- **npm** (v6.0 or higher)
- **Spring Boot Object Detection API** (running on port 8080)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/EliorMauda/object-detection-portal.git
   cd object-detection-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoints** (optional)
   
   Edit `script.js` to point to your Spring Boot API:
   ```javascript
   const API_BASE_URL = "http://localhost:8080/api";
   const DASHBOARD_API_URL = "http://localhost:8080/api/dashboard";
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the production server**
   ```bash
   npm start
   ```

The portal will be available at `http://localhost:3000`

## 🔧 Spring Boot API Integration

This portal is designed to work with a Spring Boot backend API. The expected API endpoints include:

### Detection Endpoints
- `POST /api/detect` - Upload image file for detection
- `POST /api/detect/url` - Detect objects from image URL
- `GET /api/detect/{id}` - Get detection by ID
- `DELETE /api/detect/{id}` - Delete detection record
- `GET /api/detect` - Get all detections with pagination

### Dashboard Endpoints
- `GET /api/dashboard/metrics` - System metrics
- `GET /api/dashboard/chart-data` - Chart data for analytics
- `GET /api/dashboard/detection-categories` - Detection category statistics
- `GET /api/dashboard/system-status` - System health status
- `GET /api/dashboard/recent-detections` - Recent detection results
- `GET /api/dashboard/error-logs` - Error log entries

## 🎯 Usage

### Image Detection
1. Navigate to the **Dashboard** tab
2. Choose between **File Upload** or **URL Detection**
3. Select an image file or enter an image URL
4. Click **Detect Objects** to process the image
5. View results with detected objects, confidence scores, and bounding boxes

### Monitoring System Performance
1. Visit the **Dashboard** for real-time metrics
2. Check the **Analytics** tab for detailed usage statistics
3. Monitor **System Status** for service health
4. Review **Error Logs** for troubleshooting

### Configuration Management
1. Go to the **Configuration** tab
2. Adjust detection parameters (confidence threshold, max detections)
3. Enable/disable detection categories
4. Configure API settings and timeouts
5. Save configuration changes

## 🧪 Development

### File Structure
```
object-detection-portal/
├── public/
│   ├── index.html          # Main HTML dashboard
│   ├── script.js           # Frontend JavaScript logic
│   └── styles.css          # Custom CSS styles
├── server.js               # Express server & mock API
├── package.json            # Node.js dependencies
└── README.md              # This file
```

### Development Commands
```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests (when implemented)
npm test
```

### Key Technologies
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3.0
- **Charts**: Chart.js 3.9.1
- **Icons**: Font Awesome 6.4.0
- **Backend**: Express.js 5.1.0
- **Dev Tools**: Nodemon for auto-reload

## 🔐 Security Considerations

- **XSS Prevention**: All user inputs are escaped before display
- **CSRF Protection**: Requests include proper headers for validation
- **Input Validation**: File types and sizes are validated before upload
- **Error Handling**: Sensitive information is not exposed in error messages

## 🚀 Deployment

### Production Deployment
1. **Build the application**
   ```bash
   npm install --production
   ```

2. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export PORT=3000
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Performance Optimization

- **Image Optimization**: Automatic image compression and resizing
- **Caching**: Static assets are cached for improved performance
- **Lazy Loading**: Detection results are loaded on-demand
- **Debouncing**: API calls are debounced to prevent excessive requests

## 🐛 Troubleshooting

### Common Issues

**Connection Error to Spring Boot API**
- Ensure Spring Boot server is running on port 8080
- Check API endpoint configuration in `script.js`
- Verify CORS settings on the backend

**Image Upload Failures**
- Check file size limits (max 10MB)
- Verify supported image formats (JPG, PNG, GIF, WebP)
- Ensure API endpoint is accessible

**Dashboard Not Loading**
- Check browser console for JavaScript errors
- Verify all dependencies are properly loaded
- Ensure CDN resources are accessible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation for backend integration

## 🙏 Acknowledgments

- **Bootstrap** for the responsive UI framework
- **Chart.js** for beautiful data visualizations
- **Font Awesome** for comprehensive icon library
- **Express.js** for the lightweight web server
- **Node.js** community for excellent tooling

---
