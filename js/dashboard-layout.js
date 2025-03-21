/**
 * Dashboard Layout Management
 * Implements draggable and resizable card functionality for a bento box layout
 */

// Initialize dashboard layout when document is ready
$(document).ready(function() {
    console.log('Document ready, initializing draggable cards...');
    setTimeout(initializeDraggableCards, 1000); // Delay initialization to ensure map and other components are loaded
});

/**
 * Initialize the draggable cards functionality
 */
function initializeDraggableCards() {
    // Check if the required libraries are loaded
    if (typeof $ === 'undefined') {
        console.error('jQuery is not available!');
        implementSimpleDraggable();
        return;
    }
    
    // Check if jQuery UI is loaded
    if (!$.fn.draggable || !$.ui) {
        console.warn('jQuery UI is required for draggable cards. Loading a simplified version.');
        implementSimpleDraggable();
        return;
    }
    
    console.log('jQuery and jQuery UI are available, initializing draggable functionality');

    // Make cards draggable using jQuery UI
    $('.card').draggable({
        containment: '.dashboard-grid',
        handle: 'h3',
        stack: '.card',
        revert: 'invalid',
        start: function(event, ui) {
            $(this).addClass('dragging');
        },
        stop: function(event, ui) {
            $(this).removeClass('dragging');
        }
    });

    // Make the dashboard grid a dropzone
    $('.dashboard-grid').droppable({
        accept: '.card',
        drop: function(event, ui) {
            const cardElement = ui.draggable[0];
            const grid = document.querySelector('.dashboard-grid');
            
            // Get the position in the grid
            const gridRect = grid.getBoundingClientRect();
            const cardRect = cardElement.getBoundingClientRect();
            
            // Calculate which cell in the grid the card was dropped on
            const gridComputedStyle = window.getComputedStyle(grid);
            const gridColumnGap = parseInt(gridComputedStyle.columnGap, 10);
            const cellWidth = (gridRect.width - (11 * gridColumnGap)) / 12;
            
            const column = Math.floor((cardRect.left - gridRect.left) / (cellWidth + gridColumnGap)) + 1;
            
            // Snap to grid column
            const newColumnSpan = getCardColumnSpan(cardElement);
            cardElement.style.gridColumn = `${column} / span ${newColumnSpan}`;
            
            // Reset the inline styles set by jQuery UI draggable
            cardElement.style.top = '';
            cardElement.style.left = '';
            cardElement.style.position = '';
            
            // Save the dashboard layout
            saveDashboardLayout();
        }
    });

    // Add simple resize handle to cards
    $('.card').each(function() {
        const card = $(this);
        
        // Remove any existing resize handles
        card.find('.resize-handle').remove();
        
        // Add a single resize handle to the bottom-right corner
        card.append('<div class="resize-handle"></div>');
        
        // Add resize event handling
        card.find('.resize-handle').on('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = card.width();
            const startHeight = card.height();
            
            card.addClass('resizing');
            
            // Resize the card on mouse move
            $(document).on('mousemove.resize', function(e) {
                const newWidth = startWidth + (e.clientX - startX);
                const newHeight = startHeight + (e.clientY - startY);
                
                // Enforce minimum dimensions
                const width = Math.max(300, newWidth);
                const height = Math.max(200, newHeight);
                
                // Update card dimensions
                card.css({
                    width: width + 'px',
                    height: height + 'px'
                });
            });
            
            // Stop resizing on mouse up
            $(document).on('mouseup.resize', function() {
                $(document).off('mousemove.resize mouseup.resize');
                card.removeClass('resizing');
                saveDashboardLayout();
                
                // Trigger window resize to update any internal charts
                $(window).trigger('resize');
            });
        });
    });

    // Load saved layout if available
    loadDashboardLayout();
}

/**
 * Implement a simplified version of draggable cards using vanilla JS
 */
function implementSimpleDraggable() {
    const cards = document.querySelectorAll('.card');
    const dashboardGrid = document.querySelector('.dashboard-grid');
    
    cards.forEach(card => {
        const cardHeader = card.querySelector('h3');
        if (!cardHeader) return;
        
        cardHeader.style.cursor = 'move';
        
        let isDragging = false;
        let startX, startY;
        let startLeft, startTop;
        
        cardHeader.addEventListener('mousedown', function(e) {
            isDragging = true;
            card.classList.add('dragging');
            
            startX = e.clientX;
            startY = e.clientY;
            startLeft = card.offsetLeft;
            startTop = card.offsetTop;
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        
        function onMouseMove(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            card.style.position = 'absolute';
            card.style.left = `${startLeft + deltaX}px`;
            card.style.top = `${startTop + deltaY}px`;
            card.style.zIndex = '1000';
        }
        
        function onMouseUp(e) {
            isDragging = false;
            card.classList.remove('dragging');
            
            // Find the closest grid cell to snap to
            const gridRect = dashboardGrid.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            
            // Reset position and snap to closest cell
            card.style.position = '';
            card.style.left = '';
            card.style.top = '';
            card.style.zIndex = '';
            
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    });
}

/**
 * Get the column span of a card
 */
function getCardColumnSpan(cardElement) {
    // Default span for cards
    if (cardElement.classList.contains('wide')) {
        return 8;
    } else if (cardElement.classList.contains('summary-stats')) {
        return 4;
    }
    return 4; // Default column span
}

/**
 * Save the current dashboard layout
 */
function saveDashboardLayout() {
    const layout = {};
    document.querySelectorAll('.card').forEach((card, index) => {
        const id = card.id || `card-${index}`;
        layout[id] = {
            width: card.style.width,
            height: card.style.height,
            position: card.style.position,
            top: card.style.top,
            left: card.style.left
        };
    });
    
    localStorage.setItem('dashboardLayout', JSON.stringify(layout));
}

/**
 * Load a saved dashboard layout
 */
function loadDashboardLayout() {
    const savedLayout = localStorage.getItem('dashboardLayout');
    if (!savedLayout) return;
    
    try {
        const layout = JSON.parse(savedLayout);
        document.querySelectorAll('.card').forEach((card, index) => {
            const id = card.id || `card-${index}`;
            if (layout[id]) {
                // Apply saved dimensions
                if (layout[id].width) card.style.width = layout[id].width;
                if (layout[id].height) card.style.height = layout[id].height;
                if (layout[id].position) card.style.position = layout[id].position;
                if (layout[id].top) card.style.top = layout[id].top;
                if (layout[id].left) card.style.left = layout[id].left;
                
                // Add resize handle if it doesn't exist
                if (card.querySelectorAll('.resize-handle').length === 0) {
                    card.innerHTML += '<div class="resize-handle"></div>';
                }
            }
        });
    } catch (e) {
        console.error('Error loading dashboard layout:', e);
    }
}

/**
 * Reset the dashboard layout to default
 */
function resetDashboardLayout() {
    document.querySelectorAll('.card').forEach(card => {
        // Clear all custom positioning and dimensions
        card.style.position = '';
        card.style.top = '';
        card.style.left = '';
        card.style.width = '';
        card.style.height = '';
    });
    
    localStorage.removeItem('dashboardLayout');
    console.log('Dashboard layout reset to default');
}
