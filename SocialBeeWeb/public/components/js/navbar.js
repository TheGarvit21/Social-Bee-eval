// Toggle the hamburger menu
document.getElementById('menu-btn').addEventListener('click', function () {
    this.classList.toggle('open');
    document.getElementById('mobile-menu').classList.toggle('open');
});

const adsData = [
    // {
    //     image: "https://via.placeholder.com/728x90.png?text=Buy+New+Fitness+Gear+Today",
    //     link: "https://www.amazon.in/l/3403635031",
    //     text: "Buy New Fitness Gear Today!"
    // },
    // {
    //     image: "https://via.placeholder.com/728x90.png?text=Exclusive+Offer+on+Memberships",
    //     link: "https://www.timesprime.com/",
    //     text: "Exclusive Offer on Memberships!"
    // }
];

function renderAds() {
    const adsSection = document.getElementById("ads-section");

    if (!adsSection) {
        console.error("Ad section not found!");
        return;
    }

    adsSection.innerHTML = '';

    adsData.forEach(ad => {
        const adElement = document.createElement("div");
        adElement.classList.add("ad-item", "mb-4");

        adElement.innerHTML = `
                    <a href="${ad.link}" target="_blank" class="block text-center bg-gray-200 dark:bg-gray-600 p-3 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                        <img src="${ad.image}" alt="${ad.text}" class="w-full h-auto rounded-lg mb-3" />
                        <p class="text-gray-700 dark:text-gray-300">${ad.text}</p>
                    </a>
                `;

        adsSection.appendChild(adElement);
    });
}

window.onload = function () {
    renderAds();
};

function handleActionClick(button) {
    const requestDiv = button.closest('.friend-request');
    const friendRequestsContainer = document.getElementById('friend-requests-container');

    requestDiv.classList.add('fade-out');

    requestDiv.addEventListener('animationend', () => {
        requestDiv.remove();

        const remainingRequests = friendRequestsContainer.querySelectorAll('.friend-request');
        if (remainingRequests.length === 0) {
            const noRequestsMessage = document.querySelector('.no-requests');
            noRequestsMessage.classList.remove('hidden');
        }
    });
}

// Accept Friend Request
document.querySelectorAll('.accept-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const friendRequest = e.target.closest('.friend-request');
        friendRequest.classList.add('bg-green-100');
        friendRequest.querySelector('.accept-btn').disabled = true;
        friendRequest.querySelector('.decline-btn').disabled = true;
    });
});

document.querySelectorAll('.decline-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const friendRequest = e.target.closest('.friend-request');
        friendRequest.classList.add('bg-green-100');
        friendRequest.querySelector('.accept-btn').disabled = true;
        friendRequest.querySelector('.decline-btn').disabled = true;
    });
});


// Enhanced JavaScript for Middle Section
// document.addEventListener("DOMContentLoaded", () => {
//     // Grid and List View Toggles
//     const gridViewButton = document.getElementById("grid-view");
//     const listViewButton = document.getElementById("list-view");
//     const postFeed = document.getElementById("post-feed");

//     gridViewButton.addEventListener("click", () => {
//         postFeed.classList.remove("list-view");
//         postFeed.classList.add("grid-view");
//     });

//     listViewButton.addEventListener("click", () => {
//         postFeed.classList.remove("grid-view");
//         postFeed.classList.add("list-view");
//     });

//     // Sort Options
//     const sortOptions = document.getElementById("sort-options");
//     sortOptions.addEventListener("change", (event) => {
//         const sortValue = event.target.value;
//         console.log(`Sorting posts by: ${sortValue}`);
//     });

//     // Refresh Feed Button
//     const refreshFeedButton = document.getElementById("refresh-feed");
//     refreshFeedButton.addEventListener("click", () => {
//         console.log("Refreshing feed...");
//     });

//     // Add Story Button Functionality
//     const storiesContainer = document.querySelector(".stories-container .flex.space-x-4");
//     const addStoryButton = storiesContainer.querySelector(".min-w-[72px]");
//     const unsplashUrl = "https://source.unsplash.com/random/72x72";

//     const createStoryItem = (username, profileImage) => {
//         const storyDiv = document.createElement("div");
//         storyDiv.className = "flex flex-col items-center space-y-1 min-w-[72px]";
//         storyDiv.innerHTML = `
//             <div class="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//                 <img src="${profileImage}" alt="${username}" class="w-full h-full object-cover">
//             </div>
//             <span class="text-xs text-gray-600 dark:text-gray-400">${username}</span>
//         `;
//         return storyDiv;
//     };

//     addStoryButton.addEventListener("click", () => {
//         const username = prompt("Enter a username for the story:");
//         if (username) {
//             const storyItem = createStoryItem(username, unsplashUrl);
//             storiesContainer.appendChild(storyItem);
//         }
//     });

//     // Create Post Modal
//     const createPostButton = document.getElementById("create-post-button");
//     const createPostModal = document.getElementById("create-post-modal");
//     const closeModalButton = document.getElementById("close-modal");

//     createPostButton.addEventListener("click", () => {
//         createPostModal.classList.remove("hidden");
//     });

//     closeModalButton.addEventListener("click", () => {
//         createPostModal.classList.add("hidden");
//     });

//     createPostModal.addEventListener("click", (event) => {
//         if (event.target === createPostModal) {
//             createPostModal.classList.add("hidden");
//         }
//     });

//     // Retry Button in Error State
//     const retryButton = document.getElementById("retry-button");
//     retryButton.addEventListener("click", () => {
//         console.log("Retrying to load posts...");
//     });
// });
// // DOM Elements
// const gridViewBtn = document.getElementById('grid-view');
// const listViewBtn = document.getElementById('list-view');
// const sortSelect = document.getElementById('sort-options');
// const refreshFeedBtn = document.getElementById('refresh-feed');
// const createPostBtn = document.getElementById('create-post-button');
// const createPostModal = document.getElementById('create-post-modal');
// const closeModalBtn = document.getElementById('close-modal');
// const submitPostBtn = document.getElementById('submit-post');
// const postContent = document.getElementById('post-content');
// const postFeed = document.getElementById('post-feed');

// // State Management
// let currentView = 'grid';
// let isRefreshing = false;

// // View Controls
// function updateViewMode(mode) {
//     currentView = mode;
//     postFeed.className = `space-y-6 transition-all duration-300 ${
//         mode === 'grid' ? 'grid grid-cols-2 gap-4' : ''
//     }`;
    
//     // Update active button states
//     gridViewBtn.classList.toggle('bg-gray-100', mode === 'grid');
//     listViewBtn.classList.toggle('bg-gray-100', mode === 'list');
// }

// gridViewBtn.addEventListener('click', () => updateViewMode('grid'));
// listViewBtn.addEventListener('click', () => updateViewMode('list'));

// // Sort Controls
// sortSelect.addEventListener('change', (e) => {
//     const sortType = e.target.value;
//     // Implement your sorting logic here
//     console.log(`Sorting by: ${sortType}`);
// });

// // Refresh Feed
// function handleRefresh() {
//     if (isRefreshing) return;
    
//     isRefreshing = true;
//     refreshFeedBtn.classList.add('animate-spin');
    
//     // Simulate refresh delay
//     setTimeout(() => {
//         isRefreshing = false;
//         refreshFeedBtn.classList.remove('animate-spin');
//     }, 1000);
// }

// refreshFeedBtn.addEventListener('click', handleRefresh);

// // Stories Section
// function initializeStories() {
//     const storiesContainer = document.querySelector('.stories-container .flex');
    
//     // Sample story data - replace with your actual data
//     const sampleStories = [
//         { username: 'user1', hasUnread: true },
//         { username: 'user2', hasUnread: false },
//         { username: 'user3', hasUnread: true },
//         // Add more stories as needed
//     ];
    
//     sampleStories.forEach(story => {
//         const storyElement = document.createElement('div');
//         storyElement.className = 'flex flex-col items-center space-y-1 min-w-[72px]';
//         storyElement.innerHTML = `
//             <div class="w-14 h-14 rounded-full bg-gray-200 ring-2 ${
//                 story.hasUnread ? 'ring-blue-500' : 'ring-gray-300'
//             } cursor-pointer hover:opacity-90 transition-opacity"></div>
//             <span class="text-xs text-gray-600 dark:text-gray-400">${story.username}</span>
//         `;
//         storiesContainer.appendChild(storyElement);
//     });
// }

// // Modal Controls
// function openCreatePostModal() {
//     createPostModal.classList.remove('hidden');
//     document.body.style.overflow = 'hidden';
//     postContent.focus();
// }

// function closeCreatePostModal() {
//     createPostModal.classList.add('hidden');
//     document.body.style.overflow = '';
//     postContent.value = '';
// }

// function handlePostSubmit() {
//     const content = postContent.value.trim();
//     if (!content) return;
    
//     // Here you would typically send the post to your backend
//     console.log('Submitting post:', content);
    
//     // Close modal after successful submission
//     closeCreatePostModal();
// }

// // Event Listeners for Modal
// createPostBtn.addEventListener('click', openCreatePostModal);
// closeModalBtn.addEventListener('click', closeCreatePostModal);
// submitPostBtn.addEventListener('click', handlePostSubmit);

// // Close modal when clicking outside
// createPostModal.addEventListener('click', (e) => {
//     if (e.target === createPostModal) {
//         closeCreatePostModal();
//     }
// });

// // Close modal with escape key
// document.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape' && !createPostModal.classList.contains('hidden')) {
//         closeCreatePostModal();
//     }
// });

// // Handle dark mode toggling
// function updateDarkMode(isDark) {
//     document.documentElement.classList.toggle('dark', isDark);
// }

// // Initialize everything
// document.addEventListener('DOMContentLoaded', () => {
//     initializeStories();
//     updateViewMode(currentView);
    
//     // Check system dark mode preference
//     // if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
//     //     updateDarkMode(true);
//     // }
// });

// // Handle system dark mode changes
// // window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
// //     updateDarkMode(e.matches);
// // });