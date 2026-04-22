// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6gvfpUTenLnYFnMeedSBPf9lroZcquUI",
  authDomain: "anonymous-app-978d6.firebaseapp.com",
  databaseURL: "https://anonymous-app-978d6-default-rtdb.firebaseio.com",
  projectId: "anonymous-app-978d6",
  storageBucket: "anonymous-app-978d6.firebasestorage.app",
  messagingSenderId: "670027223161",
  appId: "1:670027223161:web:734a5348fb4974d33404a8",
  measurementId: "G-JW7DDKHTVG"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const postsRef = ref(db, 'posts');

// Submit a new post
window.submitPost = function() {
  const text = document.getElementById('postInput').value;
  if (text.trim() !== "") {
    push(postsRef, { content: text, timestamp: Date.now() });
    document.getElementById('postInput').value = "";
    const confirmDiv = document.getElementById('confirmation');
    confirmDiv.style.display = "block";
    setTimeout(() => confirmDiv.style.display = "none", 2000);
  }
};

// Listen for posts
onValue(postsRef, (snapshot) => {
  const postsDiv = document.getElementById('posts');
  postsDiv.innerHTML = "";
  snapshot.forEach((child) => {
    const post = child.val();
    const postId = child.key; // unique ID for each post
    postsDiv.innerHTML += `
      <div class="post">
        <p>${post.content}</p>
        <small>${new Date(post.timestamp).toLocaleString()}</small>
        <button onclick="copyMessageLink('${postId}')">📋 Copy Link</button>
      </div>`;
  });
});

// ✅ Add your copyMessageLink function here
function copyMessageLink(postId) {
  const baseUrl = window.location.href.split("?")[0]; 
  const link = `${baseUrl}?post=${postId}`;
  navigator.clipboard.writeText(link).then(() => {
    alert("Message link copied!");
  }).catch(err => {
    console.error("Failed to copy: ", err);
    window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("post");
  if (postId) {
    highlightPost(postId);
  }
});

function highlightPost(postId) {
  const postElement = document.getElementById(postId);
  if (postElement) {
    postElement.scrollIntoView({ behavior: "smooth", block: "center" });
    postElement.classList.add("highlight");
  }
}

  });
}