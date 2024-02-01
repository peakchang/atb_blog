<script>
    export let seoValue;
</script>

<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>{seoValue.title}</title>
<meta name="title" content={seoValue.title} />
<meta name="description" content={seoValue.description} />
<link rel="icon" href={seoValue.icon} />
<meta property="og:title" content={seoValue.title} />
<meta property="og:url" content={seoValue.url} />
<meta property="og:type" content="blog" />
<meta property="og:description" content={seoValue.description} />
<meta property="og:image" content={seoValue.image} />
<meta name="date" content={seoValue.date} />
<meta property="article:published_time" content={seoValue.published_time} />
<meta name="naver-site-verification" content="aeaa8b0a95f9ad588c9ee647a0775d900b32e2ff" />
