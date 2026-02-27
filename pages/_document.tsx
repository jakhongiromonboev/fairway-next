import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/Fairway-logo_main.png" />
				{/* SEO */}
				<meta name="keyword" content={'fairway, golf equipment, golf events, golf community, golf shop, golf korea'} />
				<meta
					name={'description'}
					content={
						'Buy golf equipment, join golf events, and connect with the golf community in South Korea. Best golf products and experiences on Fairway | ' +
						'Покупайте снаряжение для гольфа, участвуйте в турнирах и общайтесь с гольф-сообществом в Южной Корее. Лучшие товары и мероприятия на Fairway | ' +
						'대한민국에서 골프 장비를 구매하고, 골프 이벤트에 참여하고, 골프 커뮤니티와 연결하세요. Fairway에서 최고의 골프 제품과 경험을 만나보세요'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
