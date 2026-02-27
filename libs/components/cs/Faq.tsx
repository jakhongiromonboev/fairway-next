import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import PeopleIcon from '@mui/icons-material/People';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	() => ({
		border: `1px solid #e5e7eb`,
		'&:not(:last-child)': { borderBottom: 0 },
		'&:before': { display: 'none' },
	}),
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />} {...props} />
))(() => ({
	backgroundColor: '#ffffff',
	padding: '0 24px',
	minHeight: '60px',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': { transform: 'rotate(180deg)' },
	'& .MuiAccordionSummary-content': { margin: '16px 0' },
}));

const Faq = () => {
	const device = useDeviceDetect();
	const [category, setCategory] = useState<string>('equipment');
	const [expanded, setExpanded] = useState<string | false>('panel1');

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const categories = [
		{ key: 'equipment', label: 'Equipment', icon: <GolfCourseIcon /> },
		{ key: 'payment', label: 'Payment', icon: <PaymentIcon /> },
		{ key: 'buyers', label: 'For Buyers', icon: <PersonIcon /> },
		{ key: 'agents', label: 'For Agents', icon: <StorefrontIcon /> },
		{ key: 'membership', label: 'Membership', icon: <CardMembershipIcon /> },
		{ key: 'community', label: 'Community', icon: <PeopleIcon /> },
		{ key: 'other', label: 'Other', icon: <MoreHorizIcon /> },
	];

	const data: any = {
		equipment: [
			{
				id: 'eq1',
				subject: 'Are the products on Fairway authentic and verified?',
				content:
					'Yes! Every product listed on Fairway is verified by our team. All agents must go through a verification process before listing products.',
			},
			{
				id: 'eq2',
				subject: 'What golf equipment categories do you offer?',
				content: 'We offer clubs, balls, bags, clothing, shoes, accessories, and golf carts from top global brands.',
			},
			{
				id: 'eq3',
				subject: 'Can I return a product if it does not meet my expectations?',
				content:
					'Returns are handled directly with the agent/pro shop. Each shop has its own return policy displayed on their store page.',
			},
			{
				id: 'eq4',
				subject: 'How do I know which club is right for me?',
				content:
					'You can consult with our verified agents who are certified golf professionals, or join one of our tutorial events.',
			},
			{
				id: 'eq5',
				subject: 'Do agents offer custom fitting services?',
				content:
					"Yes, many of our pro shop agents offer custom fitting. Check the agent's store page for available services.",
			},
		],
		payment: [
			{
				id: 'pay1',
				subject: 'How do I make a payment on Fairway?',
				content:
					"Payments are processed through the agent's store. Contact the agent directly after adding items to your interest list.",
			},
			{
				id: 'pay2',
				subject: 'Is my payment information secure?',
				content: 'Yes, Fairway uses industry-standard encryption to protect all user data and payment information.',
			},
			{
				id: 'pay3',
				subject: 'Are there any additional fees?',
				content:
					'Fairway does not charge buyers any platform fees. Agents pay a small commission on successful transactions.',
			},
			{
				id: 'pay4',
				subject: 'Do you offer refunds?',
				content:
					"Refund policies vary per agent. Please check the store's refund policy or contact the agent directly.",
			},
		],
		buyers: [
			{
				id: 'buy1',
				subject: 'How do I purchase equipment on Fairway?',
				content:
					'Browse products, favorite items you like, and contact the agent directly through their store page to complete a purchase.',
			},
			{
				id: 'buy2',
				subject: 'Can I reserve a spot at an event?',
				content:
					'Yes! On any event page, select your preferred date and time slot, choose the number of participants, and confirm your reservation.',
			},
			{
				id: 'buy3',
				subject: 'How do I follow a pro shop or agent?',
				content:
					"Visit the agent's profile page and click the Follow button. You'll see their latest products and events in your feed.",
			},
			{
				id: 'buy4',
				subject: 'Can I cancel an event reservation?',
				content:
					'Cancellation policies vary per event. Please contact the agent who created the event for cancellation assistance.',
			},
		],
		agents: [
			{
				id: 'ag1',
				subject: 'How do I become an agent on Fairway?',
				content:
					'Register an account, select Agent as your member type, and complete your store profile. Our admin team will verify your store before activation.',
			},
			{
				id: 'ag2',
				subject: 'What can I do as an agent?',
				content:
					'As a verified agent you can list products for sale, create and manage events, and build a following in the Fairway community.',
			},
			{
				id: 'ag3',
				subject: 'Do I need to complete my store profile before listing products?',
				content:
					'Yes, your store profile must be complete (store name, location, address) before you can create products or events.',
			},
			{
				id: 'ag4',
				subject: 'How do I manage event capacity?',
				content:
					"When creating an event, you can set capacity per date and time slot. Reservations are tracked automatically and you'll see real-time booking data.",
			},
		],
		membership: [
			{
				id: 'mem1',
				subject: 'Is Fairway free to use?',
				content: 'Yes, creating an account and browsing Fairway is completely free for all users.',
			},
			{
				id: 'mem2',
				subject: 'Are there premium membership plans?',
				content:
					'Premium membership features are coming soon! Stay tuned for exclusive benefits for power users and top agents.',
			},
			{
				id: 'mem3',
				subject: 'How do I upgrade my account type?',
				content: 'To become an agent, contact our admin team through the CS inquiry form with your store details.',
			},
		],
		community: [
			{
				id: 'com1',
				subject: 'How do I post an article in the community?',
				content:
					'Navigate to the Community section and click Write Article. You can write, format, and publish articles for the Fairway community.',
			},
			{
				id: 'com2',
				subject: 'What content is allowed in the community?',
				content:
					'Golf-related content including tips, reviews, tournament recaps, and equipment recommendations. Spam, abuse, and off-topic content will be removed.',
			},
			{
				id: 'com3',
				subject: 'What should I do if I encounter abusive behavior?',
				content:
					'Report the content immediately using the report button, or contact our admin team through the CS inquiry form.',
			},
			{
				id: 'com4',
				subject: "Can I comment on other users' articles?",
				content:
					'Yes! Engage with the community by leaving comments on articles. Keep discussions respectful and golf-focused.',
			},
		],
		other: [
			{
				id: 'oth1',
				subject: 'How do I contact Fairway support?',
				content: 'Use the Contact Us tab on this page to send a direct inquiry. Our team responds within 24 hours.',
			},
			{
				id: 'oth2',
				subject: 'Is Fairway available outside of Korea?',
				content: 'Currently Fairway is focused on the Korean market, but we have plans to expand across Asia.',
			},
			{
				id: 'oth3',
				subject: 'Can I suggest new features?',
				content: 'Absolutely! We love feedback from our community. Send your suggestions through the Contact Us form.',
			},
		],
	};

	if (device === 'mobile') return <div>FAQ MOBILE</div>;

	return (
		<Stack className={'faq-content'}>
			<Stack className={'faq-categories'}>
				{categories.map((cat) => (
					<Stack
						key={cat.key}
						className={`faq-cat ${category === cat.key ? 'active' : ''}`}
						onClick={() => setCategory(cat.key)}
					>
						{cat.icon}
						<span>{cat.label}</span>
					</Stack>
				))}
			</Stack>
			<Box className={'faq-list'}>
				{data[category]?.map((ele: any) => (
					<Accordion expanded={expanded === ele.id} onChange={handleChange(ele.id)} key={ele.id}>
						<AccordionSummary>
							<Stack className={'q-row'}>
								<Box className={'q-badge'}>Q</Box>
								<Typography className={'q-text'}>{ele.subject}</Typography>
							</Stack>
						</AccordionSummary>
						<AccordionDetails>
							<Stack className={'a-row'}>
								<Box className={'a-badge'}>A</Box>
								<Typography className={'a-text'}>{ele.content}</Typography>
							</Stack>
						</AccordionDetails>
					</Accordion>
				))}
			</Box>
		</Stack>
	);
};

export default Faq;
