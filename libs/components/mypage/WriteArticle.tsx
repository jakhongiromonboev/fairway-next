import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const TuiEditor = dynamic(() => import('../community/TuiEditor'), { ssr: false });

const WriteArticle: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <>WRITE ARTICLE MOBILE</>;
	}

	return (
		<div id="write-article-page">
			<Stack className="page-header">
				<Typography className="page-title">Write an Article</Typography>
				<Typography className="page-subtitle">Share your golf tips, news and reviews!</Typography>
			</Stack>
			<TuiEditor />
		</div>
	);
};

export default WriteArticle;
