import React, { useRef, useState, useEffect } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { Editor } from '@toast-ui/react-editor';
import { getJwtToken } from '../../auth';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useMutation } from '@apollo/client';
import { CREATE_BOARD_ARTICLE, UPDATE_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

const CATEGORIES = Object.values(BoardArticleCategory);

const TuiEditor = () => {
	const editorRef = useRef<Editor>(null);
	const token = getJwtToken();
	const router = useRouter();
	const { articleId } = router.query;
	const isEdit = !!articleId;

	const [mounted, setMounted] = useState<boolean>(false);
	const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(BoardArticleCategory.GENERAL);
	const [articleTitle, setArticleTitle] = useState<string>('');
	const [articleImage, setArticleImage] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

	/** APOLLO **/
	const [createBoardArticle] = useMutation(CREATE_BOARD_ARTICLE);
	const [updateBoardArticle] = useMutation(UPDATE_BOARD_ARTICLE);

	/** LIFECYCLES **/
	useEffect(() => {
		setMounted(true);
	}, []);

	/** HANDLERS **/

	const uploadEditorImage = async (image: any) => {
		try {
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
					}`,
					variables: { file: null, target: 'article' },
				}),
			);
			formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			console.log('+editorImage:', responseImage);
			return responseImage;
		} catch (err) {
			console.log('Error, uploadEditorImage:', err);
		}
	};

	const uploadCoverImage = async (e: any) => {
		try {
			const image = e.target.files[0];
			if (!image) return;

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
					}`,
					variables: { file: null, target: 'article' },
				}),
			);
			formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			console.log('+coverImage:', responseImage);
			setArticleImage(responseImage);
		} catch (err) {
			console.log('Error, uploadCoverImage:', err);
		}
	};

	const onEmojiClick = (emojiData: EmojiClickData) => {
		const editor = editorRef.current?.getInstance();
		if (editor) {
			editor.insertText(emojiData.emoji);
		}
		setShowEmojiPicker(false);
	};

	const doDisabledCheck = () => {
		if (articleTitle === '' || !articleCategory) return true;
		return false;
	};

	const submitHandler = async () => {
		try {
			setLoading(true);

			const articleContent = editorRef.current?.getInstance().getMarkdown() || '';

			if (!articleContent || articleContent.trim() === '') {
				alert('Please write some content!');
				return;
			}

			const input = {
				articleCategory,
				articleTitle,
				articleContent,
				articleImage,
			};

			if (isEdit) {
				await updateBoardArticle({
					variables: { input: { _id: articleId, ...input } },
				});
				await sweetTopSmallSuccessAlert('Article updated!', 800);
			} else {
				await createBoardArticle({ variables: { input } });
				await sweetTopSmallSuccessAlert('Article published!', 800);
			}

			await router.push('/mypage?category=myArticles');
		} catch (err: any) {
			await sweetErrorHandling(err);
		} finally {
			setLoading(false);
		}
	};

	if (!mounted) return null;

	return (
		<Stack id="tui-editor-wrap">
			<Stack className="editor-controls">
				<Stack className="control-group">
					<Typography className="control-label">Category *</Typography>
					<Stack className="category-tabs">
						{CATEGORIES.map((cat) => (
							<Box
								key={cat}
								className={`category-tab ${articleCategory === cat ? 'active' : ''}`}
								onClick={() => setArticleCategory(cat)}
							>
								{cat}
							</Box>
						))}
					</Stack>
				</Stack>

				<Stack className="control-group">
					<Typography className="control-label">Title *</Typography>
					<input
						className="title-input"
						type="text"
						placeholder="Enter article title (3-50 characters)"
						value={articleTitle}
						onChange={(e) => setArticleTitle(e.target.value)}
					/>
				</Stack>

				<Stack className="control-group">
					<Typography className="control-label">Cover Image</Typography>
					<Stack className="cover-image-box">
						<input
							type="file"
							hidden
							id="cover-image-input"
							onChange={uploadCoverImage}
							accept="image/jpg, image/jpeg, image/png"
						/>
						{articleImage ? (
							<Box className="cover-preview">
								<img src={articleImage} alt="cover" />
								<Box className="cover-overlay" onClick={() => document.getElementById('cover-image-input')?.click()}>
									<CameraAltOutlinedIcon />
									<Typography>Change Cover</Typography>
								</Box>
							</Box>
						) : (
							<Box className="cover-placeholder" onClick={() => document.getElementById('cover-image-input')?.click()}>
								<CameraAltOutlinedIcon />
								<Typography>Add Cover Image</Typography>
								<span>JPG, JPEG or PNG</span>
							</Box>
						)}
					</Stack>
				</Stack>
			</Stack>

			<Stack className="emoji-toolbar">
				<Box className="emoji-btn" onClick={() => setShowEmojiPicker((prev) => !prev)}>
					<SentimentSatisfiedAltIcon />
					<Typography>Emoji</Typography>
				</Box>

				{showEmojiPicker && (
					<Box className="emoji-picker-wrap">
						<EmojiPicker
							onEmojiClick={onEmojiClick}
							searchDisabled={false}
							skinTonesDisabled
							height={400}
							width={320}
						/>
					</Box>
				)}
			</Stack>

			<Stack className="editor-wrap">
				<Editor
					initialValue={' '}
					placeholder={'Write your article content here...'}
					previewStyle={'vertical'}
					height={'460px'}
					// @ts-ignore
					initialEditType={'wysiwyg'}
					useCommandShortcut={true}
					toolbarItems={[
						['heading', 'bold', 'italic', 'strike'],
						['image', 'table', 'link'],
						['ul', 'ol', 'task'],
					]}
					ref={editorRef}
					hooks={{
						addImageBlobHook: async (image: any, callback: any) => {
							const uploadedImageURL = await uploadEditorImage(image);
							callback(uploadedImageURL);
							return false;
						},
					}}
				/>
			</Stack>

			<Stack className="editor-footer">
				<Box className="cancel-btn" onClick={() => router.push('/mypage?category=myArticles')}>
					Cancel
				</Box>
				<Box
					className={`submit-btn ${doDisabledCheck() || loading ? 'disabled' : ''}`}
					onClick={!doDisabledCheck() && !loading ? submitHandler : undefined}
				>
					{loading ? 'Publishing...' : isEdit ? 'Update Article' : 'Publish Article'}
				</Box>
			</Stack>
		</Stack>
	);
};

export default TuiEditor;
