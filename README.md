📅 &nbsp;기간 : 2023-11-13 ~ 2023-12-31 \
📚 &nbsp;목적 : 포켓몬 가이드북은 어린 시절의 추억을 회상하고자 만들어진 프로젝트입니다.<br>

<hr/>

## 📌실행방법

<code>client</code>

```
guidebook/client/npm i 
guidebook/client/npm start
```

<code>server</code>

```
guidebook/server/npm i
guidebook/server/src/node server.js
```

## 📌폴더구조
```
client
📦src
 ┣ 📂atom
 ┃ ┗ 📜pokemonState.js
 ┣ 📂components
 ┃ ┣ 📂Characteristic
 ┃ ┃ ┗ 📜Characteristic.js
 ┃ ┣ 📂Footer
 ┃ ┃ ┣ 📜Footer.css
 ┃ ┃ ┗ 📜Footer.js
 ┃ ┣ 📂Header
 ┃ ┃ ┣ 📜Header.css
 ┃ ┃ ┗ 📜Header.js
 ┃ ┣ 📂InformationType
 ┃ ┃ ┗ 📜InformationType.js
 ┃ ┣ 📂NoResultsPage
 ┃ ┃ ┣ 📜NoResultsPage.css
 ┃ ┃ ┗ 📜NoResultsPage.js
 ┃ ┗ 📂Search
 ┃ ┃ ┣ 📜Search.css
 ┃ ┃ ┗ 📜Search.js
 ┣ 📂pages
 ┃ ┣ 📂Edit
 ┃ ┃ ┣ 📜Edit.css
 ┃ ┃ ┗ 📜Edit.js
 ┃ ┣ 📂Evolution
 ┃ ┃ ┣ 📜Evolution.css
 ┃ ┃ ┗ 📜Evolution.js
 ┃ ┣ 📂Home
 ┃ ┃ ┣ 📜Home.css
 ┃ ┃ ┗ 📜Home.js
 ┃ ┣ 📂Information
 ┃ ┃ ┣ 📜Information.css
 ┃ ┃ ┗ 📜Information.js
 ┃ ┗ 📂Registration
 ┃ ┃ ┣ 📜Registration.css
 ┃ ┃ ┗ 📜Registration.js
 ┣ 📂utils
 ┃ ┣ 📜SelectCustomStyles.js
 ┃ ┗ 📜Validation.js
 ┣ 📜index.css
 ┗ 📜index.js

server
 📦src
 ┗ 📜server.js
```