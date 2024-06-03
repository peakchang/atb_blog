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

*/