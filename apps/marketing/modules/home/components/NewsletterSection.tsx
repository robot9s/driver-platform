import {
	marketing_newsletter_email,
	marketing_newsletter_hints_error_message,
	marketing_newsletter_hints_success_message,
	marketing_newsletter_hints_success_title,
	marketing_newsletter_submit,
	marketing_newsletter_subtitle,
	marketing_newsletter_title,
} from "@repo/i18n/paraglide/messages.js";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import { formatFormRootError } from "@repo/ui/components/form-root-error";
import { Input } from "@repo/ui/components/input";
import { useForm, useStore } from "@tanstack/react-form";
import { CheckCircleIcon, KeyIcon } from "lucide-react";
import * as z from "zod";

const formSchema = z.object({
	email: z.email(),
});

function firstFieldError(errors: unknown[]): string | undefined {
	if (!errors.length) {
		return undefined;
	}
	const first = errors[0];
	if (typeof first === "string") {
		return first;
	}
	if (first && typeof first === "object" && "message" in first) {
		const m = (first as { message?: unknown }).message;
		if (typeof m === "string") {
			return m;
		}
	}
	return String(first);
}

export function NewsletterSection() {
	const form = useForm({
		defaultValues: { email: "" },
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ formApi }) => {
			try {
				// TODO: Insert your newsletter signup logic here to integrate with
				// your CRM or email service.
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} catch {
				formApi.setErrorMap({
					onSubmit: {
						form: marketing_newsletter_hints_error_message(),
						fields: {},
					},
				});
			}
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);
	const isSubmitSuccessful = useStore(form.store, (s) => s.isSubmitSuccessful);
	const formErrors = useStore(form.store, (s) => s.errors);
	const rootError = formatFormRootError(formErrors);

	return (
		<section className="py-12 lg:py-16 bg-muted">
			<div className="max-w-3xl container mx-auto">
				<div className="mb-8 text-center">
					<KeyIcon className="mb-3 size-10 mx-auto text-primary" />
					<h1 className="font-medium text-lg md:text-xl lg:text-2xl xl:text-3xl leading-tighter text-foreground">
						{marketing_newsletter_title()}
					</h1>
					<p className="mt-2 text-sm sm:text-base text-foreground/60">
						{marketing_newsletter_subtitle()}
					</p>
				</div>

				<div className="max-w-lg mx-auto flex flex-col items-center">
					{isSubmitSuccessful ? (
						<Alert variant="success">
							<CheckCircleIcon />
							<AlertTitle>{marketing_newsletter_hints_success_title()}</AlertTitle>
							<AlertDescription>
								{marketing_newsletter_hints_success_message()}
							</AlertDescription>
						</Alert>
					) : (
						<form
							className="max-w-md mx-auto w-full"
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								void form.handleSubmit();
							}}
						>
							<form.Field name="email">
								{(field) => {
									const fieldError = firstFieldError(field.state.meta.errors);
									const displayError = rootError ?? fieldError;
									return (
										<>
											<div className="sm:flex-row sm:items-center gap-2 flex flex-col items-stretch justify-center">
												<Input
													type="email"
													autoComplete="email"
													required
													placeholder={marketing_newsletter_email()}
													className="rounded-full"
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) =>
														field.handleChange(e.target.value)
													}
												/>

												<Button
													type="submit"
													variant="primary"
													loading={isSubmitting}
												>
													{marketing_newsletter_submit()}
												</Button>
											</div>
											{displayError ? (
												<p className="mt-1 text-xs text-destructive">
													{displayError}
												</p>
											) : null}
										</>
									);
								}}
							</form.Field>
						</form>
					)}
				</div>
			</div>
		</section>
	);
}
