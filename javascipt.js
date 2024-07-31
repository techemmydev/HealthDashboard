async function fetchData() {
  const username = "coalition";
  const password = "skills-test";
  const credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(
      "https://fedskillstest.coalitiontechnologies.workers.dev",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    displayData(data); // Call the function to display data
    console.log(data);
    // Check if the length of data is 3 and change background color if true
    // Check if the length of data is 3 and change background color if true
    const patient = data.find((patient) => patient.name === "Jessica Taylor");
    if (patient) {
      document.querySelector(".user-details");
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function displayData(data) {
  // Find the specific patient (Jessica Taylor)
  const patient = data.find((patient) => patient.name === "Jessica Taylor");

  if (patient) {
    // Update the patient details
    document.querySelector(".div-3 h1").textContent = patient.name;
    const imageElement = document.querySelector(".div-3 img");
    imageElement.src = patient.profile_picture;

    document.querySelector(".date-of-birth h6").innerHTML = new Date(
      patient.date_of_birth
    ).toLocaleDateString();
    document.querySelector(".div-3-contact h2").textContent = patient.gender;
    document.querySelector(".div-3-contact h5").textContent =
      patient.phone_number;
    document.querySelector(".Emergency h2").textContent =
      patient.emergency_contact;
    document.querySelector(".Insurance h2").textContent =
      patient.insurance_type;

    // Update diagnostic list
    const diagnosisElements = document.querySelectorAll(
      ".Diagnosis-list1-inner"
    );
    diagnosisElements.forEach((element, index) => {
      if (index > 0 && index <= patient.diagnostic_list.length) {
        const data = patient.diagnostic_list[index - 1];
        const children = element.children;
        if (children.length === 3) {
          children[0].textContent = data.name;
          children[1].textContent = data.description;
          children[2].textContent = data.status;
        }
      }
    });

    // Update lab results
    const labResultElements = document.querySelectorAll(".lab-results");
    labResultElements.forEach((element, index) => {
      if (index < patient.lab_results.length) {
        element.firstChild.textContent = patient.lab_results[index];
      }
    });

    // Update latest diagnosis history
    const latestDiagnosis = patient.diagnosis_history[0];

    // Update heart rate
    const heartRateSection = document.querySelector(".user-diagram-3");
    const heartRateValueElement = heartRateSection.querySelector("p");
    heartRateValueElement.textContent = `${latestDiagnosis.heart_rate.value} bpm`;
    const heartRateLevelElement = heartRateSection.querySelector("h2");
    heartRateLevelElement.textContent = latestDiagnosis.heart_rate.levels;

    // Update respiratory rate
    const respiratoryRateSection = document.querySelector(".user-diagram-1");
    const respiratoryRateValueElement =
      respiratoryRateSection.querySelector("p");
    respiratoryRateValueElement.textContent = `${latestDiagnosis.respiratory_rate.value} bpm`;
    const respiratoryRateLevelElement =
      respiratoryRateSection.querySelector("h2");
    respiratoryRateLevelElement.textContent =
      latestDiagnosis.respiratory_rate.levels;

    // Update temperature
    const temperatureSection = document.querySelector(".user-diagram-2");
    const temperatureValueElement = temperatureSection.querySelector("p");
    temperatureValueElement.textContent = `${latestDiagnosis.temperature.value}°F`;
    const temperatureLevelElement = temperatureSection.querySelector("h2");
    temperatureLevelElement.textContent = latestDiagnosis.temperature.levels;
  }

  // Display all the user list on the left side
  const userList = document.querySelector(".user-list");

  // Function to create and append user items
  function createUserItem(patient) {
    const userItem = document.createElement("li");
    userItem.classList.add("user-item");

    userItem.innerHTML = `
        <div class="ll">
          <img src="${patient.profile_picture}" alt="Avatar" class="avatar" />
          <div class="user-details">
            <h4>${patient.name}</h4>
            <p>${patient.gender}, ${patient.age}</p>
          </div>
        </div>
        <div class="user-actions">
          <button>...</button>
        </div>
      `;

    userList.appendChild(userItem);
  }

  // Iterate over the first 12 patients and create user items
  data.slice(0, 12).forEach(createUserItem);

  // Prepare data for the chart
  const xValues = patient.diagnosis_history.map(
    (entry) => `${entry.month} ${entry.year}`
  );
  const heartRates = patient.diagnosis_history.map(
    (entry) => entry.heart_rate.value
  );
  const respiratoryRates = patient.diagnosis_history.map(
    (entry) => entry.respiratory_rate.value
  );
  const temperatures = patient.diagnosis_history.map(
    (entry) => entry.temperature.value
  );

  // Create the chart
  new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          label: "Heart Rate",
          data: heartRates,
          borderColor: "red",
          fill: false,
        },
        {
          label: "Respiratory Rate",
          data: respiratoryRates,
          borderColor: "green",
          fill: false,
        },
        {
          label: "Temperature",
          data: temperatures,
          borderColor: "blue",
          fill: false,
        },
      ],
    },
    options: {
      legend: { display: true },
    },
  });
}

document.addEventListener("DOMContentLoaded", fetchData);
