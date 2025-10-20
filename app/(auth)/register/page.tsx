"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/componentes/Header/Header";
import Footer from "@/componentes/Footer/Footer";

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	function isValidPassword(pw: string) {
		return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		if (!isValidPassword(password)) {
			setPasswordError('A senha deve ter no mínimo 8 caracteres e conter pelo menos uma letra e um número');
			setLoading(false);
			return;
		}

		if (password !== confirmPassword) {
			const errorMessage = "As senhas não coincidem. Por favor, verifique e tente novamente.";
			setError(errorMessage);
			setLoading(false);
			return;
		}

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "Erro no registro");

			router.push("/login");
		} catch (err) {
			setError((err as Error).message || "Erro ao registrar");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
			<Header />
			<div className="flex flex-grow m-4 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
				<div className="w-full max-w-md items-center justify-center">
					<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center">
								<span className="text-white font-bold text-xl">T</span>
							</div>
							<div>
								<h1 className="text-2xl font-semibold text-gray-900">Criar conta</h1>
								<p className="text-sm text-gray-500">Registre-se no Tarefix</p>
							</div>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="text-sm font-medium text-gray-700">Nome</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200 text-black"
								/>
							</div>

							<div>
								<label className="text-sm font-medium text-gray-700">Email</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200 text-black"
								/>
							</div>

							<div>
								<label className="text-sm font-medium text-gray-700">Senha</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200 text-black"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
							</div>

							<div>
								<label className="text-sm font-medium text-gray-700">Confirmar Senha</label>
								<div className="relative">
									<input
										type={showConfirmPassword ? "text" : "password"}
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
										className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200 text-black"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
									>
										{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
							</div>

							{passwordError && <div className="text-sm text-red-600">{passwordError}</div>}

							{error && <div className="text-sm text-red-600">{error}</div>}

							<button
								type="submit"
								disabled={loading}
								className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 disabled:opacity-70"
								>
								{loading ? "Criando..." : "Criar conta"}
							</button>
						</form>

						<div className="mt-6 text-center text-sm text-gray-600">
							Já tem conta?{' '}
							<Link href="/login" className="text-gray-900 font-medium hover:underline">
							Entrar
							</Link>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

