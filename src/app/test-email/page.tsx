'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    error?: string;
    config?: Record<string, string>;
  } | null>(null);

  const testEmail = async () => {
    if (!email) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({
        success: false,
        error: 'Erro de conexão',
        message: 'Falha na requisição'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🧪 Teste de Configuração de Email
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email para teste:
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                disabled={loading}
              />
            </div>

            <Button 
              onClick={testEmail}
              disabled={!email || loading}
              className="w-full"
            >
              {loading ? 'Enviando...' : 'Enviar Email de Teste'}
            </Button>
          </div>

          {result && (
            <div className="mt-6 space-y-4">
              <Alert
                type={result.success ? 'success' : 'error'}
                title={result.success ? 'Sucesso!' : 'Erro'}
                message={result.message}
              />

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Detalhes:</h3>
                <pre className="text-xs text-gray-600 overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>

              {!result.success && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Como configurar o email:
                  </h4>
                  <ol className="text-sm text-yellow-700 space-y-1">
                    <li>1. Configure as variáveis no arquivo .env</li>
                    <li>2. Para Gmail: ative verificação em 2 etapas</li>
                    <li>3. Gere uma senha de app específica</li>
                    <li>4. Reinicie o servidor com npm run dev</li>
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            ⚙️ Exemplo de Configuração (.env)
          </h2>
          <pre className="bg-gray-50 rounded p-4 text-sm text-gray-600 overflow-auto">
{`# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seuemail@gmail.com"
SMTP_PASS="suasenhadoapp"
FROM_EMAIL="Tarefix <noreply@tarefix.com>"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"`}
          </pre>
        </div>
      </div>
    </div>
  );
}
