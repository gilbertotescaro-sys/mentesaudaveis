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
});
