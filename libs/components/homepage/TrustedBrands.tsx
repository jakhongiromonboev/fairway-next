import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';

const TrustedBrands = () => {
	const device = useDeviceDetect();

	const brands = [
		{ name: 'Titleist', logo: '/img/logo/titleist.png' },
		{ name: 'Callaway', logo: '/img/logo/callaway.png' },
		{ name: 'TaylorMade', logo: '/img/logo/TaylorMade.png' },
		{ name: 'Ping', logo: '/img/logo/ping_logo.png' },
		{ name: 'Mizuno', logo: '/img/logo/mizuno.png' },
		{ name: 'Cobra', logo: '/img/logo/Cobra_Logo.PNG' },
	];

	if (device === 'mobile') {
		return (
			<Stack className={'trusted-brands'}>
				<Stack className={'container'}>
					<Box component={'div'} className={'title-box'}>
						<h3>Trusted Brands</h3>
					</Box>

					<Stack className={'logo-box'}>
						<Swiper
							className={'brand-logo-swiper'}
							slidesPerView={'auto'}
							spaceBetween={40}
							loop={true}
							speed={2500}
							autoplay={{
								delay: 0,
								disableOnInteraction: false,
								pauseOnMouseEnter: false,
								reverseDirection: false,
							}}
							modules={[Autoplay]}
							allowTouchMove={false}
							freeMode={true}
						>
							{[...brands, ...brands, ...brands].map((brand, index) => (
								<SwiperSlide key={`${brand.name}-${index}`} className={'brand-slide'}>
									<Box component={'div'} className={'logo-wrapper'}>
										<img src={brand.logo} alt={brand.name} />
									</Box>
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trusted-brands'}>
				<Stack className={'container'}>
					<Box component={'div'} className={'title-box'}>
						<h3>Trusted Brands</h3>
					</Box>

					<Stack className={'logo-box'}>
						<Swiper
							className={'brand-logo-swiper'}
							slidesPerView={'auto'}
							spaceBetween={60}
							loop={true}
							speed={3000}
							autoplay={{
								delay: 0,
								disableOnInteraction: false,
								pauseOnMouseEnter: false,
								reverseDirection: false,
							}}
							modules={[Autoplay]}
							allowTouchMove={false}
							freeMode={true}
						>
							{[...brands, ...brands, ...brands].map((brand, index) => (
								<SwiperSlide key={`${brand.name}-${index}`} className={'brand-slide'}>
									<Box component={'div'} className={'logo-wrapper'}>
										<img src={brand.logo} alt={brand.name} />
									</Box>
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default TrustedBrands;
