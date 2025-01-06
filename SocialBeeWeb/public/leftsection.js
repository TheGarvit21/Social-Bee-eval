
// // Simulated user data - In real app, this would come from your backend
// const userData = {
//     name: 'Dev Jindal',
//     handle: '@dj',
//     streak: 7,
//     level: 12,
//     notifications: 3,
//     messages: 2,
//     challenges: [
//         { id: 1, title: 'Write a Blog Post', progress: 0, reward: '50 XP' },
//         { id: 2, title: 'Comment on 3 Posts', progress: 2, max: 3, reward: '30 XP' },
//         { id: 3, title: 'Share Knowledge', progress: 1, max: 1, reward: '25 XP', completed: true }
//     ],
//     topics: [
//         { id: 1, name: 'Technology', icon: 'fa-laptop-code', posts: 125 },
//         { id: 2, name: 'News', icon: 'fa-newspaper', posts: 89 },
//         { id: 3, name: 'Fitness', icon: 'fa-dumbbell', posts: 45 },
//         { id: 4, name: 'Sports', icon: 'fa-trophy', posts: 67 },
//         { id: 5, name: 'Movies', icon: 'fa-film', posts: 93 }
//     ],
//     learning: [
//         { topic: 'Web Development', progress: 75 },
//         { topic: 'Data Science', progress: 45 },
//         { topic: 'UI Design', progress: 90 }
//     ]
// };

// // Update user profile
// document.getElementById('userName').textContent = userData.name;
// document.getElementById('userHandle').textContent = userData.handle;
// document.getElementById('currentStreak').textContent = userData.streak;
// document.getElementById('userLevel').textContent = userData.level;

// // Update notification counts
// const notifDot = document.getElementById('notifCount');
// if (userData.notifications > 0) {
//     notifDot.classList.remove('hidden');
// }

// const msgDot = document.getElementById('msgCount');
// if (userData.messages > 0) {
//     msgDot.classList.remove('hidden');
// }

// // Hide dot when clicked
// document.getElementById('notifNav').addEventListener('click', () => notifDot.classList.add('hidden'));
// document.getElementById('msgNav').addEventListener('click', () => msgDot.classList.add('hidden'));

// // Populate challenges
// const challengesList = document.getElementById('challengesList');
// userData.challenges.forEach(challenge => {
//     const progress = (challenge.progress || 0) / (challenge.max || 1) * 100;
//     const challengeEl = document.createElement('div');
//     challengeEl.className = 'bg-white p-3 rounded-lg shadow-sm';
//     challengeEl.innerHTML = `
//         <div class="flex justify-between items-center">
//             <span>${challenge.title}</span>
//             <span>${challenge.completed ? 'Completed' : `${challenge.progress || 0}/${challenge.max || 1}`}</span>
//         </div>
//         <div class="mt-2">
//             <div class="progress-bar">
//                 <div class="fill" style="width: ${progress}%"></div>
//             </div>
//         </div>
//         <div class="mt-2 text-xs text-gray-500">${challenge.reward}</div>
//     `;
//     challengesList.appendChild(challengeEl);
// });


// // Populate topics
// const topicsList = document.getElementById('topics-list');
// userData.topics.forEach(topic => {
//     const topicEl = document.createElement('div');
//     topicEl.className = 'topic-item flex items-center space-x-3 cursor-pointer';
//     topicEl.innerHTML = `
//                 <i class="fa ${topic.icon}"></i>
//                 <span>${topic.name}</span>
//                 <span class="ml-auto text-xs text-gray-500">(${topic.posts} Posts)</span>
//             `;
//     topicEl.addEventListener('click', () => {
//         // Deselect any previously selected topic
//         const selectedTopic = document.querySelector('.topic-item.selected');
//         if (selectedTopic) {
//             selectedTopic.classList.remove('selected');
//         }
//         // Select the current topic
//         topicEl.classList.add('selected');
//     });
//     topicsList.appendChild(topicEl);
// });

// // Populate learning progress
// const learningProgress = document.getElementById('learningProgress');
// userData.learning.forEach(progress => {
//     const progressEl = document.createElement('div');
//     progressEl.className = 'space-y-2';
//     progressEl.innerHTML = `
//                 <div class="font-semibold text-gray-700">${progress.topic}</div>
//                 <div class="progress-bar">
//                     <div class="fill" style="width: ${progress.progress}%"></div>
//                 </div>
//             `;
//     learningProgress.appendChild(progressEl);
// });

// // Toggle topics section
// document.getElementById('topics-toggle').addEventListener('click', () => {
//     document.getElementById('topics-list').classList.toggle('expanded');
//     const icon = document.querySelector('#topics-toggle i');
//     icon.classList.toggle('rotate-180');
// });



// User data structure
const userData = {
    name: 'Dev Jindal',
    handle: '@dj',
    streak: 7,
    level: 12,
    messages: 2,
    challenges: [
        { id: 1, title: 'Write a Blog Post', progress: 0, reward: '50 XP' },
        { id: 2, title: 'Comment on 3 Posts', progress: 2, max: 3, reward: '30 XP' },
        { id: 3, title: 'Share Knowledge', progress: 1, max: 1, reward: '25 XP', completed: true }
    ],
    topics: [
        { id: 1, name: 'Technology', icon: 'fa-laptop-code', posts: 125 },
        { id: 2, name: 'News', icon: 'fa-newspaper', posts: 89 },
        { id: 3, name: 'Fitness', icon: 'fa-dumbbell', posts: 45 },
        { id: 4, name: 'Sports', icon: 'fa-trophy', posts: 67 },
        { id: 5, name: 'Movies', icon: 'fa-film', posts: 93 }
    ]
    
};

// Subreddit mappings
const topicToSubreddit = {
    technology: ['technology', 'gadgets', 'technews'],
    news: ['worldnews', 'news', 'uknews'],
    fitness: ['fitness', 'nutrition', 'yoga', 'bodybuilding', 'crossfit', 'running'],
    sports: ['sports', 'soccer', 'basketball'],
    movies: ['movies', 'film', 'moviecritic'],
};

// Global state
let isLoading = false;
let posts = [];
let currentTopic = 'technology';
let after = '';

// Initialize all sidebar components
function initializeSidebar() {
    // Update user profile
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('userHandle').textContent = userData.handle;
    // document.getElementById('currentStreak').textContent = userData.streak;
    // document.getElementById('userLevel').textContent = userData.level;

    // Update notification counts
    // const notifDot = document.getElementById('notifCount');
    const msgDot = document.getElementById('msgCount');

    // if (userData.notifications > 0) {
    //     notifDot.classList.remove('hidden');
    // }
    if (userData.messages > 0) {
        msgDot.classList.remove('hidden');
    }

    // Setup notification handlers
    // document.getElementById('notifNav').addEventListener('click', () => notifDot.classList.add('hidden'));
    document.getElementById('msgNav').addEventListener('click', () => msgDot.classList.add('hidden'));

    // Populate challenges
    // const challengesList = document.getElementById('challengesList');
    // userData.challenges.forEach(challenge => {
    //     const progress = (challenge.progress || 0) / (challenge.max || 1) * 100;
    //     const challengeEl = document.createElement('div');
    //     challengeEl.className = 'bg-white p-3 rounded-lg shadow-sm';
    //     challengeEl.innerHTML = `
    //         <div class="flex justify-between items-center">
    //             <span>${challenge.title}</span>
    //             <span>${challenge.completed ? 'Completed' : `${challenge.progress || 0}/${challenge.max || 1}`}</span>
    //         </div>
    //         <div class="mt-2">
    //             <div class="progress-bar">
    //                 <div class="fill" style="width: ${progress}%"></div>
    //             </div>
    //         </div>
    //         <div class="mt-2 text-xs text-gray-500">${challenge.reward}</div>
    //     `;
    //     challengesList.appendChild(challengeEl);
    // });

    // Populate topics with click handlers
    const topicsList = document.getElementById('topics-list');
    userData.topics.forEach(topic => {
        const topicEl = document.createElement('div');
        topicEl.className = 'topic-item flex items-center space-x-3 cursor-pointer';
        topicEl.innerHTML = `
            <i class="fa ${topic.icon}"></i>
            <span>${topic.name}</span>
            <span class="ml-auto text-xs text-gray-500">(${topic.posts} Posts)</span>
        `;

        // Add click handler for topic selection
        topicEl.addEventListener('click', () => {
            const selectedTopic = document.querySelector('.topic-item.selected');
            if (selectedTopic) {
                selectedTopic.classList.remove('selected');
            }
            topicEl.classList.add('selected');

            // Update current topic and load new posts
            currentTopic = topic.name.toLowerCase();
            loadPostsByTopic(currentTopic);
        });

        topicsList.appendChild(topicEl);
    });

    // Populate learning progress
    

    // Setup topics toggle
    document.getElementById('topics-toggle').addEventListener('click', () => {
        document.getElementById('topics-list').classList.toggle('expanded');
        const icon = document.querySelector('#topics-toggle i');
        icon.classList.toggle('rotate-180');
    });
}

function createPost(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('feed-item', 'bg-white', 'dark:bg-gray-800', 'p-4', 'rounded-lg', 'shadow-md', 'hover:shadow-lg', 'transition-all');
    postElement.dataset.postId = post.id;

    postElement.innerHTML = `
        <div class="flex items-center space-x-4">
            <div class="profile-pic"></div>
            <div class="post-author">
                <span class="font-semibold text-gray-900 dark:text-white">${post.author}</span>
                <p class="text-sm text-gray-500 dark:text-gray-400">Posted recently</p>
            </div>
        </div>
        <p class="mt-4 text-gray-800 dark:text-gray-200">${post.title}</p>
        ${post.thumbnail ? `
            <div class="image-container relative">
                <img src="${post.thumbnail}" alt="Post Image" class="mt-4 w-full h-auto rounded-lg post-image cursor-pointer" />
                <div class="overlay absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 text-white text-xl font-bold opacity-0 hover:opacity-100 transition-opacity cursor-pointer" data-url="${post.url}">
                    Click to View
                </div>
            </div>` : ''}
        <div class="mt-4 flex justify-between text-gray-600 dark:text-gray-400">
            <button class="like-btn">
                <span class="like-icon">&#9829;</span> Like
            </button>
            <button class="comment-btn">Comment</button>
            <button class="share-btn">Share</button>
        </div>
        <div class="comment-box hidden mt-4">
            <textarea id="comment-text-${post.id}" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Write your comment..."></textarea>
            <button class="submit-comment-btn bg-blue-500 text-white mt-2 p-2 rounded">Submit Comment</button>
        </div>`;

    // Add event listeners for post interactions
    const likeButton = postElement.querySelector('.like-btn');
    const likeIcon = likeButton.querySelector('.like-icon');
    likeButton.addEventListener('click', () => toggleLike(likeButton, likeIcon, post.id));

    const submitCommentButton = postElement.querySelector('.submit-comment-btn');
    submitCommentButton.addEventListener('click', () => {
        const commentText = postElement.querySelector(`#comment-text-${post.id}`).value;
        if (commentText.trim()) {
            alert(`Comment posted: ${commentText}`);
            postElement.querySelector(`#comment-text-${post.id}`).value = '';
        }
    });

    const shareButton = postElement.querySelector('.share-btn');
    shareButton.addEventListener('click', () => {
        navigator.share({
            title: post.title,
            url: post.url
        }).catch(err => {
            console.error('Error sharing post:', err);
        });
    });

    const commentButton = postElement.querySelector('.comment-btn');
    commentButton.addEventListener('click', () => {
        const commentBox = postElement.querySelector('.comment-box');
        commentBox.classList.toggle('hidden');
    });

    const postImage = postElement.querySelector('.post-image');
    const overlay = postElement.querySelector('.overlay');

    if (postImage && overlay) {
        postImage.addEventListener('click', () => {
            window.open(post.url, '_blank');
        });

        overlay.addEventListener('click', (event) => {
            event.stopPropagation();
            window.open(post.url, '_blank');
        });
    }

    return postElement;
}

async function fetchRedditPosts(subreddit) {
    const url = `https://www.reddit.com/r/${subreddit}/new.json?after=${after}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch data from subreddit: ${subreddit}`);
    }

    const data = await response.json();
    after = data.data.after;

    return data.data.children
        .map(post => {
            if (post.data.is_self || post.data.thumbnail === 'self') {
                return null;
            }

            let imageUrl = null;

            if (post.data.preview?.images?.[0]?.source?.url) {
                imageUrl = post.data.preview.images[0].source.url.replace(/&amp;/g, '&');
            } else if (post.data.url_overridden_by_dest) {
                const urlLower = post.data.url_overridden_by_dest.toLowerCase();
                if (urlLower.match(/\.(jpg|jpeg|png|gif)(\?.*)?$/i) ||
                    urlLower.includes('imgur.com') ||
                    urlLower.includes('i.redd.it')) {
                    imageUrl = post.data.url_overridden_by_dest;
                }
            } else if (post.data.url) {
                const urlLower = post.data.url.toLowerCase();
                if (urlLower.match(/\.(jpg|jpeg|png|gif)(\?.*)?$/i) ||
                    urlLower.includes('imgur.com') ||
                    urlLower.includes('i.redd.it')) {
                    imageUrl = post.data.url;
                }
            }

            if (!imageUrl || !imageUrl.startsWith('http')) {
                return null;
            }

            return {
                title: post.data.title,
                url: post.data.url,
                thumbnail: imageUrl,
                id: post.data.id,
                author: post.data.author,
            };
        })
        .filter(post => post !== null);
}

function toggleLike(likeButton, likeIcon, postId) {
    const isLiked = likeIcon.classList.contains('text-red-500');

    if (isLiked) {
        likeIcon.classList.remove('text-red-500');
        likeIcon.innerHTML = '&#9829;';
        likeButton.innerHTML = `<span class="like-icon">&#9829;</span> Like`;
    } else {
        likeIcon.classList.add('text-red-500');
        likeIcon.innerHTML = '&#10084;&#65039;';
        likeButton.innerHTML = `<span class="like-icon text-red-500">&#10084;&#65039;</span> Unlike`;
    }

    const post = posts.find(p => p.id === postId);
    if (post) {
        post.isLiked = !isLiked;
    }
}

async function loadPostsByTopic(topic, isInfiniteScroll = false) {
    const subreddits = topicToSubreddit[topic];
    if (!subreddits || subreddits.length === 0) return;

    const postFeed = document.getElementById('post-feed');
    const loadingIndicator = document.getElementById('loading-indicator');

    if (isLoading) return;
    isLoading = true;

    loadingIndicator?.classList.remove('hidden');

    if (!isInfiniteScroll) {
        postFeed.innerHTML = '';
        posts = [];
        after = '';
    }

    try {
        let allPosts = [];
        let attempts = 0;
        const maxAttempts = 3;
        const seenUrls = new Set(posts.map(p => p.url));

        while (allPosts.length < 10 && attempts < maxAttempts) {
            for (let subreddit of subreddits) {
                const fetchedPosts = await fetchRedditPosts(subreddit);
                const uniquePosts = fetchedPosts.filter(post => !seenUrls.has(post.url));
                uniquePosts.forEach(post => seenUrls.add(post.url));
                allPosts = [...allPosts, ...uniquePosts];
            }
            attempts++;
        }

        const shuffledPosts = allPosts.sort(() => Math.random() - 0.5);

        if (shuffledPosts.length > 0) {
            shuffledPosts.forEach(post => {
                const postElement = createPost(post);
                postFeed.appendChild(postElement);
                posts.push(post);
            });
        } else if (!isInfiniteScroll) {
            const noImageMessage = document.createElement('p');
            noImageMessage.textContent = 'No posts with images available at the moment.';
            postFeed.appendChild(noImageMessage);
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
    } finally {
        isLoading = false;
        loadingIndicator?.classList.add('hidden');
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();

    // Select first topic by default and load its posts
    const firstTopic = document.querySelector('.topic-item');
    if (firstTopic) {
        firstTopic.classList.add('selected');
        currentTopic = userData.topics[0].name.toLowerCase();
        loadPostsByTopic(currentTopic);
    }

    // Setup infinite scroll
    window.addEventListener('scroll', function () {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPosition = window.scrollY;

            if (scrollPosition >= scrollableHeight - 10) {
                loadPostsByTopic(currentTopic, true);
            }
        });

        // Initialize with a random topic
        loadPostsByTopic(currentTopic);
    }
);