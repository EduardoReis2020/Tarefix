import React from "react";

const Footer = () => {
    return (
            <footer className="border-t w-full border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center text-gray-600 text-1xl">
                    <p>&copy; {new Date().getFullYear()} Tarefix. Todos os direitos reservados.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="/sobre" className="hover:text-black transition">Sobre</a>
                        <a href="/contato" className="hover:text-black transition">Contato</a>
                        <a href="/politica" className="hover:text-black transition">Política de Privacidade</a>
                    </div>
                </div>
            </footer>
    );
};

export default Footer;
