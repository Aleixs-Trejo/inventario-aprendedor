document.addEventListener("DOMContentLoaded", () => {
  const $navHeader = document.querySelectorAll(".nav__header--negocio");
  const $navBody = document.querySelectorAll(".nav__body--negocio");
  const $profileLogo = document.querySelector(".profile__logo");
  const $profileData = document.querySelector(".profile__data");
  const $navBtn = document.querySelector(".sidebar__menu");
  const $aside = document.querySelector(".aside");
  const $subHeader = document.querySelector(".sub__header");
  const $toggleAside = document.querySelector(".toggle__aside");
  const $main = document.querySelector(".main");
  const $allViews = document.querySelector(".section__all--views");

  //Togglear el profileData
  if ($profileLogo) {
    $profileLogo.addEventListener("click", () => {
      $profileData.classList.toggle("profile__data--active");
      $profileLogo.classList.toggle("profile__logo--active")
    })

    // Listener para el botón del menú lateral
    $navBtn.addEventListener("click", () => {
      $aside.classList.toggle("aside--active");
      if ($aside.classList.contains("aside--active")) {
        if ($subHeader){
          $subHeader.classList.remove("aside__sub__header");
          $navBody.forEach(nav => {
            console.log(nav);
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
    $navHeader.forEach(nav => {
      /* nav.addEventListener("click", () => {
        nav.nextElementSibling.classList.toggle("nav__section__body__container--show");
      }); */
      const $arrow = nav.querySelector(".nav__section__header__arrow");
      $arrow.addEventListener("click", () => {
        nav.nextElementSibling.classList.toggle("nav__section__body__container--show");
        $arrow.classList.toggle("arrow__figure--rotate");
      });
    })
    $toggleAside.addEventListener("click", () => {
      $toggleAside.classList.toggle("toggle__aside--active");
    })
  }
});

