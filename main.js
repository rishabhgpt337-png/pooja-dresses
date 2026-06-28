document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // BULK ORDER MODAL LOGIC
  // ==========================================================================
  
  const modal = document.getElementById('bulk-modal');
  const openModalButtons = document.querySelectorAll('.open-bulk-modal');
  const closeModalButton = document.getElementById('close-modal-btn');
  const form = document.getElementById('bulk-order-form');
  const occasionChips = document.getElementById('occasion-chips');
  const occasionInput = document.getElementById('form-occasion');
  
  // Open modal
  openModalButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
      
      // Auto-set the needed-by date min attribute to today
      const dateInput = document.getElementById('form-date');
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
      }
    });
  });
  
  // Close modal function
  const closeModal = () => {
    if (modal) {
      modal.classList.remove('open');
    }
    document.body.style.overflow = ''; // Re-enable background scrolling
  };
  
  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
  }
  
  // Close modal when clicking outside the container
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Esc key to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });
  
  // Occasion Chips Selection
  if (occasionChips) {
    const chips = occasionChips.querySelectorAll('.chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        // Remove active class from all chips
        chips.forEach(c => c.classList.remove('active'));
        // Add active class to clicked chip
        chip.classList.add('active');
        // Update hidden input value
        occasionInput.value = chip.getAttribute('data-value');
      });
    });
  }
  
  // Form Submission -> WhatsApp Link Generation
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const occasion = occasionInput.value;
      const quantity = document.getElementById('form-quantity').value;
      const budget = document.getElementById('form-budget').value.trim();
      const date = document.getElementById('form-date').value;
      const notes = document.getElementById('form-notes').value.trim();
      
      // Format the Date to a more readable format (DD/MM/YYYY)
      let formattedDate = date;
      if (date) {
        const [year, month, day] = date.split('-');
        formattedDate = `${day}/${month}/${year}`;
      }

      // Build text message
      let message = `*NEW POOJA DRESSES - BULK/FAMILY ORDER ENQUIRY*\n`;
      message += `-----------------------------------------\n`;
      message += `👤 *Name:* ${name}\n`;
      message += `📞 *Phone:* ${phone}\n`;
      message += `🎉 *Occasion:* ${occasion}\n`;
      message += `📦 *Quantity:* ${quantity} pieces\n`;
      message += `💰 *Budget per piece:* ${budget}\n`;
      message += `📅 *Needed By Date:* ${formattedDate}\n`;
      
      if (notes) {
        message += `\n📝 *Additional Notes & Sizes:*\n${notes}\n`;
      }
      message += `-----------------------------------------\n`;
      message += `_Sent via website form._`;
      
      // Encode message for URL
      const encodedMessage = encodeURIComponent(message);
      
      // WhatsApp Number (09768394550 mapped to 919768394550)
      const waNumber = '919768394550';
      const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
      
      // Open in a new tab
      window.open(waUrl, '_blank');
      
      // Close modal
      closeModal();
      
      // Reset form
      form.reset();
      
      // Reset chips back to Wedding (default)
      if (occasionChips) {
        const chips = occasionChips.querySelectorAll('.chip');
        chips.forEach(c => c.classList.remove('active'));
        chips[0].classList.add('active');
        occasionInput.value = 'Wedding';
      }
    });
  }
  
  // ==========================================================================
  // SCROLL-TRIGGERED FADE-UP INTERSECTION OBSERVER
  // ==========================================================================
  
  const fadeUpElements = document.querySelectorAll('.fade-up');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.05 // Trigger when 5% of the element is visible
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, observerOptions);
    
    fadeUpElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    fadeUpElements.forEach(element => {
      element.classList.add('in-view');
    });
  }
  
  // ==========================================================================
  // MOBILE TOUCH HANDLING FOR CATEGORY GRID
  // ==========================================================================
  
  const collectionCards = document.querySelectorAll('.collection-card');
  
  collectionCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Check if click was on the WhatsApp link itself
      if (e.target.closest('.card-cta')) {
        return; // Allow the click to proceed
      }
      
      // On mobile / touch devices, toggle card reveal
      const isMobile = window.innerWidth <= 900;
      if (isMobile) {
        e.preventDefault();
        
        const wasActive = this.classList.contains('active-tap');
        
        // Remove active class from all cards
        collectionCards.forEach(c => c.classList.remove('active-tap'));
        
        // Toggle current card
        if (!wasActive) {
          this.classList.add('active-tap');
        }
      }
    });
  });
  
  // Close active card on clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.collection-card')) {
      collectionCards.forEach(c => c.classList.remove('active-tap'));
    }
  });
});
