(function () {
    navigator.sayswho = (function () {
        var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    })();



    var Gallery = {
        
        showPage:   function (page) {
            var count = Gallery.pathImages.length;
            var from=0;
            var to = page * 9;
            
            if (page > 1) {
                from=(page - 1) * 9;
            }
            if(page * 9 > count ){
                to = count-1;
            }

            Gallery.containerImages.innerHTML = "";
            var nameBrowser=  navigator.sayswho;
            for (var i = from; i < to; i++) {
                var a = document.createElement("a");
                var img = document.createElement("img");
                img.className = "content-gallery-link_img";
                img.src = "../img/gallery/" + Gallery.pathImages[i];
                a.className = "content-gallery-link";
                
                a.appendChild(img);
                Gallery.containerImages.appendChild(a);
                img.onload = function (event) {
                    var img = event.target;
                    var wide = img.naturalWidth / img.naturalHeight;
                    if ( wide>1) {
                        img.className = "content-gallery-link_wide-img";
                        var a32 = 1;
                }
                else {
                    img.className = "content-gallery-link_thin-img";
                    }

                     

                    if ("IE".indexOf("IE")>=0 && img.clientWidth>300) {
                        img.style.margin="0 -"+ (img.clientWidth-300)/2+"px";
                    }
                    else if ("IE".indexOf("IE")>=0  && img.clientHeight > 300) {
                        img.style.margin = "-" + (img.clientHeight - 300) / 2 + "px 0";
                    }
                };
                //Gallery.containerImages.innerHTML+=" "+i+" ";
            }
        },
        Init:function(element,data){
            Gallery.pathImages=data;
            Gallery.containerImages=element;
        }
    };

      var  pagination= {
            // --------------------
            // Utility
            // --------------------


            // add pages by number (from [s] to [f])
            Add: function (s, f) {
                for (var i = s; i < f; i++) {
                    pagination.code += "<li class='content-nav-list-item'>" +
                    "<span class='content-nav-list-item_text nav-list-item_text--hidden'>" + i + "</span>"+
                    "<a class='content-nav-list-item_link' href='#'>" + i + "</a> </li>";
                }
            },

            // add last page with separator
            Last: function (separator) {
                pagination.code += "<li class='content-nav-list-item'>" +
                            "<span class='content-nav-list-item_text  nav-list-item_text--hidden'>"+separator+"</span>" +
                "<a class='content-nav-list-item_link' href='#'>...</a> </li>" +
                    "<li class='content-nav-list-item'>" +
                            "<span class='content-nav-list-item_text nav-list-item_text--hidden'>" + pagination.size + "</span>"+
                "<a class='content-nav-list-item_link' href='#'>" + pagination.size + "</a> </li>";

                    //'<i>...</i><a>' + pagination.size + '</a>';
            },

            // add first page with separator
            First: function (separator) {
                pagination.code +="<li class='content-nav-list-item'>"+
                    "<span class='content-nav-list-item_text nav-list-item_text--hidden'>1</span>" +
                "<a class='content-nav-list-item_link ' href='#'>" + 1 + "</a> </li>" +
                "<li class='content-nav-list-item'>" + "<span class='content-nav-list-item_text nav-list-item_text--hidden'>" + separator + "</span>" +
                    "<a class='content-nav-list-item_link' href='#'>...</a></li>";
                //pagination.code += '<a>1</a><i>...</i>';
            },



            // --------------------
            // Handlers
            // --------------------

            // change page
            Click: function () {
                pagination.page = +this.innerHTML||+this.parentNode.querySelector("span").innerHTML;
                Gallery.showPage(+pagination.page);
                pagination.Start();
            },

            // previous page
            Prev: function () {
                pagination.page--;
                if (pagination.page < 1) {
                    pagination.page = 1;
                }
                Gallery.showPage(pagination.page);
                pagination.Start();
            },

            // next page
            Next: function () {
                pagination.page++;
                if (pagination.page > pagination.size) {
                    pagination.page = pagination.size;
                }
                    Gallery.showPage(pagination.page);
                pagination.Start();
            },



            // --------------------
            // Script
            // --------------------
          
            // binding pages
            Bind: function () {
                var li = pagination.ul.getElementsByTagName('li');
                for (var i = 0; i < li.length; i++) {
                    var a = li[i].querySelector("a");
                    if (+a.innerHTML === pagination.page) {
                        li[i].querySelector("a").className = "nav-list-item_link--hidden";
                        li[i].querySelector("span").className = "content-nav-list-item_text";
                        li[i].className += ' nav-list-item--active';
                    }
                    a.addEventListener('click', pagination.Click, false);
                }
            },

            // write pagination
            Finish: function () {
                pagination.ul.innerHTML = pagination.code;
                pagination.code = '';
                pagination.Bind();
            },

            // find pagination type
            Start: function () {

                if (pagination.size < pagination.step * 2 + 2) {
                    pagination.Add(1, pagination.size+1);
                }

               else if (pagination.page < pagination.step * 2 + 2) {
                    pagination.Add(1, pagination.page + pagination.step + 1);
                    pagination.Last(pagination.page + pagination.step + 1);
                }


                else if (pagination.page > pagination.size - pagination.step * 2) {
                    pagination.First(pagination.size - pagination.step * 2 - 3);
                    pagination.Add(pagination.size - pagination.step * 2 - 2, pagination.size + 1);
                }
                else {
                    pagination.First(pagination.page - (pagination.step + 1));
                    pagination.Add(pagination.page - pagination.step, pagination.page + pagination.step + 1);
                    pagination.Last(pagination.page + pagination.step + 1);
                }
                pagination.Finish();
            },



            // --------------------
            // Initialization
            // --------------------

            // binding buttons
            Buttons: function (e) {
                var nav = e.getElementsByTagName('a');
                nav[0].addEventListener('click', pagination.Prev, false);
                nav[1].addEventListener('click', pagination.Next, false);
            },

            // create skeleton
            Create: function (e) {

                var html = [
                    "<a class='content-nav_button' href='#'>&#9668;</a>", // previous button
                    "<ul class='content-nav-list'></ul>",  // pagination container
                    "<a class='content-nav_button' href='#'>&#9658;</a>"  // next button
                ];

                e.innerHTML = html.join('');
                pagination.ul = e.getElementsByTagName('ul')[0];
                pagination.Buttons(e);
            },

          // converting initialize data
            SetParam: function (data) {
                data = data || [];
                pagination.srcPhotos = data;
                pagination.size = Math.ceil(data.length/9) || 1; // pages size
                pagination.page = 1;                // selected page
                pagination.step = 2;               // pages before and after current
            },

            // init
            Init: function (e, data) {
                Gallery.showPage(1);
                pagination.SetParam(data);
                pagination.Create(e);
                pagination.Start();

            }
        }
    
        




        var prom = new Promise(function (ok, error) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://localhost:53718/api/img', true);
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
                   window.setTimeout(error, 2000);
                }
            };
        });

            prom.then(
            function(result) {
                var nav = document.querySelector(".content-nav");
                var divGallery = document.querySelector(".content-gallery-links");
                Gallery.Init(divGallery, result);
                pagination.Init(nav, result);
            },
            function (error) {
                // вторая функция - запустится при вызове reject
                alert("Rejected: " + error); // error - аргумент reject
            }
          );
})();
