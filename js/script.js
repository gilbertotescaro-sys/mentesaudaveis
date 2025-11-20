// Dark mode toggle
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme on page load
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        htmlElement.setAttribute('data-theme', 'dark');
        if (themeToggle) {
            themeToggle.textContent = '☀️';
            themeToggle.setAttribute('aria-label', 'Ativar modo claro');
        }
    } else {
        document.body.classList.remove('dark-mode');
        htmlElement.setAttribute('data-theme', 'light');
        if (themeToggle) {
            themeToggle.textContent = '🌙';
            themeToggle.setAttribute('aria-label', 'Ativar modo escuro');
        }
    }
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDarkMode = document.body.classList.toggle('dark-mode');
            const newTheme = isDarkMode ? 'dark' : 'light';
            
            localStorage.setItem('theme', newTheme);
            htmlElement.setAttribute('data-theme', newTheme);
            
            // Update button icon and aria-label
            themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-label', isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro');
        });
    }

    // Search and filter treatments
    initTreatmentSearch();
});

// Treatment search functionality
let allTreatments = [];
let localServices = {};

function initTreatmentSearch() {
    const searchInput = document.getElementById('treatmentSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const resultsContainer = document.getElementById('treatmentResults');

    if (!searchInput || !resultsContainer) return; // Exit if not on treatments page

    // Load treatments data
    fetch('data/treatments.json')
        .then(response => response.json())
        .then(data => {
            allTreatments = data.treatments;
            localServices = data.localServices || {};
            
            // Display local services at the top
            if (Object.keys(localServices).length > 0) {
                displayLocalServices();
            }
            
            // Then display all treatments
            displayTreatments(allTreatments);
        })
        .catch(error => console.error('Erro ao carregar dados:', error));

    // Event listeners for search and filter
    if (searchInput) {
        searchInput.addEventListener('input', filterTreatments);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterTreatments);
    }
}

function displayLocalServices() {
    const resultsContainer = document.getElementById('treatmentResults');
    if (!resultsContainer || !localServices) return;

    let localServicesHTML = '<div class="local-services-section mb-5">';
    
    // Display emergency contacts
    if (localServices.emergency && localServices.emergency.contacts) {
        localServicesHTML += `
            <h3 class="mb-3">🚨 Contatos de Emergência 24h</h3>
            <div class="row mb-4">
                ${localServices.emergency.contacts.map(contact => `
                    <div class="col-md-6 mb-3">
                        <div class="card emergency-card border-danger border-2">
                            <div class="card-body">
                                <h5 class="card-title text-danger">📞 ${contact.name}</h5>
                                <p class="card-text"><strong>Telefone:</strong> <a href="tel:${contact.phone.replace(/[^\d]/g, '')}" class="text-decoration-none">${contact.phone}</a></p>
                                <p class="card-text small">${contact.description}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <hr class="my-4">
        `;
    }
    
    // Display local services by city
    Object.keys(localServices).forEach(key => {
        if (key !== 'emergency' && localServices[key].contacts) {
            const service = localServices[key];
            localServicesHTML += `
                <h4 class="mb-3">📍 Serviços em ${service.city}</h4>
                <div class="row mb-4">
                    ${service.contacts.map(contact => `
                        <div class="col-md-6 mb-3">
                            <div class="card service-card">
                                <div class="card-body">
                                    <h5 class="card-title">🏥 ${contact.name}</h5>
                                    <p class="card-text"><strong>Tipo:</strong> ${contact.type}</p>
                                    <p class="card-text"><strong>Telefone:</strong> <a href="tel:${contact.phone.replace(/[^\d]/g, '')}" class="text-decoration-none">${contact.phone}</a></p>
                                    <p class="card-text small">${contact.description}</p>
                                    ${contact.address ? `<p class="card-text small"><strong>Endereço:</strong> ${contact.address}</p>` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    });
    
    localServicesHTML += '</div><hr class="my-5">';
    resultsContainer.insertAdjacentHTML('beforeend', localServicesHTML);
}

function filterTreatments() {
    const searchInput = document.getElementById('treatmentSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedCategory = categoryFilter ? categoryFilter.value : '';

    const filtered = allTreatments.filter(treatment => {
        const matchesSearch = treatment.name.toLowerCase().includes(searchTerm) ||
                             treatment.description.toLowerCase().includes(searchTerm) ||
                             treatment.category.toLowerCase().includes(searchTerm);
        
        const matchesCategory = selectedCategory === '' || treatment.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    displayTreatments(filtered);
}

function displayTreatments(treatments) {
    const resultsContainer = document.getElementById('treatmentResults');
    if (!resultsContainer) return;

    if (treatments.length === 0) {
        resultsContainer.innerHTML = '<p class="text-center text-muted mt-4">Nenhum tratamento encontrado. Tente outros termos de busca.</p>';
        return;
    }

    resultsContainer.innerHTML = treatments.map(treatment => `
        <div class="card mb-3 treatment-card">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0">${treatment.name}</h5>
                <small class="badge bg-secondary">${treatment.category}</small>
            </div>
            <div class="card-body">
                <p class="card-text">${treatment.description}</p>
                <dl class="row">
                    <dt class="col-sm-3">Duração:</dt>
                    <dd class="col-sm-9">${treatment.duration}</dd>
                    <dt class="col-sm-3">Disponibilidade:</dt>
                    <dd class="col-sm-9">${treatment.availability}</dd>
                    <dt class="col-sm-3">Custo:</dt>
                    <dd class="col-sm-9">${treatment.cost}</dd>
                </dl>
            </div>
        </div>
    `).join('');
}
