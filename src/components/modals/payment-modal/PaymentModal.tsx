import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { DollarSign } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { getEnv } from '@/utils';

const { api } = getEnv();

export function PaymentModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState<number>(0);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (amount <= 0) {
        toast.error('Amount must be greater than zero.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${api}/payments/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const clientSecret = await response.json();

      if (!clientSecret.client_secret) toast.error('Failed to get client secret');

      const result = await stripe?.confirmCardPayment(clientSecret.client_secret, {
        payment_method: { card: elements!.getElement(CardElement)! },
      });

      if (result?.error) {
        toast.error(result.error.message);
      } else {
        setOpen(false);
        toast.success('Payment successful!');
      }
    } catch (err) {
      toast.error('Payment error');
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton className="rounded-none bg-transparent hover:bg-[#88aabb]" onClick={() => setOpen(true)}>
          <DollarSign />
          Support us
        </SidebarMenuButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] min-h-[200px] bg-[#374C53] rounded-none cut cut-left-15 cut-right-10">
        <DialogHeader>
          <DialogTitle>Support the Developer</DialogTitle>
          <DialogDescription>Are you sure you want to proceed with the payment?</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CardElement className="p-2 border rounded-md" />
          <Input
            type="number"
            placeholder="Amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Button
            type="submit"
            className="mt-5 w-full rounded-none bg-[--main-button] hover:bg-[--main-button-hover] cut cut-left-5 cut-right-5"
            variant="outline"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
