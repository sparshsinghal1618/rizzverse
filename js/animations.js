// RIZZVERSE Animations
document.addEventListener('DOMContentLoaded', function() {
    // Trigger animations on load
    setTimeout(() => {
        const fadeUpElements = document.querySelectorAll('.fade-up');
        fadeUpElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animationPlayState = 'running';
            }, index * 100);
        });
        
        const fadeInElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');
        fadeInElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animationPlayState = 'running';
            }, index * 100);
        });
    }, 100);
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .demo-step');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('demo-step') 
                ? 'translateX(8px)' 
                : 'scale(1.02) translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0) translateX(0)';
        });
    });
    
    // Parallax effect for hero orbs
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-orb');
        parallaxElements.forEach((el, index) => {
            const speed = 0.5 + (index * 0.2);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
});
