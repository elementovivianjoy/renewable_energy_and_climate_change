document.addEventListener("DOMContentLoaded", () => {
    // Initialize the map
    var map = L.map('map').setView([20, 0], 2);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // List of countries and coordinates for renewable energy data
    const countries = [
        { name: "United States", code: "US", lat: 37.0902, lon: -95.7129 },
        { name: "United Kingdom", code: "GB", lat: 55.3781, lon: -3.4360 },
        { name: "Japan", code: "JP", lat: 36.2048, lon: 138.2529 },
        { name: "Australia", code: "AU", lat: -25.2744, lon: 133.7751 },
        { name: "South Africa", code: "ZA", lat: -30.5595, lon: 22.9375 }
    ];

    // Fetch renewable energy data from World Bank API
    function fetchRenewableData(country) {
        const url = `https://api.worldbank.org/v2/country/${country.code}/indicator/EG.FEC.RNEW.ZS?date=1999:1999&format=json`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data[1] && data[1][0].value !== null) {
                    let value = data[1][0].value;
                    L.marker([country.lat, country.lon]).addTo(map)
                        .bindPopup(`<b>${country.name}</b><br>Renewable Energy: ${value}%`)
                        .openPopup();
                } else {
                    console.log(`No renewable energy data for ${country.name}`);
                }
            })
            .catch(error => console.error(`Error fetching renewable data for ${country.name}:`, error));
    }

    // Fetch carbon intensity data from Electricity Map API
    function fetchCarbonIntensity() {
        fetch('https://api.electricitymap.org/v3/carbon-intensity/latest?zone=PH', {
            method: 'GET',
            headers: {
                'auth-token': 'EabDeMVMSm81riCkJV4R'
            }
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            let intensity = data.carbonIntensity;
            L.marker([13.41, 122.56]).addTo(map)
                .bindPopup(`<b>Philippines</b><br>Carbon Intensity: ${intensity} gCO2/kWh`)
                .openPopup();
        })
        .catch(error => console.error('Error fetching carbon intensity data:', error));
    }

    // Fetch data for each country
    countries.forEach(fetchRenewableData);
    fetchCarbonIntensity(); // Fetch carbon intensity for the Philippines
});