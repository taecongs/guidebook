CREATE DATABASE guidebook;
use guidebook;

CREATE TABLE guidebook(
   id varchar(10) not null primary key,
   name varchar(20) not null,
   detail varchar(255) not null,
   type1 varchar(255) not null,
   type2 varchar(255),
   height varchar(255) not null,
   category varchar(255) not null,
   gender varchar(10) not null,
   weight varchar(255) not null,
   characteristic varchar(255) not null,
   image MEDIUMBLOB
);

INSERT INTO guidebook (id,name,detail,type1,type2,height,category,gender,weight,characteristic, image) VALUES ("No.0001","이상해씨","태어나서부터 얼마 동안은 등의 씨앗으로부터 영양을 공급받아 크게 성장한다.","풀","독","0.7","씨앗포켓몬","남자","6.9","심록","https://data1.pokemonkorea.co.kr/newdata/pokedex/full/000101.png");


DROP TABLE guidebook;
desc guidebook;

SELECT * FROM guidebook;

