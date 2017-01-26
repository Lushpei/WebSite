


window.onload= function () {
    var DetailTests = {
        createTemplate: function (count) {

                var divAllContainer = document.createElement("div");
                    var divLogoContainer = document.createElement("div");
                    var spanShortName = document.createElement("span");
                    var Title = document.createElement("h3");
                    var shortDescpt = document.createElement("p");
                    var fullDescpt = document.createElement("p");
                    var button = document.createElement("button");
                    var ContExtraInfo = document.createElement("div");
                    var extraInfoTitle = document.createElement("p");
                    var extraInfoLevel = document.createElement("span");

                    divAllContainer.className = "content-tests-catalog";
                    divLogoContainer.className = "content-tests-catalog-wrapper-logo";
                    spanShortName.className = "content-tests-catalog_logo";
                    Title.className = "content-tests-catalog_title";
                    shortDescpt.className = "content-tests-catalog_short-description";
                    fullDescpt.className = "content-tests-catalog_description";
                    button.className = "content-tests-catalog_button-pass";
                    ContExtraInfo.className = "content-tests-catalog-extra";
                    extraInfoTitle.className = "tests-catalog-extra_tilte";
                    extraInfoLevel.className = "tests-catalog-extra_level";

                    divAllContainer.appendChild(divLogoContainer);
                    divLogoContainer.appendChild(spanShortName);
                    divAllContainer.appendChild(Title);
                    divAllContainer.appendChild(shortDescpt);
                    divAllContainer.appendChild(fullDescpt);
                    divAllContainer.appendChild(button);
                    ContExtraInfo.appendChild(extraInfoTitle);
                    ContExtraInfo.appendChild(extraInfoLevel);
                    divAllContainer.appendChild(ContExtraInfo);

                return divAllContainer;

        },
        
        initTemplate: function (template, data) {

            if(data){
                if (data.ShortName) {
                    lengthShortName = data.ShortName.length;
                    var span = template.querySelector(".content-tests-catalog_logo");
                    var arr = data.ShortName.split(" ");
                    if (arr.length > 1) {
                        maxLetter = arr[0].length;
                        for (var i = 0; i < arr.length; i++) {
                            span.innerText += arr[i];
                            span.innerHTML += "</br>";
                            if (maxLetter < arr[i].length) {
                                maxLetter = arr[i].length;
                            }
                        }
                        lengthShortName = maxLetter;
                    }
                    else {
                        span.innerText = data.ShortName;

                    }


                    if (lengthShortName > 0 && lengthShortName <= 2)
                    {
                        span.className += " tests-catalog_logo--big";

                    }
                    else if (lengthShortName > 2 && lengthShortName < 6) {
                       
                        span.className += " tests-catalog_logo--normal";
                    }
                    else if (lengthShortName > 5) {
                        span.className += " tests-catalog_logo--small";
                    }


                }
                if (data.FullName) {
                    var h3 = template.querySelector(".content-tests-catalog_title");
                    
                    h3.innerText = data.FullName + " - " + data.Number;
                }

                if (data.ShortDescription) {
                    var p1 = template.querySelector(".content-tests-catalog_short-description");
                    p1.innerText = data.ShortDescription;
                }

                if (data.FullDescription) {
                    var p2 = template.querySelector(".content-tests-catalog_description");
                    p2.innerText = data.FullDescription;
                }

                if (data.Level) {
                    var span2 = template.querySelector(".tests-catalog-extra_level");
                    span2.innerText = data.Level;
                }

                template.querySelector(".tests-catalog-extra_tilte").innerText = "Уровень:";
                template.querySelector(".content-tests-catalog_button-pass").innerText = "Пройти тест";
                return template;

            }
        },

        Bind : function (template){
            template.querySelector("button").addEventListener("click", function () {

                window.location = "Test.html";
            });
            return template;
        },
        
        Add:function(root, element){
            root.appendChild(element);
        },

        showPage: function (page) {
            var count =DetailTests.TestsData.length;
            var from = 0;
            var to = page * 9;

            if (page > 1) {
                from = (page - 1) * 9;
            }
            if (page * 9 > count) {
                to = count - 1;
            }

           DetailTests.containerTests.innerHTML = "";
            for (var i = from; i < to; i++) {
                var template =DetailTests.createTemplate();

                template = DetailTests.initTemplate(template, JSON.parse(DetailTests.TestsData[i]));
                template = DetailTests.Bind(template);
                DetailTests.Add(DetailTests.containerTests, template);
            }
        },

        // create skeleton
        

        Init: function (element, data) {
           DetailTests.TestsData = data;
           DetailTests.containerTests = element;
        }
    };

    var pagination = {
        // --------------------
        // Utility
        // --------------------


        // add pages by number (from [s] to [f])
        Add: function (s, f) {
            for (var i = s; i < f; i++) {
                pagination.code += "<li class='content-nav-list-item'>" +
                "<span class='content-nav-list-item_text nav-list-item_text--hidden'>" + i + "</span>" +
                "<a class='content-nav-list-item_link' href='#'>" + i + "</a> </li>";
            }
        },

        // add last page with separator
        Last: function (separator) {
            pagination.code += "<li class='content-nav-list-item'>" +
                        "<span class='content-nav-list-item_text  nav-list-item_text--hidden'>" + separator + "</span>" +
            "<a class='content-nav-list-item_link' href='#'>...</a> </li>" +
                "<li class='content-nav-list-item'>" +
                        "<span class='content-nav-list-item_text nav-list-item_text--hidden'>" + pagination.size + "</span>" +
            "<a class='content-nav-list-item_link' href='#'>" + pagination.size + "</a> </li>";

            //'<i>...</i><a>' + pagination.size + '</a>';
        },

        // add first page with separator
        First: function (separator) {
            pagination.code += "<li class='content-nav-list-item'>" +
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
            pagination.page = +this.innerHTML || +this.parentNode.querySelector("span").innerHTML;
           DetailTests.showPage(+pagination.page);
            pagination.Start();
        },

        // previous page
        Prev: function () {
            pagination.page--;
            if (pagination.page < 1) {
                pagination.page = 1;
            }
           DetailTests.showPage(pagination.page);
            pagination.Start();
        },

        // next page
        Next: function () {
            pagination.page++;
            if (pagination.page > pagination.size) {
                pagination.page = pagination.size;
            }
           DetailTests.showPage(pagination.page);
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
                pagination.Add(1, pagination.size + 1);
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
            pagination.size = Math.ceil(data.length / 9) || 1; // pages size
            pagination.page = 1;                // selected page
            pagination.step = 2;               // pages before and after current
        },

        // init
        Init: function (e, data) {
           DetailTests.showPage(1);
            pagination.SetParam(data);
            pagination.Create(e);
            pagination.Start();

        }
    };






    var prom = new Promise(function (ok, error) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:53718/api/listTests', true);
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
         function (result) {
             var nav = document.querySelector(".content-nav");
             var divTests = document.querySelector(".content-tests-catalogs");
            DetailTests.Init(divTests, result);
             pagination.Init(nav, result);
         },
         function (error) {
             // вторая функция - запустится при вызове reject
             alert("Rejected: " + error); // error - аргумент reject
         }
       );
};
