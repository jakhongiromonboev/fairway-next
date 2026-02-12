// pages/member/index.tsx
import React, { useEffect } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack } from '@mui/material';
import MemberMenu from '../../libs/components/member/MemberMenu';
import MemberProducts from '../../libs/components/member/MemberProducts';
import MemberEvents from '../../libs/components/member/MemberEvents';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import MemberArticles from '../../libs/components/member/MemberArticles';
import { useRouter } from 'next/router';
import { useReactiveVar, useMutation } from '@apollo/client';
import { sweetErrorHandling, sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { Message } from '../../libs/enums/common.enum';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MemberPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const category: any = router.query?.category;
	const user = useReactiveVar(userVar);

	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	useEffect(() => {
		if (!router.isReady) return;
		if (!category) {
			router.replace({ pathname: router.pathname, query: { ...router.query, category: 'products' } }, undefined, {
				shallow: true,
			});
		}
	}, [category, router]);

	const subscribeHandler = async (targetId: string, refetch: any, query: any) => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await subscribe({ variables: { input: targetId } });
			if (refetch) await refetch({ input: query });
			await sweetTopSmallSuccessAlert('Followed!', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const unsubscribeHandler = async (targetId: string, refetch: any, query: any) => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await unsubscribe({ variables: { input: targetId } });
			if (refetch) await refetch({ input: query });
			await sweetTopSmallSuccessAlert('Unfollowed!', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push('/mypage');
			else await router.push(`/member?memberId=${memberId}&category=products`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	if (device === 'mobile') return <>MEMBER PAGE MOBILE</>;

	return (
		<div id="member-page">
			<div className="container">
				<Stack className="member-page">
					<Stack className="back-frame">
						<Stack className="left-config">
							<MemberMenu subscribeHandler={subscribeHandler} unsubscribeHandler={unsubscribeHandler} />
						</Stack>
						<Stack className="main-config">
							{category === 'products' && <MemberProducts />}
							{category === 'events' && <MemberEvents />}
							{category === 'articles' && <MemberArticles />}
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

export default withLayoutBasic(MemberPage);
