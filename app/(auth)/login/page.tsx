"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/componentes/Header/Header";
import Footer from "@/componentes/Footer/Footer";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "Erro no login");

			if (data.token) localStorage.setItem("token", data.token);

			router.push("/dashboard");
		} catch (error) {
			setError((error as Error).message || "Erro ao efetuar login");
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
								<h1 className="text-2xl font-semibold text-gray-900">Entrar</h1>
								<p className="text-sm text-gray-500">Acesse sua conta Tarefix</p>
							</div>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
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

							{error && <div className="text-sm text-red-600">{error}</div>}

							<button
								type="submit"
								disabled={loading}
								className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 disabled:opacity-70"
								>
								{loading ? "Entrando..." : "Entrar"}
							</button>
						</form>

						<div className="mt-6 text-center text-sm text-gray-600">
							Ainda não tem conta?{' '}
							<Link href="/register" className="text-gray-900 font-medium hover:underline">
							Criar conta
							</Link>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

