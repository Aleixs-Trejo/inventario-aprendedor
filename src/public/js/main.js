document.addEventListener("DOMContentLoaded", () => {
  const $profileLogo = document.querySelector(".profile__logo");
  const $profileData = document.querySelector(".profile__data");
  const $navBtn = document.querySelector(".sidebar__menu");
  const $aside = document.querySelector(".aside");
  const $subHeader = document.querySelector(".sub__header");
  const $main = document.querySelector(".main");
  const $allViews = document.querySelector(".section__all--views");
  const $allForms = document.querySelector(".section__all--forms");

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
});

