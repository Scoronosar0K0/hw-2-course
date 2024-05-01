import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, user } from "../index.js";
import { initButtonLikeListeners } from "./like-post.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { initDeleteButtonListener } from './delete-post.js'


export const getWhoLiked = (user, post, likesList) => {
  let likersList = [];
  const namesLikers = likesList ? likesList : post.likes;
  namesLikers.forEach((element) => likersList.push(element.name));

  if (!user) {
    return `${
      likersList.length > 0
        ? likersList.length > 1
          ? `${likersList[0]} и еще ${likersList.length - 1}`
          : likersList
        : 0
    }`;
  } else {
    return `${
      likersList.length > 0
        ? likersList.length > 1
          ? `${user.name} и еще ${likersList.length - 1}`
          : likersList
        : 0
    }`;
  }
};

export const renderPosts = ({ posts }) => {
  const postsHTML = posts
    .map((post, index) => {
      const correctDate = formatDistanceToNow(new Date(post.createdAt), {
        locale: ru,
      });

      let names = getWhoLiked(user, post);

      const redHeart = './assets/images/like-active.svg';
      const blackHeart = './assets/images/like-not-active.svg';

      return `<li class="post" data-index="${index}">
            <div class="post-header" data-user-id="${post.user.id}">
                <img src="${post.user.imageUrl}" class="post-header__user-image">
                <p class="post-header__user-name">${post.user.name}</p>
            </div>
            <div class="post-image-container">
                <img class="post-image" src="${post.imageUrl}">
            </div>
            <div class="post-likes">
                <button data-post-id="{post.id}" data-index="${index}" class="like-button">
                    <img class="like-img" data-index="${index}" src="${post.isLiked ? redHeart : blackHeart}">
                </button>
                <p class="post-likes-text" data-index="${index}">
                    Нравится: <strong>${names}</strong>
                </p>
            </div>
            <p class="post-text">
                <span class="user-name">${post.user.name}</span>
                ${post.description}
            </p>
            <p class="post-date">
          ${correctDate}
            </p>
            <button class="delete-button" data-index="${index}" data-id="${post.id}" style="display: ${user && user.name === post.user.name ? "block;" : "none;"}">
              Удалить пост
            </button>
        </li>`;
    })
    .join("");

  return postsHTML;
};

export const renderPostsUser = ({ posts }) => {
  const postsHTML = posts
    .map((post, index) => {
      const correctDate = formatDistanceToNow(new Date(post.createdAt), {
        locale: ru,
      });

      const redHeart = './assets/images/like-active.svg';
      const blackHeart = './assets/images/like-not-active.svg';

      let names = getWhoLiked(user, post);

      return `<li class="post" data-index="${index}" id="${index}">
          <div class="post-image-container">
              <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes" data-user-id="${post.user.id}">
              <button data-post-id="{post.id}" data-user-id="${post.user.id}" data-index="${index}" class="like-button">
              <img class="like-img" data-index="${index}" src="${post.isLiked ? redHeart : blackHeart}">
              </button>
              <p class="post-likes-text" data-index="${index}">
                  Нравится: <strong>${names}</strong>
              </p>
          </div>
          <p class="post-text">
              <span class="user-name">${post.user.name}</span>
              ${post.description}
          </p>
          <p class="post-date">
          ${correctDate}
          </p>
          <button class="delete-button" data-index="${index}" data-id="${post.id}" style="display: ${user && user.name === post.user.name ? "block;" : "none;"}">
              Удалить пост
          </button>
      </li>`;
    })
    .join("");

  return postsHTML;
};


export function renderPostsPageComponent({ appEl }) {
  const postsList = renderPosts({ posts });

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
  initDeleteButtonListener({ token });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
