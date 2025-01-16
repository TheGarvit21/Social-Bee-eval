// User data structure
const userData = {
    name: ' ',
    handle: ' ',
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
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        document.getElementById('userName').textContent = loggedInUser.name;
        document.getElementById('userHandle').textContent = `@${loggedInUser.name.toLowerCase().replace(/\s+/g, '_')}`;
    }

    const msgDot = document.getElementById('msgCount');
    if (userData.messages > 0) {
        msgDot.classList.remove('hidden');
    }

    document.getElementById('msgNav').addEventListener('click', () => msgDot.classList.add('hidden'));

    const topicsList = document.getElementById('topics-list');
    userData.topics.forEach(topic => {
        const topicEl = document.createElement('div');
        topicEl.className = 'topic-item flex items-center space-x-3 cursor-pointer';
        topicEl.innerHTML = `
            <i class="fa ${topic.icon}"></i>
            <span>${topic.name}</span>
            <span class="ml-auto text-xs text-gray-500">(${topic.posts} Posts)</span>
        `;

        topicEl.addEventListener('click', () => {
            const selectedTopic = document.querySelector('.topic-item.selected');
            if (selectedTopic) {
                selectedTopic.classList.remove('selected');
            }
            topicEl.classList.add('selected');
            currentTopic = topic.name.toLowerCase();
            loadPostsByTopic(currentTopic);
        });

        topicsList.appendChild(topicEl);
    });

    document.getElementById('topics-toggle').addEventListener('click', () => {
        document.getElementById('topics-list').classList.toggle('expanded');
        const icon = document.querySelector('#topics-toggle i');
        icon.classList.toggle('rotate-180');
    });
}

async function getRandomUser() {
    try {
        const response = await fetch(`https://randomuser.me/api/?results=${count}&nat=in`);
        const data = await response.json();
        return data.results[0];
    } catch (error) {
        console.error('Error fetching random user:', error);
        return null;
    }
}

function createPost(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('feed-item', 'bg-white', 'dark:bg-gray-800', 'p-4', 'rounded-lg', 'shadow-md', 'hover:shadow-lg', 'transition-all');
    postElement.dataset.postId = post.id;

    const postTimestamp = new Date(post.timestamp);

    postElement.innerHTML = `
        <div class="flex items-center space-x-4">
            <div class="profile-pic"></div>
            <div class="post-author">
                <span class="font-semibold text-gray-900 dark:text-white">${post.author}</span>
                <p class="text-sm text-gray-500 dark:text-gray-400">${formatTimeAgo(postTimestamp)}</p>
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
            <button class="like-btn flex items-center space-x-1 hover:text-blue-600">
                <span class="like-icon">&#9829;</span>
                <span>Like</span>
            </button>
            <button class="comment-btn flex items-center space-x-1 hover:text-blue-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <span>Comment</span>
            </button>
            <button class="share-btn flex items-center space-x-1 hover:text-blue-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>
                <span>Share</span>
            </button>
            <button class="bookmark-btn flex items-center space-x-1 hover:text-blue-600">
                <svg class="w-5 h-5 bookmark-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
            </button>
        </div>
        <div class="comment-box hidden mt-4">
            <textarea id="comment-text-${post.id}" class="comment-textarea p-3 w-full border border-gray-300 rounded-lg shadow-sm resize-none text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Write your comment..."></textarea>
            <button class="submit-comment-btn bg-blue-500 text-white mt-2 p-2 rounded-lg hover:bg-blue-600 transition-all">Submit Comment</button>
            <div class="comments-list mt-4"></div>
        </div>`;

    const likeButton = postElement.querySelector('.like-btn');
    const likeIcon = likeButton.querySelector('.like-icon');
    likeButton.addEventListener('click', () => toggleLike(likeButton, likeIcon, post.id));

    const submitCommentButton = postElement.querySelector('.submit-comment-btn');
    submitCommentButton.addEventListener('click', async () => {
        const commentText = postElement.querySelector(`#comment-text-${post.id}`).value;
        if (commentText.trim()) {
            const randomUser = await getRandomUser();
            if (randomUser) {
                const commentsList = postElement.querySelector('.comments-list');
                const commentDiv = document.createElement('div');
                const timestamp = new Date();
                commentDiv.classList.add('comment-item', 'bg-gray-100', 'dark:bg-gray-700', 'p-3', 'rounded-lg', 'mb-4', 'flex', 'items-start');
                commentDiv.innerHTML = `
                    <div class="flex-shrink-0">
                        <img src="${randomUser.picture.medium}" alt="User Profile" class="w-10 h-10 rounded-full" />
                    </div>
                    <div class="ml-3 w-full">
                        <div class="comment-header flex items-center justify-between">
                            <span class="font-semibold text-gray-900 dark:text-white">${randomUser.name.first} ${randomUser.name.last}</span>
                            <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">${formatTimeAgo(timestamp)}</span>
                        </div>
                        <p class="mt-2 text-gray-800 dark:text-gray-200">${commentText}</p>
                    </div>
                `;
                commentsList.appendChild(commentDiv);
                postElement.querySelector(`#comment-text-${post.id}`).value = '';
            }
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

    const bookmarkButton = postElement.querySelector('.bookmark-btn');
    bookmarkButton.addEventListener('click', () => {
        toggleBookmark(post, bookmarkButton);
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

function formatTimeAgo(timestamp) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) return 'Just now';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
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

    const firstTopic = document.querySelector('.topic-item');
    if (firstTopic) {
        firstTopic.classList.add('selected');
        currentTopic = userData.topics[0].name.toLowerCase();
        loadPostsByTopic(currentTopic);
    }

    window.addEventListener('scroll', function () {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition >= scrollableHeight - 10) {
            loadPostsByTopic(currentTopic, true);
        }
    });

    loadPostsByTopic(currentTopic);
});