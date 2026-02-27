import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Typography } from '@mui/material';
import Faq from '../../libs/components/cs/Faq';
import Notice from '../../libs/components/cs/Notice';
import Inquiry from '../../libs/components/cs/Inquiry';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import ArticleIcon from '@mui/icons-material/Article';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import EmailIcon from '@mui/icons-material/Email';

const CS: NextPage = () => {
	const device = useDeviceDetect();
	const [tab, setTab] = useState<string>('faq');

	if (device === 'mobile') return <div>CS MOBILE</div>;

	return (
		<Stack className={'cs-page'}>
			{/** ── HERO ── **/}
			<Stack className={'cs-hero'}>
				<Stack className={'container'}>
					<span className={'hero-label'}>SUPPORT CENTER</span>
					<h1 className={'hero-title'}>How Can We Help You?</h1>
					<p className={'hero-desc'}>
						Find answers to common questions, read our latest notices, or send us a direct inquiry. We're here for you.
					</p>
				</Stack>
			</Stack>

			{/** ── TAB NAV ── **/}
			<Stack className={'cs-tabs'}>
				<Stack className={'container'}>
					{[
						{ key: 'faq', label: 'FAQ', icon: <HelpOutlineIcon /> },
						{ key: 'notice', label: 'Notice', icon: <ArticleIcon /> },
						{ key: 'inquiry', label: 'Contact Us', icon: <EmailIcon /> },
					].map((t) => (
						<Stack key={t.key} className={`cs-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
							{t.icon}
							<span>{t.label}</span>
						</Stack>
					))}
				</Stack>
			</Stack>

			{/** ── CONTENT ── **/}
			<Stack className={'cs-content'}>
				<Stack className={'container'}>
					{tab === 'faq' && <Faq />}
					{tab === 'notice' && <Notice />}
					{tab === 'inquiry' && <Inquiry />}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(CS);
