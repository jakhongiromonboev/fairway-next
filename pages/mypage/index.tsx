import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import MyProfile from '../../libs/components/mypage/MyProfile';
import MyProducts from '../../libs/components/mypage/MyProducts';
import AddProduct from '../../libs/components/mypage/AddProduct';
import MyEvents from '../../libs/components/mypage/MyEvents';
import AddEvent from '../../libs/components/mypage/AddEvent';
import MyFavorites from '../../libs/components/mypage/MyFavorites';
import MyVisited from '../../libs/components/mypage/MyVisited';
import MyReservations from '../../libs/components/mypage/MyReservations';
import MyArticles from '../../libs/components/mypage/MyArticles';
import WriteArticle from '../../libs/components/mypage/WriteArticle';
import MyMenu from '../../libs/components/mypage/MyMenu';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { sweetErrorHandling } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { useMutation } from '@apollo/client';
import { T } from '../../libs/types/common';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MyPage: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const category: string = (router.query?.category as string) ?? 'myProfile';

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!user._id) router.push('/').then();
	}, [user]);

	/** HANDLERS **/
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			await subscribe({ variables: { input: id } });
			if (refetch) await refetch({ input: query });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			await unsubscribe({ variables: { input: id } });
			if (refetch) await refetch({ input: query });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	if (device === 'mobile') {
		return <div>MY PAGE MOBILE</div>;
	}

	return (
		<div id="my-page">
			<div className="container">
				<Stack className={'my-page'}>
					<Stack className={'back-frame'}>
						{/* LEFT SIDEBAR */}
						<Stack className={'left-config'}>
							<MyMenu />
						</Stack>

						{/* RIGHT CONTENT */}
						<Stack className={'main-config'}>
							{category === 'myProfile' && <MyProfile />}
							{category === 'myProducts' && <MyProducts />}
							{category === 'addProduct' && <AddProduct />}
							{category === 'myEvents' && <MyEvents />}
							{category === 'addEvent' && <AddEvent />}
							{category === 'myFavorites' && <MyFavorites />}
							{category === 'myVisited' && <MyVisited />}
							{category === 'myReservations' && <MyReservations />}
							{category === 'myArticles' && <MyArticles />}
							{category === 'writeArticle' && <WriteArticle />}
							{category === 'followers' && (
								<MemberFollowers
									subscribeHandler={subscribeHandler}
									unsubscribeHandler={unsubscribeHandler}
									redirectToMemberPageHandler={redirectToMemberPageHandler}
								/>
							)}
							{category === 'followings' && (
								<MemberFollowings
									subscribeHandler={subscribeHandler}
									unsubscribeHandler={unsubscribeHandler}
									redirectToMemberPageHandler={redirectToMemberPageHandler}
								/>
							)}
						</Stack>
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutBasic(MyPage);
