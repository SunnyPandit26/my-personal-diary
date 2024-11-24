// Declare variables
let currentMood = '';
let currentPage = 1;
const maxWordsPerPage = 500;

// Add back button functionality
function goBack() {
  window.location.href = 'theme-selector.html';
}

// Check if we're viewing a saved entry
window.onload = function () {
  const viewIndex = localStorage.getItem('viewIndex');
  if (viewIndex !== null) {
    const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    const entry = entries[viewIndex];
    if (entry) {
      document.getElementById('diaryDate').value = entry.date;
      document.getElementById('diaryText').value = entry.text;
      currentMood = entry.mood;
    }
    localStorage.removeItem('viewIndex');
  }
};

// Set theme from localStorage
document.addEventListener('DOMContentLoaded', function() {
  const theme = localStorage.getItem('diaryTheme');
  const themes = {
    Ocean: {
      colors: ['#ff6b6b', '#4ecdc4'],
      backgroundImage: 'url("pexels-shvetsa-4014919.jpg")'
    },
    Clear_Sky: {
      colors: ['#a8e6cf', '#3d84a8'],
      backgroundImage: 'url("ocean-bg.jpg")'
    },
    Peacfull: {
      colors: ['#ffd93d', '#ff6b6b'],
      backgroundImage: 'url("autumn-bg.jpg")'
    },
    Dolphins: {
      colors: ['#6c5b7b', '#c06c84'],
      backgroundImage: 'url("dolphin.jpg")',
    },
   Majestic: {
      colors: ['#2af598', '#009efd'],
      backgroundImage: 'url("spring-bg.jpg")'
    },
    Diary: {
      colors: ['#f6d365', '#fda085'],
      backgroundImage: 'url("desert-bg.jpg")'
    }
  };
  if (theme && themes[theme]) {
    document.body.style.background = `linear-gradient(45deg, ${themes[theme].colors[0]}, ${themes[theme].colors[1]})`;
    document.body.style.backgroundImage = themes[theme].backgroundImage;
    document.body.style.backgroundSize = themes[theme].backgroundSize || 'cover';
    document.body.style.backgroundPosition = themes[theme].backgroundPosition || 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  }

  // Set today's date by default
  document.getElementById('diaryDate').valueAsDate = new Date();
});

function selectMood(mood) {
  currentMood = mood;
  document.querySelectorAll('.mood-emoji').forEach(emoji => {
    emoji.style.transform = 'scale(1)';
  });
  event.target.style.transform = 'scale(1.2)';
}

function saveDiary() {
  const text = document.getElementById('diaryText').value;
  const date = document.getElementById('diaryDate').value;
  const userName = localStorage.getItem('diaryUserName');

  if (text.trim() === '') {
    alert('Please write something in your diary');
    return;
  }

  const diaryEntry = {
    text,
    date,
    mood: currentMood,
    userName
  };

  let savedEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
  savedEntries.push(diaryEntry);
  localStorage.setItem('diaryEntries', JSON.stringify(savedEntries));

  alert('Diary entry saved successfully!');
  document.getElementById('diaryText').value = '';
  currentPage = 1; // Reset page count after saving
}

function toggleView() {
  const diaryPage = document.querySelector('.diary-page');
  const savedDiaries = document.getElementById('savedDiaries');

  if (diaryPage.style.display === 'none') {
    diaryPage.style.display = 'block';
    savedDiaries.style.display = 'none';
  } else {
    diaryPage.style.display = 'none';
    savedDiaries.style.display = 'block';
    displaySavedEntries();
  }
}

function deleteEntry(index, event) {
  event.stopPropagation();

  if (confirm('Are you sure you want to delete this entry?')) {
    let entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    entries.splice(index, 1);
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
    displaySavedEntries();
  }
}

function displaySavedEntries() {
  const savedDiaries = document.getElementById('savedDiaries');
  const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];

  savedDiaries.innerHTML = '';
  entries.forEach((entry, index) => {
    const card = document.createElement('div');
    card.className = 'diary-card';
    card.innerHTML = `
      <div class="card-header">
        <h3>${new Date(entry.date).toLocaleDateString()} ${entry.mood}</h3>
        <button class="delete-btn" onclick="deleteEntry(${index}, event)">🗑️</button>
      </div>
      <p>${entry.text.substring(0, 100)}...</p>
    `;
    card.onclick = () => viewFullEntry(index);
    savedDiaries.appendChild(card);
  });
}

function viewFullEntry(index) {
  const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
  const entry = entries[index];

  document.getElementById('diaryDate').value = entry.date;
  document.getElementById('diaryText').value = entry.text;
  currentMood = entry.mood;

  toggleView();
}

// Handle text overflow and pagination
const diaryTextArea = document.getElementById('diaryText');
const wordCountDisplay = document.createElement('div');
wordCountDisplay.className = 'word-count';
diaryTextArea.parentNode.appendChild(wordCountDisplay);

const nextPageButton = document.createElement('div');
nextPageButton.className = 'next-page-btn';
nextPageButton.innerHTML = '→';
nextPageButton.style.display = 'none';
diaryTextArea.parentNode.appendChild(nextPageButton);

diaryTextArea.addEventListener('input', function() {
  const words = this.value.split(' ').length;
  const currentWordCount = words - (currentPage - 1) * maxWordsPerPage;
  wordCountDisplay.textContent = `Word count: ${words} (Page ${currentPage})`;

  if (currentWordCount >= maxWordsPerPage) {
    currentPage++;
    this.value += '\n\n--- Page ' + currentPage + ' ---\n\n';
    nextPageButton.style.display = 'block';
  } else {
    nextPageButton.style.display = 'none';
  }
});

nextPageButton.addEventListener('click', function() {
  const diaryText = document.getElementById('diaryText');
  diaryText.value += '\n\n--- Page ' + (currentPage + 1) + ' ---\n\n';
  currentPage++;
  nextPageButton.style.display = 'none';
});

// Set today's date by default
document.getElementById('diaryDate').valueAsDate = new Date();
