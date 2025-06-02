import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, render, Section, Tailwind, Text } from "@react-email/components";

interface BetterAuthResetPasswordEmailProps {
	username?: string;
	resetLink?: string;
}

const ResetPasswordEmail = ({ username, resetLink }: BetterAuthResetPasswordEmailProps) => {
	const previewText = `Reset your password`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-white px-2 font-sans">
					<Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
						<Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
							Reset your <strong>Findr</strong> password
						</Heading>
						<Text className="text-[14px] leading-[24px] text-black">Hello {username},</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							We received a request to reset your password for your Better Auth account. If you didn't make this request, you can safely
							ignore this email.
						</Text>
						<Section className="mb-[32px] mt-[32px] text-left">
							<Button
								className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
								href={resetLink}
							>
								Reset Password
							</Button>
						</Section>
						<Text className="text-[14px] leading-[24px] text-black">
							Or copy and paste this URL into your browser:{" "}
							<Link href={resetLink} className="text-blue-600 no-underline">
								{resetLink}
							</Link>
						</Text>
						<Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
						<Text className="text-[12px] leading-[24px] text-[#666666]">
							If you didn't request a password reset, please ignore this email or contact support if you have concerns.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export async function reactResetPasswordEmail(props: BetterAuthResetPasswordEmailProps) {
	return await render(<ResetPasswordEmail {...props} />);
}
