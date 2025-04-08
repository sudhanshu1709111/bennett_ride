window.addEventListener('load', function() {
    document.querySelector('.preloader').classList.add('hidden');
});

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or use device preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    htmlElement.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', function() {
    if (htmlElement.getAttribute('data-theme') === 'dark') {
        htmlElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

// Mobile Navigation
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const overlay = document.querySelector('.overlay');

navToggle.addEventListener('click', function() {
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});

overlay.addEventListener('click', function() {
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Close mobile nav when clicking on a link
document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Search Functionality
const searchBar = document.querySelector('.search-bar');
const searchResults = document.querySelector('.search-results');
const searchResultItems = document.querySelectorAll('.search-result-item');
const searchError = document.querySelector('.search-error');

searchBar.addEventListener('focus', function() {
    searchResults.classList.add('active');
});

searchBar.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    let resultsFound = false;
    
    searchResultItems.forEach(item => {
        const name = item.querySelector('.search-result-name').textContent.toLowerCase();
        const address = item.querySelector('.search-result-address').textContent.toLowerCase();
        
        if (name.includes(query) || address.includes(query)) {
            item.style.display = 'flex';
            resultsFound = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    searchError.style.display = resultsFound || query === '' ? 'none' : 'block';
});

document.addEventListener('click', function(e) {
    if (!searchBar.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('active');
    }
});

searchResultItems.forEach(item => {
    item.addEventListener('click', function() {
        const locationName = this.querySelector('.search-result-name').textContent;
        searchBar.value = locationName;
        searchResults.classList.remove('active');
    });
});

// Initialize Map - FIXED: Added error handling for map initialization
try {
    let map = L.map('map').setView([28.4595, 77.5857], 15); // Bennett University coordinates
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Custom marker icons
    const shuttleIcon = L.divIcon({
        html: '<i class="fas fa-shuttle-van" style="color: #0071e3; font-size: 24px;"></i>',
        className: 'shuttle-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    const cabIcon = L.divIcon({
        html: '<i class="fas fa-taxi" style="color: #ff375f; font-size: 24px;"></i>',
        className: 'cab-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    // Add some sample markers
    const shuttle1 = L.marker([28.4585, 77.5847], {icon: shuttleIcon}).addTo(map)
        .bindPopup('Shuttle #1 - ETA: 5 mins');
        
    const shuttle2 = L.marker([28.4605, 77.5867], {icon: shuttleIcon}).addTo(map)
        .bindPopup('Shuttle #2 - ETA: 12 mins');
        
    const cab1 = L.marker([28.4575, 77.5877], {icon: cabIcon}).addTo(map)
        .bindPopup('Cab #A45 - Available');
        
    const cab2 = L.marker([28.4615, 77.5837], {icon: cabIcon}).addTo(map)
        .bindPopup('Cab #B12 - Available');
    
    // Simulate moving vehicles - FIXED: Corrected the code that was causing the error
    function moveMarkers() {
        // Random movement for shuttle1
        let lat1 = shuttle1.getLatLng().lat + (Math.random() - 0.5) * 0.0005;
        let lng1 = shuttle1.getLatLng().lng + (Math.random() - 0.5) * 0.0005;
        shuttle1.setLatLng([lat1, lng1]);
        
        // Random movement for shuttle2
        let lat2 = shuttle2.getLatLng().lat + (Math.random() - 0.5) * 0.0005;
        let lng2 = shuttle2.getLatLng().lng + (Math.random() - 0.5) * 0.0005;
        shuttle2.setLatLng([lat2, lng2]);
        
        // Random movement for cab1
        let lat3 = cab1.getLatLng().lat + (Math.random() - 0.5) * 0.0005;
        let lng3 = cab1.getLatLng().lng + (Math.random() - 0.5) * 0.0005;
        cab1.setLatLng([lat3, lng3]);
        
        // Random movement for cab2
        let lat4 = cab2.getLatLng().lat + (Math.random() - 0.5) * 0.0005;
        let lng4 = cab2.getLatLng().lng + (Math.random() - 0.5) * 0.0005;
        cab2.setLatLng([lat4, lng4]);
    }
    
    // Update markers every 2 seconds
    setInterval(moveMarkers, 2000);
} catch (error) {
    console.error("Map initialization error:", error);
    // Fallback for map error
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.innerHTML = '<div class="map-error" style="height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; padding: 20px;"><i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--error); margin-bottom: 20px;"></i><h3>Map could not be loaded</h3><p>Please check your internet connection and refresh the page.</p></div>';
    }
}

// Parking Reservation Form
const parkingForm = document.getElementById('parkingForm');
const bookingSuccess = document.querySelector('.booking-success');

parkingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulate form submission
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    setTimeout(function() {
        submitButton.style.display = 'none';
        bookingSuccess.style.display = 'block';
        
        // Reset form after 5 seconds
        setTimeout(function() {
            parkingForm.reset();
            submitButton.disabled = false;
            submitButton.innerHTML = 'Book Now';
            submitButton.style.display = 'block';
            bookingSuccess.style.display = 'none';
        }, 5000);
    }, 1500);
});

// Feedback Form
const feedbackForm = document.querySelector('.feedback-form');

feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulate form submission
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    setTimeout(function() {
        submitButton.innerHTML = '<i class="fas fa-check"></i> Feedback Submitted!';
        submitButton.style.backgroundColor = 'var(--success)';
        
        // Reset form after 3 seconds
        setTimeout(function() {
            feedbackForm.reset();
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            submitButton.style.backgroundColor = '';
        }, 3000);
    }, 1500);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 64, // Adjust for header height
                behavior: 'smooth'
            });
        }
    });
});