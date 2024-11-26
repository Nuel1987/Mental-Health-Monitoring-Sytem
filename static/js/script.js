// Handle form submission for Mental Health Assessment
document.getElementById('assessmentForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Collect form data
  const stressLevel = document.getElementById('stress_level').value;
  const sleepQuality = document.getElementById('sleep_quality').value;
  const mood = document.getElementById('mood').value;

  const payload = {
    stress_level: stressLevel,
    sleep_quality: sleepQuality,
    mood: mood,
  };

  try {
    // Send POST request to the backend
    const response = await fetch('/api/assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      // Display the result
      const resultElement = document.getElementById('assessmentResult');
      resultElement.textContent = result.message;
      resultElement.style.color = "green";
    } else {
      displayError('An error occurred. ' + (result.error || ''));
    }
  } catch (error) {
    displayError('Failed to connect to the server.');
  }
});

// Handle "View Resources" button click with toggle functionality
document.getElementById('viewResourcesBtn').addEventListener('click', async () => {
  const resourcesList = document.getElementById('resourcesList');
  
  // Check if the resources list is already visible
  if (resourcesList.style.display === 'block') {
    // Hide the resources list if it's visible
    resourcesList.style.display = 'none';
  } else {
    try {
      // Send GET request to fetch resources
      const response = await fetch('/api/resources');

      if (response.ok) {
        const resources = await response.json();

        // Clear any existing content in the resources list
        resourcesList.innerHTML = '';

        // Loop through each resource and create HTML elements to display
        resources.forEach(resource => {
          const resourceDiv = document.createElement('div');
          resourceDiv.classList.add('resource');

          const title = document.createElement('h3');
          title.textContent = resource.title;

          const description = document.createElement('p');
          description.textContent = resource.description;

          const link = document.createElement('a');
          link.href = resource.link;
          link.textContent = 'Learn more';
          link.target = '_blank';

          // Append the elements to the resource div
          resourceDiv.appendChild(title);
          resourceDiv.appendChild(description);
          resourceDiv.appendChild(link);

          // Append the resource div to the resources list
          resourcesList.appendChild(resourceDiv);
        });

        // Show the resources list
        resourcesList.style.display = 'block';
      } else {
        displayError('Failed to load resources.');
      }
    } catch (error) {
      displayError('Failed to connect to the server.');
    }
  }
});

// Display error message for both form and resources
function displayError(message) {
  const resultElement = document.getElementById('assessmentResult') || document.getElementById('resourcesList');
  resultElement.textContent = message;
  resultElement.style.color = "red";
}
