// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase config
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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 🔐 Login/Logout
document.getElementById("loginBtn").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then(result => {
      alert("Welcome " + result.user.email);
    })
    .catch(error => console.error("Login failed:", error));
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => alert("Logged out"));
});

// ✍️ Submit post (only if logged in, with group)
window.submitPost = function() {
  const text = document.getElementById('postInput').value;
  const group = document.getElementById('groupSelect').value; // new group selector

  if (text.trim() !== "" && auth.currentUser) {
    push(postsRef, { 
      content: text, 
      timestamp: Date.now(),
      owner: auth.currentUser.uid,
      group: group
    });
    document.getElementById('postInput').value = "";
    const confirmDiv = document.getElementById('confirmation');
    confirmDiv.style.display = "block";
    setTimeout(() => confirmDiv.style.display = "none", 2000);
  }
};

// 📥 Listen for posts (filter by owner or group)
onAuthStateChanged(auth, (user) => {
  if (user) {
    onValue(postsRef, (snapshot) => {
      const postsDiv = document.getElementById('posts');
      postsDiv.innerHTML = "";
      const selectedGroup = document.getElementById('groupSelect').value;

      snapshot.forEach((child) => {
        const post = child.val();
        const postId = child.key; 

        // Show if it's the user's own post OR matches their group
        if (post.owner === user.uid || post.group === selectedGroup) {
          postsDiv.innerHTML += `
            <div class="post" id="${postId}">
              <p>${post.content}</p>
              <small>${new Date(post.timestamp).toLocaleString()}</small>
              <button onclick="copyMessageLink('${postId}')">📋 Copy Link</button>
              <button onclick="shareOnWhatsApp('${postId}')">💬 Share on WhatsApp</button>
            </div>`;
        }
      });
    });
  } else {
    document.getElementById('posts').innerHTML = "<p>Please log in to see posts.</p>";
  }
});

// 📋 Copy link
function copyMessageLink(postId) {
  const baseUrl = "https://kelechukwuprecious2-dev.github.io/campus-anonymous/";
  const link = `${baseUrl}?post=${postId}`;
  navigator.clipboard.writeText(link).then(() => alert("Message link copied!"))
    .catch(err => console.error("Failed to copy: ", err));
}

// 💬 Share on WhatsApp
function shareOnWhatsApp(postId) {
  const baseUrl = "https://kelechukwuprecious2-dev.github.io/campus-anonymous/";
  const link = `${baseUrl}?post=${postId}`;
  const message = `Check out this anonymous message: ${link}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
}

// ✨ Highlight shared post
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("post");
  if (postId) {
    const postElement = document.getElementById(postId);
    if (postElement) {
      postElement.scrollIntoView({ behavior: "smooth", block: "center" });
      postElement.classList.add("highlight");
    }
  }
});
