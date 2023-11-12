import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { initButtonLikeListeners } from "./like-post.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from 'date-fns/locale';

export const renderPosts = ({ posts }) => {
  const postsHTML = posts
    .map((post, index) => {

      console.log(post.createdAt);

      const correctDate = formatDistanceToNow(
          new Date(post.createdAt), {locale: ru}
      );

      let likersList = [];
      const namesLikers = post.likes;
      namesLikers.forEach(element => likersList.push(element.name));
      const listFromArray = likersList.join(', ');

      return `<li class="post">
            <div class="post-header" data-user-id="${post.user.id}">
                <img src="${post.user.imageUrl}" class="post-header__user-image">
                <p class="post-header__user-name">${post.user.name}</p>
            </div>
            <div class="post-image-container">
                <img class="post-image" src="${post.imageUrl}">
            </div>
            <div class="post-likes">
                <button data-post-id="{post.id}" data-index="${index}" class="like-button">
                    <img src="./assets/images/like-active.svg">
                </button>
                <p class="post-likes-text">
                    Нравится: <strong>${listFromArray.length > 0 ? listFromArray : 0}</strong>
                </p>
            </div>
            <p class="post-text">
                <span class="user-name">${post.user.name}</span>
                ${post.description}
            </p>
            <p class="post-date">
          ${correctDate}
            </p>
        </li>`;
    })
    .join("");

  return postsHTML;
};

export const renderPostsUser = ({ posts }) => {
  const postsHTML = posts
    .map((post, index) => {
      
      const correctDate = formatDistanceToNow(
        new Date(post.createdAt), {locale: ru}
    );

      let likersList = [];
      const namesLikers = post.likes;
      namesLikers.forEach(element => likersList.push(element.name));
      const listFromArray = likersList.join(', ');

      return `<li class="post">
          <div class="post-image-container">
              <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
              <button data-post-id="{post.id}" data-index="${index}" class="like-button">
                  <img src="./assets/images/like-active.svg">
              </button>
              <p class="post-likes-text">
                  Нравится: <strong>${listFromArray.length > 0 ? listFromArray : 0}</strong>
              </p>
          </div>
          <p class="post-text">
              <span class="user-name">${post.user.name}</span>
              ${post.description}
          </p>
          <p class="post-date">
          ${correctDate}
          </p>
      </li>`;
    })
    .join("");

  return postsHTML;
};


export function renderPostsPageComponent({ appEl }) {
  const postsList = renderPosts({ posts });
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${postsList}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  let token = getToken();

  initButtonLikeListeners({ token, posts, appEl });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
