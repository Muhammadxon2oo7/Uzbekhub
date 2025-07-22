'use client';
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
	{
		question: "Как отправить жалобу или предложение?",
		answer: "Заполните форму ниже, выберите тип обращения и опишите вашу ситуацию. Мы рассмотрим ваше сообщение в ближайшее время.",
	},
	{
		question: "Сколько времени занимает обработка обращения?",
		answer: "Обычно мы отвечаем в течение 1-2 рабочих дней.",
	},
	{
		question: "Могу ли я отправить благодарность?",
		answer: "Да! Мы всегда рады получать положительные отзывы и благодарности.",
	},
	{
		question: "Как задать вопрос по работе сайта?",
		answer: "Вы можете выбрать тип обращения 'Вопрос' и описать свой вопрос в форме ниже.",
	},
];

const HelpPage = () => {
	const [type, setType] = useState("Жалоба");
	const [message, setMessage] = useState("");
	const [email, setEmail] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Здесь можно добавить отправку данных на сервер
		// alert("Ваше сообщение отправлено!");
		setType("Жалоба");
		setMessage("");
		setEmail("");
	};

	return (
		<div className="min-h-screen bg-radial-[at_50%_60%] from-[var(--bggradient)] via-[var(--bggradientmid)] to-[var(--bgbradientstart)] to-90% py-10 px-2 flex flex-col items-center">
			<div className="w-full max-w-xl mx-auto">
				
			</div>
		</div>
	);
};

export default HelpPage;