document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.querySelectorAll('#current-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
    
    // Age group selection on home page
    const ageGroupItems = document.querySelectorAll('.age-group-item');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    
    if (ageGroupItems.length > 0) {
        ageGroupItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove selected class from all items
                ageGroupItems.forEach(i => i.classList.remove('selected'));
                
                // Add selected class to clicked item
                this.classList.add('selected');
                
                // Enable start quiz button
                startQuizBtn.disabled = false;
                
                // Store selected age group in localStorage
                localStorage.setItem('selectedAgeGroup', this.dataset.ageGroup);
                
                // Automatically navigate to quiz page when age group is selected
                window.location.href = 'quiz.html';
            });
        });
    }
});