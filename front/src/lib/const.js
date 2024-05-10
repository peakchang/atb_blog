// place files you want to import through the `$lib` alias in this folder.

// 건강정보,연예정보,맛집정보,분양정보,기타정보
export const category_list = [
    { link: 'health', name: '건강뉴스', type: 'img', db: 'land_board' },
    { link: 'estate', name: '기타뉴스', type: 'board', db: 'land_board' },
    { link: 'news', name: '분양정보', type: 'img', db: 'land_board' },
    { link: 'board', name: '게시판', type: 'img', db: 'free_board' },
]

export const siteName = '분양의모든것'

export const back_api = `${import.meta.env.VITE_SERVER_URL}/api/v3`