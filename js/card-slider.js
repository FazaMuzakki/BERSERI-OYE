document.addEventListener('DOMContentLoaded', function() {
    const scrollContainer = document.querySelector('#tentang .flex.gap-6');
    const dots = document.querySelectorAll('#cardIndicators button');
    
    if (scrollContainer && dots.length) {
        // Update dots when scrolling
        const updateDots = () => {
            const containerWidth = scrollContainer.clientWidth;
            const scrollPosition = scrollContainer.scrollLeft;
            const cardIndex = Math.round(scrollPosition / containerWidth);
            
            dots.forEach((dot, index) => {
                const isActive = index === cardIndex;
                dot.setAttribute('aria-current', isActive ? 'true' : 'false');
                dot.className = `w-3 h-3 rounded-full transition-all ${isActive ? 'bg-emerald-500 scale-75' : 'bg-gray-300'}`;
            });
        };

        // Listen for scroll events
        scrollContainer.addEventListener('scroll', updateDots);
        
        // Handle dot clicks
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const containerWidth = scrollContainer.clientWidth;
                scrollContainer.scrollTo({
                    left: containerWidth * index,
                    behavior: 'smooth'
                });
            });
        });

        // Update dots on resize
        window.addEventListener('resize', updateDots);

        // Initial update
        updateDots();
    }
});