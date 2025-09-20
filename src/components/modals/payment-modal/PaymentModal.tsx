import { Banknote, Check } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { getEnv } from '@/utils';

const { api } = getEnv();

type PlanId = 'free' | 'pro' | 'professional';

const PLANS: Array<{
  id: PlanId;
  name: string;
  priceCents: number; // Stripe expects smallest currency unit
  priceLabel: string;
  description: string;
  features: string[];
  cta?: string;
}> = [
  {
    id: 'free',
    name: 'Free',
    priceCents: 0,
    priceLabel: '$0',
    description: 'Perfect for getting started with basic tasks.',
    features: ['Up to 3 projects', 'Up to 3 members per project', 'Basic messenger'],
    cta: 'Continue with Free',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceCents: 900,
    priceLabel: '$9',
    description: 'Best for freelancers and small teams.',
    features: ['Unlimited projects', 'Up to 10 team members', 'Priority messenger', 'Advanced analytics'],
  },
  {
    id: 'professional',
    name: 'Professional',
    priceCents: 1900,
    priceLabel: '$19',
    description: 'For teams that need scale and control.',
    features: [
      'Unlimited projects and members',
      'Roles and permissions',
      'Integrations (Slack, GitHub, Jira)',
      'Premium support',
    ],
  },
];

export function PaymentModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<PlanId>('free');
  const amount = useMemo(() => PLANS.find((p) => p.id === selectedPlan)!.priceCents, [selectedPlan]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      toast.success('Free plan selected. Continue with Free');
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${api}/payments/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const clientSecret = await response.json();

      if (!clientSecret?.client_secret) {
        toast.error('Failed to get client secret');
      } else {
        toast.success('Payment intent created');
      }
    } catch (err) {
      toast.error('Payment error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton
          className="rounded-none select-none bg-transparent hover:bg-[#88aabb]"
          onClick={() => setOpen(true)}
        >
          <Banknote />
          Billing
        </SidebarMenuButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[720px] bg-[--background] border-none rounded-none cut cut-left-10 cut-right-10">
        <DialogHeader>
          <DialogTitle>Select a plan</DialogTitle>
          <DialogDescription>Choose the plan that fits your workflow.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <Card
                  key={plan.id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => setSelectedPlan(plan.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedPlan(plan.id);
                    }
                  }}
                  className={[
                    'cursor-pointer transition-all border-none bg-[#465c70] rounded-none cut cut-left-5 cut-right-5',
                    isSelected ? 'ring-2 ring-[--main-button] shadow-lg' : 'hover:ring-1 hover:ring-[--border]',
                  ].join(' ')}
                >
                  <CardHeader className="space-y-1">
                    <CardTitle className="flex items-baseline justify-between">
                      <span>{plan.name}</span>
                      <span className="text-xl font-semibold">
                        {plan.priceLabel}
                        <span className="text-sm text-muted-foreground">/mo</span>
                      </span>
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      className={[
                        'w-full rounded-none border-none cut cut-left-3 cut-right-3',
                        isSelected ? 'bg-[--main-button] text[--main-button-text] hover:bg-[--main-button-hover]' : '',
                      ].join(' ')}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.cta ?? (isSelected ? 'Selected' : 'Choose')}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          <Button
            type="submit"
            className="mt-2 w-full rounded-none border-none bg-[--main-button] text[--main-button-text] hover:bg-[--main-button-hover] cut cut-left-5 cut-right-5"
            variant="outline"
            disabled={loading}
          >
            {/* eslint-disable-next-line no-nested-ternary */}
            {amount <= 0
              ? PLANS.find((p) => p.id === selectedPlan)?.cta ?? 'Continue'
              : loading
                ? 'Processing...'
                : `Pay ${PLANS.find((p) => p.id === selectedPlan)?.priceLabel}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
