import { Button, type ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function LoadingButton({ loading, children, disabled, ...props }: ButtonProps & { loading?: boolean }) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? <Spinner className="h-4 w-4" /> : null}
      {children}
    </Button>
  );
}
