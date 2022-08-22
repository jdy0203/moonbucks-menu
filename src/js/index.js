// 회고
// - '상태값'의 중요성
// - 사용자 관점에서 페이지 렌더링 될 때 어떻게 렌더링 되는지 보게 됨


// TODO localStorage Read & write
//-[O] localStorage에 데이터를 저장한다.
//-[O] 메뉴를 추가할 때
//-[O] 메뉴를 수정할 때
//-[O] 메뉴를 삭제할 때
//-[O] localStorage에 있는 데이터를 읽어온다.

//TODO 카테고리별 메뉴판 관리
//-[O]  에스프레소 메뉴판 관리
//-[O]  프라푸치노 메뉴판 관리
//-[O]  블렌디드 메뉴판 관리
//-[O]  티바나 메뉴판 관리
//-[O]  디저트 메뉴판 관리

//TODO 페이지 접근시 최초 데이터 Read & Rendering
//-[O]  페이지에 최초로 localStorage에 에스프레소 메뉴를 읽어온다.
//-[O]  에스프레소 메뉴를 페이지에 그려준다.


//TODO 품절 상태 관리 
//-[O]  품절 버튼을 추가한다.
//-[O]  품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
//-[O]  클릭이벤트에서 가장 가까운 li태그의 class속성 값에 sold-out을 추가한다.

import { $ } from "./utils/dom.js";
import store from "./store/index.js";


function App() {
    // 상태(변하는 데이터 = 이 앱에서 변하는 것이 무엇인가) - 메뉴명(메뉴명 배열의 길이를 구하면 갯수는 자동으로 구해짐)
    this.menu = {
      //객체의 키-값
      espresso: [],
      frappuccino: [],
      blended: [],
      teavana: [],
      dessert: [],
    };

    this.currentCategory = "espresso";

    this.init = () => {
      if (store.getLocalStorage()) {
        this.menu = store.getLocalStorage();
      }
      render();
      initEventListeners();
    };

    const render = () => {
      const template = this.menu[this.currentCategory].map((menuItem, index) => {
        return `
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name ${menuItem.soldOut ? "sold-out" : ""}">${menuItem.name}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
          >
            품절
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
          >
            수정
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
          >
            삭제
          </button>
        </li>`;
      })
      .join("");

      $("#menu-list").innerHTML = template;
      updateMenuCount(); 
    };
    
    const updateMenuCount = () => {
      const menuCount = this.menu[this.currentCategory].length;
      $(".menu-count").innerText = `총 ${menuCount} 개`;
    };

    const addMenuName = () => { 
      if($("#menu-name").value === ""){
        alert("값을 입력해주세요.");
        return; 
      }
      // 상태가 변하는 대로 localStorage에 저장되도록 처리
      const menuName = $("#menu-name").value;
      this.menu[this.currentCategory].push({ name: menuName});
      store.setLocalStorage(this.menu);
      render();
      $("#menu-name").value = "";
    };

    const updateMenuName = (e) => {
      const menuId = e.target.closest("li").dataset.menuId;
      const $menuName = e.target.closest("li").querySelector(".menu-name");
        const updatedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
        this.menu[this.currentCategory][menuId].name = updatedMenuName;
        store.setLocalStorage(this.menu);
        render();
    };

    const removeMenuName = (e) => {
      if(confirm("정말 삭제하시겠습니까?")){
        const menuId = e.target.closest("li").dataset.menuId;
        this.menu[this.currentCategory].splice(menuId, 1);
        store.setLocalStorage(this.menu);
        render();        
      }
    };

    const soldOutMenu = (e) => {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
      store.setLocalStorage(this.menu);
      render();
    };

    const initEventListeners = () => {
      $("#menu-list").addEventListener("click", (e) => {
        //if문 사용 할 때 뒷부분 체크할 필요 없을 시 return 써주기!
        if(e.target.classList.contains("menu-edit-button")) {
          updateMenuName(e);
          return;
        }
  
        if(e.target.classList.contains("menu-remove-button")) {
          removeMenuName(e);
          return;
        }
  
        if(e.target.classList.contains("menu-sold-out-button")){
          soldOutMenu(e);
          return;
        }
      
      });
  
      $("#menu-form").addEventListener("submit", (e) => {
          e.preventDefault();
      });
  
      $("#menu-submit-button").addEventListener("click", addMenuName);
      
      $("#menu-name").addEventListener("keypress", (e) => {
          if(e.key !== "Enter"){
              return;
          }
          addMenuName();
      });
  
      $("nav").addEventListener("click", (e) => {
        const isCategoryButton = e.target.classList.contains("cafe-category-name")
        if (isCategoryButton) {
          const categoryName = e.target.dataset.categoryName;
          this.currentCategory = categoryName;
          $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
          render();
        }
      });
    };
}

//페이지를 처음 접근했을 때 App이라는 객체를 생성하고, 객체의 init이라는 메서드를 불러온다.
const app = new App();
app.init();