

window.onload = function () {
    var Tests = {

        createTemplate: function (count) {

            var divAllContainer = document.getElementsByClassName("test-content-questions")[0];
            var divButton=document.getElementsByClassName("test-content-buttons")[0];
                var divAnswers = document.createElement("div");
                divAnswers.className="test-content-answers";
                var divQuestion = document.createElement("div");
                var pQuestionText = document.createElement("p");

                divQuestion.className = "test-content-question";
                pQuestionText.className = "test-content-question_text";

                divQuestion.appendChild(pQuestionText);
                divAllContainer.appendChild(divQuestion);
            for (var i = 0; i < count; i++) {

                var divAnswer = document.createElement("div");
                var input = document.createElement("input");
                var labelAnswer = document.createElement("label");
                var spanCircle = document.createElement("span");
                var spanAnswersText = document.createElement("span");


                divAnswer.className="test-content-answer";
                input.setAttribute("number",i+1);
                input.id = "ch" + i+1;
                input.type = "checkbox";
                labelAnswer.className = "test-content-answer-label";
                labelAnswer.setAttribute("for", "ch"+i+1);
                spanCircle.className="test-content-answer-label_circle";
                spanAnswersText.className = "test-content-answers_text";
                
                labelAnswer.appendChild(spanCircle);
                labelAnswer.appendChild(spanAnswersText);
                divAnswer.appendChild(input);
                divAnswer.appendChild(labelAnswer);
                divAnswers.appendChild(divAnswer);
            }
            divAllContainer.appendChild(divAnswers);
                return divAllContainer;
        },

        initTemplate: function (template, data) {
            if (data) {
                if (data.Name) {
                    document.querySelector(".exam-text").innerText = data.Name;
                }

                if (data.Quastion) {
                    template.querySelector(".test-content-question_text").innerText = data.Quastion;
                }
                if (data.Answers && data.Answers.length>1) {
                for (var i = 0; i < data.Answers.length; i++) {
                    var el = template.querySelector("input[number='"+(i+1)+"'] + label .test-content-answers_text");
                    el.innerText = data.Answers[i];
                }
            }
                return template;
            }
        },

        CheckAnswers:function(answers){
            var prom = new Promise(function (ok, error) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'http://localhost:53718/api/checkAnswers/' + answers, true);
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
                     alert("DONE: " + result);
                     Tests.showResult(result);
                 },
                 function (error) {
                     alert("Rejected: " + error); // error - аргумент reject
                 }
               );
        },

        showResult:function(result){
            var container = document.getElementsByClassName("test-content")[0];
            container.innerHTML = "";
            container.style.textAlign = "center";
            var h1 = document.createElement("h1");
            h1.innerText= "ВАШ РЕЗУЛЬТАТ!!!";
            var p1 = document.createElement("p");
            var p2 = document.createElement("p");
            var span = document.createElement("span");
            p1.innerText = "Вы набрали: " + result + " из " + Tests.TestsData.length + " возможных баллов!";
            p2.innerText = "Ваше время:";
            span.innerText = document.getElementsByClassName("tile-menu-item_link")[1].innerText;
            p2.appendChild(span);
            document.getElementsByClassName("tile-menu-item item--timer")[0].innerHTML = "";
            container.appendChild(h1);
            container.appendChild(p1);
            container.appendChild(p2);
            
        },

        Bind: function (template) {
            document.querySelector(".test-content-buttons_finish-exam").onclick= function (e) {
                e.stopPropagation();
                console.log("well done");
                var answers = localStorage.getItem("test");

                if (!answers) {
                     Tests.TestsAnswers = {};
                     for (var i = 0; i < Tests.TestsData.length; i++) {
                    Tests.TestsAnswers["ans"+(i+1)] = "";
                }
                answers= JSON.stringify(Tests.TestsAnswers);
                }

                Tests.CheckAnswers(answers);
                document.querySelector(".link-time").className = "tile-menu-item_link";
            };
            
            var inputs=document.querySelectorAll(".test-content-answer input");
            for (var i = 0; i < inputs.length; i++) {

                inputs[i].addEventListener("change", function (e) {
                    var numberTest ="ans"+ parseInt(document.getElementsByClassName("nav-list-item--active")[0].innerText);
                    var numberAnswer = "";

                    var inputChecked= document.querySelectorAll(".test-content-answer input:checked");
                    for (var i = 0; i < inputChecked.length; i++) {
                        numberAnswer = inputChecked[i].getAttribute("number");
                    }
                    Tests.TestsAnswers[numberTest] = numberAnswer;

                    localStorage.setItem("test", JSON.stringify(Tests.TestsAnswers));

                    e.preventDefault();
                }, false);
            }
        },
        StartTimer:function(){
            var minute = 29;
            var sec = 59;
            function addTime(){
                    sec--;
                    if(sec == 00)
                    {
                        if (minute == 0 && sec == 00)
                        {
                            document.getElementsByClassName("link-time")[0].innerHTML = "00:00:00";
                            return;

                            //post query to the server

                        }
                        minute--;
                        sec = 60;
                    }
                    stringSec = parseFloat(sec) < 10 ? "0" + sec : sec;
                    stringMinute = parseFloat(minute) < 10 ? "0" + minute : minute;
                    var time=document.getElementsByClassName("link-time")[0];
                    if (time) {
                        time.innerHTML = "00:" + stringMinute + ":" + stringSec;
                        setTimeout(addTime, 500);
                    }
            }
           setTimeout(addTime, 500);
        },

        Add: function (root, element) {
            root.appendChild(element);
        },

        showPage: function (page) {
            page -= 1;
            var count = JSON.parse(Tests.TestsData[page]).Answers.length;
         

               //Tests.containerTests.innerHTML = "";
            document.getElementsByClassName("test-content-questions")[0].innerHTML = "";
               var template = Tests.createTemplate(count);

                template = Tests.initTemplate(template, JSON.parse(Tests.TestsData[page]));
                Tests.Bind();
                Tests.Add(Tests.containerTests, template);
        },

        // create skeleton


        Init: function (element, data) {
            
            Tests.TestsData = data;
           
            Tests.containerTests = element;
            Tests.StartTimer();
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
            Tests.showPage(+pagination.page);
            pagination.Start();
        },

        // previous page
        Prev: function () {
            pagination.page--;
            if (pagination.page < 1) {
                pagination.page = 1;
            }
            Tests.showPage(pagination.page);
            pagination.Start();
        },

        // next page
        Next: function () {
            pagination.page++;
            if (pagination.page > pagination.size) {
                pagination.page = pagination.size;
            }
            Tests.showPage(pagination.page);
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
            pagination.size = data.length; // pages size
            pagination.page = 1;                // selected page
            pagination.step = 2;               // pages before and after current
        },

        // init
        Init: function (e, data) {
            Tests.showPage(1);
            pagination.SetParam(data);
            pagination.Create(e);
            pagination.Start();

        }
    };






    var prom = new Promise(function (ok, error) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:53718/api/questionsTests', true);
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
             var divTests = document.querySelector(".test-content");
             Tests.Init(divTests, result);
             pagination.Init(nav, result);
         },
         function (error) {
             // вторая функция - запустится при вызове reject
             alert("Rejected: " + error); // error - аргумент reject
         }
       );
};
