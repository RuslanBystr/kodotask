import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CODE_LENGTH = 6;

export default function VerificationPage() {
  const [values, setValues] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const refs = useMemo(
    () => Array.from({ length: CODE_LENGTH }, () => ({ current: null as HTMLInputElement | null })),
    [],
  );

  useEffect(() => {
    refs[0].current?.focus();
  }, [refs]);

  const setAt = (idx: number, char: string) =>
    setValues((prev) => {
      const next = [...prev];
      next[idx] = char;
      return next;
    });

  const handleChange = (idx: number, raw: string) => {
    const value = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!value) {
      setAt(idx, '');
      return;
    }

    if (value.length > 1) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleBulkPaste(value, idx);
      return;
    }

    setAt(idx, value);
    if (idx < CODE_LENGTH - 1) refs[idx + 1].current?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;

    if (key === 'Backspace') {
      if (values[idx]) {
        // delete the current char
        setAt(idx, '');
      } else if (idx > 0) {
        // go back and clear previous
        refs[idx - 1].current?.focus();
        setAt(idx - 1, '');
      }
      e.preventDefault();
    }

    if (key === 'ArrowLeft' && idx > 0) {
      refs[idx - 1].current?.focus();
      e.preventDefault();
    }

    if (key === 'ArrowRight' && idx < CODE_LENGTH - 1) {
      refs[idx + 1].current?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (idx: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (!text) return;
    e.preventDefault();
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    handleBulkPaste(cleaned, idx);
  };

  const handleBulkPaste = (cleaned: string, startIdx: number) => {
    if (!cleaned) return;
    setValues((prev) => {
      const next = [...prev];
      let j = startIdx;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < cleaned.length && j < CODE_LENGTH; i++, j++) {
        next[j] = cleaned[i];
      }
      return next;
    });
    const nextFocus = Math.min(startIdx + cleaned.length, CODE_LENGTH - 1);
    refs[nextFocus].current?.focus();
  };

  const code = values.join('');
  const isComplete = code.length === CODE_LENGTH && values.every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      setError('Please enter the full 6-character code.');
      return;
    }
    setError('');

    // TODO: call your verification endpoint, e.g.:
    // await verifyCode(code)
    // Example success:
    navigate('/dashboard');
  };

  const handleResend = () => {
    // TODO: call resend endpoint
    // await resendVerification()
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md shadow-lg bg-transparent/40 border-none rounded-none cut cut-right-10 cut-left-10">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>Enter the 6-character code we sent to your email.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="code-0" className="mb-2 block">
                Verification Code
              </Label>

              <div className="flex items-center justify-between gap-2">
                {Array.from({ length: CODE_LENGTH }).map((_, idx) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={idx} className="relative">
                    <Input
                      id={`code-${idx}`}
                      ref={(el) => {
                        refs[idx].current = el;
                      }}
                      inputMode="text"
                      autoComplete="one-time-code"
                      className="w-10 h-12 text-center font-mono text-lg tracking-widest"
                      maxLength={1}
                      value={values[idx]}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={(e) => handlePaste(idx, e)}
                    />
                    {idx === 2 && (
                      <span className="absolute -right-3 top-1/2 -translate-y-1/2 select-none text-muted-foreground">
                        –
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <Button type="submit" className="w-full rounded-none" disabled={!isComplete}>
              Verify
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <p>Didn’t receive the code?</p>
          <button type="button" onClick={handleResend} className="text-primary hover:underline">
            Resend
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
