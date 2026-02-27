import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';

const Inquiry = () => {
	const device = useDeviceDetect();
	const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

	const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
	const handleSubmit = () => {
		console.log('Inquiry submitted:', form);
		setForm({ name: '', email: '', subject: '', message: '' });
	};

	if (device === 'mobile') return <div>INQUIRY MOBILE</div>;

	return (
		<Stack className={'inquiry-content'}>
			<Stack className={'inquiry-info'}>
				<span className={'section-label'}>GET IN TOUCH</span>
				<h3 className={'inquiry-title'}>We'd Love to Hear From You</h3>
				<p className={'inquiry-desc'}>
					Have a question about an order, an event, or want to become an agent? Send us a message and we'll get back to
					you within 24 hours.
				</p>
				<Stack className={'contact-items'}>
					{[
						{ icon: <EmailIcon />, label: 'Email', value: 'support@fairway.com' },
						{ icon: <PhoneIcon />, label: 'Phone', value: '+82 10-1234-5678' },
						{ icon: <LocationOnIcon />, label: 'Location', value: 'Busan, South Korea' },
						{ icon: <AccessTimeIcon />, label: 'Hours', value: 'Mon–Fri, 9AM–6PM KST' },
					].map((item, i) => (
						<Stack key={i} className={'contact-item'}>
							<Box className={'contact-icon'}>{item.icon}</Box>
							<Stack className={'contact-text'}>
								<span className={'contact-label'}>{item.label}</span>
								<span className={'contact-value'}>{item.value}</span>
							</Stack>
						</Stack>
					))}
				</Stack>
			</Stack>

			<Stack className={'inquiry-form'}>
				<Stack className={'form-row'}>
					<Stack className={'input-wrap'}>
						<label>Your Name</label>
						<input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
					</Stack>
					<Stack className={'input-wrap'}>
						<label>Email Address</label>
						<input name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
					</Stack>
				</Stack>
				<Stack className={'input-wrap'}>
					<label>Subject</label>
					<input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" />
				</Stack>
				<Stack className={'input-wrap'}>
					<label>Message</label>
					<textarea
						name="message"
						value={form.message}
						onChange={handleChange}
						placeholder="Tell us more about your inquiry..."
						rows={6}
					/>
				</Stack>
				<Box className={'submit-btn'} onClick={handleSubmit}>
					<SendIcon />
					Send Message
				</Box>
			</Stack>
		</Stack>
	);
};

export default Inquiry;
