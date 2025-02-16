const surahSelect = document.getElementById('surah-select');
const surahName = document.getElementById('surah-name');
const versesContainer = document.getElementById('verses-container');
const surahContent = document.getElementById('surah-content');

// Function to show selected section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Function to fetch Surah data from AlQuran.cloud API
async function fetchSurahData() {
    const response = await fetch('https://api.alquran.cloud/v1/surah'); // API to get Surah details
    const data = await response.json();
    return data.data; // Adjusting based on API's response structure
}

// Function to load Surah List into select dropdown
async function loadSurahList() {
    const surahs = await fetchSurahData();
    surahs.forEach(surah => {
        const option = document.createElement('option');
        option.value = surah.number;
        option.textContent = `${surah.englishName} (${surah.name})`;
        surahSelect.appendChild(option);
    });
}

// Function to fetch and display Surah content
async function displaySurah(surahNumber) {
    surahContent.style.display = 'none';
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    const surahData = await response.json();
    const surah = surahData.data;
    
    surahName.textContent = `${surah.englishName} (${surah.name})`;
    versesContainer.innerHTML = ''; // Clear previous verses

    const arabicResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`);
    const arabicData = await arabicResponse.json();

    const banglaResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/bn.bengali`);
    const banglaData = await banglaResponse.json();

    // Display verses
    arabicData.data.ayahs.forEach((ayah, index) => {
        const verseDiv = document.createElement('div');
        verseDiv.classList.add('verse');
        verseDiv.innerHTML = `
            <p><strong>Verse ${index + 1}:</strong></p>
            <p>${ayah.text}</p>
            <p>${banglaData.data.ayahs[index].text}</p>
        `;
        versesContainer.appendChild(verseDiv);
    });

    surahContent.style.display = 'block';
}

// Load Surah List on page load and add event listener for dropdown change
loadSurahList();
surahSelect.addEventListener('change', (event) => {
    displaySurah(event.target.value);
});
