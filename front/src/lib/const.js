// place files you want to import through the `$lib` alias in this folder.

// 건강정보,연예정보,맛집정보,분양정보,기타정보
export const category_list = [
    { link: 'health', name: '건강정보' },
    { link: 'news', name: '부동산뉴스' },
    { link: 'board', name: '자유게시판' },
]

export const siteName = '분양의모든것'

export const back_api = `${import.meta.env.VITE_SERVER_URL}/api/v3`