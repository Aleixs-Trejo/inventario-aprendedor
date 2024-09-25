document.addEventListener("DOMContentLoaded", () => {
  const $html = document.querySelector(".html");
  const $navBody = document.querySelectorAll(".nav__body--negocio");
  const $profileLogo = document.querySelector(".profile__logo");
  const $profileData = document.querySelector(".profile__data");
  const $navBtn = document.querySelector(".sidebar__menu");
  const $aside = document.querySelector(".aside");
  const $subHeader = document.querySelector(".sub__header");
  const $toggleAside = document.querySelector(".toggle__aside");
  const $main = document.querySelector(".main");
  const $allViews = document.querySelector(".section__all--views");
  const $btnTheme = document.querySelector(".profile__data__theme");
  const $imgTheme = document.querySelector(".theme__img");

  //Togglear el profileData
  if ($profileLogo) {
    $profileLogo.addEventListener("click", () => {
      $profileData.classList.toggle("profile__data--active");

      // Agregar evento al window para cerrar el profileData
      if ($profileData.classList.contains("profile__data--active")) {
        window.addEventListener("click", function closeMenu(e) {
          if (!e.target.closest(".profile__data--active") && !e.target.closest(".profile__logo")) {
            $profileData.classList.remove("profile__data--active");
            window.removeEventListener("click", closeMenu);
          }
        })
      }
    });

    // Listener para el botón del menú lateral
    $navBtn.addEventListener("click", () => {
      $aside.classList.toggle("aside--active");
      if ($aside.classList.contains("aside--active")) {
        if ($subHeader){
          $subHeader.classList.remove("aside__sub__header");
          $navBody.forEach(nav => {
            nav.classList.remove("nav__section__body__container--show");
          });
        }
        $main.classList.remove("main__aside--active");
      } else {
        if ($subHeader){
          $subHeader.classList.add("aside__sub__header");
        }
        $main.classList.add("main__aside--active");
      }
    });

    // Ajustar margin-top del main
    if (!$allViews){
      $main.style.marginTop = "0";
    }
  }

  // Togglear el aside
  if ($aside) {
    $toggleAside.addEventListener("click", () => {
      $toggleAside.classList.toggle("toggle__aside--active");
      if ($toggleAside.classList.contains("toggle__aside--active")) {
        $aside.classList.add("aside--active");
        $main.classList.remove("main__aside--active");
      }
    })
  }

  // Theme
  const lightTheme = localStorage.getItem("lightTheme") || "disabled";

  if (lightTheme === "enabled") {
    $html.classList.replace("dark", "light");
    if ($imgTheme) {
      $imgTheme.src = "/assets/icon-dark.svg";
    }
  } else {
    $html.classList.replace("light", "dark");
    if ($imgTheme) {
      $imgTheme.src = "/assets/icon-light.svg";
    }
  }

  if ($btnTheme && $imgTheme) {
    $btnTheme.addEventListener("click", () => {
      if ($html.classList.contains("dark")) {
        $html.classList.replace("dark", "light");
        $imgTheme.src = "/assets/icon-dark.svg";
        localStorage.setItem("lightTheme", "enabled");
      } else if ($html.classList.contains("light")) {
        $html.classList.replace("light", "dark");
        $imgTheme.src = "/assets/icon-light.svg";
        localStorage.setItem("lightTheme", "disabled");
      }
    });
  }
});