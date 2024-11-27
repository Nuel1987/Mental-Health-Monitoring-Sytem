// Handle form submission for Mental Health Assessment
document.getElementById('assessmentForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const stressLevel = document.getElementById('stress_level').value;
  const sleepQuality = document.getElementById('sleep_quality').value;
  const mood = document.getElementById('mood').value;

  try {
    const response = await fetch('/api/assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stress_level: stressLevel, sleep_quality: sleepQuality, mood }),
    });

    const result = await response.json();
    document.getElementById('assessmentResult').textContent = result.message;
  } catch {
    document.getElementById('assessmentResult').textContent = "Error: Failed to connect.";
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
// Handle chatbot interaction
async function sendMessage() {
  const userMessage = document.getElementById('userMessage').value;
  const chatMessages = document.getElementById('chatMessages');

  chatMessages.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
  document.getElementById('userMessage').value = '';

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage }),
  });

  const data = await response.json();
  chatMessages.innerHTML += `<p><strong>Bot:</strong> ${data.response}</p>`;
}
