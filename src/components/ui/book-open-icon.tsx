import { LucideProps } from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes } from 'react'

interface BookOpenIconProps extends LucideProps {
  Component: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

const BookOpenIcon = ({ Component, ...props }: BookOpenIconProps) => <Component {...props} />;

export default BookOpenIcon;
