(function(){

    slider = {
        slideIndex: 1,



        setParam: function (data) {
            data = data || [];
            slider.srcPhotos = data;
            slider.size = data.length || 1; // imgs size
            slider.indexImg = 1;            // selected img
        },

        Create: function (e) {
            var content = document.querySelector(".content");
            var contentSlider = document.createElement("div");
            var contentSliderNavWrapper = document.createElement("div");
            var contentSliderNav = document.createElement("div");
            contentSlider.className = "content-slider";
            contentSliderNavWrapper.className = "content-slider-nav-wrapper";
            contentSliderNav.className = " content-slider-nav ";
            contentSliderNavWrapper.appendChild(contentSliderNav);
            contentSlider.appendChild(contentSliderNavWrapper);
            content.insertBefore(contentSlider, content.firstChild);
            slider.container = contentSlider;

        },
        AddPhotos: function (data) {
            for (var i = 0; i < data.length; i++) {
                var img = document.createElement("img");
                img.className = "content-slider_img";
                if (i===1) {
                    img.className += " slider_img--active";
                }
                img.src = "img/slider/mini/" + data[i];
                img.setAttribute("data-number", i+1);
                slider.container.insertBefore(img, slider.container.firstChild);
            }
        },

        AddDots: function (data) {
            var contentSliderNav = slider.container.querySelector(".content-slider-nav");
            for (var i = 0; i < data.length; i++) {
                var span = document.createElement("span");
                span.className = "content-slider-nav_link";
                if (i === 1) {
                    span.className += " slider-nav_link--active";
                }
                span.setAttribute("data-number",i+1);
                contentSliderNav.appendChild(span);
            }
        },

        AddButtons:function(data){
            var leftNavButton=document.createElement("div");
            leftNavButton.innerText="❮";
            leftNavButton.className = "content-slider_b slider_b--prev";
            var rightNavButton = document.createElement("div");
            rightNavButton.innerText = "❯";
            rightNavButton.className = "content-slider_b slider_b--next";
            slider.container.appendChild(leftNavButton);
            slider.container.appendChild(rightNavButton);
        },

        Prev: function () {
            slider.indexImg--;
            slider.showImg(+slider.indexImg);
        },

        // next img
        Next: function () {
            slider.indexImg++;
            slider.showImg(+slider.indexImg);
        },

        Click: function () {
            slider.indexImg = +this.getAttribute("data-number");
            slider.showImg(+slider.indexImg);
        },


        showImg: function (n) {
            if (slider.indexImg > slider.size) {
                slider.indexImg = 1;
            }
            else if (slider.indexImg < 1) {
                slider.indexImg = slider.size;
            }

            var imgActive= slider.container.querySelector(".slider_img--active");
            imgActive.className = "content-slider_img";
            var imgChose = slider.container.querySelector(".content-slider_img[data-number=\"" + slider.indexImg + "\"]");
            imgChose.className = "content-slider_img slider_img--active";
            
            var dotActive = slider.container.querySelector(".slider-nav_link--active");
            dotActive.className = "content-slider-nav_link";
            var dotChose = slider.container.querySelector(".content-slider-nav_link[data-number=\"" + slider.indexImg + "\"]");
            dotChose.className = "content-slider-nav_link slider-nav_link--active";

        },

        Bind: function () {
            var navButtonPrev = slider.container.querySelector(".slider_b--prev");
            var navButtonNext = slider.container.querySelector(".slider_b--next");
            var spanNavLinks = slider.container.querySelectorAll(".content-slider-nav_link");
            navButtonPrev.addEventListener("click", slider.Prev);
            navButtonNext.addEventListener("click", slider.Next);
            for (var i = 0; i < spanNavLinks.length; i++) {
                spanNavLinks[i].addEventListener("click", slider.Click);
            }
        },



        Start: function (data) {
            slider.AddPhotos(data);
            slider.AddButtons(data);
            slider.AddDots(data);
            slider.Bind();
        },


        Init: function (e, data) {
            slider.setParam(data);
            slider.Create(e);
            slider.Start(data);
        }
    };




    var prom = new Promise(function (ok, error) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:53718/api/sliderImages', true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }

            if (xhr.status !== 200) {
                alert(xhr.status + " : " + xhr.statusText); console.log(xhr.readyState);
            }

            else {
                var arr = JSON.parse(xhr.responseText);
                ok(arr);
                window.setTimeout(error, 20000);
            }
        };
    });

    prom.then(
    function(result) {
        var nav = document.querySelector(".content");
        slider.Init(nav, result);
    },
    function(result){
        // вторая функция - запустится при вызове reject
        alert("Rejected: " + error); // error - аргумент reject
    }
  );
})();