import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [input, setInput] = useState({ nick: '', password: '', phone: '', email: '', type: 'USER' });
	const [loginView, setLoginView] = useState<boolean>(true);
	const [showPassword, setShowPassword] = useState<boolean>(false);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
		setShowPassword(false);
	};

	const checkUserTypeHandler = (e: any) => {
		const checked = e.target.checked;
		if (checked) {
			const value = e.target.name;
			handleInput('type', value);
		} else {
			handleInput('type', 'USER');
		}
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doLogin = useCallback(async () => {
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const doSignUp = useCallback(async () => {
		try {
			await signUp(input.nick, input.password, input.phone, input.type, input.email);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	if (device === 'mobile') {
		return <div>LOGIN MOBILE</div>;
	} else {
		return (
			<Stack className={'join-page'}>
				<Stack className={'container'}>
					<Stack className={'main'}>
						<Stack className={'left-image'}>
							<Box className={'image-overlay'}>
								<Box className={'brand-section'}>
									<h1 className={'brand-name'}>FAIRWAY</h1>
								</Box>
							</Box>
						</Stack>

						{/* RIGHT SIDE - FORM */}
						<Stack className={'right-form'}>
							<Box className={'form-wrapper'}>
								{/* Header */}
								<Box className={'header'}>
									<h1 className={'title'}>{loginView ? 'WELCOME' : 'JOIN US'}</h1>
									<p className={'subtitle'}>
										{loginView
											? 'Enter your credentials to access your account'
											: 'Create an account to discover premium golf equipment'}
									</p>
								</Box>

								{/* Form */}
								<Box className={'form-content'}>
									{/* Nickname */}
									<Box className={'input-field'}>
										<label>Nickname</label>
										<input
											type="text"
											value={input.nick}
											onChange={(e) => handleInput('nick', e.target.value)}
											onKeyDown={(event) => {
												if (event.key === 'Enter' && loginView) doLogin();
												if (event.key === 'Enter' && !loginView) doSignUp();
											}}
										/>
									</Box>
									{/* Password */}
									<Box className={'input-field'}>
										<label>Password</label>
										<Box className={'password-wrapper'}>
											<input
												type={showPassword ? 'text' : 'password'}
												value={input.password}
												onChange={(e) => handleInput('password', e.target.value)}
												onKeyDown={(event) => {
													if (event.key === 'Enter' && loginView) doLogin();
													if (event.key === 'Enter' && !loginView) doSignUp();
												}}
											/>
											<span className={'toggle-password'} onClick={() => setShowPassword(!showPassword)}>
												{showPassword ? 'HIDE' : 'SHOW'}
											</span>
										</Box>
									</Box>

									{!loginView && (
										<>
											<Box className={'input-field fade-in'}>
												<label>Phone Number</label>
												<input
													type="text"
													value={input.phone}
													onChange={(e) => handleInput('phone', e.target.value)}
													onKeyDown={(event) => {
														if (event.key === 'Enter') doSignUp();
													}}
												/>
											</Box>

											<Box className={'input-field fade-in'}>
												<label>Email (Optional)</label>
												<input
													type="email"
													value={input.email || ''}
													onChange={(e) => handleInput('email', e.target.value)}
													onKeyDown={(event) => {
														if (event.key === 'Enter') doSignUp();
													}}
												/>
											</Box>
										</>
									)}
									{/* User Type (Signup only) */}
									{!loginView && (
										<Box className={'user-type-section fade-in'}>
											<label className={'type-label'}>Register as</label>
											<Box className={'type-options'}>
												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																name={'USER'}
																onChange={checkUserTypeHandler}
																checked={input?.type === 'USER'}
																sx={{
																	color: '#000',
																	'&.Mui-checked': { color: '#000' },
																}}
															/>
														}
														label="User"
													/>
												</FormGroup>
												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																name={'AGENT'}
																onChange={checkUserTypeHandler}
																checked={input?.type === 'AGENT'}
																sx={{
																	color: '#000',
																	'&.Mui-checked': { color: '#000' },
																}}
															/>
														}
														label="Agent"
													/>
												</FormGroup>
											</Box>
										</Box>
									)}
									{/* Remember Me / Forgot Password (Login only) */}
									{loginView && (
										<Box className={'login-options'}>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															defaultChecked
															sx={{
																color: '#000',
																'&.Mui-checked': { color: '#000' },
															}}
														/>
													}
													label="Remember me"
												/>
											</FormGroup>
											<a className={'forgot-link'}>Forgot password?</a>
										</Box>
									)}
									{/* Submit Button */}
									<Box className={'button-wrapper'}>
										{loginView ? (
											<Button
												className={'submit-button'}
												disabled={input.nick === '' || input.password === ''}
												onClick={doLogin}
												fullWidth
											>
												SIGN IN
											</Button>
										) : (
											<Button
												className={'submit-button'}
												disabled={input.nick === '' || input.password === '' || input.phone === ''}
												onClick={doSignUp}
												fullWidth
											>
												CREATE ACCOUNT
											</Button>
										)}
									</Box>
									{/* Toggle View */}
									<Box className={'toggle-view'}>
										{loginView ? (
											<p>
												Don't have an account? <span onClick={() => viewChangeHandler(false)}>Sign up</span>
											</p>
										) : (
											<p>
												Already have an account? <span onClick={() => viewChangeHandler(true)}>Sign in</span>
											</p>
										)}
									</Box>
								</Box>
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(Join);
