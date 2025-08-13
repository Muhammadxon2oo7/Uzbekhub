'use client';
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation("help");
	const [type, setType] = useState("question");
	const [message, setMessage] = useState("");
	const [email, setEmail] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Здесь можно добавить отправку данных на сервер
		// alert("Ваше сообщение отправлено!");
		setType("question");
		setMessage("");
		setEmail("");
		console.log("Type:", type);
		console.log("Message:", message);
		console.log("Email:", email);
		toast("Ваше сообщение успешно отправлено!",{
		description: message.slice(0, 18) + "...",
		duration: 3000,
		position: "bottom-left",
		style: {
			backgroundColor: "#1a202c",
			color: "#fff",
		},
		})
	};

	return (
		<div className="min-h-screen bg-radial-[at_50%_60%] from-[var(--bggradient)] via-[var(--bggradientmid)] to-[var(--bgbradientstart)] to-90% py-10 px-2 flex flex-col items-center">
			<div className="w-full max-w-xl mx-auto">
				<Card className="mb-10 bg-[var(--card-bg-gray)] backdrop-blur-lg border-1 border-white shadow-xl">
					<CardHeader>
						<CardTitle className="text-2xl text-primary text-center">
							{t("title")}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="space-y-4" onSubmit={handleSubmit}>
							<div>
								<label
									htmlFor="type"
									className="block text-primary font-semibold mb-1"
								>
									{t("reason")}
								</label>
								{/* <select
									id="type"
									value={type}
									onChange={(e) => setType(e.target.value)}
									className="w-full rounded-lg border border-primary bg-white/80 text-primary px-3 py-2 focus:outline-none"
								>
									<option>Жалоба</option>
									<option>Предложение</option>
									<option>Благодарность</option>
									<option>Вопрос</option>
								</select> */}
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full rounded-lg border border-primary bg-white/80 text-primary px-3 py-2 focus:outline-none">
                    <SelectValue placeholder="Выберите тип обращения" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Тип обращения</SelectLabel>
                      <SelectItem value="question">{t("reasons.question")}</SelectItem>
                      <SelectItem value="suggestion">{t("reasons.suggestion")}</SelectItem>
                      <SelectItem value="bug">{t("reasons.bug")}</SelectItem>
                      <SelectItem value="other">{t("reasons.other")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
							</div>
							<div>
								<label
									htmlFor="message"
									className="block text-primary font-semibold mb-1"
								>
									{t("message")}
								</label>
								<Textarea
									id="message"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder={t("message_placeholder")}
									className="w-full min-h-[100px] rounded-lg border border-primary bg-white/80 text-primary px-3 py-2 focus:outline-none"
									required
								/>
							</div>
							<div>
								<label
									htmlFor="email"
									className="block text-primary font-semibold mb-1"
								>
									{t("email")}
								</label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="example@mail.com"
									className="w-full rounded-lg border border-primary bg-white/80 text-primary px-3 py-2 focus:outline-none"
								/>
							</div>
							<Button
								type="submit"
								className="w-full bg-primary text-white hover:bg-primary/80 transition"
							>
								{t("send")}
							</Button>
						</form>
					</CardContent>
				</Card>
        <Card className="bg-[var(--card-bg-gray)] backdrop-blur-lg border-1 border-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-primary text-center">
              {}{t("faq_title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-lg text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-gray-200">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
			</div>
		</div>
	);
};

export default HelpPage;