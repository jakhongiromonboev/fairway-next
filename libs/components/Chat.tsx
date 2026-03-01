import React, { useCallback, useEffect, useRef, useState } from 'react';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import GolfCourseRoundedIcon from '@mui/icons-material/GolfCourseRounded';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SportsGolfOutlinedIcon from '@mui/icons-material/SportsGolfOutlined';
import { useRouter } from 'next/router';

/** TYPES **/
interface Message {
	id: string;
	role: 'user' | 'assistant';
	text: string;
	loading?: boolean;
}

interface Suggestion {
	icon: React.ReactNode;
	label: string;
	text: string;
}

/** QUICK SUGGESTIONS **/
const SUGGESTIONS: Suggestion[] = [
	{ icon: <GolfCourseRoundedIcon />, label: 'Equipment', text: 'What clubs does a beginner need?' },
	{ icon: <EmojiEventsOutlinedIcon />, label: 'Events', text: 'How do I join an event on Fairway?' },
	{ icon: <SportsGolfOutlinedIcon />, label: 'Golf Tips', text: 'How do I improve my golf swing?' },
	{ icon: <PaymentOutlinedIcon />, label: 'Payments', text: 'How does payment work on Fairway?' },
	{ icon: <InfoOutlinedIcon />, label: 'Platform', text: 'How do I follow an agent on Fairway?' },
];

/** TYPING INDICATOR **/
const TypingIndicator = () => (
	<div className="birdie-typing">
		<span />
		<span />
		<span />
	</div>
);

/** MESSAGE BUBBLE **/
const MessageBubble = ({ msg }: { msg: Message }) => {
	if (msg.role === 'user') {
		return (
			<div className="birdie-msg birdie-msg--user">
				<div className="birdie-bubble birdie-bubble--user">{msg.text}</div>
			</div>
		);
	}
	return (
		<div className="birdie-msg birdie-msg--assistant">
			<div className="birdie-avatar">
				<AutoAwesomeRoundedIcon />
			</div>
			<div className="birdie-bubble birdie-bubble--assistant">{msg.loading ? <TypingIndicator /> : msg.text}</div>
		</div>
	);
};

/** MAIN COMPONENT **/
const Chat = () => {
	const router = useRouter();
	const chatContentRef = useRef<HTMLDivElement>(null);
	const textInputRef = useRef<HTMLInputElement>(null);

	const [messages, setMessages] = useState<Message[]>([
		{
			id: 'welcome',
			role: 'assistant',
			text: "Hi, I'm Birdie — your Fairway golf assistant. Ask me about equipment, events, payments, or anything golf.",
		},
	]);
	const [message, setMessage] = useState('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(true);

	/** LIFECYCLES **/
	useEffect(() => {
		const t = setTimeout(() => setOpenButton(true), 100);
		return () => clearTimeout(t);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	useEffect(() => {
		if (chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
		}
	}, [messages]);

	/** HANDLERS **/
	const handleOpenChat = () => {
		setOpen((prev) => !prev);
		if (!open) setTimeout(() => textInputRef.current?.focus(), 350);
	};

	const getInputMessageHandler = useCallback((e: any) => {
		setMessage(e.target.value);
	}, []);

	const getKeyHandler = (e: any) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage(message);
		}
	};

	const sendMessage = async (text: string) => {
		if (!text.trim() || isLoading) return;

		setShowSuggestions(false);

		const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: text.trim() };
		const loadingMsg: Message = { id: `l-${Date.now()}`, role: 'assistant', text: '', loading: true };

		setMessages((prev) => [...prev, userMsg, loadingMsg]);
		setMessage('');
		setIsLoading(true);

		try {
			/** APOLLO REQUESTS **/
			const response = await fetch('/api/birdie', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: text.trim(),
					history: messages.filter((m) => !m.loading).map((m) => ({ role: m.role, content: m.text })),
				}),
			});

			const data = await response.json();
			const replyText = data?.reply ?? 'Sorry, I could not process that. Please try again.';

			setMessages((prev) =>
				prev.map((m) =>
					m.loading ? { id: `a-${Date.now()}`, role: 'assistant' as const, text: replyText, loading: false } : m,
				),
			);
		} catch (err: any) {
			console.log('ERROR: Birdie AI', err.message);
			setMessages((prev) =>
				prev.map((m) =>
					m.loading
						? {
								id: `e-${Date.now()}`,
								role: 'assistant' as const,
								text: 'Something went wrong. Please try again.',
								loading: false,
						  }
						: m,
				),
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="birdie-wrap">
			{/** ── CHAT PANEL ── **/}
			{open && (
				<div className="birdie-panel">
					{/** HEADER **/}
					<div className="birdie-header">
						<div className="birdie-header__info">
							<div className="birdie-header__icon">
								<AutoAwesomeRoundedIcon />
							</div>
							<div className="birdie-header__text">
								<span className="birdie-header__name">Birdie AI</span>
								<span className="birdie-header__status">
									<span className="birdie-header__dot" />
									Online · Fairway Golf Assistant
								</span>
							</div>
						</div>
						<button className="birdie-header__close" onClick={handleOpenChat}>
							<CloseRoundedIcon />
						</button>
					</div>

					{/** MESSAGES **/}
					<div className="birdie-messages" ref={chatContentRef}>
						{messages.map((msg) => (
							<MessageBubble key={msg.id} msg={msg} />
						))}

						{showSuggestions && (
							<div className="birdie-suggestions">
								<span className="birdie-suggestions__label">Quick questions</span>
								<div className="birdie-suggestions__list">
									{SUGGESTIONS.map((s) => (
										<button key={s.label} className="birdie-suggestion-btn" onClick={() => sendMessage(s.text)}>
											{s.icon}
											{s.label}
										</button>
									))}
								</div>
							</div>
						)}
					</div>

					{/** INPUT **/}
					<div className="birdie-input-wrap">
						<div className="birdie-input-box">
							<input
								ref={textInputRef}
								type="text"
								value={message}
								onChange={getInputMessageHandler}
								onKeyDown={getKeyHandler}
								disabled={isLoading}
								placeholder="Ask Birdie anything golf..."
								className="birdie-input"
							/>
							<button
								className={`birdie-send ${message.trim() && !isLoading ? 'birdie-send--active' : ''}`}
								onClick={() => sendMessage(message)}
								disabled={!message.trim() || isLoading}
							>
								<SendRoundedIcon />
							</button>
						</div>
						<span className="birdie-input-footer">Powered by OpenAI · Fairway Golf Platform</span>
					</div>
				</div>
			)}

			{/** ── FLOATING BUTTON ── **/}
			{openButton && (
				<button className={`birdie-btn ${open ? 'birdie-btn--open' : ''}`} onClick={handleOpenChat}>
					{open ? <CloseRoundedIcon /> : <AutoAwesomeRoundedIcon />}
				</button>
			)}
		</div>
	);
};

export default Chat;
