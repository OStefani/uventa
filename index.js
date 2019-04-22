document.addEventListener('DOMContentLoaded', () => {
    /*var clickEvent = (function() {
        if ('ontouchstart' in document.documentElement === true)
          return 'touchstart';
        else
          return 'click';
      })();*/

    function switchClasses(el, className, index, callback) {
        if (el.classList.contains(className)) return;
        let listOfChild = el.parentNode.children;
        Object.keys(listOfChild).forEach(item => {
            listOfChild[item].classList.remove(className);
        });
        el.classList.add(className);
        callback(index);
    }
    // Modal
    let catalogButtons = document.getElementsByClassName('catalog-menu__click');
    let modalBody = document.getElementsByClassName('modal-body')[0];

    Object.keys(catalogButtons).forEach(button => {
        catalogButtons[button].addEventListener('click', () => {
            modalBody.classList.toggle('modal-body_open');
            document.body.classList.toggle('body_shaddow');
        });
    });

    modalBody.addEventListener('click', function (e) {
        if (e.target !== this) return;
        modalBody.classList.toggle('modal-body_open');
        document.body.classList.toggle('body_shaddow');
    });


    // Home&Prof
    let catalogMenu = document.getElementsByClassName('catalog-menu__item');
    let home = document.getElementsByClassName('home')[0];
    let prof = document.getElementsByClassName('prof')[0];
    catalogMenu[0].classList.add('catalog-menu__item_open');
    home.classList.add('active');
    Object.keys(catalogMenu).forEach((index) => {
        if (catalogMenu.hasOwnProperty(index)) {
            catalogMenu[index].addEventListener('click', function () {
                switchClasses(this, 'catalog-menu__item_open');
                if (index == 0) switchClasses(home, 'active');
                if (index == 1) switchClasses(prof, 'active');
            })
        }

    });

    // Icon bar
    var bar = document.getElementsByClassName('button-bar')[0];
    var mainMenu = document.getElementsByClassName('main-menu')[0];
    bar.addEventListener('touchstart', function () {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; 
        mainMenu.classList.toggle('main-menu_open');
        document.body.classList.toggle('body_hiden');
    });

    //Image slider

    let source = ['./img/picture-1.png', './img/picture-2-small.png', './img/picture-3-small.png', './img/picture-4-small.png'];
    let largeIm = document.querySelector('.large-image');
    let zoomWindow = document.querySelector('.img-zoom-result');
    
    let img = largeIm.firstElementChild;

    function changeSource(index) {
        img.src = source[index];
    }
    let previews = document.querySelectorAll('.preview');
    previews[0].classList.add('preview_active');
    previews.forEach((item, index) => {
        item.addEventListener('click', switchClasses.bind(this, item, 'preview_active', index, changeSource));
    });

    
    // Image zoom
    function createEls(e) {
        if (!zoomWindow.classList.contains('img-zoom-result_width') && window.innerWidth > 650) {   
            createWindow(e); 
            zoom(e,); 
        }               
    }
    
    function zoom(e) {        
        let lens = document.querySelector('.img-zoom-lens');
        var pos, cx, cy;        
        //if (lens && zoomWindow) {
           cx = 3;
           cy = 3;            
            zoomWindow.style.backgroundImage = `url('${img.src}')`;    
            zoomWindow.style.backgroundSize = (img.offsetWidth * cx) + "px " + (img.offsetHeight * cy) + "px";

            largeIm.addEventListener('mousemove', moveLens);
            lens.addEventListener('mousemove', moveLens);
        
        //}
        //else return;
        let x, y;

        function moveLens(e) {
            if (e.target == zoomWindow) removeZoom(e);
            pos = getCursorPos(e);
            
            x = pos[0] - lens.offsetWidth/2;
            y = pos[1] - lens.offsetHeight/2;
                        
            if (x > largeIm.offsetWidth - lens.offsetWidth) x = largeIm.offsetWidth - lens.offsetWidth;
            if (x < 0 + lens.offsetWidth/2) x = 0;
            if (y > largeIm.offsetHeight - lens.offsetHeight) y = largeIm.offsetHeight - lens.offsetHeight;
            if (y < 0 + lens.offsetHeight/2) y = 0; 
            
            lens.style.position = 'absolute';
            lens.style.left = x + "px";
            lens.style.top = y + "px";
                
            zoomWindow.style.backgroundPosition = `${-x * cx}px ${-y*cy}px`;
        }       
    }
    function getCursorPos(e) {
        // offsetX
       var a, x = 0, y = 0;    
        /* Get the x and y positions of the image: */
        // returns the size of an element and its position relative to the viewport.
        a = largeIm.getBoundingClientRect();
        //console.log('a: ', a);
        /* Calculate the cursor's x and y coordinates, relative to the image: */
      /* Consider any page scrolling: */
        x = e.pageX - a.left - window.pageXOffset;
        y = e.pageY - a.top - window.pageYOffset;
        return [x, y];
    }
    function createWindow() {
        zoomWindow.classList.add('img-zoom-result_width');
        let lens = document.createElement("div");
        lens.setAttribute("class", "img-zoom-lens");
        largeIm.appendChild(lens);
    }
    function removeZoom(e) {
       let pos = getCursorPos(e);
       let lens = document.querySelector('.img-zoom-lens');
       if (pos[0] > largeIm.offsetWidth || pos[0] < 0 || pos[1] > largeIm.offsetHeight || pos[1] < 0) {
            zoomWindow.classList.remove('img-zoom-result_width');        
            if (lens) {
                lens.parentNode.removeChild(lens);
            }            
       }           
    }

    largeIm.addEventListener('mouseover', createEls);   
    largeIm.addEventListener('mouseout', removeZoom);

    // fixed menu
    let menu = document.querySelector('.top-header');
    let menuItem = document.querySelectorAll('.top-header_black');
    let catMen = document.querySelector('.main-menu__list_hidden');
    let authMenu = document.querySelector('.auth-menu');
    let basketLine = document.querySelector('.basket-line');
    document.addEventListener('scroll', function() {
        let y = pageYOffset;
        if (y > 50) {
            if (!menu.classList.contains('top-header_fixed')) {
                menu.classList.add('top-header_fixed');
                menuItem.forEach(item => {
                    item.classList.add('top-header_white');
                });
                catMen.classList.add('main-menu__list_show');
                authMenu.classList.add('auth-menu_hidden');
                basketLine.classList.remove('basket-line_hidden');
                bar.style.color = 'white';
            }
        }
        else {
            menu.classList.remove('top-header_fixed');
            menuItem.forEach(item => {
                item.classList.remove('top-header_white');
            });
            catMen.classList.remove('main-menu__list_show');
            authMenu.classList.remove('auth-menu_hidden');
            basketLine.classList.add('basket-line_hidden');
            bar.style.color = 'black';
        }
    });

    // Stars
    let stars = document.querySelectorAll('.fa-star');
    
    function removeListeners() {
        stars.forEach((item, index) => {
            //console.log('item: ', item);
            item.removeEventListener('mouseover', privatMethods.addStars(index));
            item.removeEventListener('mouseout', privatMethods2.removeStars(index));
        })
    }
    function removeClick() {
        stars.forEach((item, index) => {
            //console.log('item: ', item);
            item.removeEventListener('click', privatMethods3.clickStars(index));
        })
    }
    var handlers = {};
    const privatMethods = {
        addStars(index) {
            return handlers[index] || (handlers[index] = function (event) {
                for(let i = 0; i<= index; i++) {
                    stars[i].classList.add('fa-star_yellow'); 
                }           
                // need param index later
            });
        }
    }
    var handlers2 = {};
    const privatMethods2 = {
        removeStars(index) {
            return handlers2[index]|| (handlers2[index] = function(event) {
                for(let i = 0; i<= index; i++) {
                    stars[i].classList.remove('fa-star_yellow'); 
                } 
            })
        }
    };
    var handlers3 = {};
    const privatMethods3 = {
        clickStars(index) {
            return handlers3[index]|| (handlers3[index] = function(event) {
                removeListeners();
            for(let i = 0; i<= index; i++) {
                stars[i].classList.add('fa-star_yellow');
            }
            removeClick();
            let body = {review: index+1};
            let obj = {
                method: "POST",
                body: JSON.stringify(body),
                headers: {"Content-Type": "application/json"},
                credentials: "same-origin"
            }
            fetch('https:google.com', obj).then(response => {
                if (response.ok) return response.json();
                else return Promise.reject(response.status);
            }).then(result => {
                console.log(result);
            })
            .catch(err => console.log(err));
            })
        }
    }

    stars.forEach((item, index) => {
        item.addEventListener('mouseover', privatMethods.addStars(index));
        item.addEventListener('mouseout', privatMethods2.removeStars(index));
        item.addEventListener('click', privatMethods3.clickStars(index));
    })
});



