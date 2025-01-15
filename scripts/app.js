//IIFE - Immediately Invoked Functional Expression
"use strict";
(function() {

    function DisplayHomePage() {
        console.log("Calling DisplayHomePage()...");

        let AboutUsBtn = document.getElementById("AboutUsBtn");
        AboutUsBtn.addEventListener("click", function() {
            location.href="about.html";
        });

        let MainContent = document.getElementsByTagName("main")[0];
        let MainParagraph = document.createElement("p");
        MainParagraph.setAttribute("id", "mainParagraph");
        MainParagraph.setAttribute("class", "mt-3");
        MainParagraph.textContent = "Main Paragraph Content is right here";
        
        MainContent.appendChild(MainParagraph);

        let FirstString = "This is";
        let SecondString = `${FirstString} the main Paragraph`;
        MainParagraph.textContent = SecondString;
        MainContent.appendChild(MainParagraph);

        let DocumentBody = document.body;
        let Article = document.createElement("Article");
        let ArticleParagraph = `<p id="ArticleParagraph" class="mt-3">This is my article paragraph...</p>`;
        Article.innerHTML = ArticleParagraph;

        Article.setAttribute("class", "container");

        DocumentBody.appendChild(Article);

    }
    function DisplayAbout() {
        console.log("Calling DisplayAbout()...");
    }

    function DisplayProducts() {
        console.log("Calling DisplayProducts()...");
    }
    function DisplayServices() {
        console.log("Calling DisplayServices()...");
    }
    function DisplayContact() {
        console.log("Calling DisplayContact()...");
    }
    function Start() {
        console.log("Starting...");

        switch(document.title) {
            case "Home": 
                DisplayHomePage();
                break;
            case "About":
                DisplayAbout();
                break;
            case "Products":
                DisplayProducts();
                break;
            case "Services":
                DisplayServices();
                break;
            case "Contact":
                DisplayContact();
                break;
        }
    }window.addEventListener("load", Start);
})()
// Last two brackets makes the function immediately call itself

