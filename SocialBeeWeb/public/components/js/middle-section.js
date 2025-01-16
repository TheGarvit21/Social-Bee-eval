// DOM Elements
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const refreshFeedBtn = document.getElementById('refresh-feed');
const createPostBtn = document.getElementById('create-post-button');
const createPostModal = document.getElementById('create-post-modal');
const closeModalBtn = document.getElementById('close-modal');
const submitPostBtn = document.getElementById('submit-post');
const postContent = document.getElementById('post-content');
const postFeed = document.getElementById('post-feed');
const loadingIndicator = document.getElementById('loading-indicator');
const errorState = document.getElementById('error-state');
const retryButton = document.getElementById('retry-button');

// State Management
let currentViewMode = 'list'; // Default to 'list' view

// View Controls
function setViewMode(mode) {
    currentViewMode = mode;
    postFeed.className = `space-y-6 transition-all duration-300 ${mode === 'grid' ? 'grid grid-cols-2 gap-4' : ''}`;
    gridViewBtn.classList.toggle('bg-gray-100', mode === 'grid');
    listViewBtn.classList.toggle('bg-gray-100', mode === 'list');
}

gridViewBtn.addEventListener('click', () => setViewMode('grid'));
listViewBtn.addEventListener('click', () => setViewMode('list'));

// Utility Function to Create Story Element
function createStoryElement(story) {
    const storyElement = document.createElement('div');
    storyElement.className = 'flex flex-col items-center space-y-1 min-w-[72px]';
    storyElement.innerHTML = `
        <div class="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[2px] cursor-pointer">
            <div class="w-full h-full rounded-full border-2 border-white overflow-hidden">
                <img src="${story.avatar}" alt="${story.username}" class="w-full h-full object-cover">
            </div>
        </div>
        <span class="text-xs text-gray-600 dark:text-gray-400">${story.username}</span>
    `;
    return storyElement;
}

// Modal Management
function toggleModal(show = true) {
    createPostModal.classList.toggle('hidden', !show);
    if (show) {
        postContent.focus();
    } else {
        postContent.value = '';
    }
}

createPostBtn.addEventListener('click', () => toggleModal(true));
closeModalBtn.addEventListener('click', () => toggleModal(false));

// Close modal on outside click
createPostModal.addEventListener('click', (e) => {
    if (e.target === createPostModal) {
        toggleModal(false);
    }
});

// Post Creation
submitPostBtn.addEventListener('click', () => {
    const content = postContent.value.trim();
    if (content) {
        const newPost = {
            id: new Date().getTime().toString(), // Unique ID
            content: content,
            date: new Date().toISOString(),
        };

        // Retrieve existing posts from localStorage
        let posts = JSON.parse(localStorage.getItem('posts')) || [];

        // Add the new post to the array
        posts.push(newPost);

        // Save updated posts array back to localStorage
        localStorage.setItem('posts', JSON.stringify(posts));

        // Close modal and reset fields
        toggleModal(false);

        console.log('Post created:', newPost);
    } else {
        alert('Please write something!');
    }
});

// Error Handling
function showError(show = true) {
    errorState.classList.toggle('hidden', !show);
    postFeed.classList.toggle('hidden', show);
}

retryButton.addEventListener('click', () => {
    showError(false);
    // Implement retry logic here
});

// Loading State
function toggleLoading(show = true) {
    loadingIndicator.classList.toggle('hidden', !show);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setViewMode('list'); // Ensures the page loads in list view by default

    const sampleStories = [
        { username: 'user1', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
        { username: 'user2', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
        { username: 'user3', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150' }
    ];

    const storiesContainer = document.querySelector('.stories-container .flex');
    sampleStories.forEach(story => {
        storiesContainer.appendChild(createStoryElement(story));
    });
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !createPostModal.classList.contains('hidden')) {
        toggleModal(false);
    }
});

// Media Upload (Image & Video)
const handleMediaUpload = (mediaType) => {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = mediaType === 'image' ? 'image/*' : 'video/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });
};

// Story Feature
const initializeStories = () => {
    const addStoryBtn = document.querySelector('.stories-container .bg-blue-500');
    addStoryBtn?.addEventListener('click', async () => {
        try {
            const imageData = await handleMediaUpload('image');
            if (!imageData) return;

            const storyElement = createStoryElement({ username: 'Your story', avatar: imageData });
            const storiesContainer = document.querySelector('.stories-container .flex');
            const addStoryButton = storiesContainer.firstElementChild;
            storiesContainer.insertBefore(storyElement, addStoryButton.nextSibling);
        } catch (error) {
            console.error('Error creating story:', error);
        }
    });
};

// Feelings/Activities Feature
const initializeFeelings = () => {
    const feelings = [
        '😊 Happy', '😢 Sad', '😎 Cool', '😍 In love',
        '😴 Tired', '🤔 Thinking', '😋 Hungry', '😌 Relaxed'
    ];

    const activities = [
        '📚 Reading', '🎮 Gaming', '🎵 Listening to music',
        '🏃‍♂️ Running', '✈️ Traveling', '🍳 Cooking'
    ];

    const createFeelingsMenu = () => {
        const menu = document.createElement('div');
        menu.className = 'absolute bottom-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-64';
        menu.innerHTML = `
            <div class="grid grid-cols-2 gap-2">
                ${[...feelings, ...activities].map(item => ` 
                    <button class="text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        ${item}
                    </button>
                `).join('')}
            </div>
        `;
        return menu;
    };

    const feelingBtns = document.querySelectorAll('button:has(svg path[d*="M14.828 14.828"])');
    feelingBtns.forEach(btn => {
        let menu = null;

        btn.addEventListener('click', () => {
            if (menu?.isConnected) {
                menu.remove();
                return;
            }

            menu = createFeelingsMenu();
            btn.parentElement.appendChild(menu);

            menu.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    const feeling = e.target.textContent.trim();
                    const postContent = document.getElementById('post-content');
                    if (postContent) {
                        postContent.value += `\nFeeling ${feeling}`;
                        menu.remove();
                    }
                }
            });
        });
    });
};

// Bookmark Feature
function addBookmarkButton(postElement, post) {
    const actionDiv = postElement.querySelector('.mt-4.flex.justify-between');
    const bookmarkButton = document.createElement('button');
    bookmarkButton.classList.add('bookmark-btn');

    const isBookmarked = checkIfBookmarked(post.id);
    updateBookmarkButton(bookmarkButton, isBookmarked);

    bookmarkButton.addEventListener('click', () => toggleBookmark(post, bookmarkButton));
    actionDiv.appendChild(bookmarkButton);
}

function updateBookmarkButton(button, isBookmarked) {
    button.innerHTML = isBookmarked ?
        '<svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>' :
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>';
}

function checkIfBookmarked(postId) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    return bookmarks.some(bookmark => bookmark.id === postId);
}

function toggleBookmark(post, bookmarkButton) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const isBookmarked = checkIfBookmarked(post.id);

    if (isBookmarked) {
        bookmarks = bookmarks.filter(bookmark => bookmark.id !== post.id);
    } else {
        const bookmarkData = {
            ...post,
            bookmarkedAt: new Date().toISOString(),
            comments: [],
            isLiked: false
        };
        bookmarks.push(bookmarkData);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    updateBookmarkButton(bookmarkButton, !isBookmarked);
}

// Media Buttons Feature
const initializeMediaButtons = () => {
    const mediaButtons = document.querySelectorAll('button:has(svg path[d*="M4 16l4.586-4.586"])');

    mediaButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                const mediaData = await handleMediaUpload('image');
                if (!mediaData) return;

                const postContent = document.getElementById('post-content');
                if (postContent) {
                    const preview = document.createElement('div');
                    preview.className = 'mt-4';
                    preview.innerHTML = `
                        <img src="${mediaData}" alt="Preview" class="max-h-48 rounded-lg">
                    `;
                    postContent.parentElement.insertBefore(preview, postContent.nextSibling);
                }
            } catch (error) {
                console.error('Error handling media:', error);
            }
        });
    });
};

// Initialize Features
initializeStories();
initializeFeelings();
initializeMediaButtons();