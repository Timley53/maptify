// "strict mode";

const Searchbtn = document.querySelector(".btn");
const ApiStatus = document.querySelector(".status");
const spiner = document.querySelector(".spiner");
const searchInput = document.querySelector(".search-input");
const searchInputID = document.querySelector("#search-input");

//content

const ipContent = document.querySelector(".ip-content");
const locationContent = document.querySelector(".location-content");
const timezoneContent = document.querySelector(".timezone-content");
const ISPcontent = document.querySelector(".isp-content");

/////
///
//////////

// fetch(
//   `https://geo.ipify.org/api/v2/country,city?apiKey=at_DHeIaStf9lJIjGMHyD4eZOGmc0JlH&ipAddress=
// `
// )
//   .then((res) => {
//     console.log(res);
//     if (!res.ok) throw new Error(`error ${res.status}`);
//     return res.json();
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// // https://geo.ipify.org/api/v2/country,city?apiKey=at_DHeIaStf9lJIjGMHyD4eZOGmc0JlH&ipAddress=

// // class IpLookUp {
// //   constructor() {}
// // }
let map;
let tryIP;
let checklist = [".com", ".org", ".xyz"];

navigator.geolocation.getCurrentPosition((position) => {
  console.log(position);

  let { latitude: lat, longitude: lng } = position.coords;

  //////
  //////////
  ApiStatus.classList.remove("show-status");
  ApiStatus.textContent = `Success ✅`;
  ApiStatus.style.backgroundColor = "green";
  checkIp();

  ////
  ///////
  /////
  console.log(lat, lng);
  map = L.map("map").setView([lat, lng], 13);
  //   .locate({ setView: true, maxZoom: 8 });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
});

// map = L.map("map").setView([51.503, -0.09], 13);
//   .locate({ setView: true, maxZoom: 8 });

// L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution:
//     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// }).addTo(map);
//
// console.log(map);
Searchbtn.addEventListener("click", function () {
  if (!searchInput.value) {
    validation();
    return;
  } else if (searchInput.value === "0") {
    validation();
    return;
  }
  ApiStatus.classList.remove("show-status");
  ApiStatus.textContent = `Success ✅`;
  ApiStatus.style.backgroundColor = "green";

  checkIp();
});

async function checkIp() {
  spiner.style.opacity = 1;
  try {
    let tryIP = await fetch(
      `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_DHeIaStf9lJIjGMHyD4eZOGmc0JlH&ipAddress=${searchInput.value}
`
    );
    if (!tryIP.ok) {
      tryIP = await fetch(
        `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_DHeIaStf9lJIjGMHyD4eZOGmc0JlH&domain=${searchInput.value}
`
      );
      if (!tryIP.ok) {
        throw new Error(`${tryIP.status}`);
      }
    }

    const ParseIP = await tryIP.json();
    // console.log(ParseIP.location);

    console.log(ParseIP);
    ipContent.textContent = ParseIP.ip;
    locationContent.textContent = `${ParseIP.location.city},  ${ParseIP.location.country},  ${ParseIP.location.postalCode}`;
    timezoneContent.textContent = `UTC ${ParseIP.location.timezone}`;
    ISPcontent.textContent = ParseIP.isp;

    const { lat, lng } = ParseIP.location;

    map.setView([lat, lng], 17);

    L.marker([lat, lng]).addTo(map);
  } catch (err) {
    console.error(err);
    ApiStatus.textContent = `Error: ${err.message}, Try again`;
    ApiStatus.style.backgroundColor = "crimson";
  } finally {
    ApiStatus.classList.add("show-status");
    spiner.style.opacity = 0;

    setTimeout(() => {
      ApiStatus.classList.remove("show-status");
    }, 10000);
  }
}
function validation() {
  searchInput.style.border = "2px solid red";
  searchInput.value = "";

  setTimeout(() => {
    searchInput.style.border = "none";
  }, 2000);
}
