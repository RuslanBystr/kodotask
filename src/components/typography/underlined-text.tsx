import { cva, type VariantProps } from 'class-variance-authority';

const underlineVariants = cva('underline decoration-2 underline-offset-2', {
  variants: {
    variant: {
      primary: 'decoration-primary',
      accent: 'decoration-accent',
      muted: 'decoration-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export const UnderlinedText = ({
  children,
  variant,
}: { children: React.ReactNode } & VariantProps<typeof underlineVariants>) => (
  <span className={underlineVariants({ variant })}>{children}</span>
);
