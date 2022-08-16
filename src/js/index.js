// 오늘 얻은 인사이트
// 1. 이벤트 위임을 어떻게 할 수 있는지 알게 되어서 좋았다.
// 2. 요구사항을 전략적으로 접근해야하는지, 단계별로 세세하게 나누는게 중요하다는걸 알게 됐다.
// 3. DOM 요소를 가져올때는 $표시를 써서 변수처럼 사용할 수 있는게 좋았다.
// 4. 새롭게 알게 된 메서드 innerText, innerHTML, insertAdjacentHtml, closest, e.target

// step1 요구사항 구현을 위한 전략
// - [O] 에스프레소 메뉴에 새로운 메뉴를 확인 버튼 또는 엔터키 입력으로 추가한다.
// - [O] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.

// - [O] 사용자 입력값이 빈 값이라면 추가되지 않는다.
// -> 스페이스바 입력 후 확인 눌렀을 때도 추가되지 않게 해보기

// - [O] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [O]추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.


const $ = (selector) => document.querySelector(selector);

function App() {
    // TODO 메뉴 수정
    // - [O] 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 모달창(prompt)이 뜬다.
    // - [O] 모달창에서 신규메뉴명을 입력 받고, 확인버튼을 누르면 메뉴가 수정된다.

    // TODO 메뉴 삭제
    // - [O] 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌(confirm) 모달창이 뜬다.
    // - [O] 확인 버튼을 클릭하면 메뉴가 삭제된다.
    // - [O] 삭제 후 총 메뉴 갯수를 COUNT하여 상단에 보여준다.

    const updateMenuCount = () => {
      const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
      $(".menu-count").innerText = `총 ${menuCount} 개`;
    };

    //메뉴를 추가해주는 기능을 함
    const addMenuName = () => { 
      if($("#espresso-menu-name").value === ""){
          console.log($("#espresso-menu-name").value)
          alert("값을 입력해주세요.");
          return; 
        }
        const espressoMenuName = $("#espresso-menu-name").value;
        const menuItemTemplate = (espressoMenuName) => {
            return `<li class="menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
        };
        
        $("#espresso-menu-list").insertAdjacentHTML(
          "beforeend",
          menuItemTemplate(espressoMenuName)
        );

        updateMenuCount(); 
        //에스프레소메뉴이름을 빈값으로
        $("#espresso-menu-name").value = "";
    };

    // 수정버튼
    const updateMenuName = (e) => {
      const $menuName = e.target.closest("li").querySelector(".menu-name");
        const updatedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
        $menuName.innerText = updatedMenuName;
    };

    // 삭제버튼
    const removeMenuName = (e) => {
      if(confirm("정말 삭제하시겠습니까?")){
        e.target.closest("li").remove();
        updateMenuCount();          
      }
    };


    $("#espresso-menu-list").addEventListener("click", (e) => {
      
      if(e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
      }

      if(e.target.classList.contains("menu-remove-button")){
        removeMenuName(e);
      }
    
    });

    //form태그가 자동으로 전송되는걸 막아준다.
    $("#espresso-menu-form").addEventListener("submit", (e) => {
        e.preventDefault();
    });

    $("#espresso-menu-submit-button").addEventListener("click", addMenuName);
    
    //메뉴의 이름을 입력받는건
    $("#espresso-menu-name").addEventListener("keypress", (e) => {
        if(e.key !== "Enter"){
            return;
        }
        addMenuName();
    });

}

App();