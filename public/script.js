// Configuration - Your Spring Boot API URL
const API_BASE_URL = "https://object-detection-portal-production.up.railway.app/";
const DASHBOARD_API_URL = "https://object-detection-api-production.up.railway.app/";

// Global chart variables to update them later
let apiCallsChart;
let detectionCategoriesChart;
let hourlyUsageChart;
let responseTimeChart;
let topCategoriesChart;
let deviceDistributionChart;

// Initialize all charts when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Dashboard charts
  initApiCallsChart();
  initDetectionCategoriesChart();

  // Analytics charts
  initHourlyUsageChart();
  initResponseTimeChart();
  initTopCategoriesChart();
  initDeviceDistributionChart();

  // Sliders value display
  initSliderValueDisplays();

  // Modal image handling
  initDetectionModalHandlers();

  // Upload handlers
  initUploadHandlers();

  // Load initial data
  loadDashboardData();
  loadSystemStatus();
  loadRecentDetections();
  loadErrorLogs();

  // Start real-time updates
  startRealtimeUpdates();

  // Initialize modal action handlers
  initModalActionHandlers();
});

// Load real dashboard data
async function loadDashboardData() {
  try {
    // Load dashboard metrics
    const metricsResponse = await fetch(`${DASHBOARD_API_URL}/metrics`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Client-Type": "Web Portal Dashboard",
      },
    });
    if (metricsResponse.ok) {
      const metrics = await metricsResponse.json();
      updateDashboardMetrics(metrics);
    }

    // Load chart data for dashboard
    const chartResponse = await fetch(
      `${DASHBOARD_API_URL}/chart-data?timeframe=day`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-Client-Type": "Web Portal Dashboard",
        },
      }
    );
    if (chartResponse.ok) {
      const chartData = await chartResponse.json();
      updateApiCallsChart(chartData);
    }

    // Load detection categories
    const categoriesResponse = await fetch(
      `${DASHBOARD_API_URL}/detection-categories`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-Client-Type": "Web Portal Dashboard",
        },
      }
    );
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json();
      updateDetectionCategoriesChart(categories);
      updateTopCategoriesChart(categories);
    }

    // Load analytics data for default timeframe (day)
    await loadAnalyticsData("day");
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
}

// Load analytics data for specific timeframe
async function loadAnalyticsData(timeframe) {
  try {
    // Load hourly usage chart data
    const chartResponse = await fetch(
      `${DASHBOARD_API_URL}/chart-data?timeframe=${timeframe}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-Client-Type": "Web Portal Dashboard",
        },
      }
    );
    if (chartResponse.ok) {
      const chartData = await chartResponse.json();
      updateHourlyUsageChart(chartData);
    }

    // Load response time data
    const responseTimeResponse = await fetch(
      `${DASHBOARD_API_URL}/response-time-data?timeframe=${timeframe}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-Client-Type": "Web Portal Dashboard",
        },
      }
    );
    if (responseTimeResponse.ok) {
      const responseTimeData = await responseTimeResponse.json();
      updateResponseTimeChart(responseTimeData);
    }

    // Load analytics data
    const analyticsResponse = await fetch(
      `${DASHBOARD_API_URL}/analytics?timeframe=${timeframe}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-Client-Type": "Web Portal Dashboard",
        },
      }
    );
    if (analyticsResponse.ok) {
      const analytics = await analyticsResponse.json();
      updateAnalyticsData(analytics);
    }
  } catch (error) {
    console.error("Error loading analytics data:", error);
  }
}

// Load system status
async function loadSystemStatus() {
  try {
    const response = await fetch(`${DASHBOARD_API_URL}/system-status`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Client-Type": "Web Portal Dashboard",
      },
    });
    if (response.ok) {
      const statusData = await response.json();
      updateSystemStatusTable(statusData);
    }
  } catch (error) {
    console.error("Error loading system status:", error);
  }
}

// Load recent detections
async function loadRecentDetections() {
  try {
    const response = await fetch(
      `${DASHBOARD_API_URL}/recent-detections?limit=8`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-Client-Type": "Web Portal Dashboard",
        },
      }
    );
    if (response.ok) {
      const detections = await response.json();
      updateRecentDetectionsDisplay(detections);
    }
  } catch (error) {
    console.error("Error loading recent detections:", error);
  }
}

// Load error logs
async function loadErrorLogs() {
  try {
    const response = await fetch(`${DASHBOARD_API_URL}/error-logs?limit=20`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Client-Type": "Web Portal Dashboard",
      },
    });
    if (response.ok) {
      const logs = await response.json();
      updateErrorLogsDisplay(logs);
    }
  } catch (error) {
    console.error("Error loading error logs:", error);
  }
}

// Update dashboard metrics with real data
function updateDashboardMetrics(metrics) {
  // Update Active Sessions
  const activeSessionsElement = document.getElementById("activeSessionsCount");
  if (activeSessionsElement) {
    activeSessionsElement.textContent = metrics.activeSessions;
  }

  // Update API Calls
  const apiCallsElement = document.getElementById("apiCallsCount");
  if (apiCallsElement) {
    apiCallsElement.textContent = metrics.apiCalls.toLocaleString();
  }

  // Update Response Time
  const responseTimeElement = document.getElementById("avgResponseTime");
  if (responseTimeElement) {
    responseTimeElement.textContent = `${metrics.responseTime}ms`;
  }

  // Update Error Rate
  const errorRateElement = document.getElementById("errorRatePercent");
  if (errorRateElement) {
    errorRateElement.textContent = `${metrics.errorRate}%`;
  }
}

// Update system status table with real data
function updateSystemStatusTable(statusData) {
  const tableBody = document.querySelector("#systemStatusTable tbody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  statusData.forEach((service) => {
    const row = document.createElement("tr");

    const statusBadgeClass =
      service.statusClass === "success"
        ? "bg-success"
        : service.statusClass === "warning"
        ? "bg-warning"
        : "bg-danger";

    row.innerHTML = `
      <td>${service.service}</td>
      <td><span class="badge ${statusBadgeClass}">${service.status}</span></td>
      <td>
        <div class="progress">
          <div class="progress-bar ${
            service.statusClass === "warning" ? "bg-warning" : ""
          }" 
               role="progressbar" style="width: ${service.load}%" 
               aria-valuenow="${
                 service.load
               }" aria-valuemin="0" aria-valuemax="100">
            ${service.load}%
          </div>
        </div>
      </td>
      <td>${service.uptime}</td>
      <td>${service.lastUpdate}</td>
    `;

    tableBody.appendChild(row);
  });
}

// Update recent detections display with real data and modal integration
function updateRecentDetectionsDisplay(detections) {
  const detectionsContainer = document.querySelector("#detections .row");
  if (!detectionsContainer) return;

  // Clear existing content
  detectionsContainer.innerHTML = "";

  detections.forEach((detection, index) => {
    const timeAgo = getTimeAgo(detection.timestamp);
    const objects = detection.objects || [];
    const deviceInfo = detection.device || "Unknown Device";
    const imageUrl = detection.imageUrl;
    const fileName = detection.fileName || "Unknown file";

    const detectionCard = document.createElement("div");
    detectionCard.className = "col-md-6 col-lg-4 col-xl-3 mb-4";

    // Create badges for detected objects
    let objectBadges = "";
    objects.slice(0, 3).forEach((obj) => {
      const confidence = Math.round((obj.confidence || 0) * 100);
      const badgeClass =
        confidence >= 80
          ? "bg-success"
          : confidence >= 60
          ? "bg-warning text-dark"
          : "bg-secondary";
      objectBadges += `<span class="badge ${badgeClass} me-1 mb-1">${obj.label} ${confidence}%</span>`;
    });

    if (objects.length > 3) {
      objectBadges += `<span class="badge bg-info mb-1">+${
        objects.length - 3
      } more</span>`;
    }

    // Create image section
    let imageSection = "";
    if (imageUrl) {
      imageSection = `
        <div class="detection-image-container">
          <img src="${imageUrl}" alt="Detection Result" class="detection-thumbnail" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="detection-placeholder" style="display: none;">
            <i class="fas fa-image fa-2x text-muted"></i>
          </div>
        </div>
      `;
    } else {
      imageSection = `
        <div class="detection-placeholder">
          <i class="fas fa-image fa-2x text-muted"></i>
        </div>
      `;
    }

    // Escape JSON data for HTML attribute
    const escapedDetectionData = escapeHtml(JSON.stringify(detection));

    detectionCard.innerHTML = `
      <div class="card shadow h-100">
        <div class="card-body p-0">
          ${imageSection}
          <span class="badge badge-status bg-primary position-absolute" style="top: 10px; right: 10px;">
            ${objects.length} objects
          </span>
          <div class="p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <small class="text-muted">
                <i class="fas fa-clock me-1"></i> ${timeAgo}
              </small>
              <small class="text-muted">
                ${detection.processingTime}ms
              </small>
            </div>
            
            <div class="mb-2">
              ${
                objectBadges ||
                '<span class="badge bg-secondary">No objects detected</span>'
              }
            </div>
            
            <div class="text-truncate mb-2">
              <small class="text-muted">
                <i class="fas fa-file-image me-1"></i> ${fileName}
              </small>
            </div>
            
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">
                <i class="fas fa-mobile-alt me-1"></i> ${deviceInfo}
              </small>
              <button class="btn btn-sm btn-outline-primary" 
                      data-bs-toggle="modal" 
                      data-bs-target="#detectionModal" 
                      data-bs-image="${imageUrl || ""}"
                      data-detection="${escapedDetectionData}"
                      title="View Details">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    detectionsContainer.appendChild(detectionCard);
  });
}

// Update error logs display
function updateErrorLogsDisplay(logs) {
  const apiLogsContainer = document.querySelector("#api-logs .card-body");
  if (!apiLogsContainer) return;

  if (logs.length === 0) {
    apiLogsContainer.innerHTML = `
      <div class="text-center text-muted">
        <p>No error logs available.</p>
      </div>
    `;
    return;
  }

  let logsHtml = "";
  logs.forEach((log) => {
    const timeAgo = getTimeAgo(log.timestamp);
    const levelClass =
      log.level === "ERROR"
        ? "error-log"
        : log.level === "WARN"
        ? "warning-log"
        : "info-log";
    const badgeClass =
      log.level === "ERROR"
        ? "bg-danger"
        : log.level === "WARN"
        ? "bg-warning text-dark"
        : "bg-info";

    logsHtml += `
      <div class="${levelClass}">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="badge ${badgeClass}">${log.level}</span>
          <span class="small text-muted">${timeAgo}</span>
        </div>
        <h6>${log.type || "System Error"}</h6>
        <p class="mb-1">${log.message}</p>
      </div>
    `;
  });

  apiLogsContainer.innerHTML = logsHtml;
}

// Initialize API Calls Chart with real data capability
function initApiCallsChart() {
  const ctx = document.getElementById("apiCallsChart");
  if (!ctx) return;

  apiCallsChart = new Chart(ctx.getContext("2d"), {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "API Calls",
          data: [],
          backgroundColor: "rgba(13, 110, 253, 0.1)",
          borderColor: "rgba(13, 110, 253, 1)",
          borderWidth: 2,
          tension: 0.3,
          pointBackgroundColor: "rgba(13, 110, 253, 1)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grace: "10%",
        },
      },
    },
  });
}

// Update API Calls Chart with real data
function updateApiCallsChart(chartData) {
  if (apiCallsChart && chartData) {
    apiCallsChart.data.labels = chartData.labels;
    apiCallsChart.data.datasets[0].data = chartData.data;
    apiCallsChart.update();
  }
}

// Initialize Detection Categories Chart
function initDetectionCategoriesChart() {
  const ctx = document.getElementById("detectionCategoriesChart");
  if (!ctx) return;

  detectionCategoriesChart = new Chart(ctx.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            "rgba(13, 110, 253, 0.8)",
            "rgba(25, 135, 84, 0.8)",
            "rgba(13, 202, 240, 0.8)",
            "rgba(255, 193, 7, 0.8)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// Update Detection Categories Chart
function updateDetectionCategoriesChart(categories) {
  if (detectionCategoriesChart && categories) {
    detectionCategoriesChart.data.labels = categories.labels;
    detectionCategoriesChart.data.datasets[0].data = categories.data;
    detectionCategoriesChart.update();
  }
}

// Update top categories chart
function updateTopCategoriesChart(categories) {
  if (topCategoriesChart && categories) {
    topCategoriesChart.data.labels = categories.labels;
    topCategoriesChart.data.datasets[0].data = categories.data;
    topCategoriesChart.update();
  }
}

// Update analytics data
function updateAnalyticsData(analytics) {
  if (analytics.performance) {
    const perf = analytics.performance;

    // Update performance metrics
    const confidenceElement = document.querySelector(
      '[data-metric="avgConfidence"]'
    );
    if (confidenceElement) {
      confidenceElement.textContent = `${perf.avgConfidence}%`;
    }

    const successRateElement = document.querySelector(
      '[data-metric="successRate"]'
    );
    if (successRateElement) {
      successRateElement.textContent = `${perf.successRate}%`;
    }

    const avgObjectsElement = document.querySelector(
      '[data-metric="avgObjectsPerFrame"]'
    );
    if (avgObjectsElement) {
      avgObjectsElement.textContent = perf.avgObjectsPerFrame;
    }

    const uniqueUsersElement = document.querySelector(
      '[data-metric="uniqueUsers"]'
    );
    if (uniqueUsersElement) {
      uniqueUsersElement.textContent = perf.uniqueUsers;
    }
  }

  // Update device distribution chart
  if (analytics.deviceDistribution && deviceDistributionChart) {
    const dist = analytics.deviceDistribution;
    deviceDistributionChart.data.labels = dist.labels;
    deviceDistributionChart.data.datasets[0].data = dist.data;
    deviceDistributionChart.update();
  }
}

// Hourly Usage Chart for Analytics - FIXED TO STORE IN GLOBAL VARIABLE
function initHourlyUsageChart() {
  const ctx = document.getElementById("hourlyUsageChart");
  if (!ctx) return;

  hourlyUsageChart = new Chart(ctx.getContext("2d"), {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "API Calls",
          data: [],
          backgroundColor: "rgba(13, 110, 253, 0.7)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Update Hourly Usage Chart with real data
function updateHourlyUsageChart(chartData) {
  if (hourlyUsageChart && chartData) {
    hourlyUsageChart.data.labels = chartData.labels;
    hourlyUsageChart.data.datasets[0].data = chartData.data;
    hourlyUsageChart.update();
  }
}

// Response Time Chart for Analytics - FIXED TO STORE IN GLOBAL VARIABLE AND USE REAL DATA
function initResponseTimeChart() {
  const ctx = document.getElementById("responseTimeChart");
  if (!ctx) return;

  responseTimeChart = new Chart(ctx.getContext("2d"), {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Response Time (ms)",
          data: [],
          backgroundColor: "rgba(255, 193, 7, 0.1)",
          borderColor: "rgba(255, 193, 7, 1)",
          borderWidth: 2,
          tension: 0.2,
          pointBackgroundColor: "rgba(255, 193, 7, 1)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grace: "10%",
        },
      },
    },
  });
}

// Update Response Time Chart with real data
function updateResponseTimeChart(responseTimeData) {
  if (responseTimeChart && responseTimeData) {
    responseTimeChart.data.labels = responseTimeData.labels;
    responseTimeChart.data.datasets[0].data = responseTimeData.data;
    responseTimeChart.update();
  }
}

// Top Categories Chart for Analytics
function initTopCategoriesChart() {
  const ctx = document.getElementById("topCategoriesChart");
  if (!ctx) return;

  topCategoriesChart = new Chart(ctx.getContext("2d"), {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          axis: "y",
          label: "Detection Count",
          data: [],
          backgroundColor: "rgba(13, 110, 253, 0.7)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Device Distribution Chart for Analytics
function initDeviceDistributionChart() {
  const ctx = document.getElementById("deviceDistributionChart");
  if (!ctx) return;

  deviceDistributionChart = new Chart(ctx.getContext("2d"), {
    type: "pie",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            "rgba(13, 110, 253, 0.8)",
            "rgba(25, 135, 84, 0.8)",
            "rgba(13, 202, 240, 0.8)",
            "rgba(255, 193, 7, 0.8)",
            "rgba(220, 53, 69, 0.8)",
            "rgba(108, 117, 125, 0.8)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// Update chart data when timeframe changes for DASHBOARD "API Calls Over Time"
async function updateChartData(timeframe) {
  try {
    const response = await fetch(
      `${DASHBOARD_API_URL}/chart-data?timeframe=${timeframe}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-Client-Type": "Web Portal Dashboard",
        },
      }
    );
    if (response.ok) {
      const chartData = await response.json();
      updateApiCallsChart(chartData);
    }
  } catch (error) {
    console.error("Error updating chart data:", error);
  }
}

// Update analytics charts when timeframe changes - FIXED TO UPDATE BOTH CHARTS
async function updateAnalyticsCharts(timeframe) {
  console.log(`Updating analytics charts for timeframe: ${timeframe}`);

  // Update button states
  updateAnalyticsButtonStates(timeframe);

  try {
    await loadAnalyticsData(timeframe);
  } catch (error) {
    console.error("Error updating analytics:", error);
  }
}

// Update button states for analytics timeframe selection
function updateAnalyticsButtonStates(activeTimeframe) {
  const buttons = document.querySelectorAll(
    '.btn-group button[onclick*="updateAnalyticsCharts"]'
  );
  buttons.forEach((button) => {
    button.classList.remove("active");
    const buttonTimeframe = button.textContent.toLowerCase();
    if (buttonTimeframe === activeTimeframe.toLowerCase()) {
      button.classList.add("active");
    }
  });
}

// Initialize file upload and URL detection handlers
function initUploadHandlers() {
  const fileButton = document.getElementById("uploadFileButton");
  const urlButton = document.getElementById("uploadUrlButton");

  if (fileButton) {
    fileButton.addEventListener("click", handleFileUpload);
  }

  if (urlButton) {
    urlButton.addEventListener("click", handleUrlDetection);
  }
}

// Handle file upload detection (Updated for DetectionResult with proper headers)
async function handleFileUpload() {
  const fileInput = document.getElementById("imageFileInput");
  const file = fileInput.files[0];

  if (!file) {
    showError("Please select an image file first.");
    return;
  }

  // Check file type
  if (!file.type.startsWith("image/")) {
    showError("Please select a valid image file.");
    return;
  }

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    showError("File size must be less than 10MB.");
    return;
  }

  showLoading();

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/detect`, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - browser will set it automatically with boundary
        "X-Requested-With": "XMLHttpRequest",
        "X-Client-Type": "Web Portal",
        "X-Device-Info": getClientDeviceInfo(),
      },
    });

    const result = await response.json();

    if (result.error) {
      showError(result.error);
    } else {
      showResults(result);
      // Refresh dashboard data after successful detection
      setTimeout(() => {
        loadDashboardData();
        loadRecentDetections();
      }, 1000);
    }
  } catch (error) {
    console.error("Upload error:", error);
    showError(
      "Failed to connect to the detection service. Make sure your Spring Boot server is running on port 8080."
    );
  } finally {
    hideLoading();
  }
}

// Handle URL-based detection (Updated for DetectionResult with proper headers)
async function handleUrlDetection() {
  const urlInput = document.getElementById("imageUrlInput");
  const imageUrl = urlInput.value.trim();

  if (!imageUrl) {
    showError("Please enter an image URL.");
    return;
  }

  // Basic URL validation
  try {
    new URL(imageUrl);
  } catch {
    showError("Please enter a valid URL.");
    return;
  }

  showLoading();

  try {
    const response = await fetch(`${API_BASE_URL}/detect/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-Client-Type": "Web Portal",
        "X-Device-Info": getClientDeviceInfo(),
      },
      body: JSON.stringify({ url: imageUrl }),
    });

    const result = await response.json();

    if (result.error) {
      showError(result.error);
    } else {
      showResults(result);
      // Refresh dashboard data after successful detection
      setTimeout(() => {
        loadDashboardData();
        loadRecentDetections();
      }, 1000);
    }
  } catch (error) {
    console.error("URL detection error:", error);
    showError(
      "Failed to connect to the detection service. Make sure your Spring Boot server is running on port 8080."
    );
  } finally {
    hideLoading();
  }
}

// Get client device information for better device detection
function getClientDeviceInfo() {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  const screenInfo = `${screen.width}x${screen.height}`;

  // Detect device type
  let deviceType = "Unknown";
  let browser = "Unknown";
  let os = "Unknown";

  // Operating System Detection
  if (ua.includes("Windows")) {
    os = "Windows";
  } else if (ua.includes("Mac OS X") || ua.includes("Macintosh")) {
    os = "macOS";
  } else if (ua.includes("Linux")) {
    os = "Linux";
  } else if (ua.includes("Android")) {
    os = "Android";
  } else if (ua.includes("iPhone") || ua.includes("iPad")) {
    os = "iOS";
  }

  // Browser Detection
  if (ua.includes("Chrome") && !ua.includes("Edg")) {
    browser = "Chrome";
  } else if (ua.includes("Firefox")) {
    browser = "Firefox";
  } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
    browser = "Safari";
  } else if (ua.includes("Edg")) {
    browser = "Edge";
  }

  // Device Type Detection
  if (ua.includes("Mobile") || ua.includes("Android")) {
    deviceType = "Mobile";
  } else if (ua.includes("Tablet") || ua.includes("iPad")) {
    deviceType = "Tablet";
  } else {
    deviceType = "Desktop";
  }

  return JSON.stringify({
    deviceType: deviceType,
    os: os,
    browser: browser,
    screen: screenInfo,
    language: language,
    platform: platform,
    timestamp: new Date().toISOString(),
  });
}

// Show detection results (Updated for DetectionResult structure)
function showResults(result) {
  const resultsSection = document.getElementById("detectionResults");
  const imageSection = document.getElementById("resultImage");
  const detailsSection = document.getElementById("resultDetails");

  // Display the processed image
  if (result.imageUrl) {
    imageSection.innerHTML = `
      <img src="${result.imageUrl}" alt="Processed Image" class="img-fluid rounded shadow">
    `;
  } else if (result.originalImageUrl) {
    imageSection.innerHTML = `
      <img src="${result.originalImageUrl}" alt="Original Image" class="img-fluid rounded shadow">
    `;
  }

  // Calculate processing time (if not provided by backend)
  const processingTime = result.processingTimeMs || "N/A";

  // Display detection details
  let detailsHtml = `
    <div class="card">
      <div class="card-body">
        <h6 class="card-title">Detection Summary</h6>
        <ul class="list-group list-group-flush">
          <li class="list-group-item d-flex justify-content-between">
            <span>Processing Time:</span>
            <span class="badge bg-info">${processingTime}ms</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Objects Detected:</span>
            <span class="badge bg-primary">${
              result.detectedObjects ? result.detectedObjects.length : 0
            }</span>
          </li>
        </ul>
      </div>
    </div>
  `;

  if (result.detectedObjects && result.detectedObjects.length > 0) {
    detailsHtml += `
      <div class="card mt-3">
        <div class="card-body">
          <h6 class="card-title">Detected Objects</h6>
          <div class="row">
    `;

    result.detectedObjects.forEach((obj) => {
      const confidence = Math.round((obj.confidence || 0) * 100);
      let badgeClass = "bg-success";
      if (confidence < 70) badgeClass = "bg-warning";
      if (confidence < 50) badgeClass = "bg-danger";

      // Handle bounding box display
      let boxInfo = "";
      if (obj.box || obj.boundingBox) {
        const box = obj.box || obj.boundingBox;
        boxInfo = `
          <small class="text-muted">
            Box: (${Math.round(box.xMin || box.x || 0)}, ${Math.round(
          box.yMin || box.y || 0
        )}) to 
            (${Math.round(box.xMax || box.x + box.width || 0)}, ${Math.round(
          box.yMax || box.y + box.height || 0
        )})
          </small>
        `;
      }

      detailsHtml += `
        <div class="col-md-6 mb-2">
          <div class="d-flex justify-content-between align-items-center">
            <span>${obj.label || obj.className || "Unknown"}</span>
            <span class="badge ${badgeClass}">${confidence}%</span>
          </div>
          ${boxInfo}
        </div>
      `;
    });

    detailsHtml += `
          </div>
        </div>
      </div>
    `;
  }

  detailsSection.innerHTML = detailsHtml;
  resultsSection.style.display = "block";
}

// Show loading indicator
function showLoading() {
  document.getElementById("loadingIndicator").style.display = "block";
  document.getElementById("detectionResults").style.display = "none";
  document.getElementById("errorSection").style.display = "none";
}

// Hide loading indicator
function hideLoading() {
  document.getElementById("loadingIndicator").style.display = "none";
}

// Show error message
function showError(message) {
  const errorSection = document.getElementById("errorSection");
  const errorMessage = document.getElementById("errorMessage");

  errorMessage.textContent = message;
  errorSection.style.display = "block";
  document.getElementById("detectionResults").style.display = "none";
}

// Initialize slider value displays
function initSliderValueDisplays() {
  // Confidence threshold
  const confidenceSlider = document.getElementById("confidenceThreshold");
  const confidenceValue = document.getElementById("confidenceThresholdValue");
  if (confidenceSlider && confidenceValue) {
    confidenceValue.textContent = `${confidenceSlider.value}%`;
    confidenceSlider.addEventListener("input", function () {
      confidenceValue.textContent = `${confidenceSlider.value}%`;
    });
  }

  // Max detections
  const maxDetectionsSlider = document.getElementById("maxDetections");
  const maxDetectionsValue = document.getElementById("maxDetectionsValue");
  if (maxDetectionsSlider && maxDetectionsValue) {
    maxDetectionsValue.textContent = maxDetectionsSlider.value;
    maxDetectionsSlider.addEventListener("input", function () {
      maxDetectionsValue.textContent = maxDetectionsSlider.value;
    });
  }

  // Max frame rate
  const frameRateSlider = document.getElementById("maxFrameRate");
  const frameRateValue = document.getElementById("maxFrameRateValue");
  if (frameRateSlider && frameRateValue) {
    frameRateValue.textContent = `${frameRateSlider.value} fps`;
    frameRateSlider.addEventListener("input", function () {
      frameRateValue.textContent = `${frameRateSlider.value} fps`;
    });
  }

  // JPEG quality
  const jpegQualitySlider = document.getElementById("jpegQuality");
  const jpegQualityValue = document.getElementById("jpegQualityValue");
  if (jpegQualitySlider && jpegQualityValue) {
    jpegQualityValue.textContent = `${jpegQualitySlider.value}%`;
    jpegQualitySlider.addEventListener("input", function () {
      jpegQualityValue.textContent = `${jpegQualitySlider.value}%`;
    });
  }
}

// Save configuration button handler
document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.getElementById("saveConfigButton");
  if (saveButton) {
    saveButton.addEventListener("click", function () {
      // Show a success message
      const button = this;
      button.textContent = "Saving...";
      button.disabled = true;

      // Simulate saving configuration
      setTimeout(function () {
        button.textContent = "Saved!";
        button.classList.remove("btn-primary");
        button.classList.add("btn-success");

        // Reset after 2 seconds
        setTimeout(function () {
          button.textContent = "Save Configuration";
          button.classList.remove("btn-success");
          button.classList.add("btn-primary");
          button.disabled = false;
        }, 2000);
      }, 1500);
    });
  }
});

// Initialize detection modal handlers with real data support
function initDetectionModalHandlers() {
  const detectionModal = document.getElementById("detectionModal");
  if (detectionModal) {
    detectionModal.addEventListener("show.bs.modal", function (event) {
      const button = event.relatedTarget;
      const imageUrl = button.getAttribute("data-bs-image");
      const detectionData = button.getAttribute("data-detection");

      try {
        // Parse the detection data
        const detection = JSON.parse(detectionData);

        // Update modal image
        const modalImage = detectionModal.querySelector("img");
        if (modalImage && imageUrl) {
          modalImage.src = imageUrl;
          modalImage.alt = `Detection from ${
            detection.fileName || "Unknown file"
          }`;
        }

        // Update modal title
        const modalTitle = detectionModal.querySelector("#detectionModalLabel");
        if (modalTitle) {
          modalTitle.textContent = `Detection Details - ${
            detection.fileName || "Image"
          }`;
        }

        // Update detection information
        updateModalDetectionInfo(detection);

        // Update detected objects list
        updateModalDetectedObjects(detection.objects || []);
      } catch (error) {
        console.error("Error parsing detection data:", error);
        // Fallback to basic modal
        updateModalWithFallback(imageUrl);
      }
    });
  }
}

// Update modal detection information section
function updateModalDetectionInfo(detection) {
  const infoContainer = document.querySelector(
    "#detectionModal .col-md-6:first-child .list-group"
  );
  if (!infoContainer) return;

  const timestamp = formatTimestamp(detection.timestamp);
  const device = detection.device || "Unknown Device";
  const processingTime = detection.processingTime || "N/A";
  const fileName = detection.fileName || "Unknown file";
  const objectCount = detection.objects ? detection.objects.length : 0;
  const detectionId = detection.id || generateClientDetectionId(detection);

  // Store detection ID in delete button
  const deleteBtn = document.getElementById("deleteRecordBtn");
  if (deleteBtn) {
    deleteBtn.setAttribute("data-detection-id", detectionId);
  }

  // Determine detection status
  const status = objectCount > 0 ? "Success" : "No Objects Detected";
  const statusClass = objectCount > 0 ? "bg-success" : "bg-warning text-dark";

  infoContainer.innerHTML = `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <span><i class="fas fa-fingerprint me-2 text-muted"></i>Detection ID</span>
      <span class="text-secondary font-monospace">${detectionId}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <span><i class="fas fa-clock me-2 text-muted"></i>Timestamp</span>
      <span class="text-secondary">${timestamp}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <span><i class="fas fa-mobile-alt me-2 text-muted"></i>Device</span>
      <span class="text-secondary">${device}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <span><i class="fas fa-stopwatch me-2 text-muted"></i>Processing Time</span>
      <span class="text-secondary">${processingTime}ms</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <span><i class="fas fa-file-image me-2 text-muted"></i>File Name</span>
      <span class="text-secondary" title="${fileName}">${truncateText(
    fileName,
    20
  )}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <span><i class="fas fa-search me-2 text-muted"></i>Objects Found</span>
      <span class="badge bg-primary">${objectCount}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <span><i class="fas fa-check-circle me-2 text-muted"></i>Detection Status</span>
      <span class="badge ${statusClass}">${status}</span>
    </li>
  `;

  // Update statistics section
  updateModalStatistics(detection.objects || []);
}

// Generate client-side detection ID if not provided by server
function generateClientDetectionId(detection) {
  try {
    const timestamp = detection.timestamp || new Date().toISOString();
    const device = detection.device || "unknown";
    const objectCount = detection.objects ? detection.objects.length : 0;

    // Create a simple hash-based ID
    const combined = timestamp + device + objectCount;
    const hash = combined.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return "det_" + Math.abs(hash);
  } catch (error) {
    // Fallback to timestamp-based ID
    return "det_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  }
}

// Show alert messages to user
function showAlert(message, type = "info", duration = 5000) {
  const alertContainer = document.querySelector(".main-content");
  if (!alertContainer) return;

  const alertClass =
    {
      success: "alert-success",
      error: "alert-danger",
      warning: "alert-warning",
      info: "alert-info",
    }[type] || "alert-info";

  const icon =
    {
      success: "fas fa-check-circle",
      error: "fas fa-exclamation-triangle",
      warning: "fas fa-exclamation-triangle",
      info: "fas fa-info-circle",
    }[type] || "fas fa-info-circle";

  const alert = document.createElement("div");
  alert.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
  alert.style.cssText =
    "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
  alert.innerHTML = `
    <i class="${icon} me-2"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  document.body.appendChild(alert);

  // Auto-remove after duration
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, duration);
}

// Update modal statistics section
function updateModalStatistics(objects) {
  const totalObjectsElement = document.getElementById("modalTotalObjects");
  const avgConfidenceElement = document.getElementById("modalAvgConfidence");
  const highConfidenceElement = document.getElementById("modalHighConfidence");

  if (!totalObjectsElement || !avgConfidenceElement || !highConfidenceElement)
    return;

  const totalObjects = objects.length;

  if (totalObjects === 0) {
    totalObjectsElement.textContent = "0";
    avgConfidenceElement.textContent = "N/A";
    highConfidenceElement.textContent = "0";
    return;
  }

  // Calculate average confidence
  const totalConfidence = objects.reduce(
    (sum, obj) => sum + (obj.confidence || 0),
    0
  );
  const avgConfidence = Math.round((totalConfidence / totalObjects) * 100);

  // Count high confidence objects (>= 80%)
  const highConfidenceCount = objects.filter(
    (obj) => (obj.confidence || 0) >= 0.8
  ).length;

  totalObjectsElement.textContent = totalObjects;
  avgConfidenceElement.textContent = `${avgConfidence}%`;
  highConfidenceElement.textContent = highConfidenceCount;
}

// Enhanced modal detected objects display
function updateModalDetectedObjects(objects) {
  const objectsContainer = document.querySelector(
    "#detectionModal .col-md-6:last-child .list-group"
  );
  if (!objectsContainer) return;

  if (!objects || objects.length === 0) {
    objectsContainer.innerHTML = `
      <li class="list-group-item text-center text-muted py-4">
        <i class="fas fa-info-circle fa-2x mb-2 d-block"></i>
        <div>No objects detected in this image</div>
        <small>Try uploading a different image with more visible objects</small>
      </li>
    `;
    return;
  }

  let objectsHtml = "";

  // Sort objects by confidence (highest first)
  const sortedObjects = [...objects].sort(
    (a, b) => (b.confidence || 0) - (a.confidence || 0)
  );

  sortedObjects.forEach((obj, index) => {
    const label = obj.label || "Unknown Object";
    const confidence = Math.round((obj.confidence || 0) * 100);

    // Determine badge color and icon based on confidence
    let badgeClass = "bg-success";
    let icon = "fas fa-check-circle";
    if (confidence < 70) {
      badgeClass = "bg-warning text-dark";
      icon = "fas fa-exclamation-triangle";
    }
    if (confidence < 50) {
      badgeClass = "bg-danger";
      icon = "fas fa-times-circle";
    }

    // Add bounding box info if available
    let boundingBoxInfo = "";
    if (obj.box) {
      const box = obj.box;
      const x = Math.round(box.xmin || box.x || 0);
      const y = Math.round(box.ymin || box.y || 0);
      const width = Math.round(box.xmax - box.xmin || box.width || 0);
      const height = Math.round(box.ymax - box.ymin || box.height || 0);
      boundingBoxInfo = `
        <small class="text-muted d-block mt-1">
          <i class="fas fa-crosshairs me-1"></i>
          Position: (${x}, ${y}) • Size: ${width}×${height}px
        </small>
      `;
    }

    objectsHtml += `
      <li class="list-group-item">
        <div class="d-flex justify-content-between align-items-start">
          <div class="flex-grow-1">
            <div class="d-flex align-items-center mb-1">
              <i class="${icon} me-2 text-muted"></i>
              <span class="fw-bold">${label}</span>
              <span class="ms-2 text-muted">#${index + 1}</span>
            </div>
            ${boundingBoxInfo}
          </div>
          <span class="badge ${badgeClass} ms-2">${confidence}%</span>
        </div>
      </li>
    `;
  });

  objectsContainer.innerHTML = objectsHtml;
}

// Format timestamp for display
function formatTimestamp(timestamp) {
  if (!timestamp) return "Unknown time";

  try {
    const date = new Date(timestamp);

    // Format: "2025-05-16 12:34:56"
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return timestamp;
  }
}

// Fallback modal content when data parsing fails
function updateModalWithFallback(imageUrl) {
  const modalTitle = document.querySelector("#detectionModalLabel");
  if (modalTitle) {
    modalTitle.textContent = "Detection Details";
  }

  const infoContainer = document.querySelector(
    "#detectionModal .col-md-6:first-child .list-group"
  );
  if (infoContainer) {
    infoContainer.innerHTML = `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        Status
        <span class="badge bg-warning text-dark">Data Unavailable</span>
      </li>
    `;
  }

  const objectsContainer = document.querySelector(
    "#detectionModal .col-md-6:last-child .list-group"
  );
  if (objectsContainer) {
    objectsContainer.innerHTML = `
      <li class="list-group-item text-center text-muted">
        <i class="fas fa-exclamation-triangle me-2"></i>
        Detection data could not be loaded
      </li>
    `;
  }
}

// Utility function to truncate text
function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

// Escape HTML to prevent XSS and ensure proper JSON in HTML attributes
function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") {
    unsafe = String(unsafe);
  }

  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Initialize modal action handlers
function initModalActionHandlers() {
  // Download image button handler
  const downloadBtn = document.getElementById("downloadImageBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      const modalImage = document.querySelector("#detectionModal img");
      if (modalImage && modalImage.src) {
        // Create a temporary link to download the image
        const link = document.createElement("a");
        link.href = modalImage.src;
        link.download = "detection-result.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        showAlert("No image available for download", "warning");
      }
    });
  }

  // Delete record button handler with real API integration
  const deleteBtn = document.getElementById("deleteRecordBtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async function () {
      const detectionData = this.getAttribute("data-detection-id");

      if (!detectionData) {
        showAlert("No detection ID found", "error");
        return;
      }

      // Show confirmation dialog
      if (
        !confirm(
          "Are you sure you want to delete this detection record? This action cannot be undone."
        )
      ) {
        return;
      }

      // Show loading state
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Deleting...';
      this.disabled = true;

      try {
        // Call delete API
        await deleteDetectionById(detectionData);

        // Show success message
        showAlert("Detection record deleted successfully", "success");

        // Close the modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("detectionModal")
        );
        if (modal) modal.hide();

        // Refresh the detections list
        setTimeout(() => {
          loadRecentDetections();
        }, 500);
      } catch (error) {
        console.error("Delete failed:", error);
        showAlert("Failed to delete detection: " + error.message, "error");
      } finally {
        // Restore button state
        this.innerHTML = originalText;
        this.disabled = false;
      }
    });
  }
}

// Simulate real-time updates for dashboard (now using real data)
function startRealtimeUpdates() {
  // Fetch dashboard metrics every 30 seconds
  setInterval(async function () {
    await loadDashboardData();
    await loadSystemStatus();
    await loadRecentDetections();
  }, 30000); // Update every 30 seconds
}

// Export chart data (placeholder function)
function exportChartData() {
  alert("Data export functionality would be implemented here.");
}

// Utility function to calculate time ago
function getTimeAgo(timestamp) {
  if (!timestamp) return "Unknown time";

  try {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  } catch (error) {
    return "Unknown time";
  }
}

// Test connection to Spring Boot server
async function testConnection() {
  try {
    const response = await fetch(`${DASHBOARD_API_URL}/metrics`);
    console.log("Connection test - Status:", response.status);
    return response.ok;
  } catch (error) {
    console.error("Connection test failed:", error);
    return false;
  }
}

// Run connection test on page load
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(async () => {
    const connected = await testConnection();
    if (!connected) {
      console.warn(
        "Cannot connect to Spring Boot server. Make sure it is running on port 8080."
      );
      // Show connection error in UI
      showConnectionError();
    } else {
      console.log("Successfully connected to Spring Boot server.");
    }
  }, 1000);
});

// Show connection error in the UI
function showConnectionError() {
  const dashboard = document.querySelector(".main-content");
  if (dashboard) {
    const errorBanner = document.createElement("div");
    errorBanner.className =
      "alert alert-warning alert-dismissible fade show mb-3";
    errorBanner.innerHTML = `
      <i class="fas fa-exclamation-triangle me-2"></i>
      <strong>Connection Error:</strong> Cannot connect to the Spring Boot server. 
      Make sure it's running on port 8080.
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    dashboard.insertBefore(errorBanner, dashboard.firstChild);
  }
}

// Get detection by ID
async function getDetectionById(detectionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/detect/${detectionId}`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Client-Type": "Web Portal",
      },
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 404) {
      console.warn("Detection not found:", detectionId);
      return null;
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error getting detection:", error);
    throw error;
  }
}

// Delete detection by ID
async function deleteDetectionById(detectionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/detect/${detectionId}`, {
      method: "DELETE",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Client-Type": "Web Portal",
        "X-Device-Info": getClientDeviceInfo(),
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Detection deleted successfully:", result);
      return result;
    } else if (response.status === 404) {
      throw new Error("Detection not found");
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete detection");
    }
  } catch (error) {
    console.error("Error deleting detection:", error);
    throw error;
  }
}

// Get all detections with pagination and filtering
async function getAllDetections(
  page = 0,
  size = 20,
  category = null,
  device = null,
  search = null
) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (category && category !== "all") params.append("category", category);
    if (device) params.append("device", device);
    if (search) params.append("search", search);

    const response = await fetch(`${API_BASE_URL}/detect?${params}`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Client-Type": "Web Portal",
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error getting all detections:", error);
    throw error;
  }
}

// Get detection statistics
async function getDetectionStatistics(timeframe = "day") {
  try {
    const response = await fetch(
      `${API_BASE_URL}/detect/statistics?timeframe=${timeframe}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-Client-Type": "Web Portal",
        },
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error getting detection statistics:", error);
    throw error;
  }
}
