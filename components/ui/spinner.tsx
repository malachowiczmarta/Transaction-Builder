import { cn } from '@/utils/utils';
import { Loader2, type LucideProps } from 'lucide-react';

const Spinner = ({ className, ...props }: LucideProps) => {
  return <Loader2 {...props} color="rgb(156 163 175)" className={cn('animate-spin', className)} />;
};

export default Spinner;
