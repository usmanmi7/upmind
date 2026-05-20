/* ============================================
   UPMIND - Professional Startup Consulting
   JavaScript - Animations & Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Navbar scroll effect ----------
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ---------- Mobile menu toggle ----------
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('svg use');
      if (mobileMenu.classList.contains('open')) {
        icon.setAttribute('href', '#icon-x');
      } else {
        icon.setAttribute('href', '#icon-menu');
      }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ---------- Scroll animations (Intersection Observer) ----------
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '-50px'
    });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ---------- How We Work carousel ----------
  const steps = [
    {
      number: '1/5',
      title: 'Initial Diagnosis',
      description: 'We start with a deep-dive assessment of your current business landscape, identifying key challenges and untapped opportunities to build a clear roadmap forward.'
    },
    {
      number: '2/5',
      title: 'Strategic Planning',
      description: 'Based on our diagnosis, we craft a tailored strategic plan that aligns with your vision and sets measurable milestones for growth and innovation.'
    },
    {
      number: '3/5',
      title: 'Implementation',
      description: 'We work alongside your team to execute the strategy, ensuring every initiative is implemented with precision and aligned with your core objectives.'
    },
    {
      number: '4/5',
      title: 'Optimization',
      description: 'Through continuous monitoring and data analysis, we refine and optimize strategies to maximize impact and adapt to evolving market conditions.'
    },
    {
      number: '5/5',
      title: 'Scale & Grow',
      description: 'With proven processes in place, we help you scale sustainably—expanding reach, deepening impact, and building long-term competitive advantage.'
    }
  ];

  let currentStep = 0;
  const stepNumber = document.querySelector('.howwework-step');
  const stepTitle = document.querySelector('.howwework-title');
  const stepDesc = document.querySelector('.howwework-desc');
  const stepDots = document.querySelectorAll('.step-dot');

  function updateStep() {
    if (!stepNumber) return;
    stepNumber.textContent = steps[currentStep].number;
    stepTitle.textContent = steps[currentStep].title;
    stepDesc.textContent = steps[currentStep].description;
    stepDots.forEach(function (dot, i) {
      if (i === currentStep) {
        dot.classList.add('active');
        dot.classList.remove('inactive');
      } else {
        dot.classList.remove('active');
        dot.classList.add('inactive');
      }
    });
  }

  const prevStepBtn = document.querySelector('.prev-step');
  const nextStepBtn = document.querySelector('.next-step');

  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', function () {
      currentStep = currentStep > 0 ? currentStep - 1 : steps.length - 1;
      updateStep();
    });
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', function () {
      currentStep = currentStep < steps.length - 1 ? currentStep + 1 : 0;
      updateStep();
    });
  }

  stepDots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      currentStep = i;
      updateStep();
    });
  });

  // ---------- Testimonials carousel ----------
  const testimonials = [
    {
      quote: 'They brought clarity to complex problems, breaking down barriers and delivering innovative solutions.',
      author: 'John Doe',
      role: 'CEO, Tech Innovations',
      image: 'images/testimonial1.jpg'
    },
    {
      quote: 'Working with Upmind transformed our approach to growth. Their strategic insights were invaluable.',
      author: 'Sarah Chen',
      role: 'COO, GrowthLabs',
      image: 'images/testimonial1.jpg'
    },
    {
      quote: 'The team delivered beyond expectations. Our product launch was smoother than we ever imagined.',
      author: 'Marcus Rivera',
      role: 'Founder, ScaleUp',
      image: 'images/testimonial1.jpg'
    }
  ];

  let currentTestimonial = 0;
  const testimonialText = document.querySelector('.testimonial-text');
  const testimonialName = document.querySelector('.testimonial-author-info .name');
  const testimonialRole = document.querySelector('.testimonial-author-info .role');
  const testimonialAvatar = document.querySelector('.testimonial-avatar img');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');

  function updateTestimonial() {
    if (!testimonialText) return;
    const t = testimonials[currentTestimonial];
    testimonialText.textContent = '\u201C' + t.quote + '\u201D';
    testimonialName.textContent = t.author;
    testimonialRole.textContent = t.role;
    testimonialAvatar.src = t.image;
    testimonialAvatar.alt = t.author;
    testimonialDots.forEach(function (dot, i) {
      if (i === currentTestimonial) {
        dot.classList.add('active');
        dot.classList.remove('inactive');
      } else {
        dot.classList.remove('active');
        dot.classList.add('inactive');
      }
    });
  }

  const prevTestBtn = document.querySelector('.prev-testimonial');
  const nextTestBtn = document.querySelector('.next-testimonial');

  if (prevTestBtn) {
    prevTestBtn.addEventListener('click', function () {
      currentTestimonial = currentTestimonial > 0 ? currentTestimonial - 1 : testimonials.length - 1;
      updateTestimonial();
    });
  }

  if (nextTestBtn) {
    nextTestBtn.addEventListener('click', function () {
      currentTestimonial = currentTestimonial < testimonials.length - 1 ? currentTestimonial + 1 : 0;
      updateTestimonial();
    });
  }

  testimonialDots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      currentTestimonial = i;
      updateTestimonial();
    });
  });

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = this.getAttribute('href');
      if (target && target !== '#') {
        e.preventDefault();
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

});
