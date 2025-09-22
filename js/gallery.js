/**
 * Rongai Agroforestry Community Project
 * Gallery JavaScript
 * Handles image gallery filtering, lightbox, and interactions
 */

(function() {
    'use strict';

    // Gallery State
    const galleryState = {
        currentImageIndex: 0,
        filteredImages: [],
        isLightboxOpen: false,
        currentFilter: 'all'
    };

    // Gallery Data (in a real application, this would come from a CMS or API)
    const galleryData = [
        {
            id: 1,
            src: 'images/gallery/tree-planting-1.jpg',
            title: 'Community Tree Planting Day',
            description: 'Local farmers and volunteers planting 200 indigenous trees in Rongai community.',
            category: 'tree-planting',
            date: '2024-01-15',
            location: 'Rongai Central Farm',
            tags: ['community', 'volunteers', 'indigenous-trees']
        },
        {
            id: 2,
            src: 'images/gallery/tree-planting-2.jpg',
            title: 'Tree Nursery',
            description: 'Our community tree nursery with over 1,000 seedlings ready for distribution.',
            category: 'tree-planting',
            date: '2024-01-20',
            location: 'Rongai Tree Nursery',
            tags: ['nursery', 'seedlings', 'sustainability']
        },
        {
            id: 3,
            src: 'images/gallery/training-1.jpg',
            title: 'Agroforestry Training Session',
            description: 'Farmers learning modern sustainable farming techniques and agroforestry systems.',
            category: 'training',
            date: '2024-02-01',
            location: 'Rongai Training Center',
            tags: ['training', 'education', 'farmers']
        },
        {
            id: 4,
            src: 'images/gallery/training-2.jpg',
            title: 'Soil Conservation Workshop',
            description: 'Hands-on training in soil testing and conservation methods for local farmers.',
            category: 'training',
            date: '2024-02-10',
            location: 'Rongai Community Hall',
            tags: ['soil-conservation', 'workshop', 'hands-on']
        },
        {
            id: 5,
            src: 'images/gallery/community-1.jpg',
            title: 'Women\'s Group Meeting',
            description: 'Empowering women farmers through collective action and knowledge sharing.',
            category: 'community',
            date: '2024-02-15',
            location: 'Rongai Women\'s Center',
            tags: ['women-empowerment', 'group-meeting', 'collective-action']
        },
        {
            id: 6,
            src: 'images/gallery/community-2.jpg',
            title: 'Youth Volunteers',
            description: 'Young people actively participating in community development initiatives.',
            category: 'community',
            date: '2024-02-20',
            location: 'Rongai Youth Center',
            tags: ['youth', 'volunteers', 'community-development']
        },
        {
            id: 7,
            src: 'images/gallery/conservation-1.jpg',
            title: 'Land Restoration Project',
            description: 'Transforming degraded land into productive agroforestry systems.',
            category: 'conservation',
            date: '2024-03-01',
            location: 'Rongai North Farm',
            tags: ['land-restoration', 'agroforestry', 'sustainability']
        },
        {
            id: 8,
            src: 'images/gallery/conservation-2.jpg',
            title: 'Water Conservation System',
            description: 'Rainwater harvesting systems for sustainable water management.',
            category: 'conservation',
            date: '2024-03-05',
            location: 'Rongai South Farm',
            tags: ['water-conservation', 'rainwater-harvesting', 'sustainability']
        },
        {
            id: 9,
            src: 'images/gallery/success-1.jpg',
            title: 'Success Story: Mama Jane\'s Farm',
            description: 'From degraded land to thriving agroforestry system - a remarkable transformation.',
            category: 'success',
            date: '2024-03-10',
            location: 'Mama Jane\'s Farm, Rongai',
            tags: ['success-story', 'transformation', 'agroforestry']
        },
        {
            id: 10,
            src: 'images/gallery/success-2.jpg',
            title: 'Record Harvest Celebration',
            description: 'Farmers celebrating their best harvest yet through sustainable practices.',
            category: 'success',
            date: '2024-03-15',
            location: 'Rongai Community Farm',
            tags: ['harvest', 'celebration', 'sustainable-practices']
        },
        {
            id: 11,
            src: 'images/gallery/success-3.jpg',
            title: 'Training Program Graduation',
            description: 'Farmers receiving certificates after completing our comprehensive training program.',
            category: 'success',
            date: '2024-03-20',
            location: 'Rongai Training Center',
            tags: ['graduation', 'certificates', 'training-program']
        },
        {
            id: 12,
            src: 'images/gallery/success-4.jpg',
            title: 'Diverse Cropping System',
            description: 'Healthy integration of crops, trees, and livestock in a sustainable farming system.',
            category: 'success',
            date: '2024-03-25',
            location: 'Rongai Model Farm',
            tags: ['diverse-cropping', 'integration', 'sustainable-farming']
        }
    ];

    // DOM Elements
    const elements = {
        filterButtons: document.querySelectorAll('.filter-btn'),
        galleryGrid: document.querySelector('.gallery-grid'),
        lightbox: document.getElementById('lightbox'),
        lightboxImage: document.getElementById('lightbox-image'),
        lightboxCaption: document.getElementById('lightbox-caption'),
        lightboxClose: document.getElementById('lightbox-close'),
        lightboxPrev: document.getElementById('lightbox-prev'),
        lightboxNext: document.getElementById('lightbox-next'),
        galleryItems: document.querySelectorAll('.gallery-item')
    };

    // Gallery Functions
    const gallery = {
        init: () => {
            gallery.setupFiltering();
            gallery.setupLightbox();
            gallery.setupKeyboardNavigation();
            gallery.setupTouchGestures();
            gallery.setupLazyLoading();
        },

        setupFiltering: () => {
            elements.filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.dataset.filter;
                    gallery.filterImages(filter);
                });
            });
        },

        filterImages: (filter) => {
            galleryState.currentFilter = filter;
            galleryState.filteredImages = galleryData.filter(image => {
                return filter === 'all' || image.category === filter;
            });

            // Update active button
            elements.filterButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

            // Animate gallery items
            gallery.animateGalleryItems();
        },

        animateGalleryItems: () => {
            if (!elements.galleryGrid) return;

            // Add stagger animation
            galleryState.filteredImages.forEach((image, index) => {
                setTimeout(() => {
                    const galleryItem = elements.galleryGrid.querySelector(`[data-id="${image.id}"]`);
                    if (galleryItem) {
                        galleryItem.style.opacity = '1';
                        galleryItem.style.transform = 'scale(1)';
                    }
                }, index * 100);
            });
        },

        setupLightbox: () => {
            // Open lightbox
            elements.galleryItems.forEach((item, index) => {
                const button = item.querySelector('.gallery-btn');
                if (button) {
                    button.addEventListener('click', (e) => {
                        e.stopPropagation();
                        gallery.openLightbox(index);
                    });
                }

                // Click on image to open lightbox
                item.addEventListener('click', () => {
                    gallery.openLightbox(index);
                });
            });

            // Close lightbox
            if (elements.lightboxClose) {
                elements.lightboxClose.addEventListener('click', gallery.closeLightbox);
            }

            // Navigation buttons
            if (elements.lightboxPrev) {
                elements.lightboxPrev.addEventListener('click', gallery.previousImage);
            }

            if (elements.lightboxNext) {
                elements.lightboxNext.addEventListener('click', gallery.nextImage);
            }

            // Click outside to close
            if (elements.lightbox) {
                elements.lightbox.addEventListener('click', (e) => {
                    if (e.target === elements.lightbox) {
                        gallery.closeLightbox();
                    }
                });
            }
        },

        openLightbox: (index) => {
            const image = galleryState.filteredImages[index] || galleryData[index];
            if (!image) return;

            galleryState.currentImageIndex = galleryData.findIndex(img => img.id === image.id);
            galleryState.isLightboxOpen = true;

            gallery.updateLightboxContent(image);
            gallery.showLightbox();

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        },

        updateLightboxContent: (image) => {
            if (elements.lightboxImage) {
                elements.lightboxImage.src = image.src;
                elements.lightboxImage.alt = image.title;
            }

            if (elements.lightboxCaption) {
                elements.lightboxCaption.innerHTML = `
                    <h3>${image.title}</h3>
                    <p>${image.description}</p>
                    <div class="lightbox-meta">
                        <span><i class="fas fa-calendar"></i> ${gallery.formatDate(image.date)}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${image.location}</span>
                        <span><i class="fas fa-tag"></i> ${image.tags.join(', ')}</span>
                    </div>
                `;
            }
        },

        showLightbox: () => {
            if (elements.lightbox) {
                elements.lightbox.style.display = 'flex';
                setTimeout(() => {
                    elements.lightbox.classList.add('active');
                }, 10);
            }
        },

        closeLightbox: () => {
            galleryState.isLightboxOpen = false;

            if (elements.lightbox) {
                elements.lightbox.classList.remove('active');
                setTimeout(() => {
                    elements.lightbox.style.display = 'none';
                }, 300);
            }

            // Restore body scroll
            document.body.style.overflow = '';
        },

        previousImage: () => {
            const currentIndex = galleryState.currentImageIndex;
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : galleryData.length - 1;
            gallery.openLightbox(prevIndex);
        },

        nextImage: () => {
            const currentIndex = galleryState.currentImageIndex;
            const nextIndex = currentIndex < galleryData.length - 1 ? currentIndex + 1 : 0;
            gallery.openLightbox(nextIndex);
        },

        setupKeyboardNavigation: () => {
            document.addEventListener('keydown', (e) => {
                if (!galleryState.isLightboxOpen) return;

                switch (e.key) {
                    case 'Escape':
                        gallery.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        gallery.previousImage();
                        break;
                    case 'ArrowRight':
                        gallery.nextImage();
                        break;
                }
            });
        },

        setupTouchGestures: () => {
            let startX = 0;
            let startY = 0;
            let endX = 0;
            let endY = 0;

            if (elements.lightbox) {
                elements.lightbox.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                });

                elements.lightbox.addEventListener('touchend', (e) => {
                    endX = e.changedTouches[0].clientX;
                    endY = e.changedTouches[0].clientY;

                    const deltaX = endX - startX;
                    const deltaY = endY - startY;

                    // Check if it's a swipe (not just a tap)
                    if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
                        if (Math.abs(deltaX) > Math.abs(deltaY)) {
                            // Horizontal swipe
                            if (deltaX > 0) {
                                gallery.previousImage();
                            } else {
                                gallery.nextImage();
                            }
                        }
                    }
                });
            }
        },

        setupLazyLoading: () => {
            const images = document.querySelectorAll('.gallery-image img');

            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            images.forEach(img => imageObserver.observe(img));
        },

        formatDate: (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    // Image Slideshow Functions
    const slideshow = {
        init: () => {
            slideshow.setupAutoPlay();
            slideshow.setupSlideshowControls();
        },

        setupAutoPlay: () => {
            // Auto-advance slideshow every 5 seconds
            setInterval(() => {
                if (galleryState.isLightboxOpen) {
                    gallery.nextImage();
                }
            }, 5000);
        },

        setupSlideshowControls: () => {
            // Add play/pause functionality
            const slideshowControls = document.createElement('div');
            slideshowControls.className = 'slideshow-controls';
            slideshowControls.innerHTML = `
                <button id="slideshow-play" class="slideshow-btn" title="Play slideshow">
                    <i class="fas fa-play"></i>
                </button>
                <button id="slideshow-pause" class="slideshow-btn" title="Pause slideshow" style="display: none;">
                    <i class="fas fa-pause"></i>
                </button>
            `;

            if (elements.lightbox) {
                elements.lightbox.querySelector('.lightbox-content').appendChild(slideshowControls);
            }

            // Slideshow control events
            const playBtn = document.getElementById('slideshow-play');
            const pauseBtn = document.getElementById('slideshow-pause');

            if (playBtn) {
                playBtn.addEventListener('click', slideshow.startSlideshow);
            }

            if (pauseBtn) {
                pauseBtn.addEventListener('click', slideshow.pauseSlideshow);
            }
        },

        startSlideshow: () => {
            slideshow.isPlaying = true;
            const playBtn = document.getElementById('slideshow-play');
            const pauseBtn = document.getElementById('slideshow-pause');

            if (playBtn) playBtn.style.display = 'none';
            if (pauseBtn) pauseBtn.style.display = 'block';
        },

        pauseSlideshow: () => {
            slideshow.isPlaying = false;
            const playBtn = document.getElementById('slideshow-play');
            const pauseBtn = document.getElementById('slideshow-pause');

            if (playBtn) playBtn.style.display = 'block';
            if (pauseBtn) pauseBtn.style.display = 'none';
        }
    };

    // Search and Sort Functions
    const search = {
        init: () => {
            search.setupSearchInput();
            search.setupSortControls();
        },

        setupSearchInput: () => {
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search gallery...';
            searchInput.className = 'gallery-search';
            searchInput.style.cssText = `
                width: 100%;
                padding: 10px 15px;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 1rem;
                margin-bottom: 2rem;
            `;

            const gallerySection = document.querySelector('.gallery');
            if (gallerySection) {
                gallerySection.insertBefore(searchInput, elements.galleryGrid);
            }

            searchInput.addEventListener('input', (e) => {
                search.performSearch(e.target.value);
            });
        },

        performSearch: (query) => {
            const filtered = galleryData.filter(image => {
                const searchTerm = query.toLowerCase();
                return image.title.toLowerCase().includes(searchTerm) ||
                       image.description.toLowerCase().includes(searchTerm) ||
                       image.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            });

            gallery.renderImages(filtered);
        },

        setupSortControls: () => {
            const sortSelect = document.createElement('select');
            sortSelect.className = 'gallery-sort';
            sortSelect.innerHTML = `
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
            `;

            const filterSection = document.querySelector('.gallery-filter .container');
            if (filterSection) {
                filterSection.appendChild(sortSelect);
            }

            sortSelect.addEventListener('change', (e) => {
                search.sortImages(e.target.value);
            });
        },

        sortImages: (sortBy) => {
            let sorted = [...galleryData];

            switch (sortBy) {
                case 'date-desc':
                    sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
                    break;
                case 'date-asc':
                    sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
                    break;
                case 'title-asc':
                    sorted.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'title-desc':
                    sorted.sort((a, b) => b.title.localeCompare(a.title));
                    break;
            }

            gallery.renderImages(sorted);
        }
    };

    // Initialize gallery when DOM is loaded
    const initGallery = () => {
        if (document.querySelector('.gallery')) {
            gallery.init();
            slideshow.init();
            search.init();

            // Initialize with all images
            gallery.filterImages('all');

            console.log('🌿 Gallery initialized successfully!');
        }
    };

    // Initialize on DOM load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }

    // Export for potential use in other scripts
    window.Gallery = {
        gallery,
        slideshow,
        search,
        galleryState,
        galleryData
    };

})();
