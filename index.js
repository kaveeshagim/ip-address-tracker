/* Select form */
const search_form = document.querySelector(".header_form");

search_form.addEventListener("submit", (event) => {
  /* stop form from auto submiting on click */
  event.preventDefault();

  /* get the value of the form field */
  const value = document.querySelector("#search").value.trim();

  console.log(value);

  /* Regular expressions for IPv4 and IPv6 */
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)$/;

  /* Check if the value is a valid IP address */
  if (ipv4Regex.test(value) || ipv6Regex.test(value)) {
    console.log(value);

    /* Pass the IP address to the search_Ip_Address() function */
    search_Ip_Address(value);
  } else {
    /* Display an alert if the value is not a valid IP address */
    alert("Please enter a valid IP address.");
  }

  /* Pass the Ip address to the search_Ip_Address() function */
  search_Ip_Address(value);
});

/* Search for an IpAddress */
async function search_Ip_Address(ip_address) {
  const api_key = "at_Cyi8yIwSKf3x9HiVnKamBbu4eTYlD";
  const request = await fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=${api_key}&ipAddress=${ip_address}`
  );
  const response = await request.json();

  console.log("api response - " + response);

  /* Update the UI on the page */
  const { location, ip, isp } = response;
  update_ui(ip, location.city, location.timezone, isp);

  /* Update the map on the page */
  /* first remove all map instances if any */
  if (map !== undefined && map !== null) {
    map.remove();
  }
  create_map(location.lat, location.lng, location.country, location.region);
}

/* update UI function */
function update_ui(ip_address, location, timezone, isp) {
  /* select all the elements on the page */
  const address = document.querySelector(".address");
  const city = document.querySelector(".location");
  const utc = document.querySelector(".utc");
  const isprovider = document.querySelector(".isp");

  /* Update all the elements on the page */
  address.textContent = ip_address;
  city.textContent = location;
  utc.textContent = "UTC" + timezone;
  isprovider.textContent = isp;
}

/* create the map */
let map;
function create_map(lat, lng, country, region) {
  console.log("lat " + lat);
  map = L.map("map").setView([lat, lng], 14);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`${region}, ${country}`)
    .openPopup();
}
