import { getToken } from "../index.js";
import { getUsersPosts } from "../api.js";
import { renderPostsUser } from './posts-page-component.js';
import { renderHeaderComponent } from "./header-component.js";
import { initButtonLikeListeners } from "../components/like-post.js";


export function renderUserPage({ appEl, userId }) {
    let token = getToken();
  
    getUsersPosts({ token, id: userId })
      .then((userData) => {
        return userData.posts;
      })
      .then((posts) => {
        renderHTML(posts, appEl, token);
      });
}

const renderHTML = (posts, appEl, token) => {

    const postsUser = renderPostsUser({ posts });

    const avaUser = posts[0].user.imageUrl;
    const nameUser = posts[0].user.name;

    const appHtml = `
    <div class="page-container">
        <div class="header-container"></div>
        <div class="posts-user-header">
            <img src="${avaUser}" class="posts-user-header__user-image">
            <p class="posts-user-header__user-name">${nameUser}</p>
        </div>
        <ul class="posts">${postsUser}</ul>
        <br>
        </div>
    </div>`;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
        element: document.querySelector(".header-container"),
      });

    
      let flagPosts = true;

    initButtonLikeListeners({ token, posts, flagPosts });
};


