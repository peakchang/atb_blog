import mysql, {} from "mysql2"
import dotenv from "dotenv"
dotenv.config();


export const sql_con = mysql.createConnection({
    host: process.env.HOST || '127.0.0.1',
    user: 'root',
    password: process.env.DBPWD,
    database: process.env.SHEMA
})


/*

CREATE DATABASE atb default CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE DATABASE happy_toad default CHARACTER SET UTF8;
CREATE DATABASE joy_shark default CHARACTER SET UTF8;

CREATE TABLE IF NOT EXISTS config(
    cf_base VARCHAR(10),
    cf_pwd VARCHAR(255)
);

INSERT INTO config (cf_base) VALUES ('base');


land_view
free_board

이후 게시판은 계속 늘릴수 있게~

예를들어서 스쿠버다이빙 게시판 (투어 후기.... 이것저것 게시판~) / 프리다이빙 게시판 / 공지 게시판

CREATE TABLE IF NOT EXISTS board(
    bo_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    bo_category VARCHAR(255),
    bo_subject VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    bo_content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    bo_created_at DATETIME,
    bo_updated_at DATETIME
);


// bo_main_img는 필요 없는 컬럼이지만 부동산 글이랑 합치기 위해서 당분간만 쓰자~ atb에서만 쓸거임!
CREATE TABLE IF NOT EXISTS free_board(
    bo_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    bo_type VARCHAR(50),
    bo_category VARCHAR(255),
    bo_subject VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    bo_content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    bo_main_img VARCHAR(50),
    bo_show_type VARCHAR(50),
    bo_created_at DATETIME,
    bo_updated_at DATETIME
);


RENAME TABLE view TO land_board;
ALTER TABLE free_board ADD COLUMN bo_show_type VARCHAR(50) AFTER bo_main_img;
ALTER TABLE land_board ADD COLUMN bo_show_type VARCHAR(50) AFTER bo_floor_plan;

ALTER TABLE land_board ADD COLUMN bo_add_content TEXT AFTER bo_description;
ALTER TABLE land_board MODIFY COLUMN bo_add_content TEXT;

UPDATE land_board SET bo_show_type = 'land_board';




CREATE TABLE IF NOT EXISTS reply(
    re_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    re_type VARCHAR(50) NOT NULL,
    re_parent VARCHAR(10) NOT NULL,
    re_re_parent VARCHAR(10),
    re_ip VARCHAR(50),
    re_content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    re_created_at DATETIME
);

CREATE TABLE IF NOT EXISTS sub_board(
    sb_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sb_domain VARCHAR(255),
    sb_subject VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    sb_content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    sb_created_at DATETIME,
    sb_updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS site(
    st_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    st_name VARCHAR(100),
    st_house_num VARCHAR(50),
    st_area_size VARCHAR(50),
    st_scale VARCHAR(50),
    st_constructer VARCHAR(50),
    st_construct_date VARCHAR(100),
    st_developer VARCHAR(50),
    st_supply_location VARCHAR(50),
    st_movein_date VARCHAR(50),
    st_inquiry VARCHAR(50),
    st_parcel_price VARCHAR(50),
    st_description TEXT,
    st_main_img VARCHAR(255),
    st_imgs TEXT,
    st_floor_plan TEXT,
    st_created_at DATETIME,
    st_updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS site_visit(
    sv_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sv_domain VARCHAR(255),
    sv_ip VARCHAR(50),
    sv_ua VARCHAR(255),
    sv_referrer VARCHAR(255),
    sv_created_at DATETIME
);



CREATE TABLE IF NOT EXISTS board_ready(
    br_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    br_subject VARCHAR(255),
    br_category VARCHAR(50),
    br_imgs VARCHAR(255),
    br_date DATE
);


// 250121 추가!!!!

/api/v3/moveboard
링크로 들어가서 게시판 내용 다 옮기기!!

RENAME TABLE free_board TO board;

RENAME TABLE land_board TO view;

ALTER TABLE view
ADD COLUMN bo_name varchar(255)
AFTER bo_type;

ALTER TABLE view
RENAME COLUMN bo_housenum TO bo_house_num;


ALTER TABLE board
ADD COLUMN bo_name varchar(255),
ADD COLUMN bo_housenum varchar(50),
ADD COLUMN bo_area_size varchar(50),
ADD COLUMN bo_scale varchar(50),
ADD COLUMN bo_constructer varchar(50),
ADD COLUMN bo_construct_date varchar(100),
ADD COLUMN bo_developer varchar(50),
ADD COLUMN bo_supply_location varchar(50),
ADD COLUMN bo_movein_date varchar(50),
ADD COLUMN bo_inquiry varchar(50),
ADD COLUMN bo_parcel_price varchar(50),
ADD COLUMN bo_description text,
ADD COLUMN bo_add_content text,
ADD COLUMN bo_imgs text,
ADD COLUMN bo_floor_plan text
AFTER bo_type;



ALTER TABLE site
RENAME COLUMN st_id TO bo_id,
RENAME COLUMN st_name TO bo_name,
RENAME COLUMN st_house_num TO bo_house_num,
RENAME COLUMN st_area_size TO bo_area_size,
RENAME COLUMN st_scale TO bo_scale,
RENAME COLUMN st_constructer TO bo_constructer,
RENAME COLUMN st_construct_date TO bo_construct_date,
RENAME COLUMN st_developer TO bo_developer,
RENAME COLUMN st_supply_location TO bo_supply_location,
RENAME COLUMN st_movein_date TO bo_movein_date,
RENAME COLUMN st_inquiry TO bo_inquiry,
RENAME COLUMN st_parcel_price TO bo_parcel_price,
RENAME COLUMN st_description TO bo_description,
RENAME COLUMN st_main_img TO bo_main_img,
RENAME COLUMN st_imgs TO bo_imgs,
RENAME COLUMN st_floor_plan TO bo_floor_plan,
RENAME COLUMN st_created_at TO bo_created_at,
RENAME COLUMN st_updated_at TO bo_updated_at;



ALTER TABLE site
ADD COLUMN bo_type varchar(10)
AFTER bo_id;

ALTER TABLE site
ADD COLUMN bo_category varchar(255),
ADD COLUMN bo_content varchar(255)
AFTER bo_type;

ALTER TABLE site ADD COLUMN bo_add_content TEXT;


ALTER TABLE site ADD COLUMN bo_type varchar(50) AFTER bo_id;
ALTER TABLE site ADD COLUMN bo_show_type varchar(50) AFTER bo_imgs;

ALTER TABLE board
ADD COLUMN bo_name varchar(255)
AFTER bo_type;

ALTER TABLE board
ADD COLUMN bo_name varchar(255)
AFTER bo_type;

ALTER TABLE board
RENAME COLUMN bo_housenum TO bo_house_num;

ALTER TABLE board MODIFY bo_main_img VARCHAR(255);


UPDATE site SET bo_show_type = 'site';
UPDATE board SET bo_show_type = 'board';



CREATE TABLE IF NOT EXISTS write_reserve(
    bo_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    bo_category        	varchar(255),
    bo_subject         	varchar(255),
    bo_content         	text, 
    bo_type            	varchar(10),
    bo_name            	varchar(255),
    bo_house_num       	varchar(50),
    bo_area_size       	varchar(50),
    bo_scale           	varchar(50),
    bo_constructer     	varchar(50),
    bo_construct_date  	varchar(100),
    bo_developer       	varchar(50),
    bo_supply_location 	varchar(50),
    bo_movein_date     	varchar(50),
    bo_inquiry         	varchar(50),
    bo_parcel_price    	varchar(50),
    bo_description     	text,
    bo_add_content     	text,
    bo_main_img        	varchar(255),
    bo_imgs            	text,
    bo_floor_plan      	text,
    bo_table_name   varchar(10),
    bo_memo   varchar(255)
);


*/